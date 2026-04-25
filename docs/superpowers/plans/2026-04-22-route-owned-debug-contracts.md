# Route-Owned Debug Contracts Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and move metadata ownership toward the route/helper source, not toward the manifest.

**Goal:** Move debug manifest contract versions and schema hints into shared constants near the route helpers so route behavior and manifest metadata stay coupled by source.

**Why this slice exists:** The manifest currently owns contract metadata for backend-status and cache-metrics. That works and drifts easily. The route/helper layer should own its own contract descriptor, and the manifest should compose from those descriptors.

**Scope:** `src/lib/debug/backend-status.ts`, a new cache-metrics helper descriptor, `src/lib/debug/manifest.ts`, and targeted tests.

## Task 1: Red test

**Files:**
- Modify: `tests/api/debug-manifest.test.ts`

- [ ] Keep the manifest output exactly stable while preparing for metadata ownership changes
- [ ] Optionally assert manifest route count stays aligned with route-owned descriptors

## Task 2: Move metadata ownership

**Files:**
- Modify: `src/lib/debug/backend-status.ts`
- Create: `src/lib/debug/cache-metrics.ts`
- Modify: `src/lib/debug/manifest.ts`

- [ ] Export one route contract descriptor per debug surface
- [ ] Keep the route payload contracts unchanged
- [ ] Refactor the manifest to compose from those descriptors

## Task 3: Verify and compound

- [ ] Run targeted manifest tests
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
