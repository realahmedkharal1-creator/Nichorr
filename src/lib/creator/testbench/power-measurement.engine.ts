import { PhysicalMeasurement, MeasurementSourceType } from "./testbench.types";

export class PowerMeasurementEngine {
  /**
   * Processes power measurements and computes energy consumption (Joules).
   * If power telemetry is not attached, safely reports unavailable rather than fabricating values.
   */
  static calculateEnergyJoules(
    avgPowerWatts?: number,
    durationSeconds?: number
  ): number | undefined {
    if (avgPowerWatts === undefined || durationSeconds === undefined || durationSeconds <= 0) {
      return undefined;
    }
    return Number((avgPowerWatts * durationSeconds).toFixed(2));
  }

  /**
   * Calculates performance per watt metric (FPS/W or Points/W).
   */
  static calculatePerformancePerWatt(
    performanceScore?: number,
    avgPowerWatts?: number
  ): number | undefined {
    if (
      performanceScore === undefined ||
      avgPowerWatts === undefined ||
      avgPowerWatts <= 0
    ) {
      return undefined;
    }
    return Number((performanceScore / avgPowerWatts).toFixed(3));
  }

  /**
   * Validates power measurement metadata.
   */
  static validateSource(source: MeasurementSourceType): {
    isExternal: boolean;
    requiresCalibration: boolean;
  } {
    return {
      isExternal:
        source === "EXTERNAL_POWER_METER" ||
        source === "OSCILLOSCOPE" ||
        source === "DAQ",
      requiresCalibration:
        source === "EXTERNAL_POWER_METER" || source === "OSCILLOSCOPE",
    };
  }
}
