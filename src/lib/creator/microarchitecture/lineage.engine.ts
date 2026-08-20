import crypto from "crypto";
import {
  HardwareExecutionTrace,
  BottleneckAttributionRecord,
  PhysicalReconciliationRecord,
  LedgerReconciliationRecord,
  MicroarchitectureLineageTrace,
  MicroarchitectureLineageLink,
} from "./microarchitecture.types";

export class MicroarchitectureLineageEngine {
  public static generateTrace(
    trace: HardwareExecutionTrace,
    attrib: BottleneckAttributionRecord,
    physRec?: PhysicalReconciliationRecord,
    ledgerRec?: LedgerReconciliationRecord
  ): MicroarchitectureLineageTrace {
    const lineageId = `mlin-${crypto
      .createHash("sha256")
      .update(attrib.attributionId)
      .digest("hex")
      .slice(0, 16)}`;

    const stages: MicroarchitectureLineageLink[] = [
      {
        stage: "1. SOURCE TRACE",
        title: "Hardware Execution PMU Trace Ingestion",
        detail: `Captured hardware trace from ${trace.hardwareTarget} (${trace.cpuModel} / ${trace.gpuModel}) under workload ${trace.benchmarkSuite}.`,
        status: trace.sourceState === "AVAILABLE" ? "VERIFIED" : "BLOCKED",
        metadata: {
          traceId: trace.traceId,
          sourceType: trace.sourceType,
          countersCount: Object.keys(trace.rawCounters || {}).length,
        },
      },
      {
        stage: "2. TRACE NORMALIZATION",
        title: "Canonical Trace Event Normalization",
        detail: "Normalized raw PMU counters into standard instruction, cycle, cache, and stall metrics.",
        status: "VERIFIED",
        metadata: {
          siliconFingerprint: trace.siliconFingerprint,
          methodologyFingerprint: trace.methodologyFingerprint,
        },
      },
      {
        stage: "3. STALL DECOMPOSITION",
        title: "Microarchitectural Stall Category Decomposition",
        detail: `Decomposed stall cycles across Frontend, Memory, Core, Cache, and Branch subsystems. Dominant category: ${attrib.primaryStallCategory}.`,
        status: "VERIFIED",
        metadata: {
          primaryStallCategory: attrib.primaryStallCategory,
        },
      },
      {
        stage: "4. BOTTLENECK ATTRIBUTION",
        title: "Observed Bottleneck Signal Attribution",
        detail: `Attributed strongest observed signal as '${attrib.attributionType}' with confidence ${attrib.confidence}%. Non-causal default enforced.`,
        status: "VERIFIED",
        metadata: {
          attributionType: attrib.attributionType,
          confidence: attrib.confidence,
          isCausallyEstablished: attrib.isCausallyEstablished,
        },
      },
      {
        stage: "5. PHYSICAL / LEDGER RECONCILIATION",
        title: "Physical Evidence & Verified Ledger Reconciliation",
        detail: ledgerRec
          ? `Reconciled with Verified Research Ledger (${ledgerRec.reconciliationStatus}): ${ledgerRec.agreementSummary}`
          : "Reconciled with physical testbench empirical score.",
        status: ledgerRec?.reconciliationStatus === "CONFLICTS_WITH_LEDGER" ? "CONFOUNDED" : "VERIFIED",
        metadata: {
          ledgerReconciliationStatus: ledgerRec?.reconciliationStatus,
          physicalReconciliationStatus: physRec?.reconciliationStatus,
        },
      },
      {
        stage: "6. RESEARCH VALIDATION PATH",
        title: "Phase 86 Closed-Loop Calibration Routing",
        detail: "Structured research calibration opportunity available for explicit human/laboratory verification.",
        status: "EVALUATED",
        metadata: {
          attributionId: attrib.attributionId,
        },
      },
    ];

    const exclusions = attrib.contradictingSignals.length > 0
      ? attrib.contradictingSignals.map((s) => `Excluded from direct causal attribution: ${s}`)
      : [];

    return {
      lineageId,
      attributionOrOpportunityId: attrib.attributionId,
      researchRunId: trace.researchRunId,
      userId: trace.userId,
      stages,
      exclusions,
      generatedAt: new Date().toISOString(),
    };
  }
}
