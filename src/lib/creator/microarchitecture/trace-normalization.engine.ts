import {
  HardwareExecutionTrace,
  NormalizedTraceEvents,
} from "./microarchitecture.types";
import { TraceIntegrityEngine } from "./trace-integrity.engine";

export class TraceNormalizationEngine {
  public static normalizeTrace(trace: HardwareExecutionTrace): NormalizedTraceEvents {
    const counters = trace.rawCounters || {};
    const cycles = counters.cycles || 1000000;
    const instructions = counters.instructions || 2000000;

    const ipc = Number((instructions / (cycles || 1)).toFixed(2));

    const frontendStalls = counters.frontend_stalls || 0;
    const backendStalls = counters.backend_stalls || 0;
    const memoryStalls = counters.memory_stalls || Math.round(backendStalls * 0.6);
    const coreStalls = counters.core_stalls || Math.max(0, backendStalls - memoryStalls);

    const frontendStallRate = Number(((frontendStalls / (cycles || 1)) * 100).toFixed(1));
    const backendStallRate = Number(((backendStalls / (cycles || 1)) * 100).toFixed(1));
    const coreStallRate = Number(((coreStalls / (cycles || 1)) * 100).toFixed(1));
    const memoryStallRate = Number(((memoryStalls / (cycles || 1)) * 100).toFixed(1));

    const l1Misses = counters.l1_cache_misses || 0;
    const l2Misses = counters.l2_cache_misses || 0;
    const l3Misses = counters.l3_cache_misses || 0;
    const branchMisses = counters.branch_mispredictions || 0;

    const l1DataCacheMissRate = Number(((l1Misses / (instructions || 1)) * 1000).toFixed(2));
    const l2CacheMissRate = Number(((l2Misses / (instructions || 1)) * 1000).toFixed(2));
    const l3CacheMissRate = Number(((l3Misses / (instructions || 1)) * 1000).toFixed(2));
    const branchMispredictionRate = Number(((branchMisses / (instructions || 1)) * 1000).toFixed(2));

    const gpuComputeUtilization = counters.gpu_compute_utilization;
    const gpuMemoryBandwidthUtilization = counters.gpu_memory_bandwidth_utilization;
    const gpuWarpOccupancy = counters.gpu_warp_occupancy;
    const pcieBandwidthUtilization = counters.pcie_bandwidth_utilization;

    const integrity = TraceIntegrityEngine.validateTrace(trace);

    return {
      traceId: trace.traceId,
      ipc,
      frontendStallRate,
      backendStallRate,
      coreStallRate,
      memoryStallRate,
      l1DataCacheMissRate,
      l2CacheMissRate,
      l3CacheMissRate,
      branchMispredictionRate,
      gpuComputeUtilization,
      gpuMemoryBandwidthUtilization,
      gpuWarpOccupancy,
      pcieBandwidthUtilization,
      normalizedScore: ipc * 50,
      metricUnit: "IPC",
      completenessRatio: integrity.completenessRatio,
      normalizedAt: new Date().toISOString(),
    };
  }
}
