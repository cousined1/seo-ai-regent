---
type: slice-completion
tags: [slice-9, internal-linking, suggestion-engine, editor-integration, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 9
---

# Slice 9 Complete: Internal Link Suggestion → Review → Score-Aware Editor Insertion

## What Was Built

### Schema (prisma/schema.prisma)
- Added `LinkSuggestionStatus` enum: PENDING, ACCEPTED, REJECTED, INSERTED
- Added `InternalLinkSuggestion` model (workspaceId, sourceId, sourceType, targetId, targetType, anchorText, rationale, confidence, context, scoreImpact, status)
- Added `internalLinkSuggestions` relation to Workspace model

### Services
- `src/lib/internal-links/suggestion-engine.ts` — extractKeywordsFromContent (TipTap JSON → keyword phrases using stop word filtering), findLinkTargets (matches extracted keywords against article metadata, excludes current article), calculateConfidence (weighted scoring: match type 40%, keyword relevance 30%, content score 20%, link penalty 10%), generateLinkSuggestions (full pipeline: extract → find targets → calculate confidence → generate suggestions with anchor text, rationale, score impact)

### API Routes
- `POST /api/internal-links/suggest` — generate suggestions for an article, persists InternalLinkSuggestion records
- `GET /api/internal-links?workspaceId=&status=&sourceId=` — list suggestions with summary counts
- `PATCH /api/internal-links/[id]` — update suggestion status (PENDING → ACCEPTED/REJECTED/INSERTED)

### UI
- `src/components/internal-links/suggestion-panel.tsx` — InternalLinkPanel component for editor integration
- Features: generate suggestions button, summary cards (total/pending/accepted/inserted), filter buttons, suggestion cards with confidence badges, score impact indicators, anchor text preview, context snippet, accept/reject buttons

### Tests
- `tests/lib/internal-links/suggestion-engine.test.ts` — 14 tests (keyword extraction from TipTap JSON, empty content handling, nested content extraction, link target matching, self-exclusion, confidence calculation for exact/partial/weak matches, link penalty, suggestion generation, anchor text generation, score impact estimation)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 275 tests pass (48 files, +14 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Keyword extraction uses stop word filtering**: The engine extracts keyword phrases by splitting text on stop words. Consecutive non-stop words form phrases (e.g., "seo tools guide", "keyword research tools"). This is simpler than NLP but effective for internal linking.

2. **Confidence is a weighted composite**: Four factors contribute to confidence:
   - Match type (exact=0.4, partial=0.2) — 40% weight
   - Keyword relevance (0-1 scale) — 30% weight
   - Content score (normalized to 0-1) — 20% weight
   - Link penalty (existing links * 0.02, max 0.2) — 10% weight
   This ensures suggestions are ranked by quality, not just keyword overlap.

3. **Anchor text generation uses context**: The engine finds the sentence containing the matched keyword and extracts surrounding words as anchor text. This produces natural-sounding anchors rather than just the keyword itself.

4. **Score impact is estimated, not measured**: The `estimateScoreImpact` function calculates a rough estimate (confidence * 5 + quality bonus). This gives users a preview of potential benefit without requiring actual score recalculation.

5. **Suggestions are persisted, not ephemeral**: Each suggestion is stored in the database with status tracking. This allows users to review suggestions over time and prevents re-suggesting the same links.

6. **Self-exclusion is critical**: The `findLinkTargets` function excludes the current article from targets. Without this, the engine would suggest linking an article to itself.

7. **Prisma enum casting required**: When updating enum fields from string input, TypeScript requires explicit casting (`status as LinkSuggestionStatus`). This is consistent with previous slices.

## Next Steps

Slice 10: Rank Tracking → Persistence → Trend UI

## Files Changed

- `prisma/schema.prisma` — InternalLinkSuggestion model + LinkSuggestionStatus enum
- `src/lib/internal-links/suggestion-engine.ts` — new
- `src/app/api/internal-links/route.ts` — new
- `src/app/api/internal-links/suggest/route.ts` — new
- `src/app/api/internal-links/[id]/route.ts` — new
- `src/components/internal-links/suggestion-panel.tsx` — new
- `tests/lib/internal-links/suggestion-engine.test.ts` — new
