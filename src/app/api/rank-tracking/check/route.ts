import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { requireKeywordAccess } from "@/lib/workspaces/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keywordId, position, url, serpFeatures, competitorPosition, competitorUrl } = body as {
      keywordId: string;
      position: number;
      url?: string;
      serpFeatures?: Record<string, unknown>;
      competitorPosition?: number;
      competitorUrl?: string;
    };

    const access = await requireKeywordAccess(req, keywordId);
    if (access instanceof NextResponse) {
      return access;
    }

    if (position === undefined || position === null) {
      return NextResponse.json(
        { error: "position is required" },
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

    const tracking = await prisma.rankTracking.create({
      data: {
        keywordId,
        position,
        url: url || null,
        serpFeatures: serpFeatures ? JSON.parse(JSON.stringify(serpFeatures)) : null,
        competitorPosition: competitorPosition || null,
        competitorUrl: competitorUrl || null,
      },
    });

    return NextResponse.json({ tracking });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record rank check" },
      { status: 500 }
    );
  }
}
