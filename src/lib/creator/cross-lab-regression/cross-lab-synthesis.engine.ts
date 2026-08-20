import crypto from "crypto";
import {
  CrossLabSynthesisComparison,
  CrossLabSynthesisMatrix,
  CrossLabSynthesisClassification,
  NormalizedLaboratoryObservation,
} from "./cross-lab-regression.types";
import { CrossLabMethodologyEngine, LabMethodologyConfig } from "./cross-lab-methodology.engine";

export interface SynthesisCandidate {
  laboratoryId: string;
  sku: string;
  driverVersion?: string;
  biosVersion?: string;
  powerLimitWatts?: number;
  observation: NormalizedLaboratoryObservation;
}

export class CrossLabSynthesisEngine {
  public static compareObservations(
    userId: string,
    researchRunId: string,
    candA: SynthesisCandidate,
    candB: SynthesisCandidate
  ): CrossLabSynthesisComparison {
    const obsA = candA.observation;
    const obsB = candB.observation;

    const methodologyA: LabMethodologyConfig = {
      benchmarkSuite: obsA.benchmarkSuite,
      benchmarkVersion: obsA.benchmarkVersion,
      metricType: obsA.metricType,
      resolution: "3840x2160",
      preset: "Ultra",
      renderingApi: "DirectX 12",
      driverVersion: candA.driverVersion,
      biosVersion: candA.biosVersion,
      powerLimitWatts: candA.powerLimitWatts || obsA.powerWatts,
    };

    const methodologyB: LabMethodologyConfig = {
      benchmarkSuite: obsB.benchmarkSuite,
      benchmarkVersion: obsB.benchmarkVersion,
      metricType: obsB.metricType,
      resolution: "3840x2160",
      preset: "Ultra",
      renderingApi: "DirectX 12",
      driverVersion: candB.driverVersion,
      biosVersion: candB.biosVersion,
      powerLimitWatts: candB.powerLimitWatts || obsB.powerWatts,
    };

    const compEval = CrossLabMethodologyEngine.evaluateCompatibility(methodologyA, methodologyB);

    const absoluteDelta = Number((obsB.rawScore - obsA.rawScore).toFixed(2));
    const percentageDelta = Number(
      (((obsB.rawScore - obsA.rawScore) / (obsA.rawScore || 1)) * 100).toFixed(2)
    );

    const powerDeltaWatts =
      obsA.powerWatts !== undefined && obsB.powerWatts !== undefined
        ? Number((obsB.powerWatts - obsA.powerWatts).toFixed(1))
        : undefined;

    const perfPerWattA =
      obsA.powerWatts && obsA.powerWatts > 0 ? obsA.rawScore / obsA.powerWatts : undefined;
    const perfPerWattB =
      obsB.powerWatts && obsB.powerWatts > 0 ? obsB.rawScore / obsB.powerWatts : undefined;
    const perfPerWattDelta =
      perfPerWattA !== undefined && perfPerWattB !== undefined
        ? Number((perfPerWattB - perfPerWattA).toFixed(3))
        : undefined;

    const thermalDeltaCelsius =
      obsA.temperatureCelsius !== undefined && obsB.temperatureCelsius !== undefined
        ? Number((obsB.temperatureCelsius - obsA.temperatureCelsius).toFixed(1))
        : undefined;

    const clockDeltaGhz =
      obsA.clockFrequencyGhz !== undefined && obsB.clockFrequencyGhz !== undefined
        ? Number((obsB.clockFrequencyGhz - obsA.clockFrequencyGhz).toFixed(2))
        : undefined;

    let synthesisClassification: CrossLabSynthesisClassification = "NO_MATERIAL_CHANGE";
    const candidateCauses: string[] = [];
    const isContradicted = candA.sku === candB.sku && Math.abs(percentageDelta) > 8.0 && compEval.compatibility === "IDENTICAL";

    if (!compEval.isComparable) {
      synthesisClassification = "NOT_COMPARABLE";
    } else if (compEval.confounders.length > 2) {
      synthesisClassification = "CONFOUNDED";
    } else if (isContradicted) {
      synthesisClassification = "CONTRADICTED";
      candidateCauses.push("Unaccounted silicon binning or VRM thermal variance between laboratories.");
    } else if (percentageDelta < -5.0) {
      synthesisClassification = "REPEATED_REGRESSION";
      candidateCauses.push("Verified cross-laboratory performance regression.");
    } else if (percentageDelta > 5.0) {
      synthesisClassification = "REPEATED_IMPROVEMENT";
      candidateCauses.push("Verified cross-laboratory performance uplift.");
    } else if (Math.abs(percentageDelta) > 2.0) {
      synthesisClassification = "MIXED_RESULT";
    }

    const comparisonId = `clsc-${crypto
      .createHash("sha256")
      .update(`${candA.laboratoryId}:${candB.laboratoryId}:${obsA.benchmarkSuite}:${obsA.observationId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      comparisonId,
      userId,
      researchRunId,
      benchmarkSuite: obsA.benchmarkSuite,
      metricType: obsA.metricType,
      labAId: candA.laboratoryId,
      labBId: candB.laboratoryId,
      labASku: candA.sku,
      labBSku: candB.sku,
      labAScore: obsA.rawScore,
      labBScore: obsB.rawScore,
      metricUnit: obsA.metricUnit,
      absoluteDelta,
      percentageDelta,
      powerDeltaWatts,
      perfPerWattDelta,
      thermalDeltaCelsius,
      clockDeltaGhz,
      methodologyCompatibility: compEval.compatibility,
      synthesisClassification,
      confounders: compEval.confounders,
      candidateCauses,
      isCausallyEstablished: false, // Epistemic rule
      isContradicted,
      contradictionExplanation: isContradicted
        ? `Laboratories observed ${percentageDelta}% divergence on identical nominal SKU under identical test parameters.`
        : undefined,
      reproducibilityScore: Math.max(0, 100 - Math.abs(percentageDelta) * 2),
      evidenceBoundary: "EMPIRICAL_SYNTHESIS ≠ VERIFIED_RESEARCH_EVIDENCE (isCausallyEstablished: false)",
      synthesizedAt: new Date().toISOString(),
    };
  }

  public static buildMatrix(
    userId: string,
    researchRunId: string,
    comparisons: CrossLabSynthesisComparison[]
  ): CrossLabSynthesisMatrix {
    const matrixId = `clsm-${crypto
      .createHash("sha256")
      .update(`${userId}:${researchRunId}:${comparisons.length}`)
      .digest("hex")
      .slice(0, 16)}`;

    const repeatedRegressionsCount = comparisons.filter(
      (c) => c.synthesisClassification === "REPEATED_REGRESSION"
    ).length;
    const repeatedImprovementsCount = comparisons.filter(
      (c) => c.synthesisClassification === "REPEATED_IMPROVEMENT"
    ).length;
    const contradictionsCount = comparisons.filter(
      (c) => c.synthesisClassification === "CONTRADICTED" || c.isContradicted
    ).length;
    const confoundedCount = comparisons.filter(
      (c) => c.synthesisClassification === "CONFOUNDED"
    ).length;

    return {
      matrixId,
      userId,
      researchRunId,
      comparisons,
      totalComparisonsCount: comparisons.length,
      repeatedRegressionsCount,
      repeatedImprovementsCount,
      contradictionsCount,
      confoundedCount,
      evidenceBoundary: "EMPIRICAL_SYNTHESIS_MATRIX",
      generatedAt: new Date().toISOString(),
    };
  }
}
