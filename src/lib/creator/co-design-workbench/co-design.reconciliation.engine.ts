import crypto from "crypto";
import {
  CoDesignScenario,
  CoDesignSimulationResult,
  EmpiricalAlignmentRecord,
  CoDesignHealthReconciliationRecord,
  CoDesignHealthEffect,
} from "./co-design.types";

export class CoDesignReconciliationEngine {
  public static reconcileWithResearchHealth(
    scenario: CoDesignScenario,
    simulation: CoDesignSimulationResult,
    alignment: EmpiricalAlignmentRecord,
    targetResearchRunId: string,
    existingClaims: string[] = []
  ): CoDesignHealthReconciliationRecord {
    let newHealthEffect: CoDesignHealthEffect = "SUPPORTS_EXISTING_FINDING";
    let evidenceDeltaSummary = "Co-design simulation model aligns with empirical baseline findings.";
    let recommendedHumanAction = "Retain existing claim citations without modification.";

    if (alignment.alignmentClassification === "DIVERGENT") {
      newHealthEffect = "WEAKENS_EXISTING_FINDING";
      evidenceDeltaSummary = `Modeled microarchitectural parameter scaling diverges (${alignment.metricDifferences[0]?.deltaPercentage}% delta) from empirical baseline.`;
      recommendedHumanAction = "Human research review recommended: investigate potential unmodeled memory latency or pipeline stalls.";
    } else if (alignment.alignmentClassification === "CONFOUNDED") {
      newHealthEffect = "REQUIRES_REVIEW";
      evidenceDeltaSummary = `Co-design simulation identified ${alignment.identifiedConfounders.length} potential multi-factor confounders.`;
      recommendedHumanAction = "Isolate individual parameter sweeps in secondary physical testbench runs.";
    }

    const reconciliationId = `cdhr-${crypto
      .createHash("sha256")
      .update(`${scenario.scenarioId}:${simulation.simulationId}:${targetResearchRunId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      reconciliationId,
      scenarioId: scenario.scenarioId,
      simulationId: simulation.simulationId,
      baselineId: scenario.baselineId,
      targetResearchRunId,
      newHealthEffect,
      evidenceDeltaSummary,
      affectedClaimsCount: existingClaims.length,
      affectedClaims: existingClaims,
      recommendedHumanAction,
      reconciledAt: new Date().toISOString(),
    };
  }
}
