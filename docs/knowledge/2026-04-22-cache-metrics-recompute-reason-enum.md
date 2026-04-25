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
  - 2026-04-22-cache-metrics-source-route-enums.md
---

# Cache Metrics Recompute Reason Enum

## What changed

The `/api/debug/cache-metrics` manifest contract now constrains `recomputeReason` to the values the event pipeline currently emits, plus `null`.

Updated `src/lib/debug/cache-metrics.ts`:

- `recomputeReason` now hints:
  - `miss`
  - `stale`
  - `version-mismatch`
  - `missing-meta`
  - `null`

This remains a descriptor-only refinement. Runtime behavior and event payloads were unchanged.

## Why it matters

After tightening `route`, `source`, and invalidation-specific branches, `recomputeReason` was the remaining generic part of the stable cache-event vocabulary. This slice makes the manifest more precise for tooling and removes another place where consumers would otherwise infer constraints from implementation instead of from contract.

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

The next clean schema move is likely to decide whether `cache-metrics.v2` should become `v3` now that the manifest contract has materially tightened across multiple fields, or to stop here if consumers are not versioning against these hints yet.
