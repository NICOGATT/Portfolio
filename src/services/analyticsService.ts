import type {
  AnalyticsDashboard,
  AnalyticsOverview,
  AnalyticsPeriod,
  AnalyticsVisit
} from '../types/analytics'
import { fillAnalyticsVisitDates } from '../utils/analytics'
import { apiRequest } from './httpClient'

const getAnalyticsQuery = (period: AnalyticsPeriod) =>
  new URLSearchParams({
    startDate: `${period - 1}daysAgo`,
    endDate: 'today'
  }).toString()

export const analyticsService = {
  getOverview: (period: AnalyticsPeriod) =>
    apiRequest<AnalyticsOverview>(
      `/api/admin/analytics/overview?${getAnalyticsQuery(period)}`
    ),

  getVisits: (period: AnalyticsPeriod) =>
    apiRequest<AnalyticsVisit[]>(`/api/admin/analytics/visits?${getAnalyticsQuery(period)}`),

  async getDashboard(period: AnalyticsPeriod): Promise<AnalyticsDashboard> {
    const [overview, visits] = await Promise.all([
      this.getOverview(period),
      this.getVisits(period)
    ])

    return {
      overview,
      visits: fillAnalyticsVisitDates(visits, period)
    }
  }
}
