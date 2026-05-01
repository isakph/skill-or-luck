import type { BeeswarmPoint, ContestSnapshot, ContestWinner, FixedContestant, ProtagBatchResult, ProtagContestResult, ProtagSample, SimulationParams, SimulationResults } from './types'

function runContest(n: number, luckWeight: number): ContestWinner {
  let winnerAbility = 0
  let winnerEffort = 0
  let winnerLuck = 0
  let winnerPerformance = -Infinity

  let topSkillScore = -Infinity
  let topSkilledPerformance = -Infinity
  let topSkillLuck = 0

  for (let i = 0; i < n; i++) {
    const ability = Math.random() * 100
    const effort = Math.random() * 100
    const luck = Math.random() * 100
    const skillScore = (ability + effort) / 2
    const performance = (1 - luckWeight) * skillScore + luckWeight * luck

    if (performance > winnerPerformance) {
      winnerAbility = ability
      winnerEffort = effort
      winnerLuck = luck
      winnerPerformance = performance
    }

    if (skillScore > topSkillScore) {
      topSkillScore = skillScore
      topSkilledPerformance = performance
      topSkillLuck = luck
    }
  }

  const winnerSkillScore = (winnerAbility + winnerEffort) / 2

  return {
    ability: winnerAbility,
    effort: winnerEffort,
    luck: winnerLuck,
    skillScore: winnerSkillScore,
    performance: winnerPerformance,
    wasHighestSkill: winnerSkillScore === topSkillScore,
    skillGap: Math.max(0, winnerPerformance - topSkilledPerformance),
    topSkillScore,
    topSkillLuck,
  }
}

export function computeStats(winners: ContestWinner[], params: SimulationParams): SimulationResults {
  const m = winners.length
  const avgWinnerLuck = winners.reduce((sum, w) => sum + w.luck, 0) / m
  const avgWinnerSkill = winners.reduce((sum, w) => sum + w.skillScore, 0) / m
  const pctLuckWins = (winners.filter(w => !w.wasHighestSkill).length / m) * 100
  const avgSkillGap = winners.reduce((sum, w) => sum + w.skillGap, 0) / m

  return {
    params,
    winners,
    avgWinnerLuck,
    avgWinnerSkill,
    pctLuckWins,
    luckScores: winners.map(w => w.luck),
    avgSkillGap,
  }
}

export function runSimulation(params: SimulationParams): SimulationResults {
  const { n, m, luckWeight } = params
  const winners: ContestWinner[] = []

  for (let i = 0; i < m; i++) {
    winners.push(runContest(n, luckWeight))
  }

  return computeStats(winners, params)
}

const BEESWARM_CAP = 500

export function runContestWithField(n: number, luckWeight: number): ContestSnapshot {
  let winnerAbility = 0
  let winnerEffort = 0
  let winnerLuck = 0
  let winnerPerformance = -Infinity

  let topSkillScore = -Infinity
  let topSkilledPerformance = -Infinity
  let topSkillLuck = 0

  type RawPoint = { skillScore: number; luck: number; performance: number }
  const reservoir: RawPoint[] = []

  for (let i = 0; i < n; i++) {
    const ability = Math.random() * 100
    const effort = Math.random() * 100
    const luck = Math.random() * 100
    const skillScore = (ability + effort) / 2
    const performance = (1 - luckWeight) * skillScore + luckWeight * luck

    if (performance > winnerPerformance) {
      winnerAbility = ability
      winnerEffort = effort
      winnerLuck = luck
      winnerPerformance = performance
    }

    if (skillScore > topSkillScore) {
      topSkillScore = skillScore
      topSkilledPerformance = performance
      topSkillLuck = luck
    }

    // Reservoir sampling (Algorithm R)
    if (i < BEESWARM_CAP) {
      reservoir.push({ skillScore, luck, performance })
    } else {
      const j = Math.floor(Math.random() * (i + 1))
      if (j < BEESWARM_CAP) {
        reservoir[j] = { skillScore, luck, performance }
      }
    }
  }

  const winnerSkillScore = (winnerAbility + winnerEffort) / 2
  const wasHighestSkill = winnerSkillScore === topSkillScore

  // Guarantee winner and (if different) top-skill are visible in the beeswarm
  reservoir[0] = { skillScore: winnerSkillScore, luck: winnerLuck, performance: winnerPerformance }
  if (!wasHighestSkill && reservoir.length > 1) {
    reservoir[1] = { skillScore: topSkillScore, luck: topSkillLuck, performance: topSkilledPerformance }
  }

  const field: BeeswarmPoint[] = reservoir.map((p, idx) => ({
    skillScore: p.skillScore,
    jitterY: Math.random() * 2 - 1,
    isWinner: idx === 0,
    isTopSkill: idx === 1 && !wasHighestSkill,
  }))

  const winner: ContestWinner = {
    ability: winnerAbility,
    effort: winnerEffort,
    luck: winnerLuck,
    skillScore: winnerSkillScore,
    performance: winnerPerformance,
    wasHighestSkill,
    skillGap: Math.max(0, winnerPerformance - topSkilledPerformance),
    topSkillScore,
    topSkillLuck,
  }

  return { winner, field }
}

// --- Protagonist-based simulation functions (for narrative) ---

export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = seed
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PROTAG_SAMPLE_CAP = 220

export function runContestWithProtag(
  rand: () => number,
  n: number,
  w: number,
  protag: FixedContestant,
): ProtagContestResult {
  const protagSkill = (protag.ability + protag.effort) / 2
  const protagPerf = (1 - w) * protagSkill + w * protag.luck

  let bestPerf = protagPerf
  let bestSkill = protagSkill
  let bestLuck = protag.luck
  let higher = 0

  let topSkill = protagSkill
  let topSkillPerf = protagPerf

  const sample: ProtagSample[] = [
    { skill: protagSkill, luck: protag.luck, perf: protagPerf, isYou: true, isWinner: false },
  ]

  for (let i = 1; i < n; i++) {
    const a = rand() * 100
    const e = rand() * 100
    const l = rand() * 100
    const s = (a + e) / 2
    const p = (1 - w) * s + w * l

    if (p > protagPerf) higher++
    if (p > bestPerf) {
      bestPerf = p
      bestSkill = s
      bestLuck = l
    }
    if (s > topSkill) {
      topSkill = s
      topSkillPerf = p
    }

    // Reservoir sampling for beeswarm (slot 0 is protagonist, never overwritten)
    if (sample.length < PROTAG_SAMPLE_CAP) {
      sample.push({ skill: s, luck: l, perf: p, isYou: false, isWinner: false })
    } else {
      const j = Math.floor(rand() * (i + 1))
      if (j > 0 && j < PROTAG_SAMPLE_CAP) {
        sample[j] = { skill: s, luck: l, perf: p, isYou: false, isWinner: false }
      }
    }
  }

  // Mark the winner in the sample (find closest match to winner's skill)
  if (higher > 0) {
    // protagonist didn't win — find the winner proxy in the sample
    let closestIdx = -1
    let closestDist = Infinity
    for (let i = 1; i < sample.length; i++) {
      const d = Math.abs(sample[i].skill - bestSkill) + Math.abs(sample[i].luck - bestLuck)
      if (d < closestDist) {
        closestDist = d
        closestIdx = i
      }
    }
    if (closestIdx >= 0) {
      sample[closestIdx] = {
        skill: bestSkill,
        luck: bestLuck,
        perf: bestPerf,
        isYou: false,
        isWinner: true,
      }
    }
  } else {
    // protagonist won
    sample[0].isWinner = true
  }

  const mostSkilledWon = topSkillPerf >= bestPerf

  return {
    rank: higher + 1,
    youWon: higher === 0,
    youPerf: protagPerf,
    winnerSkill: bestSkill,
    winnerLuck: bestLuck,
    winnerPerf: bestPerf,
    mostSkilledWon,
    sample,
  }
}

export function runBatchWithProtag(
  numContests: number,
  n: number,
  w: number,
  protag: FixedContestant,
): ProtagBatchResult {
  let wins = 0
  let rankSum = 0
  let mostSkilledWins = 0
  const luckBins = new Array(20).fill(0)

  for (let k = 0; k < numContests; k++) {
    const r = runContestWithProtag(Math.random, n, w, protag)
    if (r.youWon) wins++
    rankSum += r.rank
    if (r.mostSkilledWon) mostSkilledWins++
    const bin = Math.min(19, Math.floor(r.winnerLuck / 5))
    luckBins[bin]++
  }

  return {
    wins,
    totalContests: numContests,
    avgRank: rankSum / numContests,
    mostSkilledWonPct: (mostSkilledWins / numContests) * 100,
    winnerLuckBins: luckBins,
  }
}

export function estimateWinRate(
  luckWeight: number,
  n: number,
  protag: FixedContestant,
  cache: Map<number, { winRate: number; skillWinRate: number }>,
): { winRate: number; skillWinRate: number } {
  const key = Math.round(luckWeight * 100)
  const cached = cache.get(key)
  if (cached) return cached

  const M = 600
  let wins = 0
  let mostSkilledWins = 0

  for (let k = 0; k < M; k++) {
    const r = runContestWithProtag(Math.random, n, luckWeight, protag)
    if (r.youWon) wins++
    if (r.mostSkilledWon) mostSkilledWins++
  }

  const out = {
    winRate: (wins / M) * 100,
    skillWinRate: (mostSkilledWins / M) * 100,
  }
  cache.set(key, out)
  return out
}

export function findDramaticSeed(
  n: number,
  w: number,
  protag: FixedContestant,
): { seed: number; result: ProtagContestResult } {
  for (let seed = 1; seed < 200; seed++) {
    const rand = mulberry32(seed)
    const r = runContestWithProtag(rand, n, w, protag)
    if (!r.youWon && r.winnerSkill < 97 && r.winnerSkill > 88 && r.winnerLuck > 92) {
      return { seed, result: r }
    }
  }
  // Fallback: just use seed 1
  return { seed: 1, result: runContestWithProtag(mulberry32(1), n, w, protag) }
}
