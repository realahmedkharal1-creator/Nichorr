export type TimelineMarkerCategory = 
  | 'HOOK'
  | 'SCRIPT_SECTION'
  | 'BROLL'
  | 'BENCHMARK'
  | 'THERMAL'
  | 'CHAPTER'
  | 'VERSUS_COMPARISON'
  | 'VERDICT';

export type TimelineMarkerColor = 
  | 'RED' 
  | 'GREEN' 
  | 'BLUE' 
  | 'CYAN' 
  | 'MAGENTA' 
  | 'YELLOW' 
  | 'ORANGE';

export interface CreatorTimelineMarker {
  id: string;
  markerNumber: number;
  timestampSeconds: number;
  timecode: string; // e.g. "00:01:23:00"
  durationSeconds: number;
  label: string;
  description?: string;
  category: TimelineMarkerCategory;
  color?: TimelineMarkerColor;
  sourceIds?: string[];
  claimIds?: string[];
  evidenceIds?: string[];
  provenanceRef?: string;
  isEvidenceGrounded: boolean;
}

export interface TimelineExportOptions {
  format: 'EDL' | 'FCPXML';
  fps?: number; // default 24
  includeSections?: boolean;
  includeBRoll?: boolean;
  includeBenchmarkCards?: boolean;
  includeChapters?: boolean;
  includeThermals?: boolean;
}

export interface TimelineExportSummary {
  totalMarkers: number;
  durationSeconds: number;
  formattedDuration: string;
  sectionMarkersCount: number;
  bRollMarkersCount: number;
  benchmarkMarkersCount: number;
  chapterMarkersCount: number;
  evidenceLinkedCount: number;
}

export interface TimelineExportResult {
  format: 'EDL' | 'FCPXML';
  fileName: string;
  mimeType: string;
  content: string;
  summary: TimelineExportSummary;
  markers: CreatorTimelineMarker[];
}
