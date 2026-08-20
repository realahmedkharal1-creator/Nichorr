export interface DistributionPreferences {
  enableDistribution: boolean;
  enableYouTubeLongFormDistribution: boolean;
  enableYouTubeShortsDistribution: boolean;
  enablePodcastDistribution: boolean;
  generateDistributionPackage: boolean;
  runReleasePreflight: boolean;
  enableReleaseScheduling: boolean;
}

export const DEFAULT_DISTRIBUTION_PREFERENCES: DistributionPreferences = {
  enableDistribution: true,
  enableYouTubeLongFormDistribution: true,
  enableYouTubeShortsDistribution: false,
  enablePodcastDistribution: false,
  generateDistributionPackage: true,
  runReleasePreflight: true,
  enableReleaseScheduling: true,
};
