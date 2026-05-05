---
type: slice-completion
tags: [slice-6, technical-audit, crawl, issue-detection, recrawl, vertical-slice]
confidence: HIGH
created: 2026-05-04
source: docs/plans/seo-ai-regent-automation-build.md §Slice 6
---

# Slice 6 Complete: Technical Audit Crawl → Persisted Issue → Recrawl Verification

## What Was Built

### Schema (prisma/schema.prisma)
- Added `IssueSeverity` enum: CRITICAL, HIGH, MEDIUM, LOW
- Added `IssueState` enum: OPEN, IGNORED, FIXED, REGRESSED
- Added `AuditRun` model (siteId, status, urlCount, issueCount, startedAt, completedAt, error)
- Added `TechnicalSeoIssue` model (auditRunId, url, type, severity, state, title, description, suggestion, firstSeen, lastSeen, resolvedAt)
- Added `auditRuns` relation to Site model

### Services
- `src/lib/audit/service.ts` — runAuditCrawl (concurrent URL crawler with timeout), detectTechnicalIssues (6 detectors: broken_link, missing_title, missing_description, slow_page, missing_h1, duplicate_title), verifyRecrawl (re-crawls URL, compares against previous issues, returns fixed/regressed/stillOpen/newIssues)

### API Routes
- `POST /api/audit/run` — start audit crawl, creates AuditRun, crawls URLs, detects issues, persists TechnicalSeoIssues
- `GET /api/audit/issues?siteId=&severity=&state=` — list issues with summary counts
- `PATCH /api/audit/issues` — update issue state (OPEN, IGNORED, FIXED)
- `POST /api/audit/recrawl` — verify fix for specific URL, updates issue states based on recrawl results

### UI
- `/app/workspaces/[id]/settings/audit` — Technical SEO Audit dashboard
- AuditDashboardPage — URL input textarea, run audit button, summary cards (total/critical/open/fixed), issue list with severity/state badges, filter buttons, verify fix/ignore/reopen actions

### Tests
- `tests/lib/audit/service.test.ts` — 12 tests (crawl results, network error handling, 6 issue detectors, recrawl verification for fixed/regressed/stillOpen scenarios)

## Verification Results

| Gate | Result |
|------|--------|
| `tsc --noEmit` | 0 errors |
| `npm test` | 239 tests pass (45 files, +12 new) |
| `npm audit --audit-level=high` | 0 HIGH/CRITICAL |

## Key Learnings

1. **Crawl concurrency matters**: The `runAuditCrawl` function chunks URLs and processes them in parallel (default 5 concurrent). This prevents overwhelming target servers while keeping audit time reasonable. Production should add rate limiting and respect robots.txt.

2. **Issue detection is rule-based, not AI-powered**: The 6 detectors (broken links, missing titles, missing descriptions, slow pages, missing H1s, duplicate titles) are simple HTML parsing rules. This is intentional — technical SEO issues are deterministic and don't need LLM inference. The system is designed to be fast and reliable.

3. **Recrawl verification compares state, not just re-runs**: The `verifyRecrawl` function re-crawls the URL, runs the same detectors, and compares the new issue set against the previous issues. This produces 4 categories: fixed (was there, now gone), regressed (wasn't there, now is), stillOpen (still present), newIssues (brand new). This gives users clear feedback on whether their fixes worked.

4. **Issue state machine is simple but effective**: OPEN → FIXED (verified by recrawl) or IGNORED (user dismisses). REGRESSED is auto-set when a previously fixed issue reappears. The `resolvedAt` timestamp tracks when issues were closed.

5. **Prisma null checks are required**: `getPrismaClient()` can return null. All API routes now check `if (!prisma)` before using it. This was a TypeScript error that caught a potential runtime issue.

6. **Enum casting needed for Prisma updates**: When updating enum fields from string input, TypeScript requires explicit casting (`state as IssueState`). Prisma's generated types are strict about enum values.

## Next Steps

Slice 7: Content Gap Analysis → Brief Generation → Scoring Target

## Files Changed

- `prisma/schema.prisma` — AuditRun, TechnicalSeoIssue models + IssueSeverity, IssueState enums
- `src/lib/audit/service.ts` — new
- `src/app/api/audit/run/route.ts` — new
- `src/app/api/audit/issues/route.ts` — new
- `src/app/api/audit/recrawl/route.ts` — new
- `src/app/app/workspaces/[id]/settings/audit/page.tsx` — new
- `tests/lib/audit/service.test.ts` — new
