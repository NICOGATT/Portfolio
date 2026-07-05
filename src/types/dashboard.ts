export type Role = 'admin' | 'user'
export type EntityId = string | number

export type Usuario = {
  id?: EntityId
  nombre?: string
  email?: string
  numero?: string
  role?: Role
}

export type AuthResponse = {
  message?: string
  token?: string
  usuario?: Usuario
  user?: Usuario
}

export type ProyectoEstado = 'activo' | 'pausado' | 'finalizado' | 'borrador'

export type ImagenProyecto = {
  id: EntityId
  url: string
  proyectoId?: EntityId
  createdAt?: string
  updatedAt?: string
}

export type ContactMessage = {
  id?: number
  name: string
  email: string
  message: string
  createdAt?: string
  updatedAt?: string
}

export type Tecnologia = {
  id: EntityId
  nombre: string
  color?: string
  icono?: string
  createdAt?: string
  updatedAt?: string
}

export type Proyecto = {
  id?: EntityId
  nombre?: string
  titulo?: string
  descripcion: string
  urlRepo?: string
  linkRepositorio?: string
  linkDemo?: string
  usuarioId?: EntityId
  imagen?: string
  imagenes?: ImagenProyecto[]
  images?: ImagenProyecto[]
  tecnologias?: Tecnologia[]
  estado?: ProyectoEstado | string
  createdAt?: string
  updatedAt?: string
}

export type ProyectoFormData = {
  nombre: string
  descripcion: string
  urlRepo: string
  usuarioId: string
}

export type TecnologiaFormData = {
  nombre: string
  icono: string
  iconFile?: File | null
}

export type ImagenFormData = {
  url: string
}

export type UsuariosResponse = Usuario[] | { usuarios?: Usuario[]; message?: string }
export type ProyectosResponse = Proyecto[] | { proyectos?: Proyecto[]; data?: Proyecto[]; message?: string }
export type TecnologiasResponse = Tecnologia[] | { tecnologias?: Tecnologia[]; data?: Tecnologia[]; message?: string }
export type ImagenesResponse = ImagenProyecto[] | { images?: ImagenProyecto[]; imagenes?: ImagenProyecto[]; data?: ImagenProyecto[]; message?: string }
export type ContactMessagesResponse = ContactMessage[] | { contacts?: ContactMessage[]; contactos?: ContactMessage[]; data?: ContactMessage[]; message?: string }

export type ApiError = {
  status: number
  message: string
}
