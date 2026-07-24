export type AnalyticsPeriod = 7 | 30 | 90

export type AnalyticsOverview = {
  users: number
  activeUsers: number
  newUsers: number
  sessions: number
  screenPageViews: number
  engagementRate: number
  averageSessionDuration: number
}

export type AnalyticsVisit = {
  date: string
  users: number
}

export type AnalyticsDashboard = {
  overview: AnalyticsOverview
  visits: AnalyticsVisit[]
}
