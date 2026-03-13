# MKG AI Opportunity & Roadmap Assessment — OUTLINE v3
## Proposed Document Structure for Review
*(Tweed Collective | March 2026)*

---

> **How to read this outline:** Each section below describes what will appear on that "page" of the final document — the narrative intent, the specific content, and where the data comes from. Sections marked 🆕 are new. Sections marked 🔄 are reworked from the current doc. Approximate word count targets are noted to hit the "twice as long" goal.

> **Working assumptions applied throughout:**
> - MKG is ~$150M revenue, 650+ employees, 13 sub-brands, 150+ pharma/biotech customers, 300+ brands
> - 81qd analytics unit is ~90% transaction-based ($50K–$500K projects), ~10% subscription/platform
> - Novo Holdings is the PE owner (acquired from Court Square / Aisling, closed Q1 2022)
> - Claims data is NOT proprietary (per Nate's feedback) — removed from moat positioning
> - All value assumptions are early-stage, small, stated explicitly, with low/high ranges
> - Tone on displacement risk: constructive, honest, not pulled

---

## SECTION 1 — Executive Summary 🔄
**~600 words | 1 page equivalent**

**What it says:**
Opens with a one-paragraph positioning statement: MKG has done more AI work than most companies its size — the problem isn't ideas, it's prioritization, measurement, and speed to value. Nine+ branded AI initiatives across ~$150M of revenue is too much surface area.

**AI Maturity Radar** — keep the spider chart but add a sentence of rationale under each axis:
- **Strategy (6/10):** Strong ideation pipeline and leadership engagement, but no single AI product strategy owner and no centralized prioritization process. Multiple build teams distributed across the business suggest organic growth rather than top-down allocation.
- **Data Assets (7/10):** Engagement data, advisory board transcripts, speaker bureau records, publication data, and HCP behavioral data are genuinely proprietary and hard to replicate. However, claims data (which was previously cited as a differentiator) is commercially available and should not be positioned as a moat. Score adjusted down from 8 to 7.
- **Workflow Integration (6/10):** Route Reagent and Annotation Activation are embedded in real editorial workflows — this is meaningful. But most other tools are standalone and not yet integrated into daily work patterns across the org.
- **External Differentiation (6/10):** Client-facing products like Pantheon and Plexus are built on proprietary analytics. Several others (Verba, MagpAI, PerspectivX) carry displacement risk as foundation models improve — differentiation depends on data, not AI capability.
- **Governance (8/10):** Weekly AI Committee, biweekly Advocates, monthly senior leadership review, and CFO gating on cost-to-build ROI is a strong governance stack for a company this size. Score is deserved.
- **Measurement (4/10):** Limited closed-loop ROI measurement. 81qd explicitly does not measure ROI on analytics engagements (citing compliance and visibility constraints). No enterprise AI KPI dashboard. Financials are lagging indicators — the question is what leading indicators MKG should be tracking.

**Top 4 Recommendations (the "four cards"):**
1. Rationalize the AI portfolio — consolidate adjacent products, starting with the editorial pipeline
2. Differentiate through data + medical expertise — not AI capability alone
3. Instrument ROI with leading indicators — adoption, cycle time, quality scores, win rates
4. Operationalize with product-led ownership — hire a Senior AI Product Manager

---

## SECTION 2 — Business Context & Competitive Landscape 🔄
**~800 words | 1.5 page equivalent**

**What it says:**
Frames MKG's business for the reader. Revenue mix chart (keep), cost structure (keep), but add:

**Company profile paragraph:** ~$150M revenue, 650+ employees, 13 sub-brands spanning medical communications, HCP promotion, analytics (81qd), market research, market access. Serving 150+ pharma/biotech customers across 300+ brands, including 17 of the top 20 pharma companies. Owned by Novo Holdings (acquired Q1 2022).

**Revenue model nuance:** The 81qd analytics unit is ~90% transaction-based ($50K–$500K projects, 4–15 weeks) with only ~10% subscription/platform. This has strategic implications — AI should help shift toward recurring revenue (alerts, ongoing intelligence, predictive triggers), not just make one-off projects cheaper.

**Competitive landscape (new content):** The KOL analytics and HCP engagement space is crowded. Large players include IQVIA, Komodo Health, Definitive Healthcare, Veeva, Symphony Health, ZS, Clarivate, and Axtria. Niche competitors include Konectar, H1, Neolytica, AMBIT, KOL Insights, and Within3. MKG's differentiation is the integration of analytics with commercialization services (strategy, content, engagement execution) — few competitors span the full lifecycle. But that advantage needs to be reinforced with AI, not eroded by it.

**Industry context:** AI in pharma commercialization is shifting from pilot mode to scaled deployment. The market is projected to grow from ~$1.9B (2025) to $16B+ (2034). The "agentic shift" — AI moving from insight delivery to action execution — is the defining trend for 2026. Companies that treat AI as a workflow participant (not just an analysis tool) will set the pace. MKG's internal editorial pipeline tools are well-positioned for this; the client-facing tools need more data-driven defensibility.

**Economic sensitivity table** — keep, with a note that AI's EBITDA impact is primarily through two channels: internal cost/productivity (editorial efficiency, QA automation) and external revenue uplift (pricing power, retention, speed-to-close).

---

## SECTION 3 — AI Initiative Inventory 🔄
**~500 words | 1 page equivalent**

**What it says:**
The three-tier table from the current doc, cleaned up per feedback:

**Tier 1: Future-State AI Editorial Pipeline (Core Value Drivers)**
- DynAImic Content — drafts marketing content across channels
- Annotation Activation — auto-links claims to supporting literature
- Compliance Core — flags regulatory and FDA compliance risks
- Route Reagent — validates content vs. style and brand rules

*Callout box: "These four tools touch the same content creation and review pipeline. Section 4 presents the case for unifying them into a single integrated product."*

**Tier 2: Supporting Insight & Knowledge Tools**
- Practice Master, Sentiment Tracker, Undermind, Brand Bonds, Conversation Centrifuge

**Tier 3: General Productivity & Workflow Tools**
- ION portal, ChatMKG, Case Catalyst, Meeting Nucleus, Strategic Brief, Strategic Synthesis

**Tier 4: Client-Facing Products (DIFFUSION)**
- Pantheon, Plexus, Verba, PerspectivX, MagpAI, BloomLab, Orion, InfluenceLink

Each tool gets a one-line description, value source tag, and value potential rating (High / Moderate / Low). The detailed value stories follow in Sections 5–15.

---

## SECTION 4 — Super Product Vision: The AI Editorial Platform 🆕
**~1,000 words | 1.5–2 page equivalent**

**This is a key new section.** The brief: show how the four editorial pipeline tools fit together as one product, describe the tech efficiencies of unifying them, list the combined feature set, and make the customer case for a single bigger product.

### 4a. The Problem: Four Tools, One Pipeline
Today, DynAImic Content, Annotation Activation, Compliance Core, and Route Reagent are built and maintained as separate tools — separate codebases, separate UIs, separate onboarding. But they all serve the same workflow: content gets created → claims get annotated with citations → content gets checked for regulatory compliance → content gets validated against brand/style rules before editorial review.

Running these as four products means:
- **Redundant infrastructure:** Each tool independently manages document ingestion, LLM routing, brand context, and user auth. Unifying eliminates duplicated backend work.
- **Fragmented UX:** Users move between tools manually. There's no shared state — an annotation flagged by Compliance Core doesn't automatically route back to DynAImic Content for revision.
- **Competing roadmaps:** Four product backlogs pulling from the same pool of engineering and medical SME time.
- **Weaker pitch:** Selling four modular tools is harder than selling one platform that handles the full content lifecycle.

### 4b. The Unified Product: How the Pieces Fit

**Workflow diagram** (mermaid or visual):
```
Content Brief → [DynAImic Content: AI-assisted draft generation]
    → [Annotation Activation: auto-citation + reference linking]
    → [Compliance Core: regulatory flag detection]
    → [Route Reagent: brand/style validation + QA pre-check]
    → Editorial Review (human)
    → MLR Submission
```

Each component becomes a *stage* in a single pipeline, not a standalone tool. Shared document model means output from one stage is input to the next without export/import friction.

### 4c. Combined Feature Set

| Feature | Source Component | Description |
|---------|-----------------|-------------|
| AI-assisted content drafting | DynAImic Content | Generates MLR-ready marketing content from briefs across channels (emails, banners, social, leave-behinds) |
| Multi-channel adaptation | DynAImic Content | Adapts core content across formats with channel-appropriate tone and length |
| Automated citation linking | Annotation Activation | Identifies claims in content and links to supporting references from the literature |
| Reference quality scoring | Annotation Activation | Scores citation strength and flags unsupported or weakly supported claims |
| Regulatory flag detection | Compliance Core | Scans for FDA compliance risks, off-label language, fair balance issues |
| MLR readiness assessment | Compliance Core | Pre-scores content against common MLR rejection criteria |
| Brand/style validation | Route Reagent | Checks against AMA style guide, brand-specific guidelines, MKG editorial standards |
| Routing comment verification | Route Reagent | Confirms that prior routing comments have been addressed in revisions |
| Customer-specific guardrails | Combined | Encodes client MLR standards, past review decisions, and brand rules as configurable rulesets |

### 4d. Technology Efficiencies from Unification

- **Single LLM orchestration layer:** One routing system (currently ION) managing model selection, context windowing, and prompt management — not four.
- **Shared document model:** Content, annotations, flags, and QA results live in one data structure that flows through the pipeline.
- **Unified brand knowledge base:** Brand rules, style guides, and past review decisions are loaded once and available to all stages.
- **One integration surface:** Customers and internal teams connect to one API / one UI, not four separate systems.
- **Consolidated engineering investment:** Estimated 30–40% reduction in maintenance overhead vs. four separate codebases (assumption — to be validated with MKG engineering).

### 4e. The Customer Case: Why One Product > Four

- **Easier adoption:** One onboarding, one integration, one training cycle. Pharma brand teams already have tool fatigue.
- **Faster cycle times:** Content flows through the full pipeline without manual handoffs between tools. The target: reduce the content-to-MLR cycle from ~14 days to ~8 days.
- **Stronger value proposition:** A platform that handles "brief to MLR-ready" is a fundamentally different pitch than four point solutions. It positions MKG as the AI-powered editorial backbone for pharma content, not just a collection of helper tools.
- **Pricing leverage:** A unified platform commands subscription pricing vs. per-tool add-ons. It becomes infrastructure, not optional tooling.

### 4f. Assumptions and Value Estimate (Low / High)

| Metric | Low | High | Rationale |
|--------|-----|------|-----------|
| Projects/year affected | 1,500 | 3,000 | Subset of MKG's total content projects; low = only MedComm, high = cross-company |
| Hours saved per project (cycle time reduction) | 2 hrs | 5 hrs | From reduced handoffs + automated pre-checks; conservative given tools are early |
| Blended hourly rate | $125 | $150 | Mix of editorial, medical, and junior staff time |
| Annual productivity savings | $375K | $2.25M | = Projects × Hours × Rate |
| Revenue-per-employee uplift | 1% | 3% | More throughput on existing headcount enables non-linear growth |
| Pricing power (new deals won on speed) | $200K | $750K | Assumes 2–5 incremental wins/year where speed-to-MLR is the differentiator |

---

## SECTIONS 5–15 — Product Value Stories (one page each) 🆕
**~500–600 words per product | 10 pages total**

Each product gets the same template:

### Template Structure:
1. **What It Does** (2–3 sentences)
2. **Who Uses It & When** (internal user, external user, or both; workflow moment)
3. **What It Replaces** (the manual alternative or competitor solution)
4. **Defensibility Assessment** (Is this an LLM wrapper? What's the proprietary layer? Honest assessment of displacement risk as models improve)
5. **Value Framework Mapping** (which of the 5 buckets — Cost, Speed, Productivity, Pricing Power, Speed-to-Close — does this initiative primarily drive?)
6. **Leading Indicators / KPIs** (what to measure now — NOT revenue)
7. **Value Estimate (Low / High)** with stated assumptions
8. **What Has to Be True** (2–3 key assumptions that must hold for this to deliver value)

### Products covered (in order):

**Section 5 — Pantheon (HCP Search & Profiling)**
- Syndicated subscription offering for HCP/KOL discovery
- Built on proprietary analytics integrating publication data, clinical trials, payment data, digital/social behavior
- Defensibility: MODERATE-HIGH — the data integration layer and MKG's medical expertise in curating profiles is hard to replicate, but IQVIA, H1, Definitive Healthcare all compete here
- Value mapping: Pricing Power (subscription revenue) + Speed-to-Close (faster target list generation for clients)
- KPIs: subscription attach rate, queries per user/month, renewal rate
- Assumptions: 10–20 customers in Year 1 at $75K–$150K subscription price; retention improves from ~75% to ~80% through workflow stickiness

**Section 6 — Plexus (Influence Mapping)**
- Network mapping and influence analysis for HCP engagement planning
- Core 81qd analytics product — combines clinical, academic, digital, and institutional data
- Defensibility: HIGH — influence network modeling on proprietary engagement data is the most defensible asset MKG has
- Value mapping: Pricing Power + Productivity (replaces weeks of manual analysis)
- KPIs: projects delivered using Plexus data, client-reported time savings, competitive win rate on proposals that feature Plexus
- Assumptions: Already revenue-generating; incremental AI enhancement adds 10–15% pricing uplift on bundled deals ($350K–$500K range)

**Section 7 — Practice Master (HCP Affiliation Intelligence)**
- Maps institutional affiliations, distinguishes primary from honorary, resolves conflicting data
- Internal tool for 81qd analysts and MedComm teams
- Defensibility: MODERATE — useful but not unique; similar data available from NPI registries and competitors. Value is in the harmonization layer.
- Value mapping: Speed + Productivity (reduces manual research time for affiliation verification)
- KPIs: hours saved per profiling project, data accuracy improvement rate
- Assumptions: Used on 50–100 profiling projects/year; saves 3–6 hours per project at $100–$125/hr analyst rate

**Section 8 — Sentiment Tracker (HCP Sentiment Analysis)**
- NLP-based tracking of HCP belief and sentiment shifts over time
- Used by 81qd and brand strategy teams to monitor therapeutic area sentiment
- Defensibility: MODERATE — NLP sentiment is increasingly commoditized, but MKG's advantage is having longitudinal data from their own engagement activities (advisory boards, speaker bureaus, MSL interactions) that external tools can't access
- Value mapping: Strategic Insight (leading indicator for campaign effectiveness)
- KPIs: sentiment shift detection lag (how quickly changes are surfaced), correlation between sentiment signals and downstream prescribing behavior
- Assumptions: Currently more of a strategic input than a standalone revenue driver; value is indirect — contributes to better campaign targeting and advisory board design

**Section 9 — ChatMKG / Secure LLM Access**
- Internal secure AI workspace with SSO, transcription, web search, model switching
- Defensibility: LOW — all features available in off-the-shelf products (Claude, ChatGPT Enterprise, Copilot). The only defensible angle is if ChatMKG provides access to MKG-proprietary data (ION Data Lake, brand knowledge) that general-purpose tools can't see.
- Value mapping: Productivity (generalist efficiency gains across the org)
- KPIs: daily active users, tasks completed per session, user-reported time savings
- Assumptions: Table-stakes infrastructure, not a value driver on its own. Value comes from being the access layer to proprietary data — without that, it's undifferentiated. Low/High range reflects this: $50K–$200K in productivity gains depending on data integration depth.
- **Honest note:** The question for MKG is: why would an employee use ChatMKG over the off-the-shelf AI tools they already have on their phones and laptops? The answer has to be "because it knows things those tools don't." If it doesn't, usage will be low regardless of mandate.

**Section 10 — Verba (Advisory Board Synthesis)**
- AI-powered platform that transforms advisory board transcripts into structured insights
- Client-facing, offered through MedComm business units
- Defensibility: LOW-MODERATE — at its core, this is a transcription-to-structured-output pipeline. Current foundation models (Claude, GPT-4o) can do this well. The question is whether Verba adds proprietary intelligence: does it cross-reference what was said against known evidence? Does it compare across multiple advisory boards over time? Does it connect to the ION Data Lake to enrich insights?
- If yes → defensible. If it's primarily transcription + formatting → high displacement risk.
- Value mapping: Speed (faster insight-to-action cycle) + Productivity (replaces weeks of manual synthesis)
- KPIs: time from advisory board to deliverable, client satisfaction scores, number of boards processed
- Assumptions: 20–40 advisory boards/year initially; saves 15–25 hours of analyst time per board at $150/hr; incremental add-on revenue of $15K–$30K per engagement if sold as a premium feature

**Section 11 — PerspectivX (Concept Scoring)**
- Simulates HCP feedback on campaign concepts using data-driven personas
- Built on ION Data Lake persona models from qualitative and behavioral data
- Defensibility: MODERATE — the persona models are the differentiator. If personas are built on MKG's proprietary research data (Magnolia market research, 81qd behavioral data, SOUND creative insights), this is defensible. If they're LLM approximations, it's an LLM wrapper.
- Value mapping: Speed-to-Close (faster concept validation) + Pricing Power (premium research offering)
- KPIs: concept test turnaround time, correlation between PerspectivX scores and actual market performance, client adoption rate
- Assumptions: Used on 15–30 campaigns/year initially; charged as $20K–$40K add-on per concept test; replaces or supplements traditional qual research that costs $75K–$150K and takes 6–8 weeks

**Section 12 — MagpAI (Stakeholder Simulation)**
- AI simulation platform — interactive HCP/patient/payer personas for research and rep training
- Defensibility: LOW-MODERATE — simulation via LLM is increasingly easy to replicate. The differentiator, again, is whether the personas are grounded in MKG's proprietary data or are generic LLM approximations. Interactive training avatars for sales reps is a valid use case, but competitive with companies like Symmetry (acquired by ZS), and increasingly with off-the-shelf LLM tools.
- Value mapping: Productivity (faster stakeholder research) + Speed (pre-field testing of messaging)
- KPIs: simulations run per quarter, user-reported realism scores, training completion rates
- Assumptions: 10–20 engagements/year initially; $15K–$30K per engagement; saves 1–2 weeks of traditional research time per engagement

**Section 13 — BloomLab (Real-Time Market Research)**
- AI-driven real-time chat session merging qualitative depth with quantitative rigor
- Facilitates adaptive consensus-building among research participants
- Defensibility: MODERATE — the real-time adaptive methodology is novel. The question is whether it replaces traditional focus groups or supplements them. If it demonstrably produces equivalent-quality insights at a fraction of the cost and time, it's a strong offering.
- Value mapping: Speed (compressed research timelines) + Pricing Power (premium methodology)
- KPIs: research cycle time vs. traditional qual, insight quality scores, client repeat usage
- Assumptions: 10–15 engagements/year initially; $25K–$50K per engagement; replaces or supplements traditional research costing $100K+ and taking 4–8 weeks

---

## SECTION 16 — AI Value Framework 🆕
**~400 words + framework visual | 1 page equivalent**

This is the slide from the attached image, formalized:

**INTERNAL VALUE BUCKETS:**

| Bucket | Definition | KPIs |
|--------|-----------|------|
| **Cost** | Reduce labor cost per deliverable | Hours per project; cost per completed deliverable; external vendor spend |
| **Speed** | Reduce cycle time from draft to delivery | Days from brief to final; rounds of revision; time to first response |
| **Productivity** | Enable more output per FTE | Deliverables per employee per month; concurrent projects handled |

**EXTERNAL VALUE BUCKETS:**

| Bucket | Definition | KPIs |
|--------|-----------|------|
| **Pricing Power** | Command premium pricing via AI-differentiated capabilities | Price per engagement; willingness-to-pay vs. alternatives; gross margin on AI-enhanced offerings |
| **Speed-to-Close** | Reduce time from prospect interest to signed deal | Trial start-up time (CTA portion); site activation timeline; proposal-to-close days |

---

## SECTION 17 — Value Quantification: Mapping Initiatives to the Framework 🆕
**~800 words | 1.5 page equivalent**

**Summary table:** Each initiative mapped to its primary value buckets with Low / High estimates rolled up.

| Initiative | Primary Buckets | Year 1 Low | Year 1 High | Key Assumptions |
|-----------|----------------|-----------|------------|----------------|
| AI Editorial Platform (super product) | Cost, Speed, Productivity, Pricing Power | $575K | $3.0M | 1,500–3,000 projects; 2–5 hrs saved; 2–5 new wins on speed |
| Pantheon | Pricing Power, Speed-to-Close | $750K | $3.0M | 10–20 subscriptions at $75K–$150K |
| Plexus (AI enhancement) | Pricing Power, Productivity | $350K | $750K | 10–15% pricing uplift on bundled deals |
| Practice Master | Speed, Productivity | $15K | $75K | 50–100 projects; 3–6 hrs saved each |
| Sentiment Tracker | Strategic Insight (indirect) | Indirect | Indirect | Value is upstream — improves targeting, not directly monetized |
| ChatMKG | Productivity | $50K | $200K | Depends entirely on proprietary data integration |
| Verba | Speed, Productivity | $300K | $1.2M | 20–40 boards; time savings + premium add-on |
| PerspectivX | Speed-to-Close, Pricing Power | $300K | $1.2M | 15–30 concept tests at $20K–$40K |
| MagpAI | Productivity, Speed | $150K | $600K | 10–20 engagements at $15K–$30K |
| BloomLab | Speed, Pricing Power | $250K | $750K | 10–15 engagements at $25K–$50K |
| **TOTAL** | | **~$2.7M** | **~$10.8M** | |

**Important caveats stated on the page:**
- These are Year 1 estimates. Most tools are pre-revenue or early-adoption. The low end reflects "a few projects land and some time gets saved." The high end reflects "the tools work, adoption is decent, and clients pay for the value."
- Overlap exists — a customer buying Pantheon + Plexus + PerspectivX is one deal, not three separate line items. The total should not be read as additive without adjusting for bundling.
- Internal savings (Cost, Speed, Productivity) accrue to EBITDA directly. External revenue (Pricing Power, Speed-to-Close) accrues at MKG's gross margin (~60% assumed).

**EBITDA bridge (simple):**
```
Internal savings (low/high):                    $640K – $3.3M
External incremental revenue (low/high):        $2.1M – $7.5M
  × Gross margin (~60%):                        $1.3M – $4.5M
Less: incremental opex (new hires + tooling):   ($500K) – ($1.0M)
= Estimated Year 1 EBITDA uplift:               $1.4M – $6.8M
```

*TODO for MKG: Confirm gross margin assumption and incremental opex (AI Product Manager + analytics FTE + tooling costs).*

---

## SECTION 18 — Leading vs. Lagging Indicators 🆕
**~500 words | 1 page equivalent**

**The core argument:** MKG's current measurement approach is almost entirely lagging — revenue, margin, EBITDA. These tell you how you *did*, not how you're *doing*. AI initiatives need leading indicators that show whether adoption is working and value is accruing *before* it shows up in financials.

**Leading Indicators (measure now):**

| Category | Indicator | Why It Matters |
|----------|-----------|---------------|
| Adoption | Daily/weekly active users per tool | If people aren't using the tools, nothing else matters |
| Adoption | % of eligible projects using AI-assisted workflow | Measures penetration into actual work, not just availability |
| Cycle Time | Days from brief to MLR submission | The editorial pipeline's north star metric |
| Cycle Time | Rounds of revision before approval | Directly tied to Route Reagent / Compliance Core value |
| Quality | First-pass acceptance rate at MLR | If AI pre-checks work, fewer submissions get bounced |
| Quality | Error rate in annotations (Annotation Activation) | Measures whether AI citation linking is accurate |
| Client | Client NPS / satisfaction on AI-enhanced deliverables | Early signal of willingness to pay |
| Client | Proposal win rate on pitches featuring AI capabilities | Measures whether AI tools are actually helping close deals |
| Revenue | Subscription attach rate (Pantheon, future products) | Leading indicator of recurring revenue transition |

**Lagging Indicators (track, but don't steer by):**

| Category | Indicator | Timeline |
|----------|-----------|----------|
| Financial | Revenue from AI-enhanced engagements | 6–12 months |
| Financial | Gross margin improvement from productivity gains | 6–12 months |
| Financial | EBITDA uplift attributable to AI | 12+ months |
| Strategic | Revenue mix shift (transaction → subscription) | 12–24 months |

**The recommendation:** Build an enterprise AI KPI dashboard that tracks the leading indicators weekly. Review in the existing Monthly Senior Leadership meeting. Use the 90-day milestone approach: pick one leading indicator per initiative and set a 90-day target. If it's not moving, re-evaluate the initiative.

---

## SECTION 19 — Governance & Change Management 🔄
**~500 words | 1 page equivalent**

Keep the current scoring table but add context:

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Leadership Alignment | 8/10 | CEO, CSO, and CCDO are engaged. Novo board is actively involved. Weekly AI committee exists. |
| AI Fluency | 5/10 | Strong pockets (81qd, Andrew's team) but uneven across 13 sub-brands. Lunch & learns and functional training are good steps but haven't yet translated to org-wide fluency. |
| KPI Discipline | 2/10 | 81qd explicitly does not measure ROI. No enterprise AI dashboard. No standardized leading indicators. This is the single biggest gap. |
| Product Focus | 4/10 | Too many branded products. No single AI product strategy owner. Decentralized build teams with competing roadmaps. The super product consolidation and a Senior AI PM would change this. |

**Required actions:**
1. **Hire a Senior AI Product Manager** — single point of accountability for requirements, prioritization, portfolio consolidation, and the enterprise KPI dashboard
2. **Closed-loop analytics FTE** — dedicated resource to instrument ROI measurement, even partial
3. **Enterprise AI KPI dashboard** — built on the leading indicators from Section 18
4. **90-day milestone cadence** — every funded initiative gets a 90-day measurable target; if it's not met, initiative is paused and resources reallocated

---

## SECTION 20 — Roadmap & Final Recommendations 🔄
**~600 words | 1 page equivalent**

### Phase 1: 0–90 Days — Focus & Instrument
- Consolidate editorial pipeline tools into unified product roadmap (doesn't mean one codebase overnight — means one product owner, one backlog, shared design vision)
- Launch enterprise AI KPI dashboard with 3–5 leading indicators
- Hire or designate Senior AI Product Manager
- Set 90-day adoption targets for Route Reagent and Annotation Activation (the two tools closest to production)

### Phase 2: 90–180 Days — Prove & Price
- Measure editorial cycle time reduction (target: demonstrate 20%+ improvement on pilot projects)
- Run 5–10 Pantheon subscription pilots with pricing validation ($75K–$150K range)
- Validate PerspectivX persona accuracy against real market research outcomes
- Begin building the unified editorial platform UX (shared document model, stage-based pipeline)

### Phase 3: 6–12 Months — Scale & Differentiate
- Roll out unified editorial platform across MedComm business units
- Scale Pantheon subscriptions to 15–25 customers
- Introduce predictive layer for Plexus (alert system, HCP behavior triggers)
- Sunset or deprioritize tools that haven't demonstrated adoption or value
- Publish first "AI Impact Report" for Novo board showing leading indicator trends and EBITDA bridge

### The Four Cards (restated)
1. **Rationalize the portfolio.** Consolidate adjacent products. Stop building net-new until overlap is addressed.
2. **Differentiate through data + expertise.** The moat is engagement data, medical judgment, and integrated commercialization services — not AI capability.
3. **Instrument ROI.** Leading indicators first. Close the loop between product usage → outcomes → willingness to pay.
4. **Operationalize delivery.** Product-led prioritization with clear ownership and a single intake process.

---

## APPENDIX IDEAS (optional, discuss)
- Competitive landscape detail (IQVIA, H1, Definitive Healthcare, Veeva, ZS — what each does, where MKG wins)
- ION Data Lake architecture diagram (what data feeds in, what products consume it)
- Glossary of MKG AI product names (for board readers who can't keep them straight)

---

## DOCUMENT METRICS

| Metric | Current Doc | Target (v3) |
|--------|------------|-------------|
| Total sections | 11 | 20 |
| Approximate word count | ~3,500 | ~7,500–8,500 |
| Product value stories | 0 | 10 (one per product) |
| Stated assumptions | Few, generic | Per-product, specific, with low/high ranges |
| Value framework | Implicit | Explicit slide with 5 buckets + KPIs |
| Leading indicators | Not addressed | Dedicated section with dashboard recommendation |
| Super product vision | Mentioned in passing | Full page with architecture, features, and value case |
| Score rationale | None | Every scored metric gets a stated rationale |

---

*Ready for your review. Flag anything that needs to change in structure, tone, or emphasis before we start writing the full document.*
