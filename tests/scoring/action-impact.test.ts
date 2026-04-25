import { describe, expect, it } from "vitest";

import {
  createActionImpactEntries,
  deriveActionImpactInsights,
  mergeActionImpactEntries,
} from "@/lib/scoring/action-impact";

describe("action-impact", () => {
  it("derives ranked insight summaries from observed score movement", () => {
    const entries = createActionImpactEntries({
      actions: [
        {
          area: "Content",
          signal: "headingStructure",
          title: "Introduce stronger structural framing",
          detail: "",
          lift: 5.5,
          liftLabel: "+5.5 Content pts",
        },
      ],
      previous: {
        contentOverall: 74,
        geoOverall: 64,
      },
      current: {
        contentOverall: 88,
        geoOverall: 83,
      },
    });

    const insights = deriveActionImpactInsights(entries);

    expect(insights).toEqual([
      {
        key: "Content-headingStructure",
        title: "Introduce stronger structural framing",
        summary: "+14 Content | +19 GEO",
      },
    ]);
  });

  it("merges repeated entries for the same action and keeps the strongest first", () => {
    const merged = mergeActionImpactEntries(
      [
        {
          key: "Content-headingStructure",
          title: "Introduce stronger structural framing",
          signal: "headingStructure",
          area: "Content",
          contentDelta: 4,
          geoDelta: 2,
          totalDelta: 6,
        },
      ],
      [
        {
          key: "Content-headingStructure",
          title: "Introduce stronger structural framing",
          signal: "headingStructure",
          area: "Content",
          contentDelta: 3,
          geoDelta: 1,
          totalDelta: 4,
        },
        {
          key: "GEO-factualDensity",
          title: "Add cited statistics",
          signal: "factualDensity",
          area: "GEO",
          contentDelta: 1,
          geoDelta: 1,
          totalDelta: 2,
        },
      ],
    );

    expect(merged[0]).toMatchObject({
      key: "Content-headingStructure",
      contentDelta: 7,
      geoDelta: 3,
      totalDelta: 10,
    });
    expect(merged[1]).toMatchObject({
      key: "GEO-factualDensity",
      totalDelta: 2,
    });
  });
});
