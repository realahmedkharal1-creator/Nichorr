// ============================================================================
// PHASE 94: AUTOMATED HARDWARE-SOFTWARE CO-DESIGN EMPIRICAL SIMULATION &
// INTERACTIVE SILICON CALIBRATION WORKBENCH TYPES
// ============================================================================

export type CoDesignParameterDomain =
  | "MICROARCHITECTURE"
  | "CACHE_HIERARCHY"
  | "MEMORY_SUBSYSTEM"
  | "INTERCONNECT"
  | "SOFTWARE_RUNTIME"
  | "THERMAL_POWER";

export type ParameterSourceType =
  | "EMPIRICAL_MEASUREMENT"
  | "DERIVED_ESTIMATE"
  | "HYPOTHETICAL_INTERVENTION"
  | "SIMULATION_DEFAULT";

export type AlignmentClassification =
  | "ALIGNED"
  | "PARTIALLY_ALIGNED"
  | "DIVERGENT"
  | "CONFOUNDED"
  | "INSUFFICIENT_DATA"
  | "NOT_COMPARABLE"
  | "BLOCKED";

export type SensitivityDirection =
  | "POSITIVE"
  | "NEGATIVE"
  | "NEUTRAL"
  | "NON_LINEAR";

export type CoDesignHealthEffect =
  | "SUPPORTS_EXISTING_FINDING"
  | "WEAKENS_EXISTING_FINDING"
  | "CONTRADICTS_EXISTING_FINDING"
  | "REQUIRES_REVIEW"
  | "NO_CHANGE"
  | "INSUFFICIENT_DATA";

export type CoDesignValidationStatus =
  | "OPEN"
  | "VALIDATION_PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "INCONCLUSIVE";

export interface CoDesignParameter {
  parameterId: string;
  name: string;
  domain: CoDesignParameterDomain;
  currentValue: number;
  baselineValue: number;
  unit: string;
  minValue: number;
  maxValue: number;
  step: number;
  sourceType: ParameterSourceType;
  provenance: string;
  confidence: "HIGH" | "MODERATE" | "LOW";
  uncertaintyPercentage?: number;
  description: string;
}

export interface CoDesignConstraint {
  constraintId: string;
  name: string;
  parameterA: string;
  parameterB?: string;
  operator: "<=" | ">=" | "==" | "RATIO_MAX" | "POWER_BUDGET";
  limitValue: number;
  severity: "HARD_BLOCK" | "ADVISORY_WARNING";
  description: string;
}

export interface EmpiricalBaseline {
  baselineId: string;
  userId: string;
  researchRunId: string;
  sourceType: "PHYSICAL_BENCHMARK" | "CLUSTER_NODE_RUN" | "CROSS_LAB_DATASET" | "PMU_EXECUTION_TRACE" | "VERIFIED_RESEARCH_LEDGER";
  hardwareTarget: string;
  cpuModel: string;
  cpuStepping: string;
  gpuModel: string;
  gpuArchitecture: string;
  driverVersion: string;
  benchmarkSuite: string;
  resolution: string;
  preset: string;
  measuredScoreFPS: number;
  measuredPowerWatts?: number;
  measuredTemperatureCelsius?: number;
  measuredPerfPerWatt?: number;
  primaryBottleneckAttribution?: string;
  methodologyFingerprint: string;
  siliconFingerprint: string;
  sourceSnapshotHash: string;
  registeredAt: string;
}

export interface CoDesignScenario {
  scenarioId: string;
  revision: number;
  userId: string;
  researchRunId: string;
  title: string;
  description: string;
  baselineId: string;
  targetHardware: string;
  modelVersion: string;
  parameters: Record<string, CoDesignParameter>;
  activeConstraints: CoDesignConstraint[];
  scenarioFingerprint: string;
  isImmutable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationUncertaintyProfile {
  inputUncertaintyPct: number;
  modelUncertaintyPct: number;
  measurementUncertaintyPct: number;
  methodologyUncertaintyPct: number;
  compositeUncertaintyPct: number;
  confidenceInterval95: [number, number]; // [minScore, maxScore]
  confidenceClassification: "HIGH" | "MODERATE" | "LOW" | "INSUFFICIENT_DATA";
}

export interface CoDesignSimulationResult {
  simulationId: string;
  scenarioId: string;
  scenarioRevision: number;
  scenarioFingerprint: string;
  baselineId: string;
  userId: string;
  researchRunId: string;
  modelVersion: string;
  simulationClassification: "CO_DESIGN_SIMULATED_ESTIMATE"; // Never VERIFIED_RESEARCH_EVIDENCE
  simulatedScoreFPS: number;
  simulatedPowerWatts: number;
  simulatedPerfPerWatt: number;
  simulatedTemperatureCelsius?: number;
  baselineScoreFPS: number;
  deltaFPS: number;
  deltaPercentage: number;
  bottleneckDistribution: Record<string, number>; // Category -> percentage share
  uncertaintyProfile: SimulationUncertaintyProfile;
  isCausallyEstablished: boolean; // Permanent non-causal default: false
  epistemicBoundary: string;
  simulatedAt: string;
}

export interface ParameterSensitivityEntry {
  parameterId: string;
  parameterName: string;
  domain: CoDesignParameterDomain;
  baseValue: number;
  perturbedValue: number;
  outputDeltaFPS: number;
  outputDeltaPct: number;
  direction: SensitivityDirection;
  elasticityCoefficient: number; // % change in output / % change in parameter
  sensitivityRank: number;
  uncertaintyPct: number;
}

export interface EmpiricalAlignmentRecord {
  alignmentId: string;
  scenarioId: string;
  simulationId: string;
  baselineId: string;
  userId: string;
  researchRunId: string;
  metricDifferences: {
    metric: string;
    physicalValue: number;
    simulatedValue: number;
    delta: number;
    deltaPercentage: number;
    unit: string;
  }[];
  bottleneckDivergence: {
    category: string;
    physicalSharePct: number;
    simulatedSharePct: number;
    divergencePct: number;
  }[];
  alignmentClassification: AlignmentClassification;
  identifiedConfounders: string[];
  divergenceSummary: string;
  isCausallyEstablished: boolean;
  alignedAt: string;
}

export interface CoDesignHealthReconciliationRecord {
  reconciliationId: string;
  scenarioId: string;
  simulationId: string;
  baselineId: string;
  targetResearchRunId: string;
  newHealthEffect: CoDesignHealthEffect;
  evidenceDeltaSummary: string;
  affectedClaimsCount: number;
  affectedClaims: string[];
  recommendedHumanAction: string;
  reconciledAt: string;
}

export interface CoDesignOpportunity {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  scenarioId: string;
  simulationId: string;
  title: string;
  hypothesis: string;
  observedEvidence: string[];
  simulationEvidence: string[];
  physicalEvidence: string[];
  confounders: string[];
  uncertaintySummary: string;
  requiredValidationTask: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  resolutionStatus: CoDesignValidationStatus;
  isCausallyEstablished: boolean;
  createdAt: string;
}

export interface CoDesignSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  scenarioCount: number;
  baselineCount: number;
  simulationCount: number;
  alignmentCount: number;
  opportunityCount: number;
  reconciliationCount: number;
  snapshotHash: string;
  createdAt: string;
}

export type CoDesignLineageStage =
  | "1. SOURCE EMPIRICAL EVIDENCE"
  | "2. BASELINE SELECTION & NORMALIZATION"
  | "3. SCENARIO / MODEL PARAMETER CONSTRUCTION"
  | "4. CO-DESIGN SIMULATION"
  | "5. EMPIRICAL ALIGNMENT & DIVERGENCE ANALYSIS"
  | "6. RESEARCH CALIBRATION & HEALTH RECONCILIATION";

export interface CoDesignLineageLink {
  stage: CoDesignLineageStage;
  title: string;
  input: string;
  transformation: string;
  output: string;
  status: "VERIFIED" | "EVALUATED" | "CONFOUNDED" | "BLOCKED" | "EXCLUDED";
  excludedEvidence?: string[];
  blockers?: string[];
  provenance: Record<string, any>;
}

export interface CoDesignLineageTrace {
  lineageId: string;
  simulationId: string;
  scenarioId: string;
  userId: string;
  researchRunId: string;
  stages: CoDesignLineageLink[];
  exclusions: string[];
  generatedAt: string;
}

export interface CoDesignAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  timestamp: string;
  eventType:
    | "SCENARIO_CREATED"
    | "SCENARIO_MODIFIED"
    | "BASELINE_REGISTERED"
    | "BASELINE_SELECTED"
    | "SIMULATION_EXECUTED"
    | "ALIGNMENT_EVALUATED"
    | "SENSITIVITY_COMPUTED"
    | "DIVERGENCE_DETECTED"
    | "OPPORTUNITY_GENERATED"
    | "CALIBRATION_REQUESTED"
    | "RECONCILIATION_EVALUATED"
    | "PROMOTION_EVALUATED"
    | "BLOCKER_ACTIVATED"
    | "BLOCKER_RESOLVED"
    | "SNAPSHOT_CREATED";
  targetId: string;
  actor: string;
  reason: string;
  metadata?: Record<string, any>;
  integrityHash: string;
}
