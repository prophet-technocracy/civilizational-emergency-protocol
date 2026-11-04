#!/usr/bin/env node
// CEP 77-Column Historical Dossier CSV Validation CLI
// Enforces CEP-IRAN-003 (Data Classification & Living-Person Exclusion)
// and CEP-IRAN-005 (Deceased-Only CSV Schema & Provenance Validation).

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateHistoricalDossierCsv } from "../../packages/schemas/index.mjs";

const targetPath = process.argv[2] ?? "data/synthetic/synthetic-deceased-archive-sample.csv";
const resolvedPath = resolve(process.cwd(), targetPath);

try {
  const csvContent = readFileSync(resolvedPath, "utf8");
  const report = validateHistoricalDossierCsv(csvContent, {
    hasPublicationLicenseConfirmation: false,
    hasHumanEditorialSignOff: false
  });

  console.log("=== CEP 77-COLUMN HISTORICAL DOSSIER VALIDATION REPORT ===");
  console.log(`File:                   ${targetPath}`);
  console.log(`Schema & Safety Valid:  ${report.valid ? "PASS" : "FAIL"}`);
  console.log(`Rows Validated:         ${report.rowCount}`);
  console.log(`Living Rows Detected:   ${report.stats.livingRowCount} (MUST BE 0)`);
  console.log(`High Re-ID Risk Rows:   ${report.stats.highReidentificationCount} (MUST BE 0)`);
  console.log(
    `Public Release Gate:    ${
      report.publicationGatePassed
        ? "APPROVED FOR STATIC CATALOGUE"
        : "GATED (Synthetic Demo Allowed; External Dataset Requires License + Human Editorial Sign-Off)"
    }`
  );

  if (report.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const w of report.warnings) {
      console.log(`  [WARN] ${w}`);
    }
  }

  if (!report.valid) {
    console.error("\nValidation Errors:");
    for (const err of report.errors) {
      console.error(`  [ERROR] ${err}`);
    }
    process.exit(1);
  }
} catch (error) {
  console.error(`Failed to validate CSV at ${resolvedPath}: ${error.message}`);
  process.exit(1);
}
