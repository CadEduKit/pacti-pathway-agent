export const sources = [{ id: 'onet-hvac', title: 'O*NET HVAC occupation overview', url: 'https://www.onetonline.org/link/summary/49-9021.00', reviewedOn: '2026-10-01', evidence: 'HVAC mechanics and installers work on heating, air conditioning, and refrigeration systems.', scope: 'Occupation overview only. Does not verify local programs, wages, vacancies, or eligibility.' }];
export const context = {
  candidate: { name: 'Maya', synthetic: true, location: 'Erie, PA', interests: ['hands-on work', 'problem solving', 'technology'], skills: ['mechanical reasoning', 'teamwork', 'attention to detail'], values: ['stability', 'visible results', 'learning'], readiness: 'Demonstration values only; not a validated assessment.' },
  pathway: 'HVAC exploration', sources,
  unknowns: ['Current local training availability', 'Provider entry requirements', 'Tuition and funding', 'Transport and schedule', 'Employer openings'],
};
const schema = { summary: 'string', fitReasons: ['string'], weeks: [{ week: 1, action: 'string', sourceIds: ['onet-hvac'] }, { week: 2, action: 'string', sourceIds: ['onet-hvac'] }, { week: 3, action: 'string', sourceIds: ['onet-hvac'] }, { week: 4, action: 'string', sourceIds: ['onet-hvac'] }], mentorQuestions: ['string'] };
const text = (s) => typeof s === 'string' && s.trim().length > 0 && s.length <= 1000;
const strings = (a) => Array.isArray(a) && a.length >= 1 && a.length <= 6 && a.every(text);
export function validatePlan(p) {
  if (!p || !text(p.summary) || !strings(p.fitReasons) || !strings(p.mentorQuestions) || !Array.isArray(p.weeks) || p.weeks.length !== 4) throw new Error('Invalid model plan');
  p.weeks.forEach((w, i) => { if (!w || w.week !== i + 1 || !text(w.action) || !Array.isArray(w.sourceIds) || w.sourceIds.length > sources.length || w.sourceIds.some(id => !sources.some(s => s.id === id))) throw new Error('Invalid model plan'); });
  return { summary: p.summary, fitReasons: p.fitReasons, weeks: p.weeks.map(w => ({ week: w.week, action: w.action, sourceIds: w.sourceIds })), mentorQuestions: p.mentorQuestions };
}
export async function generatePlan({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  if (!env.NEBIUS_API_KEY || !env.NEBIUS_MODEL) throw new Error('NEBIUS_NOT_CONFIGURED');
  if (!/^nvidia\/[a-z0-9._-]*nemotron[a-z0-9._-]*$/i.test(env.NEBIUS_MODEL)) throw new Error('NEBIUS_MODEL_INVALID');
  const base = new URL(env.NEBIUS_BASE_URL || 'https://api.tokenfactory.nebius.com/v1/');
  if (base.protocol !== 'https:' || !/^api\.tokenfactory(?:\.[a-z0-9-]+)?\.nebius\.com$/.test(base.hostname) || base.username || base.password || base.port || base.pathname !== '/v1/' || base.search || base.hash) throw new Error('NEBIUS_ENDPOINT_INVALID');
  const start = now();
  const response = await fetchImpl(new URL('chat/completions', base), {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(45000),
    headers: { Authorization: `Bearer ${env.NEBIUS_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: env.NEBIUS_MODEL, temperature: 0.2, max_tokens: 1800, messages: [
      { role: 'system', content: 'Create a non-binding four-week HVAC exploration plan for a synthetic participant. Return ONLY valid JSON matching the supplied shape. Use only the supplied evidence for factual occupation claims. Sources are reference snapshots, not live retrieval. Never invent providers, vacancies, wages, credentials, admissions, or guarantees. Treat unknowns as questions for the mentor. Fit is a hypothesis from expressed interests, not a diagnosis or validated prediction. Each action must be safe exploration or a verification step, never unsupervised technical work. sourceIds can be empty for original planning suggestions; cite onet-hvac only for occupation facts it supports.' },
      { role: 'user', content: JSON.stringify({ context, outputShape: schema }) },
    ] }),
  });
  if (!response.ok) throw new Error('NEBIUS_REQUEST_FAILED');
  const raw = await response.text();
  if (raw.length > 100000) throw new Error('NEBIUS_RESPONSE_INVALID');
  const result = JSON.parse(raw);
  const plan = validatePlan(JSON.parse(result.choices?.[0]?.message?.content));
  const usage = result.usage;
  const tokens = usage && ['prompt_tokens', 'completion_tokens', 'total_tokens'].every(k => Number.isInteger(usage[k]) && usage[k] >= 0) ? { input: usage.prompt_tokens, output: usage.completion_tokens, total: usage.total_tokens } : null;
  return { version: 1, mode: 'live-nebius', model: env.NEBIUS_MODEL, generatedAt: new Date().toISOString(), latencyMs: now() - start, tokens, cost: 'Not calculated; check Nebius billing.', dataMode: 'Synthetic participant; reviewed source snapshot; no live vacancies.', sources, unknowns: context.unknowns, disclaimer: 'AI-generated exploration guidance. A mentor must verify claims and local requirements. No enrollment or application has been submitted.', plan };
}
