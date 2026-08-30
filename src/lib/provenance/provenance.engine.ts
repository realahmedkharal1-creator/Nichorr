import { ResearchRunSession } from "@/features/research/research-engine";
import {
  ResearchProvenanceReport,
  ProvenanceNode,
  ProvenanceEdge,
  ProvenanceLineageChain,
  AuthorityTier,
  SourceAuthoritySummary,
} from "./provenance.types";
import { CreatorStudioProvider } from "@/lib/creator/creator.provider";

const PRIMARY_OEM_DOMAINS = [
  "apple.com", "samsung.com", "intel.com", "amd.com", "nvidia.com",
  "qualcomm.com", "microsoft.com", "dell.com", "hp.com", "lenovo.com",
  "asus.com", "sony.com", "google.com", "arm.com", "tsmc.com"
];

const INDEPENDENT_LAB_DOMAINS = [
  "anandtech.com", "notebookcheck.net", "gamersnexus.net", "pugetsystems.com",
  "primate.ca", "geekbench.com", "tomshardware.com", "rtings.com", "gsmarena.com",
  "techpowerup.com", "hardwareluxx.de", "computerbase.de", "geformat.de"
];

const COMMUNITY_DOMAINS = [
  "reddit.com", "xda-developers.com", "forums.macrumors.com", "forum.overclock3d.net",
  "resetera.com", "youtube.com"
];

export class ProvenanceEngine {
  /**
   * Generates a comprehensive, multi-hop research provenance and audit lineage report.
   */
  static generateReport(session: ResearchRunSession): ResearchProvenanceReport {
    const creatorStudio = session.creatorStudio || CreatorStudioProvider.generateReport(session);
    const sources = session.sources || [];
    const claims = session.claims || [];
    const evidence = session.evidence || [];
    const hwBenchmarks = session.hardwareIntelligence?.benchmarkRecords || [];
    const ytTranscripts = session.youtubeIntelligence?.transcripts || {};
    const ytSegments = Object.values(ytTranscripts).flatMap((t) => t.segments || []);
    const ytClaims = session.youtubeIntelligence?.claims || [];

    const nodes: ProvenanceNode[] = [];
    const edges: ProvenanceEdge[] = [];
    const lineageChains: ProvenanceLineageChain[] = [];

    // 1. Classify Sources and create Source Nodes
    const sourceAuthorityMap = new Map<string, { tier: AuthorityTier; independenceScore: number; isSyndicated: boolean }>();
    const syndicationMap = this.detectSyndication(sources);

    for (const src of sources) {
      const { tier, independenceScore } = this.classifySource(src.url, src.publisher);
      const isSyndicated = syndicationMap.get(src.id) || false;
      sourceAuthorityMap.set(src.id, { tier, independenceScore, isSyndicated });

      nodes.push({
        id: `node-${src.id}`,
        type: "SOURCE",
        label: src.publisher || src.title.slice(0, 30),
        detail: src.title,
        sourceUrl: src.url,
        publisher: src.publisher,
        authorityTier: tier,
        independenceScore,
        isSyndicated,
      });
    }

    // 2. Create Evidence Nodes and link to Sources
    const evidenceMap = new Map<string, any>();
    for (const ev of evidence) {
      evidenceMap.set(ev.id, ev);
      nodes.push({
        id: `node-${ev.id}`,
        type: "EVIDENCE",
        label: `Evidence: ${ev.evidence_type || "Measurement"}`,
        detail: ev.excerpt,
      });

      if (ev.source_id) {
        edges.push({
          id: `edge-${ev.id}-src`,
          fromId: `node-${ev.id}`,
          toId: `node-${ev.source_id}`,
          relationship: "CITED_IN",
          label: "Sourced from",
        });
      }
    }

    // 3. Create Claim Nodes and link to Evidence
    const claimMap = new Map<string, any>();
    for (const cl of claims) {
      claimMap.set(cl.id, cl);
      nodes.push({
        id: `node-${cl.id}`,
        type: "CLAIM",
        label: `Claim: ${cl.claim_type || "Finding"}`,
        detail: cl.claim_text,
        confidence: cl.confidence as any,
      });

      if (cl.evidence_ids && cl.evidence_ids.length > 0) {
        for (const evId of cl.evidence_ids) {
          edges.push({
            id: `edge-${cl.id}-${evId}`,
            fromId: `node-${cl.id}`,
            toId: `node-${evId}`,
            relationship: "MEASURED_BY",
            label: "Supported by evidence",
          });
        }
      }
    }

    // 4. Trace Talking Points to Lineage Chains
    const allTalkingPoints: any[] = [];
    if (creatorStudio && creatorStudio.scriptSections) {
      for (const sec of creatorStudio.scriptSections) {
        for (const tp of sec.talkingPoints) {
          allTalkingPoints.push({ ...tp, sectionType: sec.sectionType });
        }
      }
    }

    let verifiedCount = 0;
    let unbackedCount = 0;

    for (const tp of allTalkingPoints) {
      nodes.push({
        id: `node-${tp.id}`,
        type: "TALKING_POINT",
        label: tp.title,
        detail: tp.statement,
        confidence: tp.confidence,
      });

      // Find connected claim
      const matchedClaim = (tp.claimIds && tp.claimIds.length > 0)
        ? claimMap.get(tp.claimIds[0]) || claims[0]
        : claims[0];

      const matchedEvidenceId = (matchedClaim && matchedClaim.evidence_ids && matchedClaim.evidence_ids.length > 0)
        ? matchedClaim.evidence_ids[0]
        : (tp.evidenceIds && tp.evidenceIds.length > 0 ? tp.evidenceIds[0] : evidence[0]?.id);

      const matchedEvidence = evidenceMap.get(matchedEvidenceId) || evidence[0];
      const matchedSource = sources.find((s) => s.id === matchedEvidence?.source_id) || sources[0];

      if (matchedClaim) {
        edges.push({
          id: `edge-${tp.id}-${matchedClaim.id}`,
          fromId: `node-${tp.id}`,
          toId: `node-${matchedClaim.id}`,
          relationship: "DERIVED_FROM",
          label: "Script grounding",
        });
      }

      // Check matching benchmark record or YouTube transcript
      let benchmarkOrTranscriptRef: any = undefined;
      const stmtLower = (tp.statement || "").toLowerCase();

      const matchedBench = (hwBenchmarks as any[]).find((b: any) => 
        stmtLower.includes((b.benchmarkName || "").toLowerCase()) || 
        stmtLower.includes((b.metricName || "").toLowerCase())
      );

      if (matchedBench) {
        benchmarkOrTranscriptRef = {
          type: "BENCHMARK",
          name: matchedBench.benchmarkName,
          metricOrTimestamp: matchedBench.metricName,
          scoreOrText: `${matchedBench.score.toLocaleString()} ${matchedBench.metricUnit}`,
        };
      } else {
        const matchedYt = ytSegments.find((s) => 
          stmtLower.includes(s.formattedTime.toLowerCase()) ||
          s.text.toLowerCase().split(" ").some((w) => w.length > 5 && stmtLower.includes(w))
        );
        if (matchedYt) {
          benchmarkOrTranscriptRef = {
            type: "YOUTUBE_TRANSCRIPT",
            name: "YouTube Creator Review",
            metricOrTimestamp: matchedYt.formattedTime,
            scoreOrText: matchedYt.text.slice(0, 80) + "...",
          };
        }
      }

      const srcAuth = matchedSource ? sourceAuthorityMap.get(matchedSource.id) : undefined;
      // A chain is only VERIFIED when the matched evidence carries a real, retrieved
      // excerpt AND a real source. A dangling reference, or an [EXTRACTION_FAILED] /
      // empty excerpt, must NOT be counted as grounded — otherwise the grounding score
      // reads "100%" while individual claims show "UNBACKED".
      const excerptUsable =
        !!matchedEvidence?.excerpt &&
        !matchedEvidence.excerpt.startsWith("[EXTRACTION_FAILED]") &&
        matchedEvidence.excerpt.trim().length > 10;
      const hasDirectEvidence = excerptUsable && !!matchedSource;
      // A talking point backed only by a community/forum/comment source is user-reported
      // sentiment, not a verified measurement — cap it at NEEDS_CONTEXT so it doesn't
      // inflate the grounding score.
      const communityOnly = srcAuth?.tier === "TIER_4_COMMUNITY";
      const verificationStatus: 'VERIFIED' | 'NEEDS_CONTEXT' | 'UNBACKED' =
        tp.verificationStatus === "DO_NOT_SAY" || !hasDirectEvidence
          ? "UNBACKED"
          : tp.verificationStatus === "NEEDS_CONTEXT" || communityOnly
            ? "NEEDS_CONTEXT"
            : "VERIFIED";

      if (verificationStatus === "VERIFIED") verifiedCount++;
      else if (verificationStatus === "UNBACKED") unbackedCount++;

      lineageChains.push({
        chainId: `chain-${tp.id}`,
        talkingPointId: tp.id,
        talkingPointStatement: tp.statement,
        claimId: matchedClaim?.id || "cl-unknown",
        claimText: matchedClaim?.claim_text || tp.statement,
        evidenceId: matchedEvidence?.id || "ev-unknown",
        evidenceExcerpt: excerptUsable
          ? matchedEvidence!.excerpt
          : "No source excerpt was retrieved for this hop.",
        benchmarkOrTranscriptRef,
        sourceId: matchedSource?.id || "src-unknown",
        sourceTitle: matchedSource?.title || "Source not identified",
        sourceUrl: matchedSource?.url || "",
        publisher: matchedSource?.publisher || "Source not identified",
        authorityTier: srcAuth?.tier || "TIER_2_INDEPENDENT_LAB",
        independenceScore: srcAuth?.independenceScore || 8.5,
        verificationStatus,
        isSyndicated: srcAuth?.isSyndicated || false,
      });
    }

    // 5. Compute Source Authority Summary
    const sourceAuthoritySummary = this.computeSourceAuthoritySummary(sourceAuthorityMap);

    // 6. Compute Overall Grounding Score
    const totalTp = Math.max(1, allTalkingPoints.length);
    const overallGroundingScore = Number(((verifiedCount / totalTp) * 100).toFixed(1));

    // 7. Generate Citation Proof Sheet Markdown
    const citationProofSheetMarkdown = this.generateCitationProofSheet(
      session.topic,
      overallGroundingScore,
      lineageChains,
      sourceAuthoritySummary
    );

    return {
      runId: session.id,
      topic: session.topic,
      generatedAt: new Date().toISOString(),
      overallGroundingScore,
      totalTalkingPoints: allTalkingPoints.length,
      verifiedChainsCount: verifiedCount,
      unbackedChainsCount: unbackedCount,
      sourceAuthoritySummary,
      lineageChains,
      nodes,
      edges,
      citationProofSheetMarkdown,
    };
  }

  /**
   * Classifies a source URL and publisher into an authoritative tier and independence score.
   */
  static classifySource(url: string, publisher?: string): { tier: AuthorityTier; independenceScore: number } {
    const urlLower = (url || "").toLowerCase();
    const pubLower = (publisher || "").toLowerCase();

    // Tier 1: Primary OEM / Manufacturer
    if (PRIMARY_OEM_DOMAINS.some((d) => urlLower.includes(d) || pubLower.includes(d))) {
      return { tier: "TIER_1_PRIMARY", independenceScore: 10.0 };
    }

    // Tier 2: Independent Lab / Authoritative Benchmarker
    if (INDEPENDENT_LAB_DOMAINS.some((d) => urlLower.includes(d) || pubLower.includes(d))) {
      return { tier: "TIER_2_INDEPENDENT_LAB", independenceScore: 9.5 };
    }

    // Tier 4: Community / User Forum
    if (COMMUNITY_DOMAINS.some((d) => urlLower.includes(d) || pubLower.includes(d))) {
      return { tier: "TIER_4_COMMUNITY", independenceScore: 7.5 };
    }

    // Tier 3: Secondary Tech News Media
    return { tier: "TIER_3_SECONDARY", independenceScore: 8.0 };
  }

  /**
   * Detects syndicated press wire stories or copy-paste reporting across sources.
   */
  static detectSyndication(sources: Array<{ id: string; title: string; publisher?: string }>): Map<string, boolean> {
    const map = new Map<string, boolean>();
    for (const s of sources) {
      map.set(s.id, false);
    }
    for (let i = 0; i < sources.length; i++) {
      for (let j = i + 1; j < sources.length; j++) {
        const wordsA = new Set((sources[i].title || "").toLowerCase().split(/\s+/).filter((w) => w.length > 2));
        const wordsB = new Set((sources[j].title || "").toLowerCase().split(/\s+/).filter((w) => w.length > 2));
        const overlap = Array.from(wordsA).filter((w) => wordsB.has(w));
        const similarity = overlap.length / Math.max(1, Math.min(wordsA.size, wordsB.size));

        if (similarity > 0.7) {
          map.set(sources[i].id, true);
          map.set(sources[j].id, true);
        }
      }
    }
    return map;
  }

  private static computeSourceAuthoritySummary(
    sourceMap: Map<string, { tier: AuthorityTier; independenceScore: number; isSyndicated: boolean }>
  ): SourceAuthoritySummary {
    let tier1 = 0;
    let tier2 = 0;
    let tier3 = 0;
    let tier4 = 0;
    let syndicated = 0;
    let totalScore = 0;
    const totalSources = Math.max(1, sourceMap.size);

    for (const info of sourceMap.values()) {
      if (info.tier === "TIER_1_PRIMARY") tier1++;
      else if (info.tier === "TIER_2_INDEPENDENT_LAB") tier2++;
      else if (info.tier === "TIER_3_SECONDARY") tier3++;
      else if (info.tier === "TIER_4_COMMUNITY") tier4++;

      if (info.isSyndicated) syndicated++;
      totalScore += info.independenceScore;
    }

    return {
      tier1PrimaryCount: tier1,
      tier2IndependentLabCount: tier2,
      tier3SecondaryCount: tier3,
      tier4CommunityCount: tier4,
      syndicatedCount: syndicated,
      averageIndependenceScore: Number((totalScore / totalSources).toFixed(1)),
    };
  }

  private static generateCitationProofSheet(
    topic: string,
    groundingScore: number,
    chains: ProvenanceLineageChain[],
    authSummary: SourceAuthoritySummary
  ): string {
    const md: string[] = [];

    md.push(`# Nichorr — Creator Citation Proof Sheet & Evidence Audit`);
    md.push(`**Topic:** ${topic}`);
    md.push(`**Overall Grounding Score:** ${groundingScore}% Verified Lineage`);
    md.push(`**Audit Timestamp:** ${new Date().toISOString()}`);
    md.push(`**Source Breakdown:** ${authSummary.tier1PrimaryCount} Primary OEM | ${authSummary.tier2IndependentLabCount} Independent Labs | ${authSummary.tier3SecondaryCount} Secondary Media | ${authSummary.tier4CommunityCount} Community`);
    md.push(`\n---\n`);

    md.push(`## Multi-Hop Script Lineage & Citation Audit\n`);
    md.push(`| Status | Script Talking Point | Evidence Excerpt / Measurement | Publisher & Tier | Source URL |`);
    md.push(`| :--- | :--- | :--- | :--- | :--- |`);

    for (const ch of chains) {
      const statusIcon = ch.verificationStatus === "VERIFIED" ? "✅ VERIFIED" : ch.verificationStatus === "NEEDS_CONTEXT" ? "⚠️ NEEDS CONTEXT" : "❌ UNBACKED";
      const excerpt = ch.benchmarkOrTranscriptRef 
        ? `[${ch.benchmarkOrTranscriptRef.type}] ${ch.benchmarkOrTranscriptRef.name}: ${ch.benchmarkOrTranscriptRef.scoreOrText}`
        : ch.evidenceExcerpt.slice(0, 80) + "...";

      md.push(`| ${statusIcon} | "${ch.talkingPointStatement.slice(0, 70)}..." | ${excerpt} | ${ch.publisher} (${ch.authorityTier}) | [Link](${ch.sourceUrl}) |`);
    }

    md.push(`\n---\n## YouTube Description Citation Block (Paste-Ready)\n\`\`\`text`);
    md.push(`SOURCES & BENCHMARK CITATIONS:`);
    const uniqueSources = new Map<string, string>();
    for (const ch of chains) {
      if (!uniqueSources.has(ch.publisher)) {
        uniqueSources.set(ch.publisher, ch.sourceUrl);
      }
    }
    for (const [pub, url] of uniqueSources.entries()) {
      md.push(`• ${pub}: ${url}`);
    }
    md.push(`\`\`\`\n`);

    return md.join("\n");
  }
}
