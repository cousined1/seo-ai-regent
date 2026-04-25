---
type: implementation
tags:
  - seo-ai-regent
  - observability
  - cache
  - logging
  - debug-route
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Externalized Cache Observability

## What Landed

- Added `src/lib/observability/cache-log.ts` for JSONL event logging.
- Added `src/app/api/debug/cache-metrics/route.ts` for live metrics inspection plus recent persisted events.
- Route cache metrics are now externalized in two ways:
  - in-process counters
  - persisted structured log events

## Structured Log Contract

Each cache event is appended as one JSON line with:

- `timestamp`
- `route`
- `source`
- `recomputeReason`

Default log path:

- `logs/cache-observability.jsonl`

Override support:

- `CACHE_OBSERVABILITY_LOG_PATH`

## Route Contracts

### `/api/debug/cache-metrics`

Returns:

- `metrics`
- `recentEvents`

### Logged route outcomes

- `serpAnalyze`
  - sources: `memory-cache`, `persisted-keyword-snapshot`, `fresh-analysis`
- `scoreContent`
  - sources: `persisted-score-snapshot`, `memory-cache`, `persisted-keyword-snapshot`, `fresh-analysis`

Recompute reasons:

- `miss`
- `stale`
- `version-mismatch`
- `missing-meta`

## Why This Matters

Cache behavior is now visible outside test code and survives process restarts:

- debug requests can inspect current process counters
- JSONL logs preserve historical recompute reasons
- stale/version-invalid artifacts are observable instead of silent fallbacks

## Verification

- Added tests for:
  - JSONL log persistence
  - debug route output
  - route-level observability fields
- Full suite passed: `57` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next useful backend move is operational polish:

1. add log rotation or pruning strategy for `cache-observability.jsonl`
2. consider auth/guardrails for the debug route
3. optionally emit the same events to the hosting platform logger for centralized inspection
