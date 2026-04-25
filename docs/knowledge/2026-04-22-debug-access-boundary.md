---
type: compound
tags:
  - backend
  - observability
  - debug
  - access-control
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-cache-operational-polish.md
---

# Debug Access Boundary

## What changed

This slice moved debug-route gating out of the cache metrics route and into a reusable boundary at `src/lib/debug/access.ts`.

The boundary now owns the canonical contract for internal debug access:

- route disabled: `404`, reason `disabled`
- token missing from configuration: `401`, reason `missing-secret`
- provided token mismatch: `401`, reason `token-mismatch`
- successful access: allow result with canonical header name `x-cache-debug-token`

`/api/debug/cache-metrics` now consumes that boundary instead of reimplementing env and header checks inline.

## Why it matters

The prior route-level hardening was secure enough for one endpoint and brittle for a family of internal routes. Centralizing the decision logic makes future debug or admin routes consistent by default and reduces the chance of drift in status codes, header names, or denial behavior.

Explicit denial reasons also improve operational clarity without weakening the route. The caller can distinguish:

- route intentionally dark
- route enabled but misconfigured
- route enabled and configured but unauthorized

## Verification

- `npm test -- tests/api/debug-access.test.ts tests/api/debug-cache-metrics.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted debug-access tests passed
- full suite passed: `65/65`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow slice should be to reuse this same boundary for any future internal debug/admin endpoints, or widen it into a generic internal-route guard if more than one route family appears.
