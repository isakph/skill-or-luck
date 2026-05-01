'use client'

import { useState } from 'react'
import {
  bodyCopyClass,
  ledeClass,
  monoCapsClass,
  quoteClass,
  stepDotClass,
  stepMetaClass,
  stepTitleClass,
} from './narrativeStyles'

export default function NarrativeStep1() {
  const [variation, setVariation] = useState<'cards' | 'curve'>('cards')

  // Build triangular distribution path
  const W = 600, H = 160, TOP = 36
  let areaPath = `M 0 ${H}`
  let linePath = ''
  for (let x = 0; x <= 100; x += 2) {
    const f = x <= 50 ? x / 50 : (100 - x) / 50
    const px = (x / 100) * W
    const py = H - f * (H - TOP)
    areaPath += ` L ${px.toFixed(1)} ${py.toFixed(1)}`
    linePath += (linePath ? ' L ' : 'M ') + px.toFixed(1) + ' ' + py.toFixed(1)
  }
  areaPath += ` L ${W} ${H} Z`

  return (
    <section>
      {/* Step meta */}
      <div className={stepMetaClass}>
        <span className="text-[var(--ink)]">01</span>
        <span className={stepDotClass} />
        <span>Meet the protagonist</span>
      </div>

      {/* Kicker */}
      <h1 className={stepTitleClass}>
        You are <em className="italic text-[var(--ink)]">extraordinarily</em> good at what you do.
      </h1>

      {/* Lede */}
      <p className={ledeClass}>
        You&apos;re a musician. Not a hobbyist &mdash; you&apos;re in the{' '}
        <em className="bg-[linear-gradient(180deg,transparent_62%,var(--luck-soft)_62%)] px-0.5 not-italic">
          top 0.02%
        </em>{' '}
        of skill in your subgenre. You&apos;ve put in the hours. The talent was there to begin with.
      </p>

      {/* Body */}
      <p className={bodyCopyClass}>
        This year, a label is watching your scene. They&apos;ll sign exactly one artist:
        whoever ends the year on top. Two thousand musicians are in the running.
        And luck, of course, plays its part &mdash; the right Spotify listener at the
        right time, a warm-up gig where someone in the business happens to be in
        the room, a rival&apos;s bad week. As it happens, you&apos;ve had a little more of
        that than most.
      </p>

      {/* Variation switcher */}
      <div className="my-5 flex flex-wrap items-center gap-2">
        <span className={monoCapsClass}>
          View as
        </span>
        <div
          className="inline-flex rounded-full border border-[var(--rule)] p-0.5 font-sans"
          role="tablist"
          aria-label="Step 1 visual variation"
        >
          {(['cards', 'curve'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVariation(v)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs tracking-normal transition-colors ${
                variation === v
                  ? 'bg-[var(--ink)] text-[var(--bg)]'
                  : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
              }`}
            >
              {v === 'cards' ? 'Stat card' : 'On the curve'}
            </button>
          ))}
        </div>
      </div>

      {/* Variation A: Stat cards */}
      {variation === 'cards' && (
        <div
          className="my-8 grid grid-cols-3 gap-px border-y border-[var(--rule)] bg-[var(--rule)] sm:my-9"
        >
          {[
            { label: 'Ability', value: '99', color: 'var(--skill)', foot: 'out of 100 — innate talent' },
            { label: 'Effort', value: '99', color: 'var(--skill)', foot: 'out of 100 — hours, dedication' },
            { label: 'Luck', value: '60', color: 'var(--luck)', foot: 'out of 100 — better than average' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex min-w-0 flex-col gap-1.5 bg-[var(--bg)] px-2 py-4 sm:gap-2 sm:px-6 sm:pb-6 sm:pt-7"
            >
              <span className={monoCapsClass}>
                {stat.label}
              </span>
              <span
                className="font-serif text-[clamp(2rem,11vw,2.75rem)] font-normal leading-none tracking-normal sm:text-[64px]"
                style={{
                  fontFeatureSettings: '"lnum", "tnum"',
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
              <span className="break-words font-sans text-[10px] leading-snug text-[var(--ink-3)] sm:mt-1 sm:text-xs">
                {stat.foot}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Variation B: Distribution curve */}
      {variation === 'curve' && (
        <div className="my-8 border border-[var(--rule)] bg-[var(--bg)] p-4 pb-3 sm:my-9 sm:p-7 sm:pb-5">
          <p className={`${monoCapsClass} mb-4`}>
            Where you sit on the skill distribution
          </p>
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="block h-36 w-full sm:h-[180px]"
          >
            <line x1="0" y1="160" x2="600" y2="160" stroke="var(--rule)" strokeWidth="1" />
            <path d={areaPath} fill="#e8e1d1" stroke="none" />
            <path d={linePath} fill="none" stroke="var(--ink)" strokeWidth="1.4" />
            {/* Protagonist marker at skill=99 */}
            <line x1="594" y1="160" x2="594" y2="36" stroke="var(--skill)" strokeWidth="2" />
            <circle cx="594" cy="36" r="6" fill="var(--skill)" />
            <text
              x="588"
              y="28"
              textAnchor="end"
              fill="var(--skill)"
              fontFamily="var(--font-sans)"
              fontSize="11"
              fontWeight="600"
            >
              You — 99
            </text>
            {/* Average marker at 50 */}
            <line x1="300" y1="160" x2="300" y2="120" stroke="var(--ink-3)" strokeWidth="1" strokeDasharray="3 3" />
            <text
              x="300"
              y="115"
              textAnchor="middle"
              fill="var(--ink-3)"
              fontFamily="var(--font-mono)"
              fontSize="10"
            >
              avg 50
            </text>
          </svg>
          <div className="mt-2 flex justify-between font-sans text-xs text-[var(--ink-3)]">
            <span>Skill score 0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}

      {/* Body continued */}
      <p className={`${bodyCopyClass} mt-7`}>
        The label awards the deal to whoever ends the year on top.
        Performance, in this world, is mostly skill &mdash; but a little luck slips in too:
        a viral clip, a chance introduction, a rival&apos;s bad week. About <b>10%</b> of it.
      </p>

      {/* Pull quote */}
      <blockquote className={quoteClass}>
        Ninety percent skill. Ten percent luck. You&apos;re in the top half-percent of skill,
        and slightly above average on luck. Surely the deal is yours.
      </blockquote>
    </section>
  )
}
