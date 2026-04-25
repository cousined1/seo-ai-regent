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
  - 2026-04-22-debug-denial-envelope.md
---

# Debug Success Wrapper

## What changed

Added `withDebugAccess()` to `src/lib/debug/responses.ts`.

This helper now owns the common guarded debug route flow:

1. evaluate debug access
2. return the shared denied response envelope when access fails
3. serialize the route-specific success payload when access succeeds

The three debug routes now use that wrapper:

- `/api/debug`
- `/api/debug/backend-status`
- `/api/debug/cache-metrics`

## Why it matters

The debug surface now shares the full guarded route skeleton instead of only parts of it. That reduces the remaining duplication to the real point of variation: each route’s success payload.

This keeps the implementation narrow and predictable:

- one access evaluator
- one denied response envelope
- one guarded success wrapper
- route-specific payload factories only

## Verification

- `npm test -- tests/api/debug-manifest.test.ts tests/api/debug-backend-status.test.ts tests/api/debug-cache-metrics.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted debug route tests passed
- full suite passed: `77/77`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to decide whether this debug wrapper pattern should stay debug-only or become a more general internal-route wrapper for future admin/introspection surfaces that share the same guard model.
