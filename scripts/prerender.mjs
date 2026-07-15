import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const distDir = resolve(root, 'dist')
const template = await readFile(resolve(distDir, 'index.html'), 'utf8')
const { render } = await import('../dist-ssr/entry-server.js')

const apiUrl = process.env.VITE_API_URL?.replace(/\/$/, '')
const siteUrl = (process.env.SITE_URL || 'https://nicosdev.com.ar').replace(/\/$/, '')

if (!apiUrl) {
  throw new Error('VITE_API_URL es obligatoria para generar las páginas SEO.')
}

const fetchJson = async (path) => {
  const response = await fetch(`${apiUrl}${path}`)
  if (!response.ok) throw new Error(`${path} respondió HTTP ${response.status}`)
  return response.json()
}

const asArray = (value, keys) => {
  if (Array.isArray(value)) return value
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key]
  }
  return []
}

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;')

const serialize = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')
const projectTitle = (project) => project.nombre || project.titulo || 'Proyecto'
const projectRepo = (project) => project.urlRepo || project.linkRepositorio || ''
const imageUrl = (image) => image?.url || ''
const projectCover = (project, images = []) =>
  imageUrl(images[0]) || imageUrl(project.imagenes?.[0]) || imageUrl(project.images?.[0]) || project.imagen || ''

const cloudinaryOgImage = (value) => {
  if (!value) return `${siteUrl}/og-image.webp`
  try {
    const url = new URL(value)
    const marker = '/image/upload/'
    if (url.hostname !== 'res.cloudinary.com' || !url.pathname.includes(marker)) return value
    const [prefix, asset] = url.pathname.split(marker)
    const segments = asset.split('/')
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment))
    const existing = versionIndex > 0 ? segments.slice(0, versionIndex).join(',') : ''
    const parameters = [
      'c_fill',
      'g_auto',
      'ar_1.91',
      'w_1200',
      'h_630',
      /(^|,)f_auto(,|$)/.test(existing) ? '' : 'f_auto',
      /(^|,)q_auto(?::\w+)?(,|$)/.test(existing) ? '' : 'q_auto',
    ].filter(Boolean)
    url.pathname = `${prefix}${marker}${parameters.join(',')}/${asset}`
    return url.toString()
  } catch {
    return value
  }
}

const homeSeo = () => {
  const title = 'NicosDev | Desarrollo Web, Apps y Sistemas a Medida en Argentina'
  const description = 'Desarrollador Full Stack especializado en React, Node.js y Flutter. Desarrollo sitios web, sistemas y aplicaciones para empresas y emprendedores de Argentina.'
  const image = `${siteUrl}/og-image.webp`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'NicosDev',
    url: siteUrl,
    description,
    logo: `${siteUrl}/LogosNicosDev.webp`,
    image,
    email: 'contacto@nicosdev.com.ar',
    sameAs: ['https://github.com/NICOGATT'],
  }
  return seoTags({ title, description, image, canonical: `${siteUrl}/`, type: 'website', structuredData })
}

const seoTags = ({ title, description, image, canonical, type, structuredData }) => `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:locale" content="es_AR" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="NicosDev" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <script type="application/ld+json" data-page-json-ld>${serialize(structuredData)}</script>`

const renderPage = async (route, initialData, seo, outputPath) => {
  const appHtml = render(route, initialData)
  const html = template
    .replace('<!--seo-head-->', seo)
    .replace('<!--app-html-->', appHtml)
    .replace('<!--initial-data-->', `<script>window.__INITIAL_DATA__=${serialize(initialData)}</script>`)

  await mkdir(resolve(distDir, outputPath), { recursive: true })
  await writeFile(resolve(distDir, outputPath, 'index.html'), html)
}

const adminFallback = template
  .replace('<!--seo-head-->', '<title>Administración | NicosDev</title><meta name="robots" content="noindex, nofollow" />')
  .replace('<!--app-html-->', '')
  .replace('<!--initial-data-->', '')
await writeFile(resolve(distDir, 'spa.html'), adminFallback)

const projectsResponse = await fetchJson('/api/proyectos')
const projects = asArray(projectsResponse, ['proyectos', 'data'])

await renderPage('/', { kind: 'home', projects }, homeSeo(), '.')

const sitemapEntries = [{ loc: `${siteUrl}/`, lastmod: undefined, image: `${siteUrl}/og-image.webp` }]

for (const listedProject of projects) {
  if (listedProject.id == null) throw new Error('Un proyecto público no tiene ID.')
  const id = encodeURIComponent(String(listedProject.id))
  const [project, imagesResponse, technologiesResponse] = await Promise.all([
    fetchJson(`/api/proyectos/${id}`),
    fetchJson(`/api/proyectos/${id}/images`),
    fetchJson(`/api/proyectos/${id}/tecnologias`),
  ])
  const images = asArray(imagesResponse, ['images', 'imagenes', 'data'])
  const technologies = asArray(technologiesResponse, ['tecnologias', 'data'])
  const title = projectTitle(project)
  const description = project.descripcion || `Conocé el proyecto ${title} desarrollado por NicosDev.`
  const canonical = `${siteUrl}/projects/${id}`
  const cover = projectCover(project, images)
  const socialImage = cloudinaryOgImage(cover)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    url: canonical,
    image: images.map(imageUrl).filter(Boolean).length ? images.map(imageUrl).filter(Boolean) : [socialImage],
    ...(projectRepo(project) ? { codeRepository: projectRepo(project) } : {}),
    ...(project.linkDemo ? { sameAs: project.linkDemo } : {}),
  }
  const seo = seoTags({
    title: `${title} | NicosDev`,
    description,
    image: socialImage,
    canonical,
    type: 'article',
    structuredData,
  })

  await renderPage(`/projects/${id}`, { kind: 'project', project, images, technologies }, seo, `projects/${id}`)
  sitemapEntries.push({ loc: canonical, lastmod: project.updatedAt || project.createdAt, image: cover || socialImage })
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapEntries.map(({ loc, lastmod, image }) => `  <url>
    <loc>${escapeHtml(loc)}</loc>${lastmod ? `\n    <lastmod>${escapeHtml(new Date(lastmod).toISOString())}</lastmod>` : ''}${image ? `\n    <image:image><image:loc>${escapeHtml(image)}</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`

await writeFile(resolve(distDir, 'sitemap.xml'), sitemap)
console.log(`Prerender completo: ${projects.length + 1} páginas y sitemap generado.`)
