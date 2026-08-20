// ============================================================================
// PHASE 90: MULTI-GENERATIONAL SILICON MICROARCHITECTURE SIMULATION SANDBOX &
// AUTOMATED PHYSICAL BENCHMARK TESTBENCH AUTOMATION CONTROL PLANE TYPES
// ============================================================================

export type TestbenchEvidenceClassification =
  | "VERIFIED_RESEARCH_EVIDENCE"
  | "PHYSICAL_MEASUREMENT"
  | "BENCHMARK_OBSERVATION"
  | "SIMULATION_RESULT"
  | "FORECAST_RESULT"
  | "MODELED_ESTIMATE"
  | "PLANNED_TEST"
  | "UNAVAILABLE"
  | "UNSUPPORTED"
  | "INVALID"
  | "CONFLICTED"
  | "REQUIRES_RESEARCH_VALIDATION";

export type HardwareCapabilityState =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "NOT_CONFIGURED"
  | "UNSUPPORTED"
  | "PERMISSION_REQUIRED"
  | "UNKNOWN";

export type TestbenchExecutionState =
  | "DRAFT"
  | "PLANNED"
  | "CAPABILITY_CHECK"
  | "SAFETY_CHECK"
  | "AWAITING_AUTHORIZATION"
  | "AUTHORIZED"
  | "STAGED"
  | "READY"
  | "RUNNING"
  | "COLLECTING_TELEMETRY"
  | "COLLECTING_RESULTS"
  | "FINALIZING"
  | "VALIDATING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED"
  | "BLOCKED"
  | "STALE";

export type LabValidationState =
  | "NOT_VALIDATED"
  | "VALIDATION_PENDING"
  | "VALIDATED"
  | "REJECTED"
  | "INCONCLUSIVE";

export type MeasurementSourceType =
  | "ONBOARD_SENSOR"
  | "EXTERNAL_POWER_METER"
  | "OSCILLOSCOPE"
  | "DAQ"
  | "IMPORTED_MEASUREMENT"
  | "UNAVAILABLE";

export type TelemetryConnectionState =
  | "LIVE_PHYSICAL_TELEMETRY"
  | "IMPORTED_TELEMETRY"
  | "LIVE_TELEMETRY_UNAVAILABLE";

export type RunnerStatus =
  | "RUNNER_READY"
  | "RUNNER_BUSY"
  | "RUNNER_NOT_CONFIGURED"
  | "RUNNER_ERROR";

export type ExperimentAlignmentState =
  | "ALIGNED"
  | "PARTIALLY_ALIGNED"
  | "DIVERGENT"
  | "INSUFFICIENT_DATA"
  | "NOT_COMPARABLE"
  | "CONFOUNDED"
  | "CONTRADICTED";

export type MeasurementCategory =
  | "CPU_POWER"
  | "GPU_POWER"
  | "SYSTEM_POWER"
  | "TEMPERATURE"
  | "CLOCK_FREQUENCY"
  | "VOLTAGE"
  | "CURRENT"
  | "ENERGY"
  | "PERFORMANCE_SCORE"
  | "FRAME_TIME"
  | "FPS"
  | "THROUGHPUT"
  | "LATENCY"
  | "MEMORY_BANDWIDTH";

export interface HardwareCapabilities {
  cpu: {
    model: string;
    architecture: string;
    stepping: string;
    cores: number;
    threads: number;
    baseClockGhz: number;
    boostClockGhz: number;
    status: HardwareCapabilityState;
  };
  gpu: {
    model: string;
    architecture: string;
    vramGb: number;
    driverVersion: string;
    status: HardwareCapabilityState;
  };
  system: {
    motherboard: string;
    biosVersion: string;
    osVersion: string;
    ramGb: number;
    ramSpeedMhz: number;
    memoryChannels: number;
    status: HardwareCapabilityState;
  };
  sensors: {
    cpuTemperatureSensor: HardwareCapabilityState;
    gpuTemperatureSensor: HardwareCapabilityState;
    hotspotSensor: HardwareCapabilityState;
    vrmTemperatureSensor: HardwareCapabilityState;
    ambientTemperatureSensor: HardwareCapabilityState;
    onboardPowerTelemetry: HardwareCapabilityState;
  };
  instruments: {
    externalPowerMeter: HardwareCapabilityState;
    oscilloscope: HardwareCapabilityState;
    daqSystem: HardwareCapabilityState;
  };
  runner: {
    runnerStatus: RunnerStatus;
    runnerVersion?: string;
    authorizedWorkspace?: string;
  };
}

export interface TestbenchDefinition {
  testbenchId: string;
  userId: string;
  researchRunId: string;
  name: string;
  description: string;
  hardwareTarget: string;
  architecture: string;
  cpu: string;
  gpu: string;
  motherboard: string;
  firmware: string;
  bios: string;
  driver: string;
  operatingSystem: string;
  memoryConfiguration: string;
  powerConfiguration: string;
  coolingConfiguration: string;
  measurementDevices: string[];
  benchmarkSuite: string;
  benchmarkVersion: string;
  applicationVersion: string;
  methodology: string;
  requiredCapabilities: string[];
  safetyConstraints: {
    maxThermalLimitCelsius: number;
    maxPowerLimitWatts: number;
    abortOnThrottling: boolean;
    requireExternalPowerMeter: boolean;
  };
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | "UNAVAILABLE";
  createdAt: string;
  updatedAt: string;
}

export interface BenchmarkExecutionPlan {
  planId: string;
  userId: string;
  researchRunId: string;
  testbenchId: string;
  benchmarkSuite: string;
  benchmarkVersion: string;
  applicationVersion: string;
  hardware: string;
  driver: string;
  bios: string;
  firmware: string;
  os: string;
  resolution: string;
  preset: string;
  renderingApi: string;
  upscaling: string;
  frameGeneration: boolean;
  rayTracing: boolean;
  powerLimitWatts: number;
  coolingMode: string;
  runCount: number;
  warmupRuns: number;
  measurementIntervalMs: number;
  telemetryChannels: string[];
  requiredSensors: string[];
  expectedOutputs: string[];
  methodologyNotes: string;
  executionPlanHash: string;
  createdAt: string;
}

export interface PhysicalMeasurement {
  measurementId: string;
  userId: string;
  researchRunId: string;
  testRunId: string;
  category: MeasurementCategory;
  timestamp: string;
  device: string;
  channel: string;
  value: number;
  unit: string;
  samplingIntervalMs: number;
  source: MeasurementSourceType;
  calibrationMetadata: string;
  measurementConfidence: "HIGH" | "MEDIUM" | "LOW" | "UNCALIBRATED";
  classification: TestbenchEvidenceClassification;
}

export interface TelemetryFrame {
  timestamp: string;
  cpuTempCelsius?: number;
  gpuTempCelsius?: number;
  hotspotTempCelsius?: number;
  vrmTempCelsius?: number;
  ambientTempCelsius?: number;
  cpuPowerWatts?: number;
  gpuPowerWatts?: number;
  systemPowerWatts?: number;
  cpuClockMhz?: number;
  gpuClockMhz?: number;
  fanRpm?: number;
  thermalThrottling: boolean;
}

export interface BenchmarkRunResult {
  runIndex: number;
  isWarmup: boolean;
  rawScore: number;
  normalizedScore: number;
  metricUnit: string;
  status: "VALID" | "DISCARDED" | "FAILED";
  discardedReason?:
    | "THERMAL_THROTTLING"
    | "TEST_PROCESS_FAILURE"
    | "MEASUREMENT_DEVICE_FAILURE"
    | "INVALID_RUNTIME_STATE"
    | "USER_CANCELLED"
    | "SAFETY_ABORT";
  telemetrySummary: {
    avgCpuTempCelsius?: number;
    maxCpuTempCelsius?: number;
    avgGpuTempCelsius?: number;
    maxGpuTempCelsius?: number;
    avgPowerWatts?: number;
    peakPowerWatts?: number;
    avgClockMhz?: number;
  };
}

export interface PhysicalExperiment {
  experimentId: string;
  userId: string;
  researchRunId: string;
  planId: string;
  testbenchId: string;
  executionState: TestbenchExecutionState;
  authorizationRecord?: {
    authorizedBy: string;
    authorizedAt: string;
    authorizationSignature: string;
  };
  plannedRuns: number;
  completedRuns: number;
  runResults: BenchmarkRunResult[];
  consolidatedScore?: number;
  metricUnit: string;
  variancePercentage?: number;
  efficiencyMetrics: {
    performancePerWatt?: number;
    energyPerWorkUnitJoules?: number;
    thermalEfficiencyIndex?: number;
  };
  telemetryFrames: TelemetryFrame[];
  telemetryConnectionState: TelemetryConnectionState;
  reproducibilityFingerprint: string;
  validationState: LabValidationState;
  blockers: string[];
  isStale: boolean;
  staleReason?: string;
  evidenceBoundary: string;
  createdAt: string;
  completedAt?: string;
}

export interface MicroarchitectureSimulation {
  simulationId: string;
  userId: string;
  researchRunId: string;
  name: string;
  targetArchitecture: string;
  generation: string;
  sku: string;
  benchmarkSuite: string;
  metricUnit: string;
  modeledParameters: {
    branchMispredictPenaltyCycles: number;
    vectorExecutionWidthBits: number;
    l1DataCacheLatencyCycles: number;
    l2CacheLatencyCycles: number;
    l3CacheLatencyCycles: number;
    memoryBandwidthGbps: number;
    syscallOverheadCycles: number;
    clockFrequencyGhz: number;
    powerCapWatts: number;
  };
  simulatedScore: number;
  uncertaintySpreadPercentage: number;
  simulationClassification: "SIMULATED_ESTIMATE";
  assumptionSet: string[];
  inputSnapshotHash: string;
  outputSnapshotHash: string;
  evidenceBoundary: string;
  simulatedAt: string;
}

export interface ExperimentComparison {
  comparisonId: string;
  userId: string;
  researchRunId: string;
  physicalExperimentId: string;
  simulationId: string;
  sku: string;
  benchmarkSuite: string;
  metricUnit: string;
  physicalScore: number;
  simulatedScore: number;
  deltaPercentage: number;
  absoluteError: number;
  alignmentState: ExperimentAlignmentState;
  directionAgreement: boolean;
  modelErrorAnalysis: string;
  knownConfounders: string[];
  evidenceBoundary: string;
  comparedAt: string;
}

export interface TestbenchResearchOpportunity {
  opportunityId: string;
  title: string;
  description: string;
  triggeringExperimentId?: string;
  triggeringSimulationId?: string;
  affectedArchitecture: string;
  affectedSKUs: string[];
  affectedBenchmarks: string[];
  observedDeltaPercentage: number;
  hypothesis: string;
  evidenceGap: string;
  requiredValidation: string;
  supportingMeasurements: string[];
  confounders: string[];
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";
  status: "IDENTIFIED" | "QUEUED" | "VALIDATED" | "BLOCKED" | "STALE";
  evidenceBoundary: string;
  createdAt: string;
}

export interface TestbenchSnapshot {
  snapshotId: string;
  snapshotHash: string;
  userId: string;
  researchRunId: string;
  testbenchesCount: number;
  plansCount: number;
  experimentsCount: number;
  measurementsCount: number;
  simulationsCount: number;
  comparisonsCount: number;
  opportunitiesCount: number;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  isStale: boolean;
  generatedAt: string;
}

export interface TestbenchLineageLink {
  stage: string;
  title: string;
  detail: string;
  status: string;
  targetId: string;
}

export interface TestbenchLineageTrace {
  experimentId: string;
  links: TestbenchLineageLink[];
}

export interface TestbenchAuditEvent {
  auditId: string;
  timestamp: string;
  userId: string;
  researchRunId: string;
  eventType:
    | "TESTBENCH_CREATED"
    | "CAPABILITIES_DISCOVERED"
    | "PLAN_CREATED"
    | "EXPERIMENT_PLANNED"
    | "EXPERIMENT_AUTHORIZED"
    | "EXPERIMENT_STAGED"
    | "EXPERIMENT_STARTED"
    | "TELEMETRY_INGESTED"
    | "MEASUREMENT_RECORDED"
    | "EXPERIMENT_COMPLETED"
    | "EXPERIMENT_ABORTED"
    | "EXPERIMENT_FAILED"
    | "SIMULATION_EXECUTED"
    | "COMPARISON_EVALUATED"
    | "OPPORTUNITY_CREATED"
    | "VALIDATION_TASK_CREATED"
    | "SAFETY_BLOCKER_TRIGGERED"
    | "SNAPSHOT_CREATED"
    | "EXPERIMENT_MARKED_STALE";
  targetId: string;
  beforeState?: string;
  afterState?: string;
  reason: string;
  metadata?: Record<string, any>;
}
