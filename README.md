# DollFace 💄

**Beauty, personalised for you** — AI shade-matching, makeup-look recreation, tutorials, and a shop, all tailored to your skin tone, features, and style.

---

## 📲 Download & test (Android)

### 👉 [**Download the app (dollface.apk)**](https://github.com/DestinyObs/dollface-mobile/releases/download/v1.0.0/dollface.apk)

> **Open the link in Chrome** — not inside WhatsApp/Instagram (their built-in browsers block app downloads, which makes the link "just spin"). If it opened in an in-app browser, tap ⋮ → **Open in Chrome**, or paste the link into Chrome.

**Install steps**
1. Tap the link above on your Android phone → download `dollface.apk`.
2. Open the file → if Android warns about "unknown apps", allow the source → **Install**.
3. Open **DollFace**. It connects to the live server automatically.

> 🍏 **iPhone/iOS isn't available yet** — Apple requires a paid developer account to put apps on iPhones. Android only for now.
>
> 🔄 **The app auto-updates.** When we ship fixes, your app quietly updates itself next time you open it — you usually won't need to reinstall.

---

# Tester's Guide

Thank you for testing **DollFace**! Please read this once before you start.

## 1. First launch — a note on speed ⏳
The app talks to a live server on a **free plan that "sleeps" when idle**. So the **first action after a while can take 20–60 seconds** (the server is waking) — normal, and fast afterwards. If a screen is stuck longer than ~1 minute, that's a bug — please report it (see the bottom).

## 2. Create your account & verify email
1. **Welcome** → **Get Started** (or **Sign In** if you've registered).
2. Enter **name, email, phone, password** (8+ chars, 1 uppercase, 1 number — a strength bar guides you) → **Create Account**.
3. **Verify:** we email you a **6-digit code** (subject *"Your DollFace verification code"*).
   - ✅ **Check Inbox _and Spam/Promotions_** — if it's in spam, tap **"Not spam"**.
   - Enter the 6 digits (auto-submits). No email? **Resend code** (30s cooldown).
4. **Sign up with Google / Apple** also works (simplified test mode).

## 3. Onboarding quiz
A guided quiz (beauty goals, skin tone, undertone, skin type, concerns, brands, budget, style) with a progress bar, then real **camera/notification permission** prompts. ~1 minute. *Test: smooth progress, responsive taps, Back works, skipping works.*

## 4. Home 🏠
Greeting + **streak** (🔥 grows with daily use), **"Your matched shade"** card, quick actions (Match · Recreate · Learn · Shop), AI banner, **Trending looks**, **Continue learning**. *Test: the matched-shade card updates after you do a match.*

## 5. Match 🎨 — AI shade matching
**Selfie scan** (real front camera) or **manual entry** (type a shade you own) → your **tone + matched shades** across brands, with alternatives.
> ℹ️ The AI result is a **representative sample** for now (AI not switched on yet) — but the **camera, upload, flow, and results screens are real**. *Test: camera + permission, shutter, "choose from library", results, and that they appear in **Match History**.*

## 6. Recreate ✨ — look recreation
Upload or take a makeup-look photo → **"Analysing"** → a **step-by-step breakdown** (Base, Brows, Eyes, Cheeks, Lips) with products & techniques + version tabs (Your Version / Beginner / Budget).
> ℹ️ Sample breakdown until AI is on; the upload + flow are real. *Test: upload, camera, breakdown, version tabs, save.*

## 7. Learn 📖 — tutorials
Browse by **category**, open a **featured** tutorial, follow **step-by-step**, **save** (→ Profile → Saved Tutorials). *Test: open, save/unsave, saved list updates.*

## 8. Shop 🛍️ (Home → Shop)
Product list + search → **details + reviews** (write a review, mark helpful) → **Add to bag → Checkout** (address + shipping) → **Place order** → **My Orders** (track / cancel / reorder) → **Brands**.
> 💳 **Payment is test-mode — no real money is charged**, no real card needed. *Test: add to cart, change quantities, add address, place order, track/cancel/reorder, write a review.*

## 9. Profile 👤
- **Saved:** Looks / Tutorials / Products
- **Shopping:** My Orders, **Delivery Addresses** (add/edit/delete/default), **Payment Methods** (test cards), **Browse Brands**
- **My Routines**, **Match History**, **Scan History**
- **Settings**, **Privacy**, **Subscription** (test-mode), **Edit profile**, **Sign Out** (with confirm)

*Test: add/edit/delete an address & card (set default), create a routine, edit profile — everything should **persist** after closing & reopening the app.*

## 10. Notifications 🔔 & Search 🔍
Bell (top of Home) → notifications (mark read / all read). Search → find products.

---

## What's REAL vs. TEST-MODE

| ✅ Real | 🧪 Test-mode / sample |
|---|---|
| Account, login, **email verification** | **AI shade match & recreation** → sample results |
| Real camera + photo upload | **Payments** → no real charge (dummy) |
| Cart, checkout, orders, tracking | Social login → simplified |
| Addresses, cards, routines, reviews | Push notifications → limited |
| All data saved on the server | iOS → not available yet |

---

## 🐞 How to report issues (please be specific)

For **each** issue, tell us:
1. **Which screen** (e.g. "Match → results")
2. **Steps** you took
3. **What happened** vs **what you expected**
4. A **screenshot / screen-recording** if possible
5. Your **phone model + Android version** (Settings → About phone)

Especially looking for: **crashes**, **stuck/spinning screens** (note how long you waited), **visual glitches** (squished/cut-off/overlapping/misaligned), **buttons hard to tap**, **confusing flows**, and anything that **feels off**.

Most fixes reach you **over-the-air** — just reopen DollFace. Thank you for helping make it great! 💕

---

<details>
<summary><strong>For developers</strong></summary>

Expo / React Native app. Talks to the live API at `EXPO_PUBLIC_API_URL` (see `.env.example`). No mock layer — everything is server-backed.

```bash
npm install
cp .env.example .env        # EXPO_PUBLIC_API_URL → backend
npm run start               # Expo
npm test                    # unit tests
```

- **Builds:** `eas build -p android --profile preview` (APK, wired to live API).
- **OTA updates:** `eas update --channel preview --environment preview -m "…"` — ships JS/UI fixes to installed apps, no reinstall.
- Full setup (backend + web + keys) is in `dollface-backend/SETUP.md`.
</details>
