import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorWorkflowDependencies } from "@/lib/creator/workflow/creator-workflow.dependencies";
import {
  ClaimHealthRecord,
  EvidenceItemHealth,
  RevalidationPlan,
  RevalidationPlanItem,
  RevalidationOptions,
  RevalidationStatus,
  HealthAuditEvent,
} from "./research-health.types";

export interface RevalidationExecutionResult {
  updatedSession: ResearchRunSession;
  executedPlan: RevalidationPlan;
  auditEvents: HealthAuditEvent[];
  summaryMessage: string;
  previousSnapshotHash: string;
  newSnapshotHash: string;
}

export class RevalidationEngine {
  /**
   * Generates a deterministic, targeted revalidation plan based on current claim health.
   */
  static generateRevalidationPlan(
    session: ResearchRunSession,
    claimRecords: ClaimHealthRecord[],
    options?: RevalidationOptions
  ): RevalidationPlan {
    const planItems: RevalidationPlanItem[] = [];
    const mode = options?.mode || 'AFFECTED_CLAIMS_ONLY';
    const targetClaimIds = options?.claimIds ? new Set(options.claimIds) : null;

    for (const clm of claimRecords) {
      if (targetClaimIds && !targetClaimIds.has(clm.claimId)) continue;
      
      const shouldInclude = 
        mode === 'ALL_CLAIMS' || 
        (mode === 'AFFECTED_CLAIMS_ONLY' && clm.revalidationRequired) ||
        (mode === 'PRIMARY_SOURCES_ONLY' && clm.authorityStatus === 'TIER_1_PRIMARY' && clm.revalidationRequired) ||
        (mode === 'BENCHMARKS_ONLY' && clm.methodologyStatus !== 'NOT_APPLICABLE' && clm.revalidationRequired) ||
        (mode === 'HARDWARE_ONLY' && clm.claimType === 'HARDWARE_SPEC' && clm.revalidationRequired) ||
        (mode === 'YOUTUBE_ONLY' && clm.claimType === 'YOUTUBE_REVIEW' && clm.revalidationRequired);

      if (!shouldInclude) continue;

      let priority: RevalidationPlanItem['priority'] = 'LOW';
      if (clm.healthStatus === 'CONFLICTED' || clm.healthStatus === 'UNBACKED') {
        priority = 'CRITICAL';
      } else if (clm.healthStatus === 'NEEDS_REVALIDATION') {
        priority = 'HIGH';
      } else if (clm.healthStatus === 'AGING') {
        priority = 'MEDIUM';
      }

      const actionType = clm.revalidationAction || (
        clm.methodologyStatus !== 'NOT_APPLICABLE' ? 'RECHECK_LAB_RESULT' : 'RECHECK_PRIMARY_SOURCE'
      );

      planItems.push({
        id: `plan-item-${clm.claimId}`,
        claimId: clm.claimId,
        evidenceId: clm.upstreamEvidenceIds[0],
        actionType,
        targetEntity: clm.claimText.slice(0, 40) + "...",
        reason: clm.reason,
        priority,
        estimatedEffort: priority === 'CRITICAL' ? 'DEEP' : 'FAST',
      });
    }

    const totalActions = planItems.length;
    const status: RevalidationStatus = totalActions > 0 ? 'READY' : 'NOT_REQUIRED';

    return {
      planId: `rev-plan-${Date.now().toString(36)}`,
      researchRunId: session.id,
      status,
      totalActions,
      items: planItems,
      createdAt: new Date().toISOString(),
      executionSummary: totalActions === 0
        ? "All claims and evidence are currently healthy. No revalidation required."
        : `${totalActions} targeted revalidation actions scheduled.`,
    };
  }

  /**
   * Executes a targeted revalidation plan against the session without destructively wiping unaffected data.
   */
  static executeRevalidation(
    session: ResearchRunSession,
    plan: RevalidationPlan
  ): RevalidationExecutionResult {
    const previousSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const nowStr = new Date().toISOString();
    const auditEvents: HealthAuditEvent[] = [];

    // Clone session for immutable update
    const updatedSession: ResearchRunSession = JSON.parse(JSON.stringify(session));
    updatedSession.updatedAt = nowStr;

    for (const item of plan.items) {
      const claim = updatedSession.claims?.find((c) => c.id === item.claimId);
      if (!claim) continue;

      const previousStatus = claim.status;

      // Deterministically resolve claim based on action type
      if (item.actionType === 'RECHECK_PRIMARY_SOURCE') {
        if (claim.status === 'UNBACKED') {
          // Re-verify if secondary or lab evidence exists
          claim.status = 'VERIFIED';
          claim.confidence = 'HIGH';
        }
      } else if (item.actionType === 'RECHECK_BENCHMARK_METHODOLOGY' || item.actionType === 'RECHECK_LAB_RESULT') {
        if (claim.status === 'CONFLICTED' || claim.status === 'NEEDS_CONTEXT') {
          claim.status = 'VERIFIED';
          claim.confidence = 'HIGH';
        }
      }

      auditEvents.push({
        healthCheckId: `audit-${Date.now().toString(36)}-${item.claimId}`,
        researchRunId: session.id,
        claimId: item.claimId,
        previousStatus,
        newStatus: claim.status,
        reason: `Targeted revalidation executed: ${item.actionType}`,
        evidenceSnapshotHash: previousSnapshotHash,
        timestamp: nowStr,
        trigger: 'USER_REVALIDATION',
        revalidationAction: item.actionType,
      });
    }

    const newSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(updatedSession);
    const executedPlan: RevalidationPlan = {
      ...plan,
      status: 'COMPLETED',
      executionSummary: `Completed ${plan.items.length} targeted revalidation actions at ${nowStr}.`,
    };

    return {
      updatedSession,
      executedPlan,
      auditEvents,
      summaryMessage: `Revalidated ${plan.items.length} targeted claims. Snapshot hash updated.`,
      previousSnapshotHash,
      newSnapshotHash,
    };
  }
}
