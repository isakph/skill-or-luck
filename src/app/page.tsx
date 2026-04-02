'use client'

import { useState } from 'react'
import { runSimulation } from '@/lib/simulation'
import type { SimulationParams, SimulationResults, SweepPoint } from '@/lib/types'
import Controls from '@/components/Controls'
import ResultsSummary from '@/components/ResultsSummary'
import LuckChart from '@/components/LuckChart'
import LuckBySizeChart from '@/components/LuckBySizeChart'

const SWEEP_NS = [100, 500, 1000, 5000, 10_000, 50_000, 100_000]

export default function Home() {
  const [params, setParams] = useState<SimulationParams>({ n: 1000, m: 1000, luckWeight: 0.05 })
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [sweep, setSweep] = useState<SweepPoint[]>([])
  const [isRunning, setIsRunning] = useState(false)

  function handleRun() {
    setIsRunning(true)
    const r = runSimulation(params)
    setResults(r)
    const sweepM = Math.min(params.m, 500)
    const sw = SWEEP_NS.map(n => ({
      n,
      avgWinnerLuck: runSimulation({ n, m: sweepM, luckWeight: params.luckWeight }).avgWinnerLuck,
    }))
    setSweep(sw)
    setIsRunning(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill vs Luck Simulation</h1>
        <p className="mt-2 text-zinc-600">
          In large competitive fields, winners are rarely the most talented — they&apos;re usually among
          the luckiest. This simulation shows why, even when luck accounts for only a small fraction
          of performance.
        </p>
      </div>

      <Controls params={params} onChange={setParams} onRun={handleRun} isRunning={isRunning} />

      {results && <ResultsSummary results={results} />}

      {results && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Distribution of winner luck scores</h2>
          <p className="text-sm text-zinc-500">
            How lucky were the winners across {results.params.m.toLocaleString()} contests?
            Luck is drawn uniformly from 0–100, so an unbiased winner would average 50.
          </p>
          <LuckChart luckScores={results.luckScores} />
        </section>
      )}

      {sweep.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Average winner luck by contest size</h2>
          <p className="text-sm text-zinc-500">
            At {(params.luckWeight * 100).toFixed(0)}% luck weight — as the field grows,
            winners need more luck even though luck&apos;s share of performance stays constant.
          </p>
          <LuckBySizeChart sweep={sweep} />
        </section>
      )}
    </main>
  )
}
