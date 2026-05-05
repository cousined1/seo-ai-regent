import type { CmsPlatform } from "@prisma/client";
import type { TipTapNode } from "@/lib/articles/scoring-pipeline";

export interface PublishGateInput {
  contentScore: number;
  geoScore: number | null;
  publishEligible: boolean;
}

export interface PublishGateResult {
  allowed: boolean;
  blockReason: string | null;
}

export function validatePublishGate(input: PublishGateInput): PublishGateResult {
  if (!input.publishEligible) {
    return {
      allowed: false,
      blockReason: "Article has not passed the scoring review gate. Both Content Score and GEO Score must be 70+ to publish.",
    };
  }

  if (input.contentScore < 70) {
    return {
      allowed: false,
      blockReason: `Content Score ${input.contentScore}/100 is below the 70-point threshold. Articles below 70 cannot be published.`,
    };
  }

  if (input.geoScore === null || input.geoScore < 70) {
    const score = input.geoScore ?? "not computed";
    return {
      allowed: false,
      blockReason: `GEO Score ${score}/100 is below the 70-point threshold. Articles below 70 cannot be published.`,
    };
  }

  return {
    allowed: true,
    blockReason: null,
  };
}

export interface ArticleContent {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
}

export function formatArticleForCms(platform: CmsPlatform, tipTapContent: TipTapNode): string {
  const textContent = extractTextFromTipTap(tipTapContent);

  if (platform === "GHOST" || platform === "NOTION") {
    return tipTapToMarkdown(tipTapContent);
  }

  return tipTapToHtml(tipTapContent);
}

export function buildPublishPayload(platform: CmsPlatform, article: ArticleContent): Record<string, unknown> {
  const slug = article.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  switch (platform) {
    case "WORDPRESS":
      return {
        title: article.title,
        content: article.content,
        status: "draft",
        slug,
        meta_title: article.metaTitle,
        meta_description: article.metaDescription,
        categories: [],
        tags: [article.keyword],
      };

    case "WEBFLOW":
      return {
        name: article.title,
        slug,
        content: article.content,
        "meta-title": article.metaTitle,
        "meta-description": article.metaDescription,
        "published": false,
      };

    case "SHOPIFY":
      return {
        blog_article: {
          title: article.title,
          body_html: article.content,
          handle: slug,
          tags: article.keyword,
          metafields: [
            { key: "meta_title", value: article.metaTitle, type: "single_line_text_field" },
            { key: "meta_description", value: article.metaDescription, type: "single_line_text_field" },
          ],
        },
      };

    case "GHOST":
      return {
        posts: [{
          title: article.title,
          html: article.content,
          slug,
          meta_title: article.metaTitle,
          meta_description: article.metaDescription,
          status: "draft",
          tags: [{ name: article.keyword }],
        }],
      };

    case "NOTION":
      return {
        title: article.title,
        content: article.content,
        properties: {
          Title: { title: [{ text: { content: article.title } }] },
          Keyword: { rich_text: [{ text: { content: article.keyword } }] },
        },
      };

    case "WEBHOOK":
      return {
        title: article.title,
        content: article.content,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        keyword: article.keyword,
        slug,
        platform: "webhook",
      };

    default:
      throw new Error(`Unsupported CMS platform: ${platform}`);
  }
}

function extractTextFromTipTap(node: TipTapNode): string {
  if (node.text) {
    return node.text;
  }
  if (node.content) {
    return node.content.map(extractTextFromTipTap).join(" ");
  }
  return "";
}

function coerceHeadingLevel(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return 1;
  }
  const clamped = Math.floor(numeric);
  if (clamped < 1) return 1;
  if (clamped > 6) return 6;
  return clamped;
}

function tipTapToHtml(node: TipTapNode): string {
  if (node.text) {
    return node.text;
  }

  if (!node.content) {
    return "";
  }

  const children = node.content.map(tipTapToHtml).join("");

  switch (node.type) {
    case "doc":
      return children;
    case "heading": {
      const level = coerceHeadingLevel(node.attrs?.level);
      return `<h${level}>${children}</h${level}>`;
    }
    case "paragraph":
      return `<p>${children}</p>`;
    case "bulletList":
      return `<ul>${children}</ul>`;
    case "orderedList":
      return `<ol>${children}</ol>`;
    case "listItem":
      return `<li>${children}</li>`;
    case "blockquote":
      return `<blockquote>${children}</blockquote>`;
    case "codeBlock":
      return `<pre><code>${children}</code></pre>`;
    case "hardBreak":
      return "<br>";
    case "horizontalRule":
      return "<hr>";
    default:
      return children;
  }
}

function tipTapToMarkdown(node: TipTapNode, depth = 0): string {
  if (node.text) {
    return node.text;
  }

  if (!node.content) {
    return "";
  }

  const children = node.content.map((child) => tipTapToMarkdown(child, depth + 1)).join("");

  switch (node.type) {
    case "doc":
      return children;
    case "heading": {
      const level = coerceHeadingLevel(node.attrs?.level);
      const prefix = "#".repeat(level);
      return `${prefix} ${children}\n\n`;
    }
    case "paragraph":
      return `${children}\n\n`;
    case "bulletList":
      return `${children}\n`;
    case "orderedList":
      return `${children}\n`;
    case "listItem":
      return `- ${children}\n`;
    case "blockquote":
      return `> ${children}\n`;
    case "codeBlock":
      return `\`\`\`\n${children}\n\`\`\`\n\n`;
    case "hardBreak":
      return "\n";
    case "horizontalRule":
      return "\n---\n\n";
    default:
      return children;
  }
}
