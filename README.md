# Quantum Ceed

**The 90-Day Men's Fertility Transformation Program**

A mobile-first React PWA with AI voice coaching, habit tracking, meal planning, and sperm test logging.

## Tech Stack

- **React 18** + **TypeScript** — component framework
- **Vite** — build tool & dev server
- **Tailwind CSS** — utility-first styling
- **Zustand** (with `persist`) — global state with local storage
- **React Router v6** — client-side routing
- **Web Speech API** — voice recognition & synthesis

## Features

### Two Purchase Modes
| Gift Mode | Self Mode |
|---|---|
| Woman buys for her man | Man buys for himself |
| Partner Dashboard included | No partner dashboard |
| Progress notifications for her | Full AI coach access |

### Program Structure
- **Phase 1 — Foundation** (Days 1–30): Detox, sleep, basic nutrition
- **Phase 2 — Activation** (Days 31–60): Hormone optimization, strength training
- **Phase 3 — Optimization** (Days 61–90): Peak sperm quality preparation

### Core Screens
1. **Welcome** — Purchase mode selection (Gift / Self)
2. **Onboarding** — Profile setup + 5-question voice session
3. **Home Dashboard** — Day counter, phase progress, daily tasks with photo upload
4. **Voice AI Coach** — Real-time voice conversation, push-to-talk, quick prompts
5. **Habits & Tasks** — 8 daily habits grid + streak tracking
6. **Meal Plan** — Phase-specific meals with nutritional info & photo logging
7. **Sperm Tests** — YO Test tracker for Day 1, 45, 90 with result logging
8. **Partner Dashboard** — Progress view, updates feed, support tips (Gift mode)
9. **Settings** — Voice gender, reminder times, program info

## Getting Started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build
```

## Design Language
- Dark background (`#0a0a0a`) with gold (`#D4A847`) and forest green (`#0d6249`) accents
- Mobile-first layout (max 430px wide, phone-frame on desktop)
- Voice-first interaction with Web Speech API
- Persistent state via localStorage
