# Debug Access Boundary Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` for the red-green cycle and `superpowers:verification-before-completion` before claiming success.

**Goal:** Convert one-off debug route gating into a reusable debug-access boundary so future internal routes share the same enablement and token enforcement contract.

**Why this slice exists:** The cache metrics debug route already requires an env flag and shared secret, but the logic is embedded in the route. That is acceptable for one endpoint and weak for a family of internal routes. The next slice should centralize the policy, preserve current behavior, and make denial reasons explicit.

**Scope:** `src/lib/debug/access.ts`, `src/app/api/debug/cache-metrics/route.ts`, `.env.example`, and targeted tests.

## Task 1: Write the failing boundary tests

**Files:**
- Create: `tests/api/debug-access.test.ts`
- Modify: `tests/api/debug-cache-metrics.test.ts`

- [ ] Add tests for:
  - disabled debug access returns `404` with reason `disabled`
  - enabled access with missing configured secret returns `401` with reason `missing-secret`
  - enabled access with mismatched header returns `401` with reason `token-mismatch`
  - enabled access with matching header returns an allow verdict
- [ ] Update route tests so the cache metrics route asserts the denial reason it receives from the shared boundary.

## Task 2: Implement the shared boundary

**Files:**
- Create: `src/lib/debug/access.ts`

- [ ] Export a reusable access evaluator for debug/internal routes
- [ ] Keep the env-backed configuration source in `src/lib/observability/cache-log.ts`
- [ ] Use one canonical header name for token auth: `x-cache-debug-token`

## Task 3: Refactor the route through the boundary

**Files:**
- Modify: `src/app/api/debug/cache-metrics/route.ts`

- [ ] Replace inline access checks with the shared boundary
- [ ] Preserve the successful response shape
- [ ] Return explicit denial reasons in the JSON payload for operational clarity

## Task 4: Verify and compound

- [ ] Run targeted tests for debug access and debug cache metrics
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
