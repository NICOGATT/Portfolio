import { type FormEvent, useEffect, useState } from 'react'
import type { Proyecto, ProyectoFormData } from '../../types/dashboard'
import { getProjectRepo, getProjectTitle } from '../../utils/responses'

const emptyProyectoForm: ProyectoFormData = {
  nombre: '',
  descripcion: '',
  urlRepo: '',
  usuarioId: ''
}

type AgregarProyectoProps = {
  editingProyecto: Proyecto | null
  isSaving: boolean
  onCancelEdit: () => void
  onSubmit: (formData: ProyectoFormData) => Promise<void>
}

function AgregarProyecto({
  editingProyecto,
  isSaving,
  onCancelEdit,
  onSubmit
}: AgregarProyectoProps) {
  const [formData, setFormData] = useState<ProyectoFormData>(emptyProyectoForm)

  useEffect(() => {
    if (!editingProyecto) {
      setFormData(emptyProyectoForm)
      return
    }

    setFormData({
      nombre: getProjectTitle(editingProyecto),
      descripcion: editingProyecto.descripcion || '',
      urlRepo: getProjectRepo(editingProyecto),
      usuarioId: String(editingProyecto.usuarioId || '')
    })
  }, [editingProyecto])

  const updateField = (field: keyof ProyectoFormData, value: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value
    }))
  }

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(formData)

    if (!editingProyecto) {
      setFormData(emptyProyectoForm)
    }
  }

  return (
    <form
      className="rounded-lg border border-white/10 bg-slate-950/45 p-5 shadow-xl shadow-black/10"
      onSubmit={submitForm}
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-white">
            {editingProyecto ? 'Editar proyecto' : 'Nuevo proyecto'}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Completa la informacion principal del proyecto.
          </p>
        </div>
        {editingProyecto && (
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            onClick={onCancelEdit}
            type="button"
          >
            Cancelar edicion
          </button>
        )}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Nombre
          <input
            className="rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
            onChange={(event) => updateField('nombre', event.target.value)}
            placeholder="Portfolio admin"
            required
            type="text"
            value={formData.nombre}
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          Descripcion
          <textarea
            className="min-h-28 resize-y rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
            onChange={(event) => updateField('descripcion', event.target.value)}
            placeholder="Describe el proyecto, stack y objetivo."
            required
            value={formData.descripcion}
          />
        </label>

        <label className="grid gap-2 text-sm text-slate-300">
          URL repositorio
          <input
            className="rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/15"
            onChange={(event) => updateField('urlRepo', event.target.value)}
            placeholder="https://github.com/..."
            required
            type="url"
            value={formData.urlRepo}
          />
        </label>
      </div>

      <button
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? 'Guardando...' : editingProyecto ? 'Guardar cambios' : 'Crear proyecto'}
      </button>
    </form>
  )
}

export default AgregarProyecto
