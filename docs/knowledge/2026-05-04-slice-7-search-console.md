---
type: slice-completion
tags: [slice-7, search-console, opportunity-detection, data-import, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 7
---

# Slice 7 Complete: Search Console Import → Opportunity Detection → Keyword/Content Action

## What Was Built

### Schema (prisma/schema.prisma)
- Added `SyncStatus` enum: CONNECTING, CONNECTED, SYNCING, SYNCED, ERROR, DISCONNECTED
- Added `OpportunityType` enum: HIGH_IMPRESSION_LOW_CTR, DECLINING_PAGE, CANNIBALIZED_QUERY, POSITION_4_TO_10, NEW_QUERY
- Added `SearchConsoleConnection` model (workspaceId, propertyUrl, encryptedTokens, syncStatus, lastSyncAt) with unique constraint on [workspaceId, propertyUrl]
- Added `SearchConsoleData` model (connectionId, query, page, impressions, clicks, ctr, position, date)
- Added `SearchConsoleOpportunity` model (workspaceId, type, query, page, metric, value, rationale, status)
- Added `searchConsoleConnections` and `opportunities` relations to Workspace model

### Services
- `src/lib/integrations/search-console/service.ts` — parseSearchConsoleResponse (API response → typed rows), detectOpportunities (4 detectors: high impression low CTR, position 4-10, cannibalized queries, declining pages), fetchSearchConsoleData (Google Webmasters API call with Bearer auth)

### API Routes
- `POST /api/search-console/connect` — connect Search Console property with encrypted tokens (base64), upsert by workspaceId + propertyUrl
- `GET /api/search-console/connect?workspaceId=` — list workspace connections (tokens sanitized)
- `POST /api/search-console/sync` — sync data from Search Console API, parse rows, persist SearchConsoleData records, detect opportunities, persist SearchConsoleOpportunity records
- `GET /api/search-console/opportunities?workspaceId=&type=&status=` — list opportunities with summary counts
- `PATCH /api/search-console/opportunities` — update opportunity status (new → actioned/dismissed)

### UI
- `/app/workspaces/[id]/settings/search-console` — Search Console settings page
- Two-tab interface: Connections (add property form, connection list with sync status, sync button) and Opportunities (summary cards, filter buttons, opportunity list with rationale, action/dismiss buttons)

### Tests
- `tests/lib/integrations/search-console.test.ts` — 9 tests (API response parsing, empty response handling, 4 opportunity detectors, healthy page exclusion, multiple opportunity types per page)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 248 tests pass (46 files, +9 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Search Console API returns query+page dimensions**: The API returns rows with `keys` array where `keys[0]` is the query and `keys[1]` is the page URL. The `parseSearchConsoleResponse` function extracts these into typed objects.

2. **Opportunity detection is threshold-based, not AI-powered**: Four simple rules:
   - High impression (>1000) + low CTR (<2%) → title/meta optimization opportunity
   - Position 4-10 → page 2 opportunity, small improvements could push to page 1
   - Same query, multiple pages → cannibalization, consolidate or differentiate
   - High impressions (>5000) + very low CTR (<0.5%) + position >10 → declining page, needs refresh

3. **Opportunities are persisted, not computed on-the-fly**: Each sync creates SearchConsoleOpportunity records. This allows tracking opportunity status (new → actioned/dismissed) and prevents re-detecting the same opportunities on every page load.

4. **Sync status state machine is important**: CONNECTING → CONNECTED → SYNCING → SYNCED (or ERROR). This gives users clear feedback on the sync process and allows retry on failure.

5. **Base64 token storage is a placeholder**: Like CMS credentials, Search Console tokens are base64-encoded. Production needs proper encryption and token refresh logic (Google tokens expire after 1 hour).

6. **TypeScript scope in catch blocks**: Variables declared inside try blocks are not accessible in catch blocks. Need to declare them outside or use a separate variable for error handling. This caught a real bug pattern.

7. **Unique constraint enables upsert**: The `@@unique([workspaceId, propertyUrl])` constraint allows using `upsert` for the connect route, preventing duplicate connections for the same property.

## Next Steps

Slice 8: Competitor Gap → Brief → Content or Refresh Action

## Files Changed

- `prisma/schema.prisma` — SearchConsoleConnection, SearchConsoleData, SearchConsoleOpportunity models + SyncStatus, OpportunityType enums
- `src/lib/integrations/search-console/service.ts` — new
- `src/app/api/search-console/connect/route.ts` — new
- `src/app/api/search-console/sync/route.ts` — new
- `src/app/api/search-console/opportunities/route.ts` — new
- `src/app/app/workspaces/[id]/settings/search-console/page.tsx` — new
- `tests/lib/integrations/search-console.test.ts` — new
