# Internal Route Guard Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and keep the scope narrow. This is a generalization pass, not a new endpoint slice.

**Goal:** Generalize the debug-only access boundary into a reusable internal-route guard so future debug or admin routes can adopt the same contract without copying status, token, and denial logic.

**Why this slice exists:** `src/lib/debug/access.ts` solved one route cleanly, but its naming and messages are still tied to cache debug semantics. The next improvement is to centralize the generic guard behavior while preserving the cache debug route as a specialization.

**Scope:** `src/lib/internal-route/access.ts`, `src/lib/debug/access.ts`, route-level tests, and cache debug route integration.

## Task 1: Add red tests for the generic guard

**Files:**
- Create: `tests/api/internal-route-access.test.ts`
- Modify: `tests/api/debug-access.test.ts`

- [ ] Verify a generic internal route returns:
  - `404 disabled`
  - `401 missing-secret`
  - `401 token-mismatch`
  - allow result with the configured header name
- [ ] Keep debug access tests focused on the cache debug specialization rather than the generic implementation details

## Task 2: Implement the generic guard

**Files:**
- Create: `src/lib/internal-route/access.ts`
- Modify: `src/lib/debug/access.ts`

- [ ] Move shared access evaluation into the generic guard
- [ ] Accept route-specific labels, header names, enabled check, and secret lookup as inputs
- [ ] Keep the cache debug specialization behavior unchanged for callers

## Task 3: Verify and compound

- [ ] Run targeted tests for generic and debug access
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a new compound artifact under `docs/knowledge/`
