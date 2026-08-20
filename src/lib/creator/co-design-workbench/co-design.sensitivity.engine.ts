import {
  CoDesignScenario,
  EmpiricalBaseline,
  ParameterSensitivityEntry,
} from "./co-design.types";
import { CoDesignSimulationEngine } from "./co-design.simulation.engine";
import { CoDesignParameterEngine } from "./co-design.parameter.engine";

export class CoDesignSensitivityEngine {
  public static computeSensitivity(
    scenario: CoDesignScenario,
    baseline: EmpiricalBaseline
  ): ParameterSensitivityEntry[] {
    const baseSimulation = CoDesignSimulationEngine.simulateScenario(scenario, baseline);
    const baseScore = baseSimulation.simulatedScoreFPS;

    const entries: ParameterSensitivityEntry[] = [];

    for (const [paramKey, param] of Object.entries(scenario.parameters)) {
      if (param.minValue === param.maxValue) continue;

      const perturbationDelta = param.step * 2 || (param.currentValue * 0.1);
      const perturbedValue = Math.min(param.maxValue, param.currentValue + perturbationDelta);

      if (perturbedValue === param.currentValue) continue;

      const perturbedParams = CoDesignParameterEngine.updateParameterValue(
        scenario.parameters,
        paramKey,
        perturbedValue
      );

      const perturbedScenario = { ...scenario, parameters: perturbedParams };
      const perturbedSim = CoDesignSimulationEngine.simulateScenario(perturbedScenario, baseline);

      const outputDeltaFPS = Number((perturbedSim.simulatedScoreFPS - baseScore).toFixed(2));
      const outputDeltaPct = Number((((perturbedSim.simulatedScoreFPS - baseScore) / (baseScore || 1)) * 100).toFixed(2));

      const paramChangePct = ((perturbedValue - param.currentValue) / (param.currentValue || 1)) * 100;
      const elasticityCoefficient = Number((outputDeltaPct / (paramChangePct || 1)).toFixed(3));

      const direction =
        outputDeltaFPS > 0.05 ? "POSITIVE" : outputDeltaFPS < -0.05 ? "NEGATIVE" : "NEUTRAL";

      entries.push({
        parameterId: param.parameterId,
        parameterName: param.name,
        domain: param.domain,
        baseValue: param.currentValue,
        perturbedValue,
        outputDeltaFPS,
        outputDeltaPct,
        direction,
        elasticityCoefficient,
        sensitivityRank: 0, // Assigned after sort
        uncertaintyPct: 2.5,
      });
    }

    // Sort by absolute elasticity descending
    entries.sort((a, b) => Math.abs(b.elasticityCoefficient) - Math.abs(a.elasticityCoefficient));

    entries.forEach((entry, idx) => {
      entry.sensitivityRank = idx + 1;
    });

    return entries;
  }
}
