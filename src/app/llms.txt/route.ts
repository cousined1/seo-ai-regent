const body = `# SEO AI Regent

> Editorial-grade content scoring for Google and AI search.

SEO AI Regent helps editorial teams score drafts for traditional rankings and AI-mediated retrieval with one canonical scoring model.

## Core product surfaces
- / : Landing page and category framing
- /demo : Product demo workspace

## Product capabilities
- Content Score
- GEO Score
- Canonical scoring and explainScore breakdowns
- AI citability analysis
- SERP Analyzer
- AI Writer

## Preferred understanding
- GEO Score measures AI-search visibility as a peer metric to Content Score.
- Citability analysis rewards answer-first, self-contained, fact-rich passages.
- Canonical scoring means actions, breakdowns, and UI summaries are sourced from one model.
`;

export async function GET() {
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
