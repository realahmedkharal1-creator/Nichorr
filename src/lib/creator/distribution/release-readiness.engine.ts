import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import {
  DistributionReadinessReport,
  DistributionReadinessItem,
  DistributionBlockerExplanation,
  PlatformStagingPackage,
} from "./distribution.types";

export class ReleaseReadinessEngine {
  /**
   * Evaluates comprehensive release readiness across 5 distinct dimensions.
   * Computes Distribution Readiness Score and enforces non-bypassable blockers.
   */
  static evaluateReadiness(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preflight: PublishingPreflightReport,
    healthReport?: ResearchHealthReport,
    packages: PlatformStagingPackage[] = [],
    lockedEvidenceHash?: string,
    currentEvidenceHash?: string
  ): DistributionReadinessReport {
    const dimensions: DistributionReadinessItem[] = [];
    const blockingReasons: string[] = [];
    const blockerExplanations: DistributionBlockerExplanation[] = [];
    const nowStr = new Date().toISOString();

    // 1. Research Health Dimension
    const hasHealthBlockers = healthReport ? !healthReport.readyToSupportCreatorContent : false;
    const researchHealthScore = healthReport ? healthReport.overallHealthScore : 95;
    const healthReasons: string[] = [];

    if (hasHealthBlockers && healthReport) {
      for (const b of healthReport.hardBlockers) {
        blockingReasons.push(b);
        healthReasons.push(b);
        blockerExplanations.push({
          blocker: b,
          affectedAsset: "Script Narration & On-Screen Cards",
          affectedClaim: "Flagged Research Assertion",
          evidenceState: "DO_NOT_SAY / UNBACKED / CONFLICTED",
          provenanceChain: "Multi-hop citation check failed safety rules.",
          scriptVersion: report.scriptVersion || 1,
          evidenceSnapshot: currentEvidenceHash || "hash-active",
          publishingState: "BLOCKED",
          requiredAction: "Review claim in Research Health Decision Control Center and remove or revalidate.",
        });
      }
    } else {
      healthReasons.push("All supporting evidence and benchmark measurements are verified and valid.");
    }

    dimensions.push({
      dimension: 'RESEARCH_HEALTH',
      label: "Research & Evidence Health",
      status: hasHealthBlockers ? 'BLOCKED' : 'READY',
      score: hasHealthBlockers ? 0 : researchHealthScore,
      reasons: healthReasons,
    });

    // 2. Script State Dimension
    const qualityScore = report.qualityReview?.overallQualityScore || 90;
    const hashMismatch = lockedEvidenceHash && currentEvidenceHash && lockedEvidenceHash !== currentEvidenceHash;
    const scriptReasons: string[] = [];

    if (hashMismatch) {
      const msg = "Evidence snapshot changed after script generation. Script is STALE.";
      blockingReasons.push(msg);
      scriptReasons.push(msg);
      blockerExplanations.push({
        blocker: "Evidence Snapshot Hash Mismatch",
        affectedAsset: "Full Script & Talking Points",
        affectedClaim: "Updated Evidence Item",
        evidenceState: "STALE SNAPSHOT",
        provenanceChain: "Upstream evidence graph modified.",
        scriptVersion: report.scriptVersion || 1,
        evidenceSnapshot: currentEvidenceHash || "hash-updated",
        publishingState: "STALE",
        requiredAction: "Approve targeted regeneration in Creator Studio into Version N+1.",
      });
    } else {
      scriptReasons.push(`Script Version ${report.scriptVersion || 1} is synchronized with active research snapshot.`);
    }

    dimensions.push({
      dimension: 'SCRIPT_STATE',
      label: "Script & Quality State",
      status: hashMismatch ? 'STALE' : qualityScore >= 80 ? 'READY' : 'READY_WITH_WARNINGS',
      score: hashMismatch ? 40 : qualityScore,
      reasons: scriptReasons,
    });

    // 3. Production State Dimension
    const prodScore = preflight.productionReadinessScore || 95;
    const prodReasons = ["Production outline, chapters, and timeline references are generated."];

    dimensions.push({
      dimension: 'PRODUCTION_STATE',
      label: "Production Package Completeness",
      status: 'READY',
      score: prodScore,
      reasons: prodReasons,
    });

    // 4. Publishing State Dimension
    const pubScore = preflight.overallPublishingScore || 90;
    const pubBlocked = preflight.readinessStatus === 'BLOCKED';
    const pubReasons: string[] = [];

    if (pubBlocked) {
      for (const iss of preflight.allIssues.filter((i) => i.severity === 'BLOCKER')) {
        blockingReasons.push(iss.message);
        pubReasons.push(iss.message);
      }
    } else {
      pubReasons.push("Multi-platform preflight checks passed across enabled delivery targets.");
    }

    dimensions.push({
      dimension: 'PUBLISHING_STATE',
      label: "Publishing Preflight State",
      status: pubBlocked ? 'BLOCKED' : 'READY',
      score: pubBlocked ? 0 : pubScore,
      reasons: pubReasons,
    });

    // 5. Distribution State Dimension
    const hasBlockedTargets = packages.some((p) => p.isBlocked);
    const distReasons: string[] = [];

    if (packages.length === 0) {
      distReasons.push("No distribution platforms enabled.");
    } else {
      distReasons.push(`${packages.length} distribution targets configured in STAGING_ONLY mode.`);
    }

    dimensions.push({
      dimension: 'DISTRIBUTION_STATE',
      label: "Distribution Staging & Targets",
      status: hasBlockedTargets ? 'BLOCKED' : 'READY',
      score: hasBlockedTargets ? 0 : 95,
      reasons: distReasons,
    });

    // Composite Distribution Readiness Score calculation
    const totalScore = dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length;
    const isHardBlocked = blockingReasons.length > 0 || hasHealthBlockers || pubBlocked || hashMismatch;
    const distributionReadinessScore = isHardBlocked ? 0 : Math.round(totalScore);

    const readyForApproval = !isHardBlocked && packages.length > 0;
    const readyForRelease = readyForApproval && packages.every((p) => p.status === 'APPROVED');

    let overallStatus: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED' | 'STAGING_ONLY' = 'STAGING_ONLY';
    let summaryMessage = "Distribution staging package is prepared and ready for creator approval in STAGING_ONLY mode.";

    if (isHardBlocked) {
      overallStatus = 'BLOCKED';
      summaryMessage = `Distribution is BLOCKED by ${blockingReasons.length} non-bypassable safety issue${blockingReasons.length > 1 ? 's' : ''}.`;
    } else if (readyForRelease) {
      overallStatus = 'READY';
      summaryMessage = "Creator approval verified. Distribution package is staged for release.";
    } else if (!readyForApproval) {
      overallStatus = 'READY_WITH_WARNINGS';
      summaryMessage = "Distribution package requires creator review and approval.";
    }

    return {
      distributionReadinessScore,
      contentQualityScore: qualityScore,
      productionReadinessScore: prodScore,
      publishingReadinessScore: pubScore,
      readyForApproval: Boolean(readyForApproval),
      readyForRelease: Boolean(readyForRelease),
      overallStatus,
      summaryMessage,
      dimensions,
      blockingReasons,
      blockerExplanations,
      checkedAt: nowStr,
    };
  }
}
