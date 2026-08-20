export type BenchmarkDiffState =
  | 'IDENTICAL'
  | 'NUMERIC_CHANGE_ONLY'
  | 'METHODOLOGY_CHANGE'
  | 'HARDWARE_CHANGE'
  | 'SOFTWARE_ENVIRONMENT_CHANGE'
  | 'TEST_CONDITION_CHANGE'
  | 'SOURCE_CHANGE'
  | 'MULTIPLE_DIMENSIONS_CHANGED'
  | 'INSUFFICIENT_DATA'
  | 'CONFLICTED';

export type BenchmarkTelemetrySourceState =
  | 'LIVE_DATA_VERIFIED'
  | 'SNAPSHOT_DATA'
  | 'IMPORTED_DATA'
  | 'MANUAL_DATA'
  | 'LIVE_DATA_UNAVAILABLE'
  | 'REVALIDATION_REQUIRED';

export interface BenchmarkMeasurement {
  hardwareIdentity: string;
  cpuModel?: string;
  gpuModel?: string;
  driverVersion?: string;
  benchmarkSuite: string;
  benchmarkVersion?: string;
  appGameVersion?: string;
  resolution?: string;
  preset?: string;
  renderingApi?: string;
  upscalingTechnology?: string;
  upscalingMode?: string;
  frameGeneration?: boolean;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  thermalConditionsCelsius?: number;
  cpuRamConfig?: string;
  methodologyNotes?: string;
  sourcePublisher: string;
  evidenceSnapshotHash?: string;
  score: number;
  metricUnit: string;
  telemetryState: BenchmarkTelemetrySourceState;
}

export interface BenchmarkDiffRecord {
  diffId: string;
  benchmarkName: string;
  baseline: BenchmarkMeasurement;
  candidate: BenchmarkMeasurement;
  diffState: BenchmarkDiffState;
  numericDelta: number;
  percentageDelta: number;
  isComparable: boolean;
  dimensionDifferences: string[];
  warnings: string[];
  explanation: string;
  recommendedAction: string;
}
