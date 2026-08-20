import { CreatorTimelineMarker, TimelineMarkerCategory } from "../timeline/timeline.types";
import { ImportedTimelineResult } from "./editor-integration.types";

export class TimelineImporter {
  /**
   * Imports and validates a CMX 3600 EDL string into structured timeline markers.
   */
  static importEdl(edlContent: string, fps: number = 24): ImportedTimelineResult {
    const warnings: string[] = [];
    if (!edlContent || typeof edlContent !== "string" || !edlContent.trim()) {
      return {
        format: "EDL",
        status: "INVALID",
        timelineName: "Untitled_EDL",
        frameRate: fps,
        markers: [],
        warnings: ["Empty or non-string EDL content provided."],
        rawEventCount: 0,
      };
    }

    const lines = edlContent.split(/\r?\n/);
    let timelineName = "Imported_EDL";
    const markers: CreatorTimelineMarker[] = [];
    let currentMarker: Partial<CreatorTimelineMarker> | null = null;
    let rawEventCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith("TITLE:")) {
        timelineName = line.replace("TITLE:", "").trim();
        continue;
      }

      // Check for CMX event line: e.g. "001  AX       V     C        00:00:00:00 00:00:00:01 00:00:00:00 00:00:00:01"
      const eventMatch = line.match(/^(\d{3,4})\s+([\w\d]+)\s+([VA])\s+([C])\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})\s+(\d{2}:\d{2}:\d{2}:\d{2})/);
      if (eventMatch) {
        if (currentMarker && currentMarker.label) {
          markers.push(this.finalizeMarker(currentMarker, markers.length + 1, fps));
        }

        rawEventCount++;
        const markerNum = parseInt(eventMatch[1], 10);
        const inTc = eventMatch[5];
        const seconds = this.timecodeToSeconds(inTc, fps);

        currentMarker = {
          id: `imp-edl-${markerNum}`,
          markerNumber: markerNum,
          timestampSeconds: seconds,
          timecode: inTc,
          durationSeconds: 1 / fps,
          category: "SCRIPT_SECTION",
          isEvidenceGrounded: false,
        };
        continue;
      }

      if (currentMarker) {
        if (line.startsWith("* FROM CLIP NAME:")) {
          currentMarker.label = line.replace("* FROM CLIP NAME:", "").trim();
          currentMarker.category = this.inferCategory(currentMarker.label);
        } else if (line.startsWith("* COMMENT:")) {
          currentMarker.description = line.replace("* COMMENT:", "").trim();
        } else if (line.startsWith("* COLOR:")) {
          currentMarker.color = line.replace("* COLOR:", "").trim() as any;
        }
      }
    }

    if (currentMarker && currentMarker.label) {
      markers.push(this.finalizeMarker(currentMarker, markers.length + 1, fps));
    }

    let status: ImportedTimelineResult["status"] = "VALID";
    if (markers.length === 0 && rawEventCount > 0) {
      status = "PARTIAL";
      warnings.push("EDL contained events but no recognized clip names or markers.");
    } else if (markers.length === 0) {
      status = "INVALID";
      warnings.push("No valid CMX 3600 EDL events found.");
    }

    return {
      format: "EDL",
      status,
      timelineName,
      frameRate: fps,
      markers,
      warnings,
      rawEventCount,
    };
  }

  /**
   * Imports and validates an Apple FCPXML string into structured timeline markers.
   */
  static importFcpxml(fcpxmlContent: string, defaultFps: number = 24): ImportedTimelineResult {
    const warnings: string[] = [];
    if (!fcpxmlContent || typeof fcpxmlContent !== "string" || !fcpxmlContent.includes("<fcpxml")) {
      return {
        format: "FCPXML",
        status: "INVALID",
        timelineName: "Untitled_FCPXML",
        frameRate: defaultFps,
        markers: [],
        warnings: ["Missing or malformed <fcpxml root element."],
        rawEventCount: 0,
      };
    }

    // Extract project/timeline name
    const projectMatch = fcpxmlContent.match(/<project name="([^"]+)"/);
    const timelineName = projectMatch ? projectMatch[1] : "Imported_FCPXML";

    // Extract sequence duration
    const seqMatch = fcpxmlContent.match(/<sequence duration="([^"]+)s"/);
    const sequenceDurationSeconds = seqMatch ? parseFloat(seqMatch[1]) : undefined;

    // Extract markers using safe regex matching
    const markerRegex = /<marker\s+([^>]+)\/?>/g;
    const markers: CreatorTimelineMarker[] = [];
    let rawEventCount = 0;
    let match: RegExpExecArray | null;

    while ((match = markerRegex.exec(fcpxmlContent)) !== null) {
      rawEventCount++;
      const attrs = match[1];
      const startMatch = attrs.match(/start="([^"]+)s"/);
      const valueMatch = attrs.match(/value="([^"]+)"/);
      const noteMatch = attrs.match(/note="([^"]+)"/);

      if (startMatch && valueMatch) {
        const startSec = parseFloat(startMatch[1]);
        const label = this.unescapeXml(valueMatch[1]);
        const description = noteMatch ? this.unescapeXml(noteMatch[1]) : undefined;
        const timecode = this.secondsToTimecode(startSec, defaultFps);

        markers.push({
          id: `imp-fcpxml-${rawEventCount}`,
          markerNumber: rawEventCount,
          timestampSeconds: startSec,
          timecode,
          durationSeconds: 1 / defaultFps,
          label,
          description,
          category: this.inferCategory(label),
          isEvidenceGrounded: false,
        });
      }
    }

    const status: ImportedTimelineResult["status"] = markers.length > 0 ? "VALID" : "PARTIAL";
    if (markers.length === 0) {
      warnings.push("FCPXML document parsed successfully but contained 0 <marker elements.");
    }

    return {
      format: "FCPXML",
      status,
      timelineName,
      sequenceDurationSeconds,
      frameRate: defaultFps,
      markers,
      warnings,
      rawEventCount,
    };
  }

  private static finalizeMarker(marker: Partial<CreatorTimelineMarker>, num: number, fps: number): CreatorTimelineMarker {
    const startSec = marker.timestampSeconds || 0;
    return {
      id: marker.id || `marker-${num}`,
      markerNumber: num,
      timestampSeconds: startSec,
      timecode: marker.timecode || this.secondsToTimecode(startSec, fps),
      durationSeconds: marker.durationSeconds || 1 / fps,
      label: marker.label || `Event ${num}`,
      description: marker.description,
      category: marker.category || "SCRIPT_SECTION",
      color: marker.color || "CYAN",
      isEvidenceGrounded: false,
    };
  }

  private static inferCategory(label: string): TimelineMarkerCategory {
    const l = (label || "").toUpperCase();
    if (l.includes("CHAPTER") || l.startsWith("CH:")) return "CHAPTER";
    if (l.includes("BENCHMARK") || l.includes("GEEKBENCH") || l.includes("CINEBENCH") || l.includes("FPS")) return "BENCHMARK";
    if (l.includes("THERMAL") || l.includes("THROTTLE") || l.includes("TEMP") || l.includes("FLIR")) return "THERMAL";
    if (l.includes("B-ROLL") || l.includes("BROLL") || l.includes("SHOT")) return "BROLL";
    if (l.includes("HOOK") || l.includes("INTRO")) return "HOOK";
    if (l.includes("VERDICT") || l.includes("CONCLUSION")) return "VERDICT";
    return "SCRIPT_SECTION";
  }

  private static timecodeToSeconds(tc: string, fps: number): number {
    const parts = tc.split(":").map(Number);
    if (parts.length < 4) return 0;
    const [h, m, s, f] = parts;
    return h * 3600 + m * 60 + s + f / fps;
  }

  private static secondsToTimecode(seconds: number, fps: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * fps);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${f.toString().padStart(2, "0")}`;
  }

  private static unescapeXml(str: string): string {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }
}
