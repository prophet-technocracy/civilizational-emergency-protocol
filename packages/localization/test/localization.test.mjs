import assert from "node:assert/strict";
import test from "node:test";
import {
  EPISTEMIC_LABELS,
  UI_DICTIONARY,
  formatLocalizedNumber,
  matchesBilingualQuery,
  normalizeSearchText,
  toLatinDigits,
  toPersianDigits
} from "../index.mjs";

test("persian numerals round-trip through latin digits", () => {
  assert.equal(toPersianDigits("2026"), "۲۰۲۶");
  assert.equal(toLatinDigits("۲۰۲۶"), "2026");
  assert.equal(toLatinDigits(toPersianDigits("180")), "180");
  assert.equal(toLatinDigits("٠١٢"), "012", "arabic-indic digits are also normalised");
});

test("localized number formatting follows the active language", () => {
  assert.equal(formatLocalizedNumber(12, "fa"), "۱۲");
  assert.equal(formatLocalizedNumber(12, "en"), "12");
  assert.equal(formatLocalizedNumber(null, "fa"), "");
});

test("search normalisation unifies arabic yeh/kaf and drops zwnj and diacritics", () => {
  const arabic = normalizeSearchText("نيشابوري");
  const persian = normalizeSearchText("نیشابوری");
  assert.equal(arabic, persian);

  assert.equal(normalizeSearchText("می\u200cرود").includes("\u200c"), false);
  assert.equal(normalizeSearchText("كَاشَان"), "کاشان");
  assert.equal(normalizeSearchText("  Extra   SPACES "), "extra spaces");
  assert.equal(normalizeSearchText(null), "");
});

test("bilingual matching accepts either language and tolerates transliteration noise", () => {
  assert.equal(matchesBilingualQuery("کاشانی", ["Parvaneh Kashani", "پروانهٔ کاشانی"]), true);
  assert.equal(matchesBilingualQuery("KASHANI", ["Parvaneh Kashani", "پروانهٔ کاشانی"]), true);
  // Latin queries never match Persian-only text: search haystacks must include both languages.
  assert.equal(matchesBilingualQuery("KASHANI", ["پروانهٔ کاشانی"]), false);
  assert.equal(matchesBilingualQuery("نيشابوري", ["ابوالفضل نیشابوری"]), true);
  assert.equal(matchesBilingualQuery("absent", ["داده"]), false);
  assert.equal(matchesBilingualQuery("", ["anything"]), true, "blank query matches everything");
});

test("both dictionaries exist, are complete, and declare their direction", () => {
  for (const lang of ["fa", "en"]) {
    const dict = UI_DICTIONARY[lang];
    assert.ok(dict, lang);
    assert.equal(dict.lang, lang);
    assert.equal(dict.dir, lang === "fa" ? "rtl" : "ltr");
    assert.ok(dict.appName && dict.safetyBannerText && dict.provenanceDrawerTitle, lang);
  }
  assert.deepEqual(
    Object.keys(UI_DICTIONARY.fa).sort(),
    Object.keys(UI_DICTIONARY.en).sort(),
    "both languages must expose the same keys"
  );
});

test("persian safety banner states non-authority and zero living-person data", () => {
  const banner = UI_DICTIONARY.fa.safetyBannerText;
  assert.match(banner, /دولت/);
  assert.match(banner, /انتخابات/);
  assert.match(banner, /افراد زنده/);
});

test("every epistemic status has a bilingual label with a tonal cue", () => {
  for (const [status, label] of Object.entries(EPISTEMIC_LABELS)) {
    assert.ok(label.fa && label.en, status);
    assert.ok(label.tone, status);
  }
  assert.equal(Object.keys(EPISTEMIC_LABELS).length, 7);
});
