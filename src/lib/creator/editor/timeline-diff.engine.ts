import { CreatorTimelineMarker } from "../timeline/timeline.types";
import { TimelineDiffItem } from "./editor-integration.types";

export class TimelineDiffEngine {
  /**
   * Compares the current Nichorr timeline markers against a reference/imported timeline.
   */
  static computeDiff(
    currentMarkers: CreatorTimelineMarker[],
    referenceMarkers: CreatorTimelineMarker[]
  ): TimelineDiffItem[] {
    const diffs: TimelineDiffItem[] = [];
    const refMap = new Map<string, CreatorTimelineMarker>();
    const matchedRefIds = new Set<string>();

    for (const rm of referenceMarkers) {
      refMap.set(this.getMarkerKey(rm), rm);
    }

    // 1. Check current markers against reference
    for (const cm of currentMarkers) {
      const key = this.getMarkerKey(cm);
      const matchedRef = refMap.get(key) || this.findByCategoryAndNearTimestamp(cm, referenceMarkers, matchedRefIds);

      if (!matchedRef) {
        // ADDED marker
        diffs.push({
          markerId: cm.id,
          label: cm.label,
          category: cm.category,
          changeType: "ADDED",
          newTimecode: cm.timecode,
          newTimestampSeconds: cm.timestampSeconds,
          reason: `New ${cm.category.replace("_", " ")} marker generated from latest script update.`,
          safeToAutoSync: true,
        });
      } else {
        matchedRefIds.add(matchedRef.id);
        const timeDelta = Math.abs(cm.timestampSeconds - matchedRef.timestampSeconds);
        const isMoved = timeDelta > 1.0;
        const isRenamed = cm.label.trim().toLowerCase() !== matchedRef.label.trim().toLowerCase();

        if (isMoved) {
          diffs.push({
            markerId: cm.id,
            label: cm.label,
            category: cm.category,
            changeType: "MOVED",
            oldTimecode: matchedRef.timecode,
            newTimecode: cm.timecode,
            oldTimestampSeconds: matchedRef.timestampSeconds,
            newTimestampSeconds: cm.timestampSeconds,
            reason: `Marker position shifted by ${timeDelta.toFixed(1)}s due to section pacing adjustment.`,
            safeToAutoSync: true,
          });
        } else if (isRenamed) {
          diffs.push({
            markerId: cm.id,
            label: cm.label,
            category: cm.category,
            changeType: "RENAMED",
            oldTimecode: matchedRef.timecode,
            newTimecode: cm.timecode,
            oldTimestampSeconds: matchedRef.timestampSeconds,
            newTimestampSeconds: cm.timestampSeconds,
            reason: `Marker wording updated from "${matchedRef.label}" to "${cm.label}".`,
            safeToAutoSync: true,
          });
        } else {
          diffs.push({
            markerId: cm.id,
            label: cm.label,
            category: cm.category,
            changeType: "UNCHANGED",
            oldTimecode: matchedRef.timecode,
            newTimecode: cm.timecode,
            oldTimestampSeconds: matchedRef.timestampSeconds,
            newTimestampSeconds: cm.timestampSeconds,
            reason: "Marker timestamp and title are identical.",
            safeToAutoSync: true,
          });
        }
      }
    }

    // 2. Check for removed markers in reference
    for (const rm of referenceMarkers) {
      if (!matchedRefIds.has(rm.id)) {
        diffs.push({
          markerId: rm.id,
          label: rm.label,
          category: rm.category,
          changeType: "REMOVED",
          oldTimecode: rm.timecode,
          oldTimestampSeconds: rm.timestampSeconds,
          reason: `Marker no longer exists in current script outline.`,
          safeToAutoSync: true,
        });
      }
    }

    return diffs;
  }

  private static getMarkerKey(m: CreatorTimelineMarker): string {
    return `${m.category}_${m.label.trim().toLowerCase()}`;
  }

  private static findByCategoryAndNearTimestamp(
    target: CreatorTimelineMarker,
    candidates: CreatorTimelineMarker[],
    alreadyMatched: Set<string>
  ): CreatorTimelineMarker | undefined {
    return candidates.find(
      (c) =>
        !alreadyMatched.has(c.id) &&
        c.category === target.category &&
        Math.abs(c.timestampSeconds - target.timestampSeconds) < 30.0
    );
  }
}
