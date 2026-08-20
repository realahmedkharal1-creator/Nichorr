import { CreatorTimelineMarker, TimelineExportResult, TimelineExportOptions } from "./timeline.types";
import { TimelineEngine } from "./timeline.engine";

export class TimelineEdlExporter {
  /**
   * Generates a standard CMX 3600 Timeline Marker EDL format.
   * Compatible with DaVinci Resolve, Adobe Premiere Pro, and Final Cut Pro.
   */
  static exportToEdl(
    topic: string,
    markers: CreatorTimelineMarker[],
    targetDurationMinutes: number,
    options: TimelineExportOptions = { format: "EDL", fps: 24 }
  ): TimelineExportResult {
    const fps = options.fps || 24;
    const sanitizedTitle = topic
      .replace(/[^a-zA-Z0-9_\-]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 40);

    const lines: string[] = [];
    lines.push(`TITLE: ${sanitizedTitle}_Timeline_Markers`);
    lines.push(`FCM: NON-DROP FRAME\n`);

    if (markers.length === 0) {
      lines.push(`* NO TIMELINE MARKERS CONFIGURED`);
    } else {
      markers.forEach((marker, index) => {
        const eventNum = (index + 1).toString().padStart(3, "0");
        const inTc = marker.timecode;
        // End timecode 1 frame after inTc for point markers
        const outSeconds = marker.timestampSeconds + 1 / fps;
        const outTc = TimelineEngine.secondsToTimecode(outSeconds, fps);

        // Standard CMX 3600 Cut Event format:
        // EVENT# REEL TRACK TRANS TYPE IN_SRC OUT_SRC IN_REC OUT_REC
        lines.push(`${eventNum}  AX       V     C        ${inTc} ${outTc} ${inTc} ${outTc}`);
        lines.push(`* FROM CLIP NAME: ${this.sanitizeLabel(marker.label)}`);
        if (marker.description) {
          lines.push(`* COMMENT: ${this.sanitizeLabel(marker.description)}`);
        }
        if (marker.color) {
          lines.push(`* COLOR: ${marker.color}`);
        }
        lines.push(``); // Blank line between events
      });
    }

    const content = lines.join("\n");
    const summary = TimelineEngine.computeSummary(markers, targetDurationMinutes);

    return {
      format: "EDL",
      fileName: `${sanitizedTitle}_Timeline_Markers.edl`,
      mimeType: "text/plain",
      content,
      summary,
      markers,
    };
  }

  private static sanitizeLabel(text: string): string {
    return (text || "")
      .replace(/[\r\n]+/g, " ")
      .replace(/[*#|]/g, "-")
      .trim();
  }
}
