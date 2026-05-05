import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { NextResponse } from 'next/server'
import { validateCreateOrderPayload } from '@/lib/orders/validation'

// GET Orders
export async function GET() {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed fetch orders" },
      { status: 500 }
    )
  }
}


// POST Orders
export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = validateCreateOrderPayload(body)

    if (!validation.ok) {
      return NextResponse.json(
        { error: 'Invalid order payload', details: validation.errors },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { id: validation.data.customerId },
      select: { id: true },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer tidak ditemukan.' },
        { status: 404 }
      )
    }

    const order = await prisma.order.create({
      data: {
        customerId: validation.data.customerId,
        status: 'sorting',
        services: validation.data.services,
        payment: validation.data.payment,
        paymentStatus: validation.data.payment === 'qris' ? 'unpaid' : 'paid',
        paymentProvider: validation.data.payment === 'qris' ? 'xendit' : 'cash',
        paidAt: validation.data.payment === 'qris' ? null : new Date(),
        itemCount: validation.data.itemCount,
        deliveryDate: validation.data.deliveryDate,
        isExpress: validation.data.isExpress,
        subtotal: validation.data.subtotal,
        expressFee: validation.data.expressFee,
        total: validation.data.total,
        statusHistory: {
          create: {
            toStatus: 'sorting',
            note: 'Order dibuat',
            changedBy: session.email,
          },
        },
      },
    })

    return NextResponse.json(order)

  } catch (error) {
    console.error("Create order error:", error)

    return NextResponse.json(
      {
        error: "Failed create order",
        detail:
          process.env.NODE_ENV === 'production'
            ? undefined
            : error instanceof Error
              ? error.message
              : String(error),
      },
      { status: 500 }
    )
  }
}
