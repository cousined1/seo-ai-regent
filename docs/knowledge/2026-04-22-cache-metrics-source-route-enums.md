---
type: compound
tags:
  - backend
  - debug
  - observability
  - contracts
  - schema
confidence: high
created: 2026-04-22
source: local-test-and-build
supersedes:
  - 2026-04-22-cache-metrics-scope-enum-hint.md
---

# Cache Metrics Source And Route Enums

## What changed

The `/api/debug/cache-metrics` manifest contract now constrains the remaining stable string hints in `recentEvents` to the values the event pipeline currently emits.

Updated `src/lib/debug/cache-metrics.ts`:

- `route` now hints:
  - `serpAnalyze`
  - `scoreContent`
  - `debugSnapshotInvalidate`
- `source` now hints:
  - `memory-cache`
  - `persisted-keyword-snapshot`
  - `persisted-score-snapshot`
  - `fresh-analysis`
  - `manual-invalidation`

This is still a descriptor-only change. Runtime behavior and event writing were unchanged.

## Why it matters

At this point the event stream already had a bounded vocabulary. Leaving `route` and `source` as generic strings forced tooling to infer a contract that the code already knew. This slice makes the manifest more truthful and more useful without widening scope beyond schema precision.

## Verification

- Targeted tests passed:
  - `npm test -- tests/api/debug-cache-metrics.test.ts tests/api/debug-manifest.test.ts`
  - `10/10` tests passed
- Full suite passed:
  - `npm test`
  - `85/85` tests passed
- Production build passed:
  - `npm run build`
  - Next.js `15.5.15` production build completed successfully

## Guidance For Next Slice

The next narrow schema move should be to tighten `recomputeReason` from `string|null` to its current bounded values plus `null`.
