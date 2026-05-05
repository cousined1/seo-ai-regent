import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  recommendSchemaTypes,
  generateJsonLd,
  validateJsonLd,
} from "@/lib/schema/recommendation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const content = {
      title: article.title,
      headings: [],
      hasFaq: false,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
      author: article.userId || "Unknown",
      publishedDate: article.createdAt.toISOString(),
      description: "",
    };

    const recommendations = recommendSchemaTypes(content);

    const existingRecommendations = await prisma.schemaRecommendation.findMany({
      where: { articleId: id },
    });

    return NextResponse.json({
      recommendations,
      existing: existingRecommendations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schema recommendations" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { schemaType, content } = body as {
      schemaType: string;
      content: {
        title: string;
        headings: string[];
        hasFaq: boolean;
        hasHowTo: boolean;
        hasProduct: boolean;
        hasReview: boolean;
        author: string;
        publishedDate: string;
        url?: string;
        description?: string;
        faqData?: { questions: Array<{ question: string; answer: string }> };
        howtoData?: { steps: Array<{ name: string; text: string }> };
      };
    };

    if (!id || !schemaType || !content) {
      return NextResponse.json(
        { error: "articleId, schemaType, and content are required" },
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

    const jsonLd = generateJsonLd(schemaType, content);
    const validation = validateJsonLd(schemaType, jsonLd as Record<string, unknown>);

    const recommendation = await prisma.schemaRecommendation.create({
      data: {
        articleId: id,
        schemaType: schemaType as any,
        jsonLd: JSON.parse(JSON.stringify(jsonLd)),
        valid: validation.valid,
        errors: validation.errors.length > 0 ? JSON.parse(JSON.stringify(validation.errors)) : null,
        explanation: `Generated ${schemaType} schema for "${content.title}"`,
      },
    });

    return NextResponse.json({
      recommendation,
      jsonLd,
      validation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate schema recommendation" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { recommendationId, action } = body as {
      recommendationId: string;
      action: "apply" | "reject";
    };

    if (!recommendationId || !action) {
      return NextResponse.json(
        { error: "recommendationId and action are required" },
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

    const recommendation = await prisma.schemaRecommendation.update({
      where: { id: recommendationId },
      data: {
        applied: action === "apply",
      },
    });

    return NextResponse.json({ recommendation });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update schema recommendation" },
      { status: 500 }
    );
  }
}
