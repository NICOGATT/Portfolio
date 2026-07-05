import { useEffect, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { projectService } from '../../services/projectService'
import { technologyService } from '../../services/technologyService'

function AdminOverview() {
  const [projectCount, setProjectCount] = useState(0)
  const [technologyCount, setTechnologyCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [projects, technologies] = await Promise.all([
          projectService.list(),
          technologyService.list()
        ])
        setProjectCount(projects.length)
        setTechnologyCount(technologies.length)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No pudimos cargar el resumen.')
      }
    }

    loadSummary()
  }, [])

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Vista rapida del contenido administrable. Esta pagina queda lista para sumar metricas, ingresos y datos en tiempo real mas adelante."
        title="Resumen"
      />

      {error && (
        <Panel className="border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">{error}</Panel>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Panel className="p-5">
          <p className="text-sm text-slate-400">Proyectos</p>
          <p className="mt-3 text-3xl font-semibold text-white">{projectCount}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-slate-400">Tecnologias</p>
          <p className="mt-3 text-3xl font-semibold text-white">{technologyCount}</p>
        </Panel>
        <Panel className="p-5">
          <p className="text-sm text-slate-400">Sesion</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-300">Activa</p>
        </Panel>
      </div>

      <Panel className="p-5">
        <h2 className="text-lg font-semibold text-white">Arquitectura aplicada</h2>
        <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-400 md:grid-cols-2">
          <p>
            Las paginas consumen servicios por dominio, no endpoints sueltos. Eso permite cambiar
            rutas, headers o manejo de errores en un solo lugar.
          </p>
          <p>
            La sesion vive en AuthContext. Los guards protegen rutas y el layout solo renderiza
            pantallas internas cuando hay JWT y rol admin.
          </p>
        </div>
      </Panel>
    </div>
  )
}

export default AdminOverview
