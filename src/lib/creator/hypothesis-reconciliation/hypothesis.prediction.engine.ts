import crypto from "crypto";
import {
  HypothesisPrediction,
  PredictionResult,
} from "./hypothesis.types";

export class HypothesisPredictionEngine {
  public static createPrediction(params: {
    hypothesisId: string;
    expectedMetric: string;
    expectedDirection: HypothesisPrediction["expectedDirection"];
    expectedRange?: [number, number];
    tolerancePercentage?: number;
    requiredConditions?: string[];
    requiredControls?: string[];
    validationMethod?: string;
  }): HypothesisPrediction {
    const rawPayload = JSON.stringify({
      hypothesisId: params.hypothesisId,
      expectedMetric: params.expectedMetric,
      expectedDirection: params.expectedDirection,
      expectedRange: params.expectedRange,
      tolerancePercentage: params.tolerancePercentage || 5.0,
      validationMethod: params.validationMethod || "PHYSICAL_BENCHMARK_SWEEP",
    });

    const snapshotHash = crypto.createHash("sha256").update(rawPayload).digest("hex");
    const predictionId = `hypred-${snapshotHash.slice(0, 16)}`;

    return {
      predictionId,
      hypothesisId: params.hypothesisId,
      expectedMetric: params.expectedMetric,
      expectedDirection: params.expectedDirection,
      expectedRange: params.expectedRange || [100, 125],
      tolerancePercentage: params.tolerancePercentage || 5.0,
      requiredConditions: params.requiredConditions || ["Fixed ambient temp 21°C", "VBIOS Power Limit locked"],
      requiredControls: params.requiredControls || ["Clean driver install", "No background telemetry"],
      validationMethod: params.validationMethod || "PHYSICAL_BENCHMARK_SWEEP",
      status: "PENDING",
      result: "NOT_TESTED",
      snapshotHash,
    };
  }

  public static evaluatePrediction(
    prediction: HypothesisPrediction,
    observedValue: number
  ): HypothesisPrediction {
    const minExpected = prediction.expectedRange ? prediction.expectedRange[0] : 100;
    const maxExpected = prediction.expectedRange ? prediction.expectedRange[1] : 125;

    let result: PredictionResult = "MATCHED";

    if (observedValue >= minExpected && observedValue <= maxExpected) {
      result = "MATCHED";
    } else {
      const lowerTolerance = minExpected * (1 - prediction.tolerancePercentage / 100);
      const upperTolerance = maxExpected * (1 + prediction.tolerancePercentage / 100);

      if (observedValue >= lowerTolerance && observedValue <= upperTolerance) {
        result = "PARTIALLY_MATCHED";
      } else {
        result = "MISSED";
      }
    }

    return {
      ...prediction,
      status: "EVALUATED",
      observedValue,
      result,
    };
  }
}
