import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DayRecord, Verdict } from '../types'
import { useGame, useStats, useTodayRecord, dayXp } from '../store'
import { EMPTY_RECORD, VERDICT_META, damageOf, evaluate, isRecorded, isWin } from '../logic/scoring'
import { computeStats, missedRecent } from '../logic/stats'
import { today, dateCn } from '../logic/dates'
import { monsterById, monsterOf } from '../logic/monsters'
import { comboTitle } from '../logic/quests'
import { titleFor } from '../logic/level'
import { bigCelebration, burstAt } from '../celebrate'
import { Monster } from './Monster'
import { Hero } from './Hero'
import { DayEditor } from './DayEditor'
import { Icon } from './Icon'

const BATTLE_LINES: Record<Verdict, string[]> = {
  pending: ['本怪物今天状态绝佳，你随便录～', '录完战况就开打，本怪等着！', '就这？先点选项啦，勇者！'],
  perfect: ['哇啊——暴击！本怪当场退化成碎片！', '这一刀教科书级别！公会频道都炸了！', '太强了！怪物们连夜给地下城加门禁！'],
  win: ['漂亮！肥肥怪哭着撤退了～', '干净利落的一刀，经验到手！', '今天也是闪闪发光的讨伐日！'],
  plain: ['嗯……就掉了一层皮，它还在原地蹦跶。', '差一点点就击退了，明天补刀？', '平分秋色，怪物瑟瑟但没倒。'],
  fail: ['怪物回血了！还冲你做了个鬼脸……', '呜，今天这刀软了。明晚早点吃，一刀赢回来！', '怪物得瑟中：嘿嘿，谢谢款待～'],
}

export const BattleView = ({ onGoDungeon }: { onGoDungeon: () => void }) => {
  const saved = useTodayRecord()
  const setDay = useGame((s) => s.setDay)
  const clearDay = useGame((s) => s.clearDay)
  const stats = useStats()

  const t = today()
  const [draft, setDraft] = useState<DayRecord>(saved ?? EMPTY_RECORD(t))
  const [attacking, setAttacking] = useState(false)
  const [hit, setHit] = useState<{ id: number; text: string; crit: boolean } | null>(null)
  const [shake, setShake] = useState(0)
  const [combo, setCombo] = useState<{ n: number; title: string } | null>(null)
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDraft(saved ?? EMPTY_RECORD(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, saved?.date])

  const ev = useMemo(() => evaluate(draft), [draft])
  const meta = VERDICT_META[ev.verdict]
  const touched = isRecorded(draft)
  const recordedToday = !!saved
  const savedEv = evaluate(saved)

  const monsterId = monsterOf(t)
  const skin = monsterById(monsterId)
  // 已结算后展示以入库结果为准（改草稿只影响下方实时预览卡，不再同屏两套战果）
  const showEv = recordedToday ? savedEv : ev
  const showMeta = VERDICT_META[showEv.verdict]
  // 血条：未记录=满血嚣张；录了按分数预掉血；打输=怪物原样站岗
  const hpLeft = recordedToday
    ? isWin(saved)
      ? 0
      : Math.max(8, 100 - damageOf(savedEv.score))
    : touched && ev.score > 0
      ? Math.max(8, 100 - damageOf(ev.score))
      : 100
  const mood = !touched && !recordedToday ? 'full' : showEv.verdict === 'fail' || showEv.verdict === 'plain' ? 'full' : showEv.verdict === 'win' ? 'hurt' : 'faint'
  const line = recordedToday
    ? showEv.verdict === 'fail'
      ? skin.win
      : showEv.verdict === 'plain'
        ? '就擦破点皮！本怪还能蹦十年！'
        : showEv.verdict === 'pending'
          ? skin.taunt
          : skin.lose
    : touched && ev.score >= 2
      ? '等等——你怎么先预览了刀法？！'
      : skin.taunt

  const missed = useMemo(() => missedRecent(useGame.getState().records), [recordedToday, stats.totalDays])

  const doFight = () => {
    const oldXp = dayXp(saved)
    const result = setDay(t, draft)
    const gained = dayXp(draft) - oldXp

    setAttacking(true)
    setTimeout(() => setAttacking(false), 600)
    setShake((n) => n + 1)

    const dmg = damageOf(result.score)
    setHit({
      id: Date.now(),
      text: result.verdict === 'perfect' ? '会心一击！' : result.verdict === 'fail' ? '本怪回血了！' : `伤害 ${dmg}`,
      crit: result.verdict === 'perfect',
    })
    setTimeout(() => setHit(null), 1400)

    if (result.verdict === 'win' || result.verdict === 'perfect') {
      bigCelebration()
      burstAt(ctaRef.current)
      const streak = computeStats(useGame.getState().records).curStreak
      if (streak >= 2) {
        setCombo({ n: streak, title: comboTitle(streak) })
        setTimeout(() => setCombo(null), 1900)
      }
    } else if (gained > 0) {
      burstAt(ctaRef.current)
    }

    if (result.levelAfter > result.levelBefore) {
      setTimeout(() => setLevelUp(result.levelAfter), 700)
    }
  }

  return (
    <div>
      {stats.totalDays === 0 && (
        <div className="card guide-card">
          <div className="g-title">欢迎来到燃脂勇者！</div>
          <ol>
            <li>每天晚饭后回来，<b>点几下</b>记录战况</li>
            <li>按「出手！」——评分越高，对肥肥怪的<b>伤害</b>越高</li>
            <li>≥2 分击退，≥6 分暴击击败；连击推进<b>连击之路</b></li>
          </ol>
        </div>
      )}

      {missed && !recordedToday && (
        <div className="done-banner" style={{ background: '#fff8ec', borderColor: '#ffe2b8' }}>
          <Icon name="calendar" size={20} style={{ color: '#c26a12' }} />
          <span className="t" style={{ color: '#9a6410' }}>
            {dateCn(missed)}还没开战
          </span>
          <button className="cal-today-btn" onClick={onGoDungeon}>
            去补战
          </button>
        </div>
      )}

      <div className="card battle-card">
        <div className="battle-scene">
          <div className="battle-cloud" aria-hidden="true" />
          <div className="battle-hero">
            <Hero attacking={attacking} size={92} />
          </div>
          <motion.div
            key={shake}
            className="battle-monster"
            initial={shake > 0 ? { x: 0 } : false}
            animate={shake > 0 ? { x: [0, -8, 7, -5, 0] } : undefined}
            transition={{ duration: 0.4 }}
          >
            <Monster species={monsterId} mood={mood} size={158} />
          </motion.div>
          <AnimatePresence>
            {hit && (
              <motion.div
                key={hit.id}
                className={`dmg-float${hit.crit ? ' crit' : ''}`}
                initial={{ y: 10, opacity: 0, scale: 0.6 }}
                animate={{ y: -46, opacity: 1, scale: 1.15 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {hit.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hp-row">
          <span className="hp-name">
            {skin.name}
            {skin.boss && <b className="boss-tag">BOSS</b>}
          </span>
          <div className="hp-track" role="img" aria-label={`怪物血量 ${Math.round(hpLeft)}%`}>
            <motion.div className="hp-fill" animate={{ width: `${hpLeft}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
            {[25, 50, 75].map((p) => (
              <span key={p} className="hp-tick" style={{ left: `${p}%` }} />
            ))}
          </div>
          <span className="hp-num">{Math.round(hpLeft)}%</span>
        </div>

        <div className="bubble">
          <AnimatePresence mode="wait">
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <div className="hi">{line}</div>
              <div className="sub">
                {recordedToday ? `今日战果：${showMeta.title}` : touched ? '预览刀法中 · 按「出手！」结算' : '怪物叫嚣中 · 录完战况就出手'}
                {stats.curStreak > 0 && ` · 连击 ${stats.curStreak} 关`}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {recordedToday && (
        <div className="done-banner">
          <Icon name="check" size={20} style={{ color: '#0e8f6c' }} />
          <span className="t">今日已结算：{showMeta.title}</span>
          <span className="s">{savedEv.score} 分</span>
        </div>
      )}

      <DayEditor value={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} />

      <div className="card live-verdict">
        <div className="row">
          <span className={`vpill ${meta.cls}`}>{meta.title}</span>
          <span
            className={`score-num ${ev.score > 0 ? 'pos' : ev.score < 0 ? 'neg' : 'zero'}`}
            aria-label={`攻击力 ${ev.score}`}
          >
            {ev.score > 0 ? `+${ev.score}` : ev.score}
          </span>
        </div>
        {ev.parts.length > 0 ? (
          <div className="parts">
            {ev.parts.map((p, i) => (
              <div className="p" key={i}>
                <span>{p.label}</span>
                <b className={p.pts > 0 ? 'plus' : p.pts < 0 ? 'minus' : 'zero'}>
                  {p.pts > 0 ? `+${p.pts}` : p.pts}
                </b>
              </div>
            ))}
            <div className="p">
              <span style={{ color: 'var(--ink-3)' }}>≥ 2 分击退 · ≥ 6 分暴击击败</span>
            </div>
          </div>
        ) : (
          <div className="parts">
            <div className="p">
              <span style={{ color: 'var(--ink-3)' }}>≥ 2 分击退 · ≥ 6 分暴击击败</span>
            </div>
          </div>
        )}
      </div>

      <motion.button
        ref={ctaRef}
        type="button"
        className="cta"
        whileTap={{ scale: 0.97 }}
        disabled={!touched}
        onClick={doFight}
      >
        <Icon name="sword" size={22} />
        {recordedToday ? '重新结算' : '出手！'}
      </motion.button>

      {recordedToday && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="ghost-link"
            onClick={() => {
              if (window.confirm('撤退今日战斗记录吗？')) {
                clearDay(t)
                setDraft(EMPTY_RECORD(t))
              }
            }}
          >
            <Icon name="trash" size={14} /> 撤退今日记录
          </button>
        </div>
      )}

      <AnimatePresence>
        {combo && (
          <motion.div
            className="combo-banner"
            initial={{ scale: 0.3, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            ×{combo.n} 连击！
            <small>{combo.title}</small>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {levelUp !== null && (
          <motion.div
            className="cele-mask z-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLevelUp(null)}
          >
            <motion.div
              className="cele-card"
              initial={{ scale: 0.5, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rays" />
              <div className="cele-kind">等 级 提 升</div>
              <motion.div
                className="cele-emoji"
                initial={{ rotate: -20, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.15 }}
              >
                <Icon name="crown" size={72} style={{ color: '#e8a50f' }} />
              </motion.div>
              <div className="cele-title">LV {levelUp}</div>
              <div className="cele-desc">获得称号「{titleFor(levelUp)}」</div>
              <div className="cele-xp">继续战，继续升！</div>
              <button type="button" className="cta mint" onClick={() => setLevelUp(null)}>
                太棒了！
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { BATTLE_LINES }
