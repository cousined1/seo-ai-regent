# CODEX BUILD PROMPT — SEO AI REGENT — GODMYTHOS v10

> **Mode**: GODMYTHOS v10 · GREENFIELD_MODE · ULTRATHINK · Full Product Build  
> **Platform**: Codex CLI in VS Code  
> **Directive**: Build SEO AI Regent as a production-grade SEO automation platform that competes with EarlySEO while preserving SEO AI Regent’s core moat: transparent content scoring for Google and AI search. Do not behave like a code generator. Behave like a disciplined product engineer operating under GODMYTHOS v10 doctrine with hard gates for correctness, testing, design fidelity, vertical-slice execution, and ship readiness.

---

## SYSTEM OF OPERATION — READ FIRST

This repository follows **GODMYTHOS v10** doctrine.

Before writing any code:

1. Read `AGENTS.md` at repo root.
2. Read `CONTEXT.md` and adopt its exact domain vocabulary.
3. If `graphify-out/GRAPH_REPORT.md` exists, read it before grepping the repo.
4. Reconstruct the current architecture before modifying it.
5. Re-read the godmythos `SKILL.md` orchestration logic at session start and after any context compaction.

These are not optional style preferences. They are operating constraints defined by the repo-side doctrine. `AGENTS.md` makes `CONTEXT.md` the canonical vocabulary source, requires graph-first architecture reads when available, enforces seven CI quality gates, and defines Hard Rules #11–#18 such as compound learning, confidence gating, tracer-bullet discipline, and “build a feedback loop first” for bugs. [file:7][file:6]

---

## PRODUCT CONTEXT

We are building a competitor to **EarlySEO** with a key differentiator:

**SEO AI Regent includes built-in content scoring for both traditional SEO and AI-search visibility.**

EarlySEO automates keyword research, content writing, backlinks, publishing, citation tracking, and rank tracking. SEO AI Regent already has the scoring engine. The mission is to add the automation platform around that moat without diluting it. [file:5]

**Brand:** SEO AI Regent  
**Domain:** seo-ai-regent.com  
**Primary stack:** Next.js 14 App Router + TypeScript + Prisma + PostgreSQL + TipTap  
**Build environment:** VS Code with Codex CLI  
**Backend service:** InsForge  
**Deployment target:** Vercel frontend + Railway PostgreSQL/backend services where applicable. [file:5]

---

## CORE PRODUCT TRUTH

SEO AI Regent is not “just another SEO automation app.” It is:

- a scoring-first SEO operating system,
- a content production pipeline with quality gates,
- an AI-search visibility platform,
- and a transparent alternative to black-box SEO tooling.

If any implementation choice weakens scoring transparency, scoring trust, or quality-gated publishing, reject it.

---

## GODMYTHOS v10 HARD RULES FOR THIS BUILD

### Global
1. **Compiler clean is mandatory** — no type errors, build errors, or ignored warnings before moving forward. `AGENTS.md` makes compiler cleanliness a blocking gate. [file:7]
2. **Tests are mandatory** — every meaningful feature must have verification, and all tests must pass before a slice is considered complete. [file:7]
3. **Security is non-optional** — no exposed secrets, no unsafe auth shortcuts, no unvalidated external inputs. `AGENTS.md` requires a security gate with no HIGH/CRITICAL CVEs. [file:7]
4. **Vertical slices only** — do not build disconnected backend-only or UI-only islands. Every slice must be end-to-end, demoable, and independently grabbable. This is explicit v10 tracer-bullet discipline. [file:7]
5. **One test at a time** — RED → GREEN incrementally. Never bulk-generate a giant speculative test suite. [file:7]
6. **Compound learning is mandatory** — every meaningful work cycle must leave behind a `docs/knowledge/*.md` artifact. `AGENTS.md` makes this Hard Rule #11. [file:7]
7. **Confidence gate applies** — if confidence is below 60%, stop and resolve unknowns before coding. [file:7]
8. **Build a feedback loop first for bugs** — do not guess at defects without a deterministic failing signal. This is Hard Rule #18. [file:7]

### Design / product
9. **Design tokens are evidence, not estimates** — if colors, typography, spacing, shadows, or radii can be extracted, use `designlang`; do not approximate. This is the v8 design rule that should remain active in v10 builds. [file:2]
10. **Design quality must be scored** — do not judge UI “by feel” only; use `designlang score` as a quality gate where applicable. `AGENTS.md` includes design score ≥ B as a blocking CI rule for UI PRs. [file:7][file:2]
11. **No template sludge** — avoid generic SaaS starter patterns, centered-everything layouts, decorative gradients substituting for hierarchy, and dead dashboard chrome. v8 explicitly flags these as anti-patterns. [file:2]
12. **Transparency over black-box UX** — every visible score must explain why it is what it is and how to improve it.
13. **No fake surfaces** — no dead buttons, no mock dashboards pretending to be complete, no placeholder metrics in production paths.
14. **Never skip the scoring engine** — every generated article must pass through the scoring engine before publish. [file:5]
15. **Never auto-publish articles below 70/100** — quality gate is mandatory. [file:5]
16. **Never rename the product** — it is SEO AI Regent, not RankForge. [file:5]
17. **Canonical vocabulary only** — terms must match `CONTEXT.md`; update that file inline when meanings sharpen. This is Hard Rule #15. [file:6][file:7]

---

## REPO BOOTSTRAP EXPECTATIONS

The attached v10 install guide defines the proper project scaffolding and agent pickup behavior. Ensure the repo includes and uses:

- `AGENTS.md` at root
- `CONTEXT.md` at root
- `docs/adr/`
- `docs/knowledge/`
- `docs/plans/`
- `.out-of-scope/`

The install guide also expects the godmythos skill to be installed for Codex and recommends graphify plus git guardrails and pre-commit hooks. [file:8]

If any of these are missing, create them before substantial implementation.

---

## CANONICAL DOMAIN LANGUAGE

Before coding, define and maintain the domain glossary in `CONTEXT.md`.

Minimum terms to define immediately:

- **Keyword**
- **Keyword Cluster**
- **Article**
- **Content Score**
- **GEO Score**
- **Citation Check**
- **Citation Trend**
- **Rank Tracking**
- **CMS Connection**
- **Backlink Opportunity**
- **Publishing Job**
- **Review Gate**
- **Plan Entitlement**

For each term:
- one sentence defining what it **is**
- an `_Avoid_:` line listing aliases not to use
- relationships between terms
- flagged ambiguities if wording changes over time

This structure is defined explicitly by the attached `CONTEXT.md` template. [file:6]

---

## COMPETITIVE BASELINE

EarlySEO baseline capabilities to meet or exceed:

1. Keyword research
2. Content writing
3. Backlink automation
4. Auto-publishing to CMSs
5. AI search citation tracking
6. Rank tracking [file:5]

SEO AI Regent’s differentiators that must remain visible in both product and architecture:

1. **Built-in content scoring** before publish
2. **GEO Score** for AI-search visibility
3. **Self-hosted option** for enterprise
4. **Lower pricing**
5. **ExplainScore / score transparency** [file:5]

---

## WHAT ALREADY EXISTS

Assume these are already present and should be preserved or upgraded, not replaced blindly:

- content scoring engine,
- GEO Score,
- traditional SEO scoring,
- TipTap editor,
- Serper.dev integration,
- Google NLP integration,
- landing page,
- demo workspace. [file:5]

Before touching them, trace:
- source files,
- API dependencies,
- DB models,
- score calculation path,
- editor integration path,
- failure modes,
- test coverage.

---

## MANDATORY FIRST PHASE — RECON + DESIGN EXTRACTION

Before any feature build:

### 0A. Repo reconstruction
- Read `AGENTS.md`
- Read `CONTEXT.md`
- Read `graphify-out/GRAPH_REPORT.md` if present
- Inventory routes, services, Prisma models, editor modules, auth, billing, and background jobs
- Map current scoring flow from input → analysis → weighting → persistence → UI rendering [file:7][file:6]

### 0B. Design extraction
Run design extraction against relevant benchmarks before implementing or revising UI:

```bash
designlang https://earlyseo.com --full --out design/tokens/earlyseo/
designlang https://seo-ai-regent.com --full --out design/tokens/seo-ai-regent/
designlang score https://earlyseo.com
designlang score https://seo-ai-regent.com
designlang brands earlyseo.com seo-ai-regent.com
```

If working on app UI, also extract from relevant competitor apps where accessible.

This is consistent with the v8 design doctrine: extracted tokens over guessed tokens, scored design over subjective design review, and compare-mode verification when cloning or competing in a category. [file:2]

### 0C. Visual policy
Do **not** follow the old line in the Codex prompt that says to use “Inter Variable font, violet #783AFB primary accent” unless extraction and current brand evidence support it. The v8 rule forbids approximating design tokens when extraction is available. [file:5][file:2]

---

## BUILD STRATEGY — VERTICAL SLICE DISCIPLINE

Do not implement by horizontal layer only. Build in vertical slices.

Each slice must include:
- Prisma/data model changes
- server actions or API routes
- service logic
- UI surface
- validation
- tests
- instrumentation
- docs/knowledge artifact

Recommended slice order:

1. **Keyword discovery → cluster → persist → view**
2. **Workspace onboarding → site verification → sitemap crawl → first action**
3. **Content inventory import → score existing page → refresh brief**
4. **Article generation → score → review gate**
5. **CMS connection → preview → publish flow**
6. **Technical audit crawl → persisted issue → recrawl verification**
7. **Search Console import → opportunity detection → keyword/content action**
8. **Competitor gap → brief → content or refresh action**
9. **Internal-link suggestion → review → score-aware editor insertion**
10. **Rank tracking → persistence → trend UI**
11. **Citation check → trend model → alerts**
12. **Backlink opportunity discovery → outreach workflow**
13. **Schema recommendation → validation → publish warning/block**
14. **Dashboard roll-up**
15. **Collaboration + approval workflow**
16. **Automation rules + alerts**
17. **Plan enforcement + billing hooks**
18. **Open API / webhooks / exports**
19. **Admin / reliability / observability hardening**

This aligns with v10 tracer-bullet and vertical-slice discipline. [file:7]

---

## FULL BUILD SPECIFICATION

### Cross-Cutting Feature Add-Ons — Product Completeness
These add-ons are mandatory unless repo recon proves an equivalent already exists. Build them as vertical slices, not as isolated settings pages or disconnected tables.

#### Workspace Onboarding & Site Intelligence
Build:
- guided workspace creation for one or more tracked sites
- site verification via DNS, HTML tag, file upload, or OAuth where supported
- sitemap discovery and crawl seeding
- robots.txt and canonical URL checks
- baseline site profile: pages discovered, indexed candidates, topic coverage, CMS hints, and known competitors
- onboarding checklist that routes users into the first useful action: keyword discovery, content inventory, or scoring an existing page

Requirements:
- no user reaches an empty dashboard with no next action
- crawl and verification failures must explain what failed and what to do next
- all discovered URLs must be normalized, deduped, owned by a workspace, and safe-fetched
- site intelligence must feed keyword, content, internal-linking, and dashboard surfaces

#### Content Inventory & Refresh Engine
Build:
- import existing URLs from sitemap, CSV, Search Console, or manual entry
- crawl/import page title, headings, meta description, canonical URL, last modified date, and body text where allowed
- score existing content with traditional SEO score and GEO Score
- detect thin content, cannibalization, stale content, missing metadata, internal-link gaps, and weak AI-search visibility
- prioritize refresh opportunities by impact, effort, and confidence
- create refresh briefs that open in the editor with before/after score comparison

Requirements:
- imported content must be distinguishable from generated articles
- refresh recommendations must cite the evidence that triggered them
- score changes must be persisted as history, not overwritten as a single latest value
- never suggest publishing changes without passing through the Review Gate

#### Technical SEO Audit
Build:
- crawl-based issue detection for broken links, redirect chains, duplicate titles, duplicate descriptions, missing H1, multiple H1s, non-indexable pages, canonical conflicts, large pages, missing alt text, and schema problems
- severity model: critical, high, medium, low
- issue lifecycle: open, ignored, fixed, regressed
- per-issue evidence, affected URLs, first seen, last seen, and fix guidance
- recrawl and regression detection

Requirements:
- audits must be scoped to verified or explicitly user-approved domains
- crawler must respect robots.txt unless the user has verified ownership and explicitly overrides where legal
- issue counts in dashboards must be derived from persisted audit records
- fixing an issue must require evidence from a recrawl or deterministic check

#### Search Console & Analytics Integrations
Build:
- Google Search Console connection
- GA4 connection where applicable
- ingestion for queries, pages, impressions, clicks, CTR, average position, organic sessions, conversions, and date ranges
- mapping between Search Console pages and internal Content Inventory records
- opportunity detection from high-impression low-CTR queries, declining pages, cannibalized queries, and pages close to ranking thresholds

Requirements:
- OAuth tokens encrypted at rest and refreshable server-side only
- imported metrics must store source, date range, and last sync status
- dashboards must label whether a metric is first-party, third-party, estimated, or generated
- no blended metric should hide its source inputs

#### Competitor Intelligence
Build:
- competitor workspace entries with domain, market, notes, and priority
- competitor page and keyword discovery
- content gap analysis against Keyword Clusters and Content Inventory
- SERP overlap tracking
- competitor content pattern summaries: formats, headings, entities, schema, publishing cadence where detectable
- comparison views that show what competitors cover that SEO AI Regent users do not

Requirements:
- competitor insights must be evidence-backed and dated
- scraped or fetched competitor content must respect legal and robots constraints
- summaries must distinguish observed facts from AI interpretation
- gap recommendations must route into keyword briefs, content briefs, or refresh briefs

#### Internal Linking & Topic Authority
Build:
- graph of articles, pages, Keyword Clusters, entities, internal links, and anchors
- internal-link suggestions from existing content to target articles
- orphan page detection
- anchor text guidance
- topic authority map by cluster
- link insertion review workflow for generated or refreshed content

Requirements:
- never auto-insert links into published content without user review
- suggestions must show source page, target page, anchor, rationale, and confidence
- topic authority views must use real Content Inventory, Keyword Cluster, rank, and score data
- internal linking should improve score transparency, not become a black-box recommendation feed

#### Schema & SERP Feature Optimization
Build:
- schema recommendations for Article, FAQPage, HowTo, Product, Organization, BreadcrumbList, LocalBusiness, and WebSite where appropriate
- JSON-LD preview and validation
- SERP feature tracking for featured snippets, People Also Ask, local pack, images, video, sitelinks, and AI overview/citation presence where available
- structured data health checks during Technical SEO Audit

Requirements:
- schema type selection must be explained and user-reviewable
- invalid schema must block publish or show a Review Gate warning depending on severity
- SERP feature data must cite provider, query, locale, device, and timestamp

#### AI Briefs, Brand Voice, and Human Review
Build:
- reusable Brand Voice profiles
- audience and offer profiles
- content brief editor with SERP evidence, entities, FAQs, internal links, competitor notes, and scoring targets
- AI outline generation before full article generation
- claim checklist and citation requirements for sensitive claims
- approval workflow for teams: draft, in review, changes requested, approved, ready to publish

Requirements:
- generated claims must be traceable to user-provided context, crawled first-party content, or cited research
- users must be able to lock brand voice and forbidden terms per workspace
- approval status must be enforced server-side before CMS publish when team review is enabled

#### Collaboration, Agencies, and White Label
Build:
- organizations, workspaces, roles, and permissions
- roles: owner, admin, editor, viewer, client
- comments on articles, briefs, audit issues, backlink opportunities, and reports
- client-safe reporting views
- white-label report branding for agency plans
- activity log for meaningful workspace events

Requirements:
- authorization must be checked server-side on every workspace resource
- client role must not expose secrets, provider credentials, or internal cost details
- activity logs must avoid storing sensitive token values or raw secrets

#### Automation Rules & Alerts
Build:
- rule builder for recurring checks, score thresholds, rank changes, citation changes, audit regressions, publishing reminders, and digest schedules
- notification channels: email first, webhook where practical
- alert states: active, acknowledged, resolved
- weekly digest with keyword, content score, rank, citation, backlink, and audit deltas

Requirements:
- automation must be idempotent and observable
- alerts must link to the underlying evidence, not just a metric
- users must be able to pause rules without deleting history

#### Open API, Webhooks, and Data Export
Build:
- API keys scoped to workspace and permissions
- webhook subscriptions for publishing job status, score completed, rank changed, citation changed, audit completed, and alert fired
- CSV export for tables
- PDF export for client reports
- audit log for API key creation, rotation, and revocation

Requirements:
- API keys must never be shown again after creation
- webhook delivery must include retries, signatures, and delivery history
- exports must preserve metric source attribution

### Phase 1 — Keyword Research Module
Build:
- AI keyword discovery from seed topics via Serper.dev
- clustering by intent: informational, transactional, navigational, commercial
- search volume + difficulty
- competitor keyword gap analysis from entered competitor URL
- topic-cluster grouping
- persistence for `Keyword`, `KeywordCluster`, and supporting metrics [file:5]

Requirements:
- dedupe near-identical keyword outputs
- clear source attribution for metrics
- pagination and filtering for large keyword sets
- ability to convert cluster → content brief

### Phase 2 — Content Generation Pipeline
Build:
- AI article generation from keyword brief
- templates: pillar post, listicle, how-to, comparison, FAQ
- proper H1/H2/H3 structure
- internal linking suggestions based on existing articles
- meta title, meta description, OG metadata generation
- automatic scoring through the existing scoring engine
- review gate for scores below 70 [file:5]

Requirements:
- generated article must open directly in the TipTap editor
- score breakdown must be visible and explainable
- user must be able to revise and re-score iteratively
- publish eligibility must be computed, not manually guessed

### Phase 3 — CMS Auto-Publishing
Build connectors for:
- WordPress
- Webflow
- Shopify
- Ghost
- Notion
- generic webhook [file:5]

Requirements:
- OAuth where available, API key fallback only when necessary
- encrypted credentials at rest
- publishing states: preview, draft, scheduled, published
- publish flow: Generate → Score → Review Gate → Preview → Publish/Schedule
- never publish content below threshold [file:5]

### Phase 4 — Backlink & Authority
Build:
- backlink opportunity discovery
- domain authority scoring
- outreach template generation
- outreach status tracking [file:5]

Requirements:
- opportunity provenance visible
- statuses are canonical and typed
- notes/logs stored with timestamps
- no shallow “lead table” without workflow value

### Phase 5 — AI Search Citation Tracking
Build:
- citation checks across ChatGPT, Perplexity, Claude, Gemini
- scheduled recurring checks
- citation score and trend reporting
- gained/lost citation alerts [file:5]

Requirements:
- user-owned model/API keys where applicable, per prompt rule
- store query used, timestamp, model, and attributable result snippet
- distinguish “no citation found” from “check failed”

### Phase 6 — Rank Tracking
Build:
- daily rank checks
- current position, URL, SERP features
- 7/30/90-day trend views
- competitor position comparison [file:5]

Requirements:
- scheduled jobs are idempotent
- history tables indexed
- charts derived from real persisted data

### Phase 7 — Reporting Dashboard
Build:
- keyword ranking overview
- content score rollups
- citation counts
- backlink status
- export to CSV/PDF
- weekly digest option
- white-label option for agencies where feasible [file:5]

Requirements:
- dashboard must be information-dense but scannable
- no decorative filler panels
- all metrics traceable to source queries/tables/services

---

## DATA MODEL REQUIREMENTS

Start from the Prisma schema in the original Codex prompt and refine it rather than blindly copy-pasting. The prompt specifies models for `CmsConnection`, `Keyword`, `KeywordCluster`, `Article`, `BacklinkOpportunity`, `RankTracking`, and `AICitation`, plus enums for plans, statuses, intents, platforms, and AI models. [file:5]

Before finalizing schema:
- normalize where needed
- add missing indexes
- add audit timestamps consistently
- ensure ownership relations exist
- add status enums instead of stringly-typed state
- validate whether additional models like `Organization`, `Workspace`, `Site`, `SiteVerification`, `CrawlJob`, `CrawledUrl`, `ContentInventoryItem`, `ContentScoreSnapshot`, `TechnicalSeoIssue`, `SearchConsoleConnection`, `AnalyticsConnection`, `Competitor`, `CompetitorSnapshot`, `InternalLinkSuggestion`, `SchemaRecommendation`, `BrandVoiceProfile`, `ContentBrief`, `ApprovalRequest`, `Comment`, `ActivityLog`, `AutomationRule`, `Alert`, `WebhookSubscription`, `WebhookDelivery`, `ApiKey`, `KeywordMetrics`, `CitationCheck`, `CitationTrend`, `PublishingJob`, and `OutreachLog` are needed to satisfy the functional spec cleanly

Do not leave the schema half-conceptual.

---

## API AND SERVICE LAYER REQUIREMENTS

The original prompt defines route families for:
- `/api/workspaces`
- `/api/sites`
- `/api/crawls`
- `/api/audits`
- `/api/inventory`
- `/api/integrations/search-console`
- `/api/integrations/analytics`
- `/api/keywords`
- `/api/content`
- `/api/cms`
- `/api/backlinks`
- `/api/rankings`
- `/api/citations`
- `/api/competitors`
- `/api/internal-links`
- `/api/schema`
- `/api/reports`
- `/api/automation`
- `/api/webhooks`
- `/api/api-keys` [file:5]

Implement them with:
- input validation
- typed responses
- rate limiting where needed
- auth checks
- ownership checks
- structured logging
- retries and timeout handling for external services
- no silent fallback to mock data

If using App Router route handlers, keep server-only logic out of client bundles.

---

## UI / UX REQUIREMENTS

Required pages from the original prompt:
- landing page
- dashboard
- workspace onboarding
- site verification
- site audit
- content inventory
- content refresh opportunities
- keywords views
- content list
- content brief workspace
- new content flow
- editor
- publish flow
- backlinks board
- rankings views
- citations dashboard
- competitor intelligence
- internal linking map
- schema recommendations
- reports
- settings
- CMS connections
- integrations [file:5]
- team and permissions
- automation rules
- API keys and webhooks

### UX rules
- Every major async action must have loading, success, empty, and failure states.
- Every score shown in UI must expose why it is that score.
- Every table or board with operational use must support filtering/search.
- Mid-screen laptop usability matters as much as full desktop.
- The content editor is a money feature; treat it as premium, fast, and stable.

### Design rules
- Use extracted tokens where possible.
- Maintain a clear spacing system and type scale.
- Avoid generic AI-SaaS hero patterns and template-looking dashboard cards.
- Validate UI quality with `designlang score` for deploy previews or equivalent URLs. [file:2][file:7]

---

## SCORING ENGINE PROTECTION

The scoring engine is the moat. Protect it.

Requirements:
- every article is scored before publish,
- score threshold gate is enforced at the server level,
- score details are visible to the user,
- GEO Score remains distinct from traditional SEO score,
- users can understand what to fix next,
- low confidence or partial-analysis states are visible,
- score inputs and outputs are test-covered. [file:5]

Never build automation that bypasses scoring integrity.

---

## SECURITY, BILLING, AND RELIABILITY

### Security
- no API keys in frontend code
- environment variables only
- validate all external inputs
- sanitize URL fetch paths
- secure CMS tokens
- add CSRF/session protections where needed
- log errors without leaking secrets [file:5][file:7]

### Billing / plans
Pricing in the original prompt:
- Free
- Starter
- Growth
- Enterprise [file:5]

Requirements:
- server-side entitlement enforcement
- clean upgrade path
- clean downgrade/cancel behavior
- no UI claiming access the backend does not enforce

### Reliability
- idempotent scheduled jobs
- retry strategy for provider failures
- health/readiness checks if backend service exists
- structured logs
- failure alerts where practical
- deterministic behavior for scoring and publishing state transitions

---

## TESTING STANDARD

Per v10 doctrine, no slice is complete without verification. `AGENTS.md` makes test pass a blocking quality gate. [file:7]

For each slice, add:
- unit tests for pure logic
- integration tests for routes/services
- editor/scoring interaction tests where relevant
- Prisma model / DB integrity checks
- E2E path for the user-critical flow

Minimum E2E flows:
1. create workspace → verify site → ingest sitemap → show first action
2. import content inventory → score page → create refresh brief
3. discover keywords → cluster → save
4. generate article → score → edit → re-score
5. connect CMS → preview → publish eligible article
6. low-score article blocked from publish
7. run technical audit → persist issue → recrawl verifies fixed/regressed state
8. connect Search Console → import query/page metrics → render opportunity
9. add competitor → detect content gap → create brief
10. accept internal-link suggestion → render in editor → re-score
11. validate schema recommendation → preview publish warning/block
12. run citation check → persist result → render trend
13. start rank tracking → store daily snapshots → render trend
14. create backlink opportunity → update outreach status
15. create automation rule → trigger alert → acknowledge/resolve
16. create API key/webhook → receive signed event → inspect delivery history

No bulk speculative tests. RED → GREEN one scenario at a time. [file:7]

---

## DOCS AND ARTIFACTS REQUIRED

Because GODMYTHOS v10 requires compound learning and repo discipline, generate:

- `docs/plans/seo-ai-regent-automation-build.md` — current technical plan
- `docs/knowledge/YYYY-MM-DD-<slug>.md` — one per meaningful completed cycle
- ADRs only when the three-test gate is met: hard-to-reverse, surprising, real trade-off
- updates to `CONTEXT.md` whenever domain terms sharpen [file:7][file:6]

If a proposed feature is rejected, capture it in `.out-of-scope/` instead of letting it resurface endlessly. [file:7]

---

## CODEX EXECUTION LOOP

For each vertical slice:

1. Reconstruct current state
2. Define exact acceptance criteria
3. Add or update domain terms in `CONTEXT.md`
4. Create failing test or deterministic feedback loop
5. Implement the minimal end-to-end slice
6. Run typecheck
7. Run tests
8. Run lint/format
9. Run security audit if dependencies changed
10. Run design verification for UI changes
11. Write compound learning artifact
12. Only then move to the next slice

Suggested commands are aligned with the repo doctrine template in `AGENTS.md`, which includes install, typecheck, test, lint/format, security audit, and design score gates. [file:7]

---

## BUILD COMMANDS

Use the repo’s real commands if they already exist. If bootstrapping fresh, align them to the `AGENTS.md` template:

```bash
npm install
npm run typecheck
npm test
npm run lint
npm run format
npm audit --audit-level=high
```

For UI quality on deployed previews:

```bash
npx designlang score $DEPLOY_URL
```

These commands and gates are explicitly present in the attached `AGENTS.md`. [file:7]

---

## RESTRICTIONS

1. Never auto-publish content below 70/100. [file:5]
2. Never call the product RankForge. [file:5]
3. Never store secrets in frontend code. [file:5]
4. Never skip the scoring engine. [file:5]
5. Never use emoji in landing page or dashboard UI. [file:5]
6. Never hardcode design tokens if extraction is available. [file:2]
7. Never score design by eye when `designlang score` can be run. [file:2]
8. Never ship disconnected UI-only or backend-only work as “done.” [file:7]
9. Never bypass pre-commit or CI expectations. [file:7]
10. Never violate canonical vocabulary once `CONTEXT.md` is established. [file:6][file:7]

---

## SUCCESS CRITERIA

The build is successful only if all of the following are true:

- A user can create a workspace, verify a site, ingest a sitemap, and get a meaningful first action.
- SEO AI Regent can discover keywords, cluster them, and turn them into content briefs.
- It can import existing content, score it, and generate refresh briefs.
- It can generate articles that enter the existing editor cleanly.
- Every article is scored before publish.
- Articles below 70 are blocked from auto-publish.
- CMS publishing works through a real review gate.
- Technical SEO audit issues are persisted with evidence and verified by recrawl.
- Search Console / analytics metrics retain source attribution and drive opportunities.
- Competitor intelligence produces evidence-backed content gaps.
- Internal linking suggestions are reviewable and explain their rationale.
- Schema recommendations validate before publish.
- Rank tracking, citation tracking, and backlink workflows persist real data.
- Dashboard metrics are traceable and not decorative.
- Reports, alerts, exports, webhooks, and API keys work without hiding metric provenance.
- Team permissions and approval gates are enforced server-side.
- The UI clears a design quality bar and avoids generic SaaS template drift.
- The app is compiler-clean, test-covered, and security-reviewed.
- The repo contains updated context, plan, and compound-learning artifacts consistent with v10 doctrine. [file:5][file:7][file:8]

---

## BEGIN

Start by:

1. reading `AGENTS.md`,
2. reading `CONTEXT.md`,
3. checking for `graphify-out/GRAPH_REPORT.md`,
4. inventorying the existing SEO AI Regent codebase,
5. extracting competitor and brand design tokens with `designlang`,
6. writing the first vertical-slice plan in `docs/plans/seo-ai-regent-automation-build.md`.

Only after that should implementation begin.
