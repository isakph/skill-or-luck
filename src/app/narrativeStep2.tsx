'use client'

import { useState, useCallback } from 'react'
import {
  mulberry32,
  findDramaticSeed,
  runContestWithProtag,
  runBatchWithProtag,
} from '@/lib/simulation'
import type { FixedContestant, ProtagContestResult, ProtagBatchResult, ProtagSample } from '@/lib/types'

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
      <div
        className="flex items-center gap-3.5"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          marginBottom: 28,
        }}
      >
        <span style={{ color: 'var(--ink)' }}>02</span>
        <span className="rounded-full" style={{ width: 4, height: 4, background: 'var(--ink-3)' }} />
        <span>Watch them lose</span>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 400,
          fontSize: 'clamp(36px, 5.2vw, 60px)',
          lineHeight: 1.05,
          letterSpacing: '-0.015em',
          margin: '0 0 24px',
          textWrap: 'balance',
        }}
      >
        The deal goes to <em style={{ fontStyle: 'italic' }}>someone else</em>.
      </h1>

      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(19px, 1.7vw, 22px)',
          lineHeight: 1.55,
          color: 'var(--ink-2)',
          maxWidth: '36em',
          margin: '0 0 36px',
        }}
      >
        Here&apos;s what happens this year. Two thousand musicians, one record deal,
        ninety-percent skill, ten-percent luck. Reveal the result.
      </p>

      {/* Reveal curtain */}
      {!revealed && (
        <div
          style={{
            border: '1px dashed var(--rule)',
            background: 'var(--bg-2)',
            padding: '48px 28px',
            textAlign: 'center',
            margin: '36px 0',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--ink-3)',
              margin: '0 0 18px',
              fontSize: 17,
            }}
          >
            One contest. Seeded once. The result is already determined.
          </p>
          <button
            onClick={handleReveal}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 500,
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: 0,
              padding: '16px 28px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Reveal who won
          </button>
        </div>
      )}

      {/* Single contest result */}
      {revealed && seededResult && (
        <div>
          {/* Contest card */}
          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--rule)',
              padding: 28,
              margin: '36px 0 24px',
            }}
          >
            <div
              className="flex items-baseline justify-between gap-4"
              style={{ marginBottom: 20 }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                One contest &middot; 2,000 contestants &middot; 10% luck
              </h3>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                seed: {seededResult.seed}
              </span>
            </div>

            {/* Beeswarm */}
            <BeeswarmSvg sample={seededResult.sample} />
            <div
              className="flex justify-between"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 11,
                color: 'var(--ink-3)',
                marginTop: 4,
              }}
            >
              <span>Skill 0</span>
              <span>50</span>
              <span>100</span>
            </div>

            {/* Result comparison */}
            <div
              className="grid narrative-grid-2"
              style={{
                gridTemplateColumns: '1fr 1fr',
                gap: 1,
                background: 'var(--rule)',
                marginTop: 20,
                border: '1px solid var(--rule)',
              }}
            >
              <div style={{ background: 'var(--bg)', padding: '18px 20px', borderLeft: '3px solid var(--skill)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginBottom: 4,
                  }}
                >
                  You &mdash; most skilled
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                  Top of the field
                </div>
                <div
                  className="flex flex-wrap gap-3.5"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}
                >
                  <span>skill <b style={{ color: 'var(--ink)', fontWeight: 500 }}>99.0</b></span>
                  <span>luck <b style={{ color: 'var(--ink)', fontWeight: 500 }}>60.0</b></span>
                  <span>
                    performance{' '}
                    <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{seededResult.youPerf.toFixed(1)}</b>
                  </span>
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '18px 20px', borderLeft: '3px solid var(--luck)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-3)',
                    marginBottom: 4,
                  }}
                >
                  Winner &mdash; luckier
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                  Some other musician
                </div>
                <div
                  className="flex flex-wrap gap-3.5"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}
                >
                  <span>
                    skill{' '}
                    <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{seededResult.winnerSkill.toFixed(1)}</b>
                  </span>
                  <span>
                    luck{' '}
                    <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{seededResult.winnerLuck.toFixed(1)}</b>
                  </span>
                  <span>
                    performance{' '}
                    <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{seededResult.winnerPerf.toFixed(1)}</b>
                  </span>
                </div>
              </div>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: 'var(--ink-3)',
                marginTop: 12,
                maxWidth: '36em',
              }}
            >
              They were {(99 - seededResult.winnerSkill).toFixed(1)} points less skilled than you.
              They got luckier on the day. Under the rules of this game, that&apos;s enough.
            </p>
          </div>

          {/* Batch block */}
          <div style={{ marginTop: 12, borderTop: '1px solid var(--rule)', paddingTop: 36 }}>
            <div
              className="flex justify-between items-baseline flex-wrap gap-4"
              style={{ marginBottom: 24 }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 26,
                  fontWeight: 500,
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                Maybe this year was a fluke. Run a thousand more.
              </h3>
              <div className="flex items-center gap-2.5" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--ink-3)' }}>
                <button
                  disabled={isRunningBatch}
                  onClick={handleRunBatch}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    fontWeight: 500,
                    background: 'var(--ink)',
                    color: 'var(--bg)',
                    border: 0,
                    padding: '12px 22px',
                    borderRadius: 4,
                    cursor: isRunningBatch ? 'default' : 'pointer',
                    opacity: isRunningBatch ? 0.6 : 1,
                  }}
                >
                  {isRunningBatch ? 'Running\u2026' : batchCount === 0 ? 'Run 1,000 contests' : 'Run 1,000 more'}
                </button>
                <span>{batchCount === 0 ? 'with the same parameters' : ''}</span>
              </div>
            </div>

            {/* Batch summary */}
            <div
              className="grid narrative-grid-batch"
              style={{
                gridTemplateColumns: '1.2fr 1fr 1fr',
                gap: 1,
                background: 'var(--rule)',
                border: '1px solid var(--rule)',
                marginBottom: 24,
              }}
            >
              <div style={{ background: 'var(--bg)', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
                  You won the deal
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 56, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.02em', fontFeatureSettings: '"lnum", "tnum"' }}>
                  {avgWins !== null ? avgWins.toLocaleString() : '\u2014'}{' '}
                  <span style={{ fontSize: 22, color: 'var(--ink-3)', fontStyle: 'italic' }}>/ 1,000</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                  {batchCount === 0
                    ? 'no batches yet'
                    : batchCount === 1
                    ? '1 batch run'
                    : `${batchCount} batches \u2014 average shown`}
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
                  Your average finish
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.01em', fontFeatureSettings: '"lnum", "tnum"' }}>
                  {avgRank !== null ? `${avgRank.toLocaleString()}th` : '\u2014'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                  out of 2,000
                </div>
              </div>
              <div style={{ background: 'var(--bg)', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
                  Most skilled actually won
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.01em', fontFeatureSettings: '"lnum", "tnum"' }}>
                  {pctSkillWins !== null ? `${pctSkillWins}%` : '\u2014'}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>
                  % of contests
                </div>
              </div>
            </div>

            {/* Histogram */}
            {batchResults && (
              <div
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--rule)',
                  padding: '24px 28px 18px',
                  marginBottom: 12,
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
                  How lucky was the winner &mdash; across 1,000 contests{' '}
                  <span style={{ color: 'var(--skill)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
                    &middot; blue bar = contests you won (your luck is fixed at 60)
                  </span>
                </div>
                <HistogramSvg bins={batchResults.winnerLuckBins} />
                <div
                  className="flex justify-between"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}
                >
                  <span>luck = 0</span>
                  <span>50 (average)</span>
                  <span>100</span>
                </div>
              </div>
            )}

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 12,
                color: 'var(--ink-3)',
                marginTop: 12,
                maxWidth: '36em',
              }}
            >
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
      style={{ width: '100%', height: 200, display: 'block' }}
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
      style={{ width: '100%', height: 220, display: 'block' }}
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
