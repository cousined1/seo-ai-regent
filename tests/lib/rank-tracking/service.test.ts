import { describe, it, expect } from "vitest";
import {
  calculateTrend,
  calculatePositionChange,
  getTrendDirection,
  type RankRecord,
  type TrendResult,
} from "@/lib/rank-tracking/service";

describe("calculatePositionChange", () => {
  it("calculates positive change when position improves", () => {
    const change = calculatePositionChange({
      currentPosition: 3,
      previousPosition: 7,
    });

    expect(change).toBe(4);
  });

  it("calculates negative change when position drops", () => {
    const change = calculatePositionChange({
      currentPosition: 12,
      previousPosition: 5,
    });

    expect(change).toBe(-7);
  });

  it("returns zero when position is unchanged", () => {
    const change = calculatePositionChange({
      currentPosition: 5,
      previousPosition: 5,
    });

    expect(change).toBe(0);
  });

  it("handles missing previous position", () => {
    const change = calculatePositionChange({
      currentPosition: 3,
      previousPosition: undefined,
    });

    expect(change).toBe(0);
  });
});

describe("getTrendDirection", () => {
  it("returns 'up' when position improved", () => {
    expect(getTrendDirection(5, 10)).toBe("up");
  });

  it("returns 'down' when position dropped", () => {
    expect(getTrendDirection(15, 8)).toBe("down");
  });

  it("returns 'stable' when position unchanged", () => {
    expect(getTrendDirection(5, 5)).toBe("stable");
  });

  it("returns 'new' when no previous position", () => {
    expect(getTrendDirection(5, undefined)).toBe("new");
  });
});

describe("calculateTrend", () => {
  it("calculates 7-day trend from rank records", () => {
    const records: RankRecord[] = [
      { position: 10, checkedAt: new Date("2026-05-01") },
      { position: 8, checkedAt: new Date("2026-05-02") },
      { position: 7, checkedAt: new Date("2026-05-03") },
      { position: 5, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 7);

    expect(trend!.current).toBe(5);
    expect(trend!.previous).toBe(10);
    expect(trend!.change).toBe(5);
    expect(trend!.direction).toBe("up");
  });

  it("calculates 30-day trend", () => {
    const referenceDate = new Date("2026-05-04");
    const records: RankRecord[] = [
      { position: 20, checkedAt: new Date("2026-04-05") },
      { position: 15, checkedAt: new Date("2026-04-15") },
      { position: 12, checkedAt: new Date("2026-05-01") },
      { position: 10, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 30, referenceDate);

    expect(trend!.current).toBe(10);
    expect(trend!.previous).toBe(20);
    expect(trend!.change).toBe(10);
  });

  it("calculates 90-day trend", () => {
    const referenceDate = new Date("2026-05-04");
    const records: RankRecord[] = [
      { position: 50, checkedAt: new Date("2026-02-10") },
      { position: 30, checkedAt: new Date("2026-03-15") },
      { position: 15, checkedAt: new Date("2026-04-15") },
      { position: 8, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 90, referenceDate);

    expect(trend!.current).toBe(8);
    expect(trend!.previous).toBe(50);
    expect(trend!.change).toBe(42);
    expect(trend!.direction).toBe("up");
  });

  it("returns null trend when no records exist", () => {
    const trend = calculateTrend([], 7);

    expect(trend).toBeNull();
  });

  it("returns stable trend when only one record exists", () => {
    const records: RankRecord[] = [
      { position: 5, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 7);

    expect(trend).not.toBeNull();
    expect(trend!.current).toBe(5);
    expect(trend!.change).toBe(0);
    expect(trend!.direction).toBe("stable");
  });

  it("filters records by date range", () => {
    const now = new Date("2026-05-04");
    const records: RankRecord[] = [
      { position: 50, checkedAt: new Date("2026-01-01") },
      { position: 10, checkedAt: new Date("2026-05-01") },
      { position: 8, checkedAt: new Date("2026-05-03") },
    ];

    const trend = calculateTrend(records, 7, now);

    expect(trend!.previous).toBe(10);
    expect(trend!.current).toBe(8);
  });

  it("calculates competitor position change", () => {
    const records: RankRecord[] = [
      { position: 5, competitorPosition: 3, checkedAt: new Date("2026-05-01") },
      { position: 4, competitorPosition: 4, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 7);

    expect(trend!.current).toBe(4);
    expect(trend!.competitorCurrent).toBe(4);
    expect(trend!.competitorPrevious).toBe(3);
  });

  it("identifies position gain over period", () => {
    const records: RankRecord[] = [
      { position: 15, checkedAt: new Date("2026-05-01") },
      { position: 12, checkedAt: new Date("2026-05-02") },
      { position: 10, checkedAt: new Date("2026-05-03") },
      { position: 8, checkedAt: new Date("2026-05-04") },
    ];

    const trend = calculateTrend(records, 7);

    expect(trend!.change).toBe(7);
    expect(trend!.direction).toBe("up");
  });
});
