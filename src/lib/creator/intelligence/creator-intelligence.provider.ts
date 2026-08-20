export * from "./intelligence.types";
export * from "./intelligence-audit.service";
export * from "./ingestion.engine";
export * from "./benchmark-synthesis.engine";
export * from "./intelligence-inspector.engine";
export * from "./adapters/platform-adapter.interface";
export * from "./adapters/youtube.adapter";
export * from "./adapters/podcast.adapter";
export * from "./adapters/manual-import.adapter";

import {
  AdapterPlatform,
  IngestionSnapshot,
  BenchmarkSpecification,
  CrossProjectSynthesisReport,
  CreatorIntelligenceInsight,
  IntelligenceClassification,
  PlatformObservationItem,
} from "./intelligence.types";
import { IngestionEngine } from "./ingestion.engine";
import { BenchmarkSynthesisEngine } from "./benchmark-synthesis.engine";
import { IntelligenceInspectorEngine } from "./intelligence-inspector.engine";
import { IntelligenceAuditService } from "./intelligence-audit.service";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForIntelProvider = globalThis as unknown as {
  creatorIntelStore: {
    snapshots: Map<string, IngestionSnapshot[]>;
    syntheses: Map<string, CrossProjectSynthesisReport[]>;
    insights: Map<string, CreatorIntelligenceInsight[]>;
  } | undefined;
};

const intelStore = globalForIntelProvider.creatorIntelStore ?? {
  snapshots: new Map<string, IngestionSnapshot[]>(),
  syntheses: new Map<string, CrossProjectSynthesisReport[]>(),
  insights: new Map<string, CreatorIntelligenceInsight[]>(),
};
if (process.env.NODE_ENV !== "production")
  globalForIntelProvider.creatorIntelStore = intelStore;

export class CreatorIntelligenceProvider {
  /**
   * Ingests, validates, and stores a platform snapshot.
   */
  static ingestPlatformData(
    userId: string,
    researchRunId: string,
    platform: AdapterPlatform,
    rawData: any,
    measurementWindow?: string
  ) {
    const result = IngestionEngine.ingestPlatformData(userId, researchRunId, platform, rawData, measurementWindow);
    if (result.success && result.snapshot) {
      const key = `${userId}:${researchRunId}`;
      const list = intelStore.snapshots.get(key) || [];
      const newList = [result.snapshot, ...list];
      intelStore.snapshots.set(key, newList);
      
      // Background save to Supabase
      CreatorIntelligenceRepo.saveArtifact("creator_intelligence", "IngestionSnapshot", key, newList).catch(e => console.warn(e));
    }
    return result;
  }

  /**
   * Retrieves ingestion snapshots.
   */
  static getIngestionSnapshots(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): IngestionSnapshot[] {
    const key = `${userId}:${researchRunId}`;
    return intelStore.snapshots.get(key) || [];
  }

  /**
   * Retrieves the latest ingestion snapshot.
   */
  static getLatestSnapshot(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): IngestionSnapshot | undefined {
    const list = this.getIngestionSnapshots(researchRunId, userId);
    return list[0];
  }

  /**
   * Runs cross-project benchmark synthesis across user-owned runs.
   */
  static synthesizeBenchmarks(
    userId: string,
    primaryRunId: string,
    primaryBenchmarks: BenchmarkSpecification[],
    comparedRunIds: string[],
    comparedBenchmarksMap: Record<string, BenchmarkSpecification[]>
  ): CrossProjectSynthesisReport {
    const report = BenchmarkSynthesisEngine.synthesizeCrossProjectBenchmarks(
      userId,
      primaryRunId,
      primaryBenchmarks,
      comparedRunIds,
      comparedBenchmarksMap
    );

    const key = `${userId}:${primaryRunId}`;
    const list = intelStore.syntheses.get(key) || [];
    const newList = [report, ...list];
    intelStore.syntheses.set(key, newList);

    CreatorIntelligenceRepo.saveArtifact("creator_intelligence", "CrossProjectSynthesisReport", key, newList).catch(e => console.warn(e));

    return report;
  }

  /**
   * Retrieves latest synthesis report.
   */
  static getLatestSynthesis(
    primaryRunId: string,
    userId: string = "anonymous-creator"
  ): CrossProjectSynthesisReport | undefined {
    const key = `${userId}:${primaryRunId}`;
    const list = intelStore.syntheses.get(key) || [];
    return list[0];
  }

  /**
   * Retrieves intelligence insights.
   */
  static getInsights(
    primaryRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorIntelligenceInsight[] {
    const key = `${userId}:${primaryRunId}`;
    return intelStore.insights.get(key) || [];
  }

  /**
   * Creates an explainable intelligence insight.
   */
  static createExplainableInsight(
    userId: string,
    primaryRunId: string,
    category: string,
    classification: IntelligenceClassification,
    title: string,
    narrative: string,
    inputObservation: PlatformObservationItem,
    evidenceContextRef: string,
    actionRequired: string,
    requiresResearchValidation: boolean = true
  ): CreatorIntelligenceInsight {
    const insight = IntelligenceInspectorEngine.createExplainableInsight(
      userId,
      primaryRunId,
      category,
      classification,
      title,
      narrative,
      inputObservation,
      evidenceContextRef,
      actionRequired,
      requiresResearchValidation
    );

    const key = `${userId}:${primaryRunId}`;
    const list = intelStore.insights.get(key) || [];
    const newList = [insight, ...list];
    intelStore.insights.set(key, newList);

    CreatorIntelligenceRepo.saveArtifact("creator_intelligence", "CreatorIntelligenceInsight", key, newList).catch(e => console.warn(e));

    return insight;
  }

  /**
   * Retrieves immutable audit ledger.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    return IntelligenceAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory caches (for testing).
   */
  static clearCache(): void {
    intelStore.snapshots.clear();
    intelStore.syntheses.clear();
    intelStore.insights.clear();
    IntelligenceAuditService.clearHistory();
  }
}
