export * from "./creator-project.types";
export * from "./creator-project.graph";
export * from "./creator-project.snapshot";
export * from "./creator-project.blocker";
export * from "./creator-project.impact";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorProjectGraphEngine } from "./creator-project.graph";
import { CreatorProjectSnapshotEngine } from "./creator-project.snapshot";
import { CreatorProjectBlockerEngine } from "./creator-project.blocker";
import { CreatorProjectImpactEngine } from "./creator-project.impact";
import {
  CreatorProjectOverview,
  CreatorProjectGraph,
  CreatorProjectSnapshot,
  CreatorProjectImpactPreview,
  ProjectPipelineStage,
  CreatorProjectAssetItem,
  ProjectNodeType,
} from "./creator-project.types";

export class CreatorProjectProvider {
  /**
   * Generates a unified, coherent project intelligence overview across all research, health, script, production, publishing, and distribution systems.
   */
  static getProjectOverview(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage,
    userId: string = "anonymous-creator"
  ): CreatorProjectOverview {
    const graph = CreatorProjectGraphEngine.buildProjectGraph(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage
    );

    const snapshot = CreatorProjectSnapshotEngine.generateSnapshot(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage
    );

    const { blockers, healthReport: projectHealth } = CreatorProjectBlockerEngine.evaluateBlockersAndHealth(
      session,
      report,
      preferences,
      healthReport,
      preflight,
      distPackage
    );

    // Build unified asset inventory
    const assets: CreatorProjectAssetItem[] = [];

    // Talking points
    for (const tp of report.talkingPoints || []) {
      const isBlocked = tp.verificationStatus === 'DO_NOT_SAY' || tp.verificationStatus === 'UNSUPPORTED';
      assets.push({
        assetId: tp.id,
        assetType: "TALKING_POINT",
        label: tp.title || tp.statement.slice(0, 35),
        subsystem: "SCRIPT",
        enabled: true,
        currentVersion: report.scriptVersion || 1,
        sourceDependency: tp.evidenceIds?.[0] || "primary-research",
        status: isBlocked ? 'BLOCKED' : 'READY',
        freshness: "FRESH",
        health: isBlocked ? "BLOCKED" : "HEALTHY",
        blockerReason: isBlocked ? tp.doNotSayWarning : undefined,
        regenerationEligible: true,
        upstreamEvidenceHash: snapshot.evidenceSnapshotHash,
      });
    }

    // Benchmark cards
    if (preferences.generateBenchmarkCards !== false && report.benchmarkCards) {
      for (const bc of report.benchmarkCards) {
        assets.push({
          assetId: bc.id,
          assetType: "BENCHMARK_CARD",
          label: `${bc.benchmarkName || bc.title} (${bc.entityAScore || (bc as any).score || 0} ${bc.metric || (bc as any).metricUnit || "pts"})`,
          subsystem: "PRODUCTION",
          enabled: true,
          currentVersion: report.scriptVersion || 1,
          sourceDependency: bc.sourcePublisher || "lab-benchmarks",
          status: 'READY',
          freshness: "FRESH",
          health: "HEALTHY",
          regenerationEligible: true,
          upstreamEvidenceHash: snapshot.evidenceSnapshotHash,
        });
      }
    }

    // Pipeline Stages Summary
    const pipelineStages: ProjectPipelineStage[] = [
      {
        stageId: 'RESEARCH',
        stageNumber: 1,
        label: "Research & Sources",
        status: session.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
        blockerCount: 0,
        staleCount: 0,
        targetTab: "outline",
      },
      {
        stageId: 'HEALTH',
        stageNumber: 2,
        label: "Evidence Health",
        status: healthReport ? (healthReport.readyToSupportCreatorContent ? 'READY' : 'BLOCKED') : 'READY',
        score: healthReport?.overallHealthScore || 95,
        blockerCount: healthReport?.hardBlockers.length || 0,
        staleCount: healthReport?.evidenceSummary?.stale || 0,
        requiredAction: healthReport?.readyToSupportCreatorContent ? undefined : "Review hard blockers in Health tab",
        targetTab: "health",
      },
      {
        stageId: 'DECISIONS',
        stageNumber: 3,
        label: "Health Decisions",
        status: 'READY',
        blockerCount: 0,
        staleCount: 0,
        targetTab: "decisions",
      },
      {
        stageId: 'SCRIPT',
        stageNumber: 4,
        label: "Script & Narration",
        status: report.talkingPoints?.some((t) => t.verificationStatus === 'DO_NOT_SAY') ? 'BLOCKED' : 'READY',
        blockerCount: report.talkingPoints?.filter((t) => t.verificationStatus === 'DO_NOT_SAY').length || 0,
        staleCount: 0,
        targetTab: "narration",
      },
      {
        stageId: 'QUALITY',
        stageNumber: 5,
        label: "Quality Review",
        status: report.qualityReview?.overallQualityScore >= 80 ? 'READY' : 'WARNING',
        score: report.qualityReview?.overallQualityScore || 90,
        blockerCount: 0,
        staleCount: 0,
        targetTab: "quality",
      },
      {
        stageId: 'PRODUCTION',
        stageNumber: 6,
        label: "Production Assets",
        status: 'READY',
        score: preflight?.productionReadinessScore || 95,
        blockerCount: 0,
        staleCount: 0,
        targetTab: "benchmarkCards",
      },
      {
        stageId: 'PUBLISHING',
        stageNumber: 7,
        label: "Publishing Preflight",
        status: preflight ? (preflight.readinessStatus === 'BLOCKED' ? 'BLOCKED' : 'READY') : 'READY',
        score: preflight?.overallPublishingScore || 90,
        blockerCount: preflight?.allIssues.filter((i) => i.severity === 'BLOCKER').length || 0,
        staleCount: 0,
        targetTab: "publishing",
      },
      {
        stageId: 'DISTRIBUTION',
        stageNumber: 8,
        label: "Distribution & Release",
        status: distPackage ? (distPackage.status === 'BLOCKED' ? 'BLOCKED' : distPackage.approvalState === 'APPROVED' ? 'READY' : 'WARNING') : 'READY',
        score: distPackage?.distributionReadinessScore || 90,
        blockerCount: distPackage?.readinessReport.blockingReasons.length || 0,
        staleCount: 0,
        targetTab: "distribution",
      },
      {
        stageId: 'EDITOR',
        stageNumber: 9,
        label: "Video Editor Sync",
        status: 'READY',
        blockerCount: 0,
        staleCount: 0,
        targetTab: "editorSync",
      },
    ];

    return {
      researchRunId: session.id,
      topic: session.topic || "Hardware Research Run",
      projectStatus: projectHealth.overallStatus,
      snapshot,
      healthReport: projectHealth,
      pipelineStages,
      assets,
      graph,
      activeScriptVersion: report.scriptVersion || 1,
      targetDurationMinutes: report.targetDurationMinutes || 12,
      outputMode: report.outputMode || "SCRIPT_READY",
      workflowState: "SCRIPT_READY",
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns the unified dependency graph.
   */
  static getProjectGraph(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage
  ): CreatorProjectGraph {
    return CreatorProjectGraphEngine.buildProjectGraph(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage
    );
  }

  /**
   * Returns the deterministic project snapshot.
   */
  static getProjectSnapshot(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage
  ): CreatorProjectSnapshot {
    return CreatorProjectSnapshotEngine.generateSnapshot(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage
    );
  }

  /**
   * Simulates downstream impact of an upstream node change without modifying project state.
   */
  static simulateImpact(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    targetNodeType: ProjectNodeType,
    targetNodeId: string,
    simulationAction?: string,
    preferences?: CreatorProductionPreferences
  ): CreatorProjectImpactPreview {
    return CreatorProjectImpactEngine.simulateImpact(
      session,
      report,
      targetNodeType,
      targetNodeId,
      simulationAction,
      preferences
    );
  }
}
