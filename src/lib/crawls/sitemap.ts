import { getPrismaClient } from "@/lib/db";
import { safeFetch } from "@/lib/http/safe-fetch";

function getDb() {
  const client = getPrismaClient();
  if (!client) {
    throw new Error("Database not configured");
  }
  return client;
}

export function parseSitemap(xml: string, baseUrl: string): string[] {
  if (!xml || !xml.includes("<url")) {
    return [];
  }

  const urls: string[] = [];
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  let match;

  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url && isValidUrl(url)) {
      urls.push(url);
    }
  }

  return urls;
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    const normalized = parsed.toString().replace(/\/$/, "");
    return normalized.toLowerCase().replace(/^https?:\/\/([^/]+)/, (match, domain) => {
      return match.replace(domain, domain.toLowerCase());
    });
  } catch {
    return url;
  }
}

export function isAllowedByRobots(url: string, robotsTxt: string | null): boolean {
  if (!robotsTxt || robotsTxt.trim() === "") {
    return true;
  }

  try {
    const parsed = new URL(url);
    const path = parsed.pathname + parsed.search;

    const lines = robotsTxt.split("\n");
    let inWildcardBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("#") || trimmed === "") {
        continue;
      }

      if (/^User-agent:\s*\*/i.test(trimmed)) {
        inWildcardBlock = true;
        continue;
      }

      if (/^User-agent:/i.test(trimmed)) {
        inWildcardBlock = false;
        continue;
      }

      if (inWildcardBlock && /^Disallow:/i.test(trimmed)) {
        const disallowPath = trimmed.replace(/^Disallow:\s*/i, "").trim();

        if (disallowPath === "") {
          return true;
        }

        if (path.startsWith(disallowPath)) {
          return false;
        }
      }
    }

    return true;
  } catch {
    return true;
  }
}

export function deduplicateUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const url of urls) {
    const normalized = normalizeUrl(url);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }

  return result;
}

export interface CrawlResult {
  crawlJobId: string;
  urlCount: number;
  urls: Array<{ url: string; title: string | null; statusCode: number | null }>;
}

export async function startCrawlJob(siteId: string): Promise<{ id: string }> {
  const db = getDb();

  const site = await db.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    throw new Error("Site not found");
  }

  if (site.status !== "VERIFIED") {
    throw new Error("Site must be verified before crawling");
  }

  const crawlJob = await db.crawlJob.create({
    data: {
      siteId,
      status: "PENDING",
    },
  });

  return { id: crawlJob.id };
}

export async function executeCrawl(crawlJobId: string): Promise<CrawlResult> {
  const db = getDb();

  const crawlJob = await db.crawlJob.findUnique({
    where: { id: crawlJobId },
    include: { site: true },
  });

  if (!crawlJob) {
    throw new Error("Crawl job not found");
  }

  await db.crawlJob.update({
    where: { id: crawlJobId },
    data: {
      status: "RUNNING",
      startedAt: new Date(),
    },
  });

  try {
    const siteUrl = crawlJob.site.url;
    const sitemapUrl = await discoverSitemap(siteUrl);

    if (!sitemapUrl) {
      throw new Error("No sitemap found for this site");
    }

    const sitemapXml = await fetchSitemap(sitemapUrl);
    const rawUrls = parseSitemap(sitemapXml, siteUrl);
    const uniqueUrls = deduplicateUrls(rawUrls);

    const siteDomain = new URL(siteUrl).origin;
    const robotsTxt = await fetchRobotsTxt(siteDomain);

    const allowedUrls = uniqueUrls.filter((url) => isAllowedByRobots(url, robotsTxt));

    const crawledUrls = await Promise.all(
      allowedUrls.slice(0, 100).map(async (url) => {
        try {
          const response = await safeFetch(url, {
            method: "HEAD",
            timeoutMs: 10000,
          });

          let title: string | null = null;
          if (response.headers.get("content-type")?.includes("text/html")) {
            const htmlResponse = await safeFetch(url, {
              timeoutMs: 10000,
            });
            const html = await htmlResponse.text();
            title = extractTitle(html);
          }

          return {
            url,
            title,
            statusCode: response.status,
          };
        } catch {
          return {
            url,
            title: null,
            statusCode: null,
          };
        }
      }),
    );

    await Promise.all(
      crawledUrls.map((cu) =>
        db.crawledUrl.upsert({
          where: {
            siteId_url: {
              siteId: crawlJob.siteId,
              url: cu.url,
            },
          },
          create: {
            siteId: crawlJob.siteId,
            crawlJobId,
            url: cu.url,
            title: cu.title,
            statusCode: cu.statusCode,
          },
          update: {
            title: cu.title,
            statusCode: cu.statusCode,
            lastCrawledAt: new Date(),
          },
        }),
      ),
    );

    await db.crawlJob.update({
      where: { id: crawlJobId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        urlCount: crawledUrls.length,
      },
    });

    return {
      crawlJobId,
      urlCount: crawledUrls.length,
      urls: crawledUrls,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    await db.crawlJob.update({
      where: { id: crawlJobId },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        error: errorMessage,
      },
    });

    throw error;
  }
}

export async function getCrawlJobStatus(crawlJobId: string) {
  const db = getDb();

  return db.crawlJob.findUnique({
    where: { id: crawlJobId },
    include: {
      crawledUrls: {
        orderBy: { lastCrawledAt: "desc" },
        take: 50,
      },
    },
  });
}

async function discoverSitemap(siteUrl: string): Promise<string | null> {
  const candidates = [
    `${siteUrl}/sitemap.xml`,
    `${siteUrl}/sitemap_index.xml`,
    `${siteUrl}/sitemap-index.xml`,
    `${siteUrl}/sitemap.xml.gz`,
  ];

  for (const candidate of candidates) {
    try {
      const response = await safeFetch(candidate, {
        method: "HEAD",
        timeoutMs: 5000,
      });

      if (response.ok) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  const robotsTxt = await fetchRobotsTxt(siteUrl);
  if (robotsTxt) {
    const sitemapMatch = robotsTxt.match(/^Sitemap:\s*(.+)$/im);
    if (sitemapMatch) {
      const declared = sitemapMatch[1].trim();
      try {
        const declaredOrigin = new URL(declared).origin;
        const siteOrigin = new URL(siteUrl).origin;
        if (declaredOrigin === siteOrigin) {
          return declared;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

async function fetchSitemap(sitemapUrl: string): Promise<string> {
  const response = await safeFetch(sitemapUrl, { timeoutMs: 15000 });

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }

  return response.text();
}

async function fetchRobotsTxt(siteDomain: string): Promise<string | null> {
  try {
    const response = await safeFetch(`${siteDomain}/robots.txt`, {
      timeoutMs: 5000,
    });

    if (response.ok) {
      return response.text();
    }
  } catch {
    return null;
  }

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
