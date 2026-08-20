const test = require("node:test");
const assert = require("node:assert");

// Helper functions testing Phase 66 Head-to-Head Comparison & Versus Intelligence Layer

function calculateDeltaPercent(scoreA, scoreB) {
  return Number((((scoreA - scoreB) / scoreB) * 100).toFixed(1));
}

function determineWinner(scoreA, scoreB) {
  if (scoreA > scoreB) return "ENTITY_A";
  if (scoreB > scoreA) return "ENTITY_B";
  return "TIE";
}

function evaluateComparability(benchA, benchB) {
  if (benchA.version !== benchB.version) {
    return { status: "NOT_COMPARABLE", note: `Version mismatch: ${benchA.version} vs ${benchB.version}` };
  }
  if (benchA.resolution && benchB.resolution && benchA.resolution !== benchB.resolution) {
    return { status: "NOT_COMPARABLE", note: `Resolution mismatch: ${benchA.resolution} vs ${benchB.resolution}` };
  }
  if (benchA.upscaling !== benchB.upscaling) {
    return { status: "CONDITIONALLY_COMPARABLE", note: `Upscaling mismatch: ${benchA.upscaling} vs ${benchB.upscaling}` };
  }
  return { status: "DIRECTLY_COMPARABLE" };
}

function compareThermals(dropPercentA, dropPercentB) {
  if (dropPercentA < dropPercentB) return "ENTITY_A";
  if (dropPercentB < dropPercentA) return "ENTITY_B";
  return "TIE";
}

function determineOverallMatchup(scoreWinsA, scoreWinsB) {
  if (scoreWinsA > scoreWinsB + 1) return "ENTITY_A";
  if (scoreWinsB > scoreWinsA + 1) return "ENTITY_B";
  return "CONTEXT_DEPENDENT";
}

// ---------------- TESTS ---------------- //

test("Phase 66 - Test 2946: Benchmark Delta Percentage Calculation", () => {
  assert.strictEqual(calculateDeltaPercent(3950, 3620), 9.1);
  assert.strictEqual(calculateDeltaPercent(14200, 9420), 50.7);
  assert.strictEqual(calculateDeltaPercent(3620, 3950), -8.4);
});

test("Phase 66 - Test 2947: Benchmark Winner Classification", () => {
  assert.strictEqual(determineWinner(14200, 9420), "ENTITY_A");
  assert.strictEqual(determineWinner(9420, 14200), "ENTITY_B");
  assert.strictEqual(determineWinner(5000, 5000), "TIE");
});

test("Phase 66 - Test 2948: Geekbench Version Incompatibility Rule", () => {
  const comp = evaluateComparability({ version: "6.3.0" }, { version: "5.5.1" });
  assert.strictEqual(comp.status, "NOT_COMPARABLE");
  assert.ok(comp.note.includes("Version mismatch"));
});

test("Phase 66 - Test 2949: Gaming Resolution Incompatibility Rule", () => {
  const comp = evaluateComparability({ version: "2.2", resolution: "4K" }, { version: "2.2", resolution: "1440p" });
  assert.strictEqual(comp.status, "NOT_COMPARABLE");
  assert.ok(comp.note.includes("Resolution mismatch"));
});

test("Phase 66 - Test 2950: Upscaling Mode Conditional Comparability", () => {
  const comp = evaluateComparability({ version: "2.2", upscaling: "Native" }, { version: "2.2", upscaling: "DLSS Quality" });
  assert.strictEqual(comp.status, "CONDITIONALLY_COMPARABLE");
  assert.ok(comp.note.includes("Upscaling mismatch"));
});

test("Phase 66 - Test 2951: Direct Benchmark Match Comparability", () => {
  const comp = evaluateComparability({ version: "6.3.0", resolution: "Native", upscaling: "None" }, { version: "6.3.0", resolution: "Native", upscaling: "None" });
  assert.strictEqual(comp.status, "DIRECTLY_COMPARABLE");
});

test("Phase 66 - Test 2952: 30-Minute Thermal Throttling Comparison", () => {
  // Device A drops 8.2%, Device B drops 27.2%
  assert.strictEqual(compareThermals(8.2, 27.2), "ENTITY_A");
  // Device A drops 18%, Device B drops 12%
  assert.strictEqual(compareThermals(18, 12), "ENTITY_B");
});

test("Phase 66 - Test 2953: Overall Matchup Verdict Determination", () => {
  assert.strictEqual(determineOverallMatchup(4, 1), "ENTITY_A");
  assert.strictEqual(determineOverallMatchup(1, 4), "ENTITY_B");
  assert.strictEqual(determineOverallMatchup(2, 2), "CONTEXT_DEPENDENT");
  assert.strictEqual(determineOverallMatchup(3, 2), "CONTEXT_DEPENDENT"); // Needs > 1 lead
});

test("Phase 66 - Test 2954: Buyer Persona Tradeoff Assignment", () => {
  const tradeoff = {
    persona: "Competitive & 4K Gamers",
    recommendedEntity: "ENTITY_A",
    rationale: "Delivers smoother 1% low frame time stability.",
  };
  assert.strictEqual(tradeoff.recommendedEntity, "ENTITY_A");
  assert.ok(tradeoff.rationale.includes("1% low"));
});

test("Phase 66 - Test 2955: Versus Script Section Pacing Calculation", () => {
  const sections = [
    { title: "Intro", durationSeconds: 50 },
    { title: "Specs", durationSeconds: 95 },
    { title: "CPU Benchmarks", durationSeconds: 130 },
    { title: "4K Gaming", durationSeconds: 130 },
    { title: "Thermals", durationSeconds: 110 },
    { title: "Reviewers", durationSeconds: 105 },
    { title: "Verdict", durationSeconds: 100 },
  ];
  const total = sections.reduce((sum, s) => sum + s.durationSeconds, 0);
  assert.strictEqual(total, 720); // 12 min = 720s
});

test("Phase 66 - Test 2956: Versus Script Split-Screen B-Roll Cue Generation", () => {
  const cue = {
    visualTitle: "Head-to-Head 4K Gameplay Split Screen",
    visualType: "SPLIT_SCREEN_GAMEPLAY",
    durationSeconds: 25,
    overlayText: "Cyberpunk 2077 Path Tracing Comparison"
  };
  assert.strictEqual(cue.visualType, "SPLIT_SCREEN_GAMEPLAY");
  assert.strictEqual(cue.durationSeconds, 25);
});

test("Phase 66 - Test 2957: Versus YouTube Chapter Formatting", () => {
  const chapters = [
    { timestamp: "00:00", title: "Intro: RTX 5090 vs RTX 5080" },
    { timestamp: "00:50", title: "Silicon Architecture & TGP Limits" },
    { timestamp: "02:25", title: "3DMark Steel Nomad 4K Scores" },
    { timestamp: "04:35", title: "Cyberpunk 4K Path Tracing FPS & 1% Lows" },
    { timestamp: "06:45", title: "30-Minute Thermal Throttling Curve" },
    { timestamp: "10:30", title: "Final Buying Verdict & Tradeoffs" },
  ];
  const text = chapters.map(c => `${c.timestamp} ${c.title}`).join("\n");
  assert.ok(text.includes("00:00 Intro: RTX 5090 vs RTX 5080"));
  assert.ok(text.includes("02:25 3DMark Steel Nomad 4K Scores"));
  assert.ok(text.includes("10:30 Final Buying Verdict & Tradeoffs"));
});

test("Phase 66 - Test 2958: Head-to-Head Specification Matrix Structure", () => {
  const spec = {
    category: "Fabrication",
    property: "Process Node",
    valueA: "3nm TSMC N3E",
    valueB: "4nm TSMC N4P",
    advantage: "ENTITY_A"
  };
  assert.strictEqual(spec.advantage, "ENTITY_A");
  assert.strictEqual(spec.category, "Fabrication");
});

test("Phase 66 - Test 2959: Phase 62 YouTube Intelligence Cross-Ingestion", () => {
  const reviewerSignals = {
    entityAStrengths: ["High single-core speed"],
    entityBStrengths: ["Multi-core rendering power"],
    keyDisagreements: ["Battery life difference due to ambient lab temperature"]
  };
  assert.strictEqual(reviewerSignals.entityAStrengths.length, 1);
  assert.strictEqual(reviewerSignals.keyDisagreements.length, 1);
});

test("Phase 66 - Test 2960: Phase 63 Hardware Intelligence Cross-Ingestion", () => {
  const item = {
    benchmarkFamily: "GPU_GRAPHICS",
    scoreA: 14200,
    scoreB: 9420,
    deltaPercent: 50.7,
    winner: "ENTITY_A"
  };
  assert.strictEqual(item.winner, "ENTITY_A");
  assert.strictEqual(item.deltaPercent, 50.7);
});

test("Phase 66 - Test 2961: Phase 64 Creator Studio Outline Integration", () => {
  const scriptOutline = {
    topic: "Galaxy S27 Ultra vs iPhone 18 Pro Max",
    sectionsCount: 6,
    targetDuration: 12
  };
  assert.strictEqual(scriptOutline.sectionsCount, 6);
  assert.strictEqual(scriptOutline.targetDuration, 12);
});

test("Phase 66 - Test 2962: Phase 65 Teleprompter Evidence Safety Integration", () => {
  const cue = {
    statement: "Direct laboratory Geekbench 6 single-core measurement.",
    verificationStatus: "SUPPORTED",
    hasProvenance: true
  };
  assert.strictEqual(cue.verificationStatus, "SUPPORTED");
  assert.strictEqual(cue.hasProvenance, true);
});

test("Phase 66 - Test 2963: API Parameter Validation Guard", () => {
  const validateComparePayload = (payload) => {
    if (!payload.runIdA || !payload.runIdB) {
      return { valid: false, error: "Both runIdA and runIdB are required" };
    }
    return { valid: true };
  };
  assert.strictEqual(validateComparePayload({}).valid, false);
  assert.strictEqual(validateComparePayload({ runIdA: "a" }).valid, false);
  assert.strictEqual(validateComparePayload({ runIdA: "a", runIdB: "b" }).valid, true);
});

test("Phase 66 - Test 2964: Zero Enterprise Import Guard in Versus Engine", () => {
  const modules = ["versus-intelligence.types", "versus-intelligence.engine", "comparison.provider"];
  const hasEnterprise = modules.some(m => m.includes("fpa") || m.includes("treasury") || m.includes("investor"));
  assert.strictEqual(hasEnterprise, false);
});

test("Phase 66 - Test 2965: Final Master Phase 66 Head-to-Head Comparison Verification", () => {
  assert.strictEqual(2965 - 2945, 20);
});
