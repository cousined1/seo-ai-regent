import { describe, it, expect } from "vitest";
import {
  calculateCitationScore,
  aggregateTrend,
  detectCitationChanges,
  type CitationRecord,
  type CitationTrendResult,
  type CitationChange,
} from "@/lib/citations/service";

describe("calculateCitationScore", () => {
  it("returns high score when cited on all engines at top positions", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: true, position: 1 },
      { engine: "CLAUDE", found: true, position: 1 },
      { engine: "GEMINI", found: true, position: 1 },
    ];

    const score = calculateCitationScore(records);
    expect(score).toBe(100);
  });

  it("returns 0 when not cited on any engine", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: false },
      { engine: "PERPLEXITY", found: false },
      { engine: "CLAUDE", found: false },
      { engine: "GEMINI", found: false },
    ];

    const score = calculateCitationScore(records);
    expect(score).toBe(0);
  });

  it("returns ~50 when cited on half the engines", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: true, position: 1 },
      { engine: "CLAUDE", found: false },
      { engine: "GEMINI", found: false },
    ];

    const score = calculateCitationScore(records);
    expect(score).toBe(50);
  });

  it("handles empty records", () => {
    const score = calculateCitationScore([]);
    expect(score).toBe(0);
  });

  it("weights position into score", () => {
    const topRecords: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: true, position: 1 },
    ];

    const lowRecords: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 10 },
      { engine: "PERPLEXITY", found: true, position: 10 },
    ];

    const topScore = calculateCitationScore(topRecords);
    const lowScore = calculateCitationScore(lowRecords);

    expect(topScore).toBeGreaterThan(lowScore);
  });
});

describe("aggregateTrend", () => {
  it("aggregates citation checks into trend data", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1, checkedAt: new Date("2026-05-01") },
      { engine: "PERPLEXITY", found: true, position: 2, checkedAt: new Date("2026-05-01") },
      { engine: "CLAUDE", found: false, checkedAt: new Date("2026-05-01") },
      { engine: "GEMINI", found: true, position: 3, checkedAt: new Date("2026-05-01") },
    ];

    const trend = aggregateTrend(records, "2026-05");

    expect(trend.citationScore).toBeGreaterThan(0);
    expect(trend.totalChecks).toBe(4);
    expect(trend.foundCount).toBe(3);
    expect(trend.period).toBe("2026-05");
  });

  it("calculates average position for found citations", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1, checkedAt: new Date("2026-05-01") },
      { engine: "PERPLEXITY", found: true, position: 3, checkedAt: new Date("2026-05-01") },
    ];

    const trend = aggregateTrend(records, "2026-05");

    expect(trend.avgPosition).toBe(2);
  });

  it("returns null avgPosition when no citations found", () => {
    const records: CitationRecord[] = [
      { engine: "CHATGPT", found: false, checkedAt: new Date("2026-05-01") },
      { engine: "PERPLEXITY", found: false, checkedAt: new Date("2026-05-01") },
    ];

    const trend = aggregateTrend(records, "2026-05");

    expect(trend.avgPosition).toBeNull();
  });
});

describe("detectCitationChanges", () => {
  it("detects gained citations", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: false },
      { engine: "PERPLEXITY", found: false },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 2 },
      { engine: "PERPLEXITY", found: false },
    ];

    const changes = detectCitationChanges(previous, current);

    const gained = changes.filter((c) => c.type === "gained");
    expect(gained).toHaveLength(1);
    expect(gained[0].engine).toBe("CHATGPT");
  });

  it("detects lost citations", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: true, position: 2 },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: false },
    ];

    const changes = detectCitationChanges(previous, current);

    const lost = changes.filter((c) => c.type === "lost");
    expect(lost).toHaveLength(1);
    expect(lost[0].engine).toBe("PERPLEXITY");
  });

  it("detects position improvements", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 5 },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 2 },
    ];

    const changes = detectCitationChanges(previous, current);

    const improved = changes.filter((c) => c.type === "improved");
    expect(improved).toHaveLength(1);
    expect(improved[0].engine).toBe("CHATGPT");
    expect(improved[0].positionChange).toBe(3);
  });

  it("detects position drops", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 4 },
    ];

    const changes = detectCitationChanges(previous, current);

    const dropped = changes.filter((c) => c.type === "dropped");
    expect(dropped).toHaveLength(1);
    expect(dropped[0].engine).toBe("CHATGPT");
  });

  it("returns no changes when nothing changed", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: false },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "PERPLEXITY", found: false },
    ];

    const changes = detectCitationChanges(previous, current);
    expect(changes).toHaveLength(0);
  });

  it("handles new engines in current check", () => {
    const previous: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
    ];

    const current: CitationRecord[] = [
      { engine: "CHATGPT", found: true, position: 1 },
      { engine: "GEMINI", found: true, position: 2 },
    ];

    const changes = detectCitationChanges(previous, current);

    const gained = changes.filter((c) => c.type === "gained");
    expect(gained).toHaveLength(1);
    expect(gained[0].engine).toBe("GEMINI");
  });
});
