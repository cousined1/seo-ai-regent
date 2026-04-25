# Debug Backend Status Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` for route behavior and `superpowers:verification-before-completion` before closing the slice.

**Goal:** Add a second real consumer of the guarded internal debug path by exposing a safe backend-status snapshot at `/api/debug/backend-status`.

**Why this slice exists:** The internal-route guard is now generic, but only one live route uses it. A backend-status endpoint is a real operator-facing consumer that exposes useful non-secret state: persistence readiness, upstream integration readiness, snapshot policy windows, and observability settings.

**Scope:** `src/app/api/debug/backend-status/route.ts`, a small status helper under `src/lib/debug/`, targeted route tests, and a compound artifact.

## Task 1: Red tests

**Files:**
- Create: `tests/api/debug-backend-status.test.ts`

- [ ] Verify the route returns `404` when debug access is disabled
- [ ] Verify the route returns `401` when the debug token is wrong or missing
- [ ] Verify the route returns a safe status payload when the token matches

## Task 2: Implement the route

**Files:**
- Create: `src/lib/debug/backend-status.ts`
- Create: `src/app/api/debug/backend-status/route.ts`

- [ ] Reuse the existing debug access boundary
- [ ] Return safe config booleans and operator-friendly reason strings
- [ ] Return current snapshot freshness windows and observability retention settings
- [ ] Do not expose secrets or raw tokens

## Task 3: Verify and compound

- [ ] Run targeted tests for the new route
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
