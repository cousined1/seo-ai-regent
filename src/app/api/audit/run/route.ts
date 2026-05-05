import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { runAuditCrawl, detectTechnicalIssues } from "@/lib/audit/service";
import { requireSiteAccess } from "@/lib/workspaces/access";

const MAX_AUDIT_URLS = 100;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, urls } = body as { siteId: string; urls: string[] };

    const access = await requireSiteAccess(req, siteId);
    if (access instanceof NextResponse) {
      return access;
    }
    const { site } = access;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "urls array is required" },
        { status: 400 }
      );
    }

    if (urls.length > MAX_AUDIT_URLS) {
      return NextResponse.json(
        { error: `Audit accepts up to ${MAX_AUDIT_URLS} URLs per run` },
        { status: 400 }
      );
    }

    let siteOrigin: string;
    try {
      siteOrigin = new URL(site.url).origin;
    } catch {
      return NextResponse.json({ error: "Invalid site URL" }, { status: 400 });
    }

    const sameOriginUrls: string[] = [];
    for (const candidate of urls) {
      try {
        const parsed = new URL(candidate);
        if (parsed.origin !== siteOrigin) {
          return NextResponse.json(
            { error: `URL ${candidate} is outside the verified site origin` },
            { status: 400 }
          );
        }
        sameOriginUrls.push(parsed.toString());
      } catch {
        return NextResponse.json(
          { error: `Invalid URL: ${candidate}` },
          { status: 400 }
        );
      }
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const auditRun = await prisma.auditRun.create({
      data: {
        siteId,
        status: "running",
        urlCount: sameOriginUrls.length,
      },
    });

    const crawlResults = await runAuditCrawl(sameOriginUrls);
    const issues = detectTechnicalIssues(crawlResults);

    const createdIssues = await Promise.all(
      issues.map((issue) =>
        prisma.technicalSeoIssue.create({
          data: {
            auditRunId: auditRun.id,
            url: issue.url,
            type: issue.type,
            severity: issue.severity,
            state: "OPEN",
            title: issue.title || issue.type,
            description: issue.description,
            suggestion: issue.suggestion,
          },
        })
      )
    );

    await prisma.auditRun.update({
      where: { id: auditRun.id },
      data: {
        status: "completed",
        issueCount: createdIssues.length,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      auditRunId: auditRun.id,
      urlCount: sameOriginUrls.length,
      issueCount: createdIssues.length,
      issues: createdIssues,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to run audit crawl" },
      { status: 500 }
    );
  }
}
