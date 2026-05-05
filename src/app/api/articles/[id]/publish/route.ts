import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { validatePublishGate, buildPublishPayload, formatArticleForCms } from "@/lib/publishing/service";

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
    const body = await request.json();

    if (!body.cmsConnectionId) {
      return NextResponse.json(
        { error: "cmsConnectionId is required" },
        { status: 400 },
      );
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.userId !== authenticated.user.id) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const cmsConnection = await prisma.cmsConnection.findUnique({
      where: { id: body.cmsConnectionId },
      include: { workspace: true },
    });

    if (!cmsConnection || !cmsConnection.workspace || cmsConnection.workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "CMS connection not found" }, { status: 404 });
    }

    const gateResult = validatePublishGate({
      contentScore: article.contentScore,
      geoScore: article.geoScore,
      publishEligible: article.publishEligible,
    });

    if (!gateResult.allowed) {
      return NextResponse.json(
        {
          error: "Publish blocked by review gate",
          reason: gateResult.blockReason,
          contentScore: article.contentScore,
          geoScore: article.geoScore,
        },
        { status: 403 },
      );
    }

    const credentials = JSON.parse(
      Buffer.from(cmsConnection.encryptedCredentials as string, "base64").toString(),
    );

    const htmlContent = formatArticleForCms(cmsConnection.platform, article.content as any);

    const payload = buildPublishPayload(cmsConnection.platform, {
      title: article.title,
      content: htmlContent,
      metaTitle: article.title,
      metaDescription: `Article about ${article.keyword}`,
      keyword: article.keyword,
    });

    const publishingJob = await prisma.publishingJob.create({
      data: {
        articleId,
        cmsConnectionId: body.cmsConnectionId,
        status: body.action === "preview" ? "PREVIEW" : "DRAFT",
      },
    });

    return NextResponse.json({
      publishingJob,
      payload,
      gateResult,
      message: body.action === "preview"
        ? "Preview generated. Article is ready for review."
        : "Article saved as draft on CMS.",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to publish article" },
      { status: 500 },
    );
  }
}
