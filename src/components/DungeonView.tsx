import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../store'
import { monthDays, monthSummary } from '../logic/stats'
import { monsterById } from '../logic/monsters'
import { monthLabel, parseYmd, today } from '../logic/dates'
import { Monster } from './Monster'
import { Icon } from './Icon'
import { DaySheet } from './DaySheet'

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

/** 地下城：日历即关卡，每格镇守一只肥肥怪 */
export const DungeonView = () => {
  const records = useGame((s) => s.records)
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [sel, setSel] = useState<string | null>(null)

  const days = useMemo(() => monthDays(ym.y, ym.m, records), [ym, records])
  const summary = useMemo(() => monthSummary(days), [days])
  const t = today()

  const shift = (delta: number) => {
    setYm(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const canFuture = ym.y < now.getFullYear() || (ym.y === now.getFullYear() && ym.m > now.getMonth())

  return (
    <div>
      <div className="cal-head">
        <button type="button" className="cal-nav" aria-label="上个月" onClick={() => shift(-1)}>
          <Icon name="left" size={19} />
        </button>
        <div className="title">{monthLabel(ym.y, ym.m)}</div>
        {canFuture ? (
          <div style={{ width: 38 }} />
        ) : (
          <button type="button" className="cal-nav" aria-label="下个月" onClick={() => shift(1)}>
            <Icon name="right" size={19} />
          </button>
        )}
        <button type="button" className="cal-today-btn" onClick={() => setYm({ y: now.getFullYear(), m: now.getMonth() })}>
          回今天
        </button>
      </div>

      <div className="card">
        <div className="cal-week" aria-hidden="true">
          {WEEK.map((w, i) => (
            <span key={w} className={i === 0 || i === 6 ? 'wend' : ''}>
              {w}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${ym.y}-${ym.m}`}
            className="cal-grid"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {days.map((d) => {
              const dayNum = parseYmd(d.date).getDate()
              const isToday = d.date === t
              return (
                <button
                  type="button"
                  key={d.date}
                  className={[
                    'cal-cell',
                    d.inMonth ? '' : 'dim',
                    isToday ? 'today' : '',
                    sel === d.date ? 'sel' : '',
                  ].join(' ')}
                  aria-label={`${d.date} ${d.verdict === 'pending' ? '未开战' : d.verdict === 'fail' ? '被回血' : d.win ? '已击退' : '平局'}，镇守：${monsterById(d.monster).name}`}
                  onClick={() => setSel(d.date)}
                >
                  <span className="dnum" aria-hidden="true" style={d.verdict !== 'pending' ? { display: 'none' } : undefined}>
                    {dayNum}
                  </span>
                  {d.win ? (
                    <motion.span
                      className="mark"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 480, damping: 16 }}
                    >
                      <span className="win-flag" />
                    </motion.span>
                  ) : d.verdict === 'fail' ? (
                    <span className="mark dungeon-angry" title="被回血">
                      <Monster species={d.monster} mood="full" size={30} />
                    </span>
                  ) : d.verdict === 'plain' ? (
                    <span className="mark dungeon-dim">
                      <Monster species={d.monster} mood="hurt" size={30} />
                    </span>
                  ) : (
                    <span className="dungeon-idle">
                      <Monster species={d.monster} mood="full" size={30} />
                    </span>
                  )}
                </button>
              )
            })}
          </motion.div>
        </AnimatePresence>

        <div className="month-sum">
          本月开战 <b>{summary.recorded}</b> 场 · 击退 <b>{summary.wins}</b> 场
        </div>
      </div>

      <div className="legend">
        <span className="li"><span className="win-flag" style={{ width: 14, height: 16 }} /> 已击退</span>
        <span className="li"><span className="dungeon-dim" style={{ width: 14, height: 14, borderRadius: 4 }} /> 擦伤</span>
        <span className="li"><span className="dungeon-angry" style={{ width: 14, height: 14, borderRadius: 4 }} /> 被回血</span>
        <span className="li"><span className="dungeon-idle" style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--line)' }} /> 未开战</span>
      </div>

      <p className="empty-tip">每格镇守一只肥肥怪 · 周末出没更强对手 · 点任意日期补战</p>

      <AnimatePresence>
        {sel && <DaySheet date={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  )
}
