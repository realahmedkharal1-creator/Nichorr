import { ResearchRunSession } from "./research-engine";

export interface ResearchComparisonResult {
  runA: { id: string; topic: string; createdAt: string; sourceCount: number; claimCount: number };
  runB: { id: string; topic: string; createdAt: string; sourceCount: number; claimCount: number };
  summary: string[];
  claimsDiff: {
    unchanged: Array<{ text: string; confidence: string }>;
    newInB: Array<{ text: string; confidence: string }>;
    removedInA: Array<{ text: string }>;
    changedOrContradicted: Array<{ textA: string; textB: string; note: string }>;
  };
  sourcesDiff: {
    commonSources: Array<{ title: string; publisher: string }>;
    newSourcesInB: Array<{ title: string; publisher: string; url: string }>;
    removedSourcesInA: Array<{ title: string; publisher: string }>;
  };
  conflictsDiff: {
    resolved: Array<{ explanation: string }>;
    newConflicts: Array<{ explanation: string; type: string }>;
  };
}

export function compareResearchRuns(runA: ResearchRunSession, runB: ResearchRunSession): ResearchComparisonResult {
  const claimsA = runA.claims || [];
  const claimsB = runB.claims || [];
  const sourcesA = runA.sources || [];
  const sourcesB = runB.sources || [];
  const conflictsA = runA.conflicts || [];
  const conflictsB = runB.conflicts || [];

  const textSetA = new Set(claimsA.map((c) => c.claim_text.toLowerCase().trim()));
  const textSetB = new Set(claimsB.map((c) => c.claim_text.toLowerCase().trim()));

  const unchangedClaims: Array<{ text: string; confidence: string }> = [];
  const newInBClaims: Array<{ text: string; confidence: string }> = [];
  const removedInAClaims: Array<{ text: string }> = [];

  for (const c of claimsB) {
    if (textSetA.has(c.claim_text.toLowerCase().trim())) {
      unchangedClaims.push({ text: c.claim_text, confidence: c.confidence });
    } else {
      newInBClaims.push({ text: c.claim_text, confidence: c.confidence });
    }
  }

  for (const c of claimsA) {
    if (!textSetB.has(c.claim_text.toLowerCase().trim())) {
      removedInAClaims.push({ text: c.claim_text });
    }
  }

  // Sources Diff
  const urlSetA = new Set(sourcesA.map((s) => s.url.toLowerCase().trim()));
  const urlSetB = new Set(sourcesB.map((s) => s.url.toLowerCase().trim()));

  const commonSources = sourcesB
    .filter((s) => urlSetA.has(s.url.toLowerCase().trim()))
    .map((s) => ({ title: s.title, publisher: s.publisher }));
  const newSourcesInB = sourcesB
    .filter((s) => !urlSetA.has(s.url.toLowerCase().trim()))
    .map((s) => ({ title: s.title, publisher: s.publisher, url: s.url }));
  const removedSourcesInA = sourcesA
    .filter((s) => !urlSetB.has(s.url.toLowerCase().trim()))
    .map((s) => ({ title: s.title, publisher: s.publisher }));

  // Conflicts Diff
  const explanationSetA = new Set(conflictsA.map((c) => c.explanation.toLowerCase().trim()));
  const explanationSetB = new Set(conflictsB.map((c) => c.explanation.toLowerCase().trim()));

  const resolvedConflicts = conflictsA
    .filter((c) => !explanationSetB.has(c.explanation.toLowerCase().trim()))
    .map((c) => ({ explanation: c.explanation }));
  const newConflicts = conflictsB
    .filter((c) => !explanationSetA.has(c.explanation.toLowerCase().trim()))
    .map((c) => ({ explanation: c.explanation, type: c.conflict_type }));

  // Summary Generation
  const summary: string[] = [
    `Analyzed evolution from Run A (${new Date(runA.createdAt).toLocaleDateString()}) to Run B (${new Date(runB.createdAt).toLocaleDateString()}).`,
    `${newSourcesInB.length} new source(s) discovered in recent research.`,
    `${newInBClaims.length} new verified claim(s) surfaced in current investigation.`,
    resolvedConflicts.length > 0 ? `${resolvedConflicts.length} previously flagged disagreement(s) resolved.` : `No conflicts resolved between runs.`,
    newConflicts.length > 0 ? `${newConflicts.length} new technical disagreement(s) identified.` : `Zero new conflicts introduced.`,
  ];

  return {
    runA: {
      id: runA.id,
      topic: runA.topic,
      createdAt: runA.createdAt,
      sourceCount: sourcesA.length,
      claimCount: claimsA.length,
    },
    runB: {
      id: runB.id,
      topic: runB.topic,
      createdAt: runB.createdAt,
      sourceCount: sourcesB.length,
      claimCount: claimsB.length,
    },
    summary,
    claimsDiff: {
      unchanged: unchangedClaims,
      newInB: newInBClaims,
      removedInA: removedInAClaims,
      changedOrContradicted: [],
    },
    sourcesDiff: {
      commonSources,
      newSourcesInB,
      removedSourcesInA,
    },
    conflictsDiff: {
      resolved: resolvedConflicts,
      newConflicts,
    },
  };
}
