import { motion } from 'framer-motion'
import { useStats } from '../store'
import { MONSTERS } from '../logic/monsters'
import { Icon } from './Icon'
import { Monster } from './Monster'

/** 图鉴：击败过的怪物点亮，未击败的是剪影 */
export const CodexView = () => {
  const stats = useStats()
  const unlockedCount = Object.keys(stats.killsByMonster).length
  const totalKills = Object.values(stats.killsByMonster).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(150deg,#fff,#F3EFFF)', borderColor: '#DCCFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="book" size={40} style={{ color: 'var(--quest-deep)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1.25 }}>
              图鉴收录 <span style={{ color: 'var(--quest-deep)', fontFamily: 'var(--font-num)', fontSize: 27 }}>{unlockedCount}</span>/{MONSTERS.length} 只
              · 累计击败 {totalKills} 次
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 2 }}>
              每天镇守的怪物不同 · 周末有魔王档
            </div>
          </div>
        </div>
      </div>

      <div className="codex-grid">
        {MONSTERS.map((m, i) => {
          const kills = stats.killsByMonster[m.id] ?? 0
          const got = kills > 0
          return (
            <motion.div
              key={m.id}
              className={`codex-card${got ? ' got' : ''}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <span className="codex-avatar">
                <Monster species={m.id} mood={got ? 'full' : 'silhouette'} size={92} />
                {!got && <span className="codex-unk">???</span>}
              </span>
              <span className="codex-name">{got ? m.name : '？？？'}</span>
              <span className="codex-title">{got ? m.title : '还没击败过它'}</span>
              {got && (
                <span className="codex-kills">
                  <Icon name="sword" size={13} /> ×{kills}
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      <p className="empty-tip">击败 = 当日 ≥2 分 · 暴击击败 = 当日 ≥6 分，怪物会记仇也会记恩</p>
    </div>
  )
}
