import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  calculateCitationScore,
  aggregateTrend,
  detectCitationChanges,
  type CitationRecord,
} from "@/lib/citations/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const query = searchParams.get("query");

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
    if (query) where.query = query;

    const checks = await prisma.citationCheck.findMany({
      where,
      orderBy: { checkedAt: "desc" },
    });

    const queries = [...new Set(checks.map((c) => c.query))];
    const engines = [...new Set(checks.map((c) => c.engine))];

    const results = [];

    for (const q of queries) {
      const queryChecks = checks.filter((c) => c.query === q);

      const latestByEngine = new Map<string, typeof checks[0]>();
      for (const check of queryChecks) {
        if (!latestByEngine.has(check.engine)) {
          latestByEngine.set(check.engine, check);
        }
      }

      const currentRecords: CitationRecord[] = [];
      for (const [engine, check] of latestByEngine) {
        currentRecords.push({
          engine: engine as any,
          found: check.found,
          position: check.position || undefined,
          snippet: check.snippet || undefined,
          url: check.url || undefined,
          checkedAt: check.checkedAt,
        });
      }

      const citationScore = calculateCitationScore(currentRecords);
      const trend = aggregateTrend(
        currentRecords,
        new Date().toISOString().slice(0, 7)
      );

      const previousChecks = queryChecks.slice(latestByEngine.size);
      const previousRecords: CitationRecord[] = [];
      const previousByEngine = new Map<string, typeof checks[0]>();
      for (const check of previousChecks) {
        if (!previousByEngine.has(check.engine)) {
          previousByEngine.set(check.engine, check);
        }
      }
      for (const [engine, check] of previousByEngine) {
        previousRecords.push({
          engine: engine as any,
          found: check.found,
          position: check.position || undefined,
          checkedAt: check.checkedAt,
        });
      }

      const changes = detectCitationChanges(previousRecords, currentRecords);

      results.push({
        query: q,
        citationScore,
        totalEngines: engines.length,
        citedEngines: currentRecords.filter((r) => r.found).length,
        avgPosition: trend.avgPosition,
        changes,
        latestChecks: currentRecords.map((r) => ({
          engine: r.engine,
          found: r.found,
          position: r.position,
          checkedAt: r.checkedAt,
        })),
      });
    }

    const summary = {
      total: results.length,
      avgScore:
        results.length > 0
          ? Math.round(
              results.reduce((sum, r) => sum + r.citationScore, 0) /
                results.length
            )
          : 0,
      gained: results.reduce(
        (sum, r) =>
          sum + r.changes.filter((c) => c.type === "gained").length,
        0
      ),
      lost: results.reduce(
        (sum, r) =>
          sum + r.changes.filter((c) => c.type === "lost").length,
        0
      ),
    };

    return NextResponse.json({ results, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch citation trends" },
      { status: 500 }
    );
  }
}
