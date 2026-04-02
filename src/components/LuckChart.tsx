'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  luckScores: number[]
}

export default function LuckChart({ luckScores }: Props) {
  const bins = Array.from({ length: 10 }, (_, i) => ({
    label: `${i * 10}–${(i + 1) * 10}`,
    count: luckScores.filter(s => s >= i * 10 && (i === 9 ? s <= 100 : s < (i + 1) * 10)).length,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={bins} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#d97706" />
      </BarChart>
    </ResponsiveContainer>
  )
}
