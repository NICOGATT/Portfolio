import type { AnalyticsPeriod, AnalyticsVisit } from '../types/analytics'

const numberFormatter = new Intl.NumberFormat('es-AR')
const percentFormatter = new Intl.NumberFormat('es-AR', {
  style: 'percent',
  maximumFractionDigits: 1
})
const shortDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short'
})
const longDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const parseAnalyticsDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const toAnalyticsDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const fillAnalyticsVisitDates = (
  visits: AnalyticsVisit[],
  period: AnalyticsPeriod,
  today = new Date()
) => {
  const usersByDate = new Map(visits.map((visit) => [visit.date, visit.users]))
  const firstDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  firstDate.setDate(firstDate.getDate() - (period - 1))

  return Array.from({ length: period }, (_, index) => {
    const date = new Date(firstDate)
    date.setDate(firstDate.getDate() + index)
    const dateKey = toAnalyticsDateKey(date)

    return {
      date: dateKey,
      users: usersByDate.get(dateKey) ?? 0
    }
  })
}

export const formatAnalyticsNumber = (value: number) => numberFormatter.format(value)

export const formatEngagementRate = (value: number) => percentFormatter.format(value)

export const formatSessionDuration = (value: number) => {
  const totalSeconds = Math.max(0, Math.round(value))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours} h ${minutes} min`
  if (minutes > 0) return `${minutes} min ${seconds} s`
  return `${seconds} s`
}

export const formatAnalyticsDate = (value: string) =>
  shortDateFormatter.format(parseAnalyticsDate(value))

export const formatAnalyticsDateLong = (value: string) =>
  longDateFormatter.format(parseAnalyticsDate(value))
