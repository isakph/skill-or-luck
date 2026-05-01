'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { estimateWinRate } from '@/lib/simulation'
import type { FixedContestant } from '@/lib/types'
import {
  bodyCopyClass,
  ledeClass,
  quoteClass,
  stepDotClass,
  stepMetaClass,
  stepTitleClass,
} from './narrativeStyles'

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
      <div className={stepMetaClass}>
        <span className="text-[var(--ink)]">03</span>
        <span className={stepDotClass} />
        <span>Why this happens</span>
      </div>

      <h1 className={stepTitleClass}>
        Pull the lever. <em className="italic">Watch the unfairness move.</em>
      </h1>

      <p className={ledeClass}>
        That tiny 10% slice of luck did all the damage. Two things move when you
        drag the slider. Your personal win rate &mdash; and, more tellingly, the share
        of contests in which the most-skilled contestant of all wins at all.
      </p>

      {/* Payoff stat */}
      <div className="my-5 sm:my-6">
        <div className="py-8 text-center sm:pb-7 sm:pt-9">
          <div
            className="font-serif text-[clamp(4.5rem,22vw,7.5rem)] font-normal leading-none tracking-normal text-[var(--ink)] transition-opacity sm:text-[clamp(6rem,14vw,10.5rem)]"
            style={{
              fontFeatureSettings: '"lnum", "tnum"',
              opacity: isComputing ? 0.5 : 1,
            }}
          >
            {wr !== null ? wr : '\u2014'}
            <span
              className="ml-0.5 align-[0.18em] text-[0.5em] italic text-[var(--ink-3)]"
              style={{ fontFeatureSettings: 'normal' }}
            >
              %
            </span>
          </div>
          <div className="mt-3 font-serif text-[18px] italic leading-snug text-[var(--ink-2)] sm:text-[22px]">
            {isComputing
              ? 'computing\u2026'
              : wr !== null
              ? wrToSub(wr, luckWeightPct)
              : ''}
          </div>
          <div className="mx-auto mt-4 flex max-w-[42rem] flex-wrap justify-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-normal text-[var(--ink-3)] sm:mt-[18px] sm:text-xs">
            <span>
              luck weight: <b className="font-medium text-[var(--ink)]">{luckWeightPct}%</b>
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-[var(--ink)]">
              the most skilled wins anywhere:{' '}
              <b className="font-medium">{skillWr !== null ? `${skillWr}%` : '\u2014'}</b>
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>
              field size: <b className="font-medium text-[var(--ink)]">2,000</b>
            </span>
          </div>
        </div>

        {/* Slider */}
        <div className="mx-auto mt-8 max-w-[640px] sm:mt-9">
          <div className="mb-3.5 flex justify-between gap-4 font-mono text-[10px] uppercase tracking-normal text-[var(--ink-3)] sm:text-[11px]">
            <span className="text-[var(--skill)]">Pure meritocracy</span>
            <span className="text-right text-[var(--luck)]">Pure chaos</span>
          </div>
          <div className="relative py-3.5">
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
          <div className="mt-3.5 grid grid-cols-1 gap-1 font-sans text-xs text-[var(--ink-3)] sm:grid-cols-3 sm:text-[13px]">
            <span>Skill is everything</span>
            <span className="font-mono text-[13px] text-[var(--ink)] sm:text-center">
              luck weight = {luckWeightPct}%
            </span>
            <span className="sm:text-right">Luck is everything</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <p className={`${bodyCopyClass} mt-8 sm:mt-9`}>
        Watch the second number. As luck&apos;s share grows from a sliver, the share
        of contests in which the most-skilled contestant wins at all collapses
        fast. The cruelty isn&apos;t that luck matters &mdash; it&apos;s that{' '}
        <em>so little of it</em> matters so much. When a field is big and the top is
        tightly packed, luck quietly does the choosing.
      </p>

      <blockquote className={quoteClass}>
        The winners aren&apos;t the most skilled. They&apos;re the most skilled who also got lucky.
      </blockquote>

      {/* Escape final */}
      <div className="mt-10 bg-[var(--ink)] px-5 py-9 text-center text-[var(--bg)] sm:mt-14 sm:px-7 sm:py-14">
        <h3 className="mb-3.5 font-serif text-2xl font-normal leading-tight tracking-normal sm:text-[32px]">
          Now go play with it yourself.
        </h3>
        <p className="mx-auto mb-6 max-w-[36em] font-serif text-base leading-relaxed text-[rgba(250,248,244,0.72)] sm:text-[17px]">
          Adjust the field size. Push the luck weight to the extremes. See what
          breaks the model and what doesn&apos;t. The full simulation is one click away.
        </p>
        <Link
          href="/explore"
          className="inline-block rounded border border-[var(--bg)] px-5 py-3.5 font-sans text-sm font-medium text-[var(--bg)] no-underline transition-colors hover:bg-[var(--bg)] hover:text-[var(--ink)] sm:px-7 sm:py-4 sm:text-base"
        >
          Open free exploration &rarr;
        </Link>
      </div>
    </section>
  )
}
