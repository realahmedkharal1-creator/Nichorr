import {
  ReleasePlan,
  ReleaseConflict,
  DistributionPlatform,
  DistributionTargetStatus,
} from "./distribution.types";

export class ReleaseSchedulerEngine {
  /**
   * Validates and creates a deterministic release plan with timezone verification and conflict checks.
   */
  static createReleasePlan(
    target: DistributionPlatform,
    releaseMode: 'MANUAL_RELEASE' | 'SCHEDULED_RELEASE' | 'STAGED_ONLY',
    localDateTime?: string,
    timezone?: string,
    note?: string,
    packageVersion: number = 1,
    snapshotHash?: string,
    existingPlans: ReleasePlan[] = []
  ): {
    success: boolean;
    plan?: ReleasePlan;
    conflicts: ReleaseConflict[];
    errorMessage?: string;
  } {
    const conflicts: ReleaseConflict[] = [];

    // 1. Timezone verification for scheduled releases
    if (releaseMode === 'SCHEDULED_RELEASE') {
      if (!timezone || !timezone.trim()) {
        return {
          success: false,
          conflicts: [{
            conflictType: 'MISSING_APPROVAL',
            message: "Timezone is required for scheduled releases. Silent server timezone assumptions are prohibited.",
            remediation: "Specify an explicit IANA timezone (e.g., America/New_York, UTC, Europe/London).",
          }],
          errorMessage: "TIMEZONE_REQUIRED",
        };
      }

      if (!localDateTime || isNaN(new Date(localDateTime).getTime())) {
        return {
          success: false,
          conflicts: [{
            conflictType: 'MISSING_APPROVAL',
            message: "Invalid local scheduled datetime provided.",
            remediation: "Provide a valid ISO date-time string.",
          }],
          errorMessage: "INVALID_DATETIME",
        };
      }
    }

    // 2. Conflict detection
    const existingDuplicate = existingPlans.find(
      (p) => p.target === target && p.status === 'SCHEDULED'
    );
    if (existingDuplicate) {
      conflicts.push({
        conflictType: 'DUPLICATE_SCHEDULE',
        message: `A release is already scheduled for ${target} at ${existingDuplicate.scheduledAt || "pending time"}.`,
        remediation: "Cancel existing schedule before creating a new one.",
      });
    }

    let scheduledAtUTC: string | undefined = undefined;
    if (releaseMode === 'SCHEDULED_RELEASE' && localDateTime) {
      try {
        scheduledAtUTC = new Date(localDateTime).toISOString();
      } catch {
        scheduledAtUTC = localDateTime;
      }
    }

    const plan: ReleasePlan = {
      target,
      releaseMode,
      scheduledAt: scheduledAtUTC,
      localScheduledAt: localDateTime,
      timezone: timezone || "UTC",
      approvalRequired: true,
      status: conflicts.length > 0 ? 'BLOCKED' : releaseMode === 'SCHEDULED_RELEASE' ? 'SCHEDULED' : 'READY_FOR_REVIEW',
      note,
    };

    return {
      success: conflicts.length === 0,
      plan,
      conflicts,
    };
  }

  /**
   * Detects release conflicts against current package state.
   */
  static detectConflicts(
    plan: ReleasePlan,
    currentPackageVersion: number,
    scheduledPackageVersion: number,
    currentSnapshotHash: string,
    scheduledSnapshotHash: string,
    isApproved: boolean
  ): ReleaseConflict[] {
    const conflicts: ReleaseConflict[] = [];

    if (scheduledPackageVersion < currentPackageVersion) {
      conflicts.push({
        conflictType: 'STALE_PACKAGE',
        message: `Scheduled package (v${scheduledPackageVersion}) is older than current package (v${currentPackageVersion}).`,
        remediation: "Reschedule release with the latest distribution package version.",
      });
    }

    if (scheduledSnapshotHash && currentSnapshotHash && scheduledSnapshotHash !== currentSnapshotHash) {
      conflicts.push({
        conflictType: 'EVIDENCE_HASH_MISMATCH',
        message: "Underlying evidence snapshot hash has changed since this release was scheduled.",
        remediation: "Review research changes and re-approve distribution package.",
      });
    }

    if (!isApproved && plan.releaseMode !== 'STAGED_ONLY') {
      conflicts.push({
        conflictType: 'MISSING_APPROVAL',
        message: "Creator has not explicitly approved this distribution target.",
        remediation: "Review and grant creator approval in Distribution Control Center.",
      });
    }

    return conflicts;
  }
}
