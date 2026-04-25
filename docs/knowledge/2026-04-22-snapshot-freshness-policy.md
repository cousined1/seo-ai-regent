---
type: implementation
tags:
  - seo-ai-regent
  - snapshots
  - cache
  - freshness
  - versioning
confidence: high
created: 2026-04-22
source: local-test-and-build
---

# Snapshot Freshness Policy

## What Changed

- Added `src/lib/persistence/policy.ts` as the shared freshness/version gate.
- Both persisted snapshot types now store metadata:
  - `meta.storedAt`
  - `meta.version`
- Both snapshot readers now reject stored entries when:
  - metadata is missing
  - version mismatches the current reader contract
  - age exceeds the allowed window

## Active Policy

- Keyword snapshot version: `keyword-v1`
- Score snapshot version: `analysis-v1`
- Keyword snapshot max age: `12h`
- Score snapshot max age: `2h`

## Route Effects

- `/api/serp/analyze` now returns persisted-snapshot metadata only when the snapshot is both present and policy-valid.
- `/api/score/content` now returns persisted score metadata only when the stored score snapshot is policy-valid.
- Invalid snapshots are treated as misses and recomputed normally.

## Why This Matters

Reuse is now correctness-aware:

- old keyword intelligence ages out
- score snapshots expire faster than keyword research
- schema/contract changes can invalidate stale stored payloads explicitly

This prevents fast-but-wrong reuse when retrieval or scoring contracts change.

## Verification

- Added focused tests for policy decisions, stale rejection, and version rejection.
- Full suite passed: `52` tests.
- Production build passed on `Next.js 15.5.15`.

## Guidance For Next Slice

The next backend move should be observability rather than another storage layer:

1. expose why a request was recomputed (`stale`, `version-mismatch`, `missing-meta`, `miss`)
2. add lightweight metrics or counters for hit/miss reasons
3. consider a cleanup path for expired snapshots if table growth starts to matter
