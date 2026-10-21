import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame, useStats } from '../store'
import { ACHIEVEMENTS, ROAD, nextRoad, comboTitle } from '../logic/quests'
import { Icon, type IconName } from './Icon'

const ACH_ICON: Record<string, IconName> = {
  wk1: 'calendar', t10: 'sword', t30: 'sword', t100: 'sword', t365: 'sword',
  p3: 'trophy', p10: 'trophy', e10: 'hiit', e50: 'hiit', early20: 'sunset', m6: 'book',
}

const iconOf = (id: string): IconName => ACH_ICON[id] ?? 'sword'

const colorOf = (kind: string, tier: number) =>
  kind === 'special' ? 'mint' : tier >= 4 ? 'gold' : kind === 'total' ? 'mint' : ''

export const QuestView = () => {
  const unlocked = useGame((s) => s.unlocked)
  const stats = useStats()

  const next = nextRoad(stats, unlocked)
  const remain = next ? Math.max(0, next.goal - stats.maxStreak) : 0

  // 连击之路填充宽度（按节点分段）
  const fillPct = useMemo(() => {
    const goals = ROAD.map((r) => r.goal)
    const N = goals.length
    let idx = 0
    for (let i = 0; i < N; i++) {
      if (goals[i] <= stats.maxStreak) idx = i
    }
    const nextGoal = goals[Math.min(idx + 1, N - 1)]
    const prevGoal = goals[idx]
    const f = nextGoal > prevGoal ? (stats.maxStreak - prevGoal) / (nextGoal - prevGoal) : 0
    return Math.min(100, ((idx + Math.max(0, Math.min(1, f))) / (N - 1)) * 100)
  }, [stats.maxStreak])

  const unlockedCount = Object.keys(unlocked).length

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(150deg,#fff,#fff4ec)', borderColor: '#ffd9c4' }}>
        <div className="row" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="sword" size={44} style={{ color: '#f04e2a', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.2 }}>
              当前连击 <span style={{ color: 'var(--blade-deep)', fontFamily: 'var(--font-num)', fontSize: 30 }}>{stats.curStreak}</span> 关
              {stats.curStreak >= 2 && (
                <span style={{ fontSize: 14, color: 'var(--blade-deep)', marginLeft: 8 }}>「{comboTitle(stats.curStreak)}」</span>
              )}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 2 }}>
              历史最长 {stats.maxStreak} 关 · 已解锁 {unlockedCount}/{ACHIEVEMENTS.length} 枚战功
            </div>
          </div>
        </div>
      </div>

      {next && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span className={`emblem ${colorOf(next.kind, next.tier)}`}>
              <Icon name={iconOf(next.id)} size={26} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: 1.25 }}>
                「{next.name}」还差 <span style={{ color: 'var(--blade-deep)', fontFamily: 'var(--font-num)', fontSize: 24 }}>{remain}</span> 关
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{next.desc}</div>
            </div>
          </div>
          <div className="prog" style={{ height: 10 }}>
            <i style={{ width: `${Math.min(100, (stats.maxStreak / next.goal) * 100)}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span className="got-date">最长连击 {stats.maxStreak} 关</span>
            <span className="got-date">目标 {next.goal} 关</span>
          </div>
        </div>
      )}

      <div className="sec-head">
        <h2>连击之路</h2>
        <span className="note">从 1 关推到 2 年</span>
      </div>
      <div className="card">
        <div className="road-wrap">
          <div className="road">
            <span className="fill" style={{ width: `calc(${fillPct}% )` }} />
            {ROAD.map((r) => {
              const got = !!unlocked[r.id]
              const isNext = next?.id === r.id
              return (
                <div className={`road-node${got ? ' done' : ''}${isNext ? ' now' : ''}`} key={r.id}>
                  <span className="st">
                    <Icon name={got ? 'check' : iconOf(r.id)} size={24} />
                  </span>
                  <span className="lb">{got ? r.name : `${r.goal} 关`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="sec-head">
        <h2>战功墙</h2>
        <span className="note">{unlockedCount}/{ACHIEVEMENTS.length} 已解锁</span>
      </div>
      <div className="badges">
        {ACHIEVEMENTS.map((a, i) => {
          const got = !!unlocked[a.id]
          const cur = Math.min(a.value(stats), a.goal)
          return (
            <motion.div
              key={a.id}
              className={`badge ${colorOf(a.kind, a.tier)} ${got ? 'unlocked' : 'locked'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.25 }}
            >
              <span className="emblem">
                <Icon name={got ? iconOf(a.id) : 'lock'} size={24} />
              </span>
              <span className="name">{a.name}</span>
              <span className="desc">{a.desc}</span>
              {got ? (
                <span className="got-date">{unlocked[a.id]} 解锁</span>
              ) : (
                <>
                  <span className="prog">
                    <i style={{ width: `${(cur / a.goal) * 100}%` }} />
                  </span>
                  <span className="got-date">
                    {cur}/{a.goal}
                  </span>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
      <p className="empty-tip" style={{ marginTop: 10 }}>
        解锁战功立刻奖励经验：稀有度 × 25
      </p>
    </div>
  )
}
