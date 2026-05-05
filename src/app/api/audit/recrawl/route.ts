import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { verifyRecrawl } from "@/lib/audit/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, issueIds } = body as { url: string; issueIds: string[] };

    if (!url || !issueIds || !Array.isArray(issueIds)) {
      return NextResponse.json(
        { error: "url and issueIds array are required" },
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

    const previousIssues = await prisma.technicalSeoIssue.findMany({
      where: { id: { in: issueIds } },
    });

    const recrawlResult = await verifyRecrawl(
      url,
      previousIssues.map((issue) => ({
        id: issue.id,
        url: issue.url,
        type: issue.type,
        severity: issue.severity,
        state: issue.state,
      }))
    );

    const updates = [];

    for (const issue of recrawlResult.fixed) {
      if (issue.id) {
        updates.push(
          prisma.technicalSeoIssue.update({
            where: { id: issue.id },
            data: { state: "FIXED", resolvedAt: new Date() },
          })
        );
      }
    }

    for (const issue of recrawlResult.regressed) {
      if (issue.id) {
        updates.push(
          prisma.technicalSeoIssue.update({
            where: { id: issue.id },
            data: { state: "REGRESSED", resolvedAt: null },
          })
        );
      }
    }

    await Promise.all(updates);

    return NextResponse.json({
      url,
      fixed: recrawlResult.fixed,
      regressed: recrawlResult.regressed,
      stillOpen: recrawlResult.stillOpen,
      newIssues: recrawlResult.newIssues,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to verify recrawl" },
      { status: 500 }
    );
  }
}
