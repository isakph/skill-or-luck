import type { BeeswarmPoint, ContestSnapshot, ContestWinner, SimulationParams, SimulationResults } from './types'

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
