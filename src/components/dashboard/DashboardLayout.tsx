import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Usuario } from '../../types/dashboard'
import RoleBadge from './RoleBadge'

type DashboardLayoutProps = {
  children: ReactNode
  user: Usuario
  onLogout: () => void
}

function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_26%)]" />

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-slate-950/80 px-5 py-6 backdrop-blur-xl lg:block">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950">
            ND
          </span>
          <div>
            <p className="font-semibold text-white">Nico Admin</p>
            <p className="text-xs text-slate-500">Portfolio control</p>
          </div>
        </Link>

        <nav className="mt-10 grid gap-2">
          <a
            className="rounded-lg bg-white/[0.06] px-4 py-3 text-sm font-medium text-white ring-1 ring-white/10 transition hover:bg-white/[0.08]"
            href="#resumen"
          >
            Resumen
          </a>
          <a
            className="rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            href="#proyectos"
          >
            Proyectos
          </a>
          <a
            className="rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            href="#usuarios"
          >
            Usuarios
          </a>
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Dashboard
              </p>
              <p className="mt-1 text-xl font-semibold text-white">Panel administrativo</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{user.nombre || user.email}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <RoleBadge role={user.role} />
              <button
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-red-300/40 hover:bg-red-500/10 hover:text-red-200"
                onClick={onLogout}
                type="button"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8 lg:px-10">{children}</div>
      </div>
    </div>
  )
}

export default DashboardLayout
