import { NextResponse } from "next/server";

import { explainScore } from "@/lib/scoring/explain-score";
import { scoreGeo } from "@/lib/scoring/geo-score";
import { enforceRateLimit } from "@/lib/http/rate-limit";

const MAX_CONTENT_LENGTH = 50_000;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "score-geo",
    limit: 30,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { content?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json(
      {
        error: "content is required. Provide content to score for GEO performance.",
      },
      { status: 400 },
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

  const { score: geoScore, citability } = scoreGeo(content);

  return NextResponse.json({
    geoScore,
    geoBreakdown: explainScore(geoScore),
    citability,
  });
}
