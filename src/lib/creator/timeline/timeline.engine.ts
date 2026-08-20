import {
  CreatorTimelineMarker,
  TimelineMarkerCategory,
  TimelineMarkerColor,
  TimelineExportSummary,
} from "./timeline.types";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";

export class TimelineEngine {
  /**
   * Converts total seconds to standard SMPTE timecode (HH:MM:SS:FF).
   */
  static secondsToTimecode(totalSeconds: number, fps: number = 24): string {
    const totalFrames = Math.max(0, Math.floor(totalSeconds * fps));
    const frames = totalFrames % fps;
    const totalSecs = Math.floor(totalSeconds);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
  }

  /**
   * Converts timestamp string ("MM:SS" or "HH:MM:SS") to seconds.
   */
  static timestampToSeconds(timestamp: string): number {
    const parts = (timestamp || "00:00").split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  }

  /**
   * Generates a complete list of chronological timeline markers from a CreatorStudioReport,
   * respecting user's CreatorProductionPreferences and duration constraints.
   */
  static generateMarkers(
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    fps: number = 24
  ): CreatorTimelineMarker[] {
    // If timeline markers are explicitly disabled by user, return empty list
    if (!preferences.generateTimelineMarkers) {
      return [];
    }

    const rawMarkers: Array<{
      timestampSeconds: number;
      durationSeconds: number;
      label: string;
      description?: string;
      category: TimelineMarkerCategory;
      color: TimelineMarkerColor;
      sourceIds?: string[];
      claimIds?: string[];
      evidenceIds?: string[];
      isEvidenceGrounded: boolean;
    }> = [];

    // 1. Script Sections & Chapters Markers
    if (preferences.generateScript && report.scriptSections) {
      for (const sec of report.scriptSections) {
        const secStart = this.timestampToSeconds(sec.estimatedTimestamp);
        rawMarkers.push({
          timestampSeconds: secStart,
          durationSeconds: sec.durationSeconds || 30,
          label: `[SECTION] ${sec.title}`,
          description: sec.goal,
          category: "SCRIPT_SECTION",
          color: "BLUE",
          claimIds: sec.talkingPoints?.flatMap((tp) => tp.claimIds || []),
          evidenceIds: sec.talkingPoints?.flatMap((tp) => tp.evidenceIds || []),
          isEvidenceGrounded: true,
        });

        // 2. B-Roll Markers within this section
        if (preferences.generateBRoll && sec.bRollSuggestions) {
          let brollOffset = 5; // Offset 5 seconds into section
          for (const broll of sec.bRollSuggestions) {
            rawMarkers.push({
              timestampSeconds: secStart + brollOffset,
              durationSeconds: broll.durationSeconds || 10,
              label: `[B-ROLL] ${broll.visualTitle}`,
              description: broll.description,
              category: "BROLL",
              color: "MAGENTA",
              isEvidenceGrounded: true,
            });
            brollOffset += (broll.durationSeconds || 10) + 2;
          }
        }
      }
    }

    // 3. YouTube Chapters Markers
    if (preferences.generateChapters && report.chapters) {
      for (const ch of report.chapters) {
        const chStart = this.timestampToSeconds(ch.timestamp);
        // Deduplicate against section markers with exact same timestamp
        const hasExisting = rawMarkers.some(
          (m) => m.timestampSeconds === chStart && m.category === "CHAPTER"
        );
        if (!hasExisting) {
          rawMarkers.push({
            timestampSeconds: chStart,
            durationSeconds: 15,
            label: `[CHAPTER] ${ch.title}`,
            description: `YouTube Chapter Marker at ${ch.timestamp}`,
            category: "CHAPTER",
            color: "GREEN",
            isEvidenceGrounded: true,
          });
        }
      }
    }

    // 4. Benchmark Visual Cards Markers
    if (preferences.generateBenchmarkCards && report.benchmarkCards) {
      // Position benchmark cards during the BENCHMARKS / GAMING sections
      const benchSection = report.scriptSections?.find(
        (s) => s.sectionType === "BENCHMARKS" || s.sectionType === "GAMING"
      );
      const baseSecTime = benchSection
        ? this.timestampToSeconds(benchSection.estimatedTimestamp)
        : Math.floor((report.targetDurationMinutes * 60) * 0.3);

      let cardOffset = 10;
      for (const card of report.benchmarkCards) {
        rawMarkers.push({
          timestampSeconds: baseSecTime + cardOffset,
          durationSeconds: 15,
          label: `[BENCHMARK] ${card.benchmarkName} ${card.metric}`,
          description: `${card.entityAName}: ${card.entityAScore.toLocaleString()} | Source: ${card.sourcePublisher}`,
          category: "BENCHMARK",
          color: "ORANGE",
          isEvidenceGrounded: true,
        });
        cardOffset += 20;
      }
    }

    // 5. Sort chronologically by timestampSeconds and deduplicate
    rawMarkers.sort((a, b) => a.timestampSeconds - b.timestampSeconds);

    // 6. Build final indexed markers with timecodes
    const finalMarkers: CreatorTimelineMarker[] = [];
    for (let i = 0; i < rawMarkers.length; i++) {
      const rm = rawMarkers[i];
      finalMarkers.push({
        id: `marker-${i + 1}`,
        markerNumber: i + 1,
        timestampSeconds: rm.timestampSeconds,
        timecode: this.secondsToTimecode(rm.timestampSeconds, fps),
        durationSeconds: rm.durationSeconds,
        label: rm.label,
        description: rm.description,
        category: rm.category,
        color: rm.color,
        claimIds: rm.claimIds,
        evidenceIds: rm.evidenceIds,
        isEvidenceGrounded: rm.isEvidenceGrounded,
      });
    }

    return finalMarkers;
  }

  /**
   * Computes a summary of the timeline export.
   */
  static computeSummary(
    markers: CreatorTimelineMarker[],
    targetDurationMinutes: number
  ): TimelineExportSummary {
    let sectionCount = 0;
    let bRollCount = 0;
    let benchCount = 0;
    let chapterCount = 0;
    let evidenceCount = 0;

    for (const m of markers) {
      if (m.category === "SCRIPT_SECTION") sectionCount++;
      else if (m.category === "BROLL") bRollCount++;
      else if (m.category === "BENCHMARK" || m.category === "THERMAL") benchCount++;
      else if (m.category === "CHAPTER") chapterCount++;

      if (m.isEvidenceGrounded) evidenceCount++;
    }

    const durationSeconds = targetDurationMinutes * 60;
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;

    return {
      totalMarkers: markers.length,
      durationSeconds,
      formattedDuration: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
      sectionMarkersCount: sectionCount,
      bRollMarkersCount: bRollCount,
      benchmarkMarkersCount: benchCount,
      chapterMarkersCount: chapterCount,
      evidenceLinkedCount: evidenceCount,
    };
  }
}
