import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ImagenProyecto, Proyecto, Tecnologia } from "../types/dashboard";
import { projectService } from "../services/projectService";
import ResponsiveImage from "../components/ui/ResponsiveImage";
import type { ProjectInitialData } from "../types/prerender";
import PageSeo from "../components/seo/PageSeo";
import { getCloudinaryImageUrl } from "../utils/cloudinary";
import {
  getProjectCover,
  getImageUrl,
  getProjectRepo,
  getProjectTitle,
} from "../utils/responses";

type ProjectDetailProps = {
  initialData?: ProjectInitialData;
};

function ProjectDetail({ initialData }: ProjectDetailProps) {
  const { id } = useParams();
  const projectId = id?.trim() || "";
  const hasInitialData = initialData?.project.id != null && String(initialData.project.id) === projectId;
  const [project, setProject] = useState<Proyecto | null>(hasInitialData ? initialData!.project : null);
  const [images, setImages] = useState<ImagenProyecto[]>(hasInitialData ? initialData!.images : []);
  const [technologies, setTechnologies] = useState<Tecnologia[]>(hasInitialData ? initialData!.technologies : []);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [error, setError] = useState("");

  const title = project ? getProjectTitle(project) : "Proyecto";
  const repo = project ? getProjectRepo(project) : "";
  const cover = useMemo(
    () => getImageUrl(images[0]?.url) || (project ? getProjectCover(project) : ""),
    [images, project],
  );
  const canonical = `https://nicosdev.com.ar/projects/${encodeURIComponent(projectId)}`;
  const socialImage = cover
    ? getCloudinaryImageUrl(cover, { aspectRatio: "1.91", crop: "fill", gravity: "auto", height: 630, width: 1200 })
    : "https://nicosdev.com.ar/og-image.webp";
  const collageImages = useMemo(() => {
    const projectImages = images
      .map((image) => ({
        id: image.id,
        url: getImageUrl(image.url),
      }))
      .filter((image) => Boolean(image.url));

    if (projectImages.length > 0) return projectImages;
    if (cover) return [{ id: "cover", url: cover }];
    return [];
  }, [cover, images]);

  useEffect(() => {
    if (!selectedImageUrl) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImageUrl("");
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImageUrl]);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setError("No pudimos identificar el proyecto.");
        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const [projectFromApi, imagesFromApi, technologiesFromApi] =
          await Promise.all([
            projectService.getPublicById(projectId),
            projectService.listPublicImages(projectId),
            projectService.listPublicTechnologies(projectId),
          ]);

        setProject(projectFromApi);
        setImages(imagesFromApi);
        setTechnologies(technologiesFromApi);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No pudimos cargar el proyecto.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (hasInitialData) return;
    loadProject();
  }, [hasInitialData, projectId]);

  return (
        <>
        {project && (
          <PageSeo
            canonical={canonical}
            description={project.descripcion || `Conocé el proyecto ${title} desarrollado por NicosDev.`}
            image={socialImage}
            structuredData={{
              "@context": "https://schema.org",
              "@type": "CreativeWork",
              name: title,
              description: project.descripcion,
              url: canonical,
              image: collageImages.map((image) => image.url).length > 0
                ? collageImages.map((image) => image.url)
                : [socialImage],
              ...(repo ? { codeRepository: repo } : {}),
              ...(project.linkDemo ? { sameAs: project.linkDemo } : {}),
            }}
            title={`${title} | NicosDev`}
            type="article"
          />
        )}
        <main className="relative min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_28%)]" />

          <section className="mx-auto grid max-w-6xl gap-6">
            <Link
              aria-label="Volver a proyectos"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xl font-semibold text-cyan-300 transition hover:bg-white/[0.08] hover:text-cyan-200"
              title="Volver a proyectos"
              to="/#projects"
            >
              &larr;
            </Link>

            {isLoading && (
              <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
                Cargando proyecto...
              </div>
            )}

            {!isLoading && error && (
              <div className="rounded-lg border border-red-300/20 bg-red-500/10 p-5 text-sm text-red-100">
                {error}
              </div>
            )}

            {!isLoading && !error && project && (
              <>
                <header className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                      Proyecto
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white sm:text-5xl">
                      {title}
                    </h1>
                    <p className="mt-5 text-base leading-7 text-slate-400">
                      {project.descripcion || "Proyecto en desarrollo."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {technologies.map((technology) => (
                        <span
                          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"
                          key={technology.id}
                        >
                          {technology.nombre}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      {repo && (
                        <a
                          className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                          href={repo}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Ver repositorio
                        </a>
                      )}
                      {project.linkDemo && (
                        <a
                          className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] hover:text-white"
                          href={project.linkDemo}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Ver demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {collageImages.length > 0 ? (
                      <div className="grid h-full min-h-80 grid-cols-2 gap-3">
                        {collageImages.slice(0, 5).map((image, index) => {
                          const hiddenImages = collageImages.length - 5;
                          const isMainImage = index === 0;
                          const isLastVisible = index === 4 && hiddenImages > 0;

                          return (
                            <button
                              aria-label={`Abrir imagen ${index + 1} de ${title}`}
                              className={`group relative overflow-hidden rounded-lg border border-white/10 bg-slate-900 text-left shadow-2xl shadow-black/20 ${
                                isMainImage ? "col-span-2 aspect-video" : "aspect-[4/3]"
                              }`}
                              key={image.id}
                              onClick={() => setSelectedImageUrl(image.url)}
                              type="button"
                            >
                              <ResponsiveImage
                                alt={`${title} - captura ${index + 1}`}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                                fetchPriority={isMainImage ? "high" : "auto"}
                                height={isMainImage ? 810 : 480}
                                loading={isMainImage ? "eager" : "lazy"}
                                sizes={
                                  isMainImage
                                    ? "(max-width: 1024px) calc(100vw - 32px), 550px"
                                    : "(max-width: 1024px) calc(50vw - 24px), 270px"
                                }
                                src={image.url}
                                transform={
                                  isMainImage
                                    ? { aspectRatio: "16:9", crop: "fill", gravity: "auto" }
                                    : { aspectRatio: "4:3", crop: "fill", gravity: "auto" }
                                }
                                width={isMainImage ? 1440 : 640}
                                widths={isMainImage ? [480, 768, 1024, 1440] : [240, 384, 640]}
                              />
                              <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                              {isLastVisible && (
                                <span className="absolute inset-0 grid place-items-center bg-slate-950/70 text-2xl font-semibold text-white">
                                  +{hiddenImages}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-lg border border-white/10 bg-slate-900 text-sm text-slate-500">
                        Proyecto sin imagen
                      </div>
                    )}
                  </div>
                </header>
              </>
            )}
          </section>

          {selectedImageUrl && (
            <div
              aria-modal="true"
              className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4"
              role="dialog"
            >
              <button
                aria-label="Cerrar imagen"
                className="absolute inset-0 cursor-default"
                onClick={() => setSelectedImageUrl("")}
                type="button"
              />
              <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-slate-900 shadow-2xl shadow-black/50">
                <button
                  aria-label="Cerrar"
                  className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  onClick={() => setSelectedImageUrl("")}
                  type="button"
                >
                  Cerrar
                </button>
                <ResponsiveImage
                  alt={`${title} - captura ampliada`}
                  className="max-h-[90vh] w-full object-contain"
                  height={1080}
                  sizes="90vw"
                  src={selectedImageUrl}
                  transform={{ crop: "limit" }}
                  width={1920}
                  widths={[960, 1440, 1920]}
                />
              </div>
            </div>
          )}
        </main>
        </>
  );
}

export default ProjectDetail;
