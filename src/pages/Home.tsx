import Main from '../components/main/Main'
import type { HomeInitialData } from '../types/prerender'
import PageSeo from '../components/seo/PageSeo'

const siteUrl = 'https://nicosdev.com.ar'
const description = 'Desarrollador Full Stack especializado en React, Node.js y Flutter. Desarrollo sitios web, sistemas y aplicaciones para empresas y emprendedores de Argentina.'

type HomeProps = {
  initialData?: HomeInitialData
}

function Home({ initialData }: HomeProps) {
  return (
    <>
      <PageSeo
        canonical={`${siteUrl}/`}
        description={description}
        image={`${siteUrl}/og-image.webp`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: 'NicosDev',
          url: siteUrl,
          description,
          logo: `${siteUrl}/LogosNicosDev.webp`,
          image: `${siteUrl}/og-image.webp`,
          email: 'contacto@nicosdev.com.ar',
          sameAs: ['https://github.com/NICOGATT'],
        }}
        title="NicosDev | Desarrollo Web, Apps y Sistemas a Medida en Argentina"
      />
      <Main initialProjects={initialData?.projects} />
    </>
  )
}

export default Home
