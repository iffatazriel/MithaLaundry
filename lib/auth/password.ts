import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(scryptCallback)

const SALT_LENGTH = 16
const KEY_LENGTH = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH).toString('hex')
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer

  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(':')

  if (!salt || !storedHash) {
    return false
  }

  const storedBuffer = Buffer.from(storedHash, 'hex')
  const derivedKey = (await scrypt(password, salt, storedBuffer.length)) as Buffer

  if (storedBuffer.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedBuffer, derivedKey)
}
