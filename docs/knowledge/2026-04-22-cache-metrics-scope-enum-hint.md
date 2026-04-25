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
  - 2026-04-22-cache-metrics-contract-v2-field-hints.md
---

# Cache Metrics Scope Enum Hint

## What changed

The `/api/debug/cache-metrics` manifest contract now constrains `target.scope` to its current known values instead of advertising it as a generic string.

Updated `src/lib/debug/cache-metrics.ts`:

- `target.scope` now hints `["keyword", "analysis"]`

This keeps the refinement local to the route-owned descriptor and does not change runtime behavior.

## Why it matters

The invalidation event shape was already explicit at the field level. The remaining ambiguity was whether `scope` was open-ended. This slice makes the current contract more precise for tooling without pretending to support values the route does not emit.

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

The next narrow schema move should be to tighten the other stable string hints in `recentEvents`:

1. constrain `source` for invalidation and cache events if the manifest is now tooling-facing
2. consider constraining `route` to the currently emitted route ids
3. keep the scope on schema precision only, not event pipeline changes
