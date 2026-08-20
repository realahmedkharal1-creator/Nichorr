import { ClaimHealthRecord, EvidenceItemHealth } from "../research-health.types";
import {
  AssetDecisionContext,
  DecisionConsequenceExplanation,
  ResearchHealthDecisionType,
  ResearchHealthDecisionSeverity,
} from "./research-health-decision.types";

export class DecisionExplanationEngine {
  /**
   * Generates transparent, deterministic, creator-friendly decision explanations.
   * Grounded exclusively in structured evidence and claim graph records.
   */
  static generateExplanation(
    decisionType: ResearchHealthDecisionType,
    severity: ResearchHealthDecisionSeverity,
    claim?: ClaimHealthRecord,
    evidence?: EvidenceItemHealth,
    affectedAssets: AssetDecisionContext[] = []
  ): DecisionConsequenceExplanation {
    const claimText = claim?.claimText || "General Research Assertion";
    const evidenceExcerpt = evidence?.excerpt || claim?.provenanceChainSummary || "Laboratory benchmark or technical specification.";
    const evidenceAge = evidence?.ageInDays !== null && evidence?.ageInDays !== undefined
      ? `${evidence.ageInDays} days old`
      : "Unknown age (missing execution timestamp)";
    const publisher = evidence?.sourcePublisher || "OEM Datasheet / Lab Benchmark";
    const assetLabels = affectedAssets.map((a) => a.assetLabel);

    switch (decisionType) {
      case 'BLOCK_CREATOR_CONTENT': {
        if (claim?.healthStatus === 'BLOCKED') {
          return {
            headline: "Prohibited Factual Assertion Detected (DO_NOT_SAY)",
            whatHappened: `Claim "${claimText}" is marked with a mandatory DO_NOT_SAY safety blocker.`,
            whyDoesItMatter: "Speaking this statement in video or audio content would broadcast factually debunked or misleading hardware claims to your audience.",
            whichClaimAffected: claimText,
            whichEvidenceCausedIt: evidenceExcerpt,
            whichCreatorAssetsAffected: assetLabels,
            publishingConsequence: "Ready-to-Record and Publishing Preflight gates remain strictly BLOCKED until this claim is removed or replaced.",
            recommendedAction: "Block this claim from all spoken narration, talking points, and on-screen cards.",
            whatWillHappenIfApproved: "The assertion remains isolated and blocked. It will not appear in script exports, teleprompter text, or video descriptions.",
          };
        }

        return {
          headline: "Unbacked Claim Lacks Supporting Evidence",
          whatHappened: `Claim "${claimText}" has 0 supporting evidence items remaining in the verified graph.`,
          whyDoesItMatter: "Presenting unverified hardware numbers or claims without laboratory backing exposes your content to viewer corrections and credibility loss.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: "No valid supporting evidence in research snapshot.",
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Workflow readiness is blocked. Recording cannot proceed safely without evidence backing.",
          recommendedAction: "Recheck primary sources or replace with verified laboratory findings.",
          whatWillHappenIfApproved: "VeritasTech AI will isolate this unbacked claim and prevent it from advancing into teleprompter text.",
        };
      }

      case 'INVESTIGATE_CONFLICT': {
        return {
          headline: "Unresolved Factual Conflict Between Sources",
          whatHappened: `Contradictory findings detected for "${claimText}". Authoritative sources report conflicting results.`,
          whyDoesItMatter: "Comparing hardware without acknowledging conflicting lab results can mislead viewers on real-world performance.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: `${publisher} (${evidenceAge}): ${evidenceExcerpt}`,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Your script or benchmark cards may present one side of a contested hardware result as uncontested fact.",
          recommendedAction: "Review conflicting findings and disclose test condition differences (e.g. ambient thermals, fan profiles).",
          whatWillHappenIfApproved: "VeritasTech AI provides explicit context notes to balance both perspectives in your script outline.",
        };
      }

      case 'REVALIDATE_BENCHMARK':
      case 'REVALIDATE_METHODOLOGY': {
        return {
          headline: "Benchmark Evidence is Aging or Methodology Shifted",
          whatHappened: `Benchmark supporting "${claimText}" is ${evidenceAge} and requires verification against latest driver/firmware revisions.`,
          whyDoesItMatter: "Driver optimizations, BIOS updates, or game patches frequently alter sustained benchmark scores by 5% to 15% over time.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: `${publisher} (${evidenceAge}): ${evidenceExcerpt}`,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Your video may cite outdated benchmark scores that have since been superseded by newer official revisions.",
          recommendedAction: "Revalidate benchmark measurements against current laboratory test standards.",
          whatWillHappenIfApproved: "VeritasTech AI will recheck the primary benchmark database, update the evidence snapshot, and flag affected assets for one-click regeneration review.",
        };
      }

      case 'REVALIDATE_HARDWARE':
      case 'REVALIDATE_SOURCE': {
        return {
          headline: "Hardware Specification or OEM Datasheet Aging",
          whatHappened: `Supporting specification for "${claimText}" is ${evidenceAge}.`,
          whyDoesItMatter: "OEM hardware revisions, regional variant differences, or spec sheet updates can change advertised wattage or clock limits.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: `${publisher} (${evidenceAge}): ${evidenceExcerpt}`,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Creator script sections and spec cards may display outdated SKU or hardware specs.",
          recommendedAction: "Recheck the official OEM datasheet or primary spec sheet.",
          whatWillHappenIfApproved: "VeritasTech AI updates the hardware intelligence record with the latest verified datasheet.",
        };
      }

      case 'REVALIDATE_YOUTUBE': {
        return {
          headline: "YouTube Reviewer Consensus Requires Refresh",
          whatHappened: `Reviewer finding supporting "${claimText}" is ${evidenceAge}. Long-term reviews may have introduced updated verdicts.`,
          whyDoesItMatter: "Initial launch-day reviews often miss long-term thermal throttling, fan curve adjustments, or battery degradation over time.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: `${publisher} (${evidenceAge}): ${evidenceExcerpt}`,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Video hooks and talking points may reflect day-one sentiment that is no longer representative.",
          recommendedAction: "Recheck reviewer consensus across updated long-term reviews.",
          whatWillHappenIfApproved: "VeritasTech AI refreshes the YouTube intelligence graph with the latest consensus findings.",
        };
      }

      case 'REGENERATE_AFFECTED_ASSET':
      case 'REVIEW_AFFECTED_ASSET': {
        return {
          headline: "Creator Assets Affected by Evidence Update",
          whatHappened: `One or more creator assets rely on updated or modified research claims.`,
          whyDoesItMatter: "Script talking points, teleprompter pacing, and benchmark cards should accurately reflect the latest research state.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: evidenceExcerpt,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Assets marked STALE or REVIEW_REQUIRED will produce warnings in Publishing Preflight.",
          recommendedAction: "Approve targeted regeneration of only the affected assets into Script Version N+1.",
          whatWillHappenIfApproved: "Only the affected script sections and cards are updated. Your existing script history and unaffected sections remain 100% intact.",
        };
      }

      case 'MONITOR': {
        return {
          headline: "Evidence is Aging but Production-Ready",
          whatHappened: `Supporting evidence is between 45 and 90 days old. It remains factually valid.`,
          whyDoesItMatter: "Evidence is aging gradually, but no conflicting or superseding revisions have been reported.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: `${publisher} (${evidenceAge}): ${evidenceExcerpt}`,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "Informational warning only. Ready-to-Record gate remains open.",
          recommendedAction: "Monitor research health; no immediate revalidation required before recording.",
          whatWillHappenIfApproved: "Health state is marked as monitored and will alert you if future evidence changes occur.",
        };
      }

      default: {
        return {
          headline: "Research Evidence is Healthy & Valid",
          whatHappened: "All supporting evidence, laboratory benchmarks, and hardware specs are fresh and verified.",
          whyDoesItMatter: "Grounded in authoritative primary OEM whitepapers and independent laboratory results.",
          whichClaimAffected: claimText,
          whichEvidenceCausedIt: evidenceExcerpt,
          whichCreatorAssetsAffected: assetLabels,
          publishingConsequence: "All downstream assets are verified for production recording and multi-platform publishing.",
          recommendedAction: "Proceed with recording. No action required.",
          whatWillHappenIfApproved: "Current production assets remain active and ready to record.",
        };
      }
    }
  }
}
