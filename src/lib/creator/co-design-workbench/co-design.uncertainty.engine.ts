import { SimulationUncertaintyProfile, CoDesignParameter } from "./co-design.types";

export class CoDesignUncertaintyEngine {
  public static calculateUncertainty(
    parameters: Record<string, CoDesignParameter>,
    simulatedScoreFPS: number
  ): SimulationUncertaintyProfile {
    const paramValues = Object.values(parameters);
    const hypotheticalCount = paramValues.filter((p) => p.sourceType === "HYPOTHETICAL_INTERVENTION").length;

    const inputUncertaintyPct = 1.5 + hypotheticalCount * 0.8;
    const modelUncertaintyPct = 2.5;
    const measurementUncertaintyPct = 1.8;
    const methodologyUncertaintyPct = 1.2;

    const compositeUncertaintyPct = Number(
      Math.sqrt(
        Math.pow(inputUncertaintyPct, 2) +
        Math.pow(modelUncertaintyPct, 2) +
        Math.pow(measurementUncertaintyPct, 2) +
        Math.pow(methodologyUncertaintyPct, 2)
      ).toFixed(2)
    );

    const marginFPS = Number(((simulatedScoreFPS * compositeUncertaintyPct) / 100).toFixed(1));
    const minScore = Number((simulatedScoreFPS - marginFPS).toFixed(1));
    const maxScore = Number((simulatedScoreFPS + marginFPS).toFixed(1));

    const confidenceClassification: SimulationUncertaintyProfile["confidenceClassification"] =
      compositeUncertaintyPct < 4.0 ? "HIGH" : compositeUncertaintyPct < 7.0 ? "MODERATE" : "LOW";

    return {
      inputUncertaintyPct,
      modelUncertaintyPct,
      measurementUncertaintyPct,
      methodologyUncertaintyPct,
      compositeUncertaintyPct,
      confidenceInterval95: [minScore, maxScore],
      confidenceClassification,
    };
  }
}
