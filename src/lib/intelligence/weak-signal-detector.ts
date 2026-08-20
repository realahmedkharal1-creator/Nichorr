export interface WeakSignalAnalysis {
  signalTitle: string;
  sourceIndependenceScore: number;
  isWeakSignal: boolean;
  confidence: "LOW" | "MODERATE" | "HIGH";
  suggestedAction: string;
}

export class WeakSignalDetector {
  static analyzeSignal(title: string, independentSources: number): WeakSignalAnalysis {
    if (independentSources >= 3) {
      return {
        signalTitle: title,
        sourceIndependenceScore: 92.0,
        isWeakSignal: true,
        confidence: "HIGH",
        suggestedAction: "Register in Foresight Command Center and monitor velocity.",
      };
    }

    return {
      signalTitle: title,
      sourceIndependenceScore: 45.0,
      isWeakSignal: false,
      confidence: "LOW",
      suggestedAction: "Single source repetition; insufficient independent evidence.",
    };
  }
}
