# Protocol Strategist over MCP — Gemini integration

The Protocol Strategist workspace (`/clients/protocol-strategist`) is also
exposed as a **remote MCP server** so external agents — enterprise Gemini
surfaces first among them — can use it as a tool.

- **Endpoint:** `https://<your-site>/api/mcp` (Streamable HTTP)
- **Auth:** `Authorization: Bearer $MCP_API_KEY`
- **Architecture:** grounded-answer. The reasoning loop (model + corpus tools
  + the grounding contract) runs **server-side** inside the `ask_strategist`
  tool; the connecting agent only relays finished, vetted answers. Raw
  analytics tools and corpus data are deliberately not exposed, and the
  Drive documents are authored server-side too — this is what keeps a
  client-side model from inventing figures.

## Tools

| Tool | What it does |
|---|---|
| `ask_strategist` | The product. Grounded Q&A over the design brief / corpus; returns answer + chart links + shipped decisions. |
| `get_started` | Modes, starter questions, analysis catalog — the blank-whiteboard fix. |
| `list_analyses` | Filter the analysis catalog by data category. |
| `build_chart_gallery` | Combine collected `chart_token`s into one gallery URL (the insight-panel equivalent). |
| `publish_protocol` | Server-authored updated protocol → Google Doc in the configured Drive folder. |
| `read_doc` / `read_doc_comments` | Read a published Doc and its margin comments. |
| `revise_doc` | Server-authored Doc B answering the open comments (comment-keyed change log). |

Plus MCP **prompts** (`screening-burden-by-criterion`, `amendment-risk`, …,
`start-hero-review`, `start-corpus-review`, `start-blank-design`) for clients
that surface them — Gemini CLI shows these as slash commands.

## Server configuration (Vercel env vars)

| Var | Required | Purpose |
|---|---|---|
| `MCP_API_KEY` | yes | Bearer key for the endpoint. Generate: `openssl rand -hex 32`. Without it every MCP request is refused. |
| `ANTHROPIC_API_KEY` | yes | Runs the server-side grounded loop (already set for the web workspace). |
| `MCP_PUBLIC_BASE_URL` | recommended | Absolute base for chart links, e.g. `https://tweedcollective.ai`. Falls back to the Vercel production URL. |
| `CHART_SIGNING_SECRET` | optional | HMAC secret for chart tokens; defaults to a value derived from `MCP_API_KEY`. |
| `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_IMPERSONATE_USER` | for Drive tools | Same trio the web Publish button uses (see `lib/googleDocs.ts`). Drive tools report a clear error when unset. |

## Connecting from Gemini

**Gemini Enterprise (the target surface).** Employees interact with agents in
the Gemini Enterprise app; custom agents are built with the Agent Development
Kit (ADK) or the no-code builder, deployed to Vertex AI Agent Engine, and
registered in the Gemini Enterprise agent registry. `adk_agent_example.py` is
a working ADK agent wired to this server — deploy it to Agent Engine and
register it. Gemini Enterprise's MCP support also allows registering remote
MCP servers with an auth header directly, where enabled for your org.

**Gemini CLI (fastest way to test).** Merge
`gemini-cli-settings.example.json` into `~/.gemini/settings.json`, export
`MCP_API_KEY`, run `gemini`, and check `/mcp` shows the server connected.
The analysis prompts appear as slash commands.

**Agent instruction.** Whatever the surface, give the agent
`AGENT_INSTRUCTIONS.md` as its system instruction. The server enforces
grounding inside `ask_strategist`; the instruction file keeps the outer
model from decorating relayed answers with numbers of its own — that half of
the contract can only live client-side.

## Timeouts

`ask_strategist` runs a multi-round model loop and can take 1–3 minutes on
complex what-ifs. Set generous tool timeouts (the examples use 300s) and a
Vercel plan that allows `maxDuration = 300` on serverless functions.

## Local smoke test

```bash
npm run dev
export MCP_API_KEY=devkey   # in the shell running `next dev` too

curl -sS -X POST http://localhost:3000/api/mcp \
  -H "Authorization: Bearer $MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Expect the 8-tool list; without the header expect HTTP 401. The MCP
Inspector (`npx @modelcontextprotocol/inspector`) gives an interactive view
of tools and prompts against the same URL.
