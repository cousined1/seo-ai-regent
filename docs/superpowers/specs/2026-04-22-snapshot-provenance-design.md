# Snapshot Provenance Design Spec

**Date:** 2026-04-22

**Project:** Rankforge

**Slice:** Snapshot provenance metadata for persisted keyword and score analysis artifacts

## Design Summary

The persistence layer already stores reusable keyword and score snapshots, and the readers already enforce freshness and contract version rules. What is still missing is provenance: enough stored context to explain where a snapshot came from, when it was computed, and which upstream artifact or pipeline version shaped it.

This slice adds provenance as narrow metadata inside the existing snapshot JSON payloads. The goal is not to redesign persistence. The goal is to make stored artifacts more auditable and more useful for later invalidation, cleanup, and operator-facing diagnostics.

## Scope

This slice covers:

- persisted keyword snapshot metadata
- persisted content analysis snapshot metadata
- reader exposure of stored provenance on valid snapshot hits
- route response metadata updates for `/api/serp/analyze` and `/api/score/content`
- targeted persistence and route tests

This slice does not cover:

- explicit invalidation endpoints
- cleanup or pruning of Prisma snapshot tables
- a schema migration to split provenance into separate Prisma columns

## Recommended Approach

The chosen approach is to expand the existing `meta` object inside persisted JSON payloads.

Why this approach:

- it keeps the slice narrow and compatible with the current storage model
- it avoids widening Prisma schema complexity for a metadata-only improvement
- it gives later invalidation and cleanup work better stored facts without forcing those decisions now

Alternatives considered and rejected:

- route-only provenance without persistence
  - rejected because it weakens auditability and loses history on stored rows
- separate provenance object or additional schema columns
  - rejected because it adds more structural churn than this slice requires

## Provenance Model

### Keyword Snapshot Provenance

Keyword snapshots will continue to store `meta.version` and `meta.storedAt`, and will add:

- `meta.computedAt`
- `meta.source`

Definitions:

- `computedAt`: when the keyword research result was originally computed for persistence
- `source`: how the persisted snapshot was produced for this write

Initial allowed keyword sources:

- `fresh-analysis`
- `memory-cache`

### Score Snapshot Provenance

Score snapshots will continue to store `meta.version` and `meta.storedAt`, and will add:

- `meta.computedAt`
- `meta.source`
- `meta.keywordSnapshot`
- `meta.pipeline`

Definitions:

- `computedAt`: when the score analysis result was computed
- `source`: whether the score snapshot came from a fresh scoring pass or another allowed reuse path
- `keywordSnapshot`: optional upstream keyword provenance when score computation reused a persisted keyword snapshot
- `pipeline`: shallow pipeline version metadata for the scoring snapshot contract

Initial allowed score sources:

- `fresh-analysis`

Initial `keywordSnapshot` shape:

- `snapshotId`
- `version`
- `computedAt`
- `source`

Initial `pipeline` shape:

- `analysisVersion`
- `keywordVersion`

## Data Flow

### `/api/serp/analyze`

When a keyword analysis is persisted:

- the writer records provenance into the snapshot `meta`
- the route continues to expose `snapshot.persisted` and `snapshotId`
- valid persisted hits additionally expose the stored provenance

Behavior stays the same for cache hit vs snapshot hit vs fresh analysis. This slice only enriches snapshot metadata.

### `/api/score/content`

When a score analysis is persisted:

- the writer records provenance into the score snapshot `meta`
- if score computation reused a persisted keyword snapshot, the score provenance includes that upstream snapshot reference
- the route continues to expose `analysis.persisted`, `snapshotId`, and policy
- valid persisted score hits additionally expose the stored provenance

This preserves the canonical scoring output while making the reuse chain inspectable.

## Contract Rules

- Existing freshness/version checks remain the source of truth for snapshot validity.
- Readers must treat missing required provenance fields as a non-fatal compatibility case for old rows during this slice unless a field is needed for policy.
- Existing scoring payloads must remain unchanged.
- New provenance fields belong in snapshot metadata only, not in the canonical scoring result.

## Compatibility Strategy

Older stored rows already exist with only `storedAt` and `version`. The readers should therefore:

- continue to accept old rows when policy metadata is valid
- expose `provenance: null` or partial provenance when older rows do not include the new fields
- avoid turning provenance rollout into a breaking persistence migration

This keeps the slice deployable without a backfill requirement.

## Testing

Tests should cover:

- keyword snapshot writes include provenance metadata
- score snapshot writes include provenance metadata
- score snapshot writes carry upstream keyword snapshot provenance when available
- readers return provenance on valid hits
- routes expose provenance in snapshot/analysis metadata without changing score payload contracts
- older rows without provenance remain readable when freshness/version policy still passes

## Risks

- over-modeling provenance and widening the slice beyond metadata
- accidentally making old persisted rows unreadable
- leaking provenance into canonical scoring output instead of response metadata

## Validation Gate

This slice is correct when:

- stored snapshots contain the new metadata
- valid persisted reads surface that metadata
- route contracts remain stable apart from added snapshot provenance fields
- old rows remain policy-compatible and readable

## Decision Record

Approved design decisions:

- provenance lives inside existing snapshot `meta` payloads
- compatibility with existing stored rows is preserved
- route metadata expands, canonical score payloads do not
