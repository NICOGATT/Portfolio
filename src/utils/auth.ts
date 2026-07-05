import type { Usuario } from '../types/dashboard'

export const getUsuarioGuardado = () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}') as Usuario
    return usuario && typeof usuario === 'object' ? usuario : ({} as Usuario)
  } catch {
    return {} as Usuario
  }
}

export const getTokenGuardado = () => {
  const token = localStorage.getItem('token')?.trim()
  return token || null
}

export const isAdmin = (usuario: Usuario) => usuario.role === 'admin'

export const clearSesion = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}
