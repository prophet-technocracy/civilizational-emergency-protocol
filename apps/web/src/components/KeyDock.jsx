import { useCallback, useEffect, useRef } from "react";
import { localeStrings } from "../locales/index.js";
import { onLinkClick } from "../lib/links.js";
import { Icon } from "./icons.jsx";

// The civic key switch: one centre, six doors.
//
// It is a real switch, so it behaves like one for the keyboard too — one tab
// stop for the rail, arrows move between doors (mirrored in RTL), Home/End jump
// to the ends, and the pressed door carries aria-current. The list is static on
// purpose: the dock must render on every route, including the ones whose
// payload is still loading.

const DOORS = [
  { id: "level-1", view: "levels", recordId: "1", level: 1 },
  { id: "level-2", view: "levels", recordId: "2", level: 2 },
  { id: "level-3", view: "levels", recordId: "3", level: 3 },
  { id: "level-4", view: "levels", recordId: "4", level: 4 },
  { id: "level-5", view: "levels", recordId: "5", level: 5 },
  { id: "bank", view: "bank", recordId: null, level: null }
];

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Moves the roving tabindex by one door, wrapping at both ends. */
export function nextDoorIndex(index, step, count = DOORS.length) {
  if (count <= 0) return 0;
  const base = Number.isInteger(index) ? index : 0;
  return (((base + step) % count) + count) % count;
}

/** Arrow direction in reading order: ArrowRight means "next" only in LTR. */
export function doorStepForArrow(key, rtl) {
  if (key === (rtl ? "ArrowLeft" : "ArrowRight")) return 1;
  if (key === (rtl ? "ArrowRight" : "ArrowLeft")) return -1;
  return 0;
}

export function doorHref(door) {
  return door.recordId ? `#/${door.view}/${door.recordId}` : `#/${door.view}`;
}

export function isDoorActive(door, route) {
  if (door.view !== route.view) return false;
  if (door.recordId === null) return true;
  return String(door.recordId) === String(route.recordId ?? "");
}

/**
 * The key's glyph: a Persian digit for a level, and nothing for the bank — the
 * bank door carries the same icon everywhere it appears (issue #42). A currency
 * sign would be worse than nothing here: the unit is toman, the sign is rial,
 * and this key is not a price.
 */
export function doorGlyph(door) {
  if (door.level === null) return "";
  return String(door.level).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export default function KeyDock({ lang, route, navigate, inert = false }) {
  const copy = localeStrings(lang).hub;
  const linksRef = useRef([]);
  const rtl = lang === "fa";

  const activeIndex = DOORS.findIndex((door) => isDoorActive(door, route));
  const tabStop = activeIndex >= 0 ? activeIndex : 0;
  const homeActive = route.view === "hub";

  const focusDoor = useCallback((index) => {
    const node = linksRef.current[index];
    if (node) node.focus();
  }, []);

  const onKeyDown = useCallback(
    (event) => {
      const step = doorStepForArrow(event.key, rtl);
      if (step !== 0) {
        event.preventDefault();
        focusDoor(nextDoorIndex(tabStop, step));
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        focusDoor(0);
      } else if (event.key === "End") {
        event.preventDefault();
        focusDoor(DOORS.length - 1);
      }
    },
    [focusDoor, rtl, tabStop]
  );

  // Once a door is focused by keyboard it owns the tab stop, so the next Tab
  // leaves the rail instead of walking through six doors.
  useEffect(() => {
    for (const node of linksRef.current) {
      if (node) node.tabIndex = -1;
    }
    const node = linksRef.current[tabStop];
    if (node) node.tabIndex = 0;
  }, [tabStop]);

  const keys = DOORS.map((door, index) => {
    const active = isDoorActive(door, route);
    const label = door.level === null ? copy.keyLabels.bank : copy.keyLabels[String(door.level)];
    const glyph = doorGlyph(door);
    return (
      <li key={door.id} className="key-dock__slot">
        <a
          href={doorHref(door)}
          ref={(node) => {
            linksRef.current[index] = node;
          }}
          className={`dock-key ${active ? "is-pressed" : ""} ${door.level === null ? "dock-key--bank" : ""}`}
          aria-current={active ? "page" : undefined}
          title={glyph ? `${copy.levelWord} ${glyph} — ${label}` : `${copy.levelWord} — ${label}`}
          tabIndex={index === tabStop ? 0 : -1}
          onKeyDown={onKeyDown}
          onFocus={() => {
            for (const node of linksRef.current) {
              if (node) node.tabIndex = -1;
            }
            const node = linksRef.current[index];
            if (node) node.tabIndex = 0;
          }}
          onClick={onLinkClick(navigate, door.view, door.recordId)}
        >
          <span className="dock-key__cap">
            <span className="sr-only">{copy.levelWord} </span>
            <span className="dock-key__glyph" aria-hidden="true">
              {door.level === null ? <Icon name="bank" size={15} /> : glyph}
            </span>
            <span className="dock-key__label">{label}</span>
          </span>
          <span className="dock-key__led" aria-hidden="true" />
        </a>
      </li>
    );
  });

  // While a modal layer is open, the dock is part of the page behind it: it
  // must leave the tab order and the accessibility tree with everything else
  // (issue #57). It is a sibling of .app-body, so it has to be told separately.
  return (
    <nav className="key-dock" aria-label={copy.dockLabel} inert={inert || undefined}>
      <ul className="key-dock__rail" role="list" aria-label={copy.dockLabel}>
        {keys.slice(0, 3)}

        <li className="key-dock__core-slot">
          <a
            href="#/hub"
            className={`dock-core ${homeActive ? "is-pressed" : ""}`}
            title={copy.dockHome}
            aria-current={homeActive ? "page" : undefined}
            onClick={onLinkClick(navigate, "hub")}
          >
            <span className="dock-core__mark">{copy.mark}</span>
            <span className="dock-core__line dock-core__line--long">{copy.markLine}</span>
            <span className="dock-core__line dock-core__line--short">{copy.markLineShort}</span>
          </a>
        </li>

        {keys.slice(3)}
      </ul>

      <p className="key-dock__hint small">{copy.dockHint}</p>
    </nav>
  );
}

export { DOORS };
