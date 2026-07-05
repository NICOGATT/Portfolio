import { Link } from 'react-router-dom'

function UnauthorizedCard({ message }: { message?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-lg font-semibold text-red-300 ring-1 ring-red-400/25">
          !
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-300">
          Acceso denegado
        </p>
        <p className="mt-3 text-2xl font-semibold text-white">No pudimos abrir el dashboard</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {message ||
            'Tu sesion pudo haber expirado o tu usuario no tiene permisos de administrador. Volve a iniciar sesion con una cuenta admin para continuar.'}
        </p>
        <Link
          className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          to="/login"
        >
          Volver al login
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedCard
