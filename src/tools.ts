import { DEMO_CANDIDATE, DEMO_PATHWAYS } from "./data";
import { rankPathways } from "./matching";

const compact = (value: unknown) => JSON.stringify({ dataMode: "fictional-demo", verifiedOpenings: false, data: value });

export function registerPactiTools(onActivity: (message: string) => void) {
  if (!document.modelContext) {
    onActivity("WebMCP is unavailable in this browser. The visual demo still works.");
    return () => undefined;
  }

  const controller = new AbortController();
  const ranked = () => rankPathways(DEMO_CANDIDATE, DEMO_PATHWAYS);
  const register = (tool: WebMCPTool) => document.modelContext!.registerTool(tool, { signal: controller.signal });

  void register({
    name: "get_candidate_profile",
    description: "Return the fictional PACTI demo candidate profile used to explore workforce pathways.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute: async () => { onActivity("Agent reviewed Maya's candidate profile."); return compact(DEMO_CANDIDATE); },
  });

  void register({
    name: "search_pathways",
    description: "Find and rank PACTI demo pathways by transparent candidate fit. Use for apprenticeship or career discovery.",
    inputSchema: {
      type: "object",
      properties: { limit: { type: "number", minimum: 1, maximum: 3, description: "Number of pathways to return." } },
    },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async ({ limit = 3 }) => { onActivity("Agent ranked available pathways."); return compact(ranked().slice(0, Math.max(1, Math.min(3, limit)))); },
  });

  void register({
    name: "compare_pathways",
    description: "Compare two PACTI demo pathways by fit, wage, openings, strengths, and readiness gaps.",
    inputSchema: {
      type: "object",
      properties: {
        firstPathwayId: { type: "string", description: "First public pathway ID." },
        secondPathwayId: { type: "string", description: "Second public pathway ID." },
      },
      required: ["firstPathwayId", "secondPathwayId"],
    },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async ({ firstPathwayId, secondPathwayId }) => {
      const matches = ranked().filter((m) => [firstPathwayId, secondPathwayId].includes(m.id));
      if (matches.length !== 2) throw new Error("Choose two valid pathway IDs returned by search_pathways.");
      onActivity(`Agent compared ${matches[0].title} and ${matches[1].title}.`);
      return compact(matches);
    },
  });

  void register({
    name: "create_action_plan",
    description: "Create a non-binding 30-day preparation plan for one PACTI demo pathway. Does not save or change candidate data.",
    inputSchema: {
      type: "object",
      properties: { pathwayId: { type: "string", description: "Public pathway ID returned by search_pathways." } },
      required: ["pathwayId"],
    },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async ({ pathwayId }) => {
      const match = ranked().find((m) => m.id === pathwayId);
      if (!match) throw new Error("Unknown pathway ID. Run search_pathways first.");
      onActivity(`Agent created a 30-day plan for ${match.title}.`);
      return compact({
        pathway: match.title,
        disclaimer: "Guidance only; review with a counselor before acting.",
        weeks: [
          { week: 1, action: "Review pathway requirements and confirm interest with a workforce counselor." },
          { week: 2, action: match.readinessGaps.length ? `Address readiness gap: ${match.readinessGaps[0]}.` : "Complete an introductory skills exercise." },
          { week: 3, action: "Prepare a resume and gather required application documents." },
          { week: 4, action: `Contact ${match.provider} and verify current eligibility and openings.` },
        ],
      });
    },
  });

  onActivity("Four PACTI WebMCP tools registered.");
  return () => controller.abort();
}

