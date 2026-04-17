import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { NextResponse } from 'next/server'
import type { ReportData, ReportPeriod } from '@/lib/types/report'

type OrderWithCustomer = Awaited<ReturnType<typeof prisma.order.findMany>>[number] & {
  customer: {
    id: string
    name: string
    phone: string
  }
}

type ServiceEntry = {
  name?: string
  quantity?: number
}

const PERIOD_META: Record<
  ReportPeriod,
  { label: string; comparisonLabel: string }
> = {
  month: {
    label: 'This Month',
    comparisonLabel: 'vs Last Month',
  },
  quarter: {
    label: 'This Quarter',
    comparisonLabel: 'vs Last Quarter',
  },
  year: {
    label: 'This Year',
    comparisonLabel: 'vs Last Year',
  },
}

const SERVICE_COLORS = [
  'bg-blue-600',
  'bg-blue-400',
  'bg-blue-200',
  'bg-gray-300',
]

function getPeriodBounds(period: ReportPeriod) {
  const now = new Date()
  const currentStart = new Date(now)
  const currentEnd = new Date(now)
  const previousStart = new Date(now)
  const previousEnd = new Date(now)

  currentEnd.setHours(23, 59, 59, 999)

  if (period === 'month') {
    currentStart.setHours(0, 0, 0, 0)
    currentStart.setDate(1)

    previousStart.setTime(currentStart.getTime())
    previousStart.setMonth(previousStart.getMonth() - 1)

    previousEnd.setTime(currentStart.getTime())
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1)
  } else if (period === 'quarter') {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3

    currentStart.setHours(0, 0, 0, 0)
    currentStart.setMonth(quarterStartMonth, 1)

    previousStart.setTime(currentStart.getTime())
    previousStart.setMonth(previousStart.getMonth() - 3)

    previousEnd.setTime(currentStart.getTime())
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1)
  } else {
    currentStart.setHours(0, 0, 0, 0)
    currentStart.setMonth(0, 1)

    previousStart.setTime(currentStart.getTime())
    previousStart.setFullYear(previousStart.getFullYear() - 1)

    previousEnd.setTime(currentStart.getTime())
    previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1)
  }

  return { currentStart, currentEnd, previousStart, previousEnd }
}

function calculateGrowth(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }

  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function calculateProcessingTimeGrowth(currentHours: number, previousHours: number) {
  if (previousHours === 0) {
    return currentHours > 0 ? 0 : 100
  }

  return Number((((previousHours - currentHours) / previousHours) * 100).toFixed(1))
}

function formatProcessingHours(hours: number) {
  if (!Number.isFinite(hours) || hours <= 0) {
    return '0h'
  }

  return `${hours.toFixed(1)}h`
}

function parseServices(services: unknown): ServiceEntry[] {
  if (Array.isArray(services)) {
    return services.filter((service) => typeof service === 'object' && service !== null) as ServiceEntry[]
  }

  if (typeof services === 'string') {
    try {
      const parsed = JSON.parse(services)
      return Array.isArray(parsed) ? parsed as ServiceEntry[] : []
    } catch {
      return []
    }
  }

  return []
}

function buildChartData(orders: OrderWithCustomer[], period: ReportPeriod): ReportData['chartData'] {
  const now = new Date()

  if (period === 'month') {
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now)
      day.setDate(now.getDate() - (6 - index))
      day.setHours(0, 0, 0, 0)

      const nextDay = new Date(day)
      nextDay.setDate(day.getDate() + 1)

      const revenue = orders
        .filter((order) => order.createdAt >= day && order.createdAt < nextDay)
        .reduce((sum, order) => sum + order.total, 0)

      return {
        week: day.toLocaleDateString('id-ID', { weekday: 'short' }),
        revenue,
        isHighlight: index === 6,
      }
    })
  }

  if (period === 'quarter') {
    return Array.from({ length: 8 }, (_, index) => {
      const start = new Date(now)
      start.setDate(now.getDate() - ((7 - index) * 7))
      start.setHours(0, 0, 0, 0)

      const end = new Date(start)
      end.setDate(start.getDate() + 7)

      const revenue = orders
        .filter((order) => order.createdAt >= start && order.createdAt < end)
        .reduce((sum, order) => sum + order.total, 0)

      return {
        week: `WK ${index + 1}`,
        revenue,
        isHighlight: index === 7,
      }
    })
  }

  return Array.from({ length: 6 }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1)

    const revenue = orders
      .filter((order) => order.createdAt >= start && order.createdAt < end)
      .reduce((sum, order) => sum + order.total, 0)

    return {
      week: start.toLocaleDateString('id-ID', { month: 'short' }),
      revenue,
      isHighlight: index === 5,
    }
  })
}

function buildServicePopularity(orders: OrderWithCustomer[]): ReportData['serviceData'] {
  const serviceTotals = new Map<string, number>()

  for (const order of orders) {
    for (const service of parseServices(order.services)) {
      const name = service.name?.trim()
      if (!name) {
        continue
      }

      serviceTotals.set(name, (serviceTotals.get(name) ?? 0) + (service.quantity ?? 1))
    }
  }

  const totalQuantity = Array.from(serviceTotals.values()).reduce((sum, value) => sum + value, 0)

  return Array.from(serviceTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, quantity], index) => ({
      name,
      percentage: totalQuantity > 0 ? Math.round((quantity / totalQuantity) * 100) : 0,
      color: SERVICE_COLORS[index] ?? 'bg-gray-300',
    }))
}

function buildHighValueOrders(orders: OrderWithCustomer[]): ReportData['highValueOrders'] {
  return [...orders]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((order) => {
      const services = parseServices(order.services)
      const serviceLabel = services.map((service) => service.name).filter(Boolean).join(', ')
      const normalizedStatus = order.status.toLowerCase()

      return {
        id: order.id,
        customerName: order.customer?.name ?? 'Walk-in Customer',
        customerInitials: (order.customer?.name ?? 'WC')
          .split(' ')
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join(''),
        customerColor: order.isExpress ? 'bg-orange-500' : 'bg-blue-500',
        serviceType: serviceLabel || 'Laundry Service',
        amount: order.total,
        status:
          normalizedStatus === 'completed'
            ? 'completed'
            : normalizedStatus === 'ready' || normalizedStatus === 'washing' || normalizedStatus === 'ironing'
              ? 'in_progress'
              : 'pending',
        date: order.createdAt.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      }
    })
}

function buildInsight(serviceData: ReportData['serviceData']): ReportData['insight'] {
  if (serviceData.length === 0) {
    return {
      title: 'Belum ada data layanan',
      description: 'Tambahkan order baru agar laporan popularitas layanan mulai terbentuk.',
      icon: 'lightbulb',
    }
  }

  const topService = serviceData[0]

  return {
    title: `"${topService.name}" paling diminati`,
    description: `Layanan ini menyumbang sekitar ${topService.percentage}% dari total permintaan pada periode terpilih.`,
    icon: 'lightbulb',
  }
}

function countNewCustomersInRange(allOrders: OrderWithCustomer[], start: Date, end: Date) {
  const firstOrderByCustomer = new Map<string, Date>()

  for (const order of allOrders) {
    const existing = firstOrderByCustomer.get(order.customerId)
    if (!existing || order.createdAt < existing) {
      firstOrderByCustomer.set(order.customerId, order.createdAt)
    }
  }

  return Array.from(firstOrderByCustomer.values()).filter(
    (date) => date >= start && date <= end
  ).length
}

function averageProcessingHours(orders: OrderWithCustomer[]) {
  const completedOrders = orders.filter((order) => order.deliveryDate)

  if (completedOrders.length === 0) {
    return 0
  }

  const totalHours = completedOrders.reduce((sum, order) => {
    const deliveryDate = order.deliveryDate
    if (!deliveryDate) {
      return sum
    }

    return sum + (deliveryDate.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60)
  }, 0)

  return totalHours / completedOrders.length
}

export async function GET(req: Request) {
  const session = await requireApiSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const requestedPeriod = searchParams.get('period')
    const period: ReportPeriod =
      requestedPeriod === 'quarter' || requestedPeriod === 'year'
        ? requestedPeriod
        : 'month'

    const { currentStart, currentEnd, previousStart, previousEnd } = getPeriodBounds(period)
    const { label, comparisonLabel } = PERIOD_META[period]

    const [currentOrdersRaw, previousOrdersRaw, allOrdersRaw] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: currentStart,
            lte: currentEnd,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
      prisma.order.findMany({
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
        },
      }),
    ])

    const currentOrders = currentOrdersRaw as OrderWithCustomer[]
    const previousOrders = previousOrdersRaw as OrderWithCustomer[]
    const allOrders = allOrdersRaw as OrderWithCustomer[]

    const currentRevenue = currentOrders.reduce((sum, order) => sum + order.total, 0)
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0)

    const currentNewCustomers = countNewCustomersInRange(allOrders, currentStart, currentEnd)
    const previousNewCustomers = countNewCustomersInRange(allOrders, previousStart, previousEnd)

    const currentProcessingHours = averageProcessingHours(currentOrders)
    const previousProcessingHours = averageProcessingHours(previousOrders)

    const reportData: ReportData = {
      period,
      periodLabel: label,
      comparisonLabel,
      stats: {
        revenue: currentRevenue,
        revenueGrowth: calculateGrowth(currentRevenue, previousRevenue),
        totalOrders: currentOrders.length,
        totalOrdersGrowth: calculateGrowth(currentOrders.length, previousOrders.length),
        newCustomers: currentNewCustomers,
        newCustomersGrowth: calculateGrowth(currentNewCustomers, previousNewCustomers),
        avgProcessingTime: formatProcessingHours(currentProcessingHours),
        avgProcessingTimeGrowth: calculateProcessingTimeGrowth(currentProcessingHours, previousProcessingHours),
      },
      chartData: buildChartData(currentOrders, period),
      serviceData: buildServicePopularity(currentOrders),
      highValueOrders: buildHighValueOrders(currentOrders),
      insight: buildInsight(buildServicePopularity(currentOrders)),
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('GET /api/reports error:', error)

    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
