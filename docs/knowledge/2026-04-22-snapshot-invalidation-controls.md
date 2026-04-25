---
type: compound
tags:
  - backend
  - debug
  - snapshots
  - invalidation
  - persistence
confidence: high
created: 2026-04-22
source: local-test-and-build
supersedes:
  - 2026-04-22-snapshot-provenance.md
---

# Snapshot Invalidation Controls

## What changed

Added a guarded invalidation route at `src/app/api/debug/snapshots/invalidate/route.ts`.

The new route reuses the shared debug access wrapper and delegates the delete behavior to `src/lib/debug/snapshot-invalidation.ts`.

Supported modes:

- keyword purge:
  - request body contains `keyword`
  - deletes persisted keyword snapshots for the normalized query
  - deletes persisted score snapshots for the keyword
- analysis purge:
  - request body contains `keyword` and `content`
  - deletes only the exact persisted score snapshot for that keyword/content pair
  - leaves keyword snapshots untouched

The debug manifest now advertises this surface through `DEBUG_SNAPSHOT_INVALIDATION_CONTRACT`.

## Why it matters

The persistence layer now has an explicit operator control for stale or bad artifacts without widening into a generic admin subsystem.

This keeps the slice narrow and coherent:

- same debug guard as the other internal routes
- one route for manual invalidation
- route-owned contract metadata for discovery
- exact-content invalidation when only one score snapshot needs to be bypassed

## Verification

- Targeted tests passed:
  - `npm test -- tests/api/debug-snapshot-invalidation.test.ts tests/api/debug-manifest.test.ts`
  - `9/9` tests passed
- Full suite passed:
  - `npm test`
  - `83/83` tests passed
- Production build passed:
  - `npm run build`
  - Next.js `15.5.15` production build completed successfully

## Guidance For Next Slice

The next narrow persistence move should be invalidation observability:

1. emit a structured cache event when invalidation runs so operators can see manual purge activity alongside reuse metrics
2. decide whether invalidation responses should expose deleted snapshot ids in debug-only contexts or remain count-only
3. keep the scope on auditability of invalidation, not on broad mutation tooling
