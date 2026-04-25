---
type: implementation
tags:
  - seo-ai-regent
  - snapshots
  - provenance
  - persistence
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Snapshot Provenance

## What changed

- Added keyword snapshot provenance support in `src/lib/keywords/snapshots.ts`.
- Added score snapshot provenance support in `src/lib/analysis/snapshots.ts`.
- Persisted snapshot metadata now includes:
  - `meta.computedAt`
  - `meta.source`
  - `meta.version`
- Score snapshots also persist:
  - `meta.pipeline.analysisVersion`
  - `meta.pipeline.keywordVersion`
  - `meta.keywordSnapshot` when a persisted keyword snapshot shaped the score write

## Route contract changes

### `/api/serp/analyze`

- fresh and memory-cache snapshot writes now record provenance
- persisted snapshot hits now return `snapshot.provenance`

### `/api/score/content`

- fresh score snapshot writes now record provenance
- score snapshot writes can carry upstream keyword snapshot provenance
- persisted score snapshot hits now return `analysis.provenance`

## Compatibility behavior

Older stored rows that only contain `storedAt` and `version` remain readable when policy checks still pass.

- keyword snapshot reads return `provenance: null` for legacy rows
- score snapshot reads return `provenance: null` for legacy rows

That keeps this slice deployable without a backfill or schema migration.

## Why it matters

The persistence layer now preserves more of the reuse chain:

- when a snapshot was computed
- what path produced it
- which keyword snapshot version fed a stored score result
- which analysis and keyword contract versions were active at write time

This makes future invalidation, cleanup, and operator diagnostics more precise without widening the canonical scoring contract.

## Verification

- Focused provenance tests passed:
  - `npm test -- tests/api/keyword-snapshots.test.ts tests/api/content-analysis-snapshots.test.ts tests/api/serp-analyze.test.ts tests/api/score-content.test.ts`
  - `18/18` tests passed
- Final full suite passed:
  - `npm test`
  - `79/79` tests passed
- Production build passed:
  - `npm run build`
  - Next.js `15.5.15` production build completed successfully

## Next slice

The next narrow backend move should be active invalidation controls:

1. decide whether invalidation is route-driven, internal-only, or write-through on version bumps
2. define the smallest safe way to bypass or purge stale keyword and score artifacts
3. keep the scope on snapshot lifecycle control rather than widening into general admin tooling
