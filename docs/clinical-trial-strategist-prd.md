# Clinical Trial Strategist — PRD (First Draft)

**Status:** Draft v0.2, for review
**Date:** 2026-08-06
**Companion doc:** `docs/clinical-trial-protocol-strategist-plan.md` (technical scoping, repo constraints, credential gaps)
**Source research:** Trial IntelX 2.0 product strategy readout (8 expert interviews, 5 personas, June–July 2026)

**Changed in v0.2:** Hero use case reframed around pressure-testing an already-drafted design document. Added the sensitivity-analysis interaction model, second-order questions, LLM-generated charts in a side panel, and the "ship it" decision flow.

---

## 1. What this is

A client-facing demo of an AI clinical trial strategist, hosted on the Tweed Collective site. The strategist is grounded in a proprietary corpus of CRO trial operations data and detailed protocols.

The core motion: a design document already exists. The user selects an element of it, asks what happens if that element changes, and the strategist runs a sensitivity analysis against operational history. Options come back with relative tradeoffs and charts. The user explores, decides, and ships the decision back into the document with its evidence attached.

The demo makes one argument: the value is in the data, not the model. Anyone can put a chat window in front of an LLM. The strategist is only interesting because every tradeoff it quantifies comes from protocol and operations depth that is not publicly available.

This PRD defines the product vision, the interaction model, the hero use case, the test use cases, and the functional scope. The companion plan doc covers stack, auth, and the Google credential decision.

## 2. Why this product

Four findings from the research drive the shape of the demo.

**Enter at strategy, not authoring.** Internal sponsor tools already produce an ~80% first-pass protocol draft. Authoring is commoditizing. The defensible entry is upstream, where judgment still rules and teams lose days hunting for reference data before writing begins.

**The starting point is never blank.** Strategy lives in a shared PowerPoint before any synopsis exists, and clinical dev copy-pastes from the closest prior protocol. Teams always have a draft. What they lack is a way to interrogate it. That is why the product starts from a document rather than an empty chat.

**The moat is the data, not the model.** Experts called licensed RWD "a commodity." Differentiation comes from overlaying proprietary trial intelligence: operations data and detailed protocol history that others cannot replicate.

**The cost of getting design wrong is measurable.** Amendments run ~$500K each, with real enrollment and dropout impact. Protocol burden is a proven cost driver. Every sensitivity analysis the strategist runs should resolve to those units: patients, months, dollars.

## 3. Product vision

The vision (deck, p11) is a five-layer platform. Proprietary data at the base, surfaced agentically at the top:

| Layer | Vision | What the demo builds |
|---|---|---|
| Agentic / LLM surface | Sponsors interact through their own agentic systems via MCP. A conversational surface, not a static portal | On-page chat, streaming, scoped to the hero flow, with generated charts in a side panel |
| Collaborative document system | Draft and refine outputs in a shared workspace (TCN) | The design brief in Google Docs is both input and output: pre-drafted at start, revised by shipped decisions, reviewed via the comment loop |
| Strategic outputs | Protocol strategy at the detail real decisions need, down to the SoA | Element-level decisions with quantified tradeoffs and an evidence trail |
| Connected external data | Optional connectors to paywalled RWD, within license terms. Enriching, not required | Comparator trial landscape, CT.gov-style, synthetic |
| Proprietary trial + protocol data | The base differentiator: trial ops depth and detailed protocols not publicly accessible | Synthetic CRO corpus: protocols, criteria-level screen-fail data, procedure operations, amendment histories, site enrollment operations |

The demo is a vertical slice through all five layers. Each layer is thin, but the stack is complete, so the client sees the architecture working end to end rather than a mockup of any single piece.

## 4. Interaction model

One loop, repeated per design element:

```
Draft doc → select element → interrogate → sensitivity analysis → explore → decide → ship it → doc updated
```

**Interrogate (first order).** The user asks about an element of the draft. "Which of these criteria will cost us the most patients?" The strategist answers from the corpus and the relevant fixed chart renders or highlights.

**Sensitivity analysis (second order).** After seeing the first charts, the user asks what-if questions. "Medical is telling me I need to add an endoscopy screening to verify this GI disease. How does that hit my recruitment timeline?" The strategist does not return a single answer. It returns options with relative tradeoffs: 2 to 4 scenarios, each quantified in patients, months, and dollars, with the operational drivers named (scheduling lag, site availability, patient refusal). Second-order questions chain: the user can push on any option ("what if only sites without in-house endoscopy get the central-read option?") and the analysis re-runs.

**Two chart surfaces.**
- *Fixed charts:* the core visuals (criteria waterfall, comparator scatter, amendment risk) are pre-built Chart.js components wired to the corpus. Reliable, styled, always correct.
- *Generated charts:* for questions the fixed charts don't cover, the strategist emits a self-contained HTML chart that renders in a side panel. This is how the demo handles the long tail of second-order questions without pre-building every view.

**Decide and ship.** When the user settles on an option, they ship it. Shipping writes the decision into the output doc: the element as revised, the option chosen, the alternatives considered, the quantified tradeoff accepted, and the corpus evidence behind it. The doc accumulates a decision log, so by the end it reads as a design brief where every choice shows its work.

**Review loop.** The doc then goes through the existing comment cycle: teammates add margin comments, the strategist reads them and returns a revision with a change log keyed to each comment.

## 5. Hero use case

The hero is the loop itself, run against a pre-drafted document:

> **Start from a drafted trial design and computationally pressure-test its elements, one at a time, before the protocol is written.**

Named scenario: a Phase 2 trial in second-line metastatic NSCLC with a GI comorbidity angle in the eligibility criteria. The design brief already exists in Google Docs (pre-seeded): arms, primary endpoint, draft I/E criteria, sketch SoA, target enrollment. The demo opens on that doc, not on an empty chat.

The insight the client should walk away repeating: **"We pressure-tested the draft before it went to writing, and the document shows why every choice held or changed."** Every build decision runs backward from that sentence.

## 6. Test use cases

Each case has a prompt, the expected behavior, the data it draws on, and a pass criterion. These double as the demo script and the acceptance tests for the chat layer.

### UC1 — First-order interrogation: criteria burden

- **Prompt:** "Which criteria in this draft will cost us the most eligible patients?"
- **Expected:** Strategist ranks criteria by screen-fail attribution, names the top two or three with specific rates, and proposes precedented relaxations with the trials that used them.
- **Data:** Criteria-level screen-fail records.
- **Visual:** Criteria-burden waterfall (fixed).
- **Pass:** At least two criteria cited with quantified impact and one precedent. No generic advice without numbers.

### UC2 — Sensitivity: added screening procedure (hero what-if)

- **Prompt:** "Medical is telling me I need to add an endoscopy screening to verify this GI disease. How could this impact my recruitment timeline?"
- **Expected:** A sensitivity analysis, not a single answer. Something like: (a) endoscopy required at all sites — screening window extends ~3 weeks, ~12% screen-refusal, enrollment completion slips ~2.5 months; (b) central read of existing imaging accepted where available — smaller slip, applies at ~60% of sites; (c) endoscopy within prior 6 months accepted — smallest slip, adds a records-retrieval burden. Each option carries the operational drivers (scheduling lag by site type, refusal rates, vendor cost) from the corpus.
- **Data:** Procedure operations table: per-procedure scheduling lag, site availability, refusal rates, cost.
- **Visual:** Sensitivity comparison (fixed template fed by scenario output, or generated). Options side by side on timeline impact.
- **Pass:** 2 to 4 options, each quantified in months and patients, drivers named, corpus-sourced. The tradeoff is legible in one glance at the chart.

### UC3 — Sensitivity: added secondary endpoints

- **Prompt:** "Let's consider adding these secondary endpoints. How could this impact data collection timelines?"
- **Expected:** Strategist maps each proposed endpoint to its assessment burden: added visits or procedures, data volume, cleaning and query lag, site data-entry load. Returns options (all endpoints, a prioritized subset, deferral to exploratory) with timeline deltas to database lock.
- **Data:** SoA and assessment-to-data-timeline mapping.
- **Visual:** Timeline impact by option, generated chart acceptable.
- **Pass:** Per-endpoint burden quantified, at least one option that protects the timeline, tradeoffs stated honestly (what you give up, not just what you save).

### UC4 — Second-order chaining and generated charts

- **Prompt (following UC2):** "For the central-read option, show me the slip by site type. Which sites drive it?"
- **Expected:** Strategist re-cuts the analysis at site level and emits an HTML chart for the side panel, since no fixed chart covers this view. The narrative names the driver ("community sites without GI departments account for most of the slip").
- **Data:** Site operations joined to procedure availability.
- **Pass:** Generated chart renders in the side panel, matches the numbers in the narrative, uses only corpus data. This case proves the long tail works.

### UC5 — Ship it

- **Prompt:** "Go with the central-read option. Ship it."
- **Expected:** The decision lands in the output doc: revised criterion text, option chosen, alternatives considered with their tradeoffs, evidence citations. The doc's decision log gains an entry. The user sees confirmation and a link.
- **Pass:** The doc entry is self-contained: a teammate who was not in the session can read why the choice was made. No session context required to understand it.

### UC6 — Amendment risk as a pressure test

- **Prompt:** "Before this goes to writing, which elements of the design are most likely to force an amendment?"
- **Expected:** Strategist sweeps the drafted design against amendment histories: which element types get amended in this indication, how often, when, and the ~$500K framing. Flags anything the user has not yet pressure-tested.
- **Data:** Amendment records keyed to protocol element and reason.
- **Pass:** At least one flagged element with amendment frequency and the historical fix. Works as the demo's closing beat: the strategist proactively points at remaining risk.

### UC7 — Review loop

- **Flow:** The shipped doc gets margin comments from a teammate (pre-seeded for demo). On "review my comments," the strategist reads them and returns a revision with a change log keyed one-to-one to the comments.
- **Pass:** Change log maps one-to-one to comments. The loop reads as collaboration, not one-shot generation.

**Ten-minute demo path:** open the drafted doc → UC2 (endoscopy sensitivity) → UC4 (second-order chain, generated chart) → UC5 (ship it) → UC6 (amendment sweep) → UC7 payoff via the pre-commented doc. UC1 and UC3 are questions the client can ask live.

## 7. Functional requirements

**Chat layer.** Server-side streaming via `app/api/protocol-strategist/route.ts`. System prompt scoped to the hero flow and the corpus. The strategist must refuse to speculate beyond the data and must cite corpus records when making quantitative claims. Suggested prompts on-page so a client driving it themselves lands on UC1–UC4.

**Sensitivity engine.** What-if answers compose from precomputed operational parameters in the corpus (lags, rates, costs per procedure, site type, and assessment), not from numbers the model invents. The model's job is scenario construction and narrative. The arithmetic sits in structured data it retrieves. This is the line between a defensible analysis and a plausible hallucination, and it is the thing the demo cannot get wrong.

**Fixed charts.** Core visuals are pre-built Chart.js components wired to the corpus, using the existing `chartTheme` per `AGENTS.md`. Strategist answers reference and highlight them where cheap.

**Generated charts.** The strategist can return a self-contained HTML/JS chart, rendered in a sandboxed iframe (`srcdoc`, no external requests, which the CSP already enforces). Data for the chart is injected from corpus retrievals, not free-typed by the model. Display-only: generated charts are ephemeral to the session and are not saved as dashboards. Failure containment: a malformed generated chart shows a fallback message in the panel, never breaks the page.

**Ship-it flow.** A shipped decision writes to the output doc: revised element text, chosen option, alternatives with tradeoffs, evidence citations. Implemented through the same Drive path as the codify loop (HTML in, Drive converts). Each ship appends to a decision log section. Undo is out of scope; re-shipping an element appends a superseding entry.

**Document layer.** The design brief is pre-drafted in Google Docs at session start (pre-seeded for the demo). Ship-it revises it. The review loop reads anchored comment threads and produces the revision with a comment-keyed change log. Credential path per the plan doc (service account recommended, pre-seeded fallback ready).

**Access.** Route under `/clients/{client}/protocol-strategist`, inheriting Clerk gating. Magic-link fallback exists if per-attendee accounts are the wrong fit.

## 8. Data specification

Fully synthetic, labeled as such on-page. Synthesized from 3–5 real-shaped sample records once provided (plan doc gaps 5–6). Units of record:

| Table | Grain | Key fields |
|---|---|---|
| Protocols | One row per trial | Indication, phase, arms, primary/secondary endpoints, target N, sponsor type, status |
| Criteria | One row per I/E criterion per trial | Criterion text, category (lab, performance status, prior therapy, comorbidity), screen-fail attribution % |
| Procedure operations | One row per procedure per site type | Scheduling lag (days), availability %, patient refusal rate, cost, staffing dependency |
| Assessments / SoA | One row per assessment per trial | Visit schedule, procedure, burden score, data volume, cleaning/query lag |
| Amendments | One row per amendment | Trial, protocol element changed, reason, timing (months from FPI), cost estimate |
| Site operations | One row per site per trial | Screens, screen fails, enrolled, velocity (patients/site/month), activation lag, site type |

The procedure-operations and assessment tables are new in v0.2 and carry the sensitivity engine: UC2 runs on procedure operations, UC3 on the assessment-to-data-timeline mapping. Corpus size target: ~40–60 synthetic trials in and around NSCLC, enough that rankings and rates feel like data rather than anecdotes. The strategist's system prompt binds it to this corpus.

## 9. Visualization specification

Each visual is specified by what the reader concludes, not what is on the axes.

**Fixed:**

1. **Criteria-burden waterfall.** Conclusion: "Our eligible population shrinks 60% before we screen anyone, and two criteria do most of the damage."
2. **Sensitivity comparison.** Conclusion: "Option B costs us three weeks. Option A costs us three months." Options side by side, one bar or line per scenario, timeline and patient impact. This is the template every what-if answer feeds.
3. **Comparator landscape scatter.** Conclusion: "Our draft design is more burdensome than the trials that enrolled fastest." SoA burden vs enrollment velocity, draft highlighted.
4. **Amendment-risk view.** Conclusion: "The elements we are least sure about are the ones that historically get amended."

**Generated (side panel):** everything else. Site-level cuts, per-endpoint burden breakdowns, whatever the second-order question needs. The bar for a generated chart is lower on polish and identical on correctness.

## 10. Out of scope for the demo

- Real WCG or client data. Everything is synthetic and labeled.
- An actual MCP server surface. The chat page stands in for the agentic layer.
- Veeva, EDC, TMF, or any downstream connector.
- Live paywalled RWD. The comparator landscape is the stand-in.
- Native Google Docs suggestion mode (not reachable via the connector). The separate-revision design is the design, not a compromise.
- Authoring. The strategist revises elements and logs decisions. It does not write the protocol.
- Saved or shareable generated charts. Side-panel charts are session-ephemeral.
- Undo on shipped decisions. Re-ship supersedes.

## 11. Success criteria

1. The client repeats the insight sentence (or their own version of it) after the demo.
2. The ten-minute path runs with no dead air: doc → sensitivity → second-order chain → ship → amendment sweep → review payoff in ten seconds via the pre-commented doc.
3. Every number in a sensitivity analysis traces to a corpus parameter. Zero invented figures on the scripted path.
4. Sensitivity answers always show options with tradeoffs, never a single unqualified answer.
5. At least one generated chart renders live during the demo and matches its narrative.
6. A client driving the page unassisted ships a decision within three prompts.

## 12. Open questions

1. Client identity and demo date (drives polish budget).
2. Demo format: Nate-driven live, or clickable by the client. Changes how much guardrailing the chat needs.
3. Access mechanism: Clerk accounts per attendee vs magic link.
4. Auto-merge posture: pushes to `claude/**` deploy to production. Gate or allow for this build.
5. Sample records and confidentiality confirmation, which unblock the data synthesis.
6. The pre-drafted doc: how far along is the "draft" at demo start? A near-final brief makes pressure-testing feel real. A thin sketch makes shipped decisions look more dramatic. Leaning near-final, since the hero story is a starting point that gets stress-tested, not built.
7. Ship-it granularity: does a ship rewrite the element in place in the doc plus log the decision, or only log the decision? Current assumption: both.

Blocking items with lead time remain the Anthropic API key and the Google credential decision (plan doc, gaps 1–2).
