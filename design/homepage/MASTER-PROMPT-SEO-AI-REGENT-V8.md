# GODMYTHOS v8 — SEO_AI_REGENT BUILD MASTER PROMPT

You are operating in **GREENFIELD_MODE** with **DESIGN_EXTRACT_MODE** as the mandatory first step before any code is written.

---

## Product: SEO AI Regent

A next-generation SEO content optimization platform — cloning and surpassing Surfer SEO, Clearscope, and Frase. SEO AI Regent scores content against top-ranking competitors in real-time, with a unique **GEO Score** for AI search (ChatGPT/Perplexity/Gemini) visibility that no competitor currently offers.

**Positioning:** "Content scoring for Google AND AI search — the only tool that tells you if your content will rank in both."

---

## What You're Building

SEO AI Regent is a SaaS content scoring platform with 6 core modules:

| Module | Description |
|---|---|
| **SERP Analyzer** | Fetch top 10 Google results, extract content patterns, compare competitors |
| **Content Editor** | Real-time rich text editor with 0–100 Content Score, NLP term suggestions |
| **Keyword Research** | Cluster topics, find gaps, identify keyword opportunities |
| **AI Writer** | Generate outlines and drafts matching SERP patterns via Claude |
| **Audit** | Score existing pages against current competitors |
| **GEO Score** *(differentiator)* | AI search visibility score for ChatGPT / Perplexity / Gemini |

---

## MANDATORY FIRST STEP: DESIGN_EXTRACT_MODE

> **Hard Rule #10**: Design tokens are evidence, not estimates. Zero-approximation policy. Colors, fonts, spacing, shadows, and radii that are extractable from a live site MUST be extracted via `designlang`. Guessing `#3B82F6` when extraction would return `#2563EB` is a correctness failure.

Before writing ANY code or CSS, run the full extraction sequence:

```bash
# Step 1: Extract competitor design systems
designlang https://surferseo.com --full --out design/tokens/surfer/
designlang score https://surferseo.com                        # Establish benchmark grade
designlang https://app.surferseo.com --full --out design/tokens/surfer-app/
designlang https://clearscope.io --full --out design/tokens/clearscope/
designlang https://frase.io --full --out design/tokens/frase/
designlang https://www.semrush.com/writing-assistant/ --full --out design/tokens/semrush-seo/

# Step 2: Extract competitor pricing pages
designlang https://surferseo.com/pricing/ --full --out design/tokens/surfer-pricing/
designlang https://www.clearscope.io/pricing --full --out design/tokens/clearscope-pricing/
designlang https://www.frase.io/pricing --full --out design/tokens/frase-pricing/

# Step 3: Competitive design comparison matrix
designlang brands surferseo.com clearscope.io frase.io seo-ai-regent.io

# Step 4: Score all competitors (design quality becomes positioning intel)
designlang score https://surferseo.com
designlang score https://clearscope.io
designlang score https://frase.io
```

> A D-grade competitor design system is a **positioning opportunity** — if their visual quality is low, SEO AI Regent wins on design alone.

**Verification gate:** After building the app UI, run:
```bash
designlang brands surferseo.com app.seo-ai-regent.io
```
If any category diverges by more than one letter grade from Surfer's design score, the clone **fails visual QA**. Fix before continuing.

---

## INTEL_MODE: Competitor Tech Stack Analysis

Run before scaffolding:

```bash
# BuiltWith tech stack profiling
builtwith https://surferseo.com
builtwith https://clearscope.io
builtwith https://frase.io

# RECON sub-step: After capture, run designlang --full before catalog
designlang https://surferseo.com --full --out recon/surfer-design/
```

**Intel Brief must include:**
- Tech stack (framework, CDN, analytics, auth)
- Design Grade (from `designlang score`)
- Pricing structure and free tier limits
- Feature gaps (what they DON'T have — GEO Score is ours)

---

## DESIGN_COMPARE_MODE: Competitive Design Matrix

Generate a full N-site comparison before finalizing SEO AI Regent's design system:

```bash
designlang compare surferseo.com clearscope.io frase.io \
  --dimensions colors,typography,spacing,wcag \
  --out recon/competitive-design-matrix.md
```

Output format:

| Dimension | Surfer | Clearscope | Frase | SEO AI Regent Target |
|---|---|---|---|---|
| Color discipline | B | C | C+ | A |
| Typography | B+ | B | C+ | A |
| Spacing system | B | C+ | C | A |
| WCAG score | B | B- | C+ | A |
| Tokenization | B | D | D | A |
| Overall Design Grade | B | C+ | C+ | **A target** |

---

## DESIGN_SCORE_MODE: CI Gate

Design score is a CI gate — the app cannot ship if it scores below B.

```bash
# Run before every PR merge to main
designlang score https://app.seo-ai-regent.io \
  --categories color_discipline,typography,spacing,shadows,radii,a11y,tokenization \
  --fail-below B
```

Scoring rubric (A–F across 7 categories):

| Category | What It Measures |
|---|---|
| Color discipline | Palette restraint, semantic usage, dark/light parity |
| Typography | Scale coherence, display/body boundary, weight contrast |
| Spacing | 4px grid adherence, density consistency |
| Shadows | Elevation system, tone-matched, layered |
| Radii | Hierarchy, nested radius math, consistency |
| A11y | WCAG contrast, focus states, semantic HTML |
| Tokenization | CSS variables vs hardcoded values ratio |

---

## DESIGN_WATCH_MODE: Drift Prevention

Set up watch job during Week 12 (Polish phase):

```bash
# Monitor for design drift on a weekly schedule
designlang watch https://app.seo-ai-regent.io \
  --schedule "0 9 * * 1" \
  --auto-update design/tokens/seo-ai-regent-live/ \
  --alert-on-drift \
  --n8n-webhook $N8N_DESIGN_WEBHOOK
```

- Auto-updates local token files if minor drift detected
- Sends Telegram alert via n8n if drift exceeds one letter grade
- Integrates with Railway deploy hooks to trigger post-deploy score check

---

## Tech Stack

```
Frontend:    Next.js 14 + TypeScript + Tailwind CSS v4 + TipTap (rich text editor)
Backend:     Next.js API routes + Prisma ORM
Database:    PostgreSQL (TrueNAS self-hosted)
Cache:       Redis (SERP cache 24h TTL, scoring cache 1h TTL)
SERP Data:   Serper.dev API ($50/mo for 50K queries)
NLP:         Google Natural Language API ($1.50/1K calls)
AI Writer:   Claude API (via OpenClaw prompt layer)
Auth:        NextAuth.js (email + Google OAuth)
Infra:       Railway (app + Redis) + TrueNAS (PostgreSQL)
Analytics:   Plausible (self-hosted)
Payments:    Stripe (subscriptions + metered billing)
Design:      Geist font, Cyan #06B6D4 primary, #0A0A0A bg, dark mode default
Monitoring:  DESIGN_WATCH_MODE (weekly drift check via n8n)
```

---

## Brand Identity

Extracted tokens lock. Override only with `designlang`-verified values.

```css
/* SEO AI Regent Design Tokens — Developer312 Ecosystem */
:root {
  --color-primary:          #06B6D4;   /* Cyan — ecosystem anchor */
  --color-primary-hover:    #0891B2;
  --color-primary-active:   #0E7490;
  --color-primary-highlight: rgba(6, 182, 212, 0.12);

  --color-bg:               #0A0A0A;   /* Near-black — dark default */
  --color-surface:          #141414;   /* Card/panel backgrounds */
  --color-surface-elevated: #1C1C1C;   /* Modals, dropdowns */
  --color-surface-offset:   #222222;   /* Hover states, alternating rows */
  --color-border:           #2A2A2A;   /* 1px structural borders */
  --color-border-subtle:    rgba(255,255,255,0.06); /* Alpha-blended preferred */
  --color-divider:          #1F1F1F;

  --color-text:             #F2F2F2;   /* Primary text */
  --color-text-secondary:   #8B8B8B;   /* Muted/supporting text */
  --color-text-faint:       #4A4A4A;   /* Decorative/tertiary only */

  --color-success:          #22C55E;
  --color-warning:          #F59E0B;
  --color-error:            #EF4444;

  --font-heading:  'Geist', sans-serif;     /* NOT Manrope, NOT Inter */
  --font-body:     'Geist', sans-serif;
  --font-mono:     'Geist Mono', monospace;

  /* Score color ramp (used across all scoring UI) */
  --score-excellent: #22C55E;   /* 90–100 */
  --score-good:      #84CC16;   /* 70–89  */
  --score-fair:      #F59E0B;   /* 50–69  */
  --score-poor:      #EF4444;   /* 0–49   */
}
```

**Font loading (mandatory):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..900&family=Geist+Mono:wght@300..700&display=swap" rel="stylesheet">
```

---

## Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  plan          Plan      @default(FREE)
  stripeId      String?   @unique
  articles      Article[]
  audits        Audit[]
  keywords      Keyword[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Article {
  id              String        @id @default(cuid())
  userId          String
  title           String
  content         Json          // TipTap JSON document
  keyword         String
  contentScore    Int           @default(0)
  geoScore        Int?          // AI search visibility 0–100
  wordCount       Int           @default(0)
  readability     Float?        // Flesch-Kincaid grade level
  status          ArticleStatus @default(DRAFT)
  serpData        Json?         // Cached SERP analysis (24h)
  nlpTerms        Json?         // Required / recommended / optional terms
  scoreBreakdown  Json?         // Per-signal breakdown for transparency
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  user            User          @relation(fields: [userId], references: [id])
  audits          Audit[]

  @@index([userId])
  @@index([keyword])
}

model Audit {
  id              String    @id @default(cuid())
  userId          String
  url             String
  keyword         String
  contentScore    Int
  geoScore        Int?
  issues          Json      // Scored signal breakdown
  suggestions     Json      // Prioritized action items
  createdAt       DateTime  @default(now())
  user            User      @relation(fields: [userId], references: [id])
  article         Article?  @relation(fields: [articleId], references: [id])
  articleId       String?

  @@index([userId])
}

model Keyword {
  id              String    @id @default(cuid())
  userId          String
  keyword         String
  searchVolume    Int?
  difficulty      Float?
  serpOverlap     Json?     // URLs overlapping with sibling keywords
  cluster         String?   // Auto-assigned topic cluster
  intent          String?   // informational / commercial / transactional / navigational
  createdAt       DateTime  @default(now())
  user            User      @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([cluster])
}

model DesignScore {
  id              String    @id @default(cuid())
  url             String
  score           Json      // designlang score output (7 categories)
  overallGrade    String    // A / B / C / D / F
  capturedAt      DateTime  @default(now())

  @@index([url])
}

enum Plan { FREE STARTER GROWTH ENTERPRISE }
enum ArticleStatus { DRAFT OPTIMIZING COMPLETE ARCHIVED }
```

---

## Scoring Algorithm (Core IP)

```typescript
// Content Score: 0–100, weighted multi-signal model
interface ContentScore {
  overall:          number;  // Weighted sum — shown to user
  termFrequency:    number;  // 20% — Required terms present at correct density?
  entityCoverage:   number;  // 20% — Key entities from SERP covered?
  headingStructure: number;  // 15% — H2/H3 structure matches top performers?
  wordCount:        number;  // 15% — Within ideal SERP-derived range?
  readability:      number;  // 10% — Flesch-Kincaid appropriate for topic?
  internalLinks:    number;  // 10% — Cross-linked to related content?
  geoSignals:       number;  // 10% — AI search visibility factors present?
}

// GEO Score: 0–100, AI search visibility model
interface GEOScore {
  overall:           number;
  entityAuthority:   number;  // Is content cited as authoritative in AI training signals?
  factualDensity:    number;  // Facts, stats, citations per 1000 words
  answerFormat:      number;  // Does content directly answer questions?
  sourceCredibility: number;  // EEAT signals present?
  freshness:         number;  // Recent data and update signals?
}

// Score transparency — always expose breakdown to user
function explainScore(score: ContentScore): ScoredSignal[] {
  return Object.entries(score)
    .filter(([key]) => key !== 'overall')
    .map(([signal, value]) => ({
      signal,
      value,
      weight: SIGNAL_WEIGHTS[signal],
      contribution: value * SIGNAL_WEIGHTS[signal],
      status: value >= 80 ? 'strong' : value >= 50 ? 'needs-work' : 'critical',
    }));
}
```

---

## SERP Analysis Pipeline

```
1. User enters keyword
2. Serper.dev API → fetch top 10 Google results
3. For each result:
   a. Scrape: word count, heading tree (H1–H6), entity mentions
   b. Google NLP API → entities, salience scores, categories
   c. Compute: TF-IDF term frequency, term positions, term density
4. Aggregate across all 10 results:
   a. Average + ideal word count range
   b. Common H2/H3 heading patterns (frequency matrix)
   c. Entity overlap (entities in 7+/10 results = required)
   d. Term bands: required (9+/10), recommended (5–8/10), optional (3–4/10)
5. Cache results in Redis for 24h (same keyword → no re-fetch)
6. Return structured scoring signals to Content Editor via WebSocket
```

---

## Content Editor UX (The Money Feature)

```
┌──────────────────────────────────────────────────────────┐
│  SEO AI Regent                              Content Score: 75 │
│  ┌───────────────────────────────┐  ┌──────────────────┐ │
│  │                               │  │  ████████░░ 75   │ │
│  │  [TipTap Rich Text Editor]    │  ├──────────────────┤ │
│  │                               │  │  Terms           │ │
│  │  Real-time scoring overlay    │  │  ✅ entity        │ │
│  │  Highlighted missing terms    │  │  ✅ optimization  │ │
│  │  shown inline in editor       │  │  ✅ content score │ │
│  │                               │  │  ⬜ marketing     │ │
│  │                               │  │  ⬜ keyword       │ │
│  │                               │  ├──────────────────┤ │
│  │                               │  │  Word Count      │ │
│  │                               │  │  1,847 / 2,200   │ │
│  │                               │  ├──────────────────┤ │
│  │                               │  │  Readability     │ │
│  │                               │  │  Grade 8   ✅    │ │
│  │                               │  ├──────────────────┤ │
│  │                               │  │  GEO Score       │ │
│  │                               │  │  68 / 100        │ │
│  │                               │  │  ⬜ factual density│ │
│  └───────────────────────────────┘  └──────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Editor implementation notes:**
- WebSocket (`ws://`) connection for real-time score updates — target < 200ms latency
- TipTap `onUpdate` → debounce 500ms → POST `/api/score/content` → WS push score back
- Term highlighting: TipTap extension marks missing required terms in amber, optional in blue
- Score ring animates on change (CSS `@property` counter animation, respect `prefers-reduced-motion`)

---

## Landing Page Structure (9-Section Conversion Layout)

Validated by Developer312 design system research (ConstantContact pattern):

| # | Section | Content |
|---|---|---|
| 1 | **Hero** | "Content scoring for Google AND AI search" + "Start Free" CTA |
| 2 | **Social Proof** | "Trusted by X creators" + publication logos |
| 3 | **How It Works** | 3-step visual: Enter keyword → Write → Score |
| 4 | **Features Grid** | Content Score, SERP Analyzer, AI Writer, GEO Score (asymmetric layout — NOT 3-column icon grid) |
| 5 | **Comparison Table** | SEO AI Regent vs Surfer vs Clearscope vs Frase |
| 6 | **Testimonials** | 3 user quotes with role + publication |
| 7 | **Pricing** | Free / Starter $49 / Growth $149 / Enterprise custom |
| 8 | **FAQ** | 6 common objections (pricing, accuracy, AI models, data freshness) |
| 9 | **CTA** | Final "Start Free" with urgency signal |

**Anti-pattern mandate (from GODMYTHOS v8):** The Features Grid MUST NOT be a 3-column icon-in-circle grid. Use an asymmetric 2+1 layout or a narrative flow. Centered text on every section is forbidden. Left-align as default.

---

## API Routes

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/articles
POST   /api/articles
GET    /api/articles/:id
PUT    /api/articles/:id
DELETE /api/articles/:id

POST   /api/serp/analyze        ← keyword → SERP data + scoring signals (cached 24h)
POST   /api/score/content       ← article content → ContentScore breakdown
POST   /api/score/geo           ← article content → GEOScore breakdown
POST   /api/audit/run           ← URL + keyword → full audit results
GET    /api/keywords
POST   /api/keywords/research   ← keyword → related terms + cluster assignment
GET    /api/keywords/clusters

POST   /api/ai/outline          ← keyword → structured SERP-matched outline
POST   /api/ai/draft            ← outline → full Claude-generated draft

POST   /api/stripe/webhook
GET    /api/billing/plans
POST   /api/billing/subscribe

GET    /api/design/score        ← internal: run designlang score on demand (admin only)
```

---

## Pricing

| Plan | Price | Articles | Audits | SERP Queries | GEO Score | AI Writer |
|---|---|---|---|---|---|---|
| **Free** | $0 | 3 | 3 | 10/mo | ✅ | ✅ |
| **Starter** | $49/mo | 30 | 20 | 200/mo | ✅ | ✅ |
| **Growth** | $149/mo | Unlimited | Unlimited | 1,000/mo | ✅ | ✅ |
| **Enterprise** | Custom | Unlimited | Unlimited | Custom | ✅ | ✅ |

**Outcome-based free tier rule:** Free tier must deliver REAL value — 3 articles + 3 audits must produce genuinely useful content scores. No crippled outputs.

---

## Build Order (Execution Phases)

```
Phase 1  (Weeks 1–2):   Scaffold + Auth + Landing Page + Serper.dev integration
Phase 2  (Weeks 3–4):   SERP Analyzer dashboard + Redis caching layer
Phase 3  (Weeks 5–7):   Content Editor + Real-time scoring via WebSocket ← THE PRODUCT
Phase 4  (Weeks 8–9):   Audit module + Keyword Research + clustering
Phase 5  (Weeks 10–11): AI Writer (Claude via OpenClaw) + GEO Score module
Phase 6  (Week 12):     Stripe billing + DESIGN_WATCH_MODE setup + polish + launch
```

---

## Hard Rules (GODMYTHOS v8 — All 10 Active)

| # | Rule | Enforcement |
|---|---|---|
| 1 | **DESIGN_EXTRACT_MODE before ANY styling** | Run `designlang` on Surfer, Clearscope, Frase. Extracted tokens only. No approximations. |
| 2 | **No stub theater** | Every feature must work end-to-end. No `// TODO` or mock data in production paths. |
| 3 | **Verification before victory** | Run the app. Check the score. Test the SERP pipeline with a real keyword. |
| 4 | **Scoring transparency** | Show users exactly how each signal contributes. No black box scores. `explainScore()` on every response. |
| 5 | **Dark mode default** | Developer audience. `#0A0A0A` bg. Light mode is opt-in toggle. |
| 6 | **Geist font** | Not Manrope. Not Inter. Not system fonts. Geist. Always. |
| 7 | **Outcome-based free tier** | Free delivers real value: 3 articles + 3 audits with genuine scoring. |
| 8 | **Munch rules** | Zero filler. Answer first. Code as explanation. Dense JSON responses. |
| 9 | **No generic AI sludge** | If the UI feels interchangeable with any SaaS template, rebuild it. 3-column icon grids are forbidden. |
| 10 | **Design tokens are evidence** | Never approximate colors/spacing. Extract via `designlang` or use the defined brand tokens above. Hardcoding is a correctness failure. |

---

## New Anti-Patterns (GODMYTHOS v8 Additions)

These four failures are now build-blocking violations:

1. **Approximating design tokens** — Writing `#3B82F6` when `designlang` would extract `#2563EB` from the live site. Use extraction, always.
2. **Scoring design by eye** — Saying "it looks good" is not a design review. Run `designlang score` and attach the grade to the PR.
3. **Hardcoding colors during redesign** — Any redesign phase must run extraction first. No exceptions for "minor tweaks."
4. **Letting design tokens drift without a watch job** — `DESIGN_WATCH_MODE` must be configured before launch. Drift without detection is technical debt.

---

## CLONE_MODE Verification Protocol

After completing each phase, run the visual QA gate:

```bash
# After Phase 1 (Landing Page)
designlang brands surferseo.com seo-ai-regent.vercel.app --section landing

# After Phase 3 (Content Editor)
designlang brands app.surferseo.com app.seo-ai-regent.io --section editor

# Before launch (Full comparison)
designlang brands surferseo.com clearscope.io app.seo-ai-regent.io
```

**Pass criteria:** SEO AI Regent must score ≥ B in all 7 categories. If any category diverges more than one letter grade below Surfer's score, the phase fails visual QA. Fix before merging.

---

## Success Metrics

| Metric | Target | Surfer Benchmark |
|---|---|---|
| Content Score ↔ Google rankings correlation | ≥ 0.20 | 0.28 (claimed) |
| Editor real-time scoring latency | < 200ms | ~300ms |
| SERP analysis end-to-end | < 10s | ~8s |
| Free → Starter conversion rate | ≥ 5% | — |
| Monthly churn | < 5% | — |
| Design score (pre-launch) | ≥ B (all 7 categories) | B overall |
| Landing page conversion | ≥ 3% | — |

---

## What "Done" Looks Like

- [ ] User enters keyword → top 10 SERP results analyzed in < 10s
- [ ] Content Editor shows real-time 0–100 score updating as user types (< 200ms)
- [ ] NLP Terms panel: required / recommended / optional with live checkmarks
- [ ] Score breakdown panel: every signal visible with its contribution percentage
- [ ] GEO Score shows AI search visibility alongside Google Content Score
- [ ] Audit accepts any URL + keyword → full scored report with prioritized suggestions
- [ ] Free tier functional: 3 articles + 3 audits with real scores
- [ ] Stripe billing live with plan enforcement
- [ ] Landing page converts ≥ 3% of visitors
- [ ] `designlang score app.seo-ai-regent.io` returns ≥ B in all categories
- [ ] `DESIGN_WATCH_MODE` watch job configured and running
- [ ] Deployed on Railway, PostgreSQL on TrueNAS

