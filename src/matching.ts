import type { Candidate, Match, Pathway } from "./types";

const overlap = (a: string[], b: string[]) => {
  if (!b.length) return 0;
  return a.filter((item) => b.includes(item)).length / b.length;
};

export function scorePathway(candidate: Candidate, pathway: Pathway): Match {
  const interests = overlap(candidate.interests, pathway.interests);
  const skills = overlap(candidate.skills, pathway.skills);
  const values = overlap(candidate.values, pathway.values);
  const required = Object.entries(pathway.minimumReadiness);
  const readiness = required.length
    ? required.reduce((sum, [key, min]) => {
        const actual = candidate.readiness[key as keyof Candidate["readiness"]];
        return sum + Math.min(actual / (min ?? 100), 1);
      }, 0) / required.length
    : 1;
  const location = candidate.location === pathway.location ? 1 : 0.5;
  const fitScore = Math.round((interests * 0.3 + skills * 0.25 + values * 0.2 + readiness * 0.15 + location * 0.1) * 100);
  const readinessGaps = required
    .filter(([key, min]) => candidate.readiness[key as keyof Candidate["readiness"]] < (min ?? 0))
    .map(([key, min]) => `${key}: ${candidate.readiness[key as keyof Candidate["readiness"]]} vs ${min} recommended`);

  return {
    ...pathway,
    fitScore,
    scoreBreakdown: {
      interests: Math.round(interests * 100), skills: Math.round(skills * 100),
      values: Math.round(values * 100), readiness: Math.round(readiness * 100), location: Math.round(location * 100),
    },
    fitReasons: [
      `${Math.round(interests * 100)}% interest alignment`,
      `${Math.round(skills * 100)}% skill alignment`,
      `Located in ${pathway.location}`,
    ],
    readinessGaps,
  };
}

export function rankPathways(candidate: Candidate, pathways: Pathway[]) {
  return pathways.map((p) => scorePathway(candidate, p)).sort((a, b) => b.fitScore - a.fitScore);
}
