import { useLevel, useStats } from '../store'
import { Icon } from './Icon'

/** 公会顶栏：logo + 连击剑 + 等级 + 经验条 */
export const TopBar = () => {
  const streak = useStats().curStreak
  const lv = useLevel()

  return (
    <div>
      <header className="topbar">
        <div className="logo">
          <Icon name="sword" size={30} style={{ color: '#f04e2a' }} />
          <span className="name">燃脂勇者</span>
        </div>
        <div className="spacer" />
        <span className="chip-stat flame" title="连续击退关数">
          <Icon name="sword" size={16} />
          <span className="num">{streak}</span>
        </span>
        <span className="chip-stat" title={`${lv.title} · 距下一级 ${lv.need - lv.into} 经验`}>
          <Icon name="crown" size={16} style={{ color: '#e8a50f' }} />
          <span className="num">LV{lv.level}</span>
        </span>
      </header>
      <div
        className="xp-line"
        role="progressbar"
        aria-label="等级经验"
        aria-valuemin={0}
        aria-valuemax={lv.need}
        aria-valuenow={lv.into}
      >
        <i style={{ width: `${lv.into > 0 ? Math.max(4, lv.progress * 100) : 0}%` }} />
      </div>
    </div>
  )
}
