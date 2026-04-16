import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {

    const today = new Date()
    today.setHours(0,0,0,0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const [
      revenueToday,
      revenueYesterday,
      activeOrders,
      activeInWashing,
      pendingPickups,
      expressDeliveries,
      sorting,
      washing,
      ironing,
      ready,
      orders
    ] = await Promise.all([

      // Revenue Today
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: today },
          status: { in: ["ready", "completed"] }
        }
      }),

      // Revenue Yesterday
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: yesterday,
            lt: today
          },
          status: { in: ["ready", "completed"] }
        }
      }),

      // Active Orders
      prisma.order.count({
        where: {
          status: {
            in: ["sorting", "washing", "ironing"]
          }
        }
      }),

      prisma.order.count({
        where: {
          status: "washing"
        }
      }),

      prisma.order.count({
        where: { status: "ready" }
      }),

      prisma.order.count({
        where: {
          isExpress: true
        }
      }),

      // Pipeline
      prisma.order.count({ where: { status: "sorting" } }),
      prisma.order.count({ where: { status: "washing" } }),
      prisma.order.count({ where: { status: "ironing" } }),
      prisma.order.count({ where: { status: "ready" } }),

      // Recent Orders
      prisma.order.findMany({
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        take: 12
      })
    ])

    const todayRevenue = revenueToday._sum.total || 0
    const yesterdayRevenue = revenueYesterday._sum.total || 0

    const revenueChangePercent = yesterdayRevenue
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0

    return NextResponse.json({
      stats: {
        totalRevenueToday: todayRevenue,
        revenueChangePercent: Math.round(revenueChangePercent),
        activeOrders,
        activeInWashing,
        pendingPickups,
        expressDeliveries,
        pipeline: {
          sorting,
          washing,
          ironing,
          ready
        }
      },
      orders
    })

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Failed fetch dashboard" },
      { status: 500 }
    )
  }
}
