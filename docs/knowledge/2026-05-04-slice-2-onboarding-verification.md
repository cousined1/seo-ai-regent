---
type: slice-completion
tags: [slice-2, site-verification, sitemap-crawl, onboarding, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 2
---

# Slice 2 Complete: Workspace Onboarding → Site Verification → Sitemap Crawl → First Action

## What Was Built

### Schema (prisma/schema.prisma)
- Added `VerificationMethod` enum: HTML_TAG, DNS_TXT, FILE_UPLOAD
- Added `CrawlJobStatus` enum: PENDING, RUNNING, COMPLETED, FAILED, CANCELLED
- Added `SiteVerification` model (siteId unique, method, token, verifiedAt)
- Added `CrawlJob` model (siteId, status, startedAt, completedAt, urlCount, error)
- Added `CrawledUrl` model (siteId, crawlJobId, url, title, statusCode, lastCrawledAt)
- Extended `Site` model with relations to verification, crawlJobs, crawledUrls

### Services
- `src/lib/sites/verification.ts` — generateVerificationToken, verifyHtmlTag, verifyDnsTxt, getVerificationInstructions, createSite, startVerification, completeVerification, getSiteWithVerification, listWorkspaceSites
- `src/lib/crawls/sitemap.ts` — parseSitemap, normalizeUrl, isAllowedByRobots, deduplicateUrls, startCrawlJob, executeCrawl, getCrawlJobStatus

### API Routes
- `POST /api/sites` — add site to workspace
- `GET /api/sites?workspaceId=` — list workspace sites
- `POST /api/sites/:id/verify` — start/check verification (action=start|check)
- `GET /api/sites/:id/verify` — get verification status
- `POST /api/sites/:id/crawl` — start sitemap crawl (async, returns 202)
- `GET /api/sites/:id/crawl/:jobId` — check crawl status

### UI
- `/app/workspaces/[id]/onboarding` — guided 4-step onboarding flow
- Step 1: Add site URL
- Step 2: Verify ownership (HTML Tag / DNS TXT / File Upload method selector)
- Step 3: Start crawl with live status polling
- Step 4: Completion with routing to keywords page
- `OnboardingFlow` component with step indicator, loading/error states

### Tests
- `tests/lib/sites/verification.test.ts` — 14 tests (token generation, HTML tag verification, DNS TXT verification, instructions)
- `tests/lib/crawls/sitemap.test.ts` — 16 tests (sitemap parsing, URL normalization, robots.txt checking, deduplication)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 179 tests pass (40 files, +30 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Crawl execution is async**: The crawl route returns 202 immediately and executes in the background. The UI polls `/api/sites/:id/crawl/:jobId` every 3 seconds for status updates. This pattern works for development but should move to a proper job queue (InsForge) in production.

2. **Sitemap discovery has multiple fallbacks**: We check `/sitemap.xml`, `/sitemap_index.xml`, `/sitemap-index.xml`, `/sitemap.xml.gz`, and finally parse robots.txt for a `Sitemap:` directive. This covers WordPress, Next.js, and most common CMS patterns.

3. **robots.txt parsing is heuristic**: Our `isAllowedByRobots` function handles basic `User-agent: *` + `Disallow:` patterns. It doesn't handle wildcards (`*`, `$`), `Allow:` directives, or multiple user-agent blocks. This is sufficient for Slice 2 but needs improvement for production.

4. **HEAD requests for URL validation**: We use HEAD requests to check URL status codes, then only fetch full HTML for title extraction when content-type is text/html. This minimizes bandwidth and respects rate limits.

5. **Verification token security**: Tokens are 48 hex characters (24 bytes) generated with `crypto.getRandomValues`. They are stored in the database and compared against live page content or DNS records.

## Next Steps

Slice 3: Content Inventory Import → Score Existing Page → Refresh Brief

## Files Changed

- `prisma/schema.prisma` — new models and enums
- `src/lib/sites/verification.ts` — new
- `src/lib/crawls/sitemap.ts` — new
- `src/app/api/sites/route.ts` — new
- `src/app/api/sites/[id]/verify/route.ts` — new
- `src/app/api/sites/[id]/crawl/route.ts` — new
- `src/app/api/sites/[id]/crawl/[jobId]/route.ts` — new
- `src/components/onboarding/onboarding-flow.tsx` — new
- `src/app/app/workspaces/[id]/onboarding/page.tsx` — new
- `tests/lib/sites/verification.test.ts` — new
- `tests/lib/crawls/sitemap.test.ts` — new
