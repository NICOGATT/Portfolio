import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import Panel from '../../components/ui/Panel'
import { analyticsService } from '../../services/analyticsService'
import { projectService } from '../../services/projectService'
import { technologyService } from '../../services/technologyService'
import type {
  AnalyticsDashboard,
  AnalyticsOverview,
  AnalyticsPeriod
} from '../../types/analytics'
import {
  formatAnalyticsNumber,
  formatEngagementRate,
  formatSessionDuration
} from '../../utils/analytics'

const periods: AnalyticsPeriod[] = [7, 30, 90]
const AnalyticsChart = lazy(() => import('../../components/dashboard/AnalyticsChart'))

const emptyOverview: AnalyticsOverview = {
  users: 0,
  activeUsers: 0,
  newUsers: 0,
  sessions: 0,
  screenPageViews: 0,
  engagementRate: 0,
  averageSessionDuration: 0
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return fallback
}

function MetricCard({
  description,
  label,
  loading,
  value
}: {
  description: string
  label: string
  loading: boolean
  value: string
}) {
  return (
    <Panel className="p-5">
      <p className="text-sm font-medium text-slate-300">{label}</p>
      {loading ? (
        <span className="mt-3 block h-9 w-24 animate-pulse rounded bg-white/10" />
      ) : (
        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </Panel>
  )
}

function AdminOverview() {
  const [projectCount, setProjectCount] = useState(0)
  const [technologyCount, setTechnologyCount] = useState(0)
  const [contentError, setContentError] = useState('')
  const [period, setPeriod] = useState<AnalyticsPeriod>(30)
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null)
  const [analyticsError, setAnalyticsError] = useState('')
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const analyticsRequestId = useRef(0)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [projects, technologies] = await Promise.all([
          projectService.list(),
          technologyService.list()
        ])
        setProjectCount(projects.length)
        setTechnologyCount(technologies.length)
      } catch (error) {
        setContentError(getErrorMessage(error, 'No pudimos cargar el resumen de contenido.'))
      }
    }

    loadSummary()
  }, [])

  const requestAnalytics = useCallback(async (selectedPeriod: AnalyticsPeriod) => {
    const requestId = ++analyticsRequestId.current

    try {
      const nextAnalytics = await analyticsService.getDashboard(selectedPeriod)
      if (requestId === analyticsRequestId.current) setAnalytics(nextAnalytics)
    } catch (error) {
      if (requestId === analyticsRequestId.current) {
        setAnalyticsError(getErrorMessage(error, 'No pudimos cargar las métricas de Analytics.'))
      }
    } finally {
      if (requestId === analyticsRequestId.current) setAnalyticsLoading(false)
    }
  }, [])

  useEffect(() => {
    const requestId = ++analyticsRequestId.current

    analyticsService
      .getDashboard(period)
      .then((nextAnalytics) => {
        if (requestId === analyticsRequestId.current) setAnalytics(nextAnalytics)
      })
      .catch((error: unknown) => {
        if (requestId === analyticsRequestId.current) {
          setAnalyticsError(getErrorMessage(error, 'No pudimos cargar las métricas de Analytics.'))
        }
      })
      .finally(() => {
        if (requestId === analyticsRequestId.current) setAnalyticsLoading(false)
      })
  }, [period])

  const handlePeriodChange = (nextPeriod: AnalyticsPeriod) => {
    if (nextPeriod === period) return
    setAnalyticsLoading(true)
    setAnalyticsError('')
    setPeriod(nextPeriod)
  }

  const retryAnalytics = () => {
    setAnalyticsLoading(true)
    setAnalyticsError('')
    requestAnalytics(period)
  }

  const overview = analytics?.overview ?? emptyOverview
  const initialAnalyticsLoading = analyticsLoading && analytics === null

  return (
    <div className="grid gap-6">
      <PageHeader
        action={
          <div aria-label="Período de Analytics" className="flex rounded-lg border border-white/10 bg-slate-900/70 p-1">
            {periods.map((days) => (
              <button
                aria-pressed={period === days}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  period === days
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`}
                key={days}
                onClick={() => handlePeriodChange(days)}
                type="button"
              >
                {days} días
              </button>
            ))}
          </div>
        }
        description="Métricas de alcance y actividad para entender cómo está llegando el portfolio a las personas."
        title="Analytics"
      />

      {analyticsError && (
        <Panel className="flex flex-col gap-3 border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">No pudimos cargar Analytics</p>
            <p className="mt-1 text-red-200/80">{analyticsError}</p>
          </div>
          <button
            className="self-start rounded-lg border border-red-200/20 px-3 py-2 font-semibold transition hover:bg-red-100/10 sm:self-auto"
            onClick={retryAnalytics}
            type="button"
          >
            Reintentar
          </button>
        </Panel>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          description="Personas alcanzadas en el período"
          label="Usuarios totales"
          loading={initialAnalyticsLoading}
          value={formatAnalyticsNumber(overview.users)}
        />
        <MetricCard
          description="Personas que interactuaron"
          label="Usuarios activos"
          loading={initialAnalyticsLoading}
          value={formatAnalyticsNumber(overview.activeUsers)}
        />
        <MetricCard
          description="Primera visita al portfolio"
          label="Usuarios nuevos"
          loading={initialAnalyticsLoading}
          value={formatAnalyticsNumber(overview.newUsers)}
        />
        <MetricCard
          description="Visitas iniciadas"
          label="Sesiones"
          loading={initialAnalyticsLoading}
          value={formatAnalyticsNumber(overview.sessions)}
        />
        <MetricCard
          description="Páginas vistas en total"
          label="Vistas"
          loading={initialAnalyticsLoading}
          value={formatAnalyticsNumber(overview.screenPageViews)}
        />
      </div>

      <Panel className="p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Usuarios activos por día</h2>
            <p className="mt-1 text-sm text-slate-400">
              Evolución de las personas que visitaron o interactuaron con el portfolio.
            </p>
          </div>
          {analyticsLoading && analytics !== null && (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-cyan-200">
              <span className="h-3 w-3 animate-spin rounded-full border border-cyan-300/30 border-t-cyan-300" />
              Actualizando
            </span>
          )}
        </div>
        <div className={`mt-5 transition-opacity ${analyticsLoading ? 'opacity-60' : ''}`}>
          {initialAnalyticsLoading ? (
            <div className="h-72 animate-pulse rounded-lg bg-white/[0.04] sm:h-80" />
          ) : (
            <Suspense fallback={<div className="h-72 animate-pulse rounded-lg bg-white/[0.04] sm:h-80" />}>
              <AnalyticsChart visits={analytics?.visits ?? []} />
            </Suspense>
          )}
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          description="Porcentaje de sesiones con interacción"
          label="Tasa de engagement"
          loading={initialAnalyticsLoading}
          value={formatEngagementRate(overview.engagementRate)}
        />
        <MetricCard
          description="Tiempo promedio por sesión"
          label="Duración media"
          loading={initialAnalyticsLoading}
          value={formatSessionDuration(overview.averageSessionDuration)}
        />
      </div>

      <div className="mt-2 border-t border-white/10 pt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Contenido administrable</h2>
          <p className="mt-1 text-sm text-slate-400">Estado general del contenido del portfolio.</p>
        </div>

        {contentError && (
          <Panel className="mb-4 border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
            {contentError}
          </Panel>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            description="Publicaciones administradas"
            label="Proyectos"
            loading={false}
            value={formatAnalyticsNumber(projectCount)}
          />
          <MetricCard
            description="Tecnologías disponibles"
            label="Tecnologías"
            loading={false}
            value={formatAnalyticsNumber(technologyCount)}
          />
          <MetricCard
            description="Acceso al panel verificado"
            label="Sesión"
            loading={false}
            value="Activa"
          />
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
