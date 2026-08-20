import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport, TargetVideoDuration, ScriptOutputMode } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { CreatorWorkflowState, CreatorWorkflowReadinessReport } from "../workflow/creator-workflow.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { ResearchHealthDecisionReport } from "@/lib/research-health/decision/research-health-decision.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { TimelineSyncPlan } from "../editor/editor-integration.types";
import { CreatorDistributionPackage, DistributionReadinessReport } from "../distribution/distribution.types";

export type ProjectNodeType =
  | 'RESEARCH_RUN'
  | 'SOURCE'
  | 'EVIDENCE'
  | 'CLAIM'
  | 'PROVENANCE_CHAIN'
  | 'CLAIM_HEALTH'
  | 'SCRIPT_PROFILE'
  | 'SCRIPT_VERSION'
  | 'SCRIPT_SECTION'
  | 'TALKING_POINT'
  | 'PRODUCTION_ASSET'
  | 'TELEPROMPTER'
  | 'TIMELINE_MARKER'
  | 'PUBLISHING_ASSET'
  | 'DISTRIBUTION_PACKAGE'
  | 'RELEASE_PLAN';

export type ProjectRelationType =
  | 'SUPPORTS'
  | 'DERIVED_FROM'
  | 'VERIFIED_BY'
  | 'TRACES_TO'
  | 'AFFECTS'
  | 'GENERATED_FROM'
  | 'DEPENDS_ON'
  | 'VERSION_OF'
  | 'MATERIALIZES_AS'
  | 'SYNCHRONIZES_WITH'
  | 'PACKAGED_FOR'
  | 'BLOCKED_BY';

export type ProjectOverallStatus =
  | 'DRAFT'
  | 'RESEARCH_IN_PROGRESS'
  | 'EVIDENCE_REVIEW_REQUIRED'
  | 'HEALTH_REVIEW_REQUIRED'
  | 'SCRIPT_REVIEW_REQUIRED'
  | 'PRODUCTION_REVIEW_REQUIRED'
  | 'PUBLISHING_REVIEW_REQUIRED'
  | 'DISTRIBUTION_REVIEW_REQUIRED'
  | 'READY'
  | 'BLOCKED'
  | 'STALE'
  | 'COMPLETED';

export type ProjectSubsystem =
  | 'RESEARCH'
  | 'EVIDENCE'
  | 'HEALTH'
  | 'DECISIONS'
  | 'SCRIPT'
  | 'QUALITY'
  | 'PRODUCTION'
  | 'EDITOR'
  | 'PUBLISHING'
  | 'DISTRIBUTION';

export interface CreatorProjectNode {
  id: string;
  type: ProjectNodeType;
  label: string;
  subsystem: ProjectSubsystem;
  status: 'HEALTHY' | 'WARNING' | 'BLOCKED' | 'STALE' | 'DISABLED_BY_CREATOR' | 'READY' | 'UNKNOWN';
  metadata: Record<string, any>;
  upstreamNodeIds: string[];
  downstreamNodeIds: string[];
}

export interface CreatorProjectEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: ProjectRelationType;
  label?: string;
}

export interface CreatorProjectGraph {
  researchRunId: string;
  nodes: CreatorProjectNode[];
  edges: CreatorProjectEdge[];
  nodeCount: number;
  edgeCount: number;
  generatedAt: string;
}

export interface CreatorProjectBlocker {
  blockerId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  subsystem: ProjectSubsystem;
  affectedNodeId: string;
  affectedNodeLabel: string;
  reason: string;
  upstreamCause: string;
  affectedAssets: string[];
  requiredAction: string;
  creatorActionRequired: boolean;
  regenerationRequired: boolean;
  revalidationRequired: boolean;
}

export interface CreatorProjectAssetItem {
  assetId: string;
  assetType: string;
  label: string;
  subsystem: ProjectSubsystem;
  enabled: boolean;
  currentVersion: number;
  sourceDependency: string;
  status: 'HEALTHY' | 'STALE' | 'BLOCKED' | 'MISSING' | 'DISABLED_BY_CREATOR' | 'READY';
  freshness: string;
  health: string;
  staleReason?: string;
  blockerReason?: string;
  regenerationEligible: boolean;
  upstreamEvidenceHash: string;
}

export interface CreatorProjectSnapshot {
  snapshotHash: string;
  researchRunId: string;
  evidenceSnapshotHash: string;
  scriptVersion: number;
  scriptOutputMode: ScriptOutputMode;
  targetDurationMinutes: TargetVideoDuration;
  creatorProfileId: string;
  contentQualityScore: number;
  productionReadinessScore: number;
  researchHealthScore: number;
  publishingReadinessScore: number;
  distributionReadinessScore: number;
  enabledAssetCount: number;
  disabledAssetCount: number;
  timelineFingerprint: string;
  activePublishingTargets: string[];
  activeDistributionTargets: string[];
  blockingConditions: string[];
  staleAssetIds: string[];
  reviewRequiredAssetIds: string[];
  capturedAt: string;
}

export interface CreatorProjectHealthReport {
  overallStatus: ProjectOverallStatus;
  isHardBlocked: boolean;
  researchHealthScore: number;
  contentQualityScore: number;
  productionReadinessScore: number;
  publishingReadinessScore: number;
  distributionReadinessScore: number;
  blockers: CreatorProjectBlocker[];
  staleAssets: CreatorProjectAssetItem[];
  readyAssets: CreatorProjectAssetItem[];
  summaryMessage: string;
}

export interface ProjectPipelineStage {
  stageId: ProjectSubsystem;
  stageNumber: number;
  label: string;
  status: 'COMPLETED' | 'READY' | 'WARNING' | 'BLOCKED' | 'STALE' | 'IN_PROGRESS' | 'DISABLED';
  score?: number;
  blockerCount: number;
  staleCount: number;
  requiredAction?: string;
  targetTab: string;
}

export interface CreatorProjectImpactPreview {
  isReadOnlySimulation: true;
  targetNodeType: ProjectNodeType;
  targetNodeId: string;
  targetNodeLabel: string;
  simulationAction: string;
  willChange: CreatorProjectAssetItem[];
  mayChange: CreatorProjectAssetItem[];
  willRemainUnchanged: CreatorProjectAssetItem[];
  blocked: CreatorProjectAssetItem[];
  expectedConsequences: string[];
  summary: string;
}

export interface CreatorProjectOverview {
  researchRunId: string;
  topic: string;
  projectStatus: ProjectOverallStatus;
  snapshot: CreatorProjectSnapshot;
  healthReport: CreatorProjectHealthReport;
  pipelineStages: ProjectPipelineStage[];
  assets: CreatorProjectAssetItem[];
  graph: CreatorProjectGraph;
  activeScriptVersion: number;
  targetDurationMinutes: TargetVideoDuration;
  outputMode: ScriptOutputMode;
  workflowState: CreatorWorkflowState;
  generatedAt: string;
}
