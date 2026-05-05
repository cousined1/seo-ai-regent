import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { requireAuthenticatedUser } from "@/lib/auth/access";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, domain, market, priority, notes } = body as {
      workspaceId: string;
      domain: string;
      market?: string;
      priority?: string;
      notes?: string;
    };

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    if (!domain) {
      return NextResponse.json(
        { error: "domain is required" },
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

    const competitor = await prisma.competitor.create({
      data: {
        workspaceId: access.workspace.id,
        domain,
        market: market || null,
        priority: (priority as any) || "MEDIUM",
        notes: notes || null,
      },
    });

    return NextResponse.json({ competitor });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add competitor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

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

    const competitors = await prisma.competitor.findMany({
      where: { workspaceId: access.workspace.id },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { snapshots: true },
        },
      },
    });

    return NextResponse.json({ competitors });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch competitors" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authenticated = await requireAuthenticatedUser(req);
    if (authenticated instanceof NextResponse) {
      return authenticated;
    }

    const body = await req.json();
    const { competitorId } = body as { competitorId: string };

    if (!competitorId) {
      return NextResponse.json(
        { error: "competitorId is required" },
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

    const competitor = await prisma.competitor.findUnique({
      where: { id: competitorId },
      select: { id: true, workspace: { select: { ownerId: true } } },
    });

    if (!competitor || !competitor.workspace || competitor.workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "Competitor not found" }, { status: 404 });
    }

    await prisma.competitor.delete({
      where: { id: competitorId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete competitor" },
      { status: 500 }
    );
  }
}
