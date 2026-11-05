// CEP Database-Ready Domain Models (17 Core Entities)
// Designed for relational/document persistence readiness while operating on
// immutable synthetic fixtures in the Phase 1–2 local read-only prototype.

export const EPISTEMIC_STATUSES = Object.freeze([
  "source-verified",
  "source-reported",
  "proposed",
  "hypothetical",
  "disputed",
  "unverified",
  "synthetic-fixture"
]);

export const STATEMENT_TYPES = Object.freeze([
  "fact",
  "author-statement",
  "interpretation",
  "hypothesis",
  "proposal",
  "speculation",
  "design-statement"
]);

export const REVIEW_STATUSES = Object.freeze([
  "draft",
  "pending-human-review",
  "editorial-reviewed",
  "disputed-interpretation",
  "blocked-gate",
  "synthetic-demo"
]);

export const ENTITY_CATALOGUE = Object.freeze({
  HistoricalPerson: {
    tableName: "historical_persons",
    primaryKey: "id",
    requiredFields: [
      "id",
      "fullNameFa",
      "fullNameEn",
      "alternativeSpellings",
      "status",
      "era",
      "birthYearDisplay",
      "deathYearDisplay",
      "birthPlace",
      "primaryField",
      "occupations",
      "isSynthetic"
    ],
    constraints: ["status === 'deceased'", "isSynthetic === true (until Gate G-02 passes)"]
  },
  HistoricalDossier: {
    tableName: "historical_dossiers",
    primaryKey: "dossierId",
    requiredFields: [
      "dossierId",
      "personId",
      "fullNameFa",
      "fullNameEn",
      "alternativeSpellings",
      "status",
      "historicalPeriod",
      "eraKey",
      "birthDate",
      "deathDate",
      "birthPlace",
      "region",
      "areasOfContribution",
      "disciplineKey",
      "occupations",
      "biographyFa",
      "biographyEn",
      "majorWorks",
      "importantEvents",
      "relationships",
      "citations",
      "sourceReliability",
      "conflictingAccounts",
      "editorialReviewStatus",
      "lastReviewDate",
      "revisionHistory",
      "syntheticLabel"
    ],
    foreignKeys: [{ field: "personId", references: "HistoricalPerson.id" }]
  },
  HistoricalSource: {
    tableName: "historical_sources",
    primaryKey: "id",
    requiredFields: [
      "id",
      "titleFa",
      "titleEn",
      "authorOrIssuer",
      "publicationYear",
      "sourceType",
      "reliabilityAssessment",
      "verificationStatus"
    ]
  },
  SourceDocument: {
    tableName: "source_documents",
    primaryKey: "id",
    requiredFields: [
      "id",
      "titleFa",
      "titleEn",
      "authorOrIssuer",
      "publicationDate",
      "version",
      "language",
      "pageCount",
      "licenseStatus",
      "reuseDecision",
      "verificationStatus",
      "limitationsFa",
      "limitationsEn"
    ]
  },
  EvidenceClaim: {
    tableName: "evidence_claims",
    primaryKey: "id",
    requiredFields: [
      "id",
      "claimTextFa",
      "claimTextEn",
      "classification",
      "sourceDocumentId",
      "sourceVersion",
      "pageOrSection",
      "publicationDate",
      "verificationStatus",
      "reviewerStatus",
      "confidenceAssessmentFa",
      "confidenceAssessmentEn",
      "knownContradictions",
      "lastReviewed",
      "revisionHistory"
    ],
    foreignKeys: [{ field: "sourceDocumentId", references: "SourceDocument.id" }]
  },
  Institution: {
    tableName: "institutions",
    primaryKey: "id",
    requiredFields: [
      "id",
      "nameFa",
      "nameEn",
      "category",
      "purposeFa",
      "purposeEn",
      "legalOrProposedBasisFa",
      "legalOrProposedBasisEn",
      "responsibilitiesFa",
      "responsibilitiesEn",
      "dependencies",
      "proposedOversightFa",
      "proposedOversightEn",
      "accountabilityMechanismsFa",
      "accountabilityMechanismsEn",
      "sunsetClauseFa",
      "sunsetClauseEn",
      "sourceReferences",
      "epistemicStatus"
    ]
  },
  InstitutionalRole: {
    tableName: "institutional_roles",
    primaryKey: "id",
    requiredFields: [
      "id",
      "institutionId",
      "titleFa",
      "titleEn",
      "mandateScopeFa",
      "mandateScopeEn",
      "selectionMethodProposalFa",
      "selectionMethodProposalEn",
      "termLimitProposal",
      "removalMechanismFa",
      "removalMechanismEn",
      "epistemicStatus"
    ],
    foreignKeys: [{ field: "institutionId", references: "Institution.id" }]
  },
  TransitionStage: {
    tableName: "transition_stages",
    primaryKey: "id",
    requiredFields: [
      "id",
      "horizonKey",
      "orderIndex",
      "titleFa",
      "titleEn",
      "durationLabelFa",
      "durationLabelEn",
      "summaryFa",
      "summaryEn",
      "sectorKey",
      "dependencies",
      "responsibleInstitutions",
      "milestones",
      "uncertaintyAnnotationFa",
      "uncertaintyAnnotationEn",
      "sourceReferences",
      "epistemicStatus",
      "versionHistory"
    ]
  },
  Project: {
    tableName: "public_good_projects",
    primaryKey: "id",
    requiredFields: [
      "id",
      "titleFa",
      "titleEn",
      "objectivesFa",
      "objectivesEn",
      "deliverables",
      "milestones",
      "publicDocumentationUrl",
      "responsibleWorkstream",
      "evidenceOfCompletionFa",
      "evidenceOfCompletionEn",
      "reviewStatus",
      "governancePrivilegeGranted"
    ]
  },
  ProjectMilestone: {
    tableName: "project_milestones",
    primaryKey: "id",
    requiredFields: [
      "id",
      "projectId",
      "titleFa",
      "titleEn",
      "status",
      "verificationMethodFa",
      "verificationMethodEn",
      "deliverableRef"
    ],
    foreignKeys: [{ field: "projectId", references: "Project.id" }]
  },
  GovernanceProposal: {
    tableName: "governance_proposals",
    primaryKey: "id",
    requiredFields: [
      "id",
      "titleFa",
      "titleEn",
      "problemStatementFa",
      "problemStatementEn",
      "alternativesConsidered",
      "rightsAndPrivacyImpactFa",
      "rightsAndPrivacyImpactEn",
      "status",
      "isCommunityRatified",
      "sourceRef"
    ]
  },
  Amendment: {
    tableName: "charter_amendments",
    primaryKey: "id",
    requiredFields: [
      "id",
      "targetDocument",
      "section",
      "summaryFa",
      "summaryEn",
      "rationaleFa",
      "rationaleEn",
      "proposedByRole",
      "date",
      "repositoryStatus",
      "ratificationStatus"
    ]
  },
  ReviewRecord: {
    tableName: "review_records",
    primaryKey: "id",
    requiredFields: [
      "id",
      "targetType",
      "targetId",
      "reviewerRole",
      "reviewType",
      "outcome",
      "conditionsOrDissentFa",
      "conditionsOrDissentEn",
      "reviewedAt"
    ]
  },
  VerificationBand: {
    tableName: "verification_bands",
    primaryKey: "bandNumber",
    requiredFields: [
      "bandNumber",
      "id",
      "nameFa",
      "nameEn",
      "questionAnsweredFa",
      "questionAnsweredEn",
      "minimumEvidenceFa",
      "minimumEvidenceEn",
      "permittedExampleActionsFa",
      "permittedExampleActionsEn",
      "explicitlyNotImpliedFa",
      "explicitlyNotImpliedEn",
      "privacySafeguardsFa",
      "privacySafeguardsEn"
    ]
  },
  AccessPolicy: {
    tableName: "access_policies",
    primaryKey: "actionId",
    requiredFields: [
      "actionId",
      "titleFa",
      "titleEn",
      "resource",
      "minimumBand",
      "requiredProofs",
      "purposeLimitationFa",
      "purposeLimitationEn",
      "expiryPolicy",
      "isConstitutionallyProhibited",
      "prohibitionReasonFa",
      "prohibitionReasonEn"
    ]
  },
  AuditEvent: {
    tableName: "audit_events",
    primaryKey: "id",
    requiredFields: [
      "id",
      "previousEventId",
      "timestamp",
      "actionType",
      "targetEntity",
      "changeSummaryFa",
      "changeSummaryEn",
      "responsibleProcessOrRole",
      "reasonFa",
      "reasonEn",
      "previousVersion",
      "newVersion",
      "reviewStatus",
      "approvalStatus",
      "cryptographicImmutabilityClaim"
    ]
  },
  DigitalLegacyConcept: {
    tableName: "digital_legacy_concepts",
    primaryKey: "clauseId",
    requiredFields: [
      "clauseId",
      "clauseNumber",
      "titleFa",
      "titleEn",
      "summaryFa",
      "summaryEn",
      "consentRequirementFa",
      "consentRequirementEn",
      "revocationRuleFa",
      "revocationRuleEn",
      "ethicalLegalRisksFa",
      "ethicalLegalRisksEn",
      "prohibitedInPrototypeFa",
      "prohibitedInPrototypeEn",
      "epistemicStatus"
    ]
  }
});

export function validateEntityShape(entityName, record) {
  const spec = ENTITY_CATALOGUE[entityName];
  if (!spec) {
    return { valid: false, errors: [`Unknown domain entity: ${entityName}`] };
  }
  if (!record || typeof record !== "object") {
    return { valid: false, errors: [`${entityName} record must be a non-null object`] };
  }

  const errors = [];
  for (const field of spec.requiredFields) {
    if (!(field in record) || record[field] === undefined || record[field] === null) {
      errors.push(`${entityName} missing required field: ${field}`);
    }
  }

  // Domain-specific constitutional invariants
  if (entityName === "HistoricalPerson" || entityName === "HistoricalDossier") {
    if (record.status !== "deceased") {
      errors.push(`${entityName} violation: only deceased records are permitted (got status=${record.status})`);
    }
  }
  if (entityName === "Project" && record.governancePrivilegeGranted !== false) {
    errors.push("Project violation: public-good projects must never grant governance privileges");
  }
  if (entityName === "GovernanceProposal" && record.isCommunityRatified !== false) {
    errors.push("GovernanceProposal violation: prototype must not claim community ratification");
  }
  if (entityName === "AuditEvent" && record.cryptographicImmutabilityClaim !== false) {
    errors.push("AuditEvent violation: ordinary application logs must not claim cryptographic immutability");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Influence, authority and qualification engine (Phase D).
export * from "./influence.mjs";
