import {
  CreatorPerformanceSnapshot,
  CreatorLearningInsight,
  SignalConfidence,
} from "./performance.types";
import { PerformanceAuditService } from "./performance-audit.service";

export class CreatorLearningEngine {
  /**
   * Evaluates performance snapshots to extract strategic learning insights with sample-size safeguards.
   */
  static generateInsights(
    snapshots: CreatorPerformanceSnapshot[],
    userId: string = "anonymous-creator"
  ): CreatorLearningInsight[] {
    const insights: CreatorLearningInsight[] = [];
    if (!snapshots || snapshots.length === 0) return insights;

    const totalSnapshots = snapshots.length;
    const totalViews = snapshots.reduce((acc, s) => acc + (s.metrics.views?.value || 0), 0);

    let confidence: SignalConfidence = 'INSUFFICIENT_SAMPLE';
    if (totalSnapshots >= 6 && totalViews >= 10000) {
      confidence = 'HIGH_CONFIDENCE';
    } else if (totalSnapshots >= 2 && totalViews >= 2000) {
      confidence = 'MODERATE_CONFIDENCE';
    } else if (totalViews > 0) {
      confidence = 'LOW_CONFIDENCE';
    }

    // 1. Retention Insight
    const avgRetention = Math.round(
      snapshots.reduce((acc, s) => acc + (s.metrics.averagePercentageViewed?.value || 50), 0) / totalSnapshots
    );

    if (avgRetention >= 60) {
      insights.push({
        insightId: `ins-ret-${Date.now().toString(36)}-1`,
        category: "RETENTION_PATTERN",
        observedSignal: `Strong average retention of ${avgRetention}% across ${totalSnapshots} measured release windows.`,
        dataWindow: "HISTORICAL_RELEASES",
        confidence,
        sampleSize: totalViews,
        causalityType: 'CORRELATED',
        alternativeExplanations: [
          "Direct, evidence-backed narrative structure keeps viewers engaged.",
          "High topic interest for multi-core hardware processor comparisons.",
        ],
        recommendedAction: "Maintain current script sectioning and direct-to-benchmark pacing.",
        requiresFurtherTesting: confidence !== 'HIGH_CONFIDENCE',
        affectedSubsystem: "SCRIPT",
      });
    }

    // 2. CTR / Packaging Insight
    const avgCtr = (
      snapshots.reduce((acc, s) => acc + (s.metrics.ctr?.value || 5.0), 0) / totalSnapshots
    ).toFixed(1);

    insights.push({
      insightId: `ins-ctr-${Date.now().toString(36)}-2`,
      category: "PACKAGING_PERFORMANCE",
      observedSignal: `Average CTR observed at ${avgCtr}% across published releases.`,
      dataWindow: "HISTORICAL_RELEASES",
      confidence,
      sampleSize: totalViews,
      causalityType: 'OBSERVED',
      alternativeExplanations: [
        "Contrast-focused title packaging (e.g. M4 Max vs 9950X) generates steady interest.",
        "Thumbnail imagery highlighting hardware silicon close-ups.",
      ],
      recommendedAction: "Test high-CTR title variations in Publishing Preflight before scheduling.",
      requiresFurtherTesting: true,
      affectedSubsystem: "PUBLISHING",
    });

    // Record audit event
    if (snapshots.length > 0) {
      PerformanceAuditService.recordAuditEvent({
        auditId: `perf-aud-${Date.now().toString(36)}-learn`,
        userId,
        researchRunId: snapshots[0].researchRunId,
        action: 'INSIGHT_GENERATED',
        details: `Generated ${insights.length} learning insights with ${confidence} confidence across ${totalSnapshots} releases.`,
        timestamp: new Date().toISOString(),
      });
    }

    return insights;
  }
}
