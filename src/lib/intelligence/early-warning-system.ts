export interface EarlyWarningAlert {
  indicatorName: string;
  threshold: number;
  currentValue: number;
  status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL";
  requiresHumanAction: boolean;
}

export class EarlyWarningSystem {
  static evaluateIndicator(name: string, threshold: number, currentValue: number): EarlyWarningAlert {
    let status: "NORMAL" | "WATCH" | "WARNING" | "CRITICAL" = "NORMAL";
    let requiresHumanAction = false;

    if (currentValue < threshold * 0.8) {
      status = "CRITICAL";
      requiresHumanAction = true;
    } else if (currentValue < threshold) {
      status = "WARNING";
      requiresHumanAction = true;
    } else if (currentValue < threshold * 1.1) {
      status = "WATCH";
    }

    return {
      indicatorName: name,
      threshold,
      currentValue,
      status,
      requiresHumanAction,
    };
  }
}
