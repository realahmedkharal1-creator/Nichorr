import { VerificationStatus, ScriptSectionType } from "../creator-studio.types";
import { AuthorityTier } from "@/lib/provenance/provenance.types";

export type QualityDimension = 
  | 'EVIDENCE_COVERAGE' 
  | 'PROVENANCE_TRACEABILITY' 
  | 'CONFLICT_DISCLOSURE' 
  | 'METHODOLOGY_DISCLOSURE' 
  | 'STYLE_COMPLIANCE' 
  | 'SAFETY_COMPLIANCE';

export interface ScriptQualityDimensionScore {
  dimension: QualityDimension;
  label: string;
  score: number; // 0.0 to 100.0
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'POOR';
  description: string;
  passedCount: number;
  totalCount: number;
}

export interface StatementEvidenceDetail {
  statementId: string;
  statementText: string;
  sectionType: ScriptSectionType;
  verificationStatus: VerificationStatus;
  claimId?: string;
  claimText?: string;
  evidenceId?: string;
  evidenceExcerpt?: string;
  sourceId?: string;
  publisher?: string;
  sourceUrl?: string;
  authorityTier?: AuthorityTier;
  independenceScore?: number;
  isSyndicated?: boolean;
  benchmarkMetric?: string;
  benchmarkScore?: string;
  youtubeTimestamp?: string;
  methodologyNotes?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  safetyWarning?: string;
}

export interface ScriptQualityReviewReport {
  researchRunId: string;
  overallQualityScore: number; // 0.0 to 100.0
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summaryText: string;
  dimensions: ScriptQualityDimensionScore[];
  statementEvidenceDetails: StatementEvidenceDetail[];
  unbackedStatementsCount: number;
  conflictedStatementsCount: number;
  doNotSayBlockedCount: number;
  reviewedAt: string;
}
