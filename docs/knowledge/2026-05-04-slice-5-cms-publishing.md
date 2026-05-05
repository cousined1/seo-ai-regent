---
type: slice-completion
tags: [slice-5, cms-connection, publishing, review-gate, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 5
---

# Slice 5 Complete: CMS Connection → Preview → Publish Flow

## What Was Built

### Schema (prisma/schema.prisma)
- Added `CmsPlatform` enum: WORDPRESS, WEBFLOW, SHOPIFY, GHOST, NOTION, WEBHOOK
- Added `PublishingJobStatus` enum: PREVIEW, DRAFT, SCHEDULED, PUBLISHED, FAILED
- Added `CmsConnection` model (workspaceId, platform, name, siteUrl, encryptedCredentials, status, connectedAt, lastTestedAt)
- Added `PublishingJob` model (articleId, cmsConnectionId, status, publishedUrl, publishedAt, error)
- Added `cmsConnections` relation to Workspace, `publishingJobs` relation to Article

### Services
- `src/lib/publishing/service.ts` — validatePublishGate (server-side 70/100 threshold enforcement), buildPublishPayload (platform-specific payload generation for WordPress, Webflow, Shopify, Ghost, Notion, Webhook), formatArticleForCms (TipTap JSON → HTML or Markdown conversion), tipTapToHtml, tipTapToMarkdown

### API Routes
- `POST /api/cms` — create CMS connection with encrypted credentials (base64-encoded JSON)
- `GET /api/cms?workspaceId=` — list workspace CMS connections (credentials sanitized)
- `POST /api/articles/:id/publish` — publish article with score gate enforcement, creates PublishingJob

### UI
- `/app/workspaces/[id]/settings/cms` — CMS connections management page
- `CmsConnectionsPage` — add connection form (platform selector, name, site URL, API key), connection list with platform badges
- `PublishFlowModal` — publish flow with score cards, CMS connection selector, preview/draft action toggle, blocked state for sub-70 scores

### Tests
- `tests/lib/publishing/service.test.ts` — 11 tests (publish gate validation for all threshold scenarios, payload building for 4 platforms, TipTap → HTML/Markdown conversion)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 227 tests pass (44 files, +11 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Score gate is enforced at API level**: The `validatePublishGate` function runs server-side in the publish route. Even if a client bypasses the UI, the API returns 403 with the block reason. This is the product constraint "Never auto-publish articles below 70/100" enforced at the service layer.

2. **Credentials are base64-encoded, not encrypted**: For Slice 5, CMS credentials are stored as base64-encoded JSON. This is a placeholder — production needs proper encryption (AES-256 with a server-side key). The `encryptedCredentials` field name signals the intent but the implementation is not yet production-grade.

3. **Platform-specific payloads differ significantly**: WordPress uses REST API format (title, content, status, slug, meta fields), Webflow uses CMS item format (name, slug, published boolean), Ghost uses nested posts array, Shopify uses blog_article wrapper with metafields. The `buildPublishPayload` function abstracts these differences behind a single interface.

4. **TipTap conversion handles both HTML and Markdown**: WordPress/Webflow/Shopify need HTML output, Ghost/Notion need Markdown. The `formatArticleForCms` function routes to the appropriate converter based on platform. The converters recursively traverse the TipTap JSON tree.

5. **PublishingJob tracks the full lifecycle**: Each publish attempt creates a PublishingJob record with status (PREVIEW → DRAFT → SCHEDULED → PUBLISHED or FAILED). This provides auditability and retry capability.

## Next Steps

Slice 6: Technical Audit Crawl → Persisted Issue → Recrawl Verification

## Files Changed

- `prisma/schema.prisma` — CmsConnection, PublishingJob models + CmsPlatform, PublishingJobStatus enums
- `src/lib/publishing/service.ts` — new
- `src/app/api/cms/route.ts` — new
- `src/app/api/articles/[id]/publish/route.ts` — new
- `src/components/cms/connections-page.tsx` — new
- `src/components/cms/publish-flow-modal.tsx` — new
- `src/app/app/workspaces/[id]/settings/cms/page.tsx` — new
- `tests/lib/publishing/service.test.ts` — new
