import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  generateLinkSuggestions,
  type ContentNode,
} from "@/lib/internal-links/suggestion-engine";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, articleId, content } = body as {
      workspaceId: string;
      articleId: string;
      content: ContentNode;
    };

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }
    const { authenticated } = access;

    if (!articleId || !content) {
      return NextResponse.json(
        { error: "articleId and content are required" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const sourceArticle = await prisma.article.findFirst({
      where: { id: articleId, userId: authenticated.user.id },
      select: { id: true },
    });

    if (!sourceArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: authenticated.user.id },
      select: {
        id: true,
        title: true,
        keyword: true,
        contentScore: true,
      },
    });

    const suggestions = generateLinkSuggestions(content, articles, articleId);

    const created = await Promise.all(
      suggestions.map((s) =>
        prisma.internalLinkSuggestion.create({
          data: {
            workspaceId,
            sourceId: s.sourceId,
            sourceType: "article",
            targetId: s.targetId,
            targetType: "article",
            anchorText: s.anchorText,
            rationale: s.rationale,
            confidence: s.confidence,
            context: s.context || null,
            scoreImpact: s.scoreImpact || null,
          },
        })
      )
    );

    return NextResponse.json({
      suggestions: created,
      count: created.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
