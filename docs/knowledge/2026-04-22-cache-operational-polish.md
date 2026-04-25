---
type: implementation
tags:
  - seo-ai-regent
  - observability
  - cache
  - debug
  - operations
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Cache Operational Polish

## What Changed

- Added explicit environment gating for `/api/debug/cache-metrics`.
- The debug route is now disabled by default and returns `404` unless explicitly enabled.
- Added bounded retention for `cache-observability.jsonl`.

## Active Rules

### Debug route

- Env flag: `CACHE_DEBUG_ROUTE_ENABLED=true`
- Default: disabled

### Log retention

- Default retention: last `200` JSONL events
- Optional override: `CACHE_OBSERVABILITY_LOG_MAX_LINES`

## Why This Matters

- The debug route no longer exists by default outside intended debug contexts.
- The cache observability log no longer grows without bound.
- Operational behavior is explicit and test-covered instead of implied by local conventions.

## Verification

- Added tests for:
  - debug route disabled by default
  - debug route enabled via explicit override
  - JSONL log pruning behavior
- Full suite passed: `59` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next useful operational move is access hardening:

1. decide whether the debug route should remain env-gated only or require a shared secret/header
2. add log rotation by file size or date if the event volume grows beyond the line-based retention model
3. optionally split local debug metrics from production observability sinks
