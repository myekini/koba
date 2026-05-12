# KOBA — UBA Smart Money

A high-fidelity interactive prototype for **UBA Smart Money**, an AI-powered personal finance module embedded inside the UBA mobile banking app.

## What it is

UBA Smart Money is a prototype feature that gives UBA customers:
- **AI Financial Coach** — keyword-matched responses tied to real spending data
- **Savings Goals** — track vacation, emergency fund, house deposit progress
- **Spending Insights** — category breakdown with actionable nudges
- **Quick Save** — one-tap fund transfers with undo

## Stack

Pure HTML + CSS + Vanilla JS — no build tools, no frameworks, no dependencies.

```
KOBA/
├── index.html           ← app shell
├── css/
│   ├── tokens.css       ← UBA design system variables
│   ├── base.css         ← reset, shell, responsive layout
│   ├── components.css   ← all UI components
│   └── pages.css        ← page-level styles
├── js/
│   ├── data.js          ← dummy data & helpers
│   ├── navigation.js    ← screen/page switching
│   ├── sheets.js        ← bottom sheet manager
│   ├── toast.js         ← snackbar notifications
│   ├── coach.js         ← AI chat logic
│   └── app.js           ← init & handlers
└── UBA_Group/           ← official UBA brand assets
```

## Run locally

```bash
npx serve .
# open http://localhost:3000
```

Or just open `index.html` directly in any modern browser.

## Design

- UBA brand colours — `#E60026` red, UBA white wordmark SVG
- Mobile-first 390px shell, phone-frame presentation on desktop/tablet
- Responsive: full-screen on mobile, centred device mockup on ≥500px screens
