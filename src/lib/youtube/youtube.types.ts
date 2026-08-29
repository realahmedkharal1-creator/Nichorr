export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  channelTitle: string;
  channelId?: string;
  publishedAt: string;
  url: string;
  duration?: string;
  description?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  dimension?: string;
  query?: string;
}

export interface YouTubeTranscriptSegment {
  segmentId: string;
  videoId: string;
  start: number; // in seconds
  duration: number; // in seconds
  end: number; // in seconds
  text: string;
  formattedTime: string; // e.g. "08:42"
  sequence: number;
}

export type TranscriptStatus = 
  | 'AVAILABLE' 
  | 'TRANSCRIPT_UNAVAILABLE' 
  | 'RETRIEVAL_FAILED' 
  | 'BLOCKED' 
  | 'UNSUPPORTED';

export interface YouTubeTranscriptResult {
  videoId: string;
  status: TranscriptStatus;
  language: string;
  isGenerated: boolean;
  segments: YouTubeTranscriptSegment[];
  fullText: string;
  errorMessage?: string;
  retrievedAt: string;
}

export interface YouTubeCommentItem {
  commentId: string;
  videoId: string;
  author: string;
  text: string;
  likeCount: number;
  publishedAt: string;
  category: 'PROBLEM' | 'QUESTION' | 'PRAISE' | 'EXPERIENCE' | 'NOISE';
  spamScore: number; // 0 (clean) to 1 (definite spam)
  isFiltered: boolean;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export type SignalStrength = 'ISOLATED' | 'EMERGING' | 'RECURRING' | 'STRONG_RECURRING';

export type ProblemCategory = 
  | 'BATTERY_DRAIN' 
  | 'OVERHEATING' 
  | 'THROTTLING' 
  | 'DISPLAY_FLICKER' 
  | 'CAMERA_BUG' 
  | 'SOFTWARE_CRASH' 
  | 'CHARGING_ISSUE' 
  | 'CONNECTIVITY' 
  | 'AUDIO_SPEAKER'
  | 'OTHER';

export interface YouTubeCommentSignal {
  id: string;
  topic: string;
  category: ProblemCategory;
  signalSummary: string;
  signalStrength: SignalStrength;
  commentCount: number;
  sampleComments: Array<{ author: string; text: string; videoId: string }>;
  firstHandLikelihood: 'HIGH' | 'MEDIUM' | 'LOW';
}

export type QuestionCategory = 
  | 'BUYING' 
  | 'VARIANT' 
  | 'PERFORMANCE' 
  | 'BATTERY' 
  | 'COMPATIBILITY' 
  | 'RELIABILITY';

export interface YouTubeAudienceQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  frequency: number;
  importanceScore: number;
  sourceVideoIds: string[];
  sampleCommentTexts: string[];
}

export type DisagreementType = 
  | 'METHODOLOGICAL' 
  | 'HARDWARE_VARIANT' 
  | 'TEST_CONDITION' 
  | 'OPINION' 
  | 'DIRECT_CONTRADICTION';

export interface YouTubeReviewerDisagreement {
  id: string;
  topic: string;
  aspect: string; // e.g. "Sustained Cinebench Thermals"
  reviewers: Array<{
    channel: string;
    videoId: string;
    claim: string;
    timestamp?: string;
    methodologyNotes?: string;
    socVariant?: string;
  }>;
  disagreementType: DisagreementType;
  explanation: string;
  suggestedCreatorAngle: string;
}

export interface YouTubeClaim {
  id: string;
  videoId: string;
  channelTitle: string;
  videoTitle: string;
  claim: string;
  claimType: 'MEASURED_RESULT' | 'CITED_SPEC' | 'REVIEWER_OBSERVATION' | 'REVIEWER_OPINION' | 'SPECULATION';
  timestamp?: string;
  timestampSeconds?: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  hardwareEntity?: string;
  socVariant?: string;
  provenanceUrl: string;
}

export interface YouTubeIntelligenceReport {
  topic: string;
  runId?: string;
  analyzedAt: string;
  videos: YouTubeVideoItem[];
  transcripts: Record<string, YouTubeTranscriptResult>;
  claims: YouTubeClaim[];
  reviewerConsensus: string[];
  reviewerDisagreements: YouTubeReviewerDisagreement[];
  recurringProblems: YouTubeCommentSignal[];
  audienceQuestions: YouTubeAudienceQuestion[];
  coverageGaps: string[];
  contentOpportunities: Array<{
    title: string;
    description: string;
    hook: string;
    targetAudience: string;
  }>;
  /** Honest summary of how many analysed videos yielded a usable transcript. */
  transcriptCoverage: {
    total: number;
    available: number;
    blocked: number;
    unavailable: number;
  };
}
