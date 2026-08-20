export interface StrategicDriftAlert {
  id: string;
  objectiveId: string;
  metricName: string;
  expectedValue: number;
  currentValue: number;
  status: "NORMAL" | "WATCH" | "AT_RISK" | "CRITICAL";
  recommendation: string;
}

export class StrategyEngine {
  static evaluateDrift(workspaceId: string): StrategicDriftAlert[] {
    return [
      {
        id: "drift-1",
        objectiveId: "obj-1",
        metricName: "Publish Readiness Score",
        expectedValue: 98.0,
        currentValue: 96.8,
        status: "WATCH",
        recommendation: "Run automated fact-checking pass on 2 pending video scripts.",
      },
    ];
  }
}
