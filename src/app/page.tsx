'use client'

import { useState } from 'react'
import { runSimulation } from '@/lib/simulation'
import type { SimulationResults } from '@/lib/types'

export default function Home() {
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  function handleRun() {
    setIsRunning(true)
    const r = runSimulation({ n: 1000, m: 1000, luckWeight: 0.05 })
    setResults(r)
    setIsRunning(false)
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill vs Luck Simulation</h1>
        <p className="mt-2 text-zinc-600">
          In large competitive fields, winners are rarely the most talented — they&apos;re usually among
          the luckiest. This simulation shows why.
        </p>
      </div>

      <button
        onClick={handleRun}
        disabled={isRunning}
        className="self-start px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {isRunning ? 'Running…' : 'Run Simulation'}
      </button>

      {results && (
        <section className="border border-zinc-200 rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Results</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
            <dt className="text-zinc-500 text-sm">Contestants per contest</dt>
            <dd className="font-semibold">{results.params.n.toLocaleString()}</dd>

            <dt className="text-zinc-500 text-sm">Contests run</dt>
            <dd className="font-semibold">{results.params.m.toLocaleString()}</dd>

            <dt className="text-zinc-500 text-sm">Luck weight</dt>
            <dd className="font-semibold">{(results.params.luckWeight * 100).toFixed(0)}%</dd>

            <dt className="text-zinc-500 text-sm">Avg winner luck score</dt>
            <dd className="font-semibold text-amber-600">{results.avgWinnerLuck.toFixed(1)}</dd>

            <dt className="text-zinc-500 text-sm">Avg winner skill score</dt>
            <dd className="font-semibold text-blue-600">{results.avgWinnerSkill.toFixed(1)}</dd>

            <dt className="text-zinc-500 text-sm">Most-skilled didn&apos;t win</dt>
            <dd className="font-semibold">{results.pctLuckWins.toFixed(1)}%</dd>

            <dt className="text-zinc-500 text-sm">Avg skill gap</dt>
            <dd className="font-semibold">{results.avgSkillGap.toFixed(2)}</dd>
          </dl>
        </section>
      )}
    </main>
  )
}
