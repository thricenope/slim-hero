---
name: 燃脂勇者 SlimHero
description: Q版网游闯关打怪主题的减肥打卡设计系统
colors:
  bg: "#FFF7E8"
  ink: "#4A3049"
  ink-2: "#8A6F85"
  ink-3: "#B49BAE"
  card: "#FFFFFF"
  line: "#F0DCC2"
  line-strong: "#E4C89E"
  blade: "#FF6B4A"
  blade-deep: "#C23A22"
  blade-grad: "linear-gradient(180deg,#FF8A5C,#F04E2A)"
  gold: "#FFB800"
  gold-deep: "#9A6A00"
  hp: "#FF5D8F"
  victory: "#2ED3A3"
  mint-deep: "#0E8F6C"
  quest: "#8A6BFF"
  quest-deep: "#5B3FD1"
typography:
  display:
    fontFamily: "'ZCOOL QingKe HuangYou', 'PingFang SC', sans-serif"
    fontWeight: 400
  body:
    fontFamily: "ui-rounded, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "15px"
    lineHeight: 1.55
  num:
    fontFamily: "'Baloo 2', sans-serif"
    fontWeight: 800
    fontVariantNumeric: tabular-nums
rounded:
  sm: "12px"
  md: "16-18px"
  pill: "999px"
spacing:
  sm: "10px"
  md: "14-16px"
components:
  button-primary:
    backgroundColor: "linear-gradient(180deg,#FF8A5C,#F04E2A)"
    textColor: "#FFFFFF"
    typography: "{typography.display}"
    rounded: "20px"
    padding: "16px"
  chip-selected:
    backgroundColor: "linear-gradient(180deg,#FF8A5C,#F04E2A)"
    textColor: "#FFFFFF"
    shadow: "0 3px 0 #C23A22"
---

# Design System: 燃脂勇者 SlimHero

## Overview

**Creative North Star: "圆滚滚的Q版网游公会大厅"**

每天晚饭 = 一场回合制遭遇战。勇者（Q 版骑士小团子）对肥肥怪出手，伤害=今日评分；怪物血条就是评分条。整体是暖黄羊皮纸底的轻网游：像素感不追求，圆润贴纸感优先。拒绝真实网游的深色硬核 UI 与焦虑红字。

**Key Characteristics:**
- 羊皮纸暖黄底 + 剑橙主行动 + 任务紫 + 胜利薄荷 + 金币黄点睛
- 战斗卡：怪物 C 位 + 大血条（节段式）+ 勇者挥剑动画 + 伤害飘字
- 怪物图鉴：击败过的怪物亮起，未击败的灰剪影+问号
- 连击之路 = RPG 关卡节点链（1→730 关）

## Colors

- **剑刃橙**（#FF6B4A / 深 #C23A22）：主行动——出手按钮、选中态、当前关卡。
- **任务紫**（#8A6BFF）：图鉴、经验条、次级强调。
- **胜利薄荷**（#2ED3A3）：击败语义、成功日。
- **HP 莓**（#FF5D8F）：怪物血条本体（它是怪物的血，不是警告色）。
- **金币黄**（#FFB800）：经验、战利品、完美日。
- **羊皮纸底**（#FFF7E8）+ 三团柔光。

### Named Rules
**The One-Slash Rule.** 全应用唯一的主动作按钮是橙色的「出手！」；录入完四件战况，一刀结算。
**The Monster-First Rule.** 战斗卡内最大的形象是怪物与勇者；伤害数字为它们服务。

## Typography

黄油体（标题/按钮/台词）+ 系统圆体（正文）+ Baloo 2 数字（伤害、血量、经验）。台词用黄油体营造"怪物在叫嚣"的网游中二腔。

## Layout

430px 单栏；顶部公会顶栏（logo + 等级 + 金币式经验条）；战斗卡固定怪物 C 位；底部 4 标签（战斗/地下城/图鉴/公会）。

## Elevation & Depth

贴纸卡片（2px 描边 + 柔影 + `0 3px 0` 微挤出）；果冻大按钮（`0 6px 0` 深色底边，按下下沉）；血条 = 轨道 + 莓色渐变填充 + 节段刻度；伤害飘字 = Baloo 2 大数字上飘。

## Components

### 战斗卡（签名组件）
怪物居中（状态随实时评分变脸：满血嚣张→残血哭嚎）+ 勇者小骑士在侧 + 节段血条 + 出手后的挥砍闪光、伤害飘字、怪物震动。实时评分越高，预览伤害越大。

### Monster（签名组件）
6 只Q版肥肥怪 × 3 血量状态（full/hurt/faint）全 SVG 参数化：果冻团子、甜甜圈史莱姆、奶茶章鱼、薯条蝙蝠、汉堡牛魔、蛋糕魔王（BOSS）。眼睛嘴巴按状态切换，血量低于 50% 贴创可贴，faint 状态翻白眼吐舌头。

### 地下城（日历）
每格一关：击败=关卡旗+金币，未击败=灰色门。点任意关补战。

### 图鉴
怪物卡片网格：已击败显示大名+击败次数，未击败显示剪影+"???"。

### 连击之路
RPG 关卡节点链（1/2/3/4/5/周末双杀/7/14/21/30/100/365/730 关），当前节点脉冲光圈。

## Do's and Don'ts

### Do:
- **Do** 每只怪物配中二台词（"就你这碗饭也想打我？"），击败后台词变服软。
- **Do** 让伤害直接由评分推导（evaluate → damage 单向流）。
- **Do** 数字用 Baloo 2 tabular-nums；击败后必放金币彩带。
- **Do** 失败日也保持搞笑：怪物回血嘲讽"嘿嘿，回血啦～"。

### Don't:
- **Don't** 出现红色焦虑横幅或体重羞辱；失败=怪物得瑟，不是用户挨骂。
- **Don't** 用 emoji 当控件图标（怪物/图标全部手绘 SVG；文案里可以）。
- **Don't** 追求写实网游质感（金属、暗黑、粒子特效）；保持圆滚滚贴纸感。
