import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { findAuthUserById } from '@/lib/auth/repository'
import { verifySessionToken } from '@/lib/auth/session-core'
import { readSessionCookie } from '@/lib/auth/session'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export const getSession = cache(async () => {
  const token = await readSessionCookie()
  return verifySessionToken(token)
})

export async function requireSession() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return session
}

export async function requireApiSession() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return session
}

export const getCurrentUser = cache(async () => {
  const session = await getSession()

  if (!session) {
    return null
  }

  const user = await findAuthUserById(session.userId)

  if (!user) {
    return null
  }

  return {
    ...user,
    initials: getInitials(user.name),
  }
})
