import crypto from "crypto";
import { MicroarchitectureSimulation } from "./testbench.types";

export class MicroarchitectureSimulationSandboxEngine {
  /**
   * Simulates microarchitectural what-if scenarios based on explicitly declared parameter shifts.
   * Enforces strict epistemic classification: SIMULATED_ESTIMATE.
   */
  static runSimulation(
    researchRunId: string,
    userId: string,
    params: {
      name?: string;
      targetArchitecture: string;
      generation: string;
      sku: string;
      benchmarkSuite: string;
      metricUnit?: string;
      baselinePhysicalScore: number;
      modeledParameters: {
        branchMispredictPenaltyCycles: number;
        vectorExecutionWidthBits: number;
        l1DataCacheLatencyCycles: number;
        l2CacheLatencyCycles: number;
        l3CacheLatencyCycles: number;
        memoryBandwidthGbps: number;
        syscallOverheadCycles: number;
        clockFrequencyGhz: number;
        powerCapWatts: number;
      };
      assumptions?: string[];
    }
  ): MicroarchitectureSimulation {
    const simulationId = `sim-sb-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const p = params.modeledParameters;

    // Microarchitectural scaling model
    // 1. Clock scaling (linear approx)
    const baseClock = 5.0; // standard reference
    const clockFactor = p.clockFrequencyGhz / baseClock;

    // 2. Vector width scaling (e.g., 512-bit vs 256-bit)
    const vectorFactor = p.vectorExecutionWidthBits >= 512 ? 1.12 : 1.0;

    // 3. Cache & memory latency penalties
    const cachePenalty =
      ((p.l1DataCacheLatencyCycles - 4) * 0.015 +
        (p.l2CacheLatencyCycles - 14) * 0.008 +
        (p.l3CacheLatencyCycles - 45) * 0.003);

    // 4. Branch penalty
    const branchPenalty = (p.branchMispredictPenaltyCycles - 16) * 0.006;

    // 5. Syscall overhead
    const syscallPenalty = (p.syscallOverheadCycles - 300) * 0.0001;

    // Composite modifier
    const netModifier =
      clockFactor * vectorFactor * (1 - Math.max(-0.25, Math.min(0.35, cachePenalty + branchPenalty + syscallPenalty)));

    const simulatedScore = Number((params.baselinePhysicalScore * netModifier).toFixed(2));

    // Uncertainty spread estimation
    const uncertaintySpreadPercentage = Number(
      (Math.abs(1 - netModifier) * 25 + 3.0).toFixed(1)
    );

    const assumptions = params.assumptions || [
      `Simulated on microarchitectural sandbox model v2.4`,
      `Branch misprediction penalty assumed at ${p.branchMispredictPenaltyCycles} cycles`,
      `Vector execution unit modeled at ${p.vectorExecutionWidthBits}-bit SIMD path`,
      `Memory sub-system bandwidth modeled at ${p.memoryBandwidthGbps} GB/s`,
    ];

    const inputSnapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ sku: params.sku, base: params.baselinePhysicalScore, p }))
      .digest("hex");

    const outputSnapshotHash = crypto
      .createHash("sha256")
      .update(JSON.stringify({ score: simulatedScore, uncertainty: uncertaintySpreadPercentage }))
      .digest("hex");

    return {
      simulationId,
      userId,
      researchRunId,
      name: params.name || `${params.sku} Sandbox Simulation`,
      targetArchitecture: params.targetArchitecture,
      generation: params.generation,
      sku: params.sku,
      benchmarkSuite: params.benchmarkSuite,
      metricUnit: params.metricUnit || "fps",
      modeledParameters: p,
      simulatedScore,
      uncertaintySpreadPercentage,
      simulationClassification: "SIMULATED_ESTIMATE",
      assumptionSet: assumptions,
      inputSnapshotHash,
      outputSnapshotHash,
      evidenceBoundary:
        "SIMULATION_RESULT ≠ PHYSICAL_MEASUREMENT ≠ VERIFIED_RESEARCH_EVIDENCE: Modeled what-if simulation under declared assumptions.",
      simulatedAt: now,
    };
  }
}
