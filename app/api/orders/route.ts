import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { validateCreateOrderPayload } from '@/lib/orders/validation'
import { createLogger } from '@/lib/logger'
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  notFoundResponse,
  validationErrorResponse,
  errorResponse,
} from '@/lib/api-response'

const logger = createLogger('orders-api')

// GET Orders
export async function GET() {
  try {
    const session = await requireApiSession()

    if (!session) {
      logger.warn('Unauthorized GET /api/orders attempt')
      return unauthorizedResponse()
    }

    logger.info('Fetching all orders')

    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    logger.info({ count: orders.length }, 'Orders fetched successfully')
    return successResponse(orders, `${orders.length} orders retrieved`)
  } catch (error) {
    logger.error(error, 'Failed to fetch orders')
    return errorResponse('Gagal mengambil data order', 500)
  }
}

// POST Orders
export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      logger.warn('Unauthorized POST /api/orders attempt')
      return unauthorizedResponse()
    }

    const body = await req.json()
    logger.debug({ body }, 'Creating new order')

    const validation = validateCreateOrderPayload(body)

    if (!validation.ok) {
      logger.warn({ errors: validation.errors }, 'Order validation failed')
      return validationErrorResponse(validation.errors)
    }

    const customer = await prisma.customer.findUnique({
      where: { id: validation.data.customerId },
      select: { id: true, name: true },
    })

    if (!customer) {
      logger.warn(
        { customerId: validation.data.customerId },
        'Customer not found'
      )
      return notFoundResponse('Customer')
    }

    const order = await prisma.order.create({
      data: {
        customerId: validation.data.customerId,
        status: 'sorting',
        service: validation.data.services.map((service) => service.name).join(', '),
        price: validation.data.services[0]?.price ?? 0,
        totalItems: validation.data.itemCount ?? validation.data.services.length,
        totalPrice: validation.data.total,
        services: validation.data.services,
        payment: validation.data.payment,
        paymentStatus: validation.data.payment === 'qris' ? 'unpaid' : 'paid',
        paymentProvider: validation.data.payment === 'qris' ? 'midtrans' : 'cash',
        paidAt: validation.data.payment === 'qris' ? null : new Date(),
        itemCount: validation.data.itemCount,
        deliveryDate: validation.data.deliveryDate,
        isExpress: validation.data.isExpress,
        subtotal: validation.data.subtotal,
        expressFee: validation.data.expressFee,
        total: validation.data.total,
      },
      include: {
        customer: true,
      },
    })

    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        toStatus: 'sorting',
        note: 'Order dibuat',
        changedBy: session.email,
      },
    })

    logger.info(
      { orderId: order.id, customerId: customer.id, total: order.total },
      'Order created successfully'
    )

    return createdResponse(order, 'Order berhasil dibuat')
  } catch (error) {
    logger.error(error, 'Failed to create order')
    return errorResponse(
      'Gagal membuat order',
      500,
      error instanceof Error ? error.message : String(error)
    )
  }
}
