import { describe, expect, it } from "vitest";

import { parseSitemap, normalizeUrl, isAllowedByRobots, deduplicateUrls } from "@/lib/crawls/sitemap";

describe("parseSitemap", () => {
  it("extracts URLs from a valid sitemap XML", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://example.com/page-1</loc></url>
        <url><loc>https://example.com/page-2</loc></url>
        <url><loc>https://example.com/blog/post-1</loc></url>
      </urlset>`;

    const urls = parseSitemap(xml, "https://example.com");
    expect(urls).toHaveLength(3);
    expect(urls).toContain("https://example.com/page-1");
    expect(urls).toContain("https://example.com/page-2");
    expect(urls).toContain("https://example.com/blog/post-1");
  });

  it("returns empty array for invalid XML", () => {
    const urls = parseSitemap("not xml", "https://example.com");
    expect(urls).toHaveLength(0);
  });

  it("returns empty array for empty XML", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    const urls = parseSitemap(xml, "https://example.com");
    expect(urls).toHaveLength(0);
  });

  it("handles sitemap with image and video extensions", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        <url><loc>https://example.com/page-1</loc></url>
      </urlset>`;

    const urls = parseSitemap(xml, "https://example.com");
    expect(urls).toContain("https://example.com/page-1");
  });
});

describe("normalizeUrl", () => {
  it("removes trailing slashes", () => {
    expect(normalizeUrl("https://example.com/page/")).toBe("https://example.com/page");
  });

  it("preserves URLs without trailing slashes", () => {
    expect(normalizeUrl("https://example.com/page")).toBe("https://example.com/page");
  });

  it("lowercases the domain", () => {
    expect(normalizeUrl("https://Example.COM/page")).toBe("https://example.com/page");
  });

  it("removes fragments", () => {
    expect(normalizeUrl("https://example.com/page#section")).toBe("https://example.com/page");
  });

  it("preserves query parameters", () => {
    expect(normalizeUrl("https://example.com/page?foo=bar")).toBe("https://example.com/page?foo=bar");
  });
});

describe("isAllowedByRobots", () => {
  it("allows URLs not disallowed by robots.txt", () => {
    const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /private/`;

    expect(isAllowedByRobots("https://example.com/blog", robotsTxt)).toBe(true);
  });

  it("blocks URLs matching Disallow rules", () => {
    const robotsTxt = `User-agent: *
Disallow: /admin/
Disallow: /private/`;

    expect(isAllowedByRobots("https://example.com/admin/dashboard", robotsTxt)).toBe(false);
  });

  it("allows when robots.txt is empty", () => {
    expect(isAllowedByRobots("https://example.com/page", "")).toBe(true);
  });

  it("allows when robots.txt is not provided", () => {
    expect(isAllowedByRobots("https://example.com/page", null)).toBe(true);
  });
});

describe("deduplicateUrls", () => {
  it("removes duplicate URLs", () => {
    const urls = [
      "https://example.com/page-1",
      "https://example.com/page-2",
      "https://example.com/page-1",
    ];

    const deduped = deduplicateUrls(urls);
    expect(deduped).toHaveLength(2);
  });

  it("normalizes before deduplicating", () => {
    const urls = [
      "https://example.com/page-1",
      "https://example.com/page-1/",
      "https://EXAMPLE.COM/page-1",
    ];

    const deduped = deduplicateUrls(urls);
    expect(deduped).toHaveLength(1);
  });

  it("handles empty input", () => {
    expect(deduplicateUrls([])).toHaveLength(0);
  });
});
