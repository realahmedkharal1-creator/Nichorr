import {
  CoDesignScenario,
  EmpiricalBaseline,
} from "./co-design.types";

export class CoDesignConfounderEngine {
  public static detectConfounders(
    scenario: CoDesignScenario,
    baseline: EmpiricalBaseline
  ): string[] {
    const confounders: string[] = [];

    const hypotheticalParams = Object.values(scenario.parameters).filter(
      (p) => p.sourceType === "HYPOTHETICAL_INTERVENTION"
    );

    if (hypotheticalParams.length > 3) {
      confounders.push(`Multi-parameter hypothetical intervention (${hypotheticalParams.length} parameters altered simultaneously).`);
    }

    if (
      scenario.parameters.powerLimitWatts &&
      baseline.measuredPowerWatts &&
      scenario.parameters.powerLimitWatts.currentValue < baseline.measuredPowerWatts * 0.9
    ) {
      confounders.push("Modeled power budget is lower than physical baseline power draw, potentially inducing unmodeled throttling.");
    }

    if (
      scenario.parameters.thermalCeilingCelsius &&
      baseline.measuredTemperatureCelsius &&
      scenario.parameters.thermalCeilingCelsius.currentValue < baseline.measuredTemperatureCelsius
    ) {
      confounders.push("Modeled thermal ceiling is below observed physical operating temperature.");
    }

    return confounders;
  }
}
