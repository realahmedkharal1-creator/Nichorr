import { ResearchRunSession } from "@/features/research/research-engine";
import { CreatorStudioReport } from "../creator-studio.types";
import { CreatorProductionPreferences, DEFAULT_PRODUCTION_PREFERENCES } from "../production-preferences.types";
import { CreatorScriptTrainingProfile } from "../script-training.types";
import { ResearchHealthReport } from "@/lib/research-health/research-health.types";
import { PublishingPreflightReport } from "../publishing/publishing.types";
import { CreatorDistributionPackage } from "../distribution/distribution.types";
import { ResearchHealthProvider } from "@/lib/research-health/research-health.provider";
import { ScriptQualityProvider } from "../quality/script-quality.provider";
import { PublishingProvider } from "../publishing/publishing.provider";
import { DistributionProvider } from "../distribution/distribution.provider";
import { CreatorProjectProvider } from "../project/creator-project.provider";
import { CreatorExecutionProvider } from "../execution/creator-execution.provider";
import { CreatorCertificationAuditService } from "./creator-certification.audit";
import {
  ProjectIntegrityCertificate,
  CertificationStatus,
  IntegrityDimensionStatus,
  CertificationBlocker,
} from "./creator-certification.types";

export class CreatorCertificationEngine {
  /**
   * Evaluates the complete project state across all 8 dimensions to generate a formal Project Integrity Certificate.
   */
  static evaluateCertification(
    session: ResearchRunSession,
    report: CreatorStudioReport,
    preferences: CreatorProductionPreferences = DEFAULT_PRODUCTION_PREFERENCES,
    profile?: CreatorScriptTrainingProfile,
    healthReport?: ResearchHealthReport,
    preflight?: PublishingPreflightReport,
    distPackage?: CreatorDistributionPackage,
    userId: string = "anonymous-creator"
  ): ProjectIntegrityCertificate {
    // 1. Authoritative Subsystem Inputs
    const effectiveHealth = healthReport || ResearchHealthProvider.evaluateHealth(session, report);
    const effectiveQuality = report.qualityReview || ScriptQualityProvider.review(session, report, profile);
    const effectivePreflight = preflight || PublishingProvider.runPreflight(session, report, preferences, profile);
    const effectiveDistPackage = distPackage || DistributionProvider.generatePackage(
      session,
      report,
      effectivePreflight,
      effectiveHealth,
      preferences,
      userId,
      1
    );

    const snapshot = CreatorProjectProvider.getProjectSnapshot(
      session,
      report,
      preferences,
      profile,
      effectiveHealth,
      effectivePreflight,
      effectiveDistPackage
    );

    const activeExecutionPlan = CreatorExecutionProvider.getActivePlan(session.id, userId);

    const blockers: CertificationBlocker[] = [];
    const warnings: string[] = [];

    // --- 1. Research Integrity ---
    let researchStatus: IntegrityDimensionStatus = 'PASS';
    const researchScore = session.status === 'COMPLETED' ? 100 : 70;
    if (session.status !== 'COMPLETED') {
      researchStatus = 'BLOCKED';
      blockers.push({
        id: `blk-res-${session.id}`,
        severity: 'CRITICAL',
        subsystem: 'RESEARCH',
        affectedNode: `run-${session.id}`,
        reason: "Research run is not in COMPLETED status.",
        upstreamCause: "Incomplete multi-stage research ingestion.",
        evidenceReference: session.id,
        affectedDownstreamAssets: ["All Script Sections", "All Benchmark Cards"],
        requiredAction: "Wait for research ingestion to finish.",
      });
    }

    // --- 2. Evidence Integrity ---
    let evidenceStatus: IntegrityDimensionStatus = 'PASS';
    const freshnessScore = effectiveHealth.dimensions?.evidenceFreshness?.score || 95;
    const agingCount = effectiveHealth.evidenceSummary?.aging || 0;
    const staleCount = effectiveHealth.evidenceSummary?.stale || 0;

    if (staleCount > 0) {
      warnings.push(`${staleCount} evidence items or benchmark findings are aging / stale.`);
      evidenceStatus = 'WARNING';
    }

    // --- 3. Claim Safety ---
    let claimStatus: IntegrityDimensionStatus = 'PASS';
    let verifiedCount = 0;
    let unbackedCount = 0;
    let conflictedCount = 0;
    let doNotSayCount = 0;

    for (const c of session.claims || []) {
      if (c.status === 'VERIFIED') verifiedCount++;
      else if (c.status === 'UNVERIFIED' || c.status === 'DEBATED') unbackedCount++;
    }

    for (const tp of report.talkingPoints || []) {
      if (tp.verificationStatus === 'DO_NOT_SAY') {
        doNotSayCount++;
        claimStatus = 'BLOCKED';
        blockers.push({
          id: `blk-claim-dns-${tp.id}`,
          severity: 'CRITICAL',
          subsystem: 'SCRIPT',
          affectedNode: `tp-${tp.id}`,
          reason: `Talking Point "${tp.title || tp.statement.slice(0, 30)}" is marked DO_NOT_SAY.`,
          upstreamCause: tp.doNotSayWarning || "Factual contradiction or disproven claim in evidence.",
          evidenceReference: tp.evidenceIds?.[0] || "unknown",
          affectedDownstreamAssets: ["Spoken Narration", "Production Asset Cards"],
          requiredAction: "Remove or rewrite disproven statement.",
        });
      } else if (tp.verificationStatus === 'UNSUPPORTED') {
        unbackedCount++;
        claimStatus = 'BLOCKED';
        blockers.push({
          id: `blk-claim-unb-${tp.id}`,
          severity: 'HIGH',
          subsystem: 'EVIDENCE',
          affectedNode: `tp-${tp.id}`,
          reason: `Talking Point "${tp.title || tp.statement.slice(0, 30)}" has no supporting primary evidence.`,
          upstreamCause: "Evidence grounding failure.",
          evidenceReference: "missing-evidence",
          affectedDownstreamAssets: ["Spoken Script"],
          requiredAction: "Attach verified benchmark evidence or delete unbacked talking point.",
        });
      }
    }

    if (session.conflicts && session.conflicts.length > 0) {
      conflictedCount += session.conflicts.length;
      warnings.push(`${session.conflicts.length} unresolved evidence conflicts present.`);
    }

    if (!effectiveHealth.readyToSupportCreatorContent) {
      claimStatus = 'BLOCKED';
      for (const hb of effectiveHealth.hardBlockers) {
        blockers.push({
          id: `blk-health-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          severity: 'CRITICAL',
          subsystem: 'HEALTH',
          affectedNode: `health-${session.id}`,
          reason: hb,
          upstreamCause: "Research health gate failure.",
          evidenceReference: session.id,
          affectedDownstreamAssets: ["Creator Content Pipeline"],
          requiredAction: "Review and resolve health blockers in Evidence Health tab.",
        });
      }
    }

    // --- 4. Script Integrity ---
    let scriptStatus: IntegrityDimensionStatus = 'PASS';
    const qualityScore = effectiveQuality.overallQualityScore || 95;
    if (qualityScore < 75) {
      scriptStatus = 'WARNING';
      warnings.push(`Script Quality Score is below threshold (${qualityScore}/100).`);
    }

    // --- 5. Production Integrity ---
    let productionStatus: IntegrityDimensionStatus = 'PASS';
    const productionScore = effectivePreflight.productionReadinessScore || 95;

    // --- 6. Publishing Integrity ---
    let publishingStatus: IntegrityDimensionStatus = 'PASS';
    const pubScore = effectivePreflight.overallPublishingScore || 90;
    if (effectivePreflight.readinessStatus === 'BLOCKED') {
      publishingStatus = 'BLOCKED';
      for (const iss of effectivePreflight.allIssues.filter((i) => i.severity === 'BLOCKER')) {
        blockers.push({
          id: `blk-pub-${iss.id}`,
          severity: 'HIGH',
          subsystem: 'PUBLISHING',
          affectedNode: `pub-${iss.id}`,
          reason: iss.message,
          upstreamCause: "Missing required publishing metadata.",
          evidenceReference: iss.platform || "GENERAL",
          affectedDownstreamAssets: [iss.platform || "Platform Delivery Package"],
          requiredAction: iss.remediation || "Generate missing metadata in Publishing tab.",
        });
      }
    } else if (effectivePreflight.readinessStatus === 'READY_WITH_WARNINGS') {
      publishingStatus = 'WARNING';
      warnings.push("Publishing preflight contains non-blocking warnings.");
    }

    // --- 7. Distribution Integrity ---
    let distributionStatus: IntegrityDimensionStatus = 'PASS';
    const distScore = effectiveDistPackage.distributionReadinessScore || 90;
    if (effectiveDistPackage.status === 'BLOCKED') {
      distributionStatus = 'BLOCKED';
      for (const reason of effectiveDistPackage.readinessReport.blockingReasons) {
        blockers.push({
          id: `blk-dist-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          severity: 'HIGH',
          subsystem: 'DISTRIBUTION',
          affectedNode: `dist-${session.id}`,
          reason,
          upstreamCause: "Release readiness gate failed.",
          evidenceReference: "distribution-package",
          affectedDownstreamAssets: ["Distribution Staging Targets"],
          requiredAction: "Resolve target blockers in Distribution tab.",
        });
      }
    }

    // --- 8. Execution Integrity ---
    let executionStatus: IntegrityDimensionStatus = 'PASS';
    const planStatus = activeExecutionPlan ? activeExecutionPlan.executionStatus : 'NO_ACTIVE_PLAN';
    if (activeExecutionPlan && activeExecutionPlan.executionStatus === 'BLOCKED') {
      executionStatus = 'BLOCKED';
      warnings.push("Active execution plan is currently in BLOCKED status.");
    }

    // --- Final Status Determination ---
    const hasHardBlockers = blockers.some((b) => b.severity === 'CRITICAL' || b.severity === 'HIGH');
    let overallStatus: CertificationStatus = 'CERTIFIED';

    if (hasHardBlockers) {
      overallStatus = 'BLOCKED';
    } else if (warnings.length > 0) {
      overallStatus = 'CERTIFIED_WITH_WARNINGS';
    }

    const overallIntegrityScore = Math.round(
      (researchScore * 0.2) +
      (freshnessScore * 0.15) +
      (qualityScore * 0.25) +
      (productionScore * 0.15) +
      (pubScore * 0.15) +
      (distScore * 0.1)
    );

    const certificateId = `cert-${session.id}-v${report.scriptVersion || 1}-${Date.now().toString(36)}`;
    const nowStr = new Date().toISOString();

    const certificate: ProjectIntegrityCertificate = {
      certificateId,
      userId,
      researchRunId: session.id,
      projectSnapshotHash: snapshot.snapshotHash,
      evidenceSnapshotHash: snapshot.evidenceSnapshotHash,
      scriptVersion: report.scriptVersion || 1,
      timelineFingerprint: snapshot.timelineFingerprint,
      distributionPackageId: effectiveDistPackage.packageId,
      activePublishingTargets: effectivePreflight.selectedPlatforms || ["YOUTUBE_LONG_FORM"],
      activeDistributionTargets: effectiveDistPackage.targets.map((t) => t.platform),
      status: overallStatus,
      overallIntegrityScore,
      readyForHandoff: overallStatus === 'CERTIFIED' || overallStatus === 'CERTIFIED_WITH_WARNINGS',
      dimensions: {
        researchIntegrity: {
          status: researchStatus,
          score: researchScore,
          primaryEvidenceCount: session.sources?.filter((s) => s.isPrimary).length || 0,
          completedAt: session.updatedAt || session.createdAt || nowStr,
        },
        evidenceIntegrity: {
          status: evidenceStatus,
          freshnessScore,
          agingCount,
          staleCount,
        },
        claimSafety: {
          status: claimStatus,
          verifiedCount,
          unbackedCount,
          conflictedCount,
          doNotSayCount,
        },
        scriptIntegrity: {
          status: scriptStatus,
          qualityScore,
          qualityGrade: effectiveQuality.grade || "A",
          outputMode: report.outputMode || "SCRIPT_READY",
          targetDuration: report.targetDurationMinutes || 12,
        },
        productionIntegrity: {
          status: productionStatus,
          readinessScore: productionScore,
          enabledAssetCount: snapshot.enabledAssetCount,
          missingAssetCount: snapshot.disabledAssetCount,
        },
        publishingIntegrity: {
          status: publishingStatus,
          preflightStatus: effectivePreflight.readinessStatus,
          score: pubScore,
          platformCount: effectivePreflight.selectedPlatforms?.length || 1,
        },
        distributionIntegrity: {
          status: distributionStatus,
          readinessScore: distScore,
          targetCount: effectiveDistPackage.targets.length,
          readyCount: effectiveDistPackage.targets.filter((t) => t.status === 'APPROVED' || t.status === 'READY_FOR_REVIEW').length,
        },
        executionIntegrity: {
          status: executionStatus,
          latestPlanStatus: planStatus,
          validationStatus: activeExecutionPlan ? activeExecutionPlan.executionStatus : "N/A",
          concurrencySafe: true,
        },
      },
      blockers,
      warnings,
      certifiedAt: nowStr,
      certificationVersion: 1,
      isReleaseLocked: false,
    };

    CreatorCertificationAuditService.recordAuditEvent({
      auditId: `cert-aud-${Date.now().toString(36)}-eval`,
      certificateId,
      userId,
      researchRunId: session.id,
      action: overallStatus === 'BLOCKED' ? 'CERTIFICATION_BLOCKED' : overallStatus === 'CERTIFIED_WITH_WARNINGS' ? 'CERTIFIED_WITH_WARNINGS' : 'CERTIFIED',
      projectSnapshotHash: snapshot.snapshotHash,
      scriptVersion: report.scriptVersion || 1,
      details: overallStatus === 'BLOCKED'
        ? `Certification blocked by ${blockers.length} issues.`
        : `Project certified with overall score ${overallIntegrityScore}%.`,
      timestamp: nowStr,
    });

    return certificate;
  }
}
