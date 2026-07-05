import type { EntityId, Tecnologia, TecnologiaFormData, TecnologiasResponse } from '../types/dashboard'
import { getTecnologiasFromResponse } from '../utils/responses'
import { apiRequest } from './httpClient'

const toTechnologyFormData = (payload: TecnologiaFormData) => {
  const formData = new FormData()
  formData.append('nombre', payload.nombre)

  if (payload.iconFile) {
    formData.append('icono', payload.iconFile)
  } else {
    formData.append('icono', payload.icono.trim())
  }

  return formData
}

export const technologyService = {
  async list() {
    const data = await apiRequest<TecnologiasResponse>('/api/tecnologias')
    return getTecnologiasFromResponse(data)
  },

  create: (payload: TecnologiaFormData) =>
    apiRequest<Tecnologia>('/api/tecnologia', {
      method: 'POST',
      body: toTechnologyFormData(payload)
    }),

  update: (id: EntityId, payload: TecnologiaFormData) =>
    apiRequest<Tecnologia>(`/api/tecnologia/${id}`, {
      method: 'PATCH',
      body: toTechnologyFormData(payload)
    }),

  remove: (id: EntityId) =>
    apiRequest<{ message?: string }>(`/api/tecnologia/${id}`, {
      method: 'DELETE'
    })
}
