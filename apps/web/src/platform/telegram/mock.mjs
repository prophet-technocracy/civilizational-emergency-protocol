// A fabricated Telegram bridge, for working on the Mini App in a plain browser.
//
// Without this, every change to the adapter needs a phone, a bot token and a
// deployment before anyone can see whether the layout survives an inset. With
// it, `?tg-mock=1` produces the same shaped object the real client produces, and
// the prototype can be inspected at any width, in either colour scheme.
//
// What the mock cannot do: authenticate. The `initData` it fabricates is
// deliberately invalid, so the server rejects it and the probe says "not
// signed". A mock that produced a passing signature would teach us that the
// authentication path works when it has never once run (#69).

const MOCK_INIT_DATA = "query_id=MOCK&user=%7B%22id%22%3A0%7D&auth_date=0&hash=not-a-real-signature";

const THEMES = {
  light: {
    bg_color: "#f3f6f4",
    secondary_bg_color: "#ffffff",
    text_color: "#101a24",
    hint_color: "#4d5b6a",
    link_color: "#0f6b63",
    button_color: "#0f6b63",
    button_text_color: "#ffffff",
    header_bg_color: "#f3f6f4",
    accent_text_color: "#0f6b63",
    destructive_text_color: "#a52323",
    section_bg_color: "#ffffff",
    section_separator_color: "#d9d2c6",
    subtitle_text_color: "#4d5b6a",
    bottom_bar_bg_color: "#f3f6f4"
  },
  dark: {
    bg_color: "#101a24",
    secondary_bg_color: "#17222e",
    text_color: "#e8eef4",
    hint_color: "#9fb0c0",
    link_color: "#5ec8bc",
    button_color: "#2a7f76",
    button_text_color: "#ffffff",
    header_bg_color: "#101a24",
    accent_text_color: "#5ec8bc",
    destructive_text_color: "#e0716c",
    section_bg_color: "#17222e",
    section_separator_color: "#24384a",
    subtitle_text_color: "#9fb0c0",
    bottom_bar_bg_color: "#101a24"
  }
};

/**
 * @param {object} [options]
 * @param {"light"|"dark"} [options.colorScheme]
 * @param {string} [options.platform]
 * @param {string} [options.version]
 * @param {object} [options.insets] safe-area insets, in px (`{safe, content}`)
 * @param {"menu"|"keyboard"|"inline"|"direct"|"attachment"} [options.launch]
 *   which of the seven launch modes to imitate; two of them carry no `initData`
 * @param {boolean} [options.fullscreen]
 */
export function createMockWebApp({
  colorScheme = "light",
  platform = "android",
  version = "8.0",
  launch = "menu",
  fullscreen = false,
  insets = { safe: { top: 0, bottom: 0, left: 0, right: 0 }, content: { top: 56, bottom: 40, left: 0, right: 0 } }
} = {}) {
  const listeners = new Map();
  const emit = (event, payload) => {
    for (const handler of listeners.get(event) ?? []) handler(payload);
  };

  const app = {
    platform,
    version,
    colorScheme,
    initData: MOCK_INIT_DATA,
    initDataUnsafe: { start_param: "probe" },
    themeParams: { ...THEMES[colorScheme] },
    headerColor: THEMES[colorScheme].header_bg_color,
    backgroundColor: THEMES[colorScheme].bg_color,
    bottomBarColor: THEMES[colorScheme].bottom_bar_bg_color,
    viewportHeight: 780,
    viewportStableHeight: 700,
    isExpanded: false,
    isFullscreen: Boolean(fullscreen),
    isActive: true,
    isClosingConfirmationEnabled: false,
    isVerticalSwipesEnabled: true,
    safeAreaInset: { ...insets.safe },
    contentSafeAreaInset: { ...insets.content },
    BackButton: {
      isVisible: false,
      show() {
        this.isVisible = true;
        return this;
      },
      hide() {
        this.isVisible = false;
        return this;
      },
      onClick(handler) {
        app.onEvent("backButtonClicked", handler);
        return this;
      },
      offClick(handler) {
        app.offEvent("backButtonClicked", handler);
        return this;
      }
    },
    HapticFeedback: {
      impactOccurred: () => undefined,
      notificationOccurred: () => undefined,
      selectionChanged: () => undefined
    },
    CloudStorage: {
      setItem: (_key, _value, callback) => callback?.(null, true),
      getItem: (_key, callback) => callback?.(null, null),
      removeItem: (_key, callback) => callback?.(null, true)
    },
    SettingsButton: {
      isVisible: false,
      show() {
        this.isVisible = true;
        return this;
      },
      hide() {
        this.isVisible = false;
        return this;
      },
      onClick() {
        return this;
      },
      offClick() {
        return this;
      }
    },
    BiometricManager: {
      isInited: false,
      isBiometricAvailable: false,
      init(callback) {
        callback?.();
        return this;
      }
    },
    SecureStorage: {
      setItem: (_key, _value, callback) => callback?.(null, true),
      getItem: (_key, callback) => callback?.(null, null),
      removeItem: (_key, callback) => callback?.(null, true)
    },
    showPopup: (_params, callback) => callback?.("mock"),
    showScanQrPopup: (_params, callback) => callback?.(null),
    showAlert: (_message, callback) => callback?.(),
    showConfirm: (_message, callback) => callback?.(true),
    requestFullscreen() {
      app.isFullscreen = true;
    },
    exitFullscreen() {
      app.isFullscreen = false;
    },
    addToHomeScreen: () => undefined,
    checkHomeScreenStatus: (callback) => callback?.("unknown"),
    lockOrientation: () => undefined,
    unlockOrientation: () => undefined,
    hideKeyboard: () => undefined,
    enableVerticalSwipes() {
      app.isVerticalSwipesEnabled = true;
    },
    disableVerticalSwipes() {
      app.isVerticalSwipesEnabled = false;
    },
    placeholderCalls: [],
    onEvent(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);
    },
    offEvent(event, handler) {
      listeners.get(event)?.delete(handler);
    },
    ready() {
      app.readyCalled = true;
    },
    expand() {
      app.isExpanded = true;
      emit("viewportChanged", { isStateStable: true });
    },
    close() {
      app.closeCalled = true;
    },
    setHeaderColor(color) {
      app.headerColor = color;
    },
    setBackgroundColor(color) {
      app.backgroundColor = color;
    },
    setBottomBarColor(color) {
      app.bottomBarColor = color;
    },
    enableClosingConfirmation() {
      app.isClosingConfirmationEnabled = true;
    },
    disableClosingConfirmation() {
      app.isClosingConfirmationEnabled = false;
    },
    isVersionAtLeast(minimum) {
      const [a, b] = String(version).split(".").map(Number);
      const [c, d] = String(minimum).split(".").map(Number);
      return a > c || (a === c && b >= (d || 0));
    },
    /** Mock-only controls, used by the probe. */
    __mock: {
      emit,
      listenerCount: (event) => listeners.get(event)?.size ?? 0,
      setColorScheme(next) {
        app.colorScheme = next;
        app.themeParams = { ...THEMES[next] };
        app.headerColor = THEMES[next].header_bg_color;
        app.backgroundColor = THEMES[next].bg_color;
        app.bottomBarColor = THEMES[next].bottom_bar_bg_color;
        emit("themeChanged");
      },
      setInsets(next) {
        app.safeAreaInset = { ...(next.safe ?? app.safeAreaInset) };
        app.contentSafeAreaInset = { ...(next.content ?? app.contentSafeAreaInset) };
        emit("safeAreaChanged");
        emit("contentSafeAreaChanged");
      }
    }
  };

  // The two launch modes opened from a keyboard button or an inline query
  // deliver no signed data at all. Reproducing that here is the point of the
  // mock: a layout that assumes `initData` exists breaks in exactly those modes.
  if (launch === "keyboard" || launch === "inline") {
    app.initData = "";
    app.initDataUnsafe = { chat_type: "private", chat_instance: "mock-chat-instance" };
  }

  return app;
}

/** Install a mock bridge on `window`, for `?tg-mock=1`. Returns the object. */
export function installMockBridge(scope, options) {
  const app = createMockWebApp(options);
  scope.Telegram = { ...(scope.Telegram ?? {}), WebApp: app };
  return app;
}

export const MOCK_MARKER = MOCK_INIT_DATA;
