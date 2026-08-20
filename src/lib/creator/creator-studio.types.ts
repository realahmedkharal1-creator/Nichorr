import { YouTubeIntelligenceReport } from "@/lib/youtube/youtube.types";

export type ScriptSectionType = 
  | 'INTRO' 
  | 'CONTEXT' 
  | 'HARDWARE_SPECS'
  | 'BENCHMARKS' 
  | 'GAMING' 
  | 'THERMALS' 
  | 'YOUTUBE_CONSENSUS'
  | 'REVIEWER_DISAGREEMENTS'
  | 'COMMUNITY_PROBLEMS' 
  | 'AUDIENCE_QUESTIONS' 
  | 'VERDICT' 
  | 'BUYING_ADVICE';

export type VerificationStatus = 
  | 'SUPPORTED' 
  | 'PARTIALLY_SUPPORTED' 
  | 'UNSUPPORTED' 
  | 'CONFLICTED'
  | 'NEEDS_CONTEXT'
  | 'DO_NOT_SAY';

export type HookCategory = 
  | 'DATA_HOOK' 
  | 'PROBLEM_HOOK' 
  | 'CONTRADICTION_HOOK' 
  | 'SURPRISE_HOOK' 
  | 'BUYING_HOOK' 
  | 'MYTH_BUSTING_HOOK';

export type TargetVideoDuration = 8 | 12 | 18;

export interface CreatorHook {
  id: string;
  category: HookCategory;
  headline: string;
  scriptWording: string;
  supportingClaimIds: string[];
  evidenceExcerpt: string;
  targetAudience: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CreatorTitle {
  id: string;
  title: string;
  style: 'HIGH_CURIOSITY' | 'DIRECT_COMPARISON' | 'PROBLEM_FOCUSED' | 'VERDICT_ORIENTED';
  keyEvidenceRef: string;
  targetAudience: string;
}

export interface TalkingPoint {
  id: string;
  section: ScriptSectionType;
  title: string;
  statement: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceIds: string[];
  claimIds: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceCount: number;
  verificationStatus: VerificationStatus;
  contextNote?: string;
  doNotSayWarning?: string;
}

export interface BRollSuggestion {
  id: string;
  sectionType: ScriptSectionType;
  visualTitle: string;
  description: string;
  visualType: 'PRODUCT_CLOSEUP' | 'BENCHMARK_CHART' | 'SPLIT_SCREEN_GAMEPLAY' | 'THERMAL_GRAPH' | 'COMMENT_OVERLAY' | 'SPEC_COMPARISON';
  durationSeconds: number;
  overlayText?: string;
}

export interface BenchmarkVisualCard {
  id: string;
  title: string;
  benchmarkName: string;
  metric: string;
  entityAScore: number;
  entityBScore?: number;
  entityAName: string;
  entityBName?: string;
  deltaPercent?: number;
  comparabilityStatus: string;
  testConditions: string;
  sourcePublisher: string;
}

export interface ScriptSection {
  id: string;
  sectionType: ScriptSectionType;
  title: string;
  estimatedTimestamp: string; // e.g. "00:00"
  durationSeconds: number;
  goal: string;
  talkingPoints: TalkingPoint[];
  bRollSuggestions: BRollSuggestion[];
  factCheckCallouts: Array<{
    claim: string;
    status: VerificationStatus;
    note: string;
  }>;
}

export interface ChapterSuggestion {
  timestamp: string;
  title: string;
  sectionType: ScriptSectionType;
}

export type ScriptOutputMode = 'OUTLINE' | 'SCRIPT_READY' | 'FULL_NARRATION';

export interface CreatorStudioReport {
  researchRunId: string;
  topic: string;
  targetDurationMinutes: TargetVideoDuration;
  outputMode?: ScriptOutputMode;
  videoAngle: {
    primaryAngle: string;
    narrativeTheme: string;
    targetAudience: string;
    confidenceRating: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  hooks: CreatorHook[];
  titles: CreatorTitle[];
  scriptSections: ScriptSection[];
  talkingPoints: TalkingPoint[];
  factCheckSummary: {
    totalVerified: number;
    totalNeedsContext: number;
    totalConflicted: number;
    totalDoNotSay: number;
  };
  bRollList: BRollSuggestion[];
  benchmarkCards: BenchmarkVisualCard[];
  chapters: ChapterSuggestion[];
  fullNarrationScript?: string;
  qualityReview?: any; // ScriptQualityReviewReport
  scriptVersion?: number;
  rawMarkdownExport: string;
}
