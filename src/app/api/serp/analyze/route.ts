import { NextResponse } from "next/server";

import { recordRouteCacheEvent } from "@/lib/observability/cache-metrics";
import { persistKeywordSnapshot, readKeywordSnapshot } from "@/lib/keywords/snapshots";
import { getCachedSerp, setCachedSerp } from "@/lib/serp/cache";
import { analyzeKeyword } from "@/lib/serp/serper";
import { enforceRateLimit } from "@/lib/http/rate-limit";

const MAX_KEYWORD_LENGTH = 256;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "serp-analyze",
    limit: 20,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { keyword?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";

  if (!keyword) {
    return NextResponse.json(
      {
        error: "keyword is required. Provide a keyword to analyze the SERP surface.",
      },
      { status: 400 },
    );
  }

  if (keyword.length > MAX_KEYWORD_LENGTH) {
    return NextResponse.json(
      {
        error: `keyword exceeds maximum length of ${MAX_KEYWORD_LENGTH} characters.`,
      },
      { status: 413 },
    );
  }

  const cached = getCachedSerp<Awaited<ReturnType<typeof analyzeKeyword>>>(keyword);

  if (cached) {
    const snapshot = await persistKeywordSnapshot(cached.value, {
      source: "memory-cache",
    });
    await recordRouteCacheEvent("serpAnalyze", {
      source: "memory-cache",
      recomputeReason: null,
    });

    return NextResponse.json({
      ...cached.value,
      cache: {
        status: "hit",
        cachedAt: cached.cachedAt,
      },
      snapshot,
      observability: {
        source: "memory-cache",
        recomputeReason: null,
      },
    });
  }

  const persistedSnapshot = await readKeywordSnapshot(keyword);

  if (persistedSnapshot.status === "hit") {
    setCachedSerp(keyword, persistedSnapshot.research);
    await recordRouteCacheEvent("serpAnalyze", {
      source: "persisted-keyword-snapshot",
      recomputeReason: null,
    });

    return NextResponse.json({
      ...persistedSnapshot.research,
      cache: {
        status: "snapshot",
        cachedAt: null,
      },
      snapshot: {
        persisted: true,
        snapshotId: persistedSnapshot.snapshotId,
        policy: persistedSnapshot.policy,
        provenance: persistedSnapshot.provenance,
      },
      observability: {
        source: "persisted-keyword-snapshot",
        recomputeReason: null,
      },
    });
  }

  const research = await analyzeKeyword(keyword);
  setCachedSerp(keyword, research);
  const snapshot = await persistKeywordSnapshot(research, {
    source: "fresh-analysis",
  });
  const recomputeReason =
    persistedSnapshot.status === "invalid" ? persistedSnapshot.reason : "miss";
  await recordRouteCacheEvent("serpAnalyze", {
    source: "fresh-analysis",
    recomputeReason,
  });

  return NextResponse.json({
    ...research,
    cache: {
      status: "miss",
      cachedAt: null,
    },
    snapshot,
    observability: {
      source: "fresh-analysis",
      recomputeReason,
    },
  });
}
