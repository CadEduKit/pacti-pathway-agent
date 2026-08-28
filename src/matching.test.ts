import { describe, expect, it } from "vitest";
import { DEMO_CANDIDATE, DEMO_PATHWAYS } from "./data";
import { rankPathways, scorePathway } from "./matching";

describe("transparent pathway scoring", () => {
  it("keeps scores inside 0-100", () => {
    for (const pathway of DEMO_PATHWAYS) expect(scorePathway(DEMO_CANDIDATE, pathway).fitScore).toBeGreaterThanOrEqual(0);
    for (const pathway of DEMO_PATHWAYS) expect(scorePathway(DEMO_CANDIDATE, pathway).fitScore).toBeLessThanOrEqual(100);
  });
  it("ranks pathways in descending fit order", () => {
    const scores = rankPathways(DEMO_CANDIDATE, DEMO_PATHWAYS).map((item) => item.fitScore);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});
