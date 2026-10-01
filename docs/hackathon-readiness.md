# NVIDIA/Nebius submission readiness

Scope: one synthetic participant, HVAC exploration, four-week action plan and mentor handoff. No claim of a Massasoit partnership or active cohort.

## Acceptance checks
- Configure a server-side Nebius key and an available NVIDIA Nemotron model.
- Record a real successful inference: model ID, generation time, latency and token usage.
- Confirm missing credentials, provider failure and malformed output display errors rather than success.
- Review every factual model claim against the snapshot; a valid JSON schema does not establish factual accuracy.
- Verify source links work and distinguish the reviewed occupation snapshot from unverified local availability.
- Generate, save, reload and check the same plan returns. Test storage failure behavior.
- Verify mobile layout, keyboard access, and mentor handoff.
- Publish an authenticated, spend-limited demo endpoint; keep credentials out of frontend assets.
- Create a public YouTube demonstration of at most three minutes.
- Complete Devpost fields and explain the changes made during the submission period.
- Retain the final Devpost receipt.

## Three-minute demonstration
0:00–0:25: Explain the problem and introduce fictional Maya.
0:25–0:50: Show the profile and distinguish illustrative matching from verified opportunities.
0:50–1:40: Generate the HVAC exploration plan using a real NVIDIA model through Nebius; show sources, mentor questions and uncertainties.
1:40–2:10: Save, reload and show the retained plan.
2:10–2:40: Explain the public agent/proprietary PACTI boundary and the server-side credentials.
2:40–3:00: Show repository setup instructions and state limitations.

Current implementation status: adapter written; live inference, browser acceptance, hosting, video and final submission remain unverified until executed. Automated transport tests use mocked provider responses.
