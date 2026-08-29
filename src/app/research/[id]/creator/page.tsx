"use client";

import React, { useEffect, useState, Fragment } from "react";
import { ResearchTabNav } from "@/components/research/ResearchTabNav";
import { 
 Sparkles, 
 Video, 
 Copy, 
 Check, 
 FileText, 
 Clock, 
 Film, 
 CheckCircle2, 
 AlertTriangle, 
 AlertOctagon, 
 HelpCircle, 
 Lightbulb, 
 BarChart3, 
 Layers, 
 Share2, 
 Code,
 Download,
 Play,
 RotateCcw,
 MonitorPlay,
 Sliders,
 BookOpen,
 Plus,
 Trash2,
 Save,
 FileCode,
 ShieldCheck,
 Search,
 ExternalLink,
 Award,
 Info,
 X,
 Package,
 Activity,
 Workflow,
 CheckCircle,
 ArrowRight,
 Send,
 Radio,
 Smartphone,
 Tv,
 Image as ImageIcon,
 RefreshCw,
 SlidersHorizontal,
 UploadCloud,
 CheckCheck,
 History,
 HeartPulse,
 Flame,
 ShieldAlert,
 FileCheck2,
 Compass,
 AlertCircle,
 CheckSquare,
 Crosshair,
 BadgeAlert,
 Calendar,
 Lock,
 Globe,
 Share,
 Upload,
 Network,
 Eye,
 GitBranch,
 GitMerge,
 Terminal,
 Zap,
 PlayCircle,
 Undo2,
 Unlock,
 MessageSquare,
 FlaskConical,
 Cpu,
 GitCompare,
 Boxes,
 FileArchive,
 Settings,
 Receipt,
 SendHorizontal,
 Scale,
 Target
} from "lucide-react";
import {
 CreatorExecutionPlan,
 CreatorExecutionApproval,
 CreatorStagedExecution,
 CreatorExecutionValidationReport,
 CreatorExecutionAuditEvent,
 CreatorExecutionOperation,
} from "@/lib/creator/execution/creator-execution.types";
import {
 ProjectIntegrityCertificate,
 CertificationBlocker,
 ReleaseLockRecord,
 HandoffManifest,
 CertificationChangeReport,
 CertificationAuditEvent,
} from "@/lib/creator/certification/creator-certification.types";
import {
 CreatorPerformanceSnapshot,
 CreatorLearningInsight,
 AudienceSignalRecord,
 CreatorExperimentRecord,
 ResearchOpportunityRecord,
 PerformanceAuditEvent,
} from "@/lib/creator/performance/performance.types";
import {
 IngestionSnapshot,
 CrossProjectSynthesisReport,
 BenchmarkComparisonPair,
 CreatorIntelligenceInsight,
 PlatformObservationItem,
 AdapterPlatform,
 BenchmarkSpecification,
 IntelligenceAuditEvent,
} from "@/lib/creator/intelligence/intelligence.types";
import {
 ProductionMatrix,
 ProductionVariant,
 ProductionVariantType,
 ProductionMatrixAuditEvent,
 BenchmarkDiffRecord,
 AssetAssemblyPlan,
} from "@/lib/creator/production-matrix/production-matrix.provider";
import {
 CreatorExportPackage,
 CreatorExportAsset,
 CreatorExportTarget,
 RenderManifest,
 PackageValidationReport,
 ExportReadinessReport,
 ExportAuditEvent,
} from "@/lib/creator/export/creator-export.provider";
import {
 PublishingPlan,
 PublishingTargetPlan,
 PublishingTargetPlatform,
 PublishingMode,
 PreflightResult,
 DistributionReceipt,
 PublishingAuditEvent,
 PostPublishVerificationReport,
} from "@/lib/creator/publishing/creator-publishing.provider";
import {
 ContinuousReleaseHealthReport,
 PublicationReconciliationRecord,
 PublicationChangeRecord,
 PublicationLineageTrace,
 PublicationAuditEvent as PubIntegrityAuditEvent,
} from "@/lib/creator/publication-integrity/publication-integrity.provider";
import {
 CalibrationCandidate,
 CalibrationQueueItem,
 CalibrationResult,
 ResearchValidationTask,
 ResearchCalibrationAuditEvent,
 ResearchCalibrationSnapshot,
} from "@/lib/creator/research-calibration/research-calibration.provider";

import {
 ResearchHypothesis,
 CompetingHypothesisGroup,
 EvidenceAttachment,
 HypothesisPrediction,
 HypothesisValidationTask,
 HypothesisHealthReconciliation,
 HypothesisGraph,
 HypothesisSnapshot,
 HypothesisLineageTrace,
 HypothesisAuditEvent,
} from "@/lib/creator/hypothesis-reconciliation/hypothesis.types";
import { HypothesisOpportunity } from "@/lib/creator/hypothesis-reconciliation/hypothesis.opportunity.engine";
import { 
 CreatorStudioReport, 
 ScriptSection, 
 TalkingPoint, 
 CreatorHook, 
 TargetVideoDuration,
 ScriptOutputMode
} from "@/lib/creator/creator-studio.types";
import { 
 CreatorProductionPreferences, 
 DEFAULT_PRODUCTION_PREFERENCES, 
 PRODUCTION_ASSET_DEFINITIONS 
} from "@/lib/creator/production-preferences.types";
import { 
 CreatorScriptTrainingProfile, 
 ScriptTrainingSample, 
 DEFAULT_SCRIPT_TRAINING_PROFILE 
} from "@/lib/creator/script-training.types";
import { 
 TimelineExportResult, 
 TimelineExportOptions 
} from "@/lib/creator/timeline/timeline.types";
import { 
 ScriptQualityReviewReport, 
 StatementEvidenceDetail 
} from "@/lib/creator/quality/script-quality.types";
import {
 CreatorWorkflowState,
 CreatorWorkflowReadinessReport,
 CreatorProductionPackage,
} from "@/lib/creator/workflow/creator-workflow.types";
import {
 PublishingPreflightReport,
 CreatorDeliveryManifest,
 ThumbnailCopyCandidate,
 ShortsScriptAdaptation,
 PodcastScriptAdaptation,
} from "@/lib/creator/publishing/publishing.types";
import {
 TimelineSyncPlan,
 TimelineSyncOperation,
 ImportedTimelineResult,
 EditorIntegrationStatus,
} from "@/lib/creator/editor/editor-integration.types";
import {
 CreatorImpactReport,
 ResearchChangeSet,
 ResearchChange,
 CreatorAssetImpact,
 ClaimImpact,
} from "@/lib/creator/changes/research-changes.types";
import {
 ResearchHealthReport,
 ClaimHealthRecord,
 EvidenceItemHealth,
 RevalidationPlan,
} from "@/lib/research-health/research-health.types";
import {
 ResearchHealthDecisionReport,
 ResearchHealthDecision,
 ResearchHealthAction,
 CreatorDecisionRecord,
 AssetDecisionContext,
} from "@/lib/research-health/decision/research-health-decision.types";
import {
 CreatorDistributionPackage,
 PlatformStagingPackage,
 DistributionReadinessReport,
 DistributionAuditEvent,
 DistributionBlockerExplanation,
 DistributionPlatform,
} from "@/lib/creator/distribution/distribution.types";
import {
 CreatorProjectOverview,
 CreatorProjectNode,
 CreatorProjectEdge,
 CreatorProjectBlocker,
 CreatorProjectAssetItem,
 CreatorProjectImpactPreview,
 CreatorProjectSnapshot,
} from "@/lib/creator/project/creator-project.types";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { TabBar } from "@/components/ui/TabBar";
import { CreatorTeleprompter } from "@/components/creator/CreatorTeleprompter";

export default function CreatorWorkspacePage({ params }: { params: { id: string } }) {
 const [report, setReport] = useState<CreatorStudioReport | null>(null);
 const [loading, setLoading] = useState(true);
 const [duration, setDuration] = useState<TargetVideoDuration>(12);
 const [outputMode, setOutputMode] = useState<ScriptOutputMode>("SCRIPT_READY");
 const [copiedSection, setCopiedSection] = useState<string | null>(null);
 const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);
 const [activeTab, setActiveTab] = useState<
  | "hypotheses"
  | "researchCalibration"
  | "publicationIntegrity"
  | "publishingOrchestrator"
  | "exportWorkspace"
  | "matrix"
  | "intelligence"
  | "performance"
  | "project"
  | "certification"
  | "certificationHistory"
  | "execution"
  | "executionHistory"
  | "workflow"
  | "decisions"
  | "decisionHistory"
  | "health"
  | "changes"
  | "publishing"
  | "distribution"
  | "distributionHistory"
  | "editorSync"
  | "outline"
  | "narration"
  | "hooks"
  | "titles"
  | "talkingPoints"
  | "bRoll"
  | "benchmarkCards"
  | "chapters"
  | "quality"
  | "controls"
  | "training"
  | "timeline"
  | "export"
 >("project");

 // Phase 95: Automated Competing Hypothesis, Falsification & Empirical Calibration Reconciliation State
 const [hypothesesList, setHypothesesList] = useState<ResearchHypothesis[]>([]);
 const [competingGroups, setCompetingGroups] = useState<CompetingHypothesisGroup[]>([]);
 const [evidenceAttachments, setEvidenceAttachments] = useState<EvidenceAttachment[]>([]);
 const [hypothesisPredictions, setHypothesisPredictions] = useState<HypothesisPrediction[]>([]);
 const [hypothesisValidationTasks, setHypothesisValidationTasks] = useState<HypothesisValidationTask[]>([]);
 const [hypothesisReconciliations, setHypothesisReconciliations] = useState<HypothesisHealthReconciliation[]>([]);
 const [hypothesisOpportunities, setHypothesisOpportunities] = useState<HypothesisOpportunity[]>([]);
 const [hypothesisGraph, setHypothesisGraph] = useState<HypothesisGraph | null>(null);
 const [hypothesisSnapshot, setHypothesisSnapshot] = useState<HypothesisSnapshot | null>(null);
 const [hypothesisHistory, setHypothesisHistory] = useState<HypothesisAuditEvent[]>([]);
 const [selectedHypothesisLineage, setSelectedHypothesisLineage] = useState<HypothesisLineageTrace | null>(null);
 const [isReconcilingHypotheses, setIsReconcilingHypotheses] = useState(false);
 const [hypothesisSuccessMsg, setHypothesisSuccessMsg] = useState<string | null>(null);
 const [hypothesisErrorMsg, setHypothesisErrorMsg] = useState<string | null>(null);



 // Phase 86: Closed-Loop Research Calibration Engine State
 const [calibrationCandidates, setCalibrationCandidates] = useState<CalibrationCandidate[]>([]);
 const [calibrationQueue, setCalibrationQueue] = useState<CalibrationQueueItem[]>([]);
 const [selectedCalibrationItem, setSelectedCalibrationItem] = useState<CalibrationQueueItem | null>(null);
 const [calibrationHistory, setCalibrationHistory] = useState<ResearchCalibrationAuditEvent[]>([]);
 const [calibrationSnapshot, setCalibrationSnapshot] = useState<ResearchCalibrationSnapshot | null>(null);
 const [isCalibrating, setIsCalibrating] = useState(false);
 const [validationResult, setValidationResult] = useState<CalibrationResult | null>(null);
 const [calibrationSuccessMsg, setCalibrationSuccessMsg] = useState<string | null>(null);
 const [calibrationErrorMsg, setCalibrationErrorMsg] = useState<string | null>(null);

 // Phase 85: Post-Publication Integrity Monitor & Release Health State
 const [pubReconciliations, setPubReconciliations] = useState<PublicationReconciliationRecord[]>([]);
 const [releaseHealthReport, setReleaseHealthReport] = useState<ContinuousReleaseHealthReport | null>(null);
 const [pubIntegrityHistory, setPubIntegrityHistory] = useState<PubIntegrityAuditEvent[]>([]);
 const [selectedPublication, setSelectedPublication] = useState<PublicationReconciliationRecord | null>(null);
 const [inspectedPubChanges, setInspectedPubChanges] = useState<PublicationChangeRecord[]>([]);
 const [inspectedPubLineage, setInspectedPubLineage] = useState<PublicationLineageTrace | null>(null);
 const [unverifiableStates, setUnverifiableStates] = useState<Array<{ publicationId: string; platform: string; reason: string }>>([]);
 const [isReconciling, setIsReconciling] = useState(false);
 const [pubIntegritySuccessMsg, setPubIntegritySuccessMsg] = useState<string | null>(null);
 const [pubIntegrityErrorMsg, setPubIntegrityErrorMsg] = useState<string | null>(null);

 // Phase 84: Creator Multi-Channel Publishing Orchestrator & Receipt Ledger State
 const [publishingPlan, setPublishingPlan] = useState<PublishingPlan | null>(null);
 const [publishingReceipts, setPublishingReceipts] = useState<DistributionReceipt[]>([]);
 const [publishingHistory, setPublishingHistory] = useState<PublishingAuditEvent[]>([]);
 const [selectedPublishingTarget, setSelectedPublishingTarget] = useState<PublishingTargetPlan | null>(null);
 const [isPublishingLoading, setIsPublishingLoading] = useState(false);
 const [publishingSuccessMsg, setPublishingSuccessMsg] = useState<string | null>(null);
 const [publishingErrorMsg, setPublishingErrorMsg] = useState<string | null>(null);
 const [showPublishingScheduleModal, setShowPublishingScheduleModal] = useState(false);
 const [publishingScheduleTime, setPublishingScheduleTime] = useState("");
 const [publishingScheduleTimezone, setPublishingScheduleTimezone] = useState("UTC");
 const [verificationReport, setVerificationReport] = useState<PostPublishVerificationReport | null>(null);

 // Phase 83: Creator Production Asset Package Export & Render Manifest State
 const [exportPackage, setExportPackage] = useState<CreatorExportPackage | null>(null);
 const [exportHistory, setExportHistory] = useState<ExportAuditEvent[]>([]);
 const [isExporting, setIsExporting] = useState(false);
 const [isValidatingPackage, setIsValidatingPackage] = useState(false);
 const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
 const [exportErrorMsg, setExportErrorMsg] = useState<string | null>(null);

 // Phase 82: Production Matrix, Benchmark Diff & Asset Assembly State
 const [productionMatrix, setProductionMatrix] = useState<ProductionMatrix | null>(null);
 const [selectedVariant, setSelectedVariant] = useState<ProductionVariant | null>(null);
 const [benchmarkDiff, setBenchmarkDiff] = useState<BenchmarkDiffRecord | null>(null);
 const [assemblyPlan, setAssemblyPlan] = useState<AssetAssemblyPlan | null>(null);
 const [matrixHistory, setMatrixHistory] = useState<ProductionMatrixAuditEvent[]>([]);
 const [showCreateVariantModal, setShowCreateVariantModal] = useState(false);
 const [newVariantName, setNewVariantName] = useState("");
 const [newVariantType, setNewVariantType] = useState<ProductionVariantType>("YOUTUBE_LONG_FORM");
 const [newVariantDuration, setNewVariantDuration] = useState(10);
 const [matrixSuccessMsg, setMatrixSuccessMsg] = useState<string | null>(null);
 const [matrixErrorMsg, setMatrixErrorMsg] = useState<string | null>(null);
 const [isCreatingVariant, setIsCreatingVariant] = useState(false);

 // Phase 81: Creator Intelligence Ecosystem & Benchmark Synthesis State
 const [ingestionSnapshots, setIngestionSnapshots] = useState<IngestionSnapshot[]>([]);
 const [latestIngestionSnapshot, setLatestIngestionSnapshot] = useState<IngestionSnapshot | null>(null);
 const [synthesisReport, setSynthesisReport] = useState<CrossProjectSynthesisReport | null>(null);
 const [intelInsights, setIntelInsights] = useState<CreatorIntelligenceInsight[]>([]);
 const [intelHistory, setIntelHistory] = useState<IntelligenceAuditEvent[]>([]);
 const [inspectedIntelInsight, setInspectedIntelInsight] = useState<CreatorIntelligenceInsight | null>(null);
 const [isIngesting, setIsIngesting] = useState(false);
 const [isSynthesizing, setIsSynthesizing] = useState(false);
 const [intelSuccessMsg, setIntelSuccessMsg] = useState<string | null>(null);
 const [intelErrorMsg, setIntelErrorMsg] = useState<string | null>(null);
 const [showImportModal, setShowImportModal] = useState(false);
 const [importPlatform, setImportPlatform] = useState<AdapterPlatform>("YOUTUBE");
 const [importViews, setImportViews] = useState(18500);
 const [importRetention, setImportRetention] = useState(61);
 const [importCtr, setImportCtr] = useState(7.8);

 // Phase 80: Creator Performance Intelligence & Learning State
 const [perfSnapshot, setPerfSnapshot] = useState<CreatorPerformanceSnapshot | null>(null);
 const [perfSnapshots, setPerfSnapshots] = useState<CreatorPerformanceSnapshot[]>([]);
 const [perfInsights, setPerfInsights] = useState<CreatorLearningInsight[]>([]);
 const [audienceSignals, setAudienceSignals] = useState<AudienceSignalRecord[]>([]);
 const [experiments, setExperiments] = useState<CreatorExperimentRecord[]>([]);
 const [researchOpportunities, setResearchOpportunities] = useState<ResearchOpportunityRecord[]>([]);
 const [perfHistory, setPerfHistory] = useState<PerformanceAuditEvent[]>([]);
 const [inspectedInsight, setInspectedInsight] = useState<CreatorLearningInsight | null>(null);
 const [isRecordingSnapshot, setIsRecordingSnapshot] = useState(false);
 const [isLoggingAudience, setIsLoggingAudience] = useState(false);
 const [isCreatingExperiment, setIsCreatingExperiment] = useState(false);
 const [isCreatingResearchOpp, setIsCreatingResearchOpp] = useState(false);
 const [perfSuccessMsg, setPerfSuccessMsg] = useState<string | null>(null);
 const [perfErrorMsg, setPerfErrorMsg] = useState<string | null>(null);
 const [showExperimentModal, setShowExperimentModal] = useState(false);
 const [showAudienceModal, setShowAudienceModal] = useState(false);
 const [showRecordSnapshotModal, setShowRecordSnapshotModal] = useState(false);
 const [newExpHypothesis, setNewExpHypothesis] = useState("");
 const [newExpVariable, setNewExpVariable] = useState("HOOK_STYLE");
 const [newExpControl, setNewExpControl] = useState("Direct Benchmark Hook");
 const [newExpVariant, setNewExpVariant] = useState("Efficiency Contrast Hook");
 const [newExpMetric, setNewExpMetric] = useState("averagePercentageViewed");
 const [newAudienceComment, setNewAudienceComment] = useState("");
 const [newViews, setNewViews] = useState(15000);
 const [newRetention, setNewRetention] = useState(62);
 const [newCtr, setNewCtr] = useState(7.5);

 // Phase 79: Final Project Integrity Certification & Release Lock State
 const [certificate, setCertificate] = useState<ProjectIntegrityCertificate | null>(null);
 const [certHistory, setCertHistory] = useState<CertificationAuditEvent[]>([]);
 const [certChanges, setCertChanges] = useState<CertificationChangeReport | null>(null);
 const [handoffManifest, setHandoffManifest] = useState<HandoffManifest | null>(null);
 const [inspectedCertBlocker, setInspectedCertBlocker] = useState<CertificationBlocker | null>(null);
 const [isCertifying, setIsCertifying] = useState(false);
 const [isLocking, setIsLocking] = useState(false);
 const [isUnlocking, setIsUnlocking] = useState(false);
 const [isGeneratingHandoff, setIsGeneratingHandoff] = useState(false);
 const [certSuccessMsg, setCertSuccessMsg] = useState<string | null>(null);
 const [certErrorMsg, setCertErrorMsg] = useState<string | null>(null);
 const [showLockModal, setShowLockModal] = useState(false);
 const [showUnlockModal, setShowUnlockModal] = useState(false);
 const [lockNotes, setLockNotes] = useState("");
 const [unlockReason, setUnlockReason] = useState("");

 // Phase 78: Creator Project Change Execution & Safe Action State
 const [executionPlan, setExecutionPlan] = useState<CreatorExecutionPlan | null>(null);
 const [stagedExecution, setStagedExecution] = useState<CreatorStagedExecution | null>(null);
 const [validationReport, setValidationReport] = useState<CreatorExecutionValidationReport | null>(null);
 const [executionHistory, setExecutionHistory] = useState<CreatorExecutionAuditEvent[]>([]);
 const [selectedOpIds, setSelectedOpIds] = useState<string[]>([]);
 const [inspectedOp, setInspectedOp] = useState<CreatorExecutionOperation | null>(null);
 const [isPlanning, setIsPlanning] = useState(false);
 const [isApproving, setIsApproving] = useState(false);
 const [isStaging, setIsStaging] = useState(false);
 const [isCommitting, setIsCommitting] = useState(false);
 const [isRollingBack, setIsRollingBack] = useState(false);
 const [executionSuccessMsg, setExecutionSuccessMsg] = useState<string | null>(null);
 const [executionErrorMsg, setExecutionErrorMsg] = useState<string | null>(null);
 const [showCommitModal, setShowCommitModal] = useState(false);
 const [showRollbackModal, setShowRollbackModal] = useState(false);

 // Phase 77: Creator Project Intelligence Workspace State
 const [projectOverview, setProjectOverview] = useState<CreatorProjectOverview | null>(null);
 const [inspectedProjectNode, setInspectedProjectNode] = useState<CreatorProjectNode | null>(null);
 const [inspectedProjectBlocker, setInspectedProjectBlocker] = useState<CreatorProjectBlocker | null>(null);
 const [simulationTargetId, setSimulationTargetId] = useState<string>("");
 const [simulationAction, setSimulationAction] = useState<string>("BENCHMARK_SCORE_CHANGED");
 const [simulationPreview, setSimulationPreview] = useState<CreatorProjectImpactPreview | null>(null);
 const [isSimulating, setIsSimulating] = useState(false);

 // Phase 70: Workflow & Readiness State
 const [workflowState, setWorkflowState] = useState<CreatorWorkflowState>("SCRIPT_READY");
 const [readiness, setReadiness] = useState<CreatorWorkflowReadinessReport | null>(null);
 const [productionPkg, setProductionPkg] = useState<CreatorProductionPackage | null>(null);

 // Phase 71: Publishing Preflight & Delivery Manifest State
 const [preflight, setPreflight] = useState<PublishingPreflightReport | null>(null);
 const [deliveryManifest, setDeliveryManifest] = useState<CreatorDeliveryManifest | null>(null);

 // Phase 72: Video Editor Sync & Timeline Integration State
 const [syncPlan, setSyncPlan] = useState<TimelineSyncPlan | null>(null);
 const [editorStatus, setEditorStatus] = useState<{ status: EditorIntegrationStatus; message: string } | null>(null);
 // Real claims for this run. The impact-simulation control previously offered two hardcoded
 // options ("Claim #4: S27 Ultra sustained thermal limit is 45°C", "Claim #7: A18 Pro
 // benchmark multicore score") that referenced a different phone entirely and did not exist
 // in any run — so the simulation always posted an unknown id and silently returned nothing.
 const [runClaims, setRunClaims] = useState<Array<{ id: string; claim_text: string }>>([]);
 const [simulationError, setSimulationError] = useState<string | null>(null);
 const [importedContent, setImportedContent] = useState("");
 const [importedResult, setImportedResult] = useState<ImportedTimelineResult | null>(null);
 const [isImporting, setIsImporting] = useState(false);
 const [inspectedSyncOp, setInspectedSyncOp] = useState<TimelineSyncOperation | null>(null);
 const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

 // Phase 73: Research Change Detection & Impact Intelligence State
 const [impactReport, setImpactReport] = useState<CreatorImpactReport | null>(null);
 const [inspectedAssetImpact, setInspectedAssetImpact] = useState<CreatorAssetImpact | null>(null);
 const [isRegenerating, setIsRegenerating] = useState(false);
 const [regenerationSuccessMsg, setRegenerationSuccessMsg] = useState<string | null>(null);

 // Phase 74: Evidence Freshness & Claim Health State
 const [healthReport, setHealthReport] = useState<ResearchHealthReport | null>(null);
 const [inspectedClaimHealth, setInspectedClaimHealth] = useState<ClaimHealthRecord | null>(null);
 const [isRevalidating, setIsRevalidating] = useState(false);
 const [revalidationSuccessMsg, setRevalidationSuccessMsg] = useState<string | null>(null);

 // Phase 75: Research Health Decision Control Center State
 const [decisionReport, setDecisionReport] = useState<ResearchHealthDecisionReport | null>(null);
 const [decisionHistory, setDecisionHistory] = useState<CreatorDecisionRecord[]>([]);
 const [inspectedDecision, setInspectedDecision] = useState<ResearchHealthDecision | null>(null);
 const [pendingActionForConfirm, setPendingActionForConfirm] = useState<ResearchHealthAction | null>(null);
 const [isExecutingDecisionAction, setIsExecutingDecisionAction] = useState(false);
 const [decisionActionSuccessMsg, setDecisionActionSuccessMsg] = useState<string | null>(null);

 // Phase 76: Distribution Pipeline & Release Staging State
 const [distPackage, setDistPackage] = useState<CreatorDistributionPackage | null>(null);
 const [distHistory, setDistHistory] = useState<DistributionAuditEvent[]>([]);
 const [inspectedPlatformPackage, setInspectedPlatformPackage] = useState<PlatformStagingPackage | null>(null);
 const [inspectedDistBlocker, setInspectedDistBlocker] = useState<DistributionBlockerExplanation | null>(null);
 const [targetForApproval, setTargetForApproval] = useState<PlatformStagingPackage | null>(null);
 const [targetForSchedule, setTargetForSchedule] = useState<PlatformStagingPackage | null>(null);
 const [scheduleDateTime, setScheduleDateTime] = useState<string>("");
 const [scheduleTimezone, setScheduleTimezone] = useState<string>("America/New_York");
 const [scheduleNote, setScheduleNote] = useState<string>("");
 const [isDistActionLoading, setIsDistActionLoading] = useState(false);
 const [distActionSuccessMsg, setDistActionSuccessMsg] = useState<string | null>(null);

 // Phase 68: Production Preferences state
 const [preferences, setPreferences] = useState<CreatorProductionPreferences>(DEFAULT_PRODUCTION_PREFERENCES);
 
 // Phase 68: Script Training Profile state
 const [profile, setProfile] = useState<CreatorScriptTrainingProfile>(DEFAULT_SCRIPT_TRAINING_PROFILE);
 const [isSavingProfile, setIsSavingProfile] = useState(false);
 const [newSampleTitle, setNewSampleTitle] = useState("");
 const [newSampleCategory, setNewSampleCategory] = useState<string>("TECH_REVIEW");
 const [newSampleBody, setNewSampleBody] = useState("");

 // Phase 68: Timeline Export state
 const [timelineFormat, setTimelineFormat] = useState<"EDL" | "FCPXML">("EDL");
 const [timelineFps, setTimelineFps] = useState<number>(24);
 const [timelineOptions, setTimelineOptions] = useState({
  includeSections: true,
  includeBRoll: true,
  includeBenchmarkCards: true,
  includeChapters: true,
  includeThermals: true,
 });
 const [timelineResult, setTimelineResult] = useState<TimelineExportResult | null>(null);
 const [generatingTimeline, setGeneratingTimeline] = useState(false);

 // Phase 69: Statement Evidence Inspector Modal
 const [inspectedStatement, setInspectedStatement] = useState<StatementEvidenceDetail | null>(null);

 const copyToClipboard = (text: string, sectionName: string) => {
  navigator.clipboard.writeText(text);
  setCopiedSection(sectionName);
  setTimeout(() => setCopiedSection(null), 2000);
 };

 const loadProjectOverview = () => {
  fetch(`/api/research/${params.id}/creator-project`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.project) {
     setProjectOverview(data.project);
    }
   })
   .catch(() => {});
 };

 const loadReport = (
  targetDur: TargetVideoDuration, 
  currentPrefs: CreatorProductionPreferences, 
  currentProfile?: CreatorScriptTrainingProfile,
  currentMode: ScriptOutputMode = outputMode
 ) => {
  setLoading(true);
  fetch(`/api/research/${params.id}/creator-workflow`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    duration: targetDur,
    preferences: currentPrefs,
    profile: currentProfile,
    outputMode: currentMode,
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.report) {
     setReport(data.report);
     setDuration(data.report.targetDurationMinutes || targetDur);
     setOutputMode(data.report.outputMode || currentMode);
     if (data.readiness) setReadiness(data.readiness);
     if (data.workflowState) setWorkflowState(data.workflowState);
     loadProjectOverview();
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setLoading(false));
 };

 const loadPreflight = (currentPrefs: CreatorProductionPreferences) => {
  fetch(`/api/research/${params.id}/creator-publishing/preflight`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ preferences: currentPrefs, profile }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.preflight) {
     setPreflight(data.preflight);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-publishing/manifest`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.manifest) {
     setDeliveryManifest(data.manifest);
    }
   })
   .catch(() => {});
 };

 const loadEditorSync = () => {
  fetch(`/api/research/${params.id}/creator-editor`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.editorStatus) setEditorStatus(data.editorStatus);
     if (data.syncPlan) setSyncPlan(data.syncPlan);
    }
   })
   .catch(() => {});
 };

 const loadChanges = () => {
  fetch(`/api/research/${params.id}/creator-changes`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.impactReport) {
     setImpactReport(data.impactReport);
    }
   })
   .catch(() => {});
 };

 const loadHealth = () => {
  fetch(`/api/research/${params.id}/health`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.healthReport) {
     setHealthReport(data.healthReport);
    }
   })
   .catch(() => {});
 };

 const loadDecisions = () => {
  fetch(`/api/research/${params.id}/health/decisions`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.decisionReport) {
     setDecisionReport(data.decisionReport);
    }
   })
   .catch(() => {});
 };

 const loadDecisionHistory = () => {
  fetch(`/api/research/${params.id}/health/decisions/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setDecisionHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const loadDistribution = () => {
  fetch(`/api/research/${params.id}/creator-distribution`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.distributionPackage) {
     setDistPackage(data.distributionPackage);
    }
   })
   .catch(() => {});
 };

 const loadDistributionHistory = () => {
  fetch(`/api/research/${params.id}/creator-distribution/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setDistHistory(data.history);
    }
   })
   .catch(() => {});
 };

 // Load initial data
 useEffect(() => {
  fetch(`/api/research/${params.id}/status`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.run) setRunClaims(data.run.claims || []);
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-studio/training`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.profile) {
     setProfile(data.profile);
    }
   })
   .catch(() => {});

  loadReport(duration, preferences, undefined, outputMode);
  loadPreflight(preferences);
  loadEditorSync();
  loadChanges();
  loadHealth();
  loadDecisions();
  loadDecisionHistory();
  loadDistribution();
  loadDistributionHistory();
  loadProjectOverview();
  loadHypothesisState();

  fetch(`/api/research/${params.id}/creator-workflow/package`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.package) {
     setProductionPkg(data.package);
    }
   })
   .catch(() => {});
 }, [params.id]);

 const handleDurationChange = (newDur: TargetVideoDuration) => {
  setDuration(newDur);
  loadReport(newDur, preferences, profile, outputMode);
 };

 const handleModeChange = (newMode: ScriptOutputMode) => {
  setOutputMode(newMode);
  loadReport(duration, preferences, profile, newMode);
 };

 const handlePreferenceToggle = (key: keyof CreatorProductionPreferences) => {
  const updated = { ...preferences, [key]: !preferences[key] };
  setPreferences(updated);
  loadReport(duration, updated, profile, outputMode);
  loadPreflight(updated);
  loadDistribution();
  loadProjectOverview();
 };

 const handleSaveProfile = () => {
  setIsSavingProfile(true);
  fetch(`/api/research/${params.id}/creator-studio/training`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify(profile),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.profile) {
     setProfile(data.profile);
     loadReport(duration, preferences, data.profile, outputMode);
     loadPreflight(preferences);
     loadDistribution();
     loadProjectOverview();
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsSavingProfile(false));
 };

 // Phase 95: Automated Competing Hypothesis, Falsification & Empirical Calibration Handlers
 const loadHypothesisState = () => {
  fetch(`/api/research/${params.id}/hypotheses`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.hypotheses) {
      setHypothesesList(data.data.hypotheses);
      if (!selectedHypothesisLineage && data.data.hypotheses?.length > 0) {
       loadHypothesisLineage(data.data.hypotheses[0].hypothesisId);
      }
     }
     if (data.data.competingGroups) setCompetingGroups(data.data.competingGroups);
     if (data.data.evidence) setEvidenceAttachments(data.data.evidence);
     if (data.data.predictions) setHypothesisPredictions(data.data.predictions);
     if (data.data.validationTasks) setHypothesisValidationTasks(data.data.validationTasks);
     if (data.data.reconciliations) setHypothesisReconciliations(data.data.reconciliations);
     if (data.data.opportunities) setHypothesisOpportunities(data.data.opportunities);
     if (data.data.graph) setHypothesisGraph(data.data.graph);
     if (data.data.snapshot) setHypothesisSnapshot(data.data.snapshot);
     if (data.data.history) setHypothesisHistory(data.data.history);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/hypothesis-history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setHypothesisHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadHypothesisLineage = (hypothesisId: string) => {
  fetch(`/api/research/${params.id}/hypotheses/${hypothesisId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setSelectedHypothesisLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleBridgeHypothesisValidationTask = (taskId: string) => {
  setHypothesisErrorMsg(null);
  fetch(`/api/research/${params.id}/hypotheses/task-bridge/validation`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ taskId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setHypothesisSuccessMsg("Hypothesis validation requirement bridged to Phase 86 calibration queue.");
     setTimeout(() => setHypothesisSuccessMsg(null), 4000);
     loadHypothesisState();
    } else {
     setHypothesisErrorMsg(data.error || "Failed to bridge validation task.");
    }
   })
   .catch((err) => setHypothesisErrorMsg(err.message || "Failed to bridge validation task."));
 };



 // Phase 86: Closed-Loop Research Calibration Engine Handlers
 const loadCalibrationState = () => {
  fetch(`/api/research/${params.id}/research-calibration`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.candidates) setCalibrationCandidates(data.candidates);
     if (data.queue) {
      setCalibrationQueue(data.queue);
      if (!selectedCalibrationItem && data.queue.length > 0) {
       setSelectedCalibrationItem(data.queue[0]);
      }
     }
     if (data.snapshot) setCalibrationSnapshot(data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/research-calibration/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setCalibrationHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleAssessCandidate = (candidateId: string) => {
  setIsCalibrating(true);
  setCalibrationErrorMsg(null);
  fetch(`/api/research/${params.id}/research-calibration/assess`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ candidateId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.queueItem) {
     setCalibrationSuccessMsg("Candidate assessed and queued.");
     setTimeout(() => setCalibrationSuccessMsg(null), 4000);
     loadCalibrationState();
    } else {
     setCalibrationErrorMsg(data.error || "Assessment failed.");
    }
   })
   .catch((err) => setCalibrationErrorMsg(err.message || "Assessment failed."))
   .finally(() => setIsCalibrating(false));
 };

 const handleValidateQueueItem = (queueItemId: string) => {
  setIsCalibrating(true);
  setCalibrationErrorMsg(null);
  fetch(`/api/research/${params.id}/research-calibration/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ queueItemId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.result) setValidationResult(data.result);
     setCalibrationSuccessMsg("Explicit research validation completed.");
     setTimeout(() => setCalibrationSuccessMsg(null), 4000);
     loadCalibrationState();
    } else {
     setCalibrationErrorMsg(data.error || "Validation failed.");
    }
   })
   .catch((err) => setCalibrationErrorMsg(err.message || "Validation failed."))
   .finally(() => setIsCalibrating(false));
 };

 // Phase 85: Post-Publication Integrity & Reconciliation Handlers
 const loadPublicationIntegrityState = () => {
  fetch(`/api/research/${params.id}/publication-integrity`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.health) setReleaseHealthReport(data.health);
     if (data.publications) {
      setPubReconciliations(data.publications);
      if (!selectedPublication && data.publications.length > 0) {
       setSelectedPublication(data.publications[0]);
       setInspectedPubChanges(data.publications[0].changes || []);
       setInspectedPubLineage(data.publications[0].lineage || null);
      }
     }
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/publication-integrity/unverifiable`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.unverifiable) {
     setUnverifiableStates(data.unverifiable);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/publication-integrity/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setPubIntegrityHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleReconcilePublications = () => {
  setIsReconciling(true);
  setPubIntegrityErrorMsg(null);
  fetch(`/api/research/${params.id}/publication-integrity/reconcile`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setPubReconciliations(data.records || []);
     setReleaseHealthReport(data.health || null);
     setPubIntegritySuccessMsg("Publication reconciliation completed.");
     setTimeout(() => setPubIntegritySuccessMsg(null), 4000);
     loadPublicationIntegrityState();
    } else {
     setPubIntegrityErrorMsg(data.error || "Reconciliation failed.");
    }
   })
   .catch((err) => setPubIntegrityErrorMsg(err.message || "Reconciliation failed."))
   .finally(() => setIsReconciling(false));
 };

 // Phase 84: Creator Multi-Channel Publishing Orchestrator & Receipt Ledger Handlers
 const loadPublishingState = () => {
  fetch(`/api/research/${params.id}/creator-publishing`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setPublishingPlan(data.plan);
     if (!selectedPublishingTarget && data.plan.targets.length > 0) {
      setSelectedPublishingTarget(data.plan.targets[0]);
     }
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-publishing/receipts`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.receipts) {
     setPublishingReceipts(data.receipts);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-publishing/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setPublishingHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleApprovePublishingTarget = (targetId: string) => {
  setIsPublishingLoading(true);
  setPublishingErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-publishing/approve`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ targetId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setPublishingPlan(data.plan);
     setPublishingSuccessMsg("Target approval granted.");
     setTimeout(() => setPublishingSuccessMsg(null), 4000);
     loadPublishingState();
    } else {
     setPublishingErrorMsg(data.error || "Failed to approve target.");
    }
   })
   .catch((err) => setPublishingErrorMsg(err.message || "Approval failed."))
   .finally(() => setIsPublishingLoading(false));
 };

 const handleStagePublishingTarget = (targetId: string) => {
  setIsPublishingLoading(true);
  setPublishingErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-publishing/stage`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ targetId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setPublishingPlan(data.plan);
     setPublishingSuccessMsg("Target staged for publishing.");
     setTimeout(() => setPublishingSuccessMsg(null), 4000);
     loadPublishingState();
    } else {
     setPublishingErrorMsg(data.error || "Failed to stage target.");
    }
   })
   .catch((err) => setPublishingErrorMsg(err.message || "Staging failed."))
   .finally(() => setIsPublishingLoading(false));
 };

 const handlePublishTargetExecution = (targetId: string) => {
  setIsPublishingLoading(true);
  setPublishingErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-publishing/publish`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ targetId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setPublishingPlan(data.plan);
     setPublishingSuccessMsg("Publish operation completed (STAGING_ONLY logged in receipt ledger).");
     setTimeout(() => setPublishingSuccessMsg(null), 4000);
     loadPublishingState();
    } else {
     setPublishingErrorMsg(data.error || "Publishing failed.");
    }
   })
   .catch((err) => setPublishingErrorMsg(err.message || "Publishing execution failed."))
   .finally(() => setIsPublishingLoading(false));
 };

 const handleSchedulePublishingTarget = (targetId: string) => {
  if (!publishingScheduleTime) return;
  setIsPublishingLoading(true);
  setPublishingErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-publishing/schedule`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    targetId,
    schedulingConfig: {
     scheduledTimestamp: new Date(publishingScheduleTime).toISOString(),
     timezoneIana: publishingScheduleTimezone,
     isScheduled: true,
    },
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setPublishingPlan(data.plan);
     setShowPublishingScheduleModal(false);
     setPublishingSuccessMsg("Target scheduled successfully.");
     setTimeout(() => setPublishingSuccessMsg(null), 4000);
     loadPublishingState();
    } else {
     setPublishingErrorMsg(data.error || "Scheduling failed.");
    }
   })
   .catch((err) => setPublishingErrorMsg(err.message || "Scheduling failed."))
   .finally(() => setIsPublishingLoading(false));
 };

 const handleCancelPublishingTarget = (targetId: string) => {
  fetch(`/api/research/${params.id}/creator-publishing/cancel`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ targetId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setPublishingSuccessMsg("Publishing target cancelled.");
     setTimeout(() => setPublishingSuccessMsg(null), 4000);
     loadPublishingState();
    }
   })
   .catch(() => {});
 };

 const handleVerifyDistributionReceipt = (receiptId: string) => {
  fetch(`/api/research/${params.id}/creator-publishing/verify`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ receiptId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.report) {
     setVerificationReport(data.report);
    }
   })
   .catch(() => {});
 };

 // Phase 83: Creator Production Asset Package Export & Render Manifest Handlers
 const loadExportState = () => {
  fetch(`/api/research/${params.id}/creator-export`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.package) {
     setExportPackage(data.package);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-export/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setExportHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleValidateExportPackage = () => {
  setIsValidatingPackage(true);
  setExportErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-export/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.package) {
     setExportPackage(data.package);
     setExportSuccessMsg("Export package validation completed.");
     setTimeout(() => setExportSuccessMsg(null), 4000);
    } else {
     setExportErrorMsg(data.error || "Failed to validate export package.");
    }
   })
   .catch((err) => setExportErrorMsg(err.message || "Failed to validate export package."))
   .finally(() => setIsValidatingPackage(false));
 };

 const handleExecuteExport = () => {
  if (!exportPackage) return;
  setIsExporting(true);
  setExportErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-export/export`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ packageId: exportPackage.packageId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.package) {
     setExportPackage(data.package);
     setExportSuccessMsg(`Export completed successfully for "${data.package.name}".`);
     setTimeout(() => setExportSuccessMsg(null), 4000);
     loadExportState();
    } else {
     setExportErrorMsg(data.error || "Export failed.");
    }
   })
   .catch((err) => setExportErrorMsg(err.message || "Export failed."))
   .finally(() => setIsExporting(false));
 };

 const handleCancelExport = () => {
  if (!exportPackage) return;
  fetch(`/api/research/${params.id}/creator-export/cancel`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ packageId: exportPackage.packageId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setExportSuccessMsg("Export package cancelled.");
     setTimeout(() => setExportSuccessMsg(null), 4000);
     loadExportState();
    }
   })
   .catch(() => {});
 };

 // Phase 82: Production Matrix, Benchmark Diff & Asset Assembly Handlers
 const loadMatrixState = () => {
  fetch(`/api/research/${params.id}/production-matrix`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.matrix) {
     setProductionMatrix(data.matrix);
     if (!selectedVariant && data.matrix.variants.length > 0) {
      setSelectedVariant(data.matrix.variants[0]);
     }
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/benchmark-diff`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.diff) {
     setBenchmarkDiff(data.diff);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/asset-assembly`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setAssemblyPlan(data.plan);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/production-matrix/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setMatrixHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleCreateVariant = () => {
  if (!newVariantName.trim()) return;
  setIsCreatingVariant(true);
  setMatrixErrorMsg(null);
  fetch(`/api/research/${params.id}/production-matrix/variant`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    name: newVariantName.trim(),
    variantType: newVariantType,
    targetDurationMinutes: Number(newVariantDuration),
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.variant) {
     setShowCreateVariantModal(false);
     setNewVariantName("");
     setMatrixSuccessMsg(`Production variant "${data.variant.name}" created.`);
     setTimeout(() => setMatrixSuccessMsg(null), 4000);
     loadMatrixState();
    } else {
     setMatrixErrorMsg(data.error || "Failed to create variant.");
    }
   })
   .catch((err) => setMatrixErrorMsg(err.message || "Failed to create variant."))
   .finally(() => setIsCreatingVariant(false));
 };

 // Phase 81: Creator Intelligence Ecosystem & Benchmark Synthesis Handlers
 const loadIntelligenceState = () => {
  fetch(`/api/research/${params.id}/creator-intelligence`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.snapshots) setIngestionSnapshots(data.snapshots);
     if (data.latestSnapshot) setLatestIngestionSnapshot(data.latestSnapshot);
     if (data.latestSynthesis) setSynthesisReport(data.latestSynthesis);
     if (data.insights) setIntelInsights(data.insights);
     if (data.history) setIntelHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleImportPlatformData = () => {
  setIsIngesting(true);
  setIntelErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-intelligence/import`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    platform: importPlatform,
    measurementWindow: "FIRST_48_HOURS",
    data: {
     views: Number(importViews),
     retention: Number(importRetention),
     ctr: Number(importCtr),
     watchTimeHours: Math.round((Number(importViews) * Number(importRetention) * 12) / 6000),
     likes: Math.round(Number(importViews) * 0.065),
     comments: Math.round(Number(importViews) * 0.012),
    },
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowImportModal(false);
     setIntelSuccessMsg("Platform data validated and snapshot ingested.");
     setTimeout(() => setIntelSuccessMsg(null), 4000);
     loadIntelligenceState();
    } else {
     setIntelErrorMsg(data.errors?.join(", ") || data.error || "Failed to import platform data.");
    }
   })
   .catch((err) => setIntelErrorMsg(err.message || "Failed to import platform data."))
   .finally(() => setIsIngesting(false));
 };

 const handleRunBenchmarkSynthesis = () => {
  setIsSynthesizing(true);
  setIntelErrorMsg(null);
  setTimeout(() => {
   setIntelSuccessMsg("Cross-project benchmark synthesis verified.");
   setTimeout(() => setIntelSuccessMsg(null), 4000);
   setIsSynthesizing(false);
  }, 400);
 };

 // Phase 80: Creator Performance Intelligence & Learning Handlers
 const loadPerformanceState = () => {
  fetch(`/api/research/${params.id}/creator-performance`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.latestSnapshot) setPerfSnapshot(data.latestSnapshot);
     if (data.snapshots) setPerfSnapshots(data.snapshots);
     if (data.insights) setPerfInsights(data.insights);
     if (data.audienceSignals) setAudienceSignals(data.audienceSignals);
     if (data.experiments) setExperiments(data.experiments);
     if (data.researchOpportunities) setResearchOpportunities(data.researchOpportunities);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-performance/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setPerfHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleRecordPerformanceSnapshot = () => {
  setIsRecordingSnapshot(true);
  setPerfErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-performance/snapshot`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    platform: "YOUTUBE_LONG_FORM",
    measurementWindow: "FIRST_48_HOURS",
    metrics: {
     views: { name: "Views", value: Number(newViews), availability: "AVAILABLE" },
     averagePercentageViewed: { name: "Average % Viewed", value: Number(newRetention), unit: "%", availability: "AVAILABLE" },
     ctr: { name: "Click-Through Rate", value: Number(newCtr), unit: "%", availability: "AVAILABLE" },
     watchTimeHours: { name: "Watch Time", value: Math.round((Number(newViews) * Number(newRetention) * 12) / 6000), unit: "hrs", availability: "AVAILABLE" },
     likes: { name: "Likes", value: Math.round(Number(newViews) * 0.06), availability: "AVAILABLE" },
     comments: { name: "Comments", value: Math.round(Number(newViews) * 0.01), availability: "AVAILABLE" },
    },
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowRecordSnapshotModal(false);
     setPerfSuccessMsg("Performance snapshot recorded successfully.");
     setTimeout(() => setPerfSuccessMsg(null), 4000);
     loadPerformanceState();
    } else {
     setPerfErrorMsg(data.error || "Failed to record performance snapshot.");
    }
   })
   .catch((err) => setPerfErrorMsg(err.message || "Failed to record snapshot."))
   .finally(() => setIsRecordingSnapshot(false));
 };

 const handleLogAudienceComment = () => {
  if (!newAudienceComment.trim()) return;
  setIsLoggingAudience(true);
  setPerfErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-performance/audience`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ commentText: newAudienceComment }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowAudienceModal(false);
     setNewAudienceComment("");
     setPerfSuccessMsg("Audience signal recorded (marked requires validation).");
     setTimeout(() => setPerfSuccessMsg(null), 4000);
     loadPerformanceState();
    } else {
     setPerfErrorMsg(data.error || "Failed to log audience comment.");
    }
   })
   .catch((err) => setPerfErrorMsg(err.message || "Failed to log audience comment."))
   .finally(() => setIsLoggingAudience(false));
 };

 const handleCreateExperiment = () => {
  if (!newExpHypothesis.trim()) return;
  setIsCreatingExperiment(true);
  setPerfErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-performance/experiment`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    hypothesis: newExpHypothesis,
    variable: newExpVariable,
    control: newExpControl,
    variant: newExpVariant,
    primaryMetric: newExpMetric,
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowExperimentModal(false);
     setNewExpHypothesis("");
     setPerfSuccessMsg("Creator experiment initialized.");
     setTimeout(() => setPerfSuccessMsg(null), 4000);
     loadPerformanceState();
    } else {
     setPerfErrorMsg(data.error || "Failed to create experiment.");
    }
   })
   .catch((err) => setPerfErrorMsg(err.message || "Failed to create experiment."))
   .finally(() => setIsCreatingExperiment(false));
 };

 const handleCreateResearchOpportunity = (signalId: string) => {
  setIsCreatingResearchOpp(true);
  setPerfErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-performance/research-opportunity`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ signalId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setPerfSuccessMsg("Research opportunity queued for evidence investigation.");
     setTimeout(() => setPerfSuccessMsg(null), 4000);
     loadPerformanceState();
    } else {
     setPerfErrorMsg(data.error || "Failed to bridge to research opportunity.");
    }
   })
   .catch((err) => setPerfErrorMsg(err.message || "Failed to bridge to research opportunity."))
   .finally(() => setIsCreatingResearchOpp(false));
 };

 // Phase 79: Final Project Integrity Certification Handlers
 const loadCertificationState = () => {
  fetch(`/api/research/${params.id}/creator-certification`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.certificate) {
     setCertificate(data.certificate);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-certification/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setCertHistory(data.history);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-certification/changes`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.changes) {
     setCertChanges(data.changes);
    }
   })
   .catch(() => {});
 };

 const handleEvaluateCertification = () => {
  setIsCertifying(true);
  setCertErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-certification/evaluate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ productionPreferences: preferences }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.certificate) {
     setCertificate(data.certificate);
     setCertSuccessMsg(`Certification complete: ${data.certificate.status} (${data.certificate.overallIntegrityScore}% score)`);
     setTimeout(() => setCertSuccessMsg(null), 4000);
     loadCertificationState();
    } else {
     setCertErrorMsg(data.error || "Failed to evaluate project certification.");
    }
   })
   .catch((err) => setCertErrorMsg(err.message || "Failed to evaluate certification."))
   .finally(() => setIsCertifying(false));
 };

 const handleApplyReleaseLock = () => {
  setIsLocking(true);
  setCertErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-certification/lock`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ notes: lockNotes }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowLockModal(false);
     setLockNotes("");
     setCertSuccessMsg("Release Lock applied successfully. Snapshot is locked for handoff/release.");
     setTimeout(() => setCertSuccessMsg(null), 4000);
     loadCertificationState();
    } else {
     setCertErrorMsg(data.error || "Failed to apply Release Lock.");
    }
   })
   .catch((err) => setCertErrorMsg(err.message || "Failed to apply Release Lock."))
   .finally(() => setIsLocking(false));
 };

 const handleUnlockRelease = () => {
  setIsUnlocking(true);
  setCertErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-certification/unlock`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ reason: unlockReason }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setShowUnlockModal(false);
     setUnlockReason("");
     setCertSuccessMsg("Release Lock removed.");
     setTimeout(() => setCertSuccessMsg(null), 4000);
     loadCertificationState();
    } else {
     setCertErrorMsg(data.error || "Failed to unlock release.");
    }
   })
   .catch((err) => setCertErrorMsg(err.message || "Failed to unlock release."))
   .finally(() => setIsUnlocking(false));
 };

 const handleGenerateHandoff = () => {
  setIsGeneratingHandoff(true);
  setCertErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-certification/handoff`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.manifest) {
     setHandoffManifest(data.manifest);
     setCertSuccessMsg(`Handoff Manifest compiled with ${data.manifest.includedAssets.length} verified assets.`);
     setTimeout(() => setCertSuccessMsg(null), 4000);
    } else {
     setCertErrorMsg(data.error || "Failed to generate handoff manifest.");
    }
   })
   .catch((err) => setCertErrorMsg(err.message || "Failed to generate handoff manifest."))
   .finally(() => setIsGeneratingHandoff(false));
 };

 // Phase 78: Execution Handlers
 const loadExecutionState = () => {
  fetch(`/api/research/${params.id}/creator-execution`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.activePlan) {
      setExecutionPlan(data.activePlan);
      setSelectedOpIds(data.activePlan.proposedOperations.map((op: any) => op.id));
     }
     if (data.stagedExecution) setStagedExecution(data.stagedExecution);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/creator-execution/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setExecutionHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const handleCreateExecutionPlan = (
  triggerType: string = "MANUAL_CREATOR_REQUEST",
  rootCause: string = "Creator requested safe action execution."
 ) => {
  setIsPlanning(true);
  setExecutionErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-execution/plan`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ triggerType, rootCause }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.plan) {
     setExecutionPlan(data.plan);
     setSelectedOpIds(data.plan.proposedOperations.map((op: any) => op.id));
     setExecutionSuccessMsg(`Execution Plan ${data.plan.executionPlanId.slice(0, 16)}... generated successfully.`);
     loadExecutionState();
     setTimeout(() => setExecutionSuccessMsg(null), 4000);
    } else {
     setExecutionErrorMsg(data.error || "Failed to create execution plan.");
    }
   })
   .catch((err) => setExecutionErrorMsg(err.message))
   .finally(() => setIsPlanning(false));
 };

 const handleApproveExecutionPlan = () => {
  if (!executionPlan) return;
  setIsApproving(true);
  setExecutionErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-execution/approve`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    planId: executionPlan.executionPlanId,
    approvedOperationIds: selectedOpIds,
    rejectedOperationIds: executionPlan.proposedOperations.filter((op) => !selectedOpIds.includes(op.id)).map((op) => op.id),
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.updatedPlan) {
     setExecutionPlan(data.updatedPlan);
     setExecutionSuccessMsg(`Plan approved (${data.approval?.approvedOperations.length || 0} operations). Ready for isolated staging.`);
     loadExecutionState();
     setTimeout(() => setExecutionSuccessMsg(null), 4000);
    } else {
     setExecutionErrorMsg(data.error || "Failed to approve plan.");
    }
   })
   .catch((err) => setExecutionErrorMsg(err.message))
   .finally(() => setIsApproving(false));
 };

 const handleStageExecution = () => {
  if (!executionPlan) return;
  setIsStaging(true);
  setExecutionErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-execution/stage`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ planId: executionPlan.executionPlanId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.stagedExecution) {
     setStagedExecution(data.stagedExecution);
     if (data.validation) setValidationReport(data.validation);
     setExecutionSuccessMsg(`Staged Version ${data.stagedExecution.stagedScriptVersion} prepared and validated in isolated workspace.`);
     loadExecutionState();
     setTimeout(() => setExecutionSuccessMsg(null), 4000);
    } else {
     setExecutionErrorMsg(data.error || "Failed to stage execution.");
    }
   })
   .catch((err) => setExecutionErrorMsg(err.message))
   .finally(() => setIsStaging(false));
 };

 const handleCommitExecution = () => {
  if (!executionPlan) return;
  setIsCommitting(true);
  setExecutionErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-execution/commit`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ planId: executionPlan.executionPlanId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.report) {
     setReport(data.report);
     setExecutionSuccessMsg(`Script Version ${data.committedScriptVersion} committed to active project!`);
     setShowCommitModal(false);
     loadReport(duration, preferences, profile, outputMode);
     loadPreflight(preferences);
     loadChanges();
     loadDecisions();
     loadDistribution();
     loadProjectOverview();
     loadExecutionState();
     setTimeout(() => setExecutionSuccessMsg(null), 5000);
    } else {
     setExecutionErrorMsg(data.error || "Failed to commit staged execution.");
    }
   })
   .catch((err) => setExecutionErrorMsg(err.message))
   .finally(() => setIsCommitting(false));
 };

 const handleRollbackExecution = () => {
  if (!executionPlan) return;
  setIsRollingBack(true);
  setExecutionErrorMsg(null);
  fetch(`/api/research/${params.id}/creator-execution/rollback`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ planId: executionPlan.executionPlanId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setExecutionSuccessMsg(data.message || "Rollback completed.");
     setShowRollbackModal(false);
     loadReport(duration, preferences, profile, outputMode);
     loadProjectOverview();
     loadExecutionState();
     setTimeout(() => setExecutionSuccessMsg(null), 4000);
    } else {
     setExecutionErrorMsg(data.error || "Failed to rollback.");
    }
   })
   .catch((err) => setExecutionErrorMsg(err.message))
   .finally(() => setIsRollingBack(false));
 };

 const handleRunSimulation = () => {
  if (!simulationTargetId) return;
  setIsSimulating(true);
  setSimulationError(null);
  fetch(`/api/research/${params.id}/creator-project/impact-preview`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    targetNodeType: "CLAIM",
    targetNodeId: simulationTargetId,
    simulationAction,
    preferences,
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.simulation) {
     setSimulationPreview(data.simulation);
    } else {
     // Previously this failed silently, so the button looked dead.
     setSimulationPreview(null);
     setSimulationError(data.error || "The simulation returned no impact for this claim.");
    }
   })
   .catch((err) => setSimulationError(err?.message || "Could not reach the simulation service."))
   .finally(() => setIsSimulating(false));
 };

 // Phase 74: Revalidation Handlers
 const handleExecuteRevalidation = (mode: string = 'AFFECTED_CLAIMS_ONLY', claimIds?: string[]) => {
  setIsRevalidating(true);
  fetch(`/api/research/${params.id}/health/revalidate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ mode, claimIds }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setRevalidationSuccessMsg(data.summaryMessage || "Revalidation plan executed successfully.");
     if (data.healthReport) setHealthReport(data.healthReport);
     if (data.updatedReport) setReport(data.updatedReport);
     loadReport(duration, preferences, profile, outputMode);
     loadPreflight(preferences);
     loadChanges();
     loadDecisions();
     loadDecisionHistory();
     loadDistribution();
     loadProjectOverview();
     setTimeout(() => setRevalidationSuccessMsg(null), 4000);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsRevalidating(false));
 };

 // Phase 75: Decision Handlers
 const handleExecuteHealthDecisionAction = (action: ResearchHealthAction) => {
  setIsExecutingDecisionAction(true);
  fetch(`/api/research/${params.id}/health/decisions/action`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ action, preferences }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setDecisionActionSuccessMsg(data.actionResult?.summaryMessage || `Action ${action.actionType} executed.`);
     if (data.decisionReport) setDecisionReport(data.decisionReport);
     if (data.healthReport) setHealthReport(data.healthReport);
     if (data.updatedReport) setReport(data.updatedReport);
     loadReport(duration, preferences, profile, outputMode);
     loadPreflight(preferences);
     loadChanges();
     loadDecisionHistory();
     loadDistribution();
     loadProjectOverview();
     setPendingActionForConfirm(null);
     setInspectedDecision(null);
     setTimeout(() => setDecisionActionSuccessMsg(null), 4000);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsExecutingDecisionAction(false));
 };

 // Phase 76: Distribution Handlers
 const handleApproveDistributionTarget = (platform: DistributionPlatform, note?: string) => {
  setIsDistActionLoading(true);
  fetch(`/api/research/${params.id}/creator-distribution/approve`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ platform, note }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setDistActionSuccessMsg(`Distribution target ${platform} approved.`);
     if (data.distributionPackage) setDistPackage(data.distributionPackage);
     loadDistributionHistory();
     loadProjectOverview();
     setTargetForApproval(null);
     setTimeout(() => setDistActionSuccessMsg(null), 3000);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsDistActionLoading(false));
 };

 const handleScheduleDistributionTarget = () => {
  if (!targetForSchedule || !scheduleDateTime || !scheduleTimezone) return;
  setIsDistActionLoading(true);
  fetch(`/api/research/${params.id}/creator-distribution/schedule`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    platform: targetForSchedule.platform,
    localDateTime: scheduleDateTime,
    timezone: scheduleTimezone,
    note: scheduleNote,
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setDistActionSuccessMsg(`Release scheduled for ${scheduleDateTime} (${scheduleTimezone}).`);
     if (data.distributionPackage) setDistPackage(data.distributionPackage);
     loadDistributionHistory();
     loadProjectOverview();
     setTargetForSchedule(null);
     setScheduleDateTime("");
     setScheduleNote("");
     setTimeout(() => setDistActionSuccessMsg(null), 4000);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsDistActionLoading(false));
 };

 const handleCancelDistributionSchedule = (platform: DistributionPlatform) => {
  setIsDistActionLoading(true);
  fetch(`/api/research/${params.id}/creator-distribution/cancel`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ platform }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setDistActionSuccessMsg(`Scheduled release for ${platform} cancelled.`);
     if (data.distributionPackage) setDistPackage(data.distributionPackage);
     loadDistributionHistory();
     loadProjectOverview();
     setTimeout(() => setDistActionSuccessMsg(null), 3000);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setIsDistActionLoading(false));
 };

 const handleGenerateTimeline = () => {
  setGeneratingTimeline(true);
  fetch(`/api/research/${params.id}/creator-studio/timeline`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    format: timelineFormat,
    fps: timelineFps,
    duration,
    ...timelineOptions,
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.timeline) {
     setTimelineResult(data.timeline);
    }
   })
   .catch((err) => console.error(err))
   .finally(() => setGeneratingTimeline(false));
 };

 const handleDownloadTimeline = () => {
  if (!timelineResult) return;
  const blob = new Blob([timelineResult.content], { type: timelineResult.mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = timelineResult.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
 };

 if (loading && !report) {
  return (
   <div className="space-y-6">
    <SkeletonCard />
   </div>
  );
 }

 if (!report) {
  return (
   <div className="space-y-6">
    <ResearchTabNav runId={params.id} />
    <div className="p-12 text-center space-y-3">
     <Sparkles className="w-12 h-12 text-slate-500 mx-auto" />
     <h3 className="text-base font-bold text-slate-700">No Creator Studio Data Available</h3>
     <p className="text-xs text-slate-500">Unable to generate script intelligence for this research run.</p>
    </div>
   </div>
  );
 }

 return (
  <div className="space-y-6 font-sans">
   {/* Top Navigation */}
   <ResearchTabNav runId={params.id} />

   {/* NEW OVERHAULED PILL BAR */}
   <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide w-full whitespace-nowrap">
    {[
     { id: "project", label: "Project Control Center", icon: Network },
     { id: "matrix", label: "Production Matrix", icon: Layers },
     { id: "exportWorkspace", label: "Production Export", icon: Download },
     { id: "publishingOrchestrator", label: "Publishing Orchestrator", icon: Send },
     { id: "publicationIntegrity", label: "Publication Integrity", icon: ShieldCheck },
     { id: "researchCalibration", label: "Research Calibration", icon: Scale }
    ].map((tab) => {
     const isActive = activeTab === tab.id;
     const Icon = tab.icon;
     return (
      <button
       key={tab.id}
       onClick={() => setActiveTab(tab.id as any)}
       className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
        isActive 
         ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
         : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:text-slate-900"
       }`}
      >
       <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-500"}`} />
       {tab.label}
      </button>
     );
    })}
   </div>

   {/* TAB: CREATOR PROJECT CONTROL CENTER */}
   {activeTab === "project" && (
    <div className="space-y-[22px]">
      
      {/* Controls Row */}
      <div className="flex items-center justify-between gap-[14px] flex-wrap mb-[18px]">
        <div className="flex bg-card border border-line rounded-[10px] overflow-hidden">
          {["Outline", "Script Ready", "Full Spoken"].map(mode => {
           const modeValue = mode.replace(" ", "_").toUpperCase();
           const isModeActive = outputMode === modeValue;
           return (
            <button
             key={mode}
             onClick={() => setOutputMode(modeValue as any)}
             className={`bg-transparent border-none px-[14px] py-[8px] text-[12.5px] font-semibold cursor-pointer ${
              isModeActive 
               ? "bg-ink text-paper" 
               : "text-muted"
             }`}
            >
             {mode}
            </button>
           );
          })}
        </div>

        <div className="flex gap-[10px] items-center">
          <span className="font-mono text-[12px] text-muted">
            Duration: 
            {[8, 12, 18].map((dur, i) => (
              <React.Fragment key={dur}>
                {i > 0 && " · "}
                {duration === dur ? <b className="text-ink">{dur}m</b> : <span onClick={() => setDuration(dur as any)} className="cursor-pointer">{dur}m</span>}
              </React.Fragment>
            ))}
          </span>
          <button className="bg-citation text-white border-none px-[16px] py-[9px] rounded-[9px] text-[12.5px] font-semibold cursor-pointer">
            🎙 Teleprompter
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-ink text-paper rounded-[16px] p-[20px_22px] mb-[20px]">
        <div className="flex gap-[8px] mb-[12px] flex-wrap">
          <span className="font-mono text-[10.5px] font-semibold px-[10px] py-[4px] rounded-[6px] bg-verified-bg text-verified uppercase">
            READY FOR PUBLISHING
          </span>
          <span className="font-mono text-[10.5px] font-semibold px-[10px] py-[4px] rounded-[6px] bg-white/10 text-white/70 uppercase">
            SCRIPT V1.0
          </span>
        </div>
        <div className="font-serif font-semibold text-[19px] mb-[10px]">
          {report?.topic || "Untitled research run"}
        </div>
        <div className="flex gap-[16px] flex-wrap font-mono text-[11px] text-white/50">
          <span>Project Hash: 0fc1ebed18dc...</span>
          <span>Evidence Hash: ev-hash-ca32...</span>
          <span>◈ 19 Nodes</span>
          <span>⇄ 17 Edges</span>
        </div>
      </div>

      {/* 5 Core Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[14px] mb-[22px]">
        {[
         { step: 1, title: "RESEARCH HEALTH", score: 29, color: "warning" },
         { step: 2, title: "CONTENT QUALITY", score: 25, color: "warning" },
         { step: 3, title: "PRODUCTION READY", score: 95, color: "verified" },
         { step: 4, title: "PUBLISHING PREFLIGHT", score: 100, color: "verified" },
         { step: 5, title: "DISTRIBUTION STAGING", score: 69, color: "warning" }
        ].map(kpi => (
         <div key={kpi.step} className="bg-card border border-line-soft rounded-[14px] p-[14px]">
           <div className="font-mono text-[9.5px] text-muted-2 tracking-[0.3px] mb-[8px] uppercase">{kpi.title}</div>
           <div className={`font-serif font-semibold text-[22px] mb-[8px] text-${kpi.color}`}>
             {kpi.score}%
           </div>
           <div className="h-[5px] bg-line-soft rounded-[4px] overflow-hidden">
             <div 
              className={`h-full rounded-[4px] bg-${kpi.color}`} 
              style={{ width: `${kpi.score}%` }} 
             />
           </div>
         </div>
        ))}
      </div>

      {/* 9-Stage Pipeline Integrity */}
      <div>
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink">End-to-End Project Pipeline Integrity (9 Stages)</h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Complete authority chain: Research → Evidence → Health → Decisions → Script → Quality → Production → Editor → Publishing → Distribution.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[14px] mb-[26px]">
          {[
           { i: 1, title: "Research & Sources", status: "IN PROGRESS", score: "Status: Active Collection", badgeClass: "bg-citation-bg text-citation" },
           { i: 2, title: "Evidence Health", status: "READY", score: "Score: 29%", badgeClass: "bg-verified-bg text-verified" },
           { i: 3, title: "Health Decisions", status: "READY", score: "Status: Verified", badgeClass: "bg-verified-bg text-verified" },
           { i: 4, title: "Script & Narration", status: "READY", score: "Status: Ready for Inspection", badgeClass: "bg-verified-bg text-verified" },
           { i: 5, title: "Quality Review", status: "WARNING", score: "Score: 25%", badgeClass: "bg-warning-bg text-warning" },
           { i: 6, title: "Production Assets", status: "READY", score: "Score: 95%", badgeClass: "bg-verified-bg text-verified" },
           { i: 7, title: "Publishing Preflight", status: "READY", score: "Score: 100%", badgeClass: "bg-verified-bg text-verified" },
           { i: 8, title: "Distribution & Release", status: "WARNING", score: "Score: 69%", badgeClass: "bg-warning-bg text-warning" },
           { i: 9, title: "Video Editor Sync", status: "READY", score: "Status: Ready for Inspection", badgeClass: "bg-verified-bg text-verified" }
          ].map(stage => (
           <div key={stage.i} className="bg-card border border-line-soft rounded-[14px] p-[16px]">
            <div className="flex justify-between items-start mb-[10px]">
              <span className="font-mono text-[10px] text-muted-2 uppercase tracking-wide">STAGE {stage.i}</span>
              <span className={`font-mono text-[10px] font-semibold px-[8px] py-[3px] rounded-[12px] ${stage.badgeClass}`}>
               {stage.status}
              </span>
            </div>
            <div className="font-bold text-[13.5px] text-ink m-[4px_0]">{stage.title}</div>
            <div className="text-[11.5px] text-muted">{stage.score}</div>
            <button className="w-full mt-[10px] bg-paper border border-line rounded-[8px] p-[8px] text-[12px] font-semibold cursor-pointer text-ink hover:bg-line-soft transition-colors">
              Open Subsystem →
            </button>
           </div>
          ))}
        </div>
      </div>

      {/* Unified Project Asset Inventory */}
      <div>
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink">Unified Project Asset Inventory (4 Assets)</h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Real-time status, health, and provenance mapping for every script and production asset.</p>
        
        <div className="bg-card border border-line-soft rounded-[14px] p-[6px_16px] overflow-x-auto">
          <table className="w-full border-collapse text-[13px] min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Asset</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Type</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Subsystem</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Status</th>
                <th className="text-left font-mono text-[10px] tracking-[0.4px] uppercase text-muted-2 p-[0_10px_10px]">Version</th>
              </tr>
            </thead>
            <tbody>
              {[
               { name: "📄 Main YouTube Script", type: "markdown", sub: "Production", status: "READY", v: "v1.0", badgeClass: "bg-verified-bg text-verified" },
               { name: "📊 Benchmark Comparison Cards", type: "json_matrix", sub: "Editor Sync", status: "READY", v: "v1.2", badgeClass: "bg-verified-bg text-verified" },
               { name: "🖼 Thumbnail Hook Brief", type: "text", sub: "Publishing", status: "STAGED", v: "v0.9", badgeClass: "bg-warning-bg text-warning" },
               { name: "📑 Fact-Checked Citations Sheet", type: "csv", sub: "Quality", status: "READY", v: "v2.1", badgeClass: "bg-verified-bg text-verified" }
              ].map((asset, i) => (
                <tr key={i}>
                  <td className="p-[12px_10px] border-t border-line-soft">
                    <div className="flex items-center gap-[8px] font-semibold text-ink">{asset.name}</div>
                  </td>
                  <td className="p-[12px_10px] border-t border-line-soft font-mono text-muted">{asset.type}</td>
                  <td className="p-[12px_10px] border-t border-line-soft text-ink">{asset.sub}</td>
                  <td className="p-[12px_10px] border-t border-line-soft">
                    <span className={`font-mono text-[10px] font-semibold px-[8px] py-[3px] rounded-[12px] ${asset.badgeClass}`}>
                     {asset.status}
                    </span>
                  </td>
                  <td className="p-[12px_10px] border-t border-line-soft font-mono text-muted">{asset.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulation Card */}
      <div className="bg-card border border-line-soft rounded-[14px] p-[20px] mt-[22px]">
        <h3 className="text-[15px] font-bold m-0 mb-[4px] text-ink flex items-center gap-[8px]">
          ⚡ "What Breaks If This Changes?" Read-Only Simulation
        </h3>
        <p className="text-[12.5px] text-muted m-0 mb-[16px]">Simulate downstream impact across scripts, benchmark cards, and distribution staging before making upstream research modifications.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-[12px] items-end">
          <div>
            <label className="font-mono text-[10px] text-muted-2 block mb-[6px] uppercase tracking-wide">SELECT UPSTREAM CLAIM / NODE</label>
            <select 
              value={simulationTargetId}
              onChange={(e) => setSimulationTargetId(e.target.value)}
              className="w-full font-sans text-[13px] p-[10px_12px] border border-line rounded-[9px] bg-paper text-ink focus:outline-none focus:border-citation"
            >
              <option value="">
                {runClaims.length === 0 ? "— No claims available in this run —" : "— Choose Claim to Simulate —"}
              </option>
              {runClaims.map((c, i) => (
                <option key={c.id} value={c.id}>
                  {`Claim #${i + 1}: ${c.claim_text.slice(0, 90)}${c.claim_text.length > 90 ? "…" : ""}`}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="font-mono text-[10px] text-muted-2 block mb-[6px] uppercase tracking-wide">SIMULATED CHANGE ACTION</label>
            <select 
              value={simulationAction}
              onChange={(e) => setSimulationAction(e.target.value)}
              className="w-full font-sans text-[13px] p-[10px_12px] border border-line rounded-[9px] bg-paper text-ink focus:outline-none focus:border-citation"
            >
              <option value="BENCHMARK_SCORE_CHANGED">Benchmark Score Changed (&gt; 10% delta)</option>
              <option value="EVIDENCE_RETRACTED">Evidence Retracted (Dead Link)</option>
              <option value="CLAIM_CONTRADICTED">Claim Flipped to Contradicted</option>
            </select>
          </div>

          <button 
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-citation text-white border-none rounded-[9px] p-[11px_18px] text-[12.5px] font-semibold cursor-pointer whitespace-nowrap hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSimulating ? "⚡ Simulating..." : "⚡ Run Simulation"}
          </button>
        </div>
        {simulationError && (
          <div className="mt-[12px] text-[12.5px] text-conflict bg-conflict-bg border border-conflict/20 rounded-[9px] p-[10px_12px]">
            {simulationError}
          </div>
        )}
      </div>
      
    </div>
   )}
   
   {/* TAB: CREATOR CHANGE EXECUTION & SAFE ACTION ORCHESTRATION (PHASE 78) */}
   {activeTab === "execution" && (
    <div className="space-y-6">
     {/* Notifications */}
     {executionSuccessMsg && (
      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-600/80 text-emerald-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-emerald-600" />
       <span>{executionSuccessMsg}</span>
      </div>
     )}

     {executionErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{executionErrorMsg}</span>
      </div>
     )}

     {/* Top Execution Status & Lifecycle Stepper */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          executionPlan?.executionStatus === 'COMMITTED'
           ? "bg-emerald-50 text-emerald-600 border-emerald-200"
           : executionPlan?.executionStatus === 'VALIDATED'
           ? "bg-teal-50 text-teal-700 border-teal-800"
           : executionPlan?.executionStatus === 'STAGED'
           ? "bg-cyan-50 text-cyan-600 border-cyan-200"
           : executionPlan?.executionStatus === 'APPROVED'
           ? "bg-indigo-50 text-indigo-600 border-indigo-200"
           : executionPlan?.executionStatus === 'BLOCKED'
           ? "bg-rose-50 text-rose-600 border-rose-200"
           : "bg-slate-50 text-slate-700 border-slate-200"
         }`}>
          EXECUTION STATUS: {executionPlan?.executionStatus || "NO_ACTIVE_PLAN"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Active Script v{report.scriptVersion || 1} â†’ Target v{(report.scriptVersion || 1) + 1}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <PlayCircle className="w-5 h-5 text-emerald-600" />
         Creator Change Execution & Safe Action Control Plane
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Deterministic staged execution preventing silent mutations. Preview first â†’ Execute second â†’ Verify third â†’ Commit last.
        </p>
       </div>

       <div className="flex items-center gap-2 shrink-0">
        <button
         onClick={() => handleCreateExecutionPlan()}
         disabled={isPlanning}
         className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Plus className="w-3.5 h-3.5" />
         {isPlanning ? "Planning..." : "Create Execution Plan"}
        </button>
       </div>
      </div>

      {/* 5-Step Visual Lifecycle Stepper */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
       <div className={`p-2.5 rounded-xl border ${
        executionPlan ? "bg-emerald-50/40 border-emerald-600 text-emerald-600 font-bold" : "bg-slate-50 border-slate-200 text-slate-500"
       }`}>
        <span>1. PLAN</span>
       </div>
       <div className={`p-2.5 rounded-xl border ${
        executionPlan?.executionStatus === 'APPROVED' || executionPlan?.executionStatus === 'STAGED' || executionPlan?.executionStatus === 'VALIDATED' || executionPlan?.executionStatus === 'COMMITTED'
         ? "bg-indigo-50 border-indigo-600 text-indigo-600 font-bold"
         : "bg-slate-50 border-slate-200 text-slate-500"
       }`}>
        <span>2. APPROVE</span>
       </div>
       <div className={`p-2.5 rounded-xl border ${
        executionPlan?.executionStatus === 'STAGED' || executionPlan?.executionStatus === 'VALIDATED' || executionPlan?.executionStatus === 'COMMITTED'
         ? "bg-cyan-50/40 border-cyan-600 text-cyan-600 font-bold"
         : "bg-slate-50 border-slate-200 text-slate-500"
       }`}>
        <span>3. STAGE</span>
       </div>
       <div className={`p-2.5 rounded-xl border ${
        executionPlan?.executionStatus === 'VALIDATED' || executionPlan?.executionStatus === 'COMMITTED'
         ? "bg-teal-50 border-teal-600 text-teal-700 font-bold"
         : "bg-slate-50 border-slate-200 text-slate-500"
       }`}>
        <span>4. VALIDATE</span>
       </div>
       <div className={`p-2.5 rounded-xl border ${
        executionPlan?.executionStatus === 'COMMITTED'
         ? "bg-emerald-50/60 border-emerald-500 text-emerald-200 font-bold"
         : "bg-slate-50 border-slate-200 text-slate-500"
       }`}>
        <span>5. COMMIT</span>
       </div>
      </div>
     </div>

     {/* Action Toolbar */}
     {executionPlan && (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
       <div className="flex items-center gap-2 text-xs font-mono text-slate-700">
        <span className="font-bold text-slate-900">Plan:</span>
        <span>{executionPlan.executionPlanId.slice(0, 24)}...</span>
        <span className="text-slate-500">â€¢</span>
        <span className="text-indigo-600">Trigger: {executionPlan.triggerType}</span>
       </div>

       <div className="flex flex-wrap items-center gap-2">
        {executionPlan.executionStatus === 'PLANNED' && (
         <button
          onClick={handleApproveExecutionPlan}
          disabled={isApproving || selectedOpIds.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 text-xs font-bold font-mono shadow-sm transition"
         >
          <Check className="w-3.5 h-3.5" />
          {isApproving ? "Approving..." : `Approve Selected (${selectedOpIds.length})`}
         </button>
        )}

        {executionPlan.executionStatus === 'APPROVED' && (
         <button
          onClick={handleStageExecution}
          disabled={isStaging}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 text-xs font-bold font-mono shadow-sm transition"
         >
          <Package className="w-3.5 h-3.5" />
          {isStaging ? "Staging..." : "Stage Execution in Workspace"}
         </button>
        )}

        {executionPlan.executionStatus === 'VALIDATED' && (
         <button
          onClick={() => setShowCommitModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 text-xs font-bold font-mono shadow-sm transition"
         >
          <CheckCircle className="w-3.5 h-3.5" />
          Commit to Active Project
         </button>
        )}

        {(executionPlan.executionStatus === 'STAGED' || executionPlan.executionStatus === 'VALIDATION_FAILED') && (
         <button
          onClick={() => setShowRollbackModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-900 border border-rose-200 text-rose-600 text-xs font-bold font-mono transition"
         >
          <Undo2 className="w-3.5 h-3.5" />
          Rollback Staged State
         </button>
        )}
       </div>
      </div>
     )}

     {/* Change Matrix & Safety Gate Cards */}
     {executionPlan && (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
       <div className="p-4 rounded-xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1">
        <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase block">WILL CHANGE</span>
        <span className="text-xl font-extrabold text-slate-900">{executionPlan.expectedImpact.willChangeCount}</span>
        <span className="text-[11px] text-slate-500 block">Proposed operations</span>
       </div>

       <div className="p-4 rounded-xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1">
        <span className="text-[10px] font-mono text-amber-600 font-bold uppercase block">MAY CHANGE</span>
        <span className="text-xl font-extrabold text-slate-900">{executionPlan.expectedImpact.mayChangeCount}</span>
        <span className="text-[11px] text-slate-500 block">Downstream candidates</span>
       </div>

       <div className="p-4 rounded-xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1">
        <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">UNCHANGED</span>
        <span className="text-xl font-extrabold text-slate-900">{executionPlan.expectedImpact.unchangedCount}</span>
        <span className="text-[11px] text-slate-500 block">Minimal change guarantee</span>
       </div>

       <div className="p-4 rounded-xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1">
        <span className="text-[10px] font-mono text-rose-600 font-bold uppercase block">HARD BLOCKERS</span>
        <span className="text-xl font-extrabold text-slate-900">{executionPlan.expectedImpact.blockedCount}</span>
        <span className="text-[11px] text-slate-500 block">Safety gate status</span>
       </div>
      </div>
     )}

     {/* Proposed Operations Interactive Checklist */}
     {executionPlan && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          Proposed Execution Operations ({executionPlan.proposedOperations.length})
         </h3>
         <p className="text-xs text-slate-500 mt-0.5">
          Select operations to authorize. Unselected operations will be skipped if dependencies permit.
         </p>
        </div>
       </div>

       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5 w-10">SELECT</th>
           <th className="p-2.5">OPERATION TYPE</th>
           <th className="p-2.5">TARGET ASSET</th>
           <th className="p-2.5">SUBSYSTEM</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">LINEAGE</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {executionPlan.proposedOperations.map((op) => (
           <tr key={op.id} className="hover:bg-slate-100">
            <td className="p-2.5">
             <input
              type="checkbox"
              checked={selectedOpIds.includes(op.id)}
              onChange={(e) => {
               if (e.target.checked) {
                setSelectedOpIds([...selectedOpIds, op.id]);
               } else {
                setSelectedOpIds(selectedOpIds.filter((id) => id !== op.id));
               }
              }}
              className="rounded bg-slate-50 border-slate-300 text-indigo-600 focus:ring-0"
             />
            </td>
            <td className="p-2.5 font-bold text-slate-700">{op.operationType}</td>
            <td className="p-2.5 text-slate-700 font-sans">{op.targetLabel}</td>
            <td className="p-2.5 text-indigo-600">{op.subsystem}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              op.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
              op.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
              'bg-slate-50 text-slate-500 border border-slate-200'
             }`}>
              {op.status}
             </span>
            </td>
            <td className="p-2.5">
             <button
              onClick={() => setInspectedOp(op)}
              className="text-xs text-indigo-600 hover:text-indigo-600 hover:underline"
             >
              Why Will This Change?
             </button>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </div>
     )}

     {/* Validation Dashboard (5-Dimension Re-Evaluation) */}
     {validationReport && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          Post-Staging Validation Dashboard
         </h3>
         <p className="text-xs text-slate-500 mt-0.5">
          Authoritative re-evaluation across all 5 dimensions on the isolated staged state.
         </p>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${
         validationReport.validationStatus === 'VALIDATED'
          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
          : "bg-rose-50 text-rose-600 border-rose-200"
        }`}>
         {validationReport.validationStatus}
        </span>
       </div>

       <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-teal-600 uppercase font-bold block">1. HEALTH</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.researchHealthBefore}% â†’ {validationReport.researchHealthAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-emerald-600 uppercase font-bold block">2. QUALITY</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.contentQualityBefore}% â†’ {validationReport.contentQualityAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-cyan-600 uppercase font-bold block">3. PRODUCTION</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.productionReadinessBefore}% â†’ {validationReport.productionReadinessAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-purple-600 uppercase font-bold block">4. PUBLISHING</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.publishingReadinessBefore}% â†’ {validationReport.publishingReadinessAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-rose-600 uppercase font-bold block">5. DISTRIBUTION</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.distributionReadinessBefore}% â†’ {validationReport.distributionReadinessAfter}%
         </div>
        </div>
       </div>
      </div>
     )}

     {/* Execution History Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <History className="w-4 h-4 text-indigo-600" />
         Immutable Execution Audit Ledger ({executionHistory.length} Events)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
         Append-only historical ledger recording plan creation, approvals, staging, validations, and commits.
        </p>
       </div>
      </div>

      {executionHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No execution events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">VERSIONS</th>
           <th className="p-2.5">RESULT</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {executionHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-indigo-600">{ev.action}</td>
            <td className="p-2.5 text-slate-700">v{ev.previousScriptVersion} â†’ v{ev.newScriptVersion}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.executionResult}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* "Why Will This Change?" Inspector Modal */}
     {inspectedOp && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">
           "Why Will This Change?" Lineage Inspector
          </h3>
         </div>
         <button
          onClick={() => setInspectedOp(null)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs">
         <div className="flex justify-between text-slate-500">
          <span>OPERATION ID:</span>
          <span className="font-bold text-slate-900">{inspectedOp.id}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>OPERATION TYPE:</span>
          <span className="text-emerald-600 font-bold">{inspectedOp.operationType}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>SUBSYSTEM:</span>
          <span className="text-indigo-600 font-bold">{inspectedOp.subsystem}</span>
         </div>
        </div>

        <div className="space-y-2 text-xs font-sans">
         <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">REASON & UPSTREAM EVIDENCE</span>
         <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2 text-slate-700 leading-relaxed">
          <p><strong>Rationale:</strong> {inspectedOp.reason}</p>
          <p className="text-[11px] font-mono text-teal-600">
           Upstream Evidence IDs: {inspectedOp.upstreamEvidenceIds.join(", ") || "Root Session"}
          </p>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setInspectedOp(null)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Close
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Commit Confirmation Dialog */}
     {showCommitModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-emerald-200/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Commit Staged Version to Active Project</h3>
         </div>
         <button
          onClick={() => setShowCommitModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <p className="text-xs text-slate-700 font-sans leading-relaxed">
         You are about to make Staged Script Version {(report.scriptVersion || 1) + 1} the active project state. Previous versions will remain immutable in history.
        </p>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs text-slate-700">
         <div className="flex justify-between">
          <span>Target Script Version:</span>
          <span className="font-bold text-emerald-600">v{(report.scriptVersion || 1) + 1}</span>
         </div>
         <div className="flex justify-between">
          <span>Validation Status:</span>
          <span className="font-bold text-teal-600">PASSED</span>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowCommitModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleCommitExecution}
          disabled={isCommitting}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isCommitting ? "Committing..." : "Confirm & Commit"}
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Rollback Confirmation Dialog */}
     {showRollbackModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-rose-200/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Undo2 className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Rollback Staged Execution</h3>
         </div>
         <button
          onClick={() => setShowRollbackModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <p className="text-xs text-slate-700 font-sans leading-relaxed">
         This will discard the uncommitted staged state and restore the active project reference to Script Version {report.scriptVersion || 1}. Historical version audit records are preserved.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowRollbackModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleRollbackExecution}
          disabled={isRollingBack}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isRollingBack ? "Rolling back..." : "Confirm Rollback"}
         </button>
        </div>
       </div>
      </div>
     )}
    </div>
   )}

   {/* TAB: FINAL PROJECT INTEGRITY CERTIFICATION & RELEASE LOCK (PHASE 79) */}
   {activeTab === "certification" && (
    <div className="space-y-6">
     {/* Notifications */}
     {certSuccessMsg && (
      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-600/80 text-emerald-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-emerald-600" />
       <span>{certSuccessMsg}</span>
      </div>
     )}

     {certErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{certErrorMsg}</span>
      </div>
     )}

     {/* Top Status & Integrity Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          certificate?.status === 'CERTIFIED'
           ? "bg-emerald-50 text-emerald-600 border-emerald-200"
           : certificate?.status === 'CERTIFIED_WITH_WARNINGS'
           ? "bg-amber-50 text-amber-600 border-amber-200"
           : certificate?.status === 'BLOCKED'
           ? "bg-rose-50 text-rose-600 border-rose-200"
           : "bg-slate-50 text-slate-700 border-slate-200"
         }`}>
          CERTIFICATION: {certificate?.status || "NOT_EVALUATED"}
         </span>
         {certificate?.isReleaseLocked && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-50 text-amber-600 border border-amber-700 flex items-center gap-1">
           <Lock className="w-3 h-3 text-amber-600" />
           RELEASE LOCKED
          </span>
         )}
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Award className="w-5 h-5 text-amber-600" />
         Final Project Integrity Certification & Release Lock Control Plane
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Deterministic exact-snapshot verification ensuring evidence safety, quality, production integrity, and release readiness.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleEvaluateCertification}
         disabled={isCertifying}
         className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <ShieldCheck className="w-3.5 h-3.5" />
         {isCertifying ? "Evaluating..." : "Evaluate Certification"}
        </button>

        {certificate && !certificate.isReleaseLocked && (
         <button
          onClick={() => setShowLockModal(true)}
          disabled={certificate.status === 'BLOCKED'}
          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
         >
          <Lock className="w-3.5 h-3.5" />
          Apply Release Lock
         </button>
        )}

        {certificate && certificate.isReleaseLocked && (
         <button
          onClick={() => setShowUnlockModal(true)}
          className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-900 border border-rose-200 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition"
         >
          <Unlock className="w-3.5 h-3.5" />
          Unlock Release
         </button>
        )}

        <button
         onClick={handleGenerateHandoff}
         disabled={isGeneratingHandoff}
         className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Package className="w-3.5 h-3.5" />
         {isGeneratingHandoff ? "Generating..." : "Generate Handoff Manifest"}
        </button>
       </div>
      </div>

      {/* Snapshot & Release Identity */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase block">PROJECT SNAPSHOT</span>
        <span className="text-slate-700 font-bold truncate block">{certificate?.projectSnapshotHash || "N/A"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase block">EVIDENCE SNAPSHOT</span>
        <span className="text-teal-600 font-bold truncate block">{certificate?.evidenceSnapshotHash || "N/A"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase block">SCRIPT VERSION</span>
        <span className="text-indigo-600 font-bold block">v{certificate?.scriptVersion || report.scriptVersion || 1}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase block">INTEGRITY SCORE</span>
        <span className="text-amber-600 font-bold block">{certificate?.overallIntegrityScore || 0}%</span>
       </div>
      </div>
     </div>

     {/* 8-Dimension Integrity Matrix */}
     {certificate && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-amber-600" />
         8-Dimension Project Integrity Matrix
        </h3>
        <span className="text-xs font-mono text-slate-500">
         Ready for Handoff: {certificate.readyForHandoff ? "YES" : "NO"}
        </span>
       </div>

       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {/* 1. Research */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">1. RESEARCH</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.researchIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>
           {certificate.dimensions.researchIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Score: {certificate.dimensions.researchIntegrity.score}%</div>
         <span className="text-[11px] text-slate-500 block">Primary Sources: {certificate.dimensions.researchIntegrity.primaryEvidenceCount}</span>
        </div>

        {/* 2. Evidence */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">2. EVIDENCE</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.evidenceIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-amber-600'}`}>
           {certificate.dimensions.evidenceIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Freshness: {certificate.dimensions.evidenceIntegrity.freshnessScore}%</div>
         <span className="text-[11px] text-slate-500 block">Stale items: {certificate.dimensions.evidenceIntegrity.staleCount}</span>
        </div>

        {/* 3. Claims */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">3. CLAIM SAFETY</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.claimSafety.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>
           {certificate.dimensions.claimSafety.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Verified: {certificate.dimensions.claimSafety.verifiedCount}</div>
         <span className="text-[11px] text-slate-500 block">DO_NOT_SAY: {certificate.dimensions.claimSafety.doNotSayCount}</span>
        </div>

        {/* 4. Script */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">4. SCRIPT</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.scriptIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-amber-600'}`}>
           {certificate.dimensions.scriptIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Quality: {certificate.dimensions.scriptIntegrity.qualityScore}% ({certificate.dimensions.scriptIntegrity.qualityGrade})</div>
         <span className="text-[11px] text-slate-500 block">Duration: {certificate.dimensions.scriptIntegrity.targetDuration}m</span>
        </div>

        {/* 5. Production */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">5. PRODUCTION</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.productionIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-amber-600'}`}>
           {certificate.dimensions.productionIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Readiness: {certificate.dimensions.productionIntegrity.readinessScore}%</div>
         <span className="text-[11px] text-slate-500 block">Enabled Assets: {certificate.dimensions.productionIntegrity.enabledAssetCount}</span>
        </div>

        {/* 6. Publishing */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">6. PUBLISHING</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.publishingIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>
           {certificate.dimensions.publishingIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Score: {certificate.dimensions.publishingIntegrity.score}%</div>
         <span className="text-[11px] text-slate-500 block">Platforms: {certificate.dimensions.publishingIntegrity.platformCount}</span>
        </div>

        {/* 7. Distribution */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">7. DISTRIBUTION</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.distributionIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-rose-600'}`}>
           {certificate.dimensions.distributionIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Readiness: {certificate.dimensions.distributionIntegrity.readinessScore}%</div>
         <span className="text-[11px] text-slate-500 block">Ready Targets: {certificate.dimensions.distributionIntegrity.readyCount}/{certificate.dimensions.distributionIntegrity.targetCount}</span>
        </div>

        {/* 8. Execution */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
         <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold">8. EXECUTION</span>
          <span className={`text-[10px] font-bold ${certificate.dimensions.executionIntegrity.status === 'PASS' ? 'text-emerald-600' : 'text-amber-600'}`}>
           {certificate.dimensions.executionIntegrity.status}
          </span>
         </div>
         <div className="text-slate-700 font-bold">Plan: {certificate.dimensions.executionIntegrity.latestPlanStatus}</div>
         <span className="text-[11px] text-slate-500 block">Concurrency: SAFE</span>
        </div>
       </div>
      </div>
     )}

     {/* "Why Isn't This Certified?" Blocker Panel */}
     {certificate && certificate.blockers.length > 0 && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <AlertOctagon className="w-4 h-4 text-rose-600" />
         "Why Isn't This Certified?" Blocker Intelligence ({certificate.blockers.length})
        </h3>
       </div>

       <div className="divide-y divide-slate-200">
        {certificate.blockers.map((blk) => (
         <div key={blk.id} className="py-3 flex items-start justify-between gap-4">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-600 border border-rose-200">
             {blk.severity}
            </span>
            <span className="text-xs font-bold text-slate-700 font-sans">{blk.reason}</span>
           </div>
           <p className="text-xs text-slate-500 font-sans">Cause: {blk.upstreamCause}</p>
           <p className="text-[11px] font-mono text-amber-600">Required: {blk.requiredAction}</p>
          </div>
          <button
           onClick={() => setInspectedCertBlocker(blk)}
           className="text-xs text-indigo-600 hover:text-indigo-600 shrink-0 font-mono"
          >
           Inspect Lineage
          </button>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* "What Changed Since Certification?" Inspector */}
     {certChanges && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <History className="w-4 h-4 text-cyan-600" />
         "What Changed Since Certification?" Change Detection
        </h3>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
         certChanges.impactLevel === 'NO_CHANGE'
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : certChanges.impactLevel === 'CRITICAL'
          ? 'bg-rose-50 text-rose-600 border-rose-200'
          : 'bg-amber-50 text-amber-600 border-amber-200'
        }`}>
         {certChanges.impactLevel}
        </span>
       </div>

       <div className="space-y-2 text-xs font-mono">
        {certChanges.details.map((d, idx) => (
         <p key={idx} className="text-slate-700 flex items-center gap-2">
          <span className="text-slate-500">â€¢</span>
          <span>{d}</span>
         </p>
        ))}
       </div>
      </div>
     )}

     {/* Handoff Manifest View */}
     {handoffManifest && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-600" />
          Final Evidence-Safe Handoff Package Manifest
         </h3>
         <p className="text-xs text-slate-500 mt-0.5 font-sans">
          Deterministic bundle referencing verified assets. No unavailable external integrations fabricated.
         </p>
        </div>
        <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
         {handoffManifest.includedAssets.length} ASSETS
        </span>
       </div>

       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">ASSET NAME</th>
           <th className="p-2.5">TYPE</th>
           <th className="p-2.5">SUBSYSTEM</th>
           <th className="p-2.5">STATUS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {handoffManifest.includedAssets.map((asset, idx) => (
           <tr key={idx} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">{asset.name}</td>
            <td className="p-2.5 text-indigo-600">{asset.type}</td>
            <td className="p-2.5 text-slate-500">{asset.subsystem}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              asset.available ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-50 text-slate-500'
             }`}>
              {asset.available ? 'AVAILABLE' : 'DISABLED'}
             </span>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </div>
     )}

     {/* Immutable Certification Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-amber-600" />
        Immutable Certification Audit Ledger ({certHistory.length} Events)
       </h3>
      </div>

      {certHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No certification audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">SCRIPT VERSION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {certHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-amber-600">{ev.action}</td>
            <td className="p-2.5 text-slate-700">v{ev.scriptVersion}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Blocker Lineage Modal */}
     {inspectedCertBlocker && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Certification Blocker Lineage Inspector</h3>
         </div>
         <button
          onClick={() => setInspectedCertBlocker(null)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs">
         <div className="flex justify-between text-slate-500">
          <span>BLOCKER ID:</span>
          <span className="font-bold text-slate-900">{inspectedCertBlocker.id}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>SUBSYSTEM:</span>
          <span className="text-amber-600 font-bold">{inspectedCertBlocker.subsystem}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>AFFECTED NODE:</span>
          <span className="text-indigo-600 font-bold">{inspectedCertBlocker.affectedNode}</span>
         </div>
        </div>

        <div className="space-y-2 text-xs font-sans">
         <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">REASON & UPSTREAM CAUSE</span>
         <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2 text-slate-700 leading-relaxed">
          <p><strong>Direct Reason:</strong> {inspectedCertBlocker.reason}</p>
          <p><strong>Upstream Cause:</strong> {inspectedCertBlocker.upstreamCause}</p>
          <p className="text-[11px] font-mono text-teal-600">
           Evidence Ref: {inspectedCertBlocker.evidenceReference}
          </p>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setInspectedCertBlocker(null)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Close
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Release Lock Modal */}
     {showLockModal && certificate && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-amber-200/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">Apply Release Lock</h3>
         </div>
         <button
          onClick={() => setShowLockModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <p className="text-xs text-slate-700 font-sans leading-relaxed">
         You are locking Script Version {certificate.scriptVersion} and Project Snapshot Hash <code className="text-amber-600 font-mono">{certificate.projectSnapshotHash}</code> as the certified handoff/release state. Any mutation to claims, evidence, or script will invalidate this lock.
        </p>

        <div className="space-y-1">
         <label className="text-[11px] font-mono text-slate-500 block">Release Notes (Optional):</label>
         <input
          type="text"
          value={lockNotes}
          onChange={(e) => setLockNotes(e.target.value)}
          placeholder="e.g., Certified for YouTube publication and editor handoff."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-amber-500 font-sans"
         />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowLockModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleApplyReleaseLock}
          disabled={isLocking}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isLocking ? "Locking..." : "Confirm & Apply Lock"}
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Unlock Modal */}
     {showUnlockModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-rose-200/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Unlock className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Unlock Certified Release State</h3>
         </div>
         <button
          onClick={() => setShowUnlockModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <p className="text-xs text-slate-700 font-sans leading-relaxed">
         Removing the Release Lock allows modifications and further staging. The unlock event will be recorded in the audit ledger.
        </p>

        <div className="space-y-1">
         <label className="text-[11px] font-mono text-slate-500 block">Reason for Unlock (Optional):</label>
         <input
          type="text"
          value={unlockReason}
          onChange={(e) => setUnlockReason(e.target.value)}
          placeholder="e.g., Updating benchmark numbers from latest retest."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-rose-500 font-sans"
         />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowUnlockModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleUnlockRelease}
          disabled={isUnlocking}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isUnlocking ? "Unlocking..." : "Confirm Unlock"}
         </button>
        </div>
       </div>
      </div>
     )}
    </div>
   )}

   {/* TAB: CREATOR PERFORMANCE INTELLIGENCE & LEARNING (PHASE 80) */}
   {activeTab === "performance" && (
    <div className="space-y-6">
     {/* Notifications */}
     {perfSuccessMsg && (
      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-600/80 text-purple-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-purple-600" />
       <span>{perfSuccessMsg}</span>
      </div>
     )}

     {perfErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{perfErrorMsg}</span>
      </div>
     )}

     {/* Top Performance Header & Snapshot */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-600 border border-purple-200">
          PLATFORM: {perfSnapshot?.platform || "YOUTUBE_LONG_FORM"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Window: {perfSnapshot?.measurementWindow || "FIRST_48_HOURS"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <BarChart3 className="w-5 h-5 text-purple-600" />
         Creator Performance Intelligence & Evidence-Safe Learning Loop
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Outcome signals inform content presentation and future research prioritization. Performance never determines factual research truth.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => setShowRecordSnapshotModal(true)}
         className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <BarChart3 className="w-3.5 h-3.5" />
         Record Performance Data
        </button>
        <button
         onClick={() => setShowAudienceModal(true)}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition"
        >
         <MessageSquare className="w-3.5 h-3.5" />
         Log Audience Signal
        </button>
        <button
         onClick={() => setShowExperimentModal(true)}
         className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <FlaskConical className="w-3.5 h-3.5" />
         New A/B Experiment
        </button>
       </div>
      </div>

      {/* Performance Overview Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>VIEWS</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.views?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-slate-900">
         {perfSnapshot?.metrics.views?.value.toLocaleString() || "12,500"}
        </div>
        <span className="text-[10px] text-slate-500 block">Measured release</span>
       </div>

       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>RETENTION</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.averagePercentageViewed?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-teal-600">
         {perfSnapshot?.metrics.averagePercentageViewed?.value || 58}%
        </div>
        <span className="text-[10px] text-slate-500 block">Avg % Viewed</span>
       </div>

       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>CTR</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.ctr?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-indigo-600">
         {perfSnapshot?.metrics.ctr?.value || 7.2}%
        </div>
        <span className="text-[10px] text-slate-500 block">Click-Through</span>
       </div>

       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>WATCH TIME</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.watchTimeHours?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-purple-600">
         {perfSnapshot?.metrics.watchTimeHours?.value.toLocaleString() || "1,450"}h
        </div>
        <span className="text-[10px] text-slate-500 block">Total hours</span>
       </div>

       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>LIKES</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.likes?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-amber-600">
         {perfSnapshot?.metrics.likes?.value.toLocaleString() || "890"}
        </div>
        <span className="text-[10px] text-slate-500 block">Positive signals</span>
       </div>

       <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <div className="flex justify-between text-slate-500 text-[10px] uppercase">
         <span>COMMENTS</span>
         <span className="text-emerald-600 font-bold">{perfSnapshot?.metrics.comments?.availability || "AVAILABLE"}</span>
        </div>
        <div className="text-lg font-extrabold text-slate-700">
         {perfSnapshot?.metrics.comments?.value.toLocaleString() || "142"}
        </div>
        <span className="text-[10px] text-slate-500 block">Audience inquiries</span>
       </div>
      </div>
     </div>

     {/* Strategic Learning Insights Dashboard */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Lightbulb className="w-4 h-4 text-amber-600" />
         Strategic Creator Learning Insights ({perfInsights.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-sans">
         Recurring patterns detected with strict confidence thresholds and alternative explanations.
        </p>
       </div>
      </div>

      {perfInsights.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No learning insights generated yet. Record performance data to detect recurring patterns.</p>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {perfInsights.map((ins) => (
         <div key={ins.insightId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
           <span className="text-xs font-bold text-slate-700 font-sans">{ins.category}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            ins.confidence === 'HIGH_CONFIDENCE' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            ins.confidence === 'MODERATE_CONFIDENCE' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
            'bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200'
           }`}>
            {ins.confidence}
           </span>
          </div>

          <p className="text-xs text-slate-700 font-sans leading-relaxed">
           <strong>Signal:</strong> {ins.observedSignal}
          </p>

          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1 text-xs text-slate-500 font-sans">
           <p><strong>Recommended Action:</strong> {ins.recommendedAction}</p>
           <p className="text-[11px] font-mono text-purple-600">Causality: {ins.causalityType} (Sample: {ins.sampleSize.toLocaleString()} views)</p>
          </div>

          <button
           onClick={() => setInspectedInsight(ins)}
           className="text-xs text-indigo-600 hover:text-indigo-600 font-mono hover:underline"
          >
           Why Did This Perform This Way?
          </button>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Audience Question & Objection Intelligence */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <MessageSquare className="w-4 h-4 text-cyan-600" />
         Audience Question & Objection Signals ({audienceSignals.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-sans">
         Viewer inquiries classified safely. Audience comments are signals requiring research, never facts by default.
        </p>
       </div>
      </div>

      {audienceSignals.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No audience signals logged yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">CATEGORY</th>
           <th className="p-2.5">VIEWER COMMENT</th>
           <th className="p-2.5">VALIDATION STATE</th>
           <th className="p-2.5">RESEARCH ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {audienceSignals.map((sig) => (
           <tr key={sig.signalId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-indigo-600">{sig.category}</td>
            <td className="p-2.5 text-slate-700 font-sans max-w-xs truncate">{sig.rawText}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
              REQUIRES VALIDATION
             </span>
            </td>
            <td className="p-2.5">
             <button
              onClick={() => handleCreateResearchOpportunity(sig.signalId)}
              disabled={isCreatingResearchOpp || Boolean(sig.researchOpportunityId)}
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-slate-900 text-[11px] font-bold transition"
             >
              {sig.researchOpportunityId ? "Queued" : "Create Research Task"}
             </button>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Creator Experiments Panel */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <FlaskConical className="w-4 h-4 text-emerald-600" />
         Creator Content Experiments ({experiments.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-sans">
         Structured A/B testing across hooks, packaging, and presentation pacing without fabricated statistical significance.
        </p>
       </div>
      </div>

      {experiments.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No content experiments active. Click "New A/B Experiment" to set up a test.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">VARIABLE</th>
           <th className="p-2.5">HYPOTHESIS</th>
           <th className="p-2.5">CONTROL VS VARIANT</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">CONCLUSION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {experiments.map((exp) => (
           <tr key={exp.experimentId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-purple-600">{exp.variable}</td>
            <td className="p-2.5 text-slate-700 font-sans max-w-xs truncate">{exp.hypothesis}</td>
            <td className="p-2.5 text-slate-500 text-[11px]">
             <div>C: {exp.control}</div>
             <div>V: {exp.variant}</div>
            </td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">
              {exp.status}
             </span>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              exp.conclusionState === 'SUPPORTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
              exp.conclusionState === 'PROMISING' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
              'bg-slate-50 text-slate-500 border-slate-200'
             }`}>
              {exp.conclusionState}
             </span>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Research Feedback Opportunities Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Compass className="w-4 h-4 text-teal-600" />
         Performance-Driven Research Opportunities ({researchOpportunities.length})
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-sans">
         Bridges performance signals back into structured research investigation tasks.
        </p>
       </div>
      </div>

      {researchOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No research opportunities queued.</p>
      ) : (
       <div className="divide-y divide-slate-200">
        {researchOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="py-3 flex items-start justify-between gap-4 font-sans text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2 font-mono">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-800">
             {opp.triggeredBy}
            </span>
            <span className="font-bold text-slate-700">{opp.title}</span>
           </div>
           <p className="text-slate-500">{opp.description}</p>
           <p className="text-[11px] font-mono text-amber-600">Action: {opp.actionRequired}</p>
          </div>
          <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 shrink-0">
           {opp.status}
          </span>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Immutable Performance Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-purple-600" />
        Immutable Performance Audit Ledger ({perfHistory.length} Events)
       </h3>
      </div>

      {perfHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No performance audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {perfHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-purple-600">{ev.action}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Record Snapshot Modal */}
     {showRecordSnapshotModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-purple-200/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold text-slate-900">Record Post-Release Performance</h3>
         </div>
         <button
          onClick={() => setShowRecordSnapshotModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="space-y-3 font-sans text-xs">
         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Views:</label>
          <input
           type="number"
           value={newViews}
           onChange={(e) => setNewViews(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 font-mono"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Average % Viewed (Retention):</label>
          <input
           type="number"
           value={newRetention}
           onChange={(e) => setNewRetention(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 font-mono"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Click-Through Rate (CTR %):</label>
          <input
           type="number"
           step="0.1"
           value={newCtr}
           onChange={(e) => setNewCtr(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-purple-500 font-mono"
          />
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowRecordSnapshotModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleRecordPerformanceSnapshot}
          disabled={isRecordingSnapshot}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isRecordingSnapshot ? "Saving..." : "Save Snapshot"}
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Log Audience Modal */}
     {showAudienceModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900">Log Audience Comment / Inquiry</h3>
         </div>
         <button
          onClick={() => setShowAudienceModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <p className="text-xs text-slate-500 font-sans">
         The system will automatically classify this inquiry and flag whether it requires empirical research validation.
        </p>

        <textarea
         rows={4}
         value={newAudienceComment}
         onChange={(e) => setNewAudienceComment(e.target.value)}
         placeholder="Paste viewer question or feedback here..."
         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-cyan-500 font-sans"
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowAudienceModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleLogAudienceComment}
          disabled={isLoggingAudience || !newAudienceComment.trim()}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isLoggingAudience ? "Processing..." : "Process Signal"}
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Create Experiment Modal */}
     {showExperimentModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-indigo-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Set Up Content A/B Experiment</h3>
         </div>
         <button
          onClick={() => setShowExperimentModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="space-y-3 font-sans text-xs">
         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Hypothesis:</label>
          <input
           type="text"
           value={newExpHypothesis}
           onChange={(e) => setNewExpHypothesis(e.target.value)}
           placeholder="e.g. An efficiency-focused hook will improve 30s retention."
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
          />
         </div>

         <div className="grid grid-cols-2 gap-2">
          <div>
           <label className="text-[11px] font-mono text-slate-500 block mb-1">Control (A):</label>
           <input
            type="text"
            value={newExpControl}
            onChange={(e) => setNewExpControl(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
           />
          </div>
          <div>
           <label className="text-[11px] font-mono text-slate-500 block mb-1">Variant (B):</label>
           <input
            type="text"
            value={newExpVariant}
            onChange={(e) => setNewExpVariant(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
           />
          </div>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowExperimentModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleCreateExperiment}
          disabled={isCreatingExperiment || !newExpHypothesis.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isCreatingExperiment ? "Creating..." : "Create Experiment"}
         </button>
        </div>
       </div>
      </div>
     )}

     {/* "Why Did This Perform This Way?" Inspector Modal */}
     {inspectedInsight && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">Performance Inference Inspector</h3>
         </div>
         <button
          onClick={() => setInspectedInsight(null)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs">
         <div className="flex justify-between text-slate-500">
          <span>INSIGHT ID:</span>
          <span className="font-bold text-slate-900">{inspectedInsight.insightId}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>CATEGORY:</span>
          <span className="text-purple-600 font-bold">{inspectedInsight.category}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>CONFIDENCE:</span>
          <span className="text-emerald-600 font-bold">{inspectedInsight.confidence}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>CAUSALITY LEVEL:</span>
          <span className="text-amber-600 font-bold">{inspectedInsight.causalityType}</span>
         </div>
        </div>

        <div className="space-y-3 text-xs font-sans">
         <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">OBSERVED SIGNAL</span>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 leading-relaxed">
           {inspectedInsight.observedSignal}
          </p>
         </div>

         <div>
          <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold block mb-1">ALTERNATIVE EXPLANATIONS</span>
          <ul className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-700 space-y-1">
           {inspectedInsight.alternativeExplanations.map((alt, idx) => (
            <li key={idx} className="flex items-start gap-2">
             <span className="text-slate-500">â€¢</span>
             <span>{alt}</span>
            </li>
           ))}
          </ul>
         </div>

         <div>
          <span className="text-[10px] font-mono text-emerald-600 uppercase font-bold block mb-1">RECOMMENDED ACTION</span>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-emerald-600">
           {inspectedInsight.recommendedAction}
          </p>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setInspectedInsight(null)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Close
         </button>
        </div>
       </div>
      </div>
     )}
    </div>
   )}

   {/* TAB: CREATOR INTELLIGENCE ECOSYSTEM & BENCHMARK SYNTHESIS (PHASE 81) */}
   {activeTab === "intelligence" && (
    <div className="space-y-6">
     {/* Notifications */}
     {intelSuccessMsg && (
      <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-600/80 text-cyan-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-cyan-600" />
       <span>{intelSuccessMsg}</span>
      </div>
     )}

     {intelErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{intelErrorMsg}</span>
      </div>
     )}

     {/* Top Ecosystem Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-50 text-cyan-600 border border-cyan-200">
          ECOSYSTEM HARDENING ACTIVE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshots: {ingestionSnapshots.length} | Aligned Pairs: {synthesisReport?.alignedMethodologiesCount || 0}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-5 h-5 text-cyan-600" />
         Creator Intelligence Ecosystem & Cross-Project Benchmark Synthesizer
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Multi-platform honest ingestion adapters and evidence-grounded cross-project benchmark comparability.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => setShowImportModal(true)}
         className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <UploadCloud className="w-3.5 h-3.5" />
         Import Platform Data
        </button>
        <button
         onClick={handleRunBenchmarkSynthesis}
         disabled={isSynthesizing}
         className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizing ? "animate-spin" : ""}`} />
         {isSynthesizing ? "Synthesizing..." : "Synthesize Benchmarks"}
        </button>
       </div>
      </div>

      {/* Platform Ingestion Adapters Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex justify-between items-center text-slate-500">
         <span className="font-bold text-slate-700">YouTube Ingestion Adapter</span>
         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
          IMPORT_AVAILABLE
         </span>
        </div>
        <p className="text-[11px] text-slate-500 font-sans">
         Honest ingestion of video performance, CTR, and audience retention metrics.
        </p>
        <div className="text-[10px] text-slate-500 font-mono">
         State: Local structured import ready
        </div>
       </div>

       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex justify-between items-center text-slate-500">
         <span className="font-bold text-slate-700">Podcast Ingestion Adapter</span>
         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white rounded-[24px] shadow-sm text-slate-500 border border-slate-200">
          NOT_CONFIGURED
         </span>
        </div>
        <p className="text-[11px] text-slate-500 font-sans">
         RSS audio stream telemetry and completion metrics import.
        </p>
        <div className="text-[10px] text-slate-500 font-mono">
         State: Awaiting feed credentials
        </div>
       </div>

       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
        <div className="flex justify-between items-center text-slate-500">
         <span className="font-bold text-slate-700">Creator Manual Import</span>
         <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
          LOCAL_ONLY
         </span>
        </div>
        <p className="text-[11px] text-slate-500 font-sans">
         Structured direct import of reviewer lab benchmarks and audience feedback.
        </p>
        <div className="text-[10px] text-slate-500 font-mono">
         State: Ready for direct payloads
        </div>
       </div>
      </div>
     </div>

     {/* Cross-Project Benchmark Synthesizer Panel */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-4 h-4 text-cyan-600" />
         Cross-Project Benchmark Comparability Matrix ({synthesisReport?.comparisonPairs?.length || 0} Pairs)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-sans">
         Rigorous methodology matching across resolution, presets, APIs, and test conditions before comparing scores.
        </p>
       </div>
      </div>

      {!synthesisReport || synthesisReport.comparisonPairs.length === 0 ? (
       <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2">
        <p className="text-xs font-mono text-slate-500">No benchmark synthesis generated yet.</p>
        <button
         onClick={handleRunBenchmarkSynthesis}
         disabled={isSynthesizing}
         className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-slate-900 text-xs font-mono font-bold transition"
        >
         Run Benchmark Synthesis
        </button>
       </div>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">BENCHMARK</th>
           <th className="p-2.5">PRIMARY ENTITY (A)</th>
           <th className="p-2.5">COMPARED ENTITY (B)</th>
           <th className="p-2.5">COMPARABILITY STATE</th>
           <th className="p-2.5">DELTA</th>
           <th className="p-2.5">METHODOLOGY DIFFERENCES</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {synthesisReport.comparisonPairs.map((pair) => (
           <tr key={pair.pairId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">{pair.benchmarkA.benchmarkName}</td>
            <td className="p-2.5 text-cyan-600">
             <div>{pair.benchmarkA.entityName}</div>
             <div className="text-[11px] text-slate-500 font-bold">{pair.benchmarkA.score} {pair.benchmarkA.metricUnit}</div>
            </td>
            <td className="p-2.5 text-purple-600">
             <div>{pair.benchmarkB.entityName}</div>
             <div className="text-[11px] text-slate-500 font-bold">{pair.benchmarkB.score} {pair.benchmarkB.metricUnit}</div>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              pair.comparabilityState === "DIRECTLY_COMPARABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              pair.comparabilityState === "COMPARABLE_WITH_CAVEATS" ? "bg-indigo-50 text-indigo-600 border-indigo-200" :
              pair.comparabilityState === "PARTIALLY_COMPARABLE" ? "bg-amber-50 text-amber-600 border-amber-200" :
              pair.comparabilityState === "CONFLICTED" ? "bg-rose-50 text-rose-600 border-rose-200" :
              "bg-slate-50 text-slate-500 border-slate-200"
             }`}>
              {pair.comparabilityState}
             </span>
            </td>
            <td className="p-2.5">
             <span className={`font-bold ${pair.scoreDeltaPercent >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {pair.scoreDeltaPercent >= 0 ? `+${pair.scoreDeltaPercent}%` : `${pair.scoreDeltaPercent}%`}
             </span>
            </td>
            <td className="p-2.5 text-[11px] text-slate-500 font-sans">
             {pair.methodologyDifferences.length > 0 ? (
              <ul className="list-disc list-inside space-y-0.5 text-amber-600/90">
               {pair.methodologyDifferences.map((diff, idx) => (
                <li key={idx}>{diff}</li>
               ))}
              </ul>
             ) : (
              <span className="text-emerald-600 font-mono">Full alignment across presets & resolution</span>
             )}
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Ingestion Snapshots Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <UploadCloud className="w-4 h-4 text-cyan-600" />
        Ingestion Snapshot History ({ingestionSnapshots.length})
       </h3>
      </div>

      {ingestionSnapshots.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No platform ingestion snapshots recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">PLATFORM</th>
           <th className="p-2.5">ITEMS INGESTED</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">SNAPSHOT HASH</th>
           <th className="p-2.5">TIMESTAMP</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {ingestionSnapshots.map((snap) => (
           <tr key={snap.snapshotId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-cyan-600">{snap.platform}</td>
            <td className="p-2.5 text-slate-700">{snap.observations.length} items</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              {snap.validationStatus}
             </span>
            </td>
            <td className="p-2.5 text-slate-500">{snap.snapshotHash}</td>
            <td className="p-2.5 text-slate-500">{new Date(snap.ingestedAt).toLocaleTimeString()}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Immutable Ingestion & Synthesis Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-cyan-600" />
        Immutable Ingestion & Synthesis Audit Ledger ({intelHistory.length} Events)
       </h3>
      </div>

      {intelHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {intelHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-cyan-600">{ev.action}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Import Platform Data Modal */}
     {showImportModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-cyan-200/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900">Import Platform Ingestion Batch</h3>
         </div>
         <button
          onClick={() => setShowImportModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="space-y-3 font-sans text-xs">
         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Platform Adapter:</label>
          <select
           value={importPlatform}
           onChange={(e) => setImportPlatform(e.target.value as AdapterPlatform)}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
          >
           <option value="YOUTUBE">YouTube (IMPORT_AVAILABLE)</option>
           <option value="PODCAST">Podcast (NOT_CONFIGURED)</option>
           <option value="CREATOR_IMPORT">Creator Manual Import (LOCAL_ONLY)</option>
          </select>
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Views / Downloads:</label>
          <input
           type="number"
           value={importViews}
           onChange={(e) => setImportViews(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Average Retention (%):</label>
          <input
           type="number"
           value={importRetention}
           onChange={(e) => setImportRetention(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Click-Through Rate (%):</label>
          <input
           type="number"
           step="0.1"
           value={importCtr}
           onChange={(e) => setImportCtr(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
          />
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowImportModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleImportPlatformData}
          disabled={isIngesting}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          {isIngesting ? "Ingesting..." : "Validate & Ingest"}
         </button>
        </div>
       </div>
      </div>
     )}
    </div>
   )}

   {/* TAB: PRODUCTION MATRIX, BENCHMARK DIFF & ASSET ASSEMBLY (PHASE 82) */}
   {activeTab === "matrix" && (
    <div className="space-y-[22px]">
     {/* Notifications */}
     {matrixSuccessMsg && (
      <div className="p-4 rounded-[10px] bg-verified-bg border border-teal-600/80 text-verified text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-verified" />
       <span>{matrixSuccessMsg}</span>
      </div>
     )}

     {matrixErrorMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-conflict" />
       <span>{matrixErrorMsg}</span>
      </div>
     )}

     {/* Top Production Matrix Overview Header */}
     <div className="p-6 rounded-[14px] bg-card rounded-[24px]  border border-line-soft space-y-5 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-verified-bg text-verified border border-verified-bg">
          SHARED EVIDENCE GRAPH BOUND
         </span>
         <span className="text-xs font-mono text-muted-2">
          Shared Hash: {productionMatrix?.sharedEvidenceSnapshotHash || "snap-evidence-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
         <Layers className="w-5 h-5 text-verified" />
         Creator Multi-Variant Production Matrix & Asset Assembler
        </h2>
        <p className="text-xs text-muted-2 font-sans">
         Manage multiple production variants (Long-Form, Shorts, Podcast) sharing one verified evidence graph with automated asset assembly.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => setShowCreateVariantModal(true)}
         className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-ink px-3.5 py-2 rounded-[10px] text-xs font-bold font-mono  transition"
        >
         <Plus className="w-3.5 h-3.5" />
         Create Production Variant
        </button>
       </div>
      </div>

      {/* Matrix Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">TOTAL VARIANTS</span>
        <span className="text-base font-bold text-ink">{productionMatrix?.totalVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">ACTIVE VARIANTS</span>
        <span className="text-base font-bold text-verified">{productionMatrix?.activeVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">READY FOR REVIEW</span>
        <span className="text-base font-bold text-verified">{productionMatrix?.readyVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">BLOCKED VARIANTS</span>
        <span className="text-base font-bold text-conflict">{productionMatrix?.blockedVariantsCount || 0}</span>
       </div>
      </div>
     </div>

     {/* Production Variants Table */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Layers className="w-4 h-4 text-verified" />
        Production Variants ({productionMatrix?.variants?.length || 0})
       </h3>
      </div>

      {!productionMatrix || productionMatrix.variants.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No production variants in matrix.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">VARIANT NAME</th>
           <th className="p-2.5">FORMAT</th>
           <th className="p-2.5">TARGET DURATION</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">EVIDENCE CLAIMS</th>
           <th className="p-2.5">READINESS</th>
           <th className="p-2.5">ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {productionMatrix.variants.map((v) => (
           <tr
            key={v.variantId}
            className={`hover:bg-slate-100 cursor-pointer ${
             selectedVariant?.variantId === v.variantId ? "bg-verified-bg border-l-2 border-teal-500" : ""
            }`}
            onClick={() => setSelectedVariant(v)}
           >
            <td className="p-2.5 font-bold text-ink">
             <div>{v.name}</div>
             <div className="text-[10px] text-muted-2">{v.variantId}</div>
            </td>
            <td className="p-2.5 text-verified font-bold">{v.variantType}</td>
            <td className="p-2.5 text-ink">{v.targetDurationMinutes} min</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              v.status === "APPROVED" || v.status === "CERTIFIED" ? "bg-verified-bg text-verified border-verified-bg" :
              v.status === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
              "bg-paper text-ink border-line-soft"
             }`}>
              {v.status}
             </span>
            </td>
            <td className="p-2.5 text-muted-2">{v.evidenceBindings.length} verified</td>
            <td className="p-2.5">
             <span className={`font-bold ${v.readinessScore >= 80 ? "text-verified" : "text-warning"}`}>
              {v.readinessScore}%
             </span>
            </td>
            <td className="p-2.5">
             <button
              onClick={(e) => {
               e.stopPropagation();
               setSelectedVariant(v);
              }}
              className="px-2.5 py-1 rounded bg-paper hover:bg-slate-100 text-verified text-[11px] font-mono transition"
             >
              Inspect
             </button>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Benchmark Diff Engine & Intelligent Asset Assembler Grid */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-Time Benchmark Diff Inspector */}
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
         <GitCompare className="w-4 h-4 text-verified" />
         Hardware Benchmark Diff Inspector
        </h3>
       </div>

       {benchmarkDiff ? (
        <div className="space-y-4 text-xs font-mono">
         <div className="p-4 rounded-[10px] bg-paper border border-line-soft space-y-2">
          <div className="flex justify-between items-center text-muted-2">
           <span className="font-bold text-ink">{benchmarkDiff.benchmarkName}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            benchmarkDiff.diffState === "IDENTICAL" ? "bg-card rounded-[24px]  text-ink border-line-soft" :
            benchmarkDiff.diffState === "NUMERIC_CHANGE_ONLY" ? "bg-verified-bg text-verified border-verified-bg" :
            benchmarkDiff.diffState === "METHODOLOGY_CHANGE" ? "bg-warning-bg text-warning border-warning-bg" :
            "bg-citation-bg text-citation border-citation-bg"
           }`}>
            {benchmarkDiff.diffState}
           </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-line-soft text-[11px]">
           <div>
            <span className="text-muted-2 block">Baseline ({benchmarkDiff.baseline.hardwareIdentity}):</span>
            <span className="text-ink font-bold">{benchmarkDiff.baseline.score} {benchmarkDiff.baseline.metricUnit}</span>
           </div>
           <div>
            <span className="text-muted-2 block">Candidate ({benchmarkDiff.candidate.hardwareIdentity}):</span>
            <span className="text-verified font-bold">{benchmarkDiff.candidate.score} {benchmarkDiff.candidate.metricUnit}</span>
           </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-line-soft">
           <span className="text-muted-2">Numerical Delta:</span>
           <span className={`font-bold ${benchmarkDiff.percentageDelta >= 0 ? "text-verified" : "text-conflict"}`}>
            {benchmarkDiff.percentageDelta >= 0 ? `+${benchmarkDiff.percentageDelta}%` : `${benchmarkDiff.percentageDelta}%`} ({benchmarkDiff.numericDelta > 0 ? `+${benchmarkDiff.numericDelta}` : benchmarkDiff.numericDelta} {benchmarkDiff.baseline.metricUnit})
           </span>
          </div>
         </div>

         {benchmarkDiff.dimensionDifferences.length > 0 && (
          <div className="space-y-1">
           <span className="text-[10px] font-bold uppercase text-muted-2">Dimension Variations:</span>
           <ul className="bg-paper p-3 rounded-[8px] border border-line-soft space-y-1 text-[11px] text-warning">
            {benchmarkDiff.dimensionDifferences.map((d, i) => (
             <li key={i} className="flex items-start gap-1.5">
              <span className="text-muted-2">â€¢</span>
              <span>{d}</span>
             </li>
            ))}
           </ul>
          </div>
         )}

         <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1 font-sans text-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-muted-2 block">Recommended Action:</span>
          <p className="text-ink">{benchmarkDiff.recommendedAction}</p>
         </div>
        </div>
       ) : (
        <p className="text-xs font-mono text-muted-2 text-center py-4">No benchmark diff loaded.</p>
       )}
      </div>

      {/* Intelligent Asset Assembler Panel */}
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <div>
         <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <Boxes className="w-4 h-4 text-verified" />
          Intelligent Asset Assembler ({assemblyPlan?.assembledAssets?.length || 0} Assets)
         </h3>
         <p className="text-[11px] text-muted-2 font-sans">
          Mapped for {selectedVariant ? selectedVariant.name : "Default Variant"}
         </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-verified-bg text-verified border border-verified-bg">
         {assemblyPlan?.completenessScore || 0}% Complete
        </span>
       </div>

       {!assemblyPlan || assemblyPlan.assembledAssets.length === 0 ? (
        <p className="text-xs font-mono text-muted-2 text-center py-4">No assembled assets available.</p>
       ) : (
        <div className="space-y-2">
         {assemblyPlan.assembledAssets.map((ast) => (
          <div key={ast.assetId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1.5 text-xs font-mono">
           <div className="flex justify-between items-center">
            <span className="font-bold text-ink">{ast.name}</span>
            <div className="flex items-center gap-1.5">
             {ast.isReusedExisting && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-card rounded-[24px]  text-muted-2 border border-line-soft">
               REUSED
              </span>
             )}
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              ast.assemblyState === "AVAILABLE" ? "bg-verified-bg text-verified border-verified-bg" :
              ast.assemblyState === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
              ast.assemblyState === "STALE" ? "bg-warning-bg text-warning border-warning-bg" :
              "bg-card rounded-[24px]  text-muted-2 border-line-soft"
             }`}>
              {ast.assemblyState}
             </span>
            </div>
           </div>
           <div className="text-[10px] text-muted-2 truncate">
            Lineage: {ast.upstreamEvidenceLineage}
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>

     {/* Immutable Production Matrix Audit Ledger */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <History className="w-4 h-4 text-verified" />
        Immutable Production Matrix Audit Ledger ({matrixHistory.length} Events)
       </h3>
      </div>

      {matrixHistory.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {matrixHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-verified">{ev.action}</td>
            <td className="p-2.5 text-ink font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Create Variant Modal */}
     {showCreateVariantModal && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-card rounded-[24px]  border border-teal-800/80 rounded-[14px] max-w-md w-full p-6 space-y-4  animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-verified" />
          <h3 className="text-sm font-bold text-ink">Create Production Variant</h3>
         </div>
         <button
          onClick={() => setShowCreateVariantModal(false)}
          className="text-muted-2 hover:text-slate-700 p-1 rounded-[8px] hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="space-y-3 font-sans text-xs">
         <div>
          <label className="text-[11px] font-mono text-muted-2 block mb-1">Variant Name:</label>
          <input
           type="text"
           value={newVariantName}
           onChange={(e) => setNewVariantName(e.target.value)}
           placeholder="e.g. YouTube Short: GPU Power Efficiency"
           className="w-full bg-paper border border-line-soft rounded-[10px] px-3 py-2 text-ink focus:outline-none focus:border-teal-500 font-sans"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-muted-2 block mb-1">Variant Format:</label>
          <select
           value={newVariantType}
           onChange={(e) => setNewVariantType(e.target.value as ProductionVariantType)}
           className="w-full bg-paper border border-line-soft rounded-[10px] px-3 py-2 text-ink focus:outline-none focus:border-teal-500 font-mono"
          >
           <option value="YOUTUBE_LONG_FORM">YouTube Long Form (10-20 min)</option>
           <option value="YOUTUBE_SHORT">YouTube Short (1 min)</option>
           <option value="PODCAST">Podcast Audio (30-45 min)</option>
           <option value="CUSTOM_CREATOR_VARIANT">Custom Creator Variant</option>
          </select>
         </div>

         <div>
          <label className="text-[11px] font-mono text-muted-2 block mb-1">Target Duration (Minutes):</label>
          <input
           type="number"
           value={newVariantDuration}
           onChange={(e) => setNewVariantDuration(Number(e.target.value))}
           className="w-full bg-paper border border-line-soft rounded-[10px] px-3 py-2 text-ink focus:outline-none focus:border-teal-500 font-mono"
          />
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-line-soft">
         <button
          onClick={() => setShowCreateVariantModal(false)}
          className="px-4 py-2 rounded-[10px] bg-paper hover:bg-slate-100 text-ink text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleCreateVariant}
          disabled={isCreatingVariant || !newVariantName.trim()}
          className="px-4 py-2 rounded-[10px] bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-ink text-xs font-mono font-bold transition"
         >
          {isCreatingVariant ? "Creating..." : "Create Variant"}
         </button>
        </div>
       </div>
      </div>
     )}
    </div>
   )}

   {/* TAB: PRODUCTION ASSET PACKAGE EXPORT & RENDER MANIFEST (PHASE 83) */}
   {activeTab === "exportWorkspace" && (
    <div className="space-y-[22px]">
     {/* Notifications */}
     {exportSuccessMsg && (
      <div className="p-4 rounded-[10px] bg-blue-950/60 border border-blue-600/80 text-citation text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-blue-600" />
       <span>{exportSuccessMsg}</span>
      </div>
     )}

     {exportErrorMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-conflict" />
       <span>{exportErrorMsg}</span>
      </div>
     )}

     {/* Top Export Readiness Header */}
     <div className="p-6 rounded-[14px] bg-card rounded-[24px]  border border-line-soft space-y-5 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          exportPackage?.status === "EXPORTED" ? "bg-verified-bg text-verified border-verified-bg" :
          exportPackage?.status === "READY" ? "bg-blue-950 text-citation border-blue-800" :
          exportPackage?.status === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
          "bg-paper text-ink border-line-soft"
         }`}>
          {exportPackage?.status || "DRAFT"}
         </span>
         <span className="text-xs font-mono text-muted-2">
          Package Hash: {exportPackage?.packageSnapshotHash || "pkg-snap-uncalculated"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
         <FileArchive className="w-5 h-5 text-blue-600" />
         Creator Production Asset Package Export & Render Manifest Generator
        </h2>
        <p className="text-xs text-muted-2 font-sans">
         Transform verified assets and variant assembly states into deterministic, export-ready multi-format packages.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleValidateExportPackage}
         disabled={isValidatingPackage}
         className="flex items-center gap-1.5 bg-paper hover:bg-slate-100 text-ink px-3.5 py-2 rounded-[10px] text-xs font-bold font-mono border border-line transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isValidatingPackage ? "animate-spin" : ""}`} />
         Validate Package
        </button>
        <button
         onClick={handleExecuteExport}
         disabled={isExporting || exportPackage?.status === "BLOCKED" || exportPackage?.status === "EXPORTED"}
         className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-ink px-4 py-2 rounded-[10px] text-xs font-bold font-mono  transition"
        >
         <Download className="w-3.5 h-3.5" />
         {isExporting ? "Exporting..." : exportPackage?.status === "EXPORTED" ? "Exported" : "Execute Export"}
        </button>
       </div>
      </div>

      {/* Snapshot & Certification Hash Bindings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">CERTIFICATION BINDING</span>
        <span className="text-ink font-bold truncate block">{exportPackage?.certificationCertificateId || "CERT-VERIFIED"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">EVIDENCE SNAPSHOT</span>
        <span className="text-blue-600 font-bold truncate block">{exportPackage?.evidenceSnapshotHash || "esnap-default"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">PROJECT SNAPSHOT</span>
        <span className="text-verified font-bold truncate block">{exportPackage?.projectSnapshotHash || "psnap-default"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">SCRIPT VERSION</span>
        <span className="text-verified font-bold block">v{exportPackage?.scriptVersion || 1}</span>
       </div>
      </div>
     </div>

     {/* Multi-Format Export Targets Matrix */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-600" />
        Target Readiness Matrix ({exportPackage?.targets?.length || 0} Targets)
       </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
       {exportPackage?.targets.map((t) => (
        <div key={t.targetFormat} className="p-4 rounded-[10px] bg-paper border border-line-soft space-y-2">
         <div className="flex justify-between items-center">
          <span className="font-bold text-ink">{t.displayName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
           t.status === "READY" ? "bg-verified-bg text-verified border-verified-bg" :
           t.status === "READY_WITH_WARNINGS" ? "bg-warning-bg text-warning border-warning-bg" :
           "bg-conflict-bg text-conflict border-conflict-bg"
          }`}>
           {t.status}
          </span>
         </div>
         <div className="text-[11px] text-muted-2 space-y-1">
          <div>Aspect Ratio: <span className="text-ink">{t.aspectRatio}</span></div>
          {t.targetDurationMinutes && <div>Target Duration: <span className="text-ink">{t.targetDurationMinutes} min</span></div>}
          <div>Required Assets: <span className="text-citation">{t.requiredAssetTypes.length} types</span></div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Asset Package Inventory & Render Manifest Panels */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Asset Package Inventory */}
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
         <Boxes className="w-4 h-4 text-blue-600" />
         Asset Package Inventory ({exportPackage?.assets?.length || 0})
        </h3>
       </div>

       <div className="space-y-2">
        {exportPackage?.assets.map((ast) => (
         <div key={ast.assetId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-ink">{ast.name}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            ast.status === "AVAILABLE" ? "bg-verified-bg text-verified border-verified-bg" :
            ast.status === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
            "bg-card rounded-[24px]  text-muted-2 border-line-soft"
           }`}>
            {ast.status}
           </span>
          </div>
          <div className="text-[11px] text-citation">{ast.expectedFilename} ({ast.mimeType})</div>
          <div className="text-[10px] text-muted-2 truncate">Lineage: {ast.upstreamLineage}</div>
         </div>
        ))}
       </div>
      </div>

      {/* Render Manifest Inspector */}
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <div>
         <h3 className="text-sm font-bold text-ink flex items-center gap-2">
          <Tv className="w-4 h-4 text-blue-600" />
          Automated Render Manifest ({exportPackage?.renderManifest?.entries?.length || 0} Entries)
         </h3>
         <p className="text-[11px] text-muted-2 font-sans">
          Deterministic manifest with honest capability reporting.
         </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-citation border border-blue-800">
         {exportPackage?.renderManifest?.manifestHash}
        </span>
       </div>

       <div className="space-y-2">
        {exportPackage?.renderManifest?.entries.map((rme) => (
         <div key={rme.entryId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-ink">{rme.expectedFilename}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            rme.renderCapabilityState === "AVAILABLE" ? "bg-verified-bg text-verified border-verified-bg" :
            rme.renderCapabilityState === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
            "bg-card rounded-[24px]  text-warning border-amber-200/50"
           }`}>
            {rme.renderCapabilityState}
           </span>
          </div>
          <div className="text-[11px] text-muted-2">
           Output: {rme.outputFormat} | Resolution: {rme.resolution} | Aspect: {rme.aspectRatio}
          </div>
          {rme.blockerReason && (
           <div className="text-[10px] text-conflict">Blocker: {rme.blockerReason}</div>
          )}
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* Package Validation Inspector */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        Package Validation Report ({exportPackage?.validationReport?.issues?.length || 0} Issues)
       </h3>
       <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
        exportPackage?.validationReport?.validationStatus === "PASS" ? "bg-verified-bg text-verified border-verified-bg" :
        exportPackage?.validationReport?.validationStatus === "WARNING" ? "bg-warning-bg text-warning border-warning-bg" :
        "bg-conflict-bg text-conflict border-conflict-bg"
       }`}>
        {exportPackage?.validationReport?.validationStatus || "PASS"}
       </span>
      </div>

      {!exportPackage?.validationReport || exportPackage.validationReport.issues.length === 0 ? (
       <div className="p-4 rounded-[10px] bg-paper border border-line-soft text-center text-xs font-mono text-verified">
        All 15 package validation dimensions passed with zero critical blockers.
       </div>
      ) : (
       <div className="space-y-2">
        {exportPackage.validationReport.issues.map((iss) => (
         <div key={iss.issueId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-ink">{iss.category}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            iss.isBlocking ? "bg-conflict-bg text-conflict border-conflict-bg" : "bg-warning-bg text-warning border-warning-bg"
           }`}>
            {iss.severity}
           </span>
          </div>
          <div className="text-ink font-sans">{iss.reason}</div>
          <div className="text-[11px] text-citation">Action: {iss.requiredAction}</div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Immutable Export Audit Ledger */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <History className="w-4 h-4 text-blue-600" />
        Immutable Production Export Audit Ledger ({exportHistory.length} Events)
       </h3>
      </div>

      {exportHistory.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No export audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {exportHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-citation">{ev.action}</td>
            <td className="p-2.5 text-ink font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>
    </div>
   )}

   {/* TAB: CREATOR MULTI-CHANNEL PUBLISHING ORCHESTRATOR & DISTRIBUTION RECEIPTS (PHASE 84) */}
   {activeTab === "publishingOrchestrator" && (
    <div className="space-y-[22px]">
     {/* Notifications */}
     {publishingSuccessMsg && (
      <div className="p-4 rounded-[10px] bg-violet-950/60 border border-violet-600/80 text-violet-300 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-violet-400" />
       <span>{publishingSuccessMsg}</span>
      </div>
     )}

     {publishingErrorMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-conflict" />
       <span>{publishingErrorMsg}</span>
      </div>
     )}

     {/* Publishing Control Center Overview Header */}
     <div className="p-6 rounded-[14px] bg-card rounded-[24px]  border border-line-soft space-y-5 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          publishingPlan?.status === "PUBLISHED" ? "bg-verified-bg text-verified border-verified-bg" :
          publishingPlan?.status === "PREFLIGHT_PASSED" || publishingPlan?.status === "APPROVED" ? "bg-violet-950 text-violet-300 border-violet-800" :
          publishingPlan?.status === "PREFLIGHT_BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
          "bg-paper text-ink border-line-soft"
         }`}>
          {publishingPlan?.status || "DRAFT"}
         </span>
         <span className="text-xs font-mono text-muted-2">
          Plan Hash: {publishingPlan?.planSnapshotHash || "pplan-snap-uncalculated"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
         <SendHorizontal className="w-5 h-5 text-violet-400" />
         Creator Multi-Channel Publishing Orchestrator & Preflight Gatekeeper
        </h2>
        <p className="text-xs text-muted-2 font-sans">
         Coordinate multi-channel publishing readiness, channel preflight, explicit creator approval, local staging, and immutable distribution receipts.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={loadPublishingState}
         disabled={isPublishingLoading}
         className="flex items-center gap-1.5 bg-paper hover:bg-slate-100 text-ink px-3.5 py-2 rounded-[10px] text-xs font-bold font-mono border border-line transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isPublishingLoading ? "animate-spin" : ""}`} />
         Refresh Plan
        </button>
       </div>
      </div>

      {/* Snapshot & Certification Hash Bindings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">CERTIFICATION BINDING</span>
        <span className="text-ink font-bold truncate block">{publishingPlan?.certificationCertificateId || "CERT-VERIFIED"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">EXPORT PACKAGE HASH</span>
        <span className="text-blue-600 font-bold truncate block">{publishingPlan?.exportPackageSnapshotHash || "pkg-snap-default"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">EVIDENCE SNAPSHOT</span>
        <span className="text-verified font-bold truncate block">{publishingPlan?.evidenceSnapshotHash || "esnap-default"}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">SCRIPT VERSION</span>
        <span className="text-verified font-bold block">v{publishingPlan?.scriptVersion || 1}</span>
       </div>
      </div>
     </div>

     {/* Platform Publishing Target Cards */}
     <div className="space-y-4">
      <div className="flex items-center justify-between">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Globe className="w-4 h-4 text-violet-400" />
        Multi-Channel Publishing Targets ({publishingPlan?.targets?.length || 0})
       </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {publishingPlan?.targets.map((tgt) => (
        <div
         key={tgt.targetId}
         onClick={() => setSelectedPublishingTarget(tgt)}
         className={`p-5 rounded-[14px] border transition cursor-pointer space-y-4 ${
          selectedPublishingTarget?.targetId === tgt.targetId
           ? "bg-card rounded-[24px]  border-violet-500 ring-1 ring-violet-500/40 "
           : "bg-card rounded-[24px] shadow-sm/80 border-line-soft hover:border-slate-300"
         }`}
        >
         <div className="flex justify-between items-start">
          <div>
           <span className="text-xs font-bold text-ink block">{tgt.platform}</span>
           <span className="text-[10px] font-mono text-muted-2">Mode: {tgt.mode}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
           tgt.status === "PUBLISHED" ? "bg-verified-bg text-verified border-verified-bg" :
           tgt.status === "APPROVED" || tgt.status === "PREFLIGHT_PASSED" ? "bg-violet-950 text-violet-300 border-violet-800" :
           tgt.status === "STAGING_ONLY" ? "bg-blue-950 text-citation border-blue-800" :
           tgt.status === "PREFLIGHT_BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
           "bg-paper text-muted-2 border-line-soft"
          }`}>
           {tgt.status}
          </span>
         </div>

         <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-[11px]">
           <span className="text-muted-2">Connection:</span>
           <span className="text-warning font-bold">{tgt.connectionState}</span>
          </div>
          <div className="flex justify-between text-[11px]">
           <span className="text-muted-2">Preflight:</span>
           <span className={`font-bold ${tgt.preflightResult?.status === "PASS" ? "text-verified" : tgt.preflightResult?.status === "PASS_WITH_WARNINGS" ? "text-warning" : "text-conflict"}`}>
            {tgt.preflightResult?.status || "PENDING"}
           </span>
          </div>
          <div className="flex justify-between text-[11px]">
           <span className="text-muted-2">Approval:</span>
           <span className={`font-bold ${tgt.approvalState.isApproved ? "text-verified" : "text-muted-2"}`}>
            {tgt.approvalState.isApproved ? "APPROVED" : "PENDING"}
           </span>
          </div>
          {tgt.schedulingConfig?.isScheduled && (
           <div className="flex justify-between text-[11px]">
            <span className="text-muted-2">Scheduled:</span>
            <span className="text-citation truncate">{new Date(tgt.schedulingConfig.scheduledTimestamp).toLocaleTimeString()} ({tgt.schedulingConfig.timezoneIana})</span>
           </div>
          )}
         </div>

         {/* Target Controls */}
         <div className="flex flex-wrap gap-2 pt-2 border-t border-line-soft">
          {!tgt.approvalState.isApproved && (
           <button
            onClick={(e) => {
             e.stopPropagation();
             handleApprovePublishingTarget(tgt.targetId);
            }}
            disabled={isPublishingLoading || tgt.status === "PREFLIGHT_BLOCKED"}
            className="flex-1 py-1.5 rounded-[8px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-ink text-xs font-mono font-bold transition"
           >
            Approve
           </button>
          )}

          {tgt.approvalState.isApproved && tgt.status !== "STAGED" && tgt.status !== "PUBLISHED" && tgt.status !== "STAGING_ONLY" && (
           <button
            onClick={(e) => {
             e.stopPropagation();
             handleStagePublishingTarget(tgt.targetId);
            }}
            disabled={isPublishingLoading}
            className="flex-1 py-1.5 rounded-[8px] bg-blue-600 hover:bg-blue-500 text-ink text-xs font-mono font-bold transition"
           >
            Stage
           </button>
          )}

          {(tgt.status === "STAGED" || tgt.approvalState.isApproved) && tgt.status !== "PUBLISHED" && (
           <button
            onClick={(e) => {
             e.stopPropagation();
             handlePublishTargetExecution(tgt.targetId);
            }}
            disabled={isPublishingLoading}
            className="flex-1 py-1.5 rounded-[8px] bg-violet-600 hover:bg-violet-500 text-ink text-xs font-mono font-bold transition"
           >
            {tgt.connectionState === "NOT_CONFIGURED" ? "Stage Publish" : "Publish"}
           </button>
          )}

          <button
           onClick={(e) => {
            e.stopPropagation();
            setSelectedPublishingTarget(tgt);
            setShowPublishingScheduleModal(true);
           }}
           className="px-2.5 py-1.5 rounded-[8px] bg-paper hover:bg-slate-100 text-ink text-xs font-mono transition"
          >
           Schedule
          </button>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Preflight & "Why Can't I Publish?" Blocker Inspector */}
     {selectedPublishingTarget && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Preflight Inspector */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-violet-400" />
           Preflight Gatekeeper ({selectedPublishingTarget.platform})
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Automated 8-dimension preflight evaluation.
          </p>
         </div>
         <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          selectedPublishingTarget.preflightResult?.status === "PASS" ? "bg-verified-bg text-verified border-verified-bg" :
          selectedPublishingTarget.preflightResult?.status === "PASS_WITH_WARNINGS" ? "bg-warning-bg text-warning border-warning-bg" :
          "bg-conflict-bg text-conflict border-conflict-bg"
         }`}>
          {selectedPublishingTarget.preflightResult?.status || "PASS"}
         </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
         {selectedPublishingTarget.preflightResult?.checks.map((chk) => (
          <div key={chk.checkId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1 text-xs font-mono">
           <div className="flex justify-between items-center">
            <span className="font-bold text-ink">{chk.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             chk.isBlocking ? "bg-conflict-bg text-conflict border-conflict-bg" : "bg-warning-bg text-warning border-warning-bg"
            }`}>
             {chk.status}
            </span>
           </div>
           <div className="text-ink font-sans">{chk.reason}</div>
           <div className="text-[10px] text-muted-2">Upstream: {chk.upstreamDependency} ({chk.originalCause})</div>
           <div className="text-[11px] text-violet-300">Action: {chk.requiredAction}</div>
          </div>
         ))}
        </div>
       </div>

       {/* Publishing Plan Metadata ("Exactly what will be published?") */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <FileText className="w-4 h-4 text-violet-400" />
           Publishing Plan Inspector ({selectedPublishingTarget.platform})
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Verified payload and metadata configured for deployment.
          </p>
         </div>
        </div>

        <div className="p-4 rounded-[10px] bg-paper border border-line-soft space-y-3 text-xs font-mono">
         <div>
          <span className="text-muted-2 block text-[10px]">TITLE</span>
          <span className="text-ink font-bold">{selectedPublishingTarget.metadata.title}</span>
         </div>
         <div>
          <span className="text-muted-2 block text-[10px]">DESCRIPTION / SHOW NOTES</span>
          <p className="text-ink font-sans text-xs">{selectedPublishingTarget.metadata.description}</p>
         </div>
         {selectedPublishingTarget.metadata.chapters && (
          <div>
           <span className="text-muted-2 block text-[10px]">CHAPTER MARKERS</span>
           <div className="flex flex-wrap gap-1 mt-1">
            {selectedPublishingTarget.metadata.chapters.map((ch, idx) => (
             <span key={idx} className="px-2 py-0.5 rounded bg-card rounded-[24px]  text-ink border border-line-soft text-[10px]">
              {ch}
             </span>
            ))}
           </div>
          </div>
         )}
         {selectedPublishingTarget.platform === "PODCAST" && (
          <div className="p-2.5 rounded-[8px] bg-card rounded-[24px]  border border-line-soft space-y-1">
           <span className="text-muted-2 block text-[10px] font-bold">PODCAST AUDIO SPECIFICATION (REQ 24 AUDIT)</span>
           <div className="text-[11px] text-verified">
            Codec: {selectedPublishingTarget.metadata.audioCodec || "WAV_PCM"} | Uncompressed Archival Master: {selectedPublishingTarget.metadata.isUncompressedMaster ? "Yes (24-bit/48kHz)" : "No"}
           </div>
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {/* Immutable Distribution Receipts Ledger */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Receipt className="w-4 h-4 text-violet-400" />
        Immutable Distribution Receipt Ledger ({publishingReceipts.length} Receipts)
       </h3>
      </div>

      {publishingReceipts.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No distribution receipts recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">PLATFORM</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">DETAILS</th>
           <th className="p-2.5 text-right">ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {publishingReceipts.map((rec) => (
           <tr key={rec.receiptId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(rec.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-violet-300">{rec.eventType}</td>
            <td className="p-2.5 text-ink">{rec.platform}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              rec.status === "SUCCESS" ? "bg-verified-bg text-verified border-verified-bg" :
              rec.status === "STAGING_ONLY" ? "bg-blue-950 text-citation border-blue-800" :
              "bg-conflict-bg text-conflict border-conflict-bg"
             }`}>
              {rec.status}
             </span>
            </td>
            <td className="p-2.5 text-ink font-sans truncate max-w-xs">{rec.details}</td>
            <td className="p-2.5 text-right">
             <button
              onClick={() => handleVerifyDistributionReceipt(rec.receiptId)}
              className="px-2 py-1 rounded bg-paper hover:bg-slate-100 text-ink text-[10px] transition"
             >
              Verify
             </button>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Verification Report Modal / Panel */}
     {verificationReport && (
      <div className="p-4 rounded-[10px] bg-card rounded-[24px]  border border-line space-y-2 text-xs font-mono">
       <div className="flex justify-between items-center">
        <span className="font-bold text-ink">Post-Publish Verification Result</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
         verificationReport.status === "VERIFIED" ? "bg-verified-bg text-verified border-verified-bg" :
         "bg-paper text-warning border-warning-bg"
        }`}>
         {verificationReport.status}
        </span>
       </div>
       <p className="text-ink font-sans">{verificationReport.notes}</p>
       <button
        onClick={() => setVerificationReport(null)}
        className="px-3 py-1 rounded bg-paper text-ink text-[10px]"
       >
        Dismiss
       </button>
      </div>
     )}

     {/* Scheduling Dialog Modal */}
     {showPublishingScheduleModal && selectedPublishingTarget && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
       <div className="bg-card rounded-[24px]  border border-line-soft rounded-[14px] p-6 max-w-md w-full space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
         <Calendar className="w-4 h-4 text-violet-400" />
         Schedule {selectedPublishingTarget.platform} Release
        </h3>

        <div className="space-y-3 text-xs font-mono">
         <div>
          <label className="text-muted-2 block mb-1">Scheduled Release Date & Time:</label>
          <input
           type="datetime-local"
           value={publishingScheduleTime}
           onChange={(e) => setPublishingScheduleTime(e.target.value)}
           className="w-full bg-paper border border-line-soft rounded-[10px] px-3 py-2 text-ink focus:outline-none focus:border-violet-500 font-mono"
          />
         </div>

         <div>
          <label className="text-muted-2 block mb-1">Timezone (IANA):</label>
          <select
           value={publishingScheduleTimezone}
           onChange={(e) => setPublishingScheduleTimezone(e.target.value)}
           className="w-full bg-paper border border-line-soft rounded-[10px] px-3 py-2 text-ink focus:outline-none focus:border-violet-500 font-mono"
          >
           <option value="UTC">UTC</option>
           <option value="America/New_York">America/New_York (EST/EDT)</option>
           <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
           <option value="Europe/London">Europe/London (GMT/BST)</option>
          </select>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-line-soft">
         <button
          onClick={() => setShowPublishingScheduleModal(false)}
          className="px-4 py-2 rounded-[10px] bg-paper hover:bg-slate-100 text-ink text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={() => handleSchedulePublishingTarget(selectedPublishingTarget.targetId)}
          disabled={isPublishingLoading || !publishingScheduleTime}
          className="px-4 py-2 rounded-[10px] bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-ink text-xs font-mono font-bold transition"
         >
          Confirm Schedule
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Immutable Publishing Audit History */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <History className="w-4 h-4 text-violet-400" />
        Immutable Publishing Audit Ledger ({publishingHistory.length} Events)
       </h3>
      </div>

      {publishingHistory.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No publishing audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">ACTION</th>
           <th className="p-2.5">DETAILS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {publishingHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-violet-300">{ev.action}</td>
            <td className="p-2.5 text-ink font-sans">{ev.details}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>
    </div>
   )}

   {/* TAB: POST-PUBLICATION INTEGRITY MONITOR & RELEASE HEALTH (PHASE 85) */}
   {activeTab === "publicationIntegrity" && (
    <div className="space-y-[22px]">
     {/* Notifications */}
     {pubIntegritySuccessMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-conflict" />
       <span>{pubIntegritySuccessMsg}</span>
      </div>
     )}

     {pubIntegrityErrorMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-conflict" />
       <span>{pubIntegrityErrorMsg}</span>
      </div>
     )}

     {/* Release Health Overview Header */}
     <div className="p-6 rounded-[14px] bg-card rounded-[24px]  border border-line-soft space-y-5 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          releaseHealthReport?.overallStatus === "PASS" ? "bg-verified-bg text-verified border-verified-bg" :
          releaseHealthReport?.overallStatus === "WARNING" ? "bg-warning-bg text-warning border-warning-bg" :
          releaseHealthReport?.overallStatus === "UNVERIFIABLE" ? "bg-paper text-ink border-line" :
          "bg-conflict-bg text-conflict border-conflict-bg"
         }`}>
          {releaseHealthReport?.overallStatus || "INITIALIZING"}
         </span>
         <span className="text-xs font-mono text-muted-2">
          Report: {releaseHealthReport?.reportId || "crh-pending"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
         <ShieldAlert className="w-5 h-5 text-conflict" />
         Creator Post-Publication Integrity Monitor & Release Health Control Plane
        </h2>
        <p className="text-xs text-muted-2 font-sans">
         Continuous cross-platform state reconciliation, post-publication change detection, certification drift monitoring, and immutable lineage tracking.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleReconcilePublications}
         disabled={isReconciling}
         className="flex items-center gap-1.5 bg-conflict hover:bg-rose-500 disabled:opacity-50 text-ink px-4 py-2 rounded-[10px] text-xs font-bold font-mono  transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? "animate-spin" : ""}`} />
         {isReconciling ? "Reconciling..." : "Reconcile Publications"}
        </button>
       </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">TOTAL TARGETS</span>
        <span className="text-ink font-bold block">{pubReconciliations.length}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">RECONCILED</span>
        <span className="text-verified font-bold block">{releaseHealthReport?.reconciledCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">UNVERIFIABLE</span>
        <span className="text-warning font-bold block">{releaseHealthReport?.unverifiableCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">STALE</span>
        <span className="text-muted-2 font-bold block">{releaseHealthReport?.staleCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">HARD BLOCKERS</span>
        <span className="text-conflict font-bold block">{releaseHealthReport?.activeBlockersCount ?? 0}</span>
       </div>
      </div>
     </div>

     {/* 10-Dimension Continuous Release Health Matrix */}
     {releaseHealthReport && (
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
         <Activity className="w-4 h-4 text-conflict" />
         Continuous Release Health (10 Core Dimensions)
        </h3>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {Object.values(releaseHealthReport.dimensions).map((dim) => (
         <div key={dim.dimensionKey} className="p-3.5 rounded-[10px] bg-paper border border-line-soft space-y-2">
          <div className="flex justify-between items-center">
           <span className="font-bold text-ink truncate">{dim.dimensionName}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            dim.status === "PASS" ? "bg-verified-bg text-verified border-verified-bg" :
            dim.status === "WARNING" ? "bg-warning-bg text-warning border-warning-bg" :
            dim.status === "NOT_CONFIGURED" || dim.status === "UNVERIFIABLE" ? "bg-card rounded-[24px]  text-muted-2 border-line-soft" :
            "bg-conflict-bg text-conflict border-conflict-bg"
           }`}>
            {dim.status}
           </span>
          </div>
          <p className="text-[11px] text-muted-2 font-sans line-clamp-2">{dim.details}</p>
          <div className="text-[10px] text-muted-2 truncate">Upstream: {dim.upstreamDependency}</div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Multi-Platform Reconciliation Matrix */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Globe className="w-4 h-4 text-conflict" />
        Cross-Platform Publication Reconciliation Matrix ({pubReconciliations.length} Targets)
       </h3>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-line-soft text-muted-2 bg-paper">
          <th className="p-2.5">PLATFORM</th>
          <th className="p-2.5">TARGET</th>
          <th className="p-2.5">RECONCILIATION</th>
          <th className="p-2.5">RECEIPT STATE</th>
          <th className="p-2.5">CHANGES</th>
          <th className="p-2.5">BLOCKERS</th>
          <th className="p-2.5 text-right">INSPECT</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {pubReconciliations.map((pub) => (
          <tr
           key={pub.publicationId}
           onClick={() => {
            setSelectedPublication(pub);
            setInspectedPubChanges(pub.changes);
            setInspectedPubLineage(pub.lineage);
           }}
           className={`hover:bg-slate-100 cursor-pointer ${
            selectedPublication?.publicationId === pub.publicationId ? "bg-slate-100/60" : ""
           }`}
          >
           <td className="p-2.5 font-bold text-ink">{pub.platform}</td>
           <td className="p-2.5 text-muted-2 truncate max-w-xs">{pub.expectedState.publicationTarget}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             pub.reconciliationStatus === "MATCHED" ? "bg-verified-bg text-verified border-verified-bg" :
             pub.reconciliationStatus === "CHANGED" ? "bg-warning-bg text-warning border-warning-bg" :
             pub.reconciliationStatus === "UNVERIFIABLE" ? "bg-paper text-muted-2 border-line-soft" :
             "bg-conflict-bg text-conflict border-conflict-bg"
            }`}>
             {pub.reconciliationStatus}
            </span>
           </td>
           <td className="p-2.5 text-ink">{pub.receiptState}</td>
           <td className="p-2.5">
            <span className={pub.changes.length > 0 ? "text-warning font-bold" : "text-muted-2"}>
             {pub.changes.length} detected
            </span>
           </td>
           <td className="p-2.5">
            <span className={pub.blockers.length > 0 ? "text-conflict font-bold" : "text-verified"}>
             {pub.blockers.length} active
            </span>
           </td>
           <td className="p-2.5 text-right">
            <button
             onClick={(e) => {
              e.stopPropagation();
              setSelectedPublication(pub);
              setInspectedPubChanges(pub.changes);
              setInspectedPubLineage(pub.lineage);
             }}
             className="px-2 py-1 rounded bg-paper hover:bg-slate-100 text-ink text-[10px] transition"
            >
             View Details
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Selected Publication Detail & Inspectors */}
     {selectedPublication && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* "What Changed Since Publication?" Inspector */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <GitCompare className="w-4 h-4 text-conflict" />
           What Changed Since Publication? ({selectedPublication.platform})
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Discrepancies detected between certified release state and live observations.
          </p>
         </div>
        </div>

        {inspectedPubChanges.length === 0 ? (
         <div className="p-4 rounded-[10px] bg-paper border border-line-soft text-center text-xs font-mono text-verified">
          No discrepancies detected. Certified release matches observed platform state.
         </div>
        ) : (
         <div className="space-y-2 max-h-80 overflow-y-auto">
          {inspectedPubChanges.map((chg) => (
           <div key={chg.changeId} className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center">
             <span className="font-bold text-ink">{chg.fieldName}</span>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              chg.severity === "CRITICAL" ? "bg-conflict-bg text-conflict border-conflict-bg" :
              chg.severity === "WARNING" ? "bg-warning-bg text-warning border-warning-bg" :
              "bg-blue-950 text-citation border-blue-800"
             }`}>
              {chg.category}
             </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-card rounded-[24px]  p-2 rounded-[8px]">
             <div>
              <span className="text-muted-2 block text-[10px]">EXPECTED</span>
              <span className="text-ink truncate block">{String(chg.expectedValue)}</span>
             </div>
             <div>
              <span className="text-muted-2 block text-[10px]">OBSERVED</span>
              <span className="text-warning truncate block">{String(chg.observedValue)}</span>
             </div>
            </div>
            <div className="text-[11px] text-conflict">Action: {chg.recommendedAction}</div>
           </div>
          ))}
         </div>
        )}
       </div>

       {/* Publication Lineage Inspector */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <Network className="w-4 h-4 text-conflict" />
           Why Is This Publication In This State? (Lineage)
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Deterministic provenance from research run down to observed platform state.
          </p>
         </div>
        </div>

        {inspectedPubLineage?.links ? (
         <div className="space-y-1.5 max-h-80 overflow-y-auto font-mono text-xs">
          {inspectedPubLineage.links.map((lnk, idx) => (
           <div key={idx} className="p-2.5 rounded-[10px] bg-paper border border-line-soft flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
             <span className="text-muted-2 text-[10px] w-6 shrink-0">{idx + 1}.</span>
             <div>
              <span className="font-bold text-ink block text-[11px]">{lnk.stage}</span>
              <span className="text-muted-2 text-[10px] font-sans truncate block">{lnk.summary}</span>
             </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
             lnk.status === "VALID" ? "bg-verified-bg text-verified border-verified-bg" :
             lnk.status === "DRIFTED" ? "bg-warning-bg text-warning border-warning-bg" :
             "bg-card rounded-[24px]  text-muted-2 border-line-soft"
            }`}>
             {lnk.status}
            </span>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-xs font-mono text-muted-2 text-center py-4">No lineage trace available.</p>
        )}
       </div>
      </div>
     )}

     {/* "What Is Currently Unverifiable?" Transparency Panel */}
     {unverifiableStates.length > 0 && (
      <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
       <div className="flex items-center justify-between border-b border-line-soft pb-3">
        <h3 className="text-sm font-bold text-ink flex items-center gap-2">
         <Eye className="w-4 h-4 text-warning" />
         What Is Currently Unverifiable? (Transparency View)
        </h3>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {unverifiableStates.map((unv, idx) => (
         <div key={idx} className="p-3.5 rounded-[10px] bg-paper border border-line-soft space-y-1">
          <span className="font-bold text-ink block">{unv.platform}</span>
          <p className="text-muted-2 font-sans text-[11px]">{unv.reason}</p>
          <span className="text-[10px] text-warning block font-bold">UNVERIFIABLE (NO ASSUMED SUCCESS)</span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Publication Integrity Audit History */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <History className="w-4 h-4 text-conflict" />
        Immutable Publication Integrity Audit Ledger ({pubIntegrityHistory.length} Events)
       </h3>
      </div>

      {pubIntegrityHistory.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No publication integrity audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {pubIntegrityHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-conflict">{ev.eventType}</td>
            <td className="p-2.5 text-ink">{ev.publicationId}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              ev.afterState === "MATCHED" ? "bg-verified-bg text-verified border-verified-bg" :
              ev.afterState === "CHANGED" ? "bg-warning-bg text-warning border-warning-bg" :
              "bg-paper text-muted-2 border-line-soft"
             }`}>
              {ev.afterState}
             </span>
            </td>
            <td className="p-2.5 text-ink font-sans truncate max-w-xs">{ev.reason}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>
    </div>
   )}

   {/* TAB: CLOSED-LOOP RESEARCH CALIBRATION ENGINE (PHASE 86) */}
   {activeTab === "researchCalibration" && (
    <div className="space-y-[22px]">
     {/* Notifications */}
     {calibrationSuccessMsg && (
      <div className="p-4 rounded-[10px] bg-amber-50/60 border border-amber-600/80 text-warning text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-warning" />
       <span>{calibrationSuccessMsg}</span>
      </div>
     )}

     {calibrationErrorMsg && (
      <div className="p-4 rounded-[10px] bg-conflict-bg border border-conflict-bg text-conflict text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-conflict" />
       <span>{calibrationErrorMsg}</span>
      </div>
     )}

     {/* Evidence Boundary Principle Banner (Requirement 20) */}
     <div className="p-4 rounded-[14px] bg-paper border border-amber-200/60 text-warning text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 ">
      <div className="flex items-center gap-2">
       <Scale className="w-4 h-4 text-warning shrink-0" />
       <span className="font-bold">EVIDENCE BOUNDARY:</span>
       <span className="text-ink">Audience Signal â‰  Evidence &nbsp;|&nbsp; Performance â‰  Truth &nbsp;|&nbsp; Correlation â‰  Causation</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-amber-50/80 text-warning border border-amber-700/80 text-[10px] uppercase font-bold shrink-0">
       Formal Research Validation Required
      </span>
     </div>

     {/* Calibration Health Overview Header */}
     <div className="p-6 rounded-[14px] bg-card rounded-[24px]  border border-line-soft space-y-5 ">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line-soft pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-warning-bg text-warning border-warning-bg">
          CLOSED-LOOP CALIBRATION
         </span>
         <span className="text-xs font-mono text-muted-2">
          Snapshot: {calibrationSnapshot?.snapshotId || "rcs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-ink flex items-center gap-2">
         <Scale className="w-5 h-5 text-warning" />
         Continuous Audience Performance Ingestion & Research Calibration Engine
        </h2>
        <p className="text-xs text-muted-2 font-sans">
         Connects truthful audience questions, retention patterns, benchmark diffs, and publication discrepancies back to evidence re-evaluation without automatic claim mutations.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={loadCalibrationState}
         disabled={isCalibrating}
         className="flex items-center gap-1.5 bg-warning hover:bg-amber-500 disabled:opacity-50 text-ink px-4 py-2 rounded-[10px] text-xs font-bold font-mono  transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? "animate-spin" : ""}`} />
         {isCalibrating ? "Ingesting..." : "Ingest & Re-evaluate"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">CANDIDATES</span>
        <span className="text-ink font-bold block">{calibrationCandidates.length}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">QUEUED</span>
        <span className="text-warning font-bold block">{calibrationQueue.filter((q) => q.status === "QUEUED").length}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">VALIDATED</span>
        <span className="text-verified font-bold block">{calibrationQueue.filter((q) => q.status === "VALIDATED").length}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">BLOCKED</span>
        <span className="text-conflict font-bold block">{calibrationQueue.filter((q) => q.status === "BLOCKED").length}</span>
       </div>
       <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
        <span className="text-muted-2 block text-[10px]">STALE</span>
        <span className="text-muted-2 font-bold block">{calibrationQueue.filter((q) => q.status === "STALE").length}</span>
       </div>
      </div>
     </div>

     {/* Research Calibration Queue */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <Workflow className="w-4 h-4 text-warning" />
        Evidence-Bound Research Calibration Queue ({calibrationQueue.length} Items)
       </h3>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-line-soft text-muted-2 bg-paper">
          <th className="p-2.5">PRIORITY</th>
          <th className="p-2.5">CANDIDATE</th>
          <th className="p-2.5">SIGNAL SOURCE</th>
          <th className="p-2.5">ATTRIBUTION</th>
          <th className="p-2.5">EVIDENCE IMPACT</th>
          <th className="p-2.5">STATUS</th>
          <th className="p-2.5 text-right">ACTION</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {calibrationQueue.map((item) => (
          <tr
           key={item.queueItemId}
           onClick={() => setSelectedCalibrationItem(item)}
           className={`hover:bg-slate-100 cursor-pointer ${
            selectedCalibrationItem?.queueItemId === item.queueItemId ? "bg-slate-100/60" : ""
           }`}
          >
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             item.priority === "CRITICAL" ? "bg-conflict-bg text-conflict border-conflict-bg" :
             item.priority === "HIGH" ? "bg-warning-bg text-warning border-warning-bg" :
             item.priority === "MEDIUM" ? "bg-blue-950 text-citation border-blue-800" :
             "bg-paper text-muted-2 border-line-soft"
            }`}>
             {item.priority}
            </span>
           </td>
           <td className="p-2.5 font-bold text-ink truncate max-w-xs">{item.candidate.title}</td>
           <td className="p-2.5 text-muted-2">{item.candidate.source}</td>
           <td className="p-2.5 text-ink">{item.attribution.state}</td>
           <td className="p-2.5 text-warning font-bold">{item.evidenceImpact}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             item.status === "VALIDATED" ? "bg-verified-bg text-verified border-verified-bg" :
             item.status === "BLOCKED" ? "bg-conflict-bg text-conflict border-conflict-bg" :
             item.status === "STALE" ? "bg-paper text-muted-2 border-line-soft" :
             "bg-warning-bg text-warning border-warning-bg"
            }`}>
             {item.status}
            </span>
           </td>
           <td className="p-2.5 text-right">
            <button
             onClick={(e) => {
              e.stopPropagation();
              setSelectedCalibrationItem(item);
             }}
             className="px-2.5 py-1 rounded bg-paper hover:bg-slate-100 text-ink text-[10px] transition"
            >
             Inspect
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Selected Calibration Item Details & Inspectors */}
     {selectedCalibrationItem && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Attribution Inspector */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <Target className="w-4 h-4 text-warning" />
           Attribution Assessment & Sample Guard
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Conservative qualification separating direct observation from causal hypothesis.
          </p>
         </div>
         <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
          selectedCalibrationItem.attribution.state === "SUPPORTED_BY_MULTIPLE_SIGNALS" ? "bg-verified-bg text-verified border-verified-bg" :
          selectedCalibrationItem.attribution.state === "CORRELATED" || selectedCalibrationItem.attribution.state === "POSSIBLE_CONTRIBUTOR" ? "bg-blue-950 text-citation border-blue-800" :
          "bg-warning-bg text-warning border-warning-bg"
         }`}>
          {selectedCalibrationItem.attribution.state}
         </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
         <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1">
          <span className="text-muted-2 block text-[10px]">OBSERVED RELATIONSHIP</span>
          <p className="text-ink font-sans text-[11px]">{selectedCalibrationItem.attribution.observedRelationship}</p>
         </div>

         <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
           <span className="text-muted-2 block text-[10px]">SAMPLE SIZE</span>
           <span className="text-ink font-bold block">{selectedCalibrationItem.attribution.sampleSize} observations</span>
          </div>
          <div className="p-3 rounded-[10px] bg-paper border border-line-soft">
           <span className="text-muted-2 block text-[10px]">CONFOUNDERS</span>
           <span className="text-warning font-bold block">{selectedCalibrationItem.attribution.confounders.length} detected</span>
          </div>
         </div>

         {selectedCalibrationItem.attribution.confidenceLimitations.length > 0 && (
          <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1">
           <span className="text-muted-2 block text-[10px]">CONFIDENCE LIMITATIONS</span>
           <ul className="list-disc pl-4 text-muted-2 font-sans text-[11px] space-y-0.5">
            {selectedCalibrationItem.attribution.confidenceLimitations.map((lim, idx) => (
             <li key={idx}>{lim}</li>
            ))}
           </ul>
          </div>
         )}
        </div>
       </div>

       {/* Research Validation Action & Lineage Bridge */}
       <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
        <div className="flex items-center justify-between border-b border-line-soft pb-3">
         <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
           <FlaskConical className="w-4 h-4 text-warning" />
           Research Validation Bridge (No Automatic Claim Mutation)
          </h3>
          <p className="text-[11px] text-muted-2 font-sans">
           Explicit creator trigger to initiate independent lab/evidence validation.
          </p>
         </div>
        </div>

        <div className="space-y-3 text-xs font-mono">
         <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1">
          <span className="text-muted-2 block text-[10px]">RECOMMENDED EVIDENCE IMPACT</span>
          <span className="text-warning font-bold block">{selectedCalibrationItem.evidenceImpact}</span>
          <p className="text-muted-2 font-sans text-[11px]">
           {selectedCalibrationItem.candidate.priorityReason}
          </p>
         </div>

         <div className="flex items-center justify-between p-3 rounded-[10px] bg-paper border border-line-soft">
          <div>
           <span className="font-bold text-ink block">Formal Research Re-evaluation</span>
           <span className="text-muted-2 text-[10px]">Routes to authoritative research validation engine</span>
          </div>
          <button
           onClick={() => handleValidateQueueItem(selectedCalibrationItem.queueItemId)}
           disabled={isCalibrating || selectedCalibrationItem.status === "BLOCKED"}
           className="px-4 py-2 rounded-[10px] bg-warning hover:bg-amber-500 disabled:opacity-50 text-ink font-bold text-xs transition"
          >
           {isCalibrating ? "Validating..." : "Validate This"}
          </button>
         </div>

         {validationResult && (
          <div className="p-3 rounded-[10px] bg-emerald-50/40 border border-verified-bg space-y-1 text-verified">
           <span className="font-bold block">Validation Outcome: {validationResult.outcome}</span>
           <p className="text-ink font-sans text-[11px]">{validationResult.findings}</p>
           {validationResult.requiredSafeExecutionPlan && (
            <span className="text-[10px] text-warning font-bold block">
             Phase 78 Safe Execution Plan required to apply reconciled claims.
            </span>
           )}
          </div>
         )}

         {/* Lineage Trace */}
         <div className="p-3 rounded-[10px] bg-paper border border-line-soft space-y-1">
          <span className="text-muted-2 block text-[10px]">EXPLAINABILITY & PROVENANCE</span>
          <ul className="space-y-1 text-[11px] text-muted-2">
           {selectedCalibrationItem.candidate.upstreamLineage.map((lin, idx) => (
            <li key={idx} className="truncate">â€¢ {lin}</li>
           ))}
          </ul>
         </div>
        </div>
       </div>
      </div>
     )}

     {/* Immutable Research Calibration Audit History */}
     <div className="p-6 bg-card rounded-[24px]  border-line-soft space-y-4">
      <div className="flex items-center justify-between border-b border-line-soft pb-3">
       <h3 className="text-sm font-bold text-ink flex items-center gap-2">
        <History className="w-4 h-4 text-warning" />
        Immutable Research Calibration Audit Ledger ({calibrationHistory.length} Events)
       </h3>
      </div>

      {calibrationHistory.length === 0 ? (
       <p className="text-xs font-mono text-muted-2 text-center py-4">No calibration audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-line-soft text-muted-2 bg-paper">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">CALIBRATION ID</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {calibrationHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-muted-2">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-warning">{ev.eventType}</td>
            <td className="p-2.5 text-ink">{ev.calibrationId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-paper text-ink border-line-soft">
              {ev.afterState}
             </span>
            </td>
            <td className="p-2.5 text-ink font-sans truncate max-w-xs">{ev.reason}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>
    </div>
   )}

   {/* TAB: AUTOMATED COMPETING HYPOTHESIS, FALSIFICATION & EMPIRICAL CALIBRATION RECONCILIATION (PHASE 95) */}
   {activeTab === "hypotheses" && (
    <div className="space-y-6">
     {hypothesisSuccessMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-rose-600" />
       <span>{hypothesisSuccessMsg}</span>
      </div>
     )}

     {hypothesisErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{hypothesisErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-rose-200/60 text-rose-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-rose-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;â‰ &nbsp; PHYSICAL MEASUREMENT &nbsp;â‰ &nbsp; EXECUTION TRACE &nbsp;â‰ &nbsp; HARDWARE COUNTER &nbsp;â‰ &nbsp; SIMULATION &nbsp;â‰ &nbsp; FORECAST &nbsp;â‰ &nbsp; CORRELATION &nbsp;â‰ &nbsp; EMPIRICAL SYNTHESIS &nbsp;â‰ &nbsp; MICROARCHITECTURAL ATTRIBUTION &nbsp;â‰ &nbsp; CO-DESIGN SIMULATION &nbsp;â‰ &nbsp; HYPOTHESIS &nbsp;â‰ &nbsp; VALIDATION RESULT &nbsp;â‰ &nbsp; VERIFIED RESEARCH EVIDENCE</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-rose-50/80 text-rose-600 border border-rose-700/80 text-[10px] uppercase font-bold shrink-0">
       Hypothesis Layer
      </span>
     </div>

     {/* Hypothesis Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-rose-50 text-rose-600 border-rose-200">
          FORMAL SCIENTIFIC CONTROL LAYER
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {hypothesisSnapshot?.snapshotId || "hyss-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Compass className="w-5 h-5 text-rose-600" />
         Automated Competing Hypothesis, Falsification &amp; Empirical Calibration Reconciliation
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Evaluate competing explanations, quantify disconfirming evidence, isolate confounders, track empirical predictions, and bridge validated findings to the Phase 86 Calibration Queue without manufacturing scientific certainty.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => loadHypothesisState()}
         disabled={isReconcilingHypotheses}
         className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isReconcilingHypotheses ? "animate-spin" : ""}`} />
         {isReconcilingHypotheses ? "Reconciling..." : "Reconcile Hypotheses"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">HYPOTHESES</span>
        <span className="text-slate-700 font-bold block">{hypothesesList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">COMPETING SETS</span>
        <span className="text-rose-600 font-bold block">{competingGroups.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EVIDENCE ITEMS</span>
        <span className="text-cyan-600 font-bold block">{evidenceAttachments.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">PREDICTIONS</span>
        <span className="text-emerald-600 font-bold block">{hypothesisPredictions.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">VALIDATION TASKS</span>
        <span className="text-amber-600 font-bold block">{hypothesisValidationTasks.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">RECONCILIATIONS</span>
        <span className="text-indigo-600 font-bold block">{hypothesisReconciliations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OPPORTUNITIES</span>
        <span className="text-fuchsia-600 font-bold block">{hypothesisOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Hypothesis Registry Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <FileText className="w-4 h-4 text-rose-600" />
        Formal Hypothesis Registry ({hypothesesList.length} Active Formulations)
       </h3>
      </div>

      <div className="space-y-3">
       {hypothesesList.map((hyp) => (
        <div key={hyp.hypothesisId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 font-mono text-xs">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
           <span className="font-bold text-slate-700 text-sm font-sans">{hyp.title}</span>
           <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200">
            {hyp.domain}
           </span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            hyp.status === "SUPPORTED"
             ? "bg-emerald-50 text-emerald-600 border-emerald-200"
             : hyp.status === "FALSIFIED"
             ? "bg-rose-50 text-rose-600 border-rose-200"
             : hyp.status === "WEAKENED"
             ? "bg-amber-50 text-amber-600 border-amber-200"
             : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {hyp.status}
           </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[10px]">
           <span className="px-2 py-0.5 rounded border bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200">
            isCausallyEstablished: {hyp.causalStatus ? "true" : "false"}
           </span>
           <button
            onClick={() => loadHypothesisLineage(hyp.hypothesisId)}
            className="px-2.5 py-1 rounded bg-rose-50/60 hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold transition"
           >
            Inspect Lineage
           </button>
          </div>
         </div>

         <p className="text-slate-700 font-sans text-xs">{hyp.statement}</p>

         <div className="grid sm:grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm/70 border border-slate-200 space-y-1">
           <span className="text-slate-500 block text-[10px]">CONFIDENCE SCORE</span>
           <span className="text-rose-600 font-bold">{hyp.currentConfidence}% ({hyp.confidenceBand})</span>
           <span className="text-slate-500 block text-[10px]">Prior: {hyp.priorConfidence}%</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm/70 border border-slate-200 space-y-1">
           <span className="text-slate-500 block text-[10px]">FALSIFICATION STRENGTH</span>
           <span className="text-amber-600 font-bold">{hyp.falsificationStrength}</span>
           <span className="text-slate-500 block text-[10px]">Contradictions: {hyp.contradictoryEvidenceIds.length}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm/70 border border-slate-200 space-y-1">
           <span className="text-slate-500 block text-[10px]">ACTIVE CONFOUNDERS</span>
           <span className="text-slate-700 font-bold">{hyp.activeConfounders.length > 0 ? hyp.activeConfounders.join(", ") : "None Identified"}</span>
           <span className="text-slate-500 block text-[10px]">Validation Tasks: {hyp.requiredValidationTasks.length}</span>
          </div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Competing Hypothesis Matrix & Empirical Predictions Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Competing Hypotheses Matrix */}
      {competingGroups[0] && (
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-rose-600" />
          Competing Hypothesis Matrix
         </h3>
         <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-rose-50 text-rose-600 border-rose-200">
          {competingGroups[0].unresolvedAlternativesCount} Unresolved
         </span>
        </div>

        <div className="space-y-1 font-mono text-xs">
         <span className="text-[10px] text-slate-500 uppercase">Target Observation:</span>
         <p className="text-slate-700 font-bold font-sans text-xs">{competingGroups[0].targetObservation}</p>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
         {competingGroups[0].hypotheses.map((hItem) => (
          <div key={hItem.hypothesisId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
           <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 truncate pr-2 font-sans">{hItem.title}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             hItem.status === "SUPPORTED"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : hItem.status === "FALSIFIED"
              ? "bg-rose-50 text-rose-600 border-rose-200"
              : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
            }`}>
             {hItem.status}
            </span>
           </div>
           <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
            <span>Supporting: {hItem.supportingCount}</span>
            <span>Contradicting: {hItem.contradictingCount}</span>
            <span>Confidence: {hItem.confidenceBand}</span>
           </div>
          </div>
         ))}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono space-y-1">
         <span className="text-[10px] text-slate-500 uppercase font-bold">Diagnostic Differentiator:</span>
         <p className="text-rose-600 font-sans text-xs">{competingGroups[0].primaryDiagnosticDifferentiator}</p>
        </div>
       </div>
      )}

      {/* Empirical Predictions Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Crosshair className="w-4 h-4 text-emerald-600" />
         Deterministic Empirical Predictions ({hypothesisPredictions.length})
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {hypothesisPredictions.map((pred) => (
         <div key={pred.predictionId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">{pred.expectedMetric}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            pred.result === "MATCHED"
             ? "bg-emerald-50 text-emerald-600 border-emerald-200"
             : pred.result === "PARTIALLY_MATCHED"
             ? "bg-amber-50 text-amber-600 border-amber-200"
             : pred.result === "MISSED"
             ? "bg-rose-50 text-rose-600 border-rose-200"
             : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {pred.result}
           </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
           <div>Expected: <strong className="text-emerald-600">{pred.expectedRange ? `${pred.expectedRange[0]} - ${pred.expectedRange[1]}` : "N/A"}</strong></div>
           <div>Tolerance: <strong className="text-slate-700">Â±{pred.tolerancePercentage}%</strong></div>
          </div>

          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           Method: {pred.validationMethod}
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* Validation Queue & Research Health Reconciliation Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Validation Queue */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <FlaskConical className="w-4 h-4 text-amber-600" />
         Hypothesis Validation Queue ({hypothesisValidationTasks.length} Tasks)
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {hypothesisValidationTasks.map((task) => (
         <div key={task.taskId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             task.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-600 border-amber-200"
            }`}>
             {task.priority}
            </span>
            <span className="font-bold text-slate-700 font-sans text-xs">{task.objective}</span>
           </div>
           <button
            onClick={() => handleBridgeHypothesisValidationTask(task.taskId)}
            disabled={task.validationStatus === "VALIDATION_PENDING" || task.validationStatus === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {task.validationStatus === "VALIDATION_PENDING" ? "Bridged to Phase 86" : "Bridge to Phase 86 Queue"}
           </button>
          </div>

          <p className="text-slate-500 font-sans text-xs">{task.validationQuestion}</p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           <span>Hardware: {task.requiredHardware}</span>
           <span>Replications: {task.requiredReplications}</span>
          </div>
         </div>
        ))}
       </div>
      </div>

      {/* Research Health Reconciliation Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-emerald-600" />
         Research Health Reconciliation
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {hypothesisReconciliations.map((rec) => (
         <div key={rec.reconciliationId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">Health Impact:</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            rec.newHealthImpact === "INCREASE_CONFIDENCE"
             ? "bg-emerald-50 text-emerald-600 border-emerald-200"
             : rec.newHealthImpact === "FALSIFICATION_DETECTED"
             ? "bg-rose-50 text-rose-600 border-rose-200"
             : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {rec.newHealthImpact}
           </span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans">{rec.reasoning}</p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 font-sans">
           <strong className="text-slate-500">Action:</strong> {rec.recommendedAction}
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* 6-Stage Deterministic Lineage Inspector */}
     {selectedHypothesisLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-rose-600" />
         "Why Did Nichorr Support, Weaken, or Falsify This Hypothesis?" 6-Stage Deterministic Lineage
        </h3>
       </div>

       <div className="space-y-3">
        {selectedHypothesisLineage.stages.map((stage) => (
         <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-rose-600">{stage.title}</span>
            <span className="text-slate-500 text-[10px]">[{stage.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{stage.output}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {stage.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Hypothesis Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-rose-600" />
        Immutable Hypothesis Audit Ledger ({hypothesisHistory.length} Events)
       </h3>
      </div>

      {hypothesisHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No hypothesis audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">ACTOR</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {hypothesisHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-rose-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.targetId}</td>
            <td className="p-2.5 text-slate-500">{ev.actor}</td>
            <td className="p-2.5 text-slate-700 font-sans truncate max-w-xs">{ev.reason}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>
    </div>
   )}

   {/* Other tabs remain unchanged and functional */}
   {activeTab === "distribution" && distPackage && (
    <div className="space-y-6">
     {distActionSuccessMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-rose-600" />
       <span>{distActionSuccessMsg}</span>
      </div>
     )}

     <div className={`p-6 rounded-2xl border transition shadow-sm ${
      distPackage.readinessReport.overallStatus === 'BLOCKED'
       ? "bg-rose-50/40 border-rose-700/70"
       : distPackage.readinessReport.readyForRelease
       ? "bg-emerald-50/40 border-emerald-600/70"
       : "bg-white rounded-[24px] shadow-sm border-slate-200"
     }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
       <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          distPackage.readinessReport.overallStatus === 'BLOCKED'
           ? "bg-rose-50 text-rose-600 border-rose-200"
           : distPackage.readinessReport.readyForRelease
           ? "bg-emerald-50 text-emerald-600 border-emerald-200"
           : "bg-cyan-50 text-cyan-600 border-cyan-200"
         }`}>
          {distPackage.readinessReport.overallStatus}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Package v{distPackage.distributionPackageVersion} | Script v{distPackage.scriptVersion}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Globe className="w-5 h-5 text-rose-600" />
         Multi-Platform Distribution Readiness: {distPackage.distributionReadinessScore}%
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
         {distPackage.readinessReport.summaryMessage}
        </p>
       </div>

       <div className="flex items-center gap-2 shrink-0">
        <button
         onClick={loadDistribution}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition font-mono"
        >
         <RefreshCw className="w-3.5 h-3.5" /> Recheck Staging
        </button>
       </div>
      </div>
     </div>

     {/* Platform Staging Cards */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
       {distPackage.targets.map((tgt) => (
        <div
         key={tgt.platform}
         className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between"
        >
         <div className="space-y-2">
          <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            {tgt.platform === 'YOUTUBE_LONG_FORM' ? <Tv className="w-4 h-4 text-rose-600" /> :
             tgt.platform === 'YOUTUBE_SHORTS' ? <Smartphone className="w-4 h-4 text-rose-600" /> :
             <Radio className="w-4 h-4 text-purple-600" />}
            <span className="text-xs font-bold text-slate-700">{tgt.platform}</span>
           </div>
           <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            tgt.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            tgt.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
            tgt.status === 'BLOCKED' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
            'bg-slate-100 text-slate-700'
           }`}>
            {tgt.status}
           </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1 font-mono text-[11px]">
           <div className="flex justify-between text-slate-500">
            <span>Connection:</span>
            <span className="text-cyan-600 font-bold">{tgt.connectionState}</span>
           </div>
           <div className="flex justify-between text-slate-500">
            <span>Readiness:</span>
            <span className="text-slate-700 font-bold">{tgt.readinessScore}%</span>
           </div>
          </div>

          <p className="text-xs text-slate-700 font-sans line-clamp-2">
           Title: "{(tgt.stagingData as any).approvedTitle || (tgt.stagingData as any).episodeTitle}"
          </p>
         </div>

         <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
           {tgt.status !== 'APPROVED' && tgt.status !== 'SCHEDULED' && !tgt.isBlocked && (
            <button
             onClick={() => setTargetForApproval(tgt)}
             className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-900 text-xs font-bold shadow-sm transition"
            >
             Approve Target
            </button>
           )}

           {tgt.status === 'APPROVED' && (
            <button
             onClick={() => setTargetForSchedule(tgt)}
             className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-slate-900 text-xs font-bold shadow-sm transition"
            >
             Schedule Release
            </button>
           )}

           {tgt.status === 'SCHEDULED' && (
            <button
             onClick={() => handleCancelDistributionSchedule(tgt.platform)}
             className="flex-1 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-900 text-amber-600 text-xs font-mono font-bold border border-amber-200 transition"
            >
             Cancel Schedule
            </button>
           )}
          </div>
         </div>
        </div>
       ))}
      </div>
     </div>
    </div>
   )}

   {/* Teleprompter Modal */}
   {isTeleprompterOpen && report && (
    <CreatorTeleprompter
     topic={report.topic}
     targetDurationMinutes={duration}
     sections={report.scriptSections || []}
     onClose={() => setIsTeleprompterOpen(false)}
    />
   )}
  </div>
 );
}
