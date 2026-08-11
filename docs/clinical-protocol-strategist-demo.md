# Clinical Protocol Strategist — Demo Description

**Date:** 2026-08-11
**Purpose:** Full description of the Clinical Protocol Strategist demo — what it is, how it works, what was built, and how it evolved in response to feedback. Intended as source material for a report on the work done and the feedback received.
**Companion docs:** `clinical-trial-protocol-strategist-plan.md` (technical scoping), `clinical-trial-strategist-prd.md` (PRD v0.2), `strategist-feedback-2026-08.md` (interview feedback and changes), `trial-corpus.md` (data), `../gemini/README.md` (MCP integration)

---

## 1. What the demo is

The Clinical Protocol Strategist is a client-facing demo hosted on the Tweed Collective site at `/clients/protocol-strategist`. It presents an AI clinical-trial strategist grounded in a proprietary-shaped corpus of CRO trial-operations data and detailed protocol histories.

The core motion: a trial design document already exists. The user selects an element of it, asks what happens if that element changes, and the strategist runs a sensitivity analysis against operational history. Options come back with relative tradeoffs — quantified in **patients, months, and dollars** — with charts. The user explores, decides, and ships the decision back into the document with its evidence attached.

The demo makes one argument: **the value is in the data, not the model.** Anyone can put a chat window in front of an LLM. The strategist is only interesting because every tradeoff it quantifies comes from protocol and operations depth that is not publicly available. The insight the client should walk away repeating:

> "We pressure-tested the draft before it went to writing, and the document shows why every choice held or changed."

### Why this shape (research grounding)

The demo's shape came out of the Trial IntelX 2.0 product-strategy research (8 expert interviews, 5 personas, June–July 2026). Four findings drove it:

1. **Enter at strategy, not authoring.** Internal sponsor tools already produce an ~80% first-pass protocol draft; authoring is commoditizing. The defensible entry point is upstream, where judgment still rules.
2. **The starting point is never blank.** Strategy lives in a shared PowerPoint before any synopsis exists; teams copy-paste from the closest prior protocol. They have a draft — what they lack is a way to interrogate it. That is why the product opens on a document, not an empty chat.
3. **The moat is the data.** Experts called licensed RWD "a commodity." Differentiation comes from proprietary trial intelligence: operations data and detailed protocol history.
4. **The cost of getting design wrong is measurable.** Amendments run ~$500K each, with real enrollment and dropout impact. Every sensitivity resolves to patients / months / dollars.

---

## 2. The hero use case and interaction model

**Hero scenario:** a Phase 2 trial in second-line metastatic NSCLC (internal code TCX-LUNG) with a GI-comorbidity angle in the eligibility criteria. A design brief already exists in Google Docs — arms, primary endpoint, draft I/E criteria, sketch schedule of assessments (SoA), target enrollment. The demo opens on that brief, not on an empty chat.

**One loop, repeated per design element:**

```
Draft doc → select element → interrogate → sensitivity analysis → explore → decide → ship it → doc updated
```

- **Interrogate (first order).** "Which of these criteria will cost us the most patients?" The strategist answers from the corpus; the relevant fixed chart renders or highlights.
- **Sensitivity analysis (second order).** "Medical is telling me I need to add an endoscopy screening to verify this GI disease — how does that hit my recruitment timeline?" The strategist does not return a single answer. It returns 2–4 scenarios (e.g. endoscopy required at all sites; central read where available; prior-6-months endoscopy accepted), each quantified in patients, months, and dollars, with the operational drivers named (scheduling lag by site type, refusal rates, vendor cost). Second-order questions chain — the user can push on any option and the analysis re-runs.
- **Decide and ship.** Shipping writes the decision into the output doc: the revised element, the option chosen, the alternatives considered, the quantified tradeoff accepted, and the corpus evidence behind it. The doc accumulates a decision log, so by the end it reads as a design brief where every choice shows its work.
- **Review loop.** Teammates add margin comments in Google Docs; the strategist reads them and returns a revision with a change log keyed one-to-one to the comments. This models a collaboration loop rather than one-shot generation — the demo's differentiator.

**Seven scripted test cases** (defined in the PRD, doubling as acceptance tests): UC1 criteria burden, UC2 endoscopy sensitivity (the hero what-if), UC3 secondary-endpoint timeline impact, UC4 second-order chaining with a generated chart, UC5 ship-it, UC6 amendment-risk sweep as a closing beat, UC7 comment-driven review. The ten-minute demo path is: open the drafted doc → UC2 → UC4 → UC5 → UC6 → UC7 payoff in ten seconds via a pre-commented doc.

---

## 3. The workspace

The page is a three-region workspace, branded **WCG IntelX** (deep navy + teal on a light clinical surface) with a "powered by Tweed Collective" mark. The palette lives as one swappable constant (`components/protocol-strategist/wcgTheme.ts`) so exact brand hexes can drop in.

| Region | What it does |
|---|---|
| **Left — brief panel + controls** | The design brief with selectable elements, plus a **decision funnel**: four collapsible question groups — Cost, Site footprint, Timelines, Endpoints — each expanding to a short list of grounded, chart-backed analyses. Below it, a **data connectors panel** previews the sources a real engagement would wire in, in four collapsed buckets (Licensed & real-world data; Regulatory & competitive; Cost & fair-market value; Internal, including Expert & KOL interviews). |
| **Center — chat** | Streaming conversation with the strategist, with live tool-activity labels ("Building the cost model", "Modelling endpoint timeline impact"), mode-specific suggested prompts, and a Publish-to-Doc button. |
| **Right — insight panel** | The evidence surface: fixed Chart.js charts wired to the corpus, plus model-generated charts rendered as self-contained inline SVG in sandboxed iframes. A lightbox expands any chart. |

**Three modes**, selected via a document picker:

- **Hero** — the pre-drafted NSCLC design brief (the scripted demo).
- **Corpus** — any of the 150 synthetic protocols in the corpus, opened as a document to interrogate (each protocol gets an isolated chat session, so the model never sees two protocols' histories mixed).
- **Blank** — net-new design. Originally this mode showed no controls at all; after feedback it presents the same four-question funnel phrased at the comparator-cohort level ("what does a trial like this typically cost?"), so a team starting from scratch gets the same substrate.

Three **starter documents** are published to the work Google Drive for the picker (via `scripts/publish-starter-protocols.mjs`): the TCX-LUNG NSCLC design brief, plus two example protocols (TCX-0056 Familial Hypercholesterolemia Phase 3, TCX-0028 Rheumatoid Arthritis Phase 2). All are synthetic and carry a demonstration-only disclaimer.

---

## 4. Architecture

The demo is a deliberate **vertical slice through a five-layer platform vision** — each layer thin, but the stack complete, so the client sees the architecture working end to end rather than a mockup of any single piece:

| Layer | Vision | What the demo builds |
|---|---|---|
| Agentic / LLM surface | Sponsors interact through their own agentic systems via MCP | On-page streaming chat, plus a real remote MCP server (`/api/mcp`) consumable from Gemini |
| Collaborative document system | Draft and refine outputs in a shared workspace | The Google Docs design brief is both input and output: pre-drafted at start, revised by shipped decisions, reviewed via the comment loop |
| Strategic outputs | Protocol strategy at the detail real decisions need, down to the SoA | Element-level decisions with quantified tradeoffs and an evidence trail |
| Connected external data | Optional connectors to paywalled RWD | Comparator trial landscape (CT.gov-style, synthetic) + the connectors preview panel |
| Proprietary trial + protocol data | The base differentiator | Fully synthetic CRO corpus: protocols, criteria-level screen-fail data, procedure operations, amendment histories, site enrollment operations |

**Stack:** Next.js 14 App Router, TypeScript, Tailwind, Clerk auth, Chart.js. The model is `claude-opus-5` via a server-side streaming route (`app/api/protocol-strategist/route.ts`) with a server-side tool loop, adaptive thinking, and prompt caching. The browser never calls the model or Google directly (CSP is `connect-src 'self'`); all calls proxy through Next API routes, keeping keys server-side.

**Key components:**

| Piece | Path |
|---|---|
| Corpus generator | `pipeline/generate_trial_corpus.py` (+ content and sensitivity modules) |
| Corpus query + sensitivity engine | `lib/trialCorpus.ts` |
| Tool surface (~15 tools) | `lib/strategistTools.ts` |
| Streaming chat route | `app/api/protocol-strategist/route.ts` |
| Generated charts (inline SVG, sandboxed) | `lib/generatedChart.ts` |
| Google Docs bridge | `lib/googleDocs.ts` |
| Codify / review / health routes | `app/api/protocol-strategist/{codify,review,health}/route.ts` |
| Workspace UI | `components/protocol-strategist/*`, `app/clients/protocol-strategist/page.tsx` |
| MCP server | `app/api/mcp/route.ts`, `lib/mcp/*` |
| Gemini integration kit | `gemini/` (ADK agent example, CLI settings, agent instructions) |

---

## 5. The data corpus

Everything the strategist reasons over is **fully synthetic, labeled as such on-page**, and deterministic (fixed seed `20260806`; reruns are byte-identical). Version 2.0.0: **150 protocols (30 NSCLC), 3,040 sites, ~9,600 eligibility-criteria rows, ~9,300 SoA time-and-event rows**, across five therapeutic areas with depth in Respiratory and Oncology. Output is 17 JSON files (~7.4 MB) in `public/data/trial-corpus/`.

The corpus joins two schema lineages on `protocol_id`:

- **Protocol structure**, modeled on the WCG Trial IntelX™ Data Dictionary v1.1 (15 deliverable sheets; two de-identified Phase 2 asthma sample protocols were supplied as reference).
- **Operational outcomes**, modeled on the KMR Clinical Data Workbook field lists (field names only — every value is synthesized).

The join is the point: Trial IntelX describes what a protocol *demands*; KMR describes what *happened*. Neither alone supports an insight a protocol lead doesn't already have.

**The v0.2 sensitivity layer** carries the hero flow: `procedure_operations.json` (scheduling lag, in-house availability, patient refusal, unit cost per procedure × site type), `assessment_operations.json` (CRF data points, site entry minutes, query lag, database-lock contribution), `criterion_attribution.json` (screen-fail attribution per criterion), `design_brief.json` (the pre-drafted NSCLC brief), and amendment records extended with timing and the ~$500K cost framing.

**Encoded signal:** the corpus is not random. Design choices drive operational outcomes through an explicit causal model (e.g. restrictiveness → screen-fail rate at Pearson r ≈ +0.92; burden → dropout ≈ +0.93), so the analytics find real structure rather than noise. Tweed extensions beyond the published schemas (`criterion_type`, restrictiveness/burden/diversity-drag indices, `startup_days`) are documented and flagged so they are never mistaken for Trial IntelX fields — `criterion_type` in particular records a genuine gap found in the source deliverable, where per-row inclusion/exclusion flags are dropped.

---

## 6. The grounding contract

The line the demo cannot get wrong is the line between a defensible analysis and a plausible hallucination. The design enforces it structurally:

- **The arithmetic sits in the data, not the model.** What-if answers compose from precomputed operational parameters in the corpus (lags, rates, costs per procedure, site type, assessment). The model's job is scenario construction and narrative; every number it cites traces to a corpus record.
- **The strategist refuses honestly.** When the corpus can't ground an answer (e.g. a China site floor — the corpus carries 12 countries and no China), the tool output says so rather than improvising. Interviewees specifically praised the "I don't have that data" behavior.
- **Sensitivities, not point estimates.** The system prompt carries a standing preference to answer the headline questions as ranges with options and tradeoffs, never a single unqualified number.
- **Generated charts can't invent data.** Chart data is injected from corpus retrievals, not free-typed by the model; charts render as self-contained inline SVG (no scripts, no external requests) in sandboxed iframes, with a fallback message on malformed specs so a bad chart never breaks the page.
- **Grounding survives the MCP boundary.** The MCP integration runs the full reasoning loop server-side, so an external client model only relays finished, vetted answers (see §8).

---

## 7. The Google Docs loop

The document layer is a real integration, not a mock:

- **Publish / codify:** conversation → HTML → Google Doc (Drive converts HTML, preserving headings, tables, emphasis).
- **Ship-it:** each shipped decision appends to the brief's decision log via the Docs API — revised element text, option chosen, alternatives with tradeoffs, evidence citations — written to be self-contained for a teammate who wasn't in the session. Degrades gracefully to an on-page decision log when credentials or the doc ID are absent.
- **Review:** reads the doc's **anchored comment threads** and returns a second document — the revision with a change log keyed one-to-one to each human comment. Native Google Docs suggestion mode isn't reachable through the API surface used, so the separate-revision design is the design, not a compromise: it reads as "the AI answered my margin notes," not "the AI rewrote my document."

**Credentials:** a Google service account with **domain-wide delegation**, impersonating a Workspace user (`nate.beyor@tweedcollective.ai`), creating docs in a configured Drive folder owned by that user. (A bare service account can no longer own Drive files — Google removed service-account storage quota — which was discovered and documented during the build.) Because the review loop is inherently asynchronous, the demo choreography keeps a **pre-commented brief** ready so the review payoff shows in ten seconds live.

---

## 8. The MCP / Gemini integration

Added 2026-08-07, going beyond the original PRD (which had scoped the chat page as a stand-in for the agentic layer): the strategist is also exposed as a **remote MCP server** at `/api/mcp` (Streamable HTTP, bearer-key auth), so external enterprise agents — Gemini surfaces first among them — can use it as a tool.

The architecture is **grounded-answer**: the reasoning loop (model + corpus tools + the grounding contract) runs server-side inside the `ask_strategist` tool. Raw analytics tools and corpus data are deliberately not exposed, and Drive documents are authored server-side — this is what keeps a client-side model from inventing figures. Eight tools are exposed (`ask_strategist`, `get_started`, `list_analyses`, `build_chart_gallery`, `publish_protocol`, `read_doc`, `read_doc_comments`, `revise_doc`), plus MCP prompts that surface as slash commands in clients like the Gemini CLI. The `gemini/` directory ships a working ADK agent example for Gemini Enterprise / Vertex AI Agent Engine, Gemini CLI settings, and an agent-instruction file that keeps the outer model from decorating relayed answers with numbers of its own.

This directly answers the "we don't want another portal" concern raised in the feedback interviews: the same grounded strategist is reachable from inside a sponsor's own agent surface.

---

## 9. Access and security

- The route sits under `/clients/` (Clerk-gated by `middleware.ts`) and additionally requires a **per-user workspace grant** (`protocol-strategist` slug in `content/clients.ts`), managed from `/admin`. The page and all four API routes enforce the grant.
- The health-check endpoint (`/api/protocol-strategist/health`) verifies the API key, corpus, tools, and Google credentials end to end in one request — and is itself behind the grant, since it makes a billed model call.
- A dedicated Anthropic Console project was created for the demo, with its own key and spend cap, so the demo's actual cost is reportable and the key is revocable after the demo without side effects.
- The MCP endpoint requires its own bearer key (`MCP_API_KEY`); chart links are HMAC-signed.

---

## 10. What was done — build chronology

The build ran 2026-08-06 → 2026-08-07 in rapid iterations, each auto-merged to `main` and deployed:

1. **Scoping and plan** (`clinical-trial-protocol-strategist-plan.md`): repo findings, the Google-credential decision (service account + domain-wide delegation), the Doc-B-not-tracked-changes decision, credential gaps, demo choreography.
2. **PRD v0.2** (`clinical-trial-strategist-prd.md`): hero reframed from open-ended chat to **pressure-testing an already-drafted design**; the sensitivity interaction model; seven test use cases; the "value is in the data" argument.
3. **Corpus v2.0.0**: 150 synthetic protocols with the sensitivity layer, generated deterministically from the Trial IntelX + KMR schema shapes, with an explicit causal model encoded.
4. **v0.1 plumbing**: streaming chat route with server-side tool loop, corpus query layer, 7 tools, Google Docs bridge (create-from-HTML, comment reading), codify and review routes, health check, access gating.
5. **v0.2 hero build**: the full loop — pre-drafted NSCLC brief, sensitivity engine, +8 hero tools including `render_chart` and `ship_decision`, fixed and generated charts, ship-it to the decision log, WCG IntelX branding.
6. **Hardening rounds** (same day, from blind testing): blind-test UX overhaul; chart-data mismatch and Docs-publish 403 fixes; per-protocol chat sessions; legends and a category explorer; the grounding contract hardened against fabricated figures; the insight panel focused on the chart the question earns.
7. **Starter documents + connectors preview**: three published starting-point docs; the data-connectors panel.
8. **Feedback round** (post Pfizer / HiBio interviews — see §11): cost and site-footprint tools, the four-question decision funnel, blank-mode controls, connector buckets, sensitivity-first charting policy, the SVG world map.
9. **MCP / Gemini integration**: the remote MCP server with the grounded-answer architecture, chart-gallery links, and the Gemini connection kit.

---

## 11. The feedback and what changed

Two product-feedback interviews were run (2026-08-06): a **Pfizer clinical-operations director (oncology)** and a **HiBio clinical-development director (transplant)**.

### What we heard

Both were bullish on the category and liked the interface — the chat-plus-controls layout, the honest "I don't have that data" behavior, and the sensitivity framing. **Neither had been wowed yet**, and both said the same thing about why: the tool has to answer the few questions they actually make decisions on, and answer them well. Four themes:

1. **Answer a few questions really well: cost, site footprint, timelines, endpoints.** The Pfizer director pushed hardest on **cost** (per-patient cost linked to the SoA, split direct/indirect, rolled to a total, benchmarked to fair-market value) and **site footprint** ("build a site and country footprint for me — tell me where I should run my trial, how many sites based on the sample size, and hit my regulatory targets"). HiBio echoed cost and endpoints, and "I don't want to forget about clinical operations."
2. **Running these as sensitivities is the value-add.** "If you have 10 sites vs 20 vs 50, domestic vs international, here's the range of recruit timelines and costs … that's exactly what I want. I want it to be dynamic — what is my probability of hitting my target." A defensible range beats a point estimate they then defend to governance.
3. **The left controls solve the blank-whiteboard problem — make them do more.** "It's like a funnel, it starts narrowing down your thought process." The controls are the differentiator against a raw agent in Gemini/Copilot.
4. **Other data sources matter:** expert/KOL interviews ("the bread and butter," captured only ad hoc today), a fair-market-value cost database (a named internal gap), and regulatory precedent ("what concerns does the FDA consistently bring up? are the endpoints acceptable?").

### What changed in response

| Feedback | Change shipped |
|---|---|
| Cost as a headline question | New `trial_cost` tool + chart: per-patient cost built from the SoA (procedure unit costs weighted by site mix, per-visit overhead, indirect data-management and site costs), split direct vs indirect, rolled to total — returned as a lean / as-drafted / rich **range** at the comparator cohort's p25/median/p75 SoA intensity. Every dollar traces to a corpus table; the effort-to-dollar coefficients are named and flagged as synthetic FMV scaffolding. |
| Site footprint as a headline question | New `site_footprint` tool + chart: given target N, site count, and regulatory-region floors (default ≥20% North America), recommends a country allocation from measured per-site enrollment rates and startup times, and prices the lean / planned / aggressive site-count sensitivity — the "10 vs 20 vs 50 sites" ask almost verbatim. Honest limit surfaced: no China in the corpus. |
| Make the controls do more; fix blank mode | The flat analyses panel became a **four-question decision funnel** (Cost, Site footprint, Timelines, Endpoints). Blank mode, which previously showed *no* controls, now carries the same funnel phrased at cohort level. |
| Geography gap ("he can't map it") | The footprint panel leads with an inline-SVG proportional-symbol **world map** — country bubbles at real lat/long sized by expected enrollment — fully self-contained under the page CSP. |
| Sensitivity-first visuals | A charting policy: line charts carry low/medium/high bands, bars compare discrete scenarios, and **heatmaps** (now rendered inline) explore two parameters at once (site count × country; eligibility strictness × endpoint load). |
| More data sources | The connectors panel reorganized into four buckets, adding **Regulatory & competitive**, **Cost & fair-market value**, and **Expert & KOL interviews** sources (preview affordances, provisioned per engagement). |
| "Not another portal" / native agent surface | The MCP server + Gemini integration (§8), letting the strategist run inside a sponsor's own agent surface. |

### Deliberately deferred

- **Probability of hitting the target.** Both directors wanted a confidence number on the blueprint. The honest version needs a calibrated enrollment-variance model, not a coefficient; the footprint timeline stays a point estimate for now.
- **A survey-grade choropleth map** (the current map is proportional-symbol on coarse silhouettes; the data supports upgrading).
- **Endpoint regulatory acceptability** ("have all the endpoints been acceptable to all the regulatory bodies … which studies failed and why") — a regulatory-precedent dataset the corpus doesn't hold; the new Regulatory connector is where it would plug in.
- **Voice input** — a distribution decision above this demo.
- **Delivery-phase tooling** (medical monitoring, data review) — explicitly out of scope; both directors agreed upstream is the right entry point.

---

## 12. Out of scope, by design

- Real WCG or client data — everything is synthetic and labeled as such.
- Veeva, EDC, TMF, or downstream connectors; live paywalled RWD (the comparator landscape stands in).
- Native Google Docs suggestion mode (the separate-revision design is the design).
- Protocol authoring — the strategist revises elements and logs decisions; it does not write the protocol.
- Saved/shareable generated charts (session-ephemeral) and undo on shipped decisions (re-ship supersedes).

## 13. Success criteria (from the PRD)

1. The client repeats the insight sentence (or their own version) after the demo.
2. The ten-minute path runs with no dead air, ending in the ten-second review payoff.
3. Every number in a sensitivity analysis traces to a corpus parameter — zero invented figures on the scripted path.
4. Sensitivity answers always show options with tradeoffs, never a single unqualified answer.
5. At least one generated chart renders live and matches its narrative.
6. A client driving the page unassisted ships a decision within three prompts.

## 14. Standing notes

- **Trial IntelX crediting.** The corpus reproduces the *shape* of the WCG Trial IntelX schema (a WCG contract exhibit and deliverable). How visibly Trial IntelX is credited — versus presenting a Tweed-named compatible schema — remains a decision to take per audience.
- **Environment.** `ANTHROPIC_API_KEY` is set; the Google service-account trio (`GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_IMPERSONATE_USER`), `STRATEGIST_BRIEF_DOC_ID`, and the MCP vars (`MCP_API_KEY`, `MCP_PUBLIC_BASE_URL`) gate the document and MCP features; every path degrades gracefully when they are absent.
- **Open questions carried from the PRD:** client identity and demo date (drives polish budget), demo format (Nate-driven vs client-driven), and access mechanism (Clerk accounts vs magic links).
