/** 肥肥怪名册：每天按日期哈希随机镇守一只，Q版中二人设 */
export type MonsterId = 'slime' | 'donut' | 'tea' | 'fries' | 'burger' | 'cake'

export interface MonsterSkin {
  id: MonsterId
  name: string
  title: string
  taunt: string // 满血时的叫嚣
  lose: string // 被击败后的服软
  win: string // 打输时它的嘲讽
  boss: boolean
}

export const MONSTERS: MonsterSkin[] = [
  {
    id: 'slime', name: '果冻团子', title: '路边小怪，蹦一下算一次攻击',
    taunt: '弹弹弹！你的晚饭伤不了我分毫！',
    lose: '呜哇——团子要散架啦！撤！',
    win: '嘿嘿，回血啦～你昨天那碗可真香。',
    boss: false,
  },
  {
    id: 'donut', name: '甜甜圈史莱姆', title: '糖分化形，靠奶茶续命',
    taunt: '中间的洞是干什么的？装你的借口用的！',
    lose: '甜甜圈……碎了……糖分流失中……',
    win: '糖分护体！谢谢你的全糖大杯！',
    boss: false,
  },
  {
    id: 'tea', name: '奶茶章鱼', title: '八条触手八杯珍珠',
    taunt: '珍珠封喉！今天你也躲不过奶茶的诱惑～',
    lose: '咕噜咕噜……珍珠都洒了啦！',
    win: '呼噜～大杯全糖真好喝，明天见！',
    boss: false,
  },
  {
    id: 'fries', name: '薯条蝙蝠', title: '昼伏夜出，专炸深夜食堂',
    taunt: '半夜的炸鸡香不香？香就对了！',
    lose: '薯条断了！本蝙蝠暂时退场！',
    win: '吱吱——宵夜大礼包签收成功！',
    boss: false,
  },
  {
    id: 'burger', name: '汉堡牛魔', title: '三层肉饼护体，冲击力惊人',
    taunt: '就你这碗清汤菜，也想撼动我的千层？',
    lose: '汉堡塌了！牛肉饼夹不住啦！',
    win: '哞——热量护盾满血！多谢款待！',
    boss: false,
  },
  {
    id: 'cake', name: '蛋糕魔王', title: '地下城之主，奶油即王座',
    taunt: '本魔王的奶油王座，可是你亲手喂高的！',
    lose: '不——我的奶油王座——塌了——！',
    win: '魔王笑而不语，并点了一份夜宵。',
    boss: true,
  },
]

export const monsterById = (id: MonsterId): MonsterSkin =>
  MONSTERS.find((m) => m.id === id) ?? MONSTERS[0]

export const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

/** 某天镇守的怪物：按日期稳定哈希，Boss 周末才出场 */
export const monsterOf = (date: string): MonsterId => {
  const w = new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))).getDay()
  const pool = w === 0 || w === 6 ? ['cake', 'burger', 'tea', 'donut'] : ['slime', 'donut', 'tea', 'fries', 'burger']
  return pool[Math.abs(hash(date)) % pool.length] as MonsterId
}
