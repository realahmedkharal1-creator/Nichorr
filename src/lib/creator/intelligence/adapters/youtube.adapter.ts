import { PlatformIngestionAdapter } from "./platform-adapter.interface";
import {
  AdapterPlatform,
  AdapterConnectionState,
  PlatformObservationItem,
} from "../intelligence.types";

export class YouTubeIngestionAdapter implements PlatformIngestionAdapter {
  getPlatform(): AdapterPlatform {
    return "YOUTUBE";
  }

  getConnectionState(): AdapterConnectionState {
    return "IMPORT_AVAILABLE";
  }

  validate(rawData: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rawData || typeof rawData !== "object") {
      errors.push("Invalid payload: expected an object with YouTube metrics.");
      return { isValid: false, errors, warnings };
    }

    if (rawData.views !== undefined) {
      if (typeof rawData.views !== "number" || rawData.views < 0) {
        errors.push("Invalid 'views': must be a non-negative number.");
      }
    }

    if (rawData.retention !== undefined) {
      if (typeof rawData.retention !== "number" || rawData.retention < 0 || rawData.retention > 100) {
        errors.push("Invalid 'retention': must be a percentage between 0 and 100.");
      }
    }

    if (rawData.ctr !== undefined) {
      if (typeof rawData.ctr !== "number" || rawData.ctr < 0 || rawData.ctr > 100) {
        errors.push("Invalid 'ctr': must be a percentage between 0 and 100.");
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  normalize(rawData: any): PlatformObservationItem[] {
    const nowStr = new Date().toISOString();
    const items: PlatformObservationItem[] = [];

    if (rawData.views !== undefined) {
      items.push({
        id: `yt-views-${Date.now().toString(36)}`,
        name: "Views",
        value: Number(rawData.views),
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    if (rawData.retention !== undefined) {
      items.push({
        id: `yt-ret-${Date.now().toString(36)}`,
        name: "Average Percentage Viewed",
        value: Number(rawData.retention),
        unit: "%",
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    if (rawData.ctr !== undefined) {
      items.push({
        id: `yt-ctr-${Date.now().toString(36)}`,
        name: "Click-Through Rate",
        value: Number(rawData.ctr),
        unit: "%",
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    if (rawData.watchTimeHours !== undefined) {
      items.push({
        id: `yt-wt-${Date.now().toString(36)}`,
        name: "Watch Time",
        value: Number(rawData.watchTimeHours),
        unit: "hrs",
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    if (rawData.likes !== undefined) {
      items.push({
        id: `yt-likes-${Date.now().toString(36)}`,
        name: "Likes",
        value: Number(rawData.likes),
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    if (rawData.comments !== undefined) {
      items.push({
        id: `yt-comm-${Date.now().toString(36)}`,
        name: "Comments",
        value: Number(rawData.comments),
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "YOUTUBE",
      });
    }

    return items;
  }
}
