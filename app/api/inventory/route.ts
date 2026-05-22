import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireApiSession } from '@/lib/auth/server'
import { createLogger } from '@/lib/logger'
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  conflictResponse,
} from '@/lib/api-response'

const logger = createLogger('inventory-api')

export async function GET() {
  try {
    const session = await requireApiSession()

    if (!session) {
      logger.warn('Unauthorized GET /api/inventory attempt')
      return unauthorizedResponse()
    }

    logger.info('Fetching inventory items')

    const items = await prisma.inventoryItem.findMany({
      include: {
        _count: {
          select: {
            movements: true,
          },
        },
      },
      orderBy: {
        category: 'asc',
      },
    })

    logger.info({ count: items.length }, 'Inventory items fetched')
    return successResponse(items, `${items.length} inventory items retrieved`)
  } catch (error) {
    logger.error(error, 'Failed to fetch inventory')
    return errorResponse('Gagal mengambil data inventory', 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireApiSession()

    if (!session) {
      logger.warn('Unauthorized POST /api/inventory attempt')
      return unauthorizedResponse()
    }

    const body = await req.json()
    logger.debug({ body }, 'Creating new inventory item')

    const errors: string[] = []

    if (!body.name?.trim()) {
      errors.push('Nama item wajib diisi')
    }

    if (!body.category?.trim()) {
      errors.push('Kategori wajib dipilih')
    }

    if (!body.unit?.trim()) {
      errors.push('Satuan wajib diisi')
    }

    if (typeof body.quantity !== 'number' || body.quantity < 0) {
      errors.push('Jumlah harus berupa angka positif')
    }

    if (typeof body.minStock !== 'number' || body.minStock < 0) {
      errors.push('Minimum stok harus berupa angka positif')
    }

    if (typeof body.maxStock !== 'number' || body.maxStock <= 0) {
      errors.push('Maksimum stok harus lebih dari 0')
    }

    if (
      typeof body.minStock === 'number' &&
      typeof body.maxStock === 'number' &&
      body.minStock > body.maxStock
    ) {
      errors.push('Minimum stok tidak boleh lebih besar dari maksimum stok')
    }

    if (typeof body.price !== 'number' || body.price < 0) {
      errors.push('Harga harus berupa angka positif')
    }

    if (errors.length > 0) {
      logger.warn({ errors }, 'Inventory validation failed')
      return validationErrorResponse(errors)
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        category: body.category.trim(),
        quantity: body.quantity,
        unit: body.unit.trim(),
        minStock: body.minStock,
        maxStock: body.maxStock,
        price: body.price,
        supplier: body.supplier?.trim() || null,
        lastRestocked: body.quantity > 0 ? new Date() : null,
      },
    })

    logger.info(
      { itemId: item.id, name: item.name },
      'Inventory item created'
    )
    return createdResponse(item, 'Item inventory berhasil ditambahkan')
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return conflictResponse('Nama item inventory sudah digunakan')
    }

    logger.error(error, 'Failed to create inventory item')
    return errorResponse('Gagal menambahkan item inventory', 500)
  }
}
