import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bot, CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { DEMO_CANDIDATE, DEMO_PATHWAYS } from "./data";
import { rankPathways } from "./matching";
import { registerPactiTools } from "./tools";
import "./styles.css";
import HvacDemo from "./HvacDemo";

export default function App() {
  const matches = useMemo(() => rankPathways(DEMO_CANDIDATE, DEMO_PATHWAYS), []);
  const [activity, setActivity] = useState("Preparing agent tools…");
  useEffect(() => registerPactiTools(setActivity), []);

  return <main>
    <nav><div className="brand"><span>PACTI</span><small>Pathway Agent</small></div><span className="pill"><ShieldCheck size={16}/> Fictional demo data</span></nav>
    <section className="hero">
      <div><p className="eyebrow"><Bot size={17}/> HUMAN + AGENT WORKFORCE NAVIGATION</p><h1>From uncertainty to an explainable pathway.</h1><p className="lede">PACTI helps people and their AI agents discover apprenticeships, understand fit, identify readiness gaps, and create the next practical step.</p><div className="activity"><span className="pulse"/>{activity}</div></div>
      <aside><p className="label">DEMO CANDIDATE</p><h2>{DEMO_CANDIDATE.name}</h2><p>{DEMO_CANDIDATE.location}</p><div className="tags">{DEMO_CANDIDATE.interests.map(x=><span key={x}>{x}</span>)}</div></aside>
    </section>
    <section className="content"><header><div><p className="eyebrow"><Compass size={17}/> EXPLAINABLE MATCHES</p><h2>Recommended pathways</h2></div><p>Illustrative matching rules, not validated predictions. Providers, wages and openings below are fictional.</p></header>
      <div className="grid">{matches.map((m, index)=><article key={m.id} className={index===0?"top":""}><div className="rank">#{index+1}</div><div className="score">{m.fitScore}<small>DEMO SCORE</small></div><h3>{m.title}</h3><p>{m.provider}</p><ul>{m.fitReasons.map(r=><li key={r}><CheckCircle2 size={15}/>{r}</li>)}</ul>{m.readinessGaps.length>0&&<div className="gap">Readiness focus: {m.readinessGaps[0]}</div>}<footer><span>{m.wageRange}</span><span>{m.openings} openings</span></footer></article>)}</div>
    </section>
    <HvacDemo/>
    <section className="prompt"><div><p className="eyebrow">TRY WITH CHATGPT</p><h2>“Help Maya find the best apprenticeship and create a 30-day plan.”</h2></div><ArrowRight size={32}/></section>
  </main>;
}

