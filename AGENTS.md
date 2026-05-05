# AGENTS.md — SEO AI Regent

> **Product**: SEO AI Regent — scoring-first SEO operating system
> **Domain**: seo-ai-regent.com
> **Stack**: Next.js 15 App Router + TypeScript + Prisma + PostgreSQL + TipTap
> **Deployment**: Vercel (frontend) + Railway (PostgreSQL)
> **Backend service**: InsForge

## HOW TO PICK UP THIS REPO

1. Read `CONTEXT.md` — adopt its exact domain vocabulary. Do not invent synonyms.
2. If `graphify-out/GRAPH_REPORT.md` exists, read it before grepping raw files.
3. This repo follows **GODMYTHOS v10** doctrine. Re-read the skill at session start.
4. The canonical build plan lives at `docs/plans/seo-ai-regent-automation-build.md`.
5. No feature implementation without a failing test or deterministic feedback loop first.

## REPO COMMANDS

```bash
npm install              # install dependencies
npm run dev              # start dev server
npm run build            # prisma generate + next build
npm run typecheck        # tsc --noEmit
npm test                 # vitest run
npm run test:e2e         # playwright test
npm run lint             # next lint (if configured)
npm run format           # prettier --write
npm audit --audit-level=high  # security gate
```

## CI QUALITY GATES (all blocking)

| Gate | Condition |
|------|-----------|
| Compiler clean | `tsc --noEmit` zero errors |
| Test pass | All tests pass, zero flaky |
| Security | `npm audit` no HIGH/CRITICAL |
| Design quality | `designlang score` ≥ B on UI PRs |
| Compound artifact | At least one `docs/knowledge/*.md` per PR |

## HARD RULES

1. No fake execution — run commands, do not simulate output.
2. Compiler validation is ground truth — `tsc --noEmit` must pass.
3. Test before claiming it works — every feature needs verification.
4. No stubs in production paths — `// TODO` banned unless feature-flagged off.
5. Read before write — read files before editing them.
6. One source of truth per concern — no duplication.
7. Security gate for every external dependency — PASS/WARN/BLOCK.
8. No rationalized deprecation bypass — migrate or document deferral.
9. Error surfaces are user interfaces — what failed, why, what next.
10. Design tokens are evidence, not estimates — extract, do not approximate.
11. Compound every cycle — `docs/knowledge/*.md` mandatory per work cycle.
12. Confidence gate before execution — MEDIUM/LARGE scope requires gate.
13. Execution trace for MEDIUM/LARGE WORK phases — structured trace required.
14. Knowledge graph before grep — check `graphify-out/` first on unfamiliar corpus.
15. CONTEXT.md is canonical — update inline when domain terms sharpen.
16. ADR three-test gate — hard-to-reverse, surprising, real trade-off.
17. Tracer-bullet vertical slices — end-to-end, one test at a time, AFK/HITL labeled.
18. Feedback loop before hypothesis — deterministic failing signal before debugging.

## PRODUCT CONSTRAINTS

- Never auto-publish articles below 70/100 content score.
- Every article must pass through the scoring engine before publish.
- The product is "SEO AI Regent" — never "RankForge" or any other name.
- No emoji in landing page or dashboard UI.
- Transparency over black-box UX — every score must explain why.
- No dead buttons, no mock dashboards, no placeholder metrics in production.

## VOCABULARY

All domain terms are defined in `CONTEXT.md`. Use those terms in:
- Code identifiers where natural
- Test names
- Issue titles
- PR descriptions
- ADRs
- Knowledge artifacts

Do not introduce synonyms. If a term needs sharpening, update `CONTEXT.md` inline.
