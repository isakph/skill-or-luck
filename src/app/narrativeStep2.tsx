'use client'

import { useState, useCallback } from 'react'
import {
  findDramaticSeed,
  runBatchWithProtag,
} from '@/lib/simulation'
import type { FixedContestant, ProtagContestResult, ProtagBatchResult, ProtagSample } from '@/lib/types'
import {
  finePrintClass,
  ledeClass,
  monoCapsClass,
  primaryButtonClass,
  stepDotClass,
  stepMetaClass,
  stepTitleClass,
} from './narrativeStyles'

const PROTAG: FixedContestant = { ability: 99, effort: 99, luck: 60 }
const N = 2000
const W = 0.1

export default function NarrativeStep2() {
  const [revealed, setRevealed] = useState(false)
  const [seededResult, setSeededResult] = useState<(ProtagContestResult & { seed: number }) | null>(null)
  const [batchResults, setBatchResults] = useState<ProtagBatchResult | null>(null)
  const [cumulativeWins, setCumulativeWins] = useState(0)
  const [cumulativeRanks, setCumulativeRanks] = useState(0)
  const [cumulativeSkillWins, setCumulativeSkillWins] = useState(0)
  const [cumulativeContests, setCumulativeContests] = useState(0)
  const [batchCount, setBatchCount] = useState(0)
  const [isRunningBatch, setIsRunningBatch] = useState(false)

  const handleReveal = useCallback(() => {
    const { seed, result } = findDramaticSeed(N, W, PROTAG)
    setSeededResult({ seed, ...result })
    setRevealed(true)
  }, [])

  const handleRunBatch = useCallback(() => {
    setIsRunningBatch(true)
    setTimeout(() => {
      const batch = runBatchWithProtag(1000, N, W, PROTAG)
      const newWins = cumulativeWins + batch.wins
      const newRanks = cumulativeRanks + batch.avgRank * batch.totalContests
      const newSkillWins = cumulativeSkillWins + (batch.mostSkilledWonPct / 100) * batch.totalContests
      const newContests = cumulativeContests + batch.totalContests
      const newCount = batchCount + 1

      setCumulativeWins(newWins)
      setCumulativeRanks(newRanks)
      setCumulativeSkillWins(newSkillWins)
      setCumulativeContests(newContests)
      setBatchCount(newCount)
      setBatchResults(batch) // keep latest for histogram bins
      setIsRunningBatch(false)
    }, 30)
  }, [cumulativeWins, cumulativeRanks, cumulativeSkillWins, cumulativeContests, batchCount])

  const avgWins = batchCount > 0 ? Math.round(cumulativeWins / batchCount) : null
  const avgRank = cumulativeContests > 0 ? Math.round(cumulativeRanks / cumulativeContests) : null
  const pctSkillWins = cumulativeContests > 0 ? ((cumulativeSkillWins / cumulativeContests) * 100).toFixed(1) : null

  return (
    <section>
      {/* Step meta */}
      <div className={stepMetaClass}>
        <span className="text-[var(--ink)]">02</span>
        <span className={stepDotClass} />
        <span>Watch them lose</span>
      </div>

      <h1 className={stepTitleClass}>
        The deal goes to <em className="italic">someone else</em>.
      </h1>

      <p className={ledeClass}>
        Here&apos;s what happens this year. Two thousand musicians, one record deal,
        ninety-percent skill, ten-percent luck. Reveal the result.
      </p>

      {/* Reveal curtain */}
      {!revealed && (
        <div className="my-8 border border-dashed border-[var(--rule)] bg-[var(--bg-2)] px-5 py-8 text-center sm:my-9 sm:px-7 sm:py-12">
          <p className="mb-5 font-serif text-[16px] italic text-[var(--ink-3)] sm:text-[17px]">
            One contest. Seeded once. The result is already determined.
          </p>
          <button
            onClick={handleReveal}
            className={`${primaryButtonClass} px-6 py-4 text-base sm:px-7`}
          >
            Reveal who won
          </button>
        </div>
      )}

      {/* Single contest result */}
      {revealed && seededResult && (
        <div>
          {/* Contest card */}
          <div className="my-8 border border-[var(--rule)] bg-[var(--bg)] p-4 sm:my-9 sm:p-7">
            <div className="mb-5 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="font-mono text-[11px] font-medium uppercase tracking-normal text-[var(--ink-3)]">
                One contest &middot; 2,000 contestants &middot; 10% luck
              </h3>
              <span className="font-mono text-[11px] text-[var(--ink-3)]">
                seed: {seededResult.seed}
              </span>
            </div>

            {/* Beeswarm */}
            <BeeswarmSvg sample={seededResult.sample} />
            <div className="mt-1 flex justify-between font-sans text-[11px] text-[var(--ink-3)]">
              <span>Skill 0</span>
              <span>50</span>
              <span>100</span>
            </div>

            {/* Result comparison */}
            <div
              className="mt-5 grid grid-cols-1 gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-2"
            >
              <div className="border-l-[3px] border-l-[color:var(--skill)] bg-[var(--bg)] p-4 sm:px-5 sm:py-[18px]">
                <div className={`${monoCapsClass} mb-1`}>
                  You &mdash; most skilled
                </div>
                <div className="mb-2 font-serif text-lg font-medium">
                  Top of the field
                </div>
                <div className="flex flex-wrap gap-3.5 font-mono text-xs text-[var(--ink-2)]">
                  <span>skill <b className="font-medium text-[var(--ink)]">99.0</b></span>
                  <span>luck <b className="font-medium text-[var(--ink)]">60.0</b></span>
                  <span>
                    performance{' '}
                    <b className="font-medium text-[var(--ink)]">{seededResult.youPerf.toFixed(1)}</b>
                  </span>
                </div>
              </div>
              <div className="border-l-[3px] border-l-[color:var(--luck)] bg-[var(--bg)] p-4 sm:px-5 sm:py-[18px]">
                <div className={`${monoCapsClass} mb-1`}>
                  Winner &mdash; luckier
                </div>
                <div className="mb-2 font-serif text-lg font-medium">
                  Some other musician
                </div>
                <div className="flex flex-wrap gap-3.5 font-mono text-xs text-[var(--ink-2)]">
                  <span>
                    skill{' '}
                    <b className="font-medium text-[var(--ink)]">{seededResult.winnerSkill.toFixed(1)}</b>
                  </span>
                  <span>
                    luck{' '}
                    <b className="font-medium text-[var(--ink)]">{seededResult.winnerLuck.toFixed(1)}</b>
                  </span>
                  <span>
                    performance{' '}
                    <b className="font-medium text-[var(--ink)]">{seededResult.winnerPerf.toFixed(1)}</b>
                  </span>
                </div>
              </div>
            </div>

            <p className={`${finePrintClass} mt-3`}>
              They were {(99 - seededResult.winnerSkill).toFixed(1)} points less skilled than you.
              They got luckier on the day. Under the rules of this game, that&apos;s enough.
            </p>
          </div>

          {/* Batch block */}
          <div className="mt-3 border-t border-[var(--rule)] pt-8 sm:pt-9">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-serif text-[22px] font-medium leading-tight tracking-normal sm:text-[26px]">
                Maybe this year was a fluke. Run a thousand more.
              </h3>
              <div className="flex flex-col items-start gap-2 font-sans text-[13px] text-[var(--ink-3)] sm:flex-row sm:items-center sm:gap-2.5">
                <button
                  disabled={isRunningBatch}
                  onClick={handleRunBatch}
                  className={primaryButtonClass}
                >
                  {isRunningBatch ? 'Running\u2026' : batchCount === 0 ? 'Run 1,000 contests' : 'Run 1,000 more'}
                </button>
                {batchCount === 0 && <span>with the same parameters</span>}
              </div>
            </div>

            {/* Batch summary */}
            <div
              className="mb-6 grid grid-cols-1 gap-px border border-[var(--rule)] bg-[var(--rule)] sm:grid-cols-[1.2fr_1fr_1fr]"
            >
              <div className="bg-[var(--bg)] p-5 sm:p-[22px]">
                <div className={`${monoCapsClass} mb-2.5`}>
                  You won the deal
                </div>
                <div
                  className="font-serif text-[42px] font-normal leading-none tracking-normal sm:text-[56px]"
                  style={{ fontFeatureSettings: '"lnum", "tnum"' }}
                >
                  {avgWins !== null ? avgWins.toLocaleString() : '\u2014'}{' '}
                  <span className="text-[18px] italic text-[var(--ink-3)] sm:text-[22px]">/ 1,000</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-3)]">
                  {batchCount === 0
                    ? 'no batches yet'
                    : batchCount === 1
                    ? '1 batch run'
                    : `${batchCount} batches \u2014 average shown`}
                </div>
              </div>
              <div className="bg-[var(--bg)] p-5 sm:p-[22px]">
                <div className={`${monoCapsClass} mb-2.5`}>
                  Your average finish
                </div>
                <div
                  className="font-serif text-[30px] font-normal leading-none tracking-normal sm:text-[32px]"
                  style={{ fontFeatureSettings: '"lnum", "tnum"' }}
                >
                  {avgRank !== null ? `${avgRank.toLocaleString()}th` : '\u2014'}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-3)]">
                  out of 2,000
                </div>
              </div>
              <div className="bg-[var(--bg)] p-5 sm:p-[22px]">
                <div className={`${monoCapsClass} mb-2.5`}>
                  Most skilled actually won
                </div>
                <div
                  className="font-serif text-[30px] font-normal leading-none tracking-normal sm:text-[32px]"
                  style={{ fontFeatureSettings: '"lnum", "tnum"' }}
                >
                  {pctSkillWins !== null ? `${pctSkillWins}%` : '\u2014'}
                </div>
                <div className="mt-1 font-mono text-[11px] text-[var(--ink-3)]">
                  % of contests
                </div>
              </div>
            </div>

            {/* Histogram */}
            {batchResults && (
              <div className="mb-3 border border-[var(--rule)] bg-[var(--bg)] p-4 pb-3 sm:px-7 sm:pb-[18px] sm:pt-6">
                <div className={`${monoCapsClass} mb-3.5`}>
                  How lucky was the winner &mdash; across 1,000 contests{' '}
                  <span className="font-medium normal-case tracking-normal text-[var(--skill)]">
                    &middot; blue bar = contests you won (your luck is fixed at 60)
                  </span>
                </div>
                <HistogramSvg bins={batchResults.winnerLuckBins} />
                <div className="mt-1.5 flex justify-between font-sans text-xs text-[var(--ink-3)]">
                  <span>luck = 0</span>
                  <span>50 (average)</span>
                  <span>100</span>
                </div>
              </div>
            )}

            <p className={`${finePrintClass} mt-3`}>
              Run it. Run it again. The numbers wobble a little, but the story doesn&apos;t.
              You almost never get the deal &mdash; even though you&apos;re objectively the best in the field.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------- Beeswarm SVG ---------- */

function BeeswarmSvg({ sample }: { sample: ProtagSample[] }) {
  const SVG_W = 600
  const SVG_H = 200
  const PAD = 12
  const yMid = (SVG_H - 24) / 2
  const ySpread = (SVG_H - 24) / 2 - PAD

  const youPoint = sample.find((p) => p.isYou)
  const winnerPoint = sample.find((p) => p.isWinner && !p.isYou)

  // Sort so protagonist and winner draw on top
  const sorted = [...sample].sort((a, b) => {
    const aSpecial = a.isYou || a.isWinner ? 1 : 0
    const bSpecial = b.isYou || b.isWinner ? 1 : 0
    return aSpecial - bSpecial
  })

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="none"
      className="block h-36 w-full sm:h-[200px]"
    >
      {/* Axis */}
      <line x1="0" x2={SVG_W} y1={SVG_H - 24} y2={SVG_H - 24} stroke="var(--rule)" strokeWidth="1" />
      {[0, 25, 50, 75, 100].map((t) => {
        const x = (t / 100) * SVG_W
        return <line key={t} x1={x} x2={x} y1={SVG_H - 24} y2={SVG_H - 20} stroke="var(--ink-3)" />
      })}

      {/* Dots */}
      {sorted.map((p, idx) => {
        const cx = (p.skill / 100) * SVG_W
        const jr = Math.sin(idx * 7.13 + p.skill * 0.31) * 0.5 + 0.5
        const cy = yMid - ySpread + jr * ySpread * 2
        if (p.isYou) {
          return (
            <circle key={idx} cx={cx} cy={cy} r={7} fill="var(--skill)" stroke="white" strokeWidth={2} />
          )
        }
        if (p.isWinner) {
          return (
            <circle key={idx} cx={cx} cy={cy} r={7} fill="var(--luck)" stroke="white" strokeWidth={2} />
          )
        }
        return <circle key={idx} cx={cx} cy={cy} r={2.6} fill="#a8a193" opacity={0.55} />
      })}

      {/* You label */}
      {youPoint && (
        <>
          <text
            x={(youPoint.skill / 100) * SVG_W - 6}
            y={22}
            textAnchor="end"
            fill="var(--skill)"
            fontFamily="var(--font-sans)"
            fontSize="11"
            fontWeight="600"
          >
            You — skill 99
          </text>
          <line
            x1={(youPoint.skill / 100) * SVG_W}
            x2={(youPoint.skill / 100) * SVG_W}
            y1={26}
            y2={yMid - 8}
            stroke="var(--skill)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        </>
      )}

      {/* Winner label */}
      {winnerPoint && (
        <text
          x={(winnerPoint.skill / 100) * SVG_W + 6}
          y={SVG_H - 40}
          textAnchor="start"
          fill="var(--luck)"
          fontFamily="var(--font-sans)"
          fontSize="11"
          fontWeight="600"
        >
          Winner — skill {winnerPoint.skill.toFixed(1)}
        </text>
      )}
    </svg>
  )
}

/* ---------- Histogram SVG ---------- */

function HistogramSvg({ bins }: { bins: number[] }) {
  const SVG_W = 600
  const SVG_H = 220
  const PAD_B = 24
  const PAD_T = 8
  const max = Math.max(...bins, 1)
  const barW = SVG_W / bins.length
  const YOU_BIN = 12

  const meanX = (50 / 100) * SVG_W

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="none"
      className="block h-40 w-full sm:h-[220px]"
    >
      {/* Mean line */}
      <line
        x1={meanX} x2={meanX}
        y1={PAD_T} y2={SVG_H - PAD_B}
        stroke="var(--ink-3)"
        strokeDasharray="3 3"
        strokeWidth={1}
      />

      {/* Bars */}
      {bins.map((v, i) => {
        const h = (v / max) * (SVG_H - PAD_B - PAD_T)
        const x = i * barW
        const y = SVG_H - PAD_B - h
        return (
          <rect
            key={i}
            x={x + 1.5}
            width={barW - 3}
            y={y}
            height={h}
            fill={i === YOU_BIN ? 'var(--skill)' : 'var(--luck)'}
            opacity={i === YOU_BIN ? 0.92 : 0.78}
          />
        )
      })}

      {/* You annotation */}
      {bins[YOU_BIN] > 0 && (() => {
        const youBinH = (bins[YOU_BIN] / max) * (SVG_H - PAD_B - PAD_T)
        const cx = YOU_BIN * barW + barW / 2
        const cy = SVG_H - PAD_B - youBinH
        return (
          <>
            <line
              x1={cx} x2={cx}
              y1={cy - 2} y2={Math.max(cy - 26, 14)}
              stroke="var(--skill)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <text
              x={cx}
              y={Math.max(cy - 30, 12)}
              textAnchor="middle"
              fill="var(--skill)"
              fontFamily="var(--font-sans)"
              fontSize="11"
              fontWeight="600"
            >
              You — luck 60
            </text>
          </>
        )
      })()}

      {/* Baseline */}
      <line
        x1={0} x2={SVG_W}
        y1={SVG_H - PAD_B} y2={SVG_H - PAD_B}
        stroke="var(--rule)"
      />
    </svg>
  )
}
