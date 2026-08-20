import crypto from "crypto";
import {
  LongitudinalSiliconSeries,
  LongitudinalSiliconPoint,
  SiliconDriftClassification,
} from "./cross-lab-regression.types";

export class SiliconDriftEngine {
  public static buildSeries(params: {
    siliconFingerprint: string;
    architecture: string;
    sku: string;
    stepping: string;
    benchmarkSuite: string;
    metricType?: any;
    points: LongitudinalSiliconPoint[];
  }): LongitudinalSiliconSeries {
    const points = [...params.points].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const seriesId = `sds-${crypto
      .createHash("sha256")
      .update(`${params.siliconFingerprint}:${params.benchmarkSuite}`)
      .digest("hex")
      .slice(0, 16)}`;

    if (points.length === 0) {
      return {
        seriesId,
        siliconFingerprint: params.siliconFingerprint,
        architecture: params.architecture,
        sku: params.sku,
        stepping: params.stepping,
        benchmarkSuite: params.benchmarkSuite,
        metricType: params.metricType || "FPS",
        baselineScore: 0,
        latestScore: 0,
        minimumScore: 0,
        maximumScore: 0,
        medianScore: 0,
        totalDataPoints: 0,
        driftDeltaPercentage: 0,
        driftClassification: "INSUFFICIENT_DATA",
        driverTransitions: [],
        firmwareTransitions: [],
        biosTransitions: [],
        points: [],
        epistemicBoundary: "OBSERVED_DRIFT ≠ PHYSICAL_SILICON_DEGRADATION",
        lastEvaluatedAt: new Date().toISOString(),
      };
    }

    const scores = points.map((p) => p.score);
    const baselineScore = points[0].score;
    const latestScore = points[points.length - 1].score;
    const minimumScore = Math.min(...scores);
    const maximumScore = Math.max(...scores);

    const sortedScores = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sortedScores.length / 2);
    const medianScore =
      sortedScores.length % 2 !== 0
        ? sortedScores[mid]
        : (sortedScores[mid - 1] + sortedScores[mid]) / 2;

    const driftDeltaPercentage = Number(
      (((latestScore - baselineScore) / (baselineScore || 1)) * 100).toFixed(2)
    );

    const driverTransitions = Array.from(new Set(points.map((p) => p.driverVersion)));
    const firmwareTransitions = Array.from(new Set(points.map((p) => p.firmwareVersion)));
    const biosTransitions = Array.from(new Set(points.map((p) => p.biosVersion)));

    let driftClassification: SiliconDriftClassification = "STABLE";

    if (points.length < 2) {
      driftClassification = "INSUFFICIENT_DATA";
    } else if (driverTransitions.length > 2 || biosTransitions.length > 2) {
      driftClassification = "CONFOUNDED";
    } else if (driftDeltaPercentage < -5.0) {
      driftClassification = "REPEATED_REGRESSION";
    } else if (driftDeltaPercentage > 5.0) {
      driftClassification = "REPEATED_IMPROVEMENT";
    } else if (Math.abs(driftDeltaPercentage) > 2.0) {
      driftClassification = "OBSERVED_DRIFT";
    }

    return {
      seriesId,
      siliconFingerprint: params.siliconFingerprint,
      architecture: params.architecture,
      sku: params.sku,
      stepping: params.stepping,
      benchmarkSuite: params.benchmarkSuite,
      metricType: params.metricType || "FPS",
      baselineScore,
      latestScore,
      minimumScore,
      maximumScore,
      medianScore,
      totalDataPoints: points.length,
      driftDeltaPercentage,
      driftClassification,
      driverTransitions,
      firmwareTransitions,
      biosTransitions,
      points,
      epistemicBoundary: "OBSERVED_DRIFT ≠ PHYSICAL_SILICON_DEGRADATION (isCausallyEstablished: false)",
      lastEvaluatedAt: new Date().toISOString(),
    };
  }
}
