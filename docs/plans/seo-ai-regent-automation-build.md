# SEO AI Regent Automation Build Plan

> **Status**: DRAFT — awaiting first vertical slice execution
> **Created**: 2026-05-04
> **Scope**: LARGE — full platform build from scoring engine to dashboard
> **Confidence**: MEDIUM (60-85%) — unknowns resolved during Slice 1

---

## 1. CURRENT STATE RECON

### What Exists
| Component | Status | Notes |
|-----------|--------|-------|
| Scoring engine | **PRODUCTION** | content-score.ts, geo-score.ts, citability.ts, explain-score.ts, top-actions.ts, weights.ts |
| TipTap editor | **PRODUCTION** | editor-shell.tsx, tiptap-editor.tsx, focus-mode-toggle.tsx |
| Auth system | **PRODUCTION** | Sessions, CSRF, TOTP, password reset, HMAC-signed cookies |
| Stripe billing | **PRODUCTION** | 3 plans (EDITOR $49, EDITORIAL $149, SYNDICATE custom), webhook handling |
| SERP analysis | **HEURISTIC** | serper.ts returns synthetic results — no real Serper.dev API calls yet |
| Prisma schema | **PARTIAL** | User, Article, Audit, Keyword, ScoreSnapshot, PasswordResetToken, StripeWebhookEvent, RateLimitWindow |
| Landing pages | **PRODUCTION** | /, /pricing, /features, /about, /faq, /docs, /contact, /privacy, /terms |
| Demo workspace | **PRODUCTION** | /app/editor loads DemoWorkspace component |
| Design tokens | **EXTRACTED** | Competitor tokens from Clearscope, Frase, Semrush, Surfer |
| Tests | **PARTIAL** | 6 scoring test files, no API or E2E tests yet |

### What Is Missing
- Workspace/Organization data model
- Keyword clustering (intent-based grouping)
- Content Inventory (import existing URLs)
- CMS connections and publishing
- Backlink opportunity discovery
- Rank tracking (scheduled jobs)
- Citation checks (AI search engines)
- Technical SEO audit crawler
- Competitor intelligence
- Internal linking suggestions
- Schema recommendations
- Automation rules and alerts
- Webhooks and API keys
- Dashboard roll-ups
- Search Console / GA4 integrations

### Architecture Gaps
1. **No Workspace model** — all data is User-scoped. Need Workspace for multi-site, multi-user orgs.
2. **No background job system** — rank tracking, citation checks, and audits need scheduled execution.
3. **No real external API integration** — Serper.dev returns heuristic data.
4. **No CMS connector abstraction** — publishing flow is not implemented.
5. **No crawl infrastructure** — technical audit requires URL fetching and parsing.

---

## 2. TARGET ARCHITECTURE

### Data Model (Prisma)

New models to add (in slice order):

```
Workspace → Site → ContentInventoryItem → TechnicalSeoIssue
Workspace → Keyword → KeywordCluster
Workspace → Article → PublishingJob → CmsConnection
Workspace → RankTracking
Workspace → CitationCheck → CitationTrend
Workspace → BacklinkOpportunity → OutreachLog
Workspace → Competitor → CompetitorSnapshot
Workspace → InternalLinkSuggestion
Workspace → SchemaRecommendation
Workspace → BrandVoiceProfile → ContentBrief
Workspace → ApprovalRequest → Comment
Workspace → ActivityLog
Workspace → AutomationRule → Alert
Workspace → WebhookSubscription → WebhookDelivery
Workspace → ApiKey
Organization → Workspace → User (via Membership with Role)
```

### Service Layer

```
src/lib/
  workspaces/     — CRUD, ownership checks
  sites/          — verification, sitemap discovery
  keywords/       — discovery, clustering, metrics
  inventory/      — import, scoring, refresh briefs
  articles/       — generation, scoring pipeline
  publishing/     — CMS connectors (WordPress, Webflow, Shopify, Ghost, Notion, webhook)
  audits/         — crawl engine, issue detection, recrawl
  citations/      — AI search engine checks, trend modeling
  rankings/       — scheduled rank checks, trend aggregation
  backlinks/      — opportunity discovery, outreach tracking
  competitors/    — gap analysis, content pattern summaries
  internal-links/ — graph building, suggestion engine
  schema/         — recommendation, JSON-LD generation, validation
  automation/     — rule builder, alert dispatch, digest scheduling
  webhooks/       — subscription management, signed delivery
  integrations/   — Search Console, GA4 OAuth flows
```

### API Routes (App Router)

```
/api/workspaces/[id]/*
/api/sites/[id]/*
/api/keywords/*
/api/clusters/*
/api/inventory/*
/api/articles/*
/api/publishing/*
/api/audits/*
/api/citations/*
/api/rankings/*
/api/backlinks/*
/api/competitors/*
/api/internal-links/*
/api/schema/*
/api/automation/*
/api/webhooks/*
/api/api-keys/*
/api/integrations/search-console/*
/api/integrations/analytics/*
/api/reports/*
```

### Background Jobs

InsForge-managed scheduled jobs:
- Rank tracking (daily)
- Citation checks (configurable frequency)
- Technical audit recrawls (weekly)
- Alert digest aggregation (weekly)
- Score re-computation on content changes

---

## 3. VERTICAL SLICES

Each slice is end-to-end: schema → service → API → UI → test → knowledge artifact.
Slices are labeled AFK (agent-completeable) or HITL (human-in-the-loop required).

### Slice 1: Workspace + Keyword Discovery → Cluster → Persist → View
**Label**: AFK
**Scope**: MEDIUM

**Acceptance criteria**:
- User can create a Workspace with name and verified domain
- User can enter a seed keyword and get discovered keywords via Serper.dev
- Keywords are clustered by intent (informational, transactional, navigational, commercial)
- Keywords and clusters are persisted to PostgreSQL
- User can view keywords in a paginated, filterable table
- All tests pass, compiler clean

**Schema changes**:
- Add `Workspace`, `Site`, `KeywordCluster` models
- Add `intent` enum (INFORMATIONAL, TRANSACTIONAL, NAVIGATIONAL, COMMERCIAL)
- Add `volume`, `difficulty`, `intent` fields to `Keyword`
- Add workspace relations to existing `Article`, `Keyword` models

**Service changes**:
- `src/lib/workspaces/` — create, list, ownership checks
- `src/lib/keywords/` — discover (real Serper.dev call), cluster by intent
- Upgrade `src/lib/serp/serper.ts` from heuristic to real API

**API routes**:
- `POST /api/workspaces` — create workspace
- `GET /api/workspaces` — list user's workspaces
- `POST /api/workspaces/:id/keywords/discover` — discover keywords from seed
- `GET /api/workspaces/:id/keywords` — list keywords with pagination/filtering
- `POST /api/workspaces/:id/keywords/:keywordId/cluster` — assign keyword to cluster

**UI surfaces**:
- `/app/workspaces/new` — workspace creation form
- `/app/workspaces/:id/keywords` — keyword discovery + cluster table
- Keyword table: search, filter by intent, sort by volume/difficulty

**Tests**:
- Unit: keyword clustering logic
- Integration: keyword discovery API route (mocked Serper.dev)
- E2E: create workspace → discover keywords → view in table

---

### Slice 2: Workspace Onboarding → Site Verification → Sitemap Crawl → First Action
**Label**: AFK

**Acceptance criteria**:
- User can verify site ownership via HTML tag or DNS record
- Sitemap is discovered and crawled for URLs
- Baseline site profile is generated
- User is routed to first action (keyword discovery or content inventory)

**Schema changes**:
- `SiteVerification` model (method, token, verifiedAt)
- `CrawlJob` model (status, startedAt, completedAt, urlCount)
- `CrawledUrl` model (url, title, statusCode, lastCrawledAt)

**Service changes**:
- `src/lib/sites/` — verification methods, sitemap parsing
- `src/lib/crawls/` — URL fetching, robots.txt respect, deduplication

**API routes**:
- `POST /api/sites` — add site to workspace
- `POST /api/sites/:id/verify` — start verification
- `POST /api/sites/:id/crawl` — start sitemap crawl
- `GET /api/sites/:id/crawl/:jobId` — check crawl status

**UI surfaces**:
- `/app/workspaces/:id/onboarding` — guided onboarding flow
- Site verification step with method selector
- Crawl progress indicator
- First-action routing card

---

### Slice 3: Content Inventory Import → Score Existing Page → Refresh Brief
**Label**: AFK

**Acceptance criteria**:
- User can import URLs from sitemap, CSV, or manual entry
- Each imported URL is scored with Content Score and GEO Score
- Thin content, stale content, and missing metadata are detected
- Refresh opportunities are prioritized by impact, effort, confidence
- Refresh brief opens in TipTap editor with before/after score comparison

**Schema changes**:
- `ContentInventoryItem` model (url, title, metaDescription, canonicalUrl, lastModified, bodyText, importedFrom)
- `ContentScoreSnapshot` model (inventoryItemId, contentScore, geoScore, snapshotDate)
- `ContentBrief` model (inventoryItemId, recommendations, targetScore, status)

**Service changes**:
- `src/lib/inventory/` — import, crawl, score, detect issues
- `src/lib/inventory/refresh-engine.ts` — prioritize opportunities

**API routes**:
- `POST /api/inventory/import` — import URLs
- `GET /api/inventory` — list inventory items
- `POST /api/inventory/:id/score` — score existing content
- `POST /api/inventory/:id/brief` — create refresh brief

**UI surfaces**:
- `/app/workspaces/:id/inventory` — content inventory table
- `/app/workspaces/:id/inventory/:id/brief` — refresh brief view
- Editor integration for refresh workflow

---

### Slice 4: Article Generation → Score → Review Gate
**Label**: AFK

**Acceptance criteria**:
- User can generate article from keyword brief
- Article is automatically scored through scoring engine
- Score below 70 triggers Review Gate with ExplainScore breakdown
- User can revise in TipTap editor and re-score iteratively
- Publish eligibility is computed server-side

**Schema changes**:
- Add `briefId` to `Article` model
- Add `publishEligible` boolean to `Article` model

**Service changes**:
- `src/lib/articles/generate.ts` — AI article generation
- `src/lib/articles/scoring-pipeline.ts` — score → review gate → eligibility
- Upgrade existing scoring to work with workspace-scoped articles

**API routes**:
- `POST /api/articles/generate` — generate from brief
- `POST /api/articles/:id/score` — trigger scoring
- `GET /api/articles/:id/eligibility` — check publish eligibility

**UI surfaces**:
- `/app/workspaces/:id/articles/new` — article generation form
- Score panel in editor with ExplainScore breakdown
- Review Gate modal for low-score articles

---

### Slice 5: CMS Connection → Preview → Publish Flow
**Label**: HITL (requires real CMS credentials for E2E)

**Acceptance criteria**:
- User can connect WordPress, Webflow, Shopify, Ghost, Notion, or webhook
- OAuth/API key credentials are encrypted at rest
- Article can be previewed on target CMS
- Publish flow: Generate → Score → Review Gate → Preview → Publish
- Articles below 70 are blocked from publish server-side

**Schema changes**:
- `CmsConnection` model (platform, encryptedCredentials, connectedAt, status)
- `PublishingJob` model (articleId, cmsConnectionId, status, publishedUrl, publishedAt)

**Service changes**:
- `src/lib/publishing/` — CMS connector interface
- `src/lib/publishing/connectors/` — WordPress, Webflow, Shopify, Ghost, Notion, webhook
- `src/lib/publishing/encrypt.ts` — credential encryption

**API routes**:
- `POST /api/cms` — create CMS connection
- `GET /api/cms` — list connections
- `POST /api/cms/:id/preview` — preview article
- `POST /api/articles/:id/publish` — trigger publish flow

**UI surfaces**:
- `/app/workspaces/:id/settings/cms` — CMS connections page
- Publish flow modal with step indicators
- Publishing job status table

---

### Slice 6: Technical Audit Crawl → Persisted Issue → Recrawl Verification
**Label**: AFK

**Acceptance criteria**:
- Crawl detects: broken links, redirect chains, duplicate titles, duplicate descriptions, missing H1, multiple H1s, non-indexable pages, canonical conflicts, large pages, missing alt text, schema problems
- Issues have severity (critical, high, medium, low) and lifecycle state (open, ignored, fixed, regressed)
- Recrawl verifies fixed/regressed state
- Dashboard shows issue counts derived from persisted records

**Schema changes**:
- `TechnicalSeoIssue` model (type, severity, state, affectedUrl, evidence, firstSeen, lastSeen, fixGuidance)

**Service changes**:
- `src/lib/audits/crawler.ts` — crawl engine
- `src/lib/audits/detectors/` — individual issue detectors
- `src/lib/audits/recrawl.ts` — verification logic

**API routes**:
- `POST /api/audits` — start audit
- `GET /api/audits` — list audits
- `GET /api/audits/:id/issues` — list issues
- `POST /api/audits/:id/recrawl` — trigger recrawl

**UI surfaces**:
- `/app/workspaces/:id/audit` — technical audit dashboard
- Issue detail panel with evidence and fix guidance
- Recrawl verification indicator

---

### Slice 7: Search Console Import → Opportunity Detection → Keyword/Content Action
**Label**: HITL (requires Google OAuth setup)

**Acceptance criteria**:
- Google Search Console OAuth connection
- Ingestion of queries, pages, impressions, clicks, CTR, position
- Mapping between Search Console pages and Content Inventory records
- Opportunity detection: high-impression low-CTR, declining pages, cannibalized queries
- Opportunities route into keyword briefs or content actions

**Schema changes**:
- `SearchConsoleConnection` model (encryptedTokens, propertyUrl, lastSyncAt, syncStatus)
- `SearchConsoleData` model (query, page, impressions, clicks, ctr, position, date)

**Service changes**:
- `src/lib/integrations/search-console/` — OAuth flow, data ingestion
- `src/lib/integrations/opportunities.ts` — opportunity detection logic

---

### Slice 8: Competitor Gap → Brief → Content or Refresh Action
**Label**: AFK

**Acceptance criteria**:
- User can add competitor domains to workspace
- Competitor keyword and content discovery
- Gap analysis against Keyword Clusters and Content Inventory
- Gap recommendations route into content briefs or refresh briefs

**Schema changes**:
- `Competitor` model (domain, market, priority, notes)
- `CompetitorSnapshot` model (competitorId, crawledAt, keywords, contentPatterns)

---

### Slice 9: Internal Link Suggestion → Review → Score-Aware Editor Insertion
**Label**: AFK

**Acceptance criteria**:
- Graph of articles, pages, Keyword Clusters, entities, internal links, anchors
- Suggestions show source page, target page, anchor, rationale, confidence
- Never auto-insert — user review required
- Link insertion in TipTap editor with score impact preview

**Schema changes**:
- `InternalLinkSuggestion` model (sourceId, targetId, anchorText, rationale, confidence, status)

---

### Slice 10: Rank Tracking → Persistence → Trend UI
**Label**: AFK

**Acceptance criteria**:
- Daily rank checks for tracked keywords
- Current position, URL, SERP features persisted
- 7/30/90-day trend views
- Competitor position comparison

**Schema changes**:
- `RankTracking` model (keywordId, position, url, serpFeatures, checkedAt, competitorPosition)

---

### Slice 11: Citation Check → Trend Model → Alerts
**Label**: AFK

**Acceptance criteria**:
- Citation checks across ChatGPT, Perplexity, Claude, Gemini
- Scheduled recurring checks
- Citation score and trend reporting
- Gained/lost citation alerts

**Schema changes**:
- `CitationCheck` model (query, engine, result, found, snippet, checkedAt)
- `CitationTrend` model (aggregated from CitationCheck records)

---

### Slice 12: Backlink Opportunity Discovery → Outreach Workflow
**Label**: AFK

**Acceptance criteria**:
- Backlink opportunity discovery with provenance
- Domain authority scoring
- Outreach template generation
- Outreach status tracking with timestamps

**Schema changes**:
- `BacklinkOpportunity` model (sourceUrl, targetUrl, domainAuthority, provenance, status)
- `OutreachLog` model (opportunityId, status, notes, timestamp)

---

### Slice 13: Schema Recommendation → Validation → Publish Warning/Block
**Label**: AFK

**Acceptance criteria**:
- Schema type recommendations with explanation
- JSON-LD preview and validation
- Invalid schema blocks publish or shows Review Gate warning

**Schema changes**:
- `SchemaRecommendation` model (articleId, schemaType, jsonLd, valid, validatedAt)

---

### Slice 14: Dashboard Roll-Up
**Label**: AFK

**Acceptance criteria**:
- Keyword ranking overview
- Content score rollups
- Citation counts
- Backlink status
- All metrics traceable to source queries/tables
- No decorative filler panels

---

### Slice 15: Collaboration + Approval Workflow
**Label**: HITL (requires multi-user testing)

**Acceptance criteria**:
- Organizations, workspaces, roles, permissions
- Comments on articles, briefs, audit issues, backlink opportunities
- Approval workflow: draft → in review → changes requested → approved → ready to publish
- Client-safe reporting views

---

### Slice 16: Automation Rules + Alerts
**Label**: AFK

**Acceptance criteria**:
- Rule builder for recurring checks, thresholds, rank changes, citation changes
- Notification channels: email first, webhook where practical
- Alert states: active, acknowledged, resolved
- Weekly digest with deltas

---

### Slice 17: Plan Enforcement + Billing Hooks
**Label**: AFK

**Acceptance criteria**:
- Server-side entitlement enforcement per Plan
- Clean upgrade/downgrade/cancel behavior
- Usage limits enforced at API level

---

### Slice 18: Open API / Webhooks / Exports
**Label**: AFK

**Acceptance criteria**:
- API keys scoped to workspace and permissions
- Webhook subscriptions with retries, signatures, delivery history
- CSV export for tables
- API key audit log

---

### Slice 19: Admin / Reliability / Observability Hardening
**Label**: HITL

**Acceptance criteria**:
- Health/readiness endpoints
- Structured logging
- Retry strategy for provider failures
- Failure alerts
- Rate limiting hardening
- Security audit pass

---

## 4. EXECUTION ORDER

```
Slice 1  → Workspace + Keyword Discovery (FIRST — do this now)
Slice 2  → Site Verification + Onboarding
Slice 3  → Content Inventory + Refresh Brief
Slice 4  → Article Generation + Review Gate
Slice 5  → CMS Publishing
Slice 6  → Technical Audit
Slice 7  → Search Console Integration
Slice 8  → Competitor Intelligence
Slice 9  → Internal Linking
Slice 10 → Rank Tracking
Slice 11 → Citation Tracking
Slice 12 → Backlink Outreach
Slice 13 → Schema Recommendations
Slice 14 → Dashboard Roll-Up
Slice 15 → Collaboration + Approval
Slice 16 → Automation Rules + Alerts
Slice 17 → Plan Enforcement
Slice 18 → Open API / Webhooks
Slice 19 → Admin + Observability
```

**Dependencies**:
- Slice 1 is prerequisite for all slices (Workspace model)
- Slice 2 feeds Slice 3 (Site → Content Inventory)
- Slice 3 feeds Slice 4 (Content Inventory → Article generation)
- Slice 4 feeds Slice 5 (Article → CMS publishing)
- Slice 6 is independent after Slice 2
- Slices 7-13 are parallelizable after Slice 1
- Slice 14 depends on Slices 1, 3, 6, 10, 11, 12
- Slice 15 depends on Slice 1 (Organization model)
- Slices 16-19 are hardening, can be interleaved

---

## 5. SLICE 1 DETAILED SPEC

### 5.1 Schema Migration

```prisma
enum Intent {
  INFORMATIONAL
  TRANSACTIONAL
  NAVIGATIONAL
  COMMERCIAL
}

enum SiteStatus {
  PENDING
  VERIFIED
  FAILED
}

model Workspace {
  id          String    @id @default(cuid())
  name        String
  ownerId     String
  owner       User      @relation(fields: [ownerId], references: [id])
  sites       Site[]
  keywords    Keyword[]
  clusters    KeywordCluster[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([ownerId])
}

model Site {
  id          String     @id @default(cuid())
  workspaceId String
  workspace   Workspace  @relation(fields: [workspaceId], references: [id])
  url         String     @unique
  status      SiteStatus @default(PENDING)
  verifiedAt  DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([workspaceId])
}

model KeywordCluster {
  id          String    @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  name        String
  intent      Intent
  keywords    Keyword[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([workspaceId])
  @@index([intent])
}

// Update existing Keyword model:
//   Add: workspaceId String?
//   Add: workspace Workspace? @relation(fields: [workspaceId], references: [id])
//   Add: clusterId String?
//   Add: cluster KeywordCluster? @relation(fields: [clusterId], references: [id])
//   Add: intent Intent?
//   Add: volume Int?
//   Add: difficulty Int?
//   Add: updatedAt DateTime @updatedAt
```

### 5.2 Service: Keyword Discovery

```typescript
// src/lib/keywords/discover.ts
interface DiscoveredKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: Intent;
  serpResults: SerpResult[];
}

export async function discoverKeywords(
  seed: string,
  serperApiKey: string,
): Promise<DiscoveredKeyword[]>
```

### 5.3 Service: Keyword Clustering

```typescript
// src/lib/keywords/cluster.ts
export function clusterByIntent(
  keywords: DiscoveredKeyword[],
): KeywordCluster[]
```

Intent classification rules (heuristic + Serper.dev SERP analysis):
- **Informational**: SERP shows featured snippets, "People Also Ask", how-to articles
- **Transactional**: SERP shows product pages, pricing, "buy", "order"
- **Navigational**: SERP shows brand homepages, login pages
- **Commercial**: SERP shows comparison pages, reviews, "best of" lists

### 5.4 API Contract

```
POST /api/workspaces
  Body: { name: string }
  Response: { workspace: Workspace }

GET /api/workspaces
  Response: { workspaces: Workspace[] }

POST /api/workspaces/:id/keywords/discover
  Body: { seed: string, maxResults?: number }
  Response: { keywords: DiscoveredKeyword[], clusters: KeywordCluster[] }

GET /api/workspaces/:id/keywords
  Query: { page?: number, limit?: number, intent?: Intent, search?: string }
  Response: { keywords: Keyword[], total: number, page: number }
```

### 5.5 UI Components

- `WorkspaceForm` — name input, create button, validation
- `KeywordDiscoveryForm` — seed input, discover button, loading state
- `KeywordTable` — paginated, searchable, filterable by intent
- `ClusterBadge` — intent-colored badge
- `EmptyState` — no keywords, no workspaces

### 5.6 Tests

```
tests/lib/keywords/cluster.test.ts
  - clusters keywords by intent correctly
  - handles empty input
  - handles single keyword

tests/api/workspaces/create.test.ts
  - creates workspace for authenticated user
  - rejects unauthenticated request
  - validates name length

tests/api/keywords/discover.test.ts
  - discovers keywords from seed (mocked Serper.dev)
  - returns clustered results
  - handles API failure gracefully

e2e/keyword-discovery.spec.ts
  - create workspace → discover keywords → view in table
```

---

## 6. RISK REGISTER

| Risk | Impact | Mitigation |
|------|--------|------------|
| Serper.dev API cost | MEDIUM | Cache results, implement rate limiting, use heuristic fallback |
| Workspace migration from User-scoped data | HIGH | Gradual migration: dual-write during transition, feature flag |
| Background job system choice | MEDIUM | Start with InsForge, abstract job interface for portability |
| CMS connector complexity | HIGH | Start with WordPress + webhook, add others incrementally |
| Crawl infrastructure legal risk | HIGH | Respect robots.txt, scope to verified domains, rate limit |
| AI generation quality | MEDIUM | Quality gate via scoring engine, human review required |

---

## 7. SUCCESS METRICS

- **Slice completion rate**: 19/19 slices completed
- **Test coverage**: ≥ 80% on new code, 0% regression on existing
- **Compiler clean**: 0 TypeScript errors
- **Security**: 0 HIGH/CRITICAL CVEs
- **Design quality**: `designlang score` ≥ B on all UI surfaces
- **Performance**: < 200ms TTFB for API routes, < 3s page load
- **Scoring integrity**: 100% of articles scored before publish, 0% below-70 published

---

## 8. NEXT ACTION

**Execute Slice 1: Workspace + Keyword Discovery → Cluster → Persist → View**

Follow the CODEX EXECUTION LOOP:
1. Reconstruct current state ✓ (done in §1)
2. Define exact acceptance criteria ✓ (done in §5)
3. Add/update domain terms in CONTEXT.md ✓ (done)
4. Create failing test or deterministic feedback loop
5. Implement the minimal end-to-end slice
6. Run typecheck
7. Run tests
8. Run lint/format
9. Run security audit if dependencies changed
10. Write compound learning artifact
11. Move to Slice 2
