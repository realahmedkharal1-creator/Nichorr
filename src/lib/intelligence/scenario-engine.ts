export interface ScenarioComparison {
  baselineProbability: number;
  downsideProbability: number;
  upsideProbability: number;
  divergenceScore: number;
  recommendedContingency: string;
}

export class ForesightScenarioEngine {
  static compareScenarios(baselineProb: number, downsideProb: number, upsideProb: number): ScenarioComparison {
    const divergenceScore = Math.abs(baselineProb - downsideProb);

    return {
      baselineProbability: baselineProb,
      downsideProbability: downsideProb,
      upsideProbability: upsideProb,
      divergenceScore,
      recommendedContingency: divergenceScore > 40 ? "Prepare high-impact contingency plan" : "Standard monitoring",
    };
  }
}
