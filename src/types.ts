export type TimeSlot = 'skip' | '16' | '17' | '18' | '19' | '20+'
export type Amount = 'tiny' | 'light' | 'ok' | 'much' | 'alot' | 'tons'
export type Drink = 'none' | 'free' | 'small' | 'big'
export type ExerciseId = 'gym' | 'run' | 'walk' | 'swim' | 'bike' | 'yoga' | 'ball' | 'hiit'

export interface DayRecord {
  date: string // YYYY-MM-DD
  slot: TimeSlot | null
  amount: Amount | null
  drink: Drink | null
  exercises: ExerciseId[]
}

export type Verdict = 'pending' | 'perfect' | 'win' | 'plain' | 'fail'

export interface ScorePart {
  label: string
  pts: number
}

export interface DayEval {
  score: number
  parts: ScorePart[]
  verdict: Verdict
}

export interface Stats {
  totalDays: number
  winDays: number // 击退数（含暴击）
  perfectDays: number // 暴击击败数
  failDays: number // 被回血日
  rate: number // 0~1 击退率
  curStreak: number
  maxStreak: number
  firstDate: string | null
  dayNumber: number // 坚持第 N 天（自首条记录）
  weekendPairs: number // 周末双杀
  exerciseCount: number
  earlyDinners: number // 17点前（含）吃完的天数
  killsByMonster: Record<string, number> // monsterId -> 击败次数
}
