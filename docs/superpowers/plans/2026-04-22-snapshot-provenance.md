# Snapshot Provenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add persisted provenance metadata to keyword and score snapshots, surface it on valid snapshot hits, and preserve backward compatibility with older stored rows.

**Architecture:** Keep provenance inside the existing JSON `meta` payloads for `keyword.serpData` and `scoreSnapshot.resultData`. Snapshot readers remain responsible for policy checks and now also normalize optional provenance for route consumers. The routes only expose the new snapshot metadata; canonical scoring payloads remain unchanged.

**Tech Stack:** Next.js App Router, TypeScript, Prisma JSON persistence, Vitest

---

## File Map

- Modify: `src/lib/keywords/snapshots.ts`
  - Add keyword provenance types, write metadata into stored keyword snapshots, and expose provenance on reads.
- Modify: `src/lib/analysis/snapshots.ts`
  - Add score provenance types, write metadata into stored score snapshots, and expose provenance on reads.
- Modify: `src/app/api/serp/analyze/route.ts`
  - Pass write provenance into keyword snapshot persistence and expose persisted provenance on snapshot hits.
- Modify: `src/app/api/score/content/route.ts`
  - Pass write provenance into score snapshot persistence and expose persisted provenance on snapshot hits.
- Modify: `tests/api/keyword-snapshots.test.ts`
  - Add red/green coverage for keyword snapshot provenance writes and reads.
- Modify: `tests/api/content-analysis-snapshots.test.ts`
  - Add red/green coverage for score snapshot provenance writes and reads, including backward compatibility.
- Modify: `tests/api/serp-analyze.test.ts`
  - Add route contract coverage for keyword snapshot provenance.
- Modify: `tests/api/score-content.test.ts`
  - Add route contract coverage for score snapshot provenance.
- Create: `docs/knowledge/2026-04-22-snapshot-provenance.md`
  - Compound artifact capturing what changed and what comes next.

### Task 1: Add Keyword Snapshot Provenance

**Files:**
- Modify: `tests/api/keyword-snapshots.test.ts`
- Modify: `src/lib/keywords/snapshots.ts`

- [ ] **Step 1: Write the failing keyword provenance tests**

```ts
it("writes keyword snapshot provenance into stored metadata", async () => {
  const createMock = vi.fn().mockResolvedValue({ id: "kw_snapshot_123" });
  getPrismaClientMock.mockReturnValue({ keyword: { create: createMock } });
  const { persistKeywordSnapshot } = await import("@/lib/keywords/snapshots");

  await persistKeywordSnapshot(
    {
      keyword: "content optimization strategies",
      topResults: [],
      terms: { required: [], recommended: [], optional: [] },
      source: "heuristic",
    },
    { source: "fresh-analysis" },
  );

  expect(createMock).toHaveBeenCalledWith({
    data: {
      query: "content optimization strategies",
      serpData: {
        meta: expect.objectContaining({
          version: "keyword-v1",
          source: "fresh-analysis",
          computedAt: expect.any(String),
        }),
      },
    },
    select: { id: true },
  });
});

it("returns keyword snapshot provenance on valid reads when present", async () => {
  getPrismaClientMock.mockReturnValue({
    keyword: {
      findFirst: vi.fn().mockResolvedValue({
        id: "kw_snapshot_456",
        serpData: {
          meta: {
            storedAt: new Date().toISOString(),
            computedAt: new Date().toISOString(),
            version: "keyword-v1",
            source: "memory-cache",
          },
          keyword: "content optimization strategies",
          topResults: [],
          terms: { required: [], recommended: [], optional: [] },
          source: "heuristic",
        },
      }),
    },
  });
  const { readKeywordSnapshot } = await import("@/lib/keywords/snapshots");

  const result = await readKeywordSnapshot("content optimization strategies");

  expect(result).toMatchObject({
    status: "hit",
    provenance: {
      source: "memory-cache",
      version: "keyword-v1",
    },
  });
});
```

- [ ] **Step 2: Run the keyword snapshot tests to verify they fail**

Run: `npm test -- tests/api/keyword-snapshots.test.ts`
Expected: FAIL because `persistKeywordSnapshot()` does not accept provenance input and reads do not expose provenance yet.

- [ ] **Step 3: Implement the keyword provenance model**

```ts
export interface KeywordSnapshotProvenance {
  computedAt: string;
  source: "fresh-analysis" | "memory-cache";
  version: string;
}

export interface KeywordSnapshotWriteOptions {
  source: KeywordSnapshotProvenance["source"];
  computedAt?: string;
}
```

```ts
function toStoredKeywordResearch(
  research: KeywordResearch,
  options: KeywordSnapshotWriteOptions,
): Prisma.InputJsonObject {
  const computedAt = options.computedAt ?? new Date().toISOString();

  return {
    meta: {
      storedAt: new Date().toISOString(),
      computedAt,
      source: options.source,
      version: KEYWORD_SNAPSHOT_VERSION,
    },
    keyword: research.keyword,
    topResults: research.topResults.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
    })),
    terms: {
      required: [...research.terms.required],
      recommended: [...research.terms.recommended],
      optional: [...research.terms.optional],
    },
    source: research.source,
  };
}
```

```ts
function toKeywordSnapshotProvenance(meta: Record<string, unknown> | null) {
  if (
    !meta ||
    typeof meta.computedAt !== "string" ||
    (meta.source !== "fresh-analysis" && meta.source !== "memory-cache") ||
    typeof meta.version !== "string"
  ) {
    return null;
  }

  return {
    computedAt: meta.computedAt,
    source: meta.source,
    version: meta.version,
  };
}
```

- [ ] **Step 4: Run the keyword snapshot tests to verify they pass**

Run: `npm test -- tests/api/keyword-snapshots.test.ts`
Expected: PASS

### Task 2: Add Score Snapshot Provenance

**Files:**
- Modify: `tests/api/content-analysis-snapshots.test.ts`
- Modify: `src/lib/analysis/snapshots.ts`

- [ ] **Step 1: Write the failing score provenance tests**

```ts
it("writes score snapshot provenance including pipeline metadata", async () => {
  const createMock = vi.fn().mockResolvedValue({ id: "score_snapshot_123" });
  getPrismaClientMock.mockReturnValue({ scoreSnapshot: { create: createMock } });
  const { persistContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");

  await persistContentAnalysisSnapshot(
    {
      keyword: "content optimization strategies",
      content: "short persisted content block",
      contentScore: { overall: 74, termFrequency: 78, entityCoverage: 68, headingStructure: 62, wordCount: 80, readability: 84, internalLinks: 35, geoSignals: 58 },
      geoScore: { overall: 64, entityAuthority: 61, factualDensity: 48, answerFormat: 75, sourceCredibility: 66, freshness: 52 },
      citability: {
        wordCount: 24,
        totalScore: 52,
        grade: "C",
        label: "Moderate Citability",
        breakdown: { answerBlockQuality: 18, selfContainment: 14, structuralReadability: 10, statisticalDensity: 6, uniquenessSignals: 4 },
        preview: "persisted preview",
      },
      contentBreakdown: [],
      geoBreakdown: [],
      terms: { required: [], recommended: [], optional: [] },
      topActions: [],
    },
    {
      source: "fresh-analysis",
      keywordSnapshot: {
        snapshotId: "kw_snapshot_456",
        computedAt: "2026-04-22T12:00:00.000Z",
        version: "keyword-v1",
        source: "memory-cache",
      },
    },
  );

  expect(createMock).toHaveBeenCalledWith({
    data: {
      keyword: "content optimization strategies",
      contentHash: expect.any(String),
      resultData: {
        meta: expect.objectContaining({
          source: "fresh-analysis",
          version: "analysis-v1",
          computedAt: expect.any(String),
          pipeline: {
            analysisVersion: "analysis-v1",
            keywordVersion: "keyword-v1",
          },
          keywordSnapshot: {
            snapshotId: "kw_snapshot_456",
            computedAt: "2026-04-22T12:00:00.000Z",
            version: "keyword-v1",
            source: "memory-cache",
          },
        }),
      },
    },
    select: { id: true },
  });
});

it("returns null provenance for older score snapshot rows", async () => {
  getPrismaClientMock.mockReturnValue({
    scoreSnapshot: {
      findFirst: vi.fn().mockResolvedValue({
        id: "score_snapshot_456",
        resultData: {
          meta: {
            storedAt: new Date().toISOString(),
            version: "analysis-v1",
          },
          keyword: "content optimization strategies",
          contentScore: { overall: 88, termFrequency: 90, entityCoverage: 84, headingStructure: 86, wordCount: 82, readability: 85, internalLinks: 77, geoSignals: 79 },
          geoScore: { overall: 81, entityAuthority: 80, factualDensity: 82, answerFormat: 79, sourceCredibility: 83, freshness: 78 },
          citability: {
            wordCount: 30,
            totalScore: 77,
            grade: "B",
            label: "Good Citability",
            breakdown: { answerBlockQuality: 25, selfContainment: 18, structuralReadability: 15, statisticalDensity: 11, uniquenessSignals: 8 },
            preview: "persisted preview",
          },
          contentBreakdown: [],
          geoBreakdown: [],
          terms: { required: [], recommended: [], optional: [] },
          topActions: [],
        },
      }),
    },
  });
  const { readContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");

  const result = await readContentAnalysisSnapshot(
    "content optimization strategies",
    "short persisted content block",
  );

  expect(result).toMatchObject({
    status: "hit",
    provenance: null,
  });
});
```

- [ ] **Step 2: Run the score snapshot tests to verify they fail**

Run: `npm test -- tests/api/content-analysis-snapshots.test.ts`
Expected: FAIL because score snapshot writes do not include provenance metadata and reads do not expose it.

- [ ] **Step 3: Implement the score provenance model**

```ts
export interface ContentAnalysisSnapshotKeywordProvenance {
  snapshotId: string;
  computedAt: string;
  version: string;
  source: "fresh-analysis" | "memory-cache";
}

export interface ContentAnalysisSnapshotProvenance {
  computedAt: string;
  source: "fresh-analysis";
  version: string;
  pipeline: {
    analysisVersion: string;
    keywordVersion: string;
  };
  keywordSnapshot: ContentAnalysisSnapshotKeywordProvenance | null;
}
```

```ts
function toStoredAnalysis(
  payload: ContentAnalysisSnapshotPayload,
  options: ContentAnalysisSnapshotWriteOptions,
): Prisma.InputJsonObject {
  const computedAt = options.computedAt ?? new Date().toISOString();

  return {
    meta: {
      storedAt: new Date().toISOString(),
      computedAt,
      source: options.source,
      version: ANALYSIS_SNAPSHOT_VERSION,
      pipeline: {
        analysisVersion: ANALYSIS_SNAPSHOT_VERSION,
        keywordVersion: KEYWORD_SNAPSHOT_VERSION,
      },
      keywordSnapshot: options.keywordSnapshot ?? null,
    },
    // existing score payload fields...
  };
}
```

- [ ] **Step 4: Run the score snapshot tests to verify they pass**

Run: `npm test -- tests/api/content-analysis-snapshots.test.ts`
Expected: PASS

### Task 3: Expose Provenance In Route Contracts

**Files:**
- Modify: `tests/api/serp-analyze.test.ts`
- Modify: `tests/api/score-content.test.ts`
- Modify: `src/app/api/serp/analyze/route.ts`
- Modify: `src/app/api/score/content/route.ts`

- [ ] **Step 1: Write the failing route contract tests**

```ts
expect(payload.snapshot.provenance).toEqual({
  computedAt: expect.any(String),
  source: "memory-cache",
  version: "keyword-v1",
});
```

```ts
expect(payload.analysis.provenance).toEqual({
  computedAt: expect.any(String),
  source: "fresh-analysis",
  version: "analysis-v1",
  pipeline: {
    analysisVersion: "analysis-v1",
    keywordVersion: "keyword-v1",
  },
  keywordSnapshot: {
    snapshotId: "kw_snapshot_456",
    computedAt: "2026-04-22T12:00:00.000Z",
    version: "keyword-v1",
    source: "memory-cache",
  },
});
```

- [ ] **Step 2: Run the route tests to verify they fail**

Run: `npm test -- tests/api/serp-analyze.test.ts tests/api/score-content.test.ts`
Expected: FAIL because the routes do not pass write provenance into persistence and do not expose stored provenance on hits.

- [ ] **Step 3: Implement route plumbing**

```ts
const snapshot = await persistKeywordSnapshot(research, {
  source: cached ? "memory-cache" : "fresh-analysis",
});
```

```ts
snapshot: {
  persisted: true,
  snapshotId: persistedSnapshot.snapshotId,
  policy: persistedSnapshot.policy,
  provenance: persistedSnapshot.provenance,
},
```

```ts
const analysis = await persistContentAnalysisSnapshot(
  {
    keyword,
    content,
    contentScore,
    geoScore,
    citability,
    contentBreakdown,
    geoBreakdown,
    terms: serpResearch.terms,
    topActions,
  },
  {
    source: "fresh-analysis",
    keywordSnapshot:
      storedKeywordSnapshot?.status === "hit" && storedKeywordSnapshot.provenance
        ? {
            snapshotId: storedKeywordSnapshot.snapshotId,
            computedAt: storedKeywordSnapshot.provenance.computedAt,
            version: storedKeywordSnapshot.provenance.version,
            source: storedKeywordSnapshot.provenance.source,
          }
        : null,
  },
);
```

- [ ] **Step 4: Run the route tests to verify they pass**

Run: `npm test -- tests/api/serp-analyze.test.ts tests/api/score-content.test.ts`
Expected: PASS

### Task 4: Verify And Compound

**Files:**
- Create: `docs/knowledge/2026-04-22-snapshot-provenance.md`

- [ ] **Step 1: Run the focused provenance tests**

Run: `npm test -- tests/api/keyword-snapshots.test.ts tests/api/content-analysis-snapshots.test.ts tests/api/serp-analyze.test.ts tests/api/score-content.test.ts`
Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: PASS with Next.js build success

- [ ] **Step 4: Write the compound artifact**

```md
---
type: implementation
tags:
  - seo-ai-regent
  - snapshots
  - provenance
  - persistence
confidence: high
created: 2026-04-22
source: local-test-and-build
---
```

Include:

- what changed
- why it matters
- verification commands and results
- the next likely backend slice after provenance
