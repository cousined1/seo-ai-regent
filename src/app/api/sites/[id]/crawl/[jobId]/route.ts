import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { getCrawlJobStatus } from "@/lib/crawls/sitemap";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; jobId: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const { id: siteId, jobId } = await params;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: { workspace: true },
  });

  if (!site || !site.workspace || site.workspace.ownerId !== authenticated.user.id) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  try {
    const crawlJob = await getCrawlJobStatus(jobId);

    if (!crawlJob || crawlJob.siteId !== siteId) {
      return NextResponse.json({ error: "Crawl job not found" }, { status: 404 });
    }

    return NextResponse.json({ crawlJob });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get crawl status" },
      { status: 500 },
    );
  }
}
