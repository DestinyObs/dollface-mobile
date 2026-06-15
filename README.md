# DollFace — Mobile

The **DollFace** beauty app for iOS & Android: AI shade matching, look recreation,
and tutorials — personalised to every skin tone.

**Stack:** React Native + Expo 56 · Expo Router · NativeWind · Zustand · React Hook Form + Zod.

---

## Develop

```bash
npm install
npx expo start         # press i (iOS), a (Android), or w (web preview)
```

The app runs **fully offline** against an in-app mock API (`lib/mockApi.ts`).
To point it at a real backend, set:

```bash
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

---

## Structure

```
app/         file-based routes: (auth), (onboarding), (tabs), product, premium, notifications
components/  ui, layout & motion primitives
lib/         api client, mock API, stores (auth, cart, saved, notifications, beauty profile), storage
constants/   colors, curated imagery
types/       shared domain types
```

## Features

- Auth + 13-step beauty onboarding
- AI shade match (selfie & manual) with cross-brand results
- Look recreation (step-by-step breakdown)
- Tutorials matched to skill level
- Curated shop, cart & checkout
- Saved looks/tutorials/products, routines, match & scan history
- Notifications, subscription, settings & privacy controls

All wired with on-device persistence, toasts, confirmation dialogs and animations.

## Brand

Plum `#753248` · ivory `#FAF7F5` · blush `#F5EAEF`. Playfair Display + DM Sans,
editorial-luxury aesthetic with real photography.
