import { describe, expect, it } from 'vitest'
import {
  fillAnalyticsVisitDates,
  formatAnalyticsDate,
  formatAnalyticsNumber,
  formatEngagementRate,
  formatSessionDuration
} from './analytics'

describe('Analytics formatters', () => {
  it('formats Analytics values for the Spanish locale', () => {
    expect(formatAnalyticsNumber(1234)).toMatch(/1[.\s]234/)
    expect(formatEngagementRate(0.625)).toMatch(/^62,5\s?%$/)
  })

  it('formats session duration in seconds, minutes and hours', () => {
    expect(formatSessionDuration(42.4)).toBe('42 s')
    expect(formatSessionDuration(83)).toBe('1 min 23 s')
    expect(formatSessionDuration(3720)).toBe('1 h 2 min')
    expect(formatSessionDuration(-1)).toBe('0 s')
  })

  it('parses API dates without changing the calendar day', () => {
    expect(formatAnalyticsDate('2026-07-24')).toContain('24')
  })
})

describe('Analytics visit date normalization', () => {
  const today = new Date(2026, 6, 24, 18, 30)

  it('fills internal gaps while preserving real values', () => {
    const result = fillAnalyticsVisitDates(
      [
        { date: '2026-07-22', users: 4 },
        { date: '2026-07-24', users: 7 }
      ],
      7,
      today
    )

    expect(result.slice(4)).toEqual([
      { date: '2026-07-22', users: 4 },
      { date: '2026-07-23', users: 0 },
      { date: '2026-07-24', users: 7 }
    ])
  })

  it('fills missing dates at the beginning and end of the period', () => {
    const result = fillAnalyticsVisitDates([{ date: '2026-07-22', users: 2 }], 7, today)

    expect(result).toHaveLength(7)
    expect(result[0]).toEqual({ date: '2026-07-18', users: 0 })
    expect(result[4]).toEqual({ date: '2026-07-22', users: 2 })
    expect(result[6]).toEqual({ date: '2026-07-24', users: 0 })
  })

  it.each([7, 30, 90] as const)('creates %s zero-value dates for an empty response', (period) => {
    const result = fillAnalyticsVisitDates([], period, today)

    expect(result).toHaveLength(period)
    expect(result.every((visit) => visit.users === 0)).toBe(true)
    expect(result.at(-1)?.date).toBe('2026-07-24')
  })
})
