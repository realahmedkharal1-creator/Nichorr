import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import {
  CreatorProjectGraph,
  CreatorProjectNode,
  CreatorProjectEdge,
  ProjectNodeType,
  ProjectRelationType,
  ProjectSubsystem,
} from "./creator-project.types";

export class CreatorProjectGraphEngine {
  /**
   * Constructs a deterministic, fully connected project dependency graph from actual domain objects.
   * Strictly enforces NO FALSE LINEAGE — only known reference IDs create graph edges.
   */
  static buildProjectGraph(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences?: CreatorProductionPreferences,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage
  ): CreatorProjectGraph {
    const nodes: CreatorProjectNode[] = [];
    const edges: CreatorProjectEdge[] = [];
    const nodeMap = new Map<string, CreatorProjectNode>();

    const addNode = (
      id: string,
      type: ProjectNodeType,
      label: string,
      subsystem: ProjectSubsystem,
      status: 'HEALTHY' | 'WARNING' | 'BLOCKED' | 'STALE' | 'DISABLED_BY_CREATOR' | 'READY' | 'UNKNOWN',
      metadata: Record<string, any> = {}
    ) => {
      if (nodeMap.has(id)) return nodeMap.get(id)!;
      const node: CreatorProjectNode = {
        id,
        type,
        label,
        subsystem,
        status,
        metadata,
        upstreamNodeIds: [],
        downstreamNodeIds: [],
      };
      nodes.push(node);
      nodeMap.set(id, node);
      return node;
    };

    const addEdge = (sourceId: string, targetId: string, relation: ProjectRelationType, label?: string) => {
      const src = nodeMap.get(sourceId);
      const tgt = nodeMap.get(targetId);
      if (!src || !tgt) return;

      const edgeId = `edge-${sourceId}->${targetId}-${relation}`;
      if (edges.some((e) => e.id === edgeId)) return;

      edges.push({ id: edgeId, sourceId, targetId, relation, label });
      if (!src.downstreamNodeIds.includes(targetId)) src.downstreamNodeIds.push(targetId);
      if (!tgt.upstreamNodeIds.includes(sourceId)) tgt.upstreamNodeIds.push(sourceId);
    };

    // 1. Root Node: Research Run Session
    const rootNodeId = `run-${session.id}`;
    addNode(
      rootNodeId,
      'RESEARCH_RUN',
      `Research: ${session.topic || "Hardware Research Run"}`,
      'RESEARCH',
      session.status === 'COMPLETED' ? 'READY' : 'UNKNOWN',
      { status: session.status, createdAt: session.createdAt }
    );

    // 2. Sources Nodes & Edges
    const sources = session.sources || [];
    for (const src of sources) {
      const srcNodeId = `src-${src.id}`;
      addNode(
        srcNodeId,
        'SOURCE',
        src.title || src.publisher || "Source",
        'RESEARCH',
        'HEALTHY',
        { publisher: src.publisher, url: src.url, tier: src.sourceTier }
      );
      addEdge(rootNodeId, srcNodeId, 'SUPPORTS');
    }

    // 3. Evidence Nodes & Edges
    const evidenceList = session.evidence || [];
    for (const evi of evidenceList) {
      const eviNodeId = `evi-${evi.id}`;
      addNode(
        eviNodeId,
        'EVIDENCE',
        `${evi.evidence_type}: ${evi.excerpt.slice(0, 45)}...`,
        'EVIDENCE',
        'HEALTHY',
        { productEntity: evi.product_entity, evidenceType: evi.evidence_type }
      );
      if (evi.source_id && nodeMap.has(`src-${evi.source_id}`)) {
        addEdge(`src-${evi.source_id}`, eviNodeId, 'DERIVED_FROM');
      } else {
        addEdge(rootNodeId, eviNodeId, 'SUPPORTS');
      }
    }

    // 4. Claims Nodes & Edges
    const claims = session.claims || [];
    for (const clm of claims) {
      const clmNodeId = `clm-${clm.id}`;
      const isBlocked = clm.status === 'DO_NOT_SAY' || clm.status === 'UNSUPPORTED';
      const isConflicted = clm.status === 'CONFLICTED';
      addNode(
        clmNodeId,
        'CLAIM',
        clm.claim_text,
        'EVIDENCE',
        isBlocked ? 'BLOCKED' : isConflicted ? 'WARNING' : 'HEALTHY',
        { status: clm.status, confidence: clm.confidence }
      );

      const evIds = clm.evidence_ids || [];
      if (evIds.length > 0) {
        for (const evId of evIds) {
          if (nodeMap.has(`evi-${evId}`)) {
            addEdge(`evi-${evId}`, clmNodeId, 'VERIFIED_BY');
          }
        }
      } else {
        addEdge(rootNodeId, clmNodeId, 'SUPPORTS');
      }
    }

    // 5. Claim Health Nodes (Phase 74/75)
    if (healthReport && healthReport.claimsHealth) {
      for (const ch of healthReport.claimsHealth) {
        const chNodeId = `health-${ch.claimId}`;
        const isBlocked = ch.healthStatus === 'BLOCKED' || ch.healthStatus === 'UNBACKED';
        addNode(
          chNodeId,
          'CLAIM_HEALTH',
          `Health: ${ch.healthStatus}`,
          'HEALTH',
          isBlocked ? 'BLOCKED' : ch.healthStatus === 'AGING' ? 'WARNING' : 'HEALTHY',
          { healthStatus: ch.healthStatus, freshnessStatus: ch.freshnessStatus, validityStatus: ch.validityStatus }
        );
        if (nodeMap.has(`clm-${ch.claimId}`)) {
          addEdge(`clm-${ch.claimId}`, chNodeId, 'TRACES_TO');
        }
      }
    }

    // 6. Script Profile & Version Nodes
    const profileNodeId = `profile-${profile?.userId || "anonymous"}`;
    addNode(
      profileNodeId,
      'SCRIPT_PROFILE',
      `Creator Style: ${profile?.tone || "Analytical / Objective"} (STYLE_REFERENCE_ONLY)`,
      'SCRIPT',
      'HEALTHY',
      { styleOnly: true }
    );

    const scriptVersion = report.scriptVersion || 1;
    const scriptVersionNodeId = `script-v${scriptVersion}`;
    addNode(
      scriptVersionNodeId,
      'SCRIPT_VERSION',
      `Script Version ${scriptVersion} (${report.outputMode || "SCRIPT_READY"})`,
      'SCRIPT',
      'READY',
      { targetDuration: report.targetDurationMinutes, outputMode: report.outputMode }
    );
    addEdge(profileNodeId, scriptVersionNodeId, 'GENERATED_FROM');

    // 7. Script Sections & Talking Points
    const sections = report.scriptSections || [];
    for (const sec of sections) {
      const secNodeId = `sec-${sec.id}`;
      addNode(
        secNodeId,
        'SCRIPT_SECTION',
        `${sec.estimatedTimestamp} - ${sec.title}`,
        'SCRIPT',
        'READY',
        { durationSeconds: sec.durationSeconds, sectionType: sec.sectionType }
      );
      addEdge(scriptVersionNodeId, secNodeId, 'VERSION_OF');

      for (const tp of sec.talkingPoints || []) {
        const tpNodeId = `tp-${tp.id}`;
        const isTpBlocked = tp.verificationStatus === 'DO_NOT_SAY' || tp.verificationStatus === 'UNSUPPORTED';
        addNode(
          tpNodeId,
          'TALKING_POINT',
          tp.statement,
          'SCRIPT',
          isTpBlocked ? 'BLOCKED' : 'READY',
          { verificationStatus: tp.verificationStatus }
        );
        addEdge(tpNodeId, secNodeId, 'GENERATED_FROM');

        // Connect Talking Point to actual backing Claim
        for (const clm of claims) {
          if (tp.statement.includes(clm.claim_text.slice(0, 20)) || clm.claim_text.includes(tp.statement.slice(0, 20))) {
            addEdge(`clm-${clm.id}`, tpNodeId, 'AFFECTS');
          }
        }
      }
    }

    // 8. Production Assets (B-Roll, Benchmark Cards, Chapters, Teleprompter)
    if (preferences?.generateBRoll !== false && report.bRollList) {
      for (const br of report.bRollList) {
        const brNodeId = `broll-${br.id}`;
        addNode(
          brNodeId,
          'PRODUCTION_ASSET',
          `B-Roll: ${br.visualTitle || br.visualType || "B-Roll Shot"}`,
          'PRODUCTION',
          'READY',
          { assetType: 'B_ROLL', visualType: br.visualType, description: br.description }
        );
        addEdge(scriptVersionNodeId, brNodeId, 'MATERIALIZES_AS');
      }
    }

    if (preferences?.generateBenchmarkCards !== false && report.benchmarkCards) {
      for (const bc of report.benchmarkCards) {
        const bcNodeId = `bmcard-${bc.id}`;
        addNode(
          bcNodeId,
          'PRODUCTION_ASSET',
          `Benchmark Card: ${bc.benchmarkName || bc.title} (${bc.entityAScore || (bc as any).score || 0} ${bc.metric || (bc as any).metricUnit || "pts"})`,
          'PRODUCTION',
          'READY',
          { assetType: 'BENCHMARK_CARD', score: bc.entityAScore || (bc as any).score }
        );
        addEdge(scriptVersionNodeId, bcNodeId, 'MATERIALIZES_AS');
      }
    }

    if (preferences?.enableTeleprompter !== false && report.fullNarrationScript) {
      const tpNodeId = `teleprompter-${session.id}`;
      addNode(
        tpNodeId,
        'TELEPROMPTER',
        "Teleprompter Spoken Script",
        'PRODUCTION',
        'READY',
        { wordCount: report.fullNarrationScript.split(/\s+/).length }
      );
      addEdge(scriptVersionNodeId, tpNodeId, 'MATERIALIZES_AS');
    }

    // 9. Publishing Assets (Phase 71)
    if (preflight) {
      const pubNodeId = `pub-preflight-${session.id}`;
      const isPubBlocked = preflight.readinessStatus === 'BLOCKED';
      addNode(
        pubNodeId,
        'PUBLISHING_ASSET',
        `Publishing Preflight: ${preflight.readinessStatus} (${preflight.overallPublishingScore}%)`,
        'PUBLISHING',
        isPubBlocked ? 'BLOCKED' : 'READY',
        { score: preflight.overallPublishingScore }
      );
      addEdge(scriptVersionNodeId, pubNodeId, 'PACKAGED_FOR');
    }

    // 10. Distribution Package & Release Plans (Phase 76)
    if (distPackage) {
      const distNodeId = `dist-pkg-${distPackage.packageId}`;
      const isDistBlocked = distPackage.status === 'BLOCKED';
      addNode(
        distNodeId,
        'DISTRIBUTION_PACKAGE',
        `Distribution Package v${distPackage.distributionPackageVersion} (${distPackage.distributionReadinessScore}%)`,
        'DISTRIBUTION',
        isDistBlocked ? 'BLOCKED' : distPackage.approvalState === 'APPROVED' ? 'READY' : 'WARNING',
        { version: distPackage.distributionPackageVersion, approvalState: distPackage.approvalState }
      );
      addEdge(scriptVersionNodeId, distNodeId, 'PACKAGED_FOR');

      for (const tgt of distPackage.targets) {
        const tgtNodeId = `release-plan-${tgt.platform}`;
        addNode(
          tgtNodeId,
          'RELEASE_PLAN',
          `Release: ${tgt.platform} (${tgt.status})`,
          'DISTRIBUTION',
          tgt.status === 'BLOCKED' ? 'BLOCKED' : tgt.status === 'APPROVED' || tgt.status === 'SCHEDULED' ? 'READY' : 'WARNING',
          { platform: tgt.platform, status: tgt.status, releaseMode: tgt.releasePlan.releaseMode }
        );
        addEdge(distNodeId, tgtNodeId, 'DEPENDS_ON');
      }
    }

    return {
      researchRunId: session.id,
      nodes,
      edges,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Returns all upstream nodes (transitive dependencies) supporting a given node.
   */
  static getUpstreamNodes(graph: CreatorProjectGraph, nodeId: string): CreatorProjectNode[] {
    const visited = new Set<string>();
    const result: CreatorProjectNode[] = [];
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

    const traverse = (currentId: string) => {
      const current = nodeMap.get(currentId);
      if (!current) return;

      for (const upId of current.upstreamNodeIds) {
        if (!visited.has(upId)) {
          visited.add(upId);
          const upNode = nodeMap.get(upId);
          if (upNode) {
            result.push(upNode);
            traverse(upId);
          }
        }
      }
    };

    traverse(nodeId);
    return result;
  }

  /**
   * Returns all downstream nodes (transitive dependents) affected by a given node.
   */
  static getDownstreamNodes(graph: CreatorProjectGraph, nodeId: string): CreatorProjectNode[] {
    const visited = new Set<string>();
    const result: CreatorProjectNode[] = [];
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));

    const traverse = (currentId: string) => {
      const current = nodeMap.get(currentId);
      if (!current) return;

      for (const downId of current.downstreamNodeIds) {
        if (!visited.has(downId)) {
          visited.add(downId);
          const downNode = nodeMap.get(downId);
          if (downNode) {
            result.push(downNode);
            traverse(downId);
          }
        }
      }
    };

    traverse(nodeId);
    return result;
  }
}
