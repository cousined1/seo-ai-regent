import { safeFetch, UnsafeUrlError } from "@/lib/http/safe-fetch";

export interface CrawlResult {
  url: string;
  status: number;
  title: string;
  metaDescription: string;
  responseTime: number;
  html: string;
  error?: string;
}

export interface TechnicalIssue {
  id?: string;
  url: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  state?: "OPEN" | "IGNORED" | "FIXED" | "REGRESSED";
  title?: string;
  description?: string;
  suggestion?: string;
}

export interface RecrawlResult {
  fixed: TechnicalIssue[];
  regressed: TechnicalIssue[];
  stillOpen: TechnicalIssue[];
  newIssues: TechnicalIssue[];
}

export interface CrawlOptions {
  concurrency?: number;
  timeout?: number;
}

const SLOW_THRESHOLD_MS = 3000;

export async function runAuditCrawl(
  urls: string[],
  options: CrawlOptions = {}
): Promise<CrawlResult[]> {
  const { concurrency = 5, timeout = 10000 } = options;
  const results: CrawlResult[] = [];

  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map((url) => crawlSingleUrl(url, timeout))
    );
    results.push(...chunkResults);
  }

  return results;
}

async function crawlSingleUrl(
  url: string,
  timeout: number
): Promise<CrawlResult> {
  const startTime = Date.now();

  try {
    const response = await safeFetch(url, {
      timeoutMs: timeout,
      headers: {
        "User-Agent": "SEO-AI-Regent-AuditBot/1.0",
      },
    });

    const responseTime = Date.now() - startTime;
    const html = await response.text();

    const title = extractTitle(html);
    const metaDescription = extractMetaDescription(html);

    return {
      url,
      status: response.status,
      title,
      metaDescription,
      responseTime,
      html,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const message =
      error instanceof UnsafeUrlError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return {
      url,
      status: 0,
      title: "",
      metaDescription: "",
      responseTime,
      html: "",
      error: message,
    };
  }
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : "";
}

function extractMetaDescription(html: string): string {
  const match = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i
  );
  return match ? match[1].trim() : "";
}

export function detectTechnicalIssues(
  results: CrawlResult[]
): TechnicalIssue[] {
  const issues: TechnicalIssue[] = [];

  for (const result of results) {
    // Broken links (4xx/5xx)
    if (result.status >= 400 || result.status === 0) {
      issues.push({
        url: result.url,
        type: "broken_link",
        severity: "CRITICAL",
        title: `Broken link: ${result.status || "Network error"}`,
        description: `Page returned status ${result.status || "failed to load"}.`,
        suggestion: "Fix the broken link or set up a proper redirect.",
      });
    }

    // Missing title
    if (result.status === 200 && !result.title) {
      issues.push({
        url: result.url,
        type: "missing_title",
        severity: "HIGH",
        title: "Missing page title",
        description: "Page has no <title> tag in the head section.",
        suggestion: "Add a descriptive, unique title tag (50-60 characters).",
      });
    }

    // Missing meta description
    if (result.status === 200 && !result.metaDescription) {
      issues.push({
        url: result.url,
        type: "missing_description",
        severity: "MEDIUM",
        title: "Missing meta description",
        description: "Page has no meta description tag.",
        suggestion: "Add a compelling meta description (150-160 characters).",
      });
    }

    // Slow page
    if (result.status === 200 && result.responseTime > SLOW_THRESHOLD_MS) {
      issues.push({
        url: result.url,
        type: "slow_page",
        severity: "MEDIUM",
        title: `Slow page: ${result.responseTime}ms`,
        description: `Page load time exceeds ${SLOW_THRESHOLD_MS}ms threshold.`,
        suggestion: "Optimize images, enable caching, or reduce server response time.",
      });
    }

    // Missing H1
    if (result.status === 200 && !hasH1Tag(result.html)) {
      issues.push({
        url: result.url,
        type: "missing_h1",
        severity: "MEDIUM",
        title: "Missing H1 heading",
        description: "Page has no <h1> tag in the body.",
        suggestion: "Add a single H1 tag that matches the page topic.",
      });
    }
  }

  // Duplicate titles
  const titleMap = new Map<string, string[]>();
  for (const result of results) {
    if (result.status === 200 && result.title) {
      const existing = titleMap.get(result.title) || [];
      existing.push(result.url);
      titleMap.set(result.title, existing);
    }
  }

  for (const [title, urls] of titleMap) {
    if (urls.length > 1) {
      for (const url of urls) {
        issues.push({
          url,
          type: "duplicate_title",
          severity: "HIGH",
          title: `Duplicate title: "${title}"`,
          description: `${urls.length} pages share the same title tag.`,
          suggestion: "Make each page title unique and descriptive.",
        });
      }
    }
  }

  return issues;
}

function hasH1Tag(html: string): boolean {
  return /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html);
}

export async function verifyRecrawl(
  url: string,
  previousIssues: TechnicalIssue[]
): Promise<RecrawlResult> {
  const result = await crawlSingleUrl(url, 10000);
  const currentIssues = detectTechnicalIssues([result]);

  const currentIssueTypes = new Set(currentIssues.map((i) => i.type));
  const previousIssueTypes = new Set(previousIssues.map((i) => i.type));

  const fixed: TechnicalIssue[] = [];
  const stillOpen: TechnicalIssue[] = [];
  const regressed: TechnicalIssue[] = [];

  for (const issue of previousIssues) {
    if (currentIssueTypes.has(issue.type)) {
      stillOpen.push(issue);
    } else {
      fixed.push({ ...issue, state: "FIXED" });
    }
  }

  // Check for regressions (new issues that weren't there before)
  for (const issue of currentIssues) {
    if (!previousIssueTypes.has(issue.type)) {
      regressed.push({ ...issue, state: "REGRESSED" });
    }
  }

  return {
    fixed,
    regressed,
    stillOpen,
    newIssues: currentIssues.filter(
      (i) => !previousIssueTypes.has(i.type)
    ),
  };
}
