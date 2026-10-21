/** 等级曲线：升到 L+1 需要 40 + 15·L 经验（累计递增） */
export const xpForLevel = (level: number): number => 40 + 15 * (level - 1)

export interface LevelInfo {
  level: number
  into: number // 当前级已得
  need: number // 升到下一级还差
  progress: number // 0~1
  title: string
}

const TITLES = [
  '见习勇者', '轻食剑士', '控卡游侠', '燃脂骑士', '瘦身剑豪',
  '轻卡领主', '塑形圣手', '卡路里屠龙者', '燃脂大元帅', '传说瘦勇者',
]

export const titleFor = (level: number): string => {
  const idx = Math.min(Math.floor((level - 1) / 3), TITLES.length - 1)
  return TITLES[idx]
}

export const levelFromXp = (xp: number): LevelInfo => {
  let level = 1
  let rest = Math.max(0, xp)
  while (rest >= xpForLevel(level)) {
    rest -= xpForLevel(level)
    level += 1
  }
  const need = xpForLevel(level)
  return {
    level,
    into: rest,
    need,
    progress: rest / need,
    title: titleFor(level),
  }
}
