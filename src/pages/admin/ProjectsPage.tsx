import { type FormEvent, useEffect, useMemo, useState } from 'react'
import Alert from '../../components/ui/Alert'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { TextAreaField, TextField } from '../../components/ui/TextField'
import { useAuth } from '../../context/AuthContext'
import { projectService } from '../../services/projectService'
import { technologyService } from '../../services/technologyService'
import type { EntityId, ImagenProyecto, Proyecto, ProyectoFormData, Tecnologia } from '../../types/dashboard'
import { getImageUrl, getProjectCover, getProjectRepo, getProjectTitle } from '../../utils/responses'

const emptyForm: ProyectoFormData = {
  nombre: '',
  descripcion: '',
  urlRepo: '',
  usuarioId: ''
}

function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Proyecto[]>([])
  const [technologies, setTechnologies] = useState<Tecnologia[]>([])
  const [editingProject, setEditingProject] = useState<Proyecto | null>(null)
  const [formData, setFormData] = useState<ProyectoFormData>(emptyForm)
  const [existingImages, setExistingImages] = useState<ImagenProyecto[]>([])
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([])
  const [deletingImageId, setDeletingImageId] = useState<EntityId | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<EntityId[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isEditing = Boolean(editingProject?.id)

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => getProjectTitle(a).localeCompare(getProjectTitle(b))),
    [projects]
  )

  const loadProjects = async () => {
    setIsLoading(true)
    setError('')
    try {
      setProjects(await projectService.list())
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos cargar proyectos.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoading(true)
      setError('')
      try {
        const [projectsFromApi, technologiesFromApi] = await Promise.all([
          projectService.list(),
          technologyService.list()
        ])
        setProjects(projectsFromApi)
        setTechnologies(technologiesFromApi)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'No pudimos cargar datos.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPageData()
  }, [])

  const startEdit = async (project: Proyecto) => {
    setEditingProject(project)
    setFormData({
      nombre: getProjectTitle(project),
      descripcion: project.descripcion || '',
      urlRepo: getProjectRepo(project),
      usuarioId: String(project.usuarioId || user?.id || '')
    })
    setError('')

    if (!project.id) return

    try {
      const [projectImages, projectTechnologies] = await Promise.all([
        projectService.listImages(project.id),
        projectService.listTechnologies(project.id)
      ])
      setExistingImages(projectImages)
      setSelectedImageFiles([])
      setFileInputKey((current) => current + 1)
      setSelectedTechnologyIds(projectTechnologies.map((technology) => technology.id))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos cargar relaciones del proyecto.')
    }
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setFormData(emptyForm)
    setExistingImages([])
    setSelectedImageFiles([])
    setFileInputKey((current) => current + 1)
    setSelectedTechnologyIds([])
  }

  const toggleTechnology = (technologyId: EntityId) => {
    setSelectedTechnologyIds((current) =>
      current.includes(technologyId)
        ? current.filter((id) => id !== technologyId)
        : [...current, technologyId]
    )
  }

  const getSavedProjectId = (project: Proyecto | { data?: Proyecto; proyecto?: Proyecto }) => {
    if ('id' in project && project.id) return project.id
    if ('data' in project) return project.data?.id
    if ('proyecto' in project) return project.proyecto?.id
    return undefined
  }

  const submitProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      if (!user?.id) {
        throw new Error('No pudimos identificar el usuario logueado para crear el proyecto.')
      }

      const projectPayload = {
        ...formData,
        usuarioId: String(user.id)
      }
      let projectId = editingProject?.id

      if (editingProject?.id) {
        await projectService.update(editingProject.id, projectPayload)
      } else {
        const createdProject = await projectService.create(projectPayload)
        projectId = getSavedProjectId(createdProject)
      }

      if (!projectId) {
        throw new Error('El backend no devolvio el ID del proyecto guardado.')
      }

      await Promise.all([
        selectedImageFiles.length > 0 ? projectService.addImages(projectId, selectedImageFiles) : Promise.resolve(),
        selectedTechnologyIds.length > 0
          ? projectService.updateTechnologies(projectId, selectedTechnologyIds)
          : Promise.resolve()
      ])

      cancelEdit()
      await loadProjects()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos guardar el proyecto.')
    } finally {
      setIsSaving(false)
    }
  }

  const removeProjectImage = async (image: ImagenProyecto) => {
    const confirmed = window.confirm('Eliminar esta imagen del proyecto?')
    if (!confirmed) return

    setError('')
    setDeletingImageId(image.id)

    try {
      await projectService.removeImage(image.id)
      setExistingImages((current) => current.filter((item) => item.id !== image.id))
      await loadProjects()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos eliminar la imagen.')
    } finally {
      setDeletingImageId(null)
    }
  }

  const removeProject = async (project: Proyecto) => {
    if (!project.id) return
    const confirmed = window.confirm(`Eliminar "${getProjectTitle(project)}"?`)
    if (!confirmed) return

    try {
      await projectService.remove(project.id)
      setProjects((current) => current.filter((item) => item.id !== project.id))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos eliminar el proyecto.')
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Crea proyectos completos con datos base, imagenes 1:N y tecnologias N:N desde el mismo flujo."
        title="Proyectos"
      />

      {error && <Alert message={error} title="Error de proyectos" />}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Panel className="p-5">
          <form className="grid gap-4" onSubmit={submitProject}>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Carga la informacion principal y relaciona el contenido antes de guardar.
              </p>
            </div>

            <TextField
              label="Nombre"
              onChange={(event) => setFormData((current) => ({ ...current, nombre: event.target.value }))}
              placeholder="Dashboard de portfolio"
              required
              value={formData.nombre}
            />
            <TextAreaField
              label="Descripcion"
              onChange={(event) => setFormData((current) => ({ ...current, descripcion: event.target.value }))}
              placeholder="Objetivo, stack y valor del proyecto."
              required
              value={formData.descripcion}
            />
            <TextField
              label="URL repositorio"
              onChange={(event) => setFormData((current) => ({ ...current, urlRepo: event.target.value }))}
              placeholder="https://github.com/usuario/repo"
              required
              type="url"
              value={formData.urlRepo}
            />

            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Imagenes
                <input
                  accept="image/*"
                  className="rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-cyan-300 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-950"
                  key={fileInputKey}
                  multiple
                  onChange={(event) => setSelectedImageFiles(Array.from(event.target.files || []))}
                  type="file"
                />
                <span className="text-xs text-slate-500">
                  {selectedImageFiles.length} imagenes listas para subir
                </span>
              </label>

              {selectedImageFiles.length > 0 && (
                <div className="grid gap-2 rounded-lg border border-white/10 bg-slate-950/60 p-3">
                  {selectedImageFiles.map((file) => (
                    <p className="truncate text-xs text-slate-400" key={`${file.name}-${file.lastModified}`}>
                      {file.name}
                    </p>
                  ))}
                </div>
              )}

              {existingImages.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {existingImages.map((image) => (
                    <article className="overflow-hidden rounded-lg border border-white/10 bg-slate-950" key={image.id}>
                      <img alt="" className="aspect-video w-full object-cover" src={getImageUrl(image.url)} />
                      <button
                        className="w-full border-t border-white/10 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={deletingImageId === image.id}
                        onClick={() => removeProjectImage(image)}
                        type="button"
                      >
                        {deletingImageId === image.id ? 'Eliminando...' : 'Eliminar imagen'}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <div>
                <p className="text-sm font-medium text-slate-300">Tecnologias</p>
                <p className="mt-1 text-xs text-slate-500">
                  Selecciona todas las tecnologias que pertenecen al proyecto.
                </p>
              </div>

              {technologies.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-slate-500">
                  Todavia no hay tecnologias cargadas.
                </div>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {technologies.map((technology) => {
                    const isSelected = selectedTechnologyIds.includes(technology.id)

                    return (
                      <button
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition ${
                          isSelected
                            ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100'
                            : 'border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/[0.05]'
                        }`}
                        key={technology.id}
                        onClick={() => toggleTechnology(technology.id)}
                        type="button"
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ background: technology.color || '#67e8f9' }}
                        />
                        {technology.nombre}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear proyecto completo'}
              </button>
              {isEditing && (
                <button
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  onClick={cancelEdit}
                  type="button"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </Panel>

        <Panel className="overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="font-semibold text-white">Listado</p>
            <p className="mt-1 text-sm text-slate-400">{projects.length} proyectos cargados</p>
          </div>

          {isLoading ? (
            <div className="p-5 text-sm text-slate-400">Cargando proyectos...</div>
          ) : sortedProjects.length === 0 ? (
            <div className="p-5 text-sm text-slate-400">Todavia no hay proyectos.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {sortedProjects.map((project) => (
                <article className="grid gap-4 p-5 md:grid-cols-[140px_1fr_auto]" key={project.id}>
                  <div className="aspect-video overflow-hidden rounded-lg bg-slate-950">
                    {getProjectCover(project) ? (
                      <img
                        alt={getProjectTitle(project)}
                        className="h-full w-full object-cover"
                        src={getProjectCover(project)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-500">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{getProjectTitle(project)}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {project.descripcion}
                    </p>
                    {getProjectRepo(project) && (
                      <a
                        className="mt-2 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                        href={getProjectRepo(project)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Repositorio
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      onClick={() => {
                        void startEdit(project)
                      }}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="rounded-lg border border-red-300/20 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                      onClick={() => removeProject(project)}
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

export default ProjectsPage
