import {
  CreatorPerformanceSnapshot,
  PerformanceComparisonReport,
  CausalRelationship,
  CreatorLearningInsight,
} from "./performance.types";

export class PerformanceComparisonEngine {
  /**
   * Compares a current performance snapshot against a baseline snapshot.
   */
  static compareSnapshots(
    current: CreatorPerformanceSnapshot,
    baseline?: CreatorPerformanceSnapshot
  ): PerformanceComparisonReport {
    const metricDeltas: PerformanceComparisonReport['metricDeltas'] = {};
    const keyObservations: string[] = [];
    const generatedInsights: CreatorLearningInsight[] = [];
    const nowStr = new Date().toISOString();

    const metricKeys = ["views", "averagePercentageViewed", "ctr", "watchTimeHours", "likes", "comments"];

    for (const key of metricKeys) {
      const currentItem = current.metrics[key];
      const baselineItem = baseline?.metrics[key];

      if (currentItem && currentItem.availability === 'AVAILABLE') {
        const curVal = currentItem.value;
        const baseVal = (baselineItem && baselineItem.availability === 'AVAILABLE') ? baselineItem.value : curVal;
        const changePercent = baseVal !== 0 ? Math.round(((curVal - baseVal) / baseVal) * 100) : 0;

        let causality: CausalRelationship = 'OBSERVED';
        if (!baseline) {
          causality = 'INSUFFICIENT_DATA';
        } else if (Math.abs(changePercent) > 15) {
          causality = 'CORRELATED';
        }

        metricDeltas[key] = {
          current: curVal,
          baseline: baseVal,
          changePercent,
          causality,
        };

        if (baseline && changePercent !== 0) {
          keyObservations.push(
            `${key.toUpperCase()} changed by ${changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`} compared to baseline.`
          );
        }
      }
    }

    // Generate correlated learning insight if retention is strong or weak
    const retentionDelta = metricDeltas["averagePercentageViewed"];
    if (retentionDelta && baseline) {
      if (retentionDelta.changePercent > 10) {
        generatedInsights.push({
          insightId: `ins-ret-pos-${Date.now().toString(36)}`,
          category: "AUDIENCE_RETENTION",
          observedSignal: `Average percentage viewed increased by +${retentionDelta.changePercent}% vs baseline.`,
          dataWindow: current.measurementWindow,
          confidence: 'MODERATE_CONFIDENCE',
          sampleSize: current.metrics.views?.value || 1,
          causalityType: 'CORRELATED',
          alternativeExplanations: [
            "Pacing and concise benchmark cards may have reduced viewer drop-off.",
            "Higher initial audience affinity for this specific processor comparison topic.",
          ],
          recommendedAction: "Maintain structured benchmark comparison format in future reviews.",
          requiresFurtherTesting: true,
          affectedSubsystem: "SCRIPT",
        });
      } else if (retentionDelta.changePercent < -15) {
        generatedInsights.push({
          insightId: `ins-ret-neg-${Date.now().toString(36)}`,
          category: "AUDIENCE_DROP_OFF",
          observedSignal: `Average percentage viewed declined by ${retentionDelta.changePercent}% vs baseline.`,
          dataWindow: current.measurementWindow,
          confidence: 'MODERATE_CONFIDENCE',
          sampleSize: current.metrics.views?.value || 1,
          causalityType: 'POSSIBLE_CONTRIBUTOR',
          alternativeExplanations: [
            "Extended introduction or methodology explanation before the first benchmark score.",
            "Algorithm traffic distribution to broader, less technical audience segment.",
          ],
          recommendedAction: "Test moving primary Geekbench benchmark card earlier in the script outline.",
          requiresFurtherTesting: true,
          affectedSubsystem: "SCRIPT",
        });
      }
    }

    const comparisonId = `pcomp-${current.snapshotId}-${baseline ? baseline.snapshotId : "single"}`;

    return {
      comparisonId,
      currentSnapshotId: current.snapshotId,
      baselineSnapshotId: baseline?.snapshotId,
      measurementWindow: current.measurementWindow,
      metricDeltas,
      keyObservations,
      generatedInsights,
      generatedAt: nowStr,
    };
  }
}
