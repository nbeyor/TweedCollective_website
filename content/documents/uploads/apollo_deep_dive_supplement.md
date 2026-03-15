# Apollo: AI Diligence — Follow-Up Deep Dive Supplement

**Prepared for:** WCG Clinical  
**Prepared by:** Tweed Collective  
**Date:** March 2026  
**Classification:** Confidential  
**Status:** Supplement to v2.0 — Addresses follow-up questions from diligence review

---

---

# Follow-Up Questions — Deep Dive

---

---

## Slide DD-1: Veeva — Long-Term Platform Consolidation Threat

### Thesis

The existing diligence document treats Veeva SiteVault as a near-term competitive threat through its free eISF. This slide addresses a broader strategic question: as Veeva expands its clinical platform into a full-stack offering, could sponsors consolidate spend onto Veeva and displace Apollo's US market share over a 3–5 year horizon?

### Veeva's Current Product Suite (as of March 2026)

Veeva now offers 30+ distinct software and data products for life sciences. The clinical operations suite alone covers:

| Product | Function | Free for Sites? |
|---------|----------|----------------|
| **SiteVault eISF** | Electronic investigator site file (direct eBinders competitor) | Yes — unlimited users and studies |
| **SiteVault eConsent** | Electronic informed consent | Yes — up to 20 active studies |
| **SiteVault CTMS** | Site-level trial management (launched Aug 2025) | Yes — up to 20 active studies |
| **eSource** | Direct data capture at sites, EHR/EDC integration (announced Jan 2026) | Early adopter — H2 2026 |
| **Vault eTMF** | Sponsor-side trial master file | Paid — sponsor license |
| **Vault CTMS** | Sponsor-side clinical trial management | Paid — sponsor license |
| **Vault EDC** | Electronic data capture | Paid — sponsor license |
| **Study Startup** | Site feasibility, qualification, activation | Paid — sponsor license |
| **Payments** | Site payment tracking and budget management | Paid — sponsor license |
| **Study Training** | GCP and study-specific training management | Paid — sponsor license |
| **Site Connect** | Sponsor↔site document exchange | Paid — add-on |
| **OpenData Clinical** | Curated site and investigator reference data | Paid — add-on |

**Key facts:**
- **FACT:** Veeva's FY2026 total revenues were $3.2B (up 16% YoY), with subscription revenue of $2.7B (up 17% YoY). R&D Solutions subscription revenue ($1.4B) now exceeds Commercial Solutions subscription revenue ($1.3B) — a milestone demonstrating successful diversification beyond CRM. [SOURCE: Veeva FY2026 earnings, SEC filing March 2026]
- **FACT:** As of early 2026, 20,000+ active sites use Veeva products; 450+ sponsors connect with 10,000+ study sites via Veeva; 100% of the top 20 pharma companies monitor within SiteVault. [SOURCE: IntuitionLabs / Veeva public statements]
- **FACT:** Veeva now serves 1,552 customers total, including 1,196 in R&D and Quality Solutions. 13 of the top 20 biopharma companies have standardized globally on Veeva Link Key People. [SOURCE: Veeva FY2026 earnings]
- **FACT:** Veeva AI Agents became available December 2025 for commercial applications, with rollout across Safety/Quality (April 2026), Clinical Operations/Regulatory/Medical (August 2026), and Clinical Data (December 2026). AI Agents are powered by LLMs from Anthropic and Amazon, hosted on Amazon Bedrock. Veeva is offering AI for Vault CRM at no cost through 2030 to accelerate adoption. [SOURCE: Veeva press release, October 2025]
- **FACT:** Merck signed a 10-year strategic partnership taking a "Veeva-first" approach for new software and data investments. Roche, Novo Nordisk International Operations, and GSK have committed to global Vault CRM deployments. [SOURCE: IntuitionLabs analysis, January 2026]

### The Consolidation Incentive

**Why sponsors would consolidate onto Veeva:**

1. **Unified data model.** Sponsors running Vault eTMF + CTMS + EDC + Study Startup on the same platform get a single source of truth across clinical operations. Adding free SiteVault for sites extends this visibility to the site level without a separate vendor relationship. Apollo sits outside this data model and requires custom integrations to participate.

2. **Vendor management simplification.** Enterprise pharma typically run procurement reviews annually. Each additional vendor creates contracting, compliance (SOC 2 review, vendor qualification), and integration overhead. A sponsor already standardized on Veeva's clinical suite faces a natural question: why maintain a separate Apollo contract when SiteVault offers comparable site-level functionality included in the ecosystem?

3. **AI as an accelerant.** Veeva AI Agents will roll out across all clinical operations applications by December 2026. Because these agents operate on data already within the Vault platform, sponsors using both Veeva sponsor-side and SiteVault site-side tools will get cross-system AI insights that Apollo cannot replicate without access to the sponsor-side data.

4. **Site-level lock-in via free tooling.** Veeva's strategy of offering free eISF, eConsent, and CTMS for sites (covering 90%+ of research sites by study volume) creates a base of sites already on the Veeva platform. When those sites are activated for a new sponsor study, the sponsor-side integration is zero-friction.

**Why sponsors might *not* consolidate:**

1. **Site preference matters.** Unlike most clinical trial technology (which is imposed top-down by sponsors), site-facing tools depend on site adoption. Apollo has built genuine site-level brand affinity ("site-made, sponsor-trusted") over a decade. Sites that prefer Apollo may resist being moved onto SiteVault, particularly if they perceive it as sponsor-centric.

2. **SiteLink has no direct Veeva equivalent (yet).** Apollo's SiteLink product provides bidirectional sponsor↔site document exchange and remote monitoring in a way that connects to multiple sponsor eTMF systems, not just one vendor. For sites running studies across many sponsors, Apollo's vendor-neutral positioning has value.

3. **Switching cost of the document trail.** Sites with years of regulatory document history in Apollo's eBinders face meaningful migration effort and compliance risk in moving those records. This is a real near-term barrier, though it diminishes for new studies.

4. **WCG integration.** If WCG acquires Apollo, the combined entity's channel access (WCG touches 94% of FDA-approved therapeutics) creates a distribution advantage Veeva cannot easily replicate.

### INFERENCES

- **INFERENCE:** The 3–5 year consolidation threat is real and accelerating. Veeva's product cadence (free CTMS in Aug 2025, eSource announced Jan 2026, AI Agents rolling out through Dec 2026) suggests that by 2028, Veeva will offer a complete site-to-sponsor clinical operations stack — the exact space Apollo occupies. *Inference because: each new free SiteVault product reduces one more reason for a site to use a separate vendor.*

- **INFERENCE:** The consolidation threat is strongest for Apollo's US sponsor-deployed business (where the sponsor selects the site tool) and weakest for Apollo's direct-to-site relationships (where the site chooses its own platform). *Inference because: sponsors making platform standardization decisions will weight ecosystem integration heavily, while sites making independent decisions will weight usability and preference.*

- **INFERENCE:** Veeva's 20,000+ site footprint already exceeds Apollo's 65K claim in terms of growth velocity. Apollo's number includes all sites ever connected (including inactive); Veeva's 8,000+ SiteVault sites (as of 2025) grew from near-zero in 2020, representing a much steeper adoption curve. *Inference because: the base numbers are not directly comparable without knowing active vs. total, but the trajectory favors Veeva.*

### GAPS / QUESTIONS

- What % of Apollo's revenue is US vs. international, and how does Veeva's site-level penetration vary by geography?
- How many Apollo sites are also on SiteVault (dual-use)?
- Have any Apollo sponsor accounts already standardized on Veeva's clinical suite and raised the question of consolidating site tools?
- What is Apollo's contractual structure — multi-year vs. annual — and when do the largest sponsor contracts come up for renewal?

**Sources:**
- Veeva Systems FY2026 earnings (SEC filing, March 2026)
- Veeva AI Agents press release (October 2025)
- IntuitionLabs — Veeva Systems 2021–2026 analysis (January 2026)
- IntuitionLabs — Veeva SiteVault guide (October 2025)
- Veeva Clinical Platform product page (veeva.com)

---

## Slide DD-2: eICF & eConsent — Competitive Landscape

### Market Context

The eConsent market in healthcare was estimated at approximately $430M in 2023, growing at roughly 11% CAGR. Broader estimates for eConsent in clinical trials specifically put the market at $300M in 2022 with 15% CAGR through 2030, potentially reaching $1.7B by 2028. Adoption has reached critical mass among large pharma: 100% of top 10 and 88% of top 25 pharma companies have implemented eConsent initiatives.

Apollo's eConsent product is approximately 2 years old (per Shankar Jagannathan on the diligence call: "This product is only about two plus years old") and is "seeing much more traction in the last year or so." Ryan Jones noted the "important intersection with the WCG IRB business" given that consent forms flow from the IRB. The product functions as a form builder with e-signature, routing, and audit trail — described by Shankar as "like a DocuSign" for clinical consent.

### Competitive Matrix

| Competitor | Product | Go-to-Market | Pricing Model | Integration Depth | Key Differentiator |
|------------|---------|-------------|---------------|-------------------|-------------------|
| **Apollo (eConsent)** | Form builder + e-signature + audit trail | Site-facing (bundled with eBinders) | Paid — upsell from eBinders | Deep — integrated with eBinders/eISF, SiteLink, IRB workflows (WCG) | Site-first design; part of broader site enablement ecosystem |
| **Veeva eConsent** | Part of SiteVault suite | Site-facing (free) + sponsor pull-through | Free for up to 20 active studies | Deep — native integration with SiteVault eISF, CTMS, and sponsor-side Vault | Free pricing; part of full Vault clinical platform |
| **Signant Health (TrialConsent / SmartSignals eConsent)** | Interactive eConsent with multimedia, knowledge checks, multilingual | Sponsor-deployed | Paid — per-study or enterprise license | Standalone or integrated with Signant eCOA/IRT; collaboration with IQVIA for unified workspaces | Market leader in rich media eConsent; global multilingual support; tiered license model for sponsors |
| **Medable (Total Consent)** | Part of decentralized trial platform | Sponsor-deployed (DCT-focused) | Paid — platform license | Integrated with Medable DCT platform (ePRO, eVisit, eConsent); Google Cloud partnership | DCT-native; designed for remote/hybrid trials; strong in patient engagement |
| **YPrime** | eConsent module within IRT/eCOA platform | Sponsor-deployed | Paid — per-study | Integrated with YPrime IRT and eCOA modules | Unified patient experience across consent + outcomes + randomization |
| **Medidata (Dassault Systèmes)** | Rave eConsent within Rave Clinical Cloud | Sponsor-deployed | Paid — enterprise/platform | Deep — native Rave EDC, CTMS, eCOA integration | Part of the largest EDC platform; strong in complex global trials |
| **ICON** | eConsent as part of CRO service offering | CRO-delivered | Bundled with CRO services | Integrated with ICON's operational platforms | CRO scale; expertise in trial execution rather than technology licensing |
| **Castor** | eConsent within clinical trial management platform | Direct-to-researcher / small-mid sponsors | Freemium / per-study | Integrated with Castor EDC | Academic/mid-market positioning; ease of use for smaller sponsors |
| **Advarra** | eConsent tied to IRB/regulatory services | IRB-adjacent | Bundled with Advarra IRB services | Integrated with Advarra IRB platform | Regulatory/IRB expertise; eConsent as extension of compliance workflow |

### Competitive Positioning Assessment

**Where Apollo is well-positioned:**
- Apollo's eConsent is tightly integrated with eBinders and SiteLink, meaning sites already using Apollo for regulatory documents get eConsent as a natural extension of the same platform. This reduces the friction of adding yet another vendor to the site's technology stack.
- The WCG IRB integration is a genuine differentiator — consent forms originate from IRB approvals, and having a direct data flow from WCG's IRB to Apollo's eConsent shortens the consent cycle. No other eConsent vendor has this specific integration with WCG.
- The site-first go-to-market means sites choose to use it (rather than having it imposed by a sponsor), which creates stickier adoption.

**Where Apollo is vulnerable:**
- Product maturity gap. Signant Health, Medidata, and Medable have invested years in rich media eConsent (video, interactive elements, knowledge checks, multilingual support). Apollo's product — described as "like a DocuSign" on the diligence call — appears to be a simpler form-based approach. This may not compete effectively for complex global trials requiring multimedia consent.
- Scale of sponsor relationships. Signant and Medidata eConsent solutions are deployed by the world's largest sponsors as enterprise standards. Apollo's eConsent is a newer product riding on its existing site network, not yet established as a sponsor-preferred choice.
- Veeva's free eConsent. For sites already on SiteVault (20,000+ and growing), Veeva eConsent is available at no additional cost for up to 20 studies. This creates a strong gravitational pull, especially for cost-sensitive sites.

### INFERENCES

- **INFERENCE:** Apollo's eConsent is not a standalone competitive product — it is a retention and expansion play within the existing site ecosystem. Its value proposition is "you already use eBinders, add eConsent without switching platforms." This is a defensible position for existing customers but unlikely to win new logos on eConsent alone. *Inference because: the product is described as a DocuSign-like form builder, not a feature-rich multimedia consent platform.*

- **INFERENCE:** The eConsent market is consolidating around two models: (1) sponsor-deployed enterprise platforms (Signant, Medidata, Medable) and (2) site-native free/bundled solutions (Veeva, Apollo). Apollo competes in category 2, where its main rival is Veeva's free tier. *Inference because: the market structure maps to the broader clinical trial technology split between sponsor-centric and site-centric tools.*

### GAPS / QUESTIONS

- What is Apollo eConsent's current adoption? (number of sites, studies, consent events processed)
- Does Apollo eConsent support multimedia content (video, interactive elements, knowledge checks), or is it limited to form-based consent?
- How does Apollo's eConsent pricing compare to Veeva's free tier and Signant's enterprise pricing?
- Are any of Apollo's existing sponsor customers using a different eConsent vendor alongside Apollo eBinders?

**Sources:**
- Grand View Research — eConsent in Healthcare Market Report (2023 data)
- Market research reports on eConsent competitive landscape
- Apollo diligence call transcript — Shankar Jagannathan and Ryan Jones on eConsent product
- Veeva SiteVault product page and IntuitionLabs guide
- Signant Health, YPrime, Medable, Medidata product pages

---

## Slide DD-3: Data Rights — Content vs. Metadata

### Framing

Apollo processes millions of documents monthly across 65,000+ connected sites. A critical distinction for acquisition valuation: the data *in* those documents vs. the data *about* those documents carry very different rights profiles and commercial potential.

### Two-Column Data Rights Framework

| Dimension | Content Data (Documents) | Metadata (Platform Engagement) |
|-----------|------------------------|-------------------------------|
| **What it includes** | Informed consent forms, regulatory submissions, investigator CVs, lab certifications, sponsor protocols, safety letters, training records, site contracts | Document view timestamps, signature completion times, workflow cycle durations, page-level engagement (time spent per section), upload/download patterns, query response times, version history, user login frequency |
| **Who owns it** | The originating party — sponsors own protocols and safety letters; sites own investigator records and certifications; IRBs own approval documents; participants own consent forms | Apollo generates this data through platform operation — it is a byproduct of the software, not a customer deliverable |
| **Can Apollo use it commercially?** | **No** — Apollo is a custodian, not an owner. These are regulated clinical trial documents subject to HIPAA, GDPR, ICH GCP, and 21 CFR Part 11. Apollo cannot repurpose, aggregate, or sell document contents without explicit authorization from each data owner. | **Likely with conditions** — Platform-generated operational metadata (de-identified, aggregated) is typically covered under SaaS terms of service. However, the specific terms of Apollo's customer agreements would determine the scope of permitted use. |
| **Commercially valuable?** | Not directly monetizable, but essential to retain — document custody is what keeps sites on the platform | **Highly valuable** — aggregated metadata across 65K sites creates unique benchmarking intelligence: how long does consent take at Site X vs. the network average? Which sites respond to queries fastest? Where are the bottlenecks in study startup? |
| **Path to AI training use** | Requires explicit consent from each data owner (sponsors, sites, IRBs) — practically difficult and legally complex | More feasible — operational metadata can be de-identified and aggregated to train AI models for workflow optimization, risk prediction, and site performance scoring without exposing PHI or regulated content |

### Key Observations

**The metadata is the real asset, but it may not be fully secured.**

Apollo's platform generates rich operational metadata every time a user interacts with a document — when it was viewed, how long the review took, when signatures were collected, how many rounds of back-and-forth occurred before approval. Aggregated across 65K+ sites and 7.2M monthly workflows, this metadata becomes a unique dataset for clinical trial operational intelligence.

However, there is a meaningful question about whether Apollo has the contractual right to use this metadata at scale:

1. **What's likely already permitted:** Basic product analytics, anonymized aggregate benchmarking, and platform improvement. Most enterprise SaaS agreements include provisions for the vendor to use anonymized, aggregated usage data for product improvement and benchmarking.

2. **What likely requires explicit consent:** Using site-level or sponsor-level metadata to build commercial data products (e.g., selling site performance benchmarks to sponsors), training AI models on customer-specific workflow patterns, or sharing operational metrics with WCG post-acquisition for cross-platform intelligence.

3. **What almost certainly requires going back to customers:** Any use of metadata that could identify specific sites, sponsors, or studies — even indirectly. For example, if aggregated data reveals that "the top-performing oncology sites in the Southeast US complete consent in X days," and there are only a handful of such sites, the data becomes re-identifiable.

### Implications for WCG Acquisition

- **The highest-value synergy (combined WCG protocol data × Apollo site operational data) depends on metadata rights being secured.** If Apollo's existing contracts do not permit data sharing with a parent company or use of metadata for cross-platform analytics, WCG would need to go back to customers for consent — creating a timeline risk and potential churn event.

- **Recommendation:** Data room request should include Apollo's standard customer agreement (site-facing and sponsor-facing), specifically the data use, privacy, and aggregation clauses. This is a prerequisite for valuing the data synergy.

### INFERENCES

- **INFERENCE:** Apollo has likely not yet fully commercialized its metadata asset. The diligence call discussion of data architecture focused on reporting and ETL pipelines (Snowflake + dbt + Fivetran), not on a productized data intelligence offering. The Kafka upgrade in progress is about real-time reporting, not about building a data product. *Inference because: the current architecture is oriented toward operational reporting, not analytics-as-a-product.*

- **INFERENCE:** Securing metadata rights retroactively is achievable but non-trivial. Most SaaS companies doing this successfully embed data use provisions in contract renewals rather than requesting standalone consent. Given Apollo's annual or multi-year contract cycle, a systematic approach could secure rights across the majority of the customer base within 12–18 months. *Inference because: this is a common pattern in SaaS M&A — the acquirer builds the data rights into the renewal cycle rather than disrupting existing relationships.*

### GAPS / QUESTIONS

- Does Apollo's standard customer agreement currently permit aggregated, de-identified metadata use for benchmarking or commercial data products?
- Are there material differences in data rights between site-facing and sponsor-facing contracts?
- Has Apollo received any customer pushback or legal challenges related to data use?
- What is the contract renewal cadence — annual, multi-year, or evergreen?

**Sources:**
- Apollo diligence call transcript — data architecture discussion (Shankar Jagannathan, Andres Garcia)
- General SaaS data rights frameworks (HIPAA, GDPR, 21 CFR Part 11 compliance context)
- Existing diligence document — Data Asset Strength (Slide 15) and Synergy sections (Slides 27–29)

---

## Slide DD-4: Data Architecture Gap Assessment & Modernization Cost

### Thesis

Apollo's current technology infrastructure is built to manage *documents* — store them, route them, collect signatures, maintain audit trails. What it has not yet built is a *data architecture* that tracks the operational metrics (cycle times, completion rates, engagement patterns, risk signals) needed to support AI-driven efficiency products and premium analytics offerings. The hypothesis is that this gap is a solvable investment, not a fundamental limitation — but it needs to be sized and sequenced.

### Current State (from Diligence Call)

**FACTS [TRANSCRIPT]:**
- Production databases: MongoDB + PostgreSQL
- Data lake: Snowflake
- ETL: Fivetran (ingestion) + dbt (transformation)
- Reporting: In-app reports, custom data feeds for customers, internal data warehousing
- Reporting latency: 15-minute intervals, constrained by Snowflake compute costs
- In-progress upgrade: Migration to Kafka for real-time data streaming (4–5 month project timeline, as stated by Shankar)
- Neo4j: POC/testing only, not deployed in production
- Tamer: Referenced but limited detail provided
- Three use cases for data: (1) in-app product reporting, (2) custom data feeds for specific customers, (3) internal data warehousing

**What this architecture does well:**
- Reliable document storage and retrieval with regulatory-grade audit trails
- Batch reporting for customers who need operational snapshots
- Basic ETL pipeline from production databases into Snowflake for analysis

**What this architecture does *not* do:**
- Track granular user behavior events (page-level engagement, session duration, click paths)
- Maintain a dimensional data model designed around operational KPIs (study startup time, consent cycle time, query resolution speed, site activation velocity)
- Support real-time analytics or streaming dashboards
- Provide a feature store or ML pipeline for AI model training
- Offer a self-service analytics layer for customers or internal product teams

### Gap Assessment & Investment Tiers

**Tier 1: Real-Time Streaming Foundation**
*Status: In progress (Kafka migration)*

| Dimension | Detail |
|-----------|--------|
| What it fixes | Eliminates 15-minute reporting lag; reduces Snowflake compute costs for near-real-time use cases |
| What it enables | Real-time notifications, live dashboards, event-driven workflows |
| Estimated cost | ~$500K–$1M (engineering time + infrastructure) |
| Timeline | 4–5 months (per Shankar's estimate on diligence call) |
| Key assumption | Kafka implementation is scoped for existing data flows only — does not include new event instrumentation |

**Tier 2: Operational Metrics Data Model + Analytics Layer**
*Status: Does not exist*

| Dimension | Detail |
|-----------|--------|
| What it fixes | Creates a structured data model around the KPIs that matter for operational efficiency — not just "what documents exist" but "how fast, how well, and where are the bottlenecks" |
| What it includes | Event instrumentation across all products (tracking user interactions at the action level, not just the document level); dimensional model in Snowflake or a dedicated analytics warehouse; KPI definitions and governance; self-service BI layer (e.g., Looker, Tableau, or embedded analytics) |
| What it enables | Site performance benchmarking; study startup time analysis; consent completion rate tracking; sponsor-facing operational dashboards; the raw material for AI features |
| Estimated cost | ~$1.5–$2.5M (2–3 senior data engineers + analytics engineer + product manager for 6–9 months, plus tooling) |
| Timeline | 6–9 months from project kickoff to initial KPI coverage; 12 months for comprehensive instrumentation |
| Key assumptions | Assumes 2–3 dedicated data engineers (hire or redeploy), a product manager to define KPIs, and analytics tooling licensing. Does not assume new headcount for ongoing maintenance — that would be absorbed into existing data team. |

**Tier 3: AI-Ready Data Platform**
*Status: Does not exist*

| Dimension | Detail |
|-----------|--------|
| What it fixes | Creates the infrastructure to train, deploy, and serve ML models on Apollo's operational data |
| What it includes | Feature store (curated, versioned datasets for ML training); ML pipeline orchestration (e.g., SageMaker, Vertex AI, or open-source equivalent); data quality monitoring and drift detection; model serving infrastructure; data governance framework for AI training data (links to data rights — Slide DD-3) |
| What it enables | AI-powered site risk scoring, predictive study startup timelines, automated anomaly detection in site performance, recommendation engines for site selection |
| Estimated cost | ~$2–$4M (platform engineering + ML infrastructure + ongoing compute costs in year 1) |
| Timeline | 12–18 months (dependent on Tier 2 being substantially complete) |
| Key assumptions | Assumes Tier 2 is in place (you need the operational data model before you can train models on it). Compute costs will depend on model complexity and inference volume. Initial models can likely use third-party LLM APIs (as Apollo appears to be doing today), reducing the need for custom model training infrastructure in the near term. |

### Total Investment Summary

| Tier | Investment Range | Timeline | Dependency |
|------|-----------------|----------|------------|
| Tier 1: Real-Time Streaming | $500K–$1M | 4–5 months | In progress |
| Tier 2: Operational Metrics | $1.5–$2.5M | 6–9 months | Tier 1 helpful but not blocking |
| Tier 3: AI-Ready Platform | $2–$4M | 12–18 months | Requires Tier 2 |
| **Total (all tiers)** | **$4–$7.5M** | **18–24 months end-to-end** | Sequential with partial overlap |

### INFERENCES

- **INFERENCE:** The Tier 2 investment (operational metrics data model) is the most critical gap for both standalone value creation and WCG synergy realization. Without it, Apollo cannot offer the "operational intelligence" products that justify premium pricing, and WCG cannot combine protocol data with site operational data for predictive analytics. *Inference because: the diligence call revealed three data use cases (in-app reporting, custom feeds, internal warehousing) — none of which constitute a productized analytics offering.*

- **INFERENCE:** The current data team appears to be sized for operational support, not platform-building. The architecture discussion on the diligence call suggested a small team managing ETL pipelines and report generation, not a data platform team building self-service analytics or ML infrastructure. WCG should expect to invest in additional data engineering headcount (3–5 FTEs) to execute Tiers 2 and 3. *Inference because: the Kafka migration was described as a 4–5 month project, suggesting a small team working sequentially rather than parallel workstreams.*

- **INFERENCE:** These investment ranges are consistent with what comparable SaaS platforms spend on analytics modernization. A $4–7.5M total investment over 18–24 months is modest relative to Apollo's likely enterprise value and the revenue upside from productized data intelligence. *Inference because: comparable mid-market SaaS companies investing in analytics-as-a-product typically allocate 5–10% of ARR to data platform build-out over a 2-year period.*

### GAPS / QUESTIONS

- What is the current data engineering team size and composition?
- What is Apollo's current Snowflake spend, and how does the Kafka migration change the cost profile?
- Has Apollo scoped or budgeted a Tier 2–equivalent project internally?
- What event instrumentation currently exists — are user interactions logged at the action level, or only at the document level?

**Sources:**
- Apollo diligence call transcript — Shankar Jagannathan and Andres Garcia on data architecture
- Databricks — "Building a Modern Clinical Trial Data Intelligence Platform"
- SAS — "Architecting the Modern Clinical Trial Analytics Environment"
- General SaaS data platform cost benchmarks

---

*Supplement prepared using publicly available sources and diligence call materials. All FACTS are cited. All INFERENCES are labeled and justified. All unknowns are recorded as GAPS. Financial estimates in Slide DD-4 are order-of-magnitude ranges based on comparable SaaS platform investments, not detailed engineering estimates.*
