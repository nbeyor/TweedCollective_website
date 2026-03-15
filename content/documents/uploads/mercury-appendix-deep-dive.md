# Mercury: AI Diligence — Appendix: Follow-Up Deep Dive

**Prepared for:** WCG Clinical / Novo Holdings  
**Prepared by:** Tweed Collective  
**Date:** March 2026  
**Sources:** Public Sources + Diligence Call Materials + Data Room Materials  

---

## Follow-Up Questions — Deep Dive

> _The following five slides address targeted questions raised by the deal team following the initial diligence presentation._

---

## A-1: CTMS Synergy — Mercury as the Missing ClinSphere Module

**Question:** Would Mercury help the WCG CTMS offering?

### Thesis

ClinSphere is architected as an end-to-end clinical trial platform — spanning IRB review (eReview Manager), site feasibility and selection (Total Feasibility), site-level CTMS (eResearch Enterprise), and patient engagement. However, the platform has a conspicuous functional gap: **no native contract negotiation or AI-powered budget development capability**. WCG currently delivers contract and budget support as manual consulting services through its Site Enablement team. Mercury fills exactly this gap with an AI-powered automation layer.

### ClinSphere Module Map — Where Mercury Fits

| ClinSphere Module | Function | Status |
|---|---|---|
| eReview Manager | IRB submission, review, approval workflow | Live (2025 Innovation Award) |
| Total Feasibility | Site identification, feasibility assessment, enrollment modeling | Live |
| eResearch Enterprise CTMS | Study management, calendar builds, milestone tracking, invoicing | Live |
| Study Start-Up Services | Coverage analysis, budget development, contract review, CTMS builds | **Manual services — 5-day TAT** |
| **Contract & Budget AI (Mercury)** | **AI-powered contract markup, budget reconciliation, market insights** | **GAP — not in ClinSphere today** |

### Facts

- ClinSphere is positioned as a unified cloud platform connecting sites, sponsors, CROs, and participants with no data silos, but contract negotiation is absent from its feature set.
- WCG's eResearch Enterprise CTMS automates administrative, financial, and research activities including calendar builds, milestone entry, and invoice tracking — but these are post-contract financial management features, not pre-execution negotiation tools.
- WCG's Site Enablement Solutions currently deliver contract review, budget development, and coverage analysis as human-delivered consulting services with a five-day turnaround commitment.
- Over 70% of clinical trial sites report contract negotiations as a top cause of study start-up delays (per WCG's own published data).
- WCG claims sites can decrease budget and contract negotiation timelines by 40–60% following WCG's best practices — but these are manual best practices, not software automation.
- Per management, Mercury's contract and budget tools address the exact workflow that sits between IRB approval and study activation — the study startup bottleneck.

### Inferences

- Mercury would serve as the "missing module" in ClinSphere's study startup pipeline, converting what is currently a manual, services-delivered workflow into an AI-powered software capability embedded in the platform.
- Integration would create a closed-loop study startup experience: IRB approval (eReview) → site selection (Total Feasibility) → contract/budget negotiation (Mercury) → study activation (eResearch CTMS). This is the value proposition ClinSphere was designed for but cannot currently deliver end-to-end.
- Mercury's five-day-or-less AI turnaround on contract markup would substantially outperform the current five-day manual SLA, potentially compressing contract cycle times further and strengthening WCG's competitive positioning.
- For WCG's ~3,400 institutional partners, Mercury-as-module could be cross-sold as a platform upgrade rather than a separate product, simplifying the go-to-market motion.

### Gaps

- **Integration architecture:** No public documentation on ClinSphere's API/integration layer for embedding third-party modules. A technical integration assessment would be required to validate feasibility, timeline, and cost of embedding Mercury's AI capabilities into ClinSphere workflows.
- **Competitive response:** Unknown whether competing CTMS platforms (Medidata, Veeva SiteVault, Oracle Siebel CTMS) are developing native contract AI. This would affect the window of differentiation.

---

## A-2: Budget Product Deep Dive — Mercury's Expansion Beyond Contracts

**Question:** Deeper dive on the new budget product from Mercury.

### Thesis

Mercury is extending its proven contract AI capabilities — congruency scoring, playbook-driven markup, market insights — into budgets, coverage analysis, and protocol extraction. This phased roadmap through 2027 significantly expands Mercury's total addressable market by addressing adjacent study startup workflows with the **same buyer persona** (heads of research administration) and the **same underlying AI engine**.

### Product Roadmap: Budgets & Coverage Analysis

**Goal:** Remove friction from budget development and reconciliation.

**H1 2026 (In Staging — Releasing This Quarter)**

- **Protocol-Budget Reconciliation:** Automated mapping and gap analysis between the trial protocol and the proposed budget. Applies the same congruency engine that powers contract markup — comparing what the protocol requires against what the budget covers.
- **Variance Highlighting:** Identifies missing, mispriced, or misaligned line items in sponsor-proposed budgets. Flags items that deviate from institutional rate cards or market norms.

**H2 2026**

- **Internal Site Budget Builder:** Enables sites to build their own budgets informed by protocol requirements — a net-new capability that moves Mercury from review-only to authoring.
- **Rate Card Comparison:** Compares sponsor-proposed rates against institutional benchmarks. Leverages the same market insights data asset that powers contract recommendations.
- **Medicare Coverage Analysis:** Automated analysis for Medicare reimbursement vs. sponsor payment per NCD 310.1 — a compliance-critical workflow. This is particularly strategic given WCG's existing coverage analysis consulting business.

**2027**

- **Margin Calculation:** Automated margin analysis comparing the sponsor budget against internal costs to identify profitability by line item, visit, and overall study. This is the first feature that gives sites a direct financial optimization tool.
- **Amendment Handling:** Budget impact analysis with variance tracking when protocols are amended mid-study. Amendments are a known pain point — Tufts CSDD estimates sponsors spend $7–8B annually implementing protocol amendments.

### Contracts Roadmap (Maturity Reference)

The more mature contracts product provides a reference for where the budget product is heading:

**H1 2026:** Skills for Single Agreement Chat (enhanced AI for plain-language questions grounded in the CTA)  
**H2 2026:** Amendment Workflow (version tracking, approval routing); Multi-Round Negotiation (end-to-end orchestration with task routing); Profile & Template Management  
**2027:** Self-Learning Site Playbooks (AI adapts to institutional preferences from historical decisions); Advanced Analytics & Insights (patterns, cycle times, trends)

### Facts

- Per management, the budget product features are in staging and releasing this quarter. Everything shown in the contract product demo is in production.
- The same congruency and AI markup capabilities that power contract review are being applied to budget documents — comparing sponsor budgets to rate cards, extracting protocol data, and identifying variances.
- Management has branded the broader expansion as "CT Admin Vows" — a collection of common clinical trial administration tasks that extends Mercury's footprint beyond contracts.
- Per the CPO, the vast majority of contract buyers (heads of research administration) are the same individuals who own budget processes, coverage analysis, and protocol extraction. The contract team sits side-by-side with the budget team at most sites.
- The CPO reported "astounding" interest from contract customers in budget and protocol features at a billing compliance conference — where WCG was also present.

### Inferences

- The budget product at maturity could roughly double Mercury's addressable surface area per site customer, as each clinical trial involves both a contract and a budget negotiation — and often coverage analysis as well.
- The same-buyer-persona advantage means Mercury can expand wallet share without new customer acquisition costs. This is a land-and-expand motion from contracts → budgets → coverage analysis → protocol extraction.
- The Medicare Coverage Analysis feature (H2 2026) is a natural integration point with WCG's existing coverage analysis consulting business. Mercury's automation could both improve WCG's internal delivery and create a software product for sites that don't use WCG's services.
- The 2027 Margin Calculation feature is strategically significant — it shifts Mercury from a compliance/efficiency tool to a financial optimization tool, which commands different (higher) willingness to pay.

### Gaps

- **Pricing model:** Unknown whether budget features will be bundled with the contract subscription or sold as a separate SKU. This affects revenue modeling.
- **Competitive landscape:** Unknown what budget-specific tools exist in the clinical trial market (e.g., Greenphire, Medidata Rave) and how they compare to Mercury's approach.
- **Data readiness:** Mercury's market insights are built on contract data. The budget product will need its own data corpus — it's unclear how quickly this can be bootstrapped vs. the contract product's ~4,000 issue point foundation.

---

## A-3: Internal WCG Transformation — Mercury Tech as a Services Automation Engine

**Question:** How could Mercury's technology help transform WCG's internal legal, budget, and related operations?

### Thesis

Beyond its external product, Mercury's technology represents a potential **internal transformation engine** for WCG's own manual contract, budget, and protocol abstraction operations. WCG operates a dedicated services team that performs these tasks manually on behalf of its ~3,400 institutional partners. Automating this workflow with Mercury's AI would reduce cost-to-serve, improve turnaround times, and reposition WCG's services as AI-augmented rather than labor-intensive.

### The Current State: WCG's Manual Operations

WCG's Site Enablement Solutions division delivers four core services to clinical research sites, all currently performed manually:

| Service | Current Delivery | Published SLA |
|---|---|---|
| Contract Review & Redline Negotiation | Manual — expert negotiators review and redline CTAs | 5-day turnaround |
| Budget Development & Negotiation | Manual — analysts build and negotiate site budgets | 5-day turnaround |
| Coverage Analysis | Manual — compliance experts map Medicare vs. sponsor billing | 5-day turnaround |
| CTMS Calendar/Study Build | Manual — specialists configure study parameters in CTMS | 5-day turnaround |

Per management, WCG has "an entire business dedicated to negotiating contracts and budgets and abstracting protocols — all manual." The CEO characterized this business as one that "will be disrupted massively" and noted WCG needs "significant investment in automation and change management."

### Three Transformation Lanes

**Lane 1: Contract & Budget Negotiation Automation**

Mercury's congruency engine automates the core work WCG's Site Enablement team performs manually today. For contract review, Mercury already delivers AI-powered markup, playbook-driven recommendations, and market insights enrichment. The same capabilities extending to budgets (per the H1 2026 roadmap) map directly to WCG's manual budget development service. Potential impact: compress 5-day turnaround to hours; redeploy human experts to complex/exception cases and relationship management.

**Lane 2: Protocol Abstraction & Coverage Analysis**

Mercury's emerging protocol extraction features (abstracting clinical trial protocols, comparing protocol requirements to budgets and contracts) could support WCG's 360 Protocol Assessment service and coverage analysis workflows. The Medicare Coverage Analysis feature (H2 2026 roadmap) is a direct automation of WCG's compliance consulting work. Potential impact: automate routine coverage determinations; flag edge cases for human review.

**Lane 3: Market Intelligence & Benchmarking**

Mercury's contract/budget benchmarking data — dramatically expanded by WCG's network volume — becomes the data backbone for WCG's consulting recommendations. WCG already performs state-of-the-market benchmarking in other areas; Mercury extends this to contract and budget intelligence with AI-powered delivery. Potential impact: transform WCG's market insights from periodic reports to real-time, data-driven recommendations embedded in every negotiation.

### Facts

- Per management, WCG currently only uses Microsoft Copilot internally. The CEO viewed this as insufficient and noted it "doesn't work like that."
- WCG serves 3,400+ research institutions and 140,000+ principal investigators globally. The volume of manual contract/budget operations supporting this network is substantial.
- WCG promises 40–60% faster budget and contract negotiation timelines following its best practices — but these are human-delivered best practices, not software-enabled automation.
- WCG has 1,321 total employees (per PitchBook). The proportion dedicated to Site Enablement services delivery is unknown but represents a meaningful cost center.

### Inferences

- The internal transformation story is potentially as compelling as the external product synergy. Mercury doesn't just add a product to WCG's portfolio — it automates WCG's own operations.
- The transformation could follow a phased approach: Phase 1 (0–6 months) = Mercury as a copilot for WCG's human negotiators; Phase 2 (6–18 months) = Mercury handles routine negotiations autonomously with human oversight; Phase 3 (18+ months) = human experts focus on strategic relationship management and exception cases.
- The change management challenge is real. Per the CEO, WCG's team needs to be brought along on AI adoption, and the organization needs a more sophisticated approach than generic Copilot deployment.

### Gaps

- **WCG Site Enablement headcount and cost:** The size of WCG's manual contract/budget/protocol operations team is unknown. This is not a separately reported revenue line — it's embedded in broader Site Enablement services. Quantifying the cost-to-serve reduction requires data room access to WCG's internal cost structure.
- **Revenue impact modeling:** Unknown whether automating these services would reduce WCG's services revenue (if the services are priced on effort) or increase margins (if priced on value/outcome). The deal team should clarify how these services are billed.

---

## A-4: Build vs. Buy — Cost to Replicate Mercury's Team

**Question:** How long would it take to hire the Mercury team, and what would it cost?

### Thesis

Replicating Mercury's specialized team — which sits at the intersection of clinical trial domain expertise, contract AI, and LLM engineering — would cost an estimated **$2.6M–$4.0M in Year 1** (fully loaded compensation + recruiting fees) and take **12–18+ months** of recruiting in a highly constrained talent market. The build option also forfeits the existing data asset, customer relationships, and 2.5+ years of team cohesion that cannot be replicated through hiring alone.

### Current Mercury Team Composition

Per management, the team has experienced zero attrition and no new hires in 2.5+ years. The CPO is the most recent hire.

### Leadership Tier — Irreplaceable Domain Founders

These individuals represent acqui-hire value beyond their functional roles. Their domain expertise, industry relationships, and founding vision are not replicable through standard recruiting.

| Role | Profile | Est. Fully-Loaded Comp | Replacement Timeline | Recruiting Fee (20%) |
|---|---|---|---|---|
| **CEO** | Serial contract-AI entrepreneur; DocuSign + Seal Software background; deep sponsor/site relationships; MAGI conference thought leader | $400K–$550K | **Not replaceable via recruiting** — this is founder/domain-expert value | $80K–$110K |
| **CTO** | MIT-trained; manages all engineering; owns architecture + AI pipeline; key-person risk (flagged) | $300K–$450K | 6–12 months (clinical trial + AI + infrastructure is an extremely narrow intersection) | $60K–$90K |
| **CPO** | Ex-Blackstone Innovations; owns product vision, buyer relationships, go-to-market for sites | $250K–$375K | 6–9 months | $50K–$75K |

### Engineering & Operations Tier

| Role | Profile | Est. Fully-Loaded Comp | Replacement Timeline | Recruiting Fee (20%) |
|---|---|---|---|---|
| Principal Engineer #1 | Very senior; infrastructure-focused; remote | $250K–$325K | 4–8 months | $50K–$65K |
| Principal Engineer #2 | Very senior; platform architecture; remote | $250K–$325K | 4–8 months | $50K–$65K |
| Engineer #3 | Mid-senior; full-stack | $175K–$250K | 3–6 months | $35K–$50K |
| Engineer #4 | Mid-senior; full-stack | $175K–$250K | 3–6 months | $35K–$50K |
| Product Team (~2 roles) | Product management, analyst | $150K–$225K each | 3–6 months | $30K–$45K each |
| Support Team (~1–2 roles) | Customer success, implementation | $100K–$150K each | 2–4 months | $20K–$30K each |
| Analytics Team (~1 role) | Data analysis, market insights | $150K–$200K | 3–6 months | $30K–$40K |

### Cost Framework Summary

| Component | Low Estimate | High Estimate |
|---|---|---|
| Annual fully-loaded compensation (all ~10–11 roles) | $2.2M | $3.3M |
| Recruiting fees (20% of Year 1 comp) | $440K | $660K |
| **Total Year-1 build cost** | **~$2.6M** | **~$4.0M** |
| Time to assemble full team | 12 months | 18+ months |
| Opportunity cost: lost product development | 12–18 months of roadmap execution | |

### Compensation Benchmarks (Sources)

- Senior ML/AI engineers command $200K+ base salary, with total compensation reaching $300K–$500K at well-funded companies (per Levels.fyi, Glassdoor, industry surveys).
- Principal AI Engineers in remote roles average $207K base, with the 75th percentile at $257K and the 90th percentile at $435K (per Glassdoor, Oct 2025).
- AI engineer salaries increased 18.7% year-over-year in 2025, and niche roles continue to see salary pressure as scarcity keeps competition high.
- Health tech / clinical trials domain commands a further premium due to regulatory complexity and the narrow talent pool.
- The clinical trial × contract AI × LLM engineering intersection is exceptionally niche. Per the deal team's own estimate, recruiting near-equivalent talent would take 12+ months — if it's possible at all.

### What the Build Option Does NOT Get You

- **The data asset:** ~4,000 analyzed issue points (seed corpus) + ~2,000x growth in contract data flowing through the platform. This took years to accumulate with institutional data-sharing agreements.
- **100% data rights:** Every Mercury customer has signed market insights data-sharing provisions. Rebuilding this from scratch with new customer relationships would take years.
- **Customer relationships:** 22+ sites including Mayo, Cleveland Clinic, Duke, Mount Sinai, City of Hope, Boston Children's. These are referenceable logos that validate the product.
- **Team cohesion:** Zero attrition in 2.5+ years. The team has shipped a working product together — you cannot recruit team chemistry.
- **Florence Healthcare pipeline:** Mercury generates roughly half its pipeline through the Florence Healthcare partnership. This channel relationship does not transfer with individual hires.

---

## A-5: WCG Data Flywheel — From 4,000 Issue Points to Industry Benchmark

**Question:** How will WCG's data assets create more differentiation for Mercury when combined — e.g., the ~4,000 contracts that support the base product could be dramatically expanded?

### Thesis

Mercury's ~4,000 analyzed contract issue points are the **seed corpus** for an AI-driven benchmarking engine. WCG's network of 3,400+ institutions, 140,000+ PIs, and 3,000+ new protocols reviewed annually would dramatically expand this data asset — potentially by an order of magnitude within 12–18 months. At critical mass, this creates a **self-reinforcing data flywheel** that becomes the industry standard for clinical trial contract and budget benchmarking, and a moat that competitors cannot replicate without equivalent network scale.

### Current Data Asset: Mercury Standalone

| Metric | Value | Source |
|---|---|---|
| Analyzed issue points (seed corpus) | ~4,000 | Mayo, Duke, University Health Network contributions |
| Data growth since seed | ~2,000x more contract data flowing through platform | Per management |
| Customer data rights | 100% — every customer has signed market insights provisions; no opt-outs | Per management |
| Active sites | 22+ (as of diligence call) | Per management |
| Site trajectory | Targeting 50+ sites this year standalone; 100+ within 12–18 months with WCG | Per management |

### WCG Volume Multiplier

| WCG Metric | Value | Source |
|---|---|---|
| Institutional partners | 3,400+ research institutions, AMCs, health systems, hospitals, independent sites | WCG public |
| Principal investigators | 140,000+ globally | WCG public |
| New protocols reviewed annually | 3,000+ | WCG public (Tracxn / S-1) |
| Ethical reviews performed (cumulative) | 58,000+ | WCG S-1 filing |
| Sponsors and CROs served (cumulative) | 5,000+ | WCG public |
| Contract/budget negotiation events (estimated) | ~2,000–5,000 per year | **Assumption** — based on WCG's "hundreds of contracts annually" through Site Network alone, plus broader Site Enablement volume across 3,400 institutions |

### The Flywheel Mechanics

**Stage 1: Data Ingestion (0–6 months post-close)**  
WCG routes its contract and budget negotiation volume through Mercury's platform. Even capturing a fraction of WCG's estimated 2,000–5,000 annual negotiation events would multiply Mercury's data asset by 5–10x within the first year.

**Stage 2: Market Insights Enrichment (6–12 months)**  
With materially more data, Mercury's market insights become statistically robust across more agreement types, sponsor-site pairings, therapeutic areas, and geographic regions. The congruency engine produces higher-confidence recommendations. New benchmarking products become viable (e.g., "what are the market-standard payment terms for Phase III oncology trials at AMCs?").

**Stage 3: Industry Benchmark Status (12–24 months)**  
At sufficient scale, Mercury's data asset becomes the de facto industry reference for clinical trial contract and budget terms. WCG already publishes state-of-the-market benchmarking in other areas — Mercury extends this to contract/budget intelligence as a data product. Competitors without equivalent network coverage cannot replicate the depth or breadth of insights.

**Stage 4: Network Lock-In (24+ months)**  
Sites that rely on Mercury's benchmarking data for their negotiations are unlikely to switch — the value of the insights compounds with each additional data point in the network. Sponsors begin to engage because their contracts with Mercury-equipped sites close faster. This is the classic two-sided network effect applied to contract negotiation.

### Data Before & After WCG

| Dimension | Mercury Standalone (Today) | Mercury + WCG (Projected 18 months) |
|---|---|---|
| Contract data points | ~4,000 issue points + 2,000x growth | Projected 50,000–100,000+ issue points |
| Agreement types covered | Primarily CTAs | CTAs + budgets + informed consent + amendments |
| Site coverage | 22 sites (mostly AMCs) | 100+ sites with WCG cross-sell; access to 3,400+ institutions |
| Sponsor/CRO visibility | Major sponsors seen through site contracts | Comprehensive sponsor landscape via WCG's 5,000+ cumulative relationships |
| Benchmarking credibility | Emerging — strong early data from tier-1 AMCs | Industry standard — statistical robustness across therapeutic areas, geographies, site types |

### Facts

- Mercury's market insights originated from data contributed by three institutions (Mayo, Duke, University Health Network). The data asset has grown substantially since but remains concentrated in large AMC data.
- Every Mercury customer has signed data-sharing provisions for market insights. Per management, this is effectively non-optional — "we tell them it's not" optional, and 100% have signed.
- Contract data flowing through Mercury is walled off from LLM training data. Customer names are not used in the data set. This ensures compliance and trust.
- Per management, the CEO sees the opportunity to become the industry standard for benchmarking on contracts and budgets as "massive, massive, massive."
- WCG already performs state-of-the-market benchmarking in other clinical trial domains. Mercury would extend this capability to contract and budget intelligence.

### Inferences

- At scale, the market insights data asset could become **as or more valuable than the software platform itself**. This is the transition from a SaaS tool to a data-network business with compounding returns.
- WCG's existing benchmarking brand and industry relationships provide the credibility and distribution channel needed to position Mercury's data as the authoritative source.
- The data flywheel also strengthens Mercury's AI product: more data → better congruency scores → better customer outcomes → more adoption → more data. This is a defensibility argument, not just a revenue argument.
- Competitors would need to assemble equivalent network coverage to replicate the insights — a multi-year, capital-intensive effort that requires the same trust and data-sharing agreements Mercury has already secured.

### Gaps

- **WCG internal data routing:** It is unknown whether WCG's manual contract/budget operations currently generate structured data that could be ingested by Mercury's platform, or whether the data lives in unstructured formats (email, Word documents, PDFs) that would require extraction and normalization.
- **Data quality and consistency:** WCG's contract/budget work spans 3,400+ institutions with varying processes. The quality and consistency of this data for market insights purposes is unverified.
- **Timeline to critical mass:** The "industry benchmark" aspiration requires a specific volume threshold that has not been defined. What number of analyzed agreements constitutes statistical robustness for benchmarking across therapeutic areas and agreement types?

---

*End of Appendix — Follow-Up Deep Dive*
