import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { createLogger } from '@/lib/logger'
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'

const logger = createLogger('inventory-item-api')

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { id } = await params

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!item) {
      return notFoundResponse('Item inventory')
    }

    return successResponse(item)
  } catch (error) {
    logger.error(error, 'Failed to fetch inventory item')
    return errorResponse('Gagal mengambil data item', 500)
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { id } = await params
    const body = await req.json()

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    })

    if (!item) {
      return notFoundResponse('Item inventory')
    }

    const errors: string[] = []

    if (body.quantity !== undefined) {
      if (typeof body.quantity !== 'number' || body.quantity < 0) {
        errors.push('Jumlah harus berupa angka positif')
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0) {
        errors.push('Harga harus berupa angka positif')
      }
    }

    if (errors.length > 0) {
      return validationErrorResponse(errors)
    }

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: body.name?.trim() || item.name,
        description: body.description?.trim() || item.description,
        category: body.category?.trim() || item.category,
        quantity: body.quantity ?? item.quantity,
        unit: body.unit?.trim() || item.unit,
        minStock: body.minStock ?? item.minStock,
        maxStock: body.maxStock ?? item.maxStock,
        price: body.price ?? item.price,
        supplier: body.supplier?.trim() || item.supplier,
      },
    })

    logger.info({ itemId: id }, 'Inventory item updated')
    return successResponse(updated, 'Item inventory berhasil diperbarui')
  } catch (error) {
    logger.error(error, 'Failed to update inventory item')
    return errorResponse('Gagal memperbarui item', 500)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession()

    if (!session) {
      return unauthorizedResponse()
    }

    const { id } = await params

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
    })

    if (!item) {
      return notFoundResponse('Item inventory')
    }

    await prisma.inventoryItem.delete({
      where: { id },
    })

    logger.info({ itemId: id }, 'Inventory item deleted')
    return successResponse(null, 'Item inventory berhasil dihapus')
  } catch (error) {
    logger.error(error, 'Failed to delete inventory item')
    return errorResponse('Gagal menghapus item', 500)
  }
}
