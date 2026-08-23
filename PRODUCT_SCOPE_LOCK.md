# Nichorr — Product Scope Lock

**Read this file FIRST before making any changes.** This is the single source of truth for what this product is and is not. Do not deviate from this scope under any circumstances, even if asked to add "the next phase" of something unrelated.

---

## 1. What this product actually is

Nichorr is a **research tool for technology content creators** (YouTube reviewers, tech bloggers, comparison-video makers). It turns a topic (e.g. "iPhone 18 Pro Max vs Galaxy S27 Ultra") into an **evidence-backed research brief**: verified claims, sources, conflicting evidence, audience questions, and content gaps — so a creator can script a video without doing hours of manual research.

That is the entire product. Nothing else.

## 2. Core architecture (the real V1.1 pipeline)

```
Input → Planning → Search → Sources → Extraction → Claims →
Verification → Conflicts → Community → Competitors → Audience →
Evidence → Brief
```

Key concepts that must be preserved:
- **Research Coverage** (were the planned questions answered?) — separate from accuracy
- **Source provenance** (URL, publisher, date, accessed date, source type)
- **Source deduplication & independence** (don't let 20 syndicated copies of 1 story look like 20 confirmations)
- **Fact vs Measurement vs Experience vs Opinion vs Inference vs Community Signal** — always kept visually/structurally distinct
- **Conflict detection** — when sources disagree, show the disagreement, don't average it away
- **Confidence levels**: Very High / High / Medium / Low (never a fake precision number like "92/100")
- **Research Quality Gate** before a brief is marked ready
- **Script Handoff** — the tool hands off an evidence-structured outline; it does NOT write the final script

## 3. MVP screen flow (already designed — build/keep exactly this)

```
Landing → Sign Up/Login → Quick Onboarding → Dashboard →
Create Research Project → Research Setup → Research Plan Preview →
Research Running → Research Workspace
   ├── Overview
   ├── Claims
   ├── Evidence
   ├── Conflicts
   ├── Community
   ├── Audience
   ├── Content Gaps
   ├── Sources
   └── Brief
→ Final Research Brief → Export / Share / Script Handoff
```

Design principle: desktop-first, evidence-first, no fake AI-chat gimmicks. The creator should feel like they hired a great researcher, not like they're chatting with a bot.

## 4. What actually exists in the codebase and is IN SCOPE (keep, fix, finish)

- `src/app/research/**` — the real research workspace (24 pages: ask, audience, brief, community, config, conflicts, evidence, opportunities, plan, provenance, results, sources, etc.)
- `src/app/creator/**` — creator studio pages
- `src/app/content/**`, `src/app/projects/**`
- The underlying `src/lib/creator/` engines that power the above (research/evidence/claims logic only — NOT the hardware/silicon ones listed below)
- `src/lib/creator/hypothesis-reconciliation/` — kept as a core feature implementing the conflict-detection requirement (Section 2)
- Supabase, Gemini, Tavily integrations used by the research pipeline

## 5. What is OUT OF SCOPE — must be archived, not extended

The codebase has accumulated a large amount of work that has **nothing to do with this product**. Do not build on it, do not fix it, do not extend it. Archive it out of the active app.

**Enterprise-simulation sections (entire top-level folders under `src/app/`):**
`treasury`, `workforce`, `supply-chain`, `legal`, `investor-relations`, `accounting`, `compliance`, `risk`, `billing`, `fpa`, `customer-experience`, `commercial`, `operations`, `operating-model`, `process`, `strategy`, `market`, `foresight`, `innovation`, `resilience`, `security` (enterprise version), `knowledge`, `autonomy`, `command-center`, `control-tower`, `control-plane`, `decision-intelligence`, `decisions`, `adaptive`, `causal`, `simulation` (enterprise), `execution` (enterprise), `automation` (enterprise), `workspaces`, `admin` (unless used for real user admin), `docs` (if enterprise-related), `product` (if this is a separate enterprise "product management" module, not our own app's product pages)

**Hardware/silicon-lab simulation modules (these were built by mistake — real scope creep, not real product features):**
`src/lib/creator/microarchitecture/`, `src/lib/creator/microarchitectural-attribution/`, `src/lib/creator/co-design-workbench/`, `src/lib/creator/silicon-regression/`, `src/lib/creator/testbench/`, `src/lib/creator/testbench-cluster/`, `src/lib/creator/cross-lab-regression/`, `src/lib/creator/architectural-forecast/`, `src/lib/creator/collective-intelligence/`
And their corresponding API routes and test files (phase88–phase95 and similar).

**Archived Dead API Routes (Phase 1 & Phase 8 Cleanup):**
`src/app/api/anomalies/`, `src/app/api/predictions/`, `src/app/api/residency/`, `src/app/api/entities/`, `src/app/api/relationships/`, `src/app/api/graph/`, `src/app/api/incidents/`, `src/app/api/objectives/`, `src/app/api/outcomes/`, `src/app/api/optimizations/`
`src/app/api/v1/innovation/`, `src/app/api/v1/assets/`, `src/app/api/v1/security/`, `src/app/api/v1/intelligence/`, `src/app/api/v1/control-plane/`, `src/app/api/v1/command-center/`, `src/app/api/v1/autonomy/`, `src/app/api/v1/foresight/`, `src/app/api/v1/control-tower/`, `src/app/api/v1/adaptive/`
(and their associated repositories/engines) are confirmed dead enterprise-BI scaffolding, now archived in `/_archive/`.

**Rule going forward:** if a requested feature is not clearly part of Section 2/3/4 above (tech-creator research pipeline), it does not get built, no matter how the request is phrased or how good the "next phase" idea sounds.

## 6. Non-negotiable process for any cleanup work

1. **Never delete outright.** Move out-of-scope folders into a top-level `/_archive/` directory (or a separate git branch) so nothing is unrecoverable if it turns out something was needed.
2. **Before moving anything**, scan `src/app/research/`, `src/app/creator/`, `src/app/content/`, `src/app/projects/` and their imports to build a list of every file/module they actually depend on. Anything on that dependency list must NOT be archived even if it lives under a folder that looks unrelated.
3. **After each batch of archiving**, run the full test suite and `npm run build`. If something breaks, fix the import or restore the specific file from the archive — do not mass-revert.
4. **Report clearly** at the end: what was archived (folder list + route count before/after), what remains, and confirmation that build + tests still pass.
5. Do not rename, restructure, or "improve" the remaining research/creator code while doing this cleanup. This is a subtraction task only. Feature fixes come in a separate, later step.

## 7. Scope Cleanup & Audit Log (August 2026)

- **Phase 1 Archived Dead API Routes:** `src/app/api/anomalies/`, `src/app/api/predictions/`, `src/app/api/residency/`, `src/app/api/entities/`, `src/app/api/relationships/`, `src/app/api/graph/`, `src/app/api/incidents/`, `src/app/api/objectives/`, `src/app/api/outcomes/`, `src/app/api/optimizations/` (and their associated repositories/engines) have been archived to `/_archive/`. These must never be rebuilt.
- **Phase 2 Bucket A (Archived Hardware/Silicon Simulation Modules):** The following 8 modules and their UI sections were confirmed to be chip-lab scope creep and archived to `/_archive/src/lib/creator/`: `microarchitecture`, `microarchitectural-attribution`, `co-design-workbench`, `silicon-regression`, `testbench`, `testbench-cluster`, `cross-lab-regression`, `architectural-forecast`.
- **Phase 2 Bucket B (Resolved - 2026-08-22):**
  - `hypothesis-reconciliation`: Resolved: kept as core feature, see Section 4.
  - `collective-intelligence`: Resolved: Archived to `/_archive/src/lib/creator/collective-intelligence/` along with its frontend components.
- **Phase 8 Scope Cleanup (August 2026):** Archived `src/lib/creator/collective-intelligence/`. Archived 10 dead API route domains from `src/app/api/v1/` (`innovation`, `assets`, `security`, `intelligence`, `control-plane`, `command-center`, `autonomy`, `foresight`, `control-tower`, `adaptive`) alongside their backing enterprise repository engines. Confirmed `hypothesis-reconciliation` remains in scope.
- **System Verification Status:** For current verified build and test suite outputs, refer to [STATUS.md](file:///C:/Users/ahmed/.gemini/antigravity/scratch/tech-research-platform/STATUS.md).
