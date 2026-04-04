'use client'

import { useMemo } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, ReferenceLine,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { BeeswarmPoint } from '@/lib/types'

interface Props {
  field: BeeswarmPoint[]
  contestNumber: number
  wasHighestSkill: boolean
  winnerSkillScore: number
  winnerLuck: number
}

function FieldTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  const skill = payload.find(p => p.name === 'Skill')
  if (!skill) return null
  return (
    <div className="bg-white border border-zinc-200 rounded px-3 py-2 text-sm shadow">
      <p>Skill: {skill.value.toFixed(1)}</p>
    </div>
  )
}

export default function ContestBeeswarm({ field, contestNumber, wasHighestSkill, winnerSkillScore, winnerLuck }: Props) {
  const { fieldPoints, winnerPoints, topSkillPoints } = useMemo(() => ({
    fieldPoints: field.filter(p => !p.isWinner && !p.isTopSkill).map(p => ({ x: p.skillScore, y: p.jitterY })),
    winnerPoints: field.filter(p => p.isWinner).map(p => ({ x: p.skillScore, y: p.jitterY })),
    topSkillPoints: field.filter(p => p.isTopSkill).map(p => ({ x: p.skillScore, y: p.jitterY })),
  }), [field])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-zinc-500">
        Contest {contestNumber.toLocaleString()}.{' '}
        {wasHighestSkill
          ? <span className="text-blue-600 font-medium">Skill won this round.</span>
          : <span className="text-amber-600 font-medium">Luck won this round.</span>
        }{' '}
        Winner — skill: {winnerSkillScore.toFixed(1)}, luck: {winnerLuck.toFixed(1)}.
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 8, right: 16, bottom: 32, left: 8 }}>
          <XAxis
            type="number"
            dataKey="x"
            name="Skill"
            domain={['auto', 'auto']}
            label={{ value: 'Skill score', position: 'insideBottom', offset: -16, fontSize: 12 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Jitter"
            domain={[-1.5, 1.5]}
            hide
          />
          <ZAxis zAxisId="sm" range={[20, 20]} />
          <ZAxis zAxisId="lg" range={[120, 120]} />
          <ReferenceLine y={0} stroke="#d4d4d8" strokeDasharray="4 4" />
          <Tooltip content={<FieldTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend verticalAlign="top" height={28} />
          <Scatter
            zAxisId="sm"
            name="Contestant"
            data={fieldPoints}
            fill="#a1a1aa"
            opacity={0.5}
            isAnimationActive={false}
          />
          <Scatter
            zAxisId="lg"
            name="Most skilled"
            data={topSkillPoints}
            fill="#2563eb"
            isAnimationActive={false}
          />
          <Scatter
            zAxisId="lg"
            name="Winner"
            data={winnerPoints}
            fill="#d97706"
            isAnimationActive={false}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
