import { PlatformIngestionAdapter } from "./platform-adapter.interface";
import {
  AdapterPlatform,
  AdapterConnectionState,
  PlatformObservationItem,
} from "../intelligence.types";

export class PodcastIngestionAdapter implements PlatformIngestionAdapter {
  getPlatform(): AdapterPlatform {
    return "PODCAST";
  }

  getConnectionState(): AdapterConnectionState {
    return "NOT_CONFIGURED";
  }

  validate(rawData: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rawData || typeof rawData !== "object") {
      errors.push("Invalid payload: expected an object with Podcast metrics.");
      return { isValid: false, errors, warnings };
    }

    if (rawData.downloads !== undefined) {
      if (typeof rawData.downloads !== "number" || rawData.downloads < 0) {
        errors.push("Invalid 'downloads': must be a non-negative number.");
      }
    }

    if (rawData.completionRate !== undefined) {
      if (typeof rawData.completionRate !== "number" || rawData.completionRate < 0 || rawData.completionRate > 100) {
        errors.push("Invalid 'completionRate': must be between 0 and 100.");
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  normalize(rawData: any): PlatformObservationItem[] {
    const nowStr = new Date().toISOString();
    const items: PlatformObservationItem[] = [];

    if (rawData.downloads !== undefined) {
      items.push({
        id: `pod-dl-${Date.now().toString(36)}`,
        name: "Episode Downloads",
        value: Number(rawData.downloads),
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "PODCAST",
      });
    }

    if (rawData.completionRate !== undefined) {
      items.push({
        id: `pod-cr-${Date.now().toString(36)}`,
        name: "Average Completion Rate",
        value: Number(rawData.completionRate),
        unit: "%",
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "PODCAST",
      });
    }

    if (rawData.listens !== undefined) {
      items.push({
        id: `pod-listens-${Date.now().toString(36)}`,
        name: "Total Stream Listens",
        value: Number(rawData.listens),
        classification: "PLATFORM_METRIC",
        observedAt: nowStr,
        sourcePlatform: "PODCAST",
      });
    }

    return items;
  }
}
