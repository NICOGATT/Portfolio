import { apiRequest } from './httpClient'
import type { AuthResponse } from '../types/dashboard'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  nombre: string
  email: string
  password: string
  numero: string
}

export const authService = {
  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(payload)
    }),
  register: (payload: RegisterPayload) =>
    apiRequest<AuthResponse>('/api/usuarios', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify(payload)
    })
}
