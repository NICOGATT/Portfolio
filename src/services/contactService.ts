import type { ContactMessagesResponse } from '../types/dashboard'
import { getContactMessagesFromResponse } from '../utils/responses'
import { apiRequest } from './httpClient'

export const contactService = {
  async list() {
    const data = await apiRequest<ContactMessagesResponse>('/api/contact')
    return getContactMessagesFromResponse(data)
  },

  remove: (id: number) =>
    apiRequest<{ message?: string }>(`/api/contact/${id}`, {
      method: 'DELETE'
    })
}
