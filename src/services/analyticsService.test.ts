import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './httpClient'
import { analyticsService } from './analyticsService'

vi.mock('./httpClient', () => ({
  apiRequest: vi.fn()
}))

const mockedApiRequest = vi.mocked(apiRequest)

describe('analyticsService', () => {
  beforeEach(() => {
    mockedApiRequest.mockReset()
  })

  it.each([7, 30, 90] as const)('requests the exact %s-day preset from both endpoints', async (period) => {
    mockedApiRequest
      .mockResolvedValueOnce({
        users: 0,
        activeUsers: 0,
        newUsers: 0,
        sessions: 0,
        screenPageViews: 0,
        engagementRate: 0,
        averageSessionDuration: 0
      })
      .mockResolvedValueOnce([])

    await analyticsService.getDashboard(period)

    const query = `startDate=${period - 1}daysAgo&endDate=today`
    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      1,
      `/api/admin/analytics/overview?${query}`
    )
    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      2,
      `/api/admin/analytics/visits?${query}`
    )
  })
})
