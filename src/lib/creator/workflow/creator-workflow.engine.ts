import {
  CreatorWorkflowState,
  CreatorScriptVersion,
  CreatorProductionPackage,
  CreatorWorkflowReadinessReport,
} from "./creator-workflow.types";
import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport, TargetVideoDuration, ScriptOutputMode } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { CreatorWorkflowDependencies } from "./creator-workflow.dependencies";
import { CreatorWorkflowReadinessEngine } from "./creator-workflow.readiness";
import { TimelineProvider } from "../timeline/timeline.provider";

export class CreatorWorkflowEngine {
  /**
   * Deterministically calculates the Creator Workflow State based on session and report state.
   */
  static determineWorkflowState(
    session: ResearchRunSession,
    report?: CreatorStudioReport,
    version?: CreatorScriptVersion,
    readiness?: CreatorWorkflowReadinessReport
  ): CreatorWorkflowState {
    if (!session || (session.sources?.length || 0) === 0) {
      return "DRAFT";
    }

    if (session.status !== "COMPLETED") {
      return "RESEARCH_READY";
    }

    if ((session.evidence?.length || 0) === 0) {
      return "RESEARCH_READY";
    }

    if (!report || !report.scriptSections || report.scriptSections.length === 0) {
      return "EVIDENCE_READY";
    }

    if (readiness?.blockingReasons && readiness.blockingReasons.some((r) => r.toLowerCase().includes("safety"))) {
      return "BLOCKED";
    }

    if (version?.isStale) {
      return "SCRIPT_READY";
    }

    if (readiness?.readyToRecord) {
      return "PRODUCTION_READY_FINAL";
    }

    if (report.qualityReview && report.qualityReview.overallQualityScore >= 88) {
      return "QUALITY_PASSED";
    }

    if (report.qualityReview) {
      return "QUALITY_REVIEW";
    }

    return "SCRIPT_READY";
  }

  /**
   * Creates or increments a CreatorScriptVersion with an evidence snapshot hash.
   */
  static createScriptVersion(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    currentVersionNum = 1,
    profile?: CreatorScriptTrainingProfile
  ): CreatorScriptVersion {
    const evidenceSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const now = new Date().toISOString();
    const qualityScore = report.qualityReview?.overallQualityScore || 90.0;
    const qualityGrade = report.qualityReview?.grade || "A";

    return {
      version: currentVersionNum,
      createdAt: now,
      updatedAt: now,
      researchRunId: session.id,
      trainingProfileId: profile?.userId,
      targetDuration: report.targetDurationMinutes,
      outputMode: report.outputMode || "SCRIPT_READY",
      qualityScore,
      qualityGrade,
      workflowState: "SCRIPT_READY",
      evidenceSnapshotHash,
      isStale: false,
      affectedAssets: [],
      unaffectedAssets: [
        "Research Evidence",
        "Script Content",
        "Talking Points",
        "B-Roll Plan",
        "Benchmark Cards",
        "Chapters",
        "Teleprompter",
        "Timeline Markers",
      ],
    };
  }

  /**
   * Assembles the complete, unified Creator Production Package for downstream production or video editing.
   * Only includes explicitly enabled assets.
   */
  static generateProductionPackage(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    versionNumber = 1
  ): CreatorProductionPackage {
    const readiness = CreatorWorkflowReadinessEngine.evaluateReadiness(
      session,
      report,
      undefined,
      preferences,
      profile,
      report.targetDurationMinutes,
      report.outputMode || "SCRIPT_READY"
    );

    const workflowState = this.determineWorkflowState(session, report, undefined, readiness);

    const includedAssets: string[] = [];
    const excludedAssets: string[] = [];
    const staleAssets: string[] = [];

    // Script
    let scriptMarkdown: string | undefined;
    let scriptJson: any | undefined;
    if (preferences.generateScript) {
      scriptMarkdown = report.fullNarrationScript || report.rawMarkdownExport;
      scriptJson = { sections: report.scriptSections };
      includedAssets.push("Script Narration (Markdown / JSON)");
    } else {
      excludedAssets.push("Script Narration");
    }

    // Hooks
    let hooksMarkdown: string | undefined;
    if (preferences.generateHooks && report.hooks && report.hooks.length > 0) {
      hooksMarkdown = report.hooks
        .map((h) => `### [${h.category}] ${h.headline}\n"${h.scriptWording}"\n*Target: ${h.targetAudience} | Evidence: ${h.evidenceExcerpt}*\n`)
        .join("\n");
      includedAssets.push("Opening Hooks");
    } else {
      excludedAssets.push("Opening Hooks");
    }

    // Titles
    let titlesMarkdown: string | undefined;
    if (preferences.generateTitles && report.titles && report.titles.length > 0) {
      titlesMarkdown = report.titles
        .map((t) => `- **[${t.style}]** ${t.title} *(Target: ${t.targetAudience})*`)
        .join("\n");
      includedAssets.push("High-CTR Titles");
    } else {
      excludedAssets.push("High-CTR Titles");
    }

    // Talking Points
    let talkingPointsMarkdown: string | undefined;
    if (preferences.generateTalkingPoints && report.talkingPoints && report.talkingPoints.length > 0) {
      talkingPointsMarkdown = report.talkingPoints
        .map((tp) => `- **[${tp.section}] [${tp.verificationStatus}]** ${tp.title}: "${tp.statement}"`)
        .join("\n");
      includedAssets.push("Talking Points");
    } else {
      excludedAssets.push("Talking Points");
    }

    // B-Roll Plan
    let bRollPlanMarkdown: string | undefined;
    if (preferences.generateBRoll && report.bRollList && report.bRollList.length > 0) {
      bRollPlanMarkdown = report.bRollList
        .map((b) => `- **[${b.visualType}] (${b.durationSeconds}s)** ${b.visualTitle}: ${b.description}`)
        .join("\n");
      includedAssets.push("B-Roll Shot Plan");
    } else {
      excludedAssets.push("B-Roll Shot Plan");
    }

    // Benchmark Cards
    let benchmarkCardsJson: any | undefined;
    if (preferences.generateBenchmarkCards && report.benchmarkCards && report.benchmarkCards.length > 0) {
      benchmarkCardsJson = report.benchmarkCards;
      includedAssets.push("Benchmark Visual Cards");
    } else {
      excludedAssets.push("Benchmark Visual Cards");
    }

    // Chapters
    let chaptersText: string | undefined;
    if (preferences.generateChapters && report.chapters && report.chapters.length > 0) {
      chaptersText = report.chapters.map((ch) => `${ch.timestamp} ${ch.title}`).join("\n");
      includedAssets.push("YouTube Description Chapters");
    } else {
      excludedAssets.push("YouTube Chapters");
    }

    // Provenance Proof Sheet
    let provenanceProofMarkdown: string | undefined;
    if (session.provenanceReport?.citationProofSheetMarkdown) {
      provenanceProofMarkdown = session.provenanceReport.citationProofSheetMarkdown;
      includedAssets.push("Research Provenance Proof Sheet");
    }

    // Quality Report JSON
    let qualityReportJson: any | undefined;
    if (report.qualityReview) {
      qualityReportJson = report.qualityReview;
      includedAssets.push("Script Quality Review Report");
    }

    // Timeline Exports (EDL / FCPXML)
    let timelineEdl: string | undefined;
    let timelineFcpxml: string | undefined;
    if (preferences.generateTimelineMarkers) {
      try {
        const markers = TimelineProvider.getMarkers(report, preferences, 24);
        const edlResult = TimelineProvider.exportTimeline(
          session.topic,
          markers,
          report.targetDurationMinutes,
          { format: "EDL", fps: 24 }
        );
        timelineEdl = edlResult.content;

        const fcpxmlResult = TimelineProvider.exportTimeline(
          session.topic,
          markers,
          report.targetDurationMinutes,
          { format: "FCPXML", fps: 24 }
        );
        timelineFcpxml = fcpxmlResult.content;

        includedAssets.push("Timeline Markers (EDL)", "Timeline Markers (FCPXML)");
      } catch {
        // Fallback
      }
    } else {
      excludedAssets.push("Timeline Markers");
    }

    return {
      packageId: `pkg-${session.id}-v${versionNumber}`,
      researchRunId: session.id,
      topic: session.topic,
      generatedAt: new Date().toISOString(),
      version: versionNumber,
      workflowState,
      readiness,
      scriptMarkdown,
      scriptJson,
      hooksMarkdown,
      titlesMarkdown,
      talkingPointsMarkdown,
      bRollPlanMarkdown,
      benchmarkCardsJson,
      chaptersText,
      provenanceProofMarkdown,
      qualityReportJson,
      timelineEdl,
      timelineFcpxml,
      includedAssets,
      excludedAssets,
      staleAssets,
    };
  }
}
