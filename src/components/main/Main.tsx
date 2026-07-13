import { useEffect, useState } from 'react'
import './main.css'
import avatar from '../../assets/Avatar.png'
import ProjectShowcaseCard from '../projects/ProjectShowcaseCard'
import { projectService } from '../../services/projectService'
import type { Proyecto } from '../../types/dashboard'
import Contact from '../contact/Contact'

function Main() {
  const [projects, setProjects] = useState<Proyecto[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjects(await projectService.listPublic())
      } catch (error) {
        setProjectsError(error instanceof Error ? error.message : 'No pudimos cargar proyectos.')
      } finally {
        setIsLoadingProjects(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <main className="home-main">
      <section id="home">
        <div className="hero grid grid-cols-1 md:grid-cols-2 justify-items-center items-center rounded-xl bg-blue-500">
            <div className='biografia'>
                <h1 className='typing-title titulo'>Hi, I'm Nico Dev</h1>
                <h2>Software Engineer</h2>
                <button className='contactMe rounded-xl bg-black transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-black'>
                    <a href="#contact" className='linkContact'>Contact</a>
                </button>
            </div>
            <div>
                <img src={avatar} alt="Avatar" className='w-56 sm:w-72 md:w-80' />
            </div>
        </div>
      </section>

      <section id="about">
        <h2>About</h2>
        <p>Desarrollador full stack enfocado en construir aplicaciones modernas, sistemas escalables y soluciones reales.</p>
        <p>
          Trabajo principalmente con React, TypeScript, Node.js y bases de datos SQL, combinando frontend, backend e infraestructura para crear productos completos.
        </p>
        <p>
        </p>
        <p>
          Actualmente desarrollo sistemas de gestión, dashboards administrativos y aplicaciones móviles, mientras profundizo en arquitectura backend, autenticación, Docker y despliegue de servidores.
        </p>
        <p>
          Mi objetivo es crear tecnología útil, escalable y profesional, tanto para proyectos propios como para futuros productos y empresas.
        </p>
      </section>

      <section id="projects">
        <div className="projects-header">
          <h2>Projects</h2>
          <p>
            Una seleccion de proyectos reales, con repositorio, tecnologias e imagenes creadas por mi cuenta para que vean como 
            es mi forma de trabajar 
          </p>
        </div>

        {isLoadingProjects && (
          <div className="projects-state">Cargando proyectos...</div>
        )}

        {!isLoadingProjects && projectsError && (
          <div className="projects-state projects-error">{projectsError}</div>
        )}

        {!isLoadingProjects && !projectsError && projects.length === 0 && (
          <div className="projects-state">Todavia no hay proyectos publicados.</div>
        )}

        {!isLoadingProjects && !projectsError && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((proyecto, index) => (
              <ProjectShowcaseCard
                key={proyecto.id || `${proyecto.nombre || proyecto.titulo}-${index}`}
                proyecto={proyecto}
              />
            ))}
          </div>
        )}
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <Contact/>
      </section>
    </main>
  )
}

export default Main
