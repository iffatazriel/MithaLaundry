import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET Orders
export async function GET() {
  try {
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
    const body = await req.json()

    const order = await prisma.order.create({
      data: {
        customerId: body.customerId,
        services: body.services,
        payment: body.payment,
        itemCount: body.itemCount,
        deliveryDate: body.deliveryDate
          ? new Date(body.deliveryDate)
          : null,
        isExpress: body.isExpress,
        subtotal: body.subtotal,
        expressFee: body.expressFee,
        total: body.total,
      },
    })

    return NextResponse.json(order)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed create order" },
      { status: 500 }
    )
  }
}