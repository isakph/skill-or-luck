'use client'

import { useState } from 'react'
import Link from 'next/link'
import NarrativeStep1 from './narrativeStep1'
import NarrativeStep2 from './narrativeStep2'
import NarrativeStep3 from './narrativeStep3'

const TOTAL_STEPS = 3

export default function Narrative() {
  const [step, setStep] = useState(1)

  function goToStep(n: number) {
    setStep(Math.max(1, Math.min(TOTAL_STEPS, n)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'color-mix(in oklch, var(--bg) 88%, transparent)',
          backdropFilter: 'saturate(140%) blur(12px)',
          WebkitBackdropFilter: 'saturate(140%) blur(12px)',
          borderColor: 'var(--rule)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-4 narrative-topbar-inner"
          style={{ maxWidth: 1100, padding: '14px 28px' }}
        >
          <div
            className="flex items-baseline gap-2.5"
            style={{ fontFamily: 'var(--font-serif)', fontSize: 14, letterSpacing: '0.02em', color: 'var(--ink-2)' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, background: 'var(--ink)', transform: 'translateY(-1px)' }}
            />
            <span>
              <strong style={{ color: 'var(--ink)', fontWeight: 600, letterSpacing: 0 }}>Skill or Luck</strong>
              &nbsp;&middot;&nbsp;a short story in three parts
            </span>
          </div>
          <div className="flex items-center gap-4" style={{ fontFamily: 'var(--font-sans)' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
              }}
            >
              Step {step} of {TOTAL_STEPS}
            </span>
            <Link
              href="/explore"
              className="no-underline transition-colors"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--ink-2)',
                borderBottom: '1px solid var(--rule)',
                paddingBottom: 1,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--ink)'
                e.currentTarget.style.borderBottomColor = 'var(--ink)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--ink-2)'
                e.currentTarget.style.borderBottomColor = 'var(--rule)'
              }}
            >
              Skip to free exploration &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Stage */}
      <main className="narrative-stage" style={{ maxWidth: 880, margin: '0 auto', padding: '80px 28px 120px', minHeight: '78vh' }}>
        <div key={step} className="animate-fade-up">
          {step === 1 && <NarrativeStep1 />}
          {step === 2 && <NarrativeStep2 />}
          {step === 3 && <NarrativeStep3 />}
        </div>
      </main>

      {/* Bottom nav */}
      <nav
        className="flex items-center justify-between"
        style={{
          maxWidth: 880,
          margin: '56px auto 0',
          padding: '28px 28px 80px',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <button
          disabled={step === 1}
          onClick={() => goToStep(step - 1)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 500,
            background: 'transparent',
            color: step === 1 ? 'var(--ink-3)' : 'var(--ink)',
            border: `1px solid ${step === 1 ? 'var(--rule)' : 'var(--ink)'}`,
            padding: '12px 22px',
            borderRadius: 4,
            cursor: step === 1 ? 'default' : 'pointer',
            opacity: step === 1 ? 0.5 : 1,
          }}
        >
          &larr; Previous
        </button>

        <div className="flex gap-1.5" aria-label="Step indicator">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => goToStep(s)}
              aria-label={`Go to step ${s}`}
              style={{
                width: s === step ? 44 : 28,
                height: 4,
                background: s === step ? 'var(--ink)' : 'var(--rule)',
                borderRadius: 999,
                border: 0,
                cursor: 'pointer',
                transition: 'background 0.2s, width 0.2s',
              }}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (step === TOTAL_STEPS) goToStep(1)
            else goToStep(step + 1)
          }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 14,
            fontWeight: 500,
            background: 'var(--ink)',
            color: 'var(--bg)',
            border: 0,
            padding: '12px 22px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {step === TOTAL_STEPS ? 'Replay story \u21BA' : 'Next \u2192'}
        </button>
      </nav>
    </>
  )
}
