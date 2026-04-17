import { cookies } from 'next/headers'
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  type SessionData,
} from '@/lib/auth/session-core'

export async function setSessionCookie(input: SessionInput) {
  const cookieStore = await cookies()
  const token = createSessionToken(input)

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
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
