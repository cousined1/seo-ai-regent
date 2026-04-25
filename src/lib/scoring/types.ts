export interface ContentScore {
  overall: number;
  termFrequency: number;
  entityCoverage: number;
  headingStructure: number;
  wordCount: number;
  readability: number;
  internalLinks: number;
  geoSignals: number;
}

export interface GeoScore {
  overall: number;
  entityAuthority: number;
  factualDensity: number;
  answerFormat: number;
  sourceCredibility: number;
  freshness: number;
}

export type ScoreValueMap = ContentScore | GeoScore;

export interface ScoreBreakdownItem {
  signal: string;
  score: number;
  weight: number;
  contribution: number;
  status: "critical" | "warning" | "strong";
}

export interface TopAction {
  area: "Content" | "GEO";
  signal: string;
  title: string;
  detail: string;
  lift: number;
  liftLabel: string;
}

export interface TermsBuckets {
  required: string[];
  recommended: string[];
  optional: string[];
}
