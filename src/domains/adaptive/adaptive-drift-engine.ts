export interface DetectedSystemDrift {
  driftType: "MODEL_DRIFT" | "RETRIEVAL_DRIFT" | "AGENT_DRIFT" | "SOURCE_DRIFT" | "EXECUTION_DRIFT";
  component: string;
  driftScore: number;
  isDriftDetected: boolean;
}

export class AdaptiveDriftEngine {
  static evaluateDrift(
    driftType: "MODEL_DRIFT" | "RETRIEVAL_DRIFT" | "AGENT_DRIFT" | "SOURCE_DRIFT" | "EXECUTION_DRIFT",
    component: string,
    currentDistribution: number[],
    baselineDistribution: number[]
  ): DetectedSystemDrift {
    const diff = currentDistribution.reduce((acc, val, idx) => acc + Math.abs(val - (baselineDistribution[idx] || 0)), 0);
    const driftScore = parseFloat((diff * 10).toFixed(2));

    return {
      driftType,
      component,
      driftScore,
      isDriftDetected: driftScore > 1.5,
    };
  }
}
