import crypto from "crypto";
import {
  NormalizedLaboratoryObservation,
  CanonicalMetricType,
  EpistemicLayer,
} from "./cross-lab-regression.types";

export class CrossLabNormalizationEngine {
  public static normalizeObservation(params: {
    laboratoryId: string;
    clusterId: string;
    nodeId: string;
    experimentId?: string;
    runIndex: number;
    benchmarkSuite: string;
    benchmarkVersion: string;
    metricType?: CanonicalMetricType;
    rawScore: number;
    metricUnit?: string;
    powerWatts?: number;
    temperatureCelsius?: number;
    clockFrequencyGhz?: number;
    sourceSnapshotHash: string;
    methodologyFingerprint: string;
    siliconFingerprint: string;
    clusterReproducibilityFingerprint?: string;
    epistemicLayer?: EpistemicLayer;
    evidenceClassification?: string;
    baselineReferenceScore?: number;
  }): NormalizedLaboratoryObservation {
    const metricType = params.metricType || "FPS";
    const metricUnit = params.metricUnit || "fps";
    const epistemicLayer = params.epistemicLayer || "PHYSICAL_MEASUREMENT";
    const evidenceClassification = params.evidenceClassification || "MEASURED_LABORATORY_OBSERVATION";
    const clusterReproducibilityFingerprint = params.clusterReproducibilityFingerprint || "crfp-default";

    const baseline = params.baselineReferenceScore || 100.0;
    const normalizedScore = Number(((params.rawScore / baseline) * 100).toFixed(2));

    const canonicalData = {
      laboratoryId: params.laboratoryId,
      clusterId: params.clusterId,
      nodeId: params.nodeId,
      runIndex: params.runIndex,
      benchmarkSuite: params.benchmarkSuite,
      benchmarkVersion: params.benchmarkVersion,
      metricType,
      rawScore: params.rawScore,
      normalizedScore,
      metricUnit,
      powerWatts: params.powerWatts,
      temperatureCelsius: params.temperatureCelsius,
      clockFrequencyGhz: params.clockFrequencyGhz,
      sourceSnapshotHash: params.sourceSnapshotHash,
      methodologyFingerprint: params.methodologyFingerprint,
      siliconFingerprint: params.siliconFingerprint,
      clusterReproducibilityFingerprint,
      epistemicLayer,
      evidenceClassification,
    };

    const observationId = `obs-${crypto
      .createHash("sha256")
      .update(JSON.stringify(canonicalData))
      .digest("hex")
      .slice(0, 16)}`;

    return {
      observationId,
      ...canonicalData,
      observedAt: new Date().toISOString(),
    };
  }
}
