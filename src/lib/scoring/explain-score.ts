import type { ContentScore, GeoScore, ScoreBreakdownItem, ScoreValueMap } from "@/lib/scoring/types";
import { contentWeights, geoWeights } from "@/lib/scoring/weights";

function round(value: number) {
  return Number(value.toFixed(2));
}

function deriveStatus(score: number): ScoreBreakdownItem["status"] {
  if (score < 40) {
    return "critical";
  }

  if (score < 70) {
    return "warning";
  }

  return "strong";
}

function isGeoScore(score: ScoreValueMap): score is GeoScore {
  return "entityAuthority" in score;
}

export function explainScore(score: ContentScore): ScoreBreakdownItem[];
export function explainScore(score: GeoScore): ScoreBreakdownItem[];
export function explainScore(score: ScoreValueMap): ScoreBreakdownItem[] {
  const weights = isGeoScore(score) ? geoWeights : contentWeights;

  return Object.entries(score)
    .filter(([signal]) => signal !== "overall")
    .map(([signal, value]) => {
      const weight = weights[signal as keyof typeof weights];

      return {
        signal,
        score: value,
        weight,
        contribution: round(value * weight),
        status: deriveStatus(value),
      };
    });
}
