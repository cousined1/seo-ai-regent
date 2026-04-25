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
  - 2026-04-22-cache-metrics-contract-v2.md
---

# Cache Metrics Contract V2 Field Hints

## What changed

The `/api/debug/cache-metrics` manifest contract now advertises shallow field-level hints for invalidation events instead of opaque object markers.

Updated `src/lib/debug/cache-metrics.ts` so `responseSchema.recentEvents.item` now describes:

- `target.keyword`
- `target.scope`
- `deleted.keywordSnapshots`
- `deleted.analysisSnapshots`

These remain optional event branches, but their inner fields are now explicit in the route-owned descriptor.

## Why it matters

The prior `cache-metrics.v2` contract made invalidation support discoverable and still left two useful branches underspecified. This slice keeps the contract lightweight while making the invalidation event shape more legible for tooling and operators reading the manifest.

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

The next narrow contract move should be to tighten enum-like schema hints where they are already stable:

1. constrain `target.scope` to the current known values instead of a generic string hint
2. consider constraining `route` and `source` for debug cache events if the manifest is becoming tooling-facing
3. keep the scope on schema precision only, not route behavior
