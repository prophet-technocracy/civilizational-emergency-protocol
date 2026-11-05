// Locale registry. New interface surface should read its copy from here rather
// than adding more keys to the legacy UI dictionary in i18n.js, which is
// gradually being migrated module by module.
import { levelsFa, policyFa } from "./fa/levels.js";
import { levelsEn, policyEn } from "./en/levels.js";

export const LOCALES = Object.freeze({
  fa: Object.freeze({ levels: levelsFa, policies: policyFa }),
  en: Object.freeze({ levels: levelsEn, policies: policyEn })
});

export const LOCALE_KEYS = Object.freeze(["fa", "en"]);

/** Copy for one locale; falls back to Persian so a missing key is visible. */
export function localeStrings(lang) {
  return LOCALES[lang] ?? LOCALES.fa;
}

/** Policy label by id, in the active locale. */
export function policyLabel(policyId, lang) {
  const copy = localeStrings(lang).policies;
  return copy[policyId] ?? policyId;
}
