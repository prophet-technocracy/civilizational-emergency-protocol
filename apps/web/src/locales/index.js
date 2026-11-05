// Locale registry. New interface surface should read its copy from here rather
// than adding more keys to the legacy UI dictionary in i18n.js, which is
// gradually being migrated module by module.
import { levelsFa, policyFa } from "./fa/levels.js";
import { levelsEn, policyEn } from "./en/levels.js";
import { bankFa } from "./fa/bank.js";
import { bankEn } from "./en/bank.js";
import { principlesFa } from "./fa/principles.js";
import { principlesEn } from "./en/principles.js";
import { hubFa } from "./fa/hub.js";
import { hubEn } from "./en/hub.js";
import { programmeFa } from "./fa/programme.js";
import { programmeEn } from "./en/programme.js";
import { referendumFa } from "./fa/referendum.js";
import { shellFa } from "./fa/shell.js";
import { referendumEn } from "./en/referendum.js";
import { shellEn } from "./en/shell.js";

export const LOCALES = Object.freeze({
  fa: Object.freeze({
    levels: levelsFa,
    policies: policyFa,
    bank: bankFa,
    principles: principlesFa,
    hub: hubFa,
    programme: programmeFa,
    referendum: referendumFa,
    shell: shellFa
  }),
  en: Object.freeze({
    levels: levelsEn,
    policies: policyEn,
    bank: bankEn,
    principles: principlesEn,
    hub: hubEn,
    programme: programmeEn,
    referendum: referendumEn,
    shell: shellEn
  })
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
