import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");
    const sourceId = searchParams.get("sourceId");

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const where: Record<string, unknown> = { workspaceId };
    if (status) where.status = status;
    if (sourceId) where.sourceId = sourceId;

    const suggestions = await prisma.internalLinkSuggestion.findMany({
      where,
      orderBy: [{ confidence: "desc" }],
    });

    const summary = {
      total: suggestions.length,
      pending: suggestions.filter((s) => s.status === "PENDING").length,
      accepted: suggestions.filter((s) => s.status === "ACCEPTED").length,
      rejected: suggestions.filter((s) => s.status === "REJECTED").length,
      inserted: suggestions.filter((s) => s.status === "INSERTED").length,
    };

    return NextResponse.json({ suggestions, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
