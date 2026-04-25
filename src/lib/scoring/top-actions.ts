import type { ContentScore, GeoScore, TopAction } from "@/lib/scoring/types";
import { contentWeights, geoWeights } from "@/lib/scoring/weights";

function round(value: number) {
  return Number(value.toFixed(2));
}

const actionCopy: Record<string, { title: string; detail: string }> = {
  termFrequency: {
    title: "Tighten keyword-to-intent coverage",
    detail: "Use the target phrase and adjacent terms earlier and more explicitly in the passage.",
  },
  entityCoverage: {
    title: "Add named entities and retrieval anchors",
    detail: "Reference products, firms, standards, and systems the model can associate with the topic.",
  },
  headingStructure: {
    title: "Introduce stronger structural framing",
    detail: "Add headings or section cues so the passage is easier to parse and reuse.",
  },
  wordCount: {
    title: "Move into a publishable answer block length",
    detail: "Expand the passage into a complete answer instead of a thin fragment.",
  },
  readability: {
    title: "Reduce sentence complexity",
    detail: "Shorter sentences and cleaner cadence improve extraction and human comprehension.",
  },
  internalLinks: {
    title: "Add internal navigation paths",
    detail: "Link the passage to relevant supporting pages so traditional SEO and UX both improve.",
  },
  geoSignals: {
    title: "Improve AI-retrieval readiness",
    detail: "Strengthen answer-first blocks, factual cues, and machine-readable support around the page.",
  },
  entityAuthority: {
    title: "Cite stronger authority entities",
    detail: "Anchor claims to trusted organizations and named sources that models already recognize.",
  },
  factualDensity: {
    title: "Increase factual density",
    detail: "Add dates, explicit figures, and attributed evidence to make the passage more citable.",
  },
  answerFormat: {
    title: "Lead with a direct answer",
    detail: "Open with a self-contained answer sentence before adding explanation.",
  },
  sourceCredibility: {
    title: "Strengthen attribution",
    detail: "Attribute claims to credible sources rather than leaving them implied.",
  },
  freshness: {
    title: "Update recency signals",
    detail: "Include current-year evidence or recently sourced facts to improve trust and retrieval.",
  },
};

export function deriveTopActions(input: {
  content: ContentScore;
  geo: GeoScore;
}): TopAction[] {
  const contentActions = Object.entries(contentWeights).map(([signal, weight]) => {
    const score = input.content[signal as keyof Omit<ContentScore, "overall">];
    const lift = round(((100 - score) * weight) / 2);
    const copy = actionCopy[signal];

    return {
      area: "Content" as const,
      signal,
      title: copy.title,
      detail: copy.detail,
      lift,
      liftLabel: `+${lift} Content pts`,
    };
  });

  const geoActions = Object.entries(geoWeights).map(([signal, weight]) => {
    const score = input.geo[signal as keyof Omit<GeoScore, "overall">];
    const lift = round(((100 - score) * weight) / 2);
    const copy = actionCopy[signal];

    return {
      area: "GEO" as const,
      signal,
      title: copy.title,
      detail: copy.detail,
      lift,
      liftLabel: `+${lift} GEO pts`,
    };
  });

  return [...contentActions, ...geoActions]
    .sort((left, right) => right.lift - left.lift)
    .slice(0, 3);
}
