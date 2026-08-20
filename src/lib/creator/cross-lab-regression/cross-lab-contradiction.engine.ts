import crypto from "crypto";
import {
  CrossLabSynthesisComparison,
  CrossLabContradictionReport,
} from "./cross-lab-regression.types";

export class CrossLabContradictionEngine {
  public static analyzeContradictions(
    comparisons: CrossLabSynthesisComparison[]
  ): CrossLabContradictionReport[] {
    const reports: CrossLabContradictionReport[] = [];

    for (const comp of comparisons) {
      if (comp.isContradicted || comp.synthesisClassification === "CONTRADICTED") {
        const contradictionId = `clcr-${crypto
          .createHash("sha256")
          .update(comp.comparisonId)
          .digest("hex")
          .slice(0, 16)}`;

        reports.push({
          contradictionId,
          benchmarkSuite: comp.benchmarkSuite,
          labAId: comp.labAId,
          labBId: comp.labBId,
          labAScore: comp.labAScore,
          labBScore: comp.labBScore,
          metricUnit: comp.metricUnit,
          variancePercentage: Math.abs(comp.percentageDelta),
          explanation:
            comp.contradictionExplanation ||
            `Laboratories reported conflicting measurements (${comp.labAScore} vs ${comp.labBScore} ${comp.metricUnit}). Both measurements are preserved for research audit.`,
          confounders: comp.confounders,
          requiresValidation: true,
          surfacedAt: new Date().toISOString(),
        });
      }
    }

    return reports;
  }
}
