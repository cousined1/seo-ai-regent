---
type: compound
tags:
  - backend
  - debug
  - observability
  - snapshots
  - invalidation
confidence: high
created: 2026-04-22
source: local-test-and-build
supersedes:
  - 2026-04-22-snapshot-invalidation-controls.md
---

# Snapshot Invalidation Observability

## What changed

Manual snapshot purges now emit a structured observability event through the shared JSONL pipeline.

Added:

- `recordSnapshotInvalidationEvent()` in `src/lib/observability/cache-metrics.ts`
- optional `target` and `deleted` fields on `CacheEvent` in `src/lib/observability/cache-log.ts`

`/api/debug/snapshots/invalidate` now records an event after a successful purge with:

- `route: "debugSnapshotInvalidate"`
- `source: "manual-invalidation"`
- `recomputeReason: null`
- `target`
- `deleted`

## Why it matters

The invalidation route already mutated persisted state and left no audit signal behind. This slice keeps observability narrow by reusing the existing cache/debug event stream instead of creating a second logging system.

That gives operators one more useful property:

- manual purge activity is visible in the same recent-event surface as cache reuse behavior

## Verification

- Targeted test passed:
  - `npm test -- tests/api/debug-snapshot-invalidation.test.ts`
  - `5/5` tests passed
- Full suite passed:
  - `npm test`
  - `84/84` tests passed
- Production build passed:
  - `npm run build`
  - Next.js `15.5.15` production build completed successfully

## Guidance For Next Slice

The next narrow observability move should be to expose invalidation events explicitly in the debug metrics contract:

1. add a targeted test proving `recentEvents` can include invalidation entries with `target` and `deleted`
2. decide whether the manifest contract for `/api/debug/cache-metrics` should advertise these optional event fields
3. keep the scope on debug-surface clarity, not on building a broader audit product
