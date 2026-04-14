import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {

    // Total Revenue
const revenue = await prisma.order.aggregate({
  _sum: {
    total: true,
  },
  where: {
    status: {
      in: ["ready", "completed"]
    }
  }
})

    // Total Orders
    const totalOrders = await prisma.order.count()

    // Customers
    const customers = await prisma.customer.count()

    // Recent Orders
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    })

    // 🔥 PIPELINE
    const pipeline = {
      sorting: await prisma.order.count({
        where: { status: "sorting" },
      }),
      washing: await prisma.order.count({
        where: { status: "washing" },
      }),
      ironing: await prisma.order.count({
        where: { status: "ironing" },
      }),
      ready: await prisma.order.count({
        where: { status: "ready" },
      }),
    }

    return NextResponse.json({
      stats: {
        totalRevenue: revenue._sum.total || 0,
        totalOrders,
        customers,
        pipeline,
      },
      orders,
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed fetch dashboard" },
      { status: 500 }
    )
  }
}