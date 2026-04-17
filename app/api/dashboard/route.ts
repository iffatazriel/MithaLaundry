import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { DashboardPeriod } from '@/types'

const PERIOD_CONFIG: Record<
  DashboardPeriod,
  { revenueLabel: string; comparisonLabel: string }
> = {
  today: {
    revenueLabel: 'Total Revenue Today',
    comparisonLabel: 'vs yesterday',
  },
  week: {
    revenueLabel: 'Total Revenue This Week',
    comparisonLabel: 'vs last week',
  },
  month: {
    revenueLabel: 'Total Revenue This Month',
    comparisonLabel: 'vs last month',
  },
  year: {
    revenueLabel: 'Total Revenue This Year',
    comparisonLabel: 'vs last year',
  },
}

function resolvePeriodBounds(period: DashboardPeriod) {
  const now = new Date()
  const currentStart = new Date(now)
  const previousStart = new Date(now)
  const previousEnd = new Date(now)

  if (period === 'today') {
    currentStart.setHours(0, 0, 0, 0)
    previousStart.setTime(currentStart.getTime())
    previousStart.setDate(previousStart.getDate() - 1)
    previousEnd.setTime(currentStart.getTime())
  } else if (period === 'week') {
    const day = currentStart.getDay()
    const distanceFromMonday = (day + 6) % 7

    currentStart.setHours(0, 0, 0, 0)
    currentStart.setDate(currentStart.getDate() - distanceFromMonday)

    previousStart.setTime(currentStart.getTime())
    previousStart.setDate(previousStart.getDate() - 7)

    previousEnd.setTime(currentStart.getTime())
  } else if (period === 'month') {
    currentStart.setHours(0, 0, 0, 0)
    currentStart.setDate(1)

    previousStart.setTime(currentStart.getTime())
    previousStart.setMonth(previousStart.getMonth() - 1)

    previousEnd.setTime(currentStart.getTime())
  } else {
    currentStart.setHours(0, 0, 0, 0)
    currentStart.setMonth(0, 1)

    previousStart.setTime(currentStart.getTime())
    previousStart.setFullYear(previousStart.getFullYear() - 1)

    previousEnd.setTime(currentStart.getTime())
  }

  return { currentStart, previousStart, previousEnd }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const requestedPeriod = searchParams.get('period')
    const period: DashboardPeriod =
      requestedPeriod === 'week' ||
      requestedPeriod === 'month' ||
      requestedPeriod === 'year'
        ? requestedPeriod
        : 'today'

    const { currentStart, previousStart, previousEnd } = resolvePeriodBounds(period)
    const { revenueLabel, comparisonLabel } = PERIOD_CONFIG[period]

    const [
      revenueCurrentPeriod,
      revenuePreviousPeriod,
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
          createdAt: { gte: currentStart },
          status: { in: ["ready", "completed"] }
        }
      }),

      // Revenue Yesterday
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: {
            gte: previousStart,
            lt: previousEnd
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

    const currentRevenue = revenueCurrentPeriod._sum.total || 0
    const previousRevenue = revenuePreviousPeriod._sum.total || 0

    const revenueChangePercent = previousRevenue
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0

    return NextResponse.json({
      stats: {
        totalRevenue: currentRevenue,
        revenueChangePercent: Math.round(revenueChangePercent),
        revenueLabel,
        comparisonLabel,
        period,
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
