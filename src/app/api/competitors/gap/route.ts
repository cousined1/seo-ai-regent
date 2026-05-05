import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  analyzeCompetitorGap,
  extractKeywords,
  detectContentPatterns,
  generateGapRecommendations,
} from "@/lib/competitors/gap-analysis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const competitorId = searchParams.get("competitorId");

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

    const where: Record<string, unknown> = { workspaceId };
    if (competitorId) {
      where.id = competitorId;
    }

    const competitors = await prisma.competitor.findMany({
      where,
      include: {
        snapshots: {
          orderBy: { crawledAt: "desc" },
          take: 1,
        },
      },
    });

    const ourKeywords = await prisma.keyword.findMany({
      where: { workspaceId },
      select: { query: true },
    });

    const ourKeywordList = ourKeywords.map((k) => k.query);

    const results = [];

    for (const competitor of competitors) {
      const latestSnapshot = competitor.snapshots[0];
      if (!latestSnapshot) {
        results.push({
          competitorId: competitor.id,
          domain: competitor.domain,
          status: "no_data",
        });
        continue;
      }

      const competitorKeywords = extractKeywords(
        latestSnapshot.keywords as Array<Record<string, unknown>>
      );

      const gap = analyzeCompetitorGap(competitorKeywords, ourKeywordList);
      const recommendations = generateGapRecommendations(gap);

      let contentPatterns = null;
      if (latestSnapshot.topPages) {
        contentPatterns = detectContentPatterns(
          latestSnapshot.topPages as Array<Record<string, unknown>>
        );
      }

      results.push({
        competitorId: competitor.id,
        domain: competitor.domain,
        status: "analyzed",
        gap,
        recommendations,
        contentPatterns,
        snapshotDate: latestSnapshot.crawledAt,
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to run gap analysis" },
      { status: 500 }
    );
  }
}
