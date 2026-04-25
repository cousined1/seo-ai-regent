---
type: compound
tags:
  - backend
  - debug
  - observability
  - contracts
  - cache-metrics
confidence: high
created: 2026-04-22
source: local-test-and-build
supersedes:
  - 2026-04-22-snapshot-invalidation-observability.md
---

# Cache Metrics Contract V2

## What changed

The route-owned contract for `/api/debug/cache-metrics` now explicitly advertises the optional invalidation-event fields inside `recentEvents`.

Updated `src/lib/debug/cache-metrics.ts`:

- bumped `contractVersion` from `cache-metrics.v1` to `cache-metrics.v2`
- changed `responseSchema.recentEvents` from a shallow `"array"` marker to a structured item hint

The schema hint now describes:

- `timestamp`
- `route`
- `source`
- `recomputeReason`
- optional `target`
- optional `deleted`

## Why it matters

The route behavior already returned invalidation events correctly. The stale part was the discovery contract exposed through the debug manifest. This slice brings the contract back in sync with the real payload shape so tooling can distinguish ordinary cache events from manual invalidation events without guessing.

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

The next narrow contract move should be to make the invalidation-event field shapes less opaque:

1. replace `target: "object|optional"` with a shallow object hint for `keyword` and `scope`
2. replace `deleted: "object|optional"` with a shallow object hint for `keywordSnapshots` and `analysisSnapshots`
3. keep the scope on manifest/schema clarity only, not endpoint behavior
