import crypto from "crypto";
import {
  ExperimentComparison,
  PhysicalExperiment,
  MicroarchitectureSimulation,
  ExperimentAlignmentState,
} from "./testbench.types";

export class ExperimentComparisonEngine {
  /**
   * Compares physical measurement against sandbox simulation result.
   */
  static compare(
    physical: PhysicalExperiment,
    simulation: MicroarchitectureSimulation,
    confounders: string[] = []
  ): ExperimentComparison {
    const comparisonId = `cmp-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const physScore = physical.consolidatedScore || 0;
    const simScore = simulation.simulatedScore;

    if (physScore <= 0) {
      return {
        comparisonId,
        userId: physical.userId,
        researchRunId: physical.researchRunId,
        physicalExperimentId: physical.experimentId,
        simulationId: simulation.simulationId,
        sku: simulation.sku,
        benchmarkSuite: simulation.benchmarkSuite,
        metricUnit: physical.metricUnit || simulation.metricUnit,
        physicalScore: physScore,
        simulatedScore: simScore,
        deltaPercentage: 0,
        absoluteError: 0,
        alignmentState: "INSUFFICIENT_DATA",
        directionAgreement: false,
        modelErrorAnalysis: "Insufficient physical benchmark runs to establish empirical ground truth.",
        knownConfounders: confounders,
        evidenceBoundary: "SIMULATION_RESULT ≠ PHYSICAL_MEASUREMENT: Empirical data insufficient.",
        comparedAt: now,
      };
    }

    const deltaPct = Number((((physScore - simScore) / simScore) * 100).toFixed(2));
    const absError = Number(Math.abs(physScore - simScore).toFixed(2));
    const absErrorPct = Math.abs(deltaPct);

    let alignmentState: ExperimentAlignmentState = "ALIGNED";
    if (confounders.length >= 2) {
      alignmentState = "CONFOUNDED";
    } else if (absErrorPct <= 3.0) {
      alignmentState = "ALIGNED";
    } else if (absErrorPct <= 8.0) {
      alignmentState = "PARTIALLY_ALIGNED";
    } else {
      alignmentState = "DIVERGENT";
    }

    const directionAgreement = (physScore >= simScore && simScore >= 100) || (physScore < simScore && simScore < 100);

    const modelErrorAnalysis =
      alignmentState === "ALIGNED"
        ? "Simulation closely aligns with physical empirical measurement (error ≤ 3%)."
        : alignmentState === "PARTIALLY_ALIGNED"
        ? `Simulation exhibits moderate model divergence (${absErrorPct}% delta). Check memory latency parameters.`
        : alignmentState === "CONFOUNDED"
        ? `Comparison confounded by external factors: ${confounders.join(", ")}.`
        : `Significant divergence (${absErrorPct}% delta) between modeled sandbox and physical hardware measurement.`;

    return {
      comparisonId,
      userId: physical.userId,
      researchRunId: physical.researchRunId,
      physicalExperimentId: physical.experimentId,
      simulationId: simulation.simulationId,
      sku: simulation.sku,
      benchmarkSuite: simulation.benchmarkSuite,
      metricUnit: physical.metricUnit || simulation.metricUnit,
      physicalScore: physScore,
      simulatedScore: simScore,
      deltaPercentage: deltaPct,
      absoluteError: absError,
      alignmentState,
      directionAgreement,
      modelErrorAnalysis,
      knownConfounders: confounders,
      evidenceBoundary:
        "SIMULATION_RESULT ≠ PHYSICAL_MEASUREMENT: Model comparison preserved with full error tracking.",
      comparedAt: now,
    };
  }
}
