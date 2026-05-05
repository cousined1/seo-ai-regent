---
type: slice-completion
tags: [slice-4, article-generation, scoring-pipeline, review-gate, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 4
---

# Slice 4 Complete: Article Generation → Score → Review Gate

## What Was Built

### Schema (prisma/schema.prisma)
- Added `publishEligible` boolean field to Article (default false)
- Added `briefId` optional field to Article with relation to ContentBrief
- Added `articles` relation to ContentBrief model
- Added indexes on `briefId` and `publishEligible`

### Services
- `src/lib/articles/scoring-pipeline.ts` — generateArticleContent (template-based TipTap JSON generation for pillar, listicle, how-to, comparison, faq), checkPublishEligibility (both scores >= 70), evaluateReviewGate (pass/review/block status with blocked actions and improvements), scoreArticle (full scoring pipeline combining content + GEO scoring with explainability and top actions)

### API Routes
- `POST /api/articles/generate` — generate article from keyword + template, auto-score, persist with eligibility
- `POST /api/articles/:id/score` — re-score existing article, update publishEligible
- `GET /api/articles/:id/eligibility` — check publish eligibility status

### UI
- `/app/workspaces/[id]/articles/new` — article generation page
- `ArticleGenerationForm` — keyword input, template selector (5 templates with descriptions), word count slider, generation result with score cards, eligibility status, top actions
- `ReviewGateModal` — modal showing blocked actions, score cards, required improvements, continue editing button

### Tests
- `tests/lib/articles/scoring-pipeline.test.ts` — 14 tests (article generation for all 5 templates, publish eligibility thresholds, review gate evaluation)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 216 tests pass (43 files, +14 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Template-based generation produces TipTap JSON**: The `generateArticleContent` function creates properly structured TipTap JSON documents with heading nodes (attrs: { level: 1/2/3 }) and paragraph nodes. This is directly compatible with the existing TipTap editor — no transformation needed.

2. **Scoring pipeline is fully automatic**: When an article is generated via the API, it goes through the complete scoring pipeline (content + GEO scoring, explainability, top actions, eligibility check) before being persisted. The user sees scores immediately.

3. **Review gate has three states**: `pass` (both scores >= 70, no critical issues), `review` (one score < 70 or critical issues present), `block` (either score < 50). Blocked actions differ by state: block prevents publish + schedule, review prevents publish only.

4. **Publish eligibility is server-enforced**: The `publishEligible` boolean is computed server-side based on the 70/100 threshold. This is stored on the Article model and checked before any publish action. The product constraint "Never auto-publish articles below 70/100" is enforced at the data layer.

5. **TipTap text extraction is recursive**: The `extractTextFromTipTap` function recursively traverses the TipTap JSON tree to extract plain text for scoring. This handles any depth of nested content nodes.

## Next Steps

Slice 5: CMS Connection → Preview → Publish Flow

## Files Changed

- `prisma/schema.prisma` — briefId, publishEligible on Article; articles relation on ContentBrief
- `src/lib/articles/scoring-pipeline.ts` — new
- `src/app/api/articles/generate/route.ts` — new
- `src/app/api/articles/[id]/score/route.ts` — new
- `src/app/api/articles/[id]/eligibility/route.ts` — new
- `src/components/articles/generation-form.tsx` — new
- `src/components/articles/review-gate-modal.tsx` — new
- `src/app/app/workspaces/[id]/articles/new/page.tsx` — new
- `tests/lib/articles/scoring-pipeline.test.ts` — new
