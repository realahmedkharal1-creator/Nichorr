export * from "./publishing.types";
export * from "./publishing.audit";
export * from "./publishing.connection";
export * from "./publishing.preflight";
export * from "./publishing.plan";
export * from "./publishing.receipt";
export * from "./publishing.verification";
export * from "./publishing.orchestrator";

import {
  DistributionReceipt,
  PostPublishVerificationReport,
  PublishingAuditEvent,
  PublishingPlan,
  PublishingTargetPlan,
  SchedulingConfig,
} from "./publishing.types";
import { PublishingPlanEngine } from "./publishing.plan";
import { PublishingOrchestratorEngine } from "./publishing.orchestrator";
import { PublishingAuditService } from "./publishing.audit";
import { DistributionReceiptLedger } from "./publishing.receipt";
import { PostPublishVerificationEngine } from "./publishing.verification";

const globalForPublishingProvider = globalThis as unknown as {
  creatorPublishingStore: {
    plans: Map<string, PublishingPlan>;
  } | undefined;
};

const publishingStore = globalForPublishingProvider.creatorPublishingStore ?? {
  plans: new Map<string, PublishingPlan>(),
};
if (process.env.NODE_ENV !== "production")
  globalForPublishingProvider.creatorPublishingStore = publishingStore;

export class CreatorPublishingProvider {
  /**
   * Retrieves or initializes the active multi-channel publishing plan for a research run.
   */
  static getPublishingPlan(
    researchRunId: string,
    userId: string = "anonymous-creator",
    context: any = {}
  ): PublishingPlan {
    const key = `${userId}:${researchRunId}`;
    let plan = publishingStore.plans.get(key);
    if (!plan) {
      plan = PublishingPlanEngine.createPublishingPlan(userId, researchRunId, context);
      publishingStore.plans.set(key, plan);
    }
    return plan;
  }

  /**
   * Creates or regenerates a multi-channel publishing plan.
   */
  static createPublishingPlan(
    userId: string,
    researchRunId: string,
    context: any = {}
  ): PublishingPlan {
    const plan = PublishingPlanEngine.createPublishingPlan(userId, researchRunId, context);
    const key = `${userId}:${researchRunId}`;
    publishingStore.plans.set(key, plan);
    return plan;
  }

  /**
   * Grants explicit creator approval for a target.
   */
  static approveTarget(
    planId: string,
    targetId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    const plan = this.getPublishingPlan(researchRunId, userId);
    if (plan.planId !== planId) {
      return { success: false, error: "Plan ID mismatch." };
    }
    return PublishingOrchestratorEngine.approveTarget(plan, targetId, userId);
  }

  /**
   * Stages a target for publishing.
   */
  static stageTarget(
    planId: string,
    targetId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    const plan = this.getPublishingPlan(researchRunId, userId);
    if (plan.planId !== planId) {
      return { success: false, error: "Plan ID mismatch." };
    }
    return PublishingOrchestratorEngine.stageTarget(plan, targetId, userId);
  }

  /**
   * Executes publishing or local staging for a target.
   */
  static publishTarget(
    planId: string,
    targetId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    const plan = this.getPublishingPlan(researchRunId, userId);
    if (plan.planId !== planId) {
      return { success: false, error: "Plan ID mismatch." };
    }
    return PublishingOrchestratorEngine.publishTarget(plan, targetId, userId);
  }

  /**
   * Configures timezone-safe scheduling.
   */
  static scheduleTarget(
    planId: string,
    targetId: string,
    config: SchedulingConfig,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    const plan = this.getPublishingPlan(researchRunId, userId);
    if (plan.planId !== planId) {
      return { success: false, error: "Plan ID mismatch." };
    }
    return PublishingOrchestratorEngine.scheduleTarget(plan, targetId, config, userId);
  }

  /**
   * Cancels a publishing target.
   */
  static cancelTarget(
    planId: string,
    targetId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    const plan = this.getPublishingPlan(researchRunId, userId);
    if (plan.planId !== planId) {
      return { success: false, error: "Plan ID mismatch." };
    }
    return PublishingOrchestratorEngine.cancelTarget(plan, targetId, userId);
  }

  /**
   * Verifies external publication without fake confirmation.
   */
  static verifyPublication(
    receiptId: string,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): PostPublishVerificationReport {
    const receipt = DistributionReceiptLedger.getReceiptById(receiptId, researchRunId, userId);
    if (!receipt) {
      return {
        verificationId: `ppv-missing-${Date.now().toString(36)}`,
        receiptId,
        targetId: "unknown",
        platform: "YOUTUBE_LONG_FORM",
        status: "FAILED",
        externalIdConfirmed: false,
        assetMatchConfirmed: false,
        metadataMatchConfirmed: false,
        checkedAt: new Date().toISOString(),
        notes: "Distribution receipt not found.",
      };
    }
    return PostPublishVerificationEngine.verifyPublication(receipt, receipt.platform);
  }

  /**
   * Retrieves distribution receipts.
   */
  static getReceipts(researchRunId: string, userId: string = "anonymous-creator"): DistributionReceipt[] {
    return DistributionReceiptLedger.getReceipts(researchRunId, userId);
  }

  /**
   * Retrieves audit ledger history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): PublishingAuditEvent[] {
    return PublishingAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory cache.
   */
  static clearCache(): void {
    publishingStore.plans.clear();
    PublishingAuditService.clearHistory();
    DistributionReceiptLedger.clearReceipts();
  }
}
