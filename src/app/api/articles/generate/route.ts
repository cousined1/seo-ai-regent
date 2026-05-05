import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { generateArticleContent, scoreArticle, checkPublishEligibility } from "@/lib/articles/scoring-pipeline";
import type { ArticleTemplate } from "@/lib/articles/scoring-pipeline";

export async function POST(request: Request) {
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

  try {
    const body = await request.json();

    if (!body.keyword || !body.template) {
      return NextResponse.json(
        { error: "keyword and template are required" },
        { status: 400 },
      );
    }

    const template = body.template as ArticleTemplate;
    if (!["pillar", "listicle", "how-to", "comparison", "faq"].includes(template)) {
      return NextResponse.json(
        { error: "Invalid template. Use: pillar, listicle, how-to, comparison, or faq" },
        { status: 400 },
      );
    }

    const content = generateArticleContent({
      keyword: body.keyword,
      template,
      targetWordCount: body.targetWordCount,
    });

    const scoringResult = scoreArticle(body.keyword, content);
    const eligibility = checkPublishEligibility({
      contentScore: Math.round(scoringResult.contentScore.overall),
      geoScore: Math.round(scoringResult.geoScore.overall),
    });

    const textContent = extractTextFromTipTap(content);
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;

    const article = await prisma.article.create({
      data: {
        userId: authenticated.user.id,
        title: body.keyword.charAt(0).toUpperCase() + body.keyword.slice(1),
        content: content as any,
        keyword: body.keyword,
        contentScore: Math.round(scoringResult.contentScore.overall),
        geoScore: Math.round(scoringResult.geoScore.overall),
        wordCount,
        readability: scoringResult.contentScore.readability,
        scoreBreakdown: JSON.parse(JSON.stringify({
          content: scoringResult.contentScore,
          geo: scoringResult.geoScore,
          breakdown: scoringResult.breakdown,
          topActions: scoringResult.topActions,
        })),
        publishEligible: eligibility.eligible,
        briefId: body.briefId ?? null,
      },
    });

    return NextResponse.json({
      article,
      scoring: {
        contentScore: scoringResult.contentScore,
        geoScore: scoringResult.geoScore,
        breakdown: scoringResult.breakdown,
        topActions: scoringResult.topActions,
      },
      eligibility,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to generate article" },
      { status: 500 },
    );
  }
}

function extractTextFromTipTap(node: any): string {
  if (node.text) {
    return node.text;
  }
  if (node.content) {
    return node.content.map(extractTextFromTipTap).join(" ");
  }
  return "";
}
