import crypto from "crypto";
import {
  CrossLabSynthesisComparison,
  CrossLabLineageTrace,
  CrossLabLineageLink,
  VerifiedResearchLedgerEntry,
} from "./cross-lab-regression.types";

export class CrossLabLineageEngine {
  public static generateComparisonTrace(
    comp: CrossLabSynthesisComparison,
    ledgerEntry?: VerifiedResearchLedgerEntry
  ): CrossLabLineageTrace {
    const lineageId = `clrt-${crypto
      .createHash("sha256")
      .update(comp.comparisonId)
      .digest("hex")
      .slice(0, 16)}`;

    const stages: CrossLabLineageLink[] = [
      {
        stage: "Stage 1 — Source Measurement",
        title: "Physical Laboratory Benchmark Measurements",
        detail: `Captured empirical scores from ${comp.labAId} (${comp.labAScore} ${comp.metricUnit}) and ${comp.labBId} (${comp.labBScore} ${comp.metricUnit}) under benchmark ${comp.benchmarkSuite}.`,
        status: "VERIFIED",
        metadata: {
          labA: comp.labAId,
          labB: comp.labBId,
          benchmark: comp.benchmarkSuite,
        },
      },
      {
        stage: "Stage 2 — Normalization",
        title: "Canonical Metric Alignment",
        detail: `Normalized measurement units to canonical ${comp.metricType} and computed delta of ${comp.percentageDelta}% (${comp.absoluteDelta} ${comp.metricUnit}).`,
        status: "EVALUATED",
        metadata: {
          metricType: comp.metricType,
          deltaPercentage: comp.percentageDelta,
        },
      },
      {
        stage: "Stage 3 — Comparability & Independence",
        title: "Methodology Compatibility & Independence Verification",
        detail: `Methodology compatibility classified as '${comp.methodologyCompatibility}'. Confounders: ${comp.confounders.length > 0 ? comp.confounders.join(", ") : "None"}.`,
        status: comp.methodologyCompatibility === "IDENTICAL" || comp.methodologyCompatibility === "COMPARABLE" ? "VERIFIED" : "CONFOUNDED",
        metadata: {
          compatibility: comp.methodologyCompatibility,
          confoundersCount: comp.confounders.length,
        },
      },
      {
        stage: "Stage 4 — Empirical Synthesis",
        title: "Cross-Laboratory Differential Matrix Synthesis",
        detail: `Synthesized cross-laboratory classification as '${comp.synthesisClassification}'. Non-causal default enforced (isCausallyEstablished: false).`,
        status: comp.isContradicted ? "CONFOUNDED" : "VERIFIED",
        metadata: {
          synthesisClassification: comp.synthesisClassification,
          isContradicted: comp.isContradicted,
        },
      },
      {
        stage: "Stage 5 — Research Validation",
        title: "Phase 86 Research Calibration Queue Bridge",
        detail: ledgerEntry
          ? `Validated under Research Task ${ledgerEntry.validationTaskId} with confidence ${ledgerEntry.confidence}%.`
          : "Surfaced as structured research opportunity; awaiting creator validation review.",
        status: ledgerEntry ? "VERIFIED" : "EVALUATED",
        metadata: {
          validationTaskId: ledgerEntry?.validationTaskId,
        },
      },
      {
        stage: "Stage 6 — Verified Research Ledger Decision",
        title: "Consolidation to Verified Research Ledger",
        detail: ledgerEntry
          ? `Formally consolidated into Verified Research Ledger (Entry: ${ledgerEntry.ledgerEntryId}, Hash: ${ledgerEntry.ledgerSnapshotHash.slice(0, 12)}...).`
          : "Not yet promoted to Verified Research Ledger (requires explicit research validation).",
        status: ledgerEntry ? "VERIFIED" : "EVALUATED",
        metadata: {
          ledgerEntryId: ledgerEntry?.ledgerEntryId,
        },
      },
    ];

    const exclusions = comp.confounders.length > 0
      ? comp.confounders.map((c) => `Excluded from direct causal comparison: ${c}`)
      : [];

    return {
      lineageId,
      comparisonOrEntryId: comp.comparisonId,
      researchRunId: comp.researchRunId,
      userId: comp.userId,
      stages,
      exclusions,
      generatedAt: new Date().toISOString(),
    };
  }
}
