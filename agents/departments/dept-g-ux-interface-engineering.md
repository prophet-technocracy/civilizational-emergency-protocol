# Department G — User Experience and Interface Engineering

- **Department ID:** `DEPT-G`
- **Lead Role:** Principal Design Systems & Civic UX Director
- **Designated Branch:** `feature/cep-experience` (tracked on session branch `arena/4c526f6a-civilizational-emergency-proto`)
- **Current Status:** Complete (Awaiting Human Maintainer Review)

## 1. Mission & Mandate

Design and implement the complete user experience of the CEP Civic Operating System Prototype (**Modules 01–12**), combining the precision of an aerospace mission-control console with the clarity, warmth, and accessibility of a top-tier public digital service.

## 2. Responsibilities

- Build a **Persian-first (`lang="fa" dir="rtl"`)**, **English-ready (`lang="en" dir="ltr"`)** bilingual interface with instant language switching, localized numerals (`۰-۹` / `0-9`), and dual-calendar (Solar Hijri / Gregorian) formatting.
- Establish a cohesive design system with deep navy/charcoal institutional framing, restrained turquoise/teal accents, warm paper surfaces, plus an optional Mission-Control Dark Theme.
- Implement desktop collapsible sidebar navigation, mobile drawer navigation, global cross-module search, breadcrumbs, persistent synthetic-demo safety banner, interactive SVG charts/graphs, provenance slide-over drawer, and simulated notification toasts.
- Ensure zero dead buttons: every interactive control performs a real read-only exploration, simulation, filtering, inspection, or explains its non-operational prototype boundary clearly.
- Guarantee accessibility: keyboard navigation, skip links, focus management, ARIA landmarks, high contrast, and `prefers-reduced-motion` support.

## 3. Dependencies

- `DEPT-A`: API contracts and localization package (`packages/localization`).
- `DEPT-B` through `DEPT-F`: Module data models and domain logic.
- `DEPT-H`: Accessibility and privacy review.

## 4. Deliverables

- `packages/localization/index.mjs`
- Complete frontend application in `apps/web/src/` covering all 12 modules, global search, provenance drawer, and responsive design system (`apps/web/src/styles.css`).

## 5. Acceptance Criteria

- [x] Default view renders in intentional Persian RTL with proper typography and numeral handling.
- [x] Instant language switching between Persian (`fa`, RTL) and English (`en`, LTR) works across all 12 modules.
- [x] Persistent demo-mode and constitutional non-authority banner is visible across all views.
- [x] Mobile, tablet, and desktop layouts are responsive, keyboard navigable, and low-bandwidth friendly.
