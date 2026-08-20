export interface QualityGateAuditResult {
  status: 'READY' | 'READY_WITH_WARNINGS' | 'BLOCKED';
  score: number;
  warnings: string[];
  blockers: string[];
}

export class QualityGateValidator {
  static evaluate(session: {
    sources: any[];
    claims: any[];
    evidence: any[];
    conflicts: any[];
    brief?: any;
  }): QualityGateAuditResult {
    const blockers: string[] = [];
    const warnings: string[] = [];

    if (!session.sources || session.sources.length === 0) {
      blockers.push("Zero verified sources collected. Research run cannot complete without source data.");
    }

    if (!session.claims || session.claims.length === 0) {
      blockers.push("Zero claims extracted. Research run contains no structured findings.");
    }

    if (!session.evidence || session.evidence.length === 0) {
      blockers.push("Zero evidence excerpts stored. Unbacked research briefs violate Veritas ethos.");
    }

    // A brief is only evaluated when provided (post-generation re-check). An empty brief must never
    // be reported as READY — the creator would be told the brief is done when nothing populated.
    if (session.brief !== undefined) {
      const briefIsEmpty =
        !session.brief ||
        (typeof session.brief === "object" && Object.keys(session.brief).length === 0);
      const hasFindings =
        session.brief &&
        Array.isArray(session.brief.key_findings) &&
        session.brief.key_findings.length > 0;
      if (briefIsEmpty) {
        blockers.push("Research brief failed to generate (empty). Brief cannot be marked ready.");
      } else if (!hasFindings) {
        warnings.push("Research brief generated without any key findings.");
      }
    }

    if (session.conflicts && session.conflicts.length > 0) {
      warnings.push(`${session.conflicts.length} methodological conflict(s) surfaced between sources.`);
    }

    const unbackedClaims = session.claims ? session.claims.filter((c) => !c.evidence_ids || c.evidence_ids.length === 0) : [];
    if (unbackedClaims.length > 0) {
      warnings.push(`${unbackedClaims.length} claim(s) lack direct evidence links.`);
    }

    if (blockers.length > 0) {
      return { status: "BLOCKED", score: 3.0, warnings, blockers };
    }

    if (warnings.length > 0) {
      return { status: "READY_WITH_WARNINGS", score: 8.5, warnings, blockers };
    }

    return { status: "READY", score: 9.8, warnings, blockers };
  }
}
