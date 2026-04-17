import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth/server";
import { NextResponse } from "next/server";

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    return NextResponse.json(formattedCustomers);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch customers",
        detail: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const name = body.name?.trim();
    const phone = normalizePhoneNumber(body.phone?.trim() ?? "");
    const email = body.email?.trim() || null;
    const status = body.status?.trim() || "regular";

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        phone,
      },
    });

    if (existingCustomer) {
      return NextResponse.json(existingCustomer, { status: 200 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        status,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/customers error:", error);

    return NextResponse.json(
      {
        error: "Failed to create customer",
        detail: message,
      },
      { status: 500 }
    );
  }
}
