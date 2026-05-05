import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import type { IssueState } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get("siteId");
    const auditRunId = searchParams.get("auditRunId");
    const severity = searchParams.get("severity");
    const state = searchParams.get("state");

    if (!siteId && !auditRunId) {
      return NextResponse.json(
        { error: "siteId or auditRunId is required" },
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

    const where: Record<string, unknown> = {};
    if (auditRunId) {
      where.auditRunId = auditRunId;
    } else if (siteId) {
      where.auditRun = { siteId };
    }
    if (severity) where.severity = severity;
    if (state) where.state = state;

    const issues = await prisma.technicalSeoIssue.findMany({
      where,
      orderBy: [
        { severity: "asc" },
        { lastSeen: "desc" },
      ],
      include: {
        auditRun: {
          select: {
            id: true,
            siteId: true,
            status: true,
            completedAt: true,
          },
        },
      },
    });

    const summary = {
      total: issues.length,
      critical: issues.filter((i) => i.severity === "CRITICAL").length,
      high: issues.filter((i) => i.severity === "HIGH").length,
      medium: issues.filter((i) => i.severity === "MEDIUM").length,
      low: issues.filter((i) => i.severity === "LOW").length,
      open: issues.filter((i) => i.state === "OPEN").length,
      fixed: issues.filter((i) => i.state === "FIXED").length,
      ignored: issues.filter((i) => i.state === "IGNORED").length,
    };

    return NextResponse.json({ issues, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { issueId, state } = body as { issueId: string; state: string };

    if (!issueId || !state) {
      return NextResponse.json(
        { error: "issueId and state are required" },
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

    const issue = await prisma.technicalSeoIssue.update({
      where: { id: issueId },
      data: {
        state: state as IssueState,
        resolvedAt: state === "FIXED" || state === "IGNORED" ? new Date() : null,
      },
    });

    return NextResponse.json({ issue });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 }
    );
  }
}
