'use client'

import { useMemo } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import type { ContestWinner } from '@/lib/types'

const MAX_POINTS = 300

function downsample<T>(arr: T[]): T[] {
  if (arr.length <= MAX_POINTS) return arr
  const step = arr.length / MAX_POINTS
  return Array.from({ length: MAX_POINTS }, (_, i) => arr[Math.floor(i * step)])
}

interface Props {
  winners: ContestWinner[]
}

interface TooltipPayloadEntry {
  name: string
  value: number
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  if (!active || !payload?.length) return null
  // Recharts ScatterChart payload entries have name = the XAxis/YAxis `name` prop
  const skill = payload.find(p => p.name === 'Skill score')
  const luck = payload.find(p => p.name === 'Luck score')
  return (
    <div className="bg-white border border-zinc-200 rounded px-3 py-2 text-sm shadow">
      {skill && <p>Skill: {skill.value.toFixed(1)}</p>}
      {luck && <p>Luck: {luck.value.toFixed(1)}</p>}
    </div>
  )
}

export default function WinnerScatter({ winners }: Props) {
  const { luckyWinners, displaced } = useMemo(() => {
    const contested = winners.filter(w => !w.wasHighestSkill)
    return {
      luckyWinners: downsample(contested.map(w => ({ x: w.skillScore, y: w.luck }))),
      displaced: downsample(contested.map(w => ({ x: w.topSkillScore, y: w.topSkillLuck }))),
    }
  }, [winners])

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
        <XAxis
          type="number"
          dataKey="x"
          name="Skill score"
          domain={['auto', 100]}
          label={{ value: 'Skill score', position: 'insideBottom', offset: -12, fontSize: 12 }}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Luck score"
          domain={[0, 100]}
          label={{ value: 'Luck score', angle: -90, position: 'insideLeft', offset: 12, fontSize: 12 }}
          tick={{ fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" height={28} />
        <Scatter name="Lucky winner" data={luckyWinners} fill="#d97706" opacity={0.4} />
        <Scatter name="Displaced champion" data={displaced} fill="#2563eb" opacity={0.4} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
