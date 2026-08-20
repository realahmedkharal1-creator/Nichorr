import { MicroarchitecturalTrace } from "./microarchitectural-attribution.types";

export class DriverFirmwareAttributionEngine {
  public static evaluate(
    traceA: MicroarchitecturalTrace,
    traceB: MicroarchitecturalTrace
  ): {
    isDriverAssociated: boolean;
    isFirmwareAssociated: boolean;
    notes: string[];
  } {
    const notes: string[] = [];

    const isDriverAssociated = traceA.driverVersion !== traceB.driverVersion;
    if (isDriverAssociated) {
      notes.push(`Observed drift associated with driver transition (${traceA.driverVersion} → ${traceB.driverVersion}).`);
    }

    const isFirmwareAssociated = traceA.firmwareVersion !== traceB.firmwareVersion;
    if (isFirmwareAssociated) {
      notes.push(`Observed drift associated with firmware transition (${traceA.firmwareVersion} → ${traceB.firmwareVersion}).`);
    }

    return { isDriverAssociated, isFirmwareAssociated, notes };
  }
}
