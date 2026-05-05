import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, checks } = body as {
      workspaceId: string;
      checks: Array<{
        query: string;
        engine: string;
        found: boolean;
        position?: number;
        snippet?: string;
        url?: string;
      }>;
    };

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    if (!checks || !Array.isArray(checks)) {
      return NextResponse.json(
        { error: "checks array is required" },
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

    const created = await Promise.all(
      checks.map((check) =>
        prisma.citationCheck.create({
          data: {
            workspaceId,
            query: check.query,
            engine: check.engine as any,
            found: check.found,
            position: check.position || null,
            snippet: check.snippet || null,
            url: check.url || null,
          },
        })
      )
    );

    return NextResponse.json({
      count: created.length,
      checks: created,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record citation checks" },
      { status: 500 }
    );
  }
}
