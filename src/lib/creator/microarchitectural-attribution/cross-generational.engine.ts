import crypto from "crypto";
import {
  MicroarchitecturalTrace,
  MicroarchitecturalAttributionRecord,
  CrossGenerationalAttributionMatrix,
  CrossGenerationalClassification,
} from "./microarchitectural-attribution.types";
import { ConfounderEngine } from "./confounder.engine";

export class CrossGenerationalEngine {
  public static compareGenerations(
    traceA: MicroarchitecturalTrace,
    attribA: MicroarchitecturalAttributionRecord,
    traceB: MicroarchitecturalTrace,
    attribB: MicroarchitecturalAttributionRecord
  ): CrossGenerationalAttributionMatrix {
    const confounderAssessment = ConfounderEngine.assessConfounders(traceA, traceB);

    const instA = traceA.counters.instructions || 1;
    const instB = traceB.counters.instructions || 1;
    const performanceDeltaPercentage = Number((((instB - instA) / (instA || 1)) * 100).toFixed(2));

    const powerDeltaWatts =
      traceA.observedPowerWatts && traceB.observedPowerWatts
        ? Number((traceB.observedPowerWatts - traceA.observedPowerWatts).toFixed(1))
        : undefined;

    let classification: CrossGenerationalClassification = "ARCHITECTURAL_DIFFERENCE";

    if (confounderAssessment.confounderLevel === "CONFOUNDED") {
      classification = "NOT_COMPARABLE";
    } else if (confounderAssessment.identifiedConfounders.length > 2) {
      classification = "MULTI_FACTOR_DIFFERENCE";
    } else if (traceA.cpuStepping !== traceB.cpuStepping && traceA.gpuModel === traceB.gpuModel) {
      classification = "STEPPING_DIFFERENCE";
    } else if (traceA.gpuArchitecture !== traceB.gpuArchitecture) {
      classification = "ARCHITECTURAL_DIFFERENCE";
    } else if (traceA.gpuModel !== traceB.gpuModel) {
      classification = "SILICON_DIFFERENCE";
    } else if (attribA.attributionClassification !== attribB.attributionClassification) {
      classification = "MEMORY_SUBSYSTEM_DIFFERENCE";
    }

    const comparisonId = `cgmat-${crypto
      .createHash("sha256")
      .update(`${traceA.traceId}:${traceB.traceId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      comparisonId,
      userId: traceA.userId,
      researchRunId: traceA.researchRunId,
      baselineGeneration: traceA.gpuArchitecture,
      candidateGeneration: traceB.gpuArchitecture,
      baselineSku: traceA.gpuModel,
      candidateSku: traceB.gpuModel,
      baselineStepping: traceA.cpuStepping,
      candidateStepping: traceB.cpuStepping,
      baselineAttribution: attribA.attributionClassification,
      candidateAttribution: attribB.attributionClassification,
      performanceDeltaPercentage,
      powerDeltaWatts,
      classification,
      confounderAssessment,
      methodologyCompatibility: confounderAssessment.methodologyVariance ? "NOT_COMPARABLE" : "IDENTICAL",
      isCausallyEstablished: false, // Strict non-causal guard
      notes: `Observed cross-generation bottleneck transition from ${attribA.attributionClassification} to ${attribB.attributionClassification}.`,
      comparedAt: new Date().toISOString(),
    };
  }
}
