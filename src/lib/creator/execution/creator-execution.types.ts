import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { CreatorWorkflowReadinessReport, CreatorProductionPackage } from "../workflow/creator-workflow.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorProjectSnapshot, ProjectSubsystem, CreatorProjectAssetItem } from "../project/creator-project.types";
export type { CreatorProjectAssetItem } from "../project/creator-project.types";

export type ExecutionStatus =
  | 'PREVIEWED'
  | 'PLANNED'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'STAGING'
  | 'STAGED'
  | 'VALIDATING'
  | 'VALIDATED'
  | 'COMMITTING'
  | 'COMMITTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'BLOCKED'
  | 'VALIDATION_FAILED'
  | 'EXECUTION_FAILED'
  | 'ROLLBACK_REQUIRED'
  | 'ROLLED_BACK';

export type ExecutionTriggerType =
  | 'RESEARCH_CHANGE'
  | 'EVIDENCE_HEALTH'
  | 'HEALTH_DECISION'
  | 'PROJECT_IMPACT_PREVIEW'
  | 'MANUAL_CREATOR_REQUEST'
  | 'SCRIPT_CHANGE'
  | 'EDITOR_TIMELINE_CHANGE';

export type ExecutionOperationType =
  | 'REVALIDATE_CLAIM'
  | 'REGENERATE_SCRIPT_SECTION'
  | 'REGENERATE_FULL_SCRIPT'
  | 'REGENERATE_TALKING_POINT'
  | 'REGENERATE_BROLL'
  | 'REGENERATE_BENCHMARK_CARD'
  | 'REGENERATE_CHAPTERS'
  | 'REGENERATE_TELEPROMPTER'
  | 'REGENERATE_TIMELINE_MARKERS'
  | 'REGENERATE_PUBLISHING_ASSET'
  | 'REGENERATE_DISTRIBUTION_PACKAGE'
  | 'SYNC_EDITOR_TIMELINE'
  | 'REBUILD_PRODUCTION_PACKAGE'
  | 'REBUILD_PUBLISHING_PACKAGE'
  | 'REBUILD_DISTRIBUTION_PACKAGE';

export interface CreatorExecutionOperation {
  id: string;
  operationType: ExecutionOperationType;
  targetId: string;
  targetLabel: string;
  subsystem: ProjectSubsystem;
  order: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  reason: string;
  upstreamEvidenceIds: string[];
}

export interface CreatorExecutionPlan {
  executionPlanId: string;
  userId: string;
  researchRunId: string;
  projectSnapshotHash: string;
  sourceSnapshotHash: string;
  currentScriptVersion: number;
  targetScriptVersion: number;
  createdAt: string;
  createdBy: string;
  triggerType: ExecutionTriggerType;
  rootCause: string;
  affectedNodes: string[];
  affectedClaims: string[];
  affectedAssets: CreatorProjectAssetItem[];
  proposedOperations: CreatorExecutionOperation[];
  dependencyOrder: string[];
  safetyChecks: {
    passed: boolean;
    blockers: string[];
    warnings: string[];
  };
  expectedImpact: {
    willChangeCount: number;
    mayChangeCount: number;
    unchangedCount: number;
    blockedCount: number;
  };
  requiredApprovals: string[];
  executionStatus: ExecutionStatus;
  validationRequirements: string[];
  rollbackMetadata?: {
    previousScriptVersion: number;
    previousProjectSnapshotHash: string;
  };
}

export interface CreatorExecutionApproval {
  approvalId: string;
  userId: string;
  researchRunId: string;
  executionPlanId: string;
  approvedOperations: string[];
  rejectedOperations: string[];
  approvalTimestamp: string;
  projectSnapshotHash: string;
  acknowledgmentOfConsequences: boolean;
  approvalStatus: 'APPROVED' | 'PARTIALLY_APPROVED' | 'REJECTED';
  notes?: string;
}

export interface CreatorStagedExecution {
  stagedExecutionId: string;
  executionPlanId: string;
  userId: string;
  researchRunId: string;
  stagedScriptVersion: number;
  stagedReport: CreatorStudioReport;
  stagedEvidenceSnapshotHash: string;
  stagedProjectSnapshot: CreatorProjectSnapshot;
  stagedProductionPackage?: CreatorProductionPackage;
  stagedPreflight?: PublishingPreflightReport;
  stagedDistributionPackage?: CreatorDistributionPackage;
  stagedAt: string;
  status: 'STAGED' | 'VALIDATING' | 'VALIDATED' | 'COMMITTED' | 'ROLLED_BACK';
}

export interface CreatorExecutionValidationReport {
  validationId: string;
  executionPlanId: string;
  projectSnapshotBefore: string;
  projectSnapshotAfter: string;
  evidenceSnapshotBefore: string;
  evidenceSnapshotAfter: string;
  scriptVersionBefore: number;
  scriptVersionAfter: number;
  contentQualityBefore: number;
  contentQualityAfter: number;
  researchHealthBefore: number;
  researchHealthAfter: number;
  productionReadinessBefore: number;
  productionReadinessAfter: number;
  publishingReadinessBefore: number;
  publishingReadinessAfter: number;
  distributionReadinessBefore: number;
  distributionReadinessAfter: number;
  newBlockers: string[];
  resolvedBlockers: string[];
  remainingBlockers: string[];
  staleAssets: string[];
  safetyViolations: string[];
  validationStatus: 'VALIDATED' | 'VALIDATION_FAILED' | 'VALIDATION_WITH_WARNINGS';
  failureReasons: string[];
  checkedAt: string;
}

export interface CreatorExecutionAuditEvent {
  auditId: string;
  executionPlanId: string;
  userId: string;
  researchRunId: string;
  action:
    | 'PLAN_CREATED'
    | 'APPROVAL_GRANTED'
    | 'APPROVAL_REJECTED'
    | 'STAGING_STARTED'
    | 'STAGING_COMPLETED'
    | 'VALIDATION_STARTED'
    | 'VALIDATION_PASSED'
    | 'VALIDATION_FAILED'
    | 'COMMIT_STARTED'
    | 'COMMIT_SUCCESS'
    | 'COMMIT_BLOCKED_STALE'
    | 'ROLLBACK_EXECUTED';
  previousSnapshot: string;
  newSnapshot: string;
  previousScriptVersion: number;
  newScriptVersion: number;
  affectedNodes: string[];
  affectedAssets: string[];
  executionResult: string;
  validationResult?: string;
  commitResult?: string;
  rollbackResult?: string;
  timestamp: string;
  failureReason?: string;
}
