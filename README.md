# ENNOVI Digital Command Center (DCC)

A high-fidelity, modular digital cockpit designed for manufacturing delivery management. This project serves as a "North Star" demo for the future of connected factory management at ENNOVI.

![Status](https://img.shields.io/badge/Status-Prototype-yellow)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Tailwind-blue)

## 🚀 Key Features (核心功能)

*   **Interactive Digital Twin (数字孪生):** 2D Factory Floor maps with real-time status and machine telemetry.
*   **Time Travel Simulation (时光回溯):** Slider to replay factory conditions (09:00 vs 14:00) to visualize causality.
*   **Human-in-the-Loop (人机协同):** "Scan to Assign" mobile workflow simulation.
*   **Internationalization (国际化):** Dual-language headers (English/Chinese) for the Hangzhou Giga-Factory context.
*   **Modular Architecture (模块化):** Pluggable modules for Quality (SPC), Supply Chain, and Customer Demand (S&OP).

## 🛠 Setup & Run

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## 🎨 Design System & Documentation

We strictly follow a "Cyberpunk Industrial" design language.

👉 **[点击查看中文设计规范文档 (Design System)](./DESIGN_SYSTEM.md)**

Please refer to `DESIGN_SYSTEM.md` for detailed guidelines on:
*   Color Palettes (色彩规范)
*   Component Usage (组件使用: `GlassCard`, `KPIRing`)
*   Data Simulation Logic (数据模拟策略)
*   Layering & Z-Index Rules (层级与遮挡处理)

## 📂 Project Structure

*   `src/components`: Reusable UI blocks (FactoryMap, CustomerPanel, etc.)
*   `src/types.ts`: TypeScript definitions for all domain models (KPI, ProductionLine).
*   `src/App.tsx`: Main logic controller, State Management, and Data Snapshots.
