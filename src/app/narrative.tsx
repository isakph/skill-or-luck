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
        className="sticky top-0 z-50 border-b border-[var(--rule)]"
        style={{
          background: 'color-mix(in oklch, var(--bg) 88%, transparent)',
          backdropFilter: 'saturate(140%) blur(12px)',
          WebkitBackdropFilter: 'saturate(140%) blur(12px)',
        }}
      >
        <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-7 sm:py-3.5">
          <div className="flex items-baseline gap-2.5 font-serif text-sm leading-tight tracking-normal text-[var(--ink-2)]">
            <span className="inline-block h-2 w-2 shrink-0 translate-y-[-1px] rounded-full bg-[var(--ink)]" />
            <span>
              <strong className="font-semibold tracking-normal text-[var(--ink)]">Skill or Luck</strong>
              &nbsp;&middot;&nbsp;a short story in three parts
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans">
            <span className="font-mono text-[11px] uppercase tracking-normal text-[var(--ink-3)]">
              Step {step} of {TOTAL_STEPS}
            </span>
            <Link
              href="/explore"
              className="border-b border-[var(--rule)] pb-px text-[13px] text-[var(--ink-2)] no-underline transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              Skip to free exploration &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Stage */}
      <main className="mx-auto w-full max-w-[880px] px-5 pb-8 pt-12 sm:px-7 sm:pb-12 sm:pt-20">
        <div key={step} className="animate-fade-up">
          {step === 1 && <NarrativeStep1 />}
          {step === 2 && <NarrativeStep2 />}
          {step === 3 && <NarrativeStep3 />}
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="mx-auto mt-6 grid w-full max-w-[880px] grid-cols-[1fr_auto_1fr] items-center gap-2 border-t border-[var(--rule)] px-5 py-6 sm:mt-8 sm:gap-4 sm:px-7 sm:pb-10 sm:pt-7">
        <button
          disabled={step === 1}
          onClick={() => goToStep(step - 1)}
          className={`justify-self-start rounded border px-3 py-2.5 font-sans text-xs font-medium transition-colors disabled:cursor-default disabled:opacity-50 sm:px-[22px] sm:py-3 sm:text-sm ${
            step === 1
              ? 'border-[var(--rule)] text-[var(--ink-3)]'
              : 'cursor-pointer border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--bg-2)]'
          }`}
        >
          &larr; Previous
        </button>

        <div className="flex gap-1.5" aria-label="Step indicator">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => goToStep(s)}
              aria-label={`Go to step ${s}`}
              aria-current={s === step ? 'step' : undefined}
              className={`h-1 cursor-pointer rounded-full border-0 transition-[background,width] ${
                s === step ? 'w-9 bg-[var(--ink)] sm:w-11' : 'w-6 bg-[var(--rule)] sm:w-7'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (step === TOTAL_STEPS) goToStep(1)
            else goToStep(step + 1)
          }}
          className="justify-self-end rounded bg-[var(--ink)] px-3 py-2.5 font-sans text-xs font-medium text-[var(--bg)] transition-colors hover:bg-[var(--ink-2)] sm:px-[22px] sm:py-3 sm:text-sm"
        >
          {step === TOTAL_STEPS ? 'Replay story \u21BA' : 'Next \u2192'}
        </button>
      </nav>
    </>
  )
}
