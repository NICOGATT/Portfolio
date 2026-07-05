import { useEffect, useState } from 'react'
import EmptyState from '../dashboard/EmptyState'
import ErrorCard from '../dashboard/ErrorCard'
import LoadingSpinner from '../dashboard/LoadingSpinner'
import {
  API_URL,
  authHeaders,
  isExpiredTokenStatus,
  isJwtExpired,
  jsonAuthHeaders,
  logAuthRequest,
  logAuthResponse,
  parseApiResponse
} from '../../services/api'
import type { ApiError, Proyecto, ProyectoFormData, ProyectosResponse, Usuario } from '../../types/dashboard'
import { getProyectosFromResponse } from '../../utils/responses'
import AgregarProyecto from './AgregarProyecto'
import ProyectoCard from './ProyectoCard'

type ProyectosAdminProps = {
  onProyectoCountChange: (count: number) => void
  onForbidden: (message?: string) => void
  onSessionExpired: (message?: string) => void
  token: string
  usuario: Usuario
}

function ProyectosAdmin({
  onForbidden,
  onProyectoCountChange,
  onSessionExpired,
  token,
  usuario
}: ProyectosAdminProps) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleApiError = (error: unknown, fallbackMessage: string) => {
    const apiError = error as Partial<ApiError>

    if (apiError.status && isExpiredTokenStatus(apiError.status)) {
      onSessionExpired('El token expiro o no es valido.')
      return
    }

    if (apiError.status === 403) {
      onForbidden('El backend rechazo permisos para administrar proyectos.')
      setError('El backend rechazo permisos para administrar proyectos. Revisa que el token corresponda a un usuario admin.')
      return
    }

    if (apiError.status === 404) {
      setError('La ruta /api/proyectos no existe en el backend que esta corriendo. Revisa el nombre real de la ruta de proyectos.')
      return
    }

    if (apiError.status && apiError.status >= 500) {
      setError('El servidor tuvo un problema al administrar proyectos.')
      return
    }

    setError(apiError.message || fallbackMessage)
  }

  const updateProyectos = (nextProyectos: Proyecto[]) => {
    setProyectos(nextProyectos)
    onProyectoCountChange(nextProyectos.length)
  }

  const getProyectos = async (signal?: AbortSignal) => {
    if (!token) return

    if (isJwtExpired(token)) {
      onSessionExpired('El token guardado esta vencido.')
      return
    }

    setIsLoading(true)
    setError('')
    logAuthRequest({
      endpoint: 'GET /api/proyectos',
      token,
      usuario
    })

    try {
      const res = await fetch(`${API_URL}/api/proyectos`, {
        headers: authHeaders(token),
        signal
      })
      logAuthResponse({
        endpoint: 'GET /api/proyectos',
        status: res.status
      })
      const data = await parseApiResponse<ProyectosResponse>(res)
      updateProyectos(getProyectosFromResponse(data))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      handleApiError(error, 'No pudimos cargar los proyectos.')
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    getProyectos(controller.signal)

    return () => controller.abort()
  }, [token])

  const saveProyecto = async (formData: ProyectoFormData) => {
    if (isJwtExpired(token)) {
      onSessionExpired('El token guardado esta vencido.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const isEditing = Boolean(editingProyecto?.id)
      const endpoint = isEditing
        ? `${isEditing ? 'PUT' : 'POST'} /api/proyectos/${editingProyecto?.id}`
        : 'POST /api/proyectos'
      logAuthRequest({
        endpoint,
        token,
        usuario
      })
      const res = await fetch(
        isEditing
          ? `${API_URL}/api/proyectos/${editingProyecto?.id}`
          : `${API_URL}/api/proyectos`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: jsonAuthHeaders(token),
          body: JSON.stringify(formData)
        }
      )
      logAuthResponse({
        endpoint,
        status: res.status
      })

      await parseApiResponse<Proyecto | { proyecto?: Proyecto; message?: string }>(res)
      setEditingProyecto(null)
      await getProyectos()
    } catch (error) {
      handleApiError(error, 'No pudimos guardar el proyecto.')
    } finally {
      setIsSaving(false)
    }
  }

  const deleteProyecto = async (proyecto: Proyecto) => {
    if (isJwtExpired(token)) {
      onSessionExpired('El token guardado esta vencido.')
      return
    }

    if (!proyecto.id) {
      setError('No pudimos identificar el proyecto para eliminarlo.')
      return
    }

    const confirmed = window.confirm(`Eliminar "${proyecto.titulo}"? Esta accion no se puede deshacer.`)
    if (!confirmed) return

    setError('')

    try {
      logAuthRequest({
        endpoint: `DELETE /api/proyectos/${proyecto.id}`,
        token,
        usuario
      })
      const res = await fetch(`${API_URL}/api/proyectos/${proyecto.id}`, {
        method: 'DELETE',
        headers: authHeaders(token)
      })
      logAuthResponse({
        endpoint: `DELETE /api/proyectos/${proyecto.id}`,
        status: res.status
      })

      await parseApiResponse<{ message?: string }>(res)
      const nextProyectos = proyectos.filter((currentProyecto) => currentProyecto.id !== proyecto.id)
      updateProyectos(nextProyectos)

      if (editingProyecto?.id === proyecto.id) {
        setEditingProyecto(null)
      }
    } catch (error) {
      handleApiError(error, 'No pudimos eliminar el proyecto.')
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <AgregarProyecto
        editingProyecto={editingProyecto}
        isSaving={isSaving}
        onCancelEdit={() => setEditingProyecto(null)}
        onSubmit={saveProyecto}
      />

      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Proyectos</p>
            <p className="mt-1 text-sm text-slate-400">
              Gestion completa desde <span className="font-mono text-cyan-300">/api/proyectos</span>.
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-400">
            {proyectos.length} proyectos
          </span>
        </div>

        {isLoading && (
          <LoadingSpinner
            detail="Buscando tus proyectos publicados y borradores..."
            title="Cargando proyectos"
          />
        )}

        {!isLoading && error && (
          <ErrorCard message={error} title="No se pudo completar la accion" />
        )}

        {!isLoading && !error && proyectos.length === 0 && (
          <EmptyState
            detail="Crea tu primer proyecto desde el formulario y se va a listar automaticamente aca."
            title="Todavia no hay proyectos"
          />
        )}

        {!isLoading && !error && proyectos.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {proyectos.map((proyecto, index) => (
              <ProyectoCard
                key={proyecto.id || `${proyecto.titulo}-${index}`}
                onDelete={deleteProyecto}
                onEdit={setEditingProyecto}
                proyecto={proyecto}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProyectosAdmin
