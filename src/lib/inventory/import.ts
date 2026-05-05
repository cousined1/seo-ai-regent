export interface PageMetadata {
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  headings: string[];
  bodyText: string;
  wordCount: number;
}

export interface ContentIssue {
  type: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

export function parseCsvUrls(csv: string): string[] {
  if (!csv || csv.trim() === "") {
    return [];
  }

  const lines = csv.split("\n").map((line) => line.trim()).filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const header = lines[0].toLowerCase();
  const urlColumnIndex = header.split(",").findIndex((col) => col.trim() === "url");

  if (urlColumnIndex === -1) {
    return [];
  }

  const urls: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const columns = lines[i].split(",");
    const url = columns[urlColumnIndex]?.trim();

    if (url && isValidUrl(url)) {
      urls.push(url);
    }
  }

  return [...new Set(urls)];
}

export function extractPageMetadata(html: string): PageMetadata {
  if (!html) {
    return {
      title: null,
      metaDescription: null,
      canonicalUrl: null,
      headings: [],
      bodyText: "",
      wordCount: 0,
    };
  }

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  const metaDescMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  ) ?? html.match(
    /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i,
  );
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : null;

  const canonicalMatch = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i,
  ) ?? html.match(
    /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i,
  );
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;

  const headings: string[] = [];
  const headingRegex = /<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi;
  let headingMatch;
  while ((headingMatch = headingRegex.exec(html)) !== null) {
    const text = headingMatch[1].trim();
    if (text) {
      headings.push(text);
    }
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;

  const textContent = bodyContent
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = textContent.split(/\s+/).filter(Boolean);

  return {
    title,
    metaDescription,
    canonicalUrl,
    headings,
    bodyText: textContent,
    wordCount: words.length,
  };
}

export interface ContentIssueInput {
  url: string;
  title: string | null;
  metaDescription: string | null;
  bodyText: string;
  wordCount: number;
}

export function detectContentIssues(input: ContentIssueInput): ContentIssue[] {
  const issues: ContentIssue[] = [];

  if (!input.title) {
    issues.push({
      type: "MISSING_TITLE",
      severity: "critical",
      message: "Page has no title tag.",
    });
  } else if (input.title.length < 20) {
    issues.push({
      type: "SHORT_TITLE",
      severity: "warning",
      message: `Title is too short (${input.title.length} chars). Aim for 30-60 characters.`,
    });
  } else if (input.title.length > 60) {
    issues.push({
      type: "LONG_TITLE",
      severity: "warning",
      message: `Title is too long (${input.title.length} chars). May be truncated in search results.`,
    });
  }

  if (!input.metaDescription) {
    issues.push({
      type: "MISSING_META_DESCRIPTION",
      severity: "warning",
      message: "Page has no meta description.",
    });
  } else if (input.metaDescription.length < 120) {
    issues.push({
      type: "SHORT_META_DESCRIPTION",
      severity: "info",
      message: `Meta description is short (${input.metaDescription.length} chars). Aim for 120-160 characters.`,
    });
  } else if (input.metaDescription.length > 160) {
    issues.push({
      type: "LONG_META_DESCRIPTION",
      severity: "info",
      message: `Meta description is long (${input.metaDescription.length} chars). May be truncated.`,
    });
  }

  if (input.wordCount < 100) {
    issues.push({
      type: "THIN_CONTENT",
      severity: "critical",
      message: `Content is thin (${input.wordCount} words). Aim for at least 300 words.`,
    });
  } else if (input.wordCount < 300) {
    issues.push({
      type: "LOW_WORD_COUNT",
      severity: "warning",
      message: `Content is short (${input.wordCount} words). Consider expanding to 300+ words.`,
    });
  }

  return issues;
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
