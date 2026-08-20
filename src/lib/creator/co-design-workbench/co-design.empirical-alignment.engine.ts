import crypto from "crypto";
import {
  CoDesignScenario,
  EmpiricalBaseline,
  CoDesignSimulationResult,
  EmpiricalAlignmentRecord,
  AlignmentClassification,
} from "./co-design.types";
import { CoDesignConfounderEngine } from "./co-design.confounder.engine";

export class CoDesignEmpiricalAlignmentEngine {
  public static evaluateAlignment(
    scenario: CoDesignScenario,
    baseline: EmpiricalBaseline,
    simulation: CoDesignSimulationResult
  ): EmpiricalAlignmentRecord {
    const confounders = CoDesignConfounderEngine.detectConfounders(scenario, baseline);

    const perfDelta = Number((simulation.simulatedScoreFPS - baseline.measuredScoreFPS).toFixed(1));
    const perfDeltaPct = Number((((simulation.simulatedScoreFPS - baseline.measuredScoreFPS) / (baseline.measuredScoreFPS || 1)) * 100).toFixed(2));

    const powerDelta = Number((simulation.simulatedPowerWatts - (baseline.measuredPowerWatts || 440)).toFixed(1));
    const powerDeltaPct = Number((((simulation.simulatedPowerWatts - (baseline.measuredPowerWatts || 440)) / (baseline.measuredPowerWatts || 440)) * 100).toFixed(2));

    const metricDifferences = [
      {
        metric: "Performance FPS",
        physicalValue: baseline.measuredScoreFPS,
        simulatedValue: simulation.simulatedScoreFPS,
        delta: perfDelta,
        deltaPercentage: perfDeltaPct,
        unit: "FPS",
      },
      {
        metric: "Power Draw",
        physicalValue: baseline.measuredPowerWatts || 440,
        simulatedValue: simulation.simulatedPowerWatts,
        delta: powerDelta,
        deltaPercentage: powerDeltaPct,
        unit: "Watts",
      },
      {
        metric: "Performance / Watt",
        physicalValue: baseline.measuredPerfPerWatt || 0.256,
        simulatedValue: simulation.simulatedPerfPerWatt,
        delta: Number((simulation.simulatedPerfPerWatt - (baseline.measuredPerfPerWatt || 0.256)).toFixed(3)),
        deltaPercentage: Number((((simulation.simulatedPerfPerWatt - (baseline.measuredPerfPerWatt || 0.256)) / (baseline.measuredPerfPerWatt || 0.256)) * 100).toFixed(2)),
        unit: "FPS/W",
      },
    ];

    const bottleneckDivergence = Object.entries(simulation.bottleneckDistribution).map(([cat, simShare]) => {
      const physShare = cat === baseline.primaryBottleneckAttribution ? 32.0 : 17.0;
      return {
        category: cat,
        physicalSharePct: physShare,
        simulatedSharePct: simShare,
        divergencePct: Number((simShare - physShare).toFixed(1)),
      };
    });

    let alignmentClassification: AlignmentClassification = "ALIGNED";
    if (confounders.length > 2) {
      alignmentClassification = "CONFOUNDED";
    } else if (Math.abs(perfDeltaPct) > 25.0) {
      alignmentClassification = "DIVERGENT";
    } else if (Math.abs(perfDeltaPct) > 10.0) {
      alignmentClassification = "PARTIALLY_ALIGNED";
    }

    const alignmentId = `cdal-${crypto
      .createHash("sha256")
      .update(`${simulation.simulationId}:${baseline.baselineId}`)
      .digest("hex")
      .slice(0, 16)}`;

    const divergenceSummary =
      alignmentClassification === "ALIGNED"
        ? "Simulated performance is closely consistent with empirical physical benchmark."
        : alignmentClassification === "PARTIALLY_ALIGNED"
        ? `Moderate divergence (${perfDeltaPct > 0 ? "+" : ""}${perfDeltaPct}%) observed between simulated scenario and physical baseline.`
        : `Significant divergence (${perfDeltaPct > 0 ? "+" : ""}${perfDeltaPct}%) detected between model output and physical measurement.`;

    return {
      alignmentId,
      scenarioId: scenario.scenarioId,
      simulationId: simulation.simulationId,
      baselineId: baseline.baselineId,
      userId: scenario.userId,
      researchRunId: scenario.researchRunId,
      metricDifferences,
      bottleneckDivergence,
      alignmentClassification,
      identifiedConfounders: confounders,
      divergenceSummary,
      isCausallyEstablished: false, // Strict non-causal default
      alignedAt: new Date().toISOString(),
    };
  }
}
