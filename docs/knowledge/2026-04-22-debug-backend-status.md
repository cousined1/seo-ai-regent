---
type: compound
tags:
  - backend
  - debug
  - observability
  - internal-routes
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-internal-route-guard.md
---

# Debug Backend Status

## What changed

Added a second real guarded introspection endpoint at `src/app/api/debug/backend-status/route.ts`.

The new route reuses the existing debug access boundary and returns a safe backend status snapshot built by `src/lib/debug/backend-status.ts`. The payload includes:

- persistence readiness from the Prisma boundary
- Serper integration readiness
- current keyword and analysis snapshot policy versions and max ages
- debug-route enablement state and observability log retention

No secrets or raw tokens are exposed.

## Why it matters

The internal-route guard is now exercised by more than one live endpoint:

- `/api/debug/cache-metrics`
- `/api/debug/backend-status`

That makes the abstraction real instead of anticipatory. It also gives operators a useful route for configuration and policy introspection that complements cache metrics instead of duplicating them.

## Verification

- `npm test -- tests/api/debug-backend-status.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted backend-status tests passed
- full suite passed: `72/72`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to decide whether the two debug routes should stay separate or be grouped behind a single debug index/manifest endpoint that enumerates available introspection surfaces and their contracts.
