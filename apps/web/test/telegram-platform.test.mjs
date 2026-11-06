// The Mini App adapter, exercised without a client, a bot token or a browser.
//
// The point of the adapter is that it is pure: given a `Telegram.WebApp`-shaped
// object it produces one frozen value, and given a root element it sets eight
// CSS variables and nothing else. Both halves are testable here, which is why
// the mock in this repository is a first-class artifact rather than a toy.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CAPABILITY_VERSIONS,
  compareVersions,
  cssVariablesFor,
  isActiveClient,
  parseVersion,
  readStartParamRoute,
  readTelegramContext,
  themeForScheme
} from "../src/platform/telegram/context.mjs";
import { installTelegramBridge, setBackButton } from "../src/platform/telegram/bridge.mjs";
import { createMockWebApp, MOCK_MARKER } from "../src/platform/telegram/mock.mjs";

/* -------------------------------- detection ------------------------------- */

test("the official script in a plain browser is not a Telegram launch", () => {
  // This is exactly what telegram-web-app.js looks like outside a client.
  assert.equal(isActiveClient({ platform: "unknown", version: "6.0", initData: "" }), false);
  assert.equal(isActiveClient(null), false);
  assert.equal(isActiveClient({}), false);
});

test("a launch is recognised from signed data, even on an unknown platform", () => {
  assert.equal(isActiveClient({ platform: "unknown", initData: "auth_date=1&hash=ab" }), true);
});

test("keyboard-button and inline launches have no initData but are still real launches", () => {
  assert.equal(isActiveClient({ platform: "ios", initData: "" }), true);
});

/* -------------------------------- versioning ------------------------------ */

test("versions compare numerically, and a malformed version is the oldest", () => {
  assert.deepEqual(parseVersion("8.0"), { major: 8, minor: 0 });
  assert.deepEqual(parseVersion("9.1"), { major: 9, minor: 1 });
  assert.equal(parseVersion("nonsense"), null);
  assert.equal(compareVersions("8.0", "7.10"), 1);
  assert.equal(compareVersions("7.2", "7.10"), -1, "minor is a number, not a string");
  assert.equal(compareVersions("6.0", "6.0"), 0);
  assert.equal(compareVersions("nonsense", "6.0"), -1);
});

/* --------------------------------- context -------------------------------- */

test("the context is a frozen read-only value with the fields the shell needs", () => {
  const app = createMockWebApp({ colorScheme: "dark", insets: { safe: { top: 12 }, content: { top: 56, bottom: 40 } } });
  const context = readTelegramContext(app, { mocked: true });
  assert.equal(context.active, true);
  assert.equal(context.mocked, true);
  assert.equal(context.colorScheme, "dark");
  assert.equal(context.hasInitData, true);
  assert.equal(context.startParam, "probe");
  assert.deepEqual(context.insets.content, { top: 56, bottom: 40, left: 0, right: 0 });
  assert.deepEqual(context.insets.safe, { top: 12, bottom: 0, left: 0, right: 0 });
  assert.equal(Object.isFrozen(context), true);
  assert.equal(Object.isFrozen(context.insets), true);
});

test("capabilities follow the Bot API version, not merely the presence of an object", () => {
  const old = readTelegramContext({ platform: "ios", version: "6.0", initData: "x", BackButton: {}, HapticFeedback: {}, CloudStorage: {} });
  assert.equal(old.capabilities.backButton, false, "BackButton arrived in 6.1; the object alone is not evidence");
  assert.equal(old.capabilities.cloudStorage, false);
  assert.equal(old.capabilities.fullscreen, false);
  assert.equal(old.capabilities.secureStorage, false);

  const middling = readTelegramContext({ platform: "ios", version: "6.1", initData: "x", BackButton: {} });
  assert.equal(middling.capabilities.backButton, true);

  const modern = readTelegramContext({ platform: "android", version: "8.0", initData: "x", BackButton: {}, HapticFeedback: {}, CloudStorage: {}, requestFullscreen() {} });
  assert.equal(modern.capabilities.fullscreen, true);
  assert.equal(modern.capabilities.cloudStorage, true);
  assert.equal(readTelegramContext({ platform: "android", version: "8.0", initData: "x" }).capabilities.cloudStorage, false, "a new version without the object is not a capability");
  assert.equal(modern.capabilities.secureStorage, false, "9.0 storage is absent from an 8.0 client even if someone passes the object");
  assert.equal(readTelegramContext({ platform: "android", version: "9.1", initData: "x", SecureStorage: {}, hideKeyboard() {} }).capabilities.keyboardControl, true);
  assert.equal(CAPABILITY_VERSIONS.fullscreen, "8.0");
});

test("the full mock presents the capabilities an 8.0 client should have", () => {
  const context = readTelegramContext(createMockWebApp({ version: "8.0" }));
  assert.equal(context.capabilities.backButton, true);
  assert.equal(context.capabilities.cloudStorage, true);
  assert.equal(context.capabilities.haptics, true);
  assert.equal(context.capabilities.fullscreen, true);
  assert.equal(context.capabilities.verticalSwipes, true);
  assert.equal(context.capabilities.popups, true);
  assert.equal(context.capabilities.settingsButton, true);
  assert.equal(context.capabilities.qr, true);
  assert.equal(context.capabilities.biometrics, true);
  assert.equal(context.capabilities.homeScreen, true);
  assert.equal(context.capabilities.secureStorage, false, "the mock claims 8.0 and does not pretend to be 9.0");
});

test("totally absent inputs produce a context that says so rather than throwing", () => {
  const context = readTelegramContext(null);
  assert.equal(context.present, false);
  assert.equal(context.active, false);
  assert.equal(context.viewport.stableHeight, 0);
  assert.equal(context.hasInitData, false);
});

/* -------------------------------- variable -------------------------------- */

test("only insets and the stable height become CSS variables", () => {
  const context = readTelegramContext(createMockWebApp());
  const variables = cssVariablesFor(context);
  assert.equal(variables["--tg-safe-area-inset-top"], "0px");
  assert.equal(variables["--tg-content-safe-area-inset-bottom"], "40px");
  assert.equal(variables["--tg-viewport-stable-height"], "700px");
  assert.equal(
    Object.keys(variables).some((name) => name.includes("theme")),
    false,
    "no colour ever crosses into the page: the palette stays ours"
  );
  assert.deepEqual(cssVariablesFor(null), {});
});

test("the colour scheme chooses one of our two themes, never a third", () => {
  assert.equal(themeForScheme("dark"), "dark");
  assert.equal(themeForScheme("light"), "light");
  assert.equal(themeForScheme(undefined), "light");
});

test("a start parameter is only used when it looks like a route", () => {
  assert.equal(readStartParamRoute("probe"), "probe");
  assert.equal(readStartParamRoute("bank"), "bank");
  assert.equal(readStartParamRoute("open-redirect?to=evil"), null);
  assert.equal(readStartParamRoute("../../etc/passwd"), null);
  assert.equal(readStartParamRoute(""), null);
  assert.equal(readStartParamRoute(null), null);
});

/* ---------------------------------- bridge -------------------------------- */

const fakeRoot = () => {
  const props = new Map();
  return { style: { setProperty: (name, value) => props.set(name, value) }, props };
};

test("installing the bridge calls ready and expand, and applies the geometry", () => {
  const app = createMockWebApp();
  const root = fakeRoot();
  const context = readTelegramContext(app);
  const teardown = installTelegramBridge({ webApp: app, context, root });

  assert.equal(app.readyCalled, true);
  assert.equal(app.isExpanded, true);
  assert.equal(root.props.get("--tg-content-safe-area-inset-top"), "56px");

  teardown();
  assert.equal(app.__mock.listenerCount("themeChanged"), 0, "teardown removes every listener it added");
});

test("the client's chrome takes our palette, and changes to it are pushed", () => {
  const app = createMockWebApp();
  const root = fakeRoot();
  const seen = [];
  const context = readTelegramContext(app);
  const teardown = installTelegramBridge({
    webApp: app,
    context,
    root,
    palette: { headerBg: "#101a24", bottomBarBg: "#101a24" },
    onUpdate: (next) => seen.push(next.colorScheme)
  });
  assert.equal(app.headerColor, "#101a24");
  assert.equal(app.backgroundColor, "#101a24");
  assert.equal(app.bottomBarColor, "#101a24");

  app.__mock.setColorScheme("dark");
  assert.deepEqual(seen, ["dark"], "the shell is told, so it can re-render");
  teardown();
});

test("inset changes reach the CSS variables without a re-render", () => {
  const app = createMockWebApp();
  const root = fakeRoot();
  const teardown = installTelegramBridge({ webApp: app, context: readTelegramContext(app), root });
  app.__mock.setInsets({ content: { top: 0, bottom: 0 } });
  assert.equal(root.props.get("--tg-content-safe-area-inset-top"), "0px");
  teardown();
});

test("a hostile or broken bridge cannot throw into the app", () => {
  const broken = { platform: "ios", version: "8.0", initData: "x", ready() { throw new Error("nope"); }, expand() { throw new Error("nope"); } };
  const context = readTelegramContext(broken);
  const teardown = installTelegramBridge({ webApp: broken, context, root: fakeRoot() });
  assert.equal(typeof teardown, "function");
  teardown();
});

test("no bridge means no behaviour at all", () => {
  const teardown = installTelegramBridge({ webApp: null, context: null });
  assert.equal(teardown(), undefined);
});

/* ------------------------------- back button ------------------------------- */

test("the back button is shown only when the route says so, and does what it is told", () => {
  const app = createMockWebApp();
  let pressed = 0;
  const teardown = setBackButton(app, { visible: true, onClick: () => { pressed += 1; } });
  assert.equal(app.BackButton.isVisible, true);
  app.__mock.emit("backButtonClicked");
  assert.equal(pressed, 1);

  teardown();
  assert.equal(app.BackButton.isVisible, false);
  app.__mock.emit("backButtonClicked");
  assert.equal(pressed, 1, "after teardown the client's button is deaf");
});

/* ----------------------------------- mock --------------------------------- */

test("the mock is honest about not being signed", () => {
  const app = createMockWebApp();
  assert.equal(app.initData, MOCK_MARKER);
  assert.match(app.initData, /hash=not-a-real-signature/);
  assert.equal(app.__mock.listenerCount("backButtonClicked"), 0);
});
