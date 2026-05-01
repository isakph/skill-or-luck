export interface SimulationParams {
  n: number;          // contestants per contest (100–100,000)
  m: number;          // contests in a batch (100–10,000)
  luckWeight: number; // fraction of performance from luck (0.01–0.20)
}

export interface ContestWinner {
  ability: number;
  effort: number;
  luck: number;
  skillScore: number;       // (ability + effort) / 2
  performance: number;
  wasHighestSkill: boolean; // true if this contestant had the highest skillScore
  skillGap: number;         // winner's performance - most-skilled's performance, floored at 0
  topSkillScore: number;    // skill score of the most-skilled contestant in this contest
  topSkillLuck: number;     // luck score of that same contestant
}

export interface SimulationResults {
  params: SimulationParams;
  winners: ContestWinner[];
  avgWinnerLuck: number;
  avgWinnerSkill: number;
  pctLuckWins: number;  // % of contests where the most-skilled contestant did NOT win
  luckScores: number[]; // winners.map(w => w.luck) — kept for Phase 2 histogram
  avgSkillGap: number;
}

export interface SweepPoint {
  n: number;
  avgWinnerLuck: number;
}

export interface BeeswarmPoint {
  skillScore: number;
  jitterY: number;      // random [-1, 1], assigned once in runContestWithField
  isWinner: boolean;
  isTopSkill: boolean;
}

export interface ContestSnapshot {
  winner: ContestWinner;
  field: BeeswarmPoint[];  // reservoir-sampled, max 500 points
}

export interface FixedContestant {
  ability: number;
  effort: number;
  luck: number;
}

export interface ProtagSample {
  skill: number;
  luck: number;
  perf: number;
  isYou: boolean;
  isWinner: boolean;
}

export interface ProtagContestResult {
  rank: number;
  youWon: boolean;
  youPerf: number;
  winnerSkill: number;
  winnerLuck: number;
  winnerPerf: number;
  mostSkilledWon: boolean;
  sample: ProtagSample[];
}

export interface ProtagBatchResult {
  wins: number;
  totalContests: number;
  avgRank: number;
  mostSkilledWonPct: number;
  winnerLuckBins: number[];  // 20 bins, each 5 wide (0-5, 5-10, ..., 95-100)
}
