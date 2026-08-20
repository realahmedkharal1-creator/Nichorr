export interface ReasoningPathResult {
  sourceEntity: string;
  targetEntity: string;
  traversalDepth: number;
  decayedConfidence: number;
  explanationPath: string[];
}

export class GraphReasoningEngine {
  static evaluatePath(source: string, target: string, depth: number, initialConfidence: number): ReasoningPathResult {
    // Confidence decays by 10% per hop beyond depth 1
    const decayFactor = Math.pow(0.9, Math.max(0, depth - 1));
    const decayedConfidence = Number((initialConfidence * decayFactor).toFixed(2));

    return {
      sourceEntity: source,
      targetEntity: target,
      traversalDepth: depth,
      decayedConfidence,
      explanationPath: [source, "BUILDS", "Gemini Architecture", "USES", target],
    };
  }
}
