export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5201'

export async function apiFetch(path: string, init?: RequestInit) {
  const token = typeof window === 'undefined' ? null : localStorage.getItem('social_network_access_token')
  const headers = new Headers(init?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init?.body && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  
  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      message?: string
      title?: string
      errors?: Record<string, string[]>
    } | null
    const validationMessage = body?.errors
      ? Object.values(body.errors).flat().join(' ')
      : undefined
    throw new Error(validationMessage ?? body?.message ?? body?.title ?? `Request failed (${response.status})`)
  }
  return response
}

export function getAssetUrl(url: string | null | undefined) {
  if (!url) return undefined
  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export function getInitials(value: string | null | undefined) {
  if (!value) return 'U'
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
}
