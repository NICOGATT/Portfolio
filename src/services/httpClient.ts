import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { clearSesion, getTokenGuardado } from '../utils/auth'
import type { ApiError } from '../types/dashboard'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type RequestOptions = AxiosRequestConfig & {
  skipAuth?: boolean
  body?: BodyInit | null
}

export const http = axios.create({
  baseURL: API_URL
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) clearSesion()
    return Promise.reject(error)
  }
)

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    const { body, data, headers, skipAuth, ...config } = options
    const token = getTokenGuardado()
    const requestData = data || (typeof body === 'string' ? JSON.parse(body) : body)
    const isFormData = requestData instanceof FormData

    const response = await http.request<T, AxiosResponse<T>>({
      url: path,
      data: requestData,
      headers: {
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
        ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {})
      },
      ...config
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw {
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'No pudimos completar la solicitud.'
      } satisfies ApiError
    }

    throw {
      status: 500,
      message: 'No pudimos completar la solicitud.'
    } satisfies ApiError
  }
}
