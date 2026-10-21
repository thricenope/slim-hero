import confetti from 'canvas-confetti'

const PARTY = ['#FF6B4A', '#FFB800', '#2ED3A3', '#8A6BFF', '#FF5D8F']

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 单点小庆祝 */
export const burst = (origin = { x: 0.5, y: 0.45 }) => {
  if (reduced()) return
  confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 38,
    scalar: 0.95,
    ticks: 190,
    origin,
    colors: PARTY,
    disableForReducedMotion: true,
  })
}

/** 大庆祝：中央爆 + 两侧礼炮 */
export const bigCelebration = () => {
  if (reduced()) return
  confetti({
    particleCount: 130,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.4 },
    colors: PARTY,
    disableForReducedMotion: true,
  })
  const end = Date.now() + 650
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      startVelocity: 52,
      origin: { x: 0, y: 0.75 },
      colors: PARTY,
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      startVelocity: 52,
      origin: { x: 1, y: 0.75 },
      colors: PARTY,
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

/** 在某个元素位置炸开一簇 */
export const burstAt = (el: HTMLElement | null) => {
  if (!el || reduced()) return
  const rect = el.getBoundingClientRect()
  burst({
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  })
}
