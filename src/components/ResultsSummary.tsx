import type { SimulationResults } from '@/lib/types'

interface Props {
  results: SimulationResults
}

export default function ResultsSummary({ results }: Props) {
  return (
    <section className="border border-zinc-200 rounded-lg p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Results</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        <dt className="text-zinc-500 text-sm">Contestants per contest</dt>
        <dd className="font-semibold">{results.params.n.toLocaleString()}</dd>

        <dt className="text-zinc-500 text-sm">Contests run</dt>
        <dd className="font-semibold">{results.params.m.toLocaleString()}</dd>

        <dt className="text-zinc-500 text-sm">Luck weight</dt>
        <dd className="font-semibold">{(results.params.luckWeight * 100).toFixed(0)}%</dd>

        <dt className="text-zinc-500 text-sm">Avg winner luck score</dt>
        <dd className="font-semibold text-amber-600">{results.avgWinnerLuck.toFixed(1)}</dd>

        <dt className="text-zinc-500 text-sm">Avg winner skill score</dt>
        <dd className="font-semibold text-blue-600">{results.avgWinnerSkill.toFixed(1)}</dd>

        <dt className="text-zinc-500 text-sm">Most-skilled didn&apos;t win</dt>
        <dd className="font-semibold">{results.pctLuckWins.toFixed(1)}%</dd>

        <dt className="text-zinc-500 text-sm">Avg skill gap</dt>
        <dd className="font-semibold">{results.avgSkillGap.toFixed(2)}</dd>
      </dl>
    </section>
  )
}
