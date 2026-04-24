import 'server-only'

import { prisma } from '@/lib/prisma'

type NotificationTone = 'info' | 'warning' | 'success' | 'danger'
type NotificationType = 'new-order' | 'express' | 'ready-pickup' | 'overdue'

export interface AppNotification {
  id: string
  type: NotificationType
  tone: NotificationTone
  priority: number
  title: string
  message: string
  orderId: string
  customerName: string
  createdAt: string
}

const ACTIVE_STATUSES = ['sorting', 'washing', 'ironing', 'ready']

function formatOrderCode(orderId: string) {
  return `#${orderId.slice(-6).toUpperCase()}`
}

function buildNotification(order: {
  id: string
  status: string
  isExpress: boolean
  createdAt: Date
  deliveryDate: Date | null
  customer: { name: string }
}): AppNotification | null {
  const now = new Date()
  const createdAt = new Date(order.createdAt)
  const deliveryDate = order.deliveryDate ? new Date(order.deliveryDate) : null
  const normalizedStatus = order.status.toLowerCase()
  const orderCode = formatOrderCode(order.id)

  if (
    deliveryDate &&
    deliveryDate.getTime() < now.getTime() &&
    normalizedStatus !== 'completed'
  ) {
    return {
      id: `overdue-${order.id}`,
      type: 'overdue',
      tone: 'danger',
      priority: 4,
      title: `Order ${orderCode} melewati estimasi`,
      message: `${order.customer.name} seharusnya selesai ${deliveryDate.toLocaleString('id-ID')}.`,
      orderId: order.id,
      customerName: order.customer.name,
      createdAt: createdAt.toISOString(),
    }
  }

  if (normalizedStatus === 'ready') {
    return {
      id: `ready-${order.id}`,
      type: 'ready-pickup',
      tone: 'success',
      priority: 3,
      title: `Order ${orderCode} siap diambil`,
      message: `${order.customer.name} sudah bisa dihubungi untuk pickup.`,
      orderId: order.id,
      customerName: order.customer.name,
      createdAt: createdAt.toISOString(),
    }
  }

  if (order.isExpress && ACTIVE_STATUSES.includes(normalizedStatus)) {
    return {
      id: `express-${order.id}`,
      type: 'express',
      tone: 'warning',
      priority: 2,
      title: `Order express ${orderCode} sedang diproses`,
      message: `${order.customer.name} membutuhkan prioritas pengerjaan.`,
      orderId: order.id,
      customerName: order.customer.name,
      createdAt: createdAt.toISOString(),
    }
  }

  const fourHoursAgo = now.getTime() - 4 * 60 * 60 * 1000
  if (createdAt.getTime() >= fourHoursAgo) {
    return {
      id: `new-${order.id}`,
      type: 'new-order',
      tone: 'info',
      priority: 1,
      title: `Order baru ${orderCode}`,
      message: `${order.customer.name} baru saja membuat order.`,
      orderId: order.id,
      customerName: order.customer.name,
      createdAt: createdAt.toISOString(),
    }
  }

  return null
}

export async function getTopbarNotifications(limit = 8) {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { status: { in: ACTIVE_STATUSES } },
        {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      ],
    },
    include: {
      customer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [{ createdAt: 'desc' }],
    take: 24,
  })

  const notifications = orders
    .map(buildNotification)
    .filter((item): item is AppNotification => item !== null)
    .sort(
      (left, right) =>
        right.priority - left.priority ||
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    )
    .slice(0, limit)

  const attentionCount = notifications.filter(
    (notification) => notification.type !== 'new-order'
  ).length

  return {
    notifications,
    unreadCount: attentionCount,
    lastUpdatedAt: new Date().toISOString(),
  }
}
