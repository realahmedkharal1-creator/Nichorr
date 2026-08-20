export interface EvidenceGapAnalysis {
  entityName: string;
  hasGap: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  gapDescription: string;
  recommendedRemediation: string;
}

export class EvidenceGapEngine {
  static analyzeGap(entityName: string, evidenceCount: number): EvidenceGapAnalysis {
    if (evidenceCount < 2) {
      return {
        entityName,
        hasGap: true,
        severity: "HIGH",
        gapDescription: `Entity '${entityName}' has fewer than 2 independent primary evidence citations.`,
        recommendedRemediation: "Trigger targeted research run to verify canonical claims.",
      };
    }

    return {
      entityName,
      hasGap: false,
      severity: "LOW",
      gapDescription: `Entity '${entityName}' has strong evidence coverage (${evidenceCount} citations).`,
      recommendedRemediation: "Maintain standard monitoring.",
    };
  }
}
