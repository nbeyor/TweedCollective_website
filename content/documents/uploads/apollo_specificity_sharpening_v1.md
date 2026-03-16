# Apollo AI Diligence — Specificity Sharpening Guide

**Purpose:** Systematic mapping of confirmed data points from both diligence call transcripts to specific slides in the Apollo deck. Each item identifies the slide, the current state (GAP or vague language), the confirmed fact with source attribution, and the recommended update.

**Sources:**
- `[T1]` = Transcript 1: Technology Due Diligence Discussion (~2 hrs)
- `[T2]` = Transcript 2: Technology Due Diligence Discussion Cont'd (infrastructure/IT deep-dive)

---

## 1. Financial & Commercial Metrics (Closes Critical GAPs)

### 1a. Net Revenue Retention & Logo Retention
- **Slide:** `growth-projections`, `channel-asset`, `relationship-asset`
- **Current state:** GAP — "What is Florence's current ARR and growth rate?"
- **Confirmed fact:** Net retention is 121%; logo retention is 92%. [T1 — Ryan Jones]
- **Additional context:** Ryan attributed stickiness to sites writing Apollo workflows into their SOPs, which are auditable items — making switching costly. [T1]
- **Action:** Replace retention GAP with confirmed metrics. Add SOP lock-in as a retention driver on the channel/relationship slides.

### 1b. Customer Count & Mix
- **Slide:** `growth-projections`, `channel-asset`
- **Current state:** "600+ sponsors" (from public sources)
- **Confirmed fact:** ~400 total customers: ~300 are site networks, ~100 are sponsors. 25% of customer count but majority of revenue comes from sponsor side. [T1 — Ryan Jones]
- **Action:** Update customer count and add the 75/25 site-to-sponsor customer split. Note the revenue skew toward sponsors.

### 1c. Market Penetration
- **Slide:** `growth-projections`, `scenarios`
- **Current state:** No penetration data
- **Confirmed fact:** Apollo is ~20% penetrated. 65K study sites out of ~300K study sites launched per year. [T1 — Ryan Jones]
- **Action:** Add penetration metric and TAM framing (300K annual study site launches) to growth projections.

### 1d. Site Activation Velocity
- **Slide:** `growth-projections`, `product-asset`
- **Current state:** No activation data
- **Confirmed fact:** In early days, turned on ~50 study sites by activating a single site customer every couple weeks. Now turning on 500 sites per week when coming from sponsor side, and this continues to accelerate. [T1 — Ryan Jones]
- **Action:** Add site activation velocity as a growth indicator and network effect proof point.

### 1e. AI Revenue Baseline
- **Slide:** `growth-projections`, `ai-inventory`
- **Current state:** GAP — "What is the revenue split including AI?"
- **Confirmed fact:** AI-specific revenue was $0 coming out of 2025. One AI feature launched late 2025 as a free feature. All new AI products are now priced as independent SKUs. [T1 — Shankar]
- **Action:** Replace GAP with confirmed $0 baseline + independent SKU pricing model. Critical for framing the "3 on 3" growth target.

### 1f. AI Revenue Target ("3 on 3")
- **Slide:** `growth-projections`, `ai-roadmap-fit`, `priority-initiatives`
- **Current state:** Not referenced
- **Confirmed fact:** 2026 goal is three new AI workflows targeting $3M AI ARR. The three workflows are: site feasibility/selection, Doc QC, and Trial Flow (POC stage). [T1 — Shankar]
- **Action:** Add as a confirmed management target on growth projections and AI roadmap slides.

### 1g. Core Product Pricing (eISF)
- **Slide:** `growth-projections`, `product-asset`
- **Current state:** GAP — "Average contract value by segment"
- **Confirmed fact:** Average revenue per study site is ~$1,500 for the core eISF product. [T1 — Ryan Jones]
- **Action:** Replace ACV GAP with confirmed $1,500/study-site anchor.

### 1h. AI Feature Pricing
- **Slide:** `ai-inventory`, `ai-value-framework`, `priority-initiatives`
- **Current state:** GAP — "Pricing structure for AI features"
- **Confirmed fact:** Feasibility product priced at ~$500/site (on top of $1,500 core eISF). Doc QC pricing TBD but Ryan described a "low seven figure" opportunity per large sponsor, representing 10-15% uplift on a ~$10M customer. [T1 — Ryan Jones]
- **Action:** Add confirmed pricing for feasibility; add Doc QC sizing logic for large sponsors.

### 1i. eConsent Growth Rate
- **Slide:** `product-asset`, `growth-projections`
- **Current state:** Not specifically called out
- **Confirmed fact:** eConsent grew ~75% last year; product is only ~2+ years old; described as "hyper growth stage." [T1 — Shankar]
- **Action:** Add eConsent growth rate as a secondary growth engine proof point.

### 1j. AWS Spend
- **Slide:** `architecture-readiness`
- **Current state:** GAP
- **Confirmed fact:** Yearly AWS spend is ~$1M. [T2 — Kapil]
- **Action:** Add as confirmed infrastructure cost data point. Notably efficient for a platform at this scale.

---

## 2. AI Value Proof Points (Sharpens AI Assessment & Value Slides)

### 2a. Doc QC — Merck Case Study
- **Slide:** `ai-value-proof`, `ai-value-framework`
- **Current state:** Generic "AI Value & Proof — 1–3 Examples"
- **Confirmed facts [T1 — Ryan Jones, Shankar]:**
  - Merck has a team of 20 people doing nothing but document QC
  - Merck spends 5,000 hours/month on human document QC
  - Apollo believes they can eliminate 50%+ of that
  - Ryan estimated this as a "low seven figure" opportunity per large sponsor
  - Against a ~$10M Merck relationship, that's 10-15% uplift
  - Doc QC came directly from Merck asking Apollo to solve the problem
  - First SOW being submitted "this or next week" with first bookings targeted by end of quarter
  - Apollo is deployed in every study Merck launches
- **Action:** This is the strongest AI proof point. Build out as a detailed case study card on the AI Value Proof slide.

### 2b. Feasibility Automation — Site-Side Value
- **Slide:** `ai-value-proof`, `ai-value-framework`
- **Current state:** Generic description
- **Confirmed facts [T1 — Ryan Jones]:**
  - A mid-size site network responds to ~100 feasibility surveys/month (~1,200/year)
  - Apollo can automate "almost all of that"
  - Value proposition is dual: (1) time savings on survey completion + (2) sites build a validated profile to market themselves more effectively to sponsors
  - Priced at ~$500/site add-on
- **Action:** Build as second case study card. The dual value prop (efficiency + marketing) strengthens the willingness-to-pay argument.

### 2c. Platform Learning Effect — 45% Faster
- **Slide:** `ai-value-proof`, `product-asset`, `data-asset`
- **Current state:** Not referenced
- **Confirmed fact:** Sites using Apollo for their second study add content 45% faster — about 50 days faster — than a site that hasn't used them before. [T1 — Ryan Jones]
- **Action:** Add as a network/learning effect proof point. This is powerful for defensibility arguments — demonstrates compounding value from repeated use.

### 2d. Deterministic-First AI Approach
- **Slide:** `architecture-readiness`, `ai-inventory`
- **Current state:** Generic "HITL approach"
- **Confirmed facts [T1 — Andres Garcia]:**
  - Apollo pursues deterministic approaches wherever possible before resorting to LLMs
  - Example: Doc QC uses Tesseract-style OCR for blank page detection, readability checks — no LLM needed
  - LLMs are used selectively (e.g., title-to-content matching requires an LLM)
  - More checks = more token consumption = pricing consideration
  - Described as a deliberate cost management strategy
- **Action:** Replace generic "HITL" with the more nuanced deterministic-first framing. This is a positive signal for margin management and AI cost discipline.

---

## 3. Data Asset Specificity (Sharpens Data Slides)

### 3a. Data Quality Distribution
- **Slide:** `data-asset`
- **Current state:** "65K+ connected sites generating operational workflow data" (generic)
- **Confirmed facts [T1 — Ryan Jones]:**
  - 40K sites are sponsor-provisioned → very clean data (sponsor creates study/site names and metadata)
  - Of remaining 25K site-originated: ~half is clean, ~half is messy (legacy sites created whatever folder structure they wanted)
  - Net: ~75% of data is "very good and clean"; ~25% is not
- **Action:** Replace generic "65K sites" with the quality distribution. The 75/25 split is important for AI readiness framing.

### 3b. Document Volume & Growth Rate
- **Slide:** `data-asset`
- **Current state:** "7.2M monthly workflows" (from public sources)
- **Confirmed facts [T1 — Ryan Jones]:**
  - Apollo adds 20,000 documents per day
  - 50 million documents total in the tool
  - Described as a "latent asset that keeps growing"
  - 85% of all code written is for creating, circulating, and version-controlling content
  - 1.6 billion total documents including backups (non-production) [T2 — Kapil]
- **Action:** Add document volume metrics. The 50M production documents and 20K/day ingest rate are much more concrete than "7.2M workflows."

### 3c. Data Rights — Two Categories
- **Slide:** `data-asset`, `dd-data-rights`
- **Current state:** GAP — "Florence's contractual rights to use aggregated customer data for AI"
- **Confirmed facts [T1 — Ryan Jones]:**
  - **Category 1 (audit trail / milestone data):** Apollo has the right to use for business purposes. Includes milestone-based events at sites (first patient in, consent completions, etc.). This is where most energy has been going for AI.
  - **Category 2 (document content):** Apollo has all the documents but does NOT have the rights to scrape them through LLM pipelines. Must get customer-by-customer consent. Not actively pursuing this yet.
  - However: for opt-in features like Doc QC, users are giving consent by enabling the feature — creating a consent-by-usage model
- **Action:** Partially close this GAP with the two-category framework. Category 1 is clear; Category 2 remains a constraint but the opt-in model provides a pathway.

### 3d. Proprietary vs. Third-Party Data
- **Slide:** `data-asset`, `offering-ai-growth-matrix`
- **Current state:** Not distinguished
- **Confirmed facts [T1 — Ryan Jones, Shankar]:**
  - Two proprietary data streams: (1) workflow operational data from tool usage, (2) feasibility survey responses submitted by sites into the database for sponsor promotion
  - Third-party data partnership with Sightline for site selection enrichment
  - Apollo is NOT strong on patient-level population data (Trinetics/similar are better there)
  - EMR data: ~25% of customers use print-to-file from EMR into eBinders, but Apollo doesn't do anything with this data yet
- **Action:** Add proprietary vs. third-party distinction. The honest acknowledgment of where they're NOT strong (patient data) actually adds credibility.

---

## 4. Team & Operating Model (Sharpens Team Slides)

### 4a. Engineering Team Composition
- **Slide:** `people-roles`, `functional-coverage`
- **Current state:** GAP — "Engineering team size and composition"
- **Confirmed facts [T1 — Shankar]:**
  - Product team: ~18 people (mostly PMs with small UX team; shrinking UX role as PMs use AI tools like Vercel)
  - Developers: 53 hands-on-keyboard
  - Data team: 7 people under Philip (manage data mastering through data stores)
  - DevOps: Centralized CoE, shared across all scrum teams
  - Employee mix: 85-90% full-time Florence employees; 10-15% contractors
  - Contractors: 3 firms — Nordic (Serbia), Spark (US), CTS Tech (India)
  - Geographic split: Most engineering/product in Serbia (Belgrade subsidiary); ~10 US-based (mostly data team + a few developers)
  - Serbian leadership has high tenure (7-8 years with company)
- **Action:** Close the headcount GAP with confirmed numbers. The 53-developer count, 85/15 FTE ratio, and Belgrade subsidiary structure are all confirmable facts.

### 4b. Key Personnel Detail
- **Slide:** `people-roles`
- **Current state:** Generic leadership list
- **Confirmed facts [T1 — Shankar]:**
  - Kapil: VP Engineering, ~1.5 years tenure, led significant engineering operations changes including AI adoption and data-side experience
  - Sri: VP Platform / sponsor-side products, worked with Shankar previously, deep enterprise customer experience
  - Jelena: Leads site products AND manages entire Serbian team; strong process/operations standardization role
  - Philip: Data team lead (US-based)
  - Nicola: DevOps operations lead
  - Rosco: Engineering team lead in Serbia
  - Mariana: QA and compliance lead
  - Andres (CTO): Leads "Octo Office" — bleeding-edge innovation/POC incubation function
  - Regulatory team: 6 people, work closely with QA team via Ketrix tool
- **Action:** Populate people slide with confirmed names, roles, and tenure notes.

### 4c. Scrum Team Organization
- **Slide:** `functional-coverage`, `operating-model-maturity`
- **Current state:** No detail
- **Confirmed facts [T1 — Shankar]:**
  - Teams organized by animal names (e.g., Bear = eBinders, Shark = SiteLink)
  - Each team has a PM, and in the platform case two PMs
  - Site product team is the biggest (provides services to other products)
  - Sponsors team is the biggest revenue generator
  - Platform team operates independently with a "not the bottleneck" principle
  - Innovation concentrated in the last two teams (Octo Office related)
  - When a POC is viable, a new scrum team is raised with standard governance
- **Action:** Add scrum organization detail to operating model slides.

### 4d. SDLC & Product Process
- **Slide:** `operating-model-maturity`
- **Current state:** Maturity score of 2–3 across dimensions
- **Confirmed facts [T1 — Shankar, Ryan; T2 — Kapil]:**
  - Requirements centralized in Aha (inputs from CS, support, CABs, internal stakeholders, ideas board)
  - CABs: twice per year — summer (sponsor-focused), fall (combined at customer show)
  - Biweekly stakeholder calls during release shaping
  - Three primary co-development partners: NHS (sites), Lily (SiteLink + feasibility), Merck (Doc QC AI)
  - Feature tracking via Pendo (usage analytics) and Jellyfish (velocity, DORA metrics, AI adoption)
  - Story pointing for sprint measurement
  - Fully CI/CD using GitHub Actions (migrating eBinders from Semaphore)
  - 4 environments: build → QA → UAT → prod; adding performance + pre-prod in Q2
  - API test coverage: ~90%; application automation coverage: ~70%
  - Release process: established products go beta → GA; new products go through LA with ~10 customers
  - Feature flags via Schematic for risk reduction and per-customer rollout
  - Blue-green and canary deployments for high-risk changes
- **Action:** Significant maturity upgrade warranted. Current 2-3 scores should move to 3-4 for most dimensions based on confirmed tooling and process depth.

---

## 5. Architecture & Infrastructure (Sharpens Technical Slides)

### 5a. Technology Stack (Confirmed)
- **Slide:** `architecture-readiness`
- **Current state:** Inferred from public sources
- **Confirmed facts [T1 — Shankar, Andres; T2 — Kapil]:**
  - **Frontend:** Angular (varying versions — v14 on legacy eBinders/eConsent, v21 on SiteLink 2)
  - **Backend:** Node.js across all products; some Python
  - **Databases:** MongoDB (eBinders, eConsent), PostgreSQL/RDS (newer products like SiteLink 2), S3 (document storage)
  - **Data warehouse:** Snowflake (US East) with Fivetran + dbt for ETL
  - **Data mastering:** Tamr (just starting implementation — site and study data)
  - **Orchestration:** Orcus (migrating to AWS Step Functions by end of Q1)
  - **Messaging:** RabbitMQ / Amazon MQ (migrating to Kafka as platform layer)
  - **Cloud:** 100% AWS, architecture-approved partner; 3 regions (US-Virginia, EU-Frankfurt, APAC-Sydney)
  - **AI:** AWS Bedrock with Claude Sonnet 3 (not OpenAI)
  - **Auth:** Auth0
  - **Monitoring:** New Relic (APM) + CloudWatch (logs) + CloudTrail (audit)
  - **BI:** Tableau (services/customer use) + Apex Charts + AG Grid (in-product)
  - **Development AI tools:** Claude Code (primary, standardizing across teams), GitHub Copilot, Cursor
  - **Compliance:** Ketrix (integrated with Jira for audit trail)
  - **Feature flags:** Schematic
  - **Incident response:** PagerDuty
  - **Infrastructure as code:** Terraform
  - **Containers:** ECS Fargate (51 microservices); no EC2 instances outside ECS
- **Action:** Replace inferred architecture with this comprehensive confirmed stack. The Bedrock + Claude Sonnet 3 confirmation is particularly important (closes the "what LLMs?" GAP).

### 5b. Data Architecture Modernization In-Flight
- **Slide:** `dd-data-architecture`, `architecture-readiness`
- **Current state:** GAP
- **Confirmed facts [T1 — Shankar; T2 — Kapil]:**
  - Current: Data to Snowflake refreshes every 15 minutes (batch); costly due to Snowflake compute
  - In-flight: Kafka implementation for real-time data streaming (4-5 months to complete)
  - Kafka will also replace RabbitMQ as the platform messaging layer
  - eBinders decomposition from monolithic to microservices is underway
  - Neo4j exists in dev/POC only (graph database experiments), not in production
  - Flow Records = master metadata store for sponsor-generated data
  - DR upgrade from AZ-level to multi-region cross-region replication targeted for Q1
- **Action:** Add modernization roadmap detail. The Kafka migration and eBinders decomposition are important architectural debt items that should be noted.

### 5c. Infrastructure Metrics
- **Slide:** `architecture-readiness`
- **Current state:** No metrics
- **Confirmed facts [T2 — Kapil]:**
  - 51 microservices on ECS Fargate
  - 99.95% uptime target per region
  - 80% of load on US East
  - Auto-scaling: e.g., eBinders runs 20 instances weekday/business hours, scales to 10 off-peak (automated)
  - 3 regions deployed with identical infrastructure (data residency driven)
  - Data consolidated in Snowflake US East for cross-region reporting
  - DORA metrics tracked via Jellyfish
- **Action:** Add infrastructure metrics to architecture readiness slide.

---

## 6. Competitive & Strategic Context (Sharpens Disruption & Defensibility Slides)

### 6a. Deployment Depth with Top Sponsors
- **Slide:** `relationship-asset`, `channel-asset`
- **Current state:** "Broad but depth unclear"
- **Confirmed facts [T1 — Ryan Jones]:**
  - Deployed in every study Merck launches
  - Deployed in every study Pfizer launches
  - Deployed in every FSO study IQVIA launches
  - Apollo is ~5x ahead of closest competitor in data gathered from site applications
  - Market survey results confirm #1 position in site technology adoption
- **Action:** Upgrade relationship asset rating from YELLOW to GREEN based on confirmed depth with top 3 pharma/CRO. The "every study" language is much stronger than generic "600+ sponsors."

### 6b. Competitive Positioning vs. Trinetics, Veeva
- **Slide:** `who-could-disrupt`, `dd-veeva-consolidation`
- **Current state:** Accurate but generic
- **Confirmed facts [T1 — Ryan Jones, Shankar]:**
  - Against TriNetX (patient population/RWD-based site selection): Apollo acknowledges they're not as strong on patient-specific population data; Apollo's strength is operational/workflow data exhaust + feasibility survey data
  - Site selection is "not a complete solution" — positioned as one input into sponsor's scoring matrix, with API-first design for integration
  - Apollo's TAM expansion strategy is multi-product penetration per site, not just new sites
  - TA mix mirrors NIH distribution (~50% oncology, 50% everything else) — "infrastructure" play, not TA-specific
- **Action:** Sharpen competitive slides with this honest self-positioning. The API-first / "part of the data set" framing for site selection is more credible than claiming to compete head-on with TriNetX.

### 6c. WCG Integration Specificity
- **Slide:** `synergy-matrix`, `synergy-detail`
- **Current state:** Generic synergy description
- **Confirmed fact:** Apollo has already completed several IRB integrations with WCG because that's where consent forms flow from — this is an active, in-production integration, not a future aspiration. [T1 — Shankar]
- **Action:** Upgrade the IRB→eBinders synergy from "future opportunity" to "partially in-production." This materially strengthens the synergy thesis.

### 6d. Customer Co-Development Partners
- **Slide:** `relationship-asset`, `ai-value-proof`
- **Current state:** Not referenced
- **Confirmed facts [T1 — Shankar]:**
  - NHS (UK): Co-developing Trial Flow (workflow automation); actively requesting Apollo replace legacy systems as main system of record
  - Lily: Helping build out SiteLink and feasibility capabilities
  - Merck: Doc QC AI co-development; first SOW imminent
- **Action:** Add co-development partnerships as a relationship strength and AI validation signal. Customer-initiated AI development (especially Merck asking Apollo to build Doc QC) is a strong product-market fit indicator.

---

## 7. Corporate IT & Security (New Detail for Architecture/Risk Slides)

### 7a. Corporate IT Stack
- **Slide:** `architecture-readiness` or new supporting detail
- **Confirmed facts [T2 — Zach]:**
  - Google Workspace (mail, docs, SSO)
  - Slack (collaboration, integrated with alerting)
  - Jira + Confluence (project management, documentation)
  - Jira Service Management (IT + security help desk)
  - Hexnode (MDM for device management)
  - Wiz (cloud security — covers AWS, GCP for Google SSO)
  - Mimecast (web security agent on all endpoints)
  - IT ticket volume: ~22/week (~100/month) for internal support
  - No on-premise infrastructure ("Internet cafe with our name on it")
  - Offices: Atlanta (HQ) + Belgrade; all others remote
  - Hardware: Transitioning to 3-year leasing refresh cycle; mix of Mac (Apple Business Manager for zero-touch) and Windows (IT provisions before shipping)
  - Network: Ubiquiti Wi-Fi + switches in offices; policies applied at endpoint level via MDM for remote workers
  - Software licensing: Major tools (Google, Slack, Atlassian) on 3-year contracts; new tools on 1-year trial
  - One Windows 10 device remaining (being upgraded); rest is Windows 11
- **Action:** Clean, modern, cloud-native corporate IT. Low risk. Can be noted briefly on architecture slide or reserved for supporting documentation.

---

## Summary: GAP Closure Scorecard

| GAP Category | Prior Status | Post-Sharpening Status |
|---|---|---|
| ARR / Revenue | OPEN | PARTIALLY CLOSED — have retention, pricing, penetration; still need total ARR |
| Revenue mix by product | OPEN | PARTIALLY CLOSED — have eISF pricing, eConsent growth, AI = $0; need full breakdown |
| Revenue mix by customer type | OPEN | CLOSED — 300 site customers, 100 sponsors; sponsor side drives revenue |
| Net revenue retention | OPEN | CLOSED — 121% net, 92% logo |
| Data rights for AI | OPEN | PARTIALLY CLOSED — two-category framework; Category 1 cleared, Category 2 constrained |
| AI feature adoption metrics | OPEN | PARTIALLY CLOSED — $0 baseline; first SOW imminent; no adoption rates yet |
| AI/ML architecture & vendors | OPEN | CLOSED — Bedrock + Claude Sonnet 3; deterministic-first approach |
| Engineering team size & composition | OPEN | CLOSED — 53 devs, 18 product, 7 data, 85/15 FTE ratio |
| Customer concentration | OPEN | PARTIALLY CLOSED — know Merck, Pfizer, IQVIA are deep; need top-10 revenue % |
| Pricing structure for AI | OPEN | PARTIALLY CLOSED — feasibility at $500; Doc QC "low seven figures" per large sponsor |
| Veeva competitive impact | OPEN | STILL OPEN — no direct data on SiteVault churn impact |
| WCG integration depth | OPEN | PARTIALLY CLOSED — IRB integrations in production; need full technical assessment |

---

*Document prepared for use in updating the Apollo AI Diligence slide content file. All facts sourced from diligence call transcripts with speaker attribution.*
