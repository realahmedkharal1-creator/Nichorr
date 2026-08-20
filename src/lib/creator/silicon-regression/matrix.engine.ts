import crypto from "node:crypto";
import {
  SiliconRegressionObservation,
  SiliconRegressionPair,
  SiliconRegressionMatrix,
  RegressionState,
} from "./silicon-regression.types";
import { RegressionCauseEngine } from "./cause-candidate.engine";
import { RegressionConfounderEngine } from "./confounder.engine";
import { SiliconRegressionSeriesEngine } from "./series.engine";
import { MethodologyAlignmentEngine } from "../collective-intelligence/methodology.engine";

export class SiliconRegressionMatrixEngine {
  /**
   * Evaluates a pair of observations to assess performance regression or improvement.
   */
  static evaluatePair(
    baseline: SiliconRegressionObservation,
    candidate: SiliconRegressionObservation,
    blockers: string[] = []
  ): SiliconRegressionPair {
    const pairId = `srp-${crypto
      .createHash("sha256")
      .update(`${baseline.observationId}:${candidate.observationId}`)
      .digest("hex")
      .substring(0, 10)}`;

    const absoluteDelta = Number((candidate.measuredScore - baseline.measuredScore).toFixed(1));
    const percentageDelta =
      baseline.measuredScore > 0
        ? Number(((absoluteDelta / baseline.measuredScore) * 100).toFixed(1))
        : 0;

    // Check methodology comparability
    const compReport = MethodologyAlignmentEngine.alignObservations(
      {
        observationId: baseline.observationId,
        federationRecordId: "fed-base",
        userId: baseline.userId,
        researchRunId: baseline.researchRunId,
        hardware: {
          manufacturer: baseline.architecture,
          hardwareFamily: baseline.generation,
          exactModel: baseline.sku,
          cpu: baseline.cpu,
          gpu: baseline.gpu,
        },
        software: {
          benchmarkSuite: baseline.benchmarkSuite,
          benchmarkVersion: baseline.benchmarkVersion,
          driver: baseline.driver,
        },
        testConfig: {
          resolution: baseline.resolution,
          preset: baseline.preset,
          renderingApi: baseline.renderingApi,
          upscalingTechnology: baseline.upscalingTech,
          upscalingMode: baseline.upscalingMode,
          frameGeneration: baseline.frameGeneration,
          rayTracing: baseline.rayTracing,
          thermalConditionsCelsius: baseline.thermalConditionsCelsius,
          powerConditionsWatts: baseline.powerLimitWatts,
        },
        measurement: {
          metric: "Score",
          value: baseline.measuredScore,
          unit: baseline.metricUnit,
          sourcePublisher: baseline.sourcePublisher,
          evidenceSnapshotHash: baseline.evidenceSnapshotHash,
          classification: "VERIFIED_RESEARCH_EVIDENCE",
        },
        methodologyFingerprint: "fp-meth-base",
        hardwareFingerprint: baseline.hardwareFingerprint,
        normalizedAt: baseline.observedAt,
      },
      {
        observationId: candidate.observationId,
        federationRecordId: "fed-cand",
        userId: candidate.userId,
        researchRunId: candidate.researchRunId,
        hardware: {
          manufacturer: candidate.architecture,
          hardwareFamily: candidate.generation,
          exactModel: candidate.sku,
          cpu: candidate.cpu,
          gpu: candidate.gpu,
        },
        software: {
          benchmarkSuite: candidate.benchmarkSuite,
          benchmarkVersion: candidate.benchmarkVersion,
          driver: candidate.driver,
        },
        testConfig: {
          resolution: candidate.resolution,
          preset: candidate.preset,
          renderingApi: candidate.renderingApi,
          upscalingTechnology: candidate.upscalingTech,
          upscalingMode: candidate.upscalingMode,
          frameGeneration: candidate.frameGeneration,
          rayTracing: candidate.rayTracing,
          thermalConditionsCelsius: candidate.thermalConditionsCelsius,
          powerConditionsWatts: candidate.powerLimitWatts,
        },
        measurement: {
          metric: "Score",
          value: candidate.measuredScore,
          unit: candidate.metricUnit,
          sourcePublisher: candidate.sourcePublisher,
          evidenceSnapshotHash: candidate.evidenceSnapshotHash,
          classification: "VERIFIED_RESEARCH_EVIDENCE",
        },
        methodologyFingerprint: "fp-meth-cand",
        hardwareFingerprint: candidate.hardwareFingerprint,
        normalizedAt: candidate.observedAt,
      }
    );

    const causeCandidates = RegressionCauseEngine.detectCauseCandidates(baseline, candidate);
    const confounders = RegressionConfounderEngine.detectConfounders(baseline, candidate);
    const dimensionDifferences = compReport.dimensionDifferences;

    // Determine regression state
    let regressionState: RegressionState = "NO_REGRESSION";

    // 1. Check Hard Blockers
    if (blockers.length > 0) {
      regressionState = "BLOCKED";
    } else if (compReport.alignmentState === "NOT_COMPARABLE") {
      regressionState = "NOT_COMPARABLE";
    } else if (confounders.length >= 2) {
      regressionState = "CONFOUNDED";
    } else if (percentageDelta > 3) {
      regressionState = "IMPROVEMENT";
    } else if (percentageDelta < -8) {
      regressionState = "CONFIRMED_EMPIRICAL_REGRESSION";
    } else if (percentageDelta < -3) {
      regressionState = "LIKELY_REGRESSION";
    } else if (percentageDelta < -1) {
      regressionState = "POSSIBLE_REGRESSION";
    } else {
      regressionState = "NO_REGRESSION";
    }

    let explanation = `Observed delta: ${percentageDelta > 0 ? `+${percentageDelta}%` : `${percentageDelta}%`} (${baseline.measuredScore} -> ${candidate.measuredScore} ${baseline.metricUnit}).`;
    if (regressionState === "CONFIRMED_EMPIRICAL_REGRESSION") {
      explanation += ` Confirmed empirical regression exceeding 8% threshold.`;
    } else if (regressionState === "CONFOUNDED") {
      explanation += ` Multi-variable variance (${confounders.length} confounders) prevents single-factor attribution.`;
    }

    return {
      pairId,
      baselineObservation: baseline,
      candidateObservation: candidate,
      absoluteDelta,
      percentageDelta,
      comparabilityState: compReport.alignmentState,
      regressionState,
      causeCandidates,
      confounders,
      dimensionDifferences,
      explanation,
      isEmpiricallyConfirmed: regressionState === "CONFIRMED_EMPIRICAL_REGRESSION",
    };
  }

  /**
   * Constructs the full Silicon Regression Matrix for a set of observations.
   */
  static buildMatrix(
    researchRunId: string,
    userId: string,
    observations: SiliconRegressionObservation[],
    blockers: string[] = []
  ): SiliconRegressionMatrix {
    const pairs: SiliconRegressionPair[] = [];
    const series = SiliconRegressionSeriesEngine.buildSeries(observations);

    // Build comparable pairs within same benchmark suite
    for (let i = 0; i < observations.length; i++) {
      for (let j = i + 1; j < observations.length; j++) {
        const oA = observations[i];
        const oB = observations[j];

        if (oA.benchmarkSuite.toLowerCase().trim() === oB.benchmarkSuite.toLowerCase().trim()) {
          const pair = this.evaluatePair(oA, oB, blockers);
          pairs.push(pair);
        }
      }
    }

    const detectedRegressionsCount = pairs.filter(
      (p) =>
        p.regressionState === "CONFIRMED_EMPIRICAL_REGRESSION" ||
        p.regressionState === "LIKELY_REGRESSION" ||
        p.regressionState === "POSSIBLE_REGRESSION"
    ).length;

    const detectedImprovementsCount = pairs.filter((p) => p.regressionState === "IMPROVEMENT").length;
    const confoundedCount = pairs.filter((p) => p.regressionState === "CONFOUNDED").length;
    const contradictedCount = pairs.filter((p) => p.regressionState === "CONTRADICTED").length;
    const comparableObservationsCount = observations.length;

    const matrixSnapshotHash = crypto
      .createHash("sha256")
      .update(
        `${researchRunId}:${observations.length}:${pairs.length}:${detectedRegressionsCount}:${detectedImprovementsCount}`
      )
      .digest("hex");

    return {
      matrixId: `srm-${researchRunId}-${matrixSnapshotHash.substring(0, 8)}`,
      userId,
      researchRunId,
      pairs,
      series,
      totalObservationsCount: observations.length,
      comparableObservationsCount,
      detectedRegressionsCount,
      detectedImprovementsCount,
      confoundedCount,
      contradictedCount,
      matrixSnapshotHash,
      isStale: false,
      updatedAt: new Date().toISOString(),
    };
  }
}
