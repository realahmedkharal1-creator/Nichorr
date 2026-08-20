import {
  ProjectIntegrityCertificate,
  ReleaseLockRecord,
  ReleaseLockStatus,
} from "./creator-certification.types";
import { CreatorCertificationAuditService } from "./creator-certification.audit";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForReleaseLock = globalThis as unknown as {
  creatorReleaseLockStore: Map<string, ReleaseLockRecord> | undefined;
};

const releaseLockStore =
  globalForReleaseLock.creatorReleaseLockStore ?? new Map<string, ReleaseLockRecord>();
if (process.env.NODE_ENV !== "production")
  globalForReleaseLock.creatorReleaseLockStore = releaseLockStore;

export class CreatorReleaseLockEngine {
  /**
   * Applies an explicit creator-controlled Release Lock to a certified project state.
   */
  static applyReleaseLock(
    certificate: ProjectIntegrityCertificate,
    userId: string = "anonymous-creator",
    notes?: string
  ): {
    success: boolean;
    lock?: ReleaseLockRecord;
    errorMessage?: string;
  } {
    if (certificate.status === 'BLOCKED') {
      return {
        success: false,
        errorMessage: "Cannot apply Release Lock to a project with BLOCKED certification status.",
      };
    }

    if (certificate.status === 'INVALIDATED' || certificate.status === 'STALE') {
      return {
        success: false,
        errorMessage: `Cannot apply Release Lock to a certificate in ${certificate.status} status. Re-evaluate certification first.`,
      };
    }

    const nowStr = new Date().toISOString();
    const lockId = `lock-${certificate.researchRunId}-v${certificate.scriptVersion}-${Date.now().toString(36)}`;

    const lockRecord: ReleaseLockRecord = {
      lockId,
      userId,
      researchRunId: certificate.researchRunId,
      certificateId: certificate.certificateId,
      lockedProjectSnapshotHash: certificate.projectSnapshotHash,
      lockedEvidenceSnapshotHash: certificate.evidenceSnapshotHash,
      lockedScriptVersion: certificate.scriptVersion,
      lockedTimelineFingerprint: certificate.timelineFingerprint,
      lockedAt: nowStr,
      lockedBy: userId,
      lockStatus: 'LOCKED',
      notes,
    };

    const key = `${userId}:${certificate.researchRunId}`;
    releaseLockStore.set(key, lockRecord);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("releaseLockStore", "Artifact", key, lockRecord).catch(e => console.warn(e));

    certificate.isReleaseLocked = true;
    certificate.releaseLockMetadata = lockRecord;

    CreatorCertificationAuditService.recordAuditEvent({
      auditId: `cert-aud-${Date.now().toString(36)}-lock`,
      certificateId: certificate.certificateId,
      userId,
      researchRunId: certificate.researchRunId,
      action: 'RELEASE_LOCKED',
      projectSnapshotHash: certificate.projectSnapshotHash,
      scriptVersion: certificate.scriptVersion,
      details: `Release Lock applied to Script Version ${certificate.scriptVersion}. Snapshot: ${certificate.projectSnapshotHash}.`,
      timestamp: nowStr,
    });

    return {
      success: true,
      lock: lockRecord,
    };
  }

  /**
   * Retrieves active Release Lock and validates whether it matches current project snapshot.
   */
  static getReleaseLock(
    researchRunId: string,
    currentProjectSnapshotHash?: string,
    currentScriptVersion?: number,
    userId: string = "anonymous-creator"
  ): {
    isLocked: boolean;
    lockStatus: ReleaseLockStatus;
    lock?: ReleaseLockRecord;
  } {
    const key = `${userId}:${researchRunId}`;
    const lock = releaseLockStore.get(key);

    if (!lock) {
      return {
        isLocked: false,
        lockStatus: 'UNLOCKED',
      };
    }

    // Evaluate stale state against current snapshot if provided
    if (currentProjectSnapshotHash && lock.lockedProjectSnapshotHash !== currentProjectSnapshotHash) {
      return {
        isLocked: false,
        lockStatus: 'STALE_LOCK',
        lock,
      };
    }

    if (currentScriptVersion && lock.lockedScriptVersion !== currentScriptVersion) {
      return {
        isLocked: false,
        lockStatus: 'INVALIDATED_LOCK',
        lock,
      };
    }

    return {
      isLocked: lock.lockStatus === 'LOCKED',
      lockStatus: lock.lockStatus,
      lock,
    };
  }

  /**
   * Explicitly unlocks the certified release state.
   */
  static unlockRelease(
    researchRunId: string,
    userId: string = "anonymous-creator",
    reason?: string
  ): {
    success: boolean;
    errorMessage?: string;
  } {
    const key = `${userId}:${researchRunId}`;
    const lock = releaseLockStore.get(key);

    if (!lock) {
      return {
        success: false,
        errorMessage: "No active Release Lock found to unlock.",
      };
    }

    releaseLockStore.delete(key);

    CreatorCertificationAuditService.recordAuditEvent({
      auditId: `cert-aud-${Date.now().toString(36)}-unlock`,
      certificateId: lock.certificateId,
      userId,
      researchRunId,
      action: 'RELEASE_UNLOCKED',
      projectSnapshotHash: lock.lockedProjectSnapshotHash,
      scriptVersion: lock.lockedScriptVersion,
      details: reason ? `Release Lock removed: ${reason}` : "Release Lock removed by creator.",
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
    };
  }

  /**
   * Clears release lock store (for testing isolation).
   */
  static clearLocks(): void {
    releaseLockStore.clear();
  }
}
