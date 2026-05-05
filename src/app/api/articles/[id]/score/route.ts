import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { scoreArticle, checkPublishEligibility } from "@/lib/articles/scoring-pipeline";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const articleId = (await params).id;

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== authenticated.user.id) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const scoringResult = scoreArticle(article.keyword, article.content as any);
    const eligibility = checkPublishEligibility({
      contentScore: Math.round(scoringResult.contentScore.overall),
      geoScore: Math.round(scoringResult.geoScore.overall),
    });

    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        contentScore: Math.round(scoringResult.contentScore.overall),
        geoScore: Math.round(scoringResult.geoScore.overall),
        readability: scoringResult.contentScore.readability,
        scoreBreakdown: JSON.parse(JSON.stringify({
          content: scoringResult.contentScore,
          geo: scoringResult.geoScore,
          breakdown: scoringResult.breakdown,
          topActions: scoringResult.topActions,
        })),
        publishEligible: eligibility.eligible,
      },
    });

    return NextResponse.json({
      article: updated,
      scoring: {
        contentScore: scoringResult.contentScore,
        geoScore: scoringResult.geoScore,
        breakdown: scoringResult.breakdown,
        topActions: scoringResult.topActions,
      },
      eligibility,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to score article" },
      { status: 500 },
    );
  }
}
