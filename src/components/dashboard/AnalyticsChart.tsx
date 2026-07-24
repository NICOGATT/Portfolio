import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import type { AnalyticsVisit } from '../../types/analytics'
import {
  formatAnalyticsDate,
  formatAnalyticsDateLong,
  formatAnalyticsNumber
} from '../../utils/analytics'

function AnalyticsChart({ visits }: { visits: AnalyticsVisit[] }) {
  return (
    <div
      aria-label="Evolución diaria de usuarios activos"
      className="h-72 w-full sm:h-80"
      role="img"
    >
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={visits} margin={{ bottom: 0, left: -20, right: 8, top: 12 }}>
          <defs>
            <linearGradient id="analyticsUsersGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="date"
            minTickGap={28}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={formatAnalyticsDate}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#f8fafc'
            }}
            formatter={(value) => [formatAnalyticsNumber(Number(value)), 'Usuarios activos']}
            labelFormatter={(label) => formatAnalyticsDateLong(String(label))}
          />
          <Area
            activeDot={{ fill: '#67e8f9', r: 5, stroke: '#0f172a', strokeWidth: 2 }}
            dataKey="users"
            fill="url(#analyticsUsersGradient)"
            stroke="#22d3ee"
            strokeWidth={2.5}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalyticsChart
