import {
  ProjectIntegrityCertificate,
  CertificationChangeReport,
  ChangeImpactLevel,
} from "./creator-certification.types";
import { CreatorProjectSnapshot } from "../project/creator-project.types";

export class CreatorCertificationChangesEngine {
  /**
   * Compares the current active project snapshot against the last certified certificate.
   */
  static detectChangesSinceCertification(
    currentSnapshot: CreatorProjectSnapshot,
    certificate?: ProjectIntegrityCertificate
  ): CertificationChangeReport {
    const nowStr = new Date().toISOString();

    if (!certificate) {
      return {
        hasChanges: false,
        impactLevel: 'NO_CHANGE',
        currentProjectSnapshotHash: currentSnapshot.snapshotHash,
        certifiedProjectSnapshotHash: "NONE",
        currentScriptVersion: currentSnapshot.scriptVersion,
        certifiedScriptVersion: 0,
        changedDimensions: [],
        details: ["No prior certificate on file."],
        isCertificateInvalidated: false,
        checkedAt: nowStr,
      };
    }

    const changedDimensions: string[] = [];
    const details: string[] = [];
    let impactLevel: ChangeImpactLevel = 'NO_CHANGE';
    let isInvalidated = false;

    // 1. Evidence Snapshot Check (CRITICAL)
    if (currentSnapshot.evidenceSnapshotHash !== certificate.evidenceSnapshotHash) {
      impactLevel = 'CRITICAL';
      changedDimensions.push("EVIDENCE_INTEGRITY", "RESEARCH_INTEGRITY");
      details.push("Research evidence or benchmark findings were updated after certification.");
      isInvalidated = true;
    }

    // 2. Script Version Check (HIGH_IMPACT)
    if (currentSnapshot.scriptVersion !== certificate.scriptVersion) {
      if (impactLevel !== 'CRITICAL') impactLevel = 'HIGH_IMPACT';
      changedDimensions.push("SCRIPT_INTEGRITY");
      details.push(`Active script version changed from v${certificate.scriptVersion} to v${currentSnapshot.scriptVersion}.`);
      isInvalidated = true;
    }

    // 3. Timeline Fingerprint Check (MEDIUM_IMPACT)
    if (currentSnapshot.timelineFingerprint !== certificate.timelineFingerprint) {
      if (impactLevel !== 'CRITICAL' && impactLevel !== 'HIGH_IMPACT') impactLevel = 'MEDIUM_IMPACT';
      changedDimensions.push("PRODUCTION_INTEGRITY", "TIMELINE_INTEGRITY");
      details.push("Production timeline markers or chapter durations were modified.");
    }

    // 4. Asset Count Check (LOW_IMPACT)
    if (currentSnapshot.enabledAssetCount !== certificate.dimensions.productionIntegrity.enabledAssetCount) {
      if (impactLevel === 'NO_CHANGE') impactLevel = 'LOW_IMPACT';
      changedDimensions.push("PRODUCTION_PREFERENCES");
      details.push(`Enabled production assets shifted from ${certificate.dimensions.productionIntegrity.enabledAssetCount} to ${currentSnapshot.enabledAssetCount}.`);
    }

    const hasChanges = currentSnapshot.snapshotHash !== certificate.projectSnapshotHash;

    if (!hasChanges) {
      return {
        hasChanges: false,
        impactLevel: 'NO_CHANGE',
        currentProjectSnapshotHash: currentSnapshot.snapshotHash,
        certifiedProjectSnapshotHash: certificate.projectSnapshotHash,
        currentScriptVersion: currentSnapshot.scriptVersion,
        certifiedScriptVersion: certificate.scriptVersion,
        changedDimensions: [],
        details: ["Current project state exactly matches certified snapshot."],
        isCertificateInvalidated: false,
        checkedAt: nowStr,
      };
    }

    return {
      hasChanges: true,
      impactLevel,
      currentProjectSnapshotHash: currentSnapshot.snapshotHash,
      certifiedProjectSnapshotHash: certificate.projectSnapshotHash,
      currentScriptVersion: currentSnapshot.scriptVersion,
      certifiedScriptVersion: certificate.scriptVersion,
      changedDimensions,
      details,
      isCertificateInvalidated: isInvalidated,
      checkedAt: nowStr,
    };
  }
}
