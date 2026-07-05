import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { Usuario } from '../types/dashboard'
import { clearSesion, getTokenGuardado, getUsuarioGuardado, isAdmin } from '../utils/auth'

type AuthContextValue = {
  token: string | null
  user: Usuario | null
  isAuthenticated: boolean
  isAdminUser: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getTokenGuardado())
  const [user, setUser] = useState<Usuario | null>(() => {
    const storedUser = getUsuarioGuardado()
    return storedUser.email || storedUser.id ? storedUser : null
  })

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password })
    const loggedUser = data.usuario || data.user

    if (!data.token || !loggedUser) {
      throw new Error(data.message || 'La API no devolvio una sesion valida.')
    }

    if (!isAdmin(loggedUser)) {
      throw new Error('Acceso denegado: este usuario no es admin.')
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(loggedUser))
    setToken(data.token)
    setUser(loggedUser)
  }

  const logout = () => {
    clearSesion()
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdminUser: Boolean(user && isAdmin(user)),
      login,
      logout
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }
  return context
}
