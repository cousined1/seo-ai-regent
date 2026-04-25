---
type: compound
tags:
  - backend
  - access-control
  - debug
  - internal-routes
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-debug-access-boundary.md
---

# Internal Route Guard

## What changed

The debug-only access boundary was generalized into a reusable internal-route guard at `src/lib/internal-route/access.ts`.

That guard now owns the canonical internal route contract:

- `404` with reason `disabled`
- `401` with reason `missing-secret`
- `401` with reason `token-mismatch`
- success result with the route's configured header name

`src/lib/debug/access.ts` remains as a thin cache-debug specialization over the generic guard, so the cache metrics route keeps the same external behavior while future internal routes have a reusable access primitive.

## Why it matters

The prior debug boundary was reusable in practice and still named and shaped around one route family. This slice removed that coupling without introducing a fake second endpoint.

The result is a cleaner layering model:

- generic internal-route policy in one place
- route-family specialization in one place
- route handler logic stays thin

That reduces drift if a future admin or debug route is added and avoids repeating token/header/status logic.

## Verification

- `npm test -- tests/api/internal-route-access.test.ts tests/api/debug-access.test.ts tests/api/debug-cache-metrics.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted guard tests passed
- full suite passed: `69/69`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to add a second real consumer of the internal-route guard, likely another debug or admin introspection endpoint, so the abstraction is exercised by more than one route family.
