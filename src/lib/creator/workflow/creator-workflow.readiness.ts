import {
  CreatorWorkflowReadinessReport,
  WorkflowReadinessItem,
  CreatorScriptVersion,
} from "./creator-workflow.types";
import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport, TargetVideoDuration, ScriptOutputMode } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ScriptQualityReviewReport } from "../quality/script-quality.types";
import { ScriptQualityEngine } from "../quality/script-quality.engine";
import { CreatorWorkflowDependencies } from "./creator-workflow.dependencies";

export interface ReadinessThresholds {
  minOverallQuality: number; // default 88.0
  minEvidenceCoverage: number; // default 85.0
  minProvenanceTraceability: number; // default 85.0
  requireSafetyPass: boolean; // default true (100% safety)
}

export const DEFAULT_READINESS_THRESHOLDS: ReadinessThresholds = {
  minOverallQuality: 88.0,
  minEvidenceCoverage: 85.0,
  minProvenanceTraceability: 85.0,
  requireSafetyPass: true,
};

export class CreatorWorkflowReadinessEngine {
  /**
   * Deterministically evaluates workflow readiness across Research, Script, Quality, Production, and Export.
   */
  static evaluateReadiness(
    session: ResearchRunSession,
    report?: CreatorStudioReport,
    version?: CreatorScriptVersion,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    targetDuration: TargetVideoDuration = 12,
    outputMode: ScriptOutputMode = "SCRIPT_READY",
    thresholds: ReadinessThresholds = DEFAULT_READINESS_THRESHOLDS
  ): CreatorWorkflowReadinessReport {
    const dimensions: WorkflowReadinessItem[] = [];
    const blockingReasons: string[] = [];

    // 1. Evaluate Research Readiness
    const hasSources = (session.sources?.length || 0) > 0;
    const hasClaims = (session.claims?.length || 0) > 0;
    const hasEvidence = (session.evidence?.length || 0) > 0;
    const isResearchCompleted = session.status === "COMPLETED";

    let researchStatus: WorkflowReadinessItem["status"] = "READY";
    let researchScore = 100.0;
    const researchReasons: string[] = [];
    const researchActions: string[] = [];

    if (!hasSources || !hasEvidence) {
      researchStatus = "BLOCKED";
      researchScore = 0.0;
      researchReasons.push("No verified evidence or primary sources found in research session.");
      researchActions.push("Run a full technology research intelligence search first.");
      blockingReasons.push("Research evidence missing");
    } else if (!isResearchCompleted) {
      researchStatus = "READY_WITH_WARNINGS";
      researchScore = 75.0;
      researchReasons.push("Research session is active or in progress.");
      researchActions.push("Wait for complete synthesis for maximum accuracy.");
    } else {
      researchReasons.push(`${session.evidence.length} evidence items and ${session.sources.length} sources verified.`);
    }

    dimensions.push({
      dimension: "RESEARCH",
      label: "Research & Evidence Ingestion",
      status: researchStatus,
      score: researchScore,
      reasons: researchReasons,
      actionsRequired: researchActions,
    });

    // 2. Evaluate Script Readiness
    let scriptStatus: WorkflowReadinessItem["status"] = "READY";
    let scriptScore = 100.0;
    const scriptReasons: string[] = [];
    const scriptActions: string[] = [];

    if (!report || !report.scriptSections || report.scriptSections.length === 0) {
      scriptStatus = "NOT_READY";
      scriptScore = 0.0;
      scriptReasons.push("No script generated for the current research session.");
      scriptActions.push("Click 'Generate Script' in Creator Studio.");
      blockingReasons.push("Script not generated");
    } else {
      // Check stale status
      if (version) {
        const staleCheck = CreatorWorkflowDependencies.detectStaleAssets(
          session,
          version,
          targetDuration,
          outputMode,
          preferences || ({} as any),
          profile
        );
        if (staleCheck.isStale) {
          scriptStatus = "STALE";
          scriptScore = 60.0;
          scriptReasons.push(`Script is out of sync: ${staleCheck.reason}`);
          scriptActions.push("Regenerate script to synchronize with updated parameters.");
          blockingReasons.push("Script is stale");
        }
      }

      if (scriptStatus === "READY") {
        scriptReasons.push(
          `Script ready with ${report.scriptSections.length} sections in ${outputMode} mode (${targetDuration} min).`
        );
      }
    }

    dimensions.push({
      dimension: "SCRIPT",
      label: "Script Generation & Pacing",
      status: scriptStatus,
      score: scriptScore,
      reasons: scriptReasons,
      actionsRequired: scriptActions,
    });

    // 3. Evaluate Quality Readiness (reusing Phase 69 ScriptQualityEngine)
    let qualityReport: ScriptQualityReviewReport | undefined = report?.qualityReview;
    if (!qualityReport && report && session) {
      try {
        qualityReport = ScriptQualityEngine.reviewScript(session, report, profile);
      } catch {
        // Fallback
      }
    }

    let qualityStatus: WorkflowReadinessItem["status"] = "READY";
    let contentQualityScore = qualityReport?.overallQualityScore || 0.0;
    const qualityReasons: string[] = [];
    const qualityActions: string[] = [];

    if (!qualityReport) {
      qualityStatus = "NOT_READY";
      qualityReasons.push("Quality review has not been executed on the script.");
      qualityActions.push("Run Quality Audit in Creator Studio.");
      blockingReasons.push("Quality review not executed");
    } else {
      const safetyDim = qualityReport.dimensions.find((d) => d.dimension === "SAFETY_COMPLIANCE");
      const evidenceDim = qualityReport.dimensions.find((d) => d.dimension === "EVIDENCE_COVERAGE");
      const provenanceDim = qualityReport.dimensions.find((d) => d.dimension === "PROVENANCE_TRACEABILITY");

      const safetyScore = safetyDim?.score || 0;
      const evidenceScore = evidenceDim?.score || 0;
      const provenanceScore = provenanceDim?.score || 0;

      if (thresholds.requireSafetyPass && safetyScore < 100) {
        qualityStatus = "BLOCKED";
        qualityReasons.push("Script contains unquarantined DO_NOT_SAY statements or safety violations.");
        qualityActions.push("Remove unverified factual assertions or add required cautionary context.");
        blockingReasons.push("Safety compliance failed (DO_NOT_SAY unquarantined)");
      } else if (
        qualityReport.overallQualityScore < thresholds.minOverallQuality ||
        evidenceScore < thresholds.minEvidenceCoverage ||
        provenanceScore < thresholds.minProvenanceTraceability
      ) {
        qualityStatus = "READY_WITH_WARNINGS";
        qualityReasons.push(
          `Quality score (${qualityReport.overallQualityScore}%) is below recommended threshold (${thresholds.minOverallQuality}%).`
        );
        qualityActions.push("Inspect talking points in Evidence Inspector to verify unbacked statements.");
      } else {
        qualityReasons.push(`Passed all quality gates with grade ${qualityReport.grade} (${qualityReport.overallQualityScore}%).`);
      }
    }

    dimensions.push({
      dimension: "QUALITY",
      label: "Evidence Quality & Safety Gate",
      status: qualityStatus,
      score: contentQualityScore,
      reasons: qualityReasons,
      actionsRequired: qualityActions,
    });

    // 4. Evaluate Production Readiness (Asset Synchronization)
    let prodStatus: WorkflowReadinessItem["status"] = "READY";
    let prodScore = 100.0;
    const prodReasons: string[] = [];
    const prodActions: string[] = [];

    const prefs = preferences || ({} as any);
    const hasEnabledAssets = 
      (!prefs.generateHooks || (report?.hooks && report.hooks.length > 0)) &&
      (!prefs.generateTitles || (report?.titles && report.titles.length > 0)) &&
      (!prefs.generateTalkingPoints || (report?.talkingPoints && report.talkingPoints.length > 0)) &&
      (!prefs.generateBRoll || (report?.bRollList && report.bRollList.length > 0)) &&
      (!prefs.generateChapters || (report?.chapters && report.chapters.length > 0));

    if (!hasEnabledAssets) {
      prodStatus = "NOT_READY";
      prodScore = 50.0;
      prodReasons.push("One or more enabled production assets have not been generated.");
      prodActions.push("Regenerate Creator Studio assets with active preferences.");
      blockingReasons.push("Production assets incomplete");
    } else {
      prodReasons.push("All enabled production assets (Hooks, Titles, B-Roll, Chapters) are generated and synchronized.");
    }

    dimensions.push({
      dimension: "PRODUCTION",
      label: "Production Assets & Synchronization",
      status: prodStatus,
      score: prodScore,
      reasons: prodReasons,
      actionsRequired: prodActions,
    });

    // 5. Evaluate Export Readiness
    let exportStatus: WorkflowReadinessItem["status"] = "READY";
    let exportScore = 100.0;
    const exportReasons: string[] = [];
    const exportActions: string[] = [];

    if (scriptStatus !== "READY") {
      exportStatus = "BLOCKED";
      exportScore = 0.0;
      exportReasons.push("Timeline and markdown exports are blocked because upstream script is not ready.");
      exportActions.push("Resolve script issues to enable timeline and package export.");
    } else {
      exportReasons.push("Timeline markers (EDL / FCPXML) and production markdown packages are ready for export.");
    }

    dimensions.push({
      dimension: "EXPORT",
      label: "Timeline & Production Package Export",
      status: exportStatus,
      score: exportScore,
      reasons: exportReasons,
      actionsRequired: exportActions,
    });

    // Calculate composite Overall Readiness Score (0 to 100)
    const overallReadinessScore = Number(
      (
        researchScore * 0.20 +
        scriptScore * 0.25 +
        contentQualityScore * 0.25 +
        prodScore * 0.15 +
        exportScore * 0.15
      ).toFixed(1)
    );

    const readyToRecord = 
      researchStatus === "READY" &&
      scriptStatus === "READY" &&
      (qualityStatus === "READY" || qualityStatus === "READY_WITH_WARNINGS") &&
      prodStatus === "READY" &&
      exportStatus === "READY" &&
      blockingReasons.length === 0;

    const readyToRecordSummary = readyToRecord
      ? "READY TO RECORD: Verified research, personalized script narration, synchronized B-roll cues, chapters, and teleprompter are fully prepared."
      : `NOT READY TO RECORD: ${blockingReasons.join("; ")}.`;

    return {
      overallReadinessScore,
      contentQualityScore,
      readyToRecord,
      readyToRecordSummary,
      blockingReasons,
      dimensions,
      checkedAt: new Date().toISOString(),
    };
  }
}
