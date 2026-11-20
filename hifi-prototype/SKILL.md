---
name: hifi-prototype
display_name: B端高保真原型生成器
display_name_en: B2B Hi-Fi Prototype Builder
description: 生成可双击直开的 B 端业务系统高保真交互原型（管理后台 + 深色大屏驾驶舱双形态）：成套自动生成的仿真业务 Mock 数据（虚构企业世界观、人名/编号/电话全站一致、KPI 与明细严格对账），可点可流转的准产品级交互（表单校验、工单闭环、状态跨视图联动），配套门户汇总页（按交付状态自动标注）与分批交付。当用户要求"做原型 / 生成原型 / 高保真原型 / 产品原型 / 交互原型 / 原型图 / 可交互 demo / 产品演示"，特别是出现 B 端业务特征词——管理后台、大屏、驾驶舱、监控大屏、工单、台账、审批流、告警中心、设备管理、MES/SCADA/WMS 等工业与业务系统词汇——或提供功能清单/模块清单要求快速产出可演示的 Web 原型时，优先使用本技能。面向 C 端消费者的营销页/官网/海报/幻灯片，或需要 Figma 设计稿、静态线框图时，不适用本技能。
description_zh: 一句话生成管理后台/监控大屏类 B 端系统的高保真原型：自带成套仿真业务数据、表单校验与工单闭环等准产品级交互，双击即开、可点可流转，附门户导航页按交付状态标注。
description_en: "Generate hi-fi interactive prototypes for B2B systems (admin console + dark dashboard): bundled self-consistent mock data, form validation & ticket-loop interactions, double-click to run."
examples_zh:
  - "做一个设备管理系统的可交互原型，要有台账、点表实时值、维保提醒"
  - "给我们的质检流程做一个管理后台原型，含工单流转和审批"
  - "生成一个车间监控大屏原型，要有 GIS 一张图和实时告警"
examples_en:
  - "Build an interactive prototype for a device management system"
  - "Create an admin console prototype with ticket workflow"
  - "Generate a factory monitoring dashboard prototype"
version: 1.0.0
author: yangxuit
agent_created: true
---

# 高保真交互原型（hifi-prototype）

## 概述

按统一的工程架构、UI 规范、交互深度、数据模拟与演示策略标准，产出可双击直开、可点可流转、含仿真 mock 业务数据的高保真 HTML 原型。规范源自真实工业/B 端平台级原型体系提炼，产出物定位是"准产品"而非"看起来像的静态稿"。

冲突仲裁优先级（所有规范冲突时）：**架构纪律 > 交互真实感 > 视觉规范 > 内容数量**。

三条铁律（任何档位不可降）：

1. 每一个可见的按钮、链接、开关都必须有真实行为（弹窗、跳转、状态变更、数据更新或明确提示反馈），禁止死链接与空操作。
2. 所有演示数据集中管理（`_shared/mock.js` 单一事实源），页面内禁止散落硬编码业务数据。
3. 未规划的远期能力一律用禁用态 + 标签显式标注（`disabled` + "P1 规划中"徽标），禁止伪造成可用功能。

## 工作流

### 第 1 步 · 判定任务规模，选执行档

| 档位 | 判定条件 | 加载范围 |
|---|---|---|
| 单页轻量 | 明确只有 1 个页面/单一功能演示 | 本文件 + references/architecture.md（仅读 2.1 五层架构概要与 2.3 页面骨架）+ references/interaction.md |
| 标准多页 | 2~6 个模块的常规原型任务 | 本文件 + 全部 references 按需加载 + assets/hello-prototype/ 作骨架参考 |
| 平台级 | 模块 > 6 个或用户明示"平台/体系" | 同上，且必须严格执行 references/delivery.md 分批交付节奏 |

### 第 2 步 · 收集输入槽位

必填槽位（缺失时逐项询问用户，一次最多问 3 项）：

- 【运行模式】A（全新项目，从零建五层架构）/ B（延续已有项目，复用现有 `_shared` 层；选 B 时先通读既有文件再动手）
- 【项目名称】
- 【模块清单】一级模块 × 二级页面清单（编号 + 名称 + key）

可选槽位（未提供时按默认执行，不追问）：虚构主体设定（默认从项目名派生）、行业与业务域、依据文档、页面形态（默认管理后台）、视觉风格预设（默认 S1）、交互深度档位（默认 L3）、数据规模（默认每域 5~15 条）、贯穿性剧本、特殊机制、交付批次。

槽位全表与填写示例见 references/slots-reference.md。

### 第 3 步 · 按规范执行生成

- 工程架构（五层零依赖、API 桩契约、hash 路由、组件词表）→ **必读** references/architecture.md
- UI 规范（双产品形态、S1~S4 风格预设令牌、组件类名体系、动效规范）→ references/ui-spec.md
- 交互深度（L1/L2/L3 分档定义与不分档强制范式规则）→ **必读** references/interaction.md
- 数据模拟（虚构主体世界观、剧本化原则、字段真实感、数据规模）→ references/data-spec.md
- 交付节奏（门户先行、分批交付、每批可独立打开）→ references/delivery.md

assets/hello-prototype/ 内含一份最小可运行的五层骨架示例（门户 + 1 个模块页 + `_shared` 四件套精简版）。模式 A 全新项目时，优先以该骨架为起点做增量定制，而非从零重写共享层，以保证跨项目结构一致性。

### 第 4 步 · 交付前验收

逐项自查 references/acceptance.md 中的质量清单（运行健康 / 交互完整 / 数据可信 / 视觉规范四类）。任何一项不通过，修复后再交付，不交付带伤原型。

## 与 demo-tour 技能的衔接

原型交付后若用户需要"引导式演示动线"（宣讲场景：开始 → 下一步 → …… → 结束的放映机式演示），在页面中预留演示入口卡片并建议用户使用 demo-tour 技能叠加演示编排。

## 资源清单

- `references/slots-reference.md` — 输入槽位全表、默认值与填写示例
- `references/architecture.md` — 五层零依赖架构、API 桩契约、路由与组件规范
- `references/ui-spec.md` — 双形态布局、四套风格预设、组件类名、动效
- `references/interaction.md` — L1/L2/L3 深度分档与强制交互范式
- `references/data-spec.md` — 数据世界观、剧本化、字段真实感规范
- `references/delivery.md` — 分批交付节奏与模式 B 延续约束
- `references/acceptance.md` — 交付前质量验收清单
- `assets/hello-prototype/` — 最小五层骨架示例（复制定制，勿整体载入上下文）
