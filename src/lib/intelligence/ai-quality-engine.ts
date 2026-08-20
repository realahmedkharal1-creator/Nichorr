export type AIValidationStatus = "GENERATED" | "VALIDATING" | "VALIDATED" | "REQUIRES_REVIEW" | "REJECTED" | "SUPERSEDED";

export interface AIQualityRecord {
  id: string;
  runId: string;
  modelName: string;
  provider: string;
  promptVersion: string;
  validationStatus: AIValidationStatus;
  confidenceScore: number;
  evidenceGroundedRatio: number;
}

export class AIQualityEngine {
  validateOutput(params: {
    runId: string;
    modelName?: string;
    provider?: string;
    supportedClaimsCount: number;
    unsupportedClaimsCount: number;
  }): AIQualityRecord {
    const total = params.supportedClaimsCount + params.unsupportedClaimsCount;
    const ratio = total > 0 ? params.supportedClaimsCount / total : 1.0;
    const score = Math.floor(ratio * 100);

    let status: AIValidationStatus = "VALIDATED";
    if (params.unsupportedClaimsCount > 0) status = "REQUIRES_REVIEW";
    if (ratio < 0.5) status = "REJECTED";

    return {
      id: `aiq-${Date.now()}`,
      runId: params.runId,
      modelName: params.modelName || "gemini-1.5-pro",
      provider: params.provider || "GEMINI",
      promptVersion: "v2.0-grounded",
      validationStatus: status,
      confidenceScore: score,
      evidenceGroundedRatio: Number(ratio.toFixed(2)),
    };
  }
}
