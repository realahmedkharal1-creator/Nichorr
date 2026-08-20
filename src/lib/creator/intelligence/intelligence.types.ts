export type IntelligenceClassification =
  | 'VERIFIED_RESEARCH_EVIDENCE'
  | 'IMPORTED_OBSERVATION'
  | 'PLATFORM_METRIC'
  | 'AUDIENCE_SIGNAL'
  | 'CREATOR_PREFERENCE'
  | 'DERIVED_INSIGHT'
  | 'ESTIMATED_VALUE'
  | 'UNAVAILABLE'
  | 'UNSUPPORTED'
  | 'INVALID'
  | 'REQUIRES_RESEARCH_VALIDATION';

export type AdapterPlatform =
  | 'YOUTUBE'
  | 'PODCAST'
  | 'CREATOR_IMPORT';

export type AdapterConnectionState =
  | 'CONNECTED'
  | 'IMPORT_AVAILABLE'
  | 'NOT_CONFIGURED'
  | 'LOCAL_ONLY'
  | 'STAGING_ONLY'
  | 'UNAVAILABLE'
  | 'ERROR';

export type BenchmarkComparabilityState =
  | 'DIRECTLY_COMPARABLE'
  | 'COMPARABLE_WITH_CAVEATS'
  | 'PARTIALLY_COMPARABLE'
  | 'NOT_COMPARABLE'
  | 'INSUFFICIENT_DATA'
  | 'CONFLICTED';

export interface PlatformObservationItem {
  id: string;
  name: string;
  value: number | string;
  unit?: string;
  classification: IntelligenceClassification;
  observedAt: string;
  sourcePlatform: AdapterPlatform;
  metadata?: Record<string, any>;
}

export interface IngestionSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  platform: AdapterPlatform;
  adapterId: string;
  connectionState: AdapterConnectionState;
  observations: PlatformObservationItem[];
  validationStatus: 'VALID' | 'WARNINGS' | 'REJECTED';
  measurementWindow?: string;
  snapshotHash: string;
  ingestedAt: string;
}

export interface BenchmarkSpecification {
  id?: string;
  entityName: string;
  benchmarkName: string;
  version?: string;
  resolution?: string;
  preset?: string;
  renderingApi?: string;
  upscalingMode?: string;
  rayTracing?: boolean;
  powerLimitWatts?: number;
  score: number;
  metricUnit: string;
  sourcePublisher: string;
  testDate?: string;
  operatingSystem?: string;
  driverVersion?: string;
}

export interface BenchmarkComparisonPair {
  pairId: string;
  benchmarkA: BenchmarkSpecification;
  benchmarkB: BenchmarkSpecification;
  comparabilityState: BenchmarkComparabilityState;
  scoreDeltaPercent: number;
  explanation: string;
  methodologyDifferences: string[];
  warnings: string[];
  confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT';
}

export interface CrossProjectSynthesisReport {
  synthesisId: string;
  userId: string;
  primaryRunId: string;
  comparedRunIds: string[];
  comparisonPairs: BenchmarkComparisonPair[];
  alignedMethodologiesCount: number;
  incompatibleCount: number;
  keySynthesizedInsights: string[];
  researchOpportunitiesGenerated: string[];
  generatedAt: string;
}

export interface CreatorIntelligenceInsight {
  insightId: string;
  userId: string;
  primaryRunId: string;
  category: string;
  classification: IntelligenceClassification;
  title: string;
  narrative: string;
  inputObservationRef: string;
  evidenceContextRef: string;
  actionRequired: string;
  requiresResearchValidation: boolean;
  generatedAt: string;
}

export interface IntelligenceAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  action:
    | 'PLATFORM_INGESTED'
    | 'BENCHMARK_SYNTHESIZED'
    | 'INSIGHT_EXTRACTED'
    | 'RESEARCH_OPPORTUNITY_QUEUED'
    | 'ADAPTER_CONFIGURED';
  details: string;
  timestamp: string;
}
