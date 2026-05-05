import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  fetchSearchConsoleData,
  parseSearchConsoleResponse,
  detectOpportunities,
} from "@/lib/integrations/search-console/service";

function decodeTokens(encryptedTokens: unknown): {
  accessToken: string;
  refreshToken: string;
} {
  const decoded = Buffer.from(encryptedTokens as string, "base64").toString(
    "utf-8"
  );
  return JSON.parse(decoded);
}

export async function POST(req: NextRequest) {
  let syncConnectionId: string | undefined;

  try {
    const body = await req.json();
    const { connectionId, startDate, endDate } = body as {
      connectionId: string;
      startDate: string;
      endDate: string;
    };

    syncConnectionId = connectionId;

    if (!connectionId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "connectionId, startDate, and endDate are required" },
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

    const connection = await prisma.searchConsoleConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    await prisma.searchConsoleConnection.update({
      where: { id: connectionId },
      data: { syncStatus: "SYNCING" },
    });

    const { accessToken } = decodeTokens(connection.encryptedTokens);

    const apiResponse = await fetchSearchConsoleData(
      accessToken,
      connection.propertyUrl,
      startDate,
      endDate
    );

    const rows = parseSearchConsoleResponse(apiResponse);

    const created = await prisma.$transaction(
      rows.map((row) =>
        prisma.searchConsoleData.create({
          data: {
            connectionId,
            query: row.query,
            page: row.page,
            impressions: row.impressions,
            clicks: row.clicks,
            ctr: row.ctr,
            position: row.position,
            date: new Date(startDate),
          },
        })
      )
    );

    const opportunities = detectOpportunities(rows);

    const createdOpportunities = await Promise.all(
      opportunities.map((opp) =>
        prisma.searchConsoleOpportunity.create({
          data: {
            workspaceId: connection.workspaceId,
            type: opp.type,
            query: opp.query,
            page: opp.page,
            metric: opp.metric,
            value: opp.value,
            rationale: opp.rationale,
          },
        })
      )
    );

    await prisma.searchConsoleConnection.update({
      where: { id: connectionId },
      data: {
        syncStatus: "SYNCED",
        lastSyncAt: new Date(),
      },
    });

    return NextResponse.json({
      rowsSynced: created.length,
      opportunitiesFound: createdOpportunities.length,
      opportunities: createdOpportunities,
    });
  } catch (error) {
    const prisma = getPrismaClient();
    if (prisma && syncConnectionId) {
      try {
        await prisma.searchConsoleConnection.update({
          where: { id: syncConnectionId },
          data: { syncStatus: "ERROR" },
        });
      } catch {
        // Ignore update error
      }
    }

    return NextResponse.json(
      { error: "Failed to sync Search Console data" },
      { status: 500 }
    );
  }
}
