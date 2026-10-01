# PACTI Pathway Agent

A standalone WebMCP gateway showing how a person and an AI agent can move from career uncertainty to an explainable apprenticeship match and a practical 30-day plan.

## WebMCP tools

- `get_candidate_profile`
- `search_pathways`
- `compare_pathways`
- `create_action_plan`

All current tools are read-only and operate on fictional demonstration data. The gateway does not connect to PACTI production data, credentials, or administrative workforce adapters.

## Run

```bash
npm install
npm run dev
```

Use ChatGPT's in-app browser or a Chrome release with WebMCP testing enabled. In an ordinary browser, the visual experience remains available.

## Verify

```bash
npm run typecheck
npm test
npm run build
```

## Architecture

The browser registers narrow WebMCP tools. A future authenticated integration will call only approved PACTI candidate-facing endpoints. PACTI's existing OAuth-protected MCP server and audit boundary remain authoritative; administrative adapters are never proxied to the public gateway.

## Data and privacy

Maya and all pathway records in this repository are fictional demonstration data. External source links are informational. Career guidance is non-binding and should be reviewed with a qualified counselor.

## License

MIT


## NVIDIA × Nebius HVAC demonstration

This addition provides a server-side NVIDIA Nemotron adapter and an ordinary-browser HVAC exploration flow. It sends only the fixed synthetic Maya profile and a reviewed O*NET occupation snapshot. The model proposes an exploration plan; local program availability, entry requirements, funding and vacancies remain unverified. No connection to Bodha assessments or PACTI production records is included.

Requires Node 22.12+ (or Node 24):

```bash
npm ci
cp .env.example .env
# Set NEBIUS_API_KEY and the NVIDIA Nemotron model ID available in your account.
# Confirm the region-specific base URL; it must end in /v1/.
npm run build
npm run server
```

Open http://127.0.0.1:8787. Click **Generate HVAC plan with NVIDIA**, review the evidence and mentor questions, then save the plan and reload. Saving is local to this browser and device; it is not a PACTI account save. No key means an explicit unavailable message; there is no simulated NVIDIA response. The existing three matching cards remain clearly fictional.

For development, run `npm run server` and `npm run dev` in separate terminals. Vite proxies `/api` to the local server. Check `npm run test:server` as well as the existing checks.

Credentials must remain in `.env` or the deployment's secret manager. Never use `VITE_NEBIUS_API_KEY`. The server binds to loopback deliberately. Before internet hosting, add authenticated access, appropriate origin validation, persistent rate limits and spend limits at the hosting boundary. A static-only host cannot run this endpoint. Record a genuine successful inference before claiming NVIDIA integration is demonstrated.

Technical reference: https://nebius.com/services/token-factory/nemotron
Occupation reference: https://www.onetonline.org/link/summary/49-9021.00 (reviewed 2026-10-01; snapshot, not live retrieval).
