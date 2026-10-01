import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePlan, validatePlan } from './agent.mjs';
const plan = () => ({ summary: 'Explore HVAC with a mentor.', fitReasons: ['Maya enjoys hands-on problem solving.'], weeks: [1,2,3,4].map(week => ({ week, action: 'Discuss the pathway with a mentor.', sourceIds: [] })), mentorQuestions: ['Which local programs are available?'] });
const env = { NEBIUS_API_KEY: 'test-only-key', NEBIUS_MODEL: 'nvidia/nemotron-3-super-120b-a12b' };
test('missing credentials fail before any request', async () => { let called = false; await assert.rejects(generatePlan({ env: {}, fetchImpl: async () => { called = true; } }), /NOT_CONFIGURED/); assert.equal(called, false); });
test('non-NVIDIA model and untrusted endpoint fail before request', async () => { await assert.rejects(generatePlan({ env: {...env, NEBIUS_MODEL: 'other/model'} }), /MODEL_INVALID/); await assert.rejects(generatePlan({ env: {...env, NEBIUS_BASE_URL: 'https://example.com/v1/'} }), /ENDPOINT_INVALID/); });
test('unknown citations, wrong weeks and malformed content are rejected', () => { const p=plan();p.weeks[0].sourceIds=['fabricated'];assert.throws(()=>validatePlan(p));const q=plan();q.weeks[0].week=4;assert.throws(()=>validatePlan(q));assert.throws(()=>validatePlan({})); });
test('request uses server key, fixed synthetic profile and NVIDIA model; returns measured evidence', async () => {
 let call; let tick=100;
 const result=await generatePlan({env, now:()=>tick+=50, fetchImpl:async(url,options)=>{call={url:String(url),options};return new Response(JSON.stringify({choices:[{message:{content:JSON.stringify(plan())}}],usage:{prompt_tokens:100,completion_tokens:50,total_tokens:150}}));}});
 assert.equal(call.url,'https://api.tokenfactory.nebius.com/v1/chat/completions');assert.equal(call.options.headers.Authorization,'Bearer test-only-key');assert.equal(call.options.redirect,'error');
 const body=JSON.parse(call.options.body);assert.equal(body.model,env.NEBIUS_MODEL);assert.equal(JSON.parse(body.messages[1].content).context.candidate.synthetic,true);
 assert.equal(result.mode,'live-nebius');assert.equal(result.latencyMs,50);assert.equal(result.tokens.total,150);assert.equal(result.sources[0].id,'onet-hvac');assert.ok(!JSON.stringify(result).includes('test-only-key'));
});
test('provider failure never becomes a fake successful plan', async () => { await assert.rejects(generatePlan({env,fetchImpl:async()=>new Response('secret provider details',{status:401})}), /REQUEST_FAILED/); });
test('malformed model output fails validation', async () => { await assert.rejects(generatePlan({env,fetchImpl:async()=>new Response(JSON.stringify({choices:[{message:{content:'not JSON'}}]}))})); });
