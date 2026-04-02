'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { SweepPoint } from '@/lib/types'

interface Props {
  sweep: SweepPoint[]
}

export default function LuckBySizeChart({ sweep }: Props) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={sweep} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <XAxis dataKey="n" tick={{ fontSize: 12 }} tickFormatter={(v: number) => v.toLocaleString()} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(v) => [typeof v === 'number' ? v.toFixed(1) : v, 'Avg winner luck']}
          labelFormatter={(v) => `n = ${Number(v).toLocaleString()}`}
        />
        <Bar dataKey="avgWinnerLuck" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  )
}
