export interface ClaimContradictionResult {
  claimA: string;
  claimB: string;
  isContradiction: boolean;
  status: "UNCONTESTED" | "CONTESTED" | "RESOLVED";
}

export class ClaimIntelligenceEngine {
  static detectContradiction(claimA: string, claimB: string): ClaimContradictionResult {
    const directConflict = claimA.includes("not") || claimB.includes("not");

    return {
      claimA,
      claimB,
      isContradiction: directConflict,
      status: directConflict ? "CONTESTED" : "UNCONTESTED",
    };
  }
}
