export type MetricAvailability =
  | 'AVAILABLE'
  | 'UNAVAILABLE'
  | 'NOT_IMPORTED'
  | 'NOT_SUPPORTED'
  | 'INVALID'
  | 'ESTIMATED';

export type SignalConfidence =
  | 'INSUFFICIENT_SAMPLE'
  | 'LOW_CONFIDENCE'
  | 'MODERATE_CONFIDENCE'
  | 'HIGH_CONFIDENCE';

export type CausalRelationship =
  | 'OBSERVED'
  | 'CORRELATED'
  | 'POSSIBLE_CONTRIBUTOR'
  | 'INSUFFICIENT_DATA'
  | 'NOT_DETERMINABLE';

export type AudienceSignalCategory =
  | 'FACTUAL_QUESTION'
  | 'PRODUCT_QUESTION'
  | 'BENCHMARK_QUESTION'
  | 'METHODOLOGY_QUESTION'
  | 'BUYING_QUESTION'
  | 'COMPARISON_QUESTION'
  | 'TROUBLESHOOTING_QUESTION'
  | 'CORRECTION_OBJECTION'
  | 'FEATURE_REQUEST'
  | 'GENERAL_REACTION';

export type ExperimentConclusionState =
  | 'INCONCLUSIVE'
  | 'PROMISING'
  | 'SUPPORTED'
  | 'REJECTED'
  | 'INSUFFICIENT_DATA';

export interface PerformanceMetricItem {
  name: string;
  value: number;
  unit?: string;
  availability: MetricAvailability;
  deltaPercentage?: number;
}

export interface CreatorPerformanceSnapshot {
  snapshotId: string;
  userId: string;
  researchRunId: string;
  projectSnapshotHash: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  certificationCertificateId?: string;
  distributionPackageId?: string;
  platform: 'YOUTUBE_LONG_FORM' | 'YOUTUBE_SHORTS' | 'PODCAST';
  contentIdentifier: string;
  measurementWindow: string; // e.g. "FIRST_24_HOURS", "FIRST_7_DAYS", "LIFETIME"
  publicationTimestamp: string;
  metrics: {
    impressions?: PerformanceMetricItem;
    views: PerformanceMetricItem;
    uniqueViewers?: PerformanceMetricItem;
    watchTimeHours?: PerformanceMetricItem;
    averageViewDurationSeconds?: PerformanceMetricItem;
    averagePercentageViewed: PerformanceMetricItem;
    audienceRetention30s?: PerformanceMetricItem;
    ctr: PerformanceMetricItem;
    likes?: PerformanceMetricItem;
    comments?: PerformanceMetricItem;
    shares?: PerformanceMetricItem;
    subscriberDelta?: PerformanceMetricItem;
    [key: string]: PerformanceMetricItem | undefined;
  };
  snapshotHash: string;
  recordedAt: string;
}

export interface CreatorLearningInsight {
  insightId: string;
  category: string;
  observedSignal: string;
  dataWindow: string;
  confidence: SignalConfidence;
  sampleSize: number;
  causalityType: CausalRelationship;
  alternativeExplanations: string[];
  recommendedAction: string;
  requiresFurtherTesting: boolean;
  affectedSubsystem: string;
  targetAssetId?: string;
}

export interface AudienceSignalRecord {
  signalId: string;
  category: AudienceSignalCategory;
  rawText: string;
  frequency: number;
  requiresResearchValidation: boolean;
  researchOpportunityId?: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CRITICAL' | 'QUESTION';
  associatedSectionId?: string;
  observedAt: string;
}

export interface CreatorExperimentRecord {
  experimentId: string;
  userId: string;
  researchRunId: string;
  hypothesis: string;
  variable: string;
  control: string;
  variant: string;
  primaryMetric: string;
  measurementWindow: string;
  sampleSize: number;
  resultSummary: string;
  confidence: SignalConfidence;
  conclusionState: ExperimentConclusionState;
  status: 'PLANNED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface ResearchOpportunityRecord {
  opportunityId: string;
  userId: string;
  researchRunId: string;
  title: string;
  description: string;
  triggeredBy: 'AUDIENCE_QUESTION' | 'PERFORMANCE_DROP_OFF' | 'METHODOLOGY_OBJECTION' | 'BENCHMARK_REQUEST';
  sourceSignalId: string;
  suggestedTopic?: string;
  actionRequired: string;
  status: 'PROPOSED' | 'APPROVED' | 'IN_RESEARCH' | 'DISMISSED';
  createdAt: string;
}

export interface PerformanceComparisonReport {
  comparisonId: string;
  currentSnapshotId: string;
  baselineSnapshotId?: string;
  measurementWindow: string;
  metricDeltas: Record<string, { current: number; baseline: number; changePercent: number; causality: CausalRelationship }>;
  keyObservations: string[];
  generatedInsights: CreatorLearningInsight[];
  generatedAt: string;
}

export interface PerformanceAuditEvent {
  auditId: string;
  userId: string;
  researchRunId: string;
  action:
    | 'SNAPSHOT_RECORDED'
    | 'INSIGHT_GENERATED'
    | 'AUDIENCE_SIGNAL_LOGGED'
    | 'EXPERIMENT_CREATED'
    | 'EXPERIMENT_UPDATED'
    | 'RESEARCH_OPPORTUNITY_LOGGED'
    | 'LEARNING_ACCEPTED'
    | 'LEARNING_REJECTED';
  details: string;
  timestamp: string;
}
