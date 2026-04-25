# Debug Manifest Contracts Slice

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` and keep contract metadata lightweight and stable.

**Goal:** Add machine-readable contract metadata to debug manifest entries so tooling can detect route drift without parsing prose.

**Why this slice exists:** The debug manifest currently exposes route summaries and top-level response fields, but no versioned contract surface. That is readable for humans and weak for machines.

**Scope:** `src/lib/debug/manifest.ts`, targeted tests, and a compound artifact.

## Task 1: Red tests

**Files:**
- Modify: `tests/api/debug-manifest.test.ts`

- [ ] Verify each manifest entry exposes `contractVersion`
- [ ] Verify each manifest entry exposes a top-level `responseSchema` map
- [ ] Keep the schema hints shallow and route-specific

## Task 2: Implement contract metadata

**Files:**
- Modify: `src/lib/debug/manifest.ts`

- [ ] Add a stable `contractVersion` per debug route
- [ ] Add a machine-readable `responseSchema` shape per route
- [ ] Preserve existing summary and response field lists

## Task 3: Verify and compound

- [ ] Run targeted manifest tests
- [ ] Run the full test suite
- [ ] Run `npm run build`
- [ ] Add a compound artifact under `docs/knowledge/`
