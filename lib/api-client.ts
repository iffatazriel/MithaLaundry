type ApiEnvelope<T> = {
  data?: T
}

export function unwrapApiData<T>(payload: unknown, fallback: T): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload
  ) {
    const data = (payload as ApiEnvelope<T>).data
    return data ?? fallback
  }

  return (payload as T) ?? fallback
}

export function unwrapApiArray<T>(payload: unknown): T[] {
  const data = unwrapApiData<unknown>(payload, [])
  return Array.isArray(data) ? data as T[] : []
}
