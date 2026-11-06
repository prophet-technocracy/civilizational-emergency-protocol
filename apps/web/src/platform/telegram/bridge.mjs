// The side-effect half of the Telegram adapter: everything that touches the
// client, in one place, behind one teardown.
//
// Rules that the rest of the app depends on:
//
//   * Every call is guarded. The bridge is a large mutable object whose fields
//     arrive per Bot API version; a missing method must degrade, never throw.
//   * Nothing here reads or sends `initData`. The bridge reports the environment;
//     authentication is a server decision (apps/api/src/platform/telegram/).
//   * Nothing here touches storage. Preferences stay in localStorage where the
//     browser build already keeps them.
import { cssVariablesFor, readTelegramContext } from "./context.mjs";

/**
 * @param {object} options
 * @param {object} options.webApp `window.Telegram.WebApp`
 * @param {object} options.context the value from readTelegramContext
 * @param {HTMLElement} [options.root] element to carry the CSS variables
 * @param {{headerBg?: string, bottomBarBg?: string}} [options.palette]
 * @param {(context: object) => void} [options.onUpdate]
 * @returns {() => void} teardown
 */
export function installTelegramBridge({ webApp, context, root, palette = {}, onUpdate }) {
  if (!webApp || !context?.present) return () => undefined;

  const target = root ?? (typeof document !== "undefined" ? document.documentElement : null);
  const cleanups = [];

  const applyVariables = (next) => {
    if (!target?.style) return;
    for (const [name, value] of Object.entries(cssVariablesFor(next))) {
      target.style.setProperty(name, value);
    }
  };

  // The client's own chrome follows our palette, not the other way round. A hex
  // value is only accepted by name from Bot API 6.9; wrap each call because an
  // older client throws rather than ignoring it.
  const applyChrome = (next) => {
    const headerBg = palette.headerBg ?? next.theme.headerColor;
    const bottomBarBg = palette.bottomBarBg ?? next.theme.bottomBarColor;
    if (headerBg) safely(() => webApp.setHeaderColor?.(headerBg));
    if (headerBg) safely(() => webApp.setBackgroundColor?.(headerBg));
    if (bottomBarBg) safely(() => webApp.setBottomBarColor?.(bottomBarBg));
  };

  const refresh = () => {
    const next = readTelegramContext(webApp, { mocked: context.mocked });
    applyVariables(next);
    applyChrome(next);
    onUpdate?.(next);
  };

  applyVariables(context);
  applyChrome(context);

  // Tell the client the interface exists. Called after the first paint of the
  // shell, which is why the caller mounts this from an effect rather than at
  // import time.
  safely(() => webApp.ready?.());
  safely(() => webApp.expand?.());

  for (const event of ["themeChanged", "viewportChanged", "safeAreaChanged", "contentSafeAreaChanged"]) {
    if (typeof webApp.onEvent !== "function") break;
    const handler = () => refresh();
    webApp.onEvent(event, handler);
    cleanups.push(() => safely(() => webApp.offEvent?.(event, handler)));
  }

  return () => {
    for (const cleanup of cleanups.reverse()) cleanup();
  };
}

/**
 * The client's back button mirrors the browser's: visible whenever there is
 * somewhere to go back to. Kept separate from the bridge because it follows the
 * route, which changes far more often than the environment.
 *
 * @param {object} webApp
 * @param {{visible: boolean, onClick: () => void}} options
 * @returns {() => void} teardown
 */
export function setBackButton(webApp, { visible, onClick }) {
  const button = webApp?.BackButton;
  if (!button || typeof button.show !== "function") return () => undefined;
  const handler = () => onClick?.();
  safely(() => button.onClick?.(handler));
  safely(() => (visible ? button.show() : button.hide()));
  return () => {
    safely(() => button.offClick?.(handler));
    safely(() => button.hide());
  };
}

function safely(fn) {
  try {
    return fn();
  } catch {
    return undefined;
  }
}
