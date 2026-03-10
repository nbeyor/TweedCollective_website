# Apollo: AI Diligence

**Prepared for:** Private Equity Due Diligence  
**Target:** Apollo ([redacted])  
**Buyer:** WCG Clinical (wcgclinical.com)  
**Date:** February 23, 2026 (Updated March 10, 2026 with Infrastructure & Security DD Call inputs)
**Classification:** Confidential
**Version:** 3.0

> **Version 3.0 Change Log:** Content updated with findings from the second Project Apollo Technology Due Diligence session — Infrastructure & Security deep-dive (Apollo ↔ WCG). Major additions to architecture snapshot (compute, networking, security, DR/BCP, CI/CD), AI model specifics, corporate IT overview, and operating model maturity ratings. Naming corrections applied (Orcus, Catrix, Tamr). Three gaps closed (G18 partial, G19, G28). New open gaps added.
>
> **Version 2.0 Change Log:** Content updated with findings from the first Project Apollo Technology Due Diligence session (Apollo ↔ WCG). Items sourced from these sessions are marked [TRANSCRIPT]. Original public-source findings retained where still valid. GAP list revised to reflect closed items and new open items.

---

## Slide 2: Executive Summary (Slide Titles)

### Front Matter
1. Cover
2. Executive Summary

### Chapter A — Growth Thesis Alignment
3. Growth Thesis Alignment — Executive Summary
4. Growth Projections — Recreated Snapshot + Assumptions
5. Offering + AI Initiatives ↔ Growth Drivers (Simple Matrix)
6. AI Roadmap Fit to Growth Thesis (Bridge)
7. Scenarios (2–3) for Growth & Disruption Outcomes

### Chapter B — Disruption Risk
8. Disruption Risk — Executive Summary (3 Disruption Modes)
9. Who Could Disrupt (Examples per Mode)
10. What They Would Build / What It Does (per Mode)
11. What Must Change for Disruption to Be True (per Mode)
12. "Build-It-Today" Replicability (Low-Code / Off-the-Shelf)

### Chapter C — Underlying Asset Value
13. Underlying Asset Value — Executive Summary (R/Y/G Scorecard)
14. Product Asset Strength
15. Data Asset Strength
16. Channel Asset Strength
17. Relationship Asset Strength

### Chapter D — Team + Operating Model
18. Team + Operating Model — Executive Summary
19. People & Roles (Accountability + Leveling)
20. Functional Coverage & Resourcing (Balance)
21. Operating Model Maturity (Slider-Style Assessment)

### Chapter E — AI Assessment
22. AI Assessment — Executive Summary (Internal vs External)
23. AI Inventory (What Exists)
24. Architecture Snapshot + Readiness Callouts (IT/Data/AI)
25. AI Value Framework (Internal vs External Value Buckets)
26. AI Value & Proof — 1–3 Examples + Replicability/Comparables

### Chapter F — Buyer ↔ Target Synergies
27. Buyer ↔ Target Synergies — Executive Summary
28. Synergy Connections Mapped to Assets + Value Generation (Matrix)
29. Asset-Level Synergy Detail (Selected Connections)
30. Synergy Pathways (3 Waves)

### Chapter G — Quantified Impact
31. Priority Initiatives — Assumptions + Uplift Math Table
32. Sensitivity → Growth Curve Shifts (H/M/L vs Baseline)

---

# Chapter A — Growth Thesis Alignment

---

## Slide 3: Growth Thesis Alignment — Executive Summary

### Drivers of Growth
- Expansion of connected site network (now 65,000+ study sites, 600+ sponsors, 90+ countries). 65K sites represents approximately one-fifth of all active trial sites in any given year, with significant runway remaining. [TRANSCRIPT]
- Apollo is approximately 5x ahead of its closest competitor in eISF/site network scale. [TRANSCRIPT]
- Multi-product platform upsell across eBinders → SiteLink → eTMF → eConsent → Site Feasibility → Site Selection
- Network growth has shifted from site-by-site sales (first 100 customers took ~6 years) to sponsor-driven bulk deployment — now turning on up to 500 sites per week during peak periods via sponsor-side deals. [TRANSCRIPT]
- AI-augmented workflow modules entering market as independent SKUs (site feasibility, site selection, Doc QC, risk-based reporting)
- Regulatory tailwinds: ICH E6 R3 mandates pushing digitization; FDA eSource guidance favoring electronic workflows

### AI Opportunities
- AI-driven site identification and feasibility scoring — automating feasibility questionnaire completion using knowledge library and past responses (sites receive 500–1,000 questionnaires per year). [TRANSCRIPT]
- AI-powered document quality checking (Doc QC) — automated blank page detection, readability, page ordering, corrupted file identification. Uses Tesseract OCR for deterministic checks before LLM-based checks. [TRANSCRIPT]
- AI-powered risk-based reporting — overlay of structured workflow data with unstructured data (comments, notifications, emails) to produce risk heat maps, executive summaries, and recommended actions. Actively in development. [TRANSCRIPT]
- Trial Flow — workflow orchestration tool (like Monday.com/MS Project) with task dependencies and milestone tracking. Currently in POC stage. [TRANSCRIPT]
- FlowBot — AI assistant embedded in eBinders for role-based onboarding and simplified product usage. [TRANSCRIPT]
- Sponsor-side operational intelligence from aggregated site performance data (milestone-based audit trail data)

### Alignment: High
Apollo's AI roadmap directly targets the two largest time sinks in clinical trials — study startup and ongoing monitoring. The 2026 product strategy is organized around a "3 on 3" goal: three new AI workflows targeting $3M in AI-specific ARR, up from $0 in 2025 (one AI feature was launched free in late 2025). [TRANSCRIPT] AI products are being priced as independent SKUs, not bundled into existing pricing. [TRANSCRIPT]

### Macros
- Clinical trial complexity increasing (average protocol amendments up; site burden rising per WCG's own 2025 site challenges report)
- Regulatory push toward decentralized trials and remote monitoring post-COVID
- Veeva SiteVault's free eISF offering creating pricing pressure on the site-facing product
- PE consolidation across clinical trial technology (e.g., WCG's own LGP/Arsenal/Novo recapitalization)
- Apollo's TA mix matches the NIH profile (~50% oncology, ~50% everything else) — products are infrastructure-level and TA-agnostic, though site selection may introduce TA-specific patient population data as a first foray. [TRANSCRIPT]

### Open Questions
- What is Apollo's current ARR and growth rate? Average revenue per study site is ~$1,500 for core EISF product [TRANSCRIPT], and feasibility adds ~$500 [TRANSCRIPT], but total ARR not disclosed on the call.
- What is the conversion rate from free StudyOrganizer users to paid eBinders?
- How many of the 65K "connected" study sites are active paying users vs. sponsor-deployed (no direct site contract)?
- What is the revenue split between site-facing products (eBinders) and sponsor-facing products (SiteLink, eTMF)? The call confirmed ~400 total customers [TRANSCRIPT] and described a balanced portfolio of site-bought and sponsor/CRO-bought products, but did not break out revenue.
- What is the competitive impact of Veeva SiteVault's free eISF offering on Apollo's site acquisition costs and churn?

**Sources:**
- https://www.[redacted]/ — Apollo homepage, product positioning, key metrics
- https://www.[redacted]/press-release/apollo-announces-ai-assisted-workflows/ — AI workflow announcement, Sept 2025
- https://www.pharmiweb.com/press-release/2025-10-23/apollo-connects-65-000plus-study-sites-and-600plus-sponsors-worldwide-unleashing-the-next-era-of-clini — Oct 2025 milestone press release
- [TRANSCRIPT] — Project Apollo Technology DD Call

---

## Slide 4: Growth Projections — Recreated Snapshot + Assumptions

### Public Findings + Transcript Updates

**FACTS:**
- Apollo raised $116M total across 4 funding rounds (Seed 2016, Series A, Series B, Series C in 2021 for $80M, Series C-1 in 2022 for $27M). Lead investor: Insight Partners.
- As of 2019, Apollo reported approximately $2M in revenue (CBInsights).
- Network growth trajectory: ~8,500 sites in 34 countries (May 2021) → 10,000+ sites (June 2022) → 18,000+ sites in 55 countries (Nov 2023) → 37,000+ sites (Sept 2025) → 65,000 study sites, 600+ sponsors, 90+ countries (Oct 2025).
- Apollo processes 7.2M monthly workflows and 5.8M remote monitoring activities per month.
- Approximately 400 total customers. First 100 were site-only customers (took ~6 years to build). Sponsor-side sales then accelerated site deployment dramatically. [TRANSCRIPT]
- Average revenue per study site: ~$1,500 for core EISF product. [TRANSCRIPT]
- AI feasibility product pricing: ~$500 per study site (additive to core). [TRANSCRIPT]
- AI-specific revenue entering 2026: $0 (one AI feature launched free in late 2025). 2026 target: $3M ARR from three new AI SKUs. [TRANSCRIPT]
- eConsent product grew ~75% last year and is only ~2+ years old. [TRANSCRIPT]
- Site growth is now geographically balanced across North America, Europe, and rest of world for the first time. [TRANSCRIPT]

**INFERENCES:**
- **INFERENCE:** If the 65K study sites generate average revenue of ~$1,500 each, the site-side EISF product alone could represent up to ~$97.5M in study-site revenue potential — but not all 65K sites are direct-paying (many are sponsor-deployed). Actual site-side revenue depends heavily on the ratio of direct-contracted vs. sponsor-provisioned sites. *Inference because: the $1,500/study site was stated as an average, but the paying base is unclear.*
- **INFERENCE:** The growth model relies on a combination of site-level SaaS subscriptions (eBinders), sponsor-level platform fees (SiteLink, eTMF), usage-based fees for features like remote monitoring and document exchange, and AI-specific SKU add-ons. The company explicitly described moving toward multi-product bundles rather than individual product sales. [TRANSCRIPT]

**GAPS / QUESTIONS:**
- Current total ARR, revenue growth rate, and gross margins — not disclosed on the call.
- Revenue mix between site-facing and sponsor-facing products.
- Net revenue retention rate (expansion vs. churn). eBinders strategy is explicitly "protect the core" with very little churn. [TRANSCRIPT]
- Unit economics (CAC, LTV, payback period).
- Impact of Veeva's free SiteVault on Apollo's site-level pricing power.
- Budgets product — Apollo is "actively looking for a partner or to buy" a budgets/contracting tool. [TRANSCRIPT] This has M&A implications.

**Sources:**
- https://www.[redacted]/press-release/apollo-announces-80-million-series-c-led-by-scaleup-investor-insight-partners/
- https://www.cbinsights.com/company/apollo-healthcare/financials
- [TRANSCRIPT]

---

## Slide 5: Offering + AI Initiatives ↔ Growth Drivers (Simple Matrix)

### Public Findings + Transcript Updates

**FACTS:**

| Growth Driver | eBinders (Sites) | eConsent (Sites) | Site Feasibility (Sites, AI-native) | SiteLink (Sponsors) | Site Selection (Sponsors, AI-native) | Doc QC / Risk Reporting (AI) |
|---|---|---|---|---|---|---|
| **New Logo Acquisition (Sites)** | Strong — core product, "Box.net for clinical research" [TRANSCRIPT] | Strong — "DocuSign for clinical research," ~75% YoY growth [TRANSCRIPT] | Strong — AI automates 500–1K questionnaires/yr per site [TRANSCRIPT] | Partial — sites activated via sponsor deployment | N/A (sponsor-facing) | Partial — Doc QC deploys at site level per sponsor demand (e.g., Merck) [TRANSCRIPT] |
| **New Logo Acquisition (Sponsors/CROs)** | Partial — site network is draw | Partial — important IRB integration with WCG [TRANSCRIPT] | Partial — sponsor sees validated feasibility data | Strong — remote monitoring, doc exchange, TMF | Strong — API-first, feeds into sponsor scoring [TRANSCRIPT] | Strong — Merck spending 5,000 hrs/month on manual QC [TRANSCRIPT] |
| **Expansion Revenue (Existing)** | Partial — more studies per site | Strong — upsell from eBinders, billable forms added [TRANSCRIPT] | Strong — ~$500 add-on per study site [TRANSCRIPT] | Strong — more sites per study | Strong — upsell from SiteLink | Strong — premium AI SKU |
| **Retention / Stickiness** | Strong — regulatory audit trail lock-in | Strong — audit trail at back end [TRANSCRIPT] | Moderate — early stage | Strong — cross-site dependency | Moderate — API data feed, not full solution [TRANSCRIPT] | Moderate — early stage |
| **Pricing Power** | Moderate — Veeva free tier pressure | Moderate | Strong — novel AI capability | Strong — no free competitor equivalent | Moderate — "part of the data sets they'll consider" [TRANSCRIPT] | Strong — addresses massive manual burden |

**Callout:** The product portfolio maps to a "crossing the chasm" framework that Apollo uses internally — starting with document management workflows, expanding to connected trial execution, layering in automation (AI agents + traditional), and culminating in intelligence products built on accumulated data. [TRANSCRIPT]

**GAPS / QUESTIONS:**
- Actual revenue contribution by product line — not disclosed.
- Pricing structure for Doc QC and risk-based reporting SKUs — still in development. [TRANSCRIPT]
- LLM token consumption cost model for AI features — acknowledged as "a point of attention" in pricing; trying to do as much as possible deterministically before hitting LLM. [TRANSCRIPT]

**Sources:**
- https://www.[redacted]/
- [TRANSCRIPT]

---

## Slide 6: AI Roadmap Fit to Growth Thesis (Bridge)

### Public Findings + Transcript Updates

**FACTS:**

**AI Roadmap Themes (Left Column):**
1. Site Identification & Feasibility — AI-powered site profile builder with validated data; AI-assisted feasibility questionnaire completion from knowledge library; sponsor-side site selection with API exposure for custom scoring. Currently in limited availability (LA) with ~10 test customers. [TRANSCRIPT]
2. Study Start-Up Automation — Document exchange automation between eTMF and eISF; site activation workflow shortening; training log completion tracking. Trial Flow (POC stage) aims to be workflow orchestration with task dependencies for study startup. [TRANSCRIPT]
3. Document Quality & Compliance — Doc QC pipeline: batch or individual document processing → multiple quality checks (blank pages, page ordering, readability, corrupted files, title-content matching) → summarized report. Uses Tesseract OCR for deterministic checks, LLM for semantic checks. [TRANSCRIPT]
4. Risk-Based Reporting & Intelligence — Overlays structured workflow data with unstructured data (comments, notifications, emails) to produce risk heat maps, recommended actions, executive summaries. Starting site-facing, then expanding to sponsor-facing (aggregated cross-site view). [TRANSCRIPT]

**Growth Requirements (Right Column):**
1. Faster study startup (reduce time-to-first-patient)
2. Increased sponsor adoption (more sponsors deploying Apollo)
3. Higher site retention and engagement (more workflows per site)
4. Premium pricing power (differentiated capabilities)

**Connectors:**
- AI Theme 1 → Growth Req 1 + 2
- AI Theme 2 → Growth Req 1 + 4
- AI Theme 3 → Growth Req 2 + 3 + 4 (Merck use case validates sponsor demand) [TRANSCRIPT]
- AI Theme 4 → Growth Req 2 + 4

**Primary Mismatches / Missing Bets:**
- No AI for participant recruitment optimization. EMR "print to file" integration exists (~25% of customers) but not yet a data asset. Ryan Jones confirmed this gap. [TRANSCRIPT]
- No AI for protocol optimization or amendment prediction (contrast with WCG's ClinSphere Trial IntelX)
- No AI for diversity/equity in site or participant selection
- Budgets/contracting — actively seeking to partner or acquire a budgets tool, key gap in study startup workflow. [TRANSCRIPT]
- FlowBot (AI assistant for eBinders) positioned as feature, not standalone — potential for deeper AI-assisted UX. [TRANSCRIPT]

**Sources:**
- https://www.[redacted]/press-release/apollo-announces-ai-assisted-workflows/
- [TRANSCRIPT]

---

## Slide 7: Scenarios (2–3) for Growth & Disruption Outcomes

### Public Findings + Transcript Updates

**Scenario 1: "Platform Flywheel Accelerates"**
- What becomes true: AI workflows drive measurable startup time reduction; sponsors adopt Apollo as default site enablement; site network crosses 100K; "3 on 3" AI revenue target exceeded; multi-product bundles become the standard commercial motion. [TRANSCRIPT]
- Leading indicators: AI adoption above 30% within first year; Doc QC deployed at Merck and expanded to other top-20 pharma; eConsent continues 75%+ growth; site churn below 5%
- Implications: Apollo becomes the system-of-record for trial operations (their stated vision [TRANSCRIPT]), commanding premium pricing

**Scenario 2: "Steady Growth, Competitive Pressure"**
- What becomes true: AI workflows deliver moderate value but face adoption friction; Veeva SiteVault erodes site-level pricing; Apollo grows primarily through sponsor-side products; $3M AI ARR target partially met
- Leading indicators: Site growth decelerates; AI adoption below 15%; LLM token costs compress margins on AI products
- Implications: Strong but niche player; WCG acquisition still valuable for channel and data synergies but AI upside more limited

**Scenario 3: "Integration Accelerant" (WCG-Specific)**
- What becomes true: WCG acquisition closes; IRB→eBinders integration deepens (already underway with eConsent-IRB integrations [TRANSCRIPT]); combined data asset enables unique intelligence products; WCG channel deploys Apollo to thousands more sites; Doc QC rolled out across WCG sponsor base
- Leading indicators: Post-close Wave 1 integration under 6 months; Merck Doc QC expands to 5+ pharma via WCG; combined data product in market within 18 months
- Implications: Combined entity becomes dominant in site enablement + trial operations

**Sources:**
- Template-driven framework populated with [TRANSCRIPT] findings

---

# Chapter B — Disruption Risk

> **Note:** Chapter B content is largely unchanged from v1.0 as the Technology DD Call focused on Apollo's own capabilities rather than competitive threats. Updates are noted where transcript provided relevant context.

---

## Slide 8: Disruption Risk — Executive Summary (3 Disruption Modes)

### Public Findings

**Mode 1: Platform Displacement — "A better Apollo"**
- A competitor builds a superior site enablement platform that replaces Apollo's core eBinders/SiteLink franchise
- Most likely vector: Veeva SiteVault (free eISF, strong sponsor relationships, massive R&D budget)
- Transcript context: Apollo acknowledged Veeva as a competitive factor but positioned themselves as ~5x ahead in site network scale and the creator of the eISF category. [TRANSCRIPT]

**Mode 2: Upstream Capture — "AI eats the workflow"**
- AI-native tools eliminate the need for the manual workflows Apollo digitizes, making the platform less relevant
- Most likely vector: Agentic AI tools that directly connect sponsors to sites without intermediary workflow platforms
- Transcript context: Apollo's "crossing the chasm" framework explicitly addresses this — they see AI as an additive layer on top of digitized workflows, not a replacement. The Doc QC approach (deterministic checks + LLM) shows pragmatic AI integration rather than speculative replacement. [TRANSCRIPT]

**Mode 3: Ecosystem Commoditization — "Everyone does it"**
- The workflows Apollo provides become table-stakes features embedded in CTMS, eTMF, or EDC platforms
- Most likely vector: Medidata, Oracle, or Veeva embedding eISF capabilities into their broader clinical platforms
- Transcript context: Apollo's architecture is explicitly "open" and "API-first" — they acknowledged they don't pretend site selection will work for everybody out-of-box, especially large pharma, and instead expose APIs for sponsors to integrate into their own scoring. [TRANSCRIPT]

**Sources:**
- Public competitive landscape analysis
- [TRANSCRIPT]

---

## Slides 9–12: Disruption Detail

> Content retained from v1.0 — no material updates from transcript. The competitive positioning discussion confirmed Apollo's awareness of these risks and their strategic response (network scale moat + AI layering + open API philosophy).

---

# Chapter C — Underlying Asset Value

---

## Slide 13: Underlying Asset Value — Executive Summary (R/Y/G Scorecard)

### Updated Scorecard

| Asset | Rating | Why |
|-------|--------|-------------|
| **Product** | 🟢 Green (upgraded from 🟡) | Six products spanning site + sponsor workflows, all built natively with own e-signature, security, and document markup. eBinders is "Box.net for clinical research," eConsent is "DocuSign for clinical research," Feasibility is "RFP management for clinical research." eConsent growing ~75% YoY. Three AI-native products in development. All products share unified data model and platform architecture. [TRANSCRIPT] |
| **Data** | 🟢 Green | 65K+ study sites generating operational workflow data; 50M+ documents with 20K added per day; milestone-based audit trail data (which they have rights to use); cross-study/cross-sponsor site performance data is unique and defensible. Data quality: 50-60% from sponsor side (very clean), 15-20% good from sites, ~25% lower quality. [TRANSCRIPT] |
| **Channel** | 🟢 Green | Dual go-to-market confirmed: site-up + sponsor-down. ~400 total customers. Sponsor deals driving 500 sites/week during peaks. Deployed in every study Merck and Pfizer launch, every FSO study IQVIA launches. [TRANSCRIPT] |
| **Relationships** | 🟢 Green (upgraded from 🟡) | Merck, Pfizer, IQVIA as named anchor customers. [TRANSCRIPT] Merck actively co-developing Doc QC use case (5,000 hrs/month problem). eConsent has completed IRB integrations relevant to WCG. Existing WCG strategic partnership. |

### Open Questions
- What % of site relationships are direct-contracted vs. sponsor-deployed?
- Depth of sponsor relationships — multi-year, multi-study commitments?
- How sticky are the technology integrations (CTMS, eTMF, identity systems)?
- Actual user engagement depth per site (daily active users, workflow completion rates)?

**Sources:**
- https://www.[redacted]/
- [TRANSCRIPT]

---

## Slide 14: Product Asset Strength

### Public Findings + Transcript Updates

**What the product uniquely enables:**
- FACTS: Apollo operates a two-sided platform serving both sites and sponsors with six products. [TRANSCRIPT]
  - **Site-side products:** (1) eBinders — structured document workflow with categorization, metadata, signature workflows, task completion, monitoring workflows. "Box.net purpose-built for the regulatory requirements and workflows of clinical research." (2) eConsent — document editing, preview, routing, audit trail. "DocuSign purpose-built for clinical research." ~75% YoY growth, only ~2 years old. Added billable forms and form builder. (3) Site Feasibility — AI-native product in limited availability. Automates feasibility questionnaire completion using knowledge library of past responses. Sites receive 500–1,000 questionnaires/year. [TRANSCRIPT]
  - **Sponsor-side products:** (1) SiteLink — started as document exchange, now covers study activation (role setup, document sourcing from eTMF, distribution to sites), training log management, and monitoring. Anchor product that broke Apollo into the sponsor side. (2) Site Selection — two-sided network product where site feasibility profiles feed sponsor-side search with API for custom scoring matrices. (3) Doc Exchange/TMF — document exchange between sponsor and site with intelligent document type tagging for proper filing. [TRANSCRIPT]
- All products built natively with Apollo's own e-signature, security, and document creation/markup workflows. No dependency on DocuSign, Box, or other third-party document platforms. [TRANSCRIPT]
- Each product follows a consistent lifecycle: digitize → connect (site↔sponsor) → drive adoption → automate → measure/intelligence. [TRANSCRIPT]

**Differentiation sources:**
- FACTS: Created the eISF category a decade ago; ~5x ahead of closest competitor in site network; ranked #1 clinical trial technology for 6 consecutive years. [TRANSCRIPT]
- Site-first design philosophy confirmed: core architecture principle is providing workflow value to sites (not just data extraction for sponsors), with data as a secondary output of doing the work. This is described as a unique positioning vs. competitors who deploy data-gathering tools that provide no site value. [TRANSCRIPT]
- Unified data model underpins all products — sites and sponsors look at the same data with different views. [TRANSCRIPT]

**Switching friction / stickiness signals:**
- Regulatory audit trails create strong lock-in for sites with multi-year document trails
- 85% of eBinders code is content creation, signature circulation, audit management, and version control [TRANSCRIPT]
- Full audit trail of every operational action (beyond just document creation) [TRANSCRIPT]
- GxP compliance: 21 CFR Part 11, SOC 2 Type 2, GDPR, HIPAA, Annex 11, ICH E6 R3. Regulatory team of ~6 people works closely with QA to ensure compliance; uses Catrix for compliance management. [TRANSCRIPT]

**Sources:**
- https://www.[redacted]/
- [TRANSCRIPT]

---

## Slide 15: Data Asset Strength

### Public Findings + Transcript Updates

| Dataset | Proprietary? | Longitudinal? | Quality Nuance | Rights/Access Constraints | Replication Difficulty |
|---------|-------------|---------------|-----------------|---------------------------|----------------------|
| Audit trail / milestone data (structured) | Yes — generated on platform | Yes — accumulates over study lifecycle | High — 50-60% from sponsor side is very clean (via Flow Records metadata store); additional 15-20% good from sites [TRANSCRIPT] | Apollo has rights to use for business purposes [TRANSCRIPT] | Very High — requires 65K+ site network |
| Document content (50M+ documents, 20K added/day) [TRANSCRIPT] | Yes — stored on platform | Yes | Medium — mix of structured and unstructured | Apollo does NOT have rights to scrape/analyze without customer consent [TRANSCRIPT]. Access obtained per-feature when customers opt in (e.g., Doc QC). | Very High — requires dual-sided adoption |
| Site performance signals (enrollment speed, startup efficiency, compliance) | Yes — derived from platform activity | Yes | Medium-High — derived from audit trail data | Covered under business use rights [TRANSCRIPT] | Very High — unique cross-sponsor view |
| Flow Records (master metadata store) [TRANSCRIPT] | Yes | Yes | High — structured metadata on milestones, especially for sponsor-generated studies [TRANSCRIPT] | Internal platform asset | Very High — requires platform scale |
| eConsent interaction data | Yes | Yes | Medium — consent completion rates, participant engagement | HIPAA/GDPR constrained | Moderate |

**Data Architecture Context:** [TRANSCRIPT]
- Primary data store: MongoDB
- SQL stores for SiteLink and Flow Records (master metadata)
- S3 for document storage
- Data is replicated across three AWS regions (US, EU, Australia) with same code base
- Tamr is the data mastering tool — critical for data completeness and quality across products (e.g., site profiles)
- Kafka project underway for improved speed, resilience, and cost of data pipeline
- Data team: 7 people under Philip, managing data mastering, data stores, and API exposure for product teams [TRANSCRIPT]

**Most Important Data Constraints:**
- Document content (50M+ docs) is a latent asset — Apollo has the data but not the rights to analyze it without per-customer consent. The approach is feature-based consent: when a customer enables Doc QC, they implicitly consent to document analysis for that service. [TRANSCRIPT]
- Cross-sponsor benchmarking requires anonymization to avoid competitive sensitivity
- The AI value of the audit trail data (which they DO have rights to) is sufficient for the current product roadmap (site performance scoring, risk reporting, study startup intelligence). Ryan Jones: "I don't see any limits" to what they can build from milestone-based data alone. [TRANSCRIPT]

**GAPS / QUESTIONS:**
- How much of the 65K site data is active vs. historical?
- Data retention policy and its effect on longitudinal value?
- Exact contractual language around data rights — is it standard across all customer contracts or negotiated per deal?
- Tamr implementation status and data quality improvement trajectory?

**Sources:**
- https://www.[redacted]/
- [TRANSCRIPT]

---

## Slide 16: Channel Asset Strength

### Public Findings + Transcript Updates

**Primary channels to reach buyers/users:**
- FACTS: Dual go-to-market confirmed in detail. [TRANSCRIPT]
  - **Site-up motion:** Started the business selling to sites only. First 100 customers were sites (took ~6 years). Currently ~400 total customers. In the early days, activating a single site customer added ~50 study sites every couple of weeks. Site feasibility product seeded free to drive rapid adoption across site user base. [TRANSCRIPT]
  - **Sponsor-down motion:** Sponsor adoption creates exponential site activation — during peak periods, 500 sites activated per week via sponsor deals. Sponsor adoption was predictable: a ClinOps person at the sponsor would encounter Apollo at a site, endorse it internally, and the sponsor would then buy SiteLink. [TRANSCRIPT]
- FACTS: Named anchor customers — Apollo is deployed in every study Merck launches, every study Pfizer launches, and every FSO study IQVIA launches. [TRANSCRIPT]
- FACTS: AWS Marketplace listing for SiteLink (announced Oct 2025).
- FACTS: Research Revolution annual event franchise; FloPro Certifications; "The League" community of 60+ clinical trial executives.

**Embedded distribution advantages:**
- When a sponsor deploys SiteLink, all sites in that study are activated on Apollo — network-driven distribution confirmed. [TRANSCRIPT]
- Merck is actively requesting Apollo build Doc QC at the site level to fix document quality before submission — this is a sponsor effectively pulling Apollo deeper into site workflows. [TRANSCRIPT]

**Channel concentration and fragility:**
- With 400 total customers and named anchor relationships (Merck, Pfizer, IQVIA), there is likely significant customer concentration in the top 10.
- GAP: Revenue concentration by customer — not disclosed on the call.

**Sources:**
- https://www.[redacted]/
- [TRANSCRIPT]

---

## Slide 17: Relationship Asset Strength

### Public Findings + Transcript Updates

**Strategic relationships that matter:**

1. **Merck** — Deployed in every study Merck launches. Merck spending 5,000 hours/month on manual document quality review. Actively co-developing Doc QC use case with Apollo — Merck wants Doc QC implemented at the site level before documents are submitted, cutting the entire review-return cycle. [TRANSCRIPT]

2. **Pfizer** — Deployed in every study Pfizer launches. Apollo supported Pfizer's COVID-19 vaccine clinical trials. [TRANSCRIPT]

3. **IQVIA** — Deployed in every FSO (Full-Service Outsourced) study IQVIA launches. [TRANSCRIPT]

4. **WCG Clinical (Strategic Partner since Nov 2023):** Integration between Apollo eBinders and WCG's ClinTech/ClinSphere platform for IRB, training, and safety letter document flow. eConsent product has completed IRB integrations — consent forms flow from IRB, creating an important intersection with WCG's IRB business. [TRANSCRIPT]

5. **Insight Partners (Lead Investor):** Led Series C ($80M) and Series C-1 ($27M).

6. **Technology integration partners:** Greenphire, TruLab, Yunu, WCG Velos. EMR integration via "print to file" (~25% of customers use). Currently point-to-point integrations, charged via professional services. Working with a partner to build middleware bus for out-of-box integrations. [TRANSCRIPT]

7. **VersaTrial (Acquired Sept 2023):** Expanded capabilities.

**Durability/exclusivity:**
- Named anchor customers (Merck, Pfizer, IQVIA) represent deep operational embedding — Apollo is infrastructure for their clinical operations, not a discretionary tool.
- Merck co-development relationship on Doc QC suggests potential for design partner influence on product roadmap.
- Relationships are non-exclusive — sponsors use Apollo alongside other tools.

**Sources:**
- https://www.wcgclinical.com/2023/11/13/partnership-between-apollo-healthcare-and-wcg-to-advance-site-enablement-in-clinical-research/
- [TRANSCRIPT]

---

# Chapter D — Team + Operating Model

---

## Slide 18: Team + Operating Model — Executive Summary

### Public Findings + Transcript Updates

**HEADLINE:** Apollo has a mature, well-structured engineering and product organization with clear role separation between innovation (CTO/OCTO) and execution (COO/VP Engineering). The team is predominantly Serbia-based with US-based leadership and data functions. Total headcount is approximately 115 across engineering, product, and regulatory. [TRANSCRIPT]

**Key Organizational Signals:**
- Clear innovation vs. execution separation: CTO Andres Garcia leads "OCTO" (Office of the CTO) focused on bleeding-edge technology and POCs. COO Shankar Jagannathan owns product and engineering execution. When OCTO innovations are ready, they hand off to product teams for productionization. [TRANSCRIPT]
- Engineering leadership recently strengthened: VP Engineering Kapil Bage (~1.5 years tenure) brought deep data/AI experience and has driven significant operational changes including AI-augmented SDLC. [TRANSCRIPT]
- Three VP-level engineering leaders with clear domain ownership: Sri (Platform + Sponsor Products), Jelena (Site Products + Serbia Operations), and Kapil over engineering operations. [TRANSCRIPT]
- Product team is mostly PMs (18 total), with a deliberately diminishing UX role as AI tools (Vercel) are used for rapid prototyping. [TRANSCRIPT]
- Regulatory team (~6 people) works closely with QA to ensure GxP compliance across all features. [TRANSCRIPT]

**Rating:** 🟢 Green — Organization is well-structured for current scale with clear accountability, innovation pipeline, and execution capacity. Key risk is concentration of institutional knowledge in a small leadership team.

**Sources:**
- [TRANSCRIPT]

---

## Slide 19: People & Roles (Accountability + Leveling)

### Transcript Updates

**Leadership Team:**

| Role | Person | Scope | Tenure / Context |
|------|--------|-------|-------------------|
| CEO / Co-Founder | Ryan Jones | Company strategy, vision, customer relationships | Co-founder, ~10 years |
| CTO / Co-Founder | Andres Garcia | OCTO — bleeding edge technology, innovation POCs, AI architecture | Co-founder, ~10 years. Leads small team focused on emerging tech. Hands off productionized work. [TRANSCRIPT] |
| COO | Shankar Jagannathan | Product + Engineering execution, operational cadence | Recruited; owns the build-and-ship engine. Previously worked with Sri. [TRANSCRIPT] |
| VP Engineering | Kapil Bage | Engineering operations, AI-augmented SDLC, developer tooling | ~1.5 years. Deep data/AI background. Drove major operational improvements including AIDLC adoption. [TRANSCRIPT] |
| VP Platform + Sponsor Products | Sri | Platform architecture, sponsor-side product engineering | Deep enterprise customer experience. Previously worked with Shankar. [TRANSCRIPT] |
| VP Site Products + Serbia Ops | Jelena | Site-side product engineering, Serbia team management, process harmonization | Manages all Serbian engineering team. Strong process/operations focus. Harmonizes roadmaps across products. [TRANSCRIPT] |
| Data Team Lead | Philip | Data mastering, data stores, API exposure | US-based. 7-person team managing Tamr, Flow Records, data pipeline. [TRANSCRIPT] |
| DevOps Lead | Nicola | Centralized DevOps CoE | Runs DevOps as a center of excellence. [TRANSCRIPT] |
| QA Lead | Mariana | Quality assurance, regulatory compliance testing | Works closely with regulatory team. Each feature/unit test tagged for 21 CFR compliance. [TRANSCRIPT] |

**Organizational Layers:**
- Ryan + Andres (founders) → Strategic direction + innovation
- Shankar → Operational ownership of product + engineering
- Kapil, Sri, Jelena → VP-level domain leads
- Philip, Nicola, Mariana → Functional leads (data, DevOps, QA)
- ~6 person regulatory team → Cross-cutting compliance function

**Sources:**
- [TRANSCRIPT]

---

## Slide 20: Functional Coverage & Resourcing (Balance)

### Transcript Updates

**Headcount Breakdown (Confirmed):** [TRANSCRIPT]

| Function | Headcount | Notes |
|----------|-----------|-------|
| Engineering (total) | ~91 | Includes developers, data, DevOps, QA |
| — Developers (hands-on-keyboard) | ~53 | Core product engineering |
| — Data team | 7 | Under Philip; data mastering, stores, APIs |
| — DevOps | Centralized CoE | Under Nicola; not separately sized |
| — QA | Team under Mariana | Not separately sized |
| Product (total) | ~18 | Mostly PMs |
| — UX | Diminishing | Deliberately reduced as AI tools (Vercel) used for prototyping [TRANSCRIPT] |
| Regulatory | ~6 | Cross-cutting; works with QA on compliance |
| **Total (Eng + Product + Reg)** | **~115** | |

**Workforce Composition:** [TRANSCRIPT]
- 85-90% captive employees (full-time)
- 10-15% contractors
- Apollo is deliberately increasing contractor capacity for flexibility — "we're making room to make it easy to scale up and down with contractors" [TRANSCRIPT]
- Majority of engineering team is Serbia-based (managed by Jelena, with Rosco leading Serbia engineering)
- Data team (Philip) and some leadership are US-based

**Functional Balance Assessment:**
- **Engineering-to-Product ratio:** ~5:1 (91 eng / 18 product) — healthy for a product-led engineering org
- **Data team as % of engineering:** ~8% (7/91) — reasonable given data is increasingly strategic, though may need to scale as AI products expand
- **Regulatory team:** 6 people for a GxP-regulated platform serving 65K sites — lean but appears effective with tooling (Catrix) and close QA partnership
- **UX gap emerging:** Deliberate decision to reduce UX in favor of AI prototyping tools. This is efficient but carries risk if AI-generated designs don't meet the bar for clinical research workflows where usability errors have compliance implications.

**GAPS / QUESTIONS:**
- Individual team sizes for DevOps and QA (grouped under engineering total but not broken out)
- Attrition rates — not discussed on the call
- Compensation benchmarks vs. market (Serbia-based team may offer cost advantages but also retention risk if market heats up)
- Succession risk for key technical leaders (Andres, Sri, Philip)
- How many of the 53 developers are working on AI-specific features vs. core platform?

**Sources:**
- [TRANSCRIPT]

---

## Slide 21: Operating Model Maturity (Slider-Style Assessment)

### Transcript Updates

| Dimension | Maturity (1–5) | Evidence |
|-----------|:--------------:|----------|
| **SDLC Process** | 4 | Beta → GA lifecycle for established products; LA (Limited Availability) process with ~10 test customers for new products. Each feature/unit test tagged for 21 CFR compliance via Catrix. Internal SOPs co-developed with regulatory team for audit readiness. Moving CI/CD to GitHub Actions. [TRANSCRIPT] |
| **AI-Augmented Development** | 4 | "AIDLC" concept — AI-augmented SDLC using Claude (primary IDE tool), Cursor (some developers), Vercel (for PMs to prototype). "Functionalize on QA side" — applying AI to testing. Kapil drove this adoption. Significantly accelerated development time. [TRANSCRIPT] |
| **Product Analytics** | 3 | Pendo for feature usage tracking. Tableau exposed through services team. AG Grid for in-product interactive charts/tables. Data team builds feeds for product consumption. [TRANSCRIPT] |
| **Engineering Metrics** | 3.5 | Jellyfish tracking full DORA metrics suite: deployment frequency, lead time to changes, PR review time, cycle time, error rates, and AI adoption rates. Used for engineering performance management. [TRANSCRIPT] |
| **DevOps / Infrastructure** | 4 | Centralized DevOps CoE under Nicola. 100% AWS with 51 microservices on ECS Fargate across 3 AZs per region. Multi-AZ HA with 99.95% uptime target. Auto-scaling (eBinders: 10–40 instances). 4 environments (QA/FAT/UAT/Prod) with Performance and Pre-Prod being added Q2. Blue-green and canary deployments for high-risk changes. Schematic feature flags. PagerDuty + Slack alerting. Moving from Orcus to Step Functions. ~$1M annual AWS spend. [TRANSCRIPT] |
| **Data Infrastructure** | 3 | MongoDB (legacy) + PostgreSQL/Aurora RDS (newer products) + Snowflake data warehouse. Tamr for data mastering. Kafka project underway for pipeline improvements. Three-region deployment (US East, EU Frankfurt, APAC Sydney). Data quality varies: 50-60% very clean (sponsor), 15-20% good (sites), ~25% lower quality. [TRANSCRIPT] |
| **Security & Compliance** | 4.5 | SOC 2 Type 2, 21 CFR Part 11, GDPR, HIPAA, Annex 11, ICH E6 R3. AWS architecture-approved partner. Double encryption (AWS KMS + customer keys). VPC with private subnets, NAT gateways, VPC peering. Wiz cloud security. Mindcast endpoint security. GitHub code security scanning. Separation of duties for AWS access. Dedicated regulatory team + QA partnership. [TRANSCRIPT] |
| **Innovation Pipeline** | 4 | OCTO (Office of CTO) under Andres explicitly manages POC-to-product pipeline. Separate from execution engine. Clear handoff process to product teams. Currently incubating Doc QC, Trial Flow, and other emerging tech. [TRANSCRIPT] |

**Overall Operating Model Rating:** 3.75 / 5 — Mature for a company of this size, with particular strength in compliance process, security architecture, DevOps practices, and innovation pipeline management. Primary gap is data infrastructure maturity (acknowledged and being addressed with Kafka + Snowflake).

**Sources:**
- [TRANSCRIPT]

---

# Chapter E — AI Assessment

---

## Slide 22: AI Assessment — Executive Summary (Internal vs External)

### Transcript Updates

**HEADLINE:** Apollo has a pragmatic, well-structured approach to AI that prioritizes measurable workflow value over speculative capabilities. The AI strategy operates on two axes: (1) external AI products sold as independent SKUs to customers, and (2) internal AI adoption ("AIDLC") that accelerates engineering velocity. Current AI-specific revenue is $0, with a 2026 target of $3M ARR from three new AI workflows. [TRANSCRIPT]

**External AI (Customer-Facing):**
- Rating: 🟡 Yellow (Early but Well-Directed)
- Three AI-native products in various stages: Site Feasibility/Selection (LA), Doc QC (active development, strong sponsor pull from Merck), Risk-Based Reporting (active development). [TRANSCRIPT]
- Architecture approach: Human-in-the-loop (HITL) for GxP compliance. Deterministic processing first (Tesseract OCR), LLM only when semantic understanding required. AWS Bedrock for all AI services — confirmed using Claude (Sonnet 3.5) and Google Gemini; no OpenAI integration. [TRANSCRIPT]
- Doc Q product moving to production in Q2 2026. [TRANSCRIPT]
- Pricing: Independent SKUs, consumption-based considerations for LLM-heavy features. [TRANSCRIPT]
- Key strength: AI products are built on real operational data generated by the platform — not synthetic or purchased datasets.
- Key risk: $0 to $3M is an unproven commercial leap. Product-market fit for AI features at premium pricing is not yet validated at scale.

**Internal AI (Engineering Productivity):**
- Rating: 🟢 Green (Advanced Adoption)
- "AIDLC" — AI-augmented software development lifecycle adopted across the organization. [TRANSCRIPT]
- Claude as primary AI coding tool; Cursor used by some developers; Vercel used by PMs for rapid prototyping (reducing need for dedicated UX team). [TRANSCRIPT]
- VP Engineering Kapil Bage drove adoption with deep AI/data background. [TRANSCRIPT]
- QA team beginning to "functionalize" testing with AI. [TRANSCRIPT]
- Significant development velocity improvement reported (not quantified on the call).

**Sources:**
- [TRANSCRIPT]

---

## Slide 23: AI Inventory (What Exists)

### Transcript Updates

| AI Capability | Stage | Description | Revenue Model | Key Evidence |
|--------------|-------|-------------|---------------|--------------|
| **Site Feasibility** | Limited Availability | AI-powered site profile builder. Knowledge library stores past questionnaire responses. Recognizes previously answered questions across formats (web forms, PDFs, uploaded questionnaires). Automates completion of 500–1,000 annual questionnaires per site. | ~$500/study site add-on [TRANSCRIPT] | ~10 test customers in LA process [TRANSCRIPT] |
| **Site Selection** | Limited Availability | Sponsor-side search across site profiles by therapeutic area, geography, real-time performance. API-first — exposes APIs so large pharma can integrate into their own scoring matrices. Green checkmark on validated profiles. | Part of sponsor platform (pricing TBD) | API-first design for enterprise customers who won't use one-size-fits-all tool [TRANSCRIPT] |
| **Doc QC** | Active Development (OCTO) | Document quality pipeline: individual or batch → branch into multiple quality checks (blank pages, misorder, readability, corrupted files, title-content matching) → collected into summary → detailed report. Tesseract OCR for deterministic checks; LLM for semantic checks (e.g., does title match content?). | Independent SKU, consumption-based pricing under consideration [TRANSCRIPT] | Merck spending 5,000 hrs/month on manual QC; requesting site-level deployment to catch issues before submission [TRANSCRIPT] |
| **Risk-Based Reporting** | Active Development | Workflow tool with task dependencies (like Monday.com/MS Project). Overlays structured workflow data with unstructured data (comments, notifications, emails). Produces status heat maps + executive/detailed summaries. Aggregated or segregated by study, site, therapeutic area. Vision: recommended actions. Both site-facing and sponsor-facing versions planned. | Independent SKU [TRANSCRIPT] | Natural extension of existing audit trail data asset [TRANSCRIPT] |
| **Trial Flow** | POC | Workflow orchestration tool with task dependencies for study startup and execution. | TBD | Further out in pipeline [TRANSCRIPT] |
| **FlowBot** | Deployed (feature) | AI assistant embedded in eBinders for role-based onboarding guidance. Simplifies product usage for different user roles. | Bundled with eBinders (not separate SKU) [TRANSCRIPT] | Operational AI, not a revenue product |
| **Operational Audit Trails** | Deployed (free feature) | AI-enhanced consumption of audit trail data. Launched late 2025 as free feature. | Free (adoption driver) [TRANSCRIPT] | First AI feature shipped; $0 revenue by design |
| **AIDLC (Internal)** | Deployed | AI-augmented SDLC: Claude for coding, Cursor for some devs, Vercel for PM prototyping, AI for QA functionalization. | N/A (internal productivity) [TRANSCRIPT] | Organization-wide adoption driven by VP Engineering |

**AI Architecture Summary:** [TRANSCRIPT]
- All AI services run through AWS Bedrock
- Confirmed LLM models: Claude (Sonnet 3.5) and Google Gemini via Bedrock. No OpenAI integration. [TRANSCRIPT]
- Human-in-the-loop (HITL) explicitly stated as design principle for GxP-regulated workflows
- Cost optimization: deterministic processing (Tesseract OCR) used wherever possible before invoking LLM
- No mention of fine-tuned or custom models — appears to use foundation models via Bedrock API

**GAPS / QUESTIONS:**
- LLM API cost structure and how it impacts AI product margins
- Accuracy metrics and validation results for any AI features (especially feasibility auto-completion and Doc QC)
- Customer evidence / pilot results — quantified time savings, error reduction, adoption rates
- Whether HITL approach will scale or become a bottleneck as volume grows
- AI team size — how many of the 53 developers are dedicated to AI features vs. borrowed from product teams?
- RAG architecture details (if any) for feasibility knowledge library
- Data pipeline for training/evaluation — how are AI models validated for GxP contexts?

**Sources:**
- [TRANSCRIPT]

---

## Slide 24: Architecture Snapshot + Readiness Callouts (IT/Data/AI)

### Transcript Updates

**Application Architecture:** [TRANSCRIPT]

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Angular (legacy v14, newer v21) + TypeScript | Version standardization effort underway [TRANSCRIPT] |
| Static Hosting | S3 + CloudFront | Static frontend assets [TRANSCRIPT] |
| Backend | Node.js (primary), Python (some services) | [TRANSCRIPT] |
| Compute | ECS Fargate (containerized) | 51 microservices; no EC2 instances outside ECS [TRANSCRIPT] |
| Container Registry | ECR | Per-region image storage [TRANSCRIPT] |
| Container Orchestration | EKS (Orcus only) | Orcus workflow tool only; migrating all workflows to AWS Step Functions (Q1) [TRANSCRIPT] |
| Orchestration (target) | AWS Step Functions | Replacing Orcus for cost savings and dependency reduction [TRANSCRIPT] |
| Primary Database | MongoDB (NoSQL) | Document store for legacy products (eBinders, eConsent) [TRANSCRIPT] |
| Relational Database | PostgreSQL / Aurora RDS | For newer products (SiteLink 2, Site Experience) [TRANSCRIPT] |
| Data Warehouse | Snowflake | US East; consolidated analytics from all regions [TRANSCRIPT] |
| Object Storage | Amazon S3 | 1.6B total objects (production + non-production + backups); 50M+ unique documents [TRANSCRIPT] |
| Messaging | SQS, RabbitMQ, Amazon MQ, AMQP | Event-driven architecture with asynchronous communication [TRANSCRIPT] |
| Data Pipeline (future) | Kafka | Designed Q4, implementing Q1+; replacing RabbitMQ as platform streaming layer [TRANSCRIPT] |
| Authentication | OAuth 2.0 via Okta | [TRANSCRIPT] |
| API Management | AWS API Gateway | All APIs routed through gateway; legacy public APIs moving behind gateway by Q3 [TRANSCRIPT] |
| API Documentation | Swagger | All APIs documented [TRANSCRIPT] |
| AI Services | AWS Bedrock | Claude (Sonnet 3.5) and Google Gemini; no OpenAI [TRANSCRIPT] |
| OCR | Tesseract | Deterministic document processing before LLM |
| Document Viewer | Aura Price | Document viewing and annotation for eConsent and other products [TRANSCRIPT] |
| Email Service | Mailgun | [TRANSCRIPT] |
| CI/CD | GitHub Actions | eBinders recently migrated from Semaphore [TRANSCRIPT] |
| Feature Flags | Schematic | Per-customer feature rollout and risk reduction [TRANSCRIPT] |
| Monitoring - Infrastructure | CloudWatch | CPU, memory, disk, network metrics for ECS tasks [TRANSCRIPT] |
| Monitoring - Audit | CloudTrail | API request/response logging [TRANSCRIPT] |
| Monitoring - APM | New Relic | Transaction tracing, error tracking, end-to-end request flow [TRANSCRIPT] |
| Incident Response | PagerDuty | Alerting and response; integrated with Slack for threshold breach alerts [TRANSCRIPT] |
| Product Analytics | Pendo | Feature usage tracking |
| Engineering Metrics | Jellyfish | DORA metrics: deployment frequency, lead time, PR review time, cycle time, error rates, AI adoption [TRANSCRIPT] |
| Compliance Management | Catrix | Integrated into SDLC; linked with Jira before UAT for regulatory feature tagging [TRANSCRIPT] |
| Data Mastering | Tamr | Master data management for study sites and patient data [TRANSCRIPT] |
| BI/Analytics | Tableau | Frontend analytics for teams and customers [TRANSCRIPT] |
| Advanced UI | ApexCharts, AG Grid | Reporting, interactive charts/tables [TRANSCRIPT] |
| Cloud Provider | AWS (100% cloud) | AWS architecture-approved partner; ~$1M annual AWS spend [TRANSCRIPT] |
| Regions | US East (N. Virginia), EU (Frankfurt), APAC (Sydney) | 80% load on US East; same codebase across all three [TRANSCRIPT] |

**Security Architecture:** [TRANSCRIPT]
- Double encryption: AWS KMS + customer encryption layer with customer-generated KMS keys. All data encrypted in transit and at rest. [TRANSCRIPT]
- VPC architecture: all services isolated from Internet via private subnets. NAT gateways for outbound traffic. [TRANSCRIPT]
- VPC peering for private connectivity to MongoDB and message queues. [TRANSCRIPT]
- Private signed URLs for S3 access. Security groups and NACLs in place. [TRANSCRIPT]
- Wiz as primary cloud security tool (covers AWS and GCP directory). [TRANSCRIPT]
- Mindcast web security agent on all laptops (endpoint-based policies for remote users). [TRANSCRIPT]
- GitHub code security scanning on pull requests. [TRANSCRIPT]
- Separation of duties: separate grantor and approver for AWS infrastructure access requests. [TRANSCRIPT]

**High Availability & Disaster Recovery:** [TRANSCRIPT]
- Multi-AZ deployments across 3 availability zones per region. ECS Fargate tasks and Application Load Balancers distributed across all 3 AZs. [TRANSCRIPT]
- Target uptime: 99.95% per region. [TRANSCRIPT]
- Current DR: Availability Zone (AZ) level. Q1 target: multi-region DR implementation. [TRANSCRIPT]
- US region DR: cold standby for application services, warm standby for databases. [TRANSCRIPT]
- S3: 11 nines durability, full versioning, cross-region and cross-account replication (real-time for DR). Automated lifecycle management and version protection. [TRANSCRIPT]
- MongoDB: active-active clusters with automatic failover. Continuous backup with cross-region nodes. [TRANSCRIPT]
- RabbitMQ clusters with 3 nodes per region. [TRANSCRIPT]
- Cross-account backup layer for additional protection. [TRANSCRIPT]
- Auto-scaling example: eBinders scales 10–40 instances (20 minimum weekday/office hours, 10 minimum off-hours at 10 PM EST). Rolling update deployment strategy. [TRANSCRIPT]

**CI/CD & Deployment:** [TRANSCRIPT]
- 4 environments: QA, FAT, UAT, Production. Q2 additions: Performance and Pre-Production environments. [TRANSCRIPT]
- Deployment strategy: deploy to US first, then roll out to other regions. [TRANSCRIPT]
- Rolling updates standard; blue-green and canary deployments for high-risk changes. [TRANSCRIPT]
- Feature flagging via Schematic for risk reduction and per-customer feature rollout. [TRANSCRIPT]
- 90% test automation for APIs; 60–70% automation for applications. [TRANSCRIPT]
- Load testing currently ad-hoc; goal to integrate into SDLC via dedicated performance environment (Q2). [TRANSCRIPT]
- Catrix integrated into SDLC for compliance testing, linked with Jira before UAT. [TRANSCRIPT]

**Architecture Readiness for AI:**
- 🟢 **Cloud-native:** 100% AWS with Bedrock access — no infrastructure migration needed for AI
- 🟢 **Data availability:** Rich operational data (7.2M workflows/month, 5.8M monitoring activities) accessible for AI features
- 🟡 **Data quality:** Mixed — sponsor data very clean (50-60%), site data decent (15-20%), remainder lower quality. Tamr project addressing this. [TRANSCRIPT]
- 🟡 **Data pipeline maturity:** Current stack adequate but Kafka migration needed for AI-scale real-time processing. [TRANSCRIPT]
- 🟡 **Observability:** CloudWatch + New Relic + CloudTrail + PagerDuty provides solid foundation. Custom Slack alerts for threshold breaches. No mention of AI-specific monitoring (model drift, inference latency, cost tracking per feature). [TRANSCRIPT]
- 🟢 **Compliance readiness:** Strong GxP compliance infrastructure (Catrix, regulatory team, tagged unit tests) provides foundation for AI feature compliance
- 🟢 **Integration architecture (upgraded):** API Gateway routing all APIs with Swagger documentation. Middleware bus project underway. Schematic feature flags enable controlled AI feature rollout. [TRANSCRIPT]

**Architecture Debt / Risk Callouts:**
1. Angular version fragmentation (v14 to v21) across products — standardization effort underway but technical debt may slow unified AI feature deployment [TRANSCRIPT]
2. MongoDB as primary store may create challenges for the relational queries needed by AI analytics (PostgreSQL/Aurora RDS for newer products and Flow Records helps) [TRANSCRIPT]
3. Orchestration migration (Orcus → Step Functions) is in-flight — adds execution risk this quarter
4. eBinders monolith-to-microservices decomposition in progress — timeline and scope unclear [TRANSCRIPT]
5. Identity management for sites is through Apollo's own SiteLink platform (not federated) — may limit AI feature adoption for sites not using SiteLink [TRANSCRIPT]

**GAPS / QUESTIONS:**
- Application architecture diagram — substantial detail provided verbally but visual diagram not yet delivered [TRANSCRIPT]
- Bedrock token limits and cost allocation per AI feature
- AI inference infrastructure (batch vs. real-time, queueing, rate limiting)
- RabbitMQ → Kafka migration timeline and completion criteria
- eBinders monolith decomposition scope and timeline [TRANSCRIPT]
- Angular version standardization plan and timeline [TRANSCRIPT]

**Corporate IT Overview:** [TRANSCRIPT]
- Google Workspace for corporate email and collaboration (Gmail, Drive, Docs, Sheets, Slides). [TRANSCRIPT]
- Hexnode MDM for device management; Apple Business Manager for Mac provisioning (hands-free). [TRANSCRIPT]
- Device mix: 70% Mac, 30% Windows. Shifting from device purchases to 3-year leasing model with automatic refresh cycle. One Windows 10 device identified; rest on Windows 11. [TRANSCRIPT]
- Two physical offices: Atlanta and Belgrade. Designed as "Internet cafes" — no on-premise infrastructure. Ubiquity Wi-Fi and switches; IT closet with badge-restricted access. Rest of team is fully remote. [TRANSCRIPT]
- Google SSO for common applications. [TRANSCRIPT]
- JIRA Service Management for IT help desk, incident tracking, problem and change control. ~22 tickets/week (~100/month) internal IT support. [TRANSCRIPT]
- License management: 3-year renewal cycles for established tools (Google, Slack, Atlassian); 1-year evaluation period for new technologies. No major renewal dates imminent. [TRANSCRIPT]

**Sources:**
- [TRANSCRIPT]

---

## Slide 25: AI Value Framework (Internal vs External Value Buckets)

### Transcript Updates

**External AI Value (Customer-Facing Products):**

| Value Bucket | AI Capability | Beneficiary | Value Mechanism | Proof Point |
|-------------|--------------|-------------|-----------------|-------------|
| **Cost Reduction** | Doc QC | Sponsors, Sites | Automate manual document review. Merck: 5,000 hrs/month manual QC. [TRANSCRIPT] | Merck actively requesting implementation; quantified labor burden |
| **Time Compression** | Site Feasibility | Sites | Automate 500-1,000 questionnaires/year per site. Knowledge library auto-completes from past responses. [TRANSCRIPT] | LA with ~10 customers; specific workflow quantified |
| **Time Compression** | Site Selection | Sponsors | Reduce site identification cycle. API-first for enterprise integration into existing workflows. [TRANSCRIPT] | Validated site profiles with green checkmark |
| **Risk Reduction** | Risk-Based Reporting | Sponsors, Sites | Surface risks from combined structured + unstructured data. Recommended actions. [TRANSCRIPT] | Extension of existing audit trail; clear data asset |
| **Quality Improvement** | Doc QC (site-level) | Sponsors, Sites | Catch document quality issues before submission, eliminating review-rejection-resubmission cycle. [TRANSCRIPT] | Merck-driven demand for pre-submission QC |
| **Operational Intelligence** | Risk-Based Reporting | Sponsors | Cross-site/cross-study performance dashboards with heat maps and executive summaries. [TRANSCRIPT] | Built on 7.2M monthly workflows |

**Internal AI Value (Engineering Productivity):**

| Value Bucket | AI Capability | Beneficiary | Value Mechanism | Proof Point |
|-------------|--------------|-------------|-----------------|-------------|
| **Dev Velocity** | AIDLC (Claude, Cursor) | Engineering | AI-assisted coding across 53 developers. [TRANSCRIPT] | Organization-wide adoption; "significant" acceleration reported |
| **Design Speed** | Vercel for PMs | Product | PMs prototype directly, reducing UX dependency. [TRANSCRIPT] | UX team deliberately reduced |
| **QA Efficiency** | AI for QA | QA team | "Functionalize on QA side" — automating test generation/execution. [TRANSCRIPT] | Early stage but directionally positive |

**Value Framework Assessment:**
- Strongest near-term value: Doc QC (quantified pain point at named customer) and Site Feasibility (quantified workflow burden)
- Strongest strategic value: Risk-Based Reporting (builds on unique data asset, hard to replicate)
- Highest uncertainty: Site Selection (acknowledged as "part of the data sets they'll consider" — not a complete solution) [TRANSCRIPT]
- Internal AI value is real but difficult to quantify without before/after velocity metrics

**Sources:**
- [TRANSCRIPT]

---

## Slide 26: AI Value & Proof — 1–3 Examples + Replicability/Comparables

### Transcript Updates

**Example 1: Document Quality Control (Doc QC)**

| Dimension | Detail |
|-----------|--------|
| What it does | Automated pipeline: ingest documents (individual or batch) → branch into parallel quality checks (blank pages, page ordering, readability, corruption, title-content matching) → aggregate findings → produce summary report with actionable detail. [TRANSCRIPT] |
| Technical approach | Deterministic layer first (Tesseract OCR for blank pages, page counting, readability scoring) → LLM layer only for semantic checks (does the title match the content?). Human-in-the-loop for GxP compliance. [TRANSCRIPT] |
| Value evidence | Merck: 5,000 hours/month spent on manual document QC. Merck requesting site-level deployment to catch issues pre-submission, eliminating the review-return-resubmit cycle entirely. [TRANSCRIPT] |
| Pricing | Independent SKU. Consumption-based pricing under consideration given variable LLM costs per document. [TRANSCRIPT] |
| Replicability | Medium-High difficulty — requires the dual-sided platform (documents must flow through Apollo to be checked), deep understanding of clinical document types and regulatory requirements, and the sponsor relationship to drive adoption. A standalone AI doc-checking tool could exist but would lack the workflow integration. |
| Comparable | No direct comparable in clinical trial space. General document QC tools exist (e.g., Adobe Acrobat preflight) but none purpose-built for clinical regulatory documents with GxP compliance. |

**Example 2: Site Feasibility (AI-Assisted Questionnaire Completion)**

| Dimension | Detail |
|-----------|--------|
| What it does | Builds validated site profiles using AI. Knowledge library stores past questionnaire responses. When new questionnaire arrives (web form, PDF, uploaded), AI recognizes previously answered questions and auto-populates responses. Sites review and confirm. Sponsor-side green checkmark indicates validated profile. [TRANSCRIPT] |
| Technical approach | NLP-based question matching across different formats and phrasings. Knowledge library accumulates per-site validated data over time. Handles multiple input formats (web forms, PDFs, questionnaires). [TRANSCRIPT] |
| Value evidence | Sites receive 500–1,000 feasibility questionnaires per year. Each requires manual completion. Auto-completion could save hundreds of hours per site annually. [TRANSCRIPT] |
| Pricing | ~$500/study site add-on to core eBinders product. [TRANSCRIPT] |
| Replicability | High difficulty — requires the network of 65K+ sites to build meaningful knowledge libraries, plus the trust relationship for sites to share validated data with sponsors through the platform. |
| Comparable | Emerging competitors in site identification (e.g., Lokavant, Deep6 AI) but none with the site-side data asset Apollo has. Most competitors approach from sponsor-side data (claims, EMR) rather than site-side operational data. |

**Example 3: Risk-Based Reporting (In Development)**

| Dimension | Detail |
|-----------|--------|
| What it does | Workflow tool with task dependencies overlaid with AI analysis of structured data (milestone events, completion rates) and unstructured data (comments, notifications, emails). Produces risk heat maps, executive summaries, and detailed status reports. Aggregatable by study, site, therapeutic area. Vision includes recommended actions. Both site-facing and sponsor-facing versions planned. [TRANSCRIPT] |
| Technical approach | Combines structured workflow/milestone data from audit trails with unstructured text from platform communications. AI generates summaries and risk classifications. [TRANSCRIPT] |
| Value evidence | Built on 7.2M monthly workflows and 5.8M remote monitoring activities. Addresses chronic sponsor pain point of aggregating performance data across distributed site networks. [TRANSCRIPT] |
| Pricing | Independent SKU (pricing not yet determined). [TRANSCRIPT] |
| Replicability | Very High difficulty — requires both the operational data (audit trails across 65K sites) and the cross-sponsor view that only a neutral platform like Apollo can provide. Individual CTMS vendors have their own data but lack the cross-sponsor, site-originated perspective. |
| Comparable | IQVIA's study intelligence tools, Medidata's Rave Omics for trial analytics, Veeva's ClinOps analytics. All operate from different data assets (primarily sponsor-side or CRO-side data, not site-originated operational data). |

**Sources:**
- [TRANSCRIPT]

---

# Chapter F — Buyer ↔ Target Synergies

---

## Slide 27: Buyer ↔ Target Synergies — Executive Summary

### Public Findings + Transcript Updates

**HEADLINE:** The WCG ↔ Apollo synergy thesis is well-supported by the transcript. The existing partnership (since Nov 2023) has already produced working integrations. The transcript revealed multiple natural connection points that go beyond the original public-source analysis. [TRANSCRIPT]

**Synergy Rating:** 🟢 Strong — Multiple validated integration points with quantifiable value potential.

**Tier 1 Synergies (Validated on Call):**
1. **IRB → eConsent Integration:** Apollo's eConsent product already has completed IRB integrations. Consent forms flow from IRB to sites through Apollo. This is a direct product intersection with WCG's IRB business — the largest in the world. [TRANSCRIPT]
2. **Document Flow (eBinders ↔ ClinTech/ClinSphere):** Existing integration for IRB documents, training materials, and safety letters. Target: 250K+ annual document exchanges. [TRANSCRIPT]
3. **Doc QC for WCG Sponsor Network:** WCG's sponsor relationships could be the distribution channel for Apollo's Doc QC product. Merck (already a Apollo customer) is the proof point. [TRANSCRIPT]

**Tier 2 Synergies (Logical but Unvalidated):**
4. **Combined Data Asset:** WCG's protocol/IRB data + Apollo's site operational data = unique intelligence layer for study design, site selection, and risk prediction.
5. **Channel Expansion:** WCG's 3,500+ sponsor relationships could accelerate Apollo site deployment beyond current 500/week peaks.
6. **Site Selection + WCG's Total Enrollment:** Apollo's site performance data could enhance WCG's enrollment prediction and optimization capabilities.

**Tier 3 Synergies (Speculative):**
7. **Unified Site Enablement Platform:** Combined IRB, consent, regulatory document, training, and safety letter management in a single workflow.
8. **AI-Powered Protocol Optimization:** Apollo's site performance data informing WCG's protocol design intelligence.
9. **Recruitment intelligence from EMR "print to file" data:** Apollo acknowledged they don't use EMR data today but recognized the potential. [TRANSCRIPT]

**Sources:**
- https://www.wcgclinical.com/2023/11/13/partnership-between-apollo-healthcare-and-wcg-to-advance-site-enablement-in-clinical-research/
- [TRANSCRIPT]

---

## Slide 28: Synergy Connections Mapped to Assets + Value Generation

### Transcript Updates

| Apollo Asset | WCG Asset | Connection Type | Value Generated | Validation Level |
|---------------|-----------|-----------------|-----------------|-----------------|
| eConsent (completed IRB integrations) [TRANSCRIPT] | IRB Services (largest globally) | Product Integration | Streamlined consent workflow; reduced cycle time from IRB approval to site-level consent deployment | High — integration already built |
| eBinders / Document workflows | ClinTech / ClinSphere | Data Exchange | 250K+ document exchanges/year; automated regulatory document flow | High — integration active |
| Doc QC (AI) | Sponsor relationships (3,500+) | Channel | Distribute Doc QC to sponsors via WCG channel; Apollo proven with Merck [TRANSCRIPT] | Medium — product still in dev |
| Site performance data (65K sites) | Total Enrollment (patient recruitment) | Data Combination | Site-level enrollment prediction using historical performance data | Medium — data exists, product doesn't |
| Site Feasibility / Selection | Protocol design intelligence | Data Combination | Informed site selection based on combined protocol complexity + site capability data | Low — speculative |
| 50M+ documents (with consent-based access) | ClinSphere analytics | Data Combination | Cross-platform document intelligence for study oversight | Low — rights constraints |

**Sources:**
- [TRANSCRIPT]

---

## Slide 29: Asset-Level Synergy Detail (Selected Connections)

### Transcript Updates

**Connection 1: eConsent ↔ WCG IRB**
- Current state: Apollo has completed IRB integrations. Consent forms already flow from IRB through Apollo's platform. eConsent is growing 75% YoY and is only ~2 years old. [TRANSCRIPT]
- Synergy mechanism: WCG's IRB approves consent forms → forms automatically flow to Apollo eConsent → sites deploy to participants with full audit trail → completion data flows back for compliance tracking
- Value driver: Eliminates manual consent form distribution; creates closed-loop consent management; every WCG IRB approval could automatically trigger site-level consent deployment
- Integration complexity: Low — integration pathways already exist
- Revenue impact: Accelerates eConsent adoption across WCG's IRB customer base (~3,500+ sponsors)

**Connection 2: Doc QC ↔ WCG Sponsor Channel**
- Current state: Doc QC in active development under Andres (OCTO). Merck validated the pain point (5,000 hrs/month manual QC) and is requesting site-level deployment. [TRANSCRIPT]
- Synergy mechanism: WCG introduces Doc QC to its sponsor relationships → sponsors deploy across their Apollo-connected sites → documents checked before submission → eliminates review-rejection cycle
- Value driver: Quantified cost savings (Merck example); WCG channel accelerates market access; combined sales motion (WCG relationship + Apollo technology)
- Integration complexity: Medium — product not yet GA; pricing model TBD; consumption-based LLM costs need management
- Revenue impact: Premium AI SKU sold through combined channel; potential to reach sponsors not yet using Apollo

**Connection 3: Site Performance Data ↔ WCG Analytics**
- Current state: Apollo has rights to use audit trail / milestone data for business purposes. 7.2M monthly workflows, 5.8M monitoring activities, cross-site/cross-sponsor performance signals. [TRANSCRIPT]
- Synergy mechanism: Apollo's site-level performance data (enrollment speed, document completion, startup efficiency) combined with WCG's protocol-level data (complexity scores, amendment rates, IRB cycle times) = predictive model for study feasibility and risk
- Value driver: Unique data asset that no competitor can replicate — requires both site-originated operational data AND protocol/IRB intelligence
- Integration complexity: High — requires data normalization, privacy/consent framework, new product development
- Revenue impact: Long-term strategic value; foundation for AI-powered study design and planning products

**Sources:**
- [TRANSCRIPT]

---

## Slide 30: Synergy Pathways (3 Waves)

### Transcript Updates

**Wave 1: "Connect" (0–6 months post-close)**
- Deepen existing eBinders ↔ ClinTech/ClinSphere document integration (already live)
- Accelerate eConsent ↔ IRB integration deployment across WCG customer base
- Joint sales enablement: WCG teams selling Apollo products to existing sponsor relationships
- SSO and identity federation between WCG and Apollo platforms (Apollo already has SSO with sponsors via SiteLink [TRANSCRIPT])
- Quick win: Deploy Apollo to WCG-connected sites not yet on the platform

**Wave 2: "Amplify" (6–18 months post-close)**
- Launch Doc QC through WCG sponsor channel (product expected GA by this window)
- Combined data product: merge Apollo site performance data with WCG protocol/IRB data for study feasibility intelligence
- Site Selection product enriched with WCG protocol complexity data
- Risk-Based Reporting incorporating WCG's IRB cycle time and safety letter data
- Unified customer success: single account team managing sponsor relationships across WCG + Apollo products
- Middleware bus completion (Apollo working on this [TRANSCRIPT]) enables faster integration of additional WCG products

**Wave 3: "Transform" (18–36 months post-close)**
- AI-powered study design optimization using combined data assets
- Predictive enrollment models incorporating site performance + protocol complexity + historical IRB data
- EMR data utilization: Apollo's "print to file" EMR integration (~25% of customers) as foundation for clinical data intelligence [TRANSCRIPT]
- Unified site enablement platform: single workflow from protocol design → IRB → consent → regulatory documents → monitoring → closeout
- Potential M&A: Apollo actively seeking budgets/contracting tool [TRANSCRIPT] — WCG could facilitate or co-acquire

**Sources:**
- [TRANSCRIPT]

---

# Chapter G — Quantified Impact

---

## Slide 31: Priority Initiatives — Assumptions + Uplift Math Table

### Public Findings + Transcript Updates

> **Note:** This section uses available data points from the transcript to construct illustrative models. These are NOT projections — they are frameworks for discussion that require validation with actual financial data from the data room.

| Initiative | Assumptions | Illustrative Uplift | Confidence |
|-----------|------------|---------------------|------------|
| **eConsent acceleration via WCG IRB** | 75% YoY growth already [TRANSCRIPT]; WCG IRB serves 3,500+ sponsors; 10% conversion of WCG IRB users to Apollo eConsent within 18 months | If eConsent currently serves ~X sites at ~$Y/site, 10% WCG conversion could add meaningful ARR | Medium — growth rate validated, WCG channel unvalidated |
| **Doc QC launch via WCG channel** | 2026 target: $3M AI ARR total [TRANSCRIPT]; Doc QC is one of three AI SKUs; Merck validated pain point (5,000 hrs/month) [TRANSCRIPT]; consumption-based pricing | If 20 large sponsors adopt at $100K-$500K/year each = $2M-$10M ARR range | Low — product not yet GA, pricing TBD |
| **Site network expansion via WCG** | Current: 500 sites/week peak via sponsors [TRANSCRIPT]; WCG has 3,500+ sponsor relationships; 5% of non-Apollo WCG sponsors adopt in Year 1 | If each sponsor averages 50 sites/study × 3 studies/year = significant site additions at ~$1,500/site [TRANSCRIPT] | Medium — channel mechanism validated, conversion rate speculative |
| **Combined data product** | Apollo audit trail data (rights confirmed [TRANSCRIPT]) + WCG protocol data; new product development required; 18+ month timeline | Premium analytics SKU targeting top-50 pharma; $200K-$500K/year per customer | Low — concept stage only |

**Key Sensitivity Variables:**
1. Apollo's actual current ARR (not disclosed)
2. WCG channel conversion rate for Apollo products
3. Doc QC pricing and LLM cost structure
4. Integration timeline and execution risk
5. Veeva competitive response timing

**Sources:**
- [TRANSCRIPT]

---

## Slide 32: Sensitivity → Growth Curve Shifts (H/M/L vs Baseline)

### Framework

| Scenario | Key Assumption Changes | Growth Impact vs. Baseline |
|----------|----------------------|---------------------------|
| **High Case** | WCG channel converts 15%+ sponsors in Year 1; Doc QC achieves $5M+ ARR; eConsent maintains 75% growth; site network exceeds 100K by 2027; AI products achieve 25%+ adoption rates | Significant acceleration — combined entity growth rate meaningfully above Apollo standalone |
| **Medium Case (Base)** | WCG channel converts 5-10% sponsors; Doc QC achieves $1-3M ARR; eConsent growth moderates to 40-50%; site network reaches 80-90K; AI adoption 10-15% | Moderate acceleration — synergy value adds 10-20% growth above standalone trajectory |
| **Low Case** | Integration friction delays Wave 1 beyond 6 months; Doc QC launch delayed to 2027; Veeva accelerates competitive response; AI product adoption below 10%; key personnel departure during integration | Minimal acceleration — synergy capture delayed; standalone growth trajectory applies for 12-18 months |

**Critical Unknowns That Determine Scenario:**
1. Apollo's baseline growth rate (without WCG) — not yet available
2. Integration execution speed — depends on technical and organizational readiness
3. Veeva's competitive response to acquisition announcement
4. Key person retention through transition (especially Andres, Shankar, Sri, Kapil, Philip)
5. LLM cost trajectory — if costs decline rapidly, AI product margins improve and adoption barriers lower

**Sources:**
- Framework populated with [TRANSCRIPT] data points

---

# Appendix 1: Gap Tracker (Updated v3.0)

---

## CLOSED GAPS (Answered by Transcript)

| # | Original Gap | Resolution | Source |
|---|-------------|-----------|--------|
| G1 | Product portfolio details beyond eBinders | Six products detailed with architecture, pricing, and growth data | [TRANSCRIPT] |
| G2 | Team size and composition | 91 engineering, 18 product, 6 regulatory; named leaders with roles | [TRANSCRIPT] |
| G3 | AI technical architecture | AWS Bedrock, Tesseract OCR, HITL approach, deterministic-first philosophy | [TRANSCRIPT] |
| G4 | Data rights and access | Two-tier: audit trail data (business rights) vs. document content (consent required) | [TRANSCRIPT] |
| G5 | AI product pipeline specifics | Five AI capabilities detailed with stages, pricing approach, and customer evidence | [TRANSCRIPT] |
| G6 | WCG integration specifics | eConsent-IRB integration confirmed complete; document flow active; 250K+ exchanges/yr target | [TRANSCRIPT] |
| G7 | Named customer relationships | Merck, Pfizer, IQVIA confirmed as anchor deployments | [TRANSCRIPT] |
| G8 | Revenue per study site | ~$1,500 core EISF; ~$500 feasibility add-on | [TRANSCRIPT] |
| G9 | Data quality assessment | 50-60% very clean (sponsor), 15-20% good (site), ~25% lower quality | [TRANSCRIPT] |
| G10 | Engineering tools and process | Full stack documented: Angular/Node/MongoDB/AWS + Claude/Cursor/Vercel for AIDLC | [TRANSCRIPT] |
| G11 | Contractor vs. employee mix | 85-90% employees, 10-15% contractors; deliberately expanding contractor capacity | [TRANSCRIPT] |
| G12 | Innovation process | OCTO (Office of CTO) manages POC pipeline, hands off to product teams when ready | [TRANSCRIPT] |
| G18 | Application architecture diagram | **Partially closed (v3.0):** No visual diagram provided, but detailed architecture described across compute (51 microservices on ECS Fargate), storage (MongoDB + PostgreSQL/Aurora RDS + Snowflake + S3), networking (VPC, API Gateway), security (double encryption, Wiz), DR (multi-AZ, cross-region replication), and CI/CD (4 environments, blue-green/canary). Visual diagram still desired. | [TRANSCRIPT] |
| G19 | Specific LLM models used in Bedrock | **Closed (v3.0):** Claude (Sonnet 3.5) and Google Gemini via AWS Bedrock. No OpenAI integration. | [TRANSCRIPT] |
| G28 | DR/BCP specifics for AI services | **Closed (v3.0):** Multi-AZ (3 AZs per region), 99.95% uptime target, cold standby apps / warm standby DBs, S3 cross-region replication, MongoDB active-active clusters, cross-account backup layer. Multi-region DR being implemented Q1. | [TRANSCRIPT] |

---

## OPEN GAPS (Still Needed)

| # | Gap | Priority | Expected Source | Notes |
|---|-----|----------|----------------|-------|
| G13 | Current total ARR and growth rate | Critical | Data Room (Sections G/H) | Required for all financial modeling |
| G14 | Revenue mix by product line | Critical | Data Room | Needed to assess product portfolio value |
| G15 | Revenue mix by customer type (site-direct vs. sponsor-deployed) | Critical | Data Room | Key to understanding unit economics |
| G16 | Net revenue retention rate | High | Data Room | Expansion vs. churn dynamics |
| G17 | Customer concentration (top 10 as % of revenue) | High | Data Room | Risk assessment |
| G20 | AI feature accuracy/validation metrics | Medium | Apollo team | Pilot results, time savings, error rates for feasibility and Doc QC. Doc Q moving to production Q2. [TRANSCRIPT] |
| G21 | LLM API cost structure per AI feature | Medium | Apollo team | Margin impact of consumption-based pricing; Bedrock token limits and cost allocation |
| G22 | Attrition rates (engineering) | Medium | Data Room / HR | Retention risk assessment |
| G23 | Data retention policy | Medium | Apollo team | Longitudinal data value |
| G24 | Conversion rate: free StudyOrganizer → paid eBinders | Medium | Apollo team | Site acquisition funnel efficiency |
| G25 | Veeva SiteVault competitive impact (quantified) | Medium | Apollo team / market data | Pricing pressure on site-side products |
| G26 | Professional services revenue as % of total | Low | Data Room | Revenue quality assessment |
| G27 | Budgets/contracting M&A pipeline details | Low | Apollo team | Potential additional acquisition layer |
| G29 | AI team dedicated headcount | Medium | Apollo team | Resource allocation for AI roadmap |
| G30 | RabbitMQ → Kafka migration timeline and completion criteria | Medium | Apollo team | Designed Q4, implementing Q1+; need completion targets [TRANSCRIPT] |
| G31 | eBinders monolith-to-microservices decomposition scope and timeline | Medium | Apollo team | In progress but scope/timeline unclear [TRANSCRIPT] |
| G32 | Doc Q AI precision validation at scale | Medium | Apollo team | Moving to production Q2; need accuracy benchmarks [TRANSCRIPT] |
| G33 | Angular version standardization plan and timeline | Low | Apollo team | Legacy v14 to v21; standardization effort underway [TRANSCRIPT] |
| G34 | Visual architecture diagram | Low | Apollo team | Detailed architecture described verbally; visual still desired for stakeholder presentation |

---

# Appendix 2: Confidence Assessment Summary

---

| Chapter | Pre-Transcript Confidence | Post-Call 1 Confidence | Post-Call 2 (v3.0) Confidence | Key Upgrades (v3.0) |
|---------|:------------------------:|:---------------------:|:----------------------------:|-------------|
| A — Growth Thesis | Medium | High | High | No change from v2.0 |
| B — Disruption Risk | Medium | Medium-High | Medium-High | No change from v2.0 |
| C — Asset Value | Medium | High | High | No change from v2.0 |
| D — Team + Operating Model | Low | High | Very High | Operating model maturity ratings upgraded with detailed DevOps, security, and DORA metrics evidence |
| E — AI Assessment | Low | High | Very High | LLM models confirmed (Claude Sonnet 3.5, Gemini); Doc Q production timeline (Q2); architecture fully documented |
| F — Synergies | Medium | High | High | No change from v2.0 |
| G — Quantified Impact | Low | Low-Medium | Low-Medium | No change — still missing actual ARR for calibration |
| **Architecture / Infrastructure** | Low | Medium | **Very High** | **New in v3.0:** 51 microservices on ECS Fargate, 3 AZs, security architecture (double encryption, VPC, Wiz), DR/BCP (99.95% uptime, cross-region replication), CI/CD (4 environments, blue-green/canary, Schematic), corporate IT fully documented |

---

# Appendix 3: Key Quotes & Signals (Paraphrased from Transcript)

> **Note:** These are paraphrased characterizations of statements made during the Technology DD Call, not direct quotes. Included for tone and strategic signal value.

**On Market Position:**
- Apollo leadership described themselves as having created the eISF category approximately 10 years ago, with a roughly 5x lead over the nearest competitor. [TRANSCRIPT]
- The 65K study site figure represents roughly one-fifth of all active trial sites in any given year, indicating significant runway for continued growth. [TRANSCRIPT]

**On AI Strategy:**
- The AI approach was described as pragmatic: deterministic processing first, LLM only when semantic understanding is required. Cost management is explicitly part of the AI product design. [TRANSCRIPT]
- The "3 on 3" target (3 AI workflows, $3M ARR) was positioned as a 2026 milestone, not a ceiling. Current AI-specific revenue is zero. [TRANSCRIPT]
- Human-in-the-loop was stated as a firm design principle for GxP compliance contexts. [TRANSCRIPT]

**On Data Rights:**
- Leadership clearly distinguished between audit trail/milestone data (which Apollo has business rights to use) and document content (which requires per-feature customer consent). [TRANSCRIPT]
- When asked about limits to what they could build from the audit trail data, the response was that they saw no limits from a data rights perspective. [TRANSCRIPT]

**On WCG Synergies:**
- The eConsent-IRB integration was described as already completed, not a future aspiration. [TRANSCRIPT]
- The EMR "print to file" data was acknowledged as an untapped asset — leadership confirmed the strategic thinking was correct but that nothing is being done with it yet. [TRANSCRIPT]

**On Team & Process:**
- The CTO was described as running the "Office of the CTO" — a small innovation team that builds POCs and hands them off to product engineering when ready. This creates a clean separation between exploration and execution. [TRANSCRIPT]
- The VP Engineering was credited with driving AI adoption across the engineering organization, including the "AIDLC" concept. [TRANSCRIPT]

**On Competition:**
- Veeva's free SiteVault was acknowledged as a competitive factor, but Apollo's positioning was that site-originated adoption (built over a decade) creates a fundamentally different relationship than sponsor-deployed tools. [TRANSCRIPT]
- Site Selection was described transparently — not as a complete solution for large pharma, but as an API that feeds into their existing scoring matrices. [TRANSCRIPT]

---

*End of Document — Version 3.0*
*Next update expected after: Data Room (Sections G/H) delivery*
