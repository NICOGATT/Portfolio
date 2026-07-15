import type { ImagenProyecto, Proyecto, Tecnologia } from './dashboard'

export type HomeInitialData = {
  kind: 'home'
  projects: Proyecto[]
}

export type ProjectInitialData = {
  kind: 'project'
  project: Proyecto
  images: ImagenProyecto[]
  technologies: Tecnologia[]
}

export type InitialData = HomeInitialData | ProjectInitialData

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData
  }
}
