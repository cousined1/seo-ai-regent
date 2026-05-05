import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { getSiteWithVerification } from "@/lib/sites/verification";
import { startCrawlJob, executeCrawl } from "@/lib/crawls/sitemap";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const siteId = (await params).id;

  const site = await getSiteWithVerification(siteId, authenticated.user.id);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  try {
    const { id: crawlJobId } = await startCrawlJob(siteId);

    executeCrawl(crawlJobId).catch((error) => {
      console.error(`Crawl job ${crawlJobId} failed:`, error);
    });

    return NextResponse.json({ crawlJobId }, { status: 202 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to start crawl" },
      { status: 500 },
    );
  }
}
