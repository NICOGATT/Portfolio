import type { Role } from '../../types/dashboard'

function RoleBadge({ role }: { role?: Role }) {
  const isAdmin = role === 'admin'

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
        isAdmin
          ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-300/25'
          : 'bg-slate-700/60 text-slate-300 ring-white/10'
      }`}
    >
      {isAdmin ? 'Admin' : 'User'}
    </span>
  )
}

export default RoleBadge
