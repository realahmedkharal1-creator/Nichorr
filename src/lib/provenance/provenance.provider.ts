export * from "./provenance.types";
export * from "./provenance.engine";

import { ProvenanceEngine } from "./provenance.engine";
import { ResearchRunSession } from "@/features/research/research-engine";
import { AuthorityTier } from "./provenance.types";

export class ProvenanceProvider {
  static generateReport(session: ResearchRunSession) {
    return ProvenanceEngine.generateReport(session);
  }

  static classifySource(url: string, publisher?: string): { tier: AuthorityTier; independenceScore: number } {
    return ProvenanceEngine.classifySource(url, publisher);
  }

  static detectSyndication(sources: Array<{ id: string; title: string; publisher?: string }>): Map<string, boolean> {
    return ProvenanceEngine.detectSyndication(sources);
  }
}
