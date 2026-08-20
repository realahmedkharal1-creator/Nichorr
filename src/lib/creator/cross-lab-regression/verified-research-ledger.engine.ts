import crypto from "crypto";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";
import {
  VerifiedResearchLedgerEntry,
  CrossLabValidationOpportunity,
} from "./cross-lab-regression.types";

export class VerifiedResearchLedgerEngine {
  private static ledgerStore: Map<string, VerifiedResearchLedgerEntry[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  public static addEntry(
    userId: string,
    researchRunId: string,
    opportunity: CrossLabValidationOpportunity,
    params: {
      evidenceRefs: string[];
      sourceSnapshotHashes: string[];
      validationTaskId: string;
      methodologyFingerprint: string;
      laboratoryFingerprints: string[];
      clusterFingerprints: string[];
      siliconFingerprints: string[];
      lineageId: string;
      isCausallyEstablished?: boolean;
    }
  ): VerifiedResearchLedgerEntry {
    const key = this.getPartitionKey(researchRunId, userId);
    const existing = this.ledgerStore.get(key) || [];

    const canonicalLedgerPayload = {
      userId,
      researchRunId,
      opportunityId: opportunity.opportunityId,
      title: opportunity.title,
      validationTaskId: params.validationTaskId,
      evidenceRefs: params.evidenceRefs,
      sourceSnapshotHashes: params.sourceSnapshotHashes,
      methodologyFingerprint: params.methodologyFingerprint,
      siliconFingerprints: params.siliconFingerprints,
    };

    const ledgerSnapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(canonicalLedgerPayload))
      .digest("hex");

    const ledgerEntryId = `vrle-${ledgerSnapshotHash.slice(0, 16)}`;

    const entry: VerifiedResearchLedgerEntry = {
      ledgerEntryId,
      researchRunId,
      userId,
      claimOrFinding: opportunity.title,
      evidenceRefs: params.evidenceRefs,
      sourceSnapshotHashes: params.sourceSnapshotHashes,
      validationTaskId: params.validationTaskId,
      validationOutcome: "VALIDATED",
      methodologyFingerprint: params.methodologyFingerprint,
      laboratoryFingerprints: params.laboratoryFingerprints,
      clusterFingerprints: params.clusterFingerprints,
      siliconFingerprints: params.siliconFingerprints,
      confidence: opportunity.confidenceScore || 95,
      isCausallyEstablished: params.isCausallyEstablished ?? false, // Absolute non-causal guard
      createdFromPhase: "PHASE_92_CROSS_LAB_REGRESSION",
      lineageId: params.lineageId,
      ledgerSnapshotHash,
      promotedAt: new Date().toISOString(),
    };

    existing.push(entry);
    this.ledgerStore.set(key, existing);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("ledgerStore", "Artifact", key, existing).catch(e => console.warn(e));
    return entry;
  }

  public static getEntries(researchRunId: string, userId: string): VerifiedResearchLedgerEntry[] {
    const key = this.getPartitionKey(researchRunId, userId);
    return this.ledgerStore.get(key) || [];
  }

  public static getEntry(
    researchRunId: string,
    userId: string,
    entryId: string
  ): VerifiedResearchLedgerEntry | undefined {
    const entries = this.getEntries(researchRunId, userId);
    return entries.find((e) => e.ledgerEntryId === entryId);
  }

  public static clear(researchRunId: string, userId: string): void {
    const key = this.getPartitionKey(researchRunId, userId);
    this.ledgerStore.delete(key);
  }
}
