import { describe, expect, it } from "vitest";

import { deriveInlineGuidance } from "@/lib/scoring/inline-guidance";

describe("deriveInlineGuidance", () => {
  it("assigns lift labels to missing terms, structure guidance, and priority actions", () => {
    const guidance = deriveInlineGuidance({
      content:
        "How to start a blog in 2026 improves when search intent is explicit, but the opening is still one long block.",
      terms: {
        required: ["entity authority"],
        recommended: ["search intent"],
        optional: ["internal links"],
      },
      topActions: [
        {
          area: "Content",
          signal: "headingStructure",
          title: "Introduce stronger structural framing",
          detail: "Add headings or section cues so the passage is easier to parse and reuse.",
          lift: 5.5,
          liftLabel: "+5.5 Content pts",
        },
        {
          area: "Content",
          signal: "termFrequency",
          title: "Tighten keyword-to-intent coverage",
          detail: "Use the target phrase and adjacent terms earlier and more explicitly in the passage.",
          lift: 4,
          liftLabel: "+4 Content pts",
        },
        {
          area: "GEO",
          signal: "factualDensity",
          title: "Increase factual density",
          detail: "Add dates, explicit figures, and attributed evidence to make the passage more citable.",
          lift: 6,
          liftLabel: "+6 GEO pts",
        },
      ],
    });

    expect(guidance.missingRequired[0]?.term).toBe("entity authority");
    expect(guidance.missingRequired[0]?.liftLabel).toBe("+4 Content pts");
    expect(guidance.missingRecommended).toHaveLength(0);
    expect(guidance.structureCue.liftLabel).toBe("+5.5 Content pts");
    expect(guidance.priorityAction?.liftLabel).toBe("+5.5 Content pts");
  });

  it("marks structure and priority guidance as completed when the draft resolves them", () => {
    const guidance = deriveInlineGuidance({
      content: [
        "How to start a blog in 2026 begins with a direct answer.",
        "Supporting evidence:",
        "- Add one cited statistic",
        "- Add one named source",
        "- Add one internal reference",
      ].join("\n\n"),
      terms: {
        required: ["entity authority"],
        recommended: ["search intent"],
        optional: ["internal links"],
      },
      topActions: [
        {
          area: "Content",
          signal: "headingStructure",
          title: "Introduce stronger structural framing",
          detail: "Add headings or section cues so the passage is easier to parse and reuse.",
          lift: 5.5,
          liftLabel: "+5.5 Content pts",
        },
      ],
    });

    expect(guidance.structureCue.status).toBe("completed");
    expect(guidance.structureCue.statusLabel).toBe("Completed");
    expect(guidance.priorityAction?.status).toBe("completed");
    expect(guidance.priorityAction?.statusLabel).toBe("Completed");
  });
});
