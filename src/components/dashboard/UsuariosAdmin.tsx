import { useEffect, useState } from 'react'
import {
  API_URL,
  authHeaders,
  isExpiredTokenStatus,
  isJwtExpired,
  logAuthRequest,
  logAuthResponse
} from '../../services/api'
import type { Usuario, UsuariosResponse } from '../../types/dashboard'
import { getUsuariosFromResponse } from '../../utils/responses'
import ErrorCard from './ErrorCard'
import LoadingSpinner from './LoadingSpinner'
import UserTable from './UserTable'

type UsuariosAdminProps = {
  token: string
  onForbidden: (message: string) => void
  onSessionExpired: (message: string) => void
  onUsuariosLoaded: (usuarios: Usuario[]) => void
  usuario: Usuario
}

function UsuariosAdmin({
  token,
  onForbidden,
  onSessionExpired,
  onUsuariosLoaded,
  usuario
}: UsuariosAdminProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!token) return

    if (isJwtExpired(token)) {
      onSessionExpired('El token guardado esta vencido.')
      return
    }

    const controller = new AbortController()

    const getUsuarios = async () => {
      setIsLoading(true)
      setError('')
      logAuthRequest({
        endpoint: 'GET /api/usuarios',
        token,
        usuario
      })

      try {
        const res = await fetch(`${API_URL}/api/usuarios`, {
          headers: authHeaders(token),
          signal: controller.signal
        })
        logAuthResponse({
          endpoint: 'GET /api/usuarios',
          status: res.status
        })

        const data = (await res.json()) as UsuariosResponse

        if (!res.ok) {
          const message = Array.isArray(data) ? '' : data.message

          if (isExpiredTokenStatus(res.status)) {
            onSessionExpired('El token expiro o no es valido.')
            return
          }

          if (res.status === 403) {
            onForbidden('El backend rechazo permisos para ver usuarios.')
            setError('El backend rechazo permisos para ver usuarios. Revisa que el token corresponda a un usuario admin.')
            return
          }

          if (res.status >= 500) {
            setError('El servidor tuvo un problema al cargar usuarios.')
            return
          }

          setError(message || 'No se pudieron cargar los usuarios.')
          return
        }

        const usuariosFromApi = getUsuariosFromResponse(data)
        setUsuarios(usuariosFromApi)
        onUsuariosLoaded(usuariosFromApi)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setError('No pudimos conectar con la API. Revisa que el backend este encendido.')
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    getUsuarios()

    return () => controller.abort()
  }, [onForbidden, onSessionExpired, onUsuariosLoaded, token, usuario])

  return (
    <section
      className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-6"
      id="usuarios"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">Usuarios registrados</p>
          <p className="mt-1 text-sm text-slate-400">
            Datos obtenidos desde <span className="font-mono text-cyan-300">/api/usuarios</span>.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
          Bearer token
        </span>
      </div>

      {isLoading && (
        <LoadingSpinner detail="Validando token y permisos..." title="Cargando usuarios" />
      )}

      {!isLoading && error && (
        <ErrorCard message={error} title="No se pudieron cargar los usuarios" />
      )}

      {!isLoading && !error && <UserTable usuarios={usuarios} />}
    </section>
  )
}

export default UsuariosAdmin
