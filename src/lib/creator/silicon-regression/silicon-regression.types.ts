// ============================================================================
// PHASE 88: CONTINUOUS CROSS-ARCHITECTURE SILICON REGRESSION DATA MODELS
// ============================================================================

import { MethodologyComparabilityState } from "../collective-intelligence/collective-intelligence.types";

export type RegressionState =
  | 'NO_REGRESSION'
  | 'POSSIBLE_REGRESSION'
  | 'LIKELY_REGRESSION'
  | 'CONFIRMED_EMPIRICAL_REGRESSION'
  | 'IMPROVEMENT'
  | 'CONFOUNDED'
  | 'CONTRADICTED'
  | 'INSUFFICIENT_DATA'
  | 'NOT_COMPARABLE'
  | 'STALE'
  | 'BLOCKED';

export type RegressionCauseCategory =
  | 'DRIVER_CHANGE'
  | 'FIRMWARE_CHANGE'
  | 'BIOS_CHANGE'
  | 'APPLICATION_VERSION_CHANGE'
  | 'BENCHMARK_VERSION_CHANGE'
  | 'THERMAL_CHANGE'
  | 'POWER_LIMIT_CHANGE'
  | 'MEMORY_CONFIGURATION_CHANGE'
  | 'OPERATING_ENVIRONMENT_CHANGE'
  | 'METHODOLOGY_CHANGE'
  | 'HARDWARE_VARIANCE'
  | 'UNKNOWN';

export type RegressionOpportunityPriority =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INFORMATIONAL';

export interface SiliconRegressionObservation {
  observationId: string;
  researchRunId: string;
  userId: string;
  architecture: string;
  generation: string;
  sku: string;
  hardwareFingerprint: string;
  cpu?: string;
  gpu?: string;
  driver?: string;
  firmware?: string;
  bios?: string;
  benchmarkSuite: string;
  benchmarkVersion?: string;
  appGameVersion?: string;
  resolution?: string;
  preset?: string;
  renderingApi?: string;
  upscalingTech?: string;
  upscalingMode?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  thermalConditionsCelsius?: number;
  memoryConfig?: string;
  measuredScore: number;
  metricUnit: string;
  measurementWindow?: string;
  sourcePublisher: string;
  evidenceSnapshotHash: string;
  observedAt: string;
}

export interface SiliconRegressionTimelinePoint {
  pointId: string;
  observationId: string;
  timestamp: string;
  driver?: string;
  firmware?: string;
  measuredScore: number;
  metricUnit: string;
  deltaFromBaseline: number;
  deltaPercentage: number;
  regressionState: RegressionState;
  methodologyFingerprint: string;
}

export interface SiliconRegressionSeries {
  seriesId: string;
  hardwareKey: string;
  benchmarkSuite: string;
  metricUnit: string;
  baselineObservationId: string;
  points: SiliconRegressionTimelinePoint[];
  totalObservationsCount: number;
  comparableObservationsCount: number;
  independentObservationsCount: number;
  isMonotonicRegression: boolean;
  isConfounded: boolean;
  confounders: string[];
  seriesState: RegressionState;
  updatedAt: string;
}

export interface RegressionCauseCandidate {
  category: RegressionCauseCategory;
  dimension: string;
  baselineValue: string | number;
  candidateValue: string | number;
  plausibility: 'LOW' | 'MEDIUM' | 'HIGH';
  isCausallyEstablished: boolean; // Must remain false unless formally validated in laboratory study
}

export interface RegressionConfounder {
  dimension: string;
  baselineValue: string | number;
  candidateValue: string | number;
  impactDescription: string;
}

export interface SiliconRegressionPair {
  pairId: string;
  baselineObservation: SiliconRegressionObservation;
  candidateObservation: SiliconRegressionObservation;
  absoluteDelta: number;
  percentageDelta: number;
  comparabilityState: MethodologyComparabilityState;
  regressionState: RegressionState;
  causeCandidates: RegressionCauseCandidate[];
  confounders: RegressionConfounder[];
  dimensionDifferences: string[];
  explanation: string;
  isEmpiricallyConfirmed: boolean;
}

export interface RegressionAssessment {
  assessmentId: string;
  pairId: string;
  regressionState: RegressionState;
  causeCandidates: RegressionCauseCandidate[];
  confounders: RegressionConfounder[];
  independentObservationsCount: number;
  contradictionCount: number;
  isBlocked: boolean;
  blockers: string[];
  isStale: boolean;
  assessedAt: string;
}

export interface BenchmarkSynthesisRecord {
  synthesisId: string;
  architectureA: string;
  architectureB: string;
  generationA: string;
  generationB: string;
  benchmarkSuite: string;
  baselineAverageScore: number;
  candidateAverageScore: number;
  observedDeltaPercentage: number;
  direction: 'IMPROVEMENT' | 'REGRESSION' | 'PARITY' | 'MIXED';
  comparableObservationCount: number;
  independentProjectCount: number;
  contradictionCount: number;
  confidenceLimitations: string[];
  candidateExplanations: string[];
  synthesisState: RegressionState;
  synthesizedAt: string;
}

export interface EmpiricalSynthesisReport {
  reportId: string;
  researchRunId: string;
  userId: string;
  matrixId: string;
  synthesisRecords: BenchmarkSynthesisRecord[];
  activeRegressionsCount: number;
  activeImprovementsCount: number;
  confoundedCount: number;
  contradictedCount: number;
  summary: string;
  evidenceBoundary: string;
  generatedAt: string;
}

export interface RegressionResearchOpportunity {
  opportunityId: string;
  title: string;
  description: string;
  triggeringPairId?: string;
  triggeringSynthesisId?: string;
  affectedArchitecture: string;
  affectedGeneration: string;
  affectedSKUs: string[];
  affectedBenchmarks: string[];
  observedDeltaPercentage: number;
  candidateCauses: RegressionCauseCandidate[];
  knownConfounders: string[];
  hypothesis: string;
  priority: RegressionOpportunityPriority;
  status: 'IDENTIFIED' | 'QUEUED' | 'VALIDATED' | 'BLOCKED' | 'STALE';
  evidenceBoundary: string;
  createdAt: string;
}

export interface SiliconRegressionMatrix {
  matrixId: string;
  userId: string;
  researchRunId: string;
  pairs: SiliconRegressionPair[];
  series: SiliconRegressionSeries[];
  totalObservationsCount: number;
  comparableObservationsCount: number;
  detectedRegressionsCount: number;
  detectedImprovementsCount: number;
  confoundedCount: number;
  contradictedCount: number;
  matrixSnapshotHash: string;
  isStale: boolean;
  updatedAt: string;
}

export interface SiliconRegressionSnapshot {
  snapshotId: string;
  snapshotHash: string;
  userId: string;
  researchRunId: string;
  matrixId: string;
  seriesCount: number;
  pairsCount: number;
  regressionsCount: number;
  improvementsCount: number;
  confoundedCount: number;
  opportunitiesCount: number;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  isStale: boolean;
  generatedAt: string;
}

export interface RegressionLineageLink {
  stage: string;
  title: string;
  detail: string;
  status: string;
  targetId: string;
}

export interface RegressionLineageTrace {
  regressionId: string;
  links: RegressionLineageLink[];
}

export interface RegressionAuditEvent {
  auditId: string;
  timestamp: string;
  userId: string;
  researchRunId: string;
  eventType:
    | 'REGRESSION_MATRIX_CREATED'
    | 'OBSERVATION_INCLUDED'
    | 'OBSERVATION_EXCLUDED'
    | 'REGRESSION_DETECTED'
    | 'REGRESSION_RECLASSIFIED'
    | 'CONFOUNDER_DETECTED'
    | 'ATTRIBUTION_ASSESSED'
    | 'SYNTHESIS_CREATED'
    | 'SYNTHESIS_INVALIDATED'
    | 'RESEARCH_OPPORTUNITY_CREATED'
    | 'RESEARCH_VALIDATION_BRIDGED'
    | 'SNAPSHOT_CREATED'
    | 'STATE_MARKED_STALE'
    | 'BLOCKER_DETECTED';
  targetId: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
}
