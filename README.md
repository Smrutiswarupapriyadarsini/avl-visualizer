# 🌳 Interactive AVL Tree Visualizer (DSA Project)

An interactive, educational, and modern **AVL Tree Visualizer** built with **React**, **Next.js**, and **Tailwind CSS**. Designed for computer science students, educators, and software engineers to explore self-balancing binary search tree algorithms and rotations in real time.

---

## 📑 Table of Contents
- [1. Abstract & Project Objectives](#1-abstract--project-objectives)
- [2. Tech Stack](#2-tech-stack)
- [3. Key Features](#3-key-features)
- [4. Core Algorithm Details](#4-core-algorithm-details)
  - [AVL Self-Balancing Logic](#avl-self-balancing-logic)
  - [Balance Factor Formula](#balance-factor-calculation-formula)
  - [Rotations Explained (LL, RR, LR, RL)](#the-4-rotations-explained)
  - [Time & Space Complexity Analysis](#time--space-complexity-table)
- [5. Setup & Execution Instructions](#5-setup--step-by-step-execution-instructions)
- [6. Project Architecture](#6-project-architecture)

---

## 1. Abstract & Project Objectives

### Abstract
Binary Search Trees (BST) provide efficient search, insertion, and deletion capabilities with average-case time complexities of $O(\log n)$. However, when elements are inserted in sorted or near-sorted orders, an unbalanced BST degenerates into an $O(n)$ linked list, resulting in worst-case lookup performance.

The **AVL Tree** (named after inventors Adelson-Velsky and Landis in 1962) was the first dynamically self-balancing binary search tree ever invented. It strictly enforces a height balance criterion across all subtrees, bounding tree height to $O(\log n)$ and guaranteeing strict $O(\log n)$ performance across all search, insertion, and deletion operations.

### Project Objectives
- **Demystify Complex Rebalancing**: Provide an intuitive, visual medium to observe how AVL trees detect imbalances during recursive unwinding and resolve them via tree rotations.
- **Micro-Step Traceability**: Break down compound operations (e.g., finding in-order successors during deletion, multi-step double rotations) into interactive, rewindable steps.
- **Interactive Sandbox**: Enable students and developers to experiment with custom node values, preset corner cases (LL, RR, LR, RL), and instant traversal inspections.
- **Modern Web Standard**: Deliver a high-performance, responsive single-page web application featuring responsive vector graphics (SVG), dark-mode glassmorphism, and instant hot-reloading.

---

## 2. Tech Stack

| Technology | Purpose | Description |
| :--- | :--- | :--- |
| **React 18** | UI Library | Declarative component state management, hooks (`useMemo`, `useCallback`, `useRef`), and reactive DOM updates |
| **Next.js 14** | Web Framework | Modern App Router setup, static page optimization, fast compilation, and zero-config deployment |
| **Tailwind CSS 3** | Styling & Theme | Utility-first CSS engine, custom responsive layouts, neon glassmorphism palettes, and micro-animations |
| **SVG (Scalable Vector Graphics)** | Visual Rendering | Clean, resolution-independent rendering of nodes, curved cubic-bezier edges, and directional indicators |
| **Lucide React** | Iconography | Lightweight, accessible SVG icons for media controls, operations, and badges |
| **Canvas Confetti** | Gamification / Polish | Celebratory visual trigger when complex rotation scenarios rebalance the tree |

---

## 3. Key Features

### 🎮 Interactive Tree Canvas
- **Dynamic 2D Tree Layout**: A mathematical layout engine computes horizontal ranks via in-order projection and vertical spacing based on tree depth, preventing node overlapping across deep or skewed trees.
- **Pan & Zoom Navigation**: Interactive canvas panning (click-and-drag) and zooming (mouse wheel or control buttons: 40% to 220% scale) with one-click view reset.
- **Node Status Badges**:
  - **Center**: Node numeric value.
  - **Top Badge**: Real-time **Balance Factor ($BF$)** badge ($+1$, $0$, $-1$ in emerald/cyan; $\ge +2$ or $\le -2$ in pulsing rose with rotation alert rings).
  - **Bottom Badge**: Current **Height ($H$)** badge.
- **Visual Node States**:
  - Default: Indigo/slate dark gradients.
  - Active / Inspection Path: Amber glow and border.
  - Imbalanced: Crimson glow with pulsing alert animation.
  - Subtree Root: Teal highlight upon rotation completion.

### ⚡ Operations
- **Insert**: Validates and inserts integers, logs comparisons down the BST path, updates heights upon unwinding, identifies imbalances, and applies rebalancing rotations. Duplicates are rejected with clear user feedback.
- **Delete**: Supports all three classic BST deletion scenarios:
  1. *Leaf Node Deletion*: Immediate node removal.
  2. *Single Child Deletion*: Splicing and promoting the single child.
  3. *Two Children Deletion*: Finding the minimum value in the right subtree (**in-order successor**), swapping values, and recursively deleting the successor.
  Rebalances every ancestor node along the backtracking path.
- **Search**: Step-by-step traversal highlighting each node comparison until the target is found or determined absent.
- **Random Generator**: Quickly injects random, non-duplicate nodes between 10 and 99.

### ⏱️ Step-by-Step Animations & Time-Travel Debugger
- **Full Media Controls**:
  - **Play / Pause**: Automatically animates steps at configurable speeds.
  - **Step Forward (`>`) / Step Backward (`<`)**: Step through comparisons, balance checks, and rotation sub-steps.
  - **Skip to Start / Skip to End**: Instantly jump between initial and final balanced states.
  - **Scrubber Bar**: Scrub directly to any point in the operation timeline.
  - **Playback Speed Selector**: 0.5x, 1x, 1.5x, and 2x animation speeds.
- **State Snapshots**: Each recorded step stores a deep snapshot of the tree, allowing scrubbing backwards to render the exact previous tree geometry.

### 🎯 Rotation Presets
Instant one-click presets demonstrating each rotation scenario:
- **LL Preset**: Inserts `30 -> 20 -> 10` (triggers Right Rotation).
- **RR Preset**: Inserts `10 -> 20 -> 30` (triggers Left Rotation).
- **LR Preset**: Inserts `30 -> 10 -> 20` (triggers Left-Right Double Rotation).
- **RL Preset**: Inserts `10 -> 30 -> 20` (triggers Right-Left Double Rotation).
- **Balanced 7-Node Preset**: Inserts `40, 20, 60, 10, 30, 50, 70` (creates a balanced binary tree).
- **Random 5 Preset**: Injects 5 distinct randomized nodes.

### 📜 Real-Time Execution Logs
- A chronological timeline of every micro-operation tagged with colored badges (`COMPARE`, `TRAVERSE`, `CHECK_BALANCE`, `ROTATION_LL`, `ROTATION_RR`, `ROTATION_LR`, `ROTATION_RL`, `DELETE_LEAF`, `FIND_SUCCESSOR`, `COMPLETE`).
- **Interactive Time-Travel**: Clicking any historical log item immediately updates the visualizer to that exact step state.
- **Active Step Card**: Prominently displays the mathematical justification for the current action (e.g., *"Node 30 has BF = +2 and Left Child 20 has BF = +1. Performing Right Rotation (LL Case)"*).

### 📊 Tree Statistics & Traversals Dashboard
- Total Node Count, Tree Height, and Theoretical Upper Bound Height ($\approx 1.44 \log_2(n+2) - 0.328$).
- Real-time Balance Status indicator.
- Cumulative rotation counters for LL, RR, LR, and RL.
- Four tree traversal sequences with one-click clipboard copying:
  - **In-Order**: Left &rarr; Root &rarr; Right (Sorted order).
  - **Pre-Order**: Root &rarr; Left &rarr; Right.
  - **Post-Order**: Left &rarr; Right &rarr; Root.
  - **Level-Order**: Breadth-First Search (BFS).

---

## 4. Core Algorithm Details

### AVL Self-Balancing Logic
An AVL tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one. Whenever an insertion or deletion causes this invariant to be violated, one or more rotations are performed along the ancestor path to restore balance.

### Balance Factor Calculation Formula
The **Balance Factor ($BF$)** of a node $N$ is defined as:

$$BF(N) = \text{Height}(N.\text{left}) - \text{Height}(N.\text{right})$$

- $\text{Height}(\text{null}) = 0$
- $\text{Height}(\text{leaf}) = 1$
- $\text{Height}(N) = 1 + \max(\text{Height}(N.\text{left}), \text{Height}(N.\text{right}))$

A node $N$ is **balanced** if:

$$BF(N) \in \{-1, 0, +1\}$$

If $|BF(N)| > 1$, the subtree rooted at $N$ is **unbalanced** and requires rebalancing.

---

### The 4 Rotations Explained

```
           LL Case                     RR Case
     (Single Right Rotate)        (Single Left Rotate)

          z                           z
         /                             \
        y        ===>     y             y        ===>     y
       /                 / \             \               / \
      x                 x   z             x             z   x

          LR Case                     RL Case
       (Double Rotate)             (Double Rotate)

        z             z             z             z
       /             /               \             \
      y     ===>    x     ===>  x     y     ===>    x     ===>  x
       \           /           / \   /               \         / \
        x         y           y   z x                 y       z   y
```

#### 1. Left-Left (LL) Case &rarr; Single Right Rotation
- **Trigger Condition**:
  $$BF(N) > 1 \quad \text{and} \quad BF(N.\text{left}) \ge 0$$
- **Cause**: A node was inserted into the left subtree of the left child of $N$.
- **Action**: Perform a single **Right Rotation** on $N$.
- **Mechanics**:
  1. Let $y = N.\text{left}$.
  2. $N.\text{left}$ adopts $y.\text{right}$.
  3. $y.\text{right}$ becomes $N$.
  4. Update heights of $N$ and $y$.
  5. Return $y$ as the new subtree root.

#### 2. Right-Right (RR) Case &rarr; Single Left Rotation
- **Trigger Condition**:
  $$BF(N) < -1 \quad \text{and} \quad BF(N.\text{right}) \le 0$$
- **Cause**: A node was inserted into the right subtree of the right child of $N$.
- **Action**: Perform a single **Left Rotation** on $N$.
- **Mechanics**:
  1. Let $y = N.\text{right}$.
  2. $N.\text{right}$ adopts $y.\text{left}$.
  3. $y.\text{left}$ becomes $N$.
  4. Update heights of $N$ and $y$.
  5. Return $y$ as the new subtree root.

#### 3. Left-Right (LR) Case &rarr; Left Rotation then Right Rotation
- **Trigger Condition**:
  $$BF(N) > 1 \quad \text{and} \quad BF(N.\text{left}) < 0$$
- **Cause**: A node was inserted into the right subtree of the left child of $N$.
- **Action**:
  1. Perform a **Left Rotation** on $N.\text{left}$ (converts the tree into an LL shape).
  2. Perform a **Right Rotation** on $N$.

#### 4. Right-Left (RL) Case &rarr; Right Rotation then Left Rotation
- **Trigger Condition**:
  $$BF(N) < -1 \quad \text{and} \quad BF(N.\text{right}) > 0$$
- **Cause**: A node was inserted into the left subtree of the right child of $N$.
- **Action**:
  1. Perform a **Right Rotation** on $N.\text{right}$ (converts the tree into an RR shape).
  2. Perform a **Left Rotation** on $N$.

---

### Time & Space Complexity Table

| Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :---: | :---: | :---: | :---: |
| **Search (Lookup)** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ |
| **Insertion** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ call stack |
| **Deletion** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ call stack |
| **Rotations (LL, RR, LR, RL)** | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ pointer adjustments |
| **Total Tree Space** | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ total memory |

> **Height Invariant Guarantee**: The maximum height of an AVL tree with $n$ nodes is strictly bounded by:
> $$h \le 1.4404 \cdot \log_2(n + 2) - 0.3277$$
> This guarantees that an AVL tree will never degrade into an unbalanced $O(n)$ skewed chain.

---

## 5. Setup & Step-by-Step Execution Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) version **18.17+** or higher (tested on Node v20 & v24).
- `npm` (bundled with Node.js) or `yarn` / `pnpm`.

### Step 1: Clone or Navigate to the Workspace
Open a terminal in the project directory:
```bash
cd "c:\Users\asus\OneDrive\文档\Desktop\avl-visualizer (DSA project)"
```

### Step 2: Install Dependencies
Install all required dependencies:
```bash
npm install
```

### Step 3: Run the Development Server
Start the local Next.js development server:
```bash
npm run dev
```

The output will confirm the local port:
```text
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 1.7s
```

### Step 4: Open in Your Browser
Open your favorite browser and visit:
```text
http://localhost:3000
```

### Step 5: (Optional) Build for Production
To generate an optimized production build:
```bash
npm run build
npm run start
```

---

## 6. Project Architecture

```
avl-visualizer (DSA project)/
├── AVLTree.js                  # Complete AVL Tree logic, rebalancing, steps recorder & 2D layout engine
├── app/
│   ├── globals.css             # Tailwind styling, dark theme, glow keyframes, custom scrollbars
│   ├── layout.js               # Root layout, HTML metadata, and Google-style font styling
│   └── page.jsx                # Main page controller: state, playback loop, layout triggers
├── components/
│   ├── ControlPanel.jsx        # Operations (Insert, Delete, Search), Presets, and Playback controls
│   ├── TreeCanvas.jsx          # SVG visualization canvas with interactive zoom/pan & node badges
│   ├── StepLogger.jsx          # Chronological execution logs, time-travel handler & active step card
│   ├── TreeStats.jsx           # Real-time tree metrics (Height, Max bound, Traversals copy)
│   └── RotationGuideModal.jsx  # Interactive cheat sheet modal with rotation diagrams & formulas
├── package.json                # Project dependencies (Next.js 14, React 18, Tailwind, Lucide, Confetti)
├── tailwind.config.js          # Tailwind styling rules and responsive color extensions
├── postcss.config.js           # PostCSS configuration for Tailwind
├── next.config.mjs             # Next.js compiler settings
└── README.md                   # Project documentation
```

---

## 👥 Authors & Academic Context
Created as a modern **Data Structures and Algorithms (DSA)** educational project to provide a visual learning platform for understanding self-balancing binary search trees.

---

## 📄 License
This project is open-source and available under the **MIT License**.
