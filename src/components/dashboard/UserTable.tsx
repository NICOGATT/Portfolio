import type { Usuario } from '../../types/dashboard'
import EmptyState from './EmptyState'
import RoleBadge from './RoleBadge'

function UserTable({ usuarios }: { usuarios: Usuario[] }) {
  if (usuarios.length === 0) {
    return (
      <EmptyState
        detail="Cuando el backend devuelva usuarios, van a aparecer en esta tabla con su rol y datos principales."
        title="Todavia no hay usuarios"
      />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Usuario</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Numero</th>
              <th className="px-5 py-4 font-semibold">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {usuarios.map((usuario, index) => (
              <tr
                className="transition hover:bg-white/[0.04]"
                key={usuario.id || usuario.email || index}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-300/20">
                      {(usuario.nombre || usuario.email || 'U').slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-white">{usuario.nombre || 'Usuario'}</p>
                      <p className="text-xs text-slate-500">ID {usuario.id || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-300">{usuario.email || '-'}</td>
                <td className="px-5 py-4 text-sm text-slate-300">{usuario.numero || '-'}</td>
                <td className="px-5 py-4">
                  <RoleBadge role={usuario.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable
