import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import RoleBadge from '../components/dashboard/RoleBadge'
import StatCard from '../components/dashboard/StatCard'
import UnauthorizedCard from '../components/dashboard/UnauthorizedCard'
import UsuariosAdmin from '../components/dashboard/UsuariosAdmin'
import ProyectosAdmin from '../components/projects/ProyectosAdmin'
import type { Usuario } from '../types/dashboard'
import { clearSesion, getTokenGuardado, getUsuarioGuardado, isAdmin } from '../utils/auth'

function Dashboard() {
  const navigate = useNavigate()
  const [user] = useState<Usuario>(() => getUsuarioGuardado())
  const [usuariosCount, setUsuariosCount] = useState(0)
  const [proyectosCount, setProyectosCount] = useState(0)

  const token = useMemo(() => getTokenGuardado(), [])
  const userIsAdmin = isAdmin(user)

  useEffect(() => {
    console.info('[dashboard auth]', {
      hasToken: Boolean(token),
      usuarioDetectado: {
        email: user.email,
        role: user.role
      },
      isAdmin: userIsAdmin
    })
  }, [token, user.email, user.role, userIsAdmin])

  const logout = () => {
    clearSesion()
    navigate('/login')
  }

  const handleSessionExpired = useCallback((message?: string) => {
    console.warn('[dashboard auth] Sesion finalizada', {
      reason: message || 'Token invalido o expirado'
    })
    clearSesion()
    navigate('/login', { replace: true })
  }, [navigate])

  const handleForbidden = useCallback((message?: string) => {
    console.warn('[dashboard auth] Permisos insuficientes', {
      reason: message || 'El backend respondio 403'
    })
  }, [])

  const handleUsuariosLoaded = useCallback((usuarios: Usuario[]) => {
    setUsuariosCount(usuarios.length)
  }, [])

  if (!token || !userIsAdmin) {
    return (
      <UnauthorizedCard
        message={
          !token
            ? 'No encontramos un token activo. Inicia sesion nuevamente para entrar al dashboard.'
            : 'Tu usuario no tiene permisos de administrador para entrar al dashboard.'
        }
      />
    )
  }

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <section className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]" id="resumen">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-slate-400">Hola, {user.nombre || 'admin'}</p>
                <p className="mt-2 text-3xl font-semibold text-white">Gestion del portfolio</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Administra proyectos, revisa usuarios registrados y controla el contenido
                  que se muestra en tu portfolio.
                </p>
              </div>
              <RoleBadge role={user.role} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard
              detail="Usuarios devueltos por la API"
              label="Usuarios"
              value={String(usuariosCount)}
            />
            <StatCard
              detail="Proyectos administrados"
              label="Proyectos"
              value={String(proyectosCount)}
            />
            <StatCard
              detail="Token JWT guardado en localStorage"
              label="Sesion"
              value="Activa"
            />
          </div>
        </div>

        <div id="proyectos">
          <ProyectosAdmin
            onProyectoCountChange={setProyectosCount}
            onForbidden={handleForbidden}
            onSessionExpired={handleSessionExpired}
            token={token}
            usuario={user}
          />
        </div>

        <UsuariosAdmin
          onForbidden={handleForbidden}
          onSessionExpired={handleSessionExpired}
          onUsuariosLoaded={handleUsuariosLoaded}
          token={token}
          usuario={user}
        />
      </section>
    </DashboardLayout>
  )
}

export default Dashboard
