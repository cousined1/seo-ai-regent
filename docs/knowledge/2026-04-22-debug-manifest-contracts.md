---
type: compound
tags:
  - backend
  - debug
  - manifest
  - contracts
confidence: high
created: 2026-04-22
source: local-repo
supersedes:
  - 2026-04-22-debug-manifest.md
---

# Debug Manifest Contracts

## What changed

The debug manifest entries now expose machine-readable contract metadata in addition to summaries.

Each route entry in `src/lib/debug/manifest.ts` now includes:

- `contractVersion`
- `responseSchema`

The schema hints stay intentionally lightweight and shallow. They describe the expected top-level response field kinds for each route rather than introducing a full schema framework.

Current contract versions:

- `backend-status.v1`
- `cache-metrics.v1`

## Why it matters

This is enough for tooling to detect drift in the debug route surface:

- a version bump signals an intentional contract change
- a schema hint diff signals a top-level response shape change

That gives machine consumers something stable to compare without overengineering the introspection layer.

## Verification

- `npm test -- tests/api/debug-manifest.test.ts`
- `npm test`
- `npm run build`

Results:

- targeted manifest contract tests passed
- full suite passed: `75/75`
- production build passed on `Next.js 15.5.15`

## Follow-on

The next narrow backend step is to move these contract versions and schema hints into shared constants near the route helpers so manifest metadata and route implementation stay coupled by source instead of only by convention.
