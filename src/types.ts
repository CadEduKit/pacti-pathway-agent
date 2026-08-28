export type Candidate = {
  id: string;
  name: string;
  location: string;
  interests: string[];
  skills: string[];
  values: string[];
  readiness: { math: number; communication: number; reliability: number; digital: number };
};

export type Pathway = {
  id: string;
  title: string;
  provider: string;
  location: string;
  interests: string[];
  skills: string[];
  values: string[];
  minimumReadiness: Partial<Candidate["readiness"]>;
  wageRange: string;
  openings: number;
  sourceUrl: string;
};

export type Match = Pathway & {
  fitScore: number;
  scoreBreakdown: { interests: number; skills: number; values: number; readiness: number; location: number };
  fitReasons: string[];
  readinessGaps: string[];
};
