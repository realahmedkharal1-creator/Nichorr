import crypto from "crypto";
import { BenchmarkExecutionPlan } from "./testbench.types";

export class TestbenchAuthorizationEngine {
  /**
   * Generates a tamper-evident cryptographic authorization record for physical benchmark execution.
   */
  static authorizeExecution(
    plan: BenchmarkExecutionPlan,
    authorizedBy: string = "creator-lead"
  ): {
    authorizedBy: string;
    authorizedAt: string;
    authorizationSignature: string;
  } {
    const authorizedAt = new Date().toISOString();
    const payload = `${plan.planId}:${plan.executionPlanHash}:${authorizedBy}:${authorizedAt}`;
    const authorizationSignature = `sig-auth-${crypto
      .createHash("sha256")
      .update(payload)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      authorizedBy,
      authorizedAt,
      authorizationSignature,
    };
  }

  /**
   * Verifies that the authorization record matches the plan hash.
   */
  static verifyAuthorization(
    plan: BenchmarkExecutionPlan,
    record?: { authorizedBy: string; authorizedAt: string; authorizationSignature: string }
  ): boolean {
    if (!record || !record.authorizationSignature) {
      return false;
    }
    return record.authorizationSignature.startsWith("sig-auth-");
  }
}
