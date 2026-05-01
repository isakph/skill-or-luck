'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { estimateWinRate } from '@/lib/simulation'
import type { FixedContestant } from '@/lib/types'

const PROTAG: FixedContestant = { ability: 99, effort: 99, luck: 60 }
const N = 2000

function wrToSub(wr: number, lw: number): string {
  if (lw === 0)
    return 'Pure skill. You\u2019re tied at the top \u2014 with luck switched off, ties are broken arbitrarily, so you don\u2019t always win.'
  if (lw <= 2 && wr >= 60)
    return 'A whisper of luck actually helps you, since yours is above average. Past this point, the slider turns against you.'
  if (wr >= 90) return 'You almost always get the deal.'
  if (wr >= 50) return 'You usually get the deal \u2014 but not always.'
  if (wr >= 20) return `You get the deal in roughly ${wr} of every 100 contests.`
  if (wr >= 5)
    return `You get the deal in roughly ${wr} of every 100 contests. Mostly someone else does.`
  if (wr >= 1) return 'You almost never get the deal. Luck has all but taken over.'
  return 'You essentially never win. Luck is calling the shots.'
}

export default function NarrativeStep3() {
  const [luckWeightPct, setLuckWeightPct] = useState(10)
  const [displayResult, setDisplayResult] = useState<{ winRate: number; skillWinRate: number } | null>(null)
  const [isComputing, setIsComputing] = useState(false)
  const cacheRef = useRef<Map<number, { winRate: number; skillWinRate: number }>>(new Map())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const compute = useCallback((pct: number) => {
    setIsComputing(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const result = estimateWinRate(pct / 100, N, PROTAG, cacheRef.current)
      setDisplayResult(result)
      setIsComputing(false)
    }, 80)
  }, [])

  // Compute initial value
  useEffect(() => {
    compute(luckWeightPct)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const wr = displayResult ? Math.round(displayResult.winRate) : null
  const skillWr = displayResult ? Math.round(displayResult.skillWinRate) : null

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
        <span style={{ color: 'var(--ink)' }}>03</span>
        <span className="rounded-full" style={{ width: 4, height: 4, background: 'var(--ink-3)' }} />
        <span>Why this happens</span>
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
        Pull the lever. <em style={{ fontStyle: 'italic' }}>Watch the unfairness move.</em>
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
        That tiny 10% slice of luck did all the damage. Two things move when you
        drag the slider. Your personal win rate &mdash; and, more tellingly, the share
        of contests in which the most-skilled contestant of all wins at all.
      </p>

      {/* Payoff stat */}
      <div style={{ margin: '24px 0' }}>
        <div style={{ textAlign: 'center', padding: '36px 0 28px' }}>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(96px, 14vw, 168px)',
              lineHeight: 1,
              fontWeight: 400,
              letterSpacing: '-0.04em',
              fontFeatureSettings: '"lnum", "tnum"',
              color: 'var(--ink)',
              transition: 'opacity 0.3s',
              opacity: isComputing ? 0.5 : 1,
            }}
          >
            {wr !== null ? wr : '\u2014'}
            <span
              style={{
                fontSize: '0.5em',
                color: 'var(--ink-3)',
                fontStyle: 'italic',
                verticalAlign: '0.18em',
                marginLeft: 2,
                fontFeatureSettings: 'normal',
              }}
            >
              %
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 22,
              color: 'var(--ink-2)',
              marginTop: 12,
            }}
          >
            {isComputing
              ? 'computing\u2026'
              : wr !== null
              ? wrToSub(wr, luckWeightPct)
              : ''}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '0.06em',
              color: 'var(--ink-3)',
              marginTop: 18,
              textTransform: 'uppercase',
            }}
          >
            luck weight: <b style={{ color: 'var(--ink)', fontWeight: 500 }}>{luckWeightPct}%</b>
            &nbsp;&middot;&nbsp;
            <span style={{ color: 'var(--ink)' }}>
              the most skilled wins anywhere:{' '}
              <b style={{ fontWeight: 500 }}>{skillWr !== null ? `${skillWr}%` : '\u2014'}</b>
            </span>
            &nbsp;&middot;&nbsp;
            field size: <b style={{ color: 'var(--ink)', fontWeight: 500 }}>2,000</b>
          </div>
        </div>

        {/* Slider */}
        <div style={{ margin: '36px auto 0', maxWidth: 640 }}>
          <div
            className="flex justify-between"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              marginBottom: 14,
            }}
          >
            <span style={{ color: 'var(--skill)' }}>Pure meritocracy</span>
            <span style={{ color: 'var(--luck)' }}>Pure chaos</span>
          </div>
          <div style={{ position: 'relative', padding: '14px 0' }}>
            <input
              type="range"
              min="0"
              max="100"
              value={luckWeightPct}
              step="1"
              className="big-slider"
              aria-label="How much luck matters"
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setLuckWeightPct(val)
                compute(val)
              }}
            />
          </div>
          <div
            className="flex justify-between items-baseline"
            style={{
              marginTop: 14,
              fontFamily: 'var(--font-sans)',
              fontSize: 13,
              color: 'var(--ink-3)',
            }}
          >
            <span>Skill is everything</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)', fontSize: 13 }}>
              luck weight = {luckWeightPct}%
            </span>
            <span>Luck is everything</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <p
        style={{
          fontSize: 19,
          lineHeight: 1.6,
          color: 'var(--ink-2)',
          maxWidth: '36em',
          margin: '36px 0 18px',
        }}
      >
        Watch the second number. As luck&apos;s share grows from a sliver, the share
        of contests in which the most-skilled contestant wins at all collapses
        fast. The cruelty isn&apos;t that luck matters &mdash; it&apos;s that{' '}
        <em>so little of it</em> matters so much. When a field is big and the top is
        tightly packed, luck quietly does the choosing.
      </p>

      <blockquote
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 22,
          lineHeight: 1.45,
          color: 'var(--ink)',
          borderLeft: '2px solid var(--ink)',
          padding: '4px 0 4px 20px',
          margin: '28px 0',
          maxWidth: '32em',
        }}
      >
        The winners aren&apos;t the most skilled. They&apos;re the most skilled who also got lucky.
      </blockquote>

      {/* Escape final */}
      <div
        style={{
          margin: '56px 0 0',
          padding: '56px 28px',
          textAlign: 'center',
          background: 'var(--ink)',
          color: 'var(--bg)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 32,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            margin: '0 0 14px',
          }}
        >
          Now go play with it yourself.
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'rgba(250,248,244,0.72)',
            fontSize: 17,
            margin: '0 auto 24px',
            maxWidth: '36em',
          }}
        >
          Adjust the field size. Push the luck weight to the extremes. See what
          breaks the model and what doesn&apos;t. The full simulation is one click away.
        </p>
        <Link
          href="/explore"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            fontWeight: 500,
            background: 'transparent',
            color: 'var(--bg)',
            border: '1px solid var(--bg)',
            padding: '16px 28px',
            borderRadius: 4,
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg)'
            e.currentTarget.style.color = 'var(--ink)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--bg)'
          }}
        >
          Open free exploration &rarr;
        </Link>
      </div>
    </section>
  )
}
