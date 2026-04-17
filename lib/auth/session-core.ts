import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export const SESSION_COOKIE_NAME = 'mitha_session'

export type SessionData = {
  userId: string
  email: string
  name: string
  role: string
  exp: number
}

type SessionInput = Omit<SessionData, 'exp'>

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET

  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'mitha-laundry-dev-secret-change-me'
  }

  throw new Error('SESSION_SECRET is required in production')
}

function encode(payload: SessionData) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url')
}

function decode(encoded: string) {
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionData
  } catch {
    return null
  }
}

function sign(encodedPayload: string) {
  return createHmac('sha256', getSessionSecret())
    .update(encodedPayload)
    .digest('base64url')
}

export function createSessionToken(input: SessionInput) {
  const payload: SessionData = {
    ...input,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }

  const encodedPayload = encode(payload)
  const signature = sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token?: string | null) {
  if (!token) {
    return null
  }

  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = sign(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null
  }

  const payload = decode(encodedPayload)

  if (!payload || payload.exp * 1000 <= Date.now()) {
    return null
  }

  return payload
}

export { SESSION_MAX_AGE_SECONDS }
