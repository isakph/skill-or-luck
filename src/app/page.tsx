'use client'

import { useState, useMemo } from 'react'
import { runSimulation, runContestWithField, computeStats } from '@/lib/simulation'
import type { SimulationParams, SimulationResults, SweepPoint, ContestSnapshot, ContestWinner } from '@/lib/types'
import Controls from '@/components/Controls'
import ResultsSummary from '@/components/ResultsSummary'
import LuckChart from '@/components/LuckChart'
import LuckBySizeChart from '@/components/LuckBySizeChart'
import WinnerScatter from '@/components/WinnerScatter'
import ContestBeeswarm from '@/components/ContestBeeswarm'

const SWEEP_NS = [100, 500, 1000, 5000, 10_000, 50_000, 100_000]

interface StepState {
  contestsDone: number
  winners: ContestWinner[]
  snapshot: ContestSnapshot
}

export default function Home() {
  const [params, setParams] = useState<SimulationParams>({ n: 1000, m: 1000, luckWeight: 0.05 })
  const [results, setResults] = useState<SimulationResults | null>(null)
  const [sweep, setSweep] = useState<SweepPoint[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'batch' | 'stepthrough'>('batch')
  const [stepState, setStepState] = useState<StepState | null>(null)
  const [batchRunCount, setBatchRunCount] = useState(0)

  function handleRun() {
    setIsRunning(true)
    requestAnimationFrame(() => {
      setTimeout(() => {
        const result = runSimulation(params)
        setResults(result)
        const sweepM = Math.min(params.m, 500)
        const sweepData = SWEEP_NS.map(n => ({
          n,
          avgWinnerLuck: runSimulation({ n, m: sweepM, luckWeight: params.luckWeight }).avgWinnerLuck,
        }))
        setSweep(sweepData)
        setBatchRunCount(c => c + 1)
        setIsRunning(false)
      }, 0)
    })
  }

  function handleStep() {
    const snapshot = runContestWithField(params.n, params.luckWeight)
    setStepState(prev => ({
      contestsDone: (prev?.contestsDone ?? 0) + 1,
      winners: prev ? [...prev.winners, snapshot.winner] : [snapshot.winner],
      snapshot,
    }))
  }

  function handleParamsChange(next: SimulationParams) {
    setParams(next)
    if (mode === 'stepthrough' && stepState) {
      setStepState(null)
    }
  }

  function handleReset() {
    setStepState(null)
  }

  function handleModeChange(newMode: 'batch' | 'stepthrough') {
    setMode(newMode)
    setStepState(null)
  }

  const displayResults = useMemo<SimulationResults | null>(() => {
    if (mode === 'batch') return results
    if (!stepState || stepState.winners.length === 0) return null
    return computeStats(stepState.winners, { ...params, m: stepState.winners.length })
  }, [mode, results, stepState, params])

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

      <Controls
        params={params}
        onChange={handleParamsChange}
        onRun={handleRun}
        isRunning={isRunning}
        mode={mode}
        onModeChange={handleModeChange}
        onStep={handleStep}
        onReset={handleReset}
        stepsDone={stepState?.contestsDone ?? 0}
      />

      {mode === 'stepthrough' && stepState && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Contest zoom-in</h2>
          <p className="text-sm text-zinc-500">
            Each dot is one contestant from this contest, positioned by skill score.
            The vertical spread is random jitter to separate overlapping points — it carries no information.
            {!stepState.snapshot.winner.wasHighestSkill && (
              <> <span className="text-blue-600 font-medium">Blue</span> = most skilled contestant,{' '}
              <span className="text-amber-600 font-medium">amber</span> = actual winner.</>
            )}
          </p>
          <ContestBeeswarm
            field={stepState.snapshot.field}
            contestNumber={stepState.contestsDone}
            wasHighestSkill={stepState.snapshot.winner.wasHighestSkill}
            winnerSkillScore={stepState.snapshot.winner.skillScore}
            winnerLuck={stepState.snapshot.winner.luck}
          />
        </section>
      )}

      {displayResults && <ResultsSummary key={mode === 'batch' ? `batch-${batchRunCount}` : stepState?.contestsDone} results={displayResults} />}

      {displayResults && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Distribution of winner luck scores</h2>
          <p className="text-sm text-zinc-500">
            How lucky were the winners across {displayResults.winners.length.toLocaleString()} {displayResults.winners.length === 1 ? 'contest' : 'contests'}?
            Luck is drawn uniformly from 0–100, so an unbiased winner would average 50.
          </p>
          <LuckChart luckScores={displayResults.luckScores} />
        </section>
      )}

      {mode === 'batch' && sweep.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Average winner luck by contest size</h2>
          <p className="text-sm text-zinc-500">
            At {(params.luckWeight * 100).toFixed(0)}% luck weight — as the field grows,
            winners need more luck even though luck&apos;s share of performance stays constant.
          </p>
          <LuckBySizeChart sweep={sweep} />
        </section>
      )}

      {displayResults && displayResults.winners.some(w => !w.wasHighestSkill) && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Winners vs displaced champions</h2>
          <p className="text-sm text-zinc-500">
            Each dot is one contest where luck decided the outcome.{' '}
            <span className="text-amber-600 font-medium">Amber</span> = actual winner,{' '}
            <span className="text-blue-600 font-medium">blue</span> = the most-skilled contestant who lost.
            The blue cloud sits further right (higher skill); the amber cloud sits higher (more luck).
            {displayResults.pctLuckWins > 0 && (
              <> In {displayResults.pctLuckWins.toFixed(1)}% of contests, luck decided the outcome.</>
            )}
          </p>
          <WinnerScatter winners={displayResults.winners} />
        </section>
      )}
    </main>
  )
}
