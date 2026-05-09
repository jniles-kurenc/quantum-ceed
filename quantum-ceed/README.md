# Quantum Ceed

A 90-day men's fertility transformation mobile app, guided by a Voice AI Coach.

## Two ways to start

- **Gift From Her** — A woman buys the kit. The man uses the full Voice AI Coach. The woman gets a Partner Dashboard with high-level progress, his meal plan, sperm-test notifications, and support tips.
- **Self-Love Mode** — A man buys it for himself. Full Voice AI Coach, no Partner Dashboard.

## Program structure

Three 30-day phases:

1. **Foundation** (Month 1) — sleep, hydration, walks, cut alcohol & seed oils.
2. **Activation** (Month 2) — strength training, cold exposure, zone 2 cardio.
3. **Optimization** (Month 3) — recovery, micronutrients, stress mastery, sperm-friendly cooling.

Sperm tests on **Day 1, Day 45, and Day 90** using the YO Sperm Test kit.

## Core features

- Voice-first AI Coach with male or female voice
- 5-minute voice onboarding so the coach learns your personality
- Scheduled voice reminders: morning, evening, and night
- Natural voice conversation anytime
- Daily habit tracking and workout guidance
- Photo upload for workout and meal verification
- Partner Dashboard (Gift mode): live progress, his meals, test alerts, support tips

## Tech

- Expo (React Native + TypeScript)
- expo-av (voice recording + audio playback), expo-speech (fallback TTS), expo-image-picker (photos)
- OpenAI Whisper (STT) + gpt-4o-mini (chat) + tts-1 (voice) for the live AI Coach
- AsyncStorage for local persistence, expo-file-system for cached coach audio
- react-native-svg for the gold/green Quantum Ceed mark and progress rings

## Run locally

```bash
cd quantum-ceed
npm install
npx expo start
```

Open the Expo Go app on your phone and scan the QR code, or press `i` / `a` for the iOS / Android simulators.

## Voice AI Coach setup

The Coach screen has two modes:

- **Demo mode** (default, no setup) — the coach uses on-device TTS (`expo-speech`) with scripted replies. The screen shows a `Demo` pill. Great for trying the UX.
- **AI live mode** — full pipeline: **Whisper** transcribes what you say → **gpt-4o-mini** replies as your coach (it knows your name, day, phase, coaching style, and how many tasks you've completed today) → **OpenAI TTS** speaks the reply in your chosen voice (`onyx` for male, `nova` for female). The screen shows an `AI live` pill.

To turn on AI live mode:

1. Copy `.env.example` to `.env` and add your OpenAI key:
   ```bash
   cp .env.example .env
   ```
   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
   ```
2. Restart the Expo dev server (`npx expo start --clear`).

> **Security note**: any key prefixed with `EXPO_PUBLIC_` is bundled into the binary. This is fine for local development and TestFlight builds you control, but for a public release you should put a tiny proxy server in front of OpenAI and have the app talk to that instead. The `src/lib/ai.ts` module is the only place to change.

## Project layout

```
src/
  components/   Reusable UI primitives (Card, QCButton, ProgressRing, Logo, ...)
  lib/          Theme, types, storage, program data, AppContext
  screens/
    onboarding/ Splash, Mode select, Profile setup, Voice onboarding, Reminders
    main/       Home, Tasks, Coach, Workouts, Meals, Sperm tests, Settings
    partner/    Partner Home, Meals, Support tips
  navigation/   RootNavigator (tab bars + view switching)
```

## Brand

The palette is taken from the Quantum Ceed mark: matte black, warm gold (`#E8C76A`), deep DNA green (`#2E7D5B`).
