import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Resumen', to: '/admin' },
  { label: 'Proyectos', to: '/admin/projects' },
  { label: 'Tecnologias', to: '/admin/technologies' },
  { label: 'Imagenes', to: '/admin/images' },
  { label: 'Mensajes', to: '/admin/messages' }
]

function AdminLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_28%)]" />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-slate-950/90 px-4 py-5 backdrop-blur-xl lg:block">
        <NavLink className="flex items-center gap-3" to="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300 text-sm font-black text-slate-950">
            ND
          </span>
          <div>
            <p className="font-semibold text-white">Portfolio Admin</p>
            <p className="text-xs text-slate-500">Content manager</p>
          </div>
        </NavLink>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/[0.08] text-white ring-1 ring-white/10'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                }`
              }
              end={item.to === '/admin'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? 'bg-white/[0.10] text-white' : 'bg-white/[0.05] text-slate-300'
                    }`
                  }
                  end={item.to === '/admin'}
                  key={item.to}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center justify-between gap-3 sm:ml-auto">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.nombre || 'Admin'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
                onClick={handleLogout}
                type="button"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
