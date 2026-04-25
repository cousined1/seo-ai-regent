---
type: implementation
tags:
  - seo-ai-regent
  - prisma
  - serp
  - persistence
  - keyword-snapshots
confidence: high
created: 2026-04-21
source: local-test-and-build
---

# Keyword Snapshot Persistence

## What Landed

- `/api/serp/analyze` now exposes snapshot persistence status in its response.
- Added `src/lib/keywords/snapshots.ts` as the first real Prisma-backed persistence path.
- Keyword research snapshots are stored through `keyword.create` using:
  - `query`
  - `serpData`
- `Keyword.userId` is now nullable so anonymous product flows can persist research before auth exists.

## Contract

- If Prisma is unavailable, the route still returns `200` with:
  - `snapshot.persisted = false`
  - explicit reason referencing `DATABASE_URL`
- If Prisma is available, the route persists the research payload and returns:
  - `snapshot.persisted = true`
  - `snapshotId`

## Why This Slice

This is the narrowest useful persistence path because it:

- touches a real production route
- avoids article/auth complexity
- proves Prisma runtime activation with write behavior
- preserves existing UI contracts while adding backend state

## Verification

- New targeted tests passed for route contract and snapshot writer.
- Full suite passed: `41` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next backend move should read from persisted snapshots before recomputing, or persist scored content analyses alongside the SERP snapshot so the scoring pipeline begins to accumulate reusable state.
