---
type: slice-completion
tags: [slice-1, workspace, keyword-discovery, clustering, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 1
supersedes: docs/knowledge/2026-05-04-codebase-recon.md (partial — recon findings validated)
---

# Slice 1 Complete: Workspace + Keyword Discovery → Cluster → Persist → View

## What Was Built

### Schema (prisma/schema.prisma)
- Added `Intent` enum: INFORMATIONAL, TRANSACTIONAL, NAVIGATIONAL, COMMERCIAL
- Added `SiteStatus` enum: PENDING, VERIFIED, FAILED
- Added `Workspace` model with ownerId relation to User
- Added `Site` model with workspace relation and unique(workspaceId, url) constraint
- Added `KeywordCluster` model with workspace relation and intent index
- Extended `Keyword` model: added workspaceId, clusterId, intent, volume, difficulty, updatedAt fields

### Services
- `src/lib/workspaces/service.ts` — create, list, verify access (uses getPrismaClient pattern from existing db.ts)
- `src/lib/keywords/cluster.ts` — classifyIntent (SERP feature + query keyword signals), clusterByIntent
- `src/lib/keywords/discover.ts` — discoverKeywords (real Serper.dev API), discoverKeywordsHeuristic (fallback)

### API Routes
- `POST /api/workspaces` — create workspace (authenticated)
- `GET /api/workspaces` — list user's workspaces (authenticated)
- `POST /api/workspaces/:id/keywords/discover` — discover + cluster + persist keywords
- `GET /api/workspaces/:id/keywords` — paginated, searchable, filterable keyword list

### UI
- `/app/workspaces/new` — workspace creation form
- `/app/workspaces/[id]/keywords` — keyword discovery form + paginated table
- `KeywordTable` component — search, intent filter, pagination, color-coded intent badges
- `KeywordDiscoveryForm` component — seed input, discover button, loading/error states

### Tests
- `tests/lib/keywords/cluster.test.ts` — 10 tests covering classifyIntent and clusterByIntent

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 149 tests pass (38 files) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL (7 moderate — esbuild/postcss, non-blocking) |

## Key Learnings

1. **Prisma client pattern**: The existing codebase uses `getPrismaClient()` from `@/lib/db`, not a direct `db` export. All new Prisma usage must follow this pattern to work with the dev-mode singleton and production client caching.

2. **Keyword connect requires unique ID**: Prisma's `connect` requires a unique identifier. Since Keyword has no unique constraint on (query, workspaceId), we must create keywords first, build a query→id map, then connect clusters by ID.

3. **Heuristic fallback is valuable**: The `discoverKeywordsHeuristic` function provides 20 modifier-based keywords without any API key. This is useful for development, testing, and users without Serper.dev access.

4. **Intent classification works without SERP data**: The query-keyword signal matching (informationalSignals, transactionalSignals, etc.) provides reasonable intent classification even when SERP features are unavailable.

## Next Steps

Slice 2: Workspace Onboarding → Site Verification → Sitemap Crawl → First Action

## Files Changed

- `prisma/schema.prisma` — new models and enums
- `src/lib/workspaces/service.ts` — new
- `src/lib/keywords/cluster.ts` — new
- `src/lib/keywords/discover.ts` — new
- `src/app/api/workspaces/route.ts` — new
- `src/app/api/workspaces/[id]/keywords/route.ts` — new
- `src/app/api/workspaces/[id]/keywords/discover/route.ts` — new
- `src/components/workspaces/workspace-form.tsx` — new
- `src/components/keywords/keyword-table.tsx` — new
- `src/components/keywords/discovery-form.tsx` — new
- `src/app/app/workspaces/new/page.tsx` — new
- `src/app/app/workspaces/[id]/keywords/page.tsx` — new
- `tests/lib/keywords/cluster.test.ts` — new
- `docs/plans/seo-ai-regent-automation-build.md` — created
- `docs/knowledge/2026-05-04-codebase-recon.md` — created
- `AGENTS.md` — created
- `CONTEXT.md` — created
