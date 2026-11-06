# Telegram Mini Apps: what the platform is, and what it would cost us to live inside it

**Status:** platform notes and migration scaffold. **Date:** 2026-11-06. **Applies to:** `apps/web` (the prototype), `apps/api` (verification scaffold).
**Companion code:** `apps/web/src/platform/telegram/` (adapter, bridge, mock, probe) and `apps/api/src/platform/telegram/initdata.mjs` (server-side validation).

> **How this was researched, and its limits.** `core.telegram.org` answered this environment with HTTP 403, so the platform documentation was read from the Wayback Machine capture of <https://core.telegram.org/bots/webapps> (capture `20260101182232`, 17 chunks; the capture list runs to 27 October 2026). Quotations below are from that capture, not from the live page. Nothing here was tested against a real Telegram client: there is no bot token, no test-server bot, and no iOS or Android device in this environment. **Every statement about runtime behaviour is therefore documentation-derived, not observed** — and is marked as such where it matters.

---

## 1. What a Mini App is

A Mini App is a **web page opened inside Telegram's own web view**, at a URL you control, with a JavaScript bridge (`telegram-web-app.js`) that gives the page: the user's theme, the viewport geometry, a few native controls (back button, bottom buttons, popups, haptics), storage APIs, and — the part that matters legally — **`initData`: a signed statement from Telegram about who opened it**.

It is not a separate runtime. Our existing Vite build is already the candidate artifact; what is missing is the bridge, the safe-area geometry, the theme mapping, and an authentication path for `initData`. That is why the plan in §9 is an **adapter, not a fork**: the web app must keep working in a plain browser, because that is where we review it.

**(Fact, documentation-derived)** Telegram lists seven launch surfaces: the main Mini App from the bot's profile, keyboard button, inline button, menu button, inline mode, direct link (`t.me/botname/appname`), and attachment menu. Four of them pass a full `initData`; **keyboard-button and inline-mode launches pass none** — the object is empty. A build that assumes `initData.user` always exists breaks in two of the seven.

| Launch mode | `initData` contents | Notes that matter to us |
| --- | --- | --- |
| Keyboard button (`web_app`) | **empty** | Can `sendData()` a payload (≤4096 bytes) back to the bot as a service message |
| Inline button (`web_app`) | user + `query_id` | Bot may answer with `answerWebAppQuery` |
| Menu button | as inline button | Configured in BotFather or `setChatMenuButton` |
| Main Mini App (profile) | as inline button | `https://t.me/<bot>?startapp[=param]`; `mode=compact` for half-height |
| Direct link | as inline button + `chat_type`, `chat_instance` | Full-screen by default since Bot API 7.6 |
| Attachment menu | user + chat/receiver + `query_id` | Only for advertisers, except on the test server |
| Inline mode | **empty** | No access to the chat |

**(Interpretation)** For this project only two are plausible: the **main Mini App** (one tap from the bot profile, deep-linkable) and the **menu button** (always present in the chat). Both give a stable launch URL and a full `initData`. The other five are features we would be inventing a use for.

---

## 2. Bootstrap, and the four methods that matter

```html
<script src="https://telegram.org/js/telegram-web-app.js?59"></script>
```

Loaded in `<head>` before any other script, this defines `window.Telegram.WebApp`. Outside Telegram it still defines the object, with `initData: ""` and `platform: "unknown"` — which is exactly how the adapter in this repository distinguishes "in Telegram" from "in a browser" without sniffing the user agent.

| Method / field | Why we would call it |
| --- | --- |
| `ready()` | Hides Telegram's loading placeholder. Call it when the shell has painted, not before — otherwise the placeholder vanishes onto a blank frame. |
| `expand()` | Asks for maximum height. Without it the app opens at half height on some launch modes. |
| `close()` | Closes the Mini App. Ours would be used only by an explicit control. |
| `isVersionAtLeast("8.0")` | The only safe feature test: `Telegram.WebApp` is a bag of objects that appear across Bot API versions, and a missing method is a crash, not a fallback. |

**(Fact)** `viewportHeight` updates in real time but *not smoothly*; the documentation explicitly says it must not be used to pin elements to the bottom, and points to `viewportStableHeight` for that. This is the kind of detail that turns a "it looks fine on my phone" build into a jumping layout on someone else's.

---

## 3. `initData`: the only part that is a security boundary

**(Fact)** `initData` is a query string. Its fields, per the documentation:

| Field | Meaning |
| --- | --- |
| `query_id` | Session identifier for `answerWebAppQuery` |
| `user` | JSON: `id`, `first_name`, `last_name?`, `username?`, `language_code?`, `is_premium?`, `photo_url?` |
| `receiver`, `chat` | Present only for attachment-menu launches |
| `chat_type`, `chat_instance` | Present only for direct-link launches |
| `start_param` | The `startapp`/`startattach` value, also in GET `tgWebAppStartParam` |
| `auth_date` | Unix timestamp of when the Mini App was opened |
| `hash` | HMAC-SHA-256 over the data-check-string — the thing to verify |
| `signature` | Ed25519 signature, for third-party verification without the bot token |

**The rule the documentation states twice:** `initDataUnsafe` must not be trusted, and `initData` must be validated on the server before use.

### 3.1 Server-side validation (we hold the bot token)

1. Parse the query string; take `hash` out of it.
2. Build **data-check-string**: every remaining field as `key=value`, sorted alphabetically by key, joined with `\n`.
3. `secret_key = HMAC_SHA256(key = "WebAppData", message = bot_token)`.
4. `expected = hex(HMAC_SHA256(key = secret_key, message = data_check_string))`.
5. Compare with `hash` in constant time; additionally reject stale `auth_date`.

Steps 3–4 are the documentation's own description ("the HMAC-SHA-256 signature of the bot's token with the constant string `WebAppData` used as a key"). Note the direction, because it is the single most-copied error in third-party implementations: **`WebAppData` is the key, the bot token is the message.**

### 3.2 Third-party validation (no bot token)

**(Fact)** Bot API 8.0 added a `signature` field so that a third party — a Mini App builder, an analytics vendor, a widget — can validate data without the token:

- data-check-string = `"<bot_id>:WebAppData\n"` + sorted `key=value` pairs, **excluding `hash` and `signature`**;
- verify the base64url Ed25519 `signature` against the public key Telegram publishes:
  - test: `40055058a4ee38156a06562e52eece92a771bcd8346a8c4615cb7376eddf72ec`
  - production: `e7bf03a2fa4602af4580703d88dda5bb59f32ed8b02a56c187fe7d34caed242d`

**(Interpretation)** Anything that receives our users' `initData` — a crash reporter with session replay, a Mini App "analytics" SDK, an A/B tool — is a third party we would be handing a signed statement about a person. The scaffold therefore has **no third-party script of any kind**, and `initData` never leaves our own origin.

### 3.3 What we will do with it, and what we will not

| | Decision | Reason |
| --- | --- | --- |
| Where validation happens | On our server, never in the browser | A client-side check proves nothing: the attacker controls the client |
| Transport | Header `X-Telegram-Init-Data`, not a query parameter | Query strings land in logs, referrers and browser history |
| Storage of `user.id` | **Not stored** | This project's own rules forbid linking a person to a dossier; a Telegram id is a stronger identifier than a name |
| Use of `language_code` | One-time default for the interface language, then forgotten | Legitimate and stateless |
| Use of `start_param` | Route hint only, re-validated against known routes | Otherwise a deep link becomes an open redirect |
| Token in this repository | Never | The endpoint returns `501` unless `CEP_TELEGRAM_BOT_TOKEN` is set in the environment |

**(Fact)** `auth_date` is documented as the freshness check; the scaffold rejects anything older than 24 hours by default (`maxAgeSeconds`), because a replay of a day-old signed payload is otherwise valid forever.

---

## 4. Presentation: theme, geometry, chrome

### 4.1 Theme

`colorScheme` is `"light"` or `"dark"` and is also exposed as `var(--tg-color-scheme)`. `themeParams` carries colours as `#RRGGBB`, each with a matching CSS variable:

| Field | CSS variable | Useful to us |
| --- | --- | --- |
| `bg_color` | `--tg-theme-bg-color` | page background |
| `secondary_bg_color` | `--tg-theme-secondary-bg-color` | cards, rails |
| `text_color` | `--tg-theme-text-color` | body ink |
| `hint_color` | `--tg-theme-hint-color` | secondary ink |
| `link_color` | `--tg-theme-link-color` | links |
| `button_color`, `button_text_color` | `--tg-theme-button-color`, `--tg-theme-button-text-color` | primary buttons |
| `header_bg_color` | `--tg-theme-header-bg-color` | header |
| `bottom_bar_bg_color` | `--tg-theme-bottom-bar-bg-color` | bottom bar (Bot API 7.10) |
| `section_bg_color`, `section_header_text_color`, `section_separator_color` | `--tg-theme-section-*` | sectioned lists |
| `accent_text_color`, `subtitle_text_color`, `destructive_text_color` | `--tg-theme-*` | accents, subtitles, destructive actions |

**Our constraint is the reverse of the usual one.** This app's palette is a designed, contrast-checked pair of themes (`data-theme="light|dark"` with axe-verified ratios), not a mirror of the client's. Copying Telegram's colours into every component would destroy the contrast work and produce a third, untested theme. The scaffold therefore does the narrow, defensible thing:

- **`colorScheme` chooses which of our two themes is used** (only when the reader has not stored a preference);
- **`header_bg_color` / `bottom_bar_bg_color` are set from *our* theme**, so Telegram's chrome matches the page instead of the page chasing Telegram's;
- no component ever reads `--tg-theme-*`.

**(Interpretation)** That is a deliberate refusal to be "native". The alternative — full theme adoption — is only honest if we then run a contrast audit against every Telegram theme, including user-made ones. We are not going to.

### 4.2 Geometry

`--tg-viewport-height`, `--tg-viewport-stable-height`, and the two inset objects:

- `safeAreaInset` → `--tg-safe-area-inset-{top,bottom,left,right}` — system bars and notches;
- `contentSafeAreaInset` → `--tg-content-safe-area-inset-*` — Telegram's own controls drawn over the page, which is the one that bites in fullscreen.

**(Fact)** Bot API 8.0 added `isFullscreen`, `requestFullscreen()`, `exitFullscreen()`, `isActive`, and the `activated`/`deactivated` events; Android additionally exposes device performance class in the User-Agent, which the documentation suggests using to reduce animation on weak hardware.

**What this means for the layout we have:** the app is built for 320–1440 px with a sticky header whose height is measured into a CSS variable, and a bottom key dock on narrow screens. In a Mini App the client draws its **own** header (back button, title, close) and its **own** bottom bar (main/secondary buttons) over that area. So:

1. the dock must offset by `contentSafeAreaInset.bottom` or it sits under Telegram's bar;
2. the sticky header's `top` must account for `contentSafeAreaInset.top`;
3. `viewportStableHeight`, not `viewportHeight`, drives any `100vh`-style rule — the existing stylesheet should keep using `dvh` with a `--tg-viewport-stable-height` fallback.

### 4.3 Chrome

| Object | What it gives | Our intended use |
| --- | --- | --- |
| `BackButton` | `show()`, `hide()`, `onClick()` | Mirrors the browser's back: visible on any route that is not the hub, calls `history.back()` |
| `MainButton` / `SecondaryButton` (both `BottomButton`) | Native action buttons with progress state | **Not used at first**: every action on this prototype is read-only or navigational, and a native button that does nothing is worse than none |
| `SettingsButton` | Context-menu entry | Ignored |
| `HapticFeedback` | Impact/notification/selection | Only as an *optional* confirmation on a copy action, never as the sole feedback for anything |
| `enableClosingConfirmation()` | Confirmation on close | Used **only** while a form has unsaved input; otherwise it trains people to dismiss it |
| `showPopup`, `showAlert`, `showConfirm` | Native dialogs | Never for content that must also be readable in a browser |

---

## 5. Storage, and why most of it is a trap for us

| API | Scope | Our rule |
| --- | --- | --- |
| `localStorage` | this browser, this origin | Already used for language and theme; harmless |
| `CloudStorage` | per user, per bot, across devices | **Preferences only** (language, theme). Never a claim, never a dossier, never an identifier |
| `DeviceStorage` | this device | Same rule |
| `SecureStorage` | device secure enclave | Nothing in this prototype needs it; using it would imply we hold something worth protecting |

**(Interpretation)** Every one of these is a place where a list of participants could accumulate by accident. The rule "preferences only, no identifiers" is enforceable in review in a way that "be careful" is not.

---

## 6. Events worth binding

`themeChanged`, `viewportChanged` (with `isStateStable`), `safeAreaChanged`, `contentSafeAreaChanged`, `backButtonClicked`, `activated`, `deactivated`.

Everything else in the documented list — `invoiceClosed`, `qrTextReceived`, `writeAccessRequested`, `contactRequested`, biometric events — belongs to features we are not building, and binding them early would only invite the question of why.

---

## 7. Debugging and the test environment

**(Fact, documentation-derived)** Telegram documents a test server (a separate bot token created by a BotFather account on the test server) and a debug mode; the attachment-menu feature is available to all bots there. Android exposes OS/app/SDK versions and device model/performance class to the Mini App.

**We cannot use any of it here**: no token, no test-server bot, no device. Hence the local mock in §8 — a fabricated `Telegram.WebApp` object — which is the only way to exercise the bridge without a client.

---

## 8. The scaffold in this repository

| File | What it is |
| --- | --- |
| `apps/web/src/platform/telegram/context.mjs` | Pure: normalises a `Telegram.WebApp`-shaped object into `{ active, platform, version, colorScheme, viewport, insets, startParam, hasInitData, capabilities }`. No React, no DOM writes. |
| `apps/web/src/platform/telegram/bridge.mjs` | Side effects: `ready()`, `expand()`, CSS variables, theme/geometry event subscriptions, back-button binding. Returns a teardown. |
| `apps/web/src/platform/telegram/mock.mjs` | A fabricated `WebApp` for local work (`?tg-mock=1`), so the adapter and the layout can be exercised in a plain browser. |
| `apps/web/src/platform/telegram/Probe.jsx` | A fixed overlay, shown only when the adapter is active or mocked, displaying what the bridge sees. The prototype: it makes the invisible environment visible. |
| `apps/api/src/platform/telegram/initdata.mjs` | Pure: parse, HMAC validation, Ed25519 third-party validation, freshness. |
| `apps/api` route `GET /api/v1/telegram/session` | Validates `X-Telegram-Init-Data`; `501` without a configured token, `400` for a missing header or a stale payload, `401` for a bad signature, `200` with language and *no* identifier. |
| `apps/api` route `GET /api/v1/telegram/platform` | Static: the seven launch modes, both algorithms and their parameters, and the posture (no identifier storage, no third-party script, no token in the repository). |

**What the mock deliberately cannot do:** fake a valid signature. The mock sets `initData` to a string that the server rejects, and the probe says so — otherwise the prototype would teach us that authentication works when it has never once run.

---

## 9. Migration plan, in five steps, each with an acceptance test

The web app stays the primary target. Each step is useful in a browser as well, or it does not happen.

1. **Adapter and mock** — *this change.* Acceptance: `?tg-mock=1` in a plain browser produces the same context the bridge would produce in a client, and the app renders unchanged when no bridge is present.
2. **Geometry** — bind the insets and stable height to the CSS variables, offset the dock and the sticky header. Acceptance: layout sweep at 320 px with simulated insets, no target under 24 px, no content under the client's bars.
3. **Theme parity** — `colorScheme` selects our theme when nothing is stored; header/bottom bar set from our palette. Acceptance: both themes in the mock, no `--tg-theme-*` reference anywhere in `src/`.
4. **Session** — `GET /api/v1/telegram/session` with a real test-server token; the app reads `language_code` and nothing else. Acceptance: a tampered `initData` returns 401, a stale one 400, a missing header 400, and a good one 200 with no identifier echoed back.
5. **Deploy and watch** — BotFather main Mini App pointing at the deployment; nothing else changed. Acceptance: launched from a profile button on a phone, with the probe reading `active: true`.

---

## 10. Risks this platform introduces for *this* project

These are not generic mobile-web risks; they are specific to a civic project whose value is not accumulating a list of people.

1. **A Telegram id is a person.** `initData.user.id` is a stable identifier tied to a phone number. The scaffold refuses to store it, and the review rule is that any future endpoint touching it needs an explicit decision recorded in the task file — the same rule the dossier modules already carry.
2. **A participation list becomes cheap.** A bot can count its users; a Mini App can attach an id to every interaction. Track 0's design note already treats such a list as the most dangerous artefact in the system. The bridge therefore reports nothing to our API — no session call is made at all in this change.
3. **Client-side capture.** Anything the Mini App renders is visible to whoever holds the device, and history in a chat context. Nothing that is not public belongs in it.
4. **Third-party scripts are a validation leak.** See §3.2: any SDK we add can verify our users' signed data. We add none.
5. **Telegram is blocked in Iran** (since 2018; access is via circumvention). The Mini App is therefore a diaspora-and-VPN channel, and no reach claim should be made for it — the red team already says this, and it stays true inside the platform.
6. **Monetisation pressure.** Telegram Stars, paid subscriptions and gifts are documented and available. Every one of them requires a payment surface and an identity; Track 0 forbids both.
7. **Platform dependency at the moment of truth.** If the Mini App is the only door and Telegram restricts the bot — or a government pressures the platform — the door closes. The plain web deployment must remain first-class, which is why the adapter is additive.

---

## 11. What could not be verified

- Any runtime behaviour on a real client (iOS, Android, desktop, web): no device, no token.
- The live `core.telegram.org` text: read through a Wayback capture because the live page returned 403.
- Whether the current Bot API version in the field is 9.1 (the documentation's newest entries reference Bot API 9.1 features) or newer; the capture is dated 1 January 2026 and may predate or postdate the current client fleet.
- Third-party Ed25519 validation against a signature actually produced by Telegram: the construction is implemented and tested with a locally generated key pair, which proves the data-check-string, not Telegram's signature.
- Whether `contentSafeAreaInset` behaves identically in browser-embedded Telegram (web.telegram.org), where the Mini App runs in an iframe.

**Sources.** Telegram, *Mini Apps* — <https://core.telegram.org/bots/webapps> (Wayback capture `20260101182232`), read 2026-11-06. Telegram Bot API changelog references within that page: Bot API 6.1–9.1.
