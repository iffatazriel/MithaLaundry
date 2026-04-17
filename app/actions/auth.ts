'use server'

import { redirect } from 'next/navigation'
import { randomUUID } from 'crypto'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { clearSessionCookie, setSessionCookie } from '@/lib/auth/session'
import {
  countAuthUsers,
  createAuthUser,
  findAuthUserByEmail,
} from '@/lib/auth/repository'

export type AuthFormState = {
  error?: string
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return value?.toString().trim().toLowerCase() ?? ''
}

function normalizeText(value: FormDataEntryValue | null) {
  return value?.toString().trim() ?? ''
}

function resolveNextPath(formData: FormData) {
  const nextPath = normalizeText(formData.get('next'))
  return nextPath.startsWith('/') ? nextPath : '/dashboard'
}

export async function login(_: AuthFormState | undefined, formData: FormData) {
  const email = normalizeEmail(formData.get('email'))
  const password = normalizeText(formData.get('password'))

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const user = await findAuthUserByEmail(email)

  if (!user) {
    return { error: 'Email atau password tidak valid.' }
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)

  if (!isValidPassword) {
    return { error: 'Email atau password tidak valid.' }
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  redirect(resolveNextPath(formData))
}

export async function setupInitialAdmin(
  _: AuthFormState | undefined,
  formData: FormData
) {
  const existingUsers = await countAuthUsers()

  if (existingUsers > 0) {
    return { error: 'Admin sudah tersedia. Silakan login.' }
  }

  const name = normalizeText(formData.get('name'))
  const email = normalizeEmail(formData.get('email'))
  const password = normalizeText(formData.get('password'))
  const confirmPassword = normalizeText(formData.get('confirmPassword'))

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'Semua field wajib diisi untuk setup admin pertama.' }
  }

  if (password.length < 8) {
    return { error: 'Password minimal 8 karakter.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Konfirmasi password belum sama.' }
  }

  const passwordHash = await hashPassword(password)
  const user = await createAuthUser({
    id: randomUUID(),
    name,
    email,
    passwordHash,
    role: 'owner',
  })

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  redirect(resolveNextPath(formData))
}

export async function logout() {
  await clearSessionCookie()
  redirect('/login')
}
