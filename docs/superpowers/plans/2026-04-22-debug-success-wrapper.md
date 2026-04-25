# Debug Success Wrapper Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and keep this slice scoped to the guarded debug route flow only.

**Goal:** Share the guarded debug success wrapper so routes stop repeating the `evaluate -> deny -> return payload` pattern.

**Why this slice exists:** The debug surface already shares access evaluation and denial formatting. The remaining duplication is the guard flow itself in each route.

**Scope:** `src/lib/debug/responses.ts`, debug route refactors, targeted tests, and a compound artifact.

## Task 1: Red test

**Files:**
- Modify: `tests/api/debug-manifest.test.ts`

- [ ] Add a narrow unit test for the shared success wrapper
- [ ] Keep all existing debug route payload contracts unchanged

## Task 2: Implement the wrapper

**Files:**
- Modify: `src/lib/debug/responses.ts`
- Modify: debug routes under `src/app/api/debug/**/route.ts`

- [ ] Add a `withDebugAccess()` helper that runs access evaluation and returns JSON success payloads
- [ ] Reuse the shared denial response helper on rejected access
- [ ] Preserve route-specific success payloads exactly

## Task 3: Verify and compound

- [ ] Run targeted debug route tests
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
