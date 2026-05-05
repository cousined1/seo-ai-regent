---
type: slice-completion
tags: [slice-10, rank-tracking, trend-analysis, keyword-monitoring, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 10
---

# Slice 10 Complete: Rank Tracking → Persistence → Trend UI

## What Was Built

### Schema (prisma/schema.prisma)
- Added `RankTracking` model (keywordId, position, url, serpFeatures JSON, competitorPosition, competitorUrl, checkedAt)
- Added `rankTrackings` relation to Keyword model
- Indexed on keywordId, checkedAt, and position for efficient trend queries

### Services
- `src/lib/rank-tracking/service.ts` — calculatePositionChange (previous - current, positive = improvement), getTrendDirection (up/down/stable/new), calculateTrend (filters records by date range, compares first vs last, calculates change and direction, includes competitor tracking), formatRankChange (+N/-N formatting), getRankBadgeColor (position-based color coding)

### API Routes
- `POST /api/rank-tracking/check` — record a rank check for a keyword (position, url, serpFeatures, competitor data)
- `GET /api/rank-tracking/trends?workspaceId=&keywordId=&days=` — get trends for all workspace keywords with 7/30/90-day views, includes summary counts (total/tracking/improving/declining)

### UI
- `/app/workspaces/[id]/rank-tracking` — Rank Tracking dashboard
- Summary cards (total keywords, tracking, improving, declining)
- Period toggle (7d/30d/90d) and filter buttons (all/improving/declining)
- Data table with keyword, position badge, change indicator with direction icon, mini sparkline chart, competitor position, volume, last checked date
- Color-coded position badges (green ≤3, blue ≤10, yellow ≤20, red >20)

### Tests
- `tests/lib/rank-tracking/service.test.ts` — 16 tests (position change calculation for improvement/drop/unchanged/missing, trend direction for all cases, 7/30/90-day trend calculation, null handling, single record handling, date range filtering, competitor position tracking, position gain identification)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 291 tests pass (49 files, +16 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Position change is inverted**: In SEO, lower position numbers are better. So `change = previous - current`. A positive change means improvement (moved from 10 to 3 = +7). This is counterintuitive but correct for ranking.

2. **Trend direction uses position comparison**: "up" means position improved (current < previous), "down" means position dropped (current > previous), "stable" means unchanged, "new" means no previous data.

3. **Date range filtering is critical**: The `calculateTrend` function filters records by a cutoff date (referenceDate - days). This allows the same dataset to produce different trends for 7/30/90-day views. The reference date parameter enables testing with fixed dates.

4. **Mini sparkline charts are SVG polylines**: The UI renders simple trend sparklines using SVG `<polyline>` elements. Points are calculated by normalizing positions to a fixed height/width. This is lightweight and doesn't require a charting library.

5. **Competitor tracking is optional**: The RankTracking model supports optional competitorPosition and competitorUrl fields. The trend calculation includes competitor change when data exists. This enables side-by-side comparison.

6. **Summary counts are computed client-side**: The trends API returns summary counts (total, tracking, improving, declining) computed from the results. This avoids a separate API call for dashboard metrics.

7. **Position badges use threshold-based coloring**: Four tiers: top 3 (green), top 10 (blue), top 20 (yellow), beyond 20 (red). This gives instant visual feedback on ranking quality.

## Next Steps

Slice 11: Citation Check → Trend Model → Alerts

## Files Changed

- `prisma/schema.prisma` — RankTracking model + rankTrackings relation on Keyword
- `src/lib/rank-tracking/service.ts` — new
- `src/app/api/rank-tracking/check/route.ts` — new
- `src/app/api/rank-tracking/trends/route.ts` — new
- `src/app/app/workspaces/[id]/rank-tracking/page.tsx` — new
- `tests/lib/rank-tracking/service.test.ts` — new
