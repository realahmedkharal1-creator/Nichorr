export class ThermalMeasurementEngine {
  /**
   * Evaluates thermal conditions and calculates thermal headroom and efficiency index.
   */
  static evaluateThermals(
    maxCpuTemp?: number,
    maxGpuTemp?: number,
    thermalLimitCelsius: number = 90
  ): {
    thermalHeadroomCelsius?: number;
    isThrottlingRisk: boolean;
    thermalEfficiencyIndex?: number;
  } {
    const peakTemp = Math.max(maxCpuTemp || 0, maxGpuTemp || 0);
    if (peakTemp === 0) {
      return {
        thermalHeadroomCelsius: undefined,
        isThrottlingRisk: false,
        thermalEfficiencyIndex: undefined,
      };
    }

    const headroom = thermalLimitCelsius - peakTemp;
    const isThrottlingRisk = headroom <= 5;
    // Thermal efficiency index: higher is better (more headroom relative to ceiling)
    const thermalEfficiencyIndex = Number((Math.max(0, headroom) / thermalLimitCelsius).toFixed(2));

    return {
      thermalHeadroomCelsius: headroom,
      isThrottlingRisk,
      thermalEfficiencyIndex,
    };
  }
}
