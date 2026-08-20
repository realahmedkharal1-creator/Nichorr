import {
  FederationEligibilityState,
  ProjectPrivacyState,
} from "./collective-intelligence.types";

export interface ProjectEligibilityInput {
  researchRunId: string;
  userId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  certificationValid?: boolean;
  releaseLockValid?: boolean;
  blockers?: string[];
  privacyState?: ProjectPrivacyState;
  benchmarkDimensionsCount?: number;
  isStale?: boolean;
}

export interface ProjectEligibilityResult {
  state: FederationEligibilityState;
  reasons: string[];
  blockers: string[];
  isEligible: boolean;
}

export class FederationEligibilityEngine {
  /**
   * Deterministically evaluates whether a research project is eligible for collective federation.
   */
  static evaluateEligibility(input: ProjectEligibilityInput): ProjectEligibilityResult {
    const blockers: string[] = [...(input.blockers || [])];
    const reasons: string[] = [];

    // 1. Privacy restriction check
    if (input.privacyState === "PRIVATE") {
      return {
        state: "PRIVACY_RESTRICTED",
        reasons: ["Project is explicitly configured as PRIVATE. Excluded from collective federation."],
        blockers,
        isEligible: false,
      };
    }

    // 2. Hard Blocker Checks (DO_NOT_SAY, UNBACKED, CONFLICTED)
    const hasCriticalBlocker = blockers.some(
      (b) =>
        b.toUpperCase().includes("DO_NOT_SAY") ||
        b.toUpperCase().includes("UNBACKED") ||
        b.toUpperCase().includes("CONFLICTED") ||
        b.toUpperCase().includes("SNAPSHOT_MISMATCH")
    );

    if (hasCriticalBlocker) {
      return {
        state: "BLOCKED",
        reasons: ["Project is blocked by critical research integrity blockers.", ...blockers],
        blockers,
        isEligible: false,
      };
    }

    // 3. Invalidation checks (Certification / Release Lock)
    if (input.certificationValid === false) {
      blockers.push("CERTIFICATION_INVALIDATED");
      return {
        state: "INVALIDATED",
        reasons: ["Project integrity certificate is invalidated or revoked."],
        blockers,
        isEligible: false,
      };
    }

    if (input.releaseLockValid === false) {
      blockers.push("RELEASE_LOCK_INVALIDATED");
      return {
        state: "INVALIDATED",
        reasons: ["Release lock is invalidated or expired."],
        blockers,
        isEligible: false,
      };
    }

    // 4. Staleness check
    if (input.isStale === true) {
      return {
        state: "STALE",
        reasons: ["Upstream project snapshot or evidence hash has mutated since last calibration."],
        blockers,
        isEligible: false,
      };
    }

    // 5. Benchmark & Evidence completeness check
    const dimCount = input.benchmarkDimensionsCount ?? 0;
    if (dimCount === 0) {
      return {
        state: "INSUFFICIENT_DATA",
        reasons: ["Project contains no normalized benchmark measurements or structured observations."],
        blockers,
        isEligible: false,
      };
    }

    if (dimCount < 5) {
      return {
        state: "ELIGIBLE_WITH_LIMITATIONS",
        reasons: [`Project has limited benchmark coverage (${dimCount} dimensions). Permitted with analytical caveats.`],
        blockers,
        isEligible: true,
      };
    }

    return {
      state: "ELIGIBLE",
      reasons: ["Project satisfies all integrity, certification, and evidence completeness requirements."],
      blockers: [],
      isEligible: true,
    };
  }
}
