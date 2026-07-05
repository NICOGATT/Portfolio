import { type ChangeEvent, type DragEvent, type FormEvent, useEffect, useState } from 'react'
import Alert from '../../components/ui/Alert'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { TextField } from '../../components/ui/TextField'
import { technologyService } from '../../services/technologyService'
import type { Tecnologia, TecnologiaFormData } from '../../types/dashboard'

const emptyForm: TecnologiaFormData = {
  nombre: '',
  icono: '',
  iconFile: null
}

const maxIconSize = 5 * 1024 * 1024

function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Tecnologia[]>([])
  const [editingTechnology, setEditingTechnology] = useState<Tecnologia | null>(null)
  const [formData, setFormData] = useState<TecnologiaFormData>(emptyForm)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadTechnologies = async () => {
    setIsLoading(true)
    setError('')
    try {
      setTechnologies(await technologyService.list())
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos cargar tecnologias.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTechnologies()
  }, [])

  useEffect(() => {
    if (!formData.iconFile) {
      setPreviewUrl(formData.icono)
      return
    }

    const objectUrl = URL.createObjectURL(formData.iconFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [formData.iconFile, formData.icono])

  const startEdit = (technology: Tecnologia) => {
    setEditingTechnology(technology)
    setFormData({
      nombre: technology.nombre,
      icono: technology.icono || '',
      iconFile: null
    })
  }

  const cancelEdit = () => {
    setEditingTechnology(null)
    setFormData(emptyForm)
  }

  const setIconFile = (file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('El archivo del icono tiene que ser una imagen.')
      return
    }

    if (file.size > maxIconSize) {
      setError('La imagen del icono no puede superar los 5 MB.')
      return
    }

    setError('')
    setFormData((current) => ({
      ...current,
      iconFile: file,
      icono: ''
    }))
  }

  const selectIconFile = (event: ChangeEvent<HTMLInputElement>) => {
    setIconFile(event.target.files?.[0] || null)
  }

  const dropIconFile = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIconFile(event.dataTransfer.files?.[0] || null)
  }

  const clearIconFile = () => {
    setFormData((current) => ({ ...current, iconFile: null }))
  }

  const submitTechnology = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!formData.iconFile && !formData.icono.trim()) {
      setError('Selecciona una imagen local o pega una URL para el icono.')
      return
    }

    setIsSaving(true)

    try {
      if (editingTechnology) {
        await technologyService.update(editingTechnology.id, formData)
      } else {
        await technologyService.create(formData)
      }
      cancelEdit()
      await loadTechnologies()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos guardar la tecnologia.')
    } finally {
      setIsSaving(false)
    }
  }

  const removeTechnology = async (technology: Tecnologia) => {
    const confirmed = window.confirm(`Eliminar "${technology.nombre}"?`)
    if (!confirmed) return

    try {
      await technologyService.remove(technology.id)
      setTechnologies((current) => current.filter((item) => item.id !== technology.id))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No pudimos eliminar la tecnologia.')
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        description="Catalogo reutilizable para asociar tecnologias a proyectos sin repetir strings en cada formulario."
        title="Tecnologias"
      />

      {error && <Alert message={error} title="Error de tecnologias" />}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Panel className="p-5">
          <form className="grid gap-4" onSubmit={submitTechnology}>
            <h2 className="text-lg font-semibold text-white">
              {editingTechnology ? 'Editar tecnologia' : 'Nueva tecnologia'}
            </h2>
            <TextField
              label="Nombre"
              onChange={(event) => setFormData((current) => ({ ...current, nombre: event.target.value }))}
              placeholder="React"
              required
              value={formData.nombre}
            />

            <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-300">Icono</p>
                  <p className="mt-1 text-xs text-slate-500">Arrastra una imagen, selecciona un archivo o pega una URL.</p>
                </div>
                <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                  {previewUrl ? (
                    <img
                      alt=""
                      className="h-full w-full object-contain p-2"
                      src={previewUrl}
                    />
                  ) : (
                    <span className="text-xs text-slate-500">Icono</span>
                  )}
                </div>
              </div>

              <label
                className="grid cursor-pointer place-items-center gap-2 rounded-lg border border-dashed border-cyan-300/30 bg-cyan-300/10 px-4 py-5 text-center text-sm font-medium text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-300/15"
                onDragOver={(event) => event.preventDefault()}
                onDrop={dropIconFile}
              >
                <span>{formData.iconFile ? formData.iconFile.name : 'Elegir imagen desde la PC'}</span>
                <span className="text-xs font-normal text-slate-400">PNG, JPG, SVG o cualquier imagen hasta 5 MB.</span>
                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={selectIconFile}
                  type="file"
                />
              </label>

              {formData.iconFile && (
                <button
                  className="w-fit rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  onClick={clearIconFile}
                  type="button"
                >
                  Quitar imagen local
                </button>
              )}

              <TextField
                label="URL del icono"
                onChange={(event) => setFormData((current) => ({ ...current, icono: event.target.value, iconFile: null }))}
                placeholder="https://cdn.../icono.png"
                type="text"
                value={formData.icono}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? 'Guardando...' : editingTechnology ? 'Guardar' : 'Crear'}
              </button>
              {editingTechnology && (
                <button
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
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
          {isLoading ? (
            <div className="p-5 text-sm text-slate-400">Cargando tecnologias...</div>
          ) : technologies.length === 0 ? (
            <div className="p-5 text-sm text-slate-400">Todavia no hay tecnologias.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {technologies.map((technology) => (
                <article
                  className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  key={technology.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                      {technology.icono ? (
                        <img
                          alt=""
                          className="h-full w-full object-contain p-2"
                          src={technology.icono}
                        />
                      ) : (
                        <span className="text-xs text-slate-500">Sin</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{technology.nombre}</p>
                      <p className="max-w-md truncate text-sm text-slate-400">{technology.icono || 'Sin icono'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      onClick={() => startEdit(technology)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      className="rounded-lg border border-red-300/20 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
                      onClick={() => removeTechnology(technology)}
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

export default TechnologiesPage
