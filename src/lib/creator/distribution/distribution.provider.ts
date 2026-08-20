export * from "./distribution.types";
export * from "./distribution-preferences.types";
export * from "./distribution-platform.engine";
export * from "./release-readiness.engine";
export * from "./release-scheduler.engine";
export * from "./distribution-audit.service";
export * from "./distribution-package.engine";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { DistributionPackageEngine } from "./distribution-package.engine";
import { ReleaseReadinessEngine } from "./release-readiness.engine";
import { DistributionAuditService } from "./distribution-audit.service";
import {
  CreatorDistributionPackage,
  DistributionPlatform,
  DistributionReadinessReport,
  DistributionAuditEvent,
} from "./distribution.types";

export class DistributionProvider {
  /**
   * Generates a complete versioned distribution package for enabled platforms.
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
    return DistributionPackageEngine.generatePackage(
      session,
      report,
      preflight,
      healthReport,
      preferences,
      userId,
      packageVersion,
      parentPackageVersion
    );
  }

  /**
   * Evaluates release readiness across research health, script, production, publishing, and distribution.
   */
  static evaluateReadiness(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preflight: PublishingPreflightReport,
    healthReport?: ResearchHealthReport,
    packages?: any[],
    lockedEvidenceHash?: string,
    currentEvidenceHash?: string
  ): DistributionReadinessReport {
    return ReleaseReadinessEngine.evaluateReadiness(
      session,
      report,
      preflight,
      healthReport,
      packages,
      lockedEvidenceHash,
      currentEvidenceHash
    );
  }

  /**
   * Explicitly approves a distribution target package.
   */
  static approveTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    note?: string,
    userId: string = "anonymous-creator"
  ) {
    return DistributionPackageEngine.approveTarget(pkg, platform, note, userId);
  }

  /**
   * Rejects a distribution target package.
   */
  static rejectTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    reason: string,
    userId: string = "anonymous-creator"
  ) {
    return DistributionPackageEngine.rejectTarget(pkg, platform, reason, userId);
  }

  /**
   * Schedules a target release with timezone verification.
   */
  static scheduleTarget(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    localDateTime: string,
    timezone: string,
    note?: string,
    userId: string = "anonymous-creator"
  ) {
    return DistributionPackageEngine.scheduleTarget(pkg, platform, localDateTime, timezone, note, userId);
  }

  /**
   * Cancels a scheduled target release.
   */
  static cancelSchedule(
    pkg: CreatorDistributionPackage,
    platform: DistributionPlatform,
    reason?: string,
    userId: string = "anonymous-creator"
  ) {
    return DistributionPackageEngine.cancelSchedule(pkg, platform, reason, userId);
  }

  /**
   * Retrieves distribution audit history.
   */
  static getHistory(researchRunId: string, userId: string = "anonymous-creator"): DistributionAuditEvent[] {
    return DistributionAuditService.getHistory(researchRunId, userId);
  }
}
