# DollFace — Tester's Guide 💄

Welcome, and thank you for testing **DollFace**! This is the complete guide to the app — how to install it, every screen and what it does, what's real vs. still in test-mode, and how to report what you find. Please read it once before you start.

DollFace is a **beauty app**: AI shade-matching, makeup-look recreation, tutorials, and a shop — all personalised to you.

---

## 1. Install the app (Android)

> **iPhone/iOS isn't available for testing yet** — Apple requires a paid developer account to put apps on iPhones. **Android only for now.**

1. On your **Android phone**, open this link **in Chrome** (not inside WhatsApp/Instagram — their built-in browsers block app downloads):
   **https://github.com/DestinyObs/dollface-mobile/releases/download/v1.0.0/dollface.apk**
   *(Tip: if it opened in WhatsApp's browser and just spins, tap ⋮ → "Open in Chrome", or copy the link into Chrome.)*
2. When the download finishes, tap the file. Android may warn about "unknown apps" — tap **Settings → allow this source**, then **Install**.
3. Open **DollFace**.

**The app auto-updates.** When we fix things, your app quietly updates itself the next time you open it — you usually **won't** need to reinstall. We'll tell you on the rare occasion you do.

---

## 2. First launch — a note on speed ⏳

The app talks to a live server hosted on a **free plan that "sleeps" when idle**. So:
- The **very first action** after the app's been unused for a while can take **20–60 seconds** (the server is waking up). This is normal — it's fast after that.
- If a screen seems stuck, give it up to a minute, or pull-to-refresh / go back and retry. If it's still stuck after that, **that's a bug — please report it** (see §11).

---

## 3. Create your account & verify your email

1. **Welcome screen** → **Get Started** (or **Sign In** if you already have an account).
2. **Create account:** enter **name, email, phone number, password**.
   - Password needs **8+ characters, one uppercase letter, one number** — a strength bar shows how you're doing.
3. Tap **Create Account**.
4. **Verify your email:** we send a **6-digit code** to your email (subject: *"Your DollFace verification code"*).
   - ✅ **Check your inbox — and your Spam/Promotions folder.** If it's there, tap **"Not spam"** (this helps everyone's emails land properly).
   - Enter the 6 digits — it submits automatically.
   - No email after a minute? Tap **Resend code** (there's a 30-second cooldown).
5. You can also try **Sign up with Google / Apple** (these work in a simplified test mode).

**Please test:** the email actually arrives; a wrong code shows an error; the correct code moves you on; resend works.

---

## 4. Onboarding (the personalisation quiz)

A short, guided quiz so the app can tailor everything to you:
- **Welcome intro** ("Let's make it yours") → **Personalise my beauty** (or *I'll do this later* to skip).
- Quick questions with a **progress bar** + encouragement: **beauty goals, skill level, skin tone, undertone, skin type, face concerns, preferred brands, budget, style**. Tap your choices, then **Continue**.
- A couple of **permission screens** (camera, notifications) — these trigger the **real Android permission pop-ups**.

**Please test:** progress bar fills smoothly; taps feel responsive; the Back button works; you can finish in about a minute; skipping works.

---

## 5. Home tab 🏠

Your personalised dashboard:
- **Greeting + streak** (🔥 grows as you use the app on different days).
- **"Your matched shade"** card → tap to run a shade match.
- **Quick actions:** Match · Recreate · Learn · Shop.
- **AI Shade Match** banner → **Start your match**.
- **Trending looks** and **Continue learning** (tutorials you've started).

**Please test:** after doing a shade match, come back — the matched-shade card should update. Tap each quick action and a trending look.

---

## 6. Match tab 🎨 — AI shade matching

Find your foundation/concealer shade two ways:
- **Selfie scan** → opens the **real front camera**. Frame your face, tap the shutter (or use the image icon to pick a library photo). It analyses and shows your **tone + matched shades** across brands, with alternatives.
- **Manual entry** → type a shade you own (e.g. "NC42") → get cross-brand equivalents.

> ℹ️ **Test-mode note:** the AI analysis currently returns a **representative sample** result (the live AI isn't switched on yet), so the shades shown are illustrative — not a real read of your photo. The **camera, upload, flow, and results screens are all real** — that's what to test.

**Please test:** camera opens + permission prompt appears; shutter captures; "choose from library" works; results screen renders; manual entry returns results; results appear later in **Match History** (Profile).

---

## 7. Recreate tab ✨ — look recreation

- **Upload Inspiration** → **choose a photo** or **take one** (real permissions).
- An **"Analysing your look"** animation, then a **step-by-step breakdown** (Base, Brows, Eyes, Cheeks, Lips) with products & techniques, plus version tabs (Your Version / Beginner / Budget).

> ℹ️ Same as Match — the breakdown is a **representative sample** until AI is switched on; the upload + flow + UI are real.

**Please test:** upload and camera both work; the analysing screen leads to a breakdown; version tabs switch; you can save the look.

---

## 8. Learn tab 📖 — tutorials

- Browse tutorials by **category**, see a **featured** one, open any for **step-by-step** content.
- **Save** tutorials → they appear in **Profile → Saved Tutorials**.

**Please test:** open a tutorial; save/unsave; the saved list updates.

---

## 9. Shop 🛍️ (from Home → Shop)

- **Product list** with categories & search; tap a product for **details + reviews**.
- **Write a review** (stars + text); mark reviews **helpful**.
- **Add to bag** → **Cart** → **Checkout** (pick/add a **delivery address**, choose **shipping**) → **Place order**.
- **My Orders** (Profile): status, **track**, **cancel**, **reorder**.
- **Brands** → brand pages with their products.

> 💳 **Payment is in test-mode — no real money is charged** and you don't need a real card. Orders complete with a dummy payment so you can test the whole flow end-to-end.

**Please test:** add to cart, change quantities, add an address, place an order, open it and try track/cancel/reorder, write a product review.

---

## 10. Profile / You tab 👤

Your account hub:
- **Saved:** Looks / Tutorials / Products.
- **Shopping:** My Orders, **Delivery Addresses** (add/edit/delete/set-default), **Payment Methods** (add/remove test cards), **Browse Brands**.
- **My Routines** (build a routine + reminders), **Match History**, **Scan History**.
- **Settings**, **Privacy**, **Subscription** (premium plans — test-mode), **Edit profile**.
- **Sign Out** (bottom — with a confirmation pop-up).

**Please test:** add/edit/delete an address & a payment method (set default); create a routine; edit your profile; sign out and back in. Everything should **persist** after you close and reopen the app.

---

## 11. Notifications 🔔 & Search 🔍

- **Bell icon** (top of Home) → notifications; mark read / mark all read.
- **Search** → type to find products; tap a result.

---

## What's REAL vs. TEST-MODE

| ✅ Real | 🧪 Test-mode / sample |
|---|---|
| Account, login, **email verification** | **AI shade match & recreation** → sample results |
| Real camera + photo upload | **Payments** → no real charge (dummy) |
| Cart, checkout, orders, tracking | Social login → simplified |
| Addresses, payment methods, routines, reviews | Push notifications → limited |
| All your data saved on the server | iOS → not available yet |

---

## How to report issues (please be specific 🙏)

For **each** issue, tell us:
1. **Which screen** (e.g. "Match → results").
2. **What you did** — the exact steps.
3. **What happened** vs **what you expected**.
4. A **screenshot or screen-recording** if you can.
5. Your **phone model + Android version** (Settings → About phone) — helps a lot for visual bugs.

We especially want to hear about:
- **Crashes** or the app closing unexpectedly.
- **Stuck/spinning screens** (note how long you waited).
- **Visual glitches** — anything squished, cut-off, overlapping, or misaligned.
- **Buttons that are hard to tap** or don't respond.
- **Confusing flows** — anywhere you weren't sure what to do.
- Anything that just **feels off**.

Because the app **updates over-the-air**, most fixes will reach you automatically — just reopen DollFace. Thank you so much for helping make it great! 💕
