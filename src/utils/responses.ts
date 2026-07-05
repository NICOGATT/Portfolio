import type {
  ContactMessage,
  ContactMessagesResponse,
  ImagenProyecto,
  ImagenesResponse,
  Proyecto,
  ProyectosResponse,
  Tecnologia,
  TecnologiasResponse,
  Usuario,
  UsuariosResponse
} from '../types/dashboard'
import { API_URL } from '../services/httpClient'

export const getUsuariosFromResponse = (data: UsuariosResponse): Usuario[] => {
  if (Array.isArray(data)) return data
  return data.usuarios || []
}

export const getProyectosFromResponse = (data: ProyectosResponse): Proyecto[] => {
  if (Array.isArray(data)) return data
  return data.proyectos || data.data || []
}

export const getTecnologiasFromResponse = (data: TecnologiasResponse): Tecnologia[] => {
  if (Array.isArray(data)) return data
  return data.tecnologias || data.data || []
}

export const getImagenesFromResponse = (data: ImagenesResponse): ImagenProyecto[] => {
  if (Array.isArray(data)) return data
  return data.images || data.imagenes || data.data || []
}

export const getContactMessagesFromResponse = (data: ContactMessagesResponse): ContactMessage[] => {
  if (Array.isArray(data)) return data
  return data.contacts || data.contactos || data.data || []
}

export const getProjectTitle = (proyecto: Proyecto) => proyecto.nombre || proyecto.titulo || 'Proyecto'
export const getProjectRepo = (proyecto: Proyecto) => proyecto.urlRepo || proyecto.linkRepositorio || ''

export const getImageUrl = (url?: string) => {
  if (!url) return ''
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:') || url.startsWith('blob:')) return url

  const normalizedUrl = url.startsWith('/') ? url : `/uploads/${url}`
  return `${API_URL}${normalizedUrl}`
}

export const getProjectCover = (proyecto: Proyecto) =>
  getImageUrl(proyecto.imagenes?.[0]?.url || proyecto.images?.[0]?.url || proyecto.imagen || '')
