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
  mode: 'batch' | 'stepthrough'
  onModeChange: (m: 'batch' | 'stepthrough') => void
  onStep: () => void
  onReset: () => void
  stepsDone: number
}

export default function Controls({ params, onChange, onRun, isRunning, mode, onModeChange, onStep, onReset, stepsDone }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 self-start bg-zinc-100 rounded-lg p-1">
        <button
          onClick={() => onModeChange('batch')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === 'batch'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Batch run
        </button>
        <button
          onClick={() => onModeChange('stepthrough')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === 'stepthrough'
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          Step-through
        </button>
      </div>

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

      {mode === 'batch' ? (
        <button
          onClick={onRun}
          disabled={isRunning}
          className="self-start px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isRunning ? 'Running…' : 'Run Simulation'}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Run Next Contest
          </button>
          {stepsDone > 0 && (
            <button
              onClick={onReset}
              className="px-4 py-3 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 font-medium"
            >
              Reset
            </button>
          )}
          {stepsDone > 0 && (
            <span className="text-sm text-zinc-500">
              {stepsDone.toLocaleString()} of {params.m.toLocaleString()} contests run
            </span>
          )}
        </div>
      )}
    </div>
  )
}
