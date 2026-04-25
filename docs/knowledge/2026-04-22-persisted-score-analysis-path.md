---
type: implementation
tags:
  - seo-ai-regent
  - prisma
  - scoring
  - snapshots
  - cache
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Persisted Score Analysis Path

## What Changed

- Added `ScoreSnapshot` to the Prisma schema.
- Added `src/lib/analysis/snapshots.ts` for:
  - content-hash cache key generation
  - persisted score snapshot writes
  - persisted score snapshot reads
  - JSON validation/normalization on read
- `/api/score/content` now follows this order:
  1. persisted score snapshot
  2. in-memory SERP cache
  3. persisted keyword snapshot
  4. fresh keyword analysis + score recompute

## Why This Matters

This is the first real reusable scoring pipeline:

- keyword research can be reused without recomputation
- full score results can be reused without recomputation
- cold requests no longer have to recompute the entire chain when stored artifacts exist

## Route Contract

- Fresh recompute path returns `analysis.persisted = false` when Prisma is unavailable.
- Fresh recompute path returns `analysis.persisted = true` with a `snapshotId` when saved.
- Persisted score-hit path returns stored scores directly with:
  - `analysis.persisted = true`
  - `analysis.snapshotId`

## Verification

- New targeted tests passed for:
  - score snapshot persistence
  - score snapshot reads
  - route-level reuse of stored score results
- Full suite passed: `47` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next backend move should be invalidation and freshness policy:

1. decide TTL/versioning rules for keyword and score snapshots
2. detect when stored score snapshots should be bypassed
3. optionally persist provenance such as `source`, `computedAt`, and model/version metadata
