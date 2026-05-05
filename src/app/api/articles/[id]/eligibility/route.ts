import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { checkPublishEligibility } from "@/lib/articles/scoring-pipeline";

export async function GET(
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

    const eligibility = checkPublishEligibility({
      contentScore: article.contentScore,
      geoScore: article.geoScore,
    });

    return NextResponse.json({
      articleId: article.id,
      contentScore: article.contentScore,
      geoScore: article.geoScore,
      publishEligible: article.publishEligible,
      eligibility,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check eligibility" },
      { status: 500 },
    );
  }
}
