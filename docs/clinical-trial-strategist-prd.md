# Clinical Trial Protocol Strategist — PRD

**Status:** v1.2
**Date:** 2026-08-28
**Purpose of this version:** v1.0 was the frozen baseline for the round-2 research. This version logs the round-2 deltas against it, per the process §15 defines. The direction holding over the whole revision: **keep the prototype and the PRD simple while the data-science proof work runs** — no new connectors, no artifact-creation build; flexible artifact inputs and outputs stays a design principle, not a build item.
**Companion docs:** `clinical-trial-protocol-strategist-plan.md` (technical scoping, credentials), `clinical-protocol-strategist-demo.md` (build description), `strategist-feedback-2026-08.md` (round-1 interview evidence), `strategist-recommendations-2026-08-27.md` (round-2 recommendations, the source for the v1.1 deltas), `trial-corpus.md` (data)
**Source research to date:** Trial IntelX 2.0 product-strategy readout (8 expert interviews, 5 personas, June–July 2026); round-1 product-feedback interviews (Pfizer clinical-operations director, oncology; HiBio clinical-development director, transplant — 2026-08-06); round-2 demo sessions (Regeneron clinical development and clinical operations, Roche, Novartis, Ipsen — August 2026)

**Changed in v1.2 (built same day):** Five product changes from founder direction. (1) **Regulatory joins the funnel as the fifth headline question**, prompt-based — canned regulatory analyses (floor compliance, stricter-floor sensitivity, amendment exposure) replace the v1.1 floor-settings panel, since users may not have a floor number to enter; the engine's hard-constraint enforcement and floor-compliance display stay. (2) **Analyses lead the left panel** — the funnel of role-relevant questions is the default tab and starting point; the brief's elements are the drill-down. (3) **The decision log is a project artifact of one document** — it names the protocol it belongs to, shows its count, and can be cleared to start the project fresh (it was already stored per document; now that scoping is visible). (4) **Output templates**: publish writes the session's grounded content into the shape the team picks — full protocol, synopsis, governance review summary, feasibility memo, or a pasted custom outline — the first build expression of the flexible-outputs principle (§15). (5) **Leaner chat voice**: answers lead with the figure, scenario tables over prose, ~120-word cap, no closing summaries.

**Changed in v1.1:** Round 2 validated the architecture and attacked the numbers; the build priority shifts from adding features to making the existing answers auditable and compliant. Verdict to beat: "This tool is wonderful. It's not ready right now." P0: regulatory floors become hard constraints in the footprint engine with compliance surfaced in the answer (§4, §7.2 — a live demo recommended 7% US and a clin-dev physician caught it); evidence lineage promoted into the demo surface (§7.2); a fourth onboarding mode from a skeletal study schema (§5). P1: probability of success un-deferred in its honest empirical form, sequenced behind the backtest (§14→§4); one interactivity knob on each headline fixed chart (§7.4); study-design structure as a funnel category (§5); oncology-first corpus presentation (§10); innovation-lens probe (§7.3); publish as a version chain, not new copies (§7.5–7.6); a scripted regression set covering the two live round-2 failures (§12). §14 re-scored (artifact export and competitive intelligence recorded but held; RWD-validated proof asset and site-registry data added). §15 deltas logged (A2, A4, A9, A11, A12, new flexible-I/O principle).

**Changed in v1.0:** Folded the August feedback build into the spec (cost and site-footprint as headline questions, the four-question decision funnel, blank mode, connector buckets, sensitivity-first charting policy, the footprint map). Documented the MCP/Gemini surface, which went beyond v0.2's scope. Added UC8–UC9 test cases, the grounding contract as a named requirement, and §15 baseline assumptions for the research comparison.

---

## 1. What this is

An AI clinical trial strategist, demonstrated as a client-facing workspace on the Tweed Collective site and as a remote MCP tool consumable from a sponsor's own agent surface. The strategist is grounded in a proprietary-shaped corpus of CRO trial-operations data and detailed protocol histories.

The core motion: a trial design document already exists. The user selects an element of it, asks what happens if that element changes, and the strategist runs a sensitivity analysis against operational history. Options come back with relative tradeoffs — quantified in **patients, months, and dollars** — with charts. The user explores, decides, and ships the decision back into the document with its evidence attached.

The product makes one argument: **the value is in the data, not the model.** Anyone can put a chat window in front of an LLM. The strategist is only interesting because every tradeoff it quantifies comes from protocol and operations depth that is not publicly available.

## 2. Why this product

Four findings from the foundational research drive the shape, and the two working-demo interviews sharpened them.

**Enter at strategy, not authoring.** Internal sponsor tools already produce an ~80% first-pass protocol draft. Authoring is commoditizing. The defensible entry is upstream, where judgment still rules and teams lose days hunting for reference data before writing begins. Both feedback interviewees independently agreed upstream is the right entry point.

**The starting point is never blank.** Strategy lives in a shared PowerPoint before any synopsis exists, and clinical dev copy-pastes from the closest prior protocol. Teams always have a draft. What they lack is a way to interrogate it. That is why the product starts from a document rather than an empty chat — while still carrying a net-new mode for teams who genuinely are starting fresh (§5).

**The moat is the data, not the model.** Experts called licensed RWD "a commodity." Differentiation comes from overlaying proprietary trial intelligence: operations data and detailed protocol history that others cannot replicate.

**The cost of getting design wrong is measurable.** Amendments run ~$500K each, with real enrollment and dropout impact. Protocol burden is a proven cost driver. Every sensitivity analysis the strategist runs resolves to those units: patients, months, dollars.

The feedback interviews added a fifth, load-bearing finding:

**The tool has to answer the few questions teams actually decide on — and answer them well.** Both directors were bullish on the category and neither had been wowed, for the same stated reason. The questions they named: **cost, site footprint, timelines, endpoints.** The product is now organized around exactly those four (§4).

## 3. Product vision

A five-layer platform. Proprietary data at the base, surfaced agentically at the top:

| Layer | Vision | What is built today |
|---|---|---|
| Agentic / LLM surface | Sponsors interact through their own agentic systems via MCP. A conversational surface, not a static portal | On-page streaming chat scoped to the hero flow, **plus a real remote MCP server** (`/api/mcp`) consumable from Gemini surfaces, with a grounded-answer architecture (§7.8) |
| Collaborative document system | Draft and refine outputs in a shared workspace | The design brief in Google Docs is both input and output: pre-drafted at start, revised by shipped decisions, reviewed via the comment loop |
| Strategic outputs | Protocol strategy at the detail real decisions need, down to the SoA | Element-level decisions with quantified tradeoffs and an evidence trail |
| Connected external data | Optional connectors to paywalled RWD, regulatory precedent, FMV benchmarks, and internal sources — enriching, not required | Comparator trial landscape (CT.gov-style, synthetic) + a connectors preview panel in four buckets (§7.9) |
| Proprietary trial + protocol data | The base differentiator: trial ops depth and detailed protocols not publicly accessible | Fully synthetic CRO corpus v2.0.0: 150 protocols, 3,040 sites, criteria-level screen-fail data, procedure operations, amendment histories (§10) |

The demo is a vertical slice through all five layers. Each layer is thin, but the stack is complete, so a client sees the architecture working end to end rather than a mockup of any single piece.

## 4. The headline questions (five since v1.2)

The product's decision surface is organized around the questions the target users make design decisions on. Each is answered as a **sensitivity range with options and tradeoffs**, never a single unqualified number.

1. **Cost.** Per-patient cost built from the schedule of assessments — procedure unit costs weighted by site mix, per-visit overhead, plus indirect (data-management effort, site activation and maintenance over the enrollment window) — split **direct vs indirect**, rolled to a **total study cost**, returned as a lean / as-drafted / rich range anchored to the comparator cohort's p25 / median / p75 SoA intensity.
2. **Site footprint.** Given a target N, a site count, and regulatory-region floors (default ≥20% North America), a recommended **country allocation** from measured per-site enrollment rates and startup times, plus the site-count sensitivity (lean / planned / aggressive — the "10 vs 20 vs 50 sites" ask) priced in recruit timeline and activation cost, led by a map. *(v1.1, P0)* The regulatory floor is a **hard constraint**, not a preference: the allocation satisfies the floors first, then optimizes on enrollment rates. Compliance is surfaced in the answer ("US at 22%, above the 20% regulatory floor"), never left implicit, and the floors are user-editable — real floors differ by indication and agency posture. The round-2 demo recommended 7% US on the NSCLC Phase 2 protocol and a Regeneron clin-dev physician caught it immediately, citing an FDA filing rejected with under 10% US patients; that single grounding-contract failure converted an enthusiastic session into "not ready."
3. **Timelines.** Recruitment and data-collection timeline impact of design choices: screening burden, added procedures, endpoint load, site mix. Includes the criteria/screening-burden analyses.
4. **Endpoints.** Assessment burden per endpoint, timeline-to-database-lock impact, and prioritization options (all / prioritized subset / defer to exploratory). Includes amendment-risk economics under the cost lens.
5. **Regulatory** *(v1.2 — promoted from a v1.1 settings affordance to a funnel category, prompt-based)*. Whether the design holds up with regulators, answered from what the corpus can ground: **regional floor compliance** (the recommended footprint checked and stated against the ≥20% North America floor), **stricter-floor sensitivity** (20% vs 30% vs 40% floors priced in recruit timeline and activation cost), and **amendment exposure** (which elements historically drew changes, and the fixes). Prompt-based because users may not have a floor number to enter — the analyses carry the defaults, and a different floor is one chat sentence away. Endpoint acceptability and filing precedent stay honest refusals until the Regulatory & competitive connector exists (§14).

Eligibility-burden analyses are deliberately folded under these rather than given their own bucket, so the funnel stays at five.

Three v1.1 extensions to the decision surface, all P1:

- **Probability of success, the honest version** *(P1, un-deferred from §14 — A12 broke: both round-1 testers, Regeneron clin ops in round 2, and the AZ exec KPI frame all asked)*. Not a fitted model: an **empirical percentile against the comparator cohort** ("designs with this burden and footprint completed enrollment on time in 68% of comparator trials"), drivers named, presented as a range like everything else, explicitly labeled for what it is not (no fitted enrollment-variance model yet). Sequenced behind the backtest in the proof plan so the number ships already validated.
- **Study-design structure as a funnel category** *(P1 — Regeneron clin ops)*. Interrogate design type itself — single-arm vs crossover vs basket, blinding, comparator choice — alongside the headline questions. Starts with comparator-cohort evidence ("what designs did similar trials use, with what enrollment outcomes") rather than recommendation logic.
- **Innovation-lens probe** *(P1 — Ipsen: every trial at his company gets asked "did you consider DCT, wearables, ePRO, biobanking?")*. A canned analysis that sweeps the draft for these options with burden/timeline/cost deltas where the corpus supports them, and honest refusal where it does not.

## 5. Interaction model

One loop, repeated per design element:

```
Draft doc → select element → interrogate → sensitivity analysis → explore → decide → ship it → doc updated
```

**Interrogate (first order).** The user asks about an element of the draft. "Which of these criteria will cost us the most patients?" The strategist answers from the corpus and the relevant fixed chart renders or highlights.

**Sensitivity analysis (second order).** After seeing the first charts, the user asks what-if questions. The strategist does not return a single answer. It returns options with relative tradeoffs: 2 to 4 scenarios, each quantified in patients, months, and dollars, with the operational drivers named (scheduling lag, site availability, patient refusal). Second-order questions chain: the user can push on any option and the analysis re-runs.

**The decision funnel (left controls).** The workspace's left panel is a funnel, not a blank slate: five collapsible question groups — Cost, Site footprint, Timelines, Endpoints, Regulatory *(fifth added v1.2)* — each expanding to a short list of grounded, chart-backed analyses. Interviewees identified this as the differentiator against a raw agent in Gemini/Copilot ("it's like a funnel, it starts narrowing down your thought process"), and the standing directive is to make the controls do more work over time. *(v1.2)* **Analyses lead**: the funnel is the panel's default tab and the user's starting point — people need to see the questions relevant to their role before drilling into the document — and the brief's elements are the subset they drill into from there. *(v1.2)* **The decision log is a project artifact**: each loaded document keeps its own log, labeled with the protocol it belongs to, clearable to start that project fresh.

*(v1.2)* **Output templates.** Publish writes the session's grounded content into the shape the team picks: full protocol document (default), protocol synopsis, governance review summary, feasibility memo, or a pasted custom outline. The template governs structure only — the grounding rules still govern content, and anything a template asks for that the session didn't establish is written as "not yet assessed," never estimated. This is the first build expression of the flexible-inputs-and-outputs principle logged in §15.

**Four modes** *(v1.1: Schema added as a P0)*, selected via a document picker:

- **Hero** — the pre-drafted NSCLC design brief (the scripted demo).
- **Corpus** — any protocol in the corpus opened as a document to interrogate, each in an isolated chat session. *(v1.1, P1)* For oncology audiences, present an **oncology-only protocol set** and lean on the 30-protocol NSCLC depth — Regeneron clin dev read three protocols spanning oncology and general medicine as "too broad to be accurate" (§10).
- **Schema** — *(v1.1, P0)* onboard from a study schema, not only a full brief. Paste or upload a skeletal design (indication, phase, arms, endpoints, target N) and get the funnel scoped to it, with honest gaps stated ("no SoA yet, cost answers will be comparator-level"). Pfizer clin ops: "Sometimes all we have is a study-design one-slider. I wouldn't have all this information yet." Roche and Regeneron start from concept sheets.
- **Blank** — net-new design. Carries the same question funnel phrased at the comparator-cohort level ("what does a trial like this typically cost?"), so a team starting from scratch gets the same substrate. Brief-scoped tools are honestly reported unavailable until a design exists.

**Two chart surfaces.**
- *Fixed charts:* the core visuals (criteria waterfall, sensitivity comparison, comparator scatter, amendment risk, cost breakdown, site footprint + map) are pre-built Chart.js components wired to the corpus. Reliable, styled, always correct.
- *Generated charts:* for questions the fixed charts don't cover, the strategist emits a self-contained chart rendered in a sandboxed side panel. This is how the long tail of second-order questions is handled without pre-building every view.

**Decide and ship.** When the user settles on an option, they ship it. Shipping writes the decision into the output doc: the element as revised, the option chosen, the alternatives considered, the quantified tradeoff accepted, and the corpus evidence behind it. The doc accumulates a decision log, so by the end it reads as a design brief where every choice shows its work.

**Review loop.** The doc then goes through the existing comment cycle: teammates add margin comments, the strategist reads them and returns a revision with a change log keyed one-to-one to each comment. This models collaboration, not one-shot generation.

## 6. Hero use case

The hero is the loop itself, run against a pre-drafted document:

> **Start from a drafted trial design and computationally pressure-test its elements, one at a time, before the protocol is written.**

Named scenario: a Phase 2 trial in second-line metastatic NSCLC (internal code TCX-LUNG) with a GI-comorbidity angle in the eligibility criteria. The design brief already exists in Google Docs (pre-seeded): arms, primary endpoint, draft I/E criteria, sketch SoA, target enrollment. The demo opens on that doc, not on an empty chat.

The insight the client should walk away repeating: **"We pressure-tested the draft before it went to writing, and the document shows why every choice held or changed."** Every build decision runs backward from that sentence.

## 7. Functional requirements

### 7.1 Chat layer
Server-side streaming via `app/api/protocol-strategist/route.ts`, with a server-side tool loop. System prompt scoped to the hero flow and the corpus; it names the five headline questions, points the model at the cost and footprint tools, and carries the standing preference for sensitivity ranges, the leaner-voice rules *(v1.2: lead with the figure, scenario tables over prose, ~120-word cap)*, and the charting policy (§7.4). The strategist must refuse to speculate beyond the data and must cite corpus records when making quantitative claims. Mode-specific suggested prompts on-page so a client driving it themselves lands on the scripted use cases. Live tool-activity labels so the work is visible while it streams.

### 7.2 Sensitivity engine (the grounding contract)
What-if answers compose from precomputed operational parameters in the corpus (lags, rates, costs per procedure, site type, and assessment), not from numbers the model invents. The model's job is scenario construction and narrative; the arithmetic sits in structured data it retrieves (`lib/trialCorpus.ts`). This is the line between a defensible analysis and a plausible hallucination, and it is the thing the product cannot get wrong. Corollaries:

- **Honest refusal.** When the corpus can't ground an answer (e.g. a China site floor — the corpus carries 12 countries and no China), the tool output says so rather than improvising. Interviewees specifically praised this behavior; it is a feature, not a gap.
- **Sensitivities, not point estimates.** Headline questions come back as ranges with options and tradeoffs.
- **Named coefficients.** Where synthetic scaffolding converts effort to dollars (the `COST` coefficients), it is named and flagged as such, never presented as a quote.
- **Regulatory floors are part of the contract** *(v1.1, P0)*. A recommendation that violates a stated regulatory constraint is a grounding failure, not a tuning issue. The footprint engine enforces the floors as hard constraints (§4.2) and the prompt makes them non-negotiable; the scripted regression set asserts them (§12).

**Evidence lineage in the chat surface** *(v1.1, P0 — promoted from the MVP list into the demo)*. Novartis: "Nowhere here do I see a link or a section in terms of sources... scientists, if there's a number they don't understand, they're not trusting."

- **Per-number source chips** in answers: which corpus tables, how many records, what filters.
- **A browsable corpus library panel** — Novartis asked to open and inspect the repo protocols.
- **Scenario definitions on demand**: what lean / as-drafted / rich means and which assessments each includes (Ipsen: "that's the part that will trip people up"). Offer Ipsen's alternative anchor — "benchmark against your own last five trials in this TA" — once internal connectors exist, and say so honestly until then.
- **Keep the best-guess flag**: when a number is an estimate, say so and ask "would you agree?" (Novartis's collaboration framing).

### 7.3 Tool surface
~15 tools in `lib/strategistTools.ts`, with descriptions that state *when* to call, not just what they do. Headline tools: `trial_cost`, `site_footprint`, procedure sensitivity, endpoint timeline, criteria waterfall, amendment-risk sweep, comparator landscape, site-level breakdown, `render_chart`, `ship_decision`, plus the corpus query tools.

### 7.4 Charts and the charting policy
- **Fixed charts** are pre-built Chart.js components wired to the corpus, themed per `AGENTS.md`.
- **Generated charts** render as self-contained inline SVG (no scripts, no external requests) in sandboxed iframes. Chart data is injected from corpus retrievals, not free-typed by the model. Display-only and session-ephemeral. A malformed spec shows a fallback message, never breaks the page.
- **Charting policy** (encoded in the prompt): **line** charts carry a low/medium/high band across a continuous knob; **bar** charts compare discrete scenarios; **heatmaps** explore two parameters at once (site count × country, eligibility strictness × endpoint load) and are the default when two knobs vary together.
- **The footprint map:** an inline-SVG proportional-symbol world map — country bubbles at real lat/long sized by expected enrollment, colored by region — fully self-contained under the page CSP.
- **One knob per headline fixed chart** *(v1.1, P1)*: a single slider or toggle on the two headline fixed charts — site count on the footprint chart, SoA intensity on the cost chart — that re-runs the underlying tool without re-prompting. Regeneron clin ops asked to toggle site count directly; Novartis asked whether charts are editable. Chat stays the general path; this is the cheapest demo-wow per unit of build.

### 7.5 Ship-it flow
A shipped decision writes to the output doc via the Docs API: revised element text, chosen option, alternatives with tradeoffs, evidence citations. Each ship appends to a decision log section, written to be self-contained for a teammate who wasn't in the session. Undo is out of scope; re-shipping an element appends a superseding entry. Degrades gracefully to an on-page decision log when credentials or the doc ID are absent.

### 7.6 Document layer
The design brief is pre-drafted in Google Docs at session start. Publish/codify converts conversation → HTML → Google Doc (Drive converts, preserving structure). *(v1.1, P1)* Publish is a **version chain, not new copies**: Roche named the risk — every publish emitting a fresh Google Doc is exactly the "multiple copies flying around" that document-control cultures fear. Publish updates one canonical doc with a version-history section, and the decision log records the chain. This tees up the SharePoint/M365 direction without building it yet. The review loop reads anchored comment threads and produces a second document: the revision with a change log keyed one-to-one to the comments. Native Google Docs suggestion mode is not reachable through the API surface used; the separate-revision design is the design, not a compromise. Credentials: service account with domain-wide delegation, impersonating a Workspace user (see plan doc).

### 7.7 Access and security
Route under `/clients/protocol-strategist`, Clerk-gated plus a per-user workspace grant managed from `/admin`; the page and all API routes enforce the grant. Magic-link fallback exists. A dedicated Anthropic Console project with its own key and spend cap keeps demo cost reportable and the key revocable. A health-check endpoint verifies key, corpus, tools, and Google credentials in one request (itself behind the grant — it makes a billed model call).

### 7.8 MCP surface (added post-v0.2)
The strategist is exposed as a remote MCP server at `/api/mcp` (Streamable HTTP, bearer-key auth) so external enterprise agents — Gemini surfaces first — can use it as a tool. The architecture is **grounded-answer**: the full reasoning loop (model + corpus tools + grounding contract) runs server-side inside `ask_strategist`; raw analytics tools and corpus data are deliberately not exposed, and documents are authored server-side, so a client-side model only relays finished, vetted answers. Eight tools exposed, plus MCP prompts that surface as slash commands. A Gemini connection kit (`gemini/`) ships an ADK agent example and agent instructions that keep the outer model from decorating relayed answers with numbers of its own. This answers the "we don't want another portal" concern directly.

*(v1.1)* Delivery keeps **two front doors** per the round-2 split: the hosted workspace (preferred by HiBio, fine for Regeneron clin ops) and the MCP server (Pfizer/Gemini, Regeneron clin dev/Claude). Stop describing MCP as the endgame in demo narration — it is one of two front doors (A11 softened, §15).

### 7.9 Data connectors panel
A preview of the sources a real engagement would wire in, in four collapsed buckets: **Licensed & real-world data**, **Regulatory & competitive** (FDA/EMA guidance & precedent, AdComm/CRL history, registries), **Cost & fair-market value** (FMV benchmarks, grant-plan budgets, portfolio finance), and **Internal** (including Expert & KOL interviews). Preview affordances, provisioned per engagement. The bucket list is itself a research probe: which sources users ask to light up is signal.

## 8. Test use cases

Each case has a prompt, expected behavior, data drawn on, and a pass criterion. These double as the demo script and the acceptance tests for the chat layer.

### UC1 — First-order interrogation: criteria burden
- **Prompt:** "Which criteria in this draft will cost us the most eligible patients?"
- **Expected:** Strategist ranks criteria by screen-fail attribution, names the top two or three with specific rates, and proposes precedented relaxations with the trials that used them.
- **Data:** Criteria-level screen-fail records. **Visual:** Criteria-burden waterfall (fixed).
- **Pass:** At least two criteria cited with quantified impact and one precedent. No generic advice without numbers.

### UC2 — Sensitivity: added screening procedure (hero what-if)
- **Prompt:** "Medical is telling me I need to add an endoscopy screening to verify this GI disease. How could this impact my recruitment timeline?"
- **Expected:** A sensitivity analysis, not a single answer: (a) endoscopy required at all sites — screening window extends ~3 weeks, ~12% screen-refusal, enrollment completion slips ~2.5 months; (b) central read of existing imaging where available — smaller slip, ~60% of sites; (c) endoscopy within prior 6 months accepted — smallest slip, records-retrieval burden. Each option carries the operational drivers from the corpus.
- **Data:** Procedure operations table. **Visual:** Sensitivity comparison, options side by side on timeline impact.
- **Pass:** 2 to 4 options, each quantified in months and patients, drivers named, corpus-sourced. The tradeoff is legible in one glance at the chart.

### UC3 — Sensitivity: added secondary endpoints
- **Prompt:** "Let's consider adding these secondary endpoints. How could this impact data collection timelines?"
- **Expected:** Each proposed endpoint mapped to its assessment burden (added visits/procedures, data volume, cleaning and query lag, site data-entry load); options (all, prioritized subset, defer to exploratory) with timeline deltas to database lock.
- **Data:** SoA and assessment-to-data-timeline mapping. **Visual:** Timeline impact by option, generated chart acceptable.
- **Pass:** Per-endpoint burden quantified, at least one option that protects the timeline, tradeoffs stated honestly.

### UC4 — Second-order chaining and generated charts
- **Prompt (following UC2):** "For the central-read option, show me the slip by site type. Which sites drive it?"
- **Expected:** Analysis re-cut at site level with a generated chart, since no fixed chart covers the view. The narrative names the driver ("community sites without GI departments account for most of the slip").
- **Data:** Site operations joined to procedure availability.
- **Pass:** Generated chart renders in the side panel, matches the numbers in the narrative, uses only corpus data. This case proves the long tail works.

### UC5 — Ship it
- **Prompt:** "Go with the central-read option. Ship it."
- **Expected:** The decision lands in the output doc: revised criterion text, option chosen, alternatives considered with tradeoffs, evidence citations. The decision log gains an entry; the user sees confirmation and a link.
- **Pass:** The doc entry is self-contained: a teammate who was not in the session can read why the choice was made.

### UC6 — Amendment risk as a pressure test
- **Prompt:** "Before this goes to writing, which elements of the design are most likely to force an amendment?"
- **Expected:** A sweep of the drafted design against amendment histories: which element types get amended in this indication, how often, when, with the ~$500K framing. Flags anything not yet pressure-tested.
- **Data:** Amendment records keyed to protocol element and reason.
- **Pass:** At least one flagged element with amendment frequency and the historical fix. Works as the closing beat.

### UC7 — Review loop
- **Flow:** The shipped doc gets margin comments from a teammate (pre-seeded for demo). On "review my comments," the strategist reads them and returns a revision with a change log keyed one-to-one to the comments.
- **Pass:** Change log maps one-to-one to comments. The loop reads as collaboration, not one-shot generation.

### UC8 — Cost blueprint (added from feedback)
- **Prompt:** "What will this trial cost per patient, and in total?"
- **Expected:** Per-patient cost built from the SoA, split direct vs indirect, rolled to total — as a lean / as-drafted / rich range at comparator p25/median/p75 SoA intensity, with the cost drivers named.
- **Data:** Procedure operations (unit costs × site mix), assessment operations (data-management effort), site table (activation/maintenance). **Visual:** Cost-breakdown chart (fixed).
- **Pass:** Direct/indirect split visible, total rolled up, range not point estimate, every dollar traceable to a corpus table, synthetic FMV coefficients flagged.

### UC9 — Site and country footprint (added from feedback)
- **Prompt:** "Build me a site and country footprint — how many sites, in which countries, to hit my sample size and regulatory targets?"
- **Expected:** A country allocation meeting regulatory floors first (default ≥20% North America), filled with the fastest enrollers; the site-count sensitivity (lean / planned / aggressive) priced in recruit timeline and activation cost; honest limits stated (no China in the corpus).
- **Data:** Site table (per-site enrollment rates, startup times, by country). **Visual:** Proportional-symbol world map + per-scenario timeline (fixed).
- **Pass:** Regulatory floor respected **as a hard constraint — the recommended allocation's expected North America enrollment share is ≥ the floor, asserted, and the answer states the compliance explicitly ("US at 22%, above the 20% regulatory floor")** *(v1.1, P0 — this is the check the round-2 demo failed)*; allocation justified by measured rates, three site-count scenarios quantified, map matches the numbers.

**Ten-minute demo path:** open the drafted doc → UC2 (endoscopy sensitivity) → UC4 (second-order chain, generated chart) → UC5 (ship it) → UC6 (amendment sweep) → UC7 payoff via the pre-commented doc. UC1, UC3, UC8, UC9 are questions the client can ask live.

**Demo QA regression set** *(v1.1, P1 — from the two live round-2 failures)*: a scripted, UC-level regression run before every demo round. At minimum: (a) the Ipsen ePRO what-if chain, whose timeline chart failed to render live (the fallback held the page, but the moment was lost); (b) a "recommended country footprint" run on **each** hero protocol with regulatory-floor assertions (the 7% US miss, item §4.2).

## 9. Visualization specification

Each visual is specified by what the reader concludes, not what is on the axes.

**Fixed:**

1. **Criteria-burden waterfall.** Conclusion: "Our eligible population shrinks 60% before we screen anyone, and two criteria do most of the damage."
2. **Sensitivity comparison.** Conclusion: "Option B costs us three weeks. Option A costs us three months." The template every what-if answer feeds.
3. **Comparator landscape scatter.** Conclusion: "Our draft design is more burdensome than the trials that enrolled fastest."
4. **Amendment-risk view.** Conclusion: "The elements we are least sure about are the ones that historically get amended."
5. **Cost breakdown.** Conclusion: "Assessments drive the per-patient cost, and the indirect tail is bigger than we budgeted — here's the lean-to-rich range."
6. **Site footprint map + scenarios.** Conclusion: "Twenty sites across these six countries hits the regulatory floor and the timeline; fifty buys four months for $X."

**Generated (side panel):** everything else — site-level cuts, per-endpoint burden breakdowns, two-parameter heatmaps. The bar for a generated chart is lower on polish and identical on correctness.

## 10. Data specification

Fully synthetic, labeled as such on-page, deterministic (fixed seed; reruns byte-identical). Corpus v2.0.0: **150 protocols (30 NSCLC), 3,040 sites, ~9,600 eligibility-criteria rows, ~9,300 SoA rows** across five therapeutic areas, deep in Respiratory and Oncology. Two schema lineages joined on `protocol_id`: protocol structure modeled on the WCG Trial IntelX™ Data Dictionary v1.1, operational outcomes modeled on the KMR Clinical Data Workbook field lists (field names only; every value synthesized). The join is the point: Trial IntelX describes what a protocol *demands*; KMR describes what *happened*.

Units of record:

| Table | Grain | Key fields |
|---|---|---|
| Protocols | One row per trial | Indication, phase, arms, endpoints, target N, sponsor type, status, derived indices |
| Criteria | One row per I/E criterion per trial | Criterion text, category, screen-fail attribution % |
| Procedure operations | One row per procedure per site type | Scheduling lag, availability %, patient refusal rate, unit cost, staffing dependency |
| Assessments / SoA | One row per assessment per trial | Visit schedule, procedure, burden score, data volume, cleaning/query lag, database-lock contribution |
| Amendments | One row per amendment | Trial, element changed, reason, timing from FPI, cost estimate (~$500K framing) |
| Site operations | One row per site per trial | Screens, screen fails, enrolled, velocity, activation lag, startup days, site type, country |
| Design brief | One object | The pre-drafted NSCLC brief with selectable element ids |

**Oncology-first depth** *(v1.1, P1)*: for oncology audiences, present an oncology-only protocol set and lean on the 30-protocol NSCLC depth — a mixed-TA picker reads as "too broad to be accurate" (Regeneron clin dev). Oncology has distinct FDA expectations, site dynamics (academic centers refusing Phase 3, community-site identification, population alignment), and vendor precedent (Flatiron and IQVIA split oncology out). Longer term, deepen oncology operational realism in the corpus — the site-type dynamics above, ideally a site-registry layer (§14).

The corpus carries an explicit causal model (restrictiveness → screen-fail r ≈ +0.92; burden → dropout ≈ +0.93; a deliberate Simpson's-paradox trap in the diversity data) so analytics find real structure. Extensions beyond the published schemas are documented and flagged. Known limits — reconstructed enums, two source protocols, no empirical anchor on the operational layer, fictional sites, 12 countries and no China — are in `trial-corpus.md`.

## 11. Out of scope (current baseline)

- Real WCG or client data. Everything is synthetic and labeled.
- Veeva, EDC, TMF, or any downstream connector; live paywalled RWD (the comparator landscape is the stand-in; the connectors panel is a preview).
- Native Google Docs suggestion mode. The separate-revision design is the design.
- **Authoring.** The strategist revises elements and logs decisions. It does not write the protocol.
- Saved or shareable generated charts (session-ephemeral); undo on shipped decisions (re-ship supersedes).
- ~~**Probability of hitting the target** — deferred, not rejected (§14).~~ *(v1.1: un-deferred in its honest empirical form — see §4; the fitted enrollment-variance model remains out of scope.)*
- Delivery-phase tooling (medical monitoring, data review). The product stays upstream.
- *(v1.1, held by direction to keep the prototype simple)* **Artifact export** (PPT/Excel chart export, session-to-deck compilation) and the **competitive-intelligence layer** — demand is real and recorded in §14; HTML charts carry testing for now.
- *(v1.1)* **Multi-user sessions** (Roche, Novartis) — a distinct product problem; hold the line at the shared-doc boundary, with the publish version chain (§7.6) as the bridge.

## 12. Success criteria

1. The client repeats the insight sentence (or their own version of it) after the demo.
2. The ten-minute path runs with no dead air, ending in the ten-second review payoff via the pre-commented doc.
3. Every number in a sensitivity analysis traces to a corpus parameter. Zero invented figures on the scripted path.
4. Sensitivity answers always show options with tradeoffs, never a single unqualified answer.
5. At least one generated chart renders live during the demo and matches its narrative.
6. A client driving the page unassisted ships a decision within three prompts.
7. *(post-feedback)* A user who names one of the five headline questions gets a grounded, chart-backed range answer from the funnel without free-typing a prompt.
8. *(v1.1)* The demo QA regression set (§8) passes before every demo round: the footprint answer on each hero protocol satisfies and states its regulatory floor, and the Ipsen ePRO chain renders its chart.
9. *(v1.1)* Every quantitative claim in a demo answer is auditable in-surface: source chips resolve to corpus tables, scenario definitions open on demand, estimates carry the best-guess flag.

## 13. Users

Grounded to date in the Trial IntelX 2.0 readout (5 personas) and two hands-on interviews:

- **Clinical-operations director** (validated: Pfizer, oncology). Decision frame: "costs, timelines, site distribution and country footprint … building out that blueprint." Pushed hardest on cost-per-patient linked to the SoA and the site/country footprint with regulatory floors.
- **Clinical-development director** (validated: HiBio, transplant). Decision frame: cost, endpoints, regulatory acceptability, "I don't want to forget about clinical operations."

The next research round should deepen the persona set beyond these two seats (protocol authors, feasibility leads, biostatistics, governance/finance approvers are candidates) and test whether the four-question frame holds across them. Persona detail is deliberately thin in this baseline: that is the research gap being filled.

## 14. Deferred, with rationale (the standing backlog)

Items user research has already surfaced, deliberately not built. New research that re-raises one of these strengthens its case; new research that doesn't is also signal.

| Item | Who asked | Why deferred |
|---|---|---|
| ~~**Probability of hitting the target**~~ | Both round-1 interviews, Regeneron clin ops (round 2), AZ exec KPI frame | *(v1.1)* **Promoted to P1** in its honest empirical form (§4), sequenced behind the backtest. The fitted enrollment-variance model stays deferred. |
| **Artifact export** (chart export to PPT/Excel, session-to-deck compilation, decision-log appendix — "that would enthrall me") | Three round-2 users routing outputs to governance decks | *(v1.1, moved from P0 by direction)* Demand is real and recorded; held to keep the prototype simple while the proof plan runs. HTML charts carry testing; flexible inputs-and-outputs lives in §15 as a principle, not a build. |
| **Competitive intelligence layer** (active trials, competitor site overlap, pipeline moves in the same surface) | Three round-2 requesters | *(v1.1, moved from P1 by direction)* Doing it right means a new data layer; parks with the proof plan's data-sourcing decisions rather than the build list. |
| **RWD-validated analytic as a proof asset** (run one headline analytic — patient-journey or screen-fail sensitivity — against a real licensed data set and publish the validation) | Two round-2 experts, independently, as the credibility unlock | *(v1.1)* Not a demo feature; candidate for the engagement's data-science track. |
| **Site-level registry data** (named-site reasoning: US oncology site registry, community-site identification, population alignment) | Regeneron clin dev | *(v1.1)* High value, big data lift; sequence after the oncology-depth work (§10). |
| **Year-by-year cost phasing** | Ipsen | *(v1.1)* Small extension of the cost tool once budget-cycle framing matters; note it in the cost answer's honest-limits line until then. |
| **Multi-user sessions** | Roche, Novartis | *(v1.1)* A distinct product problem; hold the line at the shared-doc boundary, with the publish version chain (§7.6) as the bridge. |
| **Endpoint regulatory acceptability** ("have the endpoints been acceptable to regulators; which studies failed and why") | HiBio | Needs a regulatory-precedent dataset the corpus doesn't hold. The Regulatory & competitive connector is where it plugs in. |
| **Expert/KOL interview data as a first-class source** ("the bread and butter," captured only ad hoc today) | Pfizer | Represented as a connector preview; ingestion and structuring is an engagement-scale build. |
| **Fair-market-value benchmark integration** | Pfizer (named internal gap) | Cost model uses flagged synthetic coefficients; a real FMV source plugs into the Cost & FMV connector. |
| **Survey-grade choropleth map** | (internal) | Proportional-symbol map is recognizable and self-contained; a real basemap is a heavier asset the data already supports. |
| **Voice input; deeper native-agent embedding** | Both round-1 interviews | Unchanged by round 2. Distribution decisions above the demo; the MCP server is the first concrete step, now framed as one of two front doors (§7.8). |
| **Delivery-phase tooling** | Raised and explicitly declined | Both directors agreed upstream is the right entry. |

## 15. Baseline assumptions to test in the next research round

The product's load-bearing bets, stated as falsifiable claims with their current evidence strength. Score each new interview against this table; a claim that keeps confirming hardens into principle, a claim that cracks becomes a version change.

**v1.1 delta log (round 2 scored against the baseline):**

- **A2 refined.** The starting artifact is often a one-page schema, not a full draft (Pfizer's "study-design one-slider," Roche/Regeneron concept sheets) → the Schema mode, §5.
- **A4 extended.** The lead question is seat-dependent, and **regulatory alignment** joins the question set (the floor miss and the evidence-lineage asks, §4.2 and §7.2).
- **A9 validated.** The decision log was confirmed unprompted (Ipsen). Governance-export demand recorded, held in §14 by direction.
- **A11 softened.** Two delivery doors, not one winner — hosted workspace and MCP are peers (§7.8).
- **A12 broken.** Probability of success stopped being deferrable; un-deferred in its honest empirical form, sequenced behind the backtest (§4).
- **New principle to log:** flexible artifact inputs and outputs is a design insight the research keeps confirming. Keep the PRD simple: no new connectors or export builds while the proof plan runs.

| # | Assumption | Evidence today | What would confirm / refute it |
|---|---|---|---|
| A1 | The right entry point is **design strategy, not authoring** — authoring is commoditizing | 8-interview readout; both feedback interviews concurred | Users asking the tool to write protocol sections; sponsors reporting their authoring tools failed to commoditize |
| A2 | **Users always start from a draft**, so the product should open on a document, not an empty chat | Readout ("strategy lives in a PowerPoint"); blank mode was still demanded and added | The share of sessions/asks that are genuinely net-new; whether blank-mode users convert to document-mode habits |
| A3 | **The moat is proprietary ops + protocol data**, and licensed RWD is a commodity | Expert interviews | Users valuing the model/UX over the data; users saying public data would suffice |
| A4 | **Cost, site footprint, timelines, endpoints** are the four questions design decisions turn on | Two feedback interviews (strong, N=2) | New personas naming the same four (confirm) or a different set — e.g. regulatory strategy, sample size/statistics, comparator choice (refute/extend) |
| A5 | **Ranges beat point estimates** — a defensible sensitivity band is what users take to governance | Both feedback interviews, near-verbatim | Users asking the tool to "just give me the number"; governance rejecting ranges |
| A6 | **The decision funnel (guided controls) is the differentiator** against a raw chat agent | Both feedback interviews praised it unprompted | Users ignoring the controls and free-typing everything; power users finding the funnel constraining |
| A7 | **Honest refusal builds trust** — "I don't have that data" is a feature | Praised in both interviews | Users reading refusals as product immaturity rather than integrity |
| A8 | Quantifying tradeoffs in **patients / months / dollars** is the unit system users decide in | Readout (~$500K amendment framing resonated) | Users asking for different units: probability, risk scores, regulatory precedent counts |
| A9 | **Ship-it with an evidence trail** (a decision log a non-participant can follow) matches how teams socialize design decisions | Designed from the readout; not yet directly validated | Users invoking or ignoring the decision log; asking who reads the brief downstream |
| A10 | The **comment-keyed review loop** matches real collaboration (margin notes answered, not documents rewritten) | Designed from the readout; not yet directly validated | Whether teams actually route the brief through Google Docs comments |
| A11 | Distribution via **MCP into the sponsor's own agent surface** beats another portal | "Not another portal" from both interviews; MCP server built in response | Sponsors naming their agent surface and asking to connect vs. preferring the hosted workspace |
| A12 | **Probability-of-success is deferrable** for now — a range is enough without a confidence number | Both interviews asked for it; deferred on honesty grounds | If every new interview asks for it, it stops being deferrable (promote from §14) |
| A13 | The demo argument "**the value is in the data, not the model**" is what buyers repeat | The designed insight sentence; untested against buyers | What clients actually say after seeing it |

## 16. Open questions

1. Client identity and demo date (drives polish budget).
2. Demo format: driven live, or clickable by the client. Changes how much guardrailing the chat needs.
3. Access mechanism: Clerk accounts per attendee vs magic link.
4. Trial IntelX crediting: how visibly the schema lineage is credited per audience, vs presenting a Tweed-named compatible schema.
5. Persona coverage for the next research round (§13): which seats beyond clin-ops and clin-dev, and whether the four-question frame holds across them.
6. Ship-it granularity remains as assumed in v0.2: a ship both rewrites the element in place and logs the decision.
