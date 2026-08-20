import { 
  ScriptOutputMode, 
  TargetVideoDuration, 
  CreatorStudioReport 
} from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ScriptQualityReviewReport } from "../quality/script-quality.types";
import { TimelineExportResult } from "../timeline/timeline.types";

export type CreatorWorkflowState =
  | 'DRAFT'
  | 'RESEARCH_READY'
  | 'EVIDENCE_READY'
  | 'SCRIPT_PROFILE_READY'
  | 'SCRIPT_GENERATING'
  | 'SCRIPT_READY'
  | 'QUALITY_REVIEW'
  | 'QUALITY_PASSED'
  | 'PRODUCTION_READY'
  | 'PRODUCTION_GENERATING'
  | 'PRODUCTION_READY_FINAL'
  | 'EXPORT_READY'
  | 'COMPLETED'
  | 'BLOCKED';

export type WorkflowReadinessDimension = 
  | 'RESEARCH' 
  | 'SCRIPT' 
  | 'QUALITY' 
  | 'PRODUCTION' 
  | 'EXPORT';

export interface WorkflowReadinessItem {
  dimension: WorkflowReadinessDimension;
  label: string;
  status: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED' | 'OFF' | 'STALE' | 'NOT_READY';
  score: number; // 0.0 to 100.0
  reasons: string[];
  actionsRequired: string[];
}

export interface CreatorWorkflowReadinessReport {
  overallReadinessScore: number; // 0.0 to 100.0
  contentQualityScore: number; // 0.0 to 100.0 (from Phase 69 Quality Engine)
  readyToRecord: boolean;
  readyToRecordSummary: string;
  blockingReasons: string[];
  dimensions: WorkflowReadinessItem[];
  checkedAt: string;
}

export interface CreatorScriptVersion {
  version: number;
  createdAt: string;
  updatedAt: string;
  researchRunId: string;
  trainingProfileId?: string;
  targetDuration: TargetVideoDuration;
  outputMode: ScriptOutputMode;
  qualityScore: number;
  qualityGrade: string;
  workflowState: CreatorWorkflowState;
  evidenceSnapshotHash: string;
  isStale: boolean;
  staleReason?: string;
  affectedAssets?: string[];
  unaffectedAssets?: string[];
}

export interface StaleDetectionResult {
  isStale: boolean;
  reason?: string;
  affectedAssets: string[];
  unaffectedAssets: string[];
}

export interface CreatorProductionPackage {
  packageId: string;
  researchRunId: string;
  topic: string;
  generatedAt: string;
  version: number;
  workflowState: CreatorWorkflowState;
  readiness: CreatorWorkflowReadinessReport;
  scriptMarkdown?: string;
  scriptJson?: any;
  hooksMarkdown?: string;
  titlesMarkdown?: string;
  talkingPointsMarkdown?: string;
  bRollPlanMarkdown?: string;
  benchmarkCardsJson?: any;
  chaptersText?: string;
  provenanceProofMarkdown?: string;
  qualityReportJson?: any;
  timelineEdl?: string;
  timelineFcpxml?: string;
  includedAssets: string[];
  excludedAssets: string[];
  staleAssets: string[];
}
