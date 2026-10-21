import { useMemo, useRef, useState } from 'react'
import { useGame, useStats } from '../store'
import { monthDays, recentDays } from '../logic/stats'
import { today } from '../logic/dates'
import { Icon } from './Icon'

const WIN_LINE_PCT = ((2 + 8) / 16) * 100 // 击退线（≥2 分）在柱状图的高度位置

export const GuildView = () => {
  const stats = useStats()
  const records = useGame((s) => s.records)
  const unlocked = useGame((s) => s.unlocked)
  const celebrated = useGame((s) => s.celebrated)
  const importData = useGame((s) => s.importData)
  const resetAll = useGame((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const bars = useMemo(() => recentDays(records, 14), [records])
  const now = new Date()
  const strip = useMemo(
    () => monthDays(now.getFullYear(), now.getMonth(), records),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records],
  )

  const doExport = () => {
    // 带上成就数据：导入恢复后解锁日期与进度不丢
    const blob = new Blob(
      [JSON.stringify({ app: 'slim-hero', version: 1, records, unlocked, celebrated }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slim-hero-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('已导出战报')
    setTimeout(() => setMsg(''), 2500)
  }

  const doImport = (file: File) => {
    if (!window.confirm('导入将覆盖当前全部战报与战功，确定继续吗？')) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importData(JSON.parse(String(reader.result)))
        setMsg('导入成功！战功和连击已重算')
      } catch (e) {
        setMsg(e instanceof Error ? `导入失败：${e.message}` : '导入失败：文件格式不对')
      }
      setTimeout(() => setMsg(''), 3000)
    }
    reader.readAsText(file)
  }

  if (stats.totalDays === 0) {
    return (
      <div>
        <div className="card guide-card">
          <div className="g-title">公会还没有战报</div>
          <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: 13.5 }}>
            先去「战斗」打第一场，这里就会出现你的讨伐曲线、击退率和最长连击纪录。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="big-nums">
        <div className="big-num hero">
          <Icon name="crown" size={44} style={{ color: '#e8a50f' }} />
          <div>
            <div className="n">{stats.dayNumber}</div>
            <div className="l">
              入会第 <b>{stats.dayNumber}</b> 天 · 自 {stats.firstDate} 开始
            </div>
          </div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: 'var(--mint-deep)' }}>{stats.winDays}</div>
          <div className="l">击退</div>
        </div>
        <div className="big-num">
          <div className="n">{Math.round(stats.rate * 100)}<span style={{ fontSize: 15 }}>%</span></div>
          <div className="l">击退率</div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: '#f04e2a' }}>{stats.curStreak}</div>
          <div className="l">当前连击</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.maxStreak}</div>
          <div className="l">最长连击</div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: 'var(--gold-deep)' }}>{stats.perfectDays}</div>
          <div className="l">暴击击败</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.exerciseCount}</div>
          <div className="l">修行次数</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.weekendPairs}</div>
          <div className="l">魔王讨伐</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.earlyDinners}</div>
          <div className="l">早膳天</div>
        </div>
      </div>

      <div className="sec-head">
        <h2>近 14 战伤害</h2>
        <span className="note">虚线是击退线</span>
      </div>
      <div className="card">
        <div className="bars">
          {bars.map((b) => {
            const h = Math.max(3, ((Math.max(-8, Math.min(8, b.score)) + 8) / 16) * 100)
            const cls = b.score > 0 ? 'pos' : b.score < 0 ? 'neg' : 'zero'
            return (
              <div key={b.date} className={`bar-col${b.date === today() ? ' today-bar' : ''}`}>
                <span className="win-line" style={{ bottom: `${WIN_LINE_PCT}%` }} />
                <div className={`bar ${cls}`} style={{ height: `${h}%` }} title={`${b.date} ${b.score} 分`} />
              </div>
            )
          })}
        </div>
        <div className="bar-labels">
          {bars.filter((_, i) => i % 2 === 0).map((b) => (
            <span key={b.date}>{Number(b.date.slice(8))}</span>
          ))}
        </div>
      </div>

      <div className="sec-head">
        <h2>本月战况</h2>
        <span className="note">每格一战</span>
      </div>
      <div className="card">
        <div className="month-strip">
          {strip.map((d) => (
            <span
              key={d.date}
              className={`ms-cell ${d.verdict === 'pending' ? '' : d.verdict === 'perfect' ? 'perfect' : d.win ? 'win' : d.verdict === 'fail' ? 'fail' : ''}${d.date === today() ? ' today' : ''}`}
              title={`${d.date} ${d.verdict === 'pending' ? '未开战' : d.score + ' 分'}`}
            />
          ))}
        </div>
        <div className="legend" style={{ marginTop: 10 }}>
          <span className="li"><span className="ms-cell perfect" style={{ width: 12, height: 12 }} /> 暴击</span>
          <span className="li"><span className="ms-cell win" style={{ width: 12, height: 12 }} /> 击退</span>
          <span className="li"><span className="ms-cell fail" style={{ width: 12, height: 12 }} /> 回血</span>
          <span className="li"><span className="ms-cell" style={{ width: 12, height: 12 }} /> 未开战</span>
        </div>
      </div>

      <div className="sec-head">
        <h2>我的数据</h2>
        <span className="note">都存在这台设备上</span>
      </div>
      <div className="card">
        <div className="data-btns">
          <button type="button" className="cta mint" style={{ background: 'var(--card)', color: 'var(--ink)', border: '2px solid var(--line-strong)', boxShadow: '0 4px 0 rgba(94,60,115,.08)' }} onClick={doExport}>
            <Icon name="download" size={18} /> 导出战报
          </button>
          <button type="button" className="cta mint" style={{ background: 'var(--card)', color: 'var(--ink)', border: '2px solid var(--line-strong)', boxShadow: '0 4px 0 rgba(94,60,115,.08)' }} onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} /> 导入恢复
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) doImport(f)
            e.target.value = ''
          }}
        />
        {msg && <p className="empty-tip" style={{ color: 'var(--mint-deep)' }}>{msg}</p>}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            className="ghost-link"
            onClick={() => {
              if (window.confirm('清空全部战报和战功？此操作不可恢复（建议先导出战报）') && window.confirm('真的全部清空吗？')) {
                resetAll()
              }
            }}
          >
            <Icon name="trash" size={14} /> 清空所有数据
          </button>
        </div>
      </div>
    </div>
  )
}
