# 🏭 ENNOVI 数字化指挥中心 (DCC) - 开发手册与设计规范

> **版本:** 1.0
> **主题:** Cyberpunk Industrial / 赛博工业风 (High-Fidelity Dark Mode)
> **核心理念:** "The War Room" - 沉浸感、因果联动、人机闭环。

本文档详细定义了 ENNOVI 数字化驾驶舱的架构与设计原则。未来的开发者在复刻或扩展功能时，**必须**严格遵循本规范，以保持系统的一致性。

---

## 1. 核心设计哲学 (Core Philosophy)

1.  **沉浸感 (Immersion):** 这是一个全天候监控环境，而非简单的报表工具。我们使用深色背景、微光效果和“磨砂玻璃”质感，既能降低长期观看的视觉疲劳，又能向管理层传递“高科技/高精密”的品牌形象。
2.  **因果联动 (Causality):** 数据拒绝孤岛。当屏幕中央的 KPI 变红时，必须支持**点击钻取 (Drill-down)**，直接在地图或图表中高亮显示导致问题的根本原因（如某台具体的冲压机）。
3.  **人机协同 (Human-in-the-Loop):** 承认当前 IoT 覆盖率不足的现状。我们设计了如“手机扫码指派”的模拟交互，展示人工如何介入数据闭环，增强系统的落地真实感。

---

## 2. 视觉设计系统 (Visual System)

### A. 色彩规范 (High Contrast Neon)
采用“红绿灯 + 霓虹点缀”的高对比度配色方案，背景必须保持深邃。

| 语义 | Tailwind 类名 | Hex 值 | 用途 |
| :--- | :--- | :--- | :--- |
| **背景色** | `bg-[#0B1120]` | `#0B1120` | 应用主背景 (午夜蓝/黑) |
| **玻璃容器** | `bg-white/5` | `rgba(255,255,255,0.05)` | 卡片容器基底 |
| **品牌色 (高亮)** | `text-yellow-400` | `#facc15` | **ENNOVI 黄** - 关键动作、强调数字 |
| **正常 (Normal)** | `text-green-400` | `#4ade80` | 状态良好、达标 |
| **警告 (Warning)** | `text-orange-400` | `#fb923c` | 接近阈值、轻微延误 |
| **危急 (Critical)** | `text-red-500` | `#ef4444` | 停机、缺陷爆发 - 必须配合 `animate-pulse` 动画 |
| **科技/中性** | `text-blue-400` | `#60a5fa` | 静态标签、网格线、辅助信息 |

### B. 玻璃拟态 (Glassmorphism)
禁止使用纯色背景卡片。必须使用封装好的 `<GlassCard />` 组件。
*   **模糊:** `backdrop-blur-xl` (强模糊)
*   **边框:** `border-white/10` (极细微描边)
*   **阴影:** `shadow-xl`

### C. 排版与字体
*   **标题:** `Inter` (无衬线) - 全大写 (Uppercase)，加宽字间距 (Tracking-widest)。
*   **数字/数据:** `JetBrains Mono` (等宽) - 确保数字在列表中垂直对齐，增强仪表盘感。

---

## 3. 组件架构 (Component Architecture)

### `GlassCard.tsx`
所有 UI 的基础容器。
*   **Props:** `title`, `subTitle`, `variant` ('critical', 'warning', 'default'), `className` (!overflow-visible).
*   **行为:** 自动处理玻璃背景、标题栏样式和溢出逻辑。

### `FactoryMap.tsx` / `ProductionShopView.tsx`
“数字孪生”核心视图。采用**分层渲染策略**以解决遮挡问题：
*   **Layer 0 (底层):** 网格背景、AGV 动画路径 (Clipped/Hidden Overflow)。
*   **Layer 1 (中层):** 机器设备 SVG、状态指示灯。
*   **Layer 2 (顶层):** 悬浮 Tooltips/Popovers (Visible Overflow, Z-Index 100)。
*   **交互:** 鼠标悬停显示详细遥测数据，点击设备筛选右侧“行动中心”。

### `SideNav.tsx`
垂直侧边导航。使用“图标 + 标签”模式。激活状态必须高亮显示品牌黄色。

---

## 4. 数据模拟策略 (Data Strategy)

为了在 Demo 中演示“故障发生与解决”的完整故事线，我们不使用完全随机的数据，而是采用 **时间快照 (Time Snapshots)** 模式。

### 快照模式 (Snapshot Pattern)
在 `App.tsx` 的 `DATA_SNAPSHOTS` 常量中定义了工厂在三个时间点的状态：
*   **09:00:** 全绿 (理想状态)。
*   **11:00:** 出现预警 (物料短缺、速度下降)。
*   **14:00:** 严重故障 (产线停机、质量爆发)。

**开发规则:** 当你添加新模块（如供应链）时，必须在所有 3 个快照中添加对应的数据状态，以支持底部“时间滑块”的切换演示。

---

## 5. 开发者自查清单 (Checklist)

在提交代码前，请检查：
- [ ] **暗黑模式:** 文字在深色工厂背景图上是否清晰可读？(是否添加了足够的文字阴影或背景遮罩？)
- [ ] **Z-Index:** 悬浮窗口(Tooltip)是否被邻近的卡片遮挡？(容器是否加了 `!overflow-visible`?)
- [ ] **品牌一致性:** 关键高亮是否使用了 ENNOVI 黄 (`#facc15`)？
- [ ] **国际化:** 标题是否包含 "English // 中文" 双语注释？

---

## 6. 技术栈 (Tech Stack)

*   **框架:** React 18 + Vite
*   **样式:** Tailwind CSS
*   **图标:** Lucide React
*   **图表:** Recharts
*   **语言:** TypeScript
