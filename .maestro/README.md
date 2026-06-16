# Mobile E2E (Maestro)

End-to-end UI flows for the DollFace app, run on a simulator/emulator or device.

## Prerequisites
- [Maestro](https://maestro.mobile.dev) installed (`curl -fsSL https://get.maestro.mobile.dev | bash`)
- The app running on a simulator/emulator (`npm run ios` / `npm run android`) or a dev build installed
- The **backend running and reachable** from the device at `EXPO_PUBLIC_API_URL`, seeded with the demo user (`npx prisma db seed` → demo@dollface.app / password123)

## Run
```bash
maestro test .maestro/login.yaml      # auth happy path
maestro test .maestro                  # all flows
```

Selectors target on-screen text/placeholders; if the UI copy changes, update the
matchers. These flows are real end-to-end — they authenticate against the live
backend, so a green run proves the app + API are wired correctly.
