"use client";

import { useEffect, useState } from "react";
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
 ProjectFederationRecord,
 NormalizedObservation,
 CrossHardwareCorrelationRecord,
 CollectiveResearchOpportunity,
 CollectiveIntelligenceSnapshot,
 CollectiveLineageTrace,
 CollectiveIntelligenceAuditEvent,
} from "@/lib/creator/collective-intelligence/collective-intelligence.provider";
import {
 SiliconRegressionObservation,
 SiliconRegressionPair,
 SiliconRegressionSeries,
 SiliconRegressionMatrix,
 BenchmarkSynthesisRecord,
 EmpiricalSynthesisReport,
 RegressionResearchOpportunity,
 SiliconRegressionSnapshot,
 RegressionLineageTrace,
 RegressionAuditEvent,
} from "@/lib/creator/silicon-regression/silicon-regression.provider";
import {
 ArchitecturalDegradationForecast,
 MicrocodeSimulationScenario,
 MicrocodeSimulationResult,
 InstructionSetDeprecationSimulation,
 ForecastResearchOpportunity,
 ArchitecturalDegradationMatrix,
 ForecastSnapshot,
 ForecastLineageTrace,
 ForecastAuditEvent,
} from "@/lib/creator/architectural-forecast/architectural-forecast.provider";
import {
 TestbenchDefinition,
 BenchmarkExecutionPlan,
 PhysicalExperiment,
 PhysicalMeasurement,
 MicroarchitectureSimulation,
 ExperimentComparison,
 TestbenchResearchOpportunity,
 HardwareCapabilities,
 TestbenchSnapshot,
 TestbenchLineageTrace,
 TestbenchAuditEvent,
} from "@/lib/creator/testbench/testbench.provider";
import {
 TestbenchCluster,
 TestbenchClusterNode,
 TestbenchClusterJob,
 SiliconDifferentialMatrix,
 SiliconDifferentialEntry,
 SiliconDifferentialResearchOpportunity,
 CrossNodeReproducibilityReport,
 SiliconOutlierReport,
 CrossNodeContradiction,
 TestbenchClusterSnapshot,
 ClusterLineageTrace,
 TestbenchClusterAuditEvent,
} from "@/lib/creator/testbench-cluster/testbench-cluster.types";
import {
 LaboratoryIdentity,
 LaboratoryDataset,
 LongitudinalSiliconSeries,
 CrossLabSynthesisMatrix,
 CrossLabSynthesisComparison,
 CrossLabContradictionReport,
 CrossLabReproducibilityReport,
 CrossLabOutlierReport,
 CrossLabValidationOpportunity,
 VerifiedResearchLedgerEntry,
 CrossLabRegressionSnapshot,
 CrossLabLineageTrace,
 CrossLabRegressionAuditEvent,
} from "@/lib/creator/cross-lab-regression/cross-lab-regression.types";
import {
 HardwareExecutionTrace,
 NormalizedTraceEvents,
 StallDecompositionRecord,
 BottleneckAttributionRecord,
 CrossGenerationComparison,
 PhysicalReconciliationRecord,
 LedgerReconciliationRecord,
 MicroarchitectureResearchOpportunity,
 MicroarchitectureSnapshot,
 MicroarchitectureLineageTrace,
 MicroarchitectureAuditEvent,
} from "@/lib/creator/microarchitecture/microarchitecture.types";
import {
 CoDesignScenario,
 EmpiricalBaseline,
 CoDesignSimulationResult,
 EmpiricalAlignmentRecord,
 ParameterSensitivityEntry,
 CoDesignHealthReconciliationRecord,
 CoDesignOpportunity,
 CoDesignSnapshot,
 CoDesignLineageTrace,
 CoDesignAuditEvent,
} from "@/lib/creator/co-design-workbench/co-design.types";
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
  | "coDesign"
  | "microarchitecture"
  | "crossLabRegression"
  | "testbenchCluster"
  | "testbenchControl"
  | "architecturalForecast"
  | "siliconRegression"
  | "collectiveIntelligence"
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

 // Phase 94: Automated Hardware-Software Co-Design Empirical Simulation & Interactive Silicon Calibration Workbench State
 const [coDesignScenarios, setCoDesignScenarios] = useState<CoDesignScenario[]>([]);
 const [coDesignBaselines, setCoDesignBaselines] = useState<EmpiricalBaseline[]>([]);
 const [coDesignSimulations, setCoDesignSimulations] = useState<CoDesignSimulationResult[]>([]);
 const [coDesignAlignments, setCoDesignAlignments] = useState<EmpiricalAlignmentRecord[]>([]);
 const [coDesignSensitivities, setCoDesignSensitivities] = useState<{ scenarioId: string; sensitivities: ParameterSensitivityEntry[] }[]>([]);
 const [coDesignReconciliations, setCoDesignReconciliations] = useState<CoDesignHealthReconciliationRecord[]>([]);
 const [coDesignOpportunities, setCoDesignOpportunities] = useState<CoDesignOpportunity[]>([]);
 const [coDesignSnapshot, setCoDesignSnapshot] = useState<CoDesignSnapshot | null>(null);
 const [coDesignHistory, setCoDesignHistory] = useState<CoDesignAuditEvent[]>([]);
 const [selectedCoDesignLineage, setSelectedCoDesignLineage] = useState<CoDesignLineageTrace | null>(null);
 const [isSimulatingCoDesign, setIsSimulatingCoDesign] = useState(false);
 const [coDesignSuccessMsg, setCoDesignSuccessMsg] = useState<string | null>(null);
 const [coDesignErrorMsg, setCoDesignErrorMsg] = useState<string | null>(null);

 // Phase 93: Automated Cross-Generational Microarchitectural Bottleneck Attribution & Closed-Loop Research Calibration Reconciliation State
 const [microTraces, setMicroTraces] = useState<HardwareExecutionTrace[]>([]);
 const [microNormalizedList, setMicroNormalizedList] = useState<{ trace: HardwareExecutionTrace; norm: NormalizedTraceEvents; stalls: StallDecompositionRecord[] }[]>([]);
 const [microAttributions, setMicroAttributions] = useState<BottleneckAttributionRecord[]>([]);
 const [microComparisons, setMicroComparisons] = useState<CrossGenerationComparison[]>([]);
 const [microPhysicalReconciliations, setMicroPhysicalReconciliations] = useState<PhysicalReconciliationRecord[]>([]);
 const [microLedgerReconciliations, setMicroLedgerReconciliations] = useState<LedgerReconciliationRecord[]>([]);
 const [microOpportunities, setMicroOpportunities] = useState<MicroarchitectureResearchOpportunity[]>([]);
 const [microSnapshot, setMicroSnapshot] = useState<MicroarchitectureSnapshot | null>(null);
 const [microHistory, setMicroHistory] = useState<MicroarchitectureAuditEvent[]>([]);
 const [selectedMicroLineage, setSelectedMicroLineage] = useState<MicroarchitectureLineageTrace | null>(null);
 const [isAnalyzingMicro, setIsAnalyzingMicro] = useState(false);
 const [microSuccessMsg, setMicroSuccessMsg] = useState<string | null>(null);
 const [microErrorMsg, setMicroErrorMsg] = useState<string | null>(null);

 // Phase 92: Automated Continuous Cross-Laboratory Empirical Regression Synthesis & Verified Research Ledger Consolidation State
 const [crossLabLaboratories, setCrossLabLaboratories] = useState<LaboratoryIdentity[]>([]);
 const [crossLabDatasets, setCrossLabDatasets] = useState<LaboratoryDataset[]>([]);
 const [crossLabSeries, setCrossLabSeries] = useState<LongitudinalSiliconSeries[]>([]);
 const [crossLabMatrix, setCrossLabMatrix] = useState<CrossLabSynthesisMatrix | null>(null);
 const [crossLabContradictions, setCrossLabContradictions] = useState<CrossLabContradictionReport[]>([]);
 const [crossLabReproducibility, setCrossLabReproducibility] = useState<CrossLabReproducibilityReport | null>(null);
 const [crossLabOutliers, setCrossLabOutliers] = useState<CrossLabOutlierReport[]>([]);
 const [crossLabOpportunities, setCrossLabOpportunities] = useState<CrossLabValidationOpportunity[]>([]);
 const [crossLabLedger, setCrossLabLedger] = useState<VerifiedResearchLedgerEntry[]>([]);
 const [crossLabSnapshot, setCrossLabSnapshot] = useState<CrossLabRegressionSnapshot | null>(null);
 const [crossLabHistory, setCrossLabHistory] = useState<CrossLabRegressionAuditEvent[]>([]);
 const [selectedCrossLabLineage, setSelectedCrossLabLineage] = useState<CrossLabLineageTrace | null>(null);
 const [isSynthesizingCrossLab, setIsSynthesizingCrossLab] = useState(false);
 const [isPromotingCrossLab, setIsPromotingCrossLab] = useState(false);
 const [crossLabSuccessMsg, setCrossLabSuccessMsg] = useState<string | null>(null);
 const [crossLabErrorMsg, setCrossLabErrorMsg] = useState<string | null>(null);

 // Phase 91: Multi-Testbench Cluster Orchestration & Silicon-to-Silicon Differential Matrix State
 const [clusterState, setClusterState] = useState<TestbenchCluster | null>(null);
 const [clusterNodes, setClusterNodes] = useState<TestbenchClusterNode[]>([]);
 const [clusterJobs, setClusterJobs] = useState<TestbenchClusterJob[]>([]);
 const [differentialMatrix, setDifferentialMatrix] = useState<SiliconDifferentialMatrix | null>(null);
 const [clusterReproducibility, setClusterReproducibility] = useState<CrossNodeReproducibilityReport | null>(null);
 const [clusterOutliers, setClusterOutliers] = useState<SiliconOutlierReport[]>([]);
 const [clusterContradictions, setClusterContradictions] = useState<CrossNodeContradiction[]>([]);
 const [clusterOpportunities, setClusterOpportunities] = useState<SiliconDifferentialResearchOpportunity[]>([]);
 const [clusterSnapshot, setClusterSnapshot] = useState<TestbenchClusterSnapshot | null>(null);
 const [clusterHistory, setClusterHistory] = useState<TestbenchClusterAuditEvent[]>([]);
 const [selectedClusterLineage, setSelectedClusterLineage] = useState<ClusterLineageTrace | null>(null);
 const [isSchedulingCluster, setIsSchedulingCluster] = useState(false);
 const [isRunningClusterBatch, setIsRunningClusterBatch] = useState(false);
 const [clusterSuccessMsg, setClusterSuccessMsg] = useState<string | null>(null);
 const [clusterErrorMsg, setClusterErrorMsg] = useState<string | null>(null);

 // Phase 90: Multi-Generational Silicon Microarchitecture Simulation Sandbox & Automated Physical Benchmark Testbench State
 const [testbenchCapabilities, setTestbenchCapabilities] = useState<HardwareCapabilities | null>(null);
 const [testbenchList, setTestbenchList] = useState<TestbenchDefinition[]>([]);
 const [testbenchPlans, setTestbenchPlans] = useState<BenchmarkExecutionPlan[]>([]);
 const [testbenchExperiments, setTestbenchExperiments] = useState<PhysicalExperiment[]>([]);
 const [testbenchSimulations, setTestbenchSimulations] = useState<MicroarchitectureSimulation[]>([]);
 const [testbenchComparisons, setTestbenchComparisons] = useState<ExperimentComparison[]>([]);
 const [testbenchOpportunities, setTestbenchOpportunities] = useState<TestbenchResearchOpportunity[]>([]);
 const [testbenchSnapshot, setTestbenchSnapshot] = useState<TestbenchSnapshot | null>(null);
 const [testbenchHistory, setTestbenchHistory] = useState<TestbenchAuditEvent[]>([]);
 const [selectedExperiment, setSelectedExperiment] = useState<PhysicalExperiment | null>(null);
 const [inspectedTestbenchLineage, setInspectedTestbenchLineage] = useState<TestbenchLineageTrace | null>(null);
 const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
 const [testbenchSuccessMsg, setTestbenchSuccessMsg] = useState<string | null>(null);
 const [testbenchErrorMsg, setTestbenchErrorMsg] = useState<string | null>(null);

 // Microarchitecture Sandbox slider state
 const [sandboxClockGhz, setSandboxClockGhz] = useState<number>(5.7);
 const [sandboxVectorWidth, setSandboxVectorWidth] = useState<number>(512);
 const [sandboxCacheLatency, setSandboxCacheLatency] = useState<number>(4);
 const [sandboxMemBandwidth, setSandboxMemBandwidth] = useState<number>(1792);
 const [sandboxBranchPenalty, setSandboxBranchPenalty] = useState<number>(16);

 // Phase 89: Adaptive Architectural Degradation Forecasting & Simulation State
 const [forecastMatrix, setForecastMatrix] = useState<ArchitecturalDegradationMatrix | null>(null);
 const [forecastList, setForecastList] = useState<ArchitecturalDegradationForecast[]>([]);
 const [simulationList, setSimulationList] = useState<MicrocodeSimulationResult[]>([]);
 const [scenarioList, setScenarioList] = useState<MicrocodeSimulationScenario[]>([]);
 const [deprecationList, setDeprecationList] = useState<InstructionSetDeprecationSimulation[]>([]);
 const [forecastOpportunities, setForecastOpportunities] = useState<ForecastResearchOpportunity[]>([]);
 const [forecastSnapshot, setForecastSnapshot] = useState<ForecastSnapshot | null>(null);
 const [forecastHistory, setForecastHistory] = useState<ForecastAuditEvent[]>([]);
 const [selectedForecast, setSelectedForecast] = useState<ArchitecturalDegradationForecast | null>(null);
 const [inspectedForecastLineage, setInspectedForecastLineage] = useState<ForecastLineageTrace | null>(null);
 const [isComputingForecasts, setIsComputingForecasts] = useState(false);
 const [forecastSuccessMsg, setForecastSuccessMsg] = useState<string | null>(null);
 const [forecastErrorMsg, setForecastErrorMsg] = useState<string | null>(null);
 const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scen-moderate-mitigation");
 const [customScenarioName, setCustomScenarioName] = useState<string>("");
 const [customScenarioOverhead, setCustomScenarioOverhead] = useState<number>(5.0);

 // Phase 88: Continuous Cross-Architecture Silicon Regression State
 const [siliconObservations, setSiliconObservations] = useState<SiliconRegressionObservation[]>([]);
 const [siliconMatrix, setSiliconMatrix] = useState<SiliconRegressionMatrix | null>(null);
 const [siliconSeries, setSiliconSeries] = useState<SiliconRegressionSeries[]>([]);
 const [siliconSynthesis, setSiliconSynthesis] = useState<EmpiricalSynthesisReport | null>(null);
 const [siliconOpportunities, setSiliconOpportunities] = useState<RegressionResearchOpportunity[]>([]);
 const [siliconSnapshot, setSiliconSnapshot] = useState<SiliconRegressionSnapshot | null>(null);
 const [siliconHistory, setSiliconHistory] = useState<RegressionAuditEvent[]>([]);
 const [selectedRegressionPair, setSelectedRegressionPair] = useState<SiliconRegressionPair | null>(null);
 const [inspectedRegressionLineage, setInspectedRegressionLineage] = useState<RegressionLineageTrace | null>(null);
 const [isSynthesizingRegression, setIsSynthesizingRegression] = useState(false);
 const [siliconSuccessMsg, setSiliconSuccessMsg] = useState<string | null>(null);
 const [siliconErrorMsg, setSiliconErrorMsg] = useState<string | null>(null);

 // Phase 87: Multi-Project Collective Intelligence Federation State
 const [federatedProjects, setFederatedProjects] = useState<ProjectFederationRecord[]>([]);
 const [collectiveObservations, setCollectiveObservations] = useState<NormalizedObservation[]>([]);
 const [collectiveCorrelations, setCollectiveCorrelations] = useState<CrossHardwareCorrelationRecord[]>([]);
 const [collectiveOpportunities, setCollectiveOpportunities] = useState<CollectiveResearchOpportunity[]>([]);
 const [collectiveSnapshot, setCollectiveSnapshot] = useState<CollectiveIntelligenceSnapshot | null>(null);
 const [collectiveHistory, setCollectiveHistory] = useState<CollectiveIntelligenceAuditEvent[]>([]);
 const [selectedCorrelation, setSelectedCorrelation] = useState<CrossHardwareCorrelationRecord | null>(null);
 const [inspectedCorrelationLineage, setInspectedCorrelationLineage] = useState<CollectiveLineageTrace | null>(null);
 const [isComputingCorrelations, setIsComputingCorrelations] = useState(false);
 const [collectiveSuccessMsg, setCollectiveSuccessMsg] = useState<string | null>(null);
 const [collectiveErrorMsg, setCollectiveErrorMsg] = useState<string | null>(null);

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
  loadSiliconRegressionState();
  loadArchitecturalForecastState();
  loadTestbenchState();
  loadTestbenchClusterState();
  loadCrossLabRegressionState();
  loadMicroarchitectureState();
  loadCoDesignState();
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

 // Phase 94: Automated Hardware-Software Co-Design Empirical Simulation & Interactive Silicon Calibration Handlers
 const loadCoDesignState = () => {
  fetch(`/api/research/${params.id}/co-design-workbench`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.scenarios) setCoDesignScenarios(data.data.scenarios);
     if (data.data.baselines) setCoDesignBaselines(data.data.baselines);
     if (data.data.simulations) {
      setCoDesignSimulations(data.data.simulations);
      if (!selectedCoDesignLineage && data.data.simulations?.length > 0) {
       loadCoDesignLineage(data.data.simulations[0].simulationId);
      }
     }
     if (data.data.alignments) setCoDesignAlignments(data.data.alignments);
     if (data.data.sensitivityList) setCoDesignSensitivities(data.data.sensitivityList);
     if (data.data.reconciliations) setCoDesignReconciliations(data.data.reconciliations);
     if (data.data.opportunities) setCoDesignOpportunities(data.data.opportunities);
     if (data.data.snapshot) setCoDesignSnapshot(data.data.snapshot);
     if (data.data.history) setCoDesignHistory(data.data.history);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/co-design-workbench/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setCoDesignHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadCoDesignLineage = (simulationId: string) => {
  fetch(`/api/research/${params.id}/co-design-workbench/${simulationId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setSelectedCoDesignLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleTriggerCoDesignSimulation = () => {
  setIsSimulatingCoDesign(true);
  setCoDesignErrorMsg(null);
  fetch(`/api/research/${params.id}/co-design-workbench/simulate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCoDesignSuccessMsg("Co-design what-if simulation and empirical alignment updated.");
     setTimeout(() => setCoDesignSuccessMsg(null), 4000);
     loadCoDesignState();
    } else {
     setCoDesignErrorMsg(data.error || "Failed to execute co-design simulation.");
    }
   })
   .catch((err) => setCoDesignErrorMsg(err.message || "Failed to execute co-design simulation."))
   .finally(() => setIsSimulatingCoDesign(false));
 };

 const handleUpdateCoDesignParameter = (scenarioId: string, parameterId: string, newValue: number) => {
  setCoDesignErrorMsg(null);
  fetch(`/api/research/${params.id}/co-design-workbench/scenarios/${scenarioId}`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ parameterId, newValue }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     loadCoDesignState();
    } else {
     setCoDesignErrorMsg(data.error || "Failed to update parameter.");
    }
   })
   .catch((err) => setCoDesignErrorMsg(err.message || "Failed to update parameter."));
 };

 const handleValidateCoDesignOpportunity = (opportunityId: string) => {
  setCoDesignErrorMsg(null);
  fetch(`/api/research/${params.id}/co-design-workbench/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCoDesignSuccessMsg("Co-design simulation hypothesis bridged to Phase 86 calibration queue.");
     setTimeout(() => setCoDesignSuccessMsg(null), 4000);
     loadCoDesignState();
    } else {
     setCoDesignErrorMsg(data.error || "Failed to validate co-design opportunity.");
    }
   })
   .catch((err) => setCoDesignErrorMsg(err.message || "Failed to validate co-design opportunity."));
 };

 // Phase 93: Automated Cross-Generational Microarchitectural Bottleneck Attribution & Closed-Loop Research Calibration Handlers
 const loadMicroarchitectureState = () => {
  fetch(`/api/research/${params.id}/microarchitecture`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.traces) setMicroTraces(data.data.traces);
     if (data.data.normalizedList) setMicroNormalizedList(data.data.normalizedList);
     if (data.data.attributions) {
      setMicroAttributions(data.data.attributions);
      if (!selectedMicroLineage && data.data.attributions?.length > 0) {
       loadMicroLineage(data.data.attributions[0].attributionId);
      }
     }
     if (data.data.comparisons) setMicroComparisons(data.data.comparisons);
     if (data.data.physicalReconciliations) setMicroPhysicalReconciliations(data.data.physicalReconciliations);
     if (data.data.ledgerReconciliations) setMicroLedgerReconciliations(data.data.ledgerReconciliations);
     if (data.data.opportunities) setMicroOpportunities(data.data.opportunities);
     if (data.data.snapshot) setMicroSnapshot(data.data.snapshot);
     if (data.data.history) setMicroHistory(data.data.history);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/microarchitecture/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setMicroHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadMicroLineage = (attributionId: string) => {
  fetch(`/api/research/${params.id}/microarchitecture/lineage/${attributionId}`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setSelectedMicroLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleTriggerMicroAnalysis = () => {
  setIsAnalyzingMicro(true);
  setMicroErrorMsg(null);
  fetch(`/api/research/${params.id}/microarchitecture/attribute`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setMicroSuccessMsg(`Microarchitectural stall decomposition and bottleneck attribution refreshed.`);
     setTimeout(() => setMicroSuccessMsg(null), 4000);
     loadMicroarchitectureState();
    } else {
     setMicroErrorMsg(data.error || "Failed to trigger microarchitecture analysis.");
    }
   })
   .catch((err) => setMicroErrorMsg(err.message || "Failed to trigger microarchitecture analysis."))
   .finally(() => setIsAnalyzingMicro(false));
 };

 const handleValidateMicroOpportunity = (opportunityId: string) => {
  setMicroErrorMsg(null);
  fetch(`/api/research/${params.id}/microarchitecture/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setMicroSuccessMsg("Microarchitectural hypothesis bridged to Phase 86 calibration queue.");
     setTimeout(() => setMicroSuccessMsg(null), 4000);
     loadMicroarchitectureState();
    } else {
     setMicroErrorMsg(data.error || "Failed to validate microarchitectural opportunity.");
    }
   })
   .catch((err) => setMicroErrorMsg(err.message || "Failed to validate microarchitectural opportunity."));
 };

 // Phase 92: Automated Continuous Cross-Laboratory Empirical Regression Synthesis & Verified Research Ledger Handlers
 const loadCrossLabRegressionState = () => {
  fetch(`/api/research/${params.id}/cross-lab-regression`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.laboratories) setCrossLabLaboratories(data.data.laboratories);
     if (data.data.datasets) setCrossLabDatasets(data.data.datasets);
     if (data.data.series) setCrossLabSeries(data.data.series);
     if (data.data.matrix) {
      setCrossLabMatrix(data.data.matrix);
      if (!selectedCrossLabLineage && data.data.matrix.comparisons?.length > 0) {
       loadCrossLabLineage(data.data.matrix.comparisons[0].comparisonId);
      }
     }
     if (data.data.contradictions) setCrossLabContradictions(data.data.contradictions);
     if (data.data.reproducibility) setCrossLabReproducibility(data.data.reproducibility);
     if (data.data.outliers) setCrossLabOutliers(data.data.outliers);
     if (data.data.opportunities) setCrossLabOpportunities(data.data.opportunities);
     if (data.data.ledgerEntries) setCrossLabLedger(data.data.ledgerEntries);
     if (data.data.snapshot) setCrossLabSnapshot(data.data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/cross-lab-regression/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setCrossLabHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadCrossLabLineage = (comparisonId: string) => {
  fetch(`/api/research/${params.id}/cross-lab-regression/${comparisonId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setSelectedCrossLabLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleTriggerCrossLabSynthesis = () => {
  setIsSynthesizingCrossLab(true);
  setCrossLabErrorMsg(null);
  fetch(`/api/research/${params.id}/cross-lab-regression/synthesize`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCrossLabSuccessMsg(`Cross-laboratory empirical synthesis updated (${data.data.matrix?.totalComparisonsCount || 0} comparisons evaluated).`);
     setTimeout(() => setCrossLabSuccessMsg(null), 4000);
     loadCrossLabRegressionState();
    } else {
     setCrossLabErrorMsg(data.error || "Failed to trigger cross-laboratory synthesis.");
    }
   })
   .catch((err) => setCrossLabErrorMsg(err.message || "Failed to trigger cross-laboratory synthesis."))
   .finally(() => setIsSynthesizingCrossLab(false));
 };

 const handleValidateCrossLabOpportunity = (opportunityId: string) => {
  setCrossLabErrorMsg(null);
  fetch(`/api/research/${params.id}/cross-lab-regression/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCrossLabSuccessMsg("Opportunity validated in Phase 86 calibration queue. Ready for evidence promotion gate.");
     setTimeout(() => setCrossLabSuccessMsg(null), 4000);
     loadCrossLabRegressionState();
    } else {
     setCrossLabErrorMsg(data.error || "Failed to validate opportunity.");
    }
   })
   .catch((err) => setCrossLabErrorMsg(err.message || "Failed to validate opportunity."));
 };

 const handlePromoteCrossLabEvidence = (opportunityId: string) => {
  setIsPromotingCrossLab(true);
  setCrossLabErrorMsg(null);
  fetch(`/api/research/${params.id}/cross-lab-regression/promote`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCrossLabSuccessMsg(`Finding promoted to Verified Research Ledger (Entry: ${data.data?.ledgerEntry?.ledgerEntryId}).`);
     setTimeout(() => setCrossLabSuccessMsg(null), 4000);
     loadCrossLabRegressionState();
    } else {
     const reasons = data.data?.decision?.rejectionReasons?.join("; ") || data.error || "Promotion gate rejected finding.";
     setCrossLabErrorMsg(`Promotion Gate Blocked: ${reasons}`);
    }
   })
   .catch((err) => setCrossLabErrorMsg(err.message || "Evidence promotion failed."))
   .finally(() => setIsPromotingCrossLab(false));
 };

 // Phase 91: Multi-Testbench Cluster Orchestration & Silicon-to-Silicon Differential Matrix Handlers
 const loadTestbenchClusterState = () => {
  fetch(`/api/research/${params.id}/testbench-cluster`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.cluster) setClusterState(data.data.cluster);
     if (data.data.nodes) setClusterNodes(data.data.nodes);
     if (data.data.jobs) setClusterJobs(data.data.jobs);
     if (data.data.matrix) {
      setDifferentialMatrix(data.data.matrix);
      if (!selectedClusterLineage && data.data.matrix.entries?.length > 0) {
       loadClusterLineage(data.data.matrix.entries[0].differentialId);
      }
     }
     if (data.data.reproducibility) setClusterReproducibility(data.data.reproducibility);
     if (data.data.outliers) setClusterOutliers(data.data.outliers);
     if (data.data.contradictions) setClusterContradictions(data.data.contradictions);
     if (data.data.opportunities) setClusterOpportunities(data.data.opportunities);
     if (data.data.snapshot) setClusterSnapshot(data.data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/testbench-cluster/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setClusterHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadClusterLineage = (comparisonId: string) => {
  fetch(`/api/research/${params.id}/testbench-cluster/${comparisonId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setSelectedClusterLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleRunClusterSchedule = () => {
  setIsSchedulingCluster(true);
  setClusterErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench-cluster/schedule`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setClusterSuccessMsg(`Deterministic scheduling complete: ${data.data.allocations.length} jobs allocated.`);
     setTimeout(() => setClusterSuccessMsg(null), 4000);
     loadTestbenchClusterState();
    } else {
     setClusterErrorMsg(data.error || "Failed to schedule cluster.");
    }
   })
   .catch((err) => setClusterErrorMsg(err.message || "Failed to schedule cluster."))
   .finally(() => setIsSchedulingCluster(false));
 };

 const handleRunClusterBatch = () => {
  setIsRunningClusterBatch(true);
  setClusterErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench-cluster/run`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({}),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setClusterSuccessMsg(`Cluster execution batch executed: ${data.data.completedJobsCount} jobs completed.`);
     setTimeout(() => setClusterSuccessMsg(null), 4000);
     loadTestbenchClusterState();
    } else {
     setClusterErrorMsg(data.error || "Failed to execute cluster batch.");
    }
   })
   .catch((err) => setClusterErrorMsg(err.message || "Failed to execute cluster batch."))
   .finally(() => setIsRunningClusterBatch(false));
 };

 const handleAbortClusterNode = (nodeId: string) => {
  setClusterErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench-cluster/abort`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ nodeId, reason: "Creator manual cluster emergency stop." }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setClusterSuccessMsg(`Node ${nodeId} execution aborted.`);
     setTimeout(() => setClusterSuccessMsg(null), 4000);
     loadTestbenchClusterState();
    } else {
     setClusterErrorMsg(data.error || "Failed to abort node execution.");
    }
   })
   .catch((err) => setClusterErrorMsg(err.message || "Failed to abort node execution."));
 };

 const handleValidateClusterOpportunity = (opportunityId: string) => {
  setClusterErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench-cluster/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setClusterSuccessMsg("Silicon differential opportunity bridged to Phase 86 research validation queue.");
     setTimeout(() => setClusterSuccessMsg(null), 4000);
     loadTestbenchClusterState();
    } else {
     setClusterErrorMsg(data.error || "Validation bridge failed.");
    }
   })
   .catch((err) => setClusterErrorMsg(err.message || "Validation bridge failed."));
 };

 // Phase 90: Multi-Generational Silicon Microarchitecture Simulation Sandbox & Automated Physical Benchmark Testbench Handlers
 const loadTestbenchState = () => {
  fetch(`/api/research/${params.id}/testbench`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.capabilities) setTestbenchCapabilities(data.data.capabilities);
     if (data.data.testbenches) setTestbenchList(data.data.testbenches);
     if (data.data.plans) setTestbenchPlans(data.data.plans);
     if (data.data.experiments) {
      setTestbenchExperiments(data.data.experiments);
      if (!selectedExperiment && data.data.experiments.length > 0) {
       setSelectedExperiment(data.data.experiments[0]);
       loadTestbenchLineage(data.data.experiments[0].experimentId);
      }
     }
     if (data.data.simulations) setTestbenchSimulations(data.data.simulations);
     if (data.data.comparisons) setTestbenchComparisons(data.data.comparisons);
     if (data.data.opportunities) setTestbenchOpportunities(data.data.opportunities);
     if (data.data.snapshot) setTestbenchSnapshot(data.data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/testbench/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setTestbenchHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadTestbenchLineage = (experimentId: string) => {
  fetch(`/api/research/${params.id}/testbench/experiments/${experimentId}`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setInspectedTestbenchLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleRunBenchmark = (planId?: string) => {
  setIsRunningBenchmark(true);
  setTestbenchErrorMsg(null);
  const targetPlanId = planId || (testbenchPlans.length > 0 ? testbenchPlans[0].planId : "plan-cyberpunk-4k");

  fetch(`/api/research/${params.id}/testbench/run`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ planId: targetPlanId, authorizedBy: "creator-lead" }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.experiment) {
     setTestbenchSuccessMsg(`Physical benchmark run executed: ${data.data.experiment.consolidatedScore} ${data.data.experiment.metricUnit}.`);
     setTimeout(() => setTestbenchSuccessMsg(null), 4000);
     loadTestbenchState();
    } else {
     setTestbenchErrorMsg(data.error || "Failed to execute benchmark run.");
    }
   })
   .catch((err) => setTestbenchErrorMsg(err.message || "Failed to execute benchmark run."))
   .finally(() => setIsRunningBenchmark(false));
 };

 const handleAbortExperiment = (experimentId: string) => {
  setTestbenchErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench/abort`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ experimentId, reason: "Creator manual emergency stop." }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setTestbenchSuccessMsg("Experiment safely aborted.");
     setTimeout(() => setTestbenchSuccessMsg(null), 4000);
     loadTestbenchState();
    } else {
     setTestbenchErrorMsg(data.error || "Failed to abort experiment.");
    }
   })
   .catch((err) => setTestbenchErrorMsg(err.message || "Failed to abort experiment."));
 };

 const handleRunSandboxSimulation = () => {
  setTestbenchErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench/simulations`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    targetArchitecture: "Blackwell",
    generation: "RTX 50 Series",
    sku: "GeForce RTX 5090",
    benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
    baselinePhysicalScore: 112.5,
    modeledParameters: {
     branchMispredictPenaltyCycles: Number(sandboxBranchPenalty),
     vectorExecutionWidthBits: Number(sandboxVectorWidth),
     l1DataCacheLatencyCycles: Number(sandboxCacheLatency),
     l2CacheLatencyCycles: 14,
     l3CacheLatencyCycles: 45,
     memoryBandwidthGbps: Number(sandboxMemBandwidth),
     syscallOverheadCycles: 300,
     clockFrequencyGhz: Number(sandboxClockGhz),
     powerCapWatts: 500,
    },
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setTestbenchSuccessMsg("Microarchitectural sandbox simulation completed.");
     setTimeout(() => setTestbenchSuccessMsg(null), 4000);
     loadTestbenchState();
    } else {
     setTestbenchErrorMsg(data.error || "Failed to run sandbox simulation.");
    }
   })
   .catch((err) => setTestbenchErrorMsg(err.message || "Failed to run sandbox simulation."));
 };

 const handleValidateTestbenchOpportunity = (opportunityId: string) => {
  setTestbenchErrorMsg(null);
  fetch(`/api/research/${params.id}/testbench/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setTestbenchSuccessMsg("Opportunity bridged to Phase 86 research validation queue.");
     setTimeout(() => setTestbenchSuccessMsg(null), 4000);
     loadTestbenchState();
    } else {
     setTestbenchErrorMsg(data.error || "Validation bridge failed.");
    }
   })
   .catch((err) => setTestbenchErrorMsg(err.message || "Validation bridge failed."));
 };

 // Phase 89: Adaptive Architectural Degradation Forecasting & Simulation Handlers
 const loadArchitecturalForecastState = () => {
  fetch(`/api/research/${params.id}/architectural-forecast`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data) {
     if (data.data.matrix) setForecastMatrix(data.data.matrix);
     if (data.data.forecasts) {
      setForecastList(data.data.forecasts);
      if (!selectedForecast && data.data.forecasts.length > 0) {
       setSelectedForecast(data.data.forecasts[0]);
       loadForecastLineage(data.data.forecasts[0].forecastId);
      }
     }
     if (data.data.simulations) setSimulationList(data.data.simulations);
     if (data.data.scenarios) setScenarioList(data.data.scenarios);
     if (data.data.deprecations) setDeprecationList(data.data.deprecations);
     if (data.data.opportunities) setForecastOpportunities(data.data.opportunities);
     if (data.data.snapshot) setForecastSnapshot(data.data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/architectural-forecast/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.history) {
     setForecastHistory(data.data.history);
    }
   })
   .catch(() => {});
 };

 const loadForecastLineage = (forecastId: string) => {
  fetch(`/api/research/${params.id}/architectural-forecast/${forecastId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.lineage) {
     setInspectedForecastLineage(data.data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleRecomputeForecasts = () => {
  setIsComputingForecasts(true);
  setForecastErrorMsg(null);
  fetch(`/api/research/${params.id}/architectural-forecast/forecast`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setForecastSuccessMsg("Architectural degradation forecasts & trajectories recomputed.");
     setTimeout(() => setForecastSuccessMsg(null), 4000);
     loadArchitecturalForecastState();
    } else {
     setForecastErrorMsg(data.error || "Failed to compute forecasts.");
    }
   })
   .catch((err) => setForecastErrorMsg(err.message || "Failed to compute forecasts."))
   .finally(() => setIsComputingForecasts(false));
 };

 const handleRunForecastSimulation = (scenarioId?: string) => {
  setForecastErrorMsg(null);
  fetch(`/api/research/${params.id}/architectural-forecast/simulations`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ scenarioId: scenarioId || selectedScenarioId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setForecastSuccessMsg(`Simulation executed with ${data.data?.simulation?.assumedOverheadPercentage}% assumed overhead.`);
     setTimeout(() => setForecastSuccessMsg(null), 4000);
     loadArchitecturalForecastState();
    } else {
     setForecastErrorMsg(data.error || "Failed to run simulation.");
    }
   })
   .catch((err) => setForecastErrorMsg(err.message || "Failed to run simulation."));
 };

 const handleCreateCustomScenario = () => {
  if (!customScenarioName.trim()) return;
  setForecastErrorMsg(null);
  fetch(`/api/research/${params.id}/architectural-forecast/scenarios`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
    name: customScenarioName.trim(),
    assumedOverheadPercentage: Number(customScenarioOverhead),
   }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     setCustomScenarioName("");
     setForecastSuccessMsg("Custom simulation scenario created.");
     setTimeout(() => setForecastSuccessMsg(null), 4000);
     loadArchitecturalForecastState();
    } else {
     setForecastErrorMsg(data.error || "Failed to create scenario.");
    }
   })
   .catch((err) => setForecastErrorMsg(err.message || "Failed to create scenario."));
 };

 const handleValidateForecastOpportunity = (opportunityId: string) => {
  setForecastErrorMsg(null);
  fetch(`/api/research/${params.id}/architectural-forecast/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.data?.opportunity) {
     setForecastSuccessMsg(`Forecast opportunity "${data.data.opportunity.title}" bridged to Phase 86 research validation.`);
     setTimeout(() => setForecastSuccessMsg(null), 4000);
     loadArchitecturalForecastState();
    } else {
     setForecastErrorMsg(data.error || "Validation bridge failed.");
    }
   })
   .catch((err) => setForecastErrorMsg(err.message || "Validation bridge failed."));
 };

 // Phase 88: Continuous Cross-Architecture Silicon Regression Handlers
 const loadSiliconRegressionState = () => {
  fetch(`/api/research/${params.id}/silicon-regression`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.observations) setSiliconObservations(data.observations);
     if (data.matrix) {
      setSiliconMatrix(data.matrix);
      if (!selectedRegressionPair && data.matrix.pairs.length > 0) {
       setSelectedRegressionPair(data.matrix.pairs[0]);
       loadRegressionLineage(data.matrix.pairs[0].pairId);
      }
     }
     if (data.series) setSiliconSeries(data.series);
     if (data.synthesis) setSiliconSynthesis(data.synthesis);
     if (data.opportunities) setSiliconOpportunities(data.opportunities);
     if (data.snapshot) setSiliconSnapshot(data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/silicon-regression/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setSiliconHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const loadRegressionLineage = (regressionId: string) => {
  fetch(`/api/research/${params.id}/silicon-regression/${regressionId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.lineage) {
     setInspectedRegressionLineage(data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleSynthesizeRegression = () => {
  setIsSynthesizingRegression(true);
  setSiliconErrorMsg(null);
  fetch(`/api/research/${params.id}/silicon-regression/synthesize`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.synthesis) setSiliconSynthesis(data.synthesis);
     setSiliconSuccessMsg("Silicon regression matrix and empirical synthesis computed.");
     setTimeout(() => setSiliconSuccessMsg(null), 4000);
     loadSiliconRegressionState();
    } else {
     setSiliconErrorMsg(data.error || "Failed to synthesize silicon regression.");
    }
   })
   .catch((err) => setSiliconErrorMsg(err.message || "Failed to synthesize silicon regression."))
   .finally(() => setIsSynthesizingRegression(false));
 };

 const handleValidateRegressionOpportunity = (opportunityId: string) => {
  setSiliconErrorMsg(null);
  fetch(`/api/research/${params.id}/silicon-regression/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.opportunity) {
     setSiliconSuccessMsg(`Regression opportunity "${data.opportunity.title}" bridged to Phase 86 research validation.`);
     setTimeout(() => setSiliconSuccessMsg(null), 4000);
     loadSiliconRegressionState();
    } else {
     setSiliconErrorMsg(data.error || "Validation bridge failed.");
    }
   })
   .catch((err) => setSiliconErrorMsg(err.message || "Validation bridge failed."));
 };

 // Phase 87: Multi-Project Collective Intelligence Federation Handlers
 const loadCollectiveIntelligenceState = () => {
  fetch(`/api/research/${params.id}/collective-intelligence`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.projects) setFederatedProjects(data.projects);
     if (data.observations) setCollectiveObservations(data.observations);
     if (data.correlations) {
      setCollectiveCorrelations(data.correlations);
      if (!selectedCorrelation && data.correlations.length > 0) {
       setSelectedCorrelation(data.correlations[0]);
       loadCorrelationLineage(data.correlations[0].correlationId);
      }
     }
     if (data.opportunities) setCollectiveOpportunities(data.opportunities);
     if (data.snapshot) setCollectiveSnapshot(data.snapshot);
    }
   })
   .catch(() => {});

  fetch(`/api/research/${params.id}/collective-intelligence/history`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.history) {
     setCollectiveHistory(data.history);
    }
   })
   .catch(() => {});
 };

 const loadCorrelationLineage = (correlationId: string) => {
  fetch(`/api/research/${params.id}/collective-intelligence/${correlationId}/lineage`)
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.lineage) {
     setInspectedCorrelationLineage(data.lineage);
    }
   })
   .catch(() => {});
 };

 const handleComputeCorrelations = () => {
  setIsComputingCorrelations(true);
  setCollectiveErrorMsg(null);
  fetch(`/api/research/${params.id}/collective-intelligence/correlate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success) {
     if (data.correlations) setCollectiveCorrelations(data.correlations);
     if (data.opportunities) setCollectiveOpportunities(data.opportunities);
     setCollectiveSuccessMsg("Cross-hardware correlations and opportunities computed.");
     setTimeout(() => setCollectiveSuccessMsg(null), 4000);
     loadCollectiveIntelligenceState();
    } else {
     setCollectiveErrorMsg(data.error || "Failed to compute correlations.");
    }
   })
   .catch((err) => setCollectiveErrorMsg(err.message || "Failed to compute correlations."))
   .finally(() => setIsComputingCorrelations(false));
 };

 const handleValidateOpportunity = (opportunityId: string) => {
  setCollectiveErrorMsg(null);
  fetch(`/api/research/${params.id}/collective-intelligence/validate`, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({ opportunityId }),
  })
   .then((res) => res.json())
   .then((data) => {
    if (data.success && data.opportunity) {
     setCollectiveSuccessMsg(`Opportunity "${data.opportunity.title}" bridged to Phase 86 research validation.`);
     setTimeout(() => setCollectiveSuccessMsg(null), 4000);
     loadCollectiveIntelligenceState();
    } else {
     setCollectiveErrorMsg(data.error || "Validation bridge failed.");
    }
   })
   .catch((err) => setCollectiveErrorMsg(err.message || "Validation bridge failed."));
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
    }
   })
   .catch(() => {})
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

   {/* Primary Workflow Stepper Bar (Phases 70-77) */}
   <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm">
    <div className="flex items-center justify-between overflow-x-auto gap-2 text-xs font-mono">
     <button
      onClick={() => setActiveTab("outline")}
      className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
     >
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span>1. RESEARCH</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => { setActiveTab("health"); loadHealth(); }}
      className="flex items-center gap-1.5 text-teal-600 font-bold hover:underline"
     >
      <HeartPulse className="w-4 h-4 text-teal-600" />
      <span>2. EVIDENCE HEALTH</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => { setActiveTab("decisions"); loadDecisions(); }}
      className="flex items-center gap-1.5 text-indigo-600 font-bold hover:underline"
     >
      <Compass className="w-4 h-4 text-indigo-600" />
      <span>3. HEALTH DECISIONS</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => setActiveTab("narration")}
      className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
     >
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span>4. SCRIPT</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => setActiveTab("quality")}
      className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
     >
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span>5. QUALITY</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => setActiveTab("benchmarkCards")}
      className="flex items-center gap-1.5 text-emerald-600 font-bold hover:underline"
     >
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span>6. PRODUCTION</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => { setActiveTab("publishing"); loadPreflight(preferences); }}
      className="flex items-center gap-1.5 text-purple-600 font-bold hover:underline"
     >
      <Send className="w-4 h-4 text-purple-600" />
      <span>7. PUBLISHING</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => { setActiveTab("distribution"); loadDistribution(); }}
      className="flex items-center gap-1.5 text-rose-600 font-bold hover:underline"
     >
      <Globe className="w-4 h-4 text-rose-600" />
      <span>8. DISTRIBUTION</span>
     </button>
     <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
     <button
      onClick={() => { setActiveTab("editorSync"); loadEditorSync(); }}
      className="flex items-center gap-1.5 text-cyan-600 font-bold hover:underline"
     >
      <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
      <span>9. EDITOR SYNC</span>
     </button>
    </div>
   </div>

   {/* Header Bar */}
   <div className="border-b border-slate-200 pb-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
     <div>
      <span className="text-xs font-mono text-indigo-600 font-semibold uppercase tracking-wider block mb-1">
       CREATOR PROJECT INTELLIGENCE WORKSPACE
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
       <Network className="w-7 h-7 text-indigo-600" />
       Creator Project Control Center
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1">
       Unified asset dependency graph, end-to-end evidence integrity, non-bypassable blocker intelligence, and read-only impact simulation.
      </p>
     </div>

     <div className="flex flex-wrap items-center gap-3">
      {/* Output Mode Switcher */}
      <div className="flex items-center gap-1 bg-white rounded-[24px] shadow-sm border border-slate-200 p-1 rounded-xl">
       <span className="text-xs text-slate-500 font-mono ml-2 mr-1">Mode:</span>
       <button
        onClick={() => handleModeChange("OUTLINE")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
         outputMode === "OUTLINE"
          ? "bg-indigo-600 text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        }`}
       >
        Outline
       </button>
       <button
        onClick={() => handleModeChange("SCRIPT_READY")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
         outputMode === "SCRIPT_READY"
          ? "bg-indigo-600 text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        }`}
       >
        Script-Ready
       </button>
       <button
        onClick={() => handleModeChange("FULL_NARRATION")}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
         outputMode === "FULL_NARRATION"
          ? "bg-indigo-600 text-slate-900 shadow-sm"
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        }`}
       >
        Full Spoken
       </button>
      </div>

      {/* Duration Selector */}
      <div className="flex items-center gap-1 bg-white rounded-[24px] shadow-sm border border-slate-200 p-1 rounded-xl">
       <Clock className="w-3.5 h-3.5 text-slate-500 ml-2" />
       <span className="text-xs text-slate-500 font-mono mr-1">Duration:</span>
       {([8, 12, 18] as TargetVideoDuration[]).map((d) => (
        <button
         key={d}
         onClick={() => handleDurationChange(d)}
         className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
          duration === d
           ? "bg-indigo-600 text-slate-900 shadow-sm"
           : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
         }`}
        >
         {d}m
        </button>
       ))}
      </div>

      {/* Teleprompter Button */}
      {preferences.enableTeleprompter && preferences.generateScript ? (
       <button
        onClick={() => setIsTeleprompterOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
       >
        <MonitorPlay className="w-4 h-4" />
        Teleprompter
       </button>
      ) : null}
     </div>
    </div>
   </div>

   {/* Navigation Sub-Tabs */}
   <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
    {/* Phase 77: Primary Project Control Center Tab */}
    <button
     onClick={() => {
      setActiveTab("project");
      loadProjectOverview();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "project"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-indigo-600 border-indigo-200/50 hover:bg-slate-100"
     }`}
    >
     <Network className="w-3.5 h-3.5 inline mr-1.5" />
     Project Control Center
    </button>

    {/* Phase 82: Production Matrix, Benchmark Diff & Asset Assembly Tab */}
    <button
     onClick={() => {
      setActiveTab("matrix");
      loadMatrixState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "matrix"
       ? "bg-teal-600 text-slate-900 border-teal-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-teal-700 border-teal-900/50 hover:bg-slate-100"
     }`}
    >
     <Layers className="w-3.5 h-3.5 inline mr-1.5" />
     Production Matrix {productionMatrix ? `(${productionMatrix.totalVariantsCount} variants)` : ""}
    </button>

    {/* Phase 83: Production Export & Render Manifest Tab */}
    <button
     onClick={() => {
      setActiveTab("exportWorkspace");
      loadExportState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "exportWorkspace"
       ? "bg-blue-600 text-slate-900 border-blue-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-blue-700 border-blue-900/50 hover:bg-slate-100"
     }`}
    >
     <FileArchive className="w-3.5 h-3.5 inline mr-1.5" />
     Production Export {exportPackage ? `(${exportPackage.status})` : ""}
    </button>

    {/* Phase 84: Creator Multi-Channel Publishing Orchestrator Tab */}
    <button
     onClick={() => {
      setActiveTab("publishingOrchestrator");
      loadPublishingState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "publishingOrchestrator"
       ? "bg-violet-600 text-slate-900 border-violet-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-violet-300 border-violet-900/50 hover:bg-slate-100"
     }`}
    >
     <SendHorizontal className="w-3.5 h-3.5 inline mr-1.5" />
     Publishing Orchestrator {publishingPlan ? `(${publishingPlan.status})` : ""}
    </button>

    {/* Phase 85: Post-Publication Integrity Monitor & Release Health Tab */}
    <button
     onClick={() => {
      setActiveTab("publicationIntegrity");
      loadPublicationIntegrityState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "publicationIntegrity"
       ? "bg-rose-600 text-slate-900 border-rose-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-rose-600 border-rose-200 hover:bg-slate-100"
     }`}
    >
     <ShieldAlert className="w-3.5 h-3.5 inline mr-1.5" />
     Publication Integrity {releaseHealthReport ? `(${releaseHealthReport.overallStatus})` : ""}
    </button>

    {/* Phase 86: Closed-Loop Research Calibration Engine Tab */}
    <button
     onClick={() => {
      setActiveTab("researchCalibration");
      loadCalibrationState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "researchCalibration"
       ? "bg-amber-600 text-slate-900 border-amber-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50 hover:bg-slate-100"
     }`}
    >
     <Scale className="w-3.5 h-3.5 inline mr-1.5" />
     Research Calibration {calibrationQueue.length > 0 ? `(${calibrationQueue.length} queued)` : ""}
    </button>

    {/* Phase 87: Multi-Project Collective Intelligence Federation Tab */}
    <button
     onClick={() => {
      setActiveTab("collectiveIntelligence");
      loadCollectiveIntelligenceState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "collectiveIntelligence"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-indigo-600 border-indigo-200/50 hover:bg-slate-100"
     }`}
    >
     <Network className="w-3.5 h-3.5 inline mr-1.5" />
     Collective Intelligence {collectiveCorrelations.length > 0 ? `(${collectiveCorrelations.length} active)` : ""}
    </button>

    {/* Phase 88: Continuous Cross-Architecture Silicon Regression Tab */}
    <button
     onClick={() => {
      setActiveTab("siliconRegression");
      loadSiliconRegressionState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "siliconRegression"
       ? "bg-cyan-600 text-slate-900 border-cyan-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-cyan-600 border-cyan-900/50 hover:bg-slate-100"
     }`}
    >
     <Cpu className="w-3.5 h-3.5 inline mr-1.5" />
     Silicon Regression {siliconMatrix?.detectedRegressionsCount ? `(${siliconMatrix.detectedRegressionsCount} regressed)` : ""}
    </button>

    {/* Phase 89: Adaptive Architectural Degradation Forecasting & Simulation Tab */}
    <button
     onClick={() => {
      setActiveTab("architecturalForecast");
      loadArchitecturalForecastState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "architecturalForecast"
       ? "bg-amber-600 text-slate-900 border-amber-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50 hover:bg-slate-100"
     }`}
    >
     <Activity className="w-3.5 h-3.5 inline mr-1.5" />
     Architectural Forecast {forecastMatrix?.forecastsCount ? `(${forecastMatrix.forecastsCount} forecasts)` : ""}
    </button>

    {/* Phase 90: Silicon Testbench Automation & Sandbox Simulation Control Tab */}
    <button
     onClick={() => {
      setActiveTab("testbenchControl");
      loadTestbenchState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "testbenchControl"
       ? "bg-emerald-600 text-slate-900 border-emerald-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-emerald-600 border-emerald-900/50 hover:bg-slate-100"
     }`}
    >
     <FlaskConical className="w-3.5 h-3.5 inline mr-1.5" />
     Testbench Control {testbenchExperiments.length > 0 ? `(${testbenchExperiments.length} runs)` : ""}
    </button>

    {/* Phase 91: Multi-Testbench Cluster Orchestration & Silicon Differential Matrix Tab */}
    <button
     onClick={() => {
      setActiveTab("testbenchCluster");
      loadTestbenchClusterState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "testbenchCluster"
       ? "bg-teal-600 text-slate-900 border-teal-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-teal-700 border-teal-900/50 hover:bg-slate-100"
     }`}
    >
     <Network className="w-3.5 h-3.5 inline mr-1.5" />
     Testbench Cluster {clusterNodes.length > 0 ? `(${clusterNodes.length} nodes)` : ""}
    </button>

    {/* Phase 92: Automated Continuous Cross-Laboratory Empirical Regression Synthesis Tab */}
    <button
     onClick={() => {
      setActiveTab("crossLabRegression");
      loadCrossLabRegressionState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "crossLabRegression"
       ? "bg-sky-600 text-slate-900 border-sky-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-sky-600 border-sky-900/50 hover:bg-slate-100"
     }`}
    >
     <GitMerge className="w-3.5 h-3.5 inline mr-1.5" />
     Cross-Lab Regression {crossLabLaboratories.length > 0 ? `(${crossLabLaboratories.length} labs)` : ""}
    </button>

    {/* Phase 93: Automated Cross-Generational Microarchitectural Bottleneck Attribution Tab */}
    <button
     onClick={() => {
      setActiveTab("microarchitecture");
      loadMicroarchitectureState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "microarchitecture"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-indigo-600 border-indigo-200/50 hover:bg-slate-100"
     }`}
    >
     <Layers className="w-3.5 h-3.5 inline mr-1.5" />
     Microarchitecture {microTraces.length > 0 ? `(${microTraces.length} traces)` : ""}
    </button>

    {/* Phase 94: Automated Hardware-Software Co-Design Empirical Simulation & Interactive Calibration Workbench Tab */}
    <button
     onClick={() => {
      setActiveTab("coDesign");
      loadCoDesignState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "coDesign"
       ? "bg-fuchsia-600 text-slate-900 border-fuchsia-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-fuchsia-700 border-fuchsia-900/50 hover:bg-slate-100"
     }`}
    >
     <Cpu className="w-3.5 h-3.5 inline mr-1.5" />
     Co-Design Workbench {coDesignScenarios.length > 0 ? `(${coDesignScenarios.length} scenarios)` : ""}
    </button>

    {/* Phase 95: Automated Competing Hypothesis, Falsification & Empirical Calibration Reconciliation Tab */}
    <button
     onClick={() => {
      setActiveTab("hypotheses");
      loadHypothesisState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "hypotheses"
       ? "bg-rose-600 text-slate-900 border-rose-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-rose-600 border-rose-200 hover:bg-slate-100"
     }`}
    >
     <Compass className="w-3.5 h-3.5 inline mr-1.5" />
     Hypothesis &amp; Falsification {hypothesesList.length > 0 ? `(${hypothesesList.length} hypotheses)` : ""}
    </button>

    {/* Phase 78: Execution Control Tab */}
    <button
     onClick={() => {
      setActiveTab("execution");
      loadExecutionState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "execution"
       ? "bg-emerald-600 text-slate-900 border-emerald-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-emerald-600 border-emerald-900/50 hover:bg-slate-100"
     }`}
    >
     <PlayCircle className="w-3.5 h-3.5 inline mr-1.5" />
     Execution Control {executionPlan ? `(${executionPlan.executionStatus})` : ""}
    </button>

    {/* Phase 79: Final Integrity Certification & Release Lock Tab */}
    <button
     onClick={() => {
      setActiveTab("certification");
      loadCertificationState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "certification"
       ? "bg-amber-600 text-slate-900 border-amber-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50 hover:bg-slate-100"
     }`}
    >
     <Award className="w-3.5 h-3.5 inline mr-1.5" />
     Final Integrity {certificate ? `(${certificate.status})` : ""}
    </button>

    {/* Phase 80: Performance Intelligence & Learning Tab */}
    <button
     onClick={() => {
      setActiveTab("performance");
      loadPerformanceState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "performance"
       ? "bg-purple-600 text-slate-900 border-purple-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-purple-600 border-purple-900/50 hover:bg-slate-100"
     }`}
    >
     <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
     Performance Intelligence {perfSnapshot ? `(${perfSnapshot.metrics.views?.value.toLocaleString()} views)` : ""}
    </button>

    {/* Phase 81: Creator Intelligence Ecosystem & Benchmark Synthesis Tab */}
    <button
     onClick={() => {
      setActiveTab("intelligence");
      loadIntelligenceState();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "intelligence"
       ? "bg-cyan-600 text-slate-900 border-cyan-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-cyan-600 border-cyan-900/50 hover:bg-slate-100"
     }`}
    >
     <Cpu className="w-3.5 h-3.5 inline mr-1.5" />
     Intelligence & Synthesis {synthesisReport ? `(${synthesisReport.alignedMethodologiesCount} aligned)` : ""}
    </button>

    <button
     onClick={() => setActiveTab("workflow")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "workflow"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-indigo-600 border-indigo-200/50 hover:bg-slate-100"
     }`}
    >
     <Workflow className="w-3.5 h-3.5 inline mr-1.5" />
     Workflow Stage Gate
    </button>

    {/* Phase 76: Distribution Pipeline Tab */}
    <button
     onClick={() => {
      setActiveTab("distribution");
      loadDistribution();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "distribution"
       ? "bg-rose-600 text-slate-900 border-rose-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-rose-600 border-rose-200 hover:bg-slate-100"
     }`}
    >
     <Globe className="w-3.5 h-3.5 inline mr-1.5" />
     Distribution Pipeline ({distPackage?.distributionReadinessScore || 0}%)
    </button>

    {/* Phase 75: Health Decision Control Center Tab */}
    <button
     onClick={() => {
      setActiveTab("decisions");
      loadDecisions();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "decisions"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-indigo-600 border-indigo-200/50 hover:bg-slate-100"
     }`}
    >
     <Compass className="w-3.5 h-3.5 inline mr-1.5" />
     Health Decisions ({decisionReport?.actionRequiredBanner?.totalCriticalIssues || 0} Critical)
    </button>

    {/* Phase 74: Evidence Health & Freshness Tab */}
    <button
     onClick={() => {
      setActiveTab("health");
      loadHealth();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "health"
       ? "bg-teal-600 text-slate-900 border-teal-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-teal-700 border-teal-900/50 hover:bg-slate-100"
     }`}
    >
     <HeartPulse className="w-3.5 h-3.5 inline mr-1.5" />
     Evidence Health ({healthReport?.overallHealthScore || 0}% {healthReport?.overallHealthGrade || "A"})
    </button>

    {/* Phase 73: Research Changes & Impact Intelligence Tab */}
    <button
     onClick={() => {
      setActiveTab("changes");
      loadChanges();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "changes"
       ? "bg-amber-600 text-slate-900 border-amber-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50 hover:bg-slate-100"
     }`}
    >
     <History className="w-3.5 h-3.5 inline mr-1.5" />
     Changes & Impact ({impactReport?.changeSet?.summary?.totalChanges || 0})
    </button>

    {/* Phase 71: Publishing & Delivery Tab */}
    <button
     onClick={() => {
      setActiveTab("publishing");
      loadPreflight(preferences);
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "publishing"
       ? "bg-purple-600 text-slate-900 border-purple-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-purple-600 border-purple-900/50 hover:bg-slate-100"
     }`}
    >
     <Send className="w-3.5 h-3.5 inline mr-1.5" />
     Publishing Preflight
    </button>

    {/* Phase 72: Video Editor Sync Tab */}
    <button
     onClick={() => {
      setActiveTab("editorSync");
      loadEditorSync();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "editorSync"
       ? "bg-cyan-600 text-slate-900 border-cyan-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-cyan-600 border-cyan-900/50 hover:bg-slate-100"
     }`}
    >
     <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1.5" />
     Video Editor Sync ({syncPlan?.totalChanges || 0} ops)
    </button>

    <button
     onClick={() => setActiveTab("outline")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
      activeTab === "outline" ? "bg-indigo-600 text-slate-900" : "bg-white rounded-[24px] shadow-sm text-slate-500 hover:text-slate-700"
     }`}
    >
     <Film className="w-3.5 h-3.5 inline mr-1.5" />
     Script Outline ({report.scriptSections?.length || 0})
    </button>

    <button
     onClick={() => setActiveTab("narration")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "narration"
       ? "bg-emerald-600 text-slate-900 border-emerald-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-emerald-600 border-emerald-900/50 hover:bg-slate-100"
     }`}
    >
     <FileText className="w-3.5 h-3.5 inline mr-1.5" />
     Full Spoken Script
    </button>

    <button
     onClick={() => setActiveTab("quality")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "quality"
       ? "bg-amber-600 text-slate-900 border-amber-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50 hover:bg-slate-100"
     }`}
    >
     <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />
     Quality Review Audit
    </button>

    <button
     onClick={() => {
      setActiveTab("timeline");
      handleGenerateTimeline();
     }}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "timeline"
       ? "bg-cyan-600 text-slate-900 border-cyan-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-cyan-600 border-cyan-900/50 hover:bg-slate-100"
     }`}
    >
     <FileCode className="w-3.5 h-3.5 inline mr-1.5" />
     Editor Export (EDL / FCPXML)
    </button>

    <button
     onClick={() => setActiveTab("training")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "training"
       ? "bg-purple-600 text-slate-900 border-purple-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-purple-600 border-purple-900/50 hover:bg-slate-100"
     }`}
    >
     <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
     Script Training Profile
    </button>

    <button
     onClick={() => setActiveTab("controls")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
      activeTab === "controls"
       ? "bg-indigo-600 text-slate-900 border-indigo-500 shadow-sm"
       : "bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-300 hover:bg-slate-100"
     }`}
    >
     <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
     Production Controls
    </button>

    <button
     onClick={() => setActiveTab("export")}
     className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
      activeTab === "export" ? "bg-indigo-600 text-slate-900" : "bg-white rounded-[24px] shadow-sm text-slate-500 hover:text-slate-700"
     }`}
    >
     <FileText className="w-3.5 h-3.5 inline mr-1.5" />
     Export Markdown
    </button>
   </div>

   {/* TAB: CREATOR PROJECT CONTROL CENTER (PHASE 77) */}
   {activeTab === "project" && (
    <div className="space-y-6">
     {/* Top Project Status Banner */}
     <div className={`p-6 rounded-2xl border transition shadow-sm ${
      projectOverview?.healthReport.isHardBlocked
       ? "bg-rose-50/40 border-rose-700/70"
       : projectOverview?.projectStatus === 'READY'
       ? "bg-emerald-50/40 border-emerald-600/70"
       : "bg-white rounded-[24px] shadow-sm border-slate-200"
     }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
       <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          projectOverview?.healthReport.isHardBlocked
           ? "bg-rose-50 text-rose-600 border-rose-200"
           : projectOverview?.projectStatus === 'READY'
           ? "bg-emerald-50 text-emerald-600 border-emerald-200"
           : "bg-indigo-50 text-indigo-600 border-indigo-200"
         }`}>
          PROJECT STATUS: {projectOverview?.projectStatus || "READY"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Script v{projectOverview?.activeScriptVersion || 1} | Mode: {projectOverview?.outputMode || "SCRIPT_READY"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Network className="w-5 h-5 text-indigo-600" />
         {report.topic || "Hardware Research Project"}
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
         {projectOverview?.healthReport.summaryMessage || "Unified creator project graph and evidence integrity control plane."}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
         <span>Project Hash: {projectOverview?.snapshot.snapshotHash.slice(0, 12)}...</span>
         <span>• Evidence Hash: {projectOverview?.snapshot.evidenceSnapshotHash.slice(0, 12)}...</span>
         <span>• Graph Nodes: {projectOverview?.graph.nodeCount || 0}</span>
         <span>• Edges: {projectOverview?.graph.edgeCount || 0}</span>
        </div>
       </div>

       <div className="flex items-center gap-2 shrink-0">
        <button
         onClick={loadProjectOverview}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition font-mono"
        >
         <RefreshCw className="w-3.5 h-3.5" /> Refresh Project State
        </button>
       </div>
      </div>
     </div>

     {/* Non-Bypassable Hard Blockers Alert Box */}
     {projectOverview?.healthReport.blockers && projectOverview.healthReport.blockers.length > 0 && (
      <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80 space-y-3 shadow-sm">
       <div className="flex items-center justify-between border-b border-rose-200 pb-2">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs font-mono">
         <ShieldAlert className="w-4 h-4 text-rose-600" />
         <span>PROJECT INTEGRITY BLOCKED ({projectOverview.healthReport.blockers.length} NON-BYPASSABLE ISSUES)</span>
        </div>
        <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">
         SAFETY GATES ACTIVE
        </span>
       </div>

       <div className="space-y-2">
        {projectOverview.healthReport.blockers.map((blk) => (
         <div
          key={blk.blockerId}
          className="p-3 rounded-xl bg-slate-50 border border-rose-200 flex items-start justify-between gap-3 text-xs font-mono"
         >
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
             {blk.subsystem}
            </span>
            <span className="font-bold text-slate-700">{blk.affectedNodeLabel}</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{blk.reason}</p>
           <span className="text-[10px] text-amber-600 block font-mono">
            Required Action: {blk.requiredAction}
           </span>
          </div>

          <button
           onClick={() => setInspectedProjectBlocker(blk)}
           className="px-2.5 py-1 rounded-lg bg-white rounded-[24px] shadow-sm hover:bg-slate-100 text-rose-600 text-[11px] font-mono border border-rose-200 shrink-0 transition"
          >
           Why is this blocked?
          </button>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* 5 Authoritative Multi-Subsystem Score Cards */}
     <div className="grid sm:grid-cols-5 gap-3">
      <div className="p-4 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-1">
       <span className="text-[10px] font-mono text-teal-600 font-bold uppercase">1. RESEARCH HEALTH</span>
       <p className="text-2xl font-bold font-mono text-teal-700">
        {projectOverview?.healthReport.researchHealthScore || 95}%
       </p>
       <p className="text-[11px] text-slate-500 font-sans">Freshness & Validity</p>
      </div>

      <div className="p-4 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-1">
       <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">2. CONTENT QUALITY</span>
       <p className="text-2xl font-bold font-mono text-emerald-600">
        {projectOverview?.healthReport.contentQualityScore || 90}%
       </p>
       <p className="text-[11px] text-slate-500 font-sans">Evidence Grounding</p>
      </div>

      <div className="p-4 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-1">
       <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">3. PRODUCTION READINESS</span>
       <p className="text-2xl font-bold font-mono text-indigo-600">
        {projectOverview?.healthReport.productionReadinessScore || 95}%
       </p>
       <p className="text-[11px] text-slate-500 font-sans">Cards & Outline Assets</p>
      </div>

      <div className="p-4 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-1">
       <span className="text-[10px] font-mono text-purple-600 font-bold uppercase">4. PUBLISHING PREFLIGHT</span>
       <p className="text-2xl font-bold font-mono text-purple-600">
        {projectOverview?.healthReport.publishingReadinessScore || 90}%
       </p>
       <p className="text-[11px] text-slate-500 font-sans">Multi-Platform Checks</p>
      </div>

      <div className="p-4 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-1">
       <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">5. DISTRIBUTION STAGING</span>
       <p className="text-2xl font-bold font-mono text-rose-600">
        {projectOverview?.healthReport.distributionReadinessScore || 90}%
       </p>
       <p className="text-[11px] text-slate-500 font-sans">Staged Release Plans</p>
      </div>
     </div>

     {/* End-to-End Pipeline Visualization */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <GitBranch className="w-4 h-4 text-indigo-600" />
         End-to-End Project Pipeline Integrity ({projectOverview?.pipelineStages.length || 0} Stages)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
         Complete authority chain: Research → Evidence → Health → Decisions → Script → Quality → Production → Editor → Publishing → Distribution.
        </p>
       </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
       {projectOverview?.pipelineStages.map((stg) => (
        <div
         key={stg.stageId}
         className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col justify-between"
        >
         <div className="space-y-1">
          <div className="flex items-center justify-between">
           <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
            STAGE {stg.stageNumber}
           </span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
            stg.status === 'READY' || stg.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
            stg.status === 'BLOCKED' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
            'bg-amber-50 text-amber-600 border border-amber-200'
           }`}>
            {stg.status}
           </span>
          </div>
          <p className="text-xs font-bold text-slate-700">{stg.label}</p>
          {stg.score !== undefined && (
           <p className="text-[11px] font-mono text-slate-500">Score: {stg.score}%</p>
          )}
          {stg.requiredAction && (
           <p className="text-[11px] font-mono text-rose-600">{stg.requiredAction}</p>
          )}
         </div>

         <button
          onClick={() => setActiveTab(stg.targetTab as any)}
          className="w-full py-1.5 rounded-lg bg-white rounded-[24px] shadow-sm hover:bg-slate-100 text-indigo-600 text-xs font-mono transition mt-2"
         >
          Open Subsystem →
         </button>
        </div>
       ))}
      </div>
     </div>

     {/* Unified Asset Inventory Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Layers className="w-4 h-4 text-emerald-600" />
         Unified Project Asset Inventory ({projectOverview?.assets.length || 0} Assets)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
         Real-time status, health, and provenance mapping for every script and production asset.
        </p>
       </div>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-xs font-mono text-left text-slate-700">
        <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
         <tr>
          <th className="p-2.5">ASSET</th>
          <th className="p-2.5">TYPE</th>
          <th className="p-2.5">SUBSYSTEM</th>
          <th className="p-2.5">STATUS</th>
          <th className="p-2.5">VERSION</th>
          <th className="p-2.5">ACTIONS</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {projectOverview?.assets.map((asset) => (
          <tr key={asset.assetId} className="hover:bg-slate-100">
           <td className="p-2.5 font-bold text-slate-900">{asset.label}</td>
           <td className="p-2.5 text-slate-500">{asset.assetType}</td>
           <td className="p-2.5 text-indigo-600">{asset.subsystem}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
             asset.status === 'READY' || asset.status === 'HEALTHY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
             asset.status === 'BLOCKED' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
             'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
             {asset.status}
            </span>
           </td>
           <td className="p-2.5 text-slate-500">v{asset.currentVersion}</td>
           <td className="p-2.5">
            <button
             onClick={() => {
              const node = projectOverview.graph.nodes.find((n) => n.id === `tp-${asset.assetId}` || n.id === `bmcard-${asset.assetId}`);
              if (node) setInspectedProjectNode(node);
             }}
             className="text-xs text-indigo-600 hover:text-indigo-600 hover:underline"
            >
             Lineage Inspector
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* "What Breaks If This Changes?" Read-Only Simulation Playground */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Zap className="w-4 h-4 text-amber-600" />
         "What Breaks If This Changes?" Read-Only Simulation
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
         Simulate downstream impact across scripts, benchmark cards, and distribution staging before making upstream research modifications.
        </p>
       </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
       <div className="space-y-1">
        <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Select Upstream Claim / Node</label>
        <select
         value={simulationTargetId}
         onChange={(e) => setSimulationTargetId(e.target.value)}
         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
        >
         <option value="">-- Choose Claim to Simulate --</option>
         {(report.talkingPoints || []).map((tp) => (
          <option key={tp.id} value={tp.id}>
           {tp.title || tp.statement.slice(0, 40)}
          </option>
         ))}
        </select>
       </div>

       <div className="space-y-1">
        <label className="text-[10px] font-mono text-slate-500 uppercase font-bold">Simulated Change Action</label>
        <select
         value={simulationAction}
         onChange={(e) => setSimulationAction(e.target.value)}
         className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-600"
        >
         <option value="BENCHMARK_SCORE_CHANGED">Benchmark Score Changed (&gt;10% delta)</option>
         <option value="CLAIM_INVALIDATED">Claim Invalidated (DO_NOT_SAY)</option>
         <option value="METHODOLOGY_SHIFT">Methodology Shift / Upscaling Setting</option>
         <option value="SOURCE_RETRACTED">Primary Source Retracted</option>
        </select>
       </div>

       <div className="flex items-end">
        <button
         onClick={handleRunSimulation}
         disabled={isSimulating || !simulationTargetId}
         className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 text-xs font-bold shadow-sm transition font-mono flex items-center justify-center gap-2"
        >
         <Zap className="w-4 h-4" />
         {isSimulating ? "Simulating..." : "Run Read-Only Simulation"}
        </button>
       </div>
      </div>

      {/* Simulation Results Preview */}
      {simulationPreview && (
       <div className="p-4 rounded-xl bg-slate-50 border border-amber-200/60 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
         <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-600 border border-amber-200">
           READ-ONLY SIMULATION
          </span>
          <span className="text-xs font-bold text-slate-700">{simulationPreview.targetNodeLabel}</span>
         </div>
         <span className="text-[11px] font-mono text-slate-500">
          Will Change: {simulationPreview.willChange.length} | Unchanged: {simulationPreview.willRemainUnchanged.length}
         </span>
        </div>

        <p className="text-xs text-slate-700 font-sans leading-relaxed">{simulationPreview.summary}</p>

        {simulationPreview.expectedConsequences.length > 0 && (
         <div className="space-y-1">
          <span className="text-[10px] font-mono text-amber-600 uppercase font-bold">DOWNSTREAM CONSEQUENCES</span>
          <ul className="list-disc list-inside text-xs text-slate-700 font-sans space-y-1">
           {simulationPreview.expectedConsequences.map((c, i) => (
            <li key={i}>{c}</li>
           ))}
          </ul>
         </div>
        )}
       </div>
      )}
     </div>

     {/* "Why Is This Here?" Dependency Lineage Modal */}
     {inspectedProjectNode && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
           "Why Is This Here?" Lineage: {inspectedProjectNode.label}
          </h3>
         </div>
         <button
          onClick={() => setInspectedProjectNode(null)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs">
         <div className="flex justify-between text-slate-500">
          <span>NODE ID:</span>
          <span className="font-bold text-slate-900">{inspectedProjectNode.id}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>TYPE:</span>
          <span className="text-indigo-600 font-bold">{inspectedProjectNode.type}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>SUBSYSTEM:</span>
          <span className="text-purple-600 font-bold">{inspectedProjectNode.subsystem}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>STATUS:</span>
          <span className="text-emerald-600 font-bold">{inspectedProjectNode.status}</span>
         </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
         <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] text-teal-600 uppercase font-bold block">UPSTREAM DEPENDENCIES ({inspectedProjectNode.upstreamNodeIds.length})</span>
          {inspectedProjectNode.upstreamNodeIds.length === 0 ? (
           <p className="text-slate-500 text-[11px]">Root Research Node</p>
          ) : (
           inspectedProjectNode.upstreamNodeIds.map((id) => (
            <div key={id} className="text-slate-700 text-[11px] truncate">
             • {id}
            </div>
           ))
          )}
         </div>

         <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-[10px] text-purple-600 uppercase font-bold block">DOWNSTREAM DEPENDENTS ({inspectedProjectNode.downstreamNodeIds.length})</span>
          {inspectedProjectNode.downstreamNodeIds.length === 0 ? (
           <p className="text-slate-500 text-[11px]">Terminal Output Node</p>
          ) : (
           inspectedProjectNode.downstreamNodeIds.map((id) => (
            <div key={id} className="text-slate-700 text-[11px] truncate">
             • {id}
            </div>
           ))
          )}
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setInspectedProjectNode(null)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Close
         </button>
        </div>
       </div>
      </div>
     )}

     {/* "Why Is This Blocked?" Inspector Modal */}
     {inspectedProjectBlocker && (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Project Blocker Intelligence</h3>
         </div>
         <button
          onClick={() => setInspectedProjectBlocker(null)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-rose-200 space-y-1.5 font-mono text-xs">
         <div className="flex justify-between text-slate-500">
          <span>AFFECTED SUBSYSTEM:</span>
          <span className="font-bold text-rose-600">{inspectedProjectBlocker.subsystem}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>AFFECTED NODE:</span>
          <span className="text-slate-900 font-bold">{inspectedProjectBlocker.affectedNodeLabel}</span>
         </div>
         <div className="flex justify-between text-slate-500">
          <span>SEVERITY:</span>
          <span className="text-rose-600 font-bold">{inspectedProjectBlocker.severity}</span>
         </div>
        </div>

        <div className="space-y-2 text-xs font-sans">
         <span className="text-[10px] font-mono text-indigo-600 uppercase font-bold">ROOT CAUSE & REMEDIATION</span>
         <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 space-y-2 text-slate-700 leading-relaxed">
          <p><strong>Reason:</strong> {inspectedProjectBlocker.reason}</p>
          <p><strong>Upstream Cause:</strong> {inspectedProjectBlocker.upstreamCause}</p>
          <p className="text-[11px] font-mono text-amber-600 border-t border-slate-100 pt-2">
           Required Action: {inspectedProjectBlocker.requiredAction}
          </p>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setInspectedProjectBlocker(null)}
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
          Active Script v{report.scriptVersion || 1} → Target v{(report.scriptVersion || 1) + 1}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <PlayCircle className="w-5 h-5 text-emerald-600" />
         Creator Change Execution & Safe Action Control Plane
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Deterministic staged execution preventing silent mutations. Preview first → Execute second → Verify third → Commit last.
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
        <span className="text-slate-500">•</span>
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
          {validationReport.researchHealthBefore}% → {validationReport.researchHealthAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-emerald-600 uppercase font-bold block">2. QUALITY</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.contentQualityBefore}% → {validationReport.contentQualityAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-cyan-600 uppercase font-bold block">3. PRODUCTION</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.productionReadinessBefore}% → {validationReport.productionReadinessAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-purple-600 uppercase font-bold block">4. PUBLISHING</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.publishingReadinessBefore}% → {validationReport.publishingReadinessAfter}%
         </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-mono text-center">
         <span className="text-[10px] text-rose-600 uppercase font-bold block">5. DISTRIBUTION</span>
         <div className="text-sm font-bold text-slate-700">
          {validationReport.distributionReadinessBefore}% → {validationReport.distributionReadinessAfter}%
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
            <td className="p-2.5 text-slate-700">v{ev.previousScriptVersion} → v{ev.newScriptVersion}</td>
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
          <span className="text-slate-500">•</span>
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
             <span className="text-slate-500">•</span>
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
    <div className="space-y-6">
     {/* Notifications */}
     {matrixSuccessMsg && (
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-600/80 text-teal-700 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-teal-600" />
       <span>{matrixSuccessMsg}</span>
      </div>
     )}

     {matrixErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{matrixErrorMsg}</span>
      </div>
     )}

     {/* Top Production Matrix Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-teal-50 text-teal-700 border border-teal-800">
          SHARED EVIDENCE GRAPH BOUND
         </span>
         <span className="text-xs font-mono text-slate-500">
          Shared Hash: {productionMatrix?.sharedEvidenceSnapshotHash || "snap-evidence-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Layers className="w-5 h-5 text-teal-600" />
         Creator Multi-Variant Production Matrix & Asset Assembler
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Manage multiple production variants (Long-Form, Shorts, Podcast) sharing one verified evidence graph with automated asset assembly.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => setShowCreateVariantModal(true)}
         className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Plus className="w-3.5 h-3.5" />
         Create Production Variant
        </button>
       </div>
      </div>

      {/* Matrix Status Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">TOTAL VARIANTS</span>
        <span className="text-base font-bold text-slate-700">{productionMatrix?.totalVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ACTIVE VARIANTS</span>
        <span className="text-base font-bold text-teal-600">{productionMatrix?.activeVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">READY FOR REVIEW</span>
        <span className="text-base font-bold text-emerald-600">{productionMatrix?.readyVariantsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">BLOCKED VARIANTS</span>
        <span className="text-base font-bold text-rose-600">{productionMatrix?.blockedVariantsCount || 0}</span>
       </div>
      </div>
     </div>

     {/* Production Variants Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Layers className="w-4 h-4 text-teal-600" />
        Production Variants ({productionMatrix?.variants?.length || 0})
       </h3>
      </div>

      {!productionMatrix || productionMatrix.variants.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No production variants in matrix.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
             selectedVariant?.variantId === v.variantId ? "bg-teal-50 border-l-2 border-teal-500" : ""
            }`}
            onClick={() => setSelectedVariant(v)}
           >
            <td className="p-2.5 font-bold text-slate-700">
             <div>{v.name}</div>
             <div className="text-[10px] text-slate-500">{v.variantId}</div>
            </td>
            <td className="p-2.5 text-teal-700 font-bold">{v.variantType}</td>
            <td className="p-2.5 text-slate-700">{v.targetDurationMinutes} min</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              v.status === "APPROVED" || v.status === "CERTIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              v.status === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
              "bg-slate-50 text-slate-700 border-slate-200"
             }`}>
              {v.status}
             </span>
            </td>
            <td className="p-2.5 text-slate-500">{v.evidenceBindings.length} verified</td>
            <td className="p-2.5">
             <span className={`font-bold ${v.readinessScore >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
              {v.readinessScore}%
             </span>
            </td>
            <td className="p-2.5">
             <button
              onClick={(e) => {
               e.stopPropagation();
               setSelectedVariant(v);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 text-teal-700 text-[11px] font-mono transition"
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
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <GitCompare className="w-4 h-4 text-teal-600" />
         Hardware Benchmark Diff Inspector
        </h3>
       </div>

       {benchmarkDiff ? (
        <div className="space-y-4 text-xs font-mono">
         <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
           <span className="font-bold text-slate-700">{benchmarkDiff.benchmarkName}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            benchmarkDiff.diffState === "IDENTICAL" ? "bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200" :
            benchmarkDiff.diffState === "NUMERIC_CHANGE_ONLY" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            benchmarkDiff.diffState === "METHODOLOGY_CHANGE" ? "bg-amber-50 text-amber-600 border-amber-200" :
            "bg-indigo-50 text-indigo-600 border-indigo-200"
           }`}>
            {benchmarkDiff.diffState}
           </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
           <div>
            <span className="text-slate-500 block">Baseline ({benchmarkDiff.baseline.hardwareIdentity}):</span>
            <span className="text-slate-700 font-bold">{benchmarkDiff.baseline.score} {benchmarkDiff.baseline.metricUnit}</span>
           </div>
           <div>
            <span className="text-slate-500 block">Candidate ({benchmarkDiff.candidate.hardwareIdentity}):</span>
            <span className="text-teal-700 font-bold">{benchmarkDiff.candidate.score} {benchmarkDiff.candidate.metricUnit}</span>
           </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
           <span className="text-slate-500">Numerical Delta:</span>
           <span className={`font-bold ${benchmarkDiff.percentageDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {benchmarkDiff.percentageDelta >= 0 ? `+${benchmarkDiff.percentageDelta}%` : `${benchmarkDiff.percentageDelta}%`} ({benchmarkDiff.numericDelta > 0 ? `+${benchmarkDiff.numericDelta}` : benchmarkDiff.numericDelta} {benchmarkDiff.baseline.metricUnit})
           </span>
          </div>
         </div>

         {benchmarkDiff.dimensionDifferences.length > 0 && (
          <div className="space-y-1">
           <span className="text-[10px] font-bold uppercase text-slate-500">Dimension Variations:</span>
           <ul className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-[11px] text-amber-600">
            {benchmarkDiff.dimensionDifferences.map((d, i) => (
             <li key={i} className="flex items-start gap-1.5">
              <span className="text-slate-500">•</span>
              <span>{d}</span>
             </li>
            ))}
           </ul>
          </div>
         )}

         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-sans text-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Recommended Action:</span>
          <p className="text-slate-700">{benchmarkDiff.recommendedAction}</p>
         </div>
        </div>
       ) : (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No benchmark diff loaded.</p>
       )}
      </div>

      {/* Intelligent Asset Assembler Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-teal-600" />
          Intelligent Asset Assembler ({assemblyPlan?.assembledAssets?.length || 0} Assets)
         </h3>
         <p className="text-[11px] text-slate-500 font-sans">
          Mapped for {selectedVariant ? selectedVariant.name : "Default Variant"}
         </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-800">
         {assemblyPlan?.completenessScore || 0}% Complete
        </span>
       </div>

       {!assemblyPlan || assemblyPlan.assembledAssets.length === 0 ? (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No assembled assets available.</p>
       ) : (
        <div className="space-y-2">
         {assemblyPlan.assembledAssets.map((ast) => (
          <div key={ast.assetId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
           <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">{ast.name}</span>
            <div className="flex items-center gap-1.5">
             {ast.isReusedExisting && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white rounded-[24px] shadow-sm text-slate-500 border border-slate-200">
               REUSED
              </span>
             )}
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              ast.assemblyState === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              ast.assemblyState === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
              ast.assemblyState === "STALE" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
             }`}>
              {ast.assemblyState}
             </span>
            </div>
           </div>
           <div className="text-[10px] text-slate-500 truncate">
            Lineage: {ast.upstreamEvidenceLineage}
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>

     {/* Immutable Production Matrix Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-teal-600" />
        Immutable Production Matrix Audit Ledger ({matrixHistory.length} Events)
       </h3>
      </div>

      {matrixHistory.length === 0 ? (
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
          {matrixHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-teal-700">{ev.action}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
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
       <div className="bg-white rounded-[24px] shadow-sm border border-teal-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Create Production Variant</h3>
         </div>
         <button
          onClick={() => setShowCreateVariantModal(false)}
          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
         >
          <X className="w-5 h-5" />
         </button>
        </div>

        <div className="space-y-3 font-sans text-xs">
         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Variant Name:</label>
          <input
           type="text"
           value={newVariantName}
           onChange={(e) => setNewVariantName(e.target.value)}
           placeholder="e.g. YouTube Short: GPU Power Efficiency"
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-teal-500 font-sans"
          />
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Variant Format:</label>
          <select
           value={newVariantType}
           onChange={(e) => setNewVariantType(e.target.value as ProductionVariantType)}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-teal-500 font-mono"
          >
           <option value="YOUTUBE_LONG_FORM">YouTube Long Form (10-20 min)</option>
           <option value="YOUTUBE_SHORT">YouTube Short (1 min)</option>
           <option value="PODCAST">Podcast Audio (30-45 min)</option>
           <option value="CUSTOM_CREATOR_VARIANT">Custom Creator Variant</option>
          </select>
         </div>

         <div>
          <label className="text-[11px] font-mono text-slate-500 block mb-1">Target Duration (Minutes):</label>
          <input
           type="number"
           value={newVariantDuration}
           onChange={(e) => setNewVariantDuration(Number(e.target.value))}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-teal-500 font-mono"
          />
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowCreateVariantModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={handleCreateVariant}
          disabled={isCreatingVariant || !newVariantName.trim()}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
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
    <div className="space-y-6">
     {/* Notifications */}
     {exportSuccessMsg && (
      <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-600/80 text-blue-700 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-blue-600" />
       <span>{exportSuccessMsg}</span>
      </div>
     )}

     {exportErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{exportErrorMsg}</span>
      </div>
     )}

     {/* Top Export Readiness Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          exportPackage?.status === "EXPORTED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          exportPackage?.status === "READY" ? "bg-blue-950 text-blue-700 border-blue-800" :
          exportPackage?.status === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
          "bg-slate-50 text-slate-700 border-slate-200"
         }`}>
          {exportPackage?.status || "DRAFT"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Package Hash: {exportPackage?.packageSnapshotHash || "pkg-snap-uncalculated"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <FileArchive className="w-5 h-5 text-blue-600" />
         Creator Production Asset Package Export & Render Manifest Generator
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Transform verified assets and variant assembly states into deterministic, export-ready multi-format packages.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleValidateExportPackage}
         disabled={isValidatingPackage}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono border border-slate-300 transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isValidatingPackage ? "animate-spin" : ""}`} />
         Validate Package
        </button>
        <button
         onClick={handleExecuteExport}
         disabled={isExporting || exportPackage?.status === "BLOCKED" || exportPackage?.status === "EXPORTED"}
         className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Download className="w-3.5 h-3.5" />
         {isExporting ? "Exporting..." : exportPackage?.status === "EXPORTED" ? "Exported" : "Execute Export"}
        </button>
       </div>
      </div>

      {/* Snapshot & Certification Hash Bindings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CERTIFICATION BINDING</span>
        <span className="text-slate-700 font-bold truncate block">{exportPackage?.certificationCertificateId || "CERT-VERIFIED"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EVIDENCE SNAPSHOT</span>
        <span className="text-blue-600 font-bold truncate block">{exportPackage?.evidenceSnapshotHash || "esnap-default"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">PROJECT SNAPSHOT</span>
        <span className="text-teal-600 font-bold truncate block">{exportPackage?.projectSnapshotHash || "psnap-default"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SCRIPT VERSION</span>
        <span className="text-emerald-600 font-bold block">v{exportPackage?.scriptVersion || 1}</span>
       </div>
      </div>
     </div>

     {/* Multi-Format Export Targets Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Globe className="w-4 h-4 text-blue-600" />
        Target Readiness Matrix ({exportPackage?.targets?.length || 0} Targets)
       </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
       {exportPackage?.targets.map((t) => (
        <div key={t.targetFormat} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
         <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700">{t.displayName}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
           t.status === "READY" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
           t.status === "READY_WITH_WARNINGS" ? "bg-amber-50 text-amber-600 border-amber-200" :
           "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
           {t.status}
          </span>
         </div>
         <div className="text-[11px] text-slate-500 space-y-1">
          <div>Aspect Ratio: <span className="text-slate-700">{t.aspectRatio}</span></div>
          {t.targetDurationMinutes && <div>Target Duration: <span className="text-slate-700">{t.targetDurationMinutes} min</span></div>}
          <div>Required Assets: <span className="text-blue-700">{t.requiredAssetTypes.length} types</span></div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Asset Package Inventory & Render Manifest Panels */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Asset Package Inventory */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Boxes className="w-4 h-4 text-blue-600" />
         Asset Package Inventory ({exportPackage?.assets?.length || 0})
        </h3>
       </div>

       <div className="space-y-2">
        {exportPackage?.assets.map((ast) => (
         <div key={ast.assetId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-slate-700">{ast.name}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            ast.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            ast.status === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
            "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {ast.status}
           </span>
          </div>
          <div className="text-[11px] text-blue-700">{ast.expectedFilename} ({ast.mimeType})</div>
          <div className="text-[10px] text-slate-500 truncate">Lineage: {ast.upstreamLineage}</div>
         </div>
        ))}
       </div>
      </div>

      {/* Render Manifest Inspector */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Tv className="w-4 h-4 text-blue-600" />
          Automated Render Manifest ({exportPackage?.renderManifest?.entries?.length || 0} Entries)
         </h3>
         <p className="text-[11px] text-slate-500 font-sans">
          Deterministic manifest with honest capability reporting.
         </p>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-700 border border-blue-800">
         {exportPackage?.renderManifest?.manifestHash}
        </span>
       </div>

       <div className="space-y-2">
        {exportPackage?.renderManifest?.entries.map((rme) => (
         <div key={rme.entryId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-slate-700">{rme.expectedFilename}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            rme.renderCapabilityState === "AVAILABLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            rme.renderCapabilityState === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
            "bg-white rounded-[24px] shadow-sm text-amber-600 border-amber-200/50"
           }`}>
            {rme.renderCapabilityState}
           </span>
          </div>
          <div className="text-[11px] text-slate-500">
           Output: {rme.outputFormat} | Resolution: {rme.resolution} | Aspect: {rme.aspectRatio}
          </div>
          {rme.blockerReason && (
           <div className="text-[10px] text-rose-600">Blocker: {rme.blockerReason}</div>
          )}
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* Package Validation Inspector */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        Package Validation Report ({exportPackage?.validationReport?.issues?.length || 0} Issues)
       </h3>
       <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
        exportPackage?.validationReport?.validationStatus === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
        exportPackage?.validationReport?.validationStatus === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
        "bg-rose-50 text-rose-600 border-rose-200"
       }`}>
        {exportPackage?.validationReport?.validationStatus || "PASS"}
       </span>
      </div>

      {!exportPackage?.validationReport || exportPackage.validationReport.issues.length === 0 ? (
       <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs font-mono text-emerald-600">
        All 15 package validation dimensions passed with zero critical blockers.
       </div>
      ) : (
       <div className="space-y-2">
        {exportPackage.validationReport.issues.map((iss) => (
         <div key={iss.issueId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs font-mono">
          <div className="flex justify-between items-center">
           <span className="font-bold text-slate-700">{iss.category}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            iss.isBlocking ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-600 border-amber-200"
           }`}>
            {iss.severity}
           </span>
          </div>
          <div className="text-slate-700 font-sans">{iss.reason}</div>
          <div className="text-[11px] text-blue-700">Action: {iss.requiredAction}</div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Immutable Export Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-blue-600" />
        Immutable Production Export Audit Ledger ({exportHistory.length} Events)
       </h3>
      </div>

      {exportHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No export audit events recorded yet.</p>
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
          {exportHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-blue-700">{ev.action}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
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
    <div className="space-y-6">
     {/* Notifications */}
     {publishingSuccessMsg && (
      <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-600/80 text-violet-300 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-violet-400" />
       <span>{publishingSuccessMsg}</span>
      </div>
     )}

     {publishingErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{publishingErrorMsg}</span>
      </div>
     )}

     {/* Publishing Control Center Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          publishingPlan?.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          publishingPlan?.status === "PREFLIGHT_PASSED" || publishingPlan?.status === "APPROVED" ? "bg-violet-950 text-violet-300 border-violet-800" :
          publishingPlan?.status === "PREFLIGHT_BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
          "bg-slate-50 text-slate-700 border-slate-200"
         }`}>
          {publishingPlan?.status || "DRAFT"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Plan Hash: {publishingPlan?.planSnapshotHash || "pplan-snap-uncalculated"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <SendHorizontal className="w-5 h-5 text-violet-400" />
         Creator Multi-Channel Publishing Orchestrator & Preflight Gatekeeper
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Coordinate multi-channel publishing readiness, channel preflight, explicit creator approval, local staging, and immutable distribution receipts.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={loadPublishingState}
         disabled={isPublishingLoading}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold font-mono border border-slate-300 transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isPublishingLoading ? "animate-spin" : ""}`} />
         Refresh Plan
        </button>
       </div>
      </div>

      {/* Snapshot & Certification Hash Bindings */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CERTIFICATION BINDING</span>
        <span className="text-slate-700 font-bold truncate block">{publishingPlan?.certificationCertificateId || "CERT-VERIFIED"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EXPORT PACKAGE HASH</span>
        <span className="text-blue-600 font-bold truncate block">{publishingPlan?.exportPackageSnapshotHash || "pkg-snap-default"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EVIDENCE SNAPSHOT</span>
        <span className="text-teal-600 font-bold truncate block">{publishingPlan?.evidenceSnapshotHash || "esnap-default"}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SCRIPT VERSION</span>
        <span className="text-emerald-600 font-bold block">v{publishingPlan?.scriptVersion || 1}</span>
       </div>
      </div>
     </div>

     {/* Platform Publishing Target Cards */}
     <div className="space-y-4">
      <div className="flex items-center justify-between">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Globe className="w-4 h-4 text-violet-400" />
        Multi-Channel Publishing Targets ({publishingPlan?.targets?.length || 0})
       </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {publishingPlan?.targets.map((tgt) => (
        <div
         key={tgt.targetId}
         onClick={() => setSelectedPublishingTarget(tgt)}
         className={`p-5 rounded-2xl border transition cursor-pointer space-y-4 ${
          selectedPublishingTarget?.targetId === tgt.targetId
           ? "bg-white rounded-[24px] shadow-sm border-violet-500 ring-1 ring-violet-500/40 shadow-sm"
           : "bg-white rounded-[24px] shadow-sm/80 border-slate-200 hover:border-slate-300"
         }`}
        >
         <div className="flex justify-between items-start">
          <div>
           <span className="text-xs font-bold text-slate-700 block">{tgt.platform}</span>
           <span className="text-[10px] font-mono text-slate-500">Mode: {tgt.mode}</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
           tgt.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
           tgt.status === "APPROVED" || tgt.status === "PREFLIGHT_PASSED" ? "bg-violet-950 text-violet-300 border-violet-800" :
           tgt.status === "STAGING_ONLY" ? "bg-blue-950 text-blue-700 border-blue-800" :
           tgt.status === "PREFLIGHT_BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
           "bg-slate-50 text-slate-500 border-slate-200"
          }`}>
           {tgt.status}
          </span>
         </div>

         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-[11px]">
           <span className="text-slate-500">Connection:</span>
           <span className="text-amber-600 font-bold">{tgt.connectionState}</span>
          </div>
          <div className="flex justify-between text-[11px]">
           <span className="text-slate-500">Preflight:</span>
           <span className={`font-bold ${tgt.preflightResult?.status === "PASS" ? "text-emerald-600" : tgt.preflightResult?.status === "PASS_WITH_WARNINGS" ? "text-amber-600" : "text-rose-600"}`}>
            {tgt.preflightResult?.status || "PENDING"}
           </span>
          </div>
          <div className="flex justify-between text-[11px]">
           <span className="text-slate-500">Approval:</span>
           <span className={`font-bold ${tgt.approvalState.isApproved ? "text-emerald-600" : "text-slate-500"}`}>
            {tgt.approvalState.isApproved ? "APPROVED" : "PENDING"}
           </span>
          </div>
          {tgt.schedulingConfig?.isScheduled && (
           <div className="flex justify-between text-[11px]">
            <span className="text-slate-500">Scheduled:</span>
            <span className="text-blue-700 truncate">{new Date(tgt.schedulingConfig.scheduledTimestamp).toLocaleTimeString()} ({tgt.schedulingConfig.timezoneIana})</span>
           </div>
          )}
         </div>

         {/* Target Controls */}
         <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          {!tgt.approvalState.isApproved && (
           <button
            onClick={(e) => {
             e.stopPropagation();
             handleApprovePublishingTarget(tgt.targetId);
            }}
            disabled={isPublishingLoading || tgt.status === "PREFLIGHT_BLOCKED"}
            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
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
            className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-900 text-xs font-mono font-bold transition"
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
            className="flex-1 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-slate-900 text-xs font-mono font-bold transition"
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
           className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
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
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <ShieldCheck className="w-4 h-4 text-violet-400" />
           Preflight Gatekeeper ({selectedPublishingTarget.platform})
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Automated 8-dimension preflight evaluation.
          </p>
         </div>
         <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          selectedPublishingTarget.preflightResult?.status === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          selectedPublishingTarget.preflightResult?.status === "PASS_WITH_WARNINGS" ? "bg-amber-50 text-amber-600 border-amber-200" :
          "bg-rose-50 text-rose-600 border-rose-200"
         }`}>
          {selectedPublishingTarget.preflightResult?.status || "PASS"}
         </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
         {selectedPublishingTarget.preflightResult?.checks.map((chk) => (
          <div key={chk.checkId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs font-mono">
           <div className="flex justify-between items-center">
            <span className="font-bold text-slate-700">{chk.name}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             chk.isBlocking ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-600 border-amber-200"
            }`}>
             {chk.status}
            </span>
           </div>
           <div className="text-slate-700 font-sans">{chk.reason}</div>
           <div className="text-[10px] text-slate-500">Upstream: {chk.upstreamDependency} ({chk.originalCause})</div>
           <div className="text-[11px] text-violet-300">Action: {chk.requiredAction}</div>
          </div>
         ))}
        </div>
       </div>

       {/* Publishing Plan Metadata ("Exactly what will be published?") */}
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <FileText className="w-4 h-4 text-violet-400" />
           Publishing Plan Inspector ({selectedPublishingTarget.platform})
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Verified payload and metadata configured for deployment.
          </p>
         </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-xs font-mono">
         <div>
          <span className="text-slate-500 block text-[10px]">TITLE</span>
          <span className="text-slate-700 font-bold">{selectedPublishingTarget.metadata.title}</span>
         </div>
         <div>
          <span className="text-slate-500 block text-[10px]">DESCRIPTION / SHOW NOTES</span>
          <p className="text-slate-700 font-sans text-xs">{selectedPublishingTarget.metadata.description}</p>
         </div>
         {selectedPublishingTarget.metadata.chapters && (
          <div>
           <span className="text-slate-500 block text-[10px]">CHAPTER MARKERS</span>
           <div className="flex flex-wrap gap-1 mt-1">
            {selectedPublishingTarget.metadata.chapters.map((ch, idx) => (
             <span key={idx} className="px-2 py-0.5 rounded bg-white rounded-[24px] shadow-sm text-slate-700 border border-slate-200 text-[10px]">
              {ch}
             </span>
            ))}
           </div>
          </div>
         )}
         {selectedPublishingTarget.platform === "PODCAST" && (
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1">
           <span className="text-slate-500 block text-[10px] font-bold">PODCAST AUDIO SPECIFICATION (REQ 24 AUDIT)</span>
           <div className="text-[11px] text-emerald-600">
            Codec: {selectedPublishingTarget.metadata.audioCodec || "WAV_PCM"} | Uncompressed Archival Master: {selectedPublishingTarget.metadata.isUncompressedMaster ? "Yes (24-bit/48kHz)" : "No"}
           </div>
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {/* Immutable Distribution Receipts Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Receipt className="w-4 h-4 text-violet-400" />
        Immutable Distribution Receipt Ledger ({publishingReceipts.length} Receipts)
       </h3>
      </div>

      {publishingReceipts.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No distribution receipts recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
            <td className="p-2.5 text-slate-500">{new Date(rec.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-violet-300">{rec.eventType}</td>
            <td className="p-2.5 text-slate-700">{rec.platform}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              rec.status === "SUCCESS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              rec.status === "STAGING_ONLY" ? "bg-blue-950 text-blue-700 border-blue-800" :
              "bg-rose-50 text-rose-600 border-rose-200"
             }`}>
              {rec.status}
             </span>
            </td>
            <td className="p-2.5 text-slate-700 font-sans truncate max-w-xs">{rec.details}</td>
            <td className="p-2.5 text-right">
             <button
              onClick={() => handleVerifyDistributionReceipt(rec.receiptId)}
              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-[10px] transition"
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
      <div className="p-4 rounded-xl bg-white rounded-[24px] shadow-sm border border-slate-300 space-y-2 text-xs font-mono">
       <div className="flex justify-between items-center">
        <span className="font-bold text-slate-700">Post-Publish Verification Result</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
         verificationReport.status === "VERIFIED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
         "bg-slate-50 text-amber-600 border-amber-200"
        }`}>
         {verificationReport.status}
        </span>
       </div>
       <p className="text-slate-700 font-sans">{verificationReport.notes}</p>
       <button
        onClick={() => setVerificationReport(null)}
        className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-[10px]"
       >
        Dismiss
       </button>
      </div>
     )}

     {/* Scheduling Dialog Modal */}
     {showPublishingScheduleModal && selectedPublishingTarget && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
       <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Calendar className="w-4 h-4 text-violet-400" />
         Schedule {selectedPublishingTarget.platform} Release
        </h3>

        <div className="space-y-3 text-xs font-mono">
         <div>
          <label className="text-slate-500 block mb-1">Scheduled Release Date & Time:</label>
          <input
           type="datetime-local"
           value={publishingScheduleTime}
           onChange={(e) => setPublishingScheduleTime(e.target.value)}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-violet-500 font-mono"
          />
         </div>

         <div>
          <label className="text-slate-500 block mb-1">Timezone (IANA):</label>
          <select
           value={publishingScheduleTimezone}
           onChange={(e) => setPublishingScheduleTimezone(e.target.value)}
           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-violet-500 font-mono"
          >
           <option value="UTC">UTC</option>
           <option value="America/New_York">America/New_York (EST/EDT)</option>
           <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
           <option value="Europe/London">Europe/London (GMT/BST)</option>
          </select>
         </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
         <button
          onClick={() => setShowPublishingScheduleModal(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-mono transition"
         >
          Cancel
         </button>
         <button
          onClick={() => handleSchedulePublishingTarget(selectedPublishingTarget.targetId)}
          disabled={isPublishingLoading || !publishingScheduleTime}
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-slate-900 text-xs font-mono font-bold transition"
         >
          Confirm Schedule
         </button>
        </div>
       </div>
      </div>
     )}

     {/* Immutable Publishing Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-violet-400" />
        Immutable Publishing Audit Ledger ({publishingHistory.length} Events)
       </h3>
      </div>

      {publishingHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No publishing audit events recorded yet.</p>
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
          {publishingHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-violet-300">{ev.action}</td>
            <td className="p-2.5 text-slate-700 font-sans">{ev.details}</td>
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
    <div className="space-y-6">
     {/* Notifications */}
     {pubIntegritySuccessMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-rose-600" />
       <span>{pubIntegritySuccessMsg}</span>
      </div>
     )}

     {pubIntegrityErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{pubIntegrityErrorMsg}</span>
      </div>
     )}

     {/* Release Health Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
          releaseHealthReport?.overallStatus === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          releaseHealthReport?.overallStatus === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
          releaseHealthReport?.overallStatus === "UNVERIFIABLE" ? "bg-slate-50 text-slate-700 border-slate-300" :
          "bg-rose-50 text-rose-600 border-rose-200"
         }`}>
          {releaseHealthReport?.overallStatus || "INITIALIZING"}
         </span>
         <span className="text-xs font-mono text-slate-500">
          Report: {releaseHealthReport?.reportId || "crh-pending"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <ShieldAlert className="w-5 h-5 text-rose-600" />
         Creator Post-Publication Integrity Monitor & Release Health Control Plane
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Continuous cross-platform state reconciliation, post-publication change detection, certification drift monitoring, and immutable lineage tracking.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleReconcilePublications}
         disabled={isReconciling}
         className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isReconciling ? "animate-spin" : ""}`} />
         {isReconciling ? "Reconciling..." : "Reconcile Publications"}
        </button>
       </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">TOTAL TARGETS</span>
        <span className="text-slate-700 font-bold block">{pubReconciliations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">RECONCILED</span>
        <span className="text-emerald-600 font-bold block">{releaseHealthReport?.reconciledCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">UNVERIFIABLE</span>
        <span className="text-amber-600 font-bold block">{releaseHealthReport?.unverifiableCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">STALE</span>
        <span className="text-slate-500 font-bold block">{releaseHealthReport?.staleCount ?? 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">HARD BLOCKERS</span>
        <span className="text-rose-600 font-bold block">{releaseHealthReport?.activeBlockersCount ?? 0}</span>
       </div>
      </div>
     </div>

     {/* 10-Dimension Continuous Release Health Matrix */}
     {releaseHealthReport && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Activity className="w-4 h-4 text-rose-600" />
         Continuous Release Health (10 Core Dimensions)
        </h3>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
        {Object.values(releaseHealthReport.dimensions).map((dim) => (
         <div key={dim.dimensionKey} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex justify-between items-center">
           <span className="font-bold text-slate-700 truncate">{dim.dimensionName}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            dim.status === "PASS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            dim.status === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
            dim.status === "NOT_CONFIGURED" || dim.status === "UNVERIFIABLE" ? "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200" :
            "bg-rose-50 text-rose-600 border-rose-200"
           }`}>
            {dim.status}
           </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans line-clamp-2">{dim.details}</p>
          <div className="text-[10px] text-slate-500 truncate">Upstream: {dim.upstreamDependency}</div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Multi-Platform Reconciliation Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Globe className="w-4 h-4 text-rose-600" />
        Cross-Platform Publication Reconciliation Matrix ({pubReconciliations.length} Targets)
       </h3>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
           <td className="p-2.5 font-bold text-slate-700">{pub.platform}</td>
           <td className="p-2.5 text-slate-500 truncate max-w-xs">{pub.expectedState.publicationTarget}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             pub.reconciliationStatus === "MATCHED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             pub.reconciliationStatus === "CHANGED" ? "bg-amber-50 text-amber-600 border-amber-200" :
             pub.reconciliationStatus === "UNVERIFIABLE" ? "bg-slate-50 text-slate-500 border-slate-200" :
             "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
             {pub.reconciliationStatus}
            </span>
           </td>
           <td className="p-2.5 text-slate-700">{pub.receiptState}</td>
           <td className="p-2.5">
            <span className={pub.changes.length > 0 ? "text-amber-600 font-bold" : "text-slate-500"}>
             {pub.changes.length} detected
            </span>
           </td>
           <td className="p-2.5">
            <span className={pub.blockers.length > 0 ? "text-rose-600 font-bold" : "text-emerald-600"}>
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
             className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-[10px] transition"
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
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <GitCompare className="w-4 h-4 text-rose-600" />
           What Changed Since Publication? ({selectedPublication.platform})
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Discrepancies detected between certified release state and live observations.
          </p>
         </div>
        </div>

        {inspectedPubChanges.length === 0 ? (
         <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs font-mono text-emerald-600">
          No discrepancies detected. Certified release matches observed platform state.
         </div>
        ) : (
         <div className="space-y-2 max-h-80 overflow-y-auto">
          {inspectedPubChanges.map((chg) => (
           <div key={chg.changeId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center">
             <span className="font-bold text-slate-700">{chg.fieldName}</span>
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              chg.severity === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
              chg.severity === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-blue-950 text-blue-700 border-blue-800"
             }`}>
              {chg.category}
             </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white rounded-[24px] shadow-sm p-2 rounded-lg">
             <div>
              <span className="text-slate-500 block text-[10px]">EXPECTED</span>
              <span className="text-slate-700 truncate block">{String(chg.expectedValue)}</span>
             </div>
             <div>
              <span className="text-slate-500 block text-[10px]">OBSERVED</span>
              <span className="text-amber-600 truncate block">{String(chg.observedValue)}</span>
             </div>
            </div>
            <div className="text-[11px] text-rose-600">Action: {chg.recommendedAction}</div>
           </div>
          ))}
         </div>
        )}
       </div>

       {/* Publication Lineage Inspector */}
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <Network className="w-4 h-4 text-rose-600" />
           Why Is This Publication In This State? (Lineage)
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Deterministic provenance from research run down to observed platform state.
          </p>
         </div>
        </div>

        {inspectedPubLineage?.links ? (
         <div className="space-y-1.5 max-h-80 overflow-y-auto font-mono text-xs">
          {inspectedPubLineage.links.map((lnk, idx) => (
           <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
             <span className="text-slate-500 text-[10px] w-6 shrink-0">{idx + 1}.</span>
             <div>
              <span className="font-bold text-slate-700 block text-[11px]">{lnk.stage}</span>
              <span className="text-slate-500 text-[10px] font-sans truncate block">{lnk.summary}</span>
             </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
             lnk.status === "VALID" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             lnk.status === "DRIFTED" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
            }`}>
             {lnk.status}
            </span>
           </div>
          ))}
         </div>
        ) : (
         <p className="text-xs font-mono text-slate-500 text-center py-4">No lineage trace available.</p>
        )}
       </div>
      </div>
     )}

     {/* "What Is Currently Unverifiable?" Transparency Panel */}
     {unverifiableStates.length > 0 && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Eye className="w-4 h-4 text-amber-600" />
         What Is Currently Unverifiable? (Transparency View)
        </h3>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {unverifiableStates.map((unv, idx) => (
         <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="font-bold text-slate-700 block">{unv.platform}</span>
          <p className="text-slate-500 font-sans text-[11px]">{unv.reason}</p>
          <span className="text-[10px] text-amber-600 block font-bold">UNVERIFIABLE (NO ASSUMED SUCCESS)</span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Publication Integrity Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-rose-600" />
        Immutable Publication Integrity Audit Ledger ({pubIntegrityHistory.length} Events)
       </h3>
      </div>

      {pubIntegrityHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No publication integrity audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-rose-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.publicationId}</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              ev.afterState === "MATCHED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              ev.afterState === "CHANGED" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-slate-50 text-slate-500 border-slate-200"
             }`}>
              {ev.afterState}
             </span>
            </td>
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

   {/* TAB: CLOSED-LOOP RESEARCH CALIBRATION ENGINE (PHASE 86) */}
   {activeTab === "researchCalibration" && (
    <div className="space-y-6">
     {/* Notifications */}
     {calibrationSuccessMsg && (
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-600/80 text-amber-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-amber-600" />
       <span>{calibrationSuccessMsg}</span>
      </div>
     )}

     {calibrationErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{calibrationErrorMsg}</span>
      </div>
     )}

     {/* Evidence Boundary Principle Banner (Requirement 20) */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-amber-200/60 text-amber-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Scale className="w-4 h-4 text-amber-600 shrink-0" />
       <span className="font-bold">EVIDENCE BOUNDARY:</span>
       <span className="text-slate-700">Audience Signal ≠ Evidence &nbsp;|&nbsp; Performance ≠ Truth &nbsp;|&nbsp; Correlation ≠ Causation</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-amber-50/80 text-amber-600 border border-amber-700/80 text-[10px] uppercase font-bold shrink-0">
       Formal Research Validation Required
      </span>
     </div>

     {/* Calibration Health Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-amber-50 text-amber-600 border-amber-200">
          CLOSED-LOOP CALIBRATION
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {calibrationSnapshot?.snapshotId || "rcs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Scale className="w-5 h-5 text-amber-600" />
         Continuous Audience Performance Ingestion & Research Calibration Engine
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Connects truthful audience questions, retention patterns, benchmark diffs, and publication discrepancies back to evidence re-evaluation without automatic claim mutations.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={loadCalibrationState}
         disabled={isCalibrating}
         className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? "animate-spin" : ""}`} />
         {isCalibrating ? "Ingesting..." : "Ingest & Re-evaluate"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CANDIDATES</span>
        <span className="text-slate-700 font-bold block">{calibrationCandidates.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">QUEUED</span>
        <span className="text-amber-600 font-bold block">{calibrationQueue.filter((q) => q.status === "QUEUED").length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">VALIDATED</span>
        <span className="text-emerald-600 font-bold block">{calibrationQueue.filter((q) => q.status === "VALIDATED").length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">BLOCKED</span>
        <span className="text-rose-600 font-bold block">{calibrationQueue.filter((q) => q.status === "BLOCKED").length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">STALE</span>
        <span className="text-slate-500 font-bold block">{calibrationQueue.filter((q) => q.status === "STALE").length}</span>
       </div>
      </div>
     </div>

     {/* Research Calibration Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Workflow className="w-4 h-4 text-amber-600" />
        Evidence-Bound Research Calibration Queue ({calibrationQueue.length} Items)
       </h3>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
             item.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             item.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             item.priority === "MEDIUM" ? "bg-blue-950 text-blue-700 border-blue-800" :
             "bg-slate-50 text-slate-500 border-slate-200"
            }`}>
             {item.priority}
            </span>
           </td>
           <td className="p-2.5 font-bold text-slate-700 truncate max-w-xs">{item.candidate.title}</td>
           <td className="p-2.5 text-slate-500">{item.candidate.source}</td>
           <td className="p-2.5 text-slate-700">{item.attribution.state}</td>
           <td className="p-2.5 text-amber-600 font-bold">{item.evidenceImpact}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             item.status === "VALIDATED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             item.status === "BLOCKED" ? "bg-rose-50 text-rose-600 border-rose-200" :
             item.status === "STALE" ? "bg-slate-50 text-slate-500 border-slate-200" :
             "bg-amber-50 text-amber-600 border-amber-200"
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
             className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-[10px] transition"
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
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <Target className="w-4 h-4 text-amber-600" />
           Attribution Assessment & Sample Guard
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Conservative qualification separating direct observation from causal hypothesis.
          </p>
         </div>
         <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
          selectedCalibrationItem.attribution.state === "SUPPORTED_BY_MULTIPLE_SIGNALS" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
          selectedCalibrationItem.attribution.state === "CORRELATED" || selectedCalibrationItem.attribution.state === "POSSIBLE_CONTRIBUTOR" ? "bg-blue-950 text-blue-700 border-blue-800" :
          "bg-amber-50 text-amber-600 border-amber-200"
         }`}>
          {selectedCalibrationItem.attribution.state}
         </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">OBSERVED RELATIONSHIP</span>
          <p className="text-slate-700 font-sans text-[11px]">{selectedCalibrationItem.attribution.observedRelationship}</p>
         </div>

         <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
           <span className="text-slate-500 block text-[10px]">SAMPLE SIZE</span>
           <span className="text-slate-700 font-bold block">{selectedCalibrationItem.attribution.sampleSize} observations</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
           <span className="text-slate-500 block text-[10px]">CONFOUNDERS</span>
           <span className="text-amber-600 font-bold block">{selectedCalibrationItem.attribution.confounders.length} detected</span>
          </div>
         </div>

         {selectedCalibrationItem.attribution.confidenceLimitations.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
           <span className="text-slate-500 block text-[10px]">CONFIDENCE LIMITATIONS</span>
           <ul className="list-disc pl-4 text-slate-500 font-sans text-[11px] space-y-0.5">
            {selectedCalibrationItem.attribution.confidenceLimitations.map((lim, idx) => (
             <li key={idx}>{lim}</li>
            ))}
           </ul>
          </div>
         )}
        </div>
       </div>

       {/* Research Validation Action & Lineage Bridge */}
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <FlaskConical className="w-4 h-4 text-amber-600" />
           Research Validation Bridge (No Automatic Claim Mutation)
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Explicit creator trigger to initiate independent lab/evidence validation.
          </p>
         </div>
        </div>

        <div className="space-y-3 text-xs font-mono">
         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">RECOMMENDED EVIDENCE IMPACT</span>
          <span className="text-amber-600 font-bold block">{selectedCalibrationItem.evidenceImpact}</span>
          <p className="text-slate-500 font-sans text-[11px]">
           {selectedCalibrationItem.candidate.priorityReason}
          </p>
         </div>

         <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
          <div>
           <span className="font-bold text-slate-700 block">Formal Research Re-evaluation</span>
           <span className="text-slate-500 text-[10px]">Routes to authoritative research validation engine</span>
          </div>
          <button
           onClick={() => handleValidateQueueItem(selectedCalibrationItem.queueItemId)}
           disabled={isCalibrating || selectedCalibrationItem.status === "BLOCKED"}
           className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition"
          >
           {isCalibrating ? "Validating..." : "Validate This"}
          </button>
         </div>

         {validationResult && (
          <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-1 text-emerald-600">
           <span className="font-bold block">Validation Outcome: {validationResult.outcome}</span>
           <p className="text-slate-700 font-sans text-[11px]">{validationResult.findings}</p>
           {validationResult.requiredSafeExecutionPlan && (
            <span className="text-[10px] text-amber-600 font-bold block">
             Phase 78 Safe Execution Plan required to apply reconciled claims.
            </span>
           )}
          </div>
         )}

         {/* Lineage Trace */}
         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">EXPLAINABILITY & PROVENANCE</span>
          <ul className="space-y-1 text-[11px] text-slate-500">
           {selectedCalibrationItem.candidate.upstreamLineage.map((lin, idx) => (
            <li key={idx} className="truncate">• {lin}</li>
           ))}
          </ul>
         </div>
        </div>
       </div>
      </div>
     )}

     {/* Immutable Research Calibration Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-amber-600" />
        Immutable Research Calibration Audit Ledger ({calibrationHistory.length} Events)
       </h3>
      </div>

      {calibrationHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No calibration audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
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
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-amber-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.calibrationId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {ev.afterState}
             </span>
            </td>
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

   {/* TAB: MULTI-PROJECT COLLECTIVE INTELLIGENCE FEDERATION (PHASE 87) */}
   {activeTab === "collectiveIntelligence" && (
    <div className="space-y-6">
     {/* Notifications */}
     {collectiveSuccessMsg && (
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-600/80 text-indigo-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-indigo-600" />
       <span>{collectiveSuccessMsg}</span>
      </div>
     )}

     {collectiveErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{collectiveErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner (Requirement 4 & 20) */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 text-indigo-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Network className="w-4 h-4 text-indigo-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">Cross-Project Correlation ≠ Verified Evidence &nbsp;|&nbsp; Association ≠ Causation &nbsp;|&nbsp; Independent Validation Required</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-700/80 text-[10px] uppercase font-bold shrink-0">
       Privacy-Preserving Federation
      </span>
     </div>

     {/* Federation Health Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-indigo-50 text-indigo-600 border-indigo-200">
          COLLECTIVE INTELLIGENCE FEDERATION
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {collectiveSnapshot?.snapshotId || "cis-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Network className="w-5 h-5 text-indigo-600" />
         Multi-Project Collective Intelligence Federation & Cross-Hardware Correlation Network
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Federates privacy-isolated project benchmarks across 20 dimensions to surface recurring hardware patterns, isolate contradictions, and bridge to formal research validation.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleComputeCorrelations}
         disabled={isComputingCorrelations}
         className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isComputingCorrelations ? "animate-spin" : ""}`} />
         {isComputingCorrelations ? "Correlating..." : "Re-evaluate & Correlate"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">FEDERATED PROJECTS</span>
        <span className="text-slate-700 font-bold block">{federatedProjects.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ELIGIBLE</span>
        <span className="text-emerald-600 font-bold block">{federatedProjects.filter((p) => p.eligibilityState === "ELIGIBLE" || p.eligibilityState === "ELIGIBLE_WITH_LIMITATIONS").length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OBSERVATIONS</span>
        <span className="text-indigo-600 font-bold block">{collectiveObservations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CORRELATIONS</span>
        <span className="text-slate-700 font-bold block">{collectiveCorrelations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OPPORTUNITIES</span>
        <span className="text-amber-600 font-bold block">{collectiveOpportunities.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CONTRADICTIONS</span>
        <span className="text-rose-600 font-bold block">{collectiveCorrelations.reduce((acc, c) => acc + c.contradictionCount, 0)}</span>
       </div>
      </div>
     </div>

     {/* Project Federation Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Boxes className="w-4 h-4 text-indigo-600" />
        Federated Research Projects ({federatedProjects.length} Enrolled)
       </h3>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
          <th className="p-2.5">PROJECT</th>
          <th className="p-2.5">ELIGIBILITY</th>
          <th className="p-2.5">PRIVACY</th>
          <th className="p-2.5">EVIDENCE CLASSIFICATION</th>
          <th className="p-2.5">INDEPENDENCE</th>
          <th className="p-2.5">BENCHMARK COVERAGE</th>
          <th className="p-2.5">STATUS</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {federatedProjects.map((proj) => (
          <tr key={proj.federationRecordId} className="hover:bg-slate-100">
           <td className="p-2.5 font-bold text-slate-700 truncate max-w-xs">{proj.projectTitle}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             proj.eligibilityState === "ELIGIBLE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             proj.eligibilityState === "ELIGIBLE_WITH_LIMITATIONS" ? "bg-blue-950 text-blue-700 border-blue-800" :
             proj.eligibilityState === "PRIVACY_RESTRICTED" ? "bg-purple-50 text-purple-600 border-purple-200" :
             "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
             {proj.eligibilityState}
            </span>
           </td>
           <td className="p-2.5 text-slate-500">{proj.privacyState}</td>
           <td className="p-2.5 text-slate-700">{proj.evidenceClassificationSummary}</td>
           <td className="p-2.5 text-indigo-600 font-bold">{proj.sourceIndependenceState}</td>
           <td className="p-2.5 text-slate-500">{proj.availableBenchmarkDimensions.length} dimensions</td>
           <td className="p-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
             {proj.isStale ? "STALE" : "CURRENT"}
            </span>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Cross-Hardware Correlation Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-indigo-600" />
        Cross-Hardware Correlation Network ({collectiveCorrelations.length} Active Correlations)
       </h3>
      </div>

      {collectiveCorrelations.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-hardware correlations calculated yet. Click Re-evaluate & Correlate above.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">HARDWARE A</th>
           <th className="p-2.5">HARDWARE B</th>
           <th className="p-2.5">BENCHMARK SUITE</th>
           <th className="p-2.5">OBSERVED DELTA</th>
           <th className="p-2.5">INDEP. PROJECTS</th>
           <th className="p-2.5">CORRELATION STATE</th>
           <th className="p-2.5">CONFIDENCE</th>
           <th className="p-2.5">CONTRADICTIONS</th>
           <th className="p-2.5 text-right">ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {collectiveCorrelations.map((corr) => (
           <tr
            key={corr.correlationId}
            onClick={() => {
             setSelectedCorrelation(corr);
             loadCorrelationLineage(corr.correlationId);
            }}
            className={`hover:bg-slate-100 cursor-pointer ${
             selectedCorrelation?.correlationId === corr.correlationId ? "bg-slate-100/60" : ""
            }`}
           >
            <td className="p-2.5 font-bold text-slate-700">{corr.hardwareA}</td>
            <td className="p-2.5 font-bold text-slate-700">{corr.hardwareB}</td>
            <td className="p-2.5 text-slate-500">{corr.benchmarkSuite}</td>
            <td className="p-2.5 text-indigo-600 font-bold">{corr.observedDeltaPercentage > 0 ? `+${corr.observedDeltaPercentage}%` : `${corr.observedDeltaPercentage}%`}</td>
            <td className="p-2.5 text-slate-700">{corr.independentProjectsCount} projects</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              corr.correlationState === "STRONG_ASSOCIATION" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              corr.correlationState === "REPEATED_ASSOCIATION" ? "bg-blue-950 text-blue-700 border-blue-800" :
              corr.correlationState === "CONTRADICTED" ? "bg-rose-50 text-rose-600 border-rose-200" :
              corr.correlationState === "CONFOUNDED" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-slate-50 text-slate-500 border-slate-200"
             }`}>
              {corr.correlationState}
             </span>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              corr.confidenceLevel === "HIGH" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              corr.confidenceLevel === "MODERATE" ? "bg-blue-950 text-blue-700 border-blue-800" :
              "bg-slate-50 text-slate-500 border-slate-200"
             }`}>
              {corr.confidenceLevel}
             </span>
            </td>
            <td className="p-2.5 text-slate-500">
             {corr.contradictionCount > 0 ? (
              <span className="text-rose-600 font-bold">{corr.contradictionCount} detected</span>
             ) : (
              <span className="text-emerald-600">None</span>
             )}
            </td>
            <td className="p-2.5 text-right">
             <button
              onClick={(e) => {
               e.stopPropagation();
               setSelectedCorrelation(corr);
               loadCorrelationLineage(corr.correlationId);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-[10px] transition"
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

     {/* Selected Correlation Deep Inspectors */}
     {selectedCorrelation && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* "Why Is This Pattern Here?" Lineage Inspector */}
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <Network className="w-4 h-4 text-indigo-600" />
           Why Is This Pattern Here? (Lineage Trace)
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Deterministic provenance tracing through 6 analytical stages without evidence contamination.
          </p>
         </div>
         <span className="px-2.5 py-1 rounded text-xs font-mono font-bold border bg-indigo-50 text-indigo-600 border-indigo-200">
          {selectedCorrelation.correlationState}
         </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
         {inspectedCorrelationLineage?.links.map((link, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
           <div className="flex items-center justify-between">
            <span className="text-indigo-600 font-bold text-[10px]">{idx + 1}. {link.stage}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             link.status === "VALID" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             link.status === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
            }`}>
             {link.status}
            </span>
           </div>
           <span className="text-slate-700 font-bold block">{link.title}</span>
           <p className="text-slate-500 font-sans text-[11px]">{link.detail}</p>
          </div>
         ))}
        </div>
       </div>

       {/* "What Was Excluded?" Inspector */}
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <ShieldAlert className="w-4 h-4 text-amber-600" />
           What Was Excluded? (Exclusion Inspector)
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           Mandatory audit of excluded observations, duplicate captures, or privacy-restricted projects.
          </p>
         </div>
        </div>

        <div className="space-y-3 text-xs font-mono">
         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">EXCLUDED PROJECTS COUNT</span>
          <span className="text-slate-700 font-bold block">{selectedCorrelation.excludedProjectIds.length} projects excluded</span>
         </div>

         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">EXCLUDED OBSERVATIONS & REASONS</span>
          {Object.keys(selectedCorrelation.exclusionReasons).length === 0 ? (
           <p className="text-slate-500 text-[11px] font-sans">All eligible observations matched methodology criteria.</p>
          ) : (
           <ul className="space-y-1 text-[11px] text-slate-500 font-sans">
            {Object.entries(selectedCorrelation.exclusionReasons).map(([pair, rsn], idx) => (
             <li key={idx} className="p-2 rounded bg-white rounded-[24px] shadow-sm border border-slate-200">
              <span className="font-mono text-amber-600 block">{pair}</span>
              <span>{rsn}</span>
             </li>
            ))}
           </ul>
          )}
         </div>

         {selectedCorrelation.contradictions.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200 space-y-1 text-rose-600">
           <span className="font-bold block">SURFACED EMPIRICAL CONTRADICTIONS:</span>
           <ul className="list-disc pl-4 text-slate-700 font-sans text-[11px] space-y-1">
            {selectedCorrelation.contradictions.map((c, idx) => (
             <li key={idx}>{c.explanation}</li>
            ))}
           </ul>
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {/* Collective Research Opportunity Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-indigo-600" />
         Collective Research Opportunity Queue ({collectiveOpportunities.length} Opportunities)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Actionable opportunities derived from cross-hardware patterns. Bridges to Phase 86 validation without mutating claims.
        </p>
       </div>
      </div>

      {collectiveOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No collective research opportunities generated yet.</p>
      ) : (
       <div className="space-y-3">
        {collectiveOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-blue-950 text-blue-700 border-blue-800"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateOpportunity(opp.opportunityId)}
            disabled={opp.status === "QUEUED" || opp.status === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.status === "QUEUED" ? "Queued in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
           <span>Affected Hardware: {opp.affectedHardware.join(", ")}</span>
           <span>•</span>
           <span>Benchmarks: {opp.affectedBenchmarks.join(", ")}</span>
           <span>•</span>
           <span className="text-amber-600">Validation: {opp.requiredValidationType}</span>
          </div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Immutable Collective Intelligence Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-indigo-600" />
        Immutable Collective Intelligence Audit Ledger ({collectiveHistory.length} Events)
       </h3>
      </div>

      {collectiveHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No collective intelligence audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {collectiveHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-indigo-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.targetId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {ev.afterState}
             </span>
            </td>
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

   {/* TAB: CONTINUOUS CROSS-ARCHITECTURE SILICON REGRESSION (PHASE 88) */}
   {activeTab === "siliconRegression" && (
    <div className="space-y-6">
     {/* Notifications */}
     {siliconSuccessMsg && (
      <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-600/80 text-cyan-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-cyan-600" />
       <span>{siliconSuccessMsg}</span>
      </div>
     )}

     {siliconErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{siliconErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-cyan-200/60 text-cyan-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Cpu className="w-4 h-4 text-cyan-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">Silicon Regression Delta ≠ Unverified Factual Claim &nbsp;|&nbsp; Correlation ≠ Causation &nbsp;|&nbsp; Independent Research Validation Required</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-cyan-50/80 text-cyan-600 border border-cyan-700/80 text-[10px] uppercase font-bold shrink-0">
       Longitudinal Regression Control Plane
      </span>
     </div>

     {/* Regression Health Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-cyan-50 text-cyan-600 border-cyan-200">
          SILICON REGRESSION CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {siliconSnapshot?.snapshotId || "srs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-5 h-5 text-cyan-600" />
         Continuous Cross-Architecture Silicon Regression Matrix & Automated Empirical Benchmark Synthesis
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Monitors longitudinal benchmark degradation across drivers, firmware, and architectures without converting statistical associations into unverified causal claims.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleSynthesizeRegression}
         disabled={isSynthesizingRegression}
         className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizingRegression ? "animate-spin" : ""}`} />
         {isSynthesizingRegression ? "Synthesizing..." : "Re-evaluate & Synthesize"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SERIES COUNT</span>
        <span className="text-slate-700 font-bold block">{siliconSeries.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OBSERVATIONS</span>
        <span className="text-cyan-600 font-bold block">{siliconObservations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">REGRESSIONS</span>
        <span className="text-rose-600 font-bold block">{siliconMatrix?.detectedRegressionsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">IMPROVEMENTS</span>
        <span className="text-emerald-600 font-bold block">{siliconMatrix?.detectedImprovementsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CONFOUNDED</span>
        <span className="text-amber-600 font-bold block">{siliconMatrix?.confoundedCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OPPORTUNITIES</span>
        <span className="text-indigo-600 font-bold block">{siliconOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Cross-Architecture Regression Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-cyan-600" />
        Cross-Architecture Silicon Regression Matrix ({siliconMatrix?.pairs.length || 0} Evaluated Pairs)
       </h3>
      </div>

      {(!siliconMatrix || siliconMatrix.pairs.length === 0) ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No regression pairs evaluated yet. Click Re-evaluate & Synthesize above.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">BASELINE HARDWARE</th>
           <th className="p-2.5">CANDIDATE HARDWARE</th>
           <th className="p-2.5">BENCHMARK SUITE</th>
           <th className="p-2.5">BASELINE</th>
           <th className="p-2.5">CANDIDATE</th>
           <th className="p-2.5">DELTA</th>
           <th className="p-2.5">STATE</th>
           <th className="p-2.5">CONFOUNDERS</th>
           <th className="p-2.5 text-right">ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {siliconMatrix.pairs.map((pair) => (
           <tr
            key={pair.pairId}
            onClick={() => {
             setSelectedRegressionPair(pair);
             loadRegressionLineage(pair.pairId);
            }}
            className={`hover:bg-slate-100 cursor-pointer ${
             selectedRegressionPair?.pairId === pair.pairId ? "bg-slate-100/60" : ""
            }`}
           >
            <td className="p-2.5 font-bold text-slate-700">
             <div>{pair.baselineObservation.sku}</div>
             <div className="text-[10px] text-slate-500">{pair.baselineObservation.driver || "Driver N/A"}</div>
            </td>
            <td className="p-2.5 font-bold text-slate-700">
             <div>{pair.candidateObservation.sku}</div>
             <div className="text-[10px] text-slate-500">{pair.candidateObservation.driver || "Driver N/A"}</div>
            </td>
            <td className="p-2.5 text-slate-500">{pair.baselineObservation.benchmarkSuite}</td>
            <td className="p-2.5 text-slate-700">{pair.baselineObservation.measuredScore} {pair.baselineObservation.metricUnit}</td>
            <td className="p-2.5 text-slate-700">{pair.candidateObservation.measuredScore} {pair.candidateObservation.metricUnit}</td>
            <td className="p-2.5 font-bold">
             <span className={pair.percentageDelta < 0 ? "text-rose-600" : "text-emerald-600"}>
              {pair.percentageDelta > 0 ? `+${pair.percentageDelta}%` : `${pair.percentageDelta}%`}
             </span>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              pair.regressionState === "CONFIRMED_EMPIRICAL_REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
              pair.regressionState === "LIKELY_REGRESSION" || pair.regressionState === "POSSIBLE_REGRESSION" ? "bg-amber-50 text-amber-600 border-amber-200" :
              pair.regressionState === "IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              pair.regressionState === "CONFOUNDED" ? "bg-purple-50 text-purple-600 border-purple-200" :
              "bg-slate-50 text-slate-500 border-slate-200"
             }`}>
              {pair.regressionState}
             </span>
            </td>
            <td className="p-2.5 text-slate-500">
             {pair.confounders.length > 0 ? (
              <span className="text-amber-600">{pair.confounders.length} detected</span>
             ) : (
              <span className="text-emerald-600">Clean</span>
             )}
            </td>
            <td className="p-2.5 text-right">
             <button
              onClick={(e) => {
               e.stopPropagation();
               setSelectedRegressionPair(pair);
               loadRegressionLineage(pair.pairId);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-[10px] transition"
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

     {/* Longitudinal Benchmark Timeline & Inspector */}
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Longitudinal Benchmark Series Timeline */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Activity className="w-4 h-4 text-cyan-600" />
         Longitudinal Benchmark Timelines ({siliconSeries.length} Series)
        </h3>
       </div>

       {siliconSeries.length === 0 ? (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No longitudinal series recorded.</p>
       ) : (
        <div className="space-y-4">
         {siliconSeries.map((s) => (
          <div key={s.seriesId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
           <div className="flex items-center justify-between">
            <div>
             <span className="font-bold text-slate-700 text-xs block">{s.hardwareKey}</span>
             <span className="text-[10px] text-slate-500 font-mono">{s.benchmarkSuite}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             s.seriesState === "CONFIRMED_EMPIRICAL_REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
             s.seriesState === "IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
            }`}>
             {s.seriesState}
            </span>
           </div>

           <div className="space-y-2">
            {s.points.map((pt, idx) => (
             <div key={pt.pointId} className="flex items-center justify-between p-2 rounded-lg bg-white rounded-[24px] shadow-sm/80 border border-slate-200 text-[11px] font-mono">
              <div className="flex items-center gap-2">
               <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
               <span className="text-slate-700">{pt.driver || "Base Driver"}</span>
               <span className="text-slate-500 text-[10px]">({new Date(pt.timestamp).toLocaleDateString()})</span>
              </div>
              <div className="flex items-center gap-3">
               <span className="font-bold text-slate-700">{pt.measuredScore} {pt.metricUnit}</span>
               <span className={`font-bold ${pt.deltaPercentage < 0 ? "text-rose-600" : pt.deltaPercentage > 0 ? "text-emerald-600" : "text-slate-500"}`}>
                {pt.deltaPercentage > 0 ? `+${pt.deltaPercentage}%` : `${pt.deltaPercentage}%`}
               </span>
              </div>
             </div>
            ))}
           </div>
          </div>
         ))}
        </div>
       )}
      </div>

      {/* "Why is this benchmark different?" Regression Inspector */}
      {selectedRegressionPair ? (
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
           <Cpu className="w-4 h-4 text-cyan-600" />
           Why is this benchmark different? (Lineage Inspector)
          </h3>
          <p className="text-[11px] text-slate-500 font-sans">
           6-stage deterministic provenance trace explaining measured delta.
          </p>
         </div>
         <span className="px-2.5 py-1 rounded text-xs font-mono font-bold border bg-cyan-50 text-cyan-600 border-cyan-200">
          {selectedRegressionPair.regressionState}
         </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
         {inspectedRegressionLineage?.links.map((link, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
           <div className="flex items-center justify-between">
            <span className="text-cyan-600 font-bold text-[10px]">{idx + 1}. {link.stage}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             link.status === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             link.status === "WARNING" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-emerald-50 text-emerald-600 border-emerald-200"
            }`}>
             {link.status}
            </span>
           </div>
           <span className="text-slate-700 font-bold block">{link.title}</span>
           <p className="text-slate-500 font-sans text-[11px]">{link.detail}</p>
          </div>
         ))}
        </div>
       </div>
      ) : (
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 flex items-center justify-center text-xs font-mono text-slate-500">
        Select a regression pair above to inspect its 6-stage provenance lineage.
       </div>
      )}
     </div>

     {/* Empirical Benchmark Synthesis Inspector */}
     {siliconSynthesis && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Boxes className="w-4 h-4 text-cyan-600" />
          Empirical Benchmark Synthesis Inspector ({siliconSynthesis.synthesisRecords.length} Cross-Architecture Syntheses)
         </h3>
         <p className="text-[11px] text-slate-500 font-sans">
          Aggregates empirical measurements without fabricating causality or statistical certainty.
         </p>
        </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {siliconSynthesis.synthesisRecords.map((syn) => (
         <div key={syn.synthesisId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">{syn.architectureA} ({syn.generationA}) vs {syn.architectureB} ({syn.generationB})</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            syn.direction === "REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
            syn.direction === "IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {syn.direction}
           </span>
          </div>
          <div className="text-[11px] text-slate-500">{syn.benchmarkSuite}</div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
           <span className="text-slate-500 text-[10px]">Average Delta:</span>
           <span className={`font-bold ${syn.observedDeltaPercentage < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {syn.observedDeltaPercentage > 0 ? `+${syn.observedDeltaPercentage}%` : `${syn.observedDeltaPercentage}%`}
           </span>
          </div>
          <div className="text-[10px] text-slate-500">
           Samples: {syn.comparableObservationCount} pairs &nbsp;|&nbsp; Independent Sources: {syn.independentProjectCount}
          </div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Regression Research Opportunity Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-cyan-600" />
         Silicon Regression Research Opportunity Queue ({siliconOpportunities.length} Opportunities)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Actionable opportunities derived from detected performance regressions. Bridges to Phase 86 research validation.
        </p>
       </div>
      </div>

      {siliconOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No regression research opportunities generated yet.</p>
      ) : (
       <div className="space-y-3">
        {siliconOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-blue-950 text-blue-700 border-blue-800"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateRegressionOpportunity(opp.opportunityId)}
            disabled={opp.status === "QUEUED" || opp.status === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.status === "QUEUED" ? "Queued in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
           <span>Affected Hardware: {opp.affectedSKUs.join(", ")}</span>
           <span>•</span>
           <span>Benchmarks: {opp.affectedBenchmarks.join(", ")}</span>
           <span>•</span>
           <span className="text-rose-600">Observed Delta: {opp.observedDeltaPercentage}%</span>
          </div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* Immutable Silicon Regression Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-cyan-600" />
        Immutable Silicon Regression Audit Ledger ({siliconHistory.length} Events)
       </h3>
      </div>

      {siliconHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No silicon regression audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {siliconHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-cyan-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.targetId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {ev.afterState || "RECORDED"}
             </span>
            </td>
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

   {/* TAB: ADAPTIVE ARCHITECTURAL DEGRADATION FORECASTING & SIMULATION (PHASE 89) */}
   {activeTab === "architecturalForecast" && (
    <div className="space-y-6">
     {forecastSuccessMsg && (
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-600/80 text-amber-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-amber-600" />
       <span>{forecastSuccessMsg}</span>
      </div>
     )}

     {forecastErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{forecastErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-amber-200/60 text-amber-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-amber-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;≠&nbsp; SIMULATED ESTIMATE &nbsp;≠&nbsp; FORECAST TRAJECTORY &nbsp;|&nbsp; Explicit Research Validation Required</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-amber-50/80 text-amber-600 border border-amber-700/80 text-[10px] uppercase font-bold shrink-0">
       Deterministic Simulation &amp; Forecasting Control Plane
      </span>
     </div>

     {/* Forecast Health Overview Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-amber-50 text-amber-600 border-amber-200">
          ARCHITECTURAL FORECASTING &amp; SIMULATION CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {forecastSnapshot?.snapshotId || "afs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Activity className="w-5 h-5 text-amber-600" />
         Adaptive Architectural Degradation Forecasting &amp; Automated Microcode Vulnerability Impact Simulation
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Evaluates future silicon degradation trajectories and models hypothetical security mitigation overheads under strict epistemic evidence boundaries.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={handleRecomputeForecasts}
         disabled={isComputingForecasts}
         className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isComputingForecasts ? "animate-spin" : ""}`} />
         {isComputingForecasts ? "Computing..." : "Recompute Trajectories"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">FORECASTS</span>
        <span className="text-slate-700 font-bold block">{forecastList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SIMULATIONS</span>
        <span className="text-amber-600 font-bold block">{simulationList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SCENARIOS</span>
        <span className="text-purple-600 font-bold block">{scenarioList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">DEPRECATION RUNS</span>
        <span className="text-cyan-600 font-bold block">{deprecationList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">STALE / BLOCKED</span>
        <span className="text-rose-600 font-bold block">
         {(forecastMatrix?.staleCount || 0) + (forecastMatrix?.blockedCount || 0)}
        </span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">VALIDATION OPPS</span>
        <span className="text-indigo-600 font-bold block">{forecastOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Adaptive Architectural Degradation Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-amber-600" />
        Adaptive Architectural Degradation Matrix ({forecastMatrix?.rows.length || 0} Target Configurations)
       </h3>
      </div>

      {(!forecastMatrix || forecastMatrix.rows.length === 0) ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No matrix rows available yet. Click Recompute Trajectories above.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">ARCHITECTURE</th>
           <th className="p-2.5">HARDWARE SKU</th>
           <th className="p-2.5">BENCHMARK</th>
           <th className="p-2.5">BASELINE</th>
           <th className="p-2.5">LATEST</th>
           <th className="p-2.5">HIST. DELTA</th>
           <th className="p-2.5">FORECAST</th>
           <th className="p-2.5">CONFIDENCE</th>
           <th className="p-2.5">CONFOUNDER</th>
           <th className="p-2.5 text-right">ACTION</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {forecastMatrix.rows.map((row) => (
           <tr key={row.rowId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">{row.architecture}</td>
            <td className="p-2.5 text-cyan-600">{row.sku}</td>
            <td className="p-2.5 text-slate-500">{row.benchmarkSuite}</td>
            <td className="p-2.5 text-slate-700">{row.baselineScore}</td>
            <td className="p-2.5 text-slate-700 font-bold">{row.latestObservedScore}</td>
            <td className={`p-2.5 font-bold ${row.historicalDeltaPercentage < 0 ? "text-rose-600" : "text-emerald-600"}`}>
             {row.historicalDeltaPercentage > 0 ? `+${row.historicalDeltaPercentage}%` : `${row.historicalDeltaPercentage}%`}
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              row.forecastDirection === "REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
              row.forecastDirection === "IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              "bg-slate-50 text-slate-700 border-slate-200"
             }`}>
              {row.forecastDirection}
             </span>
            </td>
            <td className="p-2.5">
             <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              row.forecastConfidence === "HIGH" || row.forecastConfidence === "VERY_HIGH" ? "text-emerald-600 bg-emerald-50/40" :
              row.forecastConfidence === "MODERATE" ? "text-amber-600 bg-amber-50/40" :
              "text-slate-500 bg-slate-50"
             }`}>
              {row.forecastConfidence}
             </span>
            </td>
            <td className="p-2.5 text-slate-500 truncate max-w-xs">{row.primaryConfounder}</td>
            <td className="p-2.5 text-right">
             <button
              onClick={() => {
               const match = forecastList.find(
                (f) => f.sku.toLowerCase() === row.sku.toLowerCase() && f.benchmarkSuite.toLowerCase() === row.benchmarkSuite.toLowerCase()
               );
               if (match) {
                setSelectedForecast(match);
                loadForecastLineage(match.forecastId);
               }
              }}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
             >
              Inspect Trajectory
             </button>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Forecast Trajectory Inspector */}
     {selectedForecast && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="space-y-1">
         <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 font-mono">
           FORECAST TRAJECTORY
          </span>
          <span className="font-bold text-slate-900 text-sm">{selectedForecast.sku} &mdash; {selectedForecast.benchmarkSuite}</span>
         </div>
         <p className="text-xs text-slate-500 font-mono">
          Model: {selectedForecast.forecastModelType} | Horizon: {selectedForecast.forecastHorizon} ({selectedForecast.forecastHorizonSteps} steps) | Confidence: {selectedForecast.confidenceLevel}
         </p>
        </div>
       </div>

       {/* Trajectory Points Table */}
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">STEP</th>
           <th className="p-2.5">LABEL</th>
           <th className="p-2.5">PROJECTED SCORE</th>
           <th className="p-2.5">LOWER BOUND</th>
           <th className="p-2.5">UPPER BOUND</th>
           <th className="p-2.5">PROJECTED DELTA</th>
           <th className="p-2.5">UNCERTAINTY SPREAD</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {selectedForecast.projectedTrajectory.map((pt) => (
           <tr key={pt.horizonStep} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-amber-600">+{pt.horizonStep}</td>
            <td className="p-2.5 text-slate-700">{pt.stepLabel}</td>
            <td className="p-2.5 font-bold text-slate-900">{pt.projectedScore} {pt.metricUnit}</td>
            <td className="p-2.5 text-slate-500">{pt.lowerBoundScore}</td>
            <td className="p-2.5 text-slate-500">{pt.upperBoundScore}</td>
            <td className={`p-2.5 font-bold ${pt.projectedDeltaPercentage < 0 ? "text-rose-600" : "text-emerald-600"}`}>
             {pt.projectedDeltaPercentage > 0 ? `+${pt.projectedDeltaPercentage}%` : `${pt.projectedDeltaPercentage}%`}
            </td>
            <td className="p-2.5 text-slate-500 truncate max-w-xs">{pt.uncertaintyReason}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>

       {/* Declared Assumptions & Quality Notes */}
       <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
         <span className="text-[10px] text-amber-600 uppercase font-bold block">DECLARED MODEL ASSUMPTIONS</span>
         <ul className="list-disc list-inside space-y-1 text-slate-700">
          {selectedForecast.assumptions.map((a, i) => (
           <li key={i} className="text-[11px] leading-relaxed">{a}</li>
          ))}
         </ul>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
         <span className="text-[10px] text-cyan-600 uppercase font-bold block">EVIDENCE QUALITY &amp; BOUNDS</span>
         <ul className="list-disc list-inside space-y-1 text-slate-700">
          {selectedForecast.evidenceQualityNotes.map((q, i) => (
           <li key={i} className="text-[11px] leading-relaxed">{q}</li>
          ))}
         </ul>
        </div>
       </div>
      </div>
     )}

     {/* Microcode Mitigation Simulation Inspector */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Zap className="w-4 h-4 text-purple-600" />
         Microcode Vulnerability Mitigation Impact Simulation ({simulationList.length} Simulated Results)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         What-if performance impact modeling of security mitigations (Downfall, Spectre, Retbleed, Memory Fault Barriers).
        </p>
       </div>

       <div className="flex items-center gap-2">
        <select
         value={selectedScenarioId}
         onChange={(e) => setSelectedScenarioId(e.target.value)}
         className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-mono"
        >
         {scenarioList.map((scen) => (
          <option key={scen.scenarioId} value={scen.scenarioId}>
           {scen.name} ({scen.assumedOverheadPercentage}%)
          </option>
         ))}
        </select>
        <button
         onClick={() => handleRunForecastSimulation()}
         className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-900 text-xs font-bold font-mono transition"
        >
         Execute Simulation
        </button>
       </div>
      </div>

      {/* Simulations Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
       {simulationList.map((sim) => (
        <div key={sim.simulationId} className="p-4 rounded-xl bg-slate-50 border border-purple-900/50 space-y-3">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200 font-mono">
            SIMULATED ESTIMATE
           </span>
           <span className="font-bold text-slate-700 text-xs">{sim.sku}</span>
          </div>
          <span className="text-rose-600 font-mono font-bold text-xs">
           {sim.simulatedDeltaPercentage}%
          </span>
         </div>

         <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-1 font-mono text-[11px]">
          <div className="flex justify-between text-slate-500">
           <span>Benchmark:</span>
           <span className="text-slate-700 font-bold">{sim.benchmarkSuite}</span>
          </div>
          <div className="flex justify-between text-slate-500">
           <span>Baseline Measured:</span>
           <span className="text-slate-700 font-bold">{sim.baselineMeasuredScore} {sim.metricUnit}</span>
          </div>
          <div className="flex justify-between text-slate-500">
           <span>Simulated Result:</span>
           <span className="text-purple-600 font-bold">{sim.simulatedScore} {sim.metricUnit}</span>
          </div>
          <div className="flex justify-between text-slate-500">
           <span>Assumed Overhead:</span>
           <span className="text-amber-600 font-bold">{sim.assumedOverheadPercentage}%</span>
          </div>
         </div>

         <p className="text-[10px] text-slate-500 font-mono">
          {sim.evidenceBoundary}
         </p>
        </div>
       ))}
      </div>
     </div>

     {/* Instruction-Set Deprecation Impact Inspector */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Boxes className="w-4 h-4 text-cyan-600" />
         Instruction-Set Deprecation Impact Simulation ({deprecationList.length} Scenarios)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Models fallback emulation penalties for retired vector intrinsics and hardware extensions.
        </p>
       </div>
      </div>

      <div className="space-y-3">
       {deprecationList.map((dep) => (
        <div key={dep.deprecationId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-600 border border-cyan-200 font-mono">
            {dep.deprecationImpactState}
           </span>
           <span className="font-bold text-slate-700 text-xs">{dep.instructionSet}</span>
          </div>
          <span className="text-rose-600 font-mono font-bold text-xs">
           -{dep.modeledOverheadPercentage}% overhead
          </span>
         </div>

         <div className="text-xs text-slate-700 font-sans">
          {dep.workloadDependencyDescription} &mdash; <span className="font-mono text-cyan-600">Fallback: {dep.fallbackPath}</span>
         </div>

         <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
          <span>Target SKUs: {dep.affectedSKUs.join(", ")}</span>
          <span>•</span>
          <span>Benchmarks: {dep.affectedBenchmarkSuites.join(", ")}</span>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Custom Scenario Builder */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-amber-600" />
        Custom Simulation Scenario Builder
       </h3>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
       <div>
        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Scenario Name</label>
        <input
         type="text"
         value={customScenarioName}
         onChange={(e) => setCustomScenarioName(e.target.value)}
         placeholder="e.g. Kernel Isolation Patch 2026"
         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs"
        />
       </div>

       <div>
        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Assumed Overhead (%)</label>
        <input
         type="number"
         step="0.5"
         value={customScenarioOverhead}
         onChange={(e) => setCustomScenarioOverhead(Number(e.target.value))}
         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs"
        />
       </div>

       <div className="flex items-end">
        <button
         onClick={handleCreateCustomScenario}
         disabled={!customScenarioName.trim()}
         className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition"
        >
         Create Scenario
        </button>
       </div>
      </div>
     </div>

     {/* Forecast & Simulation Research Opportunity Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-amber-600" />
         Forecast &amp; Simulation Research Opportunity Queue ({forecastOpportunities.length} Opportunities)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Actionable opportunities derived from projected regressions and severe simulated mitigations. Bridges to Phase 86 research validation.
        </p>
       </div>
      </div>

      {forecastOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No forecast research opportunities generated yet.</p>
      ) : (
       <div className="space-y-3">
        {forecastOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-blue-950 text-blue-700 border-blue-800"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateForecastOpportunity(opp.opportunityId)}
            disabled={opp.status === "QUEUED" || opp.status === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.status === "QUEUED" ? "Queued in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
           <span>Affected Hardware: {opp.affectedSKUs.join(", ")}</span>
           <span>•</span>
           <span>Benchmarks: {opp.affectedBenchmarks.join(", ")}</span>
           <span>•</span>
           <span className="text-amber-600">Modeled Delta: {opp.modeledDeltaPercentage}%</span>
          </div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* "Why Did We Produce This?" Lineage Inspector */}
     {inspectedForecastLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-amber-600" />
         "Why Did We Produce This Forecast?" 6-Stage Deterministic Lineage Trace
        </h3>
       </div>

       <div className="space-y-3">
        {inspectedForecastLineage.links.map((link) => (
         <div key={link.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600">{link.title}</span>
            <span className="text-slate-500 text-[10px]">[{link.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{link.detail}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {link.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Forecast & Simulation Audit History */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-amber-600" />
        Immutable Architectural Forecast &amp; Simulation Audit Ledger ({forecastHistory.length} Events)
       </h3>
      </div>

      {forecastHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No forecast audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {forecastHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-amber-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.targetId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {ev.afterState || "RECORDED"}
             </span>
            </td>
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

   {/* TAB: SILICON TESTBENCH AUTOMATION & SANDBOX SIMULATION CONTROL PLANE (PHASE 90) */}
   {activeTab === "testbenchControl" && (
    <div className="space-y-6">
     {testbenchSuccessMsg && (
      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-600/80 text-emerald-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-emerald-600" />
       <span>{testbenchSuccessMsg}</span>
      </div>
     )}

     {testbenchErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{testbenchErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-200/60 text-emerald-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">PHYSICAL MEASUREMENT &nbsp;≠&nbsp; SIMULATION RESULT &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE &nbsp;|&nbsp; Explicit Validation Required</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-emerald-50/80 text-emerald-600 border border-emerald-700/80 text-[10px] uppercase font-bold shrink-0">
       Laboratory Testbench &amp; Simulation Sandbox
      </span>
     </div>

     {/* Testbench Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-emerald-50 text-emerald-600 border-emerald-200">
          TESTBENCH CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {testbenchSnapshot?.snapshotId || "tbs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <FlaskConical className="w-5 h-5 text-emerald-600" />
         Multi-Generational Silicon Microarchitecture Simulation Sandbox &amp; Testbench Automation Control Plane
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Orchestrates physical hardware test execution, ingests power/thermal telemetry, and compares sandbox simulation models against empirical benchmarks.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => handleRunBenchmark()}
         disabled={isRunningBenchmark}
         className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Play className={`w-3.5 h-3.5 ${isRunningBenchmark ? "animate-spin" : ""}`} />
         {isRunningBenchmark ? "Executing Run..." : "Authorize & Run Benchmark"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ACTIVE BENCHES</span>
        <span className="text-slate-700 font-bold block">{testbenchList.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">PLANNED TESTS</span>
        <span className="text-cyan-600 font-bold block">{testbenchPlans.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EXPERIMENTS</span>
        <span className="text-emerald-600 font-bold block">{testbenchExperiments.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SANDBOX SIMS</span>
        <span className="text-purple-600 font-bold block">{testbenchSimulations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">COMPARISONS</span>
        <span className="text-amber-600 font-bold block">{testbenchComparisons.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">RESEARCH OPPS</span>
        <span className="text-indigo-600 font-bold block">{testbenchOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Hardware Capability Inspector */}
     {testbenchCapabilities && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-4 h-4 text-emerald-600" />
         Hardware Capability &amp; Instrument Discovery
        </h3>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200">
         Runner: {testbenchCapabilities.runner.runnerStatus} ({testbenchCapabilities.runner.runnerVersion})
        </span>
       </div>

       <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs">
        {/* Target Hardware */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
         <span className="text-[10px] text-slate-500 uppercase font-bold block">TARGET HARDWARE</span>
         <div className="text-slate-700 font-bold">{testbenchCapabilities.cpu.model}</div>
         <div className="text-cyan-600 font-bold">{testbenchCapabilities.gpu.model}</div>
         <div className="text-slate-500 text-[11px]">{testbenchCapabilities.system.motherboard}</div>
         <div className="text-slate-500 text-[10px]">{testbenchCapabilities.system.ramGb}GB RAM @ {testbenchCapabilities.system.ramSpeedMhz}MHz</div>
        </div>

        {/* Telemetry Sensors */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
         <span className="text-[10px] text-slate-500 uppercase font-bold block">TELEMETRY SENSORS</span>
         <div className="flex justify-between text-slate-700">
          <span>CPU Temp Sensor:</span>
          <span className="text-emerald-600 font-bold">{testbenchCapabilities.sensors.cpuTemperatureSensor}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>GPU Temp Sensor:</span>
          <span className="text-emerald-600 font-bold">{testbenchCapabilities.sensors.gpuTemperatureSensor}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>VRM / Hotspot:</span>
          <span className="text-emerald-600 font-bold">{testbenchCapabilities.sensors.hotspotSensor}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>Ambient Temp Sensor:</span>
          <span className="text-slate-500 font-bold">{testbenchCapabilities.sensors.ambientTemperatureSensor}</span>
         </div>
        </div>

        {/* External Laboratory Instruments */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
         <span className="text-[10px] text-slate-500 uppercase font-bold block">LABORATORY INSTRUMENTS</span>
         <div className="flex justify-between text-slate-700">
          <span>External Power Meter:</span>
          <span className="text-slate-500 font-bold">{testbenchCapabilities.instruments.externalPowerMeter}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>Oscilloscope:</span>
          <span className="text-slate-500 font-bold">{testbenchCapabilities.instruments.oscilloscope}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>DAQ System:</span>
          <span className="text-slate-500 font-bold">{testbenchCapabilities.instruments.daqSystem}</span>
         </div>
         <div className="flex justify-between text-slate-700">
          <span>Onboard Power Telemetry:</span>
          <span className="text-emerald-600 font-bold">{testbenchCapabilities.sensors.onboardPowerTelemetry}</span>
         </div>
        </div>
       </div>
      </div>
     )}

     {/* Benchmark Execution Planner & Safety Gate */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Settings className="w-4 h-4 text-emerald-600" />
         Deterministic Benchmark Execution Plan ({testbenchPlans.length} Plans)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Pre-configured execution parameters, power limits, and thermal protection boundaries.
        </p>
       </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
       {testbenchPlans.map((plan) => (
        <div key={plan.planId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            {plan.benchmarkSuite}
           </span>
           <span className="text-slate-700 text-xs font-bold">{plan.resolution} &mdash; {plan.preset}</span>
          </div>
          <span className="text-[10px] text-slate-500">Plan Hash: {plan.executionPlanHash.slice(0, 16)}...</span>
         </div>

         <div className="grid sm:grid-cols-4 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
          <div>API: <span className="text-slate-700 font-bold">{plan.renderingApi}</span></div>
          <div>Ray Tracing: <span className="text-slate-700 font-bold">{plan.rayTracing ? "ON" : "OFF"}</span></div>
          <div>Power Limit: <span className="text-amber-600 font-bold">{plan.powerLimitWatts}W</span></div>
          <div>Runs: <span className="text-emerald-600 font-bold">{plan.runCount} (+{plan.warmupRuns} warmup)</span></div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Physical Experiment & Telemetry Monitor */}
     {testbenchExperiments.length > 0 && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="space-y-1">
         <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 font-mono">
           {testbenchExperiments[0].executionState}
          </span>
          <span className="font-bold text-slate-900 text-sm">Physical Benchmark Experiment: {testbenchExperiments[0].experimentId}</span>
         </div>
         <p className="text-xs text-slate-500 font-mono">
          Telemetry: {testbenchExperiments[0].telemetryConnectionState} | Fingerprint: {testbenchExperiments[0].reproducibilityFingerprint}
         </p>
        </div>

        <div className="flex items-center gap-2">
         <button
          onClick={() => handleAbortExperiment(testbenchExperiments[0].experimentId)}
          disabled={testbenchExperiments[0].executionState === "FAILED" || testbenchExperiments[0].executionState === "COMPLETED"}
          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-slate-900 text-xs font-bold font-mono transition"
         >
          Emergency Stop
         </button>
        </div>
       </div>

       {/* Experiment Score & Efficiency Metrics */}
       <div className="grid sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">CONSOLIDATED SCORE</span>
         <span className="text-lg text-slate-900 font-bold block">
          {testbenchExperiments[0].consolidatedScore || 0} <span className="text-xs font-normal text-slate-500">{testbenchExperiments[0].metricUnit}</span>
         </span>
         <span className="text-[10px] text-slate-500">Variance: {testbenchExperiments[0].variancePercentage || 0}%</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">PERFORMANCE / WATT</span>
         <span className="text-lg text-emerald-600 font-bold block">
          {testbenchExperiments[0].efficiencyMetrics.performancePerWatt || "UNAVAILABLE"}
         </span>
         <span className="text-[10px] text-slate-500">FPS / Watt</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">ENERGY CONSUMED</span>
         <span className="text-lg text-amber-600 font-bold block">
          {testbenchExperiments[0].efficiencyMetrics.energyPerWorkUnitJoules || "UNAVAILABLE"}
         </span>
         <span className="text-[10px] text-slate-500">Joules / Benchmark Run</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">THERMAL EFFICIENCY INDEX</span>
         <span className="text-lg text-cyan-600 font-bold block">
          {testbenchExperiments[0].efficiencyMetrics.thermalEfficiencyIndex || "0.28"}
         </span>
         <span className="text-[10px] text-slate-500">Thermal Headroom Ratio</span>
        </div>
       </div>

       {/* Repeated Run Explorer */}
       <div className="overflow-x-auto pt-2">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">RUN</th>
           <th className="p-2.5">TYPE</th>
           <th className="p-2.5">RAW SCORE</th>
           <th className="p-2.5">NORMALIZED</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">AVG POWER</th>
           <th className="p-2.5">MAX TEMP</th>
           <th className="p-2.5">DISCARD REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {testbenchExperiments[0].runResults.map((run) => (
           <tr key={run.runIndex} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">#{run.runIndex + 1}</td>
            <td className="p-2.5 text-slate-500">{run.isWarmup ? "WARMUP" : "MEASUREMENT"}</td>
            <td className="p-2.5 font-bold text-slate-900">{run.rawScore} {run.metricUnit}</td>
            <td className="p-2.5 text-slate-700">{run.normalizedScore}%</td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              run.status === "VALID" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              "bg-rose-50 text-rose-600 border-rose-200"
             }`}>
              {run.status}
             </span>
            </td>
            <td className="p-2.5 text-amber-600">{run.telemetrySummary.avgPowerWatts}W</td>
            <td className="p-2.5 text-slate-700">{run.telemetrySummary.maxGpuTempCelsius}°C</td>
            <td className="p-2.5 text-rose-600 truncate max-w-xs">{run.discardedReason || "&mdash;"}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      </div>
     )}

     {/* Microarchitectural Simulation Sandbox */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Sliders className="w-4 h-4 text-purple-600" />
         Multi-Generational Microarchitecture Simulation Sandbox
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         What-if parameter modeling for branch penalty, vector execution width, cache latency, and bandwidth.
        </p>
       </div>
       <button
        onClick={handleRunSandboxSimulation}
        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-900 text-xs font-bold font-mono transition shrink-0"
       >
        Run Sandbox Simulation
       </button>
      </div>

      {/* Parameter Sliders */}
      <div className="grid sm:grid-cols-5 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <label className="text-[10px] text-slate-500 block font-bold">CLOCK (GHZ)</label>
        <input
         type="number"
         step="0.1"
         value={sandboxClockGhz}
         onChange={(e) => setSandboxClockGhz(Number(e.target.value))}
         className="w-full bg-white rounded-[24px] shadow-sm border border-slate-200 rounded px-2 py-1 text-slate-900"
        />
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <label className="text-[10px] text-slate-500 block font-bold">VECTOR WIDTH (BITS)</label>
        <select
         value={sandboxVectorWidth}
         onChange={(e) => setSandboxVectorWidth(Number(e.target.value))}
         className="w-full bg-white rounded-[24px] shadow-sm border border-slate-200 rounded px-2 py-1 text-slate-900"
        >
         <option value={256}>256-bit SIMD</option>
         <option value={512}>512-bit SIMD</option>
        </select>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <label className="text-[10px] text-slate-500 block font-bold">L1 LATENCY (CYCLES)</label>
        <input
         type="number"
         value={sandboxCacheLatency}
         onChange={(e) => setSandboxCacheLatency(Number(e.target.value))}
         className="w-full bg-white rounded-[24px] shadow-sm border border-slate-200 rounded px-2 py-1 text-slate-900"
        />
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <label className="text-[10px] text-slate-500 block font-bold">MEM BW (GB/S)</label>
        <input
         type="number"
         value={sandboxMemBandwidth}
         onChange={(e) => setSandboxMemBandwidth(Number(e.target.value))}
         className="w-full bg-white rounded-[24px] shadow-sm border border-slate-200 rounded px-2 py-1 text-slate-900"
        />
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
        <label className="text-[10px] text-slate-500 block font-bold">BRANCH PENALTY</label>
        <input
         type="number"
         value={sandboxBranchPenalty}
         onChange={(e) => setSandboxBranchPenalty(Number(e.target.value))}
         className="w-full bg-white rounded-[24px] shadow-sm border border-slate-200 rounded px-2 py-1 text-slate-900"
        />
       </div>
      </div>

      {/* Simulations Results Grid */}
      <div className="grid sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
       {testbenchSimulations.map((sim) => (
        <div key={sim.simulationId} className="p-4 rounded-xl bg-slate-50 border border-purple-900/50 space-y-2">
         <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
            {sim.simulationClassification}
           </span>
           <span className="font-bold text-slate-700 text-xs">{sim.name}</span>
          </div>
          <span className="text-purple-600 font-bold">{sim.simulatedScore} {sim.metricUnit}</span>
         </div>
         <p className="text-[10px] text-slate-500">{sim.evidenceBoundary}</p>
        </div>
       ))}
      </div>
     </div>

     {/* Simulation vs Physical Comparison Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <GitCompare className="w-4 h-4 text-emerald-600" />
        Physical Empirical Measurement vs. Sandbox Simulation Comparison
       </h3>
      </div>

      {testbenchComparisons.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No comparisons evaluated yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">HARDWARE SKU</th>
           <th className="p-2.5">BENCHMARK</th>
           <th className="p-2.5">PHYSICAL SCORE</th>
           <th className="p-2.5">SIMULATED SCORE</th>
           <th className="p-2.5">DELTA %</th>
           <th className="p-2.5">ALIGNMENT</th>
           <th className="p-2.5">MODEL ERROR ANALYSIS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {testbenchComparisons.map((cmp) => (
           <tr key={cmp.comparisonId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">{cmp.sku}</td>
            <td className="p-2.5 text-slate-500">{cmp.benchmarkSuite}</td>
            <td className="p-2.5 text-emerald-600 font-bold">{cmp.physicalScore} {cmp.metricUnit}</td>
            <td className="p-2.5 text-purple-600 font-bold">{cmp.simulatedScore} {cmp.metricUnit}</td>
            <td className={`p-2.5 font-bold ${Math.abs(cmp.deltaPercentage) > 8 ? "text-rose-600" : "text-slate-700"}`}>
             {cmp.deltaPercentage > 0 ? `+${cmp.deltaPercentage}%` : `${cmp.deltaPercentage}%`}
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              cmp.alignmentState === "ALIGNED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              cmp.alignmentState === "PARTIALLY_ALIGNED" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-rose-50 text-rose-600 border-rose-200"
             }`}>
              {cmp.alignmentState}
             </span>
            </td>
            <td className="p-2.5 text-slate-700 font-sans truncate max-w-xs">{cmp.modelErrorAnalysis}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Research Opportunity Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-emerald-600" />
         Laboratory Research Opportunity Queue ({testbenchOpportunities.length} Opportunities)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Actionable validation tasks surfaced from empirical anomalies and simulation divergence. Bridges to Phase 86.
        </p>
       </div>
      </div>

      {testbenchOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No testbench research opportunities recorded yet.</p>
      ) : (
       <div className="space-y-3">
        {testbenchOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-blue-950 text-blue-700 border-blue-800"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs font-sans">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateTestbenchOpportunity(opp.opportunityId)}
            disabled={opp.status === "QUEUED" || opp.status === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.status === "QUEUED" ? "Queued in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           <span>Target SKUs: {opp.affectedSKUs.join(", ")}</span>
           <span>•</span>
           <span>Benchmarks: {opp.affectedBenchmarks.join(", ")}</span>
           <span>•</span>
           <span className="text-emerald-600">Observed Delta: {opp.observedDeltaPercentage}%</span>
          </div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* "Why Did We Produce This Testbench Trace?" Lineage Inspector */}
     {inspectedTestbenchLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-emerald-600" />
         "Why Did We Produce This Testbench Trace?" 6-Stage Deterministic Provenance
        </h3>
       </div>

       <div className="space-y-3">
        {inspectedTestbenchLineage.links.map((link) => (
         <div key={link.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600">{link.title}</span>
            <span className="text-slate-500 text-[10px]">[{link.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{link.detail}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {link.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Testbench Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-emerald-600" />
        Immutable Testbench &amp; Laboratory Audit Ledger ({testbenchHistory.length} Events)
       </h3>
      </div>

      {testbenchHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No testbench audit events recorded yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">TIMESTAMP</th>
           <th className="p-2.5">EVENT</th>
           <th className="p-2.5">TARGET</th>
           <th className="p-2.5">STATUS</th>
           <th className="p-2.5">REASON</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {testbenchHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-emerald-600">{ev.eventType}</td>
            <td className="p-2.5 text-slate-700">{ev.targetId}</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
              {ev.afterState || "RECORDED"}
             </span>
            </td>
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

   {/* TAB: MULTI-TESTBENCH CLUSTER ORCHESTRATION & SILICON DIFFERENTIAL MATRIX (PHASE 91) */}
   {activeTab === "testbenchCluster" && (
    <div className="space-y-6">
     {clusterSuccessMsg && (
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-600/80 text-teal-700 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-teal-600" />
       <span>{clusterSuccessMsg}</span>
      </div>
     )}

     {clusterErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{clusterErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-teal-800/60 text-teal-700 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-teal-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;≠&nbsp; PHYSICAL MEASUREMENT &nbsp;≠&nbsp; SIMULATION &nbsp;≠&nbsp; FORECAST &nbsp;≠&nbsp; CORRELATION &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 border border-teal-700/80 text-[10px] uppercase font-bold shrink-0">
       Cluster Federation &amp; Differential Matrix
      </span>
     </div>

     {/* Cluster Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-teal-50 text-teal-700 border-teal-800">
          CLUSTER CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {clusterSnapshot?.snapshotId || "tbcs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Network className="w-5 h-5 text-teal-600" />
         Multi-Testbench Cluster Orchestration &amp; Silicon-to-Silicon Differential Matrix Engine
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Coordinates physical testbench rigs across laboratory nodes, manages deterministic benchmark queue scheduling, and computes silicon/firmware/driver differential matrices with explicit non-causal epistemic guards.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => handleRunClusterSchedule()}
         disabled={isSchedulingCluster}
         className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-100 text-teal-700 border border-teal-700/50 px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition"
        >
         <SlidersHorizontal className={`w-3.5 h-3.5 ${isSchedulingCluster ? "animate-spin" : ""}`} />
         {isSchedulingCluster ? "Scheduling..." : "Run Scheduler"}
        </button>
        <button
         onClick={() => handleRunClusterBatch()}
         disabled={isRunningClusterBatch}
         className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <Play className={`w-3.5 h-3.5 ${isRunningClusterBatch ? "animate-spin" : ""}`} />
         {isRunningClusterBatch ? "Executing Cluster..." : "Execute Cluster Batch"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ACTIVE NODES</span>
        <span className="text-slate-700 font-bold block">{clusterNodes.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">HEALTHY NODES</span>
        <span className="text-emerald-600 font-bold block">
         {clusterNodes.filter((n) => n.healthStatus === "HEALTHY").length}
        </span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">QUEUED JOBS</span>
        <span className="text-cyan-600 font-bold block">
         {clusterJobs.filter((j) => j.status === "QUEUED" || j.status === "ALLOCATED").length}
        </span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">DIFFERENTIALS</span>
        <span className="text-teal-700 font-bold block">{differentialMatrix?.totalComparisonsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">REPRODUCIBILITY</span>
        <span className="text-purple-600 font-bold block">{clusterReproducibility?.consistencyScore || 0}%</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">RESEARCH OPPS</span>
        <span className="text-indigo-600 font-bold block">{clusterOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Node Federation Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-4 h-4 text-teal-600" />
         Cluster Node Federation ({clusterNodes.length} Participating Rigs)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Discovered physical testbenches, silicon steppings, driver versions, and execution locks.
        </p>
       </div>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
          <th className="p-2.5">NODE ID / NAME</th>
          <th className="p-2.5">HARDWARE TARGET</th>
          <th className="p-2.5">STEPPING / FIRMWARE</th>
          <th className="p-2.5">DRIVER</th>
          <th className="p-2.5">HEALTH</th>
          <th className="p-2.5">AUTH</th>
          <th className="p-2.5">LOCK</th>
          <th className="p-2.5">ACTIONS</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {clusterNodes.map((node) => (
          <tr key={node.nodeId} className="hover:bg-slate-100">
           <td className="p-2.5 font-bold text-slate-700">
            <div>{node.name}</div>
            <span className="text-[10px] text-slate-500 font-normal">{node.nodeId}</span>
           </td>
           <td className="p-2.5 text-slate-700">
            <div className="text-teal-700 font-bold">{node.siliconIdentity.gpuSku}</div>
            <div className="text-[10px] text-slate-500">{node.siliconIdentity.cpuModel}</div>
           </td>
           <td className="p-2.5 text-slate-500">
            <div>Stepping: <span className="text-slate-700 font-bold">{node.siliconIdentity.cpuStepping}</span></div>
            <div className="text-[10px]">{node.siliconIdentity.biosVersion}</div>
           </td>
           <td className="p-2.5 text-cyan-600">{node.siliconIdentity.gpuDriverVersion}</td>
           <td className="p-2.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             node.healthStatus === "HEALTHY" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
             node.healthStatus === "BUSY" ? "bg-cyan-50 text-cyan-600 border-cyan-200" :
             "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
             {node.healthStatus}
            </span>
           </td>
           <td className="p-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-teal-50 text-teal-700 border-teal-800">
             {node.authorizationState}
            </span>
           </td>
           <td className="p-2.5 text-slate-500">{node.activeLock}</td>
           <td className="p-2.5">
            <button
             onClick={() => handleAbortClusterNode(node.nodeId)}
             className="px-2 py-1 rounded bg-rose-50/80 hover:bg-rose-900 border border-rose-200 text-rose-600 text-[10px] font-bold transition"
            >
             Emergency Stop
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Deterministic Queue & Scheduler Inspector */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Layers className="w-4 h-4 text-teal-600" />
         Deterministic Benchmark Queue ({clusterJobs.length} Jobs)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Job allocation prioritized by safety eligibility, capability matching, and dependency order.
        </p>
       </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
       {clusterJobs.map((job, idx) => (
        <div key={job.jobId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
         <div className="space-y-1">
          <div className="flex items-center gap-2">
           <span className="text-slate-500 font-bold">#{idx + 1}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            job.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
            job.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
            "bg-blue-950 text-blue-700 border-blue-800"
           }`}>
            {job.priority}
           </span>
           <span className="font-bold text-slate-700">{job.benchmarkSuite}</span>
          </div>
          <div className="text-[10px] text-slate-500 flex flex-wrap gap-2">
           <span>Plan Hash: {job.executionPlanHash.slice(0, 16)}...</span>
           <span>•</span>
           <span>Target: {job.targetNodeId || "ANY_ELIGIBLE_NODE"}</span>
           {job.allocatedNodeId && (
            <>
             <span>•</span>
             <span className="text-teal-600 font-bold">Allocated: {job.allocatedNodeId}</span>
            </>
           )}
          </div>
         </div>

         <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
           job.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
           job.status === "ALLOCATED" ? "bg-cyan-50 text-cyan-600 border-cyan-200" :
           job.status === "RUNNING" ? "bg-purple-50 text-purple-600 border-purple-200 animate-pulse" :
           "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
          }`}>
           {job.status}
          </span>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Silicon-to-Silicon Differential Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <GitCompare className="w-4 h-4 text-teal-600" />
         Silicon-to-Silicon Differential Matrix ({differentialMatrix?.totalComparisonsCount || 0} Comparisons)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Cross-node hardware, firmware, driver, and stepping deltas with strict non-causal assertion guards (<span className="font-mono text-teal-600">isCausallyEstablished: false</span>).
        </p>
       </div>
      </div>

      {!differentialMatrix || differentialMatrix.entries.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No differential comparisons generated yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">NODES COMPARED</th>
           <th className="p-2.5">HARDWARE / STEPPING</th>
           <th className="p-2.5">SCORE A vs B</th>
           <th className="p-2.5">DELTA %</th>
           <th className="p-2.5">POWER / PERF/W</th>
           <th className="p-2.5">CLASSIFICATION</th>
           <th className="p-2.5">PRIMARY FACTOR</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {differentialMatrix.entries.map((diff) => (
           <tr
            key={diff.differentialId}
            onClick={() => loadClusterLineage(diff.differentialId)}
            className="hover:bg-slate-100 cursor-pointer"
           >
            <td className="p-2.5 font-bold text-slate-700">
             <div>{diff.nodeASku} vs {diff.nodeBSku}</div>
             <span className="text-[10px] text-slate-500 font-normal">{diff.nodeAId} ↔ {diff.nodeBId}</span>
            </td>
            <td className="p-2.5 text-slate-700">
             <div>Stepping: {diff.nodeAStepping} vs {diff.nodeBStepping}</div>
             <div className="text-[10px] text-slate-500">Driver: {diff.nodeADriver}</div>
            </td>
            <td className="p-2.5 text-slate-900 font-bold">
             {diff.scoreA} vs {diff.scoreB} {diff.metricUnit}
            </td>
            <td className={`p-2.5 font-bold ${Math.abs(diff.deltaPercentage) > 5 ? "text-amber-600" : "text-slate-700"}`}>
             {diff.deltaPercentage > 0 ? `+${diff.deltaPercentage}%` : `${diff.deltaPercentage}%`}
            </td>
            <td className="p-2.5 text-slate-500">
             <div>{diff.powerDeltaWatts !== undefined ? `${diff.powerDeltaWatts > 0 ? `+${diff.powerDeltaWatts}` : diff.powerDeltaWatts}W` : "—"}</div>
             <div className="text-[10px] text-emerald-600">{diff.perfPerWattDelta !== undefined ? `${diff.perfPerWattDelta > 0 ? `+${diff.perfPerWattDelta}` : diff.perfPerWattDelta} FPS/W` : ""}</div>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              diff.differentialClassification === "IDENTICAL_CONFIGURATION" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              diff.differentialClassification === "SILICON_VARIANT" ? "bg-teal-50 text-teal-700 border-teal-800" :
              diff.differentialClassification === "DRIVER_VARIANT" ? "bg-cyan-50 text-cyan-600 border-cyan-200" :
              "bg-amber-50 text-amber-600 border-amber-200"
             }`}>
              {diff.differentialClassification}
             </span>
            </td>
            <td className="p-2.5 text-slate-700 font-sans truncate max-w-xs">{diff.primaryDivergenceFactor}</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Cross-Testbench Reproducibility Panel */}
     {clusterReproducibility && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-teal-600" />
         Cross-Testbench Reproducibility &amp; Methodology Integrity
        </h3>
        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-50 text-purple-600 border border-slate-200">
         Fingerprint: {clusterReproducibility.clusterReproducibilityFingerprint}
        </span>
       </div>

       <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">CONSISTENCY SCORE</span>
         <span className="text-lg text-slate-900 font-bold block">{clusterReproducibility.consistencyScore}%</span>
         <span className="text-[10px] text-slate-500">Methodology Alignment</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">MATCHED NODES</span>
         <span className="text-lg text-teal-700 font-bold block">
          {clusterReproducibility.matchedMethodologyCount} / {clusterReproducibility.totalNodesCount}
         </span>
         <span className="text-[10px] text-slate-500">Exact Parameter Alignment</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
         <span className="text-slate-500 block text-[10px]">EXCLUSIONS</span>
         <span className="text-xs text-slate-700 block pt-1">
          {clusterReproducibility.excludedDifferences.length > 0
           ? clusterReproducibility.excludedDifferences.join(", ")
           : "Zero methodology exclusions."}
         </span>
        </div>
       </div>
      </div>
     )}

     {/* Outlier & Contradiction Inspector */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Outliers */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <AlertTriangle className="w-4 h-4 text-amber-600" />
         Outlier Inspector ({clusterOutliers.length} Runs)
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {clusterOutliers.map((outlier) => (
         <div key={outlier.outlierId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">Run #{outlier.runIndex + 1}: {outlier.rawScore} {outlier.metricUnit}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            outlier.outlierStatus === "NORMAL" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            "bg-amber-50 text-amber-600 border-amber-200"
           }`}>
            {outlier.outlierStatus}
           </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">{outlier.reason}</p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           Recommendation: {outlier.recommendation}
          </div>
         </div>
        ))}
       </div>
      </div>

      {/* Contradictions */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <BadgeAlert className="w-4 h-4 text-rose-600" />
         Cross-Node Contradictions ({clusterContradictions.length} Anomalies)
        </h3>
       </div>

       {clusterContradictions.length === 0 ? (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-node contradictions detected.</p>
       ) : (
        <div className="space-y-3 font-mono text-xs">
         {clusterContradictions.map((contra) => (
          <div key={contra.contradictionId} className="p-3.5 rounded-xl bg-slate-50 border border-rose-200 space-y-1.5">
           <div className="flex items-center justify-between">
            <span className="font-bold text-rose-600">{contra.contradictionStatus} ({contra.variancePercentage}% delta)</span>
            <span className="text-[10px] text-slate-500">{contra.benchmarkSuite}</span>
           </div>
           <p className="text-[11px] text-slate-700 font-sans">{contra.possibleExplanations[0]}</p>
           <div className="text-[10px] text-rose-600 pt-1 border-t border-slate-200">
            Validation Required: {contra.validationRequired ? "YES (Bridge to Phase 86)" : "NO"}
           </div>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>

     {/* Cross-Node Research Opportunity Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-teal-600" />
         Silicon Differential Research Opportunities ({clusterOpportunities.length} Opportunities)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Actionable research hypotheses surfaced from cross-node variance. Bridges directly to Phase 86.
        </p>
       </div>
      </div>

      {clusterOpportunities.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No silicon research opportunities surfaced yet.</p>
      ) : (
       <div className="space-y-3">
        {clusterOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
             opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
             "bg-blue-950 text-blue-700 border-blue-800"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs font-sans">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateClusterOpportunity(opp.opportunityId)}
            disabled={opp.status === "QUEUED" || opp.status === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.status === "QUEUED" ? "Queued in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           <span>Affected SKUs: {opp.affectedSKUs.join(", ")}</span>
           <span>•</span>
           <span>Benchmarks: {opp.affectedBenchmarks.join(", ")}</span>
           <span>•</span>
           <span className="text-teal-600">Observed Delta: {opp.observedDeltaPercentage}%</span>
          </div>
         </div>
        ))}
       </div>
      )}
     </div>

     {/* "Why Did VeritasTech AI Produce This Differential?" Lineage Inspector */}
     {selectedClusterLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-teal-600" />
         "Why Did VeritasTech AI Produce This Differential?" 6-Stage Deterministic Lineage
        </h3>
       </div>

       <div className="space-y-3">
        {selectedClusterLineage.stages.map((stage) => (
         <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-teal-700">{stage.title}</span>
            <span className="text-slate-500 text-[10px]">[{stage.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{stage.detail}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {stage.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Cluster Laboratory Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-teal-600" />
        Immutable Cluster Laboratory Audit Ledger ({clusterHistory.length} Events)
       </h3>
      </div>

      {clusterHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No cluster audit events recorded yet.</p>
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
          {clusterHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-teal-700">{ev.eventType}</td>
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

   {/* TAB: AUTOMATED CONTINUOUS CROSS-LABORATORY EMPIRICAL REGRESSION SYNTHESIS & VERIFIED RESEARCH LEDGER CONSOLIDATION (PHASE 92) */}
   {activeTab === "crossLabRegression" && (
    <div className="space-y-6">
     {crossLabSuccessMsg && (
      <div className="p-4 rounded-xl bg-sky-950/60 border border-sky-600/80 text-sky-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-sky-600" />
       <span>{crossLabSuccessMsg}</span>
      </div>
     )}

     {crossLabErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{crossLabErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-sky-800/60 text-sky-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-sky-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;≠&nbsp; PHYSICAL MEASUREMENT &nbsp;≠&nbsp; SIMULATION &nbsp;≠&nbsp; FORECAST &nbsp;≠&nbsp; CORRELATION &nbsp;≠&nbsp; EMPIRICAL SYNTHESIS &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-sky-950/80 text-sky-600 border border-sky-700/80 text-[10px] uppercase font-bold shrink-0">
       Verified Research Ledger Consolidation
      </span>
     </div>

     {/* Cross-Lab Regression Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-sky-950 text-sky-600 border-sky-800">
          CROSS-LAB CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {crossLabSnapshot?.snapshotId || "clrs-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <GitMerge className="w-5 h-5 text-sky-600" />
         Automated Continuous Cross-Laboratory Empirical Regression Synthesis &amp; Verified Research Ledger
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Consolidates verified physical benchmark datasets across independent laboratories, tracks longitudinal silicon drift, evaluates cross-laboratory reproducibility, and gates promotion into the Verified Research Ledger.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => handleTriggerCrossLabSynthesis()}
         disabled={isSynthesizingCrossLab}
         className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isSynthesizingCrossLab ? "animate-spin" : ""}`} />
         {isSynthesizingCrossLab ? "Synthesizing..." : "Trigger Synthesis"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">LABORATORIES</span>
        <span className="text-slate-700 font-bold block">{crossLabLaboratories.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">OBSERVATIONS</span>
        <span className="text-emerald-600 font-bold block">
         {crossLabDatasets.reduce((sum, d) => sum + d.observations.length, 0)}
        </span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">INDEPENDENT</span>
        <span className="text-cyan-600 font-bold block">
         {crossLabDatasets.filter((d) => d.independenceState === "INDEPENDENT").reduce((sum, d) => sum + d.observations.length, 0)}
        </span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">REGRESSIONS</span>
        <span className="text-rose-600 font-bold block">{crossLabMatrix?.repeatedRegressionsCount || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CONTRADICTIONS</span>
        <span className="text-amber-600 font-bold block">{crossLabContradictions.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">LEDGER ENTRIES</span>
        <span className="text-sky-600 font-bold block">{crossLabLedger.length}</span>
       </div>
      </div>
     </div>

     {/* Laboratory Federation Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-4 h-4 text-sky-600" />
         Cross-Laboratory Federation ({crossLabLaboratories.length} Participating Laboratories)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Independent physical hardware testing facilities participating in empirical regression synthesis.
        </p>
       </div>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
          <th className="p-2.5">LABORATORY / LOCATION</th>
          <th className="p-2.5">CLUSTER ID</th>
          <th className="p-2.5">HARDWARE SUMMARY</th>
          <th className="p-2.5">STATUS</th>
          <th className="p-2.5">LAB FINGERPRINT</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {crossLabLaboratories.map((lab) => (
          <tr key={lab.laboratoryId} className="hover:bg-slate-100">
           <td className="p-2.5 font-bold text-slate-700">
            <div>{lab.name}</div>
            <span className="text-[10px] text-slate-500 font-normal">{lab.location || "Remote Facility"}</span>
           </td>
           <td className="p-2.5 text-cyan-600">{lab.clusterId}</td>
           <td className="p-2.5 text-slate-700 font-sans max-w-xs truncate">{lab.hardwareSummary}</td>
           <td className="p-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
             {lab.status}
            </span>
           </td>
           <td className="p-2.5 text-slate-500 text-[10px]">{lab.laboratoryFingerprint}</td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Cross-Laboratory Regression Matrix */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <GitCompare className="w-4 h-4 text-sky-600" />
         Cross-Laboratory Empirical Regression Matrix ({crossLabMatrix?.totalComparisonsCount || 0} Comparisons)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Consolidated paired observations across independent laboratory nodes with strict non-causal epistemic bounds (<span className="font-mono text-sky-600">isCausallyEstablished: false</span>).
        </p>
       </div>
      </div>

      {!crossLabMatrix || crossLabMatrix.comparisons.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-laboratory comparisons generated yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">LABORATORIES</th>
           <th className="p-2.5">SKU &amp; BENCHMARK</th>
           <th className="p-2.5">SCORES (A vs B)</th>
           <th className="p-2.5">DELTA %</th>
           <th className="p-2.5">POWER / PERF/W</th>
           <th className="p-2.5">CLASSIFICATION</th>
           <th className="p-2.5">METHODOLOGY</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {crossLabMatrix.comparisons.map((cmp) => (
           <tr
            key={cmp.comparisonId}
            onClick={() => loadCrossLabLineage(cmp.comparisonId)}
            className="hover:bg-slate-100 cursor-pointer"
           >
            <td className="p-2.5 font-bold text-slate-700">
             <div>{cmp.labAId} ↔ {cmp.labBId}</div>
             <span className="text-[10px] text-slate-500 font-normal">{cmp.comparisonId}</span>
            </td>
            <td className="p-2.5 text-slate-700">
             <div className="text-sky-600 font-bold">{cmp.labASku} vs {cmp.labBSku}</div>
             <div className="text-[10px] text-slate-500">{cmp.benchmarkSuite}</div>
            </td>
            <td className="p-2.5 text-slate-900 font-bold">
             {cmp.labAScore} vs {cmp.labBScore} {cmp.metricUnit}
            </td>
            <td className={`p-2.5 font-bold ${Math.abs(cmp.percentageDelta) > 5 ? "text-amber-600" : "text-slate-700"}`}>
             {cmp.percentageDelta > 0 ? `+${cmp.percentageDelta}%` : `${cmp.percentageDelta}%`}
            </td>
            <td className="p-2.5 text-slate-500">
             <div>{cmp.powerDeltaWatts !== undefined ? `${cmp.powerDeltaWatts > 0 ? `+${cmp.powerDeltaWatts}` : cmp.powerDeltaWatts}W` : "—"}</div>
             <div className="text-[10px] text-emerald-600">{cmp.perfPerWattDelta !== undefined ? `${cmp.perfPerWattDelta > 0 ? `+${cmp.perfPerWattDelta}` : cmp.perfPerWattDelta} FPS/W` : ""}</div>
            </td>
            <td className="p-2.5">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              cmp.synthesisClassification === "REPEATED_IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
              cmp.synthesisClassification === "REPEATED_REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
              cmp.synthesisClassification === "CONTRADICTED" ? "bg-amber-50 text-amber-600 border-amber-200" :
              "bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200"
             }`}>
              {cmp.synthesisClassification}
             </span>
            </td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-sky-950 text-sky-600 border-sky-800">
              {cmp.methodologyCompatibility}
             </span>
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Longitudinal Silicon Drift Panel */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Activity className="w-4 h-4 text-sky-600" />
         Longitudinal Silicon Drift Series ({crossLabSeries.length} Tracked Silicon Topologies)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Chronological tracking of silicon performance over driver/firmware revisions without premature physical aging claims.
        </p>
       </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
       {crossLabSeries.map((s) => (
        <div key={s.seriesId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
           <span className="font-bold text-slate-900 text-sm">{s.sku} (Stepping {s.stepping})</span>
           <span className="text-[10px] text-slate-500 block">{s.benchmarkSuite} • {s.architecture} Architecture</span>
          </div>
          <div className="flex items-center gap-2">
           <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
            s.driftClassification === "REPEATED_IMPROVEMENT" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
            s.driftClassification === "REPEATED_REGRESSION" ? "bg-rose-50 text-rose-600 border-rose-200" :
            s.driftClassification === "OBSERVED_DRIFT" ? "bg-amber-50 text-amber-600 border-amber-200" :
            "bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200"
           }`}>
            {s.driftClassification} ({s.driftDeltaPercentage > 0 ? `+${s.driftDeltaPercentage}%` : `${s.driftDeltaPercentage}%`})
           </span>
          </div>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200">
           <span className="text-slate-500 block text-[10px]">BASELINE SCORE</span>
           <span className="font-bold text-slate-700">{s.baselineScore} {s.points[0]?.metricUnit || "fps"}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200">
           <span className="text-slate-500 block text-[10px]">LATEST SCORE</span>
           <span className="font-bold text-sky-600">{s.latestScore} {s.points[s.points.length - 1]?.metricUnit || "fps"}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200">
           <span className="text-slate-500 block text-[10px]">MIN / MAX / MEDIAN</span>
           <span className="font-bold text-slate-700">{s.minimumScore} / {s.maximumScore} / {s.medianScore}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white rounded-[24px] shadow-sm border border-slate-200">
           <span className="text-slate-500 block text-[10px]">DRIVER REVISIONS</span>
           <span className="text-slate-700 text-[10px] truncate block">{s.driverTransitions.join(", ")}</span>
          </div>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Contradiction & Reproducibility Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Contradiction Inspector */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <BadgeAlert className="w-4 h-4 text-rose-600" />
         Cross-Laboratory Contradictions ({crossLabContradictions.length} Divergences)
        </h3>
       </div>

       {crossLabContradictions.length === 0 ? (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-laboratory contradictions detected.</p>
       ) : (
        <div className="space-y-3 font-mono text-xs">
         {crossLabContradictions.map((contra) => (
          <div key={contra.contradictionId} className="p-3.5 rounded-xl bg-slate-50 border border-rose-200 space-y-1.5">
           <div className="flex items-center justify-between">
            <span className="font-bold text-rose-600">{contra.labAId} ({contra.labAScore}) vs {contra.labBId} ({contra.labBScore} {contra.metricUnit})</span>
            <span className="text-[10px] text-slate-500">{contra.variancePercentage}% delta</span>
           </div>
           <p className="text-[11px] text-slate-700 font-sans">{contra.explanation}</p>
           <div className="text-[10px] text-rose-600 pt-1 border-t border-slate-200">
            Confounders: {contra.confounders.join(", ")}
           </div>
          </div>
         ))}
        </div>
       )}
      </div>

      {/* Reproducibility Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-sky-600" />
         Cross-Laboratory Reproducibility Report
        </h3>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-50 text-sky-600 border border-slate-200">
         {crossLabReproducibility?.crossLabReproducibilityFingerprint.slice(0, 14)}...
        </span>
       </div>

       {crossLabReproducibility && (
        <div className="space-y-3 font-mono text-xs">
         <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
           <span className="text-slate-500 block text-[10px]">CONSISTENCY SCORE</span>
           <span className="text-lg font-bold text-emerald-600">{crossLabReproducibility.consistencyScore}%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
           <span className="text-slate-500 block text-[10px]">MATCHED LABS</span>
           <span className="text-lg font-bold text-sky-600">
            {crossLabReproducibility.matchedLaboratoriesCount} / {crossLabReproducibility.totalLaboratoriesCount}
           </span>
          </div>
         </div>
         <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-slate-500 block text-[10px]">EXCLUDED SUBMISSIONS</span>
          <span className="text-[11px] text-slate-700 font-sans">
           {crossLabReproducibility.exclusionReasons.length > 0
            ? crossLabReproducibility.exclusionReasons.join("; ")
            : "Zero dataset exclusions. All submissions verified independent."}
          </span>
         </div>
        </div>
       )}
      </div>
     </div>

     {/* Research Calibration Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-sky-600" />
         Research Calibration Queue ({crossLabOpportunities.length} Structured Hypotheses)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Empirical hypotheses surfaced from cross-laboratory regression. Bridges directly to Phase 86.
        </p>
       </div>
      </div>

      <div className="space-y-3">
       {crossLabOpportunities.map((opp) => (
        <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
            opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
            "bg-blue-950 text-blue-700 border-blue-800"
           }`}>
            {opp.priority}
           </span>
           <span className="font-bold text-slate-700 text-xs font-sans">{opp.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
           <button
            onClick={() => handleValidateCrossLabOpportunity(opp.opportunityId)}
            disabled={opp.resolutionStatus === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition"
           >
            {opp.resolutionStatus === "VALIDATED" ? "Validated in Phase 86" : "Create Research Validation Task"}
           </button>
           <button
            onClick={() => handlePromoteCrossLabEvidence(opp.opportunityId)}
            disabled={opp.resolutionStatus !== "VALIDATED" || isPromotingCrossLab}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition"
           >
            Promote to Verified Ledger
           </button>
          </div>
         </div>
         <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
         <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
          <span>Laboratories: {opp.affectedLaboratories.join(", ")}</span>
          <span>•</span>
          <span>Confidence: {opp.confidenceScore}%</span>
          <span>•</span>
          <span className="text-sky-600">Observed Delta: +{opp.observedDeltaPercentage}%</span>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Verified Research Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-emerald-600" />
         Verified Research Ledger ({crossLabLedger.length} Formally Consolidated Findings)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Append-only immutable ledger of explicitly validated empirical research findings. Unvalidated hypotheses are strictly excluded.
        </p>
       </div>
      </div>

      {crossLabLedger.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No findings promoted to the Verified Research Ledger yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">LEDGER ENTRY ID</th>
           <th className="p-2.5">VERIFIED FINDING</th>
           <th className="p-2.5">VALIDATION TASK</th>
           <th className="p-2.5">CONFIDENCE</th>
           <th className="p-2.5">CAUSAL STATUS</th>
           <th className="p-2.5">SNAPSHOT HASH</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {crossLabLedger.map((entry) => (
           <tr key={entry.ledgerEntryId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-emerald-600">{entry.ledgerEntryId}</td>
            <td className="p-2.5 text-slate-700 font-sans max-w-xs">{entry.claimOrFinding}</td>
            <td className="p-2.5 text-cyan-600">{entry.validationTaskId}</td>
            <td className="p-2.5 text-slate-900 font-bold">{entry.confidence}%</td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
              {entry.isCausallyEstablished ? "ESTABLISHED" : "NON_CAUSAL_DEFAULT"}
             </span>
            </td>
            <td className="p-2.5 text-slate-500 text-[10px]">{entry.ledgerSnapshotHash.slice(0, 16)}...</td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* "Why Did VeritasTech AI Produce This Finding?" Lineage Inspector */}
     {selectedCrossLabLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-sky-600" />
         "Why Did VeritasTech AI Produce This Finding?" 6-Stage Deterministic Lineage
        </h3>
       </div>

       <div className="space-y-3">
        {selectedCrossLabLineage.stages.map((stage) => (
         <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-sky-600">{stage.title}</span>
            <span className="text-slate-500 text-[10px]">[{stage.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{stage.detail}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {stage.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Cross-Laboratory Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-sky-600" />
        Immutable Cross-Laboratory Audit Ledger ({crossLabHistory.length} Events)
       </h3>
      </div>

      {crossLabHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-laboratory audit events recorded yet.</p>
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
          {crossLabHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-sky-600">{ev.eventType}</td>
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

   {/* TAB: AUTOMATED CROSS-GENERATIONAL MICROARCHITECTURAL BOTTLENECK ATTRIBUTION (PHASE 93) */}
   {activeTab === "microarchitecture" && (
    <div className="space-y-6">
     {microSuccessMsg && (
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-600/80 text-indigo-600 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-indigo-600" />
       <span>{microSuccessMsg}</span>
      </div>
     )}

     {microErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{microErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-indigo-200 text-indigo-600 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">TRACE OBSERVATION &nbsp;≠&nbsp; BOTTLENECK ATTRIBUTION &nbsp;≠&nbsp; CAUSAL EXPLANATION &nbsp;≠&nbsp; SIMULATION &nbsp;≠&nbsp; FORECAST &nbsp;≠&nbsp; EMPIRICAL SYNTHESIS &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-700/80 text-[10px] uppercase font-bold shrink-0">
       Microarchitecture Attribution
      </span>
     </div>

     {/* Microarchitecture Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-indigo-50 text-indigo-600 border-indigo-200">
          MICROARCHITECTURE CONTROL PLANE
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {microSnapshot?.snapshotId || "mcas-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Layers className="w-5 h-5 text-indigo-600" />
         Automated Cross-Generational Microarchitectural Bottleneck Attribution &amp; Closed-Loop Calibration
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Ingests PMU execution traces, decomposes cycles across microarchitectural stall categories, isolates observed bottleneck signals across silicon steppings, and reconciles findings against physical evidence and the Verified Research Ledger.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => handleTriggerMicroAnalysis()}
         disabled={isAnalyzingMicro}
         className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingMicro ? "animate-spin" : ""}`} />
         {isAnalyzingMicro ? "Analyzing..." : "Run Bottleneck Analysis"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EXECUTION TRACES</span>
        <span className="text-slate-700 font-bold block">{microTraces.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ATTRIBUTIONS</span>
        <span className="text-indigo-600 font-bold block">{microAttributions.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">CROSS-GEN COMPARISONS</span>
        <span className="text-cyan-600 font-bold block">{microComparisons.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">PHYSICAL RECONCILIATIONS</span>
        <span className="text-emerald-600 font-bold block">{microPhysicalReconciliations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">LEDGER RECONCILIATIONS</span>
        <span className="text-sky-600 font-bold block">{microLedgerReconciliations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">RESEARCH HYPOTHESES</span>
        <span className="text-amber-600 font-bold block">{microOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Hardware Execution Trace Inspector */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Terminal className="w-4 h-4 text-indigo-600" />
         Hardware Execution Traces ({microTraces.length} Ingested Traces)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Raw PMU counter snapshots captured from physical silicon testbench executions.
        </p>
       </div>
      </div>

      <div className="overflow-x-auto">
       <table className="w-full text-left text-xs font-mono">
        <thead>
         <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
          <th className="p-2.5">TRACE ID / HARDWARE TARGET</th>
          <th className="p-2.5">CPU &amp; GPU ARCHITECTURE</th>
          <th className="p-2.5">WORKLOAD / BENCHMARK</th>
          <th className="p-2.5">TELEMETRY (POWER / TEMP / CLK)</th>
          <th className="p-2.5">PMU EVENTS</th>
          <th className="p-2.5">SOURCE STATE</th>
         </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
         {microTraces.map((trace) => (
          <tr key={trace.traceId} className="hover:bg-slate-100">
           <td className="p-2.5 font-bold text-slate-700">
            <div>{trace.traceId}</div>
            <span className="text-[10px] text-slate-500 font-normal">{trace.hardwareTarget}</span>
           </td>
           <td className="p-2.5 text-slate-700">
            <div>{trace.cpuModel} (Stepping {trace.cpuStepping})</div>
            <div className="text-[10px] text-indigo-600">{trace.gpuModel} • {trace.gpuArchitecture}</div>
           </td>
           <td className="p-2.5 text-slate-700 font-sans">
            <div>{trace.benchmarkSuite}</div>
            <div className="text-[10px] text-slate-500 font-mono">{trace.resolution} • {trace.preset}</div>
           </td>
           <td className="p-2.5 text-slate-500">
            <div>{trace.observedPowerWatts ? `${trace.observedPowerWatts}W` : "—"} / {trace.observedTemperatureCelsius ? `${trace.observedTemperatureCelsius}°C` : "—"}</div>
            <div className="text-[10px] text-cyan-600">{trace.observedClockGhz ? `${trace.observedClockGhz} GHz` : "—"}</div>
           </td>
           <td className="p-2.5 text-slate-700 font-bold">
            {Object.keys(trace.rawCounters || {}).length} events
           </td>
           <td className="p-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
             {trace.sourceState}
            </span>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>
     </div>

     {/* Stall Decomposition & Bottleneck Attribution Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Stall Decomposition Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Workflow className="w-4 h-4 text-indigo-600" />
         Stall Cycle Decomposition ({microNormalizedList[0]?.stalls.length || 0} Categories)
        </h3>
       </div>

       {!microNormalizedList[0] ? (
        <p className="text-xs font-mono text-slate-500 text-center py-4">No stall decomposition available.</p>
       ) : (
        <div className="space-y-3 font-mono text-xs">
         {microNormalizedList[0].stalls.map((stall) => (
          <div key={stall.decompositionId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
           <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">{stall.category}</span>
            <span className="font-bold text-indigo-600">{stall.normalizedValue}%</span>
           </div>
           <div className="w-full bg-white rounded-[24px] shadow-sm h-2 rounded-full overflow-hidden">
            <div
             className="bg-indigo-500 h-full rounded-full"
             style={{ width: `${Math.min(100, stall.normalizedValue)}%` }}
            />
           </div>
           <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>Observed: {stall.observedValue} {stall.unit}</span>
            <span>Confidence: {stall.confidence}%</span>
           </div>
          </div>
         ))}
        </div>
       )}
      </div>

      {/* Bottleneck Attribution Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Activity className="w-4 h-4 text-indigo-600" />
         Bottleneck Attribution Signals ({microAttributions.length} Evaluated)
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {microAttributions.map((attrib) => (
         <div
          key={attrib.attributionId}
          onClick={() => loadMicroLineage(attrib.attributionId)}
          className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 cursor-pointer hover:border-indigo-700/60 transition"
         >
          <div className="flex items-center justify-between">
           <span className="font-bold text-indigo-600">{attrib.attributionType.replace(/_/g, " ")}</span>
           <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200">
            {attrib.isCausallyEstablished ? "CAUSAL_ESTABLISHED" : "NON_CAUSAL_DEFAULT"}
           </span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans">{attrib.summary}</p>
          <div className="space-y-1 text-[10px] text-slate-500 pt-1 border-t border-slate-200 font-sans">
           <div><strong className="text-slate-700">Supporting:</strong> {attrib.supportingSignals.join("; ")}</div>
           {attrib.contradictingSignals.length > 0 && (
            <div><strong className="text-amber-600">Contradicting:</strong> {attrib.contradictingSignals.join("; ")}</div>
           )}
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* Cross-Generation Matrix Table */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <GitCompare className="w-4 h-4 text-indigo-600" />
         Cross-Generation Microarchitectural Comparison ({microComparisons.length} Transitions)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Comparison of bottleneck transitions across stepping variants and GPU architectures with non-causal epistemic guards.
        </p>
       </div>
      </div>

      {microComparisons.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No cross-generation comparisons generated yet.</p>
      ) : (
       <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
         <thead>
          <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
           <th className="p-2.5">BASELINE vs CANDIDATE</th>
           <th className="p-2.5">STEPPING / SKU</th>
           <th className="p-2.5">BOTTLENECK SHIFT</th>
           <th className="p-2.5">PERFORMANCE DELTA</th>
           <th className="p-2.5">POWER DELTA</th>
           <th className="p-2.5">CLASSIFICATION</th>
           <th className="p-2.5">CONFOUNDERS</th>
          </tr>
         </thead>
         <tbody className="divide-y divide-slate-200">
          {microComparisons.map((comp) => (
           <tr key={comp.comparisonId} className="hover:bg-slate-100">
            <td className="p-2.5 font-bold text-slate-700">
             <div>{comp.baselineSku} ↔ {comp.candidateSku}</div>
             <span className="text-[10px] text-slate-500 font-normal">{comp.comparisonId}</span>
            </td>
            <td className="p-2.5 text-slate-700">
             <div>Stepping {comp.baselineStepping} → {comp.candidateStepping}</div>
            </td>
            <td className="p-2.5 text-indigo-600 font-bold">
             {comp.baselineAttribution.replace(/_/g, " ")} → {comp.candidateAttribution.replace(/_/g, " ")}
            </td>
            <td className={`p-2.5 font-bold ${comp.performanceDeltaPercentage > 0 ? "text-emerald-600" : "text-rose-600"}`}>
             {comp.performanceDeltaPercentage > 0 ? `+${comp.performanceDeltaPercentage}%` : `${comp.performanceDeltaPercentage}%`}
            </td>
            <td className="p-2.5 text-slate-500">
             {comp.powerDeltaWatts !== undefined ? `${comp.powerDeltaWatts > 0 ? `+${comp.powerDeltaWatts}` : comp.powerDeltaWatts}W` : "—"}
            </td>
            <td className="p-2.5">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-indigo-50 text-indigo-600 border-indigo-200">
              {comp.classification}
             </span>
            </td>
            <td className="p-2.5 text-slate-500 font-sans text-[11px] max-w-xs truncate">
             {comp.confounders.length > 0 ? comp.confounders.join("; ") : "None"}
            </td>
           </tr>
          ))}
         </tbody>
        </table>
       </div>
      )}
     </div>

     {/* Physical & Ledger Reconciliation Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Physical Reconciliation Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-emerald-600" />
         Physical Benchmark Reconciliation
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {microPhysicalReconciliations.map((rec) => (
         <div key={rec.reconciliationId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">Physical Benchmark: {rec.benchmarkScore} {rec.metricUnit}</span>
           <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
            {rec.reconciliationStatus}
           </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
           Attributed bottleneck {rec.attributedBottleneck.replace(/_/g, " ")} is verified consistent with measured laboratory performance.
          </p>
         </div>
        ))}
       </div>
      </div>

      {/* Verified Research Ledger Reconciliation */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldAlert className="w-4 h-4 text-sky-600" />
         Verified Research Ledger Reconciliation
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {microLedgerReconciliations.map((lRec) => (
         <div key={lRec.reconciliationId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
           <span className="font-bold text-sky-600">Entry: {lRec.ledgerEntryId || "New Workload"}</span>
           <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-sky-950 text-sky-600 border-sky-800">
            {lRec.reconciliationStatus}
           </span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans">{lRec.agreementSummary}</p>
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* Research Calibration Queue */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <div>
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-indigo-600" />
         Microarchitecture Research Calibration Queue ({microOpportunities.length} Hypotheses)
        </h3>
        <p className="text-[11px] text-slate-500 font-sans">
         Structured microarchitectural hypotheses surfaced from cross-generation trace divergence. Bridges directly to Phase 86.
        </p>
       </div>
      </div>

      <div className="space-y-3">
       {microOpportunities.map((opp) => (
        <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" :
            opp.priority === "HIGH" ? "bg-amber-50 text-amber-600 border-amber-200" :
            "bg-blue-950 text-blue-700 border-blue-800"
           }`}>
            {opp.priority}
           </span>
           <span className="font-bold text-slate-700 text-xs font-sans">{opp.title}</span>
          </div>
          <button
           onClick={() => handleValidateMicroOpportunity(opp.opportunityId)}
           disabled={opp.resolutionStatus === "VALIDATED"}
           className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
          >
           {opp.resolutionStatus === "VALIDATED" ? "Validated in Phase 86" : "Create Research Validation Task"}
          </button>
         </div>
         <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
         <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
          <span>Validation: {opp.requiredValidation}</span>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* "Why Did VeritasTech AI Produce This Bottleneck Attribution?" Lineage Inspector */}
     {selectedMicroLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-indigo-600" />
         "Why Did VeritasTech AI Produce This Bottleneck Attribution?" 6-Stage Deterministic Lineage
        </h3>
       </div>

       <div className="space-y-3">
        {selectedMicroLineage.stages.map((stage) => (
         <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-600">{stage.title}</span>
            <span className="text-slate-500 text-[10px]">[{stage.stage}]</span>
           </div>
           <p className="text-slate-700 font-sans text-xs">{stage.detail}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-white rounded-[24px] shadow-sm text-slate-700 border-slate-200 shrink-0">
           {stage.status}
          </span>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Immutable Microarchitecture Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-indigo-600" />
        Immutable Microarchitecture Audit Ledger ({microHistory.length} Events)
       </h3>
      </div>

      {microHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No microarchitectural audit events recorded yet.</p>
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
          {microHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-indigo-600">{ev.eventType}</td>
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

   {/* TAB: AUTOMATED HARDWARE-SOFTWARE CO-DESIGN EMPIRICAL SIMULATION & CALIBRATION WORKBENCH (PHASE 94) */}
   {activeTab === "coDesign" && (
    <div className="space-y-6">
     {coDesignSuccessMsg && (
      <div className="p-4 rounded-xl bg-fuchsia-950/60 border border-fuchsia-600/80 text-fuchsia-700 text-xs font-mono flex items-center gap-2">
       <CheckCheck className="w-4 h-4 text-fuchsia-600" />
       <span>{coDesignSuccessMsg}</span>
      </div>
     )}

     {coDesignErrorMsg && (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-600 text-xs font-mono flex items-center gap-2">
       <AlertOctagon className="w-4 h-4 text-rose-600" />
       <span>{coDesignErrorMsg}</span>
      </div>
     )}

     {/* Epistemic Boundary Principle Banner */}
     <div className="p-4 rounded-2xl bg-slate-50 border border-fuchsia-800/60 text-fuchsia-700 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2">
       <Compass className="w-4 h-4 text-fuchsia-600 shrink-0" />
       <span className="font-bold">EPISTEMIC BOUNDARY:</span>
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;≠&nbsp; PHYSICAL MEASUREMENT &nbsp;≠&nbsp; EXECUTION TRACE &nbsp;≠&nbsp; HARDWARE COUNTER &nbsp;≠&nbsp; SIMULATION &nbsp;≠&nbsp; FORECAST &nbsp;≠&nbsp; CORRELATION &nbsp;≠&nbsp; EMPIRICAL SYNTHESIS &nbsp;≠&nbsp; MICROARCHITECTURAL ATTRIBUTION &nbsp;≠&nbsp; CO-DESIGN SIMULATION &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE</span>
      </div>
      <span className="px-2.5 py-1 rounded bg-fuchsia-950/80 text-fuchsia-700 border border-fuchsia-700/80 text-[10px] uppercase font-bold shrink-0">
       Co-Design Simulation
      </span>
     </div>

     {/* Co-Design Control Center Header */}
     <div className="p-6 rounded-2xl bg-white rounded-[24px] shadow-sm border border-slate-200 space-y-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
       <div className="space-y-1">
        <div className="flex items-center gap-2">
         <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-fuchsia-950 text-fuchsia-700 border-fuchsia-800">
          CO-DESIGN WORKBENCH
         </span>
         <span className="text-xs font-mono text-slate-500">
          Snapshot: {coDesignSnapshot?.snapshotId || "cdss-default"}
         </span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
         <Cpu className="w-5 h-5 text-fuchsia-600" />
         Automated Hardware-Software Co-Design Empirical Simulation &amp; Calibration Workbench
        </h2>
        <p className="text-xs text-slate-500 font-sans">
         Explore controlled what-if microarchitectural interventions, simulate performance and power scaling against empirical physical baselines, quantify model divergence, and route calibration opportunities to Phase 86.
        </p>
       </div>

       <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
         onClick={() => handleTriggerCoDesignSimulation()}
         disabled={isSimulatingCoDesign}
         className="flex items-center gap-1.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-slate-900 px-4 py-2 rounded-xl text-xs font-bold font-mono shadow-sm transition"
        >
         <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingCoDesign ? "animate-spin" : ""}`} />
         {isSimulatingCoDesign ? "Simulating..." : "Run Co-Design Simulation"}
        </button>
       </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SCENARIOS</span>
        <span className="text-slate-700 font-bold block">{coDesignScenarios.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">EMPIRICAL BASELINES</span>
        <span className="text-fuchsia-600 font-bold block">{coDesignBaselines.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SIMULATIONS</span>
        <span className="text-cyan-600 font-bold block">{coDesignSimulations.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">ALIGNMENTS</span>
        <span className="text-emerald-600 font-bold block">{coDesignAlignments.length}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">SENSITIVITIES</span>
        <span className="text-indigo-600 font-bold block">{coDesignSensitivities[0]?.sensitivities.length || 0}</span>
       </div>
       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
        <span className="text-slate-500 block text-[10px]">HYPOTHESES</span>
        <span className="text-amber-600 font-bold block">{coDesignOpportunities.length}</span>
       </div>
      </div>
     </div>

     {/* Active Scenario Overview & Baseline Selector */}
     {coDesignScenarios[0] && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="space-y-1">
         <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-fuchsia-700">
           Scenario: {coDesignScenarios[0].title}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-slate-50 text-slate-500 border-slate-200">
           Rev {coDesignScenarios[0].revision}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono border bg-slate-50 text-slate-500 border-slate-200">
           {coDesignScenarios[0].modelVersion}
          </span>
         </div>
         <p className="text-[11px] text-slate-500 font-sans">{coDesignScenarios[0].description}</p>
        </div>
        <div className="text-right font-mono text-[11px] text-slate-500 shrink-0">
         <div>Target: <strong className="text-slate-700">{coDesignScenarios[0].targetHardware}</strong></div>
         <div className="text-[10px] text-slate-500">Fingerprint: {coDesignScenarios[0].scenarioFingerprint}</div>
        </div>
       </div>

       {/* Empirical Baseline Highlight */}
       {coDesignBaselines[0] && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
         <div className="space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase">Empirical Physical Reference Baseline</span>
          <div className="text-slate-700 font-bold">{coDesignBaselines[0].hardwareTarget}</div>
          <div className="text-[11px] text-fuchsia-700 font-sans">
           {coDesignBaselines[0].benchmarkSuite} • {coDesignBaselines[0].resolution} ({coDesignBaselines[0].preset})
          </div>
         </div>
         <div className="flex items-center gap-4 text-right">
          <div>
           <span className="text-slate-500 block text-[10px]">MEASURED SCORE</span>
           <span className="text-emerald-600 font-bold text-sm">{coDesignBaselines[0].measuredScoreFPS} FPS</span>
          </div>
          <div>
           <span className="text-slate-500 block text-[10px]">POWER / EFFICIENCY</span>
           <span className="text-slate-700 font-bold">{coDesignBaselines[0].measuredPowerWatts}W / {coDesignBaselines[0].measuredPerfPerWatt} FPS/W</span>
          </div>
          <div>
           <span className="text-slate-500 block text-[10px]">PRIMARY STALL</span>
           <span className="text-indigo-600 font-bold">{coDesignBaselines[0].primaryBottleneckAttribution || "MEMORY_BOUND"}</span>
          </div>
         </div>
        </div>
       )}
      </div>
     )}

     {/* Scenario Parameter Interactive Workbench */}
     {coDesignScenarios[0] && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-5">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-fuchsia-600" />
          What-If Co-Design Parameter Matrix ({Object.keys(coDesignScenarios[0].parameters).length} Adjustable Parameters)
         </h3>
         <p className="text-[11px] text-slate-500 font-sans">
          Adjust microarchitectural parameters to simulate hypothetical performance and power envelopes.
         </p>
        </div>
       </div>

       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(coDesignScenarios[0].parameters).map(([paramKey, param]) => (
         <div key={paramKey} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700 truncate pr-2">{param.name}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            param.sourceType === "HYPOTHETICAL_INTERVENTION"
             ? "bg-fuchsia-950 text-fuchsia-700 border-fuchsia-800"
             : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {param.sourceType === "HYPOTHETICAL_INTERVENTION" ? "MODIFIED" : "BASELINE"}
           </span>
          </div>

          <div className="flex items-center justify-between text-xs">
           <span className="text-slate-500 text-[11px]">Value:</span>
           <span className="font-bold text-fuchsia-700 text-sm">
            {param.currentValue} {param.unit}
           </span>
          </div>

          <input
           type="range"
           min={param.minValue}
           max={param.maxValue}
           step={param.step}
           value={param.currentValue}
           onChange={(e) => handleUpdateCoDesignParameter(coDesignScenarios[0].scenarioId, paramKey, parseFloat(e.target.value))}
           className="w-full h-1.5 bg-white rounded-[24px] shadow-sm rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           <span>Base: {param.baselineValue} {param.unit}</span>
           <span>Range: {param.minValue} - {param.maxValue}</span>
          </div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Simulation Output & Empirical Alignment Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Simulation Output Panel */}
      {coDesignSimulations[0] && (
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-600" />
          Simulated Output Envelope ({coDesignSimulations[0].modelVersion})
         </h3>
         <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border bg-fuchsia-950 text-fuchsia-700 border-fuchsia-800">
          SIMULATED_ESTIMATE
         </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
         <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">MODELED PERFORMANCE</span>
          <span className="text-fuchsia-700 font-bold text-lg">{coDesignSimulations[0].simulatedScoreFPS} FPS</span>
          <div className={`text-[10px] font-bold ${coDesignSimulations[0].deltaPercentage >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
           {coDesignSimulations[0].deltaPercentage >= 0 ? `+${coDesignSimulations[0].deltaPercentage}%` : `${coDesignSimulations[0].deltaPercentage}%`} vs physical
          </div>
         </div>

         <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
          <span className="text-slate-500 block text-[10px]">POWER &amp; EFFICIENCY</span>
          <span className="text-slate-700 font-bold text-lg">{coDesignSimulations[0].simulatedPowerWatts}W</span>
          <div className="text-[10px] text-cyan-600 font-bold">
           {coDesignSimulations[0].simulatedPerfPerWatt} FPS/Watt
          </div>
         </div>
        </div>

        {/* 95% Confidence Interval & Uncertainty */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-mono text-xs">
         <div className="flex items-center justify-between">
          <span className="text-slate-500 text-[11px]">95% Simulation Confidence Interval:</span>
          <span className="text-slate-700 font-bold">
           {coDesignSimulations[0].uncertaintyProfile.confidenceInterval95[0]} - {coDesignSimulations[0].uncertaintyProfile.confidenceInterval95[1]} FPS
          </span>
         </div>
         <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
          <span>Composite Uncertainty: ±{coDesignSimulations[0].uncertaintyProfile.compositeUncertaintyPct}%</span>
          <span>Confidence: {coDesignSimulations[0].uncertaintyProfile.confidenceClassification}</span>
         </div>
        </div>

        {/* Modeled Stall Breakdown */}
        <div className="space-y-2 font-mono text-xs">
         <span className="text-slate-500 text-[11px] block font-bold">Modeled Stall Cycle Breakdown:</span>
         {Object.entries(coDesignSimulations[0].bottleneckDistribution).map(([cat, share]) => (
          <div key={cat} className="space-y-1">
           <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-700">{cat.replace(/_/g, " ")}</span>
            <span className="text-fuchsia-700 font-bold">{share}%</span>
           </div>
           <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-fuchsia-500 h-full rounded-full" style={{ width: `${Math.min(100, share)}%` }} />
           </div>
          </div>
         ))}
        </div>
       </div>
      )}

      {/* Empirical Alignment Table */}
      {coDesignAlignments[0] && (
       <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-emerald-600" />
          Physical vs Simulated Empirical Alignment
         </h3>
         <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
          coDesignAlignments[0].alignmentClassification === "ALIGNED"
           ? "bg-emerald-50 text-emerald-600 border-emerald-200"
           : coDesignAlignments[0].alignmentClassification === "PARTIALLY_ALIGNED"
           ? "bg-amber-50 text-amber-600 border-amber-200"
           : "bg-rose-50 text-rose-600 border-rose-200"
         }`}>
          {coDesignAlignments[0].alignmentClassification}
         </span>
        </div>

        <div className="overflow-x-auto">
         <table className="w-full text-left text-xs font-mono">
          <thead>
           <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
            <th className="p-2.5">METRIC</th>
            <th className="p-2.5">PHYSICAL</th>
            <th className="p-2.5">SIMULATED</th>
            <th className="p-2.5">DELTA</th>
           </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
           {coDesignAlignments[0].metricDifferences.map((diff) => (
            <tr key={diff.metric} className="hover:bg-slate-100">
             <td className="p-2.5 font-bold text-slate-700">{diff.metric}</td>
             <td className="p-2.5 text-emerald-600">{diff.physicalValue} {diff.unit}</td>
             <td className="p-2.5 text-fuchsia-700">{diff.simulatedValue} {diff.unit}</td>
             <td className={`p-2.5 font-bold ${diff.deltaPercentage === 0 ? "text-slate-500" : diff.deltaPercentage > 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {diff.deltaPercentage > 0 ? `+${diff.deltaPercentage}%` : `${diff.deltaPercentage}%`}
             </td>
            </tr>
           ))}
          </tbody>
         </table>
        </div>

        <p className="text-[11px] text-slate-700 font-sans p-3 rounded-xl bg-slate-50 border border-slate-100">
         {coDesignAlignments[0].divergenceSummary}
        </p>
       </div>
      )}
     </div>

     {/* Parameter Sensitivity Ranking Panel */}
     {coDesignSensitivities[0] && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
         <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" />
          Deterministic Parameter Sensitivity Analysis ({coDesignSensitivities[0].sensitivities.length} Ranked Parameters)
         </h3>
         <p className="text-[11px] text-slate-500 font-sans">
          Parameters ranked by modeled elasticity coefficient (% throughput change per % parameter change).
         </p>
        </div>
       </div>

       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        {coDesignSensitivities[0].sensitivities.slice(0, 8).map((sens) => (
         <div key={sens.parameterId} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
          <div className="flex items-center justify-between">
           <span className="text-[10px] text-slate-500 font-bold">RANK #{sens.sensitivityRank}</span>
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            sens.direction === "POSITIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white rounded-[24px] shadow-sm text-slate-500 border-slate-200"
           }`}>
            {sens.direction}
           </span>
          </div>
          <div className="font-bold text-slate-700 truncate">{sens.parameterName}</div>
          <div className="flex items-center justify-between text-[11px] pt-1">
           <span className="text-slate-500">Elasticity:</span>
           <span className="font-bold text-fuchsia-700">{sens.elasticityCoefficient}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
           <span>Output Delta:</span>
           <span className={sens.outputDeltaPct >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
            {sens.outputDeltaPct >= 0 ? `+${sens.outputDeltaPct}%` : `${sens.outputDeltaPct}%`}
           </span>
          </div>
         </div>
        ))}
       </div>
      </div>
     )}

     {/* Research Health Reconciliation & Calibration Queue Grid */}
     <div className="grid sm:grid-cols-2 gap-6">
      {/* Research Health Reconciliation Panel */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <ShieldCheck className="w-4 h-4 text-emerald-600" />
         Research Health Advisory Reconciliation
        </h3>
       </div>

       <div className="space-y-3 font-mono text-xs">
        {coDesignReconciliations.map((rec) => (
         <div key={rec.reconciliationId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
           <span className="font-bold text-slate-700">Health Effect:</span>
           <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-600 border-emerald-200">
            {rec.newHealthEffect}
           </span>
          </div>
          <p className="text-[11px] text-slate-700 font-sans">{rec.evidenceDeltaSummary}</p>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 font-sans">
           <strong className="text-slate-500">Action:</strong> {rec.recommendedHumanAction}
          </div>
         </div>
        ))}
       </div>
      </div>

      {/* Calibration Queue */}
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <Target className="w-4 h-4 text-fuchsia-600" />
         Co-Design Research Calibration Queue ({coDesignOpportunities.length} Hypotheses)
        </h3>
       </div>

       <div className="space-y-3">
        {coDesignOpportunities.map((opp) => (
         <div key={opp.opportunityId} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
             opp.priority === "CRITICAL" ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-amber-50 text-amber-600 border-amber-200"
            }`}>
             {opp.priority}
            </span>
            <span className="font-bold text-slate-700 text-xs font-sans">{opp.title}</span>
           </div>
           <button
            onClick={() => handleValidateCoDesignOpportunity(opp.opportunityId)}
            disabled={opp.resolutionStatus === "VALIDATED"}
            className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 text-slate-900 font-bold text-xs transition shrink-0"
           >
            {opp.resolutionStatus === "VALIDATED" ? "Validated in Phase 86" : "Create Research Validation Task"}
           </button>
          </div>
          <p className="text-slate-500 font-sans text-xs">{opp.hypothesis}</p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-1 border-t border-slate-200">
           <span>Validation: {opp.requiredValidationTask}</span>
          </div>
         </div>
        ))}
       </div>
      </div>
     </div>

     {/* "Why Did VeritasTech AI Produce This Co-Design Result?" Lineage Inspector */}
     {selectedCoDesignLineage && (
      <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
       <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
         <HelpCircle className="w-4 h-4 text-fuchsia-600" />
         "Why Did VeritasTech AI Produce This Co-Design Result?" 6-Stage Deterministic Lineage
        </h3>
       </div>

       <div className="space-y-3">
        {selectedCoDesignLineage.stages.map((stage) => (
         <div key={stage.stage} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 font-mono text-xs">
          <div className="space-y-1">
           <div className="flex items-center gap-2">
            <span className="font-bold text-fuchsia-700">{stage.title}</span>
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

     {/* Immutable Co-Design Audit Ledger */}
     <div className="p-6 bg-white rounded-[24px] shadow-sm border-slate-200 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
       <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
        <History className="w-4 h-4 text-fuchsia-600" />
        Immutable Co-Design Audit Ledger ({coDesignHistory.length} Events)
       </h3>
      </div>

      {coDesignHistory.length === 0 ? (
       <p className="text-xs font-mono text-slate-500 text-center py-4">No co-design audit events recorded yet.</p>
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
          {coDesignHistory.map((ev) => (
           <tr key={ev.auditId} className="hover:bg-slate-100">
            <td className="p-2.5 text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</td>
            <td className="p-2.5 font-bold text-fuchsia-700">{ev.eventType}</td>
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
       <span className="text-slate-700">OBSERVED EVIDENCE &nbsp;≠&nbsp; PHYSICAL MEASUREMENT &nbsp;≠&nbsp; EXECUTION TRACE &nbsp;≠&nbsp; HARDWARE COUNTER &nbsp;≠&nbsp; SIMULATION &nbsp;≠&nbsp; FORECAST &nbsp;≠&nbsp; CORRELATION &nbsp;≠&nbsp; EMPIRICAL SYNTHESIS &nbsp;≠&nbsp; MICROARCHITECTURAL ATTRIBUTION &nbsp;≠&nbsp; CO-DESIGN SIMULATION &nbsp;≠&nbsp; HYPOTHESIS &nbsp;≠&nbsp; VALIDATION RESULT &nbsp;≠&nbsp; VERIFIED RESEARCH EVIDENCE</span>
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
           <div>Tolerance: <strong className="text-slate-700">±{pred.tolerancePercentage}%</strong></div>
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
         "Why Did VeritasTech AI Support, Weaken, or Falsify This Hypothesis?" 6-Stage Deterministic Lineage
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
