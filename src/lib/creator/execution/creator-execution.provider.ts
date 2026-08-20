import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorExecutionPlanEngine } from "./creator-execution.plan";
import { CreatorExecutionApprovalEngine } from "./creator-execution.approval";
import { CreatorExecutionStagingEngine } from "./creator-execution.staging";
import { CreatorExecutionValidationEngine } from "./creator-execution.validation";
import { CreatorExecutionCommitEngine } from "./creator-execution.commit";
import { CreatorExecutionRollbackEngine } from "./creator-execution.rollback";
import { CreatorExecutionAuditService } from "./creator-execution.audit";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";
import {
  CreatorExecutionPlan,
  CreatorExecutionApproval,
  CreatorStagedExecution,
  CreatorExecutionValidationReport,
  CreatorExecutionAuditEvent,
  ExecutionTriggerType,
} from "./creator-execution.types";

const globalForExecutionStore = globalThis as unknown as {
  creatorExecutionPlanStore: Map<string, CreatorExecutionPlan> | undefined;
  creatorStagedExecutionStore: Map<string, CreatorStagedExecution> | undefined;
};

const planStore =
  globalForExecutionStore.creatorExecutionPlanStore ?? new Map<string, CreatorExecutionPlan>();
const stagedStore =
  globalForExecutionStore.creatorStagedExecutionStore ?? new Map<string, CreatorStagedExecution>();

if (process.env.NODE_ENV !== "production") {
  globalForExecutionStore.creatorExecutionPlanStore = planStore;
  globalForExecutionStore.creatorStagedExecutionStore = stagedStore;
}

export class CreatorExecutionProvider {
  /**
   * Generates a deterministic execution plan and persists it in memory.
   */
  static createPlan(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    triggerType: ExecutionTriggerType,
    rootCause: string,
    affectedClaimIds: string[] = [],
    targetAssetIds: string[] = [],
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage,
    userId: string = "anonymous-creator"
  ): CreatorExecutionPlan {
    const plan = CreatorExecutionPlanEngine.createPlan(
      session,
      report,
      triggerType,
      rootCause,
      affectedClaimIds,
      targetAssetIds,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage,
      userId
    );

    const storeKey = `${userId}:${session.id}`;
    planStore.set(plan.executionPlanId, plan);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", plan.executionPlanId, plan).catch(e => console.warn(e));
    planStore.set(storeKey, plan);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", storeKey, plan).catch(e => console.warn(e));

    return plan;
  }

  /**
   * Retrieves an execution plan by planId or latest runId.
   */
  static getPlan(
    planId: string,
    userId: string = "anonymous-creator"
  ): CreatorExecutionPlan | undefined {
    const plan = planStore.get(planId);
    if (!plan || (plan.userId !== userId && plan.userId !== "anonymous-creator" && userId !== "anonymous-creator")) {
      return undefined;
    }
    return plan;
  }

  /**
   * Retrieves the latest active execution plan for a given research run.
   */
  static getActivePlan(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorExecutionPlan | undefined {
    const storeKey = `${userId}:${researchRunId}`;
    return planStore.get(storeKey);
  }

  /**
   * Approves selected operations in a plan.
   */
  static approvePlan(
    plan: CreatorExecutionPlan,
    approvedOperationIds: string[],
    rejectedOperationIds: string[] = [],
    acknowledgmentOfConsequences: boolean = true,
    notes?: string,
    currentProjectSnapshotHash?: string,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    approval?: CreatorExecutionApproval;
    updatedPlan?: CreatorExecutionPlan;
    errorMessage?: string;
  } {
    const result = CreatorExecutionApprovalEngine.processApproval(
      plan,
      approvedOperationIds,
      rejectedOperationIds,
      acknowledgmentOfConsequences,
      notes,
      currentProjectSnapshotHash,
      userId
    );

    if (result.success && result.updatedPlan) {
      planStore.set(plan.executionPlanId, result.updatedPlan);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", plan.executionPlanId, result.updatedPlan).catch(e => console.warn(e));
      planStore.set(`${userId}:${plan.researchRunId}`, result.updatedPlan);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("planStore", "Artifact", `${userId}:${plan.researchRunId}`, result.updatedPlan).catch(e => console.warn(e));
    }

    return result;
  }

  /**
   * Stages approved operations in an isolated workspace.
   */
  static stageExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    plan: CreatorExecutionPlan,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    stagedExecution?: CreatorStagedExecution;
    errorMessage?: string;
  } {
    const result = CreatorExecutionStagingEngine.executeStaging(
      session,
      activeReport,
      plan,
      preferences,
      profile,
      userId
    );

    if (result.success && result.stagedExecution) {
      stagedStore.set(result.stagedExecution.stagedExecutionId, result.stagedExecution);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("stagedStore", "Artifact", result.stagedExecution.stagedExecutionId, result.stagedExecution).catch(e => console.warn(e));
      stagedStore.set(`${userId}:${session.id}`, result.stagedExecution);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("stagedStore", "Artifact", `${userId}:${session.id}`, result.stagedExecution).catch(e => console.warn(e));
    }

    return result;
  }

  /**
   * Retrieves the latest staged execution for a session.
   */
  static getStagedExecution(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorStagedExecution | undefined {
    return stagedStore.get(`${userId}:${researchRunId}`);
  }

  /**
   * Validates a staged execution across all 5 authoritative dimensions.
   */
  static validateExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    staged: CreatorStagedExecution,
    plan: CreatorExecutionPlan,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    report: CreatorExecutionValidationReport;
  } {
    return CreatorExecutionValidationEngine.validateStagedExecution(
      session,
      activeReport,
      staged,
      plan,
      userId
    );
  }

  /**
   * Commits a validated staged execution to active project state.
   */
  static commitExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    staged: CreatorStagedExecution,
    plan: CreatorExecutionPlan,
    currentProjectSnapshotHash: string,
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    committedReport?: CreatorStudioReport;
    errorMessage?: string;
    rebaseRequired?: boolean;
  } {
    const result = CreatorExecutionCommitEngine.commitExecution(
      session,
      activeReport,
      staged,
      plan,
      currentProjectSnapshotHash,
      userId
    );

    if (result.success) {
      stagedStore.delete(`${userId}:${session.id}`);
      planStore.delete(`${userId}:${session.id}`);
    }

    return result;
  }

  /**
   * Non-destructive rollback.
   */
  static rollbackExecution(
    session: ResearchRunSession,
    activeReport: CreatorStudioReport,
    plan: CreatorExecutionPlan,
    staged?: CreatorStagedExecution,
    reason: string = "Creator initiated rollback",
    userId: string = "anonymous-creator"
  ): {
    success: boolean;
    restoredReport: CreatorStudioReport;
    message: string;
  } {
    const result = CreatorExecutionRollbackEngine.rollbackExecution(
      session,
      activeReport,
      plan,
      staged,
      reason,
      userId
    );

    stagedStore.delete(`${userId}:${session.id}`);
    planStore.delete(`${userId}:${session.id}`);

    return result;
  }

  /**
   * Retrieves audit ledger history.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorExecutionAuditEvent[] {
    return CreatorExecutionAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears state (for testing isolation).
   */
  static clearStore(): void {
    planStore.clear();
    stagedStore.clear();
    CreatorExecutionAuditService.clearHistory();
  }
}
