import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

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
    if (type) where.type = type;
    if (status) where.status = status;

    const opportunities = await prisma.searchConsoleOpportunity.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });

    const summary = {
      total: opportunities.length,
      highImpressionLowCtr: opportunities.filter(
        (o) => o.type === "HIGH_IMPRESSION_LOW_CTR"
      ).length,
      position4To10: opportunities.filter(
        (o) => o.type === "POSITION_4_TO_10"
      ).length,
      cannibalized: opportunities.filter(
        (o) => o.type === "CANNIBALIZED_QUERY"
      ).length,
      declining: opportunities.filter(
        (o) => o.type === "DECLINING_PAGE"
      ).length,
      new: opportunities.filter((o) => o.status === "new").length,
    };

    return NextResponse.json({ opportunities, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { opportunityId, status } = body as {
      opportunityId: string;
      status: string;
    };

    if (!opportunityId || !status) {
      return NextResponse.json(
        { error: "opportunityId and status are required" },
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

    const opportunity = await prisma.searchConsoleOpportunity.update({
      where: { id: opportunityId },
      data: { status },
    });

    return NextResponse.json({ opportunity });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update opportunity" },
      { status: 500 }
    );
  }
}
