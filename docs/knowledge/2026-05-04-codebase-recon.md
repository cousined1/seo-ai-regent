---
type: recon
tags: [architecture, codebase-inventory, scoring-engine, prisma, nextjs]
confidence: HIGH
created: 2026-05-04
source: CODEX-BUILD-PROMPT.md §BEGIN — repo reconstruction
---

# Recon: SEO AI Regent Codebase Inventory

## Summary

SEO AI Regent is a Next.js 15 App Router application with a working scoring engine, TipTap editor, auth system, and Stripe billing. The core moat (content scoring + GEO scoring + ExplainScore) is production-ready. The automation platform layer (workspaces, keyword clustering, CMS publishing, rank tracking, citations, audits) does not exist yet.

## Architecture Map

### Scoring Engine (src/lib/scoring/)
- **content-score.ts**: 7-signal weighted scoring (termFrequency 0.2, entityCoverage 0.16, headingStructure 0.14, wordCount 0.1, readability 0.12, internalLinks 0.1, geoSignals 0.18)
- **geo-score.ts**: 5-signal weighted scoring (entityAuthority 0.22, factualDensity 0.24, answerFormat 0.2, sourceCredibility 0.18, freshness 0.16)
- **citability.ts**: Passage-level citability analysis (answerBlockQuality, selfContainment, structuralReadability, statisticalDensity, uniquenessSignals) — 306 lines, most complex module
- **explain-score.ts**: Produces ScoreBreakdownItem[] with contribution and status
- **top-actions.ts**: Derives top 3 improvement actions ranked by potential lift
- **weights.ts**: Single source of truth for contentWeights and geoWeights

### Data Model (prisma/schema.prisma)
- 7 models: User, Article, Audit, Keyword, ScoreSnapshot, PasswordResetToken, StripeWebhookEvent, RateLimitWindow
- 3 enums: Plan (FREE/EDITOR/EDITORIAL/SYNDICATE), UserRole (MEMBER/ADMIN), ArticleStatus (DRAFT/READY/PUBLISHED)
- All data is User-scoped — no Workspace or Organization model

### Auth (src/lib/auth/)
- HMAC-signed session cookies with crypto.subtle
- CSRF protection, TOTP MFA, password reset flow
- Middleware protects /app and /account routes

### Billing (src/lib/billing/)
- Stripe integration with 3 plans
- Webhook event deduplication via StripeWebhookEvent model

### SERP (src/lib/serp/)
- serper.ts returns heuristic/synthetic results — no real Serper.dev API calls
- cache.ts for result caching

### Editor (src/components/editor/)
- TipTap-based with starter kit
- Editor shell, focus mode toggle
- Demo workspace loads at /app/editor

### Tests
- 6 scoring test files (action-impact, citability, explain-score, inline-guidance, score-movement, top-actions)
- No API route tests, no E2E tests

## Key Findings

1. **Scoring engine is solid** — well-structured, test-covered, with explainability built in
2. **No Workspace concept** — all data tied to User. This is the #1 architectural gap
3. **Serper.dev not integrated** — keyword discovery returns synthetic data
4. **No background jobs** — rank tracking, citation checks, audits need scheduling
5. **No CMS connectors** — publishing flow is entirely missing
6. **Design tokens extracted** — competitor tokens available in design/tokens/extracted/

## Risks for Slice 1

- Adding Workspace model requires migrating Article and Keyword relations from User to Workspace
- Need to handle existing data during migration (dual-write or feature flag)
- Serper.dev API key management — must not expose in frontend

## Dependencies Needed for Slice 1

- None beyond existing stack — Serper.dev API key via env var
