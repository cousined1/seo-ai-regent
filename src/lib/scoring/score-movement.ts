export interface ScoreMovementItem {
  before: number;
  after: number;
  delta: number;
  deltaLabel: string;
}

export interface ScoreMovement {
  content: ScoreMovementItem;
  geo: ScoreMovementItem;
}

function toMovementItem(before: number, after: number): ScoreMovementItem {
  const delta = after - before;
  const sign = delta > 0 ? "+" : "";

  return {
    before,
    after,
    delta,
    deltaLabel: `${sign}${delta}`,
  };
}

export function deriveScoreMovement(input: {
  previous: {
    contentOverall: number;
    geoOverall: number;
  };
  current: {
    contentOverall: number;
    geoOverall: number;
  };
}): ScoreMovement {
  return {
    content: toMovementItem(input.previous.contentOverall, input.current.contentOverall),
    geo: toMovementItem(input.previous.geoOverall, input.current.geoOverall),
  };
}
