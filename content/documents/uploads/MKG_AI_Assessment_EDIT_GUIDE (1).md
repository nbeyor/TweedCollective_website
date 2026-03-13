# MKG AI Assessment — Edit Guide
## Page-by-Page Instructions for Deck Revision
*Based on v4 outline (MKG_AI_Assessment_OUTLINE_v4.md) | Prepared 3/13/2026*

> **How to use this document:** Each section below corresponds to a slide in the 21-slide deck. "pAdd" entries indicate new slides to insert. After all insertions, the deck will grow from 21 to approximately 28 slides. Numbering below refers to the *original* slide positions. New slide numbers are noted in brackets after insertions.

---

## p1 — Cover Slide

**Change:** Update the date line to read:

> *Last updated: March 13, 2026*

Replace any generic "March 2026" with the exact date.

---

## p2 — Executive Summary (AI Maturity Radar)

**Change:** In the lower-left box containing the AI Maturity Radar spider chart, add a "Rationale" column or annotation for each axis score. Use the following text, which is drawn directly from the outline:

| Axis | Score | Rationale |
|------|-------|-----------|
| **Strategy** | 6/10 | Strong ideation and leadership engagement, but no single AI product strategy owner and no centralized prioritization. Multiple build teams suggest organic growth rather than top-down allocation. |
| **Data Assets** | 7/10 | Engagement data (advisory boards, speaker bureaus, sentiment) is genuinely proprietary. However, claims data is commercially available and should not be positioned as a moat. Score reflects truly proprietary assets, discounted for the claims data correction. |
| **Workflow Integration** | 6/10 | Route Reagent and Annotation Activation are embedded in real workflows, but most other tools remain standalone and are not yet part of daily work across the org's 13 sub-brands. |
| **External Differentiation** | 6/10 | Pantheon and Plexus are built on proprietary analytics and are defensible. Verba, MagpAI, and PerspectivX carry displacement risk as foundation models improve. Differentiation depends on data depth, not AI capability. |
| **Governance** | 8/10 | Multi-layered governance (weekly AI committee, biweekly advocates, monthly senior leadership, CFO cost-to-build gating) is impressive for a ~$150M company. Score is earned. |
| **Measurement** | 4/10 | 81qd explicitly does not measure ROI on analytics engagements. No enterprise AI KPI dashboard exists. Critical gap: absence of leading indicators like adoption rates, cycle times, quality scores, and win rates. |

If space is tight, abbreviate to 1–2 sentences per axis, but every score must have an explanation visible on the slide.

---

## pAdd (Insert after p2) — Evaluation Framework

**New slide: "Evaluation Framework"**

This slide sets up the analytical approach for the full document. Title the slide something like "How We Evaluated MKG's AI Portfolio" or "Assessment Framework."

Layout as a numbered horizontal flow or stepped graphic with 7 stages:

1. **Business-First Lens** — Understand MKG's revenue model, cost structure, and competitive positioning before evaluating any AI initiative.
2. **Value Pool Identification** — Map the internal (cost, speed, productivity) and external (pricing power, speed-to-close) value pools that AI can address.
3. **Underlying Business Drivers** — Identify the economic sensitivities and workflow areas where AI creates the highest-leverage impact on MKG's P&L.
4. **AI Initiative Review** — Inventory all 15+ active AI initiatives across KINETICS (internal) and DIFFUSION (external) with current status and ownership.
5. **Initiative Deep Dive** — Unpack each initiative individually: what it does, who uses it, what it replaces, defensibility assessment, and value potential scoring with rationale.
6. **Value Driver Quantification** — Characterize and quantify the specific value drivers per initiative, separating internal productivity (labor cost equivalent) from external revenue upside.
7. **Prioritization & Roadmap** — Focus the portfolio on practical value creation through consolidation, leading indicator measurement, and a phased execution plan.

Subtitle or footer text: *"This framework moves from understanding the business to quantifying AI value to building a focused execution roadmap."*

---

## p3 — Business Context & Competitive Landscape

**Changes:**

1. **Add source citations for revenue mix.** Below the revenue mix bar chart, add a footnote:
   > *Sources: MKG management presentations (Nov 2025, Feb 2026); revenue percentages are approximate and based on disclosed segment reporting.*

2. **Add source citations for cost structure.** If cost structure data is shown, add:
   > *Sources: MKG internal financials as provided to Novo Holdings; compensation benchmarks from Glassdoor, AMWA 2024 Compensation Report, and Salary.com, adjusted for MKG seniority mix and NYC metro location.*

3. **Add rationale for economic sensitivity scoring.** Below the Economic Sensitivities table, add a qualifying paragraph:
   > *Sensitivity scoring reflects two dimensions: (1) AI Impact Potential measures how directly AI tools can change the workflow — "High" means the workflow is primarily information processing that AI excels at; "Moderate" means AI augments human judgment but cannot replace it. (2) EBITDA Sensitivity measures the P&L weight of the area — "High" means the workflow represents a large share of labor cost or revenue; "Low" means the area is a smaller contributor. For example, Editorial Workflow scores Moderate/High because AI augments (not replaces) the medical writing process but the labor pool is large (~130 FTEs across writers, editors, and compliance reviewers). Predictive Analytics scores High/High because the workflow is well-suited to AI automation and the 81qd unit's shift to subscription revenue would materially improve margins.*

---

## p4 — AI Initiative Inventory (Tier 1 + Tier 2) — First of Two Slides

**Changes:**

1. **Realign value sources** to match the framework defined on the Value Framework slide (p7). Use the exact bucket names: Cost, Speed, Productivity (internal) and Pricing Power, Speed-to-Close (external). Current descriptions like "Cost + Risk Reduction" should become "Cost" or "Cost + Speed" — drop "Risk Reduction" as a standalone bucket since it maps to Cost.

2. **Add a qualifying statement for Value Potential scoring.** Place this as a footnote or callout box at the bottom of the slide:
   > *Value Potential reflects a qualitative assessment of each initiative's ability to create measurable business impact within 12 months, considering three factors: (1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, and (3) defensibility of the AI-enhanced output versus foundation model displacement. "High" = large addressable base, production-ready or near-ready, and defensible through proprietary data or workflow integration. "Moderate" = meaningful but narrower impact, or earlier-stage maturity. "Low" = limited addressable base or high displacement risk.*

3. **Add a per-item rationale** in a new column or as a short annotation next to each Value Potential badge. Specific rationale for each:

   **Tier 1 (Editorial Pipeline):**
   | Initiative | Value Potential | Rationale |
   |---|---|---|
   | DynAImic Content | High | Addresses ~80 medical writers ($120K avg comp). Content generation is the highest-volume step in the editorial pipeline and directly compresses cycle time from brief to first draft. |
   | Annotation Activation | High | Automates the most tedious step in MLR preparation. Directly reduces rounds of revision and time-to-submission for ~30 editorial/QA staff. |
   | Compliance Core | High | Pre-screening for regulatory flags prevents costly late-stage MLR rejections. Addresses ~20 compliance reviewers and reduces the rework multiplier across the full pipeline. |
   | Route Reagent | High | Closest to production among the pipeline tools. Already embedded in real editorial workflows. Catches style and brand errors before human review, reducing per-project QA hours. |

   **Tier 2 (Insight & Knowledge):**
   | Initiative | Value Potential | Rationale |
   |---|---|---|
   | Practice Master | Moderate | Useful but addresses a narrower analyst pool (~25 FTEs). Underlying NPI/affiliation data is commercially available; value is in the harmonization layer, not the data itself. |
   | Sentiment Tracker | Moderate | High strategic value when applied to proprietary engagement data, but indirect revenue mechanism (share-of-wallet lift) is harder to measure in Year 1. |
   | Undermind | Moderate | Literature search is useful but increasingly commoditized by general AI tools. Value depends on integration with MKG's proprietary datasets. |
   | Brand Bonds | Moderate | Internal knowledge tool with productivity value but limited external revenue impact. Adoption depends on data quality of the underlying brand knowledge bases. |
   | Conversation Centrifuge | Moderate | Overlaps with Verba's advisory board synthesis. Value is real but may be consolidated into the Verba product over time. |

4. **Make the Description column narrower** so all content fits without scrolling or overflow. Trim descriptions to 1–2 lines max. Suggested shortened descriptions:

   - DynAImic Content: "AI-assisted draft generation across marketing channels from content briefs."
   - Annotation Activation: "Auto-links claims to supporting literature for MLR preparation."
   - Compliance Core: "Flags FDA compliance risks — off-label language, fair balance, guideline adherence."
   - Route Reagent: "Validates content against brand style rules and routing comments during editorial review."
   - Practice Master: "Harmonizes data sources to map HCP affiliations and resolve conflicting records."
   - Sentiment Tracker: "NLP-based tracking of HCP belief and sentiment shifts from MKG engagement data."
   - Undermind: "Deep scientific literature search and research surrogate."
   - Brand Bonds: "Brand-trained AI assistant that synthesizes cross-functional team knowledge."
   - Conversation Centrifuge: "Structures and summarizes expert interviews and advisory board discussions."

---

## p5 — AI Initiative Inventory (Tier 3 + Tier 4) — Second of Two Slides

**Changes:**

1. **Apply the exact same format as p4:** same column structure, same Value Potential qualifying footnote (repeat it or reference p4), same shortened descriptions, same per-item rationale column.

2. **Eliminate the Portfolio Prioritization 2×2 chart.** Remove it entirely — it does not add value at this point in the document.

3. **Add per-item rationale** for Tier 3 and Tier 4:

   **Tier 3 (General Productivity):**
   | Initiative | Value Potential | Rationale |
   |---|---|---|
   | ION (Internal AI Portal) | Moderate | Infrastructure layer, not a value driver itself. Enables other tools but has no standalone business impact unless it becomes the gateway to proprietary data. |
   | ChatMKG / Secure LLM | Moderate | Every feature is available in off-the-shelf enterprise AI. Defensibility requires connection to ION Data Lake and brand knowledge bases — without that, there is no reason to use it over consumer tools. |
   | Case Catalyst | Low–Moderate | Narrow use case (past case studies). Value depends on quality and coverage of the knowledge base. |
   | Meeting Nucleus | Low | Transcription and summarization is fully commoditized. Zoom, Granola, and other tools do this natively. |
   | Strategic Brief | Low | Helpful but limited addressable impact. Unlikely to be measurable at the P&L level. |
   | Strategic Synthesis | Low | Same as Strategic Brief — incremental productivity on a narrow workflow. |

   **Tier 4 (Client-Facing / DIFFUSION):**
   | Initiative | Value Potential | Displacement Risk | Rationale |
   |---|---|---|---|
   | Pantheon | High | Lower | Subscription model shifts 81qd to recurring revenue. Defensible when anchored in proprietary engagement data, not just commercial claims. |
   | Plexus | High | Lower | Most defensible analytics asset. Influence network modeling on proprietary engagement data cannot be purchased externally. |
   | PerspectivX | Moderate–High | Moderate | Differentiated if personas are built on real MKG research data. Displacement risk rises if personas are generic LLM approximations. |
   | Verba | Moderate | Higher | Core functionality (transcript-to-summary) is increasingly commoditized. Defensibility requires integration with proprietary longitudinal data. |
   | MagpAI | Moderate | Moderate–Higher | Overlaps with PerspectivX on persona simulation. Earlier stage. Consolidation opportunity with PerspectivX. |
   | BloomLab | Moderate | Lower–Moderate | Novel real-time research methodology is genuinely differentiated. Value depends on proving insight quality parity with traditional qual. |
   | Orion | Moderate | Moderate | Patient identification analytics is a real use case but faces competition from IQVIA, Komodo. |
   | InfluenceLink | Moderate | Lower | Dissemination through Plexus-identified leaders. Value is bundled with Plexus, not standalone. |

---

## p6 — Differentiating Assets & Moat Assessment

**Changes:**

1. **Add a rationale for the moat strength scoring methodology.** Place this as a callout or introductory paragraph above the flag chart:
   > *Moat Strength scores assess each asset on a single question: "How difficult would it be for a well-funded competitor or a foundation model to replicate this?" A score of 9–10 means the asset is generated by MKG's operations and cannot be purchased. A score of 6–8 means the asset is valuable but partially replicable through commercial data sources or partnerships. A score of 2–5 means the asset relies on capabilities or data that are commercially available or rapidly commoditizing.*

2. **Expand the ION-powered products list.** Based on the MKG source materials showing ION as the central data backbone, the products powered by ION should include:
   - **Pantheon** (HCP search/profiling — queries the ION Data Lake directly)
   - **Plexus** (influence mapping — built on ION's HCP engagement and behavioral data)
   - **PerspectivX** (concept scoring — personas modeled from ION's qualitative and behavioral data)
   - **Orion** (patient identification — leverages ION's RWD and claims data layers)
   - **Sentiment Tracker** (sentiment analytics — NLP applied to ION's engagement data)
   - **Practice Master** (affiliation intelligence — harmonization layer on ION's HCP profiling data)
   - **MagpAI** (stakeholder simulation — persona data sourced from ION)
   - **Verba** (advisory board synthesis — cross-references transcripts against ION's clinical evidence and longitudinal data)
   - **BloomLab** (real-time research — adaptive sessions informed by ION's behavioral data)

   In short: ION powers essentially all of MKG's AI products, not just Pantheon, Plexus, and PerspectivX. The slide should reflect this — ION is the platform layer, and every KINETICS and DIFFUSION product draws from it.

---

## pAdd (Insert after p6) — ION Data Lake Deep Dive

**New slide: "The ION Data Lake"**

Structure the slide in three columns (matching MKG's own layout from their source deck) plus a requirements section:

**Column 1: ACQUISITION (What goes in)**
- *Public/Commercial Data:* Open claims, closed claims, EHR data, social determinants of health (from 2016–present); publication data (PubMed, clinical trials, conference proceedings); NPI registries; social media/digital footprint
- *Proprietary Data:* HCP profiling and identification data; advisory board transcripts; speaker bureau records; MSL interaction logs; engagement affinity data (~200M interactions from internal and external sources); campaign performance metrics; brand knowledge bases; HCP sentiment data from MKG's own engagement activities

**Column 2: AI ANALYTICS (What it does)**
- HCP influence mapping (clinical, digital, institutional, scholarly influence scoring)
- Clinical behavior modeling (treatment patterns, patient identification, adherence modeling)
- Sentiment analytics (NLP monitoring of HCP belief evolution)
- HCP behavior change alerts (real-time notification of behavioral shifts)
- HCP segmentation (behavior-informed audience targeting)

**Column 3: ACTIVATION (What comes out)**
- Hyper-targeted peer-to-peer engagement strategies
- AI-powered client deliverables across all DIFFUSION products (Pantheon, Plexus, PerspectivX, Verba, MagpAI, BloomLab, Orion, InfluenceLink)
- Internal workflow acceleration across KINETICS tools

**Bottom section: "Technical Requirements for AI Viability"**

For a proprietary data lake of this scope and complexity to reliably power AI products at scale, four conditions must hold:

| Requirement | What It Means |
|---|---|
| **Organized** | Data must follow consistent schemas across sources. HCP identifiers, therapeutic area taxonomies, and engagement event types need to resolve to a common ontology. Without this, AI models produce inconsistent outputs across products. |
| **Mastered** | Entity resolution must be reliable — one HCP record per actual person, reconciled across NPI, institutional, engagement, and publication data. Duplicate or conflicting records degrade every downstream analytics product. |
| **API-Accessible** | All AI products must be able to query the data lake programmatically in real time. If data access requires manual exports, CSV pulls, or analyst intermediation, AI tools cannot operate at the speed required for production use. |
| **Secure & Compliant** | PHI, engagement data, and claims data carry regulatory obligations (HIPAA, GDPR, client data agreements). Access controls, audit logging, encryption at rest/in transit, and role-based permissions must be enforced at the platform level — not delegated to individual product teams. |

---

## p7 — AI Value Framework

**Change:** Swap the layout so **Internal Value Buckets are on the left** and **External Value Buckets are on the right**, matching the format shown in the attached reference screenshot (Tweed Collective deliverable style).

Content remains the same:

**INTERNAL VALUE BUCKETS (left side):**
| Bucket | Description | Leading KPIs |
|---|---|---|
| **Cost** | Reduce labor cost per deliverable | Hours per project; cost per completed deliverable; external vendor spend reduction |
| **Speed** | Reduce cycle time from draft to delivery | Days from brief to final; rounds of revision; time to first client response |
| **Productivity** | Enable more output per FTE | Deliverables per employee per month; concurrent projects per team |

**EXTERNAL VALUE BUCKETS (right side):**
| Bucket | Description | Leading KPIs |
|---|---|---|
| **Pricing Power** | Premium pricing via AI-differentiated capabilities | Price per engagement vs. prior year; willingness to pay vs. alternatives; margin |
| **Speed-to-Close** | Reduce time from prospect interest to signed deal | Proposal-to-signed-deal days; trial start-up time; site activation timeline |

---

## p8 — Super Product Vision: The AI Editorial Platform

**Changes — full restructure:**

This slide should move to appear right after the current p17 (Leading vs. Lagging Indicators) in the final deck. In the new numbering, it will follow the last product deep-dive slide.

**Revised layout:**

**Left side: Current Products (by name)**
Show the four editorial pipeline tools as distinct boxes that visually need to come together:
- DynAImic Content (Stage 1: Create)
- Annotation Activation (Stage 2: Annotate)
- Compliance Core (Stage 3: Check)
- Route Reagent (Stage 4: Validate)

Make it visually clear (arrows, connecting lines, or a "merging" visual) that these four tools serve the same pipeline and should be unified.

**Right side: Combined Feature Set**
List the unified platform capabilities:
- AI-assisted content drafting from briefs across channels
- Multi-channel adaptation (emails, banners, social, leave-behinds)
- Automated citation linking and reference quality scoring
- Regulatory flag detection and MLR readiness scoring
- Brand/style validation and routing comment verification
- Customer-specific guardrails (client MLR standards, past review decisions, brand rules encoded as configurable rulesets)
- Shared document model — content, annotations, flags, and QA results in one data structure
- Single LLM orchestration layer through ION

**Bottom: Opportunities (reframed from problems)**

Replace the current "problems" framing. Instead, frame these as opportunities for value creation if the products are unified:

| Opportunity | Impact |
|---|---|
| **End-to-end content lifecycle for customers** | One onboarding, one integration, one training cycle. Pharma brand teams get a platform that handles "brief to MLR-ready" instead of four modular tools. Fundamentally different sales conversation. |
| **Faster cycle times through eliminated handoffs** | Content flows through all four stages without manual export/import. Target: reduce content-to-MLR from ~14 days to ~8 days on pilot projects. |
| **Subscription pricing power** | A unified platform commands annual licensing versus per-tool add-ons. Creates recurring revenue and higher switching costs. |
| **30–40% engineering efficiency** | Eliminates duplicated infrastructure (document ingestion, LLM routing, brand context loading, authentication) across four separate codebases. Frees capacity for feature work. |
| **Unified brand knowledge base** | Brand rules, style guides, and past MLR decisions loaded once and available to all stages — today each tool manages this independently. |
| **Stronger competitive positioning** | One AI-powered editorial backbone for pharma content > a collection of helper tools. Platform becomes infrastructure, not an optional add-on. |

---

## p9 through p21 — Product Deep-Dive Slides

### Format Template (apply identically to all 13 product slides)

Each product slide should follow this exact layout:

**Title bar:** Product name + one-line descriptor

**Main content area (top):**
- **What it does** (2–3 sentences)
- **Who uses it** (1 sentence)
- **What it replaces** (1 sentence)

**Value Potential Scoring box (upper right or prominent callout):**
Single score badge (High / Moderate–High / Moderate / Low–Moderate / Low) with a 1–2 sentence qualitative rationale explaining why that score was assigned. This score must use the same methodology stated on p4/p5:
> *(1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, (3) defensibility vs. foundation model displacement.*

This replaces both the former "Defensibility Scoring" box and the former "Value Framework Mapping" box. We want one unified score, not two.

**Value Estimate + Leading Indicators box (bottom, spanning full width):**
- **Left portion:** Value Estimate — state the dollar figures with assumption math visible (e.g., "Low: 8 customers × $80K = $640K | High: 15 customers × $120K = $1.8M")
- **Right portion:** Leading Indicators — maximum 2 bullets. Each bullet states what will be true in the market if this product is working. Focus on the single most important measurable signal. Eliminate "what to track" framing — state it as a market condition.

**Removed elements:**
- ~~"What It Replaces" box~~ (merged into main description)
- ~~"Defensibility Scoring" box~~ (merged into Value Potential)
- ~~"Value Framework Mapping" box~~ (merged into Value Potential)
- ~~"Leading Indicators" as a separate box~~ (merged into bottom bar)
- ~~"What Has to Be True" as a separate box~~ (eliminated)

---

### p9 — DynAImic Content *(NEW — add this product slide)*

**What it does:** Generates draft marketing content across channels (emails, banners, social media, leave-behinds, microsites) from content briefs. Combines LLM-assisted generation with MKG's brand knowledge bases to produce MLR-ready first drafts that reduce time from brief to reviewable content.

**Who uses it:** Medical writers and content creators across MKG's MedComm business units.

**What it replaces:** Manual first-draft creation, which currently takes 2–5 days per asset depending on complexity and channel.

**Value Potential: High**
*Addresses the largest labor pool in the editorial pipeline (~80 medical writers at $120K avg comp). Content generation is the highest-volume step and the primary bottleneck in cycle time. Near production-ready as part of the KINETICS toolset.*

**Value Estimate:**
- Internal: 80 FTEs × $120K × 8–15% uplift = **$768K–$1,440K** in productivity freed
- This is the single largest internal value line item

**Leading Indicators (max 2):**
- Average days from brief to first reviewable draft drops below 2 days (from current 3–5 day baseline) on projects using DynAImic Content
- 30%+ of eligible MedComm projects are using AI-assisted drafting within 6 months

---

### p10 — Annotation Activation *(NEW — add this product slide)*

**What it does:** Auto-links claims in marketing content to supporting literature references. Identifies assertions in draft content and matches them to citations from the scientific literature, preparing content for editorial fact-checking and MLR submission.

**Who uses it:** Editorial and QA review teams preparing content for MLR submission.

**What it replaces:** Manual annotation — currently one of the most time-consuming steps in MLR preparation, requiring analysts to match each claim to a supporting reference by hand.

**Value Potential: High**
*Automates the most tedious step in MLR prep. Directly reduces rounds of revision and submission time for ~30 editorial/QA reviewers at $110K avg comp. Production-ready or near-ready as part of the KINETICS editorial pipeline.*

**Value Estimate:**
- Internal: Captured under Editorial/QA Reviewers — 30 FTEs × $110K × 15–25% uplift = **$495K–$825K** (shared with Route Reagent)

**Leading Indicators (max 2):**
- Annotation error rate (incorrect or missing citations) falls below 5% on AI-assisted projects, demonstrating output quality sufficient for editorial trust
- Rounds of revision before MLR approval decrease by at least 1 round on annotated projects versus manual baseline

---

### p11 — Compliance Core *(NEW — add this product slide)*

**What it does:** Scans marketing content for FDA compliance risks before MLR submission — detecting off-label language, fair balance issues, and guideline adherence violations. Pre-scores content against common MLR rejection criteria.

**Who uses it:** Regulatory and compliance review teams across MKG.

**What it replaces:** Manual compliance pre-screening, which currently requires specialized reviewers to read every asset line-by-line against regulatory standards.

**Value Potential: High**
*Pre-screening catches costly errors before they reach MLR, preventing late-stage rejections that create rework cascades across the full pipeline. Addresses ~20 compliance reviewers at $140K avg comp. The risk-reduction mechanism amplifies value beyond the direct labor savings.*

**Value Estimate:**
- Internal: 20 FTEs × $140K × 5–12% uplift = **$140K–$336K** in productivity freed
- Indirect value: each prevented MLR rejection avoids an estimated 3–5 days of rework across writers, editors, and compliance staff

**Leading Indicators (max 2):**
- First-pass acceptance rate at MLR improves by 10+ percentage points on projects that use Compliance Core pre-screening
- Compliance review hours per asset decrease measurably versus unassisted baseline

---

### p12 — Route Reagent *(NEW — add this product slide)*

**What it does:** Validates content against AMA style guides, brand-specific editorial standards, and MKG internal guidelines. Performs preliminary quality checks during the editorial review cycle — verifying routing comments have been addressed, checking style consistency, and flagging discrepancies before human review.

**Who uses it:** Editorial and QA reviewers, medical writers during revision cycles.

**What it replaces:** Manual style and brand compliance checking — a repetitive, error-prone step in every editorial review cycle.

**Value Potential: High**
*Closest to production among the editorial pipeline tools. Already embedded in real editorial workflows. Catches low-value errors before they consume human reviewer time. Value is shared with Annotation Activation across the ~30 editorial/QA FTE pool.*

**Value Estimate:**
- Internal: Shared with Annotation Activation under Editorial/QA Reviewers — 30 FTEs × $110K × 15–25% uplift = **$495K–$825K** combined

**Leading Indicators (max 2):**
- Style and brand error rates in submitted content drop measurably on Route Reagent-assisted projects
- Editorial reviewer hours per asset decrease as QA pre-checks catch issues that previously required manual identification

---

### p13 — Pantheon — HCP Search & Profiling

Apply the standard format template. Key content:

**Value Potential: High**
*Subscription model shifts 81qd from transaction-based to recurring revenue — the single most important structural change for the analytics unit. Defensible when the proprietary engagement data layer (advisory board history, speaker bureau records, sentiment signals) is richer than what customers get from IQVIA or H1 alone.*

**Value Estimate:**
- External: Low — 8 customers × $80K = **$640K** | High — 15 customers × $120K = **$1.8M**
- Internal: Contributes to HCP Profiling/Data Analysts — 25 FTEs × $105K × 10–20% uplift = $263K–$525K (shared with Practice Master)

**Leading Indicators (max 2):**
- Subscription attach rate exceeds 10% of eligible 81qd clients within 12 months, validating the transaction-to-subscription shift
- Renewal rate at 12 months exceeds 75%, demonstrating ongoing usage value beyond initial novelty

---

### p14 — Plexus — Influence Mapping & Network Analytics

**Value Potential: High**
*Most defensible analytics asset MKG has. Influence network modeling on proprietary engagement data (who attended advisory boards, who spoke at events, who influenced prescribing changes) cannot be purchased externally. This is the product most anchored in MKG's structural advantage.*

**Value Estimate:**
- Internal: 15 FTEs × $130K × 5–12% uplift = **$98K–$234K**
- External: 8–18 projects × $20K–$40K premium = **$160K–$720K**

**Leading Indicators (max 2):**
- Competitive win rate on proposals featuring influence mapping increases measurably, indicating AI-enhanced Plexus is a differentiator in the sales process
- Client-reported time savings on engagement planning projects exceed 25% versus manual network analysis baseline

---

### p15 — Practice Master — HCP Affiliation Intelligence

**Value Potential: Moderate**
*Addresses a narrower analyst pool (~25 FTEs). Underlying NPI and institutional data is commercially available from competitors. Value comes from the harmonization and disambiguation layer — resolving conflicting affiliations across sources — not from the data itself.*

**Value Estimate:**
- Internal: Contributes to HCP Profiling/Data Analysts — $263K–$525K productivity value (shared with Pantheon). Standalone contribution is modest.

**Leading Indicators (max 2):**
- Hours saved per profiling project are measurable and consistent (target: 2+ hours per project versus manual verification baseline)
- Downstream correction rate on affiliation data drops below 5%, indicating analysts trust the tool's output without re-verifying manually

---

### p16 — Sentiment Tracker — HCP Sentiment Analysis

**Value Potential: Moderate**
*High strategic value when applied to proprietary engagement data (advisory boards, speaker bureaus, MSL interactions). Revenue mechanism is indirect — share-of-wallet lift on existing client relationships — which makes Year 1 measurement harder. Defensibility depends entirely on using MKG's internal data, not publicly available text.*

**Value Estimate:**
- External: 0.3–0.8% lift on ~$50M relevant revenue base = **$150K–$400K**

**Leading Indicators (max 2):**
- Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals on at least 5 accounts within 6 months
- Upsell or renewal rates on sentiment-informed accounts show measurable positive variance versus non-informed accounts

---

### p17 — ChatMKG — Secure LLM Access

**Value Potential: Moderate (conditional)**
*Every feature (SSO, transcription, web search, model switching) is available in off-the-shelf enterprise AI. Defensibility is zero unless ChatMKG connects to the ION Data Lake and brand knowledge bases — making it the only AI interface that can access MKG's proprietary data. Without that integration, there is no reason for employees to use it over consumer tools.*

**Value Estimate:**
- Internal: 200 FTEs × $95K × 2–5% uplift = **$380K–$950K** (wide range reflects the data integration question)

**Leading Indicators (max 2):**
- Daily active users as a % of total employees exceeds 40%, indicating ChatMKG is genuinely preferred over external alternatives
- Percentage of ChatMKG sessions that access proprietary data (ION, brand knowledge bases) exceeds 25%, validating the data integration thesis

---

### p18 — Verba — Advisory Board Synthesis

**Value Potential: Moderate**
*Core functionality (transcript to structured summary) is increasingly commoditized — Claude, GPT-4o can do this well. Defensibility requires integration with MKG's proprietary longitudinal data: cross-referencing statements against clinical evidence, comparing sentiment across boards over time, and connecting insights to prescribing behavior data from ION. Without those layers, Verba is an LLM wrapper.*

**Value Estimate:**
- Internal: Research Analysts/Strategists — 40 FTEs × $115K × 8–15% uplift = $368K–$690K (shared with BloomLab, PerspectivX)
- External: Low — $0 (likely a deal sweetener, not standalone charge) | High — 15 boards × $12K = **$180K**

**Leading Indicators (max 2):**
- Time from advisory board to client deliverable drops below 3 business days on Verba-assisted projects (from current 1–2 week baseline)
- Clients specifically request Verba as part of engagement scope, rather than receiving it as a default — indicating perceived differentiation

---

### p19 — PerspectivX — Concept Scoring

**Value Potential: Moderate–High**
*Differentiated if personas are built on real MKG research data from SOUND, 81qd behavioral data, and advisory board engagement data. The key validation question: do PerspectivX scores correlate with actual market research outcomes? If yes, this is a powerful and defensible sales tool. If no, it needs recalibration before scaling. Pricing ($15K–$30K per test) is a fraction of traditional qual ($75K–$150K), making adoption easier to justify.*

**Value Estimate:**
- External: Low — 8 tests × $15K = **$120K** | High — 20 tests × $30K = **$600K**

**Leading Indicators (max 2):**
- PerspectivX concept scores show validated directional correlation with actual market performance on at least 3 retrospective case studies
- Client repeat usage rate exceeds 50% — indicating teams that try it find it useful enough to come back

---

### p20 — MagpAI — Stakeholder Simulation

**Value Potential: Moderate**
*Significant overlap with PerspectivX — both create AI-simulated HCP/stakeholder interactions from persona data. Differentiated by the output format (conversational simulation and training avatars vs. concept scores) but the underlying data and model are shared. Consolidation opportunity with PerspectivX should be evaluated. Faces competition from specialized sales enablement platforms (ZS/Symmetry, Rehearsal, Second Nature) on the training use case.*

**Value Estimate:**
- External: Low — $0 (currently more of a deal sweetener / demo tool than standalone product) | High — 10 engagements × $20K = **$200K**

**Leading Indicators (max 2):**
- Research and training teams report MagpAI simulations are realistic enough to inform actual strategy decisions (measured through structured user feedback surveys)
- Engagement volume grows quarter-over-quarter, indicating organic demand rather than one-time experimentation

---

### p21 — BloomLab — Real-Time Market Research

**Value Potential: Moderate**
*Novel methodology — AI-driven real-time research sessions with actual participants — is genuinely differentiated from both Verba (which processes existing transcripts) and MagpAI (which simulates stakeholders). This is a new approach to market research, not an automation of an old one. Value depends on proving insight quality parity with traditional qual. If quality holds, BloomLab has strong positioning. If quality is perceived as lower, it becomes a "quick and cheap" option without pricing power.*

**Value Estimate:**
- External: Low — 8 engagements × $25K = **$200K** | High — 18 engagements × $45K = **$810K**

**Leading Indicators (max 2):**
- Insight quality scores (rated by clients or validated against traditional methods running in parallel) meet or exceed traditional qual benchmarks
- Client repeat usage rate exceeds 40%, indicating BloomLab is trusted as a standalone methodology rather than a supplement that always requires traditional research alongside it

---

## p22 — Internal Productivity Value Summary *(was p18 in original deck)*

**Changes — full restructure:**

Reformat to focus on one primary value driver per initiative, stated as a single clear mechanism. Remove external revenue and combined value summary (those get their own slides now).

**Layout:**

| Initiative | Primary Value Driver | FTEs | Comp | Low Uplift | Low Value | High Uplift | High Value | Rationale |
|---|---|---:|---:|---:|---:|---:|---:|---|
| DynAImic Content | Cycle time: brief to first draft | 80 | $120K | 8% | $768K | 15% | $1,440K | Medical writers spend 60%+ of project time on first drafts. AI-assisted generation compresses the highest-volume step. |
| Route Reagent + Annotation Activation | QA pre-check: errors caught before human review | 30 | $110K | 15% | $495K | 25% | $825K | Automated style, citation, and routing checks eliminate the lowest-value portion of editorial review. |
| Compliance Core | Risk prevention: MLR rejections avoided | 20 | $140K | 5% | $140K | 12% | $336K | Each prevented rejection avoids 3–5 days of rework cascading across writers, editors, and compliance staff. |
| Pantheon + Practice Master | Research speed: HCP profiling time | 25 | $105K | 10% | $263K | 20% | $525K | Automated search and affiliation harmonization replaces manual profiling that currently takes weeks per project. |
| Plexus | Analysis depth: influence mapping automation | 15 | $130K | 5% | $98K | 12% | $234K | AI-enhanced network modeling produces richer outputs in less time than manual analysis. |
| Verba + BloomLab + PerspectivX | Synthesis speed: research to deliverable | 40 | $115K | 8% | $368K | 15% | $690K | AI-assisted summarization and concept scoring compress the research-to-insight cycle. |
| ChatMKG + ION portal | General productivity: knowledge work efficiency | 200 | $95K | 2% | $380K | 5% | $950K | Broad-based efficiency gains contingent on data integration with ION. Wide range reflects uncertainty. |
| **TOTAL INTERNAL** | | | | | **$2.5M** | | **$5.0M** | |

---

## pAdd (Insert after p22) — External Revenue Value Summary

**New slide: "External Revenue Upside"**

Same table format as the internal slide:

| Product | Primary Value Driver | Low Assumptions | Low Revenue | High Assumptions | High Revenue | Rationale |
|---|---|---|---:|---|---:|---|
| Pantheon | Subscription shift — recurring revenue | 8 customers × $80K | $640K | 15 customers × $120K | $1,800K | Converting <10% of eligible 81qd clients to subscription validates the model shift. |
| Plexus | Pricing premium — AI-enhanced analytics | 8 projects × $20K premium | $160K | 18 projects × $40K premium | $720K | AI enhancement justifies modest price premium on bundled analytics engagements. Nick noted AI efficiency is becoming "cost of entry." |
| PerspectivX | New revenue — concept testing add-on | 8 tests × $15K | $120K | 20 tests × $30K | $600K | Priced at a fraction of traditional qual ($75K–$150K), making adoption low-risk for clients. |
| Verba | Premium add-on — advisory board synthesis | $0 (deal sweetener) | $0 | 15 boards × $12K | $180K | Low case reflects that off-the-shelf LLMs can do structured synthesis — likely bundled, not charged separately. |
| MagpAI | New revenue — simulation engagements | $0 (deal sweetener) | $0 | 10 engagements × $20K | $200K | Earlier stage — low case reflects current use as demo/deal sweetener. High case requires standalone training simulation value. |
| BloomLab | New methodology — AI market research | 8 engagements × $25K | $200K | 18 engagements × $45K | $810K | Novel method requires parallel validation before clients trust it standalone. |
| Sentiment Tracker | Share-of-wallet lift on existing clients | 0.3% on $50M base | $150K | 0.8% on $50M base | $400K | Indirect mechanism — better-targeted campaigns → stronger outcomes → expanded scope. |
| **TOTAL EXTERNAL** | | | **$1.3M** | | **$4.7M** | |

---

## pAdd (Insert after External Revenue slide) — Combined Value Waterfall Chart

**New slide: "Combined AI Opportunity — Year 1 Impact"**

**Visual: Vertical waterfall chart.**

Each initiative appears as one bar. Group and subtotal as follows:

**Internal Productivity Bars:**
1. DynAImic Content — $768K–$1,440K
2. Route Reagent + Annotation — $495K–$825K
3. Compliance Core — $140K–$336K
4. Pantheon + Practice Master — $263K–$525K
5. Plexus — $98K–$234K
6. Verba + BloomLab + PerspectivX — $368K–$690K
7. ChatMKG + ION — $380K–$950K
8. **→ Internal Subtotal: $2.5M–$5.0M** *(mid-waterfall sum bar)*

**External Revenue Bars:**
9. Pantheon (subscription) — $640K–$1,800K
10. Plexus (premium) — $160K–$720K
11. PerspectivX — $120K–$600K
12. Verba — $0–$180K
13. MagpAI — $0–$200K
14. BloomLab — $200K–$810K
15. Sentiment Tracker — $150K–$400K
16. **→ External Subtotal: $1.3M–$4.7M** *(mid-waterfall sum bar)*

17. **→ TOTAL YEAR 1 AI IMPACT: $3.8M–$9.7M** *(final sum bar, visually distinct)*

Use the midpoint of each range for the waterfall bar heights. Show the range as a label on each bar. Color-code internal (one color) vs. external (second color) vs. subtotals/total (third color).

Footer note: *"Internal values represent labor cost equivalent of productivity freed — capacity for redeployment or margin improvement, not headcount reduction. External values represent incremental revenue from AI-differentiated products. Ranges reflect low (basic adoption) to high (targeted workflow automation) scenarios."*

---

## p23 — Leading Indicators & Measurement *(was p19 in original deck)*

**Changes:**

1. **Ensure leading indicators link to the ones stated in p9–p21.** The table should reference back. Revised table:

| Category | Indicator | Source Slide(s) | How to Measure |
|---|---|---|---|
| Adoption | Daily/weekly active users per tool | All products | Instrument usage logging in ION platform. Pull weekly automated reports — no manual data collection. |
| Adoption | % of eligible projects using AI-assisted workflow | DynAImic, Route Reagent, Annotation | Tag projects in the project management system as AI-assisted vs. manual. Compare volumes monthly. |
| Cycle Time | Days from brief to MLR submission | Editorial pipeline (p9–p12) | Timestamp brief receipt and MLR submission in workflow system. Calculate elapsed days automatically. |
| Cycle Time | Rounds of revision before approval | Annotation, Route Reagent | Count revision submissions per asset in the editorial tracking system. |
| Quality | First-pass MLR acceptance rate | Compliance Core | Track accept/reject/revise decisions at MLR. Compare AI-screened vs. unscreened submissions. |
| Quality | Annotation error rate | Annotation Activation | Sample-audit AI-generated citations quarterly. Measure % incorrect or missing references. |
| Client Signal | Proposal win rate on AI-featured pitches | Pantheon, Plexus, PerspectivX | Flag proposals that feature AI capabilities in CRM. Compare win rates vs. non-AI proposals. |
| Client Signal | Client NPS on AI-enhanced deliverables | Verba, BloomLab | Add a 1-question NPS survey to post-engagement follow-up on AI-enhanced projects. |
| Revenue Signal | Subscription attach rate (Pantheon) | Pantheon | Track Pantheon subscription conversions as a % of eligible 81qd client base quarterly. |

2. **Drop the "Lagging Indicators" box entirely.**

3. **Add a right-side section: "Making Measurement Work"**

   Title this section "Considerations for Implementation" or "Getting This Done" and include the following points:

   - **Assign a named owner for each indicator.** If no one is accountable for pulling the data and reporting it, the dashboard will die within 60 days.
   - **Automate data pulls wherever possible.** Passive measurement always wins — if a metric requires someone to manually compile a spreadsheet, it won't survive. Instrument it in the platform or don't track it.
   - **Keep it simple to understand.** Every metric should be explainable in one sentence to a non-technical leader. If it takes a paragraph to explain what a KPI means, pick a different one.
   - **Make it relatable for operational change.** Metrics need to connect to how people actually work. "First-pass MLR acceptance rate" means something to an editorial team lead. "AI-augmented throughput coefficient" does not.
   - **Communicate steadily.** Measurement without communication is invisible. Share results in existing meetings — don't create new ones. Use the Monthly Senior Leadership review that already exists.
   - **Create venues at all levels for reflection.** Front-line teams need space to talk about how AI is changing their work, what's working, what's frustrating, and what they'd change. This isn't just a leadership exercise — the people using the tools daily have the most important feedback.
   - **Expect people to need time to choose how work will change.** AI adoption is a change management challenge, not a technology deployment. People need to see, try, reflect, and decide — not be told their workflow changed overnight.

---

## p24 — Governance & Change Management *(was p20 in original deck)*

**Changes:**

1. **Add qualifying statements under each bar** in the governance scoring section on the left. For each dimension:

   - **Leadership Alignment (8/10):** "CEO, CSO, and CCDO are actively engaged and Novo board is involved. Weekly AI committee, biweekly advocates, monthly senior leadership review — the cadence is genuinely strong. Score could reach 9/10 with a dedicated AI Product Manager providing single-point accountability."
   - **AI Fluency (5/10):** "Strong pockets in 81qd, Andrew's digital team, and Nick's medical team. Uneven across 13 sub-brands. Monthly lunch-and-learns are a good start but haven't translated to org-wide fluency. Risk: tools get built by enthusiasts, adopted by no one else."
   - **KPI Discipline (2/10):** "Single biggest gap. No enterprise AI dashboard. No standardized leading indicators. 81qd does not measure ROI on analytics engagements. Without measurement, prioritization is based on enthusiasm, not evidence."
   - **Product Focus (4/10):** "Too many branded products without a single strategy owner. Decentralized build teams with competing roadmaps. The super product consolidation and a Senior AI PM hire would directly address this."

2. **Right side: Meeting Structure to Drive Change.** Replace or supplement the current "Required Actions" content with a meeting governance framework:

   | Cadence | Forum | Purpose | Attendees |
   |---|---|---|---|
   | Weekly | AI Product Standup | Backlog prioritization, blockers, adoption metrics | AI PM, engineering leads, medical SME representative |
   | Biweekly | AI Advocates Sync | Cross-brand adoption updates, user feedback, training needs | Sub-brand AI champions (existing advocates network) |
   | Monthly | Senior Leadership AI Review | KPI dashboard review, investment decisions, portfolio prioritization | CEO, CSO, CCDO, CFO, AI PM |
   | Quarterly | Board AI Update | Strategic progress, EBITDA bridge, roadmap adjustments | Novo board, MKG executive team |

3. **Optional org consideration — AI build talent consolidation.** Add this as a visually distinct callout (different color, dashed border, or "For Discussion" label) to signal it's an option, not a recommendation:

   > **Optional: Consolidate AI Build Talent.** Currently, AI engineering and product talent is distributed across multiple business units building overlapping tools with competing roadmaps. Consolidating into a centralized AI team (reporting to the AI PM or CSO) would focus investment, eliminate duplicated infrastructure, and accelerate the super product vision. This is an organizational change that requires careful sequencing — it should follow, not precede, the product consolidation and roadmap prioritization decisions. Flagged as optional because it's high-impact but also high-disruption and should only proceed with strong executive alignment.

---

## p25 — Roadmap / Gantt Chart *(was p21 in original deck)*

**Changes — full restructure into a Gantt chart format:**

Replace the current phased narrative with a horizontal Gantt chart. Make it more detailed and faster-paced than the current version.

**Timeline: Month 1 through Month 6+**

| Workstream | Month 1 | Month 2 | Month 3 | Month 4 | Month 5 | Month 6+ |
|---|---|---|---|---|---|---|
| **Portfolio Decisions** | Decide: which initiatives go forward, which are paused or consolidated. Deprioritize low-value tools (Meeting Nucleus, Strategic Brief, Strategic Synthesis). Confirm super product consolidation. | | | | | |
| **Leadership & Ownership** | Designate or hire Senior AI PM. Assign named owners for each funded initiative. | AI PM in seat, running unified backlog. | | | | |
| **Management Cadence** | | Stand up weekly AI standup + monthly leadership review. Define KPI dashboard requirements. | KPI dashboard live — tracking 3–5 leading indicators weekly. | Quarterly board update with first data. | | Continuous: steady-state cadence running. |
| **Super Product Scoping** | | Scope unified editorial platform: shared document model, stage-based pipeline, priority integrations. Define MVP for 2-stage pilot (Route Reagent + Annotation). | | | | |
| **Priority Initiative Build** | | | Build: MVP editorial platform (2 stages). Build: Pantheon subscription pilot (5–10 customers). | Build continues. Iterate based on internal testing. PerspectivX validation study (retrospective correlation analysis). | | |
| **Internal Adoption** | | | Set 90-day adoption targets for Route Reagent and Annotation. Begin pilot with 2–3 MedComm teams. | Expand pilot. Target: 30%+ of eligible projects using at least one editorial tool. | | Scale to 60%+ adoption target across all MedComm. |
| **External Go-to-Market** | | | | | Launch: Pantheon subscription to pilot customers. Begin pricing validation ($80K–$120K range). Push PerspectivX to 5+ client concept tests. | Continuous: scale Pantheon to 15–25 customers. Measure retention. Roll out editorial platform speed improvements into client proposals. |
| **Continuous Evolution** | | | | | | Ongoing: unified AI team iterating on platform, expanding feature set, measuring and optimizing. Sunset tools that haven't hit 20% adoption by Month 6. |

**Visual guidance:** The Gantt bars should make it visually clear that Month 1 is about decisions and focus (narrow, high-intensity), Month 2 is about scoping and standing up management infrastructure, Months 3–4 are build sprints, and Month 5+ is market-facing with continuous evolution. Color-code by workstream.

---

*End of Edit Guide*

*Document prepared by Tweed Collective | March 13, 2026*
