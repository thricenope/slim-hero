import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { TopBar } from './components/TopBar'
import { TabBar, type TabId } from './components/TabBar'
import { BattleView } from './components/BattleView'
import { DungeonView } from './components/DungeonView'
import { CodexView } from './components/CodexView'
import { QuestView } from './components/QuestView'
import { GuildView } from './components/GuildView'
import { CelebrationLayer } from './components/CelebrationLayer'
import { today } from './logic/dates'

/** 跨午夜自动换日：日期变化时重挂载当前视图，隔夜挂着的页面不会把今天写成昨天 */
const useTodayTick = (): string => {
  const [day, setDay] = useState(today)
  useEffect(() => {
    const id = window.setInterval(() => setDay((d) => (d === today() ? d : today())), 30000)
    return () => window.clearInterval(id)
  }, [])
  return day
}

export default function App() {
  const [tab, setTab] = useState<TabId>('battle')
  const day = useTodayTick()

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <TopBar />
        <main aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tab}-${day}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {tab === 'battle' && <BattleView onGoDungeon={() => setTab('dungeon')} />}
              {tab === 'dungeon' && <DungeonView />}
              {tab === 'codex' && <CodexView />}
              {tab === 'quest' && <QuestView />}
              {tab === 'guild' && <GuildView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <TabBar tab={tab} onTab={setTab} />
        <CelebrationLayer />
      </div>
    </MotionConfig>
  )
}
