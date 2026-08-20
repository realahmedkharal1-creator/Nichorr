import { CounterSample, EvidenceStrength } from "./microarchitectural-attribution.types";

export class HardwareCounterEngine {
  public static parseCounterSamples(rawCounters: Record<string, number>): CounterSample[] {
    const samples: CounterSample[] = [];

    for (const [name, val] of Object.entries(rawCounters)) {
      if (typeof val === "number" && !isNaN(val) && val >= 0) {
        samples.push({
          counterName: name,
          rawValue: val,
          normalizedValue: val,
          unit: name.includes("cycles") || name.includes("stalls") ? "cycles" : name.includes("misses") ? "events" : "raw",
          confidence: "HIGH",
          isAvailable: true,
        });
      }
    }

    return samples;
  }

  public static getCounterQuality(samples: CounterSample[]): EvidenceStrength {
    if (samples.length === 0) return "NONE";
    if (samples.length < 3) return "LOW";
    if (samples.length < 8) return "MODERATE";
    return "HIGH";
  }
}
