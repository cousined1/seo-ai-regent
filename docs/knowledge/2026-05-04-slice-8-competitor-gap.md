---
type: slice-completion
tags: [slice-8, competitor-intelligence, gap-analysis, content-strategy, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 8
---

# Slice 8 Complete: Competitor Gap → Brief → Content or Refresh Action

## What Was Built

### Schema (prisma/schema.prisma)
- Added `CompetitorPriority` enum: LOW, MEDIUM, HIGH, CRITICAL
- Added `Competitor` model (workspaceId, domain, market, priority, notes) with unique constraint on [workspaceId, domain]
- Added `CompetitorSnapshot` model (competitorId, keywords JSON, contentPatterns JSON, topPages JSON, crawledAt)
- Added `competitors` relation to Workspace model

### Services
- `src/lib/competitors/gap-analysis.ts` — extractKeywords (snapshot JSON → typed keyword objects), analyzeCompetitorGap (compares competitor keywords vs our keywords → missing/shared/total opportunity volume), detectContentPatterns (analyzes competitor page types → most common type, avg word count, type distribution), generateGapRecommendations (produces new_content and content_refresh recommendations prioritized by volume)

### API Routes
- `POST /api/competitors` — add competitor to workspace
- `GET /api/competitors?workspaceId=` — list workspace competitors with snapshot counts
- `DELETE /api/competitors` — remove competitor
- `POST /api/competitors/[id]/snapshot` — create competitor snapshot with keywords, content patterns, top pages
- `GET /api/competitors/gap?workspaceId=&competitorId=` — run gap analysis across all competitors, returns gap results with recommendations

### UI
- `/app/workspaces/[id]/settings/competitors` — Competitor Intelligence page
- Two-tab interface: Competitors (add competitor form with domain/market/priority, competitor list with priority badges, remove button, run gap analysis button) and Gap Analysis (per-competitor results with missing/shared keyword counts, opportunity volume, content patterns, prioritized recommendations)

### Tests
- `tests/lib/competitors/gap-analysis.test.ts` — 13 tests (keyword extraction, empty handling, missing fields, gap analysis for missing/shared keywords, opportunity volume calculation, content pattern detection, recommendation generation by type and priority)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 261 tests pass (47 files, +13 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Gap analysis is set-based**: The core algorithm compares competitor keywords against our keyword set using a Set for O(1) lookups. Missing keywords = competitor has them, we don't. Shared keywords = both have them. This is fast even for large keyword sets.

2. **Opportunity volume is additive**: The total opportunity volume is the sum of volumes for all missing keywords. This gives a single number to prioritize which competitor gaps to tackle first.

3. **Recommendations are typed and prioritized**: Two recommendation types:
   - `new_content`: For missing keywords, prioritized by volume (high: >=5000, medium: >=1000, low: <1000)
   - `content_refresh`: For shared keywords where we rank lower than competitor, prioritized by position gap

4. **Snapshots are point-in-time**: Each CompetitorSnapshot captures keywords, content patterns, and top pages at a moment in time. Multiple snapshots allow tracking competitor movement over time. The gap analysis uses the latest snapshot per competitor.

5. **Content patterns inform strategy**: The `detectContentPatterns` function analyzes competitor page types (guide, listicle, etc.) and average word count. This tells users what content format performs best in their space — if competitors rank with 3000-word guides, that's a signal for content depth.

6. **JSON fields need serialization**: Prisma JSON fields require `JSON.parse(JSON.stringify(...))` for complex objects to satisfy TypeScript/InputJsonValue constraints. This pattern was used consistently for snapshot data.

7. **Unique constraint enables clean upserts**: The `@@unique([workspaceId, domain])` constraint prevents duplicate competitor entries and enables clean error handling if a user tries to add the same domain twice.

## Next Steps

Slice 9: Internal Link Suggestion → Review → Score-Aware Editor Insertion

## Files Changed

- `prisma/schema.prisma` — Competitor, CompetitorSnapshot models + CompetitorPriority enum
- `src/lib/competitors/gap-analysis.ts` — new
- `src/app/api/competitors/route.ts` — new
- `src/app/api/competitors/[id]/snapshot/route.ts` — new
- `src/app/api/competitors/gap/route.ts` — new
- `src/app/app/workspaces/[id]/settings/competitors/page.tsx` — new
- `tests/lib/competitors/gap-analysis.test.ts` — new
