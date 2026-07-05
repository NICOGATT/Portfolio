import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Alert from '../../components/ui/Alert'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { projectService } from '../../services/projectService'
import { technologyService } from '../../services/technologyService'
import type { EntityId, ImagenProyecto, Proyecto, Tecnologia } from '../../types/dashboard'
import { getImageUrl, getProjectTitle } from '../../utils/responses'

function ProjectMediaPage() {
  const [projects, setProjects] = useState<Proyecto[]>([])
  const [technologies, setTechnologies] = useState<Tecnologia[]>([])
  const [images, setImages] = useState<ImagenProyecto[]>([])
  const [projectTechnologies, setProjectTechnologies] = useState<Tecnologia[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<EntityId | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<EntityId[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId),
    [projects, selectedProjectId]
  )

  useEffect(() => {
    const loadBaseData = async () => {
      setError('')
      setIsLoading(true)
      try {
        const [projectsFromApi, technologiesFromApi] = await Promise.all([
          projectService.list(),
          technologyService.list()
        ])
        setProjects(projectsFromApi)
        setTechnologies(technologiesFromApi)
        setSelectedProjectId(projectsFromApi[0]?.id || null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No pudimos cargar datos.')
      } finally {
        setIsLoading(false)
      }
    }

    loadBaseData()
  }, [])

  useEffect(() => {
    if (!selectedProjectId) return

    const loadProjectRelations = async () => {
      setError('')
      try {
        const [imagesFromApi, technologiesFromApi] = await Promise.all([
          projectService.listImages(selectedProjectId),
          projectService.listTechnologies(selectedProjectId)
        ])
        setImages(imagesFromApi)
        setProjectTechnologies(technologiesFromApi)
        setSelectedTechnologyIds(technologiesFromApi.map((technology) => technology.id))
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No pudimos cargar relaciones.')
      }
    }

    loadProjectRelations()
  }, [selectedProjectId])

  const submitImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedProjectId || imageFiles.length === 0) return

    try {
      await projectService.addImages(selectedProjectId, imageFiles)
      setImageFiles([])
      setImages(await projectService.listImages(selectedProjectId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos agregar la imagen.')
    }
  }

  const removeImage = async (image: ImagenProyecto) => {
    if (!selectedProjectId) return

    try {
      await projectService.removeImage(image.id)
      setImages((current) => current.filter((item) => item.id !== image.id))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos eliminar la imagen.')
    }
  }

  const toggleTechnology = (technologyId: EntityId) => {
    setSelectedTechnologyIds((current) =>
      current.includes(technologyId)
        ? current.filter((id) => id !== technologyId)
        : [...current, technologyId]
    )
  }

  const saveTechnologies = async () => {
    if (!selectedProjectId) return
    if (selectedTechnologyIds.length === 0) {
      setError('Selecciona al menos una tecnologia para asociar.')
      return
    }

    try {
      await projectService.updateTechnologies(selectedProjectId, selectedTechnologyIds)
      setProjectTechnologies(await projectService.listTechnologies(selectedProjectId))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos asociar tecnologias.')
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Gestiona assets y relaciones N:N desde una pantalla separada para que el CRUD de proyectos siga simple."
        title="Imagenes y asociaciones"
      />

      {error && <Alert message={error} title="Error de relaciones" />}

      <Panel className="p-5">
        <label className="grid gap-2 text-sm font-medium text-slate-300">
          Proyecto
          <select
            className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-300/70 focus:ring-3 focus:ring-cyan-300/15"
            disabled={isLoading || projects.length === 0}
            onChange={(event) => setSelectedProjectId(event.target.value)}
            value={selectedProjectId || ''}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {getProjectTitle(project)}
              </option>
            ))}
          </select>
        </label>
      </Panel>

      {selectedProject && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel className="p-5">
            <form className="grid gap-4" onSubmit={submitImage}>
              <div>
                <h2 className="text-lg font-semibold text-white">Imagenes</h2>
                <p className="mt-1 text-sm text-slate-400">{getProjectTitle(selectedProject)}</p>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Archivos
                <input
                  accept="image/*"
                  className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-950"
                  multiple
                  onChange={(event) => setImageFiles(Array.from(event.target.files || []))}
                  type="file"
                />
                <span className="text-xs text-slate-500">{imageFiles.length} archivos seleccionados</span>
              </label>
              <button className="w-fit rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200">
                Subir imagenes
              </button>
            </form>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {images.map((image) => (
                <article className="overflow-hidden rounded-lg border border-white/10 bg-slate-950" key={image.id}>
                  <img alt="" className="aspect-video w-full object-cover" src={getImageUrl(image.url)} />
                  <button
                    className="w-full border-t border-white/10 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                    onClick={() => removeImage(image)}
                    type="button"
                  >
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Tecnologias asociadas</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {projectTechnologies.length} asociadas actualmente
                </p>
              </div>
              <button
                className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
                onClick={saveTechnologies}
                type="button"
              >
                Guardar
              </button>
            </div>

            <div className="mt-5 grid gap-2">
              {technologies.map((technology) => (
                <label
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm font-medium text-slate-300"
                  key={technology.id}
                >
                  <span>{technology.nombre}</span>
                  <input
                    checked={selectedTechnologyIds.includes(technology.id)}
                    onChange={() => toggleTechnology(technology.id)}
                    type="checkbox"
                  />
                </label>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}

export default ProjectMediaPage
