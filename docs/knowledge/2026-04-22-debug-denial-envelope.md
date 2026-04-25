---
type: compound
tags:
  - backend
  - debug
  - access-control
  - responses
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-route-owned-debug-contracts.md
---

# Debug Denial Envelope

## What changed

Added a shared denied-response helper at `src/lib/debug/responses.ts`.

`toDebugAccessDeniedResponse()` now converts denied `evaluateDebugAccess()` results into the canonical debug JSON envelope:

- `error`
- `reason`

The three guarded debug routes now reuse that helper:

- `/api/debug`
- `/api/debug/backend-status`
- `/api/debug/cache-metrics`

## Why it matters

The debug surface already shared access evaluation and still repeated denial response formatting inline. This slice centralizes that final step, which means:

- access semantics and denial formatting now move together
- debug routes stay thinner
- response drift risk drops if denial fields or shape ever change

## Verification

- `npm test -- tests/api/debug-manifest.test.ts tests/api/debug-backend-status.test.ts tests/api/debug-cache-metrics.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted debug route tests passed
- full suite passed: `76/76`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to share the guarded debug success envelope or route wrapper, so the routes can collapse the repeated `evaluate -> deny -> return payload` pattern into one helper without changing their individual payload contracts.
