# Debug Manifest Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and keep the route documentation grounded in the real live debug surfaces only.

**Goal:** Add a guarded debug index/manifest endpoint that lists the available introspection routes and their response contracts.

**Why this slice exists:** There are now multiple guarded debug routes. A small manifest endpoint makes the surface discoverable for operators and future tooling without collapsing the routes into one oversized handler.

**Scope:** `src/app/api/debug/route.ts`, one small manifest helper under `src/lib/debug/`, targeted tests, and a compound artifact.

## Task 1: Red tests

**Files:**
- Create: `tests/api/debug-manifest.test.ts`

- [ ] Verify the manifest route returns `404` when debug access is disabled
- [ ] Verify the manifest route returns `401` when the token is invalid
- [ ] Verify the manifest route returns the current debug routes and contract summaries when authorized

## Task 2: Implement the manifest

**Files:**
- Create: `src/lib/debug/manifest.ts`
- Create: `src/app/api/debug/route.ts`

- [ ] Reuse the existing debug access boundary
- [ ] Enumerate only the current real routes
- [ ] Include route path, method, summary, and stable top-level response fields

## Task 3: Verify and compound

- [ ] Run targeted tests for the manifest route
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
