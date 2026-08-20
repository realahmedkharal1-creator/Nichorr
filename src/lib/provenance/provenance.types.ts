export type ProvenanceNodeType = 
  | 'TALKING_POINT'
  | 'TITLE_HOOK'
  | 'CLAIM' 
  | 'EVIDENCE' 
  | 'BENCHMARK_RECORD' 
  | 'YOUTUBE_TRANSCRIPT' 
  | 'SOURCE';

export type AuthorityTier = 
  | 'TIER_1_PRIMARY'          // OEM/Manufacturer (Apple, Samsung, Intel, Nvidia)
  | 'TIER_2_INDEPENDENT_LAB'   // Independent Lab (Notebookcheck, AnandTech, Gamers Nexus, Puget Systems, Primate Labs)
  | 'TIER_3_SECONDARY'        // Secondary Tech Media (The Verge, TechRadar, Tom's Hardware news)
  | 'TIER_4_COMMUNITY';        // First-hand community / User forums (Reddit, XDA, MacRumors)

export type ProvenanceRelationship = 
  | 'DERIVED_FROM' 
  | 'MEASURED_BY' 
  | 'CITED_IN' 
  | 'CONTRADICTS' 
  | 'CONFIRMS';

export interface ProvenanceNode {
  id: string;
  type: ProvenanceNodeType;
  label: string;
  detail: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';
  sourceUrl?: string;
  publisher?: string;
  timestampRef?: string;
  authorityTier?: AuthorityTier;
  independenceScore?: number; // 0 to 10 scale
  isSyndicated?: boolean;
}

export interface ProvenanceEdge {
  id: string;
  fromId: string;
  toId: string;
  relationship: ProvenanceRelationship;
  label?: string;
}

export interface ProvenanceLineageChain {
  chainId: string;
  talkingPointId: string;
  talkingPointStatement: string;
  claimId: string;
  claimText: string;
  evidenceId: string;
  evidenceExcerpt: string;
  benchmarkOrTranscriptRef?: {
    type: 'BENCHMARK' | 'YOUTUBE_TRANSCRIPT';
    name: string;
    metricOrTimestamp: string;
    scoreOrText: string;
  };
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  publisher: string;
  authorityTier: AuthorityTier;
  independenceScore: number;
  verificationStatus: 'VERIFIED' | 'NEEDS_CONTEXT' | 'UNBACKED';
  isSyndicated: boolean;
}

export interface SourceAuthoritySummary {
  tier1PrimaryCount: number;
  tier2IndependentLabCount: number;
  tier3SecondaryCount: number;
  tier4CommunityCount: number;
  syndicatedCount: number;
  averageIndependenceScore: number;
}

export interface ResearchProvenanceReport {
  runId: string;
  topic: string;
  generatedAt: string;
  overallGroundingScore: number; // 0 to 100%
  totalTalkingPoints: number;
  verifiedChainsCount: number;
  unbackedChainsCount: number;
  sourceAuthoritySummary: SourceAuthoritySummary;
  lineageChains: ProvenanceLineageChain[];
  nodes: ProvenanceNode[];
  edges: ProvenanceEdge[];
  citationProofSheetMarkdown: string;
}
