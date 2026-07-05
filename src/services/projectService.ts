import type {
  EntityId,
  ImagenProyecto,
  ImagenesResponse,
  Proyecto,
  ProyectoFormData,
  ProyectosResponse,
  Tecnologia,
  TecnologiasResponse
} from '../types/dashboard'
import { getImagenesFromResponse, getProyectosFromResponse, getTecnologiasFromResponse } from '../utils/responses'
import { apiRequest } from './httpClient'

type ProjectMutationResponse = Proyecto | { message?: string; data?: Proyecto; proyecto?: Proyecto }

export const projectService = {
  async list() {
    const data = await apiRequest<ProyectosResponse>('/api/proyectos')
    return getProyectosFromResponse(data)
  },

  async listPublic() {
    const data = await apiRequest<ProyectosResponse>('/api/proyectos', { skipAuth: true })
    return getProyectosFromResponse(data)
  },

  getById: (id: EntityId) => apiRequest<Proyecto>(`/api/proyectos/${id}`),

  getPublicById: (id: EntityId) => apiRequest<Proyecto>(`/api/proyectos/${id}`, { skipAuth: true }),

  create: (payload: ProyectoFormData) =>
    apiRequest<ProjectMutationResponse>('/api/proyectos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  update: (id: EntityId, payload: ProyectoFormData) =>
    apiRequest<ProjectMutationResponse>(`/api/proyectos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  remove: (id: EntityId) =>
    apiRequest<{ message?: string }>(`/api/proyectos/${id}`, {
      method: 'DELETE'
    }),

  async listImages(id: EntityId) {
    const data = await apiRequest<ImagenesResponse>(`/api/proyectos/${id}/images`)
    return getImagenesFromResponse(data)
  },

  async listPublicImages(id: EntityId) {
    const data = await apiRequest<ImagenesResponse>(`/api/proyectos/${id}/images`, { skipAuth: true })
    return getImagenesFromResponse(data)
  },

  addImages: (id: EntityId, files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    return apiRequest<{ message?: string; data?: ImagenProyecto[] }>(`/api/proyectos/${id}/images`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  removeImage: (id: EntityId) =>
    apiRequest<{ message?: string }>(`/api/images/${id}`, {
      method: 'DELETE'
    }),

  async listTechnologies(id: EntityId) {
    const data = await apiRequest<TecnologiasResponse>(`/api/proyectos/${id}/tecnologias`)
    return getTecnologiasFromResponse(data)
  },

  async listPublicTechnologies(id: EntityId) {
    const data = await apiRequest<TecnologiasResponse>(`/api/proyectos/${id}/tecnologias`, { skipAuth: true })
    return getTecnologiasFromResponse(data)
  },

  addTechnologies: (id: EntityId, tecnologiaIds: EntityId[]) =>
    apiRequest<Tecnologia[]>(`/api/proyectos/${id}/tecnologias`, {
      method: 'POST',
      body: JSON.stringify({ tecnologias: tecnologiaIds })
    }),

  updateTechnologies: (id: EntityId, tecnologiaIds: EntityId[]) =>
    apiRequest<Tecnologia[]>(`/api/proyectos/${id}/tecnologias`, {
      method: 'PATCH',
      body: JSON.stringify({ tecnologias: tecnologiaIds })
    }),

  removeTechnology: (id: EntityId, tecnologiaId: EntityId) =>
    apiRequest<{ message?: string }>(`/api/proyectos/${id}/tecnologias/${tecnologiaId}`, {
      method: 'DELETE'
    })
}
