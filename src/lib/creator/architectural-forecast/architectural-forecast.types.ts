// ============================================================================
// PHASE 89: ADAPTIVE ARCHITECTURAL DEGRADATION FORECASTING & SIMULATION TYPES
// ============================================================================

export type ForecastState =
  | 'FORECAST_AVAILABLE'
  | 'FORECAST_INSUFFICIENT_DATA'
  | 'FORECAST_NOT_COMPARABLE'
  | 'FORECAST_CONFOUNDED'
  | 'FORECAST_BLOCKED'
  | 'FORECAST_CONTRADICTED'
  | 'FORECAST_STALE'
  | 'FORECAST_SCENARIO_ONLY';

export type ForecastConfidenceLevel =
  | 'VERY_LOW'
  | 'LOW'
  | 'MODERATE'
  | 'HIGH'
  | 'VERY_HIGH';

export type ForecastHorizon =
  | 'SHORT_TERM'   // 1 - 3 driver / firmware revisions
  | 'MEDIUM_TERM'  // 4 - 8 driver / firmware revisions
  | 'LONG_TERM';   // 9+ revisions / generational lifecycle

export type ForecastModelType =
  | 'BASELINE_PROJECTION'
  | 'CONSERVATIVE_PROJECTION'
  | 'SCENARIO_BOUNDED_PROJECTION'
  | 'INSUFFICIENT_EVIDENCE_MODE';

export type MicrocodeMitigationScenarioCategory =
  | 'NO_MITIGATION'
  | 'LOW_OVERHEAD'       // 1 - 3%
  | 'MODERATE_OVERHEAD'  // 4 - 8%
  | 'HIGH_OVERHEAD'      // 9 - 18%
  | 'CUSTOM_ASSUMPTION';

export type WorkloadSensitivityDimension =
  | 'MEMORY_SENSITIVITY'
  | 'IO_SENSITIVITY'
  | 'SYSCALL_SENSITIVITY'
  | 'BRANCH_SENSITIVITY'
  | 'VIRTUALIZATION_SENSITIVITY'
  | 'RASTER_BOUND'
  | 'RAY_TRACING_BOUND';

export type InstructionDeprecationState =
  | 'NO_MODELED_IMPACT'
  | 'POSSIBLE_IMPACT'
  | 'MATERIAL_MODELED_IMPACT'
  | 'INSUFFICIENT_DATA'
  | 'NOT_APPLICABLE'
  | 'BLOCKED';

export interface ForecastDataPoint {
  horizonStep: number;
  stepLabel: string;
  projectedScore: number;
  metricUnit: string;
  lowerBoundScore: number;
  upperBoundScore: number;
  projectedDeltaPercentage: number;
  modelStrategy: ForecastModelType;
  uncertaintyReason: string;
}

export interface ArchitecturalDegradationForecast {
  forecastId: string;
  userId: string;
  researchRunId: string;
  architecture: string;
  generation: string;
  sku: string;
  benchmarkSuite: string;
  metricUnit: string;
  baselineObservedScore: number;
  latestObservedScore: number;
  historicalDeltaPercentage: number;
  forecastHorizon: ForecastHorizon;
  forecastHorizonSteps: number;
  forecastModelType: ForecastModelType;
  forecastState: ForecastState;
  confidenceLevel: ForecastConfidenceLevel;
  projectedTrajectory: ForecastDataPoint[];
  assumptions: string[];
  knownConfounders: string[];
  evidenceQualityNotes: string[];
  isStale: boolean;
  staleReason?: string;
  evidenceBoundary: string;
  forecastedAt: string;
}

export interface MicrocodeSimulationScenario {
  scenarioId: string;
  userId: string;
  researchRunId: string;
  name: string;
  overheadCategory: MicrocodeMitigationScenarioCategory;
  assumedOverheadPercentage: number;
  targetWorkloadCategory: string;
  targetArchitecture: string;
  targetInstructionSets: string[];
  sensitivityFactors: WorkloadSensitivityDimension[];
  description: string;
  isCustom: boolean;
  createdAt: string;
}

export interface MicrocodeSimulationResult {
  simulationId: string;
  userId: string;
  researchRunId: string;
  scenarioId: string;
  sku: string;
  benchmarkSuite: string;
  baselineMeasuredScore: number;
  metricUnit: string;
  assumedOverheadPercentage: number;
  simulatedScore: number;
  simulatedDeltaPercentage: number;
  simulationClassification: 'SIMULATED_ESTIMATE';
  sensitivitiesApplied: string[];
  assumptions: string[];
  isStale: boolean;
  evidenceBoundary: string;
  simulatedAt: string;
}

export interface InstructionSetDeprecationSimulation {
  deprecationId: string;
  userId: string;
  researchRunId: string;
  instructionSet: string;
  affectedSKUs: string[];
  affectedBenchmarkSuites: string[];
  fallbackPath: string;
  deprecationImpactState: InstructionDeprecationState;
  modeledOverheadPercentage: number;
  workloadDependencyDescription: string;
  evidenceBoundary: string;
  simulatedAt: string;
}

export interface ArchitecturalDegradationMatrixRow {
  rowId: string;
  architecture: string;
  generation: string;
  sku: string;
  benchmarkSuite: string;
  baselineScore: number;
  latestObservedScore: number;
  historicalDeltaPercentage: number;
  regressionState: string;
  forecastState: ForecastState;
  forecastDirection: 'IMPROVEMENT' | 'REGRESSION' | 'STABLE' | 'UNRESOLVED';
  forecastConfidence: ForecastConfidenceLevel;
  primaryConfounder: string;
  activeSimulationsCount: number;
  activeOpportunitiesCount: number;
  validationState: 'PENDING_VALIDATION' | 'QUEUED' | 'VALIDATED' | 'BLOCKED';
}

export interface ArchitecturalDegradationMatrix {
  matrixId: string;
  userId: string;
  researchRunId: string;
  rows: ArchitecturalDegradationMatrixRow[];
  forecastsCount: number;
  simulationsCount: number;
  scenariosCount: number;
  staleCount: number;
  blockedCount: number;
  matrixSnapshotHash: string;
  updatedAt: string;
}

export interface ForecastResearchOpportunity {
  opportunityId: string;
  title: string;
  description: string;
  triggeringForecastId?: string;
  triggeringSimulationId?: string;
  affectedArchitecture: string;
  affectedSKUs: string[];
  affectedBenchmarks: string[];
  modeledDeltaPercentage: number;
  hypothesis: string;
  evidenceGap: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  status: 'IDENTIFIED' | 'QUEUED' | 'VALIDATED' | 'BLOCKED' | 'STALE';
  evidenceBoundary: string;
  createdAt: string;
}

export interface ForecastSnapshot {
  snapshotId: string;
  snapshotHash: string;
  userId: string;
  researchRunId: string;
  matrixId: string;
  forecastsCount: number;
  simulationsCount: number;
  scenariosCount: number;
  opportunitiesCount: number;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  siliconRegressionSnapshotHash: string;
  isStale: boolean;
  generatedAt: string;
}

export interface ForecastLineageLink {
  stage: string;
  title: string;
  detail: string;
  status: string;
  targetId: string;
}

export interface ForecastLineageTrace {
  forecastId: string;
  links: ForecastLineageLink[];
}

export interface ForecastAuditEvent {
  auditId: string;
  timestamp: string;
  userId: string;
  researchRunId: string;
  eventType:
    | 'FORECAST_CREATED'
    | 'FORECAST_RECOMPUTED'
    | 'FORECAST_MARKED_STALE'
    | 'SIMULATION_CREATED'
    | 'SIMULATION_RECOMPUTED'
    | 'SCENARIO_CREATED'
    | 'SCENARIO_UPDATED'
    | 'OPPORTUNITY_CREATED'
    | 'VALIDATION_TASK_CREATED'
    | 'DATA_EXCLUDED'
    | 'HARD_BLOCKER_PROPAGATED'
    | 'SNAPSHOT_CREATED';
  targetId: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
}
