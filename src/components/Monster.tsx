import { motion } from 'framer-motion'
import type { MonsterId } from '../logic/monsters'

export type MonsterMood = 'full' | 'hurt' | 'faint' | 'silhouette'

interface Palette {
  body: string
  bodyDark: string
  outline: string
  belly: string
  detail: string
}

const INK = '#4A3049'

const P: Record<MonsterId, Palette> = {
  slime: { body: '#FFB3CC', bodyDark: '#F58FB1', outline: '#B23563', belly: '#FFE0EA', detail: '#FF7FA5' },
  donut: { body: '#FFC98A', bodyDark: '#F2A45C', outline: '#B8703A', belly: '#FFE9D1', detail: '#FF8FA3' },
  tea: { body: '#C9B39A', bodyDark: '#AD9276', outline: '#7A5F42', belly: '#EFE0CB', detail: '#8A6B4A' },
  fries: { body: '#FFD86B', bodyDark: '#F2BC42', outline: '#B8860F', belly: '#FFF0C2', detail: '#E8938A' },
  burger: { body: '#F2B279', bodyDark: '#DD9455', outline: '#9A5F2E', belly: '#FFE8C9', detail: '#7FBF6B' },
  cake: { body: '#D9B3E8', bodyDark: '#BE8FD4', outline: '#7E4A9E', belly: '#F5E6FF', detail: '#FF7FA5' },
}

/** Q版肥肥怪：物种 × 血量状态（满血嚣张/半血贴创可贴/被击败翻白眼） */
export const Monster = ({
  species,
  mood,
  size = 140,
}: {
  species: MonsterId
  mood: MonsterMood
  size?: number
}) => {
  const c = P[species] ?? P.slime

  const eyes = () => {
    if (mood === 'faint') {
      return (
        <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d="M40 34 q6 6 12 0" />
          <path d="M68 34 q6 6 12 0" />
        </g>
      )
    }
    if (mood === 'hurt') {
      return (
        <g fill={INK}>
          <ellipse cx="46" cy="34" rx="3" ry="4.6" />
          <ellipse cx="74" cy="34" rx="3" ry="4.6" />
          <ellipse cx="47" cy="32.4" rx="1.2" ry="1.6" fill="#fff" />
          <ellipse cx="75" cy="32.4" rx="1.2" ry="1.6" fill="#fff" />
        </g>
      )
    }
    return (
      <g fill={INK}>
        <circle cx="46" cy="33" r="4.4" />
        <circle cx="74" cy="33" r="4.4" />
        <circle cx="47.6" cy="31.4" r="1.6" fill="#fff" />
        <circle cx="75.6" cy="31.4" r="1.6" fill="#fff" />
      </g>
    )
  }

  const mouth = () => {
    if (mood === 'faint') {
      return (
        <g>
          <ellipse cx="60" cy="48" rx="6" ry="7.5" fill={INK} />
          <path d="M57 48 h6" stroke="#FF9EB5" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      )
    }
    if (mood === 'hurt') {
      return <path d="M52 50 q8 -7 16 0" stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />
    }
    if (species === 'slime') {
      return <path d="M50 46 q10 12 20 0 q-10 6 -20 0 z" fill={INK} />
    }
    if (species === 'donut') {
      return <path d="M50 47 q10 9 20 0" stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none" />
    }
    if (species === 'tea') {
      return (
        <g>
          <path d="M50 46 q10 10 20 0 q-10 6 -20 0 z" fill={INK} />
          <circle cx="54" cy="49" r="1.6" fill="#fff" />
          <circle cx="63" cy="50" r="1.6" fill="#fff" />
        </g>
      )
    }
    if (species === 'fries') {
      return <path d="M52 44 l4 5 4 -5 4 5 4 -5" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    }
    if (species === 'burger') {
      return (
        <g fill={INK}>
          <rect x="50" y="44" width="20" height="6" rx="3" />
          <path d="M54 44 v-3 M60 44 v-3 M66 44 v-3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      )
    }
    // cake 魔王
    return (
      <g>
        <path d="M48 45 q12 14 24 0 q-12 7 -24 0 z" fill={INK} />
        <path d="M52 47 l2 2 M58 49 l2 2 M64 47 l2 2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    )
  }

  const speciesBody = () => {
    switch (species) {
      case 'donut':
        return (
          <g>
            <circle cx="60" cy="44" r="38" fill={c.body} stroke={c.outline} strokeWidth="3.4" />
            <circle cx="60" cy="44" r="38" fill={c.bodyDark} opacity=".18" clipPath="inset(0 0 0 0)" />
            <circle cx="60" cy="44" r="14" fill="#FFF7E8" stroke={c.outline} strokeWidth="3" />
            <g fill={c.detail}>
              <ellipse cx="34" cy="26" rx="6" ry="4" transform="rotate(-24 34 26)" />
              <ellipse cx="84" cy="24" rx="6" ry="4" transform="rotate(18 84 24)" />
              <ellipse cx="92" cy="52" rx="6" ry="4" transform="rotate(64 92 52)" />
              <ellipse cx="30" cy="58" rx="6" ry="4" transform="rotate(-58 30 58)" />
            </g>
          </g>
        )
      case 'tea':
        return (
          <g>
            {/* 奶茶杯身 */}
            <path d="M34 26 L86 26 L80 76 a10 10 0 0 1 -10 8 L50 84 a10 10 0 0 1 -10 -8 z" fill={c.body} stroke={c.outline} strokeWidth="3.4" strokeLinejoin="round" />
            {/* 盖子 */}
            <rect x="30" y="18" width="60" height="10" rx="5" fill={c.detail} stroke={c.outline} strokeWidth="3" />
            <circle cx="60" cy="13" r="5" fill={c.detail} stroke={c.outline} strokeWidth="2.4" />
            {/* 珍珠 */}
            <g fill={c.outline}>
              <circle cx="46" cy="72" r="4" />
              <circle cx="60" cy="76" r="4" />
              <circle cx="73" cy="70" r="4" />
            </g>
            {/* 触手 */}
            <path d="M40 60 q-14 4 -12 16 q10 2 14 -8" fill={c.bodyDark} stroke={c.outline} strokeWidth="2.6" />
            <path d="M80 60 q14 4 12 16 q-10 2 -14 -8" fill={c.bodyDark} stroke={c.outline} strokeWidth="2.6" />
          </g>
        )
      case 'fries':
        return (
          <g>
            {/* 薯条翅膀 */}
            <path d="M24 40 Q6 26 10 12 Q26 16 30 34 z" fill={c.body} stroke={c.outline} strokeWidth="3" strokeLinejoin="round" />
            <path d="M96 40 Q114 26 110 12 Q94 16 90 34 z" fill={c.body} stroke={c.outline} strokeWidth="3" strokeLinejoin="round" />
            {/* 红盒身体 */}
            <path d="M32 40 L88 40 L82 76 a8 8 0 0 1 -8 7 L46 83 a8 8 0 0 1 -8 -7 z" fill="#E8563F" stroke="#A93420" strokeWidth="3.4" strokeLinejoin="round" />
            {/* 探出的薯条头 */}
            <rect x="48" y="18" width="9" height="26" rx="4.5" fill={c.body} stroke={c.outline} strokeWidth="2.6" transform="rotate(-8 52 30)" />
            <rect x="60" y="14" width="9" height="30" rx="4.5" fill={c.body} stroke={c.outline} strokeWidth="2.6" />
            <rect x="72" y="18" width="9" height="26" rx="4.5" fill={c.body} stroke={c.outline} strokeWidth="2.6" transform="rotate(8 76 30)" />
          </g>
        )
      case 'burger':
        return (
          <g>
            {/* 顶面包 */}
            <path d="M26 44 C26 20 94 20 94 44 L94 50 L26 50 z" fill={c.body} stroke={c.outline} strokeWidth="3.4" strokeLinejoin="round" />
            {/* 芝麻 */}
            <g fill="#FFF3D6">
              <ellipse cx="46" cy="32" rx="2.6" ry="1.6" transform="rotate(-18 46 32)" />
              <ellipse cx="62" cy="28" rx="2.6" ry="1.6" />
              <ellipse cx="78" cy="33" rx="2.6" ry="1.6" transform="rotate(16 78 33)" />
            </g>
            {/* 生菜 */}
            <path d="M24 52 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 12 0 q6 8 10 -2 L94 56 L26 56 z" fill="#7FBF6B" stroke="#4E8F3C" strokeWidth="2.4" strokeLinejoin="round" />
            {/* 肉饼 */}
            <rect x="28" y="56" width="64" height="12" rx="6" fill="#8A5230" stroke="#5E3520" strokeWidth="2.6" />
            {/* 底面包 */}
            <path d="M28 70 L92 70 L92 74 a8 8 0 0 1 -8 8 L36 82 a8 8 0 0 1 -8 -8 z" fill={c.body} stroke={c.outline} strokeWidth="3.2" strokeLinejoin="round" />
          </g>
        )
      case 'cake':
        return (
          <g>
            {/* 魔王角 */}
            <path d="M28 22 L20 4 L38 14 z" fill="#8A5FA8" stroke={c.outline} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M92 22 L100 4 L82 14 z" fill="#8A5FA8" stroke={c.outline} strokeWidth="2.6" strokeLinejoin="round" />
            {/* 两层蛋糕 */}
            <path d="M30 34 L90 34 L90 50 L30 50 z" fill={c.body} stroke={c.outline} strokeWidth="3.2" />
            <path d="M22 54 L98 54 L98 74 a8 8 0 0 1 -8 8 L30 82 a8 8 0 0 1 -8 -8 z" fill={c.bodyDark} stroke={c.outline} strokeWidth="3.2" />
            {/* 奶油淋面 */}
            <path d="M22 54 q6 10 12 0 q6 10 12 0 q6 10 12 0 q6 10 12 0 q6 10 12 0 q6 10 14 0 L98 54 z" fill={c.belly} stroke={c.outline} strokeWidth="2.4" strokeLinejoin="round" />
            {/* 樱桃蜡烛 */}
            <circle cx="60" cy="28" r="5" fill="#E8467A" stroke={c.outline} strokeWidth="2.2" />
            <path d="M60 22 v-6" stroke={c.outline} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M60 12 q4 -3 6 1 q-3 3 -6 -1" fill="#FFB800" />
          </g>
        )
      default: // slime 团子
        return (
          <g>
            <path d="M60 8 C88 8 100 30 100 48 C100 68 84 80 60 80 C36 80 20 68 20 48 C20 30 32 8 60 8 z" fill={c.body} stroke={c.outline} strokeWidth="3.4" strokeLinejoin="round" />
            <path d="M40 20 q8 -8 18 -6" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity=".7" />
          </g>
        )
    }
  }

  const extras = () => {
    const bits: React.ReactNode[] = []
    if (mood === 'hurt') {
      bits.push(
        <g key="bandage">
          <rect x="82" y="24" width="18" height="9" rx="4.5" fill="#FFF3D6" stroke="#D8B86A" strokeWidth="2" transform="rotate(18 91 28)" />
          <path d="M87 28 h8 M91 24 v8" stroke="#D8B86A" strokeWidth="1.6" strokeLinecap="round" />
        </g>,
      )
    }
    if (mood === 'full' && species === 'slime') {
      bits.push(
        <g key="bounce" fill={c.detail} opacity=".85">
          <circle cx="30" cy="64" r="5" />
          <circle cx="92" cy="62" r="4" />
        </g>,
      )
    }
    if (mood === 'full' && species === 'cake') {
      bits.push(
        <g key="spark">
          <path d="M14 30 l2.4 5.6 5.6 2.4 -5.6 2.4 -2.4 5.6 -2.4 -5.6 -5.6 -2.4 5.6 -2.4 z" fill="#FFB800" opacity=".9" />
          <path d="M108 44 l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2 z" fill="#FFB800" opacity=".7" />
        </g>,
      )
    }
    if (mood === 'faint') {
      bits.push(
        <g key="soul" opacity=".9">
          <motion.text
            x="98" y="26" fontSize="20" fontWeight="800" fill="#8A77C9"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >★</motion.text>
        </g>,
      )
    }
    return bits
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 96"
      aria-hidden="true"
      style={mood === 'silhouette' ? { filter: 'grayscale(1) brightness(0.45) opacity(0.55)' } : undefined}
      animate={
        mood === 'faint'
          ? { rotate: [-6, 6, -6], y: [0, 2, 0] }
          : mood === 'full'
            ? { y: [0, -4, 0], scaleY: [1, 0.96, 1] }
            : { y: [0, -2, 0] }
      }
      transition={{ duration: mood === 'full' ? 2.2 : 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {speciesBody()}
      {eyes()}
      {mouth()}
      {extras()}
    </motion.svg>
  )
}
