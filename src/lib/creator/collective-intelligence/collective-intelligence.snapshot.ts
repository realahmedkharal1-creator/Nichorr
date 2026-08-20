import crypto from "node:crypto";
import {
  CollectiveIntelligenceSnapshot,
  ProjectFederationRecord,
  NormalizedObservation,
  CrossHardwareCorrelationRecord,
  CollectiveResearchOpportunity,
} from "./collective-intelligence.types";

export class CollectiveIntelligenceSnapshotEngine {
  /**
   * Generates a deterministic snapshot of collective intelligence state.
   * Strictly excludes volatile timestamps from hash computation.
   */
  static generateSnapshot(
    researchRunId: string,
    userId: string,
    projects: ProjectFederationRecord[],
    observations: NormalizedObservation[],
    correlations: CrossHardwareCorrelationRecord[],
    opportunities: CollectiveResearchOpportunity[],
    isStale: boolean = false
  ): CollectiveIntelligenceSnapshot {
    const eligibleProjectsCount = projects.filter((p) => p.eligibilityState === "ELIGIBLE" || p.eligibilityState === "ELIGIBLE_WITH_LIMITATIONS").length;

    // Deterministic project fingerprints hash
    const sortedProjectFp = [...projects]
      .map((p) => `${p.federationRecordId}:${p.projectSnapshotHash}:${p.evidenceSnapshotHash}:${p.eligibilityState}:${p.privacyState}`)
      .sort()
      .join("|");
    const projectFingerprintsHash = crypto.createHash("sha256").update(sortedProjectFp).digest("hex").substring(0, 16);

    // Deterministic observation fingerprints hash
    const sortedObsFp = [...observations]
      .map((o) => `${o.observationId}:${o.hardwareFingerprint}:${o.methodologyFingerprint}:${o.measurement.metric}:${o.measurement.value}`)
      .sort()
      .join("|");
    const observationFingerprintsHash = crypto.createHash("sha256").update(sortedObsFp).digest("hex").substring(0, 16);

    const totalContradictions = correlations.reduce((acc, c) => acc + c.contradictionCount, 0);

    const hashPayload = {
      userId,
      researchRunId,
      federatedProjectsCount: projects.length,
      eligibleProjectsCount,
      normalizedObservationsCount: observations.length,
      activeCorrelationsCount: correlations.length,
      contradictionsCount: totalContradictions,
      opportunitiesCount: opportunities.length,
      projectFingerprintsHash,
      observationFingerprintsHash,
      isStale,
    };

    const snapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(hashPayload))
      .digest("hex");

    const snapshotId = `cis-${snapshotHash.substring(0, 12)}`;

    return {
      snapshotId,
      snapshotHash,
      userId,
      researchRunId,
      federatedProjectsCount: projects.length,
      eligibleProjectsCount,
      normalizedObservationsCount: observations.length,
      activeCorrelationsCount: correlations.length,
      contradictionsCount: totalContradictions,
      opportunitiesCount: opportunities.length,
      projectFingerprintsHash,
      observationFingerprintsHash,
      isStale,
      generatedAt: new Date().toISOString(),
    };
  }
}
