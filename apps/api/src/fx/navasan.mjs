// Parsing for the navasan.tech widget payload.
//
// The endpoint the maintainer pointed at (navasan.tech/module.php) documents a
// script URL of the form `wp-navasan.php?usd&usd_shakhs&...`. That URL answers
// with a single JavaScript call whose argument is a JSON-encoded HTML table:
//
//     navasanret('\"\\r\\n#navasan_table { ... <tr id=\\\"usd\\\"> ...');
//
// So the payload is escaped twice over. This module unwraps it in passes, reads
// the rows it knows by id, and returns numbers — never HTML. It is a pure
// function: no network, no clock, no I/O, which is why the tests can pin the
// exact payload shape without touching the internet.
//
// What it deliberately does not do: judge plausibility. A rate that parses but
// is absurd is the service's problem (see service.mjs), because "this number is
// wrong" is a policy question and this file is a decoder.

/** Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII. */
const DIGIT_MAP = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
};

/** The ids this project reads out of the table. Anything else is ignored. */
export const NAVASAN_ROWS = {
  usd: "free-market-dollar",
  usd_sherkat: "corporate-dollar",
  usd_shakhs: "personal-dollar",
  usdt: "tether"
};

/**
 * Unwrap the layered escapes until the text stops changing.
 *
 * Written as one pass over every escape form rather than a sequence of
 * `replace` calls: chained replacements re-consume each other's output, which is
 * how a decoder ends up with a *nearly* unescaped table — the failure mode that
 * publishes a rate under the wrong row id.
 */
export function unwrapEscapes(input, passes = 6) {
  if (typeof input !== "string") return "";
  let current = input;
  const pattern = /\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|r|n|t|b|f|\/|"|'|\\)/g;
  for (let i = 0; i < passes; i += 1) {
    const next = current.replace(pattern, (_, seq) => {
      switch (seq[0]) {
        case "u":
        case "x":
          return String.fromCharCode(parseInt(seq.slice(1), 16));
        case "r":
          return "\r";
        case "n":
          return "\n";
        case "t":
          return "\t";
        default:
          return seq;
      }
    });
    if (next === current) break;
    current = next;
  }
  return current;
}

/**
 * Layout blocks are not data: a colour rule containing `#bd0a0a` must never be
 * read as a price, and a `<script>` body must never be read as anything.
 *
 * The removal is applied to a fixed point, because a single pass over
 * `<style>…</style>` can leave a second block behind when the input nests or
 * when a closing tag carries attributes (`</style >`). Case is ignored, and the
 * closing tag is matched against the *same* opener it closes.
 *
 * What this function deliberately does not do is "sanitise" by deleting
 * characters: the rows this parser needs are themselves markup (`<tr id="usd">`,
 * `<td class="val">`), so stripping angle brackets would delete the very
 * structure being read. Where a block cannot be removed safely the caller
 * refuses the payload instead — see `parseNavasanWidget`.
 */
const LAYOUT_BLOCK = /<\s*(style|script)\b[\s\S]*?<\s*\/\s*\1\s*[^>]*>/gi;
const LAYOUT_OPENER = /<\s*(?:style|script)\b/i;

/**
 * Returns the payload with layout blocks removed, or `null` when a clean fixed
 * point could not be reached. The refusal lives here rather than at the call
 * site so that no caller can ever hold a string this function could not vouch
 * for.
 */
function stripLayoutBlocks(input) {
  let current = String(input);
  // Bounded loop: a fixed point is reached in one pass for well-formed input,
  // and a hostile payload must not be able to spin here.
  for (let pass = 0; pass < 8; pass += 1) {
    const next = current.replace(LAYOUT_BLOCK, "");
    if (next === current) break;
    current = next;
  }
  return LAYOUT_OPENER.test(current) ? null : current;
}

/** ASCII digits out of a Persian-formatted number, or null if there is none. */
export function toNumber(raw) {
  if (raw === null || raw === undefined) return null;
  const ascii = String(raw).replace(/[۰-۹٠-٩]/g, (digit) => DIGIT_MAP[digit] ?? digit);
  // Thousands separators in the payload are ASCII commas; the Persian comma and
  // the Arabic thousands separator appear in some mirrors.
  const cleaned = ascii.replace(/[,،٬\s]/g, "").replace(/[−–—]/g, "-");
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

/**
 * Parse the widget payload.
 *
 * Returns `{ rows, stamp, sourceDate }`, or `null` when the payload is not the
 * shape this decoder understands — never a partially parsed object, because a
 * half-read table is how a wrong rate gets published.
 */
export function parseNavasanWidget(payload) {
  // An unmatched style or script opener means the block could not be removed
  // safely. Refusing the whole payload is cheaper than repairing markup: a
  // decoder that guesses is a decoder that can publish a number from a stylesheet.
  const text = stripLayoutBlocks(unwrapEscapes(payload));
  if (text === null) return null;
  if (!text.includes("navasan_table") && !text.includes('class="val"')) return null;

  const rows = {};
  for (const chunk of text.split(/<tr/i).slice(1)) {
    const idMatch = chunk.match(/\bid\s*=\s*"([a-z0-9_]+)"/i);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (!Object.hasOwn(NAVASAN_ROWS, id)) continue;
    const value = chunk.match(/class\s*=\s*"val"[^>]*>([^<]*)</i);
    const change = chunk.match(/class\s*=\s*"chg[^"]*"[^>]*>([^<]*)</i);
    const time = chunk.match(/class\s*=\s*"dat"[^>]*>([^<]*)</i);
    const rate = value ? toNumber(value[1]) : null;
    if (rate === null) continue;
    rows[id] = {
      key: NAVASAN_ROWS[id],
      rate,
      change: change ? toNumber(change[1]) : null,
      time: time ? time[1].trim() || null : null
    };
  }

  if (!rows.usd) return null;

  // The source prints its own Jalali date in the table footer ("تاریخ 05/08/15").
  // It is kept verbatim rather than converted: a wrong Jalali-to-Gregorian
  // conversion is a silent off-by-one-month on every screen.
  const dateMatch = text.match(/(?:تاریخ|date)\s*([0-9]{2}\/[0-9]{2}\/[0-9]{2})/i);
  const sourceDate = dateMatch ? dateMatch[1] : null;

  return { rows, sourceDate };
}
