/**
 * MKG: AI Opportunity & Roadmap Assessment - Document Content (v4 — Edit Guide Applied)
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 *
 * Updated: March 13, 2026 per MKG_AI_Assessment_EDIT_GUIDE
 * 30 slides total
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'ai-opportunity-roadmap'

export const slides: SlideData[] = [
  // ================================================================
  // SLIDE 1: COVER
  // ================================================================
  {
    id: 'cover',
    title: 'Cover',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Strategic Assessment',
      headline: 'MKG: AI Opportunity &\nRoadmap Assessment',
      subtitle: 'Outside-In Strategic Evaluation',
      metrics: [
        { value: 'MKG Leadership', label: 'Prepared for' },
        { value: 'Tweed Collective', label: 'Prepared by' },
        { value: 'March 15, 2026', label: 'Last updated' },
      ],
      insightBox: {
        label: 'Confidential',
        text: 'This document is confidential and intended solely for MKG Leadership and Novo Holdings.',
      },
    },
  },

  // ================================================================
  // SLIDE 2: EXECUTIVE SUMMARY (Section 1)
  // ================================================================
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ExecutiveSummarySlide',
      props: {
        sectionLabel: 'Section 01',
        heading: 'Executive Summary',
        summaryText: 'Strategy (6) — No single AI product strategy owner.\nData Assets (7) — Engagement data is genuinely proprietary; claims data is not a moat.\nWorkflow Integration (6) — Route Reagent and Annotation Activation are embedded; most others standalone.\nExternal Differentiation (6) — Pantheon and Plexus defensible; Verba, MagpAI, PerspectivX carry displacement risk.\nGovernance (8) — Multi-layered governance impressive for ~$150M company.\nMeasurement (4) — No closed-loop ROI measurement or enterprise AI KPI dashboard.',
        radarChart: {
          labels: ['Strategy', 'Data Assets', 'Workflow Integration', 'External Differentiation', 'Governance', 'Measurement'],
          values: [6, 7, 6, 6, 8, 4],
          height: 250,
        },
        strengths: [
          'Proprietary HCP engagement data (advisory boards, speaker bureaus, MSL interactions) — genuinely hard to replicate; feeds the ION data lake',
          'Deep medical & compliance expertise embedded across teams; two decades of medical affairs experience',
          'Strong governance — multi-layered AI governance framework impressive for a company of MKG\'s size',
        ],
        risks: [
          'Portfolio sprawl across 15+ branded AI tools — too much surface area for ~$150M revenue',
          'Limited closed-loop ROI measurement — 81qd explicitly does not measure ROI on analytics engagements',
          'Displacement risk in client-facing tools as foundation models improve (Verba, MagpAI, PerspectivX)',
        ],
        immediateFocus: [
          'Rationalize the AI portfolio — consolidate adjacent products, starting with the four editorial pipeline tools',
          'Differentiate through data + medical expertise — not AI capability alone',
          'Instrument ROI with leading indicators — adoption, cycle time, quality scores, win rates',
          'Operationalize with product-led ownership — hire a Senior AI Product Manager',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 3: EVALUATION FRAMEWORK (NEW)
  // ================================================================
  {
    id: 'evaluation-framework',
    title: 'Evaluation Framework',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 01b',
      heading: 'How We Evaluated MKG\'s AI Portfolio',
      columns: 2,
      items: [
        { icon: 'target', title: '1. Business Value Lens', description: 'Understand MKG\'s revenue model, cost structure, and competitive positioning. Map internal (cost, speed, productivity) and external (pricing power, speed-to-close) value pools, and identify the economic sensitivities where AI creates the highest-leverage P&L impact.' },
        { icon: 'database', title: '2. Initiative Review', description: 'Inventory all 15+ active AI initiatives across KINETICS (internal) and DIFFUSION (external). Unpack each individually\u2009—\u2009what it does, who uses it, defensibility assessment, and value potential\u2009—\u2009including displacement risk from foundation model companies.' },
        { icon: 'calculator', title: '3. Value Driver Quantification', description: 'Characterize and quantify the specific value drivers per initiative, separating internal productivity (labor cost equivalent) from external revenue upside.' },
        { icon: 'rocket', title: '4. Prioritization & Roadmap', description: 'Focus the portfolio on practical value creation through consolidation, leading indicator measurement, and a phased execution plan.' },
      ],
    },
  },

  // ================================================================
  // SLIDE 4: BUSINESS CONTEXT & COMPETITIVE LANDSCAPE (Section 2)
  // ================================================================
  {
    id: 'business-context',
    title: 'Business Context & Competitive Landscape',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'BusinessDriversSlide',
      props: {
        sectionLabel: 'Section 02',
        heading: 'Business Context & Competitive Landscape',
        revenueMix: {
          chartType: 'HorizontalBarChart',
          title: 'Revenue Mix (~$150M)',
          icon: 'TrendingUp',
          items: [
            { label: 'Strategy & Content', value: 21 },
            { label: 'Promo / Full Service', value: 18 },
            { label: 'Advisory Initiatives', value: 14 },
            { label: 'Digital Solutions', value: 11 },
            { label: 'Event Execution', value: 10 },
            { label: 'Analytics (81qd)', value: 8 },
            { label: 'Market Research', value: 8 },
            { label: 'Market Access', value: 6 },
            { label: 'Other', value: 4 },
          ],
          suffix: '%',
          maxValue: 25,
          height: 280,
        },
        costStructure: {
          chartType: 'PieChart',
          title: 'Cost Structure',
          icon: 'DollarSign',
          segments: [
            { label: 'Labor', value: 65, color: '#6B8E6F' },
            { label: 'Overhead', value: 15, color: '#A89685' },
            { label: 'Technology', value: 10, color: '#D4AF37' },
            { label: 'Other', value: 10, color: '#22D3EE' },
          ],
          height: 250,
        },
        economicSensitivities: {
          title: 'Economic Sensitivities',
          headers: ['Area', 'AI Impact', 'EBITDA Sensitivity'],
          rows: [
            { area: 'Editorial Workflow', impact: 'Moderate', ebitda: 'High' },
            { area: 'Predictive Analytics (81qd)', impact: 'High', ebitda: 'High' },
            { area: 'Market Research', impact: 'High', ebitda: 'Moderate' },
            { area: 'Creative Automation', impact: 'Moderate', ebitda: 'Low' },
          ],
        },
        revenueMixSource: 'Sources: MKG management presentations (Nov 2025, Feb 2026); revenue percentages are approximate and based on disclosed segment reporting.',
        costStructureSource: 'Sources: MKG internal financials as provided to Novo Holdings; compensation benchmarks from Glassdoor, AMWA 2024 Compensation Report, and Salary.com, adjusted for MKG seniority mix and NYC metro location.',
        economicSensitivityRationale: 'Sensitivity scoring reflects two dimensions: (1) AI Impact Potential measures how directly AI tools can change the workflow — "High" means the workflow is primarily information processing that AI excels at; "Moderate" means AI augments human judgment but cannot replace it. (2) EBITDA Sensitivity measures the P&L weight of the area — "High" means the workflow represents a large share of labor cost or revenue; "Low" means the area is a smaller contributor. For example, Editorial Workflow scores Moderate/High because AI augments (not replaces) the medical writing process but the labor pool is large (~130 FTEs across writers, editors, and compliance reviewers). Predictive Analytics scores High/High because the workflow is well-suited to AI automation and the 81qd unit\'s shift to subscription revenue would materially improve margins.',
      },
    },
  },

  // ================================================================
  // SLIDE 5: AI INITIATIVE INVENTORY — KINETICS (Tiers 1–3)
  // ================================================================
  {
    id: 'kinetics',
    title: 'AI Initiatives — Internal (KINETICS)',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AssessmentTableSlide',
      props: {
        sectionLabel: 'Section 03 — Internal',
        heading: 'AI Initiative Inventory — KINETICS',
        subtitle: 'Internal tools organized by tier — editorial pipeline, insight & knowledge, and general productivity',
        callout: 'The four Tier 1 tools touch the same content creation and review pipeline. The Super Product Vision slide presents the case for unifying them into a single integrated platform.',
        valuePotentialFootnote: 'Value Potential reflects a qualitative assessment of each initiative\'s ability to create measurable business impact within 12 months, considering: (1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, (3) defensibility of the AI-enhanced output versus foundation model displacement. "High" = large addressable base, production-ready or near-ready, defensible through proprietary data or workflow integration. "Moderate" = meaningful but narrower impact, or earlier-stage maturity. "Low" = limited addressable base or high displacement risk.',
        sections: [
          {
            title: 'Tier 1: Editorial Pipeline (Core Value Drivers)',
            rows: [
              { name: 'DynAImic Content', description: 'AI-assisted draft generation across marketing channels from content briefs.', valueSource: 'Cost + Speed', valuePotential: 'High', rationale: 'Addresses ~80 medical writers ($120K avg comp). Content generation is the highest-volume step in the editorial pipeline and directly compresses cycle time from brief to first draft.' },
              { name: 'Annotation Activation', description: 'Auto-links claims to supporting literature for MLR preparation.', valueSource: 'Speed + Productivity', valuePotential: 'High', rationale: 'Automates the most tedious step in MLR preparation. Directly reduces rounds of revision and time-to-submission for ~30 editorial/QA staff.' },
              { name: 'Compliance Core', description: 'Flags FDA compliance risks — off-label language, fair balance, guideline adherence.', valueSource: 'Cost + Speed', valuePotential: 'High', rationale: 'Pre-screening for regulatory flags prevents costly late-stage MLR rejections. Addresses ~20 compliance reviewers and reduces the rework multiplier across the full pipeline.' },
              { name: 'Route Reagent', description: 'Validates content against brand style rules and routing comments during editorial review.', valueSource: 'Speed + Productivity', valuePotential: 'High', rationale: 'Closest to production among the pipeline tools. Already embedded in real editorial workflows. Catches style and brand errors before human review, reducing per-project QA hours.' },
            ],
          },
          {
            title: 'Tier 2: Insight & Knowledge Tools',
            rows: [
              { name: 'Practice Master', description: 'Harmonizes data sources to map HCP affiliations and resolve conflicting records.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate', rationale: 'Useful but addresses a narrower analyst pool (~25 FTEs). Underlying NPI/affiliation data is commercially available; value is in the harmonization layer, not the data itself.' },
              { name: 'Sentiment Tracker', description: 'NLP-based tracking of HCP belief and sentiment shifts from MKG engagement data.', valueSource: 'Pricing Power', valuePotential: 'Moderate', rationale: 'High strategic value when applied to proprietary engagement data, but indirect revenue mechanism (share-of-wallet lift) is harder to measure in Year 1.' },
              { name: 'Undermind', description: 'Deep scientific literature search and research surrogate.', valueSource: 'Productivity', valuePotential: 'Moderate', rationale: 'Literature search is useful but increasingly commoditized by general AI tools. Value depends on integration with MKG\'s proprietary datasets.' },
              { name: 'Brand Bonds', description: 'Brand-trained AI assistant that synthesizes cross-functional team knowledge.', valueSource: 'Productivity', valuePotential: 'Moderate', rationale: 'Internal knowledge tool with productivity value but limited external revenue impact. Adoption depends on data quality of the underlying brand knowledge bases.' },
              { name: 'Conversation Centrifuge', description: 'Structures and summarizes expert interviews and advisory board discussions.', valueSource: 'Speed', valuePotential: 'Moderate', rationale: 'Overlaps with Verba\'s advisory board synthesis. Value is real but may be consolidated into the Verba product over time.' },
            ],
          },
          {
            title: 'Tier 3: General Productivity & Workflow Tools',
            rows: [
              { name: 'ION Portal', description: 'Central AI infrastructure and data access layer.', valueSource: 'Productivity', valuePotential: 'Moderate', rationale: 'Infrastructure layer, not a value driver itself. Enables other tools but has no standalone business impact unless it becomes the gateway to proprietary data.' },
              { name: 'ChatMKG / Secure LLM', description: 'Enterprise AI interface with SSO, transcription, web search.', valueSource: 'Productivity', valuePotential: 'Moderate', rationale: 'Every feature is available in off-the-shelf enterprise AI. Defensibility requires connection to ION Data Lake and brand knowledge bases — without that, there is no reason to use it over consumer tools.' },
              { name: 'Case Catalyst', description: 'Searches and retrieves relevant past case studies.', valueSource: 'Productivity', valuePotential: 'Low–Moderate', rationale: 'Narrow use case (past case studies). Value depends on quality and coverage of the knowledge base.' },
              { name: 'Meeting Nucleus', description: 'Meeting transcription and summarization.', valueSource: 'Productivity', valuePotential: 'Low', rationale: 'Transcription and summarization is fully commoditized. Zoom, Granola, and other tools do this natively.' },
              { name: 'Strategic Brief', description: 'AI-assisted strategic brief generation.', valueSource: 'Productivity', valuePotential: 'Low', rationale: 'Helpful but limited addressable impact. Unlikely to be measurable at the P&L level.' },
              { name: 'Strategic Synthesis', description: 'Cross-document strategic synthesis and analysis.', valueSource: 'Productivity', valuePotential: 'Low', rationale: 'Same as Strategic Brief — incremental productivity on a narrow workflow.' },
            ],
          },
        ],
        cards: [
          { name: 'DynAImic Content', description: 'AI-assisted draft generation across channels', icon: 'Rocket', highlight: true },
          { name: 'Annotation Activation', description: 'Auto-citation and reference linking for MLR', icon: 'Layers', highlight: true },
          { name: 'Compliance Core', description: 'Regulatory flag detection + MLR readiness', icon: 'AlertCircle', highlight: true },
          { name: 'Route Reagent', description: 'Brand/style validation + QA pre-check', icon: 'Brain', highlight: true },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 6: AI INITIATIVE INVENTORY — DIFFUSION (Tier 4)
  // ================================================================
  {
    id: 'diffusion',
    title: 'AI Initiatives — Client-Facing (DIFFUSION)',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AssessmentTableSlide',
      props: {
        sectionLabel: 'Section 03 — External',
        heading: 'DIFFUSION — Client-Facing AI Products',
        subtitle: 'Tier 4: Revenue-generating and differentiating AI offerings',
        valuePotentialFootnote: 'Value Potential reflects a qualitative assessment of each initiative\'s ability to create measurable business impact within 12 months, considering: (1) addressable labor pool or revenue base, (2) current maturity and adoption readiness, (3) defensibility of the AI-enhanced output versus foundation model displacement. "High" = large addressable base, production-ready or near-ready, defensible through proprietary data or workflow integration. "Moderate" = meaningful but narrower impact, or earlier-stage maturity. "Low" = limited addressable base or high displacement risk.',
        sections: [
          {
            title: 'Tier 4: Client-Facing / DIFFUSION Products',
            rows: [
              { name: 'Pantheon', description: 'HCP search / profiling (subscription).', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'High', rationale: 'Subscription model shifts 81qd to recurring revenue. Defensible when anchored in proprietary engagement data, not just commercial claims.' },
              { name: 'Plexus', description: 'Influence mapping and network analytics.', valueSource: 'Pricing Power', valuePotential: 'High', rationale: 'Most defensible analytics asset. Influence network modeling on proprietary engagement data cannot be purchased externally.' },
              { name: 'PerspectivX', description: 'Concept scoring via HCP persona simulation.', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'High', rationale: 'Differentiated if personas are built on real MKG research data. Displacement risk rises if personas are generic LLM approximations.' },
              { name: 'Verba', description: 'Advisory board synthesis.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate', rationale: 'Core functionality (transcript-to-summary) is increasingly commoditized. Defensibility requires integration with proprietary longitudinal data.' },
              { name: 'MagpAI', description: 'Stakeholder simulation / conversational intel.', valueSource: 'Pricing Power', valuePotential: 'Moderate', rationale: 'Overlaps with PerspectivX on persona simulation. Earlier stage. Consolidation opportunity with PerspectivX.' },
              { name: 'BloomLab', description: 'Real-time qual/quant hybrid research.', valueSource: 'Pricing Power + Speed-to-Close', valuePotential: 'Moderate', rationale: 'Novel real-time research methodology is genuinely differentiated. Value depends on proving insight quality parity with traditional qual.' },
              { name: 'Orion', description: 'Patient identification analytics.', valueSource: 'Pricing Power', valuePotential: 'Moderate', rationale: 'Patient identification analytics is a real use case but faces competition from IQVIA, Komodo.' },
              { name: 'InfluenceLink', description: 'Dissemination via Plexus-identified leaders.', valueSource: 'Speed-to-Close', valuePotential: 'Moderate', rationale: 'Dissemination through Plexus-identified leaders. Value is bundled with Plexus, not standalone.' },
            ],
          },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 7: DIFFERENTIATING ASSETS & MOAT (Section 4)
  // ================================================================
  {
    id: 'differentiating-assets',
    title: 'Differentiating Assets & Moat',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DifferentiatingAssetsSlide',
      props: {
        sectionLabel: 'Section 04',
        heading: 'Differentiating Assets & Moat Assessment',
        subtitle: 'Moat Strength scores assess: "How difficult would it be for a well-funded competitor or foundation model to replicate this?" 9–10 = generated by MKG operations, cannot be purchased. 6–8 = valuable but partially replicable. 2–5 = commercially available or commoditizing.',
        moatChart: {
          chartType: 'HorizontalBarChart',
          title: 'Moat Strength Assessment',
          icon: 'Brain',
          items: [
            { label: 'HCP Engagement Data', value: 9, rationale: 'Longitudinal interaction data across thousands of HCPs accumulated through years of operations — cannot be purchased or replicated' },
            { label: 'Medical Expertise', value: 8, rationale: 'Deep therapeutic area knowledge from KOL networks and advisory boards — partially replicable but takes years to build' },
            { label: 'Integrated Platform', value: 7, rationale: 'ION as a unified data lake powering all products — significant engineering investment, though architecture is replicable' },
            { label: 'Model Sophistication', value: 2, rationale: 'ML/AI models built on commodity frameworks and foundation models — any well-funded competitor can replicate' },
          ],
          suffix: '/10',
          maxValue: 10,
          height: 260,
        },
        dataFlow: {
          componentId: 'DataFlowDiagram',
          title: 'ION-Powered Products',
          icon: 'Database',
          sources: ['Advisory Boards', 'Speaker Bureau', 'MSL Interactions', 'HCP Sentiment', 'Engagement Data', 'Campaign Metrics', 'Brand Knowledge'],
          nonProprietarySources: ['Publication Data', 'Claims / RWD'],
          outputs: ['Pantheon', 'Plexus', 'PerspectivX', 'Orion', 'Sentiment Tracker', 'Practice Master', 'MagpAI', 'Verba', 'BloomLab'],
        },
        insightText: "ION powers essentially all of MKG's AI products — it is the platform layer, not a product-specific backend. HCP engagement data is MKG's most defensible asset — longitudinal data across thousands of HCP interactions cannot be purchased or replicated. Claims data is commercially available and should NOT be positioned as a moat. Every AI product should be evaluated: 'Does this use data a competitor cannot buy?'",
      },
    },
  },

  // ================================================================
  // SLIDE 8: ION DATA LAKE DEEP DIVE (NEW)
  // ================================================================
  {
    id: 'ion-data-lake',
    title: 'The ION Data Lake',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'IonDataLakeSlide',
      props: {
        sectionLabel: 'Section 04b',
        heading: 'The ION Data Lake',
        acquisition: {
          publicData: [
            'Open claims, closed claims, EHR data, social determinants of health (2016–present)',
            'Publication data (PubMed, clinical trials, conference proceedings)',
            'NPI registries',
            'Social media / digital footprint',
          ],
          proprietaryData: [
            'HCP profiling and identification data',
            'Advisory board transcripts',
            'Speaker bureau records',
            'MSL interaction logs',
            'Engagement affinity data (~200M interactions)',
            'Campaign performance metrics',
            'Brand knowledge bases',
            'HCP sentiment data from MKG engagement activities',
          ],
        },
        analytics: [
          'HCP influence mapping (clinical, digital, institutional, scholarly influence scoring)',
          'Clinical behavior modeling (treatment patterns, patient identification, adherence modeling)',
          'Sentiment analytics (NLP monitoring of HCP belief evolution)',
          'HCP behavior change alerts (real-time notification of behavioral shifts)',
          'HCP segmentation (behavior-informed audience targeting)',
        ],
        activation: [
          'Hyper-targeted peer-to-peer engagement strategies',
          'AI-powered client deliverables across all DIFFUSION products (Pantheon, Plexus, PerspectivX, Verba, MagpAI, BloomLab, Orion, InfluenceLink)',
          'Internal workflow acceleration across KINETICS tools',
        ],
        requirements: [
          { requirement: 'Organized', description: 'Data must follow consistent schemas across sources. HCP identifiers, therapeutic area taxonomies, and engagement event types need to resolve to a common ontology. Without this, AI models produce inconsistent outputs across products.' },
          { requirement: 'Mastered', description: 'Entity resolution must be reliable — one HCP record per actual person, reconciled across NPI, institutional, engagement, and publication data. Duplicate or conflicting records degrade every downstream analytics product.' },
          { requirement: 'API-Accessible', description: 'All AI products must be able to query the data lake programmatically in real time. If data access requires manual exports or analyst intermediation, AI tools cannot operate at production speed.' },
          { requirement: 'Secure & Compliant', description: 'PHI, engagement data, and claims data carry regulatory obligations (HIPAA, GDPR, client data agreements). Access controls, audit logging, and encryption must be enforced at the platform level.' },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 9: AI VALUE FRAMEWORK (Section 5)
  // ================================================================
  {
    id: 'value-framework',
    title: 'AI Value Framework',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ValueFrameworkSlide',
      props: {
        sectionLabel: 'Section 05',
        heading: 'AI Value Framework',
        description: 'MKG\'s AI initiatives create value through five distinct channels, organized into internal (cost/efficiency) and external (revenue/growth) buckets. Every product value story maps to one or more of these buckets.',
        internalBuckets: [
          { bucket: 'Cost', definition: 'Reduce labor cost per deliverable. AI eliminates rework, catches errors earlier, and reduces hours per output.', kpis: 'Hours per project; cost per completed deliverable; external vendor spend reduction' },
          { bucket: 'Speed', definition: 'Reduce cycle time from draft to delivery. AI compresses the timeline by automating sequential steps.', kpis: 'Days from brief to final; rounds of revision; time to first client response' },
          { bucket: 'Productivity', definition: 'Enable more output per FTE. Existing staff handle higher volume without proportional headcount growth.', kpis: 'Deliverables per employee per month; concurrent projects per team' },
        ],
        externalBuckets: [
          { bucket: 'Pricing Power', definition: 'Command premium pricing via AI-differentiated capabilities. When AI makes the offering faster, more accurate, or analytically richer, MKG can charge more.', kpis: 'Price per engagement vs. prior year; willingness to pay vs. alternatives; margin' },
          { bucket: 'Speed-to-Close', definition: 'Reduce time from prospect interest to signed engagement. AI-powered tools that deliver faster results shorten the sales cycle.', kpis: 'Proposal-to-signed-deal days; trial start-up time; site activation timeline' },
        ],
      },
    },
  },


  // ================================================================
  // SLIDE 10: SUPER PRODUCT VISION (moved after product deep dives)
  // ================================================================
  {
    id: 'super-product',
    title: 'AI Editorial Platform Vision',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SuperProductSlide',
      props: {
        sectionLabel: 'Product Consolidation',
        heading: 'Super Product Vision: The AI Editorial Platform',
        opportunities: [
          { opportunity: 'End-to-end content lifecycle for customers', impact: 'One onboarding, one integration, one training cycle. Pharma brand teams get a platform that handles "brief to MLR-ready" instead of four modular tools. Fundamentally different sales conversation.' },
          { opportunity: 'Faster cycle times through eliminated handoffs', impact: 'Content flows through all four stages without manual export/import. Target: reduce content-to-MLR from ~14 days to ~8 days on pilot projects.' },
          { opportunity: 'Subscription pricing power', impact: 'A unified platform commands annual licensing versus per-tool add-ons. Creates recurring revenue and higher switching costs.' },
          { opportunity: '30–40% engineering efficiency', impact: 'Eliminates duplicated infrastructure (document ingestion, LLM routing, brand context loading, authentication) across four separate codebases. Frees capacity for feature work.' },
          { opportunity: 'Unified brand knowledge base', impact: 'Brand rules, style guides, and past MLR decisions loaded once and available to all stages — today each tool manages this independently.' },
          { opportunity: 'Stronger competitive positioning', impact: 'One AI-powered editorial backbone for pharma content > a collection of helper tools. Platform becomes infrastructure, not an optional add-on.' },
        ],
        stages: [
          { name: 'Stage 1: Create', component: 'DynAImic Content', description: 'AI-assisted content drafting from briefs across channels' },
          { name: 'Stage 2: Annotate', component: 'Annotation Activation', description: 'Automated citation linking and reference quality scoring' },
          { name: 'Stage 3: Check', component: 'Compliance Core', description: 'Regulatory flag detection and MLR readiness scoring' },
          { name: 'Stage 4: Validate', component: 'Route Reagent', description: 'Brand/style validation and routing comment verification' },
        ],
        features: [
          { feature: 'AI content drafting', source: 'DynAImic', description: 'MLR-ready content from briefs across channels' },
          { feature: 'Multi-channel adaptation', source: 'DynAImic', description: 'Emails, banners, social, leave-behinds' },
          { feature: 'Citation linking', source: 'Annotation', description: 'Auto-links claims to supporting references with quality scoring' },
          { feature: 'Regulatory flags', source: 'Compliance', description: 'FDA compliance, off-label, fair balance detection' },
          { feature: 'Style validation', source: 'Route Reagent', description: 'AMA, brand guidelines, routing comment verification' },
          { feature: 'Customer guardrails', source: 'Combined', description: 'Client MLR standards, past review decisions, brand rules as configurable rulesets' },
          { feature: 'Shared document model', source: 'Combined', description: 'Content, annotations, flags, and QA results in one data structure' },
          { feature: 'Single LLM orchestration', source: 'Combined', description: 'One routing system through ION' },
        ],
        efficiencies: [
          { title: 'Single LLM orchestration', description: 'One routing system managing model selection, context, and prompts' },
          { title: 'Shared document model', description: 'Content, annotations, flags, and QA results in one data structure' },
          { title: 'Unified brand knowledge', description: 'Brand rules loaded once, available to all stages' },
          { title: 'One integration surface', description: 'One API, one UI — reduces onboarding and support burden' },
        ],
        valueTable: [
          { area: 'Medical Writers', ftes: '80', lowValue: '$768K', highValue: '$1,440K', target: 'DynAImic Content' },
          { area: 'Editorial / QA', ftes: '30', lowValue: '$495K', highValue: '$825K', target: 'Route Reagent + Annotation' },
          { area: 'Regulatory / Compliance', ftes: '20', lowValue: '$140K', highValue: '$336K', target: 'Compliance Core' },
        ],
        totalLow: '$1,403K',
        totalHigh: '$2,601K',
      },
    },
  },

  // ================================================================
  // SLIDE 11: INTERNAL PRODUCTIVITY VALUE SUMMARY (p22)
  // ================================================================
  {
    id: 'internal-productivity-value',
    title: 'Internal Productivity Value Summary',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'InternalProductivityValueSlide',
      props: {
        sectionLabel: 'Value Quantification',
        heading: 'Internal Productivity Value Summary',
        rows: [
          { initiative: 'DynAImic Content', primaryValueDriver: 'Cycle time: brief to first draft', ftes: '80', comp: '$120K', lowUplift: '8%', lowValue: '$768K', highUplift: '15%', highValue: '$1,440K', rationale: 'Medical writers spend 60%+ of project time on first drafts. AI-assisted generation compresses the highest-volume step.' },
          { initiative: 'Route Reagent + Annotation Activation', primaryValueDriver: 'QA pre-check: errors caught before human review', ftes: '30', comp: '$110K', lowUplift: '15%', lowValue: '$495K', highUplift: '25%', highValue: '$825K', rationale: 'Automated style, citation, and routing checks eliminate the lowest-value portion of editorial review.' },
          { initiative: 'Compliance Core', primaryValueDriver: 'Risk prevention: MLR rejections avoided', ftes: '20', comp: '$140K', lowUplift: '5%', lowValue: '$140K', highUplift: '12%', highValue: '$336K', rationale: 'Each prevented rejection avoids 3–5 days of rework cascading across writers, editors, and compliance staff.' },
          { initiative: 'Pantheon + Practice Master', primaryValueDriver: 'Research speed: HCP profiling time', ftes: '25', comp: '$105K', lowUplift: '10%', lowValue: '$263K', highUplift: '20%', highValue: '$525K', rationale: 'Automated search and affiliation harmonization replaces manual profiling that currently takes weeks per project.' },
          { initiative: 'Plexus', primaryValueDriver: 'Analysis depth: influence mapping automation', ftes: '15', comp: '$130K', lowUplift: '5%', lowValue: '$98K', highUplift: '12%', highValue: '$234K', rationale: 'AI-enhanced network modeling produces richer outputs in less time than manual analysis.' },
          { initiative: 'Verba + BloomLab + PerspectivX', primaryValueDriver: 'Synthesis speed: research to deliverable', ftes: '40', comp: '$115K', lowUplift: '8%', lowValue: '$368K', highUplift: '15%', highValue: '$690K', rationale: 'AI-assisted summarization and concept scoring compress the research-to-insight cycle.' },
          { initiative: 'ChatMKG + ION portal', primaryValueDriver: 'General productivity: knowledge work efficiency', ftes: '200', comp: '$95K', lowUplift: '2%', lowValue: '$380K', highUplift: '5%', highValue: '$950K', rationale: 'Broad-based efficiency gains contingent on data integration with ION. Wide range reflects uncertainty.' },
        ],
        totalLow: '$2.5M',
        totalHigh: '$5.0M',
      },
    },
  },

  // ================================================================
  // SLIDE 12: EXTERNAL REVENUE UPSIDE (pAdd)
  // ================================================================
  {
    id: 'external-revenue',
    title: 'External Revenue Upside',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ExternalRevenueSlide',
      props: {
        sectionLabel: 'Value Quantification',
        heading: 'External Revenue Upside',
        rows: [
          { product: 'Pantheon', primaryValueDriver: 'Subscription shift — recurring revenue', lowAssumptions: '8 customers × $80K', lowRevenue: '$640K', highAssumptions: '15 customers × $120K', highRevenue: '$1,800K', rationale: 'Converting <10% of eligible 81qd clients to subscription validates the model shift.' },
          { product: 'Plexus', primaryValueDriver: 'Pricing premium — AI-enhanced analytics', lowAssumptions: '8 projects × $20K premium', lowRevenue: '$160K', highAssumptions: '18 projects × $40K premium', highRevenue: '$720K', rationale: 'AI enhancement justifies modest price premium on bundled analytics engagements. Nick noted AI efficiency is becoming "cost of entry."' },
          { product: 'PerspectivX', primaryValueDriver: 'New revenue — concept testing add-on', lowAssumptions: '8 tests × $15K', lowRevenue: '$120K', highAssumptions: '20 tests × $30K', highRevenue: '$600K', rationale: 'Priced at a fraction of traditional qual ($75K–$150K), making adoption low-risk for clients.' },
          { product: 'Verba', primaryValueDriver: 'Premium add-on — advisory board synthesis', lowAssumptions: '$0 (deal sweetener)', lowRevenue: '$0', highAssumptions: '15 boards × $12K', highRevenue: '$180K', rationale: 'Low case reflects that off-the-shelf LLMs can do structured synthesis — likely bundled, not charged separately.' },
          { product: 'MagpAI', primaryValueDriver: 'New revenue — simulation engagements', lowAssumptions: '$0 (deal sweetener)', lowRevenue: '$0', highAssumptions: '10 engagements × $20K', highRevenue: '$200K', rationale: 'Earlier stage — low case reflects current use as demo/deal sweetener. High case requires standalone training simulation value.' },
          { product: 'BloomLab', primaryValueDriver: 'New methodology — AI market research', lowAssumptions: '8 engagements × $25K', lowRevenue: '$200K', highAssumptions: '18 engagements × $45K', highRevenue: '$810K', rationale: 'Novel method requires parallel validation before clients trust it standalone.' },
          { product: 'Sentiment Tracker', primaryValueDriver: 'Share-of-wallet lift on existing clients', lowAssumptions: '0.3% on $50M base', lowRevenue: '$150K', highAssumptions: '0.8% on $50M base', highRevenue: '$400K', rationale: 'Indirect mechanism — better-targeted campaigns → stronger outcomes → expanded scope.' },
        ],
        totalLow: '$1.3M',
        totalHigh: '$4.7M',
      },
    },
  },

  // ================================================================
  // SLIDE 13: COMBINED AI OPPORTUNITY — YEAR 1 IMPACT (NEW)
  // ================================================================
  {
    id: 'combined-value-waterfall',
    title: 'Combined AI Opportunity — Year 1 Impact',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'CombinedValueWaterfallSlide',
      props: {
        sectionLabel: 'Value Summary',
        heading: 'Combined AI Opportunity — Year 1 Impact',
        internalItems: [
          { label: 'DynAImic Content', low: '$768K', high: '$1,440K', midpoint: 1104 },
          { label: 'Route Reagent + Annotation', low: '$495K', high: '$825K', midpoint: 660 },
          { label: 'Compliance Core', low: '$140K', high: '$336K', midpoint: 238 },
          { label: 'Pantheon + Practice Master', low: '$263K', high: '$525K', midpoint: 394 },
          { label: 'Plexus', low: '$98K', high: '$234K', midpoint: 166 },
          { label: 'Verba + BloomLab + PerspectivX', low: '$368K', high: '$690K', midpoint: 529 },
          { label: 'ChatMKG + ION', low: '$380K', high: '$950K', midpoint: 665 },
        ],
        externalItems: [
          { label: 'Pantheon (subscription)', low: '$640K', high: '$1,800K', midpoint: 1220 },
          { label: 'Plexus (premium)', low: '$160K', high: '$720K', midpoint: 440 },
          { label: 'PerspectivX', low: '$120K', high: '$600K', midpoint: 360 },
          { label: 'Verba', low: '$0', high: '$180K', midpoint: 90 },
          { label: 'MagpAI', low: '$0', high: '$200K', midpoint: 100 },
          { label: 'BloomLab', low: '$200K', high: '$810K', midpoint: 505 },
          { label: 'Sentiment Tracker', low: '$150K', high: '$400K', midpoint: 275 },
        ],
        internalTotal: { low: '$2.5M', high: '$5.0M' },
        externalTotal: { low: '$1.3M', high: '$4.7M' },
        grandTotal: { low: '$3.8M', high: '$9.7M', pctLow: '2.5%', pctHigh: '6.5%' },
        footnote: 'Internal values represent labor cost equivalent of productivity freed — capacity for redeployment or margin improvement, not headcount reduction. External values represent incremental revenue from AI-differentiated products. Ranges reflect low (basic adoption) to high (targeted workflow automation) scenarios.',
      },
    },
  },

  // ================================================================
  // SLIDE 14: LEADING INDICATORS & MEASUREMENT (Section 17)
  // ================================================================
  {
    id: 'leading-indicators',
    title: 'Leading Indicators & Measurement',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'LeadingIndicatorsSlide',
      props: {
        sectionLabel: 'Measurement',
        heading: 'Leading Indicators & Measurement',
        coreArgument: 'MKG\'s current measurement is almost entirely lagging — revenue, margin, EBITDA. For early-stage AI initiatives, these will show nothing for 6–12 months. AI initiatives need leading indicators that show whether adoption is working before it shows up in financials. Assign named owners, automate data pulls, keep it simple, and communicate steadily through existing meetings.',
        leadingIndicators: [
          { category: 'Adoption', indicator: 'Daily/weekly active users per tool', sourceSlides: 'All products', howToMeasure: 'Instrument usage logging in ION platform. Pull weekly automated reports — no manual data collection.' },
          { category: 'Adoption', indicator: '% of eligible projects using AI-assisted workflow', sourceSlides: 'DynAImic, Route Reagent, Annotation', howToMeasure: 'Tag projects in the project management system as AI-assisted vs. manual. Compare volumes monthly.' },
          { category: 'Cycle Time', indicator: 'Days from brief to MLR submission', sourceSlides: 'DynAImic Content, Annotation Activation, Compliance Core, Route Reagent', howToMeasure: 'Timestamp brief receipt and MLR submission in workflow system. Calculate elapsed days automatically.' },
          { category: 'Cycle Time', indicator: 'Rounds of revision before approval', sourceSlides: 'Annotation, Route Reagent', howToMeasure: 'Count revision submissions per asset in the editorial tracking system.' },
          { category: 'Quality', indicator: 'First-pass MLR acceptance rate', sourceSlides: 'Compliance Core', howToMeasure: 'Track accept/reject/revise decisions at MLR. Compare AI-screened vs. unscreened submissions.' },
          { category: 'Quality', indicator: 'Annotation error rate', sourceSlides: 'Annotation Activation', howToMeasure: 'Sample-audit AI-generated citations quarterly. Measure % incorrect or missing references.' },
          { category: 'Client Signal', indicator: 'Proposal win rate on AI-featured pitches', sourceSlides: 'Pantheon, Plexus, PerspectivX', howToMeasure: 'Flag proposals that feature AI capabilities in CRM. Compare win rates vs. non-AI proposals.' },
          { category: 'Client Signal', indicator: 'Client NPS on AI-enhanced deliverables', sourceSlides: 'Verba, BloomLab', howToMeasure: 'Add a 1-question NPS survey to post-engagement follow-up on AI-enhanced projects.' },
          { category: 'Revenue Signal', indicator: 'Subscription attach rate (Pantheon)', sourceSlides: 'Pantheon', howToMeasure: 'Track Pantheon subscription conversions as a % of eligible 81qd client base quarterly.' },
        ],
        makingMeasurementWork: [
          'Assign a named owner for each indicator. If no one is accountable for pulling the data and reporting it, the dashboard will die within 60 days.',
          'Automate data pulls wherever possible. Passive measurement always wins — if a metric requires someone to manually compile a spreadsheet, it won\'t survive. Instrument it in the platform or don\'t track it.',
          'Keep it simple to understand. Every metric should be explainable in one sentence to a non-technical leader. If it takes a paragraph to explain what a KPI means, pick a different one.',
          'Make it relatable for operational change. Metrics need to connect to how people actually work. "First-pass MLR acceptance rate" means something to an editorial team lead. "AI-augmented throughput coefficient" does not.',
          'Communicate steadily. Measurement without communication is invisible. Share results in existing meetings — don\'t create new ones. Use the Monthly Senior Leadership review that already exists.',
          'Create venues at all levels for reflection. Front-line teams need space to talk about how AI is changing their work, what\'s working, what\'s frustrating, and what they\'d change. This isn\'t just a leadership exercise — the people using the tools daily have the most important feedback.',
          'Expect people to need time to choose how work will change. AI adoption is a change management challenge, not a technology deployment. People need to see, try, reflect, and decide — not be told their workflow changed overnight.',
        ],
        recommendation: 'Build an enterprise AI KPI dashboard tracking leading indicators weekly. Review in existing Monthly Senior Leadership meeting.',
      },
    },
  },

  // ================================================================
  // SLIDE 15: GOVERNANCE & CHANGE MANAGEMENT (Section 18)
  // ================================================================
  {
    id: 'governance',
    title: 'Governance & Change Management',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ChangeManagementSlide',
      props: {
        sectionLabel: 'Governance',
        heading: 'Governance & Change Management',
        readiness: {
          title: 'Organizational Readiness',
          items: [
            { dimension: 'Leadership Alignment (8/10): CEO, CSO, and CCDO are actively engaged and Novo board is involved. Weekly AI committee, biweekly advocates, monthly senior leadership review — the cadence is genuinely strong. Score could reach 9/10 with a dedicated AI Product Manager providing single-point accountability.', score: 8, color: 'green' },
            { dimension: 'AI Fluency (5/10): Strong pockets in 81qd, Andrew\'s digital team, and Nick\'s medical team. Uneven across 13 sub-brands. Monthly lunch-and-learns are a good start but haven\'t translated to org-wide fluency. Risk: tools get built by enthusiasts, adopted by no one else.', score: 5, color: 'yellow' },
            { dimension: 'KPI Discipline (2/10): Single biggest gap. No enterprise AI dashboard. No standardized leading indicators. 81qd does not measure ROI on analytics engagements. Without measurement, prioritization is based on enthusiasm, not evidence.', score: 2, color: 'red' },
            { dimension: 'Product Focus (4/10): Too many branded products without a single strategy owner. Decentralized build teams with competing roadmaps. The super product consolidation and a Senior AI PM hire would directly address this.', score: 4, color: 'red' },
          ],
        },
        meetingStructure: [
          { cadence: 'Weekly', forum: 'AI Product Standup', purpose: 'Backlog prioritization, blockers, adoption metrics', attendees: 'AI PM, engineering leads, medical SME representative' },
          { cadence: 'Biweekly', forum: 'AI Advocates Sync', purpose: 'Cross-brand adoption updates, user feedback, training needs', attendees: 'Sub-brand AI champions (existing advocates network)' },
          { cadence: 'Monthly', forum: 'Senior Leadership AI Review', purpose: 'KPI dashboard review, investment decisions, portfolio prioritization', attendees: 'CEO, CSO, CCDO, CFO, AI PM' },
          { cadence: 'Quarterly', forum: 'Board AI Update', purpose: 'Strategic progress, EBITDA bridge, roadmap adjustments', attendees: 'Novo board, MKG executive team' },
        ],
        optionalAITalentCallout: 'Optional: Consolidate AI Build Talent. Currently, AI engineering and product talent is distributed across multiple business units building overlapping tools with competing roadmaps. Consolidating into a centralized AI team (reporting to the AI PM or CSO) would focus investment, eliminate duplicated infrastructure, and accelerate the super product vision. This is an organizational change that requires careful sequencing — it should follow, not precede, the product consolidation and roadmap prioritization decisions. Flagged as optional because it\'s high-impact but also high-disruption and should only proceed with strong executive alignment.',
      },
    },
  },

  // ================================================================
  // SLIDE 16: EXECUTION ROADMAP (Section 19)
  // ================================================================
  {
    id: 'roadmap',
    title: 'Execution Roadmap',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RoadmapPhasedSlide',
      props: {
        sectionLabel: 'Roadmap',
        heading: 'Execution Roadmap',
        phases: [
          {
            phase: 'Month 1',
            title: 'Focus & Decide',
            variant: 'green',
            items: [
              'Portfolio decisions: which initiatives go forward, which are paused or consolidated. Deprioritize Meeting Nucleus, Strategic Brief, Strategic Synthesis.',
              'Designate or hire Senior AI PM. Assign named owners for each funded initiative.',
              'Confirm super product consolidation (editorial platform).',
            ],
          },
          {
            phase: 'Month 2',
            title: 'Scope & Stand Up',
            variant: 'sage',
            items: [
              'Stand up weekly AI standup + monthly leadership review. Define KPI dashboard requirements.',
              'Scope unified editorial platform: shared document model, stage-based pipeline, priority integrations. Define MVP for 2-stage pilot (Route Reagent + Annotation).',
            ],
          },
          {
            phase: 'Months 3–4',
            title: 'Build & Prove',
            variant: 'gold',
            items: [
              'Build MVP editorial platform (2 stages). Build Pantheon subscription pilot (5–10 customers).',
              'KPI dashboard live — tracking 3–5 leading indicators weekly.',
              'Set 90-day adoption targets. Begin pilot with 2–3 MedComm teams. Target: 30%+ projects using editorial tools.',
              'PerspectivX validation study (retrospective correlation analysis).',
            ],
          },
        ],
        fourCards: [
          { num: '01', title: 'Rationalize the Portfolio', description: 'Consolidate adjacent products. Stop building net-new until overlap is addressed. One strong platform beats nine mediocre tools.', variant: 'green' },
          { num: '02', title: 'Differentiate Through Data + Expertise', description: 'The moat is proprietary engagement data, two decades of medical judgment, and integrated commercialization services — not AI capability.', variant: 'sage' },
          { num: '03', title: 'Instrument ROI with Leading Indicators', description: 'Close the loop between product usage → outcomes → willingness to pay. Sunset tools that haven\'t hit 20% adoption by Month 6.', variant: 'gold' },
          { num: '04', title: 'Operationalize with Product-Led Ownership', description: 'Product-led prioritization with clear ownership, a single intake process, and 90-day milestones. Scale Pantheon to 15–25 customers. Roll out editorial platform speed improvements.', variant: 'cyan' },
        ],
      },
    },
  },
  // ================================================================
  // SLIDE 17: INITIATIVE DEEP DIVES (Section Divider)
  // ================================================================
  {
    id: 'initiative-deep-dives',
    title: 'Initiative Deep Dives',
    type: 'title',
    content: {
      type: 'title',
      headline: 'Initiative Deep Dives',
      subtitle: '',
    },
  },

  // ================================================================
  // SLIDE 18: DYNAIMIC CONTENT (NEW — Product Deep Dive)
  // ================================================================
  {
    id: 'dynaimic-content',
    title: 'DynAImic Content — AI-Assisted Content Generation',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'DynAImic Content — AI-Assisted Content Generation',
        description: 'Generates draft marketing content across channels (emails, banners, social media, leave-behinds, microsites) from content briefs. Combines LLM-assisted generation with MKG\'s brand knowledge bases to produce MLR-ready first drafts that reduce time from brief to reviewable content.',
        users: 'Medical writers and content creators across MKG\'s MedComm business units.',
        replaces: 'Manual first-draft creation, which currently takes 2–5 days per asset depending on complexity and channel.',
        defensibility: { rating: 'HIGH', text: 'Addresses the largest labor pool in the editorial pipeline (~80 medical writers at $120K avg comp). Content generation is the highest-volume step and the primary bottleneck in cycle time. Near production-ready as part of the KINETICS toolset.' },
        valueMapping: 'Internal: 80 FTEs × $120K × 8–15% uplift = $768K–$1,440K. This is the single largest internal value line item.',
        leadingIndicators: [
          'Average days from brief to first reviewable draft drops below 2 days (from current 3–5 day baseline) on projects using DynAImic Content',
          '30%+ of eligible MedComm projects are using AI-assisted drafting within 6 months',
        ],
        valueEstimate: 'Internal: 80 FTEs × $120K × 8–15% uplift = $768K–$1,440K in productivity freed.',
        assumptions: [
          'Medical writers spend 60%+ of project time on first drafts — AI-assisted generation compresses the highest-volume step',
          'Output quality is sufficient to serve as a working first draft, reducing (not eliminating) writer effort',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 19: ANNOTATION ACTIVATION (NEW — Product Deep Dive)
  // ================================================================
  {
    id: 'annotation-activation',
    title: 'Annotation Activation — Auto-Citation Linking',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Annotation Activation — Auto-Citation Linking',
        description: 'Auto-links claims in marketing content to supporting literature references. Identifies assertions in draft content and matches them to citations from the scientific literature, preparing content for editorial fact-checking and MLR submission.',
        users: 'Editorial and QA review teams preparing content for MLR submission.',
        replaces: 'Manual annotation — currently one of the most time-consuming steps in MLR preparation, requiring analysts to match each claim to a supporting reference by hand.',
        defensibility: { rating: 'HIGH', text: 'Automates the most tedious step in MLR prep. Directly reduces rounds of revision and submission time for ~30 editorial/QA reviewers at $110K avg comp. Production-ready or near-ready as part of the KINETICS editorial pipeline.' },
        valueMapping: 'Internal: Captured under Editorial/QA Reviewers — 30 FTEs × $110K × 15–25% uplift = $495K–$825K (shared with Route Reagent).',
        leadingIndicators: [
          'Annotation error rate (incorrect or missing citations) falls below 5% on AI-assisted projects, demonstrating output quality sufficient for editorial trust',
          'Rounds of revision before MLR approval decrease by at least 1 round on annotated projects versus manual baseline',
        ],
        valueEstimate: 'Internal: 30 FTEs × $110K × 15–25% uplift = $495K–$825K (shared with Route Reagent).',
        assumptions: [
          'Citation matching accuracy is high enough that editorial reviewers trust the output without re-verifying every reference',
          'The tool integrates directly into the editorial workflow system, not as a standalone side step',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 20: COMPLIANCE CORE (NEW — Product Deep Dive)
  // ================================================================
  {
    id: 'compliance-core',
    title: 'Compliance Core — Regulatory Flag Detection',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Compliance Core — Regulatory Flag Detection',
        description: 'Scans marketing content for FDA compliance risks before MLR submission — detecting off-label language, fair balance issues, and guideline adherence violations. Pre-scores content against common MLR rejection criteria.',
        users: 'Regulatory and compliance review teams across MKG.',
        replaces: 'Manual compliance pre-screening, which currently requires specialized reviewers to read every asset line-by-line against regulatory standards.',
        defensibility: { rating: 'HIGH', text: 'Pre-screening catches costly errors before they reach MLR, preventing late-stage rejections that create rework cascades across the full pipeline. Addresses ~20 compliance reviewers at $140K avg comp. The risk-reduction mechanism amplifies value beyond the direct labor savings.' },
        valueMapping: 'Internal: 20 FTEs × $140K × 5–12% uplift = $140K–$336K. Indirect: each prevented MLR rejection avoids 3–5 days of rework.',
        leadingIndicators: [
          'First-pass acceptance rate at MLR improves by 10+ percentage points on projects that use Compliance Core pre-screening',
          'Compliance review hours per asset decrease measurably versus unassisted baseline',
        ],
        valueEstimate: 'Internal: 20 FTEs × $140K × 5–12% uplift = $140K–$336K. Indirect value: each prevented rejection avoids 3–5 days of rework across writers, editors, and compliance staff.',
        assumptions: [
          'The tool catches a meaningful percentage of the compliance issues that currently cause MLR rejections',
          'False positive rate is low enough that reviewers don\'t ignore the tool\'s flags',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 21: ROUTE REAGENT (NEW — Product Deep Dive)
  // ================================================================
  {
    id: 'route-reagent',
    title: 'Route Reagent — Style & Brand Validation',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Route Reagent — Style & Brand Validation',
        description: 'Validates content against AMA style guides, brand-specific editorial standards, and MKG internal guidelines. Performs preliminary quality checks during the editorial review cycle — verifying routing comments have been addressed, checking style consistency, and flagging discrepancies before human review.',
        users: 'Editorial and QA reviewers, medical writers during revision cycles.',
        replaces: 'Manual style and brand compliance checking — a repetitive, error-prone step in every editorial review cycle.',
        defensibility: { rating: 'HIGH', text: 'Closest to production among the editorial pipeline tools. Already embedded in real editorial workflows. Catches low-value errors before they consume human reviewer time. Value is shared with Annotation Activation across the ~30 editorial/QA FTE pool.' },
        valueMapping: 'Internal: Shared with Annotation Activation under Editorial/QA Reviewers — 30 FTEs × $110K × 15–25% uplift = $495K–$825K combined.',
        leadingIndicators: [
          'Style and brand error rates in submitted content drop measurably on Route Reagent-assisted projects',
          'Editorial reviewer hours per asset decrease as QA pre-checks catch issues that previously required manual identification',
        ],
        valueEstimate: 'Internal: Shared with Annotation Activation — 30 FTEs × $110K × 15–25% uplift = $495K–$825K combined.',
        assumptions: [
          'The tool\'s style and brand rule library is comprehensive enough to catch the majority of common errors',
          'Editorial teams integrate it into their review workflow rather than treating it as optional',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 22: PANTHEON
  // ================================================================
  {
    id: 'pantheon',
    title: 'Pantheon — HCP Search & Profiling',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Pantheon — HCP Search & Profiling',
        description: 'Conversational AI interface for querying HCP datasets in natural language. Provides instant synthesis across publication, clinical trial, and payment data to surface relevant experts in seconds. Designed to transition 81qd from transaction-based analytics to a recurring subscription model, layering proprietary engagement data on top of commercial claims and NPI data.',
        users: 'Commercial and medical affairs teams at pharma companies — brand leaders, TLL team leadership, MSL teams, insights/analytics groups, and 81qd analytics clients.',
        replaces: 'Manual HCP profiling (4–6 weeks, $50K–$75K per project). Also competes with IQVIA, H1 Insights, Definitive Healthcare, and Veeva Compass.',
        defensibility: { rating: 'HIGH', text: 'Subscription model shifts 81qd from transaction-based to recurring revenue — the single most important structural change for the analytics unit. Defensible when the proprietary engagement data layer (advisory board history, speaker bureau records, sentiment signals) is richer than what customers get from IQVIA or H1 alone.' },
        valueMapping: 'External: 8–15 customers × $80K–$120K = $640K–$1.8M. Internal: 25 FTEs × $105K × 10–20% uplift = $263K–$525K (shared with Practice Master).',
        leadingIndicators: [
          'Subscription attach rate exceeds 10% of eligible 81qd clients within 12 months, validating the transaction-to-subscription shift',
          'Renewal rate at 12 months exceeds 75%, demonstrating ongoing usage value beyond initial novelty',
        ],
        valueEstimate: 'External: Low — 8 customers × $80K = $640K | High — 15 customers × $120K = $1.8M. Internal: 25 FTEs × $105K × 10–20% uplift = $263K–$525K (shared with Practice Master).',
        assumptions: [
          'Proprietary engagement data layer is meaningfully richer than IQVIA or H1 alone',
          'Subscription price point ($80K–$120K) validated with at least 5 pilot customers',
          'Retention exceeds 75% at renewal — requires demonstrating ongoing usage, not just initial novelty',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 23: PLEXUS
  // ================================================================
  {
    id: 'plexus',
    title: 'Plexus — Influence Mapping',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Plexus — Influence Mapping & Network Analytics',
        description: 'Maps clinical influence networks — identifying not just who the key opinion leaders are, but how they\'re connected, who influences whom, and where the leverage points are. Combines clinical, academic, digital, and institutional data to model influence flow across therapeutic areas.',
        users: '81qd analysts, engagement planning teams, commercial strategy leads at pharma companies.',
        replaces: 'Manual network analysis relying on subjective assessments, conference attendance lists, and publication counts.',
        defensibility: { rating: 'HIGH', text: 'Most defensible analytics asset MKG has. Influence network modeling on proprietary engagement data (who attended advisory boards, who spoke at events, who influenced prescribing changes) cannot be purchased externally. This is the product most anchored in MKG\'s structural advantage.' },
        valueMapping: 'Internal: 15 FTEs × $130K × 5–12% uplift = $98K–$234K. External: 8–18 projects × $20K–$40K premium = $160K–$720K.',
        leadingIndicators: [
          'Competitive win rate on proposals featuring influence mapping increases measurably, indicating AI-enhanced Plexus is a differentiator in the sales process',
          'Client-reported time savings on engagement planning projects exceed 25% versus manual network analysis baseline',
        ],
        valueEstimate: 'Internal: 15 FTEs × $130K × 5–12% uplift = $98K–$234K. External: 8–18 projects × $20K–$40K premium = $160K–$720K.',
        assumptions: [
          'AI-enhanced Plexus delivers measurably faster or deeper results than current workflow',
          'Clients perceive AI enhancement as valuable enough for price premium',
          'Sales teams trained to articulate the AI-enhanced value proposition in proposals',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 24: PRACTICE MASTER
  // ================================================================
  {
    id: 'practice-master',
    title: 'Practice Master — HCP Affiliation Intelligence',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Practice Master — HCP Affiliation Intelligence',
        description: 'Harmonizes multiple data sources to map HCP affiliations and resolve conflicting institutional records. Disambiguates which practice, hospital, or academic institution an HCP is actually associated with across NPI, claims, and engagement data.',
        users: '81qd analysts and MedComm teams. Used as an input step for HCP profiling projects and engagement planning.',
        replaces: 'Manual verification of HCP affiliations across NPI registries, institutional websites, and proprietary databases — consuming several hours per profiling project.',
        defensibility: { rating: 'MODERATE', text: 'Addresses a narrower analyst pool (~25 FTEs). Underlying NPI and institutional data is commercially available from competitors. Value comes from the harmonization and disambiguation layer — resolving conflicting affiliations across sources — not from the data itself.' },
        valueMapping: 'Internal: Contributes to HCP Profiling/Data Analysts — $263K–$525K productivity value (shared with Pantheon). Standalone contribution is modest.',
        leadingIndicators: [
          'Hours saved per profiling project are measurable and consistent (target: 2+ hours per project versus manual verification baseline)',
          'Downstream correction rate on affiliation data drops below 5%, indicating analysts trust the tool\'s output without re-verifying manually',
        ],
        valueEstimate: 'Captured under HCP Profiling/Data Analysts (25 FTEs, $105K comp, 10–20% uplift = $263K–$525K). Shared with Pantheon. Standalone contribution is modest.',
        assumptions: [
          'The harmonization layer is accurate enough that analysts trust it without re-verifying manually',
          'The tool is integrated into the standard profiling workflow, not a side step',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 25: SENTIMENT TRACKER
  // ================================================================
  {
    id: 'sentiment-tracker',
    title: 'Sentiment Tracker — HCP Sentiment Analysis',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Sentiment Tracker — HCP Sentiment Analysis',
        description: 'NLP-based tracking of HCP belief and sentiment shifts over time. Monitors evolution of HCP perceptions across therapeutic areas, treatment protocols, and brand messaging — drawing from MKG\'s own engagement activities (advisory boards, speaker bureaus, MSL interactions).',
        users: '81qd analysts, brand strategy teams, market research leads.',
        replaces: 'Periodic qualitative research (typically quarterly or semi-annual) that provides point-in-time snapshots. Sentiment Tracker aims for continuous monitoring.',
        defensibility: { rating: 'MODERATE', text: 'High strategic value when applied to proprietary engagement data. Revenue mechanism is indirect — share-of-wallet lift on existing client relationships — which makes Year 1 measurement harder. Defensibility depends entirely on using MKG\'s internal data, not publicly available text.' },
        valueMapping: 'External: 0.3–0.8% lift on ~$50M relevant revenue base = $150K–$400K.',
        leadingIndicators: [
          'Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals on at least 5 accounts within 6 months',
          'Upsell or renewal rates on sentiment-informed accounts show measurable positive variance versus non-informed accounts',
        ],
        valueEstimate: 'Approximately $50M of MKG\'s revenue comes from clients where HCP sentiment data is directly relevant. A 0.3–0.8% lift on that base yields $150K–$400K.',
        assumptions: [
          'The tool is fed by MKG\'s proprietary engagement data, not just public sources',
          'Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 26: CHATMKG
  // ================================================================
  {
    id: 'chatmkg',
    title: 'ChatMKG — Secure LLM Access',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'ChatMKG — Secure LLM Access',
        description: 'Custom multimodal AI workspace with SSO, audio transcription, web search, model switching, conversation history, and keyword search for past work. Designed as MKG\'s internal AI portal for general-purpose tasks.',
        users: 'All MKG employees (~200 FTEs). Intended as the default AI interface for day-to-day work.',
        replaces: 'Consumer AI tools (ChatGPT, Claude, Copilot) that employees are already using on personal devices.',
        defensibility: { rating: 'MODERATE', text: 'Every feature (SSO, transcription, web search, model switching) is available in off-the-shelf enterprise AI. Defensibility is zero unless ChatMKG connects to the ION Data Lake and brand knowledge bases — making it the only AI interface that can access MKG\'s proprietary data. Without that integration, there is no reason for employees to use it over consumer tools.' },
        valueMapping: 'Internal: 200 FTEs × $95K × 2–5% uplift = $380K–$950K. Wide range reflects the data integration question.',
        leadingIndicators: [
          'Daily active users as a % of total employees exceeds 40%, indicating ChatMKG is genuinely preferred over external alternatives',
          'Percentage of ChatMKG sessions that access proprietary data (ION, brand knowledge bases) exceeds 25%, validating the data integration thesis',
        ],
        valueEstimate: '200 FTEs × $95K × 2–5% uplift = $380K–$950K. Wide range reflects the data integration question.',
        assumptions: [
          'ChatMKG connects to the ION Data Lake and brand knowledge bases, making it meaningfully more useful than external alternatives',
          'User experience is competitive with consumer-grade AI tools',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 27: VERBA
  // ================================================================
  {
    id: 'verba',
    title: 'Verba — Advisory Board Synthesis',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'Verba — Advisory Board Synthesis',
        description: 'Transforms transcripts from advisory boards, investigator meetings, and expert discussions into structured intelligence. Extracts key themes, unmet needs, objections, treatment patterns, and sentiment shifts.',
        users: 'Client-facing — brand teams, medical affairs teams, market access leaders, commercial strategy teams.',
        replaces: 'Manual synthesis of advisory board transcripts — labor-intensive process requiring analysts to review hours of discussion and produce structured reports over 1–2 weeks.',
        defensibility: { rating: 'MODERATE', text: 'Core functionality (transcript to structured summary) is increasingly commoditized — Claude, GPT-4o can do this well. Defensibility requires integration with MKG\'s proprietary longitudinal data: cross-referencing statements against clinical evidence, comparing sentiment across boards over time. Without those layers, Verba is an LLM wrapper.' },
        valueMapping: 'Internal: 40 FTEs × $115K × 8–15% uplift = $368K–$690K (shared with BloomLab, PerspectivX). External: $0 (deal sweetener) → 15 boards × $12K = $0–$180K.',
        leadingIndicators: [
          'Time from advisory board to client deliverable drops below 3 business days on Verba-assisted projects (from current 1–2 week baseline)',
          'Clients specifically request Verba as part of engagement scope, rather than receiving it as a default — indicating perceived differentiation',
        ],
        valueEstimate: 'Internal: 40 FTEs × $115K × 8–15% uplift = $368K–$690K (shared). External: Low — $0 (deal sweetener) | High — 15 boards × $12K = $180K.',
        assumptions: [
          'Verba connects to proprietary MKG data to deliver analysis that a standalone LLM cannot replicate',
          'Output quality is high enough that medical reviewers don\'t spend as much time correcting as they saved',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 28: PERSPECTIVX
  // ================================================================
  {
    id: 'perspectivx',
    title: 'PerspectivX — Concept Scoring',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'PerspectivX — Concept Scoring',
        description: 'Simulates real-world feedback from HCPs by analyzing campaign concepts through the lens of each treater\'s unique attitudes, beliefs, and cognitive filters. Uses data-based personas modeled from the ION Data Lake.',
        users: 'Brand teams, creative agencies, commercial strategy teams at pharma companies.',
        replaces: 'Traditional qualitative concept testing ($75K–$150K, 6–8 weeks). PerspectivX pricing ($15K–$30K per test) is a fraction, making adoption easier to justify.',
        defensibility: { rating: 'MODERATE-HIGH', text: 'Differentiated if personas are built on real MKG research data from SOUND, 81qd behavioral data, and advisory board engagement data. The key validation question: do PerspectivX scores correlate with actual market research outcomes? If yes, this is a powerful and defensible sales tool.' },
        valueMapping: 'External: 8–20 tests × $15K–$30K = $120K–$600K.',
        leadingIndicators: [
          'PerspectivX concept scores show validated directional correlation with actual market performance on at least 3 retrospective case studies',
          'Client repeat usage rate exceeds 50% — indicating teams that try it find it useful enough to come back',
        ],
        valueEstimate: 'Low: 8 tests × $15K = $120K. High: 20 tests × $30K = $600K.',
        assumptions: [
          'Personas are grounded in MKG\'s proprietary data, not generic LLM approximations',
          'Concept scores show validated correlation to real market outcomes (even directional correlation is meaningful)',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 29: MAGPAI
  // ================================================================
  {
    id: 'magpai',
    title: 'MagpAI — Stakeholder Simulation',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'MagpAI — Stakeholder Simulation',
        description: 'Replicates authentic communication styles of HCPs, patients, and payers through AI simulation. Supports observational research and provides interactive training avatars for sales reps and MSLs.',
        users: 'Brand teams, commercial strategy teams, training departments.',
        replaces: 'Traditional stakeholder research interviews ($50K–$100K per study, 4–6 weeks) and in-person sales training role-plays. Competes with ZS/Symmetry, Rehearsal, Second Nature on training.',
        defensibility: { rating: 'MODERATE', text: 'Significant overlap with PerspectivX — both create AI-simulated HCP/stakeholder interactions from persona data. Differentiated by output format (conversational simulation vs. concept scores) but the underlying data and model are shared. Consolidation opportunity with PerspectivX should be evaluated.' },
        valueMapping: 'External: $0 (deal sweetener) → 10 engagements × $20K = $0–$200K.',
        leadingIndicators: [
          'Research and training teams report MagpAI simulations are realistic enough to inform actual strategy decisions (measured through structured user feedback surveys)',
          'Engagement volume grows quarter-over-quarter, indicating organic demand rather than one-time experimentation',
        ],
        valueEstimate: 'Low: $0 (currently more of a deal sweetener / demo tool). High: 10 engagements × $20K = $200K.',
        assumptions: [
          'Personas are data-grounded, not generic',
          'Users find the simulations realistic enough to be useful',
          'The use case is distinct enough from PerspectivX to justify two separate products — or the two are consolidated',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 30: BLOOMLAB
  // ================================================================
  {
    id: 'bloomlab',
    title: 'BloomLab — Real-Time Market Research',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ProductValueStorySlide',
      props: {
        sectionLabel: 'Product Deep Dive',
        heading: 'BloomLab — Real-Time Market Research',
        description: 'AI-driven, real-time chat sessions with actual participants that merge qualitative depth with quantitative rigor. A new approach to market research, not an automation of an old one.',
        users: 'Market research teams, brand strategy leads, insights groups.',
        replaces: 'Traditional qualitative focus groups and online bulletin boards ($100K+ per study, 4–8 weeks).',
        defensibility: { rating: 'MODERATE', text: 'Novel methodology — AI-driven real-time research with actual participants — is genuinely differentiated from Verba (existing transcripts) and MagpAI (simulated stakeholders). Value depends on proving insight quality parity with traditional qual.' },
        valueMapping: 'External: 8–18 engagements × $25K–$45K = $200K–$810K.',
        leadingIndicators: [
          'Insight quality scores (rated by clients or validated against traditional methods running in parallel) meet or exceed traditional qual benchmarks',
          'Client repeat usage rate exceeds 40%, indicating BloomLab is trusted as a standalone methodology',
        ],
        valueEstimate: 'Low: 8 engagements × $25K = $200K. High: 18 engagements × $45K = $810K.',
        assumptions: [
          'The methodology demonstrably produces insight quality comparable to traditional qual research',
          'Clients are willing to pay a premium for speed even if the methodology is unfamiliar',
        ],
      },
    },
  },
]

export default slides
