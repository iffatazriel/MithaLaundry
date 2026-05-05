export const ORDER_STATUSES = [
  'sorting',
  'washing',
  'ironing',
  'ready',
  'completed',
  'cancelled',
] as const

export const PAYMENT_METHODS = ['cash', 'qris'] as const
export const PAYMENT_STATUSES = ['unpaid', 'pending', 'paid', 'failed', 'expired'] as const

export type OrderStatusValue = (typeof ORDER_STATUSES)[number]
export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number]
export type PaymentStatusValue = (typeof PAYMENT_STATUSES)[number]

export type OrderServicePayload = {
  name: string
  price: number
  quantity: number
  subtotal: number
}

export type CreateOrderPayload = {
  customerId: string
  services: OrderServicePayload[]
  payment: PaymentMethodValue
  itemCount: number | null
  deliveryDate: Date | null
  isExpress: boolean
  subtotal: number
  expressFee: number
  total: number
}

export function isOrderStatus(value: unknown): value is OrderStatusValue {
  return ORDER_STATUSES.includes(value as OrderStatusValue)
}

export function isPaymentMethod(value: unknown): value is PaymentMethodValue {
  return PAYMENT_METHODS.includes(value as PaymentMethodValue)
}

export function isPaymentStatus(value: unknown): value is PaymentStatusValue {
  return PAYMENT_STATUSES.includes(value as PaymentStatusValue)
}

function toFiniteNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function validateDate(value: unknown) {
  if (!value) {
    return null
  }

  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function validateCreateOrderPayload(body: unknown):
  | { ok: true; data: CreateOrderPayload }
  | { ok: false; errors: string[] } {
  const errors: string[] = []
  const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {}

  const customerId = String(payload.customerId ?? '').trim()
  if (!customerId) {
    errors.push('Customer wajib dipilih.')
  }

  const servicesRaw = Array.isArray(payload.services) ? payload.services : []
  const services = servicesRaw.map((service) => {
    const item = service && typeof service === 'object' ? service as Record<string, unknown> : {}
    const price = toFiniteNumber(item.price)
    const quantity = toFiniteNumber(item.quantity)
    const subtotal = toFiniteNumber(item.subtotal)

    return {
      name: String(item.name ?? '').trim(),
      price,
      quantity,
      subtotal,
    }
  })

  const validServices = services.filter((service) => {
    return (
      service.name &&
      service.price !== null &&
      service.price >= 0 &&
      service.quantity !== null &&
      service.quantity > 0 &&
      service.subtotal !== null &&
      service.subtotal >= 0
    )
  })

  if (validServices.length === 0 || validServices.length !== servicesRaw.length) {
    errors.push('Minimal satu layanan valid wajib dipilih.')
  }

  const payment = String(payload.payment ?? '').trim().toLowerCase()
  if (!isPaymentMethod(payment)) {
    errors.push('Metode pembayaran tidak valid.')
  }

  const itemCountRaw = payload.itemCount === '' || payload.itemCount === null
    ? null
    : toFiniteNumber(payload.itemCount)
  if (itemCountRaw !== null && (!Number.isInteger(itemCountRaw) || itemCountRaw < 0)) {
    errors.push('Jumlah item harus berupa angka bulat minimal 0.')
  }

  const deliveryDate = validateDate(payload.deliveryDate)
  if (deliveryDate === undefined) {
    errors.push('Tanggal estimasi tidak valid.')
  }

  const subtotal = toFiniteNumber(payload.subtotal)
  const expressFee = toFiniteNumber(payload.expressFee)
  const total = toFiniteNumber(payload.total)

  if (subtotal === null || subtotal < 0) {
    errors.push('Subtotal tidak valid.')
  }

  if (expressFee === null || expressFee < 0) {
    errors.push('Biaya express tidak valid.')
  }

  if (total === null || total < 0) {
    errors.push('Total tidak valid.')
  }

  const computedSubtotal = validServices.reduce((sum, service) => {
    return sum + Number(service.subtotal)
  }, 0)
  const computedTotal = computedSubtotal + Number(expressFee ?? 0)

  if (subtotal !== null && Math.abs(subtotal - computedSubtotal) > 1) {
    errors.push('Subtotal tidak sesuai dengan rincian layanan.')
  }

  if (total !== null && Math.abs(total - computedTotal) > 1) {
    errors.push('Total tidak sesuai dengan subtotal dan biaya express.')
  }

  if (errors.length > 0 || !isPaymentMethod(payment)) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    data: {
      customerId,
      services: validServices.map((service) => ({
        name: service.name,
        price: Number(service.price),
        quantity: Number(service.quantity),
        subtotal: Number(service.subtotal),
      })),
      payment,
      itemCount: itemCountRaw,
      deliveryDate: deliveryDate ?? null,
      isExpress: Boolean(payload.isExpress),
      subtotal: Number(subtotal),
      expressFee: Number(expressFee),
      total: Number(total),
    },
  }
}
