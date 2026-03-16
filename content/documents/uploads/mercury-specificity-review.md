# Mercury AI Diligence — Specificity Review

**Document:** `mercury-buyer-ai-diligence.ts` (39 slides, 4 phases)
**Reviewer:** Claude × Nate Beyor
**Date:** March 15, 2026
**Scope:** Content sharpening within existing structure. No major reordering.

---

## Front Matter (Slides 1–3)

### Slide 2 · `framework-overview` — How We Evaluated Mercury's AI Portfolio

**Current state:** Sets up the 4-phase framework for the reader.

**Sharpening opportunity:** This slide should do double duty — it frames the methodology *and* pre-loads the key takeaway altitude. Right now "How We Evaluated" is purely procedural. Consider adding a single sentence under each phase label that telegraphs the verdict before the reader gets there. Example: under Phase 2, instead of just "Disruption Risk," something like "Disruption Risk — *Moderate: domain moats are real but narrower than management believes.*" This lets the WCG reader pattern-match against their own priors immediately and read the rest of the deck as confirmation or surprise, not discovery.

**Specificity test:** Can a WCG executive read this slide and know whether Tweed's overall recommendation is enthusiastic, cautious, or conditional — before turning to slide 3?

---

### Slide 3 · `executive-summary` — Executive Summary

**Sharpening opportunity:** Make sure this slide explicitly answers the three questions the IC memo writer will ask:

1. **Is the AI real?** (Not vaporware, not rebranded rules engines, not "we have a chatbot")
2. **Does it compound under WCG ownership?** (Synergy isn't just additive — does WCG's data/channel/client base make Mercury's AI *better* than it would be standalone?)
3. **What's the risk-adjusted value range?** (Even directional — "low single-digit millions in Year 1 synergies, scaling to mid-teens by Year 3" is better than "significant potential")

If any of those three are missing or soft, flag them as the thing the reader should watch for in the phase detail.

---

## Phase 1 — Business Value & Growth Thesis (Slides 4–8)

### Slide 5 · `growth-projections` — Growth Projections — Snapshot + Assumptions

**Sharpening opportunity:** Growth projections in a diligence context need to clearly separate three layers:

- **Mercury's own projections** (what management says)
- **Tweed's adjusted view** (what we think is realistic, and why it differs)
- **WCG-enhanced projections** (what happens with buyer synergies applied)

If this slide conflates any two of those, the reader won't know whose assumptions they're looking at. Label each projection line explicitly. Even a simple parenthetical — "(Mgmt)" vs "(Tweed Adj.)" vs "(+ WCG Synergy)" — eliminates ambiguity.

---

### Slide 6 · `offering-ai-growth-matrix` — Offering + AI Initiatives ↔ Growth Drivers

**Sharpening opportunity:** Matrices are powerful but risk becoming wallpaper if every cell is equally weighted. Add a visual or textual emphasis layer that tells the reader: *these 2–3 intersections are where the real value concentrates.* A heat map treatment, bold borders, or even just a callout box saying "Primary value drivers are highlighted" prevents the IC reader from having to do their own pattern recognition.

---

### Slide 8 · `scenarios` — Scenarios for Growth & Disruption Outcomes

**Sharpening opportunity:** This is the capstone of Phase 1. The risk is that it reads as generic bull/base/bear. To make it Tweed-grade:

- Each scenario should name the **specific conditions** that make it true (not "favorable market conditions" — rather "FDA finalizes the clinical trial modernization guidance in 2026, accelerating CTMS adoption by 18–24 months")
- Each scenario should have a **probability weight** or at least a qualitative confidence signal ("We believe the base case is most likely because…")
- The bear case should specifically address: *What if WCG acquires Mercury and the AI doesn't deliver?* Frame the downside as the acquisition premium paid for AI optionality that doesn't materialize — that's what the IC is actually stress-testing.

**Format note:** The MKG model's "What Needs to Be True" column is the right mental model here, applied at the scenario level rather than the initiative level.

---

## Phase 2 — AI Initiatives & Disruption Risk (Slides 9–19)

### Structural note: The Phase 2 seam

Phase 2 contains two distinct analyses joined at the hip: Disruption Risk (slides 9–13) and AI Assessment (slides 14–19). This is fine — they belong together because the disruption analysis sets up the question and the AI assessment answers it. But the **transition from slide 13 to slide 14** needs to be load-bearing.

**Recommendation for slide 13 → 14 bridge:** The `build-it-today` slide (13) should end with an explicit setup: "Given what a well-resourced competitor *could* build, here is what Mercury *actually has* — and where the gaps and advantages sit." The AI Assessment exec summary (slide 14) should then open by referencing the replicability analysis: "Against the 'build-it-today' benchmark, Mercury's AI portfolio shows strengths in X and gaps in Y." Without this connective tissue, the two halves feel like separate reports that happen to be in the same PDF.

---

### Slide 11 · `what-they-would-build` — What the Disruptor Would Build

**Sharpening opportunity:** This slide is strongest when it's uncomfortably specific. Don't describe the disruptor in generic terms ("a well-funded tech company could build…"). Instead:

- Name the **specific stack** the disruptor would assemble (e.g., "An LLM-native clinical trial budgeting tool built on [specific foundation model] with [specific data integration], sold through [specific channel]")
- Estimate the **build timeline and cost** (this also pre-loads the build-vs-buy argument in Phase 4)
- Identify the **one or two things the disruptor *cannot* easily replicate** — this is where Mercury's moat lives, and it should be stated here even though it gets developed further in Phase 3

---

### Slide 13 · `build-it-today` — "Build-It-Today" Replicability

**Sharpening opportunity:** This slide should produce a clear verdict for each major Mercury capability:

| Capability | Replicable in 12 months? | Primary barrier | Moat durability |
|---|---|---|---|
| Budget tool | Partially — core logic yes, domain config no | 15+ years of site/procedure cost data | High (data) |
| CTMS integration | Yes, with significant effort | Regulatory validation + client trust | Medium (switching cost) |
| *etc.* | | | |

If the slide is currently more narrative than tabular, consider whether a summary table (even a small one) would give the IC reader a faster path to the verdict. They can read the narrative for nuance, but the table is what they'll screenshot for the memo.

---

### Slide 15 · `ai-inventory` — AI Inventory (What Exists)

**Sharpening opportunity:** For each AI capability in the inventory, make sure the slide distinguishes between:

- **Shipped and revenue-generating** (in production, clients paying for it)
- **Shipped but pre-revenue** (in production, bundled or free, no incremental revenue yet)
- **In development** (roadmap item with a timeline)
- **Conceptual** (discussed in management presentations but no code written)

PE buyers have been burned enough times by "AI capabilities" that turn out to be a PowerPoint slide and a prompt. A simple maturity tag per item (even just icons: 🟢 shipped / 🟡 building / 🔴 concept) dramatically increases credibility.

---

### Slide 16 · `architecture-readiness` — Architecture Snapshot + Readiness

**Sharpening opportunity:** Architecture slides in diligence decks often fall into one of two failure modes: (a) too technical for the IC audience, or (b) so simplified they don't actually assess readiness. The sweet spot is answering these questions:

1. **Can Mercury's AI run on WCG's infrastructure**, or does integration require a re-platform?
2. **Is the data pipeline real** — do they have production ETL/ELT into a structured data layer, or is it manual CSV uploads and ad hoc scripts?
3. **What's the model dependency risk?** If Mercury's AI is built entirely on a single vendor's API (e.g., OpenAI), what happens when pricing changes or the model degrades on a version update?

These are the questions a CTO doing technical diligence would ask. If the slide answers them, it's doing its job. If it's showing a generic cloud architecture diagram, it needs sharpening.

---

### Slide 18 · `ai-value-proof` — AI Value & Proof — External Examples

**Sharpening opportunity:** External examples are useful for framing ("here's what good looks like in adjacent markets") but can accidentally undermine the thesis if the reader thinks "so Mercury is behind these benchmarks." Make sure each external example is explicitly connected to a Mercury capability with a clear statement of where Mercury sits relative to the benchmark: ahead, at parity, or behind with a credible path to close.

---

### Slide 19 · `internal-value-proofs` — Internal Value Proofs

**Sharpening opportunity:** This is where the MKG-style quantification approach could be applied *within* Mercury's own operations (separate from the WCG synergy model we'll build later). If Mercury has internal metrics on any of the following, surface them here:

- Time savings on specific workflows (e.g., "Budget tool reduces site cost estimation from 3 days to 4 hours")
- Error rate reduction (e.g., "AI-flagged regulatory issues catch X% of items that human review alone missed")
- Client NPS or retention lift attributable to AI-enhanced deliverables

Even one or two hard numbers here transforms this slide from "they say it works" to "here's the proof."

---

## Phase 3 — Team, Assets & Defensibility (Slides 20–29)

### Slide 22 · `budget-deep-dive` — Budget Product Deep Dive

**Sharpening opportunity:** As noted in the earlier discussion — the asymmetry of giving Budget its own deep dive slide while other products don't get one needs to be *justified on the slide itself.* Add a framing line at the top: something like "Budget is Mercury's largest revenue contributor and the primary synergy vector with WCG's ClinSphere platform, warranting deeper analysis." Without this, a reader unfamiliar with the deal might wonder why this product gets special treatment.

If Budget is *not* the primary synergy vector, then the question is whether this slide should exist at all, or whether the deep dive should be on whichever product *is* the primary vector.

---

### Slide 23 · `data-asset` — Data Asset Strength

**Sharpening opportunity:** Data asset slides in PE diligence need to answer a specific question: **Is this data *proprietary*, *differentiated*, and *compounding*?**

- **Proprietary:** Can a competitor buy or scrape the same data? If Mercury's data comes from public sources (ClinicalTrials.gov, FDA databases), the asset is the *curation and structuring*, not the data itself — say so explicitly.
- **Differentiated:** Does Mercury have data that no one else has? Client-contributed data, historical cost benchmarks from past engagements, validated outcome data from completed trials — these are genuinely differentiated.
- **Compounding:** Does the data get more valuable with each new client or engagement? This is the flywheel argument and it should connect forward to the `data-flywheel` slide in Phase 4.

---

### Slide 24 · `channel-asset` — Channel Asset Strength

**Sharpening opportunity:** Channel strength for a clinical trial services company is really about **switching costs and workflow embeddedness.** The question isn't "how many clients do they have" but "how painful is it for a client to rip Mercury out of an active trial?" If Mercury's tools are integrated into a client's trial execution workflow (not just used for a one-time deliverable), that's a fundamentally stronger channel position. Make sure the slide distinguishes between transactional relationships and embedded ones.

---

### Slides 26–29 · Team + Operating Model cluster

**Sharpening opportunity across the cluster:** The team and operating model slides should produce a clear answer to the post-acquisition retention question: **Who are the 3–5 people WCG cannot afford to lose in the first 18 months, and what's the plan to retain them?** If the slides currently assess the team in the abstract (org chart, functional coverage, maturity model), add a "Key Person Risk" callout that names roles (not necessarily individuals, given confidentiality) and rates the retention risk. This is the #1 question the WCG integration team will ask.

---

## Phase 4 — ROI Quantification & Synergy Roadmap (Slides 30–39)

### Slide 32 · `ctms-synergy` — CTMS Synergy — Mercury as the Missing ClinSphere Module

**Sharpening opportunity:** This is one of the strongest slides in the deck conceptually. To make it airtight:

- Map specific Mercury capabilities to specific ClinSphere gaps (not "Mercury complements ClinSphere" but "Mercury's Budget module fills ClinSphere's lack of AI-assisted site cost estimation, which currently requires manual input from X WCG FTEs per trial")
- State the integration complexity honestly: is this a 3-month API integration or an 18-month re-architecture? The IC will assume the worst if you don't tell them.
- If possible, name a specific client scenario: "For a Phase III oncology trial with 200 sites, the combined ClinSphere + Mercury Budget workflow would reduce budgeting cycle time from Y weeks to Z weeks"

---

### Slide 33 · `synergy-waves` — Synergy Pathways (3 Waves)

**Sharpening opportunity:** Wave-based synergy roadmaps need to be specific about two things: **what's in each wave** and **what triggers the transition between waves.** If Wave 1 is "quick wins" and Wave 2 is "deeper integration," define the gate: is it a time gate (6 months), a milestone gate (first joint client live), or a dependency gate (platform integration complete)? Without gates, waves become aspirational timelines that slip without anyone noticing.

---

### Slide 35 · `build-vs-buy` — Build vs. Buy — Cost to Replicate

**Sharpening opportunity:** This slide should produce a single number (or range) that the IC can compare directly against the acquisition price. The format should be:

- **Cost to build equivalent:** $X–Y (with assumptions: team size, timeline, loaded cost per engineer, opportunity cost of delayed market entry)
- **Time to market if built:** N months (with assumptions)
- **Probability of successful internal build:** Low/Medium/High (with reasoning — most internal enterprise AI builds in regulated industries fail or take 2–3x longer than planned)

The punchline: "Acquiring Mercury at [price] represents a [X%] discount to the risk-adjusted cost of internal build, with [Y months] of time-to-market advantage."

---

### Slide 36 · `data-flywheel` — WCG Data Flywheel

**Sharpening opportunity:** Flywheel diagrams are often the most exciting slide in a deck and the least actionable. Ground this one by answering: **What is the first turn of the flywheel?** Specifically, what is the first data asset WCG would feed into Mercury's AI that Mercury doesn't currently have, and what does the output look like? If the answer is "WCG's historical IRB review data enables Mercury's AI to predict protocol amendment risk," that's concrete and testable. If the answer is "WCG's data makes Mercury's AI better," that's a bumper sticker.

---

### Slide 37 · `priority-initiatives` — Priority Initiatives — Assumptions + Uplift

**Sharpening opportunity:** This slide is the natural home for MKG-style quantification at the initiative level. Each priority initiative should have:

- Estimated cost (investment required)
- Estimated uplift (revenue or productivity, low/high)
- Timeline to value
- Key assumption / "What Needs to Be True"

If the slide currently lists initiatives without these columns, it's a prioritization framework without teeth. The IC reader needs to see that you've stress-tested the uplift claims, not just listed them.

---

### Slide 38 · `quantification-placeholder` — Quantification Placeholder

**Current state:** Placeholder. This is the gap.

**Recommendation:** Replace with a summary synergy table modeled on the MKG Combined Summary tab. Three rows:

| Synergy Category | Low | High | Key Assumptions |
|---|---|---|---|
| Cost synergies (WCG productivity gains from Mercury AI) | $X | $Y | [brief] |
| Revenue synergies (Mercury products through WCG channel) | $X | $Y | [brief] |
| Build-vs-buy cost avoidance | $X | $Y | [brief] |
| **Total** | **$X** | **$Y** | |

The detail behind each row lives in the supporting slides (35, 37, and the new model we'll build). This slide is the "so what" — the single table the IC memo writer will copy-paste.

We will build the underlying model as a separate workstream (next step after this review).

---

### Slide 39 · `sensitivity` — Sensitivity: Impact on Growth Curve

**Sharpening opportunity:** Sensitivity analysis should vary the **assumptions the IC is most likely to challenge**, not just apply uniform +/- 20% bands. Based on the deal structure, the three most contestable assumptions are probably:

1. **Synergy capture rate** — what % of identified synergies actually materialize in Year 1? (Industry benchmark for tech acquisitions: 40–60% of projected synergies realized in first 18 months)
2. **Client retention through acquisition** — if Mercury loses 10/20/30% of clients due to acquisition uncertainty, what happens to the growth curve?
3. **Integration timeline** — if platform integration takes 18 months instead of 9, what's the NPV impact of delayed synergy realization?

Run the sensitivity on these three axes. If the deal still works at pessimistic assumptions on all three, that's a powerful closing argument.

---

## Cross-Cutting Observations

### Consistency of analytical altitude

Phases 1–3 are analytical and evidence-based. Phase 4 currently reads more aspirational because the quantification placeholder hasn't been filled. Once the synergy model is built, the altitude will level out — but in the meantime, make sure the Phase 4 exec summary (slide 30) doesn't over-promise what the detail slides can currently support.

### "What Needs to Be True" as a unifying device

The MKG model's strongest feature is that every number has a stated condition attached. Apply this discipline everywhere in the Mercury deck: every growth projection, every synergy claim, every scenario. It's the single most credibility-building move you can make for a PE audience, because it signals "we know our own assumptions are assumptions."

### The reader's journey

The IC reader will likely read slides 1–3, skim to the Phase exec summaries (slides 4, 9, 14, 20, 26, 30), then dive into Phase 4 detail. Make sure the exec summary slides are self-contained enough to tell the full story at altitude — a reader who only sees those 6 slides should still understand the thesis, the risk, and the value range.
