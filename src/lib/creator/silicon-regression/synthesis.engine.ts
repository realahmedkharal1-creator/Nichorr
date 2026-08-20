import crypto from "node:crypto";
import {
  SiliconRegressionMatrix,
  BenchmarkSynthesisRecord,
  EmpiricalSynthesisReport,
  RegressionState,
} from "./silicon-regression.types";

export class EmpiricalBenchmarkSynthesisEngine {
  /**
   * Generates a comprehensive empirical synthesis report from the regression matrix.
   */
  static synthesize(
    matrix: SiliconRegressionMatrix,
    researchRunId: string,
    userId: string
  ): EmpiricalSynthesisReport {
    const synthesisRecords: BenchmarkSynthesisRecord[] = [];

    // Group pairs by (architectureA, architectureB, generationA, generationB, benchmarkSuite)
    const groupMap = new Map<string, typeof matrix.pairs>();
    for (const pair of matrix.pairs) {
      const archA = pair.baselineObservation.architecture;
      const archB = pair.candidateObservation.architecture;
      const genA = pair.baselineObservation.generation;
      const genB = pair.candidateObservation.generation;
      const suite = pair.baselineObservation.benchmarkSuite;

      const key = `${archA}:${archB}:${genA}:${genB}:${suite}`;
      const list = groupMap.get(key) || [];
      list.push(pair);
      groupMap.set(key, list);
    }

    for (const [key, pairs] of groupMap.entries()) {
      if (pairs.length === 0) continue;

      const first = pairs[0];
      const archA = first.baselineObservation.architecture;
      const archB = first.candidateObservation.architecture;
      const genA = first.baselineObservation.generation;
      const genB = first.candidateObservation.generation;
      const suite = first.baselineObservation.benchmarkSuite;

      const baselineScores = pairs.map((p) => p.baselineObservation.measuredScore);
      const candidateScores = pairs.map((p) => p.candidateObservation.measuredScore);

      const avgBase = Number(
        (baselineScores.reduce((a, b) => a + b, 0) / baselineScores.length).toFixed(1)
      );
      const avgCand = Number(
        (candidateScores.reduce((a, b) => a + b, 0) / candidateScores.length).toFixed(1)
      );

      const delta = avgBase > 0 ? Number((((avgCand - avgBase) / avgBase) * 100).toFixed(1)) : 0;

      let direction: BenchmarkSynthesisRecord["direction"] = "PARITY";
      if (delta > 3) direction = "IMPROVEMENT";
      else if (delta < -3) direction = "REGRESSION";

      const hasRegression = pairs.some((p) => p.percentageDelta < -3);
      const hasImprovement = pairs.some((p) => p.percentageDelta > 3);
      if (hasRegression && hasImprovement) {
        direction = "MIXED";
      }

      const contradictionCount = pairs.filter((p) => p.regressionState === "CONTRADICTED").length;
      const confidenceLimitations: string[] = [];
      if (pairs.length < 2) {
        confidenceLimitations.push("Limited sample size (< 2 comparable observation pairs).");
      }
      if (pairs.some((p) => p.regressionState === "CONFOUNDED")) {
        confidenceLimitations.push("Multi-variable configuration differences detected across tests.");
      }

      const candidateExplanations = Array.from(
        new Set(pairs.flatMap((p) => p.causeCandidates.map((c) => `${c.category} (${c.dimension})`)))
      );

      let synthesisState: RegressionState = "NO_REGRESSION";
      if (direction === "REGRESSION") synthesisState = "CONFIRMED_EMPIRICAL_REGRESSION";
      else if (direction === "IMPROVEMENT") synthesisState = "IMPROVEMENT";
      else if (direction === "MIXED") synthesisState = "CONFOUNDED";

      const synthesisId = `syn-${crypto
        .createHash("sha256")
        .update(`${key}:${pairs.length}`)
        .digest("hex")
        .substring(0, 10)}`;

      synthesisRecords.push({
        synthesisId,
        architectureA: archA,
        architectureB: archB,
        generationA: genA,
        generationB: genB,
        benchmarkSuite: suite,
        baselineAverageScore: avgBase,
        candidateAverageScore: avgCand,
        observedDeltaPercentage: delta,
        direction,
        comparableObservationCount: pairs.length,
        independentProjectCount: new Set(pairs.map((p) => p.candidateObservation.sourcePublisher)).size,
        contradictionCount,
        confidenceLimitations,
        candidateExplanations,
        synthesisState,
        synthesizedAt: new Date().toISOString(),
      });
    }

    const reportId = `esr-${researchRunId}-${Date.now().toString(36)}`;
    const summary = `Empirical Benchmark Synthesis synthesized ${synthesisRecords.length} architecture/generation benchmark comparisons across ${matrix.pairs.length} observation pairs.`;

    return {
      reportId,
      researchRunId,
      userId,
      matrixId: matrix.matrixId,
      synthesisRecords,
      activeRegressionsCount: matrix.detectedRegressionsCount,
      activeImprovementsCount: matrix.detectedImprovementsCount,
      confoundedCount: matrix.confoundedCount,
      contradictedCount: matrix.contradictedCount,
      summary,
      evidenceBoundary:
        "EPISTEMIC BOUNDARY: Empirical benchmark synthesis aggregates measured observations. Statistical associations do NOT automatically constitute verified causal claims without controlled laboratory research validation.",
      generatedAt: new Date().toISOString(),
    };
  }
}
