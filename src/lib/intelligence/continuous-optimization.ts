export interface PlatformSignal {
  id: string;
  category: "QUALITY" | "RELIABILITY" | "PERFORMANCE" | "COST" | "KNOWLEDGE";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceSubsystem: string;
  summary: string;
}

export class ContinuousOptimizationEngine {
  static harvestSignals(workspaceId: string): PlatformSignal[] {
    return [
      {
        id: "sig-1",
        category: "COST",
        severity: "MEDIUM",
        sourceSubsystem: "AI Task Router",
        summary: "Fact-checking extraction jobs consumed 450k tokens using gemini-1.5-pro.",
      },
      {
        id: "sig-2",
        category: "KNOWLEDGE",
        severity: "LOW",
        sourceSubsystem: "Knowledge Graph",
        summary: "2 unlinked claims detected in Snapdragon X Elite research project.",
      },
    ];
  }
}
