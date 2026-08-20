import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorProjectGraphEngine } from "./creator-project.graph";
import {
  CreatorProjectImpactPreview,
  CreatorProjectAssetItem,
  ProjectNodeType,
} from "./creator-project.types";

export class CreatorProjectImpactEngine {
  /**
   * Performs a deterministic, read-only simulation answering:
   * "What breaks if this research evidence / benchmark / claim changes?"
   * Never mutates existing project state.
   */
  static simulateImpact(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    targetNodeType: ProjectNodeType,
    targetNodeId: string,
    simulationAction: string = "VALUE_CHANGED",
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES
  ): CreatorProjectImpactPreview {
    const graph = CreatorProjectGraphEngine.buildProjectGraph(session, report, preferences);
    const downstream = CreatorProjectGraphEngine.getDownstreamNodes(graph, targetNodeId);

    const willChange: CreatorProjectAssetItem[] = [];
    const mayChange: CreatorProjectAssetItem[] = [];
    const willRemainUnchanged: CreatorProjectAssetItem[] = [];
    const blocked: CreatorProjectAssetItem[] = [];
    const expectedConsequences: string[] = [];

    const downstreamIds = new Set(downstream.map((n) => n.id));

    // Evaluate Talking Points
    for (const tp of report.talkingPoints || []) {
      const tpNodeId = `tp-${tp.id}`;
      const isAffected = downstreamIds.has(tpNodeId) || downstreamIds.has(`clm-${targetNodeId}`);
      const assetItem: CreatorProjectAssetItem = {
        assetId: tp.id,
        assetType: "TALKING_POINT",
        label: `Talking Point: ${tp.title || tp.statement.slice(0, 30)}`,
        subsystem: "SCRIPT",
        enabled: true,
        currentVersion: report.scriptVersion || 1,
        sourceDependency: targetNodeId,
        status: isAffected ? 'STALE' : 'HEALTHY',
        freshness: isAffected ? "STALE" : "FRESH",
        health: isAffected ? "NEEDS_REGENERATION" : "HEALTHY",
        staleReason: isAffected ? `Directly references simulated change: ${simulationAction}` : undefined,
        regenerationEligible: true,
        upstreamEvidenceHash: "simulated-hash",
      };

      if (isAffected) {
        willChange.push(assetItem);
        expectedConsequences.push(`Talking Point "${tp.title || tp.statement.slice(0, 25)}" will require regeneration into Version ${(report.scriptVersion || 1) + 1}.`);
      } else {
        willRemainUnchanged.push(assetItem);
      }
    }

    // Evaluate Benchmark Cards
    for (const bc of report.benchmarkCards || []) {
      const bcNodeId = `bmcard-${bc.id}`;
      const isAffected = downstreamIds.has(bcNodeId) || targetNodeType === 'EVIDENCE' || targetNodeType === 'CLAIM';
      const assetItem: CreatorProjectAssetItem = {
        assetId: bc.id,
        assetType: "BENCHMARK_CARD",
        label: `Benchmark Card: ${bc.benchmarkName}`,
        subsystem: "PRODUCTION",
        enabled: preferences.generateBenchmarkCards !== false,
        currentVersion: report.scriptVersion || 1,
        sourceDependency: targetNodeId,
        status: isAffected ? 'STALE' : 'HEALTHY',
        freshness: isAffected ? "STALE" : "FRESH",
        health: isAffected ? "NEEDS_REGENERATION" : "HEALTHY",
        regenerationEligible: true,
        upstreamEvidenceHash: "simulated-hash",
      };

      if (isAffected) {
        willChange.push(assetItem);
        expectedConsequences.push(`Benchmark Card for "${bc.benchmarkName}" metric will be updated with new measurement.`);
      } else {
        willRemainUnchanged.push(assetItem);
      }
    }

    // Evaluate Teleprompter / Full Narration
    if (report.fullNarrationScript) {
      const isAffected = willChange.length > 0;
      const assetItem: CreatorProjectAssetItem = {
        assetId: `teleprompter-${session.id}`,
        assetType: "TELEPROMPTER",
        label: "Teleprompter Spoken Narration",
        subsystem: "PRODUCTION",
        enabled: preferences.enableTeleprompter !== false,
        currentVersion: report.scriptVersion || 1,
        sourceDependency: targetNodeId,
        status: isAffected ? 'STALE' : 'HEALTHY',
        freshness: isAffected ? "STALE" : "FRESH",
        health: isAffected ? "NEEDS_REGENERATION" : "HEALTHY",
        regenerationEligible: true,
        upstreamEvidenceHash: "simulated-hash",
      };

      if (isAffected) {
        willChange.push(assetItem);
        expectedConsequences.push("Full spoken teleprompter script will update affected narrative lines.");
      } else {
        willRemainUnchanged.push(assetItem);
      }
    }

    // Evaluate Distribution Package
    if (willChange.length > 0) {
      expectedConsequences.push("Distribution Staging Package will be flagged as DISTRIBUTION_PACKAGE_STALE until re-approved.");
    }

    const summary = willChange.length > 0
      ? `Simulating ${simulationAction} on ${targetNodeType} ${targetNodeId} affects ${willChange.length} creator asset(s). ${willRemainUnchanged.length} asset(s) will remain unchanged.`
      : `Simulating ${simulationAction} on ${targetNodeType} ${targetNodeId} produces no downstream impact. All assets remain healthy.`;

    return {
      isReadOnlySimulation: true,
      targetNodeType,
      targetNodeId,
      targetNodeLabel: `${targetNodeType} (${targetNodeId})`,
      simulationAction,
      willChange,
      mayChange,
      willRemainUnchanged,
      blocked,
      expectedConsequences,
      summary,
    };
  }
}
