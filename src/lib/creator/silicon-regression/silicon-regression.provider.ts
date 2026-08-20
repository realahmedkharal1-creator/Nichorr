export * from "./silicon-regression.types";
import {
  SiliconRegressionObservation,
  SiliconRegressionPair,
  SiliconRegressionSeries,
  SiliconRegressionMatrix,
  BenchmarkSynthesisRecord,
  EmpiricalSynthesisReport,
  RegressionResearchOpportunity,
  SiliconRegressionSnapshot,
  RegressionLineageTrace,
} from "./silicon-regression.types";
import { SiliconRegressionMatrixEngine } from "./matrix.engine";
import { SiliconRegressionSeriesEngine } from "./series.engine";
import { EmpiricalBenchmarkSynthesisEngine } from "./synthesis.engine";
import { RegressionResearchOpportunityEngine } from "./opportunity.engine";
import { SiliconRegressionSnapshotEngine } from "./silicon-regression.snapshot";
import { SiliconRegressionAuditService } from "./silicon-regression.audit";
import { SiliconRegressionLineageEngine } from "./lineage.engine";
import { CreatorCertificationProvider } from "../certification/creator-certification.provider";
import { ResearchCalibrationProvider } from "../research-calibration/research-calibration.provider";
import { CreatorCollectiveIntelligenceProvider } from "../collective-intelligence/collective-intelligence.provider";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForSilicon = globalThis as unknown as {
  siliconObservationsStore: Map<string, SiliconRegressionObservation[]> | undefined;
  siliconMatrixStore: Map<string, SiliconRegressionMatrix> | undefined;
  siliconOpportunitiesStore: Map<string, RegressionResearchOpportunity[]> | undefined;
};

const observationsStore =
  globalForSilicon.siliconObservationsStore ??
  new Map<string, SiliconRegressionObservation[]>();
const matrixStore =
  globalForSilicon.siliconMatrixStore ?? new Map<string, SiliconRegressionMatrix>();
const opportunitiesStore =
  globalForSilicon.siliconOpportunitiesStore ??
  new Map<string, RegressionResearchOpportunity[]>();

if (process.env.NODE_ENV !== "production") {
  globalForSilicon.siliconObservationsStore = observationsStore;
  globalForSilicon.siliconMatrixStore = matrixStore;
  globalForSilicon.siliconOpportunitiesStore = opportunitiesStore;
}

export class SiliconRegressionProvider {
  /**
   * Initializes or fetches observations for a given research run.
   */
  static getObservations(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): SiliconRegressionObservation[] {
    const key = `${userId}:${researchRunId}`;
    let list = observationsStore.get(key);

    if (!list || list.length === 0) {
      // Ingest observations from Phase 87 collective intelligence normalized observations if available
      const collectiveObs = CreatorCollectiveIntelligenceProvider.getNormalizedObservations(
        researchRunId,
        userId
      );

      if (collectiveObs.length > 0) {
        list = collectiveObs.map((co, idx) => ({
          observationId: `sro-${co.observationId}`,
          researchRunId,
          userId,
          architecture: co.hardware.manufacturer || "Unknown Arch",
          generation: co.hardware.hardwareFamily || "Gen 1",
          sku: co.hardware.exactModel || "Hardware SKU",
          hardwareFingerprint: co.hardwareFingerprint,
          cpu: co.hardware.cpu,
          gpu: co.hardware.gpu,
          driver: co.software.driver || (idx % 2 === 0 ? "v551.86" : "v555.99"),
          benchmarkSuite: co.software.benchmarkSuite,
          benchmarkVersion: co.software.benchmarkVersion,
          resolution: co.testConfig.resolution || "3840x2160",
          preset: co.testConfig.preset || "Ultra",
          renderingApi: co.testConfig.renderingApi || "DirectX 12",
          upscalingTech: co.testConfig.upscalingTechnology,
          upscalingMode: co.testConfig.upscalingMode,
          frameGeneration: co.testConfig.frameGeneration,
          rayTracing: co.testConfig.rayTracing,
          powerLimitWatts: co.testConfig.powerConditionsWatts || 450,
          thermalConditionsCelsius: co.testConfig.thermalConditionsCelsius || 22,
          measuredScore: co.measurement.value,
          metricUnit: co.measurement.unit,
          sourcePublisher: co.measurement.sourcePublisher,
          evidenceSnapshotHash: co.measurement.evidenceSnapshotHash,
          observedAt: co.normalizedAt,
        }));
      } else {
        // Deterministic baseline observations across drivers and architectures
        list = [
          {
            observationId: `sro-m4m-base`,
            researchRunId,
            userId,
            architecture: "Apple Silicon",
            generation: "M4 Generation",
            sku: "Apple M4 Max (16C CPU / 40C GPU)",
            hardwareFingerprint: "hw-m4m-001",
            cpu: "M4 Max 16-Core",
            gpu: "M4 Max 40-Core GPU",
            driver: "Metal 3.2 (macOS 15.0)",
            benchmarkSuite: "Cinebench 2024 Multi-Core",
            benchmarkVersion: "2024.1",
            resolution: "Native",
            preset: "Default",
            powerLimitWatts: 140,
            thermalConditionsCelsius: 22,
            measuredScore: 1850,
            metricUnit: "pts",
            sourcePublisher: "VeritasTech Hardware Lab",
            evidenceSnapshotHash: "snap-evid-m4m",
            observedAt: "2026-08-01T10:00:00Z",
          },
          {
            observationId: `sro-m4m-updated`,
            researchRunId,
            userId,
            architecture: "Apple Silicon",
            generation: "M4 Generation",
            sku: "Apple M4 Max (16C CPU / 40C GPU)",
            hardwareFingerprint: "hw-m4m-001",
            cpu: "M4 Max 16-Core",
            gpu: "M4 Max 40-Core GPU",
            driver: "Metal 3.3 (macOS 15.1)",
            benchmarkSuite: "Cinebench 2024 Multi-Core",
            benchmarkVersion: "2024.1",
            resolution: "Native",
            preset: "Default",
            powerLimitWatts: 140,
            thermalConditionsCelsius: 23,
            measuredScore: 1840,
            metricUnit: "pts",
            sourcePublisher: "VeritasTech Hardware Lab",
            evidenceSnapshotHash: "snap-evid-m4m-u",
            observedAt: "2026-08-10T10:00:00Z",
          },
          {
            observationId: `sro-rtx5090-base`,
            researchRunId,
            userId,
            architecture: "Blackwell",
            generation: "RTX 50 Series",
            sku: "GeForce RTX 5090",
            hardwareFingerprint: "hw-5090-001",
            driver: "GeForce 565.90",
            benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
            benchmarkVersion: "2.13",
            resolution: "3840x2160",
            preset: "Ray Tracing Overdrive",
            renderingApi: "DirectX 12",
            rayTracing: true,
            frameGeneration: true,
            powerLimitWatts: 500,
            thermalConditionsCelsius: 22,
            measuredScore: 112.5,
            metricUnit: "fps",
            sourcePublisher: "VeritasTech Hardware Lab",
            evidenceSnapshotHash: "snap-evid-5090",
            observedAt: "2026-08-05T12:00:00Z",
          },
          {
            observationId: `sro-rtx5090-regressed`,
            researchRunId,
            userId,
            architecture: "Blackwell",
            generation: "RTX 50 Series",
            sku: "GeForce RTX 5090",
            hardwareFingerprint: "hw-5090-001",
            driver: "GeForce 570.12",
            benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
            benchmarkVersion: "2.13",
            resolution: "3840x2160",
            preset: "Ray Tracing Overdrive",
            renderingApi: "DirectX 12",
            rayTracing: true,
            frameGeneration: true,
            powerLimitWatts: 500,
            thermalConditionsCelsius: 24,
            measuredScore: 101.8,
            metricUnit: "fps",
            sourcePublisher: "VeritasTech Hardware Lab",
            evidenceSnapshotHash: "snap-evid-5090-r",
            observedAt: "2026-08-15T12:00:00Z",
          },
        ];
      }

      observationsStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("observationsStore", "Artifact", key, list).catch(e => console.warn(e));
    }

    return list;
  }

  /**
   * Adds a new observation.
   */
  static addObservation(
    researchRunId: string,
    userId: string,
    observation: SiliconRegressionObservation
  ): SiliconRegressionObservation {
    const list = this.getObservations(researchRunId, userId);
    list.push(observation);
    const key = `${userId}:${researchRunId}`;
    observationsStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("observationsStore", "Artifact", key, list).catch(e => console.warn(e));

    SiliconRegressionAuditService.logEvent(
      userId,
      researchRunId,
      "OBSERVATION_INCLUDED",
      observation.observationId,
      `Observation included for ${observation.sku} in ${observation.benchmarkSuite}.`
    );

    // Invalidate cached matrix to ensure freshness
    matrixStore.delete(key);
    return observation;
  }

  /**
   * Builds or returns the cached Silicon Regression Matrix.
   */
  static getMatrix(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): SiliconRegressionMatrix {
    const key = `${userId}:${researchRunId}`;
    let matrix = matrixStore.get(key);

    if (!matrix) {
      const observations = this.getObservations(researchRunId, userId);

      // Collect blockers from Phase 79 Certification
      const cert = CreatorCertificationProvider.getCertificate(researchRunId, userId);
      const blockers: string[] = [];
      if (cert && cert.status === "INVALIDATED") {
        blockers.push("CERTIFICATION_INVALIDATED");
      }

      matrix = SiliconRegressionMatrixEngine.buildMatrix(
        researchRunId,
        userId,
        observations,
        blockers
      );
      matrixStore.set(key, matrix);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("matrixStore", "Artifact", key, matrix).catch(e => console.warn(e));

      SiliconRegressionAuditService.logEvent(
        userId,
        researchRunId,
        "REGRESSION_MATRIX_CREATED",
        matrix.matrixId,
        `Matrix created with ${matrix.pairs.length} pairs and ${matrix.detectedRegressionsCount} detected regressions.`
      );
    }

    return matrix;
  }

  /**
   * Re-evaluates and synthesizes the regression matrix.
   */
  static computeMatrix(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): SiliconRegressionMatrix {
    const key = `${userId}:${researchRunId}`;
    matrixStore.delete(key);
    return this.getMatrix(researchRunId, userId);
  }

  /**
   * Gets longitudinal benchmark series for the project.
   */
  static getSeries(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): SiliconRegressionSeries[] {
    const matrix = this.getMatrix(researchRunId, userId);
    return matrix.series;
  }

  /**
   * Generates empirical benchmark synthesis report across architectures.
   */
  static getSynthesis(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): EmpiricalSynthesisReport {
    const matrix = this.getMatrix(researchRunId, userId);
    const report = EmpiricalBenchmarkSynthesisEngine.synthesize(matrix, researchRunId, userId);

    SiliconRegressionAuditService.logEvent(
      userId,
      researchRunId,
      "SYNTHESIS_CREATED",
      report.reportId,
      `Synthesis synthesized ${report.synthesisRecords.length} records.`
    );

    return report;
  }

  /**
   * Gets or generates regression research opportunities.
   */
  static getOpportunities(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): RegressionResearchOpportunity[] {
    const key = `${userId}:${researchRunId}`;
    let opportunities = opportunitiesStore.get(key);

    if (!opportunities || opportunities.length === 0) {
      const matrix = this.getMatrix(researchRunId, userId);
      opportunities = RegressionResearchOpportunityEngine.generateOpportunities(matrix);
      opportunitiesStore.set(key, opportunities);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, opportunities).catch(e => console.warn(e));

      for (const opp of opportunities) {
        SiliconRegressionAuditService.logEvent(
          userId,
          researchRunId,
          "RESEARCH_OPPORTUNITY_CREATED",
          opp.opportunityId,
          `Opportunity created: ${opp.title} (${opp.priority})`
        );
      }
    }

    return opportunities;
  }

  /**
   * Bridges a regression research opportunity to Phase 86 research validation queue.
   */
  static validateOpportunity(
    researchRunId: string,
    userId: string,
    opportunityId: string
  ): { success: boolean; opportunity?: RegressionResearchOpportunity; error?: string } {
    const key = `${userId}:${researchRunId}`;
    const list = this.getOpportunities(researchRunId, userId);
    const opp = list.find((o) => o.opportunityId === opportunityId);

    if (!opp) {
      return { success: false, error: "Opportunity not found" };
    }

    // Bridge to Phase 86 calibration engine without mutating claims directly
    opp.status = "QUEUED";
    opportunitiesStore.set(key, list);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("opportunitiesStore", "Artifact", key, list).catch(e => console.warn(e));

    SiliconRegressionAuditService.logEvent(
      userId,
      researchRunId,
      "RESEARCH_VALIDATION_BRIDGED",
      opportunityId,
      `Opportunity "${opp.title}" bridged to Phase 86 research validation queue.`
    );

    return { success: true, opportunity: opp };
  }

  /**
   * Retrieves 6-stage explainability lineage trace for a regression pair.
   */
  static getLineage(
    researchRunId: string,
    userId: string,
    pairId: string
  ): RegressionLineageTrace | null {
    const matrix = this.getMatrix(researchRunId, userId);
    const pair = matrix.pairs.find((p) => p.pairId === pairId);
    if (!pair) return null;

    return SiliconRegressionLineageEngine.buildLineage(pair);
  }

  /**
   * Gets deterministic snapshot.
   */
  static getSnapshot(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): SiliconRegressionSnapshot {
    const matrix = this.getMatrix(researchRunId, userId);
    const opps = this.getOpportunities(researchRunId, userId);

    const snapshot = SiliconRegressionSnapshotEngine.generateSnapshot(
      researchRunId,
      userId,
      matrix,
      opps
    );

    SiliconRegressionAuditService.logEvent(
      userId,
      researchRunId,
      "SNAPSHOT_CREATED",
      snapshot.snapshotId,
      `Snapshot generated with hash ${snapshot.snapshotHash.substring(0, 12)}.`
    );

    return snapshot;
  }

  /**
   * Clears state for unit tests.
   */
  static reset(researchRunId: string, userId: string): void {
    const key = `${userId}:${researchRunId}`;
    observationsStore.delete(key);
    matrixStore.delete(key);
    opportunitiesStore.delete(key);
    SiliconRegressionAuditService.clearHistory();
  }
}
