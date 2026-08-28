import type { Candidate, Pathway } from "./types";

export const DEMO_CANDIDATE: Candidate = {
  id: "demo-maya",
  name: "Maya",
  location: "Erie, PA",
  interests: ["hands-on work", "problem solving", "technology"],
  skills: ["mechanical reasoning", "teamwork", "attention to detail"],
  values: ["stability", "visible results", "learning"],
  readiness: { math: 62, communication: 78, reliability: 88, digital: 74 },
};

export const DEMO_PATHWAYS: Pathway[] = [
  {
    id: "electrical-erie-01",
    title: "Electrical Apprenticeship",
    provider: "Western Pennsylvania Electrical Training",
    location: "Erie, PA",
    interests: ["hands-on work", "problem solving", "technology"],
    skills: ["mechanical reasoning", "attention to detail"],
    values: ["stability", "visible results", "learning"],
    minimumReadiness: { math: 70, reliability: 70 },
    wageRange: "$18–$34/hour",
    openings: 8,
    sourceUrl: "https://www.apprenticeship.gov/",
  },
  {
    id: "hvac-erie-02",
    title: "HVAC Technician Apprenticeship",
    provider: "Erie Skilled Trades Collaborative",
    location: "Erie, PA",
    interests: ["hands-on work", "problem solving"],
    skills: ["mechanical reasoning", "teamwork"],
    values: ["stability", "visible results"],
    minimumReadiness: { math: 60, reliability: 75 },
    wageRange: "$17–$31/hour",
    openings: 5,
    sourceUrl: "https://www.apprenticeship.gov/",
  },
  {
    id: "industrial-maint-03",
    title: "Industrial Maintenance Technician",
    provider: "Northwest PA Manufacturing Partnership",
    location: "Erie, PA",
    interests: ["technology", "problem solving"],
    skills: ["mechanical reasoning", "attention to detail"],
    values: ["learning", "stability"],
    minimumReadiness: { math: 65, digital: 70 },
    wageRange: "$20–$36/hour",
    openings: 4,
    sourceUrl: "https://www.apprenticeship.gov/",
  },
];
