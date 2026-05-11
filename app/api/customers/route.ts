import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth/server";
import { createLogger } from "@/lib/logger";
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
} from "@/lib/api-response";

const logger = createLogger("customers-api");

function normalizePhoneNumber(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  if (digitsOnly.startsWith("62")) {
    return digitsOnly;
  }

  return `62${digitsOnly.replace(/^0+/, "")}`;
}

export async function GET() {
  try {
    const session = await requireApiSession();

    if (!session) {
      logger.warn("Unauthorized GET /api/customers attempt");
      return unauthorizedResponse();
    }

    logger.info("Fetching all customers");

    const customers = await prisma.customer.findMany({
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedCustomers = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      totalOrders: customer._count.orders,
    }));

    logger.info({ count: customers.length }, "Customers fetched successfully");
    return successResponse(formattedCustomers, `${customers.length} customers retrieved`);
  } catch (error: unknown) {
    logger.error(error, "Failed to fetch customers");
    return errorResponse("Gagal mengambil data pelanggan", 500);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession();

    if (!session) {
      logger.warn("Unauthorized POST /api/customers attempt");
      return unauthorizedResponse();
    }

    const body = await req.json();
    logger.debug({ body }, "Creating new customer");

    const name = body.name?.trim();
    const phone = normalizePhoneNumber(body.phone?.trim() ?? "");
    const email = body.email?.trim() || null;
    const status = body.status?.trim() || "regular";

    const errors: string[] = [];

    if (!name) {
      errors.push("Nama pelanggan wajib diisi");
    }

    if (!phone) {
      errors.push("Nomor telepon wajib diisi");
    }

    if (errors.length > 0) {
      logger.warn({ errors }, "Customer validation failed");
      return validationErrorResponse(errors);
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        phone,
      },
    });

    if (existingCustomer) {
      logger.info(
        { customerId: existingCustomer.id, phone },
        "Customer already exists"
      );
      return successResponse(existingCustomer, "Pelanggan sudah terdaftar");
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        status,
      },
    });

    logger.info(
      { customerId: customer.id, name, phone },
      "Customer created successfully"
    );
    return createdResponse(customer, "Pelanggan berhasil dibuat");
  } catch (error: unknown) {
    logger.error(error, "Failed to create customer");
    return errorResponse("Gagal membuat pelanggan", 500);
  }
}
