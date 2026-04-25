---
type: implementation
tags:
  - seo-ai-regent
  - prisma
  - serp
  - cache
  - keyword-snapshots
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Read Persisted Keyword Snapshots Before Recompute

## What Changed

- Added `readKeywordSnapshot()` to `src/lib/keywords/snapshots.ts`.
- `/api/serp/analyze` now follows this order:
  1. in-memory cache
  2. persisted Prisma snapshot
  3. fresh keyword analysis
- When a persisted snapshot is used, the route:
  - rehydrates the in-memory cache
  - returns `cache.status = "snapshot"`
  - returns the existing `snapshotId`

## Why This Matters

The route no longer recomputes keyword research when the process cache is cold but the database already has the latest snapshot. This is the first real read path that makes persisted backend state useful instead of write-only.

## Safety Notes

- Snapshot JSON is validated and normalized before being returned as `KeywordResearch`.
- Invalid or partial stored JSON is treated as a cache miss and falls back to recomputation.
- The in-memory cache remains the fastest path for repeated requests inside the same process.

## Verification

- New targeted tests passed for:
  - snapshot reader behavior
  - route-level persisted-snapshot reuse
- Full suite passed: `43` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next backend move should be to persist and reuse scored content analysis outputs, so `/api/score/content` can read from stored keyword research and score snapshots instead of recomputing the whole chain each time.
