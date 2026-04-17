import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth/server";
import { NextResponse } from "next/server";

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
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
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

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!body.phone?.trim()) {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        phone: body.phone.trim(),
      },
    });

    if (existingCustomer) {
      return NextResponse.json(existingCustomer);
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name.trim(),
        email: body.email?.trim() || null,
        phone: body.phone.trim(),
        status: body.status ?? "regular",
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
