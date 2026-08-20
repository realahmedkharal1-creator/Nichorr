import {
  AdapterPlatform,
  IngestionSnapshot,
  PlatformObservationItem,
} from "./intelligence.types";
import { YouTubeIngestionAdapter } from "./adapters/youtube.adapter";
import { PodcastIngestionAdapter } from "./adapters/podcast.adapter";
import { ManualImportAdapter } from "./adapters/manual-import.adapter";
import { PlatformIngestionAdapter } from "./adapters/platform-adapter.interface";
import { IntelligenceAuditService } from "./intelligence-audit.service";

export class IngestionEngine {
  private static adapters: Map<AdapterPlatform, PlatformIngestionAdapter> = new Map([
    ["YOUTUBE", new YouTubeIngestionAdapter()],
    ["PODCAST", new PodcastIngestionAdapter()],
    ["CREATOR_IMPORT", new ManualImportAdapter()],
  ]);

  static getAdapter(platform: AdapterPlatform): PlatformIngestionAdapter {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Unsupported ingestion platform: ${platform}`);
    }
    return adapter;
  }

  /**
   * Generates deterministic hash for an ingestion snapshot.
   */
  static generateIngestionHash(
    userId: string,
    researchRunId: string,
    platform: AdapterPlatform,
    observations: PlatformObservationItem[]
  ): string {
    const sorted = [...observations].sort((a, b) => a.name.localeCompare(b.name));
    const summary = sorted.map((o) => `${o.name}:${o.value}:${o.classification}`).join("|");
    const raw = `${userId}:${researchRunId}:${platform}:${summary}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `ingest-snap-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Ingests, validates, normalizes, and snapshots observations from a platform.
   */
  static ingestPlatformData(
    userId: string,
    researchRunId: string,
    platform: AdapterPlatform,
    rawData: any,
    measurementWindow: string = "FIRST_48_HOURS"
  ): { success: boolean; snapshot?: IngestionSnapshot; errors?: string[]; warnings?: string[] } {
    const adapter = this.getAdapter(platform);
    const validation = adapter.validate(rawData);

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    }

    const observations = adapter.normalize(rawData);
    const connectionState = adapter.getConnectionState();
    const snapshotHash = this.generateIngestionHash(userId, researchRunId, platform, observations);
    const nowStr = new Date().toISOString();
    const snapshotId = `ingest-${researchRunId}-${platform}-${Date.now().toString(36)}`;

    const snapshot: IngestionSnapshot = {
      snapshotId,
      userId,
      researchRunId,
      platform,
      adapterId: `adapter-${platform.toLowerCase()}`,
      connectionState,
      observations,
      validationStatus: validation.warnings.length > 0 ? "WARNINGS" : "VALID",
      measurementWindow,
      snapshotHash,
      ingestedAt: nowStr,
    };

    IntelligenceAuditService.recordAuditEvent({
      auditId: `intel-aud-${Date.now().toString(36)}-ingest`,
      userId,
      researchRunId,
      action: "PLATFORM_INGESTED",
      details: `Ingested ${observations.length} items from ${platform} [${connectionState}]. Hash: ${snapshotHash}`,
      timestamp: nowStr,
    });

    return {
      success: true,
      snapshot,
      warnings: validation.warnings,
    };
  }
}
