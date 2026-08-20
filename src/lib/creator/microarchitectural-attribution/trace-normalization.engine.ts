import {
  MicroarchitecturalTrace,
  TraceNormalizationRecord,
} from "./microarchitectural-attribution.types";

export class TraceNormalizationEngine {
  public static normalizeTrace(trace: MicroarchitecturalTrace): TraceNormalizationRecord {
    const counters = trace.counters || {};
    const cycles = counters.cycles || 1000000;
    const instructions = counters.instructions || 2000000;

    const ipc = Number((instructions / (cycles || 1)).toFixed(2));

    const frontendStalls = counters.frontend_stalls || 0;
    const backendStalls = counters.backend_stalls || 0;
    const memoryStalls = counters.memory_stalls || Math.round(backendStalls * 0.6);
    const coreStalls = counters.core_stalls || Math.max(0, backendStalls - memoryStalls);

    const frontendStallPercentage = Number(((frontendStalls / (cycles || 1)) * 100).toFixed(1));
    const backendStallPercentage = Number(((backendStalls / (cycles || 1)) * 100).toFixed(1));
    const coreStallPercentage = Number(((coreStalls / (cycles || 1)) * 100).toFixed(1));
    const memoryStallPercentage = Number(((memoryStalls / (cycles || 1)) * 100).toFixed(1));

    const l1Misses = counters.l1_cache_misses || 0;
    const l2Misses = counters.l2_cache_misses || 0;
    const l3Misses = counters.l3_cache_misses || 0;
    const branchMisses = counters.branch_mispredictions || 0;

    const l1DataCacheMissRateMPKI = Number(((l1Misses / (instructions || 1)) * 1000).toFixed(2));
    const l2CacheMissRateMPKI = Number(((l2Misses / (instructions || 1)) * 1000).toFixed(2));
    const l3CacheMissRateMPKI = Number(((l3Misses / (instructions || 1)) * 1000).toFixed(2));
    const branchMispredictionRateMPKI = Number(((branchMisses / (instructions || 1)) * 1000).toFixed(2));

    const gpuComputeUtilization = counters.gpu_compute_utilization;
    const gpuMemoryBandwidthUtilization = counters.gpu_memory_bandwidth_utilization;
    const gpuWarpOccupancy = counters.gpu_warp_occupancy;
    const pcieBandwidthUtilization = counters.pcie_bandwidth_utilization;

    const expectedKeys = ["cycles", "instructions", "frontend_stalls", "backend_stalls", "memory_stalls", "l1_cache_misses", "l2_cache_misses", "l3_cache_misses", "branch_mispredictions"];
    const presentKeys = Object.keys(counters).filter((k) => expectedKeys.includes(k));
    const completenessRatio = expectedKeys.length > 0 ? Number((presentKeys.length / expectedKeys.length).toFixed(2)) : 0;

    return {
      traceId: trace.traceId,
      ipc,
      instructions,
      cycles,
      frontendStallPercentage,
      backendStallPercentage,
      memoryStallPercentage,
      coreStallPercentage,
      l1DataCacheMissRateMPKI,
      l2CacheMissRateMPKI,
      l3CacheMissRateMPKI,
      branchMispredictionRateMPKI,
      gpuComputeUtilization,
      gpuMemoryBandwidthUtilization,
      gpuWarpOccupancy,
      pcieBandwidthUtilization,
      completenessRatio,
      normalizedAt: new Date().toISOString(),
    };
  }
}
