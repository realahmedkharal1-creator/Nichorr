import crypto from "crypto";
import {
  ResearchHypothesis,
  HypothesisDomain,
  EvidenceSourceType,
} from "./hypothesis.types";

export class HypothesisRegistryEngine {
  public static createHypothesis(params: {
    userId: string;
    researchRunId: string;
    title: string;
    statement: string;
    domain: HypothesisDomain;
    sourceType?: EvidenceSourceType;
    originatingPhase?: string;
    originatingEntityId?: string;
    priorConfidence?: number;
    assumptions?: string[];
    expectedObservations?: string[];
    disconfirmingObservations?: string[];
  }): ResearchHypothesis {
    const title = params.title;
    const statement = params.statement;
    const normalizedStatement = statement.trim().toLowerCase();
    const domain = params.domain || "MICROARCHITECTURAL";
    const sourceType = params.sourceType || "MICROARCHITECTURAL_ATTRIBUTION";
    const originatingPhase = params.originatingPhase || "Phase 93";
    const originatingEntityId = params.originatingEntityId || "matt-default";
    const priorConfidence = params.priorConfidence || 50;

    const rawPayload = JSON.stringify({
      userId: params.userId,
      researchRunId: params.researchRunId,
      normalizedStatement,
      domain,
      sourceType,
      originatingEntityId,
    });

    const snapshotHash = crypto.createHash("sha256").update(rawPayload).digest("hex");
    const hypothesisId = `hyp-${snapshotHash.slice(0, 16)}`;

    return {
      hypothesisId,
      userId: params.userId,
      researchRunId: params.researchRunId,
      title,
      statement,
      normalizedStatement,
      domain,
      sourceType,
      originatingPhase,
      originatingEntityId,
      priorConfidence,
      currentConfidence: priorConfidence,
      confidenceBand: "MODERATE",
      confidenceFactors: ["Initial prior formulated from empirical microarchitectural attribution."],
      falsificationStrength: "INSUFFICIENT",
      causalStatus: false, // Strict non-causal default
      status: "FORMULATED",
      assumptions: params.assumptions || [
        "VRAM GDDR7 bus frequency scales linearly with shader compute load.",
        "No severe GPU junction thermal throttling occurs below 88°C.",
      ],
      expectedObservations: params.expectedObservations || [
        "Overclocking VRAM memory clocks yields > 10% framerate increase in 4K RT.",
        "L2 Cache hit rate remains invariant under increased memory bus clocks.",
      ],
      disconfirmingObservations: params.disconfirmingObservations || [
        "VRAM memory frequency overclock yields < 2% performance scaling in 4K RT.",
        "Increasing compute shader clock frequency delivers > 15% scaling without memory alteration.",
      ],
      supportingEvidenceIds: [],
      contradictoryEvidenceIds: [],
      compatibleEvidenceIds: [],
      unresolvedEvidenceIds: [],
      competingHypothesisIds: [],
      activeConfounders: [],
      requiredValidationTasks: [],
      completedValidationTasks: [],
      snapshotHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public static createDefaultHypotheses(userId: string, researchRunId: string): ResearchHypothesis[] {
    const h1 = this.createHypothesis({
      userId,
      researchRunId,
      title: "H1: Memory Bandwidth Saturation in 4K Ray Tracing Overdrive",
      statement: "The observed 18.4% frame time degradation on RTX 5090 B0 stepping is primarily caused by memory bus arbitration stalls during BVH ray traversal.",
      domain: "MEMORY",
      sourceType: "MICROARCHITECTURAL_ATTRIBUTION",
      originatingPhase: "Phase 93",
      originatingEntityId: "matt-5090-mem-01",
      priorConfidence: 72,
    });

    const h2 = this.createHypothesis({
      userId,
      researchRunId,
      title: "H2: L2 Cache Capacity Contention Under High-Resolution Shading",
      statement: "The frame time regression is driven by high L2 texture cache eviction rates rather than off-chip DRAM bus saturation.",
      domain: "CACHE",
      sourceType: "CO_DESIGN_SIMULATION",
      originatingPhase: "Phase 94",
      originatingEntityId: "cdsim-5090-l2-01",
      priorConfidence: 48,
    });

    const h3 = this.createHypothesis({
      userId,
      researchRunId,
      title: "H3: Kernel Driver Dispatch Overhead on Windows 11 24H2",
      statement: "DirectX 12 API execution queue serialization creates pipeline bubbles unrelated to GPU hardware memory limits.",
      domain: "DRIVER",
      sourceType: "EMPIRICAL_SYNTHESIS",
      originatingPhase: "Phase 92",
      originatingEntityId: "xreg-cp2077-drv-01",
      priorConfidence: 35,
    });

    return [h1, h2, h3];
  }
}
