import {
  EmpiricalAlignmentRecord,
} from "./co-design.types";

export class CoDesignDivergenceEngine {
  public static summarizeDivergence(alignment: EmpiricalAlignmentRecord): {
    maxMetricDivergencePct: number;
    maxBottleneckDivergenceCategory: string;
    requiresCalibration: boolean;
    validationRecommendation: string;
  } {
    let maxMetricDivergencePct = 0;
    for (const diff of alignment.metricDifferences) {
      if (Math.abs(diff.deltaPercentage) > maxMetricDivergencePct) {
        maxMetricDivergencePct = Math.abs(diff.deltaPercentage);
      }
    }

    let maxBottleneckDivergence = 0;
    let maxBottleneckDivergenceCategory = "NONE";
    for (const b of alignment.bottleneckDivergence) {
      if (Math.abs(b.divergencePct) > maxBottleneckDivergence) {
        maxBottleneckDivergence = Math.abs(b.divergencePct);
        maxBottleneckDivergenceCategory = b.category;
      }
    }

    const requiresCalibration = alignment.alignmentClassification === "DIVERGENT" || alignment.alignmentClassification === "CONFOUNDED";
    const validationRecommendation = requiresCalibration
      ? `Model divergence (${maxMetricDivergencePct.toFixed(1)}%) requires secondary physical testbench parameter sweep.`
      : "Model outputs align within nominal experimental error margins.";

    return {
      maxMetricDivergencePct,
      maxBottleneckDivergenceCategory,
      requiresCalibration,
      validationRecommendation,
    };
  }
}
