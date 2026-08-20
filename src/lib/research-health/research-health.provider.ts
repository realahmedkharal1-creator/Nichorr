export * from "./research-health.types";
export * from "./evidence-freshness.engine";
export * from "./claim-health.engine";
export * from "./revalidation.engine";
export * from "./research-health.engine";
export * from "./decision/research-health-decision.provider";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import { ResearchHealthEngine } from "./research-health.engine";
import { RevalidationEngine, RevalidationExecutionResult } from "./revalidation.engine";
import {
  ResearchHealthReport,
  RevalidationOptions,
  RevalidationPlan,
  ClaimHealthRecord,
} from "./research-health.types";

export class ResearchHealthProvider {
  /**
   * Evaluates evidence freshness, validity, authority, and claim health for a research session.
   */
  static evaluateHealth(
    session: ResearchRunSession,
    report?: CreatorStudioReport,
    options?: RevalidationOptions
  ): ResearchHealthReport {
    return ResearchHealthEngine.evaluateHealth(session, report, options);
  }

  /**
   * Executes a targeted or full revalidation plan against the session.
   */
  static executeRevalidation(
    session: ResearchRunSession,
    plan: RevalidationPlan
  ): RevalidationExecutionResult {
    return RevalidationEngine.executeRevalidation(session, plan);
  }

  /**
   * Executes targeted revalidation for a single claim ID.
   */
  static revalidateSingleClaim(
    session: ResearchRunSession,
    claimId: string,
    report?: CreatorStudioReport
  ): RevalidationExecutionResult {
    const health = ResearchHealthEngine.evaluateHealth(session, report);
    const targetClaim = health.claimsHealth.find((c) => c.claimId === claimId);
    
    const claimRecords: ClaimHealthRecord[] = targetClaim
      ? [targetClaim]
      : [{
          claimId,
          claimText: "Target Claim",
          claimType: "FACTUAL",
          healthStatus: "NEEDS_REVALIDATION",
          freshnessStatus: "AGING",
          validityStatus: "REVALIDATION_REQUIRED",
          authorityStatus: "TIER_1_PRIMARY",
          independenceStatus: "INDEPENDENT",
          methodologyStatus: "METHODOLOGY_VERIFIED",
          supportingEvidenceCount: 1,
          primaryEvidenceCount: 1,
          conflictingEvidenceCount: 0,
          lastVerifiedAt: new Date().toISOString(),
          revalidationRequired: true,
          revalidationAction: "RECHECK_PRIMARY_SOURCE",
          reason: "Single claim targeted revalidation requested.",
          upstreamEvidenceIds: [],
          affectedCreatorAssets: [],
        }];

    const plan = RevalidationEngine.generateRevalidationPlan(session, claimRecords, {
      mode: 'AFFECTED_CLAIMS_ONLY',
      claimIds: [claimId],
    });

    return RevalidationEngine.executeRevalidation(session, plan);
  }
}
