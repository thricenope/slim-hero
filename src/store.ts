import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemo } from 'react'
import type { DayRecord, ExerciseId, Stats, Verdict } from './types'
import { today } from './logic/dates'
import { computeStats } from './logic/stats'
import { evaluate, isPerfect, isRecorded, isWin } from './logic/scoring'
import { ACHIEVEMENTS, achById, XP_PER_TIER } from './logic/quests'
import { levelFromXp } from './logic/level'

export interface FightResult {
  verdict: Verdict
  score: number
  newUnlocked: string[]
  levelBefore: number
  levelAfter: number
}

interface ImportPayload {
  records?: Record<string, DayRecord>
  unlocked?: Record<string, string>
  celebrated?: Record<string, true>
}

interface GameState {
  records: Record<string, DayRecord>
  unlocked: Record<string, string> // 成就 id -> 解锁日期
  celebrated: Record<string, true> // 已弹窗庆祝过的成就
  pendingCelebrate: string[] // 待庆祝的成就队列

  setDay: (date: string, rec: DayRecord) => FightResult
  clearDay: (date: string) => void
  dismissOneCelebrate: () => void
  importData: (data: ImportPayload) => void
  resetAll: () => void
}

/** 单日经验：击退 +20，暴击再 +10，运动每项 +2（每天封顶 +4）——战斗页展示与结算共用 */
export const dayXp = (r: DayRecord | undefined | null): number =>
  (isWin(r) ? 20 : 0) + (isPerfect(r) ? 10 : 0) + Math.min(r?.exercises.length ?? 0, 2) * 2

/** 全部经验由记录推导，改历史/重结算不会刷分 */
export const xpFromRecords = (records: Record<string, DayRecord>): number => {
  let xp = 0
  for (const r of Object.values(records)) xp += dayXp(r)
  return xp
}

export const xpFromUnlocked = (unlocked: Record<string, string>): number =>
  Object.keys(unlocked).reduce((sum, id) => {
    const a = achById(id)
    return sum + (a ? a.tier * XP_PER_TIER : 0)
  }, 0)

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      records: {},
      unlocked: {},
      celebrated: {},
      pendingCelebrate: [],

      setDay: (date, rec) => {
        const state = get()

        // 未来日期一律不许结算（防提前刷经验/连击/成就）
        if (date > today()) {
          const ev = evaluate(rec)
          const lvl = levelFromXp(xpFromRecords(state.records) + xpFromUnlocked(state.unlocked)).level
          return { verdict: ev.verdict, score: ev.score, newUnlocked: [], levelBefore: lvl, levelAfter: lvl }
        }

        const records = { ...state.records, [date]: rec }
        const xpBefore = xpFromRecords(state.records) + xpFromUnlocked(state.unlocked)
        const levelBefore = levelFromXp(xpBefore).level

        // 清掉空记录，避免脏数据
        if (!rec.slot && !rec.amount && !rec.drink && rec.exercises.length === 0) {
          delete records[date]
        }

        const newUnlocked: string[] = []
        const unlocked = { ...state.unlocked }
        const celebrated = { ...state.celebrated }
        const pendingCelebrate = [...state.pendingCelebrate]
        for (const a of ACHIEVEMENTS) {
          if (unlocked[a.id]) continue
          if (a.value(computeStats(records)) >= a.goal) {
            unlocked[a.id] = today()
            newUnlocked.push(a.id)
            if (!celebrated[a.id]) {
              celebrated[a.id] = true
              // 只有结算「今天」才弹窗；补历史静默解锁，否则一次补 30 天会连弹十几个窗
              if (date === today()) pendingCelebrate.push(a.id)
            }
          }
        }

        const xpAfter = xpFromRecords(records) + xpFromUnlocked(unlocked)
        const levelAfter = levelFromXp(xpAfter).level

        set({ records, unlocked, celebrated, pendingCelebrate })

        const ev = evaluate(rec)
        return {
          verdict: ev.verdict,
          score: ev.score,
          newUnlocked,
          levelBefore,
          levelAfter,
        }
      },

      clearDay: (date) => {
        const records = { ...get().records }
        delete records[date]
        set({ records })
      },

      dismissOneCelebrate: () => {
        const [, ...rest] = get().pendingCelebrate
        set({ pendingCelebrate: rest })
      },

      importData: (data) => {
        if (!data || typeof data !== 'object' || !data.records) throw new Error('格式不对')
        // 枚举白名单：非法值一律归 null/剔除，坏文件不会再让评分表崩溃白屏
        const SLOTS = new Set(['skip', '16', '17', '18', '19', '20+'])
        const AMOUNTS = new Set(['tiny', 'light', 'ok', 'much', 'alot', 'tons'])
        const DRINKS = new Set(['none', 'free', 'small', 'big'])
        const EXERCISES = new Set(['gym', 'run', 'walk', 'swim', 'bike', 'yoga', 'ball', 'hiit'])
        const records: Record<string, DayRecord> = {}
        for (const [date, raw] of Object.entries(data.records)) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date > today()) continue
          const r = (raw ?? {}) as DayRecord
          const rec: DayRecord = {
            date,
            slot: typeof r.slot === 'string' && SLOTS.has(r.slot) ? r.slot : null,
            amount: typeof r.amount === 'string' && AMOUNTS.has(r.amount) ? r.amount : null,
            drink: typeof r.drink === 'string' && DRINKS.has(r.drink) ? r.drink : null,
            exercises: Array.isArray(r.exercises)
              ? r.exercises.filter((e): e is ExerciseId => typeof e === 'string' && EXERCISES.has(e))
              : [],
          }
          if (!isRecorded(rec)) continue // 空记录不导入，避免虚增开战天数
          records[date] = rec
        }
        // 成就优先恢复导出文件里的解锁记录（含解锁日期）；老备份没有才按现状重算
        let unlocked: Record<string, string> = {}
        if (data.unlocked && typeof data.unlocked === 'object') {
          for (const [id, at] of Object.entries(data.unlocked)) {
            if (achById(id) && typeof at === 'string') unlocked[id] = at
          }
        }
        if (Object.keys(unlocked).length === 0) {
          for (const a of ACHIEVEMENTS) {
            if (a.value(computeStats(records)) >= a.goal) unlocked[a.id] = today()
          }
        }
        // 导入恢复不弹窗庆祝
        const celebrated: Record<string, true> = {}
        for (const id of Object.keys(unlocked)) celebrated[id] = true
        set({ records, unlocked, celebrated, pendingCelebrate: [] })
      },

      resetAll: () => set({ records: {}, unlocked: {}, celebrated: {}, pendingCelebrate: [] }),
    }),
    { name: 'slim-hero-v1' },
  ),
)

/** 便捷选择器（派生数据用 useMemo 计算，避免无限重渲染） */
export const useStats = (): Stats => {
  const records = useGame((s) => s.records)
  return useMemo(() => computeStats(records), [records])
}
export const useTodayRecord = (): DayRecord | undefined =>
  useGame((s) => s.records[today()])
export const useTotalXp = (): number =>
  useGame((s) => xpFromRecords(s.records) + xpFromUnlocked(s.unlocked))
export const useLevel = () => levelFromXp(useTotalXp())
