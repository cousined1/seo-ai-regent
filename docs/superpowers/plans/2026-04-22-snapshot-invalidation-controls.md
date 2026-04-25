# Snapshot Invalidation Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one guarded debug route that can invalidate persisted snapshot rows without widening into general admin tooling.

**Architecture:** Reuse the existing debug access wrapper and keep invalidation logic in a small helper under `src/lib/debug/`. The route accepts a keyword and optionally content: keyword-only requests purge all persisted keyword and score snapshots for that keyword, while content-scoped requests purge only the matching score snapshot payload for that keyword/content pair.

**Tech Stack:** Next.js App Router, Prisma client boundary, Vitest

---

### Task 1: Add the failing route contract test

**Files:**
- Create: `tests/api/debug-snapshot-invalidation.test.ts`
- Modify: `tests/api/debug-manifest.test.ts`

- [x] **Step 1: Write the failing route tests**
- [x] **Step 2: Run the targeted test command and confirm the new assertions fail for the missing route/contract**

### Task 2: Implement the guarded invalidation slice

**Files:**
- Create: `src/app/api/debug/snapshots/invalidate/route.ts`
- Create: `src/lib/debug/snapshot-invalidation.ts`
- Modify: `src/lib/debug/manifest.ts`

- [x] **Step 1: Add a route-owned manifest contract for the new debug surface**
- [x] **Step 2: Add a helper that deletes keyword snapshots by normalized query and score snapshots by keyword or exact content hash**
- [x] **Step 3: Add the route handler with shared debug access, input validation, and stable JSON output**

### Task 3: Verify and compound

**Files:**
- Create: `docs/knowledge/2026-04-22-snapshot-invalidation-controls.md`

- [x] **Step 1: Run targeted debug snapshot tests**
- [x] **Step 2: Run the full test suite**
- [x] **Step 3: Run `npm run build`**
- [x] **Step 4: Add the compound artifact under `docs/knowledge/`**
