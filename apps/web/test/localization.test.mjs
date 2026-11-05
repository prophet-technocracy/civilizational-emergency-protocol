// Persian-first localization checks.
//
// These run without a browser and without the API: they read the locale files
// and the shared UI dictionary directly, so a mistyped Arabic character or a
// missing English string fails the build rather than reaching a screen.
import assert from "node:assert/strict";
import test from "node:test";
import {
  GLOSSARY,
  findArabicVariants,
  findGlossaryViolations,
  flattenStrings,
  looksLikeIdentifier
} from "@cep/localization/glossary";
import { LOCALES } from "../src/locales/index.js";
import { UI } from "../src/i18n.js";

const localePairs = () => {
  const pairs = [];
  for (const lang of Object.keys(LOCALES)) {
    for (const [path, value] of flattenStrings(LOCALES[lang])) pairs.push({ lang, path, value });
  }
  for (const [path, value] of flattenStrings(UI.fa)) pairs.push({ lang: "fa", path: `ui.${path}`, value });
  for (const [path, value] of flattenStrings(UI.en)) pairs.push({ lang: "en", path: `ui.${path}`, value });
  return pairs;
};

test("the Persian and English locale files define exactly the same keys", () => {
  const paths = (lang) => flattenStrings(LOCALES[lang]).map(([path]) => path).sort();
  assert.deepEqual(paths("fa"), paths("en"));
  assert.ok(paths("fa").length > 60, "the locale tables should not be near-empty");
});

test("the shared UI dictionary has no Persian-only keys", () => {
  const fa = Object.keys(UI.fa).sort();
  const en = Object.keys(UI.en).sort();
  assert.deepEqual(fa, en);
});

test("no Persian copy uses an Arabic letter where Persian requires its own", () => {
  for (const { lang, path, value } of localePairs()) {
    if (lang !== "fa") continue;
    const found = findArabicVariants(value);
    assert.deepEqual(found, [], `${path} contains ${found.map((item) => `${item.from} instead of ${item.to}`).join(", ")}`);
  }
});

test("Persian copy uses the canonical glossary term for every concept", () => {
  for (const { lang, path, value } of localePairs()) {
    if (lang !== "fa") continue;
    const violations = findGlossaryViolations(value, lang);
    assert.deepEqual(violations, [], `${path} uses a discouraged variant of ${violations.join(", ")}`);
  }
});

test("the canonical spellings actually appear where the concept is used", () => {
  const fa = flattenStrings(UI.fa).map((pair) => pair[1]).join(" ");
  assert.ok(fa.includes("برگهٔ رأی") || GLOSSARY.some((entry) => entry.fa === "برگهٔ رأی"));
  const ownCopy = flattenStrings(LOCALES.fa).map((pair) => pair[1]).join(" ");
  for (const term of ["برگهٔ رأی", "غیرالزام‌آور", "ساختگی", "وزن‌دهی", "پشتوانه", "سقف عرضه", "عرضهٔ در گردش", "بازخرید", "اثبات ذخیره"]) {
    assert.ok(ownCopy.includes(term), `the level copy never uses the canonical term «${term}»`);
  }
  // Terms that belong to the API payloads (level titles, module titles) are
  // asserted where that payload is rendered: test/render.test.mjs and
  // apps/api/test/server.test.mjs.
});

test("half-space is used in the compound terms that require it", () => {
  const ownCopy = flattenStrings(LOCALES.fa).map((pair) => pair[1]).join(" ");
  for (const compound of ["غیرالزام‌آور", "وزن‌دهی", "پیش‌نویس"]) {
    if (!compound.includes("\u200c")) continue;
    assert.ok(ownCopy.includes(compound), `missing the zero-width non-joiner in «${compound}»`);
  }
  // The same compounds must never be written with a plain space instead.
  for (const wrong of ["غیر الزام آور", "وزن دهی", "پیش نویس"]) {
    assert.equal(ownCopy.includes(wrong), false, `plain-space variant «${wrong}» found`);
  }
});

test("every interface string is translated, not left identical to its source", () => {
  const fa = Object.fromEntries(flattenStrings(LOCALES.fa));
  const en = Object.fromEntries(flattenStrings(LOCALES.en));
  for (const [path, value] of Object.entries(fa)) {
    if (looksLikeIdentifier(value)) continue;
    assert.notEqual(value, en[path], `${path} is untranslated (identical in fa and en)`);
  }
  const faUi = Object.fromEntries(flattenStrings(UI.fa));
  const enUi = Object.fromEntries(flattenStrings(UI.en));
  let compared = 0;
  for (const [path, value] of Object.entries(faUi)) {
    if (looksLikeIdentifier(value)) continue;
    if (!/[\p{Script=Arabic}]/u.test(value)) continue;
    compared += 1;
    assert.notEqual(value, enUi[path], `ui.${path} is untranslated`);
  }
  assert.ok(compared > 40, "expected to compare the bulk of the UI dictionary");
});

test("no Persian copy is empty or whitespace-only", () => {
  for (const { lang, path, value } of localePairs()) {
    if (lang !== "fa") continue;
    assert.ok(value.trim().length > 0, `${path} is empty`);
  }
});

test("each glossary entry is complete enough to review", () => {
  const ids = new Set();
  for (const entry of GLOSSARY) {
    assert.equal(ids.has(entry.id), false, `duplicate glossary id ${entry.id}`);
    ids.add(entry.id);
    assert.ok(entry.fa && entry.en, `${entry.id} is missing a term`);
    assert.ok(entry.note.fa.length > 10 && entry.note.en.length > 10, `${entry.id} is missing a note`);
    assert.ok(entry.avoid.length > 0, `${entry.id} lists no discouraged variants`);
    assert.equal(findArabicVariants(entry.fa).length, 0, `${entry.id} preferred term has an Arabic letter`);
  }
});
