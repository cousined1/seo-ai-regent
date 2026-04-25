---
type: implementation
tags:
  - seo-ai-regent
  - observability
  - cache
  - snapshots
  - metrics
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Cache Observability

## What Changed

- Added `src/lib/observability/cache-metrics.ts` for in-process route cache counters.
- Snapshot readers now return explicit lookup outcomes:
  - `hit`
  - `miss`
  - `invalid` with reason
- Both routes now expose observability data in responses instead of making callers infer reuse behavior from payload shape.

## Route Contracts

### `/api/serp/analyze`

- `observability.source`
  - `memory-cache`
  - `persisted-keyword-snapshot`
  - `fresh-analysis`
- `observability.recomputeReason`
  - `null` when reused
  - `miss`
  - `stale`
  - `version-mismatch`
  - `missing-meta`

### `/api/score/content`

- `observability.analysisSource`
  - `persisted-score-snapshot`
  - `fresh-analysis`
- `observability.keywordSource`
  - `memory-cache`
  - `persisted-keyword-snapshot`
  - `fresh-analysis`
  - `null` when score snapshot reuse bypasses keyword lookup entirely
- `observability.recomputeReason`
  - `null` when a persisted score snapshot is reused
  - `miss`
  - `stale`
  - `version-mismatch`
  - `missing-meta`

## Why This Matters

Cache behavior is now explainable:

- callers can see whether work was reused or recomputed
- the system distinguishes cold misses from rejected stale/version-invalid artifacts
- route-level counters can now be inspected in tests or future admin/debug tooling

## Verification

- Added focused tests for:
  - route reason exposure
  - metrics tracking
  - snapshot policy routing
- Full suite passed: `55` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next useful backend move is lightweight externalization of these metrics:

1. add a debug-only route or log hook for cache metrics
2. emit structured server logs for recompute reasons
3. decide whether metrics should survive process restarts
