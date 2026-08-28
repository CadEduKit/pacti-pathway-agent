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
