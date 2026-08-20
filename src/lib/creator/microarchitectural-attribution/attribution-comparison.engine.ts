import {
  MicroarchitecturalAttributionRecord,
} from "./microarchitectural-attribution.types";

export class AttributionComparisonEngine {
  public static compareAttributions(
    attribA: MicroarchitecturalAttributionRecord,
    attribB: MicroarchitecturalAttributionRecord
  ): {
    isEqual: boolean;
    isConflicted: boolean;
    comparisonNote: string;
  } {
    const isEqual = attribA.attributionClassification === attribB.attributionClassification;
    const isConflicted = !isEqual && attribA.evidenceStrength === "HIGH" && attribB.evidenceStrength === "HIGH";

    const comparisonNote = isEqual
      ? `Both traces consistently identify ${attribA.attributionClassification}.`
      : isConflicted
      ? `High-confidence attribution divergence between ${attribA.attributionClassification} and ${attribB.attributionClassification}.`
      : `Attribution transition from ${attribA.attributionClassification} to ${attribB.attributionClassification}.`;

    return { isEqual, isConflicted, comparisonNote };
  }
}
