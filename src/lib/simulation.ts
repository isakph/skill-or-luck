import type { ContestWinner, SimulationParams, SimulationResults } from './types'

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

export function runSimulation(params: SimulationParams): SimulationResults {
  const { n, m, luckWeight } = params
  const winners: ContestWinner[] = []

  for (let i = 0; i < m; i++) {
    winners.push(runContest(n, luckWeight))
  }

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
