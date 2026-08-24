# FEATURE LOCK — Read before touching any code

This file lists parts of the Nichorr codebase that have been reviewed and confirmed working correctly as of August 24, 2026. **Do not modify, refactor, "improve," or restructure anything on this list unless the person explicitly asks for a change to that specific item in this specific conversation.** If a requested fix would require touching a locked file, make the minimal possible change and say explicitly what you touched and why — do not do drive-by cleanup of locked code while you're in the file for an unrelated fix.

This list will be updated over time. If something isn't on this list, it's not automatically fair game to change either — this just marks items with extra confirmed confidence behind them.

---

## LOCKED — Confirmed working, do not modify without explicit request

1. **Research creation flow** (`src/app/research/create/page.tsx`, `src/app/research/[id]/config/page.tsx`, `src/app/research/[id]/plan/page.tsx`) — topic/goal entry → depth & scope configuration → AI question deconstruction. Verified: produces specific, topic-relevant research questions, not templated filler.

2. **YouTube Intelligence tab** (`src/app/research/[id]/youtube/page.tsx` and its supporting engine code) — when populated, produces real, specific reviewer-consensus points, coverage gaps, and content-angle suggestions. Confirmed substantive, not generic.

3. **Provenance & Lineage page's honesty logic** (`src/app/research/[id]/provenance/page.tsx`) — correctly labels unbacked claims "UNBACKED" rather than hiding failures. This is a reference implementation of the correct pattern — other pages should be made to match this, not the other way around.

4. **Ask AI** (`src/app/research/[id]/ask/page.tsx`) — correctly states the real claim/source count (including zero) rather than fabricating an answer.

5. **Quality Gate Validator** (`src/features/research/quality-gate.ts`) — the validation logic itself is correct: it blocks on zero sources/claims/evidence. Do not change this file's logic as part of fixing the status-route bypass described in the required-fixes list below — the bug is that this validator gets skipped in the failure path, not that its own rules are wrong.

6. **Source Trust Intelligence Center** (`src/app/research/sources/page.tsx`) — well-designed UI, confirmed working.

7. **Project creation CRUD** (`src/app/projects/page.tsx` and its API route) — basic create/list works correctly.

8. **The research state machine's status values and transitions** (`ResearchStateMachine`, `RunStatus` type in `research-engine.ts`) — including the explicit `FAILED` status and the per-stage `updateStatus()` persistence pattern. This design is correct; the problem described in required fixes is that one code path (the status-check fallback) bypasses it entirely rather than that the state machine itself is flawed.

9. **The Aug 23 anti-fabrication fix already applied to `research-engine.ts`'s search/claim/brief-generation error handling** — do not reintroduce a `MockSearchProvider` or similar silent fallback into any of those specific blocks.

---

## NOT YET REVIEWED — no lock status either way

Everything not listed above (or in the known-issues list the person will provide alongside this file) has not been specifically verified working or broken. Normal engineering judgment applies — this file only marks the items with extra confirmed confidence.
