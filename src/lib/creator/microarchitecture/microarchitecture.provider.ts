import crypto from "crypto";
import {
  HardwareExecutionTrace,
  NormalizedTraceEvents,
  StallDecompositionRecord,
  BottleneckAttributionRecord,
  CrossGenerationComparison,
  PhysicalReconciliationRecord,
  LedgerReconciliationRecord,
  MicroarchitectureResearchOpportunity,
  MicroarchitectureSnapshot,
  MicroarchitectureLineageTrace,
} from "./microarchitecture.types";
import { TraceIngestionEngine } from "./trace-ingestion.engine";
import { TraceNormalizationEngine } from "./trace-normalization.engine";
import { StallDecompositionEngine } from "./stall-decomposition.engine";
import { BottleneckAttributionEngine } from "./bottleneck-attribution.engine";
import { CrossGenerationEngine } from "./cross-generation.engine";
import { PhysicalReconciliationEngine } from "./physical-reconciliation.engine";
import { LedgerReconciliationEngine } from "./ledger-reconciliation.engine";
import { MicroarchitectureOpportunityEngine } from "./research-opportunity.engine";
import { MicroarchitectureValidationBridge } from "./validation.engine";
import { MicroarchitectureLineageEngine } from "./lineage.engine";
import { MicroarchitectureSnapshotEngine } from "./microarchitecture.snapshot";
import { MicroarchitectureAuditService } from "./microarchitecture.audit";
import { VerifiedResearchLedgerEngine } from "../cross-lab-regression/verified-research-ledger.engine";
import { CreatorIntelligenceRepo } from "@/lib/database/repositories/creator-intelligence.repo";

export class MicroarchitectureProvider {
  private static traceStore: Map<string, HardwareExecutionTrace[]> = new Map();
  private static opportunityStore: Map<string, MicroarchitectureResearchOpportunity[]> = new Map();

  private static getPartitionKey(researchRunId: string, userId: string): string {
    return `${userId}:${researchRunId}`;
  }

  private static initializeStateIfMissing(researchRunId: string, userId: string) {
    const key = this.getPartitionKey(researchRunId, userId);
    let traces = this.traceStore.get(key);
    let opps = this.opportunityStore.get(key);

    if (!traces) {
      // Trace 1: RTX 5090 Stepping B0 Flagship Trace
      const trace1 = TraceIngestionEngine.ingestTrace({
        userId,
        researchRunId,
        sourceType: "PMU_HARDWARE_COUNTERS",
        sourceState: "AVAILABLE",
        hardwareTarget: "AMD Ryzen 9 9950X / NVIDIA GeForce RTX 5090 (B0)",
        cpuModel: "Ryzen 9 9950X",
        cpuStepping: "B0",
        gpuModel: "GeForce RTX 5090",
        gpuArchitecture: "Blackwell",
        driverVersion: "GeForce 565.90",
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        workload: "Ray Tracing Overdrive Benchmark",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        renderingApi: "DirectX 12",
        powerLimitWatts: 500,
        observedPowerWatts: 440,
        observedTemperatureCelsius: 65,
        observedClockGhz: 2.85,
        rawCounters: {
          cycles: 2850000000,
          instructions: 5700000000,
          frontend_stalls: 420000000,
          backend_stalls: 1425000000,
          memory_stalls: 855000000,
          core_stalls: 570000000,
          l1_cache_misses: 28500000,
          l2_cache_misses: 14250000,
          l3_cache_misses: 8550000,
          branch_mispredictions: 5700000,
          gpu_compute_utilization: 94,
          gpu_memory_bandwidth_utilization: 88,
          gpu_warp_occupancy: 82,
        },
      });

      // Trace 2: RTX 5090 Stepping A1 Early Sample Trace
      const trace2 = TraceIngestionEngine.ingestTrace({
        userId,
        researchRunId,
        sourceType: "PMU_HARDWARE_COUNTERS",
        sourceState: "AVAILABLE",
        hardwareTarget: "AMD Ryzen 9 9950X / NVIDIA GeForce RTX 5090 (A1)",
        cpuModel: "Ryzen 9 9950X",
        cpuStepping: "A1",
        gpuModel: "GeForce RTX 5090",
        gpuArchitecture: "Blackwell",
        driverVersion: "GeForce 565.70",
        benchmarkSuite: "Cyberpunk 2077 (4K Ultra RT)",
        workload: "Ray Tracing Overdrive Benchmark",
        resolution: "3840x2160",
        preset: "Ray Tracing Overdrive",
        renderingApi: "DirectX 12",
        powerLimitWatts: 500,
        observedPowerWatts: 455,
        observedTemperatureCelsius: 71,
        observedClockGhz: 2.75,
        rawCounters: {
          cycles: 2750000000,
          instructions: 5225000000,
          frontend_stalls: 550000000,
          backend_stalls: 1512500000,
          memory_stalls: 990000000,
          core_stalls: 522500000,
          l1_cache_misses: 33000000,
          l2_cache_misses: 16500000,
          l3_cache_misses: 11000000,
          branch_mispredictions: 8250000,
          gpu_compute_utilization: 89,
          gpu_memory_bandwidth_utilization: 92,
          gpu_warp_occupancy: 76,
        },
      });

      traces = [trace1, trace2];
      this.traceStore.set(key, traces);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("traceStore", "Artifact", key, traces).catch(e => console.warn(e));

      MicroarchitectureAuditService.log(
        userId,
        researchRunId,
        "TRACE_REGISTERED",
        trace1.traceId,
        "creator-system",
        "Initialized Phase 93 microarchitectural trace analysis workspace."
      );
    }

    return { traces, opps };
  }

  public static getState(researchRunId: string, userId: string) {
    const { traces } = this.initializeStateIfMissing(researchRunId, userId);

    // 1. Normalize traces and decompose stalls
    const normalizedList: { trace: HardwareExecutionTrace; norm: NormalizedTraceEvents; stalls: StallDecompositionRecord[] }[] = [];
    const attributions: BottleneckAttributionRecord[] = [];

    for (const trace of traces) {
      const norm = TraceNormalizationEngine.normalizeTrace(trace);
      const stalls = StallDecompositionEngine.decomposeStalls(trace, norm);
      const attrib = BottleneckAttributionEngine.attributeBottleneck(trace, norm, stalls);
      normalizedList.push({ trace, norm, stalls });
      attributions.push(attrib);
    }

    // 2. Cross-generation comparison
    const comparisons: CrossGenerationComparison[] = [];
    if (traces.length >= 2) {
      const comp = CrossGenerationEngine.compareTraces(
        traces[1],
        attributions[1],
        traces[0],
        attributions[0]
      );
      comparisons.push(comp);
    }

    // 3. Physical reconciliations
    const physicalReconciliations: PhysicalReconciliationRecord[] = [];
    if (traces[0] && attributions[0]) {
      const rec = PhysicalReconciliationEngine.reconcileTraceWithPhysicalScore(
        traces[0],
        attributions[0],
        112.5,
        "fps"
      );
      physicalReconciliations.push(rec);
    }

    // 4. Verified ledger reconciliations
    const ledgerEntries = VerifiedResearchLedgerEngine.getEntries(researchRunId, userId);
    const ledgerReconciliations: LedgerReconciliationRecord[] = [];
    if (attributions[0]) {
      const lRec = LedgerReconciliationEngine.reconcileWithLedger(attributions[0], ledgerEntries);
      ledgerReconciliations.push(lRec);
    }

    // 5. Research opportunities
    const opps = MicroarchitectureOpportunityEngine.generateOpportunities({
      userId,
      researchRunId,
      attributions,
      comparisons,
      ledgerReconciliations,
    });

    this.opportunityStore.set(this.getPartitionKey(researchRunId, userId), opps);

    // 6. Snapshot
    const snapshot = MicroarchitectureSnapshotEngine.createSnapshot(
      userId,
      researchRunId,
      traces,
      attributions,
      comparisons,
      physicalReconciliations,
      ledgerReconciliations,
      opps
    );

    // 7. Audit history
    const history = MicroarchitectureAuditService.getLedger(researchRunId, userId);

    return {
      traces,
      normalizedList,
      attributions,
      comparisons,
      physicalReconciliations,
      ledgerReconciliations,
      opportunities: opps,
      snapshot,
      history,
    };
  }

  public static addTrace(
    researchRunId: string,
    userId: string,
    params: Partial<HardwareExecutionTrace>
  ): HardwareExecutionTrace {
    const { traces } = this.initializeStateIfMissing(researchRunId, userId);
    const key = this.getPartitionKey(researchRunId, userId);

    const trace = TraceIngestionEngine.ingestTrace({
      userId,
      researchRunId,
      ...params,
    });

    traces.push(trace);
    this.traceStore.set(key, traces);
    // Background persist to PostgreSQL
    CreatorIntelligenceRepo.saveArtifact("traceStore", "Artifact", key, traces).catch(e => console.warn(e));

    MicroarchitectureAuditService.log(
      userId,
      researchRunId,
      "TRACE_REGISTERED",
      trace.traceId,
      "creator-lead",
      `Registered hardware execution trace for ${trace.hardwareTarget}.`
    );

    return trace;
  }

  public static validateOpportunity(
    researchRunId: string,
    userId: string,
    opportunityId: string
  ) {
    const state = this.getState(researchRunId, userId);
    const opp = state.opportunities.find((o) => o.opportunityId === opportunityId);

    if (!opp) {
      return { success: false, message: "Opportunity not found." };
    }

    return MicroarchitectureValidationBridge.bridgeOpportunityToCalibration(opp, userId, researchRunId);
  }

  public static getLineage(
    researchRunId: string,
    userId: string,
    attributionId: string
  ): MicroarchitectureLineageTrace | null {
    const state = this.getState(researchRunId, userId);
    const attrib = state.attributions.find((a) => a.attributionId === attributionId) || state.attributions[0];
    if (!attrib) return null;

    const trace = state.traces.find((t) => t.traceId === attrib.traceId) || state.traces[0];
    const physRec = state.physicalReconciliations[0];
    const ledgerRec = state.ledgerReconciliations[0];

    return MicroarchitectureLineageEngine.generateTrace(trace, attrib, physRec, ledgerRec);
  }
}
