export * from "./timeline.types";
export * from "./timeline.engine";
export * from "./timeline.edl.exporter";
export * from "./timeline.fcpxml.exporter";

import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { TimelineExportOptions, TimelineExportResult, CreatorTimelineMarker } from "./timeline.types";
import { TimelineEngine } from "./timeline.engine";
import { TimelineEdlExporter } from "./timeline.edl.exporter";
import { TimelineFcpxmlExporter } from "./timeline.fcpxml.exporter";

export class TimelineProvider {
  /**
   * Generates timeline markers from Creator Studio report.
   */
  static getMarkers(
    report: CreatorStudioReport,
    preferences?: CreatorProductionPreferences,
    fps: number = 24
  ): CreatorTimelineMarker[] {
    return TimelineEngine.generateMarkers(report, preferences, fps);
  }

  /**
   * Exports timeline markers to EDL or FCPXML format.
   */
  static exportTimeline(
    topic: string,
    markers: CreatorTimelineMarker[],
    targetDurationMinutes: number,
    options: TimelineExportOptions = { format: "EDL", fps: 24 }
  ): TimelineExportResult {
    if (options.format === "FCPXML") {
      return TimelineFcpxmlExporter.exportToFcpxml(topic, markers, targetDurationMinutes, options);
    }
    return TimelineEdlExporter.exportToEdl(topic, markers, targetDurationMinutes, options);
  }
}
