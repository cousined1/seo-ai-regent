import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { calculateTrend, type RankRecord } from "@/lib/rank-tracking/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const keywordId = searchParams.get("keywordId");
    const days = parseInt(searchParams.get("days") || "30", 10);

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
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

    const keywords = await prisma.keyword.findMany({
      where: { workspaceId },
      select: {
        id: true,
        query: true,
        intent: true,
        volume: true,
        difficulty: true,
      },
    });

    const results = [];

    for (const keyword of keywords) {
      if (keywordId && keyword.id !== keywordId) continue;

      const records = await prisma.rankTracking.findMany({
        where: { keywordId: keyword.id },
        orderBy: { checkedAt: "asc" },
      });

      const rankRecords: RankRecord[] = records.map((r) => ({
        position: r.position,
        competitorPosition: r.competitorPosition || undefined,
        checkedAt: r.checkedAt,
      }));

      const trend7 = calculateTrend(rankRecords, 7);
      const trend30 = calculateTrend(rankRecords, 30);
      const trend90 = calculateTrend(rankRecords, 90);

      const latest = records[records.length - 1];

      results.push({
        keywordId: keyword.id,
        query: keyword.query,
        intent: keyword.intent,
        volume: keyword.volume,
        difficulty: keyword.difficulty,
        currentPosition: latest?.position || null,
        lastChecked: latest?.checkedAt || null,
        competitorPosition: latest?.competitorPosition || null,
        trends: {
          "7d": trend7,
          "30d": trend30,
          "90d": trend90,
        },
        history: records.slice(-30).map((r) => ({
          position: r.position,
          competitorPosition: r.competitorPosition,
          checkedAt: r.checkedAt,
        })),
      });
    }

    const summary = {
      total: results.length,
      tracking: results.filter((r) => r.currentPosition !== null).length,
      improving: results.filter(
        (r) => r.trends["7d"]?.direction === "up"
      ).length,
      declining: results.filter(
        (r) => r.trends["7d"]?.direction === "down"
      ).length,
    };

    return NextResponse.json({ results, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rank trends" },
      { status: 500 }
    );
  }
}
