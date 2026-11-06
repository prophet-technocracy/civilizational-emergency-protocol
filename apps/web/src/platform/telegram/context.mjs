// The Mini App environment, normalised.
//
// Telegram's bridge (`window.Telegram.WebApp`) is a large mutable object whose
// fields appear and disappear across Bot API versions, and which exists — half
// populated — in a plain browser as soon as the official script is loaded. This
// module turns it into one small, frozen value that the rest of the app can read
// without feature-testing anything (#69).
//
// Pure on purpose: no DOM, no React, no document. Everything it decides is a
// function of the object it is handed, which is what makes the adapter testable
// in Node and predictable in the mock.
//
// The distinction that carries all the weight:
//
//   present   window.Telegram.WebApp exists (the script loaded)
//   active    it exists AND we are really inside a client
//
// Outside Telegram the object has `platform: "unknown"` and an empty
// `initData`. Treating "present" as "active" is how a browser build starts
// hiding its own chrome for a back button that will never arrive.

/** Bot API version at which each capability arrives. Used for honest feature tests. */
export const CAPABILITY_VERSIONS = Object.freeze({
  backButton: "6.1",
  closingConfirmation: "6.2",
  popups: "6.2",
  qr: "6.4",
  cloudStorage: "6.9",
  haptics: "6.1",
  settingsButton: "7.0",
  biometrics: "7.2",
  verticalSwipes: "7.7",
  fullscreen: "8.0",
  homeScreen: "8.0",
  deviceMotion: "8.0",
  secureStorage: "9.0",
  keyboardControl: "9.1"
});

const isObject = (value) => Boolean(value) && typeof value === "object";

/**
 * Parse "8.0" style versions into comparable numbers. A missing or malformed
 * version is treated as "older than everything", never as "newest".
 */
export function parseVersion(value) {
  const match = String(value ?? "").match(/^(\d+)(?:\.(\d+))?/);
  if (!match) return null;
  return { major: Number(match[1]), minor: Number(match[2] ?? 0) };
}

export function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  if (!a || !b) return a ? 1 : b ? -1 : 0;
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  return 0;
}

/** True when the bridge is present and we are actually inside a client. */
export function isActiveClient(webApp) {
  if (!isObject(webApp)) return false;
  // A real launch always has an initData string — except keyboard-button and
  // inline-mode launches, which the platform documents as empty. Those two are
  // still real launches, and they are the only reason `platform` is consulted.
  if (typeof webApp.initData === "string" && webApp.initData.length > 0) return true;
  const platform = String(webApp.platform ?? "").toLowerCase();
  return platform !== "" && platform !== "unknown";
}

function insetOf(source) {
  const value = isObject(source) ? source : {};
  const read = (key) => (Number.isFinite(value[key]) ? Number(value[key]) : 0);
  return Object.freeze({ top: read("top"), bottom: read("bottom"), left: read("left"), right: read("right") });
}

/**
 * Normalise the bridge into one value.
 *
 * @param {object|null} webApp `window.Telegram?.WebApp`
 * @param {object} [options]
 * @param {boolean} [options.mocked] true when a fabricated bridge is in use
 * @returns {Readonly<object>}
 */
export function readTelegramContext(webApp, { mocked = false } = {}) {
  const present = isObject(webApp);
  const active = isActiveClient(webApp);
  const platform = present ? String(webApp.platform ?? "unknown") : "none";
  const version = present ? String(webApp.version ?? "") : "";
  const versionLooksReal = compareVersions(version, "6.0") >= 0;

  const atLeast = (minimum) =>
    present && versionLooksReal ? compareVersions(version, minimum) >= 0 : false;

  const capabilities = Object.fromEntries(
    Object.entries(CAPABILITY_VERSIONS).map(([name, minimum]) => [
      name,
      atLeast(minimum) && hasObject(webApp, name)
    ])
  );

  const colorScheme = present && webApp.colorScheme === "dark" ? "dark" : "light";

  return Object.freeze({
    present,
    active,
    mocked: Boolean(mocked),
    platform,
    version,
    isVersionAtLeast: atLeast,
    colorScheme,
    theme: Object.freeze({
      // The client's own chrome colours. Read-only: this app sets them from its
      // own palette rather than adopting the client's (see the platform note).
      headerColor: present ? webApp.headerColor ?? null : null,
      backgroundColor: present ? webApp.backgroundColor ?? null : null,
      bottomBarColor: present ? webApp.bottomBarColor ?? null : null,
      params: Object.freeze(present && isObject(webApp.themeParams) ? { ...webApp.themeParams } : {})
    }),
    viewport: Object.freeze({
      height: numberOr(webApp?.viewportHeight, 0),
      stableHeight: numberOr(webApp?.viewportStableHeight, 0),
      isExpanded: Boolean(present && webApp.isExpanded),
      isFullscreen: Boolean(present && webApp.isFullscreen),
      isActive: present ? webApp.isActive !== false : true
    }),
    insets: Object.freeze({
      safe: insetOf(present ? webApp.safeAreaInset : null),
      content: insetOf(present ? webApp.contentSafeAreaInset : null)
    }),
    startParam: present && typeof webApp.initDataUnsafe?.start_param === "string"
      ? webApp.initDataUnsafe.start_param
      : null,
    chatType: present && typeof webApp.initDataUnsafe?.chat_type === "string"
      ? webApp.initDataUnsafe.chat_type
      : null,
    // Whether a *signed* payload exists. Keyboard-button and inline launches
    // have none, so nothing downstream may assume it.
    hasInitData: present && typeof webApp.initData === "string" && webApp.initData.length > 0,
    capabilities: Object.freeze(capabilities)
  });
}

function numberOr(value, fallback) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

/**
 * Capability key → the member of `Telegram.WebApp` that proves it.
 *
 * Two capabilities are booleans rather than objects, so "present" means
 * "defined" for those; the rest are objects or functions. Keeping this mapping
 * explicit is the difference between a capability table that means something and
 * one that quietly reads `webApp.backButton` — lowercase, always undefined — and
 * reports every feature as missing.
 */
const CAPABILITY_MEMBERS = Object.freeze({
  backButton: "BackButton",
  closingConfirmation: "enableClosingConfirmation",
  popups: "showPopup",
  qr: "showScanQrPopup",
  cloudStorage: "CloudStorage",
  haptics: "HapticFeedback",
  settingsButton: "SettingsButton",
  biometrics: "BiometricManager",
  verticalSwipes: "enableVerticalSwipes",
  fullscreen: "requestFullscreen",
  homeScreen: "addToHomeScreen",
  deviceMotion: "lockOrientation",
  secureStorage: "SecureStorage",
  keyboardControl: "hideKeyboard"
});

function hasObject(webApp, name) {
  const field = webApp?.[CAPABILITY_MEMBERS[name] ?? name];
  return field !== undefined && field !== null;
}

/**
 * Which of our two themes a client colour scheme asks for. The app has exactly
 * two, both contrast-audited; adopting Telegram's palette would invent a third
 * that nobody has audited.
 */
export function themeForScheme(colorScheme) {
  return colorScheme === "dark" ? "dark" : "light";
}

/**
 * The CSS custom properties the layout needs from the platform. Insets and the
 * stable height only — no colours, for the reason above.
 */
export function cssVariablesFor(context) {
  if (!context?.present) return {};
  const { safe, content } = context.insets;
  const variables = {
    "--tg-safe-area-inset-top": `${safe.top}px`,
    "--tg-safe-area-inset-bottom": `${safe.bottom}px`,
    "--tg-safe-area-inset-left": `${safe.left}px`,
    "--tg-safe-area-inset-right": `${safe.right}px`,
    "--tg-content-safe-area-inset-top": `${content.top}px`,
    "--tg-content-safe-area-inset-bottom": `${content.bottom}px`,
    "--tg-content-safe-area-inset-left": `${content.left}px`,
    "--tg-content-safe-area-inset-right": `${content.right}px`
  };
  if (context.viewport.stableHeight > 0) {
    variables["--tg-viewport-stable-height"] = `${context.viewport.stableHeight}px`;
  }
  return variables;
}

/**
 * A `start_param` may only be used as a route hint, and only when it looks like
 * one. Anything else is returned as null rather than being pasted into a link.
 */
export function readStartParamRoute(startParam) {
  if (typeof startParam !== "string") return null;
  const value = startParam.trim();
  if (!/^[a-z0-9][a-z0-9-]{0,31}$/i.test(value)) return null;
  return value;
}
