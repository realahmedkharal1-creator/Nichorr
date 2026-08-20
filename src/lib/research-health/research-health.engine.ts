import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "@/lib/creator/creator-studio.types";
import { CreatorWorkflowDependencies } from "@/lib/creator/workflow/creator-workflow.dependencies";
import { EvidenceFreshnessEngine } from "./evidence-freshness.engine";
import { ClaimHealthEngine } from "./claim-health.engine";
import { RevalidationEngine } from "./revalidation.engine";
import {
  ResearchHealthReport,
  ResearchHealthDimensions,
  HealthMonitoringMode,
  RevalidationOptions,
} from "./research-health.types";

export class ResearchHealthEngine {
  /**
   * Generates a comprehensive, transparent research health report for an existing research run.
   * Separates Freshness, Authority, Independence, Validity, and Methodology.
   * Enforces non-bypassable hard safety blockers.
   */
  static evaluateHealth(
    session: ResearchRunSession,
    report?: CreatorStudioReport,
    options?: RevalidationOptions
  ): ResearchHealthReport {
    const evidenceHealth = EvidenceFreshnessEngine.evaluateEvidenceFreshness(session);
    const claimsHealth = ClaimHealthEngine.evaluateClaimHealth(session, evidenceHealth, report);
    const evidenceSnapshotHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const nowStr = new Date().toISOString();

    // 1. Compute Claims Summary
    const claimsSummary = {
      total: claimsHealth.length,
      healthy: claimsHealth.filter((c) => c.healthStatus === 'HEALTHY').length,
      aging: claimsHealth.filter((c) => c.healthStatus === 'AGING').length,
      needsRevalidation: claimsHealth.filter((c) => c.healthStatus === 'NEEDS_REVALIDATION').length,
      conflicted: claimsHealth.filter((c) => c.healthStatus === 'CONFLICTED').length,
      unbacked: claimsHealth.filter((c) => c.healthStatus === 'UNBACKED').length,
      blocked: claimsHealth.filter((c) => c.healthStatus === 'BLOCKED').length,
    };

    // 2. Compute Evidence Summary
    const evidenceSummary = {
      total: evidenceHealth.length,
      fresh: evidenceHealth.filter((e) => e.freshnessStatus === 'FRESH').length,
      aging: evidenceHealth.filter((e) => e.freshnessStatus === 'AGING').length,
      stale: evidenceHealth.filter((e) => e.freshnessStatus === 'STALE').length,
      expired: evidenceHealth.filter((e) => e.freshnessStatus === 'EXPIRED').length,
      unknown: evidenceHealth.filter((e) => e.freshnessStatus === 'UNKNOWN').length,
      unavailable: evidenceHealth.filter((e) => e.freshnessStatus === 'UNAVAILABLE').length,
    };

    // 3. Compute 7 Distinct Health Dimensions
    const totalEvi = Math.max(1, evidenceHealth.length);
    const totalClm = Math.max(1, claimsHealth.length);

    // Dimension 1: Evidence Freshness
    const freshRatio = (evidenceSummary.fresh + evidenceSummary.aging * 0.7) / totalEvi;
    const freshnessScore = Math.round(Math.min(100, Math.max(0, freshRatio * 100)));
    const freshnessStatus: ResearchHealthDimensions['evidenceFreshness']['status'] =
      freshnessScore >= 85 ? 'EXCELLENT' : freshnessScore >= 70 ? 'ACCEPTABLE' : freshnessScore >= 50 ? 'DEGRADED' : 'CRITICAL';

    // Dimension 2: Evidence Validity
    const validRatio = claimsSummary.healthy + claimsSummary.aging;
    const validityScore = Math.round(Math.min(100, Math.max(0, (validRatio / totalClm) * 100)));
    const validityStatus: ResearchHealthDimensions['evidenceValidity']['status'] =
      validityScore >= 85 ? 'EXCELLENT' : validityScore >= 70 ? 'ACCEPTABLE' : validityScore >= 50 ? 'DEGRADED' : 'CRITICAL';

    // Dimension 3: Source Authority
    const tier1Count = evidenceHealth.filter((e) => e.sourceTier === 1).length;
    const tier2Count = evidenceHealth.filter((e) => e.sourceTier === 2).length;
    const primaryLabPct = Math.round(((tier1Count + tier2Count) / totalEvi) * 100);
    const authorityScore = primaryLabPct;
    const authorityStatus: ResearchHealthDimensions['sourceAuthority']['status'] =
      authorityScore >= 80 ? 'EXCELLENT' : authorityScore >= 60 ? 'ACCEPTABLE' : 'DEGRADED';

    // Dimension 4: Source Independence
    const syndicatedCount = (session.sources || []).filter((s) => s.isSyndicated).length;
    const independentCount = Math.max(0, (session.sources || []).length - syndicatedCount);
    const totalSrc = Math.max(1, (session.sources || []).length);
    const indepScore = Math.round((independentCount / totalSrc) * 100);
    const indepStatus: ResearchHealthDimensions['sourceIndependence']['status'] =
      indepScore >= 90 ? 'EXCELLENT' : indepScore >= 75 ? 'ACCEPTABLE' : 'DEGRADED';

    // Dimension 5: Methodology Integrity
    const verifiedMethCount = claimsHealth.filter((c) => c.methodologyStatus === 'METHODOLOGY_VERIFIED').length;
    const uncertainMethCount = claimsHealth.filter((c) => c.methodologyStatus === 'METHODOLOGY_UNCERTAIN').length;
    const conflictMethCount = claimsHealth.filter((c) => c.methodologyStatus === 'METHODOLOGY_CONFLICT').length;
    const methScore = conflictMethCount > 0 ? 50 : uncertainMethCount > 0 ? 75 : 100;
    const methStatus: ResearchHealthDimensions['methodologyIntegrity']['status'] =
      methScore >= 90 ? 'EXCELLENT' : methScore >= 70 ? 'ACCEPTABLE' : 'CRITICAL';

    // Dimension 6: Provenance Integrity
    const provScore = Math.round(
      (session.provenanceReport as any)?.provenanceScore || session.provenanceReport?.overallGroundingScore || 90
    );
    const provStatus: ResearchHealthDimensions['provenanceIntegrity']['status'] =
      provScore >= 85 ? 'EXCELLENT' : provScore >= 70 ? 'ACCEPTABLE' : 'DEGRADED';

    // Dimension 7: Conflict State
    const activeConflicts = (session.conflicts || []).length + claimsSummary.conflicted;
    const conflictScore = activeConflicts === 0 ? 100 : Math.max(0, 100 - activeConflicts * 25);
    const conflictStatus: ResearchHealthDimensions['conflictState']['status'] =
      conflictScore === 100 ? 'EXCELLENT' : conflictScore >= 75 ? 'ACCEPTABLE' : 'CRITICAL';

    const dimensions: ResearchHealthDimensions = {
      evidenceFreshness: {
        score: freshnessScore,
        status: freshnessStatus,
        freshCount: evidenceSummary.fresh,
        agingCount: evidenceSummary.aging,
        staleCount: evidenceSummary.stale,
        expiredCount: evidenceSummary.expired,
      },
      evidenceValidity: {
        score: validityScore,
        status: validityStatus,
        validCount: claimsSummary.healthy + claimsSummary.aging,
        revalidationRequiredCount: claimsSummary.needsRevalidation,
        conflictedCount: claimsSummary.conflicted,
        unverifiedCount: claimsSummary.unbacked,
      },
      sourceAuthority: {
        score: authorityScore,
        status: authorityStatus,
        primaryLabPercentage: primaryLabPct,
        tier1Count,
        tier2Count,
      },
      sourceIndependence: {
        score: indepScore,
        status: indepStatus,
        independentCount,
        syndicatedCount,
      },
      methodologyIntegrity: {
        score: methScore,
        status: methStatus,
        verifiedCount: verifiedMethCount,
        uncertainCount: uncertainMethCount,
        conflictCount: conflictMethCount,
      },
      provenanceIntegrity: {
        score: provScore,
        status: provStatus,
        groundingScore: provScore,
      },
      conflictState: {
        score: conflictScore,
        status: conflictStatus,
        activeConflictsCount: activeConflicts,
      },
    };

    // 4. Calculate Composite Overall Health Score
    const compositeScore = Math.round(
      freshnessScore * 0.2 +
      validityScore * 0.25 +
      authorityScore * 0.15 +
      indepScore * 0.1 +
      methScore * 0.15 +
      provScore * 0.1 +
      conflictScore * 0.05
    );

    let overallHealthGrade: ResearchHealthReport['overallHealthGrade'] = 'F';
    if (compositeScore >= 95) overallHealthGrade = 'A+';
    else if (compositeScore >= 85) overallHealthGrade = 'A';
    else if (compositeScore >= 75) overallHealthGrade = 'B';
    else if (compositeScore >= 65) overallHealthGrade = 'C';
    else if (compositeScore >= 50) overallHealthGrade = 'D';

    // 5. Hard Blockers Enforcement
    const hardBlockers: string[] = [];
    if (claimsSummary.blocked > 0) {
      hardBlockers.push(`${claimsSummary.blocked} claim(s) contain prohibited DO_NOT_SAY statements.`);
    }
    if (claimsSummary.unbacked > 0) {
      hardBlockers.push(`${claimsSummary.unbacked} claim(s) lack supporting evidence in the verified graph.`);
    }
    if (claimsSummary.conflicted > 0) {
      hardBlockers.push(`${claimsSummary.conflicted} claim(s) have unresolved factual conflicts.`);
    }
    if (conflictMethCount > 0) {
      hardBlockers.push("Unresolved benchmark methodology or upscaling conflict detected.");
    }

    const readyToSupportCreatorContent = hardBlockers.length === 0;

    // 6. Monitoring Mode Determination (Honest reporting)
    let monitoringMode: HealthMonitoringMode = 'SNAPSHOT_REVALIDATION';
    if (claimsSummary.needsRevalidation > 0 || claimsSummary.unbacked > 0) {
      monitoringMode = 'REVALIDATION_REQUIRED';
    } else if (session.updatedAt) {
      monitoringMode = 'LAST_VERIFIED';
    }

    // 7. Revalidation Plan
    const revalidationPlan = RevalidationEngine.generateRevalidationPlan(session, claimsHealth, options);

    return {
      reportId: `health-${session.id}-${Date.now().toString(36)}`,
      researchRunId: session.id,
      topic: session.topic || "Hardware Research Topic",
      overallHealthScore: compositeScore,
      overallHealthGrade,
      readyToSupportCreatorContent,
      hardBlockers,
      monitoringMode,
      lastCheckedAt: nowStr,
      evidenceSnapshotHash,
      claimsSummary,
      evidenceSummary,
      dimensions,
      claimsHealth,
      evidenceHealth,
      revalidationPlan,
    };
  }
}
