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
- expo-av (voice recording), expo-speech (TTS), expo-image-picker (photos)
- AsyncStorage for local persistence
- react-native-svg for the gold/green Quantum Ceed mark and progress rings

## Run locally

```bash
cd quantum-ceed
npm install
npx expo start
```

Open the Expo Go app on your phone and scan the QR code, or press `i` / `a` for the iOS / Android simulators.

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
