import { NextResponse } from "next/server";

import {
  persistContentAnalysisSnapshot,
  readContentAnalysisSnapshot,
} from "@/lib/analysis/snapshots";
import { readKeywordSnapshot } from "@/lib/keywords/snapshots";
import { recordRouteCacheEvent } from "@/lib/observability/cache-metrics";
import { explainScore } from "@/lib/scoring/explain-score";
import { scoreContent } from "@/lib/scoring/content-score";
import { scoreGeo } from "@/lib/scoring/geo-score";
import { deriveTopActions } from "@/lib/scoring/top-actions";
import { getCachedSerp, setCachedSerp } from "@/lib/serp/cache";
import { analyzeKeyword } from "@/lib/serp/serper";
import { enforceRateLimit } from "@/lib/http/rate-limit";

const MAX_KEYWORD_LENGTH = 256;
const MAX_CONTENT_LENGTH = 50_000;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "score-content",
    limit: 30,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { keyword?: unknown; content?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!keyword || !content) {
    return NextResponse.json(
      {
        error: "keyword and content are required",
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

  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      {
        error: `content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters.`,
      },
      { status: 413 },
    );
  }

  const storedAnalysis = await readContentAnalysisSnapshot(keyword, content);

  if (storedAnalysis.status === "hit") {
    await recordRouteCacheEvent("scoreContent", {
      source: "persisted-score-snapshot",
      recomputeReason: null,
    });

    return NextResponse.json({
      keyword: storedAnalysis.analysis.keyword,
      contentScore: storedAnalysis.analysis.contentScore,
      geoScore: storedAnalysis.analysis.geoScore,
      citability: storedAnalysis.analysis.citability,
      contentBreakdown: storedAnalysis.analysis.contentBreakdown,
      geoBreakdown: storedAnalysis.analysis.geoBreakdown,
      terms: storedAnalysis.analysis.terms,
      topActions: storedAnalysis.analysis.topActions,
      analysis: {
        persisted: true,
        snapshotId: storedAnalysis.snapshotId,
        policy: storedAnalysis.policy,
        provenance: storedAnalysis.provenance,
      },
      observability: {
        analysisSource: "persisted-score-snapshot",
        keywordSource: null,
        recomputeReason: null,
      },
    });
  }

  const cachedSerp = getCachedSerp<Awaited<ReturnType<typeof analyzeKeyword>>>(keyword);
  const storedKeywordSnapshot = cachedSerp ? null : await readKeywordSnapshot(keyword);
  const serpResearch =
    cachedSerp?.value ??
    (storedKeywordSnapshot?.status === "hit" ? storedKeywordSnapshot.research : null) ??
    (await analyzeKeyword(keyword));

  if (!cachedSerp) {
    setCachedSerp(keyword, serpResearch);
  }

  const { score: geoScore, citability } = scoreGeo(content);
  const contentScore = scoreContent(keyword, content, geoScore.overall);
  const contentBreakdown = explainScore(contentScore);
  const geoBreakdown = explainScore(geoScore);
  const topActions = deriveTopActions({
    content: contentScore,
    geo: geoScore,
  });
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
  const recomputeReason =
    storedAnalysis.status === "invalid" ? storedAnalysis.reason : "miss";
  const keywordSource = cachedSerp
    ? "memory-cache"
    : storedKeywordSnapshot?.status === "hit"
      ? "persisted-keyword-snapshot"
      : "fresh-analysis";
  await recordRouteCacheEvent("scoreContent", {
    source: keywordSource,
    recomputeReason,
  });

  return NextResponse.json({
    keyword,
    contentScore,
    geoScore,
    citability,
    contentBreakdown,
    geoBreakdown,
    terms: serpResearch.terms,
    topActions,
    analysis,
    observability: {
      analysisSource: "fresh-analysis",
      keywordSource,
      recomputeReason,
    },
  });
}
