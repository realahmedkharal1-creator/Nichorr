export * from "./editor-integration.types";
export * from "./timeline-fingerprint";
export * from "./timeline-importer";
export * from "./timeline-diff.engine";
export * from "./timeline-sync.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorTimelineMarker } from "../timeline/timeline.types";
import { TimelineImporter } from "./timeline-importer";
import { TimelineDiffEngine } from "./timeline-diff.engine";
import { TimelineSyncEngine } from "./timeline-sync.engine";
import { TimelineFingerprint } from "./timeline-fingerprint";
import {
  TimelineSyncPlan,
  TimelineSnapshot,
  ImportedTimelineResult,
  TimelineDiffItem,
  TimelineSyncAuditRecord,
  EditorIntegrationStatus,
} from "./editor-integration.types";

export class EditorIntegrationProvider {
  /**
   * Returns current editor connection status without fabricating live application connectivity.
   */
  static getEditorStatus(): { status: EditorIntegrationStatus; message: string } {
    return {
      status: "IMPORT_AVAILABLE",
      message: "CMX 3600 EDL and Apple FCPXML interchange protocols available. Local bridge not connected.",
    };
  }

  /**
   * Imports an external EDL or FCPXML timeline file.
   */
  static importTimeline(content: string, format: "EDL" | "FCPXML", fps: number = 24): ImportedTimelineResult {
    if (format === "FCPXML") {
      return TimelineImporter.importFcpxml(content, fps);
    }
    return TimelineImporter.importEdl(content, fps);
  }

  /**
   * Calculates diff between current timeline intent and a reference timeline.
   */
  static computeDiff(
    currentMarkers: CreatorTimelineMarker[],
    referenceMarkers: CreatorTimelineMarker[]
  ): TimelineDiffItem[] {
    return TimelineDiffEngine.computeDiff(currentMarkers, referenceMarkers);
  }

  /**
   * Generates a preview-first timeline synchronization plan.
   */
  static generateSyncPlan(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    referenceMarkers?: CreatorTimelineMarker[],
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    scriptVersion: number = 1
  ): TimelineSyncPlan {
    return TimelineSyncEngine.generateSyncPlan(session, report, referenceMarkers, preferences, scriptVersion);
  }

  /**
   * Applies approved synchronization plan operations.
   */
  static applySync(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    plan: TimelineSyncPlan,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES
  ): { snapshot: TimelineSnapshot; auditRecord: TimelineSyncAuditRecord } {
    return TimelineSyncEngine.applySync(session, report, plan, preferences);
  }

  /**
   * Generates a deterministic timeline fingerprint.
   */
  static generateFingerprint(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    markers: CreatorTimelineMarker[],
    preferences?: CreatorProductionPreferences,
    scriptVersion: number = 1
  ): string {
    return TimelineFingerprint.generateFingerprint({
      researchRunId: session.id,
      scriptVersion,
      evidenceSnapshotHash: session.id,
      targetDuration: report.targetDurationMinutes || 12,
      outputMode: report.outputMode || "SCRIPT_READY",
      markers,
      preferences,
    });
  }
}
