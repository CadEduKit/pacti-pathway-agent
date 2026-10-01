import { useState } from 'react';
import { z } from 'zod';
const text = z.string().min(1).max(1000);
const resultSchema = z.object({
  version: z.literal(1), mode: z.literal('live-nebius'), model: text, generatedAt: text,
  latencyMs: z.number().nonnegative(), tokens: z.object({ input: z.number(), output: z.number(), total: z.number() }).nullable(),
  dataMode: text, disclaimer: text, unknowns: z.array(text),
  sources: z.array(z.object({ id: text, title: text, url: z.string().url().refine(u => u === 'https://www.onetonline.org/link/summary/49-9021.00'), reviewedOn: text, scope: text })),
  plan: z.object({ summary: text, fitReasons: z.array(text), mentorQuestions: z.array(text), weeks: z.array(z.object({ week: z.number().int().min(1).max(4), action: text, sourceIds: z.array(text) })).length(4) }),
});
type Result = z.infer<typeof resultSchema>;
const key = 'pacti-hvac-plan-v1';
function restore(): Result | null { try { const raw = localStorage.getItem(key); return raw ? resultSchema.parse(JSON.parse(raw)) : null; } catch { return null; } }
export default function HvacDemo() {
  const [result, setResult] = useState<Result | null>(restore);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  async function generate() {
    setBusy(true); setStatus('Generating a new plan with NVIDIA through Nebius…');
    try {
      const response = await fetch('/api/hvac-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(55000) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Generation failed.');
      setResult(resultSchema.parse(payload)); setStatus('New plan generated. Review it with a mentor before acting.');
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Generation failed.'); }
    finally { setBusy(false); }
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(result)); setStatus('Plan saved in this browser. It will reload when you return.'); }
    catch { setStatus('The browser could not save this plan.'); }
  }
  return <section className="hvac-demo">
    <p className="eyebrow">NVIDIA × NEBIUS · HVAC EXPLORATION</p>
    <h2>Turn Maya’s interests into a mentor-reviewed plan.</h2>
    <p>One synthetic participant. One pathway. AI generation uses a reviewed O*NET occupation snapshot; local programs and openings remain unverified.</p>
    <button disabled={busy} onClick={generate}>{busy ? 'Generating…' : 'Generate HVAC plan with NVIDIA'}</button>
    <p role="status" aria-live="polite">{status}</p>
    {result && <div className="plan-result">
      <p className="pill">NVIDIA result · {result.model} · {Math.round(result.latencyMs / 1000)}s · {result.tokens ? `${result.tokens.total} tokens` : 'Token usage unavailable'}</p>
      <p>Generated {new Date(result.generatedAt).toLocaleString()}. {result.dataMode}</p>
      <h3>Why explore HVAC?</h3><p>{result.plan.summary}</p><ul>{result.plan.fitReasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
      <h3>Four-week action plan</h3><ol>{result.plan.weeks.map(w => <li key={w.week}><strong>Week {w.week}:</strong> {w.action} {w.sourceIds.map(id => { const source = result.sources.find(s => s.id === id); return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer">[{source.title}]</a> : null; })}</li>)}</ol>
      <h3>Mentor handoff</h3><ul>{result.plan.mentorQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
      <h3>Still needs verification</h3><ul>{result.unknowns.map(q => <li key={q}>{q}</li>)}</ul>
      <h3>Evidence</h3>{result.sources.map(s => <p key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> · Reviewed {s.reviewedOn}. {s.scope}</p>)}
      <p>{result.disclaimer}</p><button onClick={save}>Save plan in this browser</button>
    </div>}
  </section>;
}
