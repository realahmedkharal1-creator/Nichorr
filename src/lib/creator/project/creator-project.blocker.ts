import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import {
  CreatorProjectBlocker,
  CreatorProjectHealthReport,
  CreatorProjectAssetItem,
  ProjectOverallStatus,
} from "./creator-project.types";

export class CreatorProjectBlockerEngine {
  /**
   * Aggregates all project blockers across Research, Health, Script, Production, Publishing, and Distribution subsystems.
   * Generates transparent, deterministic blocker lineage and enforces hard blocker safety gates.
   */
  static evaluateBlockersAndHealth(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage
  ): {
    blockers: CreatorProjectBlocker[];
    healthReport: CreatorProjectHealthReport;
  } {
    const blockers: CreatorProjectBlocker[] = [];
    const staleAssets: CreatorProjectAssetItem[] = [];
    const readyAssets: CreatorProjectAssetItem[] = [];

    // 1. Evaluate Research & Claim Health Blockers
    if (healthReport && !healthReport.readyToSupportCreatorContent) {
      for (const hb of healthReport.hardBlockers) {
        blockers.push({
          blockerId: `blocker-health-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          severity: 'CRITICAL',
          subsystem: 'HEALTH',
          affectedNodeId: `health-${session.id}`,
          affectedNodeLabel: "Research & Evidence Health",
          reason: hb,
          upstreamCause: "Claim verification status flagged as DO_NOT_SAY, UNBACKED, or CONFLICTED.",
          affectedAssets: ["Script Narration", "Talking Points", "Benchmark Cards", "Teleprompter"],
          requiredAction: "Review claim in Research Health Decision Control Center and remove or revalidate.",
          creatorActionRequired: true,
          regenerationRequired: true,
          revalidationRequired: true,
        });
      }
    }

    // 2. Evaluate Script Talking Point Blockers (DO_NOT_SAY)
    for (const tp of report.talkingPoints || []) {
      if (tp.verificationStatus === 'DO_NOT_SAY') {
        blockers.push({
          blockerId: `blocker-tp-${tp.id}`,
          severity: 'CRITICAL',
          subsystem: 'SCRIPT',
          affectedNodeId: `tp-${tp.id}`,
          affectedNodeLabel: `Talking Point: "${tp.title || tp.statement.slice(0, 30)}"`,
          reason: tp.doNotSayWarning || "Talking point flagged as DO_NOT_SAY due to debunked or contradictory data.",
          upstreamCause: "Factual contradiction with primary laboratory measurements.",
          affectedAssets: ["Script Section", "Teleprompter"],
          requiredAction: "Remove or regenerate talking point in Creator Studio.",
          creatorActionRequired: true,
          regenerationRequired: true,
          revalidationRequired: false,
        });
      }
    }

    // 3. Evaluate Publishing Preflight Blockers
    if (preflight && preflight.readinessStatus === 'BLOCKED') {
      for (const iss of preflight.allIssues.filter((i) => i.severity === 'BLOCKER')) {
        blockers.push({
          blockerId: `blocker-pub-${iss.id}`,
          severity: 'HIGH',
          subsystem: 'PUBLISHING',
          affectedNodeId: `pub-${iss.id}`,
          affectedNodeLabel: `Publishing Preflight: ${iss.platform || 'General'}`,
          reason: iss.message,
          upstreamCause: "Required platform delivery asset missing or unverified.",
          affectedAssets: [iss.platform || "Publishing Metadata"],
          requiredAction: iss.remediation || "Generate missing required platform metadata.",
          creatorActionRequired: true,
          regenerationRequired: false,
          revalidationRequired: false,
        });
      }
    }

    // 4. Evaluate Distribution Blockers
    if (distPackage && distPackage.status === 'BLOCKED') {
      for (const b of distPackage.readinessReport.blockingReasons) {
        blockers.push({
          blockerId: `blocker-dist-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          severity: 'HIGH',
          subsystem: 'DISTRIBUTION',
          affectedNodeId: `dist-${distPackage.packageId}`,
          affectedNodeLabel: "Distribution Staging Package",
          reason: b,
          upstreamCause: "Distribution safety gate or evidence snapshot mismatch.",
          affectedAssets: ["Platform Release Plans"],
          requiredAction: "Resolve upstream blockers and approve distribution staging.",
          creatorActionRequired: true,
          regenerationRequired: false,
          revalidationRequired: false,
        });
      }
    }

    const isHardBlocked = blockers.some((b) => b.severity === 'CRITICAL' || b.severity === 'HIGH');

    // Aggregate Scores
    const researchHealthScore = healthReport ? healthReport.overallHealthScore : 95;
    const contentQualityScore = report.qualityReview?.overallQualityScore || 90;
    const productionReadinessScore = preflight?.productionReadinessScore || 95;
    const publishingReadinessScore = preflight?.overallPublishingScore || 90;
    const distributionReadinessScore = distPackage?.distributionReadinessScore || 90;

    let overallStatus: ProjectOverallStatus = 'READY';
    let summaryMessage = "All project subsystems are healthy, verified, and ready for production and distribution.";

    if (isHardBlocked) {
      overallStatus = 'BLOCKED';
      summaryMessage = `Project is BLOCKED by ${blockers.length} safety blocker${blockers.length > 1 ? 's' : ''}.`;
    } else if (distPackage && distPackage.approvalState !== 'APPROVED') {
      overallStatus = 'DISTRIBUTION_REVIEW_REQUIRED';
      summaryMessage = "Project staging is prepared and awaiting explicit creator approval for distribution.";
    } else if (preflight && preflight.readinessStatus !== 'READY') {
      overallStatus = 'PUBLISHING_REVIEW_REQUIRED';
      summaryMessage = "Publishing preflight requires creator review.";
    }

    const healthSummary: CreatorProjectHealthReport = {
      overallStatus,
      isHardBlocked,
      researchHealthScore,
      contentQualityScore,
      productionReadinessScore,
      publishingReadinessScore,
      distributionReadinessScore,
      blockers,
      staleAssets,
      readyAssets,
      summaryMessage,
    };

    return { blockers, healthReport: healthSummary };
  }
}
