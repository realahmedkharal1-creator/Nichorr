import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { CreatorWorkflowDependencies } from "../workflow/creator-workflow.dependencies";
import { DistributionPlatformEngine } from "./distribution-platform.engine";
import { ReleaseReadinessEngine } from "./release-readiness.engine";
import { ReleaseSchedulerEngine } from "./release-scheduler.engine";
import { DistributionAuditService } from "./distribution-audit.service";
import {
  CreatorDistributionPackage,
  DistributionPlatform,
  PlatformStagingPackage,
  ReleasePlan,
} from "./distribution.types";

export class DistributionPackageEngine {
  /**
   * Generates a versioned, evidence-locked CreatorDistributionPackage.
   */
  static generatePackage(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preflight: PublishingPreflightReport,
    healthReport?: ResearchHealthReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    userId: string = "anonymous-creator",
    packageVersion: number = 1,
    parentPackageVersion?: number
  ): CreatorDistributionPackage {
    const currentEvidenceHash = CreatorWorkflowDependencies.generateEvidenceSnapshotHash(session);
    const scriptVersion = report.scriptVersion || 1;
    const nowStr = new Date().toISOString();

    // 1. Prepare Platform Packages
    const targets = DistributionPlatformEngine.preparePlatformPackages(
      session,
      report,
      preflight,
      preferences,
      currentEvidenceHash,
      scriptVersion
    );

    // 2. Evaluate Distribution Readiness
    const readinessReport = ReleaseReadinessEngine.evaluateReadiness(
      session,
      report,
      preflight,
      healthReport,
      targets,
      currentEvidenceHash,
      currentEvidenceHash
    );

    const isBlocked = readinessReport.overallStatus === 'BLOCKED';
    const packageId = `dist-pkg-${session.id}-v${packageVersion}`;

    const distPackage: CreatorDistributionPackage = {
      packageId,
      distributionPackageVersion: packageVersion,
      parentPackageVersion,
      researchRunId: session.id,
      userId,
      topic: session.topic || "Hardware Research Run",
      scriptVersion,
      evidenceSnapshotHash: currentEvidenceHash,
      productionPackageVersion: 1,
      publishingPreflightVersion: 1,
      contentQualityScore: readinessReport.contentQualityScore,
      productionReadinessScore: readinessReport.productionReadinessScore,
      publishingReadinessScore: readinessReport.publishingReadinessScore,
      distributionReadinessScore: readinessReport.distributionReadinessScore,
      targets,
      readinessReport,
      approvalState: isBlocked ? 'BLOCKED' : 'PENDING_APPROVAL',
      createdAt: nowStr,
      updatedAt: nowStr,
      status: isBlocked ? 'BLOCKED' : 'READY_FOR_REVIEW',
    };

    // Record Package Creation Audit Event
    DistributionAuditService.recordAuditEvent({
      auditId: `dist-aud-${Date.now().toString(36)}-create`,
      userId,
      researchRunId: session.id,
      distributionPackageId: packageId,
      target: 'ALL',
      action: 'PACKAGE_CREATED',
      previousState: parentPackageVersion ? `v${parentPackageVersion}` : 'NONE',
      newState: `v${packageVersion}`,
      scriptVersion,
      evidenceSnapshotHash: currentEvidenceHash,
      result: isBlocked ? "PACKAGE_CREATED_WITH_BLOCKERS" : "PACKAGE_CREATED_READY_FOR_REVIEW",
      reason: isBlocked
        ? `Distribution package created with ${readinessReport.blockingReasons.length} blockers.`
        : "Distribution staging package prepared and ready for creator review.",
      timestamp: nowStr,
    });

    return distPackage;
  }

  /**
   * Approves a distribution target package explicitly by the creator.
   */
  static approveTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    note?: string,
    userId: string = "anonymous-creator"
  ): {
    updatedPackage: CreatorDistributionPackage;
    success: boolean;
    errorMessage?: string;
  } {
    const target = pkg.targets.find((t) => t.platform === platform);
    if (!target) {
      return { updatedPackage: pkg, success: false, errorMessage: `Target platform ${platform} not found in package.` };
    }

    if (target.isBlocked || pkg.readinessReport.overallStatus === 'BLOCKED') {
      return {
        updatedPackage: pkg,
        success: false,
        errorMessage: "Cannot approve a blocked distribution target. Resolve safety blockers first.",
      };
    }

    target.status = 'APPROVED';
    target.releasePlan.status = 'APPROVED';
    target.releasePlan.note = note || "Creator approved distribution staging.";

    const allApproved = pkg.targets.every((t) => t.status === 'APPROVED');
    pkg.approvalState = allApproved ? 'APPROVED' : 'PENDING_APPROVAL';
    pkg.updatedAt = new Date().toISOString();

    DistributionAuditService.recordAuditEvent({
      auditId: `dist-aud-${Date.now().toString(36)}-approve`,
      userId,
      researchRunId: pkg.researchRunId,
      distributionPackageId: pkg.packageId,
      target: platform,
      action: 'APPROVAL_GRANTED',
      previousState: 'READY_FOR_REVIEW',
      newState: 'APPROVED',
      scriptVersion: pkg.scriptVersion,
      evidenceSnapshotHash: pkg.evidenceSnapshotHash,
      result: `Target ${platform} approved.`,
      reason: note || "Creator granted explicit distribution approval.",
      timestamp: new Date().toISOString(),
    });

    return { updatedPackage: pkg, success: true };
  }

  /**
   * Rejects a distribution target package.
   */
  static rejectTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    reason: string,
    userId: string = "anonymous-creator"
  ): {
    updatedPackage: CreatorDistributionPackage;
    success: boolean;
  } {
    const target = pkg.targets.find((t) => t.platform === platform);
    if (target) {
      target.status = 'REJECTED';
      target.releasePlan.status = 'REJECTED';
      target.releasePlan.note = reason;
      pkg.approvalState = 'REJECTED';
      pkg.updatedAt = new Date().toISOString();

      DistributionAuditService.recordAuditEvent({
        auditId: `dist-aud-${Date.now().toString(36)}-reject`,
        userId,
        researchRunId: pkg.researchRunId,
        distributionPackageId: pkg.packageId,
        target: platform,
        action: 'APPROVAL_REJECTED',
        previousState: 'READY_FOR_REVIEW',
        newState: 'REJECTED',
        scriptVersion: pkg.scriptVersion,
        evidenceSnapshotHash: pkg.evidenceSnapshotHash,
        result: `Target ${platform} rejected.`,
        reason,
        timestamp: new Date().toISOString(),
      });
    }

    return { updatedPackage: pkg, success: true };
  }

  /**
   * Schedules a target release with timezone validation.
   */
  static scheduleTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    localDateTime: string,
    timezone: string,
    note?: string,
    userId: string = "anonymous-creator"
  ): {
    updatedPackage: CreatorDistributionPackage;
    success: boolean;
    errorMessage?: string;
  } {
    const target = pkg.targets.find((t) => t.platform === platform);
    if (!target) {
      return { updatedPackage: pkg, success: false, errorMessage: `Target ${platform} not found.` };
    }

    if (target.status !== 'APPROVED' && target.status !== 'READY_FOR_REVIEW') {
      return { updatedPackage: pkg, success: false, errorMessage: `Target must be in review or approved state to schedule.` };
    }

    const existingPlans = pkg.targets.map((t) => t.releasePlan);
    const scheduleResult = ReleaseSchedulerEngine.createReleasePlan(
      platform,
      'SCHEDULED_RELEASE',
      localDateTime,
      timezone,
      note,
      pkg.distributionPackageVersion,
      pkg.evidenceSnapshotHash,
      existingPlans.filter((p) => p.target !== platform)
    );

    if (!scheduleResult.success || !scheduleResult.plan) {
      return {
        updatedPackage: pkg,
        success: false,
        errorMessage: scheduleResult.errorMessage || scheduleResult.conflicts[0]?.message || "Schedule creation failed.",
      };
    }

    target.releasePlan = scheduleResult.plan;
    target.status = 'SCHEDULED';
    pkg.updatedAt = new Date().toISOString();

    DistributionAuditService.recordAuditEvent({
      auditId: `dist-aud-${Date.now().toString(36)}-schedule`,
      userId,
      researchRunId: pkg.researchRunId,
      distributionPackageId: pkg.packageId,
      target: platform,
      action: 'RELEASE_SCHEDULED',
      previousState: 'APPROVED',
      newState: 'SCHEDULED',
      scriptVersion: pkg.scriptVersion,
      evidenceSnapshotHash: pkg.evidenceSnapshotHash,
      result: `Release scheduled for ${localDateTime} (${timezone}).`,
      reason: note || "Creator scheduled release.",
      timestamp: new Date().toISOString(),
    });

    return { updatedPackage: pkg, success: true };
  }

  /**
   * Cancels a scheduled target release.
   */
  static cancelSchedule(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    reason: string = "Creator cancelled schedule",
    userId: string = "anonymous-creator"
  ): {
    updatedPackage: CreatorDistributionPackage;
    success: boolean;
  } {
    const target = pkg.targets.find((t) => t.platform === platform);
    if (target && target.status === 'SCHEDULED') {
      target.status = 'CANCELLED';
      target.releasePlan.status = 'CANCELLED';
      target.releasePlan.note = reason;
      pkg.updatedAt = new Date().toISOString();

      DistributionAuditService.recordAuditEvent({
        auditId: `dist-aud-${Date.now().toString(36)}-cancel`,
        userId,
        researchRunId: pkg.researchRunId,
        distributionPackageId: pkg.packageId,
        target: platform,
        action: 'RELEASE_CANCELLED',
        previousState: 'SCHEDULED',
        newState: 'CANCELLED',
        scriptVersion: pkg.scriptVersion,
        evidenceSnapshotHash: pkg.evidenceSnapshotHash,
        result: `Scheduled release for ${platform} cancelled.`,
        reason,
        timestamp: new Date().toISOString(),
      });
    }

    return { updatedPackage: pkg, success: true };
  }
}
