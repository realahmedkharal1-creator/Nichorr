import { MicroarchitecturalTrace } from "./microarchitectural-attribution.types";

export class ThermalPowerAttributionEngine {
  public static evaluate(trace: MicroarchitecturalTrace): {
    isThermalTriggered: boolean;
    isPowerTriggered: boolean;
    supporting: string[];
    contradicting: string[];
  } {
    const supporting: string[] = [];
    const contradicting: string[] = [];

    const isThermalTriggered = Boolean(trace.observedTemperatureCelsius && trace.observedTemperatureCelsius > 88);
    if (isThermalTriggered) {
      supporting.push(`Physical junction temperature reached ${trace.observedTemperatureCelsius}°C, activating thermal limiting.`);
    } else {
      contradicting.push(`Junction temperature (${trace.observedTemperatureCelsius || "nominal"}°C) within safe thermal head-room.`);
    }

    const isPowerTriggered = Boolean(
      trace.observedPowerWatts &&
      trace.powerLimitWatts &&
      trace.observedPowerWatts >= trace.powerLimitWatts * 0.98
    );
    if (isPowerTriggered) {
      supporting.push(`Power draw (${trace.observedPowerWatts}W) reached configured cap (${trace.powerLimitWatts}W).`);
    } else {
      contradicting.push(`Power draw is below power limit envelope.`);
    }

    return { isThermalTriggered, isPowerTriggered, supporting, contradicting };
  }
}
