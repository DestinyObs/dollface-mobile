# DollFace — Tester's Guide 💄

Thanks for testing DollFace! This guide walks you through **every screen, what it does, and what we want you to try**. Please report anything that looks wrong, feels slow, or breaks.

DollFace is a **beauty app**: AI shade-matching, look recreation, tutorials, and a shop — all personalised to you.

---

## 0. Before you start

- **Android:** download & install the APK link we shared. If prompted, allow "Install unknown apps" for your browser/Files, then open **DollFace**.
- **iOS:** not available for testing yet (Apple requires a paid developer account to put apps on iPhones). Android only for now.
- **First launch can be slow (~30–60s)** if the server was asleep — that's normal on free hosting; it wakes up and is fast after.
- Everything is **live and real** — your account, data, cart, and orders are saved on the server.

---

## 1. Sign up & email verification

1. **Welcome screen** → tap **Get Started** (or **Sign In** if you've registered before).
2. **Create account:** enter your **name, email, phone number, password** (password needs 8+ chars, an uppercase letter, and a number — you'll see a strength bar).
3. Tap **Create Account**.
4. **Verify your email:** we email you a **6-digit code** (subject: *"Your DollFace verification code"*). 
   - **Check your inbox _and spam_** — if it's in spam, mark "Not spam".
   - Type the 6 digits — the screen auto-submits when complete.
   - Didn't get it? Tap **Resend code** (30-second cooldown).
5. You can also try **Sign up with Google / Apple** (these work in a simplified test mode).

**Test this:** wrong code shows an error + shake; correct code moves you forward; resend works; the email actually arrives.

---

## 2. Onboarding (the personalisation quiz)

After verifying, you'll go through a short, guided quiz so the app can tailor everything:

- **Welcome intro** ("Let's make it yours") → tap **Personalise my beauty** (or *I'll do this later* to skip).
- Then a series of quick questions with a **progress bar** and encouragement: **beauty goals, skill level, skin tone, undertone, skin type, face concerns, preferred brands, budget, style**.
- Tap options (they buzz/highlight when selected), then **Continue**.
- A few **permission screens** (camera, notifications) — these trigger the **real Android permission popups**.

**Test this:** the progress bar fills smoothly; selections feel responsive; back button works; you can complete it in about a minute.

---

## 3. Home tab 🏠

Your personalised dashboard:
- **Greeting + streak** (🔥 counts your active days — it grows as you use the app).
- **"Your matched shade"** card → tap to run a shade match.
- **Quick actions:** Match · Recreate · Learn · Shop.
- **AI Shade Match** banner → **Start your match**.
- **Trending looks** and **Continue learning** (your in-progress tutorials).

**Test this:** the streak/matched-shade update *after* you do a match (come back and check). Tap each quick action. Tap a trending look.

---

## 4. Match tab 🎨 (AI shade matching)

Two ways to find your foundation/concealer shade:
- **Selfie scan:** opens the **real front camera**. Position your face, tap the shutter (or pick a photo from your library via the image icon). It analyses and shows your **tone + matched shades across brands** with alternatives.
- **Manual entry:** type a shade you already own (e.g. "NC42") → get cross-brand equivalents.

> **Note:** AI analysis currently returns a **representative sample result** (the live AI key isn't enabled yet), so the shades shown are illustrative, not a real read of your photo. The **flow, camera, upload, and results UI are all real** — that's what to test.

**Test this:** camera opens & permission prompt appears; shutter captures; "choose from library" works; the results screen renders; manual entry returns results; results appear in **Match History** (Profile).

---

## 5. Recreate tab ✨ (look recreation)

- Tap **Upload Inspiration** → **choose a photo** or **take one** (real permissions).
- It runs an **"Analysing your look"** animation, then shows a **step-by-step breakdown** (Base, Brows, Eyes, Cheeks, Lips) with products and techniques, plus version tabs (Your Version / Beginner / Budget).

> Same note as Match — the breakdown is a **representative sample** until the AI key is enabled; the upload + flow + UI are real.

**Test this:** upload and camera both work; the analysing screen leads to a real breakdown; you can switch version tabs; save the look.

---

## 6. Learn tab 📖 (tutorials)

- Browse tutorials by **category**, see a **featured tutorial**, open one for **step-by-step** content.
- **Save** tutorials (they appear in Profile → Saved Tutorials).

**Test this:** open a tutorial; save/unsave; the saved list reflects it.

---

## 7. Shop 🛍️ (Home → Shop)

- **Product list** with categories & search; tap a product for **details + reviews**.
- **Write a review** (star rating + text), mark reviews **helpful**.
- **Add to bag** → **Cart** → **Checkout** (pick/add a delivery **address**, choose **shipping**) → **Place order**.
- **Orders** (Profile → My Orders): see status, **track**, **cancel**, **reorder**.
- **Brands:** browse brands → brand page with its products.

> **Payment is in test mode** — placing an order **does not charge any real money** and needs no real card. It completes with a dummy payment so you can test the full flow.

**Test this:** add to cart, change quantities, add an address, place an order, open the order and try track/cancel/reorder, write a product review.

---

## 8. Profile / You tab 👤

Your account hub:
- **Saved** Looks / Tutorials / Products.
- **Shopping:** My Orders, **Delivery Addresses** (add/edit/delete/set default), **Payment Methods** (add/remove test cards), **Browse Brands**.
- **My Routines** (build a skincare/makeup routine + reminders), **Match History**, **Scan History**.
- **Settings**, **Privacy**, **Subscription** (premium plans — test mode), **Edit profile**.
- **Sign out**.

**Test this:** add/edit/delete an address & payment method (set default); create a routine; edit your profile; everything should persist after closing and reopening the app.

---

## 9. Notifications 🔔 & Search 🔍

- **Bell icon** (top of Home) → notifications list; mark read / mark all read.
- **Search** → type to find products; tap a result.

---

## What's real vs. test-mode (so you know what you're seeing)

| Real | Test-mode / sample |
|---|---|
| Your account, login, **email verification** | **AI shade match & recreation** = sample results (illustrative) |
| Camera + photo upload | **Payments** = no real charge (dummy) |
| Cart, checkout, orders, tracking | Social login = simplified |
| Addresses, payment methods, routines, reviews | Push notifications = limited |
| All data saved to the server | iOS = not available yet |

---

## What to report (please be specific 🙏)

For each issue, tell us:
1. **Which screen** (e.g. "Match → results").
2. **What you did** (steps).
3. **What happened** vs **what you expected**.
4. A **screenshot** if you can.

Especially looking for: **visual glitches** (squished/cut-off/misaligned elements), **crashes**, **slow or stuck screens**, **confusing flows**, and **anything that feels off**. The app **updates over-the-air**, so fixes will reach you automatically — just reopen the app.

Thank you! 💕
