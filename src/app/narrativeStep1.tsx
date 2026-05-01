'use client'

import { useState } from 'react'

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
        <span style={{ color: 'var(--ink)' }}>01</span>
        <span className="rounded-full" style={{ width: 4, height: 4, background: 'var(--ink-3)' }} />
        <span>Meet the protagonist</span>
      </div>

      {/* Kicker */}
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
        You are <em style={{ fontStyle: 'italic', color: 'var(--ink)' }}>extraordinarily</em> good at what you do.
      </h1>

      {/* Lede */}
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
        You&apos;re a musician. Not a hobbyist &mdash; you&apos;re in the{' '}
        <em
          style={{
            background: 'linear-gradient(180deg, transparent 62%, var(--luck-soft) 62%)',
            fontStyle: 'normal',
            padding: '0 2px',
          }}
        >
          top 0.02%
        </em>{' '}
        of skill in your subgenre. You&apos;ve put in the hours. The talent was there to begin with.
      </p>

      {/* Body */}
      <p
        style={{
          fontSize: 19,
          lineHeight: 1.6,
          color: 'var(--ink-2)',
          maxWidth: '36em',
          margin: '0 0 18px',
        }}
      >
        This year, a label is watching your scene. They&apos;ll sign exactly one artist:
        whoever ends the year on top. Two thousand musicians are in the running.
        And luck, of course, plays its part &mdash; the right Spotify listener at the
        right time, a warm-up gig where someone in the business happens to be in
        the room, a rival&apos;s bad week. As it happens, you&apos;ve had a little more of
        that than most.
      </p>

      {/* Variation switcher */}
      <div style={{ margin: '18px 0 8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)',
            marginRight: 12,
          }}
        >
          View as
        </span>
        <div
          className="inline-flex"
          style={{
            border: '1px solid var(--rule)',
            borderRadius: 999,
            padding: 3,
            gap: 0,
            fontFamily: 'var(--font-sans)',
          }}
          role="tablist"
          aria-label="Step 1 visual variation"
        >
          {(['cards', 'curve'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVariation(v)}
              style={{
                background: variation === v ? 'var(--ink)' : 'transparent',
                color: variation === v ? 'var(--bg)' : 'var(--ink-3)',
                border: 0,
                padding: '6px 14px',
                fontSize: 12,
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
              }}
            >
              {v === 'cards' ? 'Stat card' : 'On the curve'}
            </button>
          ))}
        </div>
      </div>

      {/* Variation A: Stat cards */}
      {variation === 'cards' && (
        <div
          className="grid narrative-grid-3"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--rule)',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
            margin: '36px 0',
          }}
        >
          {[
            { label: 'Ability', value: '99', color: 'var(--skill)', foot: 'out of 100 — innate talent' },
            { label: 'Effort', value: '99', color: 'var(--skill)', foot: 'out of 100 — hours, dedication' },
            { label: 'Luck', value: '60', color: 'var(--luck)', foot: 'out of 100 — better than average' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2"
              style={{ background: 'var(--bg)', padding: '28px 24px 24px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                }}
              >
                {stat.label}
              </span>
              <span
                className="narrative-stat-num"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 64,
                  lineHeight: 1,
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  fontFeatureSettings: '"lnum", "tnum"',
                  color: stat.color,
                }}
              >
                {stat.value}
              </span>
              <span className="narrative-stat-foot" style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                {stat.foot}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Variation B: Distribution curve */}
      {variation === 'curve' && (
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--rule)',
            padding: '28px 28px 20px',
            margin: '36px 0',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
              margin: '0 0 16px',
            }}
          >
            Where you sit on the skill distribution
          </p>
          <svg
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ width: '100%', height: 180, display: 'block' }}
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
          <div
            className="flex justify-between"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--ink-3)', marginTop: 8 }}
          >
            <span>Skill score 0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}

      {/* Body continued */}
      <p
        style={{
          fontSize: 19,
          lineHeight: 1.6,
          color: 'var(--ink-2)',
          maxWidth: '36em',
          margin: '28px 0 18px',
        }}
      >
        The label awards the deal to whoever ends the year on top.
        Performance, in this world, is mostly skill &mdash; but a little luck slips in too:
        a viral clip, a chance introduction, a rival&apos;s bad week. About <b>10%</b> of it.
      </p>

      {/* Pull quote */}
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
        Ninety percent skill. Ten percent luck. You&apos;re in the top half-percent of skill,
        and slightly above average on luck. Surely the deal is yours.
      </blockquote>
    </section>
  )
}
