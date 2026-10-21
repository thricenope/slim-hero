import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../store'
import { achById } from '../logic/quests'
import { burst } from '../celebrate'
import { Icon } from './Icon'

/** 新战功弹窗队列 */
export const CelebrationLayer = () => {
  const queue = useGame((s) => s.pendingCelebrate)
  const dismiss = useGame((s) => s.dismissOneCelebrate)
  const id = queue.length > 0 ? queue[0] : null
  const ach = id ? achById(id) : null

  return (
    <AnimatePresence>
      {id && ach && (
        <motion.div
          className="cele-mask"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={id}
          role="dialog"
          aria-modal="true"
          aria-label={`解锁战功：${ach.name}`}
        >
          <motion.div
            className="cele-card"
            initial={{ scale: 0.4, y: 80 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="rays" />
            <div className="cele-kind">战 功 解 锁</div>
            <motion.div
              className="cele-emoji"
              initial={{ rotate: -20, scale: 0.4 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 11, delay: 0.12 }}
            >
              <Icon name="trophy" size={72} style={{ color: '#e8a50f' }} />
            </motion.div>
            <div className="cele-title">{ach.name}</div>
            <div className="cele-desc">{ach.desc}</div>
            <div className="cele-xp">+{ach.tier * 25} 经验</div>
            <div>
              <motion.button
                type="button"
                className="cta mint"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  burst({ x: 0.5, y: 0.6 })
                  dismiss()
                }}
              >
                收下战功！
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
