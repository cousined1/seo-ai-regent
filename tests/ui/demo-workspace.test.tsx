import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DemoWorkspace } from "@/components/demo/demo-workspace";

describe("DemoWorkspace", () => {
  it("hydrates the editor from the demo article API route", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        article: {
          title: "How to Start a Blog in 2026",
          keyword: "how to start a blog",
          content:
            "How to start a blog in 2026 begins with a tight niche, a publishing system, and a content model that can rank in Google while remaining extractable for AI search.",
        },
        contentScore: {
          overall: 74,
          termFrequency: 78,
          entityCoverage: 68,
          headingStructure: 62,
          wordCount: 80,
          readability: 84,
          internalLinks: 35,
          geoSignals: 58,
        },
        geoScore: {
          overall: 64,
          entityAuthority: 61,
          factualDensity: 48,
          answerFormat: 75,
          sourceCredibility: 66,
          freshness: 52,
        },
        topActions: [
          {
            area: "GEO",
            signal: "factualDensity",
            title: "Add cited statistics",
            detail: "Support the draft with attributed figures and named-source evidence.",
            lift: 6,
            liftLabel: "+6 GEO pts",
          },
          {
            area: "Content",
            signal: "internalLinks",
            title: "Add internal navigation paths",
            detail: "Link the draft to supporting pages so the score reflects stronger site structure.",
            lift: 5,
            liftLabel: "+5 Content pts",
          },
          {
            area: "Content",
            signal: "entityCoverage",
            title: "Expand entity coverage",
            detail: "Bring in named tools, publishers, and platforms the query expects.",
            lift: 4,
            liftLabel: "+4 Content pts",
          },
        ],
        terms: {
          required: ["how to start a blog"],
          recommended: ["editorial system"],
          optional: ["internal linking"],
        },
        contentBreakdown: [
          {
            signal: "termFrequency",
            score: 78,
            weight: 0.2,
            contribution: 15.6,
            status: "strong",
          },
        ],
        geoBreakdown: [
          {
            signal: "factualDensity",
            score: 48,
            weight: 0.24,
            contribution: 11.52,
            status: "critical",
          },
        ],
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<DemoWorkspace />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/demo/article");
    });

    expect((await screen.findAllByText(/how to start a blog/i)).length).toBeGreaterThanOrEqual(1);
    expect(
      await screen.findByText(/how to start a blog in 2026 begins with a tight niche/i),
    ).toBeTruthy();
    expect(await screen.findByText(/add cited statistics/i)).toBeTruthy();

    vi.unstubAllGlobals();
  });
});
