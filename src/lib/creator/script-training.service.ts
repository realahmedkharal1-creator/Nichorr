import {
  CreatorScriptTrainingProfile,
  ScriptTrainingSample,
  DEFAULT_SCRIPT_TRAINING_PROFILE,
} from "./script-training.types";
import { CentralCacheProvider } from "@/lib/cache/cache-provider";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

const globalForTrainingProfiles = globalThis as unknown as {
  scriptTrainingProfiles: Map<string, CreatorScriptTrainingProfile> | undefined;
};

const profileStore = globalForTrainingProfiles.scriptTrainingProfiles ?? new Map<string, CreatorScriptTrainingProfile>();
if (process.env.NODE_ENV !== "production") {
  globalForTrainingProfiles.scriptTrainingProfiles = profileStore;
}

export class ScriptTrainingService {
  private static CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Retrieves the script training profile for a specific user.
   * If none exists, returns undefined (or fallback if requested).
   */
  static getProfile(userId: string = "anonymous-creator"): CreatorScriptTrainingProfile | undefined {
    const cacheKey = `script_profile_${userId}`;
    const cached = CentralCacheProvider.get<CreatorScriptTrainingProfile>(cacheKey);
    if (cached) return cached;

    const inMemory = profileStore.get(userId);
    if (inMemory) {
      CentralCacheProvider.set(cacheKey, inMemory, this.CACHE_TTL_MS);
      return inMemory;
    }

    return undefined;
  }

  /**
   * Retrieves or creates a default profile for the user.
   */
  static getOrCreateProfile(userId: string = "anonymous-creator"): CreatorScriptTrainingProfile {
    const existing = this.getProfile(userId);
    if (existing) return existing;

    const newProfile: CreatorScriptTrainingProfile = {
      ...DEFAULT_SCRIPT_TRAINING_PROFILE,
      profileId: `profile-${userId}`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveProfile(newProfile);
    return newProfile;
  }

  /**
   * Saves or updates a creator's script training profile with strict user isolation.
   */
  static saveProfile(profile: CreatorScriptTrainingProfile): CreatorScriptTrainingProfile {
    const updated: CreatorScriptTrainingProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };

    profileStore.set(profile.userId, updated);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("profileStore", "Artifact", profile.userId, updated).catch(e => console.warn(e));
    CentralCacheProvider.set(`script_profile_${profile.userId}`, updated, this.CACHE_TTL_MS);
    return updated;
  }

  /**
   * Adds a sample script to the creator's training profile.
   */
  static addSampleScript(
    userId: string,
    sample: Omit<ScriptTrainingSample, "id" | "createdAt">
  ): CreatorScriptTrainingProfile {
    const profile = this.getOrCreateProfile(userId);
    const newSample: ScriptTrainingSample = {
      ...sample,
      id: `sample-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    profile.sampleScripts.push(newSample);
    return this.saveProfile(profile);
  }

  /**
   * Removes a sample script by ID from the creator's profile.
   */
  static removeSampleScript(userId: string, sampleId: string): CreatorScriptTrainingProfile {
    const profile = this.getOrCreateProfile(userId);
    profile.sampleScripts = profile.sampleScripts.filter((s) => s.id !== sampleId);
    return this.saveProfile(profile);
  }

  /**
   * Applies script style instructions and vocabulary while strictly preserving factual evidence.
   */
  static applyStyleGuards(
    text: string,
    profile?: CreatorScriptTrainingProfile
  ): string {
    if (!profile) return text;

    let sanitized = text;

    // Filter out forbidden phrases
    if (profile.forbiddenPhrases && profile.forbiddenPhrases.length > 0) {
      for (const phrase of profile.forbiddenPhrases) {
        if (!phrase || phrase.trim().length === 0) continue;
        const regex = new RegExp(`\\b${phrase.trim()}\\b`, "gi");
        sanitized = sanitized.replace(regex, "[substantiated finding]");
      }
    }

    return sanitized;
  }
}
