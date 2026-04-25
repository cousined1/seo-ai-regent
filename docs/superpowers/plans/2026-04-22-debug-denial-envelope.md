# Debug Denial Envelope Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and keep this slice limited to the debug route denial envelope only.

**Goal:** Share the guarded debug denial response envelope so all debug routes return denied access through one helper instead of repeating inline `error` and `reason` JSON blocks.

**Why this slice exists:** The debug routes already share access evaluation and still duplicate denial response construction. The next cleanup is to centralize that envelope so access semantics and denial formatting move together.

**Scope:** one response helper under `src/lib/debug/`, route refactors for `/api/debug`, `/api/debug/backend-status`, and `/api/debug/cache-metrics`, plus verification.

## Task 1: Red test

**Files:**
- Modify: `tests/api/debug-manifest.test.ts`
- Modify: `tests/api/debug-backend-status.test.ts`
- Modify: `tests/api/debug-cache-metrics.test.ts`

- [ ] Keep the denied response shape stable while route internals are refactored
- [ ] Optionally assert the helper is used via a narrow unit test if needed

## Task 2: Implement the shared envelope

**Files:**
- Create: `src/lib/debug/responses.ts`
- Modify: debug routes under `src/app/api/debug/**/route.ts`

- [ ] Convert denied `evaluateDebugAccess()` results into one canonical `NextResponse`
- [ ] Preserve exact route behavior and status codes

## Task 3: Verify and compound

- [ ] Run targeted debug route tests
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
