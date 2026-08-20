import { CoDesignParameter, CoDesignConstraint } from "./co-design.types";

export class CoDesignConstraintEngine {
  public static createDefaultConstraints(): CoDesignConstraint[] {
    return [
      {
        constraintId: "cst-clock-power",
        name: "Frequency vs Power Budget Ceiling",
        parameterA: "clockFrequencyGhz",
        parameterB: "powerLimitWatts",
        operator: "POWER_BUDGET",
        limitValue: 4.2, // Clocks > 4.2 GHz require > 600W
        severity: "ADVISORY_WARNING",
        description: "Core clock scaling beyond 4.2 GHz exceeds standard cooling & power delivery envelope.",
      },
      {
        constraintId: "cst-l1-latency",
        name: "L1 Latency Physical Floor",
        parameterA: "l1CacheLatencyCycles",
        operator: ">=",
        limitValue: 2,
        severity: "HARD_BLOCK",
        description: "L1 Cache latency cannot be lower than 2 cycles due to speed-of-light / pipeline stage limits.",
      },
      {
        constraintId: "cst-thermal-safety",
        name: "Thermal Ceiling Safety Limit",
        parameterA: "thermalCeilingCelsius",
        operator: "<=",
        limitValue: 100,
        severity: "HARD_BLOCK",
        description: "Thermal ceiling cannot exceed 100°C to prevent silicon degradation.",
      },
    ];
  }

  public static validateConstraints(
    parameters: Record<string, CoDesignParameter>,
    constraints: CoDesignConstraint[]
  ): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];

    for (const cst of constraints) {
      const paramA = parameters[cst.parameterA];
      if (!paramA) continue;

      if (cst.operator === ">=" && paramA.currentValue < cst.limitValue) {
        violations.push(`Violation [${cst.name}]: ${paramA.name} (${paramA.currentValue} ${paramA.unit}) must be >= ${cst.limitValue}`);
      } else if (cst.operator === "<=" && paramA.currentValue > cst.limitValue) {
        violations.push(`Violation [${cst.name}]: ${paramA.name} (${paramA.currentValue} ${paramA.unit}) must be <= ${cst.limitValue}`);
      } else if (cst.operator === "POWER_BUDGET" && cst.parameterB) {
        const paramB = parameters[cst.parameterB];
        if (paramB && paramA.currentValue > cst.limitValue && paramB.currentValue < 600) {
          violations.push(`Advisory [${cst.name}]: Sustained clock ${paramA.currentValue} GHz with power limit ${paramB.currentValue}W may throttle.`);
        }
      }
    }

    const hasHardBlock = violations.some((v) => v.startsWith("Violation"));
    return { isValid: !hasHardBlock, violations };
  }
}
