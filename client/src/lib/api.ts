export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3940'

export async function api<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const isFormData =
    typeof FormData !== 'undefined' && init.body instanceof FormData

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: isFormData
      ? init.headers
      : {
          'Content-Type': 'application/json',
          ...(init.headers || {}),
        },
    credentials: 'include',
  })

  const data = (await res.json().catch(() => null)) as unknown

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data && (data as any).error) ||
      `Request failed (${res.status})`
    throw new Error(String(message))
  }

  return data as T
}

