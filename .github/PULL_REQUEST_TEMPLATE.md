## What does this change do?

## Why is this change needed?

## Related issue(s)

## Evidence and sources
- 

## Risks and safeguards
- Privacy:
- Security:
- Human rights:
- Accessibility:
- Misuse:

## UX (interface changes only)
- [ ] Checked fa (RTL) and en (LTR), light and dark, at 390 px and 1440 px.
- [ ] No slash ratios; numbers go through `formatNumber`; no Arabic `ي`/`ك`; ZWNJ where the glossary requires it.
- [ ] New strings exist in both `locales/fa/` and `locales/en/`.
- [ ] Focus order, focus return and inert backgrounds unchanged or improved; hit areas >= 24 px.
- [ ] `node scripts/audit/a11y.mjs` prints `{}`, `keyboard.mjs` passes, `layout.mjs` is clean.
- [ ] Before/after rating and the "not done yet" list are below.
- [Checklist](../docs/ux/AGENT-UX-CHECKLIST.md)

## Validation
- [ ] `node scripts/agent/run.mjs --full` exits 0 (the same check CI runs).
- [ ] The task id is in the title (`ENG-043: …`) and a test fails without this change.
- [ ] I checked links, spelling and formatting.
- [ ] I ran relevant tests (or explained why none apply).
- [ ] I disclosed meaningful AI assistance.
- [ ] I have not included secrets or personal/sensitive data.
- [ ] I understand this PR is a proposal and may require community review.
