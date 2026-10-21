import { motion } from 'framer-motion'
import { Icon, type IconName } from './Icon'

export type TabId = 'battle' | 'dungeon' | 'codex' | 'quest' | 'guild'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'battle', label: '战斗', icon: 'sword' },
  { id: 'dungeon', label: '地下城', icon: 'flag' },
  { id: 'codex', label: '图鉴', icon: 'book' },
  { id: 'quest', label: '战功', icon: 'trophy' },
  { id: 'guild', label: '公会', icon: 'chart' },
]

export const TabBar = ({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) => (
  <nav className="tabbar" aria-label="主导航">
    {TABS.map((t) => (
      <motion.button
        key={t.id}
        type="button"
        className={`tab${tab === t.id ? ' on' : ''}`}
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        aria-current={tab === t.id ? 'page' : undefined}
        onClick={() => onTab(t.id)}
      >
        <Icon name={t.icon} size={20} />
        {t.label}
      </motion.button>
    ))}
  </nav>
)
