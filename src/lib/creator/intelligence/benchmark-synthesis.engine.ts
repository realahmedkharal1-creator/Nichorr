import {
  BenchmarkSpecification,
  BenchmarkComparisonPair,
  BenchmarkComparabilityState,
  CrossProjectSynthesisReport,
} from "./intelligence.types";
import { IntelligenceAuditService } from "./intelligence-audit.service";

export class BenchmarkSynthesisEngine {
  /**
   * Compares two benchmark specifications and strictly evaluates their comparability.
   */
  static compareBenchmarks(
    benchmarkA: BenchmarkSpecification,
    benchmarkB: BenchmarkSpecification
  ): BenchmarkComparisonPair {
    const methodologyDifferences: string[] = [];
    const warnings: string[] = [];

    // 1. Suite & Metric Check
    const suiteA = (benchmarkA.benchmarkName || "").toLowerCase().trim();
    const suiteB = (benchmarkB.benchmarkName || "").toLowerCase().trim();
    const unitA = (benchmarkA.metricUnit || "").toLowerCase().trim();
    const unitB = (benchmarkB.metricUnit || "").toLowerCase().trim();

    if (suiteA !== suiteB) {
      methodologyDifferences.push(`Incompatible benchmark suites: "${benchmarkA.benchmarkName}" vs "${benchmarkB.benchmarkName}"`);
    }

    if (unitA !== unitB) {
      methodologyDifferences.push(`Incompatible metric units: "${benchmarkA.metricUnit}" vs "${benchmarkB.metricUnit}"`);
    }

    // 2. Version Check
    if (benchmarkA.version && benchmarkB.version && benchmarkA.version !== benchmarkB.version) {
      methodologyDifferences.push(`Version mismatch: v${benchmarkA.version} vs v${benchmarkB.version}`);
    }

    // 3. Resolution Check
    if (benchmarkA.resolution && benchmarkB.resolution && benchmarkA.resolution !== benchmarkB.resolution) {
      methodologyDifferences.push(`Resolution mismatch: ${benchmarkA.resolution} vs ${benchmarkB.resolution}`);
    }

    // 4. Quality Preset Check
    if (benchmarkA.preset && benchmarkB.preset && benchmarkA.preset !== benchmarkB.preset) {
      methodologyDifferences.push(`Quality preset mismatch: ${benchmarkA.preset} vs ${benchmarkB.preset}`);
    }

    // 5. Rendering API Check
    if (benchmarkA.renderingApi && benchmarkB.renderingApi && benchmarkA.renderingApi !== benchmarkB.renderingApi) {
      methodologyDifferences.push(`Rendering API mismatch: ${benchmarkA.renderingApi} vs ${benchmarkB.renderingApi}`);
    }

    // 6. Upscaling Mode Check
    if (benchmarkA.upscalingMode && benchmarkB.upscalingMode && benchmarkA.upscalingMode !== benchmarkB.upscalingMode) {
      methodologyDifferences.push(`Upscaling mode mismatch: ${benchmarkA.upscalingMode} vs ${benchmarkB.upscalingMode}`);
    }

    // 7. Ray Tracing Check
    if (benchmarkA.rayTracing !== undefined && benchmarkB.rayTracing !== undefined && benchmarkA.rayTracing !== benchmarkB.rayTracing) {
      methodologyDifferences.push(`Ray tracing configuration differs: RT ${benchmarkA.rayTracing ? "ON" : "OFF"} vs RT ${benchmarkB.rayTracing ? "ON" : "OFF"}`);
    }

    // 8. Power Limit Check
    if (benchmarkA.powerLimitWatts && benchmarkB.powerLimitWatts && Math.abs(benchmarkA.powerLimitWatts - benchmarkB.powerLimitWatts) > 10) {
      warnings.push(`Package power limit discrepancy: ${benchmarkA.powerLimitWatts}W vs ${benchmarkB.powerLimitWatts}W`);
    }

    // Determine Comparability State
    let comparabilityState: BenchmarkComparabilityState = "DIRECTLY_COMPARABLE";
    let confidence: BenchmarkComparisonPair["confidence"] = "HIGH";

    if (suiteA !== suiteB || unitA !== unitB) {
      comparabilityState = "NOT_COMPARABLE";
      confidence = "INSUFFICIENT";
    } else if (methodologyDifferences.some(d => d.includes("Resolution mismatch") || d.includes("preset mismatch") || d.includes("Rendering API"))) {
      comparabilityState = "PARTIALLY_COMPARABLE";
      confidence = "LOW";
    } else if (methodologyDifferences.length > 0 || warnings.length > 0) {
      comparabilityState = "COMPARABLE_WITH_CAVEATS";
      confidence = "MODERATE";
    }

    // Check for conflict (same methodology but vastly diverging scores from different reviewers)
    const scoreA = benchmarkA.score;
    const scoreB = benchmarkB.score;
    const deltaPercent = scoreA !== 0 ? Math.round(((scoreB - scoreA) / scoreA) * 100) : 0;

    if (comparabilityState === "DIRECTLY_COMPARABLE" && Math.abs(deltaPercent) > 25 && benchmarkA.sourcePublisher !== benchmarkB.sourcePublisher) {
      comparabilityState = "CONFLICTED";
      warnings.push(`Unexplained ${Math.abs(deltaPercent)}% variance between ${benchmarkA.sourcePublisher} and ${benchmarkB.sourcePublisher} under identical methodology.`);
    }

    let explanation = `${benchmarkB.entityName} scored ${scoreB} ${benchmarkB.metricUnit} vs ${benchmarkA.entityName} (${scoreA} ${benchmarkA.metricUnit}) [Delta: ${deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`}].`;
    if (comparabilityState !== "DIRECTLY_COMPARABLE") {
      explanation += ` Comparability: ${comparabilityState}. Methodology differences noted.`;
    }

    const pairId = `bcp-${benchmarkA.entityName.replace(/\s+/g, "_")}-${benchmarkB.entityName.replace(/\s+/g, "_")}-${Date.now().toString(36)}`;

    return {
      pairId,
      benchmarkA,
      benchmarkB,
      comparabilityState,
      scoreDeltaPercent: deltaPercent,
      explanation,
      methodologyDifferences,
      warnings,
      confidence,
    };
  }

  /**
   * Performs cross-project benchmark synthesis across multiple projects belonging to the same user.
   */
  static synthesizeCrossProjectBenchmarks(
    userId: string,
    primaryRunId: string,
    primaryBenchmarks: BenchmarkSpecification[],
    comparedRunIds: string[],
    comparedBenchmarksMap: Record<string, BenchmarkSpecification[]>
  ): CrossProjectSynthesisReport {
    const comparisonPairs: BenchmarkComparisonPair[] = [];
    const keySynthesizedInsights: string[] = [];
    const researchOpportunitiesGenerated: string[] = [];

    for (const pBench of primaryBenchmarks) {
      for (const compRunId of comparedRunIds) {
        const compList = comparedBenchmarksMap[compRunId] || [];
        for (const cBench of compList) {
          if (
            (pBench.benchmarkName || "").toLowerCase().trim() === (cBench.benchmarkName || "").toLowerCase().trim()
          ) {
            const pair = this.compareBenchmarks(pBench, cBench);
            comparisonPairs.push(pair);

            if (pair.comparabilityState === "DIRECTLY_COMPARABLE") {
              keySynthesizedInsights.push(
                `Directly comparable ${pair.benchmarkA.benchmarkName} data synthesized: ${pair.benchmarkB.entityName} demonstrates ${pair.scoreDeltaPercent > 0 ? `+${pair.scoreDeltaPercent}%` : `${pair.scoreDeltaPercent}%`} relative to ${pair.benchmarkA.entityName}.`
              );
            } else if (pair.comparabilityState === "CONFLICTED") {
              researchOpportunitiesGenerated.push(
                `Resolve methodology discrepancy in ${pair.benchmarkA.benchmarkName} between ${pair.benchmarkA.sourcePublisher} and ${pair.benchmarkB.sourcePublisher}.`
              );
            }
          }
        }
      }
    }

    const alignedMethodologiesCount = comparisonPairs.filter(p => p.comparabilityState === "DIRECTLY_COMPARABLE").length;
    const incompatibleCount = comparisonPairs.filter(p => p.comparabilityState === "NOT_COMPARABLE" || p.comparabilityState === "PARTIALLY_COMPARABLE").length;
    const nowStr = new Date().toISOString();
    const synthesisId = `syn-${primaryRunId}-${Date.now().toString(36)}`;

    const report: CrossProjectSynthesisReport = {
      synthesisId,
      userId,
      primaryRunId,
      comparedRunIds,
      comparisonPairs,
      alignedMethodologiesCount,
      incompatibleCount,
      keySynthesizedInsights,
      researchOpportunitiesGenerated,
      generatedAt: nowStr,
    };

    IntelligenceAuditService.recordAuditEvent({
      auditId: `intel-aud-${Date.now().toString(36)}-syn`,
      userId,
      researchRunId: primaryRunId,
      action: "BENCHMARK_SYNTHESIZED",
      details: `Synthesized ${comparisonPairs.length} benchmark pairs across ${comparedRunIds.length} projects (${alignedMethodologiesCount} directly aligned).`,
      timestamp: nowStr,
    });

    return report;
  }
}
