import crypto from "crypto";
import { HardwareExecutionTrace, TraceSourceState } from "./microarchitecture.types";

export class TraceIngestionEngine {
  public static ingestTrace(params: {
    userId: string;
    researchRunId: string;
    sourceType?: string;
    sourceState?: TraceSourceState;
    hardwareTarget?: string;
    cpuModel?: string;
    cpuStepping?: string;
    gpuModel?: string;
    gpuArchitecture?: string;
    driverVersion?: string;
    firmwareVersion?: string;
    biosVersion?: string;
    osVersion?: string;
    benchmarkSuite?: string;
    benchmarkVersion?: string;
    workload?: string;
    resolution?: string;
    preset?: string;
    renderingApi?: string;
    upscalingTechnology?: string;
    frameGeneration?: boolean;
    rayTracing?: boolean;
    powerLimitWatts?: number;
    observedPowerWatts?: number;
    observedTemperatureCelsius?: number;
    observedClockGhz?: number;
    methodologyFingerprint?: string;
    siliconFingerprint?: string;
    rawCounters?: Record<string, number>;
  }): HardwareExecutionTrace {
    const sourceType = params.sourceType || "PMU_HARDWARE_COUNTERS";
    const sourceState = params.sourceState || "AVAILABLE";
    const hardwareTarget = params.hardwareTarget || "AMD Ryzen 9 9950X / NVIDIA RTX 5090";
    const cpuModel = params.cpuModel || "Ryzen 9 9950X";
    const cpuStepping = params.cpuStepping || "B0";
    const gpuModel = params.gpuModel || "GeForce RTX 5090";
    const gpuArchitecture = params.gpuArchitecture || "Blackwell";
    const driverVersion = params.driverVersion || "GeForce 565.90";
    const firmwareVersion = params.firmwareVersion || "96.02.11.00.01";
    const biosVersion = params.biosVersion || "BIOS 0805";
    const osVersion = params.osVersion || "Windows 11 24H2";
    const benchmarkSuite = params.benchmarkSuite || "Cyberpunk 2077 (4K Ultra RT)";
    const benchmarkVersion = params.benchmarkVersion || "2.13";
    const workload = params.workload || "Ray Tracing Overdrive Benchmark";
    const resolution = params.resolution || "3840x2160";
    const preset = params.preset || "Ray Tracing Overdrive";
    const renderingApi = params.renderingApi || "DirectX 12";

    const methodologyFingerprint = params.methodologyFingerprint || "mfp-cp2077-4k";
    const siliconFingerprint = params.siliconFingerprint || "sfp-5090-b0";
    const rawCounters = params.rawCounters || {};

    const rawPayload = JSON.stringify({
      userId: params.userId,
      researchRunId: params.researchRunId,
      hardwareTarget,
      cpuModel,
      cpuStepping,
      gpuModel,
      benchmarkSuite,
      resolution,
      rawCounters,
    });

    const sourceSnapshotHash = `tsh-${crypto.createHash("sha256").update(rawPayload).digest("hex").slice(0, 16)}`;
    const traceId = `trace-${sourceSnapshotHash.slice(4, 16)}`;

    return {
      traceId,
      userId: params.userId,
      researchRunId: params.researchRunId,
      sourceType,
      sourceState,
      hardwareTarget,
      cpuModel,
      cpuStepping,
      gpuModel,
      gpuArchitecture,
      driverVersion,
      firmwareVersion,
      biosVersion,
      osVersion,
      benchmarkSuite,
      benchmarkVersion,
      workload,
      resolution,
      preset,
      renderingApi,
      upscalingTechnology: params.upscalingTechnology,
      frameGeneration: params.frameGeneration,
      rayTracing: params.rayTracing,
      powerLimitWatts: params.powerLimitWatts,
      observedPowerWatts: params.observedPowerWatts,
      observedTemperatureCelsius: params.observedTemperatureCelsius,
      observedClockGhz: params.observedClockGhz,
      methodologyFingerprint,
      siliconFingerprint,
      sourceSnapshotHash,
      rawCounters,
      capturedAt: new Date().toISOString(),
    };
  }
}
