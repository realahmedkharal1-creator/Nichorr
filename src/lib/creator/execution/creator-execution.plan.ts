import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import { CreatorProjectProvider } from "../project/creator-project.provider";
import { CreatorProjectAssetItem } from "../project/creator-project.types";
import { CreatorExecutionAuditService } from "./creator-execution.audit";
import {
  CreatorExecutionPlan,
  CreatorExecutionOperation,
  ExecutionTriggerType,
  ExecutionOperationType,
} from "./creator-execution.types";

export class CreatorExecutionPlanEngine {
  /**
   * Generates a deterministic, dependency-ordered execution plan following the Minimal Change Principle.
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
    const projectSnapshot = CreatorProjectProvider.getProjectSnapshot(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage
    );

    const currentScriptVersion = report.scriptVersion || 1;
    const targetScriptVersion = currentScriptVersion + 1;
    const sourceSnapshotHash = projectSnapshot.evidenceSnapshotHash;
    const projectSnapshotHash = projectSnapshot.snapshotHash;

    const proposedOperations: CreatorExecutionOperation[] = [];
    const dependencyOrder: string[] = [];
    const affectedAssets: CreatorProjectAssetItem[] = [];
    const affectedNodes: string[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];

    let order = 1;

    // 1. Upstream Claim Revalidations
    for (const claimId of affectedClaimIds) {
      const claim = session.claims?.find((c) => c.id === claimId);
      const claimLabel = claim ? claim.claim_text.slice(0, 40) : `Claim ${claimId}`;
      const opId = `op-reval-${claimId}`;
      
      proposedOperations.push({
        id: opId,
        operationType: 'REVALIDATE_CLAIM',
        targetId: claimId,
        targetLabel: `Revalidate Claim: "${claimLabel}"`,
        subsystem: 'EVIDENCE',
        order: order++,
        status: 'PENDING',
        reason: `Upstream claim requires revalidation: ${rootCause}`,
        upstreamEvidenceIds: claim?.evidence_ids || [],
      });
      dependencyOrder.push(opId);
      affectedNodes.push(`clm-${claimId}`);
    }

    // 2. Downstream Talking Points Regeneration
    const affectedTalkingPoints = (report.talkingPoints || []).filter(
      (tp) =>
        targetAssetIds.includes(tp.id) ||
        (tp.evidenceIds && tp.evidenceIds.some((eid) => affectedClaimIds.includes(eid))) ||
        affectedClaimIds.length === 0 // If no specific claims given, all targeted assets apply
    );

    for (const tp of affectedTalkingPoints) {
      const opId = `op-regen-tp-${tp.id}`;
      proposedOperations.push({
        id: opId,
        operationType: 'REGENERATE_TALKING_POINT',
        targetId: tp.id,
        targetLabel: `Regenerate Talking Point: "${tp.title || tp.statement.slice(0, 30)}"`,
        subsystem: 'SCRIPT',
        order: order++,
        status: 'PENDING',
        reason: "Talking point statement depends on modified research claim.",
        upstreamEvidenceIds: tp.evidenceIds || [],
      });
      dependencyOrder.push(opId);
      affectedNodes.push(`tp-${tp.id}`);

      affectedAssets.push({
        assetId: tp.id,
        assetType: "TALKING_POINT",
        label: tp.title || tp.statement.slice(0, 30),
        subsystem: "SCRIPT",
        enabled: true,
        currentVersion: currentScriptVersion,
        sourceDependency: tp.evidenceIds?.[0] || "research-claim",
        status: "STALE",
        freshness: "STALE",
        health: "NEEDS_REGENERATION",
        regenerationEligible: true,
        upstreamEvidenceHash: sourceSnapshotHash,
      });
    }

    // 3. Script Section Regeneration
    if (affectedTalkingPoints.length > 0 || targetAssetIds.includes("full-script")) {
      const opId = `op-regen-sections`;
      proposedOperations.push({
        id: opId,
        operationType: 'REGENERATE_SCRIPT_SECTION',
        targetId: "script-sections",
        targetLabel: `Regenerate Affected Script Outline & Sections`,
        subsystem: 'SCRIPT',
        order: order++,
        status: 'PENDING',
        reason: "Script sections contain modified talking points.",
        upstreamEvidenceIds: [],
      });
      dependencyOrder.push(opId);
      affectedNodes.push(`script-v${targetScriptVersion}`);
    }

    // 4. Benchmark Cards Regeneration
    if (preferences.generateBenchmarkCards !== false && report.benchmarkCards && report.benchmarkCards.length > 0) {
      const opId = `op-regen-bmcards`;
      proposedOperations.push({
        id: opId,
        operationType: 'REGENERATE_BENCHMARK_CARD',
        targetId: "benchmark-cards",
        targetLabel: "Regenerate Benchmark Measurement Cards",
        subsystem: 'PRODUCTION',
        order: order++,
        status: 'PENDING',
        reason: "Benchmark cards must sync with updated laboratory scores.",
        upstreamEvidenceIds: [],
      });
      dependencyOrder.push(opId);
    }

    // 5. Teleprompter Spoken Script Regeneration
    if (preferences.enableTeleprompter !== false && report.fullNarrationScript) {
      const opId = `op-regen-teleprompter`;
      proposedOperations.push({
        id: opId,
        operationType: 'REGENERATE_TELEPROMPTER',
        targetId: `teleprompter-${session.id}`,
        targetLabel: "Regenerate Teleprompter Spoken Narration",
        subsystem: 'PRODUCTION',
        order: order++,
        status: 'PENDING',
        reason: "Teleprompter narrative must synchronize with Script Version N+1.",
        upstreamEvidenceIds: [],
      });
      dependencyOrder.push(opId);
    }

    // 6. Publishing & Distribution Rebuild
    if (preferences.generatePlatformMetadata !== false) {
      const opId = `op-rebuild-pub`;
      proposedOperations.push({
        id: opId,
        operationType: 'REBUILD_PUBLISHING_PACKAGE',
        targetId: `pub-${session.id}`,
        targetLabel: "Rebuild Multi-Platform Publishing Preflight",
        subsystem: 'PUBLISHING',
        order: order++,
        status: 'PENDING',
        reason: "Publishing preflight metadata depends on updated script version.",
        upstreamEvidenceIds: [],
      });
      dependencyOrder.push(opId);
    }

    if (preferences.enableDistribution !== false) {
      const opId = `op-rebuild-dist`;
      proposedOperations.push({
        id: opId,
        operationType: 'REBUILD_DISTRIBUTION_PACKAGE',
        targetId: `dist-${session.id}`,
        targetLabel: "Rebuild Distribution Staging Packages",
        subsystem: 'DISTRIBUTION',
        order: order++,
        status: 'PENDING',
        reason: "Distribution packages lock script and evidence snapshot versions.",
        upstreamEvidenceIds: [],
      });
      dependencyOrder.push(opId);
    }

    // 7. Safety Checks
    if (healthReport && !healthReport.readyToSupportCreatorContent) {
      for (const b of healthReport.hardBlockers) {
        blockers.push(b);
      }
    }

    for (const tp of report.talkingPoints || []) {
      if (tp.verificationStatus === 'DO_NOT_SAY') {
        blockers.push(`Talking Point "${tp.title || tp.statement.slice(0, 25)}" is flagged as DO_NOT_SAY.`);
      }
    }

    const hasHardBlockers = blockers.length > 0;
    const executionStatus = hasHardBlockers ? 'BLOCKED' : 'PLANNED';

    const planId = `plan-${session.id}-v${targetScriptVersion}-${Date.now().toString(36)}`;
    const nowStr = new Date().toISOString();

    const plan: CreatorExecutionPlan = {
      executionPlanId: planId,
      userId,
      researchRunId: session.id,
      projectSnapshotHash,
      sourceSnapshotHash,
      currentScriptVersion,
      targetScriptVersion,
      createdAt: nowStr,
      createdBy: userId,
      triggerType,
      rootCause,
      affectedNodes,
      affectedClaims: affectedClaimIds,
      affectedAssets,
      proposedOperations,
      dependencyOrder,
      safetyChecks: {
        passed: !hasHardBlockers,
        blockers,
        warnings,
      },
      expectedImpact: {
        willChangeCount: proposedOperations.length,
        mayChangeCount: 0,
        unchangedCount: Math.max(0, (report.talkingPoints?.length || 0) - affectedTalkingPoints.length),
        blockedCount: blockers.length,
      },
      requiredApprovals: proposedOperations.map((op) => op.id),
      executionStatus,
      validationRequirements: [
        "RESEARCH_HEALTH_CHECK",
        "SCRIPT_QUALITY_AUDIT",
        "PRODUCTION_PACKAGE_VERIFICATION",
        "PUBLISHING_PREFLIGHT_RECHECK",
        "DISTRIBUTION_READINESS_CHECK",
      ],
      rollbackMetadata: {
        previousScriptVersion: currentScriptVersion,
        previousProjectSnapshotHash: projectSnapshotHash,
      },
    };

    CreatorExecutionAuditService.recordAuditEvent({
      auditId: `exec-aud-${Date.now().toString(36)}-create`,
      executionPlanId: planId,
      userId,
      researchRunId: session.id,
      action: 'PLAN_CREATED',
      previousSnapshot: projectSnapshotHash,
      newSnapshot: `target-v${targetScriptVersion}`,
      previousScriptVersion: currentScriptVersion,
      newScriptVersion: targetScriptVersion,
      affectedNodes,
      affectedAssets: affectedAssets.map((a) => a.assetId),
      executionResult: hasHardBlockers
        ? `Execution plan created in BLOCKED status (${blockers.length} safety blockers).`
        : `Execution plan created with ${proposedOperations.length} proposed operations.`,
      failureReason: hasHardBlockers ? blockers.join("; ") : undefined,
      timestamp: nowStr,
    });

    return plan;
  }
}
