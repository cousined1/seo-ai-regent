---
type: slice-completion
tags: [slice-3, content-inventory, scoring, refresh-brief, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 3
---

# Slice 3 Complete: Content Inventory Import → Score Existing Page → Refresh Brief

## What Was Built

### Schema (prisma/schema.prisma)
- Added `ImportSource` enum: SITEMAP, CSV, MANUAL, SEARCH_CONSOLE
- Added `BriefStatus` enum: DRAFT, IN_PROGRESS, COMPLETED, ARCHIVED
- Added `ContentInventoryItem` model (siteId, url unique, title, metaDescription, canonicalUrl, lastModified, bodyText, importedFrom)
- Added `ContentScoreSnapshot` model (inventoryItemId, contentScore, geoScore, wordCount, readability, scoreBreakdown JSON, snapshotDate)
- Added `ContentBrief` model (inventoryItemId, recommendations JSON, targetScore, status)
- Extended `Site` model with `inventoryItems` relation

### Services
- `src/lib/inventory/import.ts` — parseCsvUrls, extractPageMetadata (HTML parsing for title, meta, headings, body text), detectContentIssues (thin content, missing title/meta, short/long titles)
- `src/lib/inventory/refresh-engine.ts` — calculateRefreshImpact (score gap + issue weight + traffic boost), prioritizeRefreshOpportunities (filter + sort by impact), generateRefreshRecommendations (content expansion, title optimization, meta description, GEO improvement, full refresh)
- `src/lib/inventory/service.ts` — importUrls (upsert by URL), scoreInventoryItem (runs content + GEO scoring, persists snapshot, detects issues), createRefreshBrief (generates recommendations from scores + issues), getInventoryWithScores

### API Routes
- `POST /api/inventory` — import URLs (siteId, urls array, source)
- `GET /api/inventory?siteId=` — list inventory with latest scores and brief status
- `POST /api/inventory/:id/score` — score content item, persist snapshot, return issues
- `POST /api/inventory/:id/brief` — create refresh brief with recommendations and impact score

### UI
- `/app/workspaces/[id]/inventory` — content inventory page with import form + table
- `/app/workspaces/[id]/inventory/[itemId]` — refresh brief view with scores, issues, recommendations
- `InventoryImportForm` — manual/CSV URL input
- `InventoryTable` — paginated table with Content Score, GEO Score, brief status, Score/Brief action buttons
- `RefreshBriefView` — score cards, issue list with severity badges, recommendation cards with effort/expected lift

### Tests
- `tests/lib/inventory/import.test.ts` — 16 tests (CSV parsing, HTML metadata extraction, content issue detection)
- `tests/lib/inventory/refresh-engine.test.ts` — 7 tests (prioritization, impact calculation, traffic boost)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 202 tests pass (42 files, +23 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Prisma JSON type requires serialization**: Complex objects (ContentScore, GeoScore, CitabilityScore, recommendation arrays) must be passed through `JSON.parse(JSON.stringify(...))` before assignment to Prisma Json fields. Direct object assignment fails TypeScript compilation.

2. **Content scoring pipeline is reusable**: The existing `scoreContent` and `scoreGeo` functions from the scoring engine work directly on imported page body text. No modification needed — the scoring engine is truly decoupled from the Article model.

3. **Issue detection drives refresh prioritization**: The `detectContentIssues` function produces structured issues (type, severity, message) that feed both the refresh impact calculation and the recommendation generator. This creates a clear chain: import → score → detect issues → calculate impact → generate recommendations.

4. **Impact score formula**: `(scoreGap * weights) + (issueCount * 8, capped at 32) * trafficBoost`. Pages with traffic get a 1.3x multiplier. This ensures high-traffic pages with issues are prioritized over low-traffic ones.

5. **HTML extraction is regex-based**: For Slice 3, we use regex to extract title, meta description, canonical URL, headings, and body text. This works for well-formed HTML but may fail on edge cases. A proper HTML parser (cheerio/jsdom) would be more robust for production.

## Next Steps

Slice 4: Article Generation → Score → Review Gate

## Files Changed

- `prisma/schema.prisma` — new models and enums
- `src/lib/inventory/import.ts` — new
- `src/lib/inventory/refresh-engine.ts` — new
- `src/lib/inventory/service.ts` — new
- `src/app/api/inventory/route.ts` — new
- `src/app/api/inventory/[id]/score/route.ts` — new
- `src/app/api/inventory/[id]/brief/route.ts` — new
- `src/components/inventory/inventory-table.tsx` — new
- `src/components/inventory/import-form.tsx` — new
- `src/components/inventory/refresh-brief-view.tsx` — new
- `src/app/app/workspaces/[id]/inventory/page.tsx` — new
- `src/app/app/workspaces/[id]/inventory/[itemId]/page.tsx` — new
- `tests/lib/inventory/import.test.ts` — new
- `tests/lib/inventory/refresh-engine.test.ts` — new
