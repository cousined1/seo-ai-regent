import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { aggregateWorkspaceDashboard } from "@/lib/dashboard/aggregator";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }
    const { workspace } = access;

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const [
      keywords,
      rankTracking,
      articles,
      citationChecks,
      backlinkOpportunities,
      auditRuns,
      technicalIssues,
      inventoryItems,
    ] = await Promise.all([
      prisma.keyword.findMany({
        where: { workspaceId: workspace.id },
        select: { id: true, query: true, volume: true, difficulty: true },
      }),
      prisma.rankTracking.findMany({
        where: { keyword: { workspaceId: workspace.id } },
        orderBy: { checkedAt: "desc" },
      }),
      prisma.article.findMany({
        where: { userId: workspace.ownerId },
        select: { id: true, status: true, contentScore: true, geoScore: true },
      }),
      prisma.citationCheck.findMany({
        where: { workspaceId: workspace.id },
      }),
      prisma.backlinkOpportunity.findMany({
        where: { workspaceId: workspace.id },
      }),
      prisma.auditRun.findMany({
        where: { site: { workspaceId: workspace.id } },
        orderBy: { startedAt: "desc" },
        take: 1,
      }),
      prisma.technicalSeoIssue.findMany({
        where: { auditRun: { site: { workspaceId: workspace.id } } },
      }),
      prisma.contentInventoryItem.findMany({
        where: { site: { workspaceId: workspace.id } },
      }),
    ]);

    const latestRankings = new Map<string, typeof rankTracking[0]>();
    for (const record of rankTracking) {
      if (!latestRankings.has(record.keywordId)) {
        latestRankings.set(record.keywordId, record);
      }
    }

    const top3 = Array.from(latestRankings.values()).filter(
      (r) => r.position >= 1 && r.position <= 3
    ).length;
    const top10 = Array.from(latestRankings.values()).filter(
      (r) => r.position >= 1 && r.position <= 10
    ).length;
    const top20 = Array.from(latestRankings.values()).filter(
      (r) => r.position >= 1 && r.position <= 20
    ).length;
    const tracking = latestRankings.size;

    const published = articles.filter((a) => a.status === "PUBLISHED").length;
    const draft = articles.filter((a) => a.status === "DRAFT").length;
    const ready = articles.filter((a) => a.status === "READY").length;

    const avgContentScore =
      articles.length > 0
        ? Math.round(
            articles.reduce((sum, a) => sum + a.contentScore, 0) /
              articles.length
          )
        : 0;
    const avgGeoScore =
      articles.length > 0
        ? Math.round(
            articles.reduce(
              (sum, a) => sum + (a.geoScore || 0),
              0
            ) / articles.length
          )
        : 0;
    const above70 = articles.filter(
      (a) => a.contentScore >= 70 && (a.geoScore || 0) >= 70
    ).length;
    const below50 = articles.filter(
      (a) => a.contentScore < 50 || (a.geoScore || 0) < 50
    ).length;

    const appearing = citationChecks.filter((c) => c.found).length;
    const notAppearing = citationChecks.filter((c) => !c.found).length;

    const outreachSent = backlinkOpportunities.filter(
      (b) =>
        b.status === "OUTREACH_SENT" ||
        b.status === "FOLLOW_UP_SENT"
    ).length;
    const responded = backlinkOpportunities.filter(
      (b) => b.status === "RESPONDED"
    ).length;
    const linkAcquired = backlinkOpportunities.filter(
      (b) => b.status === "LINK_ACQUIRED"
    ).length;
    const contacted = outreachSent + responded + linkAcquired;

    const lastAudit = auditRuns[0];
    const criticalIssues = technicalIssues.filter(
      (i) => i.severity === "CRITICAL"
    ).length;
    const highIssues = technicalIssues.filter(
      (i) => i.severity === "HIGH"
    ).length;
    const mediumIssues = technicalIssues.filter(
      (i) => i.severity === "MEDIUM"
    ).length;
    const lowIssues = technicalIssues.filter(
      (i) => i.severity === "LOW"
    ).length;

    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: workspace.id,
      keywords: {
        total: keywords.length,
        tracking,
        top3,
        top10,
        top20,
      },
      contentScores: {
        total: articles.length,
        avgContentScore,
        avgGeoScore,
        above70,
        below50,
      },
      citations: {
        total: citationChecks.length,
        avgScore: 0,
        appearing,
        notAppearing,
      },
      backlinks: {
        total: backlinkOpportunities.length,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        contacted,
      },
      audit: {
        lastRunAt: lastAudit?.startedAt?.toISOString() || null,
        totalIssues: technicalIssues.length,
        critical: criticalIssues,
        warning: highIssues + mediumIssues,
        info: lowIssues,
      },
      inventory: {
        total: inventoryItems.length,
        needsRefresh: 0,
        outdated: 0,
        healthy: inventoryItems.length,
      },
      articles: {
        total: articles.length,
        published,
        draft,
        inReview: ready,
      },
    });

    return NextResponse.json(dashboard);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
