import { motion } from 'framer-motion'

/** Q版小骑士勇者：攻击时挥剑，平时待机呼吸 */
export const Hero = ({ attacking, size = 96 }: { attacking: boolean; size?: number }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    aria-hidden="true"
    animate={
      attacking
        ? { x: [0, 26, 12], rotate: [0, 24, 10] }
        : { y: [0, -3, 0] }
    }
    transition={
      attacking
        ? { duration: 0.45, ease: 'easeOut' }
        : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
    }
  >
    {/* 剑（举在右上） */}
    <motion.g
      animate={attacking ? { rotate: [0, -80, 0] } : { rotate: 0 }}
      transition={attacking ? { duration: 0.45, ease: 'easeOut' } : { duration: 2.4, repeat: Infinity }}
      style={{ transformOrigin: '58px 40px' }}
    >
      <path d="M64 38 L84 10 l6 4 L74 44 z" fill="#E8ECFF" stroke="#5B6B9E" strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="60" y="40" width="14" height="6" rx="3" fill="#FFB800" stroke="#B8860F" strokeWidth="2.2" />
    </motion.g>
    {/* 身体圆盔甲 */}
    <circle cx="44" cy="62" r="26" fill="#DCE4FF" stroke="#5B6B9E" strokeWidth="3.2" />
    {/* 头盔 */}
    <circle cx="44" cy="40" r="20" fill="#F2F5FF" stroke="#5B6B9E" strokeWidth="3.2" />
    <rect x="30" y="36" width="28" height="11" rx="5.5" fill="#4A3049" opacity=".85" />
    <circle cx="39" cy="41.5" r="2.6" fill="#7FE6FF" />
    <circle cx="51" cy="41.5" r="2.6" fill="#7FE6FF" />
    {/* 头盔羽饰 */}
    <path d="M44 20 q3 -12 14 -12 q-4 8 -8 14" fill="#FF6B4A" stroke="#C23A22" strokeWidth="2.2" strokeLinejoin="round" />
    {/* 小圆脚 */}
    <ellipse cx="36" cy="89" rx="8" ry="5" fill="#5B6B9E" />
    <ellipse cx="54" cy="89" rx="8" ry="5" fill="#5B6B9E" />
    {/* 盾牌 */}
    <path d="M14 58 l12 4 v8 c0 7 -5 12 -12 15 c-7 -3 -12 -8 -12 -15 v-8 z" transform="translate(4 -4)" fill="#FFD86B" stroke="#B8860F" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M18 62 v10" stroke="#B8860F" strokeWidth="2.4" strokeLinecap="round" transform="translate(4 -4)" />
  </motion.svg>
)
