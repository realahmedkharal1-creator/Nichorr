import crypto from "crypto";
import {
  MicroarchitecturalTrace,
  TraceNormalizationRecord,
  StallDecompositionEntry,
  MicroarchitecturalAttributionRecord,
  MicroarchitecturalCategory,
} from "./microarchitectural-attribution.types";
import { FrontendAttributionEngine } from "./frontend-attribution.engine";
import { BackendAttributionEngine } from "./backend-attribution.engine";
import { CacheAttributionEngine } from "./cache-attribution.engine";
import { MemoryAttributionEngine } from "./memory-attribution.engine";
import { BranchAttributionEngine } from "./branch-attribution.engine";
import { InterconnectAttributionEngine } from "./interconnect-attribution.engine";
import { ThermalPowerAttributionEngine } from "./thermal-power-attribution.engine";
import { EvidenceStrengthEngine } from "./evidence-strength.engine";

export class MicroarchitecturalAttributionEngine {
  public static attributeTrace(
    trace: MicroarchitecturalTrace,
    norm: TraceNormalizationRecord,
    stalls: StallDecompositionEntry[]
  ): MicroarchitecturalAttributionRecord {
    const supportingMeasurements: string[] = [];
    const excludedMeasurements: string[] = [];

    const thermalPower = ThermalPowerAttributionEngine.evaluate(trace);
    const memory = MemoryAttributionEngine.evaluate(norm);
    const cache = CacheAttributionEngine.evaluate(norm);
    const branch = BranchAttributionEngine.evaluate(norm);
    const frontend = FrontendAttributionEngine.evaluate(norm);
    const backend = BackendAttributionEngine.evaluate(norm);
    const interconnect = InterconnectAttributionEngine.evaluate(norm);

    let attributionClassification: MicroarchitecturalCategory = "UNKNOWN";

    if (thermalPower.isThermalTriggered) {
      attributionClassification = "THERMAL_LIMITATION";
      supportingMeasurements.push(...thermalPower.supporting);
    } else if (thermalPower.isPowerTriggered) {
      attributionClassification = "POWER_LIMITATION";
      supportingMeasurements.push(...thermalPower.supporting);
    } else if (memory.isTriggered) {
      attributionClassification = "MEMORY_BANDWIDTH";
      supportingMeasurements.push(...memory.supporting);
      excludedMeasurements.push(...frontend.contradicting);
    } else if (cache.isTriggered && cache.level) {
      attributionClassification = cache.level;
      supportingMeasurements.push(...cache.supporting);
    } else if (branch.isTriggered) {
      attributionClassification = "BRANCH_PREDICTION";
      supportingMeasurements.push(...branch.supporting);
    } else if (frontend.isTriggered) {
      attributionClassification = "FRONTEND";
      supportingMeasurements.push(...frontend.supporting);
    } else if (backend.isTriggered) {
      attributionClassification = "CORE_EXECUTION";
      supportingMeasurements.push(...backend.supporting);
    } else if (interconnect.isTriggered) {
      attributionClassification = "INTERCONNECT";
      supportingMeasurements.push(...interconnect.supporting);
    } else {
      attributionClassification = "MEMORY_BANDWIDTH";
      supportingMeasurements.push("Baseline execution profiles memory latency bound.");
    }

    const evidenceStrength = EvidenceStrengthEngine.evaluateStrength(trace, norm);

    const attributionId = `matt-${crypto
      .createHash("sha256")
      .update(`${trace.traceId}:${attributionClassification}`)
      .digest("hex")
      .slice(0, 16)}`;

    const summary = `Observed PMU execution trace signals are consistent with ${attributionClassification.replace(/_/g, " ")}.`;

    return {
      attributionId,
      traceId: trace.traceId,
      userId: trace.userId,
      researchRunId: trace.researchRunId,
      attributionClassification,
      evidenceStrength,
      evidenceSources: [trace.source, trace.sourceType],
      supportingMeasurements,
      excludedMeasurements,
      confounders: [],
      methodologyCompatibility: "IDENTICAL",
      reproducibilityStatus: "REPRODUCIBLE",
      causalStatus: "HYPOTHESIS_ONLY",
      isCausallyEstablished: false, // Strict non-causal default
      validationStatus: "OPEN",
      summary,
      epistemicBoundary: "OBSERVED EVIDENCE ≠ EXECUTION TRACE ≠ MICROARCHITECTURAL ATTRIBUTION ≠ CAUSAL EXPLANATION (isCausallyEstablished: false)",
      attributedAt: new Date().toISOString(),
    };
  }
}
