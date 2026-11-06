// The prototype: an overlay that makes the Mini App environment visible.
//
// It renders only when a bridge is present — a real client, or the mock behind
// `?tg-mock=1` — so it costs the plain web app nothing. It exists because every
// property this adapter depends on (insets, stable height, colour scheme,
// whether a signed payload arrived) is invisible from inside the page, and a
// migration done blind is a migration done twice.
//
// The mock controls are lab controls, not features: they change the fabricated
// bridge and let the shell react, which is how the theme-follow and the safe
// area offsets get exercised without a phone.
import { useState } from "react";
import { UI } from "../../i18n.js";
import { readStartParamRoute } from "./context.mjs";

export default function TmaProbe({ context, lang }) {
  const [open, setOpen] = useState(false);
  const copy = UI[lang].telegram;
  if (!context?.active) return null;

  const mocked = context.mocked;
  const mock = mocked && typeof window !== "undefined" ? window.Telegram?.WebApp?.__mock : null;
  const routeHint = readStartParamRoute(context.startParam);

  return (
    <aside className={`tma-probe${open ? " tma-probe--open" : ""}`} aria-label={copy.title}>
      <button
        type="button"
        className="tma-probe__tab"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="tma-probe__dot" aria-hidden="true" />
        {mocked ? copy.mockBadge : copy.clientBadge}
      </button>

      {open ? (
        <div className="tma-probe__body">
          <dl className="tma-probe__rows">
            <div>
              <dt>{copy.platform}</dt>
              <dd className="mono">{context.platform}</dd>
            </div>
            <div>
              <dt>{copy.version}</dt>
              <dd className="mono">{context.version || "—"}</dd>
            </div>
            <div>
              <dt>{copy.scheme}</dt>
              <dd className="mono">{context.colorScheme}</dd>
            </div>
            <div>
              <dt>{copy.stableHeight}</dt>
              <dd className="mono">
                {context.viewport.stableHeight || "—"} · {context.viewport.isExpanded ? copy.expanded : copy.collapsed}
              </dd>
            </div>
            <div>
              <dt>{copy.insets}</dt>
              <dd className="mono">
                {context.insets.content.top}/{context.insets.content.bottom}
              </dd>
            </div>
            <div>
              <dt>{copy.initData}</dt>
              <dd className="mono">{context.hasInitData ? (mocked ? copy.initDataMock : copy.initDataSigned) : copy.initDataNone}</dd>
            </div>
            {routeHint ? (
              <div>
                <dt>{copy.startParam}</dt>
                <dd className="mono">{routeHint}</dd>
              </div>
            ) : null}
          </dl>

          <p className="tma-probe__note">{mocked ? copy.mockNote : copy.clientNote}</p>

          {mock ? (
            <div className="tma-probe__controls">
              <button type="button" className="btn btn--ghost" onClick={() => mock.setColorScheme(context.colorScheme === "dark" ? "light" : "dark")}>
                {copy.toggleScheme}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() =>
                  mock.setInsets(
                    context.insets.content.top > 0
                      ? { safe: { top: 0, bottom: 0 }, content: { top: 0, bottom: 0 } }
                      : { safe: { top: 24, bottom: 16 }, content: { top: 56, bottom: 40 } }
                  )
                }
              >
                {copy.toggleInsets}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
