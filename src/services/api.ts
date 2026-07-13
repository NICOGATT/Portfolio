import type { ApiError } from '../types/dashboard'

export const API_URL = 'https://portfolio-backend-production-ae76.up.railway.app'

export const isUnauthorizedStatus = (status: number) => status === 401 || status === 403
export const isExpiredTokenStatus = (status: number) => status === 401

export type JwtPayload = {
  id?: number
  email?: string
  role?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = atob(normalizedPayload)
    return JSON.parse(decodedPayload) as JwtPayload
  } catch {
    return null
  }
}

export const isJwtExpired = (token: string) => {
  const payload = decodeJwtPayload(token)

  if (!payload?.exp) return false

  return payload.exp * 1000 <= Date.now()
}

export async function parseApiResponse<T>(res: Response) {
  const data = (await res.json().catch(() => ({}))) as T & { message?: string }

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || 'No pudimos completar la operacion.'
    } satisfies ApiError
  }

  return data
}

export const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`
})

export const jsonAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`
})

export const logAuthRequest = ({
  endpoint,
  token,
  usuario
}: {
  endpoint: string
  token: string
  usuario?: { email?: string; role?: string }
}) => {
  console.info('[auth fetch]', {
    endpoint,
    hasToken: Boolean(token),
    tokenPreview: token ? `${token.slice(0, 12)}...` : 'missing',
    jwtPayload: token ? decodeJwtPayload(token) : null,
    usuarioDetectado: usuario
      ? {
          email: usuario.email,
          role: usuario.role
        }
      : 'missing'
  })
}

export const logAuthResponse = ({ endpoint, status }: { endpoint: string; status: number }) => {
  console.info('[auth response]', {
    endpoint,
    status
  })
}
