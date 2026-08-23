import { CreatorTimelineMarker, TimelineExportResult, TimelineExportOptions } from "./timeline.types";
import { TimelineEngine } from "./timeline.engine";

export class TimelineFcpxmlExporter {
  /**
   * Generates a standard Apple FCPXML timeline marker document.
   * Compatible with Final Cut Pro, DaVinci Resolve, and Premiere Pro via XML import.
   */
  static exportToFcpxml(
    topic: string,
    markers: CreatorTimelineMarker[],
    targetDurationMinutes: number,
    options: TimelineExportOptions = { format: "FCPXML", fps: 24 }
  ): TimelineExportResult {
    const fps = options.fps || 24;
    const durationSeconds = targetDurationMinutes * 60;
    const sanitizedTitle = topic
      .replace(/[^a-zA-Z0-9_\-]/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 40);

    const frameDurationStr = fps === 30 ? "100/3000s" : fps === 60 ? "100/6000s" : "100/2400s";

    const lines: string[] = [];
    lines.push(`<?xml version="1.0" encoding="UTF-8"?>`);
    lines.push(`<!DOCTYPE fcpxml>`);
    lines.push(`<fcpxml version="1.9">`);
    lines.push(`  <resources>`);
    lines.push(`    <format id="r1" name="FFVideoFormat1080p${fps}" frameDuration="${frameDurationStr}" width="1920" height="1080"/>`);
    lines.push(`  </resources>`);
    lines.push(`  <library>`);
    lines.push(`    <event name="Nichorr_Research">`);
    lines.push(`      <project name="${this.escapeXml(sanitizedTitle)}_Timeline">`);
    lines.push(`        <sequence duration="${durationSeconds}s" format="r1">`);
    lines.push(`          <spine>`);
    lines.push(`            <gap name="Master Timeline" offset="0s" duration="${durationSeconds}s" start="0s">`);

    for (const marker of markers) {
      const startSec = marker.timestampSeconds;
      const markerDuration = `1/${fps}s`;
      const valueAttr = this.escapeXml(marker.label);
      const noteAttr = this.escapeXml(marker.description || "");

      lines.push(`              <marker start="${startSec}s" duration="${markerDuration}" value="${valueAttr}" note="${noteAttr}"/>`);
    }

    lines.push(`            </gap>`);
    lines.push(`          </spine>`);
    lines.push(`        </sequence>`);
    lines.push(`      </project>`);
    lines.push(`    </event>`);
    lines.push(`  </library>`);
    lines.push(`</fcpxml>`);

    const content = lines.join("\n");
    const summary = TimelineEngine.computeSummary(markers, targetDurationMinutes);

    return {
      format: "FCPXML",
      fileName: `${sanitizedTitle}_Timeline_Markers.fcpxml`,
      mimeType: "application/xml",
      content,
      summary,
      markers,
    };
  }

  private static escapeXml(text: string): string {
    return (text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}
