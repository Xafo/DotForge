const API_BASE = '/api'

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    const refreshed = await refreshToken()
    if (refreshed) {
      headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
      const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers })
      if (!retryRes.ok) throw new ApiError(await retryRes.json(), retryRes.status)
      return retryRes.json()
    }
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Session expired')
  }

  if (!res.ok) throw new ApiError(await res.json(), res.status)
  if (res.status === 204) return undefined as T
  return res.json()
}

async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) return false
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    localStorage.setItem('access_token', data.accessToken)
    localStorage.setItem('refresh_token', data.refreshToken ?? refresh)
    return true
  } catch {
    return false
  }
}

export class ApiError extends Error {
  constructor(public body: any, public status: number) {
    super(body?.error || 'An error occurred')
  }
}
