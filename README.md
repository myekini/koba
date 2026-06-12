<div align="center">

# KOBA — Your AI Money Coach

**An AI-powered financial coaching experience for UBA Group customers.**
Savings goals, spending insights, and a conversational coach — built as a production-ready feature module for the UBA mobile banking app.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/License-Private-E60026)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](#contributing)

</div>

---

## Overview

KOBA is the Smart Money MVP for **UBA Group** — a modern, high-performance dashboard that gives banking customers (like our persona, Oluwaseun) a financial overview, quick transaction access, and AI-driven insights to improve financial health.

It ships as a **mobile-first feature module**: full-bleed on real phones, and rendered inside a device frame on desktop so stakeholders can review it exactly as it would appear in the UBA mobile app.

### Key features

| Feature | Description |
| --- | --- |
| 🏠 **Home dashboard** | Total balance card, quick actions, KOBA entry point, recent transactions |
| 🤖 **KOBA Coach** | Conversational AI coach whose replies are generated from **live app state** and whose suggestions execute real actions |
| 🎯 **Savings goals** | Vacation, Emergency, and House goals with progress, contribution history sparklines, and one-tap Quick Save |
| 📊 **Spending insights** | Per-category breakdowns vs. budget limits, month-over-month comparison, actionable insight cards |
| 💸 **Wired money movement** | Coach-initiated transfers, idle-cash sweeps, budget limits, and auto-save rules all update balances, goals, transactions, and the wellness score everywhere |
| 🎨 **Dual design system** | Two complete visual languages over one state layer, switchable live |
| 🌗 **Universal dark mode** | Both designs fully support light and dark themes |

---

## The two designs

Both designs render from the **same state provider** — every flow works identically in each. Switch with the bar at the top of the app, or via URL.

| | Classic | Stitch (Illustrative) |
| --- | --- | --- |
| **Aesthetic** | Modern minimalist banking — flat surfaces, UBA Red anchor | Editorial illustrative — graph-paper canvas, ink & pastel palette |
| **Typography** | Geist | Hanken Grotesk |
| **Accent** | UBA Red `#E60026` | Ink `#1a1c1c` · Sun `#ffce00` · Blush · Mint |
| **Signature** | Flat red balance card, quiet motion | Neobrutalist goal cards, yellow CTA pills |
| **URL** | `?design=classic` | `?design=stitch` |

This doubles as an informal **A/B testing rig**: share the two URLs, gather feedback, and when real traffic and analytics exist, replace the switcher with a 50/50 assignment — the architecture requires zero rework.

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install & run

```bash
git clone https://github.com/myekini/koba.git
cd koba
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — resize below 1024 px (or open on a phone) for the full-bleed mobile experience.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Fonts (Geist + Hanken Grotesk), metadata, viewport
│   ├── globals.css             # Theme tokens for both designs, dark palettes
│   └── page.tsx                # App shell: device frame, design/theme switcher
├── lib/
│   ├── mock-data.ts            # Domain types + seed data (single source of truth)
│   ├── smart-money-context.tsx # State provider, reducer, coach engine, derived values
│   └── utils.ts                # cn(), formatNaira()
└── components/
    ├── layout/                 # Status bar, bottom navigation (variant-aware)
    ├── views/                  # Classic design: home + KOBA tabs
    └── illustrative/           # Stitch design: home + KOBA tabs
```

### State model

A single `SmartMoneyProvider` (React context + reducer) owns **accounts, goals, transactions, monthly spend, budget limits, the coach conversation, and settings**. Everything the UI shows is **derived** — total balance, income/spent/saved, the financial wellness score, and goal statuses are computed from state, never hardcoded.

```
User action ──▶ dispatch ──▶ reducer ──▶ new state ──▶ every screen updates
   │                                          ▲
   └── Coach quick-reply ──▶ reply + effect ──┘   (transfers, sweeps, limits, auto-save)
```

### The coach engine

`getCoachReply(state, input)` matches intent against **live state** and returns a reply that may carry an *effect* — a pure state transformation applied in the same reducer step. Accepting "Transfer ₦26,000" genuinely moves money: the Current account is debited, the Emergency Fund completes, a transaction is posted, the saved-this-month figure rises, and the wellness score recalculates. Guards refuse actions the balance can't cover.

### Financial wellness score

Computed, not invented:

```
score = 100 × (0.35 × min(1, savingsRate / 0.15)
             + 0.35 × max(0, 1 − max(0, budgetUtilization − 0.5))
             + 0.30 × averageGoalProgress)
```

Save more, stay under budget, progress your goals → the score visibly improves across the app.

---

## Product & design principles

**Users.** UBA Group banking customers managing their finances, saving toward goals, and seeking financial coaching.

**Brand personality.** Modern, minimalist, sleek, confident, highly functional — clean aesthetics with purposeful micro-interactions.

**Design principles.**
- **Modern minimalist** — clean interface, the data is the hero
- **Purposeful motion** — animation delights, never distracts (no bouncing, no elastic easing)
- **Brand consistency** — UBA Red `#E60026` anchors the classic experience
- **Frictionless action** — quick actions feel instantly tactile and responsive

**Anti-references.** Cluttered legacy banking interfaces; generic SaaS templates; flashy, purposeless animation.

**Accessibility.**
- High contrast for financial figures (`tabular-nums` throughout)
- Semantic HTML, keyboard-navigable controls, ARIA labels on icon buttons
- `prefers-reduced-motion` respected globally
- 12 px minimum body text

---

## Mock data & demo flows

The MVP runs entirely on wired mock data — no backend required. Try these end-to-end flows:

1. **Quick Save** — Goals → Emergency Fund → Confirm Quick Save → watch the goal, balances, and Home transactions update.
2. **Coach transfer** — Coach → "Emergency fund status" → the coach quotes your *live* progress → accept the transfer → the fund completes.
3. **Idle cash sweep** — Ask the coach to sweep idle cash; it refuses if your Current balance can't cover it.
4. **Budget limit** — Tell the coach to "set a food limit" → Insights immediately reflects the new ₦35,000 limit.
5. **Auto-save rule** — "Vacation goal advice" → "Yes, automate it" → an Active automation row appears in Settings.

---

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) | Static prerender, client feature module |
| UI | React 19 + TypeScript 5 | Strict types across domain models |
| Styling | Tailwind CSS 4 | CSS-first theme tokens; dual-design palettes |
| Motion | Framer Motion 12 | Spring transitions, layout animations |
| Components | Base UI + shadcn | Headless primitives |
| Icons | Lucide | |
| Fonts | Geist, Geist Mono, Hanken Grotesk | via `next/font` |

---

## Roadmap

- [ ] Replace mock data with UBA core-banking APIs
- [ ] Real LLM-backed coach (Claude API) behind the same effect interface
- [ ] Analytics + formal A/B assignment between the two designs
- [ ] Transfers & Cards tabs
- [ ] Goal creation flow
- [ ] Push-notification nudges

## Contributing

1. Branch from `main`
2. `npm run lint && npm run build` must pass
3. Open a PR with screenshots for any UI change

## License

Proprietary — © UBA Group. All rights reserved. For internal evaluation and development.
