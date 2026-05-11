import { cookies, headers } from 'next/headers'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  type SessionData,
} from '@/lib/auth/session-core'

async function shouldUseSecureCookie() {
  if (process.env.NODE_ENV !== 'production') {
    return false
  }

  const headerStore = await headers()
  const forwardedProto = headerStore.get('x-forwarded-proto')
  const host = headerStore.get('host') ?? ''

  if (forwardedProto) {
    return forwardedProto.split(',')[0]?.trim() === 'https'
  }

  return !(
    host.startsWith('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  )
}

export async function setSessionCookie(input: SessionInput) {
  const cookieStore = await cookies()
  const token = createSessionToken(input)

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: await shouldUseSecureCookie(),
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function readSessionCookie() {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

type SessionInput = Omit<SessionData, 'exp'>

export { SESSION_COOKIE_NAME, createSessionToken }
