import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { clusterByIntent, type DiscoveredKeyword } from "@/lib/keywords/cluster";
import { discoverKeywords, discoverKeywordsHeuristic } from "@/lib/keywords/discover";
import { verifyWorkspaceAccess } from "@/lib/workspaces/service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const workspaceId = (await params).id;

  const hasAccess = await verifyWorkspaceAccess(workspaceId, authenticated.user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  try {
    const body = await request.json();

    if (!body.seed || typeof body.seed !== "string") {
      return NextResponse.json(
        { error: "Seed keyword is required" },
        { status: 400 },
      );
    }

    const serperApiKey = process.env.SERPER_API_KEY;
    let keywords: DiscoveredKeyword[];

    if (serperApiKey) {
      keywords = await discoverKeywords(body.seed, serperApiKey, body.maxResults);
    } else {
      keywords = await discoverKeywordsHeuristic(body.seed, body.maxResults);
    }

    const clusters = clusterByIntent(keywords);

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const createdKeywords = await Promise.all(
      keywords.map((kw) =>
        prisma.keyword.create({
          data: {
            query: kw.keyword,
            intent: kw.intent,
            volume: kw.volume,
            difficulty: kw.difficulty,
            workspaceId,
          },
        }),
      ),
    );

    const keywordMap = new Map(
      createdKeywords.map((kw) => [kw.query, kw.id]),
    );

    const createdClusters = await Promise.all(
      clusters.map((cluster) => {
        const keywordIds = cluster.keywords
          .map((kw) => keywordMap.get(kw.keyword))
          .filter((id): id is string => id !== undefined);

        return prisma.keywordCluster.create({
          data: {
            name: cluster.name,
            intent: cluster.intent,
            workspaceId,
            keywords: {
              connect: keywordIds.map((id) => ({ id })),
            },
          },
        });
      }),
    );

    return NextResponse.json({
      keywords: createdKeywords,
      clusters: createdClusters,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to discover keywords" },
      { status: 500 },
    );
  }
}
