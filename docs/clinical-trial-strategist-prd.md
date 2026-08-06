# Clinical Trial Strategist — PRD (First Draft)

**Status:** Draft v0.1, for review
**Date:** 2026-08-06
**Companion doc:** `docs/clinical-trial-protocol-strategist-plan.md` (technical scoping, repo constraints, credential gaps)
**Source research:** Trial IntelX 2.0 product strategy readout (8 expert interviews, 5 personas, June–July 2026)

---

## 1. What this is

A client-facing demo of an AI clinical trial strategist, hosted on the Tweed Collective site. The strategist is grounded in a proprietary corpus of CRO trial operations data and detailed protocols. A user brings a draft trial design and the strategist matches it against that operational history: which eligibility criteria will cost the most patients, which design choices historically triggered amendments, what comparable trials did and how they enrolled.

The demo makes one argument: the value is in the data, not the model. Anyone can put a chat window in front of an LLM. The strategist is only interesting because it reasons over protocol and operations depth that is not publicly available.

This PRD defines the product vision, the hero use case, the test use cases, and the functional scope. The companion plan doc covers stack, auth, and the Google credential decision.

## 2. Why this product

Four findings from the research drive the shape of the demo.

**Enter at strategy, not authoring.** Internal sponsor tools already produce an ~80% first-pass protocol draft. Authoring is commoditizing. The defensible entry is upstream, where judgment still rules and teams lose days hunting for reference data before writing begins.

**The moat is the data, not the model.** Experts called licensed RWD "a commodity." Differentiation comes from overlaying proprietary trial intelligence: operations data and detailed protocol history that others cannot replicate.

**Win the workflow by connecting, not replacing.** Strategy today lives in a shared PowerPoint before any synopsis exists. Writers keep their platform. The product fits into the existing flow and hands off cleanly rather than trying to own the document.

**The cost of getting design wrong is measurable.** Amendments run ~$500K each, with real enrollment and dropout impact. Protocol burden is a proven cost driver. That number is the demo's anchor: every recommendation the strategist makes should trace to avoided amendments, avoided screen failures, or faster enrollment.

## 3. Product vision

The vision (deck, p11) is a five-layer platform. Proprietary data at the base, surfaced agentically at the top:

| Layer | Vision | What the demo builds |
|---|---|---|
| Agentic / LLM surface | Sponsors interact through their own agentic systems via MCP. A conversational surface, not a static portal | On-page chat, streaming, scoped to the hero use case |
| Collaborative document system | Draft and refine outputs in a shared workspace (TCN) | Google Docs codify-and-review loop: strategist writes Doc A, human comments, strategist returns Doc B answering each comment |
| Strategic outputs | Protocol strategy at the detail real decisions need, down to the SoA | Design strategy brief with criteria-level and SoA-level recommendations |
| Connected external data | Optional connectors to paywalled RWD, within license terms. Enriching, not required | Comparator trial landscape, CT.gov-style, synthetic |
| Proprietary trial + protocol data | The base differentiator: trial ops depth and detailed protocols not publicly accessible | Synthetic CRO corpus: protocols, criteria-level screen-fail data, amendment histories, site enrollment operations |

The demo is a vertical slice through all five layers. Each layer is thin, but the stack is complete, so the client sees the architecture working end to end rather than a mockup of any single piece.

## 4. Hero use case

Open-ended chat demos badly. The demo runs on one hero job:

> **Pressure-test a draft trial design against operational history before the protocol is written.**

Named scenario: a Phase 2 trial in second-line metastatic NSCLC. The user brings draft inclusion/exclusion criteria and a sketch of the design (arms, primary endpoint, target enrollment). The strategist matches it against the corpus and answers three questions:

1. **Which criteria cost us patients?** Criteria-level screen-fail attribution from operational data. The hero visual is a waterfall: the eligible population shrinking criterion by criterion.
2. **Where is the amendment risk?** Design elements matched against amendment histories: which choices, in which indications, got amended, why, and what it cost.
3. **What does the landscape say?** Endpoints, arms, and SoA burden of comparable trials, with enrollment outcomes.

The insight the client should walk away repeating: **"Two of our criteria were driving most of our screen failures, and the data knew before we enrolled a single patient."** Every build decision runs backward from that sentence.

## 5. Test use cases

Five scripted cases. Each has a prompt, the expected behavior, the data it draws on, and a pass criterion. These double as the demo script and the acceptance tests for the chat layer.

### UC1 — Criteria burden (hero)

- **Prompt:** "Here are our draft I/E criteria for a Phase 2 study in 2L metastatic NSCLC. Which criteria will cost us the most eligible patients?"
- **Expected:** Strategist ranks criteria by screen-fail attribution, names the top two or three with specific rates (e.g. "the ECOG 0–1 restriction alone accounts for roughly a third of screen failures in comparable trials"), and proposes precedented relaxations with the trials that used them.
- **Data:** Criteria-level screen-fail records across the synthetic corpus.
- **Visual:** Criteria-burden waterfall renders or updates on-page.
- **Pass:** Response cites at least two specific criteria with quantified impact and at least one precedent. No generic advice ("consider broadening criteria") without numbers.

### UC2 — Amendment risk

- **Prompt:** "Which parts of this design are most likely to force an amendment?"
- **Expected:** Strategist matches design elements against amendment histories: cause, frequency, timing, and cost (~$500K each). Flags the highest-risk element and what amended trials changed it to.
- **Data:** Amendment records keyed to protocol element and reason.
- **Pass:** At least one design element flagged with amendment frequency from the corpus and the historical fix. Cost framing appears.

### UC3 — Endpoint and comparator landscape

- **Prompt:** "What primary endpoints have succeeded in this indication, and how does our SoA compare on patient burden?"
- **Expected:** Strategist summarizes the comparator field (endpoint choices, arm structures, enrollment outcomes) and positions the draft SoA against the burden distribution of comparable trials.
- **Data:** Comparator trial landscape plus SoA burden scores.
- **Visual:** Comparator scatter (e.g. burden vs enrollment rate) highlights the user's draft position.
- **Pass:** Response names real endpoint patterns from the corpus and places the draft relative to comparators. It does not invent trials outside the corpus.

### UC4 — Enrollment feasibility

- **Prompt:** "If we keep the design as-is, what does enrollment look like, and what single change buys the most speed?"
- **Expected:** Strategist projects enrollment from site-level operational rates, then identifies the highest-leverage design change (likely a criterion from UC1) with the estimated improvement, honestly hedged.
- **Data:** Site enrollment operations: screen rates, screen-fail rates, enrollment velocity.
- **Pass:** A quantified projection with a stated assumption, and one ranked recommendation. Hedged, not falsely precise.

### UC5 — Codify and review (the collaboration loop)

- **Prompt:** "Codify this conversation into a design strategy brief for the team."
- **Expected:** Strategist writes Doc A to Google Docs: recommended criteria set, flagged amendment risks, comparator positioning, open decisions. A human adds margin comments. On "review my comments," the strategist reads the comments and returns Doc B: the revised brief with a change log at the top, each entry keyed to the comment it answers.
- **Pass:** Doc A is structured (headings, tables), not a text wall. Doc B's change log maps one-to-one to the human comments. This is the differentiator: the loop reads as collaboration, not one-shot generation.

UC1 → UC2 → UC5 is the ten-minute demo path. UC3 and UC4 are follow-on questions the client can ask live.

## 6. Functional requirements

**Chat layer.** Server-side streaming via `app/api/protocol-strategist/route.ts`. System prompt scoped to the hero use case and the corpus. The strategist must refuse to speculate beyond the data and must cite corpus records when making quantitative claims. Suggested prompts on-page so a client driving it themselves lands on UC1–UC4.

**Analytics layer.** The visualizations render the same data the strategist reasons over, on the same page. Chart interactions and chat stay in sync where cheap (the strategist's answer highlights the relevant chart elements). Charts use the existing `chartTheme` per `AGENTS.md`.

**Document layer.** Codify writes Doc A as HTML converted by Drive (preserves headings and tables). Review reads Doc A with anchored comment threads and produces Doc B as a separate document with a comment-keyed change log. Credential path per the plan doc (service account recommended for the demo, pre-seeded fallback ready).

**Access.** Route under `/clients/{client}/protocol-strategist`, inheriting Clerk gating. Magic-link fallback exists if per-attendee accounts are the wrong fit.

## 7. Data specification

Fully synthetic, labeled as such on-page. Synthesized from 3–5 real-shaped sample records once provided (plan doc gaps 5–6). Units of record:

| Table | Grain | Key fields |
|---|---|---|
| Protocols | One row per trial | Indication, phase, arms, primary/secondary endpoints, target N, sponsor type, status |
| Criteria | One row per I/E criterion per trial | Criterion text, category (lab, performance status, prior therapy, comorbidity), screen-fail attribution % |
| Amendments | One row per amendment | Trial, protocol element changed, reason, timing (months from FPI), cost estimate |
| Site operations | One row per site per trial | Screens, screen fails, enrolled, velocity (patients/site/month), activation lag |
| SoA | One row per assessment per trial | Visit schedule, procedure, burden score |

Corpus size target: ~40–60 synthetic trials in and around NSCLC, enough that rankings and rates feel like data rather than anecdotes. The strategist's system prompt binds it to this corpus.

## 8. Visualization specification

Each visual is specified by what the reader concludes, not what is on the axes.

1. **Criteria-burden waterfall (hero).** Conclusion: "Our eligible population shrinks 60% before we screen anyone, and two criteria do most of the damage." Starting eligible population at left, each criterion removes a slice, final eligible pool at right.
2. **Comparator landscape scatter.** Conclusion: "Our draft design is more burdensome than the trials that enrolled fastest." SoA burden vs enrollment velocity, one point per comparator trial, draft design highlighted.
3. **Amendment-risk view.** Conclusion: "The elements we are least sure about are the ones that historically get amended." Amendment frequency by protocol element, with cost framing.

## 9. Out of scope for the demo

- Real WCG or client data. Everything is synthetic and labeled.
- An actual MCP server surface. The chat page stands in for the agentic layer. The vision slide covers where MCP fits.
- Veeva, EDC, TMF, or any downstream connector.
- Live paywalled RWD. The comparator landscape is the stand-in.
- Native Google Docs suggestion mode (not reachable via the connector). Doc B as a separate document is the design, not a compromise to apologize for.
- Authoring. The strategist hands off a brief. It does not write the protocol.

## 10. Success criteria

1. The client repeats the insight sentence (or their own version of it) after the demo.
2. UC1 → UC2 → UC5 runs in under ten minutes with no dead air. The review loop payoff shows in ten seconds via the pre-commented Doc A.
3. Every quantitative claim in a strategist response traces to a corpus record. Zero invented trials or numbers in the scripted path.
4. A client driving the page unassisted reaches a substantive answer within two prompts.

## 11. Open questions

Carried from the plan doc, still owned outside this PRD:

1. Client identity and demo date (drives polish budget).
2. Demo format: Nate-driven live, or clickable by the client. Changes how much guardrailing the chat needs.
3. Access mechanism: Clerk accounts per attendee vs magic link.
4. Auto-merge posture: pushes to `claude/**` deploy to production. Gate or allow for this build.
5. Sample records and confidentiality confirmation, which unblock the data synthesis.

Blocking items with lead time remain the Anthropic API key and the Google credential decision (plan doc, gaps 1–2).
