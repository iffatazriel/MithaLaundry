import { NextResponse } from 'next/server'
import { createLogger } from './logger'

const logger = createLogger('api-response')

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  details?: unknown
  message?: string
  timestamp: string
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status: 200 }
  )
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status: 201 }
  )
}

export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
) {
  logger.error({ error, status, details }, 'API Error')

  return NextResponse.json(
    {
      success: false,
      error,
      details: process.env.NODE_ENV === 'production' ? undefined : details,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status }
  )
}

export function validationErrorResponse(errors: string[]) {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status: 400 }
  )
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401)
}

export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} tidak ditemukan`, 404)
}

export function conflictResponse(message: string) {
  return errorResponse(message, 409)
}
