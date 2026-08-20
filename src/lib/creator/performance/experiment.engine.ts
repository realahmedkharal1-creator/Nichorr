import {
  CreatorExperimentRecord,
  ExperimentConclusionState,
  SignalConfidence,
} from "./performance.types";
import { PerformanceAuditService } from "./performance-audit.service";

export class ExperimentEngine {
  /**
   * Creates a structured creator content experiment record.
   */
  static createExperiment(
    researchRunId: string,
    hypothesis: string,
    variable: string,
    control: string,
    variant: string,
    primaryMetric: string,
    measurementWindow: string = "FIRST_48_HOURS",
    userId: string = "anonymous-creator"
  ): CreatorExperimentRecord {
    const nowStr = new Date().toISOString();
    const experimentId = `exp-${researchRunId}-${Date.now().toString(36)}`;

    const experiment: CreatorExperimentRecord = {
      experimentId,
      userId,
      researchRunId,
      hypothesis,
      variable,
      control,
      variant,
      primaryMetric,
      measurementWindow,
      sampleSize: 0,
      resultSummary: "Experiment initialized. Awaiting release measurement window.",
      confidence: 'INSUFFICIENT_SAMPLE',
      conclusionState: 'INSUFFICIENT_DATA',
      status: 'PLANNED',
      createdAt: nowStr,
    };

    PerformanceAuditService.recordAuditEvent({
      auditId: `perf-aud-${Date.now().toString(36)}-exp-init`,
      userId,
      researchRunId,
      action: 'EXPERIMENT_CREATED',
      details: `Created experiment [${variable}]: "${hypothesis}". Control: "${control.slice(0, 30)}", Variant: "${variant.slice(0, 30)}"`,
      timestamp: nowStr,
    });

    return experiment;
  }

  /**
   * Evaluates an experiment with observed performance data.
   */
  static evaluateExperiment(
    experiment: CreatorExperimentRecord,
    controlMetricValue: number,
    variantMetricValue: number,
    sampleSize: number
  ): CreatorExperimentRecord {
    experiment.sampleSize = sampleSize;

    if (sampleSize < 100) {
      experiment.confidence = 'INSUFFICIENT_SAMPLE';
      experiment.conclusionState = 'INSUFFICIENT_DATA';
      experiment.resultSummary = `Sample size (${sampleSize}) is too small to draw conclusions.`;
      experiment.status = 'RUNNING';
      return experiment;
    }

    const deltaPercent = controlMetricValue !== 0
      ? Math.round(((variantMetricValue - controlMetricValue) / controlMetricValue) * 100)
      : 0;

    let confidence: SignalConfidence = 'LOW_CONFIDENCE';
    if (sampleSize >= 5000) {
      confidence = 'HIGH_CONFIDENCE';
    } else if (sampleSize >= 1000) {
      confidence = 'MODERATE_CONFIDENCE';
    }

    let conclusionState: ExperimentConclusionState = 'INCONCLUSIVE';
    if (deltaPercent > 10) {
      conclusionState = confidence === 'HIGH_CONFIDENCE' ? 'SUPPORTED' : 'PROMISING';
    } else if (deltaPercent < -10) {
      conclusionState = 'REJECTED';
    }

    experiment.confidence = confidence;
    experiment.conclusionState = conclusionState;
    experiment.status = 'COMPLETED';
    experiment.resultSummary = `Variant demonstrated a ${deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`} change in ${experiment.primaryMetric} (Control: ${controlMetricValue}, Variant: ${variantMetricValue}).`;

    PerformanceAuditService.recordAuditEvent({
      auditId: `perf-aud-${Date.now().toString(36)}-exp-eval`,
      userId: experiment.userId,
      researchRunId: experiment.researchRunId,
      action: 'EXPERIMENT_UPDATED',
      details: `Evaluated experiment [${experiment.variable}]: ${conclusionState} (${deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`}) with ${confidence}.`,
      timestamp: new Date().toISOString(),
    });

    return experiment;
  }
}
