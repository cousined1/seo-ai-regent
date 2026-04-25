---
type: compound
tags:
  - backend
  - debug
  - contracts
  - manifest
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-debug-manifest-contracts.md
---

# Route-Owned Debug Contracts

## What changed

Debug contract metadata is now owned by the route/helper layer instead of being hardcoded only in the manifest.

Added:

- `DEBUG_BACKEND_STATUS_CONTRACT` in `src/lib/debug/backend-status.ts`
- `DEBUG_CACHE_METRICS_CONTRACT` in `src/lib/debug/cache-metrics.ts`

The manifest in `src/lib/debug/manifest.ts` now composes its route list from `DEBUG_ROUTE_CONTRACTS`, which aggregates those helper-owned descriptors.

## Why it matters

This reduces contract drift risk in the right place. The metadata that describes each debug route now lives next to the helper or route logic that actually defines the payload, rather than only in a separate manifest layer.

That improves coupling by source:

- route/helper owns its contract descriptor
- manifest owns discovery and aggregation
- tests verify the composed output stays stable

## Verification

- `npm test -- tests/api/debug-manifest.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted manifest tests passed
- full suite passed: `75/75`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to share the guarded debug response envelope for denial cases so all debug endpoints reuse one response helper instead of repeating the same unauthorized/disabled JSON block.
