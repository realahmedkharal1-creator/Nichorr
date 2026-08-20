import crypto from "crypto";
import {
  BottleneckAttributionRecord,
  LedgerReconciliationRecord,
  LedgerReconciliationStatus,
} from "./microarchitecture.types";
import { VerifiedResearchLedgerEntry } from "../cross-lab-regression/cross-lab-regression.types";

export class LedgerReconciliationEngine {
  public static reconcileWithLedger(
    attrib: BottleneckAttributionRecord,
    ledgerEntries: VerifiedResearchLedgerEntry[]
  ): LedgerReconciliationRecord {
    if (ledgerEntries.length === 0) {
      return {
        reconciliationId: `mlrc-${crypto.randomBytes(6).toString("hex")}`,
        attributionId: attrib.attributionId,
        attributionType: attrib.attributionType,
        reconciliationStatus: "NEW_EVIDENCE",
        agreementSummary: "No existing Verified Research Ledger entries match this workload. Classified as novel microarchitectural evidence.",
        requiresCalibration: false,
        reconciledAt: new Date().toISOString(),
      };
    }

    const matchingEntry = ledgerEntries[0]; // Primary ledger entry
    let reconciliationStatus: LedgerReconciliationStatus = "SUPPORTED_BY_LEDGER";
    let agreementSummary = `Attribution aligns with verified research ledger finding '${matchingEntry.claimOrFinding}'.`;
    let conflictDetails: string | undefined = undefined;

    if (attrib.attributionType === "THERMAL_LIMITATION" && matchingEntry.confidence > 90) {
      reconciliationStatus = "CONFLICTS_WITH_LEDGER";
      conflictDetails = "Trace indicates thermal degradation, conflicting with validated reference ledger finding.";
      agreementSummary = "Potential contradiction between execution trace and verified reference ledger.";
    }

    const reconciliationId = `mlrc-${crypto
      .createHash("sha256")
      .update(`${attrib.attributionId}:${matchingEntry.ledgerEntryId}`)
      .digest("hex")
      .slice(0, 16)}`;

    return {
      reconciliationId,
      attributionId: attrib.attributionId,
      ledgerEntryId: matchingEntry.ledgerEntryId,
      ledgerClaim: matchingEntry.claimOrFinding,
      attributionType: attrib.attributionType,
      reconciliationStatus,
      agreementSummary,
      conflictDetails,
      requiresCalibration: reconciliationStatus === "CONFLICTS_WITH_LEDGER",
      reconciledAt: new Date().toISOString(),
    };
  }
}
