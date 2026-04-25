---
type: compound
tags:
  - backend
  - debug
  - manifest
  - observability
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-debug-backend-status.md
---

# Debug Manifest

## What changed

Added a guarded debug manifest endpoint at `src/app/api/debug/route.ts`.

The manifest is backed by `src/lib/debug/manifest.ts` and enumerates the current live introspection surfaces:

- `/api/debug/backend-status`
- `/api/debug/cache-metrics`

For each route, it exposes:

- path
- method
- short summary
- stable top-level response fields

## Why this matters

The debug routes now stay separate, which keeps each endpoint focused and stable, but they are no longer hidden knowledge. Operators and future tooling can discover the available introspection surfaces through one guarded entrypoint without forcing those routes into a single overloaded handler.

This is the right middle ground:

- separate routes preserve single responsibility
- one manifest improves discoverability
- the existing debug guard remains the only access control path

## Verification

- `npm test -- tests/api/debug-manifest.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted manifest tests passed
- full suite passed: `75/75`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to version these manifest contract entries or add lightweight machine-readable schema hints so external tooling can detect contract drift instead of treating the summaries as purely human-facing metadata.
