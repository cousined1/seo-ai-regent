import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  runAuditCrawl,
  detectTechnicalIssues,
  verifyRecrawl,
  type CrawlResult,
  type TechnicalIssue,
} from "@/lib/audit/service";

// Mock fetch for HTTP requests during crawl
const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeHtmlResponse(
  html: string,
  status = 200,
  responseTime = 100
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "text/html" }),
    text: () => Promise.resolve(html),
    url: "https://example.com/page",
  } as Response;
}

function makeErrorResponse(status: number): Response {
  return {
    ok: false,
    status,
    headers: new Headers(),
    text: () => Promise.resolve(""),
    url: "https://example.com/page",
  } as Response;
}

describe("runAuditCrawl", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("crawls a list of URLs and returns results with status, title, meta description, and response time", async () => {
    mockFetch
      .mockResolvedValueOnce(
        makeHtmlResponse(
          "<html><head><title>Test Page</title><meta name='description' content='A test page'></head><body>Hello</body></html>",
          200,
          150
        )
      )
      .mockResolvedValueOnce(makeErrorResponse(404))
      .mockResolvedValueOnce(
        makeHtmlResponse(
          "<html><head><title></title></head><body>No title</body></html>",
          200,
          3200
        )
      );

    const urls = [
      "https://example.com/page",
      "https://example.com/missing",
      "https://example.com/slow",
    ];

    const results = await runAuditCrawl(urls, { concurrency: 1 });

    expect(results).toHaveLength(3);
    expect(results[0].status).toBe(200);
    expect(results[0].title).toBe("Test Page");
    expect(results[0].metaDescription).toBe("A test page");
    expect(results[0].responseTime).toBeGreaterThanOrEqual(0);
    expect(results[1].status).toBe(404);
    expect(results[2].responseTime).toBeGreaterThanOrEqual(0);
  });

  it("handles network errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const results = await runAuditCrawl(
      ["https://example.com/error"],
      { concurrency: 1 }
    );

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe(0);
    expect(results[0].error).toBe("Network error");
  });
});

describe("detectTechnicalIssues", () => {
  it("detects missing page titles", () => {
    const results: CrawlResult[] = [
      {
        url: "https://example.com/no-title",
        status: 200,
        title: "",
        metaDescription: "Has description",
        responseTime: 100,
        html: "<html><head></head><body></body></html>",
      },
    ];

    const issues = detectTechnicalIssues(results);
    const titleIssues = issues.filter((i) => i.type === "missing_title");

    expect(titleIssues).toHaveLength(1);
    expect(titleIssues[0].severity).toBe("HIGH");
    expect(titleIssues[0].url).toBe("https://example.com/no-title");
  });

  it("detects missing meta descriptions", () => {
    const results: CrawlResult[] = [
      {
        url: "https://example.com/no-desc",
        status: 200,
        title: "Has Title",
        metaDescription: "",
        responseTime: 100,
        html: "<html><head><title>Has Title</title></head><body></body></html>",
      },
    ];

    const issues = detectTechnicalIssues(results);
    const descIssues = issues.filter((i) => i.type === "missing_description");

    expect(descIssues).toHaveLength(1);
    expect(descIssues[0].severity).toBe("MEDIUM");
  });

  it("detects broken links (4xx/5xx status codes)", () => {
    const results: CrawlResult[] = [
      { url: "https://example.com/404", status: 404, title: "", metaDescription: "", responseTime: 50, html: "" },
      { url: "https://example.com/500", status: 500, title: "", metaDescription: "", responseTime: 50, html: "" },
      { url: "https://example.com/ok", status: 200, title: "OK", metaDescription: "OK", responseTime: 50, html: "" },
    ];

    const issues = detectTechnicalIssues(results);
    const brokenIssues = issues.filter((i) => i.type === "broken_link");

    expect(brokenIssues).toHaveLength(2);
    expect(brokenIssues[0].severity).toBe("CRITICAL");
  });

  it("detects slow pages (response time > 3000ms)", () => {
    const results: CrawlResult[] = [
      { url: "https://example.com/slow", status: 200, title: "Slow", metaDescription: "Slow page", responseTime: 4500, html: "" },
      { url: "https://example.com/fast", status: 200, title: "Fast", metaDescription: "Fast page", responseTime: 200, html: "" },
    ];

    const issues = detectTechnicalIssues(results);
    const slowIssues = issues.filter((i) => i.type === "slow_page");

    expect(slowIssues).toHaveLength(1);
    expect(slowIssues[0].severity).toBe("MEDIUM");
    expect(slowIssues[0].url).toBe("https://example.com/slow");
  });

  it("detects duplicate titles across pages", () => {
    const results: CrawlResult[] = [
      { url: "https://example.com/a", status: 200, title: "Same Title", metaDescription: "A", responseTime: 100, html: "" },
      { url: "https://example.com/b", status: 200, title: "Same Title", metaDescription: "B", responseTime: 100, html: "" },
      { url: "https://example.com/c", status: 200, title: "Unique Title", metaDescription: "C", responseTime: 100, html: "" },
    ];

    const issues = detectTechnicalIssues(results);
    const dupIssues = issues.filter((i) => i.type === "duplicate_title");

    expect(dupIssues).toHaveLength(2);
    expect(dupIssues[0].severity).toBe("HIGH");
  });

  it("detects pages with no H1 tag", () => {
    const results: CrawlResult[] = [
      { url: "https://example.com/no-h1", status: 200, title: "No H1", metaDescription: "Desc", responseTime: 100, html: "<html><body><p>No heading</p></body></html>" },
      { url: "https://example.com/has-h1", status: 200, title: "Has H1", metaDescription: "Desc", responseTime: 100, html: "<html><body><h1>Heading</h1></body></html>" },
    ];

    const issues = detectTechnicalIssues(results);
    const h1Issues = issues.filter((i) => i.type === "missing_h1");

    expect(h1Issues).toHaveLength(1);
    expect(h1Issues[0].severity).toBe("MEDIUM");
  });

  it("returns no issues for healthy pages", () => {
    const results: CrawlResult[] = [
      { url: "https://example.com/good", status: 200, title: "Good Page", metaDescription: "A good page", responseTime: 200, html: "<html><body><h1>Good Page</h1></body></html>" },
    ];

    const issues = detectTechnicalIssues(results);
    expect(issues).toHaveLength(0);
  });
});

describe("verifyRecrawl", () => {
  it("marks issues as FIXED when recrawl shows they are resolved", async () => {
    mockFetch.mockResolvedValueOnce(
      makeHtmlResponse(
        "<html><head><title>Now Has Title</title><meta name='description' content='Now has desc'></head><body><h1>Heading</h1></body></html>",
        200,
        150
      )
    );

    const previousIssues: TechnicalIssue[] = [
      { id: "1", url: "https://example.com/page", type: "missing_title", severity: "HIGH", state: "OPEN" },
      { id: "2", url: "https://example.com/page", type: "missing_description", severity: "MEDIUM", state: "OPEN" },
      { id: "3", url: "https://example.com/page", type: "missing_h1", severity: "MEDIUM", state: "OPEN" },
    ];

    const result = await verifyRecrawl(
      "https://example.com/page",
      previousIssues
    );

    expect(result.fixed).toHaveLength(3);
    expect(result.regressed).toHaveLength(0);
    expect(result.stillOpen).toHaveLength(0);
  });

  it("marks issues as REGRESSED when recrawl shows new problems", async () => {
    mockFetch.mockResolvedValueOnce(
      makeHtmlResponse(
        "<html><head></head><body></body></html>",
        500,
        5000
      )
    );

    const previousIssues: TechnicalIssue[] = [
      { id: "1", url: "https://example.com/page", type: "missing_title", severity: "HIGH", state: "OPEN" },
    ];

    const result = await verifyRecrawl(
      "https://example.com/page",
      previousIssues
    );

    expect(result.regressed.length).toBeGreaterThan(0);
  });

  it("keeps issues OPEN when they are not yet fixed", async () => {
    mockFetch.mockResolvedValueOnce(
      makeHtmlResponse(
        "<html><head></head><body></body></html>",
        200,
        100
      )
    );

    const previousIssues: TechnicalIssue[] = [
      { id: "1", url: "https://example.com/page", type: "missing_title", severity: "HIGH", state: "OPEN" },
    ];

    const result = await verifyRecrawl(
      "https://example.com/page",
      previousIssues
    );

    expect(result.stillOpen).toHaveLength(1);
    expect(result.fixed).toHaveLength(0);
  });
});
