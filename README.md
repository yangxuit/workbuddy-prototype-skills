# WorkBuddy Prototype Skills

> Claude Code / WorkBuddy **agent skills** for **B端 B2B prototype**：生成可双击直开的**高保真原型（hi-fi prototype）**——管理后台 admin console + 深色大屏 dashboard 双形态，自带成套 **mock 数据**与准产品级交互；配套**演示放映机（guided demo tour）**技能，把原型变成可自动放映的宣讲演示。

一套面向 **B 端业务系统**的 AI 原型技能组合（Claude Code / WorkBuddy 等 Agent Skills 目录规范兼容）：**别人做"好看的设计稿"，我们做"能演示的准产品"**。

| 技能 | 一句话 | 关键能力 |
|---|---|---|
| **hifi-prototype** | 生成可双击直开的 B 端业务系统高保真交互原型 | 管理后台 + 深色大屏驾驶舱双形态；成套仿真 Mock 数据（虚构企业世界观，人名/编号/电话全站一致，KPI 与明细严格对账）；准产品级交互（表单校验、工单闭环、状态跨视图联动）；门户汇总页按交付状态自动标注 |
| **demo-tour** | 把任意 Web 原型升级为"放映机式"自动演示 | 底部悬浮引导条 + 跨页面自动跳转 + 元素聚焦高亮 + 可直接照念的讲解词 + 现场互动提示；深度贯穿链 / 标准四段链 / 速览链三种叙事档位 |

## 适用场景

- 产品经理：把功能清单/PRD 快速变成可评审、可点可流转的原型
- 售前/解决方案：交付带自动演示动线的宣讲原型，无需背稿
- 内部培训：新系统介绍、评审汇报、客户演示

不适用：C 端营销页/官网/海报/幻灯片、Figma 设计稿、静态线框图。

## 安装

**最简单的安装方式：直接看 [安装指南.md](安装指南.md)**（面向不熟 git 的用户，3 分钟图文步骤）。

### Claude Code

```bash
git clone https://github.com/yangxuit/workbuddy-prototype-skills.git
mkdir -p ~/.claude/skills
cp -r workbuddy-prototype-skills/hifi-prototype ~/.claude/skills/
cp -r workbuddy-prototype-skills/demo-tour ~/.claude/skills/
```

### WorkBuddy

```bash
mkdir -p ~/.workbuddy/skills
cp -r workbuddy-prototype-skills/hifi-prototype ~/.workbuddy/skills/
cp -r workbuddy-prototype-skills/demo-tour ~/.workbuddy/skills/
```

安装后重启客户端即可生效。说"做一个设备管理系统的可交互原型"（hifi-prototype）或"给这个原型加自动放映演示"（demo-tour）即可触发。

## 快速体验

demo-tour 自带完整参考实现（报修闭环 4 页面 + 演示引擎），双击即开：

```
demo-tour/assets/example-baoxiu/index.html
```

hifi-prototype 自带最小五层骨架示例：

```
hifi-prototype/assets/hello-prototype/index.html
```

## 目录结构

```
├── hifi-prototype/          # 技能 1：B 端高保真原型生成
│   ├── SKILL.md             # 技能入口（触发词 + 工作流）
│   ├── references/          # 架构/UI/交互/数据/交付/验收规范
│   └── assets/hello-prototype/   # 最小可运行骨架
└── demo-tour/               # 技能 2：演示放映机
    ├── SKILL.md
    ├── references/          # 引擎/编排/配置/验收规范
    └── assets/
        ├── tour-engine.js   # 放映机引擎（复制定制用）
        └── example-baoxiu/  # 完整参考实现（双击可体验）
```

## 设计原则

1. **数据同源**：全部演示数据集中于单一 mock 层，KPI 汇总 = 明细合计，跨页口径一致——数字矛盾是高保真原型的致命伤
2. **能力诚实标注**：未规划的远期能力一律禁用态 + "P1 规划中"徽标，禁止伪造成可用
3. **零依赖可直开**：纯原生 HTML/CSS/JS，双击 index.html 即可运行，断网可用
4. **讲解词可照念**：演示动线中的每句讲解词都口语化、有卖点、引用真实数据编号，现场直接念

## License

MIT
