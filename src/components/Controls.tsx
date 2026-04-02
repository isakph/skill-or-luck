'use client'

import type { SimulationParams } from '@/lib/types'

const LOG_MIN = Math.log10(100)
const LOG_MAX = Math.log10(100_000)

function posToN(pos: number): number {
  return Math.round(10 ** (pos / 100 * (LOG_MAX - LOG_MIN) + LOG_MIN))
}

function nToPos(n: number): number {
  return Math.round((Math.log10(n) - LOG_MIN) / (LOG_MAX - LOG_MIN) * 100)
}

interface Props {
  params: SimulationParams
  onChange: (p: SimulationParams) => void
  onRun: () => void
  isRunning: boolean
}

export default function Controls({ params, onChange, onRun, isRunning }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Contestants: <span className="text-blue-600">{params.n.toLocaleString()}</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={nToPos(params.n)}
            onChange={e => onChange({ ...params, n: posToN(e.target.valueAsNumber) })}
            className="w-full"
          />
          <span className="text-xs text-zinc-400 flex justify-between">
            <span>100</span><span>100,000</span>
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Luck weight: <span className="text-amber-600">{(params.luckWeight * 100).toFixed(0)}%</span>
          </span>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={Math.round(params.luckWeight * 100)}
            onChange={e => onChange({ ...params, luckWeight: e.target.valueAsNumber / 100 })}
            className="w-full"
          />
          <span className="text-xs text-zinc-400 flex justify-between">
            <span>1%</span><span>20%</span>
          </span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            Contests: <span className="text-zinc-700">{params.m.toLocaleString()}</span>
          </span>
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={params.m}
            onChange={e => onChange({ ...params, m: e.target.valueAsNumber })}
            className="w-full"
          />
          <span className="text-xs text-zinc-400 flex justify-between">
            <span>100</span><span>10,000</span>
          </span>
        </label>
      </div>

      <button
        onClick={onRun}
        disabled={isRunning}
        className="self-start px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isRunning ? 'Running…' : 'Run Simulation'}
      </button>
    </div>
  )
}
