import { describe, expect, it } from "vitest";

import { parseCsvUrls, extractPageMetadata, detectContentIssues } from "@/lib/inventory/import";

describe("parseCsvUrls", () => {
  it("parses a simple CSV of URLs", () => {
    const csv = `url
https://example.com/page-1
https://example.com/page-2
https://example.com/blog/post-1`;

    const urls = parseCsvUrls(csv);
    expect(urls).toHaveLength(3);
    expect(urls).toContain("https://example.com/page-1");
    expect(urls).toContain("https://example.com/page-2");
    expect(urls).toContain("https://example.com/blog/post-1");
  });

  it("handles CSV with additional columns", () => {
    const csv = `url,title,last_modified
https://example.com/page-1,Page One,2026-01-15
https://example.com/page-2,Page Two,2026-02-20`;

    const urls = parseCsvUrls(csv);
    expect(urls).toHaveLength(2);
    expect(urls).toContain("https://example.com/page-1");
  });

  it("ignores empty lines and whitespace", () => {
    const csv = `url
https://example.com/page-1

https://example.com/page-2
   `;

    const urls = parseCsvUrls(csv);
    expect(urls).toHaveLength(2);
  });

  it("filters out invalid URLs", () => {
    const csv = `url
https://example.com/valid
not-a-url
ftp://example.com/ftp
http://example.com/http-valid`;

    const urls = parseCsvUrls(csv);
    expect(urls).toHaveLength(2);
    expect(urls).toContain("https://example.com/valid");
    expect(urls).toContain("http://example.com/http-valid");
  });

  it("returns empty array for empty input", () => {
    expect(parseCsvUrls("")).toHaveLength(0);
    expect(parseCsvUrls("url")).toHaveLength(0);
  });
});

describe("extractPageMetadata", () => {
  it("extracts title, meta description, and headings from HTML", () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Test Page Title</title>
  <meta name="description" content="This is the meta description">
</head>
<body>
  <h1>Main Heading</h1>
  <h2>Subheading One</h2>
  <h2>Subheading Two</h2>
  <p>Some content here.</p>
</body>
</html>`;

    const metadata = extractPageMetadata(html);
    expect(metadata.title).toBe("Test Page Title");
    expect(metadata.metaDescription).toBe("This is the meta description");
    expect(metadata.headings).toEqual(["Main Heading", "Subheading One", "Subheading Two"]);
    expect(metadata.bodyText).toContain("Some content here");
  });

  it("handles missing meta description", () => {
    const html = `<html><head><title>No Description</title></head><body><p>Content</p></body></html>`;
    const metadata = extractPageMetadata(html);
    expect(metadata.title).toBe("No Description");
    expect(metadata.metaDescription).toBeNull();
  });

  it("handles missing title", () => {
    const html = `<html><head></head><body><p>Content</p></body></html>`;
    const metadata = extractPageMetadata(html);
    expect(metadata.title).toBeNull();
  });

  it("extracts canonical URL if present", () => {
    const html = `<html><head><link rel="canonical" href="https://example.com/canonical"></head><body></body></html>`;
    const metadata = extractPageMetadata(html);
    expect(metadata.canonicalUrl).toBe("https://example.com/canonical");
  });

  it("handles empty HTML", () => {
    const metadata = extractPageMetadata("");
    expect(metadata.title).toBeNull();
    expect(metadata.metaDescription).toBeNull();
    expect(metadata.headings).toEqual([]);
    expect(metadata.bodyText).toBe("");
  });
});

describe("detectContentIssues", () => {
  it("detects thin content", () => {
    const item = {
      url: "https://example.com/thin",
      title: "Thin Page",
      metaDescription: null as string | null,
      bodyText: "Just a few words here.",
      wordCount: 5,
    };

    const issues = detectContentIssues(item);
    expect(issues.some((i) => i.type === "THIN_CONTENT")).toBe(true);
  });

  it("detects missing meta description", () => {
    const item = {
      url: "https://example.com/no-meta",
      title: "No Meta",
      metaDescription: null as string | null,
      bodyText: "Some content that is long enough to not be thin.",
      wordCount: 100,
    };

    const issues = detectContentIssues(item);
    expect(issues.some((i) => i.type === "MISSING_META_DESCRIPTION")).toBe(true);
  });

  it("detects missing title", () => {
    const item = {
      url: "https://example.com/no-title",
      title: null as string | null,
      metaDescription: "A description",
      bodyText: "Some content that is long enough to not be thin.",
      wordCount: 100,
    };

    const issues = detectContentIssues(item);
    expect(issues.some((i) => i.type === "MISSING_TITLE")).toBe(true);
  });

  it("detects short title", () => {
    const item = {
      url: "https://example.com/short-title",
      title: "Hi",
      metaDescription: "A description",
      bodyText: "Some content that is long enough to not be thin.",
      wordCount: 100,
    };

    const issues = detectContentIssues(item);
    expect(issues.some((i) => i.type === "SHORT_TITLE")).toBe(true);
  });

  it("detects long title", () => {
    const item = {
      url: "https://example.com/long-title",
      title: "A".repeat(70),
      metaDescription: "A description",
      bodyText: "Some content that is long enough to not be thin.",
      wordCount: 100,
    };

    const issues = detectContentIssues(item);
    expect(issues.some((i) => i.type === "LONG_TITLE")).toBe(true);
  });

  it("returns no issues for healthy content", () => {
    const item = {
      url: "https://example.com/healthy",
      title: "A Well-Optimized Page Title Here",
      metaDescription: "This is a proper meta description that is exactly within the recommended range of 120 to 160 characters for search results display.",
      bodyText: "This is a comprehensive article with sufficient content to not be considered thin. It has multiple paragraphs, headings, and covers the topic thoroughly with relevant information for readers and search engines alike.",
      wordCount: 300,
    };

    const issues = detectContentIssues(item);
    expect(issues).toHaveLength(0);
  });
});
