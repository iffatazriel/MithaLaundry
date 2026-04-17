import 'server-only'

import { prisma } from '@/lib/prisma'

export type AuthUser = {
  id: string
  name: string
  email: string
  passwordHash: string
  role: string
}

type PublicAuthUser = Omit<AuthUser, 'passwordHash'>

let tablesReadyPromise: Promise<void> | null = null

async function createAuthTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'admin',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )
  `)

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")
  `)
}

export async function ensureAuthTables() {
  tablesReadyPromise ??= createAuthTables()
  await tablesReadyPromise
}

export async function countAuthUsers() {
  await ensureAuthTables()
  const rows = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(*)::bigint AS count FROM "User"
  `

  return Number(rows[0]?.count ?? 0)
}

export async function findAuthUserByEmail(email: string) {
  await ensureAuthTables()
  const rows = await prisma.$queryRaw<AuthUser[]>`
    SELECT "id", "name", "email", "passwordHash", "role"
    FROM "User"
    WHERE "email" = ${email}
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function findAuthUserById(id: string) {
  await ensureAuthTables()
  const rows = await prisma.$queryRaw<PublicAuthUser[]>`
    SELECT "id", "name", "email", "role"
    FROM "User"
    WHERE "id" = ${id}
    LIMIT 1
  `

  return rows[0] ?? null
}

export async function createAuthUser(input: {
  id: string
  name: string
  email: string
  passwordHash: string
  role: string
}) {
  await ensureAuthTables()
  const rows = await prisma.$queryRaw<AuthUser[]>`
    INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
    VALUES (${input.id}, ${input.name}, ${input.email}, ${input.passwordHash}, ${input.role}, NOW(), NOW())
    RETURNING "id", "name", "email", "passwordHash", "role"
  `

  return rows[0]
}
