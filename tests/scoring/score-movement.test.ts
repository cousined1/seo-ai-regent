import { describe, expect, it } from "vitest";

import { deriveScoreMovement } from "@/lib/scoring/score-movement";

describe("deriveScoreMovement", () => {
  it("returns before, after, and signed delta labels for content and GEO scores", () => {
    const movement = deriveScoreMovement({
      previous: {
        contentOverall: 74,
        geoOverall: 64,
      },
      current: {
        contentOverall: 88,
        geoOverall: 83,
      },
    });

    expect(movement.content.before).toBe(74);
    expect(movement.content.after).toBe(88);
    expect(movement.content.delta).toBe(14);
    expect(movement.content.deltaLabel).toBe("+14");
    expect(movement.geo.deltaLabel).toBe("+19");
  });
});
