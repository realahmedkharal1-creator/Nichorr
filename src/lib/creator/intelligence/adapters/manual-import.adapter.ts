import { PlatformIngestionAdapter } from "./platform-adapter.interface";
import {
  AdapterPlatform,
  AdapterConnectionState,
  PlatformObservationItem,
} from "../intelligence.types";

export class ManualImportAdapter implements PlatformIngestionAdapter {
  getPlatform(): AdapterPlatform {
    return "CREATOR_IMPORT";
  }

  getConnectionState(): AdapterConnectionState {
    return "LOCAL_ONLY";
  }

  validate(rawData: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!rawData || typeof rawData !== "object") {
      errors.push("Invalid payload: expected structured data.");
      return { isValid: false, errors, warnings };
    }

    if (!rawData.items || !Array.isArray(rawData.items) || rawData.items.length === 0) {
      errors.push("Payload must contain a non-empty 'items' array.");
    } else {
      rawData.items.forEach((item: any, idx: number) => {
        if (!item.name || item.value === undefined) {
          errors.push(`Item at index ${idx} must contain both 'name' and 'value'.`);
        }
      });
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  normalize(rawData: any): PlatformObservationItem[] {
    const nowStr = new Date().toISOString();
    const items: PlatformObservationItem[] = [];

    if (Array.isArray(rawData.items)) {
      for (const item of rawData.items) {
        items.push({
          id: `imp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: String(item.name),
          value: item.value,
          unit: item.unit,
          classification: "IMPORTED_OBSERVATION",
          observedAt: item.observedAt || nowStr,
          sourcePlatform: "CREATOR_IMPORT",
          metadata: item.metadata,
        });
      }
    }

    return items;
  }
}
