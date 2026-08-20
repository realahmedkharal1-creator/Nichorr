export * from "./performance.types";
export * from "./performance-audit.service";
export * from "./performance-snapshot.engine";
export * from "./performance-comparison.engine";
export * from "./creator-learning.engine";
export * from "./audience-signal.engine";
export * from "./experiment.engine";
export * from "./research-feedback.engine";

import {
  CreatorPerformanceSnapshot,
  AudienceSignalRecord,
  CreatorExperimentRecord,
  ResearchOpportunityRecord,
  PerformanceComparisonReport,
  CreatorLearningInsight,
} from "./performance.types";
import { PerformanceSnapshotEngine } from "./performance-snapshot.engine";
import { PerformanceComparisonEngine } from "./performance-comparison.engine";
import { CreatorLearningEngine } from "./creator-learning.engine";
import { AudienceSignalEngine } from "./audience-signal.engine";
import { ExperimentEngine } from "./experiment.engine";
import { ResearchFeedbackEngine } from "./research-feedback.engine";
import { PerformanceAuditService } from "./performance-audit.service";

const globalForPerfProvider = globalThis as unknown as {
  creatorPerformanceStore: {
    snapshots: Map<string, CreatorPerformanceSnapshot[]>;
    signals: Map<string, AudienceSignalRecord[]>;
    experiments: Map<string, CreatorExperimentRecord[]>;
    opportunities: Map<string, ResearchOpportunityRecord[]>;
  } | undefined;
};

const perfStore = globalForPerfProvider.creatorPerformanceStore ?? {
  snapshots: new Map<string, CreatorPerformanceSnapshot[]>(),
  signals: new Map<string, AudienceSignalRecord[]>(),
  experiments: new Map<string, CreatorExperimentRecord[]>(),
  opportunities: new Map<string, ResearchOpportunityRecord[]>(),
};
if (process.env.NODE_ENV !== "production")
  globalForPerfProvider.creatorPerformanceStore = perfStore;

export class PerformanceProvider {
  /**
   * Records a deterministic performance snapshot.
   */
  static recordSnapshot(
    researchRunId: string,
    projectSnapshotHash: string,
    evidenceSnapshotHash: string,
    scriptVersion: number,
    platform: 'YOUTUBE_LONG_FORM' | 'YOUTUBE_SHORTS' | 'PODCAST',
    contentIdentifier: string,
    measurementWindow: string,
    publicationTimestamp: string,
    metrics: CreatorPerformanceSnapshot['metrics'],
    certificationCertificateId?: string,
    distributionPackageId?: string,
    userId: string = "anonymous-creator"
  ): CreatorPerformanceSnapshot {
    const snapshot = PerformanceSnapshotEngine.createSnapshot(
      researchRunId,
      projectSnapshotHash,
      evidenceSnapshotHash,
      scriptVersion,
      platform,
      contentIdentifier,
      measurementWindow,
      publicationTimestamp,
      metrics,
      certificationCertificateId,
      distributionPackageId,
      userId
    );

    const key = `${userId}:${researchRunId}`;
    const list = perfStore.snapshots.get(key) || [];
    perfStore.snapshots.set(key, [snapshot, ...list]);

    return snapshot;
  }

  /**
   * Retrieves all performance snapshots for a run.
   */
  static getSnapshots(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorPerformanceSnapshot[] {
    const key = `${userId}:${researchRunId}`;
    return perfStore.snapshots.get(key) || [];
  }

  /**
   * Retrieves the latest performance snapshot for a run.
   */
  static getLatestSnapshot(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorPerformanceSnapshot | undefined {
    const list = this.getSnapshots(researchRunId, userId);
    return list[0];
  }

  /**
   * Compares snapshots without claiming unverified causality.
   */
  static compareSnapshots(
    current: CreatorPerformanceSnapshot,
    baseline?: CreatorPerformanceSnapshot
  ): PerformanceComparisonReport {
    return PerformanceComparisonEngine.compareSnapshots(current, baseline);
  }

  /**
   * Generates learning insights with sample-size safeguards.
   */
  static generateInsights(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorLearningInsight[] {
    const snapshots = this.getSnapshots(researchRunId, userId);
    return CreatorLearningEngine.generateInsights(snapshots, userId);
  }

  /**
   * Logs an audience comment/question as an unverified signal.
   */
  static logAudienceComment(
    rawText: string,
    researchRunId: string,
    userId: string = "anonymous-creator",
    associatedSectionId?: string
  ): AudienceSignalRecord {
    const signal = AudienceSignalEngine.processAudienceComment(
      rawText,
      researchRunId,
      userId,
      associatedSectionId
    );

    const key = `${userId}:${researchRunId}`;
    const list = perfStore.signals.get(key) || [];
    perfStore.signals.set(key, [signal, ...list]);

    return signal;
  }

  /**
   * Retrieves audience signals.
   */
  static getAudienceSignals(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): AudienceSignalRecord[] {
    const key = `${userId}:${researchRunId}`;
    return perfStore.signals.get(key) || [];
  }

  /**
   * Creates a creator content experiment.
   */
  static createExperiment(
    researchRunId: string,
    hypothesis: string,
    variable: string,
    control: string,
    variant: string,
    primaryMetric: string,
    measurementWindow: string = "FIRST_48_HOURS",
    userId: string = "anonymous-creator"
  ): CreatorExperimentRecord {
    const experiment = ExperimentEngine.createExperiment(
      researchRunId,
      hypothesis,
      variable,
      control,
      variant,
      primaryMetric,
      measurementWindow,
      userId
    );

    const key = `${userId}:${researchRunId}`;
    const list = perfStore.experiments.get(key) || [];
    perfStore.experiments.set(key, [experiment, ...list]);

    return experiment;
  }

  /**
   * Retrieves experiments.
   */
  static getExperiments(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CreatorExperimentRecord[] {
    const key = `${userId}:${researchRunId}`;
    return perfStore.experiments.get(key) || [];
  }

  /**
   * Bridges an audience signal into a formal research opportunity.
   */
  static createResearchOpportunity(
    signal: AudienceSignalRecord,
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ResearchOpportunityRecord {
    const opp = ResearchFeedbackEngine.createOpportunityFromSignal(
      signal,
      researchRunId,
      userId
    );

    const key = `${userId}:${researchRunId}`;
    const list = perfStore.opportunities.get(key) || [];
    perfStore.opportunities.set(key, [opp, ...list]);

    return opp;
  }

  /**
   * Retrieves research opportunities.
   */
  static getResearchOpportunities(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ResearchOpportunityRecord[] {
    const key = `${userId}:${researchRunId}`;
    return perfStore.opportunities.get(key) || [];
  }

  /**
   * Retrieves immutable audit ledger.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ) {
    return PerformanceAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory performance stores (for testing).
   */
  static clearCache(): void {
    perfStore.snapshots.clear();
    perfStore.signals.clear();
    perfStore.experiments.clear();
    perfStore.opportunities.clear();
    PerformanceAuditService.clearHistory();
  }
}
