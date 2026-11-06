// The React surface of the Telegram adapter: one hook for the environment, one
// for the back button, and the mock bootstrap the browser build calls once.
//
// Everything degrades to the plain web app. If the bridge is absent the hook
// returns `{ context: null }` and the shell behaves exactly as it did before
// this platform existed — which is the property that keeps the prototype usable
// as a review surface.
import { useEffect, useState } from "react";
import { readTelegramContext, themeForScheme, readStartParamRoute } from "./context.mjs";
import { installTelegramBridge, setBackButton } from "./bridge.mjs";
import { installMockBridge } from "./mock.mjs";

const hasWindow = () => typeof window !== "undefined";

/** The bridge, if the platform script loaded (or the mock installed one). */
export function telegramWebApp() {
  if (!hasWindow()) return null;
  return window.Telegram?.WebApp ?? null;
}

export function isMockRequested(search = hasWindow() ? window.location.search : "") {
  try {
    return new URLSearchParams(search).get("tg-mock") === "1";
  } catch {
    return false;
  }
}

/**
 * Install the fabricated bridge when the URL asks for it (`?tg-mock=1`).
 * Called once from main.jsx, before React renders, so the first frame already
 * sees the simulated environment instead of flipping into it.
 */
export function bootstrapTelegramMock() {
  if (!hasWindow() || !isMockRequested()) return null;
  if (window.Telegram?.WebApp) return window.Telegram.WebApp;
  const stored = window.sessionStorage?.getItem("cep.tg-mock-scheme");
  return installMockBridge(window, { colorScheme: stored === "dark" ? "dark" : "light" });
}

/**
 * The Mini App environment, kept in state so a theme or geometry change from
 * the client re-renders the shell.
 *
 * @param {{palette?: {headerBg?: string, bottomBarBg?: string}}} [options]
 */
export function useTelegramEnvironment({ palette } = {}) {
  const [state, setState] = useState(() => readEnvironment());
  // Destructured so the effect depends on two strings rather than on the
  // identity of an object the caller rebuilds every render.
  const headerBg = palette?.headerBg;
  const bottomBarBg = palette?.bottomBarBg;

  useEffect(() => {
    const webApp = telegramWebApp();
    if (!webApp) return undefined;
    const context = readTelegramContext(webApp, { mocked: Boolean(webApp.__mock) });
    setState({ context, webApp });
    const teardown = installTelegramBridge({
      webApp,
      context,
      palette: { headerBg, bottomBarBg },
      onUpdate: (next) => setState({ context: next, webApp })
    });
    return teardown;
  }, [headerBg, bottomBarBg]);

  // Null outside a client: `useState` initialises to null when no bridge exists.
  return state?.context ?? null;
}

function readEnvironment() {
  const webApp = telegramWebApp();
  if (!webApp) return null;
  return readTelegramContext(webApp, { mocked: Boolean(webApp.__mock) });
}

/**
 * Mirror the route on the client's back button.
 *
 * @param {{visible: boolean, onBack: () => void}} options
 */
export function useTelegramBackButton({ visible, onBack }) {
  useEffect(() => {
    const webApp = telegramWebApp();
    if (!webApp) return undefined;
    return setBackButton(webApp, { visible, onClick: onBack });
  }, [visible, onBack]);
}

/** Which of our themes the client is asking for, or null outside Telegram. */
export function wantedTheme(context) {
  return context?.active ? themeForScheme(context.colorScheme) : null;
}

export { readStartParamRoute };
