import type { Proyecto } from '../../types/dashboard'

type ProyectoCardProps = {
  proyecto: Proyecto
  onDelete: (proyecto: Proyecto) => void
  onEdit: (proyecto: Proyecto) => void
}

function ProyectoCard({ proyecto, onDelete, onEdit }: ProyectoCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-slate-950/45 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-cyan-300/25 hover:bg-white/[0.05]">
      <div className="aspect-[16/9] bg-slate-900">
        {proyecto.imagen ? (
          <img
            alt={proyecto.titulo}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            src={proyecto.imagen}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-sm text-slate-500">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-white">{proyecto.titulo}</p>
            <p className="mt-1 text-xs text-slate-500">ID {proyecto.id || '-'}</p>
          </div>
          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold capitalize text-cyan-200">
            {proyecto.estado || 'borrador'}
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
          {proyecto.descripcion || 'Sin descripcion cargada.'}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {proyecto.linkRepositorio && (
            <a
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              href={proyecto.linkRepositorio}
              rel="noreferrer"
              target="_blank"
            >
              Repo
            </a>
          )}
          {proyecto.linkDemo && (
            <a
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
              href={proyecto.linkDemo}
              rel="noreferrer"
              target="_blank"
            >
              Demo
            </a>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-100"
            onClick={() => onEdit(proyecto)}
            type="button"
          >
            Editar
          </button>
          <button
            className="rounded-lg border border-red-300/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:border-red-300/45 hover:bg-red-500/10"
            onClick={() => onDelete(proyecto)}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProyectoCard
