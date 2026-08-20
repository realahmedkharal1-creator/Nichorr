import crypto from "crypto";
import { CreatorTimelineMarker } from "../timeline/timeline.types";
import { CreatorProductionPreferences } from "../production-preferences.types";

export interface TimelineFingerprintInput {
  researchRunId: string;
  scriptVersion: number;
  evidenceSnapshotHash: string;
  targetDuration: number;
  outputMode: string;
  markers: CreatorTimelineMarker[];
  preferences?: CreatorProductionPreferences;
}

export class TimelineFingerprint {
  /**
   * Generates a deterministic fingerprint hash of the timeline intent.
   * Incorporates only material attributes (durations, markers, evidence hash, preferences).
   */
  static generateFingerprint(input: TimelineFingerprintInput): string {
    const markerSummary = (input.markers || []).map((m) => ({
      id: m.id,
      tc: m.timecode,
      cat: m.category,
      lbl: m.label,
    }));

    const payload = {
      runId: input.researchRunId,
      ver: input.scriptVersion,
      eviHash: input.evidenceSnapshotHash,
      dur: input.targetDuration,
      mode: input.outputMode,
      markerCount: input.markers?.length || 0,
      markers: markerSummary,
      pref: {
        broll: input.preferences?.generateBRoll !== false,
        bench: input.preferences?.generateBenchmarkCards !== false,
        chap: input.preferences?.generateChapters !== false,
      },
    };

    const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
    return `tl-fp-${hash}`;
  }
}
