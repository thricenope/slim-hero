import type { Stats } from '../types'

export type AchKind = 'streak' | 'total' | 'special'

/** 每级战功奖励经验（发放与弹窗展示共用） */
export const XP_PER_TIER = 25

export interface Achievement {
  id: string
  name: string
  desc: string
  kind: AchKind
  tier: number // 奖励经验 = tier * XP_PER_TIER
  goal: number
  value: (s: Stats) => number
  /** 连击之路上的关卡站点 */
  onRoad?: boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  // —— 连击之路（关卡阶梯）
  { id: 's1', name: '新手村首胜', desc: '击退第 1 只肥肥怪，冒险开始了', kind: 'streak', tier: 1, goal: 1, value: (s) => s.maxStreak, onRoad: true },
  { id: 's2', name: '双杀连段', desc: '连续 2 关击退，手感来了', kind: 'streak', tier: 1, goal: 2, value: (s) => s.maxStreak, onRoad: true },
  { id: 's3', name: '三连斩', desc: '连续 3 关，勇者的基本操作', kind: 'streak', tier: 1, goal: 3, value: (s) => s.maxStreak, onRoad: true },
  { id: 's4', name: '四段连击', desc: '连续 4 关，出剑快如风', kind: 'streak', tier: 1, goal: 4, value: (s) => s.maxStreak, onRoad: true },
  { id: 's5', name: '五连胜者', desc: '连续 5 关，工作日全推平', kind: 'streak', tier: 2, goal: 5, value: (s) => s.maxStreak, onRoad: true },
  { id: 'wk1', name: '周末讨伐', desc: '一个周六周日都击退，魔王亲自镇守也照样打', kind: 'special', tier: 2, goal: 1, value: (s) => s.weekendPairs },
  { id: 's7', name: '一周远征', desc: '整整 7 连关，公会都在传你的战绩', kind: 'streak', tier: 2, goal: 7, value: (s) => s.maxStreak, onRoad: true },
  { id: 's14', name: '双周战役', desc: '连续 14 关，半个地方的怪都被你清了', kind: 'streak', tier: 3, goal: 14, value: (s) => s.maxStreak, onRoad: true },
  { id: 's21', name: '习惯成剑术', desc: '21 连关，肌肉记忆已经养成', kind: 'streak', tier: 3, goal: 21, value: (s) => s.maxStreak, onRoad: true },
  { id: 's30', name: '满月远征军', desc: '30 连关，地下城一半都是你的传说', kind: 'streak', tier: 4, goal: 30, value: (s) => s.maxStreak, onRoad: true },
  { id: 's100', name: '百日讨魔', desc: '100 连关，史诗勇者认证', kind: 'streak', tier: 5, goal: 100, value: (s) => s.maxStreak, onRoad: true },
  { id: 's365', name: '周年圣战', desc: '365 连关，编年史为你单开一章', kind: 'streak', tier: 6, goal: 365, value: (s) => s.maxStreak, onRoad: true },
  { id: 's730', name: '双年神话', desc: '730 连关，怪物看到你直接绕路', kind: 'streak', tier: 7, goal: 730, value: (s) => s.maxStreak, onRoad: true },

  // —— 累计击退
  { id: 't10', name: '十连讨伐', desc: '累计击退 10 战', kind: 'total', tier: 1, goal: 10, value: (s) => s.winDays },
  { id: 't30', name: '讨伐三十', desc: '累计击退 30 战', kind: 'total', tier: 2, goal: 30, value: (s) => s.winDays },
  { id: 't100', name: '百战勇士', desc: '累计击退 100 战', kind: 'total', tier: 4, goal: 100, value: (s) => s.winDays },
  { id: 't365', name: '年鉴勇者', desc: '累计击退 365 战', kind: 'total', tier: 6, goal: 365, value: (s) => s.winDays },

  // —— 特色成就
  { id: 'p3', name: '暴击入门', desc: '打出 3 次暴击击败（≥6 分）', kind: 'special', tier: 2, goal: 3, value: (s) => s.perfectDays },
  { id: 'p10', name: '暴击艺术家', desc: '打出 10 次暴击击败', kind: 'special', tier: 3, goal: 10, value: (s) => s.perfectDays },
  { id: 'e10', name: '修行之路', desc: '累计运动打卡 10 次', kind: 'special', tier: 1, goal: 10, value: (s) => s.exerciseCount },
  { id: 'e50', name: '铁体双修', desc: '累计运动打卡 50 次', kind: 'special', tier: 3, goal: 50, value: (s) => s.exerciseCount },
  { id: 'early20', name: '早膳剑诀', desc: '20 次 17 点前解决晚饭', kind: 'special', tier: 2, goal: 20, value: (s) => s.earlyDinners },
  { id: 'm6', name: '图鉴收藏家', desc: '6 只肥肥怪全部击败过至少一次', kind: 'special', tier: 3, goal: 6, value: (s) => Object.keys(s.killsByMonster).length },
]

export const achById = (id: string): Achievement | undefined =>
  ACHIEVEMENTS.find((a) => a.id === id)

/** 连击之路：只放连续类站点 */
export const ROAD = ACHIEVEMENTS.filter((a) => a.onRoad)

/** 找到下一个未解锁的连击关卡（用于「还差 N 关」） */
export const nextRoad = (s: Stats, unlocked: Record<string, string>): Achievement | undefined =>
  ROAD.find((a) => !unlocked[a.id] && a.goal > s.maxStreak) ?? ROAD.find((a) => !unlocked[a.id])

/** 连击称号 */
export const comboTitle = (n: number): string => {
  if (n >= 30) return '月度传说'
  if (n >= 21) return '剑术大师'
  if (n >= 14) return '双周勇者'
  if (n >= 10) return '十连战神'
  if (n >= 7) return '一周远征'
  if (n >= 5) return '五连胜者'
  if (n >= 3) return '三连斩'
  if (n >= 2) return '双杀连段'
  if (n >= 1) return '首战告捷'
  return ''
}
