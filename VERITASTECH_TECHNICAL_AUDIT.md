# VeritasTech AI — Technical Audit

**Date of Audit:** August 13, 2026  
**Auditor Role:** Senior Staff-Level Software Architect, Full-Stack Engineer, AI Systems Engineer, Database Architect, Security Reviewer, QA Engineer  
**Target Repository:** `C:\Users\ahmed\.gemini\antigravity\scratch\tech-research-platform`

---

## 1. Executive Summary

This forensic technical audit evaluated the current codebase of **VeritasTech AI**, an evidence-first technology research intelligence platform.

The audit revealed a significant divergence between the documented/claimed platform capabilities and the actual source code implementation:
- **UI & Web Shell**: All 14 MVP screens exist as working React/Next.js components and render complete visual layouts.
- **Data Persistence**: The application operates entirely on an **in-memory JavaScript `Map`** (`runStore`). No real database connection (Supabase/PostgreSQL) is initialized or executed at runtime, despite `@supabase/supabase-js` being declared in `package.json` and a migration SQL script existing in `supabase/migrations/`.
- **Research Engine Execution**: The core pipeline (`ResearchEngine.executeRun()`) does **not invoke AI providers (Gemini/Claude)** during pipeline execution. Instead, it relies on pattern matching against a static 10-item golden benchmark dataset (`GOLDEN_BENCHMARK_DATASET`) or returns hardcoded string template fallbacks using `setTimeout` delays.
- **AI Providers**: `GeminiProvider` integrates `@google/generative-ai` but is uncalled by the pipeline engine. `ClaudeProvider` is a mock stub returning empty objects (`{} as T`).
- **Web Extraction, Source Independence & Entity Resolution**: Web scraping/extraction, press release syndication clustering, and hardware SKU variant parsing are not implemented in code.
- **Authentication & Security**: Zero authentication, zero authorization, and zero user data isolation exist on API endpoints.

---

## 2. Overall Status

| Module / Layer | Status Rating | Summary |
| :--- | :--- | :--- |
| **Frontend Shell & 14 MVP Screens** | 🟢 Verified / Strong | All 14 routes exist, render rich UI cards, and handle API responses cleanly. |
| **State Machine Controller** | 🟡 Partial / Needs Verification | Real transition rules exist in `ResearchStateMachine`, but execute against in-memory state with simulated delays. |
| **Search Provider (Tavily/Mock)** | 🟡 Partial / Needs Verification | Tavily API search works if API key is set; falls back to static benchmark search dataset. |
| **Database & Persistence Layer** | 🔴 Missing / Broken | In-memory `runStore` Map used exclusively; zero Supabase/PostgreSQL runtime connections. |
| **AI Integration Engine** | 🔴 Missing / Broken | Gemini SDK wrapped but never called by ResearchEngine; Claude provider is a mock stub. |
| **Web Content Extraction** | 🔴 Missing / Broken | No web scraper, DOM parser, HTML cleaner, or snapshot store in codebase. |
| **Source Independence Engine** | 🔴 Missing / Broken | Press release syndication & origin clustering not implemented in code. |
| **Entity / Variant Resolution** | 🔴 Missing / Broken | No SKU/chipset/region parsing logic; relies on static benchmark array strings. |
| **Quality Gate Blocking** | 🔴 Missing / Broken | Hardcodes `qualityGateStatus = "READY"` without evaluating blocking rules. |
| **YouTube Integration** | 🔴 Missing / Broken | No `YouTubeProvider` or YouTube API / transcript extraction implementation. |
| **Authentication & Security** | ⚠️ Risk | No auth middleware, public unauthenticated API endpoints, no multi-tenant isolation. |

---

## 3. Complete Project Inventory

- **Root Configurations**: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.js`, `.env.example`, `README.md`
- **Database Migrations**: `supabase/migrations/00001_initial_schema.sql` (20 PostgreSQL tables defined in SQL)
- **API Routes**:
  - `/api/research` (`GET`, `POST`)
  - `/api/research/[id]/execute` (`POST`)
  - `/api/research/[id]/status` (`GET`)
  - `/api/dev/run-benchmark` (`POST`)
- **Frontend Pages (14 MVP Screens)**:
  - `/` (Landing Page)
  - `/dashboard` (Dashboard)
  - `/research/create` (Create Research)
  - `/research/[id]/config` (Research Configuration)
  - `/research/[id]/plan` (Research Plan)
  - `/research/[id]/live` (Live Progress Tracker)
  - `/research/[id]/results` (Results Overview)
  - `/research/[id]/evidence` (Evidence Traceability)
  - `/research/[id]/conflicts` (Conflict Matrix)
  - `/research/[id]/community` (Community Signals)
  - `/research/[id]/audience` (Audience Questions)
  - `/research/[id]/opportunities` (Content Opportunities)
  - `/research/[id]/brief` (Final Brief & Export)
  - `/research/history` (Research Archive)
- **Components**: `Header.tsx`, `ResearchTabNav.tsx`
- **Services & Pipeline**: `src/features/research/research-engine.ts`
- **Providers**: `gemini.provider.ts`, `claude.provider.ts`, `factory.ts`, `web.search.provider.ts`, `mock.search.provider.ts`
- **Schemas**: 10 Zod schemas in `src/schemas/` (`plan`, `search`, `evidence`, `claim`, `verification`, `conflict`, `community`, `audience`, `opportunity`, `brief`)
- **Benchmark Suite**: `src/benchmarks/golden-dataset.ts` (10 technical test cases)
- **Tests**: `tests/pipeline.test.js` (2 basic node unit tests)

---

## 4. Actual Architecture

```text
DOCUMENTED ARCHITECTURE:
Next.js 14 -> Supabase PostgreSQL (20 Tables) -> Research Engine -> Gemini 2.5/Claude LLM -> Web Extraction & Source Independence -> Structured Research Brief

ACTUAL ARCHITECTURE:
Next.js 14 App Router -> API Routes -> ResearchEngine -> In-Memory Map (runStore) -> Golden Benchmark Match / Template String Fallbacks -> React UI Screens
```

---

## 5. Research Pipeline Audit

- **Implementation File:** `src/features/research/research-engine.ts`
- **Main Class:** `ResearchEngine`
- **Inputs:** `topic`, `objective`, `contentType`, `targetAudience`, `requestedDepth`
- **Outputs:** `ResearchRunSession`
- **Status:** **MOCK / DETERMINISTIC DEMO LOGIC**
- **Findings:** Pipeline stages (`EXTRACTING`, `CLAIMING`, `VERIFYING`, `CONFLICT_ANALYSIS`, `COMMUNITY_ANALYSIS`, `AUDIENCE_ANALYSIS`, `OPPORTUNITY_ANALYSIS`, `QUALITY_CHECK`, `GENERATING_BRIEF`) are driven by `setTimeout` delays and pattern matching against `GOLDEN_BENCHMARK_DATASET` or static template strings. No LLM prompts or web extractions are executed during pipeline runs.

---

## 6. State Machine Audit

- **Implementation File:** `src/lib/state-machine/state-machine.ts`
- **Status:** **PARTIAL**
- **Findings:** `ResearchStateMachine` defines 16 explicit states and transition validation rules (`VALID_TRANSITIONS`). It prevents illegal transitions, but operates solely on transient in-memory objects (`session.status`). UI updates via polling `/api/research/[id]/status`.

---

## 7. AI Provider Audit

- **Gemini Provider (`src/lib/ai/gemini.provider.ts`)**: **PARTIAL / UNUSED**. Wraps `@google/generative-ai` for structured JSON output, but `ResearchEngine` never invokes `GeminiProvider`.
- **Claude Provider (`src/lib/ai/claude.provider.ts`)**: **MOCK STUB**. Returns `{}` as `T`. No Anthropic SDK integration or network calls.
- **Provider Factory (`src/lib/ai/factory.ts`)**: Implements instantiation logic, but factory is uncalled in pipeline.

---

## 8. Search Provider Audit

- **Implementation Files:** `src/lib/search/web.search.provider.ts`, `src/lib/search/mock.search.provider.ts`
- **Status:** **PARTIAL**
- **Findings:** If `TAVILY_API_KEY` is provided, `WebSearchProvider` makes HTTP requests to Tavily search API. If missing or failing, it falls back to `MockSearchProvider` static benchmark search results. SerpAPI is documented in `.env.example` but absent in code.

---

## 9. Web Extraction Audit

- **Status:** **MISSING / NOT IMPLEMENTED**
- **Findings:** No web content extraction, HTML scraping, DOM sanitizer, snapshot store, or paywall/robots.txt handler exists in `src/`. Source snippets come directly from search API payloads or mock search arrays.

---

## 10. Source Independence Audit

- **Status:** **DOCUMENTATION / DATABASE SCHEMA ONLY**
- **Findings:** The database migration file defines `source_relationships` table (`syndicated`, `cites`, `originates_from`), but zero deduplication or syndication detection algorithms exist in application code.

---

## 11. Entity / Variant Resolution Audit

- **Status:** **MOCK / PLACEHOLDER**
- **Findings:** No SKU, region, software version, or SoC parsing algorithm exists. `ResearchEngine` assigns `product_entity` from `benchmarkMatch.expectedEntities[0]` or `topic.split(" ")[0]`.

---

## 12. Claim / Evidence Traceability Audit

- **Status:** **PARTIAL**
- **Findings:** The UI screens (`/research/[id]/evidence`) render relational cards linking claims to evidence excerpts and source URLs. However, these links are constructed in-memory during mock pipeline execution and are not persisted to database tables (`claims`, `evidence`, `claim_evidence`).

---

## 13. Conflict Detection Audit

- **Status:** **MOCK / DETERMINISTIC DEMO LOGIC**
- **Findings:** Conflict items are pulled from `benchmarkMatch.knownConflicts` or assigned a static mock object explaining thermal test variations. No AI or rule-based conflict detector analyzes text.

---

## 14. Community Signal Audit

- **Status:** **MOCK**
- **Findings:** Community signals (e.g. display graininess, PWM flickering) are loaded from static benchmark array objects. No Reddit API or forum scraping logic exists.

---

## 15. Audience Question Audit

- **Status:** **MOCK**
- **Findings:** Audience questions are loaded from static benchmark array objects or fallback static strings. No real audience question gap analysis is performed.

---

## 16. YouTube Audit

- **Status:** **MISSING / NOT IMPLEMENTED**
- **Findings:** No `YouTubeProvider` class or YouTube API integration exists. References exist only in prompt UI copy and search result enum definitions.

---

## 17. Content Opportunity Audit

- **Status:** **MOCK**
- **Findings:** Opportunity scores (e.g. `9.2 / 10`) are generated using static math (`9.4 - idx * 0.4`) on benchmark strings.

---

## 18. Quality Gate Audit

- **Status:** **MOCK STUB**
- **Findings:** Stage `QUALITY_CHECK` sets `session.qualityGateStatus = "READY"` without inspecting claim support, missing excerpts, or source count.

---

## 19. Database Audit

- **Implementation File:** `supabase/migrations/00001_initial_schema.sql`
- **Status:** **SCHEMA ONLY / UNCONNECTED**
- **Findings:** 20 database tables (`users`, `projects`, `research_runs`, `research_questions`, `search_queries`, `sources`, `source_relationships`, `source_snapshots`, `evidence`, `claims`, `claim_evidence`, `claim_relationships`, `conflicts`, `community_signals`, `audience_questions`, `content_opportunities`, `research_briefs`, `research_feedback`, `research_errors`, `model_runs`, `prompt_versions`) are defined in SQL. However, `@supabase/supabase-js` is never imported in `src/`, and zero database queries execute at runtime.

---

## 20. Security Audit

- **Status:** **HIGH RISK / UNPROTECTED**
- **Findings:**
  - Zero authentication middleware or login logic.
  - API routes (`/api/research`, `/api/research/[id]/execute`) are completely public.
  - Multi-tenant isolation absent (all runs stored in global `runStore` Map).
  - No Row Level Security (RLS) policies defined in SQL migration file.

---

## 21. API Audit

- `/api/research` (`GET`, `POST`): Reads/writes in-memory `runStore` Map. Unauthenticated.
- `/api/research/[id]/execute` (`POST`): Triggers mock pipeline execution in memory. Unauthenticated.
- `/api/research/[id]/status` (`GET`): Returns in-memory session. Unauthenticated.
- `/api/dev/run-benchmark` (`POST`): Triggers golden dataset mock execution. Unauthenticated.

---

## 22. Zod / Structured Output Audit

- **Status:** **PARTIAL**
- **Findings:** 10 comprehensive Zod schemas exist in `src/schemas/`. `GeminiProvider` uses `schema.parse()`, but `ResearchEngine` bypasses `GeminiProvider` and constructs plain JS objects.

---

## 23. Frontend Screen Audit

- **Status:** **🟢 VERIFIED / STRONG UI SHELL**
- All 14 screens (`Landing`, `Dashboard`, `Create`, `Config`, `Plan`, `Live`, `Results`, `Evidence`, `Conflicts`, `Community`, `Audience`, `Opportunities`, `Brief`, `History`) are fully functional React components displaying rich visual cards, tabs, and export actions.

---

## 24. Testing Audit

- **Implementation File:** `tests/pipeline.test.js`
- **Status:** **MINIMAL / MOCK**
- **Findings:** 2 basic node unit tests verifying array lengths (`16` states, `10` benchmarks). Zero tests for DB queries, LLM calls, or web extraction. Coverage percentage not measured.

---

## 25. Mock / Placeholder Inventory

1. `src/features/research/research-engine.ts`: Uses in-memory `runStore` Map, `setTimeout` delays, and static dataset matching instead of AI calls & database queries.
2. `src/lib/ai/claude.provider.ts`: Returns `{}` mock object without Anthropic SDK calls.
3. `src/lib/ai/gemini.provider.ts`: Uncalled by pipeline engine; fallback returns empty object.
4. `src/lib/search/mock.search.provider.ts`: Hardcoded static search results array.
5. `src/benchmarks/golden-dataset.ts`: Hardcoded test cases used as static data generator.

---

## 26. Dependency Audit

- **Production Dependencies:** `@google/generative-ai`, `@supabase/supabase-js`, `clsx`, `lucide-react`, `next`, `react`, `react-dom`, `tailwind-merge`, `zod`.
- **Unused Dependencies:** `@supabase/supabase-js` (declared in `package.json` but 0 code imports in `src/`).

---

## 27. Documentation vs Code Reconciliation

| Claimed Feature | Documentation Says | Code Actually Does | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **20 Database Tables** | Fully modeled database schema | SQL file exists; 0 runtime DB connections in `src/` | **MOCK / UNCONNECTED** | `00001_initial_schema.sql` vs `runStore` Map |
| **Gemini AI Integration** | Primary LLM provider | SDK wrapped in class, but uncalled by `ResearchEngine` | **PARTIAL / UNUSED** | `gemini.provider.ts` vs `research-engine.ts` |
| **Claude Fallback** | Secondary fallback LLM | Stub class returning `{}` as `T`; no SDK | **MOCK STUB** | `claude.provider.ts` |
| **Live Research Pipeline** | 16-stage live state execution | Runs `setTimeout` delays & benchmark matching | **MOCK ENGINE** | `research-engine.ts` lines 95-275 |
| **Quality Gate Audit** | Enforces research blocking rules | Hardcodes `session.qualityGateStatus = "READY"` | **MOCK STUB** | `research-engine.ts` line 249 |
| **14 MVP UI Screens** | Complete interactive web shell | All 14 React pages render & handle state | **VERIFIED** | `src/app/` route pages |

---

## 28. Production Readiness

**Status: NOT PRODUCTION READY.**  
The application is a functional UI prototype backed by an in-memory demo engine. Real AI calls, database persistence, authentication, web extraction, and quality gate rules must be connected before real users can use the platform.

---

## 29. Critical Issues

1. **In-Memory Data Loss**: All research sessions disappear on server restart (`runStore` Map).
2. **AI Provider Disconnect**: Research engine does not call Gemini or Claude.
3. **Missing Authentication**: Unprotected API routes & no multi-tenant isolation.
4. **Missing Web Extraction & Scraping Engine**: Cannot extract live web page text or verify claims against raw sources.
5. **Missing Database Client**: Supabase SDK is not connected to API routes.

---

## 30. Recommended Fix Order

1. **Connect Supabase Database Client**: Replace in-memory `runStore` with Supabase/PostgreSQL queries using `@supabase/supabase-js`.
2. **Wire Gemini Provider into Research Engine**: Replace static benchmark array matching in `ResearchEngine` with real `GeminiProvider.generateStructuredJSON()` calls for planning, evidence extraction, claim verification, and brief generation.
3. **Implement Web Extraction Engine**: Build page scraper & text extraction service to fetch real web URLs from Tavily search results.
4. **Implement Real Quality Gate Blocking**: Add validation checks verifying that all claims have non-empty evidence excerpts before generating brief.
5. **Add Authentication & API Security**: Implement Supabase Auth and protect API routes.
