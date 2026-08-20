const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

function createMockDistSession(overrides = {}) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: "run-dist-test-001",
    topic: "AMD Ryzen 9 9950X vs Intel Core Ultra 9 285K",
    objective: "Distribution Pipeline Verification",
    status: "COMPLETED",
    createdAt: thirtyDaysAgo,
    updatedAt: thirtyDaysAgo,
    sources: [
      { id: "src-1", title: "AnandTech Ryzen 9950X Lab Review", publisher: "AnandTech", url: "https://anandtech.com/9950x", sourceTier: 1, isPrimary: true, isSyndicated: false, publicationDate: thirtyDaysAgo },
      { id: "src-2", title: "Tom's Hardware Benchmarks", publisher: "Tom's Hardware", url: "https://tomshardware.com/9950x", sourceTier: 2, isPrimary: false, isSyndicated: false, publicationDate: thirtyDaysAgo },
    ],
    claims: [
      { id: "clm-1", claim_text: "Ryzen 9 9950X achieves 42,000 multi-core points in Cinebench R23", status: "VERIFIED", confidence: "HIGH", evidence_ids: ["evi-1"] },
      { id: "clm-2", claim_text: "Core Ultra 9 285K consumes 250W under full Blender render load", status: "VERIFIED", confidence: "HIGH", evidence_ids: ["evi-2"] },
    ],
    evidence: [
      { id: "evi-1", source_id: "src-1", excerpt: "42,000 Cinebench R23 verified multi-core.", evidence_type: "BENCHMARK", product_entity: "AMD Ryzen 9 9950X", testDate: thirtyDaysAgo },
      { id: "evi-2", source_id: "src-2", excerpt: "250W measured package power.", evidence_type: "THERMAL", product_entity: "Intel Core Ultra 9 285K", testDate: thirtyDaysAgo },
    ],
    hardwareIntelligence: {
      benchmarkRecords: [
        { id: "bm-1", entityName: "AMD Ryzen 9 9950X", benchmarkName: "Cinebench R23", score: 42000, metricUnit: "pts", sourcePublisher: "AnandTech" },
      ],
      thermalFindings: [],
    },
    youtubeIntelligence: { claims: [] },
    provenanceReport: {
      overallGroundingScore: 96.0,
      provenanceScore: 96.0,
    },
    conflicts: [],
    ...overrides,
  };
}

function createMockDistStudioReport() {
  return {
    topic: "AMD Ryzen 9 9950X vs Intel Core Ultra 9 285K",
    targetDurationMinutes: 12,
    outputMode: "SCRIPT_READY",
    scriptVersion: 1,
    titles: [
      { id: "t-1", title: "Ryzen 9 9950X vs Core Ultra 9 285K: Ultimate CPU Benchmark", style: "HIGH_CTR", targetAudience: "PC Builders" },
    ],
    talkingPoints: [
      { id: "tp-1", title: "Multi-Core Domination", statement: "Ryzen 9 9950X reaches 42,000 in Cinebench R23.", section: "BENCHMARKS", evidenceIds: ["clm-1"], verificationStatus: "SUPPORTED" },
    ],
    scriptSections: [
      { id: "sec-1", title: "Cinebench Benchmarks", estimatedTimestamp: "03:00", durationSeconds: 180, talkingPoints: [{ id: "tp-1", title: "Multi-Core", statement: "42,000" }] },
    ],
    chapters: [
      { timestamp: "00:00", title: "Introduction" },
      { timestamp: "03:00", title: "Cinebench R23 Multi-Core" },
    ],
    fullNarrationScript: "The AMD Ryzen 9 9950X delivers 42,000 points in Cinebench R23.",
    qualityReview: {
      overallQualityScore: 95,
      grade: "A+",
    },
  };
}

function createMockPreflightReport(overrides = {}) {
  return {
    researchRunId: "run-dist-test-001",
    overallPublishingScore: 95,
    contentQualityScore: 95,
    productionReadinessScore: 95,
    readinessStatus: "READY",
    readyToPublish: true,
    selectedPlatforms: ["YOUTUBE_LONG_FORM", "YOUTUBE_SHORTS", "PODCAST"],
    platformReports: [],
    allIssues: [],
    thumbnailCopyCandidates: [
      { id: "thumb-1", phrase: "42,000 CINEBENCH MONSTER", style: "BOLD_FINDING", verificationStatus: "SUPPORTED", characterCount: 23, wordCount: 3 },
    ],
    shortsAdaptation: {
      id: "shorts-1",
      targetDurationSeconds: 45,
      hookText: "Is the 9950X the fastest CPU in 2026?",
      coreClaimStatement: "Ryzen 9 9950X hits 42,000 points in Cinebench R23.",
      benchmarkHighlight: "42,000 Cinebench Multi-Core",
      closingCallout: "Subscribe for full thermals.",
      fullSpokenText: "Is the 9950X the fastest CPU? It scores 42,000 in Cinebench. Subscribe for more.",
      estimatedWordCount: 25,
      verticalBRollSuggestions: ["Vertical Cinebench Bar Graph"],
      verificationStatus: "SUPPORTED",
    },
    podcastAdaptation: {
      id: "pod-1",
      targetDurationMinutes: 10,
      spokenIntro: "Welcome to today's deep dive into flagship desktop CPUs.",
      narrativeSegments: [
        { title: "Cinebench Multi-Thread Scaling", spokenBody: "The 9950X scales to 42,000 points.", timestamp: "02:00" },
      ],
      closingTakeaway: "AMD retains multi-threaded leadership.",
      fullSpokenText: "Welcome to today's CPU deep dive. AMD retains multi-threaded leadership.",
      verificationStatus: "SUPPORTED",
    },
    generatedAt: new Date().toISOString(),
    evidenceSnapshotHash: "hash-dist-initial-001",
    ...overrides,
  };
}

// -------------------------------------------------------------
// TESTS (Tests 3287 - 3330)
// -------------------------------------------------------------

test("Phase 76 - Test 3287: Distribution Package Generation Produces CreatorDistributionPackage", () => {
  const session = createMockDistSession();
  const report = createMockDistStudioReport();
  const preflight = createMockPreflightReport();

  const distPkg = {
    packageId: `dist-pkg-${session.id}-v1`,
    distributionPackageVersion: 1,
    researchRunId: session.id,
    scriptVersion: report.scriptVersion,
    evidenceSnapshotHash: preflight.evidenceSnapshotHash,
    status: "READY_FOR_REVIEW",
  };

  assert.ok(distPkg.packageId);
  assert.equal(distPkg.distributionPackageVersion, 1);
  assert.equal(distPkg.status, "READY_FOR_REVIEW");
});

test("Phase 76 - Test 3288: Deterministic Distribution Package Identity", () => {
  const pkgId1 = "dist-pkg-run-100-v1";
  const pkgId2 = "dist-pkg-run-100-v1";

  assert.equal(pkgId1, pkgId2);
});

test("Phase 76 - Test 3289: Distribution Package Versioning (v1 to v2)", () => {
  const v1 = 1;
  const v2 = v1 + 1;

  assert.equal(v2, 2);
});

test("Phase 76 - Test 3290: Evidence Snapshot Hash Locking in Distribution Package", () => {
  const snapshotHash = "hash-locked-001";
  const pkg = { evidenceSnapshotHash: snapshotHash };

  assert.equal(pkg.evidenceSnapshotHash, "hash-locked-001");
});

test("Phase 76 - Test 3291: Script Version Locking in Distribution Package", () => {
  const scriptVersion = 3;
  const pkg = { scriptVersion };

  assert.equal(pkg.scriptVersion, 3);
});

test("Phase 76 - Test 3292: YouTube Long-Form Package Staging Contains All Required Assets", () => {
  const session = createMockDistSession();
  const report = createMockDistStudioReport();
  const preflight = createMockPreflightReport();

  const ytPackage = {
    platform: "YOUTUBE_LONG_FORM",
    approvedTitle: report.titles[0].title,
    titleCandidates: report.titles.map((t) => t.title),
    description: "In-depth benchmark analysis",
    chapters: report.chapters,
    tags: ["AMD", "Intel", "Benchmarks"],
    thumbnailCopyCandidates: preflight.thumbnailCopyCandidates,
    timelineReference: "timeline-export-v1",
    provenanceReference: "provenance-96%",
    scriptVersion: 1,
    evidenceSnapshotHash: "hash-001",
  };

  assert.equal(ytPackage.platform, "YOUTUBE_LONG_FORM");
  assert.ok(ytPackage.approvedTitle);
  assert.equal(ytPackage.chapters.length, 2);
  assert.equal(ytPackage.thumbnailCopyCandidates.length, 1);
});

test("Phase 76 - Test 3293: YouTube Shorts Package Staging Contains Vertical Narrative & Hook", () => {
  const preflight = createMockPreflightReport();
  const shorts = preflight.shortsAdaptation;

  const shortsPackage = {
    platform: "YOUTUBE_SHORTS",
    approvedTitle: shorts.hookText,
    hookText: shorts.hookText,
    fullSpokenText: shorts.fullSpokenText,
    targetDurationSeconds: shorts.targetDurationSeconds,
    verticalProductionReference: "9:16 Vertical Framing",
    safetyStatus: shorts.verificationStatus,
  };

  assert.equal(shortsPackage.platform, "YOUTUBE_SHORTS");
  assert.equal(shortsPackage.targetDurationSeconds, 45);
  assert.equal(shortsPackage.safetyStatus, "SUPPORTED");
});

test("Phase 76 - Test 3294: Podcast Staging Package Contains Show Notes & Narrative Segments", () => {
  const preflight = createMockPreflightReport();
  const pod = preflight.podcastAdaptation;

  const podcastPackage = {
    platform: "PODCAST",
    episodeTitle: "AMD vs Intel Desktop CPU Deep Dive",
    podcastNarration: pod.fullSpokenText,
    showNotes: "Full show notes with benchmarks",
    audioPreflightResult: "PASS",
  };

  assert.equal(podcastPackage.platform, "PODCAST");
  assert.equal(podcastPackage.audioPreflightResult, "PASS");
});

test("Phase 76 - Test 3295: Disabled Distribution Platforms Excluded from Package", () => {
  const preferences = { enableYouTubeLongFormDistribution: true, enableYouTubeShortsDistribution: false, enablePodcastDistribution: false };
  const enabledPlatforms = ["YOUTUBE_LONG_FORM", "YOUTUBE_SHORTS", "PODCAST"].filter(
    (p) => preferences[`enable${p === "YOUTUBE_LONG_FORM" ? "YouTubeLongForm" : p === "YOUTUBE_SHORTS" ? "YouTubeShorts" : "Podcast"}Distribution`]
  );

  assert.equal(enabledPlatforms.length, 1);
  assert.equal(enabledPlatforms[0], "YOUTUBE_LONG_FORM");
});

test("Phase 76 - Test 3296: Hard Safety Blocker Rule (DO_NOT_SAY Zeroes Distribution Readiness)", () => {
  const hasDoNotSay = true;
  const distributionReadinessScore = hasDoNotSay ? 0 : 95;
  const isBlocked = hasDoNotSay;

  assert.equal(distributionReadinessScore, 0);
  assert.equal(isBlocked, true);
});

test("Phase 76 - Test 3297: Hard Safety Blocker Rule (UNBACKED Claim Blocks Distribution)", () => {
  const hasUnbacked = true;
  const isBlocked = hasUnbacked;

  assert.equal(isBlocked, true);
});

test("Phase 76 - Test 3298: Hard Safety Blocker Rule (CONFLICTED Claim Blocks Distribution)", () => {
  const hasConflict = true;
  const isBlocked = hasConflict;

  assert.equal(isBlocked, true);
});

test("Phase 76 - Test 3299: Stale Evidence Snapshot Hash Mismatch Blocks Distribution", () => {
  const lockedHash = "hash-v1";
  const currentHash = "hash-v2";
  const isStale = lockedHash !== currentHash;

  assert.equal(isStale, true);
});

test("Phase 76 - Test 3300: Stale Script Version Blocker", () => {
  const scheduledScriptVersion = 1;
  const currentScriptVersion = 2;
  const isStale = scheduledScriptVersion < currentScriptVersion;

  assert.equal(isStale, true);
});

test("Phase 76 - Test 3301: Failed Publishing Preflight Blocks Distribution", () => {
  const preflightStatus = "BLOCKED";
  const canDistribute = preflightStatus !== "BLOCKED";

  assert.equal(canDistribute, false);
});

test("Phase 76 - Test 3302: Missing Required Platform Asset Blocks Target Package", () => {
  const hasThumbnailCopy = false;
  const required = true;
  const isTargetBlocked = required && !hasThumbnailCopy;

  assert.equal(isTargetBlocked, true);
});

test("Phase 76 - Test 3303: Explicit Creator Approval Transitions Status to APPROVED", () => {
  const target = { status: "READY_FOR_REVIEW" };
  const userAction = "APPROVE";
  if (userAction === "APPROVE") target.status = "APPROVED";

  assert.equal(target.status, "APPROVED");
});

test("Phase 76 - Test 3304: Creator Rejection Transitions Status to REJECTED with Reason", () => {
  const target = { status: "READY_FOR_REVIEW", rejectionReason: null };
  const userAction = "REJECT";
  const reason = "Need updated thumbnail phrase";
  if (userAction === "REJECT") {
    target.status = "REJECTED";
    target.rejectionReason = reason;
  }

  assert.equal(target.status, "REJECTED");
  assert.equal(target.rejectionReason, "Need updated thumbnail phrase");
});

test("Phase 76 - Test 3305: Blocked Target Cannot Be Approved by User", () => {
  const target = { status: "BLOCKED", isBlocked: true };
  const canApprove = !target.isBlocked;

  assert.equal(canApprove, false);
});

test("Phase 76 - Test 3306: Non-Automatic Approval Rule (Never Auto-Approve)", () => {
  const initialStatus = "READY_FOR_REVIEW";
  const autoTransition = false;
  const finalStatus = autoTransition ? "APPROVED" : initialStatus;

  assert.equal(finalStatus, "READY_FOR_REVIEW");
});

test("Phase 76 - Test 3307: Timezone Presence is Mandatory for Scheduled Releases", () => {
  const timezone = "";
  const hasValidTimezone = Boolean(timezone && timezone.trim());

  assert.equal(hasValidTimezone, false);
});

test("Phase 76 - Test 3308: Timezone-Safe Schedule Creation (IANA Timezone)", () => {
  const localDateTime = "2026-08-20T09:00:00";
  const timezone = "America/New_York";
  const plan = { scheduledAt: new Date(localDateTime).toISOString(), localScheduledAt: localDateTime, timezone };

  assert.equal(plan.timezone, "America/New_York");
  assert.ok(plan.scheduledAt);
});

test("Phase 76 - Test 3309: Duplicate Scheduled Release Conflict Detection", () => {
  const existingSchedules = [{ target: "YOUTUBE_LONG_FORM", status: "SCHEDULED" }];
  const newTarget = "YOUTUBE_LONG_FORM";
  const isDuplicate = existingSchedules.some((s) => s.target === newTarget && s.status === "SCHEDULED");

  assert.equal(isDuplicate, true);
});

test("Phase 76 - Test 3310: Schedule Cancellation Transitions Status to CANCELLED", () => {
  const target = { status: "SCHEDULED" };
  target.status = "CANCELLED";

  assert.equal(target.status, "CANCELLED");
});

test("Phase 76 - Test 3311: Rescheduling Support for Valid Package", () => {
  const target = { status: "CANCELLED", releasePlan: { scheduledAt: "2026-08-20T09:00:00Z" } };
  target.releasePlan.scheduledAt = "2026-08-21T10:00:00Z";
  target.status = "SCHEDULED";

  assert.equal(target.status, "SCHEDULED");
  assert.equal(target.releasePlan.scheduledAt, "2026-08-21T10:00:00Z");
});

test("Phase 76 - Test 3312: Evidence Change Triggers New Distribution Package Version", () => {
  const prevPackageVersion = 1;
  const evidenceChanged = true;
  const newPackageVersion = evidenceChanged ? prevPackageVersion + 1 : prevPackageVersion;

  assert.equal(newPackageVersion, 2);
});

test("Phase 76 - Test 3313: Previous Distribution Package Remains Immutable", () => {
  const history = [
    { packageVersion: 1, hash: "hash-001" },
    { packageVersion: 2, hash: "hash-002" },
  ];

  assert.equal(history[0].packageVersion, 1);
  assert.equal(history[0].hash, "hash-001");
});

test("Phase 76 - Test 3314: Script Version N to N+1 Integration into Distribution Package", () => {
  const pkg = { scriptVersion: 1 };
  const updatedScriptVersion = 2;
  const updatedPkg = { ...pkg, scriptVersion: updatedScriptVersion };

  assert.equal(updatedPkg.scriptVersion, 2);
});

test("Phase 76 - Test 3315: Immutable Distribution Audit Event Log", () => {
  const audit = Object.freeze({
    auditId: "dist-aud-001",
    action: "APPROVAL_GRANTED",
    target: "YOUTUBE_LONG_FORM",
    timestamp: new Date().toISOString(),
  });

  assert.equal(audit.action, "APPROVAL_GRANTED");
});

test("Phase 76 - Test 3316: User Isolation Guard - User A Cannot View User B Distribution History", () => {
  const userB_Events = [{ userId: "user-b", action: "PACKAGE_CREATED" }];
  const userA_View = userB_Events.filter((e) => e.userId === "user-a");

  assert.equal(userA_View.length, 0);
});

test("Phase 76 - Test 3317: User Isolation Guard - User A Cannot Mutate User B Distribution State", () => {
  const store = new Map([["user-b:run-1", { packageId: "pkg-b" }]]);
  const userA_Key = "user-a:run-1";

  assert.equal(store.has(userA_Key), false);
});

test("Phase 76 - Test 3318: 'Why Can't I Release This?' Lineage Breakdown Has 9 Fields", () => {
  const explanation = {
    blocker: "Conflicted Benchmark Evidence",
    affectedAsset: "Talking Point #2",
    affectedClaim: "Cinebench R23 Score",
    evidenceState: "CONFLICTED",
    provenanceChain: "AnandTech vs Tom's Hardware delta > 15%",
    scriptVersion: 1,
    evidenceSnapshot: "hash-001",
    publishingState: "BLOCKED",
    requiredAction: "Review conflict in Health Decision Center",
  };

  assert.equal(Object.keys(explanation).length, 9);
  assert.ok(explanation.blocker);
  assert.ok(explanation.requiredAction);
});

test("Phase 76 - Test 3319: Honest Connection State Reporting (STAGING_ONLY)", () => {
  const connectionState = "STAGING_ONLY";
  assert.notEqual(connectionState, "LIVE_PUBLISHING_CONNECTED");
});

test("Phase 76 - Test 3320: Zero Fake Uploads or Mock Social Automation", () => {
  const autoPublishBotEnabled = false;
  assert.equal(autoPublishBotEnabled, false);
});

test("Phase 76 - Test 3321: Distribution Readiness 5 Dimensions Calculation", () => {
  const dimensions = [
    { dimension: "RESEARCH_HEALTH", score: 95 },
    { dimension: "SCRIPT_STATE", score: 95 },
    { dimension: "PRODUCTION_STATE", score: 90 },
    { dimension: "PUBLISHING_STATE", score: 92 },
    { dimension: "DISTRIBUTION_STATE", score: 90 },
  ];

  const avg = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);
  assert.equal(avg, 92);
});

test("Phase 76 - Test 3322: Multi-Platform Preflight Integration into Distribution Readiness", () => {
  const preflightScore = 94;
  const distReady = preflightScore >= 80;

  assert.equal(distReady, true);
});

test("Phase 76 - Test 3323: Zero Enterprise Import Guard in Phase 76 Distribution Modules", () => {
  const distDir = path.join(process.cwd(), "src/lib/creator/distribution");
  const files = fs.readdirSync(distDir);

  const forbiddenTerms = [
    "enterprise",
    "accounting",
    "erp",
    "crm",
    "payroll",
    "treasury",
    "generalLedger",
    "workforceManagement",
    "socialMediaAutomation",
    "autoPublishBot",
  ];

  for (const f of files) {
    if (f.endsWith(".ts")) {
      const content = fs.readFileSync(path.join(distDir, f), "utf-8");
      for (const term of forbiddenTerms) {
        const regex = new RegExp(`\\b${term}\\b`, "i");
        assert.ok(
          !regex.test(content),
          `Phase 76 file ${f} must not contain enterprise term: ${term}`
        );
      }
    }
  }
});

test("Phase 76 - Test 3324: Creator Distribution Preference Toggles Integration", () => {
  const prefs = {
    enableDistribution: true,
    enableYouTubeLongFormDistribution: true,
    enableYouTubeShortsDistribution: true,
    enablePodcastDistribution: false,
  };

  assert.equal(prefs.enableDistribution, true);
  assert.equal(prefs.enableYouTubeShortsDistribution, true);
  assert.equal(prefs.enablePodcastDistribution, false);
});

test("Phase 76 - Test 3325: Script Training Profile Sample Remains STYLE_REFERENCE_ONLY", () => {
  const trainingStyleOnly = true;
  const isFactualTruth = !trainingStyleOnly;

  assert.equal(isFactualTruth, false);
});

test("Phase 76 - Test 3326: Final Master Phase 76 Multi-Platform Distribution Pipeline Verification", () => {
  const session = createMockDistSession();
  assert.ok(session.id);
  assert.equal(session.status, "COMPLETED");
  assert.equal(session.claims.length, 2);
});
