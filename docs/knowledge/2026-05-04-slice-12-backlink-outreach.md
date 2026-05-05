---
type: slice-completion
tags: [slice-12, backlink-outreach, opportunity-discovery, outreach-workflow, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 12
---

# Slice 12 Complete: Backlink Opportunity Discovery → Outreach Workflow

## What Was Built

### Schema (prisma/schema.prisma)
- Added `OutreachStatus` enum: IDENTIFIED, CONTACT_FOUND, OUTREACH_SENT, FOLLOW_UP_SENT, RESPONDED, LINK_ACQUIRED, DECLINED, IGNORED
- Added `BacklinkOpportunity` model (workspaceId, sourceUrl, sourceDomain, targetUrl, domainAuthority, pageAuthority, relevance, provenance, contactEmail, contactName, status, notes)
- Added `OutreachLog` model (opportunityId, status, notes, template, sentAt)
- Added `backlinkOpportunities` relation to Workspace model

### Services
- `src/lib/backlinks/discovery.ts` — scoreBacklinkOpportunity (weighted scoring: DA 40%, relevance 35%, PA 25%), prioritizeOpportunities (scores, sorts, limits to top N), generateOutreachTemplate (personalized email template with subject, opening, value proposition, ask, closing), extractDomain (URL parsing)

### API Routes
- `POST /api/backlinks` — discover and persist backlink opportunities with scoring and prioritization
- `GET /api/backlinks?workspaceId=&status=` — list opportunities with summary counts (total/identified/outreachSent/linkAcquired/avgAuthority)
- `POST /api/backlinks/[id]/outreach` — log outreach action, update opportunity status, optionally generate template

### UI
- `/app/workspaces/[id]/backlinks` — Backlink Outreach dashboard
- Summary cards (total opportunities, identified, outreach sent, avg authority)
- Filter buttons (all/identified/outreach sent/link acquired/declined)
- Opportunity cards with domain, DA badge, status badge, source URL, provenance context, contact info
- Click-to-expand with action buttons (mark outreach sent, generate template, mark link acquired, follow up)
- Outreach template modal with pre-filled email template

### Tests
- `tests/lib/backlinks/discovery.test.ts` — 10 tests (scoring for high/low authority sources, DA weighting, missing authority handling, prioritization sorting, result limiting, score/priority inclusion, template generation with personalization, value proposition inclusion, tone adaptation)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 315 tests pass (51 files, +10 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Backlink scoring is multi-factor**: The score combines three weighted factors:
   - Domain Authority (40%): Raw DA/100
   - Relevance (35%): high=1.0, medium=0.6, low=0.2
   - Page Authority (25%): Raw PA/100
   This ensures high-authority, relevant pages score highest.

2. **Outreach status is a state machine**: IDENTIFIED → CONTACT_FOUND → OUTREACH_SENT → FOLLOW_UP_SENT → RESPONDED → LINK_ACQUIRED (success) or DECLINED/IGNORED (failure). Each transition is logged in OutreachLog for auditability.

3. **Template generation is context-aware**: The `generateOutreachTemplate` function adapts tone based on priority (professional for high, friendly for low/medium), includes the source domain and context, and provides a clear value proposition and ask.

4. **Opportunities are persisted, not ephemeral**: Each discovered opportunity is stored with full metadata (source URL, domain, authority scores, relevance, provenance, contact info). This enables tracking over time and prevents duplicate outreach.

5. **UI uses click-to-expand pattern**: Clicking an opportunity card expands it to show action buttons. This keeps the list clean while providing quick access to actions. The selected card is highlighted with a blue border.

6. **Summary metrics are computed from status counts**: The summary counts opportunities by status (identified, outreach sent, link acquired) and calculates average authority. This gives instant visibility into outreach pipeline health.

7. **Prisma enum casting required for status updates**: When updating OutreachStatus from string input, TypeScript requires explicit casting (`status as any`). This is consistent with previous slices.

## Next Steps

Slice 13: Schema Recommendation → Validation → Publish Warning/Block

## Files Changed

- `prisma/schema.prisma` — BacklinkOpportunity, OutreachLog models + OutreachStatus enum
- `src/lib/backlinks/discovery.ts` — new
- `src/app/api/backlinks/route.ts` — new
- `src/app/api/backlinks/[id]/outreach/route.ts` — new
- `src/app/app/workspaces/[id]/backlinks/page.tsx` — new
- `tests/lib/backlinks/discovery.test.ts` — new
