# 工程架构约束（核心，模式 A/B 通用必读）

## 1. 五层零依赖架构（模式 A 必须从零建立）

```
项目目录/
├── index.html              门户导航页（模块卡片入口，按交付状态标注）
├── 01-模块名.html          每个一级模块一个自包含文档
├── 02-...
└── _shared/
    ├── mock.js             数据层：全平台唯一数据源 DB
    ├── api.js              服务层：异步 API 桩函数
    ├── components.js       组件层：图标/导航/路由/反馈组件
    ├── styles-arco.css     浅色管理后台主题（S 预设的浅色实现）
    ├── styles-screen.css   深色大屏主题（S 预设的深色实现）
    └── js/echarts.min.js   自托管 ECharts（唯一允许的第三方库，必须本地化）
```

分层纪律（逐条强制）：

| 层 | 文件 | 职责契约 |
|---|---|---|
| 数据层 | `mock.js` | IIFE 挂 `window.DB`；按模块编号组织数据域；文件头声明"单一事实源，页面禁止散落硬编码" |
| 服务层 | `api.js` | IIFE 挂 `window.API`；每个函数 async + `delay(200~1200ms)` 拟真延迟；统一返回 `{code:0, msg:'ok', data}`；**写操作真实变更 DB 状态**（unshift/状态字段修改），使交互具备内存态连续性 |
| 组件层 | `components.js` | IIFE 挂 `window.CMP`；含图标字典、`NAV_DOCS`、Toast/Modal/路由/时钟/AI 助手 |
| 样式层 | 两个 css | 浅色与深色双主题，通过 `body.arco-admin` / `body.screen-on` 类在同一 DOM 上切换 |
| 页面层 | `NN-*.html` | 只写视图结构与页面私有逻辑；导航、数据、图标、通用组件一律从共享层取 |

## 2. API 桩的契约注释（后端可机械替换的关键）

每个 API 函数必须带三段式注释：

```js
/** 中文功能说明（含业务规则，如"无证即时阻断，票不生成"） */
// POST /api/v1/tickets { type,place,unit,worker,checked[],gas } → { blocked?, no? }
createTicket: async function (form) { await delay(620); /* ... */ return ok(result); }
```

命名规范：`fetch*` 查询 / `create*·save*·submit*·dispatch*` 新建 / `confirm*·verify*·resolve*·approve*·accept*` 流转 / `toggle*·update*·recheck*` 更新 / `delete*` 删除 / `simulate*·fire*·calc*·run*·trigger*` 演示触发与计算器。

## 3. 页面骨架：单 HTML 多视图 + hash 路由

- 每个文档内所有二级页面平铺为 `<section class="view" data-view="key">`，由 `CMP.initDoc / CMP.initAdminDoc({doc, defaultView, views:{key:{onEnter,onLeave,dark}}})` 驱动 `#/key` 路由。
- 视图懒加载：每个视图配 `XXSTATE.built` 标志，`onEnter` 首次构建、再次进入只刷新。
- **有轮询/定时器的视图必须实现 `onLeave` 清理**，防止后台泄漏。
- 视图声明 `dark:true` 时 body 切 `screen-on` 类，实现"管理文档内嵌一块深色大屏"（平战结合）。
- 页内二级 Tab 用 `#/view@tab` 扩展语法直达；跨文档跳转一律 `location.href='xx.html#/key'`，跳转后需 `setTimeout` 等目标视图挂载再操作。

## 4. 共享组件词表（components.js 必须提供）

`icon(name,size)` 自托管图标（约 110 个 Lucide path，`<i data-icon>` 占位符幂等替换为内联 SVG）；`NAV_DOCS` 导航唯一事实源（顶栏 Tab / 侧边菜单 / 导航抽屉三处由它注入，**禁止页面手写导航**）；`toast(type,title,desc)` 四态提示；`confirmModal({danger})` 二次确认；`contentModal({wide})` 通用弹窗；`beep()` WebAudio 合成提示音（880Hz，无音频文件）；`initDoc/initAdminDoc` 路由初始化；`initAI` 右下角全局 AI 悬浮助手。

## 5. ECharts 使用纪律

- 仅使用本地自托管 `echarts.min.js`，禁止 CDN。
- 定义深浅两套坐标轴/tooltip 预设常量（如 `AXIS`/`AAXIS`），全站统一。
- 视图 `onEnter` 与 `window resize` 双时机 `resize()`；含 Tab 的视图切换后需 `dispose()` 重建。
- **图表密度分级**：大屏页重（gauge/radar/渐变面积线/环形），管理页中（1~4 个常规图），流程/态势页可刻意零图表（用 CSS 微图表：迷你柱、进度条、热力格、sparkline 替代）。

## 6. 最小骨架参考

`assets/hello-prototype/` 内含本架构的最小可运行实现（门户 + 1 个模块页 + `_shared` 四件套）。模式 A 全新项目时，优先以该骨架为起点做增量定制（替换数据域/模块页），保证跨项目结构一致；仅当用户明确要求不同结构时才从零重写。

## 7. 禁止事项（红线）

1. 禁止引入任何外部 CDN、网络字体、远程图标库、音频文件。
2. 禁止使用 `alert/confirm/prompt` 原生弹窗（一律用 Toast/confirmModal）。
3. 禁止 lorem ipsum、"测试数据"、字段名占位等未完成痕迹。
4. 禁止死链接、点了没反应的按钮、永远转圈的 loading。
5. 禁止页面内硬编码业务数据、手写导航（必须走 DB 与 NAV_DOCS）。
6. 禁止伪造未规划能力为可用状态（必须 disabled + 标注）。
7. 禁止使用真实企业/真实人员可识别信息（虚构 + 脱敏）。
8. 禁止 ECharts 以外再引第三方 JS 库（如需新库先征得用户同意并本地化）。
