import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { keywords, contentPatterns, topPages } = body as {
      keywords: Array<Record<string, unknown>>;
      contentPatterns?: Record<string, unknown>;
      topPages?: Array<Record<string, unknown>>;
    };

    if (!id || !keywords) {
      return NextResponse.json(
        { error: "competitorId and keywords are required" },
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

    const snapshot = await prisma.competitorSnapshot.create({
      data: {
        competitorId: id,
        keywords: JSON.parse(JSON.stringify(keywords)),
        contentPatterns: contentPatterns
          ? JSON.parse(JSON.stringify(contentPatterns))
          : null,
        topPages: topPages
          ? JSON.parse(JSON.stringify(topPages))
          : null,
      },
    });

    return NextResponse.json({ snapshot });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create snapshot" },
      { status: 500 }
    );
  }
}
