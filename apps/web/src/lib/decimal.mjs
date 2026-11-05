// Free-text decimal input, parsed once and honestly (issue #28).
//
// The bank simulator used `Number(text.replace(/[٫,]/g, "."))`, which read
// "1,000" as 1 (a silent 1000x error at exactly the cap a level-4 reader types)
// and turned every Persian or Arabic-Indic amount into NaN.
//
// The rule here: never guess. A single separator with exactly three digits after
// it can mean either thing — 1000 or 1.000 — so it is refused with a reason the
// interface can explain, and the reader decides.
//
// Accepted: Latin 0-9, Persian ۰-۹, Arabic-Indic ٠-٩. `.` and `٫` are decimal
// marks. `,` `٬` (U+066C), space, NBSP and ZWNJ group digits.

const GROUPING = new Set([",", "٬", " ", "\u00A0", "\u200C"]);
const DECIMAL = new Set([".", "٫"]);
const SEPARATORS = new Set([...GROUPING, ...DECIMAL]);

const PERSIAN_ZERO = 0x06f0;
const ARABIC_ZERO = 0x0660;

/** Latin digits from any of the three scripts; other characters untouched. */
export function toLatinDigits(text) {
  return String(text ?? "").replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (character) => {
    const code = character.codePointAt(0);
    const value = code >= PERSIAN_ZERO ? code - PERSIAN_ZERO : code - ARABIC_ZERO;
    return String(value);
  });
}

function positive(intPart, fractionPart) {
  const normalized = `${intPart || "0"}${fractionPart ? `.${fractionPart}` : ""}`;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return { ok: false, reason: "not-a-number" };
  if (value <= 0) return { ok: false, reason: "zero-or-negative" };
  return { ok: true, value, normalized };
}

/**
 * Parse an amount the reader typed.
 *
 * Returns `{ ok: true, value, normalized }` or
 * `{ ok: false, reason: "empty" | "not-a-number" | "zero-or-negative" | "ambiguous-separator" }`.
 */
export function parseDecimalInput(raw) {
  const text = toLatinDigits(String(raw ?? "")).trim();
  if (text === "") return { ok: false, reason: "empty" };

  for (const character of text) {
    if (!/[0-9]/.test(character) && !SEPARATORS.has(character)) {
      return { ok: false, reason: "not-a-number" };
    }
  }

  const separators = [...text]
    .map((character, index) => ({ character, index }))
    .filter((entry) => SEPARATORS.has(entry.character));

  if (separators.length === 0) return positive(text, "");

  // Everything after the last separator.
  const last = separators[separators.length - 1];
  const tail = text.slice(last.index + 1);
  if (!/^[0-9]+$/.test(tail)) return { ok: false, reason: "not-a-number" };

  const groups = [];
  let cursor = 0;
  for (const separator of separators) {
    groups.push(text.slice(cursor, separator.index));
    cursor = separator.index + 1;
  }
  const headGroups = groups;
  // The first group carries one to three digits; every group after it must be
  // exactly three, otherwise the separators are not grouping.
  const allGroupsAreThree =
    headGroups[0].length >= 1 &&
    headGroups[0].length <= 3 &&
    headGroups.slice(1).every((group) => group.length === 3);
  const headIsDigits = headGroups.every((group) => /^[0-9]+$/.test(group));
  const everySeparalIsGrouping = separators.every((entry) => GROUPING.has(entry.character));
  const everySeparatorIsDecimal = separators.every((entry) => DECIMAL.has(entry.character));

  // Several separators, every group exactly three digits, one consistent kind:
  // this is grouping, and there is nothing to guess (`1,000,000`, `1 000 000`).
  if (
    separators.length > 1 &&
    allGroupsAreThree &&
    headIsDigits &&
    (everySeparalIsGrouping || everySeparatorIsDecimal)
  ) {
    return positive(text.replace(/[^0-9]/g, ""), "");
  }

  // A single separator is a decimal mark unless it is followed by exactly three
  // digits, in which case it is genuinely ambiguous.
  if (separators.length === 1) {
    if (tail.length === 3 && headGroups[0].length > 0) {
      return { ok: false, reason: "ambiguous-separator", ambiguous: true };
    }
    if (!/^[0-9]*$/.test(headGroups[0])) return { ok: false, reason: "not-a-number" };
    return positive(headGroups[0], tail);
  }

  // Several separators, the last one decimal: the head must be clean grouping.
  if (tail.length !== 3 && headIsDigits && allGroupsAreThree) {
    return positive(text.slice(0, last.index).replace(/[^0-9]/g, ""), tail);
  }

  return { ok: false, reason: "ambiguous-separator", ambiguous: true };
}
