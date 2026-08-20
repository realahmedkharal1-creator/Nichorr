import { BenchmarkExecutionPlan, TestbenchDefinition } from "./testbench.types";

export class SafetyInterlockEngine {
  /**
   * Evaluates all physical safety constraints and epistemic blockers before execution.
   */
  static evaluateSafety(
    testbench: TestbenchDefinition,
    plan: BenchmarkExecutionPlan,
    options: {
      isCertificationValid?: boolean;
      isReleaseLockValid?: boolean;
      isProjectSnapshotValid?: boolean;
      activeBlockers?: string[];
    } = {}
  ): {
    isSafe: boolean;
    blockers: string[];
    warnings: string[];
  } {
    const blockers: string[] = [];
    const warnings: string[] = [];

    // Hardware Safety Limits
    if (plan.powerLimitWatts > testbench.safetyConstraints.maxPowerLimitWatts) {
      blockers.push(
        `UNSAFE_POWER_CONFIGURATION: Plan power limit (${plan.powerLimitWatts}W) exceeds testbench safety threshold (${testbench.safetyConstraints.maxPowerLimitWatts}W).`
      );
    }

    if (testbench.safetyConstraints.maxThermalLimitCelsius > 95) {
      warnings.push(
        `HIGH_THERMAL_THRESHOLD: Maximum thermal limit is configured at ${testbench.safetyConstraints.maxThermalLimitCelsius}°C. Throttling risk elevated.`
      );
    }

    // Epistemic and Governance Hard Blockers
    if (options.isCertificationValid === false) {
      blockers.push("INVALID_CERTIFICATION: Project certification is invalid or revoked.");
    }

    if (options.isReleaseLockValid === false) {
      blockers.push("RELEASE_LOCK_INVALID: Release lock integrity check failed.");
    }

    if (options.isProjectSnapshotValid === false) {
      blockers.push("SNAPSHOT_MISMATCH: Upstream research evidence snapshot mismatch detected.");
    }

    if (options.activeBlockers) {
      for (const b of options.activeBlockers) {
        if (b.includes("DO_NOT_SAY")) blockers.push("DO_NOT_SAY: Blocked by active research safety rule.");
        if (b.includes("UNBACKED")) blockers.push("UNBACKED: Blocked by unbacked claim safety barrier.");
        if (b.includes("CONFLICTED")) blockers.push("CONFLICTED: Blocked by conflicted research evidence.");
      }
    }

    return {
      isSafe: blockers.length === 0,
      blockers,
      warnings,
    };
  }
}
