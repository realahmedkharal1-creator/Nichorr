# VeritasTech AI — Phase 2 Forensic Verification Report

**Date of Verification:** August 13, 2026  
**Auditor Role:** Senior Staff-Level Software Architect, Full-Stack Engineer, AI Systems Architect, Database Architect, Security Engineer, QA Engineer  
**Target Repository:** `C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform`

---

## 1. Executive Verdict

A forensic line-by-line code and runtime audit of the Phase 2 implementation was conducted to verify previous claims.

**VERDICT: PARTIAL / HIGHLY MOCKED CORE ENGINE.**

While Phase 2 successfully added Supabase `@supabase/ssr` boilerplate, RLS policies, a basic `WebExtractionEngine`, an `EntityResolver` class, and a `QualityGateValidator` class, **the previous Phase 2 report significantly overstated the completeness of the core AI pipeline and database wiring**:
- **Gemini LLM Disconnect:** `this.llmProvider` is instantiated in `ResearchEngine` but **NEVER CALLED** anywhere inside `executeRun()`. No prompts or LLM invocations occur.
- **Mock Benchmark Data Contamination:** If a user topic matches any topic string in `GOLDEN_BENCHMARK_DATASET`, the engine automatically populates static mock claims, evidence, conflicts, and signals instead of performing live AI analysis.
- **In-Memory Data Source:** `ResearchEngine.getRun(id)` reads exclusively from the in-memory JavaScript `Map` (`runStore`). All 14 UI screens consume data from `runStore`, not directly from Supabase database queries.
- **Quality Gate Non-Blocking:** Even if `QualityGateValidator` returns `BLOCKED`, `ResearchEngine.executeRun()` ignores the status, generates the brief anyway, and sets status to `COMPLETED`.
- **Runtime Verification Blocked:** Live environment API keys for Supabase, Gemini, and Tavily are unconfigured.

---

## 2. Verified Real Features

- **Frontend UI Shell (14 MVP Screens)**: All 14 pages (`Landing`, `Dashboard`, `Create`, `Config`, `Plan`, `Live`, `Results`, `Evidence`, `Conflicts`, `Community`, `Audience`, `Opportunities`, `Brief`, `History`) exist and render full UI cards.
- **Web Extraction Engine (`src/lib/extraction/web-extractor.ts`)**: `WebExtractionEngine.extractContent()` is invoked during step 2 (`RETRIEVING`) to fetch web text and strip HTML tags.
- **SSRF Security Protection**: `WebExtractionEngine.isSafeUrl()` accurately blocks requests targeting `localhost`, `127.0.0.1`, `192.168.x`, `10.x`, `.internal`, and `.local`.
- **Automated Test Suite**: `npm test` runs 5 test cases covering state transitions, SSRF guard rules, and quality gate evaluations.
- **Production Build Compilation**: `npm run build` compiles with 0 errors across 11 routes and 1 middleware.

---

## 3. Partially Verified Features

- **Supabase SSR Setup**: `@supabase/ssr` is installed and wrappers (`client.ts`, `server.ts`, `middleware.ts`) exist. However, queries run inside `try/catch` blocks and fall back to in-memory `runStore` because live Supabase credentials are missing.
- **State Machine**: `ResearchStateMachine` validates 16 explicit state transitions, but operates solely on in-memory session objects.
- **Tavily Search Integration**: `WebSearchProvider` sends HTTP requests to Tavily if `TAVILY_API_KEY` is present, but falls back to `MockSearchProvider` if unconfigured.
- **Entity Resolver**: `EntityResolver.resolve()` detects brand names and SoC strings (e.g. `Exynos` vs `Snapdragon`), but does not filter or block cross-variant evidence merging.

---

## 4. Features That Are Still Mock

- **Research Engine Execution Pipeline**: `ResearchEngine.executeRun()` uses `setTimeout` delays and static benchmark array matching instead of executing LLM prompts.
- **Claude Provider**: `ClaudeProvider` is a stub returning empty object `{}`.
- **Conflict Analysis**: Conflicts are loaded from `benchmarkMatch.knownConflicts` or static mock fallback objects.
- **Community Signals & Audience Questions**: Loaded directly from static benchmark arrays.
- **Content Opportunity Scoring**: Uses static math `(9.4 - idx * 0.4)` on benchmark strings.
- **Quality Gate Control**: Hardcoded to allow brief synthesis even when evaluated as `BLOCKED`.

---

## 5. Features That Are Missing

- **LLM Prompt Execution**: Zero `generateStructuredJSON` or Gemini SDK calls are made inside `ResearchEngine.executeRun()`.
- **Press Release Syndication / Source Independence Detection**: No clustering or origin detection algorithm is implemented in application code.
- **YouTube API & Transcript Extraction**: Zero `YouTubeProvider` or YouTube API integration.
- **Multi-Tenant User Isolation**: `ResearchRunsRepository.saveRun()` does not pass `user_id` during upsert operations.

---

## 6. Database Verification

- `@supabase/supabase-js` imported: **YES** (`src/lib/database/repositories/research-runs.repo.ts`)
- `@supabase/ssr` used: **YES** (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- API routes making DB queries: **NO** (`/api/research/[id]/status` reads from in-memory `runStore` Map).
- `ResearchEngine` writing to Supabase: **PARTIAL** (Attempts repository `saveRun()`, but catches errors when credentials are missing).
- Sources, Evidence, Claims, Briefs persisted: **PARTIAL** (Repositories exist, but `getRun` reads from memory).

---

## 7. Authentication Verification

- Sign-Up / Sign-In UI: **IMPLEMENTED** (`/login`)
- Auth Middleware: `src/middleware.ts` protects `/dashboard` and `/research/*` routes.
- Session Persistence & User Isolation: **BLOCKED / UNVERIFIED AT RUNTIME** due to missing `NEXT_PUBLIC_SUPABASE_URL` credentials in `.env.local`.

---

## 8. RLS Verification

| Table Name | RLS Enabled | Policy Definition | Status | Policy Compatibility Notes |
| :--- | :--- | :--- | :--- | :--- |
| `users` | YES | `auth.uid() = id` | **VALID** | Direct primary key match. |
| `projects` | YES | `auth.uid() = user_id` | **VALID** | Direct `user_id` column match. |
| `research_runs` | YES | `auth.uid() = user_id` | **PARTIAL** | Valid policy, but repository does not pass `user_id` on insert! |
| `research_questions` | YES | Subquery on `research_runs` | **VALID** | Valid subquery chain. |
| `evidence` | YES | Subquery on `research_runs` | **VALID** | Valid subquery chain. |
| `claims` | YES | Subquery on `research_runs` | **VALID** | Valid subquery chain. |
| `research_briefs` | YES | Subquery on `research_runs` | **VALID** | Valid subquery chain. |

---

## 9. Gemini Verification

- `ResearchEngine` instantiates `private llmProvider = getLLMProvider();` at line 40.
- **Call Graph Verification:** Searching for `this.llmProvider` across `research-engine.ts` reveals **ZERO INVOCATIONS** inside `executeRun()`.
- **Status:** **MOCK / UNCONNECTED IN PIPELINE**.

---

## 10. Tavily Verification

- Tavily API key read: `process.env.TAVILY_API_KEY` in `src/lib/search/web.search.provider.ts`.
- Fallback behavior: If `TAVILY_API_KEY` is missing or fails, it falls back to `MockSearchProvider`.
- **Status:** **PARTIAL / FALLBACK ACTIVE**.

---

## 11. Web Extraction Verification

- Extractor Class: `WebExtractionEngine` in `src/lib/extraction/web-extractor.ts`.
- Invoked in Pipeline: **YES** (Lines 118-123 of `research-engine.ts`).
- Extracted text passed to LLM: **NO** (LLM is not called; extracted text is sliced directly into `evidence.excerpt`).
- **Status:** **PARTIAL**.

---

## 12. Entity Resolution Verification

- Class: `EntityResolver` in `src/features/research/entity-resolver.ts`.
- Behavior: String checks (`tLower.includes("exynos")`).
- Prevents cross-variant evidence merging: **NO**.
- **Status:** **MOCK / SIMPLE HEURISTIC**.

---

## 13. Claim/Evidence Verification

- Relational links constructed: **YES** (In-memory arrays in `session.claims` and `session.evidence`).
- Persisted to Supabase `claims` and `evidence` tables: **PARTIAL** (`ClaimsRepository.saveClaimsAndEvidence()` called, but fails silently if DB credentials missing).
- UI data source: **IN-MEMORY MAP** (`runStore`).
- **Status:** **PARTIAL**.

---

## 14. Quality Gate Verification

- Class: `QualityGateValidator` in `src/features/research/quality-gate.ts`.
- Evaluates array metrics: **YES** (Returns `BLOCKED`, `READY_WITH_WARNINGS`, or `READY`).
- Blocks brief synthesis in engine: **NO** (`executeRun()` sets `qualityGateStatus` but proceeds to generate brief anyway).
- **Status:** **PARTIAL / NON-BLOCKING**.

---

## 15. 14-Screen Data Audit

| Screen Name | Route | Data Source | Real / Mock | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Landing** | `/` | Static Components | Real UI | Public landing page. |
| **Dashboard** | `/dashboard` | `/api/research` | In-Memory | Reads from `runStore.getAllRuns()`. |
| **Create Research** | `/research/create` | `/api/research` (POST) | In-Memory | Creates session in `runStore`. |
| **Configuration** | `/research/[id]/config` | `/api/research/[id]/status` | In-Memory | Reads from `runStore`. |
| **Research Plan** | `/research/[id]/plan` | `/api/research/[id]/status` | In-Memory | Customizes questions array in memory. |
| **Live Tracker** | `/research/[id]/live` | `/api/research/[id]/status` | In-Memory | Polls `session.status` state transitions. |
| **Results Overview** | `/research/[id]/results` | `/api/research/[id]/status` | In-Memory | Displays overview of `session`. |
| **Evidence Traceability**| `/research/[id]/evidence` | `/api/research/[id]/status` | In-Memory | Renders claim-to-evidence links. |
| **Conflict Matrix** | `/research/[id]/conflicts` | `/api/research/[id]/status` | In-Memory | Displays `session.conflicts`. |
| **Community Signals** | `/research/[id]/community` | `/api/research/[id]/status` | In-Memory | Displays `session.communitySignals`. |
| **Audience Questions** | `/research/[id]/audience` | `/api/research/[id]/status` | In-Memory | Displays `session.audienceQuestions`. |
| **Opportunities** | `/research/[id]/opportunities`| `/api/research/[id]/status` | In-Memory | Displays `session.opportunities`. |
| **Final Brief** | `/research/[id]/brief` | `/api/research/[id]/status` | In-Memory | Renders markdown export from brief. |
| **Research History** | `/research/history` | `/api/research` | In-Memory | Lists runs from `runStore`. |

---

## 16. Mock Data Contamination Audit

- `GOLDEN_BENCHMARK_DATASET` matching in `research-engine.ts` (Line 128): **ACTIVE**. Any topic matching benchmark names loads hardcoded claims/conflicts.
- `MockSearchProvider` fallback in `web.search.provider.ts`: **ACTIVE** when `TAVILY_API_KEY` is unconfigured.
- Static template strings in `research-engine.ts` (Lines 145-147, 190-198, 213-221, 233-244): **ACTIVE** when benchmark matching fails.

---

## 17. Security Audit

- SSRF Protection: **VERIFIED** (`WebExtractionEngine.isSafeUrl()`).
- Unauthenticated API Routes: `/api/research`, `/api/research/[id]/execute`, `/api/research/[id]/status`, `/api/dev/run-benchmark` do not enforce Auth check.
- Multi-Tenant Isolation: Absent in memory store (`runStore` Map shared globally).

---

## 18. Test Audit

- `npm test` runs 5 test cases in `tests/integration.test.js` & `tests/pipeline.test.js`.
- Tests validate state machine array length, SSRF URL blocking, quality gate evaluate return strings, and benchmark array lengths.
- Tests **DO NOT** touch Supabase, invoke Gemini API, or invoke Tavily search API.

---

## 19. Build Audit

- `npm run build` compiled successfully with 0 errors across 11 page routes, 5 API routes, and 1 middleware.

---

## 20. End-to-End Runtime Verification

**RUNTIME VERIFICATION BLOCKED.**  
Missing environment variables in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `GEMINI_API_KEY`, `TAVILY_API_KEY`.

---

## 21. Critical Bugs

1. **Uncalled LLM Provider:** `this.llmProvider` is initialized but never invoked in `ResearchEngine.executeRun()`.
2. **In-Memory UI Data Source:** All 14 UI screens read from in-memory `runStore` Map instead of querying Supabase.
3. **Benchmark Contamination:** Production research runs fall back to static `GOLDEN_BENCHMARK_DATASET` matching.
4. **Non-Blocking Quality Gate:** Quality gate evaluation does not stop brief generation when status is `BLOCKED`.
5. **Missing `user_id` on Insert:** `ResearchRunsRepository.saveRun()` does not supply `user_id`, causing Supabase RLS policy failures.

---

## 22. Recommended Fix Order

1. **Wire Gemini Provider into `ResearchEngine`**: Invoke `this.llmProvider.generateStructuredJSON()` for evidence extraction, claim corroboration, conflict analysis, and brief generation.
2. **Connect Supabase DB Queries to API Routes**: Replace `runStore.get(id)` in `/api/research/[id]/status` and `/api/research` with database repository SELECT queries.
3. **Pass `user_id` in Repository Upserts**: Include authenticated `user_id` in `saveRun()` to comply with RLS policies.
4. **Enforce Quality Gate Blocking**: Halt pipeline execution when `qualityGateStatus === "BLOCKED"`.
5. **Disable Benchmark Matching in Production**: Ensure `GOLDEN_BENCHMARK_DATASET` is only used when `process.env.NODE_ENV === "test"` or via `/api/dev/run-benchmark`.

---

## 23. Final Production Readiness Verdict

**STATUS: MOCK / NOT PRODUCTION READY.**  
The platform possesses a complete 14-screen UI shell and security/SSRF abstractions, but the core pipeline remains backed by in-memory state and mock data fallbacks due to uncalled AI providers and unconfigured API keys.
