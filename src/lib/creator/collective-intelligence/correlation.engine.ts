import crypto from "node:crypto";
import {
  NormalizedObservation,
  ProjectFederationRecord,
  CrossHardwareCorrelationRecord,
  ContradictionRecord,
  CorrelationState,
  CollectiveConfidenceLevel,
  MethodologyComparabilityState,
} from "./collective-intelligence.types";
import { MethodologyAlignmentEngine } from "./methodology.engine";
import { IndependenceDetectionEngine } from "./independence.engine";
import { ContradictionDetectionEngine } from "./contradiction.engine";

export class CrossHardwareCorrelationEngine {
  /**
   * Deterministically computes cross-hardware correlations across a set of federated projects and observations.
   */
  static computeCorrelations(
    projects: ProjectFederationRecord[],
    observations: NormalizedObservation[]
  ): CrossHardwareCorrelationRecord[] {
    const correlations: CrossHardwareCorrelationRecord[] = [];

    // Filter eligible projects
    const eligibleProjectMap = new Map<string, ProjectFederationRecord>();
    const excludedProjects: Array<{ projectId: string; reason: string }> = [];

    for (const p of projects) {
      if (p.eligibilityState === "ELIGIBLE" || p.eligibilityState === "ELIGIBLE_WITH_LIMITATIONS") {
        eligibleProjectMap.set(p.federationRecordId, p);
      } else {
        excludedProjects.push({
          projectId: p.federationRecordId,
          reason: `Project excluded due to state: ${p.eligibilityState} (${p.blockers.join(", ") || "Eligibility check"})`,
        });
      }
    }

    // Filter observations from eligible projects
    const eligibleObservations: NormalizedObservation[] = [];
    const excludedObservations: Array<{ obsId: string; reason: string }> = [];

    for (const obs of observations) {
      if (eligibleProjectMap.has(obs.federationRecordId)) {
        eligibleObservations.push(obs);
      } else {
        excludedObservations.push({
          obsId: obs.observationId,
          reason: `Observation excluded because parent project ${obs.federationRecordId} is not eligible.`,
        });
      }
    }

    // Group observations by benchmarkSuite
    const suiteMap = new Map<string, NormalizedObservation[]>();
    for (const obs of eligibleObservations) {
      const suite = obs.software.benchmarkSuite.toLowerCase().trim();
      const list = suiteMap.get(suite) || [];
      list.push(obs);
      suiteMap.set(suite, list);
    }

    // For each benchmark suite, analyze pairs of distinct hardware models
    for (const [suite, obsList] of suiteMap.entries()) {
      const hwModels = Array.from(new Set(obsList.map((o) => o.hardware.exactModel)));

      for (let i = 0; i < hwModels.length; i++) {
        for (let j = i + 1; j < hwModels.length; j++) {
          const hwA = hwModels[i];
          const hwB = hwModels[j];

          const obsA = obsList.filter((o) => o.hardware.exactModel === hwA);
          const obsB = obsList.filter((o) => o.hardware.exactModel === hwB);

          if (obsA.length === 0 || obsB.length === 0) continue;

          const correlationId = `cor-${crypto
            .createHash("sha256")
            .update(`${hwA}:${hwB}:${suite}`)
            .digest("hex")
            .substring(0, 12)}`;

          // Analyze methodology alignment and find comparable pairs
          let comparableObsCount = 0;
          let overallAlignment: MethodologyComparabilityState = "DIRECTLY_COMPARABLE";
          const contributingProjectIds = new Set<string>();
          const contributingObservationIds = new Set<string>();
          const localExcludedObsIds: string[] = [];
          const exclusionReasons: Record<string, string> = {};
          const contradictions: ContradictionRecord[] = [];
          const confounders: string[] = [];

          let sumDeltas = 0;
          let validComparisons = 0;

          for (const a of obsA) {
            for (const b of obsB) {
              const align = MethodologyAlignmentEngine.alignObservations(a, b);
              if (align.alignmentState === "NOT_COMPARABLE") {
                localExcludedObsIds.push(`${a.observationId}-${b.observationId}`);
                exclusionReasons[`${a.observationId}-${b.observationId}`] = align.explanation;
                overallAlignment = "PARTIALLY_COMPARABLE";
                continue;
              }

              if (align.alignmentState === "COMPARABLE_WITH_CAVEATS") {
                overallAlignment = "COMPARABLE_WITH_CAVEATS";
                confounders.push(...align.dimensionDifferences);
              }

              comparableObsCount++;
              contributingProjectIds.add(a.federationRecordId);
              contributingProjectIds.add(b.federationRecordId);
              contributingObservationIds.add(a.observationId);
              contributingObservationIds.add(b.observationId);

              const valA = a.measurement.value;
              const valB = b.measurement.value;
              if (valA > 0 && valB > 0) {
                const delta = ((valA - valB) / valB) * 100;
                sumDeltas += delta;
                validComparisons++;
              }

              // Check contradictions
              const contra = ContradictionDetectionEngine.detectContradiction(a, b, correlationId, 15);
              if (contra) {
                contradictions.push(contra);
              }
            }
          }

          const avgDelta = validComparisons > 0 ? Number((sumDeltas / validComparisons).toFixed(1)) : 0;
          const totalObs = obsA.length + obsB.length;
          const independentProjectsCount = contributingProjectIds.size;
          const independentSourcesCount = new Set([
            ...obsA.map((o) => o.measurement.sourcePublisher),
            ...obsB.map((o) => o.measurement.sourcePublisher),
          ]).size;

          // Deduplicate confounders
          const uniqueConfounders = Array.from(new Set(confounders));

          // Determine Correlation State and Confidence Level conservatively
          let correlationState: CorrelationState = "NO_RELATIONSHIP";
          let confidenceLevel: CollectiveConfidenceLevel = "LOW";

          if (independentProjectsCount < 2 || comparableObsCount < 2) {
            correlationState = "INSUFFICIENT_DATA";
            confidenceLevel = "VERY_LOW";
          } else if (contradictions.length > 0) {
            correlationState = "CONTRADICTED";
            confidenceLevel = "LOW";
          } else if (uniqueConfounders.length >= 3) {
            correlationState = "CONFOUNDED";
            confidenceLevel = "LOW";
          } else if (independentProjectsCount >= 3 && comparableObsCount >= 4) {
            correlationState = "STRONG_ASSOCIATION";
            confidenceLevel = "HIGH";
          } else if (independentProjectsCount >= 2) {
            correlationState = "REPEATED_ASSOCIATION";
            confidenceLevel = "MODERATE";
          } else {
            correlationState = "POSSIBLE_ASSOCIATION";
            confidenceLevel = "LOW";
          }

          const record: CrossHardwareCorrelationRecord = {
            correlationId,
            hardwareA: hwA,
            hardwareB: hwB,
            benchmarkSuite: obsA[0].software.benchmarkSuite,
            metric: obsA[0].measurement.metric,
            observedDeltaPercentage: avgDelta,
            totalObservationsCount: totalObs,
            comparableObservationsCount: comparableObsCount,
            independentProjectsCount,
            independentSourcesCount,
            correlationState,
            confidenceLevel,
            methodologyAlignment: overallAlignment,
            contradictionCount: contradictions.length,
            contradictions,
            confounders: uniqueConfounders,
            contributingProjectIds: Array.from(contributingProjectIds),
            contributingObservationIds: Array.from(contributingObservationIds),
            excludedProjectIds: excludedProjects.map((p) => p.projectId),
            excludedObservationIds: Array.from(new Set(localExcludedObsIds)),
            exclusionReasons,
            provenanceChain: [
              `Hardware A: ${hwA}`,
              `Hardware B: ${hwB}`,
              `Benchmark Suite: ${obsA[0].software.benchmarkSuite}`,
              `Contributing Projects: ${independentProjectsCount}`,
              `Correlation State: ${correlationState}`,
              `Confidence: ${confidenceLevel}`,
            ],
            isStale: false,
            computedAt: new Date().toISOString(),
          };

          correlations.push(record);
        }
      }
    }

    return correlations;
  }
}
