import { describe, expect, it } from "vitest";

import { validatePublishGate, buildPublishPayload, formatArticleForCms } from "@/lib/publishing/service";

describe("validatePublishGate", () => {
  it("allows publishing when both scores are >= 70", () => {
    const result = validatePublishGate({
      contentScore: 75,
      geoScore: 70,
      publishEligible: true,
    });

    expect(result.allowed).toBe(true);
    expect(result.blockReason).toBeNull();
  });

  it("blocks publishing when content score is below 70", () => {
    const result = validatePublishGate({
      contentScore: 65,
      geoScore: 80,
      publishEligible: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.blockReason).toContain("Content Score");
  });

  it("blocks publishing when geo score is below 70", () => {
    const result = validatePublishGate({
      contentScore: 80,
      geoScore: 60,
      publishEligible: false,
    });

    expect(result.allowed).toBe(false);
    expect(result.blockReason).toContain("GEO Score");
  });

  it("blocks publishing when publishEligible is false", () => {
    const result = validatePublishGate({
      contentScore: 70,
      geoScore: 70,
      publishEligible: false,
    });

    expect(result.allowed).toBe(false);
  });

  it("allows at exact threshold of 70", () => {
    const result = validatePublishGate({
      contentScore: 70,
      geoScore: 70,
      publishEligible: true,
    });

    expect(result.allowed).toBe(true);
  });
});

describe("buildPublishPayload", () => {
  it("builds WordPress payload with title, content, and status", () => {
    const payload = buildPublishPayload("WORDPRESS", {
      title: "Test Article",
      content: "<p>Hello World</p>",
      metaTitle: "Meta Title",
      metaDescription: "Meta Description",
      keyword: "test keyword",
    });

    expect(payload).toHaveProperty("title");
    expect(payload).toHaveProperty("content");
    expect(payload).toHaveProperty("status");
    expect(payload.title).toBe("Test Article");
  });

  it("builds Webflow payload with CMS item structure", () => {
    const payload = buildPublishPayload("WEBFLOW", {
      title: "Test Article",
      content: "<p>Hello World</p>",
      metaTitle: "Meta Title",
      metaDescription: "Meta Description",
      keyword: "test keyword",
    });

    expect(payload).toHaveProperty("name");
    expect(payload).toHaveProperty("slug");
  });

  it("builds Ghost payload with markdown format", () => {
    const payload = buildPublishPayload("GHOST", {
      title: "Test Article",
      content: "<p>Hello World</p>",
      metaTitle: "Meta Title",
      metaDescription: "Meta Description",
      keyword: "test keyword",
    });

    expect(payload).toHaveProperty("posts");
    expect((payload as any).posts[0]).toHaveProperty("title");
    expect((payload as any).posts[0]).toHaveProperty("html");
  });

  it("builds webhook payload with full article metadata", () => {
    const payload = buildPublishPayload("WEBHOOK", {
      title: "Test Article",
      content: "<p>Hello World</p>",
      metaTitle: "Meta Title",
      metaDescription: "Meta Description",
      keyword: "test keyword",
    });

    expect(payload).toHaveProperty("title");
    expect(payload).toHaveProperty("content");
    expect(payload).toHaveProperty("metaTitle");
    expect(payload).toHaveProperty("metaDescription");
  });
});

describe("formatArticleForCms", () => {
  it("converts TipTap JSON to HTML for WordPress", () => {
    const tipTapContent = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Title" }] },
        { type: "paragraph", content: [{ type: "text", text: "Content here" }] },
      ],
    };

    const html = formatArticleForCms("WORDPRESS", tipTapContent as any);
    expect(html).toContain("<h1>");
    expect(html).toContain("Title");
    expect(html).toContain("<p>");
    expect(html).toContain("Content here");
  });

  it("converts TipTap JSON to markdown for Ghost", () => {
    const tipTapContent = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Title" }] },
        { type: "paragraph", content: [{ type: "text", text: "Content here" }] },
      ],
    };

    const markdown = formatArticleForCms("GHOST", tipTapContent as any);
    expect(markdown).toContain("# Title");
    expect(markdown).toContain("Content here");
  });
});
