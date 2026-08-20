import { TelemetryFrame, TelemetryConnectionState } from "./testbench.types";

export class TestbenchTelemetryEngine {
  /**
   * Evaluates telemetry frames and calculates consolidated summary statistics.
   * Never fabricates values; missing fields remain undefined or UNKNOWN.
   */
  static processFrames(
    frames: TelemetryFrame[],
    connectionState: TelemetryConnectionState = "LIVE_PHYSICAL_TELEMETRY"
  ): {
    connectionState: TelemetryConnectionState;
    avgCpuTempCelsius?: number;
    maxCpuTempCelsius?: number;
    avgGpuTempCelsius?: number;
    maxGpuTempCelsius?: number;
    avgPowerWatts?: number;
    peakPowerWatts?: number;
    avgClockMhz?: number;
    throttlingDetected: boolean;
  } {
    if (!frames || frames.length === 0) {
      return {
        connectionState: "LIVE_TELEMETRY_UNAVAILABLE",
        throttlingDetected: false,
      };
    }

    let cpuTempSum = 0;
    let cpuTempCount = 0;
    let maxCpuTemp = 0;

    let gpuTempSum = 0;
    let gpuTempCount = 0;
    let maxGpuTemp = 0;

    let powerSum = 0;
    let powerCount = 0;
    let peakPower = 0;

    let clockSum = 0;
    let clockCount = 0;

    let throttlingDetected = false;

    for (const f of frames) {
      if (f.cpuTempCelsius !== undefined) {
        cpuTempSum += f.cpuTempCelsius;
        cpuTempCount++;
        if (f.cpuTempCelsius > maxCpuTemp) maxCpuTemp = f.cpuTempCelsius;
      }
      if (f.gpuTempCelsius !== undefined) {
        gpuTempSum += f.gpuTempCelsius;
        gpuTempCount++;
        if (f.gpuTempCelsius > maxGpuTemp) maxGpuTemp = f.gpuTempCelsius;
      }
      if (f.gpuPowerWatts !== undefined) {
        powerSum += f.gpuPowerWatts;
        powerCount++;
        if (f.gpuPowerWatts > peakPower) peakPower = f.gpuPowerWatts;
      }
      if (f.gpuClockMhz !== undefined) {
        clockSum += f.gpuClockMhz;
        clockCount++;
      }
      if (f.thermalThrottling) {
        throttlingDetected = true;
      }
    }

    return {
      connectionState,
      avgCpuTempCelsius:
        cpuTempCount > 0 ? Number((cpuTempSum / cpuTempCount).toFixed(1)) : undefined,
      maxCpuTempCelsius: cpuTempCount > 0 ? maxCpuTemp : undefined,
      avgGpuTempCelsius:
        gpuTempCount > 0 ? Number((gpuTempSum / gpuTempCount).toFixed(1)) : undefined,
      maxGpuTempCelsius: gpuTempCount > 0 ? maxGpuTemp : undefined,
      avgPowerWatts:
        powerCount > 0 ? Number((powerSum / powerCount).toFixed(1)) : undefined,
      peakPowerWatts: powerCount > 0 ? peakPower : undefined,
      avgClockMhz: clockCount > 0 ? Math.round(clockSum / clockCount) : undefined,
      throttlingDetected,
    };
  }
}
