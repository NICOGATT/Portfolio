import { Link } from 'react-router-dom'
import type { Proyecto } from '../../types/dashboard'
import { getProjectCover, getProjectRepo, getProjectTitle } from '../../utils/responses'

type ProjectShowcaseCardProps = {
  proyecto: Proyecto
}

function ProjectShowcaseCard({ proyecto }: ProjectShowcaseCardProps) {
  const title = getProjectTitle(proyecto)
  const cover = getProjectCover(proyecto)
  const repo = getProjectRepo(proyecto)

  return (
    <article className="group overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.04]">
      <div className="aspect-[16/8] overflow-hidden bg-slate-900">
        {cover ? (
          <img
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            src={cover}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-500">
            Proyecto sin imagen
          </div>
        )}
      </div>

      <div className="grid gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
            {proyecto.descripcion || 'Proyecto en desarrollo.'}
          </p>
        </div>

        {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {proyecto.tecnologias.map((tecnologia) => (
              <span
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-100"
                key={tecnologia.id}
              >
                {tecnologia.nombre}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {proyecto.id && (
            <Link
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
              to={`/projects/${proyecto.id}`}
            >
              Ver mas
            </Link>
          )}
          {repo && (
            <a
              className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/15"
              href={repo}
              rel="noreferrer"
              target="_blank"
            >
              Ver repositorio
            </a>
          )}
          {proyecto.linkDemo && (
            <a
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
              href={proyecto.linkDemo}
              rel="noreferrer"
              target="_blank"
            >
              Ver demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectShowcaseCard
