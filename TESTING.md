# DollFace — Testing Guide

Everything runs against the **live backend** — no local setup needed for testers.

| Piece | URL |
|---|---|
| API | https://dollface-api.onrender.com (docs: `/api/docs`) |
| Web | https://dollface-web.onrender.com |
| Mobile | built via EAS (APK link below once built) |

**Note on free hosting:** the API sleeps after ~15 min idle; a GitHub Action pings it every 10 min to keep it warm. The first request after a cold start can take ~30–60s. The free Postgres expires ~30 days after creation (2026-07-16).

**Email verification on the test build:** after signup the app shows a 6-digit code screen. Because testers have no shared inbox, the live API returns the code in-app (the screen shows "Dev: your code is …"). Enter it to continue. (When a Resend API key is added, real emails send instead.)

---

## Android — install the APK
1. Download the APK link (from the EAS build).
2. On the phone: Settings → allow "Install unknown apps" for your browser/Files.
3. Open the APK → Install → open DollFace. It talks to the live API out of the box.

## iOS — testing options (no Apple Developer account needed for #1)
1. **Expo Go (fastest):** install **Expo Go** from the App Store, then open the project link from `eas build`/`expo start --tunnel`, or scan the QR. Runs the real app against the live API.
2. **TestFlight (needs Apple Developer Program, $99/yr):** `eas build -p ios --profile preview` then `eas submit -p ios` → invite testers via TestFlight. Best for a polished install.
3. **Simulator build (on a Mac):** `eas build -p ios --profile preview` with a simulator profile → drag the `.app` into the iOS Simulator.

---

## Building the APK (one-time, needs an Expo account — free)
```bash
cd dollface-mobile
eas login                       # or: export EXPO_TOKEN=<token from expo.dev/settings/access-tokens>
eas init                        # creates the EAS project, writes projectId to app.json
eas build -p android --profile preview   # cloud build → prints a shareable APK URL
```
The `preview` profile is already configured to output an installable **APK** wired to the live API.
