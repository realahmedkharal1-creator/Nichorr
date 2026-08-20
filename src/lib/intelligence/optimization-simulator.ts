export interface SimulationRequest {
  recommendationId: string;
  proposedChange: "ROUTE_TO_FLASH" | "INCREASE_CACHE_TTL" | "LOWER_RETRY_COUNT";
}

export interface SimulationResult {
  simulatedQualityImpact: number;
  simulatedCostImpact: number;
  simulatedLatencyImpact: number;
  assumptions: string[];
}

export class OptimizationSimulatorEngine {
  static simulateChange(req: SimulationRequest): SimulationResult {
    if (req.proposedChange === "ROUTE_TO_FLASH") {
      return {
        simulatedQualityImpact: 0.0,
        simulatedCostImpact: -0.05,
        simulatedLatencyImpact: -250,
        assumptions: [
          "Extraction tasks do not require deep reasoning.",
          "Flash grounding score meets 98% threshold.",
        ],
      };
    }

    return {
      simulatedQualityImpact: 0.0,
      simulatedCostImpact: -0.02,
      simulatedLatencyImpact: -50,
      assumptions: ["Cache hits increase by 15%."],
    };
  }
}
