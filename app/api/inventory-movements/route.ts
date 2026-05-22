import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { createLogger } from '@/lib/logger'
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-response'

const logger = createLogger('inventory-movement-api')

export async function GET(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(req.url)
    const itemId = searchParams.get('itemId')
    const parsedLimit = parseInt(searchParams.get('limit') || '50', 10)
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(Math.max(parsedLimit, 1), 100)
      : 50

    logger.info({ itemId, limit }, 'Fetching inventory movements')

    const movements = await prisma.inventoryMovement.findMany({
      where: itemId ? { itemId } : undefined,
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return successResponse(movements)
  } catch (error) {
    logger.error(error, 'Failed to fetch movements')
    return errorResponse('Gagal mengambil riwayat pergerakan', 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const body = await req.json()
    logger.debug({ body }, 'Creating inventory movement')

    const errors: string[] = []

    if (!body.itemId?.trim()) {
      errors.push('Item ID wajib diisi')
    }

    if (!body.type || !['in', 'out', 'adjustment'].includes(body.type)) {
      errors.push('Tipe pergerakan harus: in, out, atau adjustment')
    }

    if (typeof body.quantity !== 'number' || body.quantity < 0) {
      errors.push('Jumlah harus berupa angka positif')
    }

    if (body.type !== 'adjustment' && body.quantity === 0) {
      errors.push('Jumlah stok masuk/keluar tidak boleh 0')
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors)
    }

    const item = await prisma.inventoryItem.findUnique({
      where: { id: body.itemId },
    })

    if (!item) {
      return notFoundResponse('Item inventory')
    }

    // Calculate new quantity before writing so validation happens once.
    let newQuantity = item.quantity
    if (body.type === 'in') {
      newQuantity += body.quantity
    } else if (body.type === 'out') {
      newQuantity -= body.quantity
      if (newQuantity < 0) {
        return errorResponse('Stok tidak cukup untuk pengeluaran', 400)
      }
    } else if (body.type === 'adjustment') {
      newQuantity = body.quantity
    }

    const movement = await prisma.$transaction(async (tx) => {
      const created = await tx.inventoryMovement.create({
        data: {
          itemId: body.itemId,
          type: body.type,
          quantity: body.quantity,
          note: body.note?.trim() || null,
          createdBy: session.email,
        },
      })

      await tx.inventoryItem.update({
        where: { id: body.itemId },
        data: {
          quantity: newQuantity,
          lastRestocked: body.type === 'in' ? new Date() : undefined,
        },
      })

      return created
    })

    logger.info(
      { movementId: movement.id, itemId: body.itemId, type: body.type },
      'Inventory movement created'
    )

    return createdResponse(movement, 'Pergerakan inventory berhasil dicatat')
  } catch (error) {
    logger.error(error, 'Failed to create movement')
    return errorResponse('Gagal mencatat pergerakan inventory', 500)
  }
}
