// ESLint flat config — correctness rules only.
//
// Deliberately not a formatter: the repository has a hand-written style
// (2-space indent, double quotes, semicolons, ESM, `.mjs` for pure logic and
// `.jsx` for components) and a project-wide reformat would bury every real diff.
// What this file enforces is the class of bug that tests do not catch — a hook
// called conditionally, a stale dependency array, an unused binding, a
// `prefer-const` that hides a reassignment.
//
// Run: `npm run lint` (also part of `npm run check` and `node scripts/agent/run.mjs`).
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const IGNORES = [
  "**/node_modules/**",
  "**/dist/**",
  "**/coverage/**",
  "**/.test-build-*/**",
  "apps/web/.tests-*/**",
  "data/**",
  "scripts/audit/shots/**"
];

export default [
  { ignores: IGNORES },

  {
    files: ["**/*.{js,mjs,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: { react, "react-hooks": reactHooks },
    // Automatic JSX runtime: React need not be in scope, but a component used
    // only in JSX must count as used (core no-unused-vars cannot see that).
    settings: { react: { version: "detect" } },
    rules: {
      ...js.configs.recommended.rules,

      // The hooks rules are the reason this file exists: a conditional hook or a
      // stale dependency array is invisible to the render tests.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "off",
      "react/jsx-key": "error",

      // Unused code is a claim about the codebase that is not true.
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
          ignoreRestSiblings: true
        }
      ],

      // Cheap correctness, no taste.
      eqeqeq: ["error", "smart"],
      "no-var": "error",
      "prefer-const": "error",
      "no-throw-literal": "error",
      "no-unreachable": "error",
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "warn"
    }
  },

  // Injected by Vite `define` at build time (see vite.config.js); guarded reads
  // in lib/build.js fall back when they are absent.
  {
    files: ["apps/web/src/**/*.{js,jsx,mjs}"],
    languageOptions: { globals: { __CEP_VERSION__: "readonly", __CEP_COMMIT__: "readonly" } }
  },

  // The audit scripts run inside the page, where `axe` is a global injected by
  // the axe-core bundle rather than an import.
  {
    files: ["scripts/audit/**/*.mjs"],
    languageOptions: { globals: { ...globals.node, axe: "readonly" } }
  },

  // Node-side tooling may log; the browser app may not (the privacy posture is
  // "no analytics", and the error boundary is the only allowed console caller).
  {
    files: ["scripts/**/*.{js,mjs}", "*.config.js", "eslint.config.js", "apps/*/vite.config.js"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-console": "off" }
  },
  {
    files: ["apps/web/src/**/*.{js,jsx,mjs}", "packages/**/*.mjs"],
    rules: { "no-console": ["error", { allow: ["error", "warn"] }] }
  },

  // Tests and fixtures: the `node:test` style uses assertions that look unused
  // to a linter, and fixture files legitimately contain odd shapes.
  {
    files: ["**/test/**/*.{js,mjs}", "**/*.test.mjs"],
    languageOptions: { globals: { ...globals.node } },
    rules: { "no-unused-expressions": "off" }
  }
];
