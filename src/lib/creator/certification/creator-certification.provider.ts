export * from "./creator-certification.types";
export * from "./creator-certification.audit";
export * from "./creator-certification.engine";
export * from "./creator-certification.lock";
export * from "./creator-certification.changes";
export * from "./creator-certification.handoff";

import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { CreatorProjectSnapshot } from "../project/creator-project.types";
import {
  ProjectIntegrityCertificate,
  HandoffManifest,
  CertificationChangeReport,
  CertificationAuditEvent,
} from "./creator-certification.types";
import { CreatorCertificationEngine } from "./creator-certification.engine";
import { CreatorReleaseLockEngine } from "./creator-certification.lock";
import { CreatorCertificationChangesEngine } from "./creator-certification.changes";
import { CreatorHandoffEngine } from "./creator-certification.handoff";
import { CreatorCertificationAuditService } from "./creator-certification.audit";

const globalForCertProvider = globalThis as unknown as {
  creatorCertificateCache: Map<string, ProjectIntegrityCertificate> | undefined;
};

const certificateCache =
  globalForCertProvider.creatorCertificateCache ?? new Map<string, ProjectIntegrityCertificate>();
if (process.env.NODE_ENV !== "production")
  globalForCertProvider.creatorCertificateCache = certificateCache;

export class CreatorCertificationProvider {
  /**
   * Evaluates and caches the Project Integrity Certificate.
   */
  static evaluateCertification(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage,
    userId: string = "anonymous-creator"
  ): ProjectIntegrityCertificate {
    const certificate = CreatorCertificationEngine.evaluateCertification(
      session,
      report,
      preferences,
      profile,
      healthReport,
      preflight,
      distPackage,
      userId
    );

    // Check if release locked
    const lockCheck = CreatorReleaseLockEngine.getReleaseLock(
      session.id,
      certificate.projectSnapshotHash,
      certificate.scriptVersion,
      userId
    );
    certificate.isReleaseLocked = lockCheck.isLocked;
    certificate.releaseLockMetadata = lockCheck.lock;

    const key = `${userId}:${session.id}`;
    certificateCache.set(key, certificate);

    return certificate;
  }

  /**
   * Retrieves current certificate for a research session.
   */
  static getCertificate(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): ProjectIntegrityCertificate | undefined {
    const key = `${userId}:${researchRunId}`;
    return certificateCache.get(key);
  }

  /**
   * Applies explicit Release Lock.
   */
  static applyReleaseLock(
    certificate: ProjectIntegrityCertificate,
    userId: string = "anonymous-creator",
    notes?: string
  ) {
    return CreatorReleaseLockEngine.applyReleaseLock(certificate, userId, notes);
  }

  /**
   * Retrieves Release Lock state.
   */
  static getReleaseLock(
    researchRunId: string,
    currentSnapshotHash?: string,
    currentScriptVersion?: number,
    userId: string = "anonymous-creator"
  ) {
    return CreatorReleaseLockEngine.getReleaseLock(
      researchRunId,
      currentSnapshotHash,
      currentScriptVersion,
      userId
    );
  }

  /**
   * Unlocks release state.
   */
  static unlockRelease(
    researchRunId: string,
    userId: string = "anonymous-creator",
    reason?: string
  ) {
    return CreatorReleaseLockEngine.unlockRelease(researchRunId, userId, reason);
  }

  /**
   * Detects changes since last certification.
   */
  static detectChangesSinceCertification(
    currentSnapshot: CreatorProjectSnapshot,
    certificate?: ProjectIntegrityCertificate
  ): CertificationChangeReport {
    return CreatorCertificationChangesEngine.detectChangesSinceCertification(
      currentSnapshot,
      certificate
    );
  }

  /**
   * Generates deterministic final handoff manifest.
   */
  static generateHandoffManifest(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    certificate: ProjectIntegrityCertificate,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    userId: string = "anonymous-creator"
  ): HandoffManifest {
    return CreatorHandoffEngine.generateHandoffManifest(
      session,
      report,
      certificate,
      preferences,
      userId
    );
  }

  /**
   * Retrieves immutable audit ledger.
   */
  static getHistory(
    researchRunId: string,
    userId: string = "anonymous-creator"
  ): CertificationAuditEvent[] {
    return CreatorCertificationAuditService.getHistory(researchRunId, userId);
  }

  /**
   * Clears in-memory caches.
   */
  static clearCache(): void {
    certificateCache.clear();
    CreatorReleaseLockEngine.clearLocks();
    CreatorCertificationAuditService.clearHistory();
  }
}
