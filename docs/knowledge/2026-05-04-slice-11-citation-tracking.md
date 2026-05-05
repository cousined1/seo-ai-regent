---
type: slice-completion
tags: [slice-11, citation-tracking, geo-monitoring, trend-analysis, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 11
---

# Slice 11 Complete: Citation Check → Trend Model → Alerts

## What Was Built

### Schema (prisma/schema.prisma)
- Added `CitationEngine` enum: CHATGPT, PERPLEXITY, CLAUDE, GEMINI, COPILOT
- Added `CitationCheck` model (workspaceId, query, engine, found, position, snippet, url, checkedAt)
- Added `CitationTrend` model (workspaceId, query, engine, citationScore, totalChecks, foundCount, avgPosition, period, periodStart, periodEnd)
- Added `citationChecks` and `citationTrends` relations to Workspace model

### Services
- `src/lib/citations/service.ts` — calculateCitationScore (weighted by position: position 1 = 1.0, position 2 = 0.9, etc.), aggregateTrend (aggregates checks into period-level metrics with avg position), detectCitationChanges (compares previous vs current checks → gained/lost/improved/dropped), getEngineDisplayName, getScoreColor

### API Routes
- `POST /api/citations/check` — record citation checks for multiple queries/engines
- `GET /api/citations/trends?workspaceId=&query=` — get citation trends with change detection, summary counts (total/avgScore/gained/lost)

### UI
- `/app/workspaces/[id]/citations` — Citation Tracking dashboard
- Summary cards (queries tracked, avg score, gained, lost)
- Per-query cards with citation score badge, engine status badges (green for found, gray for not found), cited engine count, average position, recent changes section with color-coded change indicators

### Tests
- `tests/lib/citations/service.test.ts` — 14 tests (citation score for all/none/half engines, position weighting, empty records, trend aggregation, avg position calculation, null avg for no citations, gained/lost/improved/dropped detection, no-change handling, new engine handling)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 305 tests pass (50 files, +14 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Citation score is position-weighted**: Unlike simple found/not-found counting, the score factors in position. Position 1 = 1.0, position 2 = 0.9, position 10 = 0.1. This means being cited at position 1 on 2 engines scores higher than being cited at position 10 on 4 engines.

2. **Change detection compares engine-by-engine**: The `detectCitationChanges` function builds maps of previous and current checks by engine, then compares each engine's status. Four change types:
   - `gained`: was not found, now found
   - `lost`: was found, now not found
   - `improved`: found at both times, position improved
   - `dropped`: found at both times, position dropped

3. **Trend aggregation is period-based**: The `aggregateTrend` function groups checks by period (e.g., "2026-05") and calculates aggregate metrics. This enables monthly trend tracking and comparison across periods.

4. **Five AI engines tracked**: CHATGPT, PERPLEXITY, CLAUDE, GEMINI, COPILOT. The system is designed to be extensible — adding a new engine just requires adding to the enum.

5. **UI shows engine status at a glance**: Each engine gets a badge showing found/not-found status with position. Green badges for found citations, gray for not found. This gives instant visibility into citation presence across all engines.

6. **Changes are surfaced prominently**: The "Recent Changes" section shows gained/lost/improved/dropped indicators with color coding (green for positive, red for negative). This is the alert system — users can quickly see what changed since the last check.

## Next Steps

Slice 12: Backlink Opportunity Discovery → Outreach Workflow

## Files Changed

- `prisma/schema.prisma` — CitationCheck, CitationTrend models + CitationEngine enum
- `src/lib/citations/service.ts` — new
- `src/app/api/citations/check/route.ts` — new
- `src/app/api/citations/trends/route.ts` — new
- `src/app/app/workspaces/[id]/citations/page.tsx` — new
- `tests/lib/citations/service.test.ts` — new
