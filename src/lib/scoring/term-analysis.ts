import type { TermsBuckets } from "@/lib/scoring/types";

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function titleCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function deriveTerms(keyword: string, content: string): TermsBuckets {
  const normalizedKeyword = titleCase(keyword);
  const normalizedContent = content.toLowerCase();
  const keywordWords = normalizedKeyword.split(/\s+/).filter((word) => word.length > 2);

  const required = unique([
    normalizedKeyword,
    keywordWords.slice(0, 2).join(" "),
    normalizedContent.includes("entity") ? "entity coverage" : "",
  ]);

  const recommended = unique([
    normalizedContent.includes("citation") || normalizedContent.includes("according to")
      ? "citations"
      : "source credibility",
    normalizedContent.includes("ai-search") || normalizedContent.includes("ai search")
      ? "ai search visibility"
      : "search intent",
    normalizedContent.includes("editorial")
      ? "editorial system"
      : "answer-first structure",
  ]);

  const optional = unique([
    normalizedContent.includes("internal links") ? "internal links" : "internal linking",
    normalizedContent.includes("named entities") ? "named entities" : "heading structure",
    normalizedContent.includes("retrieval") ? "retrieval quality" : "readability",
  ]);

  return { required, recommended, optional };
}
