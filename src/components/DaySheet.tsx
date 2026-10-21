import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { DayRecord } from '../types'
import { useGame } from '../store'
import { EMPTY_RECORD, VERDICT_META, evaluate, isRecorded } from '../logic/scoring'
import { dateCn, isWeekend, today } from '../logic/dates'
import { monsterById, monsterOf } from '../logic/monsters'
import { bigCelebration, burstAt } from '../celebrate'
import { Monster } from './Monster'
import { DayEditor } from './DayEditor'
import { Icon } from './Icon'

/** 历史/补战弹层 */
export const DaySheet = ({ date, onClose }: { date: string; onClose: () => void }) => {
  const saved = useGame((s) => s.records[date])
  const setDay = useGame((s) => s.setDay)
  const clearDay = useGame((s) => s.clearDay)
  const [draft, setDraft] = useState<DayRecord>(saved ?? EMPTY_RECORD(date))
  const saveRef = useRef<HTMLButtonElement>(null)
  const isFuture = date > today()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const ev = useMemo(() => evaluate(draft), [draft])
  const meta = VERDICT_META[ev.verdict]
  const touched = isRecorded(draft)
  const wasRecorded = isRecorded(saved)
  const skin = monsterById(monsterOf(date))

  const doSave = () => {
    if (isFuture) return // 未来日期不可补战（store 层同样有守卫）
    const result = setDay(date, draft)
    if (result.verdict === 'win' || result.verdict === 'perfect') {
      bigCelebration()
      burstAt(saveRef.current)
    }
    onClose()
  }

  return (
    <motion.div
      className="sheet-mask"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${dateCn(date)}补战`}
    >
      <motion.div
        className="sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grab" />
        <div className="sheet-head">
          <h3>
            {dateCn(date)}
            {isWeekend(date) && <span style={{ color: '#c23a22', marginLeft: 6, fontSize: 15 }}>魔王档</span>}
          </h3>
          <span className={`vpill ${meta.cls}`}>{meta.title}</span>
          <button type="button" className="icon-btn" aria-label="关闭" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="sheet-monster-row">
          <Monster species={monsterOf(date)} mood={touched && ev.score >= 6 ? 'faint' : 'full'} size={92} />
          <div>
            <div className="sheet-monster-name">
              镇守者：{skin.name}
              {skin.boss && <b className="boss-tag">BOSS</b>}
            </div>
            <div className="sheet-monster-title">{skin.title}</div>
          </div>
        </div>

        <DayEditor value={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} />

        <div className="card live-verdict">
          <div className="row">
            <span className="vpill v-pending">当日战况</span>
            <span className={`score-num ${ev.score > 0 ? 'pos' : ev.score < 0 ? 'neg' : 'zero'}`}>
              {ev.score > 0 ? `+${ev.score}` : ev.score}
            </span>
          </div>
          {ev.parts.length > 0 && (
            <div className="parts">
              {ev.parts.map((p, i) => (
                <div className="p" key={i}>
                  <span>{p.label}</span>
                  <b className={p.pts > 0 ? 'plus' : p.pts < 0 ? 'minus' : 'zero'}>
                    {p.pts > 0 ? `+${p.pts}` : p.pts}
                  </b>
                </div>
              ))}
            </div>
          )}
        </div>

        {isFuture ? (
          <p className="empty-tip" style={{ textAlign: 'center' }}>
            未来的关卡还没开张，勇者明天再来～
          </p>
        ) : (
          <motion.button
            ref={saveRef}
            type="button"
            className="cta"
            whileTap={{ scale: 0.97 }}
            disabled={!touched}
            onClick={doSave}
          >
            <Icon name="sword" size={20} />
            {wasRecorded ? '重新结算' : '补战这一关'}
          </motion.button>
        )}

        {wasRecorded && !isFuture && (
          <div style={{ textAlign: 'center' }}>
            <button
              className="ghost-link"
              onClick={() => {
                if (window.confirm(`撤退 ${dateCn(date)} 的战斗记录吗？`)) {
                  clearDay(date)
                  onClose()
                }
              }}
            >
              <Icon name="trash" size={14} /> 删除这条记录
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
