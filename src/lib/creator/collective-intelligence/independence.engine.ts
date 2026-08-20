import {
  NormalizedObservation,
  ProjectFederationRecord,
  IndependenceDeterminationReport,
  SourceIndependenceState,
} from "./collective-intelligence.types";

export class IndependenceDetectionEngine {
  /**
   * Evaluates the empirical independence between two federated projects.
   */
  static evaluateProjectIndependence(
    projA: ProjectFederationRecord,
    projB: ProjectFederationRecord
  ): IndependenceDeterminationReport {
    // 1. Same research run or identical project snapshot hash -> DUPLICATE
    if (projA.researchRunId === projB.researchRunId) {
      return {
        state: "DUPLICATE",
        duplicateOfRecordId: projA.federationRecordId,
        sharedSources: ["Same Research Run"],
        reasoning: "Projects share the identical research run ID.",
      };
    }

    if (projA.projectSnapshotHash === projB.projectSnapshotHash && projA.projectSnapshotHash !== "default") {
      return {
        state: "DUPLICATE",
        duplicateOfRecordId: projA.federationRecordId,
        sharedSources: ["Identical Project Snapshot Hash"],
        reasoning: "Projects share identical project snapshot hashes (copy-derived project graph).",
      };
    }

    // 2. Same evidence snapshot hash -> DEPENDENT
    if (projA.evidenceSnapshotHash === projB.evidenceSnapshotHash && projA.evidenceSnapshotHash !== "snap-evidence-unknown") {
      return {
        state: "DEPENDENT",
        duplicateOfRecordId: undefined,
        sharedSources: [`Shared Evidence Snapshot: ${projA.evidenceSnapshotHash}`],
        reasoning: "Projects rely on identical evidence snapshot hashes and cannot be treated as separate independent empirical samples.",
      };
    }

    // 3. Different users and different evidence sources -> INDEPENDENT
    if (projA.userId !== projB.userId) {
      return {
        state: "INDEPENDENT",
        sharedSources: [],
        reasoning: "Projects are authored by separate creators with distinct evidence snapshot lineages.",
      };
    }

    // 4. Same user, different runs and different evidence -> LIKELY_INDEPENDENT
    return {
      state: "LIKELY_INDEPENDENT",
      sharedSources: [],
      reasoning: "Projects originate from distinct research runs under the same creator workspace.",
    };
  }

  /**
   * Evaluates the empirical independence between two normalized observations.
   */
  static evaluateObservationIndependence(
    obsA: NormalizedObservation,
    obsB: NormalizedObservation
  ): IndependenceDeterminationReport {
    // 1. Identical observation ID -> DUPLICATE
    if (obsA.observationId === obsB.observationId) {
      return {
        state: "DUPLICATE",
        duplicateOfRecordId: obsA.observationId,
        sharedSources: ["Identical Observation ID"],
        reasoning: "Identical observation instance.",
      };
    }

    // 2. Same publisher and same evidence snapshot hash -> DEPENDENT
    if (
      obsA.measurement.sourcePublisher === obsB.measurement.sourcePublisher &&
      obsA.measurement.evidenceSnapshotHash === obsB.measurement.evidenceSnapshotHash &&
      obsA.measurement.evidenceSnapshotHash !== "snap-evidence-unknown"
    ) {
      return {
        state: "DEPENDENT",
        sharedSources: [obsA.measurement.sourcePublisher, obsA.measurement.evidenceSnapshotHash],
        reasoning: "Observations share the identical source publisher and evidence snapshot.",
      };
    }

    // 3. Different publishers or different research runs -> INDEPENDENT
    if (obsA.measurement.sourcePublisher !== obsB.measurement.sourcePublisher) {
      return {
        state: "INDEPENDENT",
        sharedSources: [],
        reasoning: "Observations originate from distinct primary lab publishers and evidence captures.",
      };
    }

    return {
      state: "LIKELY_INDEPENDENT",
      sharedSources: [obsA.measurement.sourcePublisher],
      reasoning: "Observations are from separate test runs under compatible source attribution.",
    };
  }
}
