export interface CreatorProductionPreferences {
  generateScript: boolean;
  generateHooks: boolean;
  generateTitles: boolean;
  generateTalkingPoints: boolean;
  generateBRoll: boolean;
  generateBenchmarkCards: boolean;
  generateChapters: boolean;
  enableTeleprompter: boolean;
  generateTimelineMarkers: boolean;
  // Phase 71: Publishing & Multi-Platform Delivery Toggles
  enableYouTubeLongForm?: boolean;
  enableYouTubeShorts?: boolean;
  enablePodcast?: boolean;
  generateThumbnailCopy?: boolean;
  generatePlatformMetadata?: boolean;
  generateShortsAdaptation?: boolean;
  generatePodcastAdaptation?: boolean;
  runAudioPreflight?: boolean;
  runVideoPreflight?: boolean;
  // Phase 72: Video Editor Integration & Timeline Sync Toggles
  enableTimelineSync?: boolean;
  enableTimelineImport?: boolean;
  enableTimelineExport?: boolean;
  enableMarkerSync?: boolean;
  enableChapterSync?: boolean;
  enableScriptSectionSync?: boolean;
  enableBRollMarkerSync?: boolean;
  enableBenchmarkMarkerSync?: boolean;
  enableProvenanceMarkerMetadata?: boolean;
  enableAutomaticStaleDetection?: boolean;
  enableSyncPreview?: boolean;
  enableConflictDetection?: boolean;
  // Phase 73: Research Change Detection & Impact Intelligence Toggles
  enableResearchChangeDetection?: boolean;
  enableImpactAlerts?: boolean;
  enableTargetedRegeneration?: boolean;
  // Phase 74: Evidence Freshness & Claim Health Toggles
  enableEvidenceHealthAudit?: boolean;
  enableClaimHealthChecks?: boolean;
  enableRevalidationPlanning?: boolean;
  enableTargetedRevalidation?: boolean;
  // Phase 76: Distribution Pipeline & Release Staging Toggles
  enableDistribution?: boolean;
  enableYouTubeLongFormDistribution?: boolean;
  enableYouTubeShortsDistribution?: boolean;
  enablePodcastDistribution?: boolean;
  generateDistributionPackage?: boolean;
  runReleasePreflight?: boolean;
  enableReleaseScheduling?: boolean;
}

export const DEFAULT_PRODUCTION_PREFERENCES: CreatorProductionPreferences = {
  generateScript: true,
  generateHooks: true,
  generateTitles: true,
  generateTalkingPoints: true,
  generateBRoll: true,
  generateBenchmarkCards: true,
  generateChapters: true,
  enableTeleprompter: true,
  generateTimelineMarkers: true,
  // Phase 71 defaults
  enableYouTubeLongForm: true,
  enableYouTubeShorts: false,
  enablePodcast: false,
  generateThumbnailCopy: true,
  generatePlatformMetadata: true,
  generateShortsAdaptation: true,
  generatePodcastAdaptation: true,
  runAudioPreflight: true,
  runVideoPreflight: true,
  // Phase 76 defaults
  enableDistribution: true,
  enableYouTubeLongFormDistribution: true,
  enableYouTubeShortsDistribution: false,
  enablePodcastDistribution: false,
  generateDistributionPackage: true,
  runReleasePreflight: true,
  enableReleaseScheduling: true,
  // Phase 72 defaults
  enableTimelineSync: true,
  enableTimelineImport: true,
  enableTimelineExport: true,
  enableMarkerSync: true,
  enableChapterSync: true,
  enableScriptSectionSync: true,
  enableBRollMarkerSync: true,
  enableBenchmarkMarkerSync: true,
  enableProvenanceMarkerMetadata: true,
  enableAutomaticStaleDetection: true,
  enableSyncPreview: true,
  enableConflictDetection: true,
  // Phase 73 defaults
  enableResearchChangeDetection: true,
  enableImpactAlerts: true,
  enableTargetedRegeneration: true,
  // Phase 74 defaults
  enableEvidenceHealthAudit: true,
  enableClaimHealthChecks: true,
  enableRevalidationPlanning: true,
  enableTargetedRevalidation: true,
};

export interface ProductionAssetDefinition {
  id: keyof CreatorProductionPreferences;
  name: string;
  description: string;
  category: 'SCRIPT' | 'PACKAGING' | 'VISUALS' | 'WORKFLOW';
  dependsOn?: Array<keyof CreatorProductionPreferences>;
}

export const PRODUCTION_ASSET_DEFINITIONS: ProductionAssetDefinition[] = [
  {
    id: 'generateScript',
    name: 'Full Script Outline',
    description: 'Evidence-grounded creator script with pacing and goal framing',
    category: 'SCRIPT',
  },
  {
    id: 'generateHooks',
    name: 'Opening Hooks',
    description: '6-category evidence-backed high-retention video hooks',
    category: 'PACKAGING',
  },
  {
    id: 'generateTitles',
    name: 'High-CTR Titles',
    description: 'Evidence-aware title options across curiosity and comparison styles',
    category: 'PACKAGING',
  },
  {
    id: 'generateTalkingPoints',
    name: 'Talking Points',
    description: 'Fact-checked points with provenance and safety guards',
    category: 'SCRIPT',
  },
  {
    id: 'generateBRoll',
    name: 'B-Roll Shot Plan',
    description: 'Section-specific visual plan and split-screen gameplay cues',
    category: 'VISUALS',
  },
  {
    id: 'generateBenchmarkCards',
    name: 'Benchmark Visual Cards',
    description: 'Editor-ready benchmark scorecards and delta graphics',
    category: 'VISUALS',
  },
  {
    id: 'generateChapters',
    name: 'YouTube Chapters',
    description: 'Paste-ready video description timestamps',
    category: 'PACKAGING',
  },
  {
    id: 'enableTeleprompter',
    name: 'Creator Teleprompter',
    description: 'Full-screen auto-scrolling reading workspace with safety warnings',
    category: 'WORKFLOW',
    dependsOn: ['generateScript'],
  },
  {
    id: 'generateTimelineMarkers',
    name: 'Editor Timeline Markers (EDL / FCPXML)',
    description: 'Export timeline markers for DaVinci Resolve & Premiere Pro',
    category: 'WORKFLOW',
  },
];
