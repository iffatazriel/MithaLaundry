import crypto from 'node:crypto'

export type MidtransAction = {
  name?: string
  method?: string
  url?: string
}

export type MidtransChargeResponse = {
  status_code?: string
  status_message?: string
  transaction_id?: string
  order_id?: string
  gross_amount?: string
  currency?: string
  payment_type?: string
  transaction_status?: string
  fraud_status?: string
  actions?: MidtransAction[]
  qr_string?: string
  acquirer?: string
  validation_messages?: string[]
  error_messages?: string[]
}

export type MidtransSnapResponse = {
  token?: string
  redirect_url?: string
  status_code?: string
  status_message?: string
  validation_messages?: string[]
  error_messages?: string[]
}

export type MidtransNotificationBody = {
  transaction_time?: string
  transaction_status?: string
  transaction_id?: string
  status_message?: string
  status_code?: string
  signature_key?: string
  payment_type?: string
  order_id?: string
  merchant_id?: string
  gross_amount?: string
  fraud_status?: string
  currency?: string
}

export function getMidtransBaseUrl() {
  return process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://api.midtrans.com'
    : 'https://api.sandbox.midtrans.com'
}

export function getMidtransSnapBaseUrl() {
  return process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://app.midtrans.com'
    : 'https://app.sandbox.midtrans.com'
}

export function getMidtransAuthHeader(serverKey: string) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`
}

export function getMidtransQrCodeUrl(actions?: MidtransAction[]) {
  return actions?.find((action) => action.name === 'generate-qr-code')?.url ?? null
}

export function verifyMidtransSignature(
  body: MidtransNotificationBody,
  serverKey: string
) {
  if (!body.signature_key || !body.order_id || !body.status_code || !body.gross_amount) {
    return false
  }

  const expected = crypto
    .createHash('sha512')
    .update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(expected)
  const receivedBuffer = Buffer.from(body.signature_key)

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  )
}

export function mapMidtransPaymentStatus(body: MidtransNotificationBody) {
  const transactionStatus = String(body.transaction_status ?? '').toLowerCase()
  const fraudStatus = String(body.fraud_status ?? '').toLowerCase()

  if (transactionStatus === 'capture') {
    return fraudStatus === 'challenge' ? 'pending' : 'paid'
  }

  if (transactionStatus === 'settlement') {
    return 'paid'
  }

  if (transactionStatus === 'pending') {
    return 'pending'
  }

  if (transactionStatus === 'expire') {
    return 'expired'
  }

  if (['cancel', 'deny', 'failure'].includes(transactionStatus)) {
    return 'failed'
  }

  return null
}
