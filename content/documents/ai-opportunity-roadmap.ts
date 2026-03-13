/**
 * MKG: AI Opportunity & Roadmap Assessment - Document Content (v4 — Edit Guide Applied)
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 *
 * Updated: March 13, 2026 per MKG_AI_Assessment_EDIT_GUIDE
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
        { value: 'March 13, 2026', label: 'Last updated' },
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
        summaryText: 'MKG has done more AI work than most companies its size. Across the ION platform, the organization has stood up 15+ internal tools under KINETICS and 7+ client-facing products under DIFFUSION, all connected to a proprietary data backbone. The problem isn\'t ideas — it\'s prioritization, measurement, and speed to value.\n\nRadar Score Rationale: Strategy (6/10) — Strong ideation and leadership engagement, but no single AI product strategy owner and no centralized prioritization. Data Assets (7/10) — Engagement data is genuinely proprietary; claims data is commercially available and should not be positioned as a moat. Workflow Integration (6/10) — Route Reagent and Annotation Activation are embedded in real workflows, but most other tools remain standalone. External Differentiation (6/10) — Pantheon and Plexus are defensible; Verba, MagpAI, and PerspectivX carry displacement risk. Governance (8/10) — Multi-layered governance is impressive for a ~$150M company. Measurement (4/10) — 81qd does not measure ROI on analytics engagements; no enterprise AI KPI dashboard exists.',
        radarChart: {
          labels: ['Strategy', 'Data Assets', 'Workflow Integration', 'External Differentiation', 'Governance', 'Measurement'],
          values: [6, 7, 6, 6, 8, 4],
          height: 250,
        },
        strengths: [
          'Proprietary HCP engagement data (advisory boards, speaker bureaus, MSL interactions) — genuinely hard to replicate',
          'Deep medical & compliance expertise embedded across teams; two decades of medical affairs experience',
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
  // SLIDE 3: EVALUATION FRAMEWORK (NEW — inserted after Executive Summary)
  // ================================================================
  {
    id: 'evaluation-framework',
    title: 'Evaluation Framework',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 01b',
      heading: 'How We Evaluated MKG\'s AI Portfolio',
      columns: 4,
      items: [
        { icon: 'target', title: '1. Business-First Lens', description: 'Understand MKG\'s revenue model, cost structure, and competitive positioning before evaluating any AI initiative.' },
        { icon: 'chart', title: '2. Value Pool ID', description: 'Map the internal (cost, speed, productivity) and external (pricing power, speed-to-close) value pools AI can address.' },
        { icon: 'trending', title: '3. Business Drivers', description: 'Identify the economic sensitivities and workflow areas where AI creates the highest-leverage P&L impact.' },
        { icon: 'database', title: '4. Initiative Review', description: 'Inventory all 15+ active AI initiatives across KINETICS (internal) and DIFFUSION (external) with current status.' },
        { icon: 'search', title: '5. Initiative Deep Dive', description: 'Unpack each initiative: what it does, who uses it, defensibility assessment, and value potential scoring with rationale.' },
        { icon: 'calculator', title: '6. Value Quantification', description: 'Characterize and quantify value drivers, separating internal productivity (labor cost equivalent) from external revenue upside.' },
        { icon: 'rocket', title: '7. Prioritization & Roadmap', description: 'Focus the portfolio through consolidation, leading indicator measurement, and a phased execution plan.' },
      ],
      insightBox: {
        label: 'Framework',
        text: 'This framework moves from understanding the business to quantifying AI value to building a focused execution roadmap.',
      },
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
        sections: [
          {
            title: 'Tier 1: Editorial Pipeline (Core Value Drivers)',
            rows: [
              { name: 'DynAImic Content', description: 'AI-assisted draft generation across marketing channels from content briefs.', valueSource: 'Cost + Speed', valuePotential: 'High' },
              { name: 'Annotation Activation', description: 'Auto-links claims to supporting literature for MLR preparation.', valueSource: 'Speed + Productivity', valuePotential: 'High' },
              { name: 'Compliance Core', description: 'Flags FDA compliance risks — off-label language, fair balance, guideline adherence.', valueSource: 'Cost + Speed', valuePotential: 'High' },
              { name: 'Route Reagent', description: 'Validates content against brand style rules and routing comments during editorial review.', valueSource: 'Speed + Productivity', valuePotential: 'High' },
            ],
          },
          {
            title: 'Tier 2: Insight & Knowledge Tools',
            rows: [
              { name: 'Practice Master', description: 'Harmonizes data sources to map HCP affiliations and resolve conflicting records.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
              { name: 'Sentiment Tracker', description: 'NLP-based tracking of HCP belief and sentiment shifts from MKG engagement data.', valueSource: 'Pricing Power', valuePotential: 'Moderate' },
              { name: 'Undermind', description: 'Deep scientific literature search and research surrogate.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Brand Bonds', description: 'Brand-trained AI assistant that synthesizes cross-functional team knowledge.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Conversation Centrifuge', description: 'Structures and summarizes expert interviews and advisory board discussions.', valueSource: 'Speed', valuePotential: 'Moderate' },
            ],
          },
          {
            title: 'Tier 3: General Productivity & Workflow Tools',
            rows: [
              { name: 'ION Portal', description: 'Central AI infrastructure and data access layer.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'ChatMKG / Secure LLM', description: 'Enterprise AI interface with SSO, transcription, web search.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Case Catalyst', description: 'Searches and retrieves relevant past case studies.', valueSource: 'Productivity', valuePotential: 'Low–Moderate' },
              { name: 'Meeting Nucleus', description: 'Meeting transcription and summarization.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Brief', description: 'AI-assisted strategic brief generation.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Synthesis', description: 'Cross-document strategic synthesis and analysis.', valueSource: 'Productivity', valuePotential: 'Low' },
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
      componentId: 'DiffusionSlide',
      props: {
        sectionLabel: 'Section 03 — External',
        heading: 'DIFFUSION — Client-Facing AI Products',
        subtitle: 'Tier 4: Revenue-generating and differentiating AI offerings',
        table: {
          headers: ['Initiative', 'Positioning', 'Revenue Model', 'Displacement Risk'],
          rows: [
            { name: 'Pantheon', positioning: 'HCP search / profiling (subscription)', revenue: 'Subscription + Project', risk: 'Lower' },
            { name: 'Plexus', positioning: 'Influence mapping and network analytics', revenue: 'Core analytics (bundled)', risk: 'Lower' },
            { name: 'PerspectivX', positioning: 'Concept scoring via HCP persona simulation', revenue: 'Add-on', risk: 'Moderate' },
            { name: 'Verba', positioning: 'Advisory board synthesis', revenue: 'Embedded', risk: 'Higher' },
            { name: 'MagpAI', positioning: 'Stakeholder simulation / conversational intel', revenue: 'Project-based', risk: 'Moderate' },
            { name: 'BloomLab', positioning: 'Real-time qual/quant hybrid research', revenue: 'Project-based', risk: 'Lower' },
            { name: 'Orion', positioning: 'Patient identification analytics', revenue: 'Analytics', risk: 'Moderate' },
            { name: 'InfluenceLink', positioning: 'Dissemination via Plexus-identified leaders', revenue: 'Platform', risk: 'Lower' },
          ],
        },
        quadrantChart: {
          title: 'Portfolio Prioritization',
          icon: 'Zap',
          xLabel: 'Complexity -->',
          yLabel: 'Strategic Value -->',
          quadrants: ['Accelerate', 'Double Down', 'Reposition', 'Cut'],
          points: [
            { label: 'Plexus', x: 0.7, y: 0.9 },
            { label: 'Pantheon', x: 0.6, y: 0.85 },
            { label: 'BloomLab', x: 0.5, y: 0.8 },
            { label: 'InfluenceLink', x: 0.45, y: 0.7 },
            { label: 'Orion', x: 0.65, y: 0.45 },
            { label: 'PerspectivX', x: 0.55, y: 0.4 },
            { label: 'MagpAI', x: 0.4, y: 0.35 },
            { label: 'Verba', x: 0.35, y: 0.25 },
          ],
          height: 290,
        },
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
            { label: 'HCP Engagement Data', value: 9 },
            { label: 'Medical Expertise', value: 8 },
            { label: 'Integrated Platform', value: 7 },
            { label: 'Publication Data', value: 6 },
            { label: 'Claims / RWD', value: 4 },
            { label: 'Model Sophistication', value: 2 },
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
          outputs: ['Pantheon', 'Plexus', 'PerspectivX', 'Orion', 'Sentiment Tracker', 'Practice Master', 'MagpAI', 'Verba', 'BloomLab'],
        },
        insightText: "ION powers essentially all of MKG's AI products — it is the platform layer, not a product-specific backend. HCP engagement data is MKG's most defensible asset — longitudinal data across thousands of HCP interactions cannot be purchased or replicated. Claims data is commercially available and should NOT be positioned as a moat. Every AI product should be evaluated: 'Does this use data a competitor cannot buy?'",
      },
    },
  },

  // ================================================================
  // SLIDE 8: AI VALUE FRAMEWORK (Section 5)
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
  // SLIDE 9: PANTHEON (Section 7)
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
        valueEstimate: 'External: Low — 8 customers × $80K = $640K | High — 15 customers × $120K = $1.8M. Internal: Contributes to HCP Profiling/Data Analysts — 25 FTEs × $105K × 10–20% uplift = $263K–$525K (shared with Practice Master).',
        assumptions: [
          'Proprietary engagement data layer is meaningfully richer than IQVIA or H1 alone',
          'Subscription price point ($80K–$120K) validated with at least 5 pilot customers',
          'Retention exceeds 75% at renewal — requires demonstrating ongoing usage, not just initial novelty',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 10: PLEXUS (Section 8)
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
  // SLIDE 11: PRACTICE MASTER (Section 9)
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
        replaces: 'Manual verification of HCP affiliations across NPI registries, institutional websites, and proprietary databases — a tedious process currently consuming several hours per profiling project.',
        defensibility: { rating: 'MODERATE', text: 'Addresses a narrower analyst pool (~25 FTEs). Underlying NPI and institutional data is commercially available from competitors. Value comes from the harmonization and disambiguation layer — resolving conflicting affiliations across sources — not from the data itself.' },
        valueMapping: 'Internal: Contributes to HCP Profiling/Data Analysts — $263K–$525K productivity value (shared with Pantheon). Standalone contribution is modest.',
        leadingIndicators: [
          'Hours saved per profiling project are measurable and consistent (target: 2+ hours per project versus manual verification baseline)',
          'Downstream correction rate on affiliation data drops below 5%, indicating analysts trust the tool\'s output without re-verifying manually',
        ],
        valueEstimate: 'Practice Master\'s value is captured in the internal productivity model under "HCP Profiling / Data Analysts" (25 FTEs, $105K comp, 10–20% uplift = $263K–$525K). Shared with Pantheon. Standalone contribution is modest.',
        assumptions: [
          'The harmonization layer is accurate enough that analysts trust it without re-verifying manually',
          'The tool is integrated into the standard profiling workflow, not a side step',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 12: SENTIMENT TRACKER (Section 10)
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
        users: '81qd analysts, brand strategy teams, market research leads. Used to monitor therapeutic area sentiment, identify emerging resistance or receptivity to messaging, and inform campaign design.',
        replaces: 'Periodic qualitative research (typically quarterly or semi-annual) that provides point-in-time snapshots. Sentiment Tracker aims for continuous monitoring.',
        defensibility: { rating: 'MODERATE', text: 'High strategic value when applied to proprietary engagement data (advisory boards, speaker bureaus, MSL interactions). Revenue mechanism is indirect — share-of-wallet lift on existing client relationships — which makes Year 1 measurement harder. Defensibility depends entirely on using MKG\'s internal data, not publicly available text.' },
        valueMapping: 'External: 0.3–0.8% lift on ~$50M relevant revenue base = $150K–$400K.',
        leadingIndicators: [
          'Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals on at least 5 accounts within 6 months',
          'Upsell or renewal rates on sentiment-informed accounts show measurable positive variance versus non-informed accounts',
        ],
        valueEstimate: 'Approximately $50M of MKG\'s revenue comes from clients where HCP sentiment data is directly relevant. A 0.3–0.8% lift on that base yields $150K–$400K in incremental annual revenue.',
        assumptions: [
          'The tool is fed by MKG\'s proprietary engagement data, not just public sources',
          'Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 13: CHATMKG (Section 11)
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
        valueEstimate: '200 FTEs at $95K with 2–5% productivity uplift = $380K–$950K. The wide range reflects a genuine strategic question: the low end assumes ChatMKG is just another AI chat tool; the high end assumes it becomes the primary interface to MKG\'s proprietary data.',
        assumptions: [
          'ChatMKG connects to the ION Data Lake and brand knowledge bases, making it meaningfully more useful than external alternatives',
          'User experience is competitive with consumer-grade AI tools',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 14: VERBA (Section 12)
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
        description: 'Transforms transcripts from advisory boards, investigator meetings, and expert discussions into structured intelligence. Extracts key themes, unmet needs, objections, treatment patterns, and sentiment shifts. Provides thematic tagging, comparative analysis across boards over time, and executive summaries.',
        users: 'Client-facing — brand teams, medical affairs teams, market access leaders, commercial strategy teams.',
        replaces: 'Manual synthesis of advisory board transcripts — currently a labor-intensive process requiring analysts to review hours of discussion and produce structured reports over days or weeks (1–2 week baseline).',
        defensibility: { rating: 'MODERATE', text: 'Core functionality (transcript to structured summary) is increasingly commoditized — Claude, GPT-4o can do this well. Defensibility requires integration with MKG\'s proprietary longitudinal data: cross-referencing statements against clinical evidence, comparing sentiment across boards over time, and connecting insights to prescribing behavior data from ION. Without those layers, Verba is an LLM wrapper.' },
        valueMapping: 'Internal: 40 FTEs × $115K × 8–15% uplift = $368K–$690K (shared with BloomLab, PerspectivX). External: $0 (deal sweetener) → 15 boards × $12K = $0–$180K.',
        leadingIndicators: [
          'Time from advisory board to client deliverable drops below 3 business days on Verba-assisted projects (from current 1–2 week baseline)',
          'Clients specifically request Verba as part of engagement scope, rather than receiving it as a default — indicating perceived differentiation',
        ],
        valueEstimate: 'Internal: Research Analysts/Strategists — 40 FTEs × $115K × 8–15% uplift = $368K–$690K (shared with BloomLab, PerspectivX). External: Low — $0 (likely a deal sweetener) | High — 15 boards × $12K = $180K.',
        assumptions: [
          'Verba connects to proprietary MKG data to deliver analysis that a standalone LLM cannot replicate',
          'Output quality is high enough that medical reviewers don\'t spend as much time correcting as they saved',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 15: PERSPECTIVX (Section 13)
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
        description: 'Simulates real-world feedback from HCPs by analyzing campaign concepts through the lens of each treater\'s unique attitudes, beliefs, and cognitive filters. Uses data-based personas modeled from qualitative and behavioral data sourced from the ION Data Lake. Outputs concept strength scores, strategic fit analysis, and optimization guidance.',
        users: 'Brand teams, creative agencies, commercial strategy teams at pharma companies. Used during campaign development to test concepts before committing to production.',
        replaces: 'Traditional qualitative concept testing — typically involving recruitment of HCP panels, facilitated interviews or focus groups. This process costs $75K–$150K and takes 6–8 weeks. PerspectivX pricing ($15K–$30K per test) is a fraction, making adoption easier to justify.',
        defensibility: { rating: 'MODERATE-HIGH', text: 'Differentiated if personas are built on real MKG research data from SOUND, 81qd behavioral data, and advisory board engagement data. The key validation question: do PerspectivX scores correlate with actual market research outcomes? If yes, this is a powerful and defensible sales tool. If no, it needs recalibration before scaling.' },
        valueMapping: 'External: 8–20 tests × $15K–$30K = $120K–$600K.',
        leadingIndicators: [
          'PerspectivX concept scores show validated directional correlation with actual market performance on at least 3 retrospective case studies',
          'Client repeat usage rate exceeds 50% — indicating teams that try it find it useful enough to come back',
        ],
        valueEstimate: 'Low: 8 tests × $15K = $120K. High: 20 tests × $30K = $600K. These prices represent a fraction of traditional qual research cost ($75K–$150K per study).',
        assumptions: [
          'Personas are grounded in MKG\'s proprietary data, not generic LLM approximations',
          'Concept scores show validated correlation to real market outcomes (even directional correlation is meaningful)',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 16: MAGPAI (Section 14)
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
        description: 'An intelligence-driven platform that replicates authentic communication styles of HCPs, patients, and payers through AI simulation. Supports observational research to uncover unmet needs and alignment gaps, and provides interactive training avatars for sales reps and MSLs to practice messaging before field execution.',
        users: 'Brand teams, commercial strategy teams, training departments. Used for stakeholder research, message testing, and sales force preparation.',
        replaces: 'Traditional stakeholder research interviews ($50K–$100K per study, 4–6 weeks) and in-person sales training role-plays. Faces competition from specialized sales enablement platforms (ZS/Symmetry, Rehearsal, Second Nature) on the training use case.',
        defensibility: { rating: 'MODERATE', text: 'Significant overlap with PerspectivX — both create AI-simulated HCP/stakeholder interactions from persona data. Differentiated by the output format (conversational simulation and training avatars vs. concept scores) but the underlying data and model are shared. Consolidation opportunity with PerspectivX should be evaluated.' },
        valueMapping: 'External: $0 (deal sweetener) → 10 engagements × $20K = $0–$200K.',
        leadingIndicators: [
          'Research and training teams report MagpAI simulations are realistic enough to inform actual strategy decisions (measured through structured user feedback surveys)',
          'Engagement volume grows quarter-over-quarter, indicating organic demand rather than one-time experimentation',
        ],
        valueEstimate: 'Low: $0 (currently more of a deal sweetener / demo tool). High: 10 engagements × $20K = $200K. Lower volume and price versus PerspectivX reflects earlier stage.',
        assumptions: [
          'Personas are data-grounded, not generic',
          'Users find the simulations realistic enough to be useful',
          'The use case is distinct enough from PerspectivX to justify two separate products — or the two are consolidated',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 17: BLOOMLAB (Section 15)
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
        description: 'An AI-driven, real-time chat session that merges qualitative depth with quantitative rigor. Facilitates adaptive, consensus-building research sessions with actual participants that overcome common limitations of traditional market research — respondent fatigue, social desirability bias, and rigid discussion guides. A new approach to market research, not an automation of an old one.',
        users: 'Market research teams, brand strategy leads, insights groups. Used as a research methodology for concept exploration, message testing, and consumer insight generation.',
        replaces: 'Traditional qualitative focus groups and online bulletin boards — typically costing $100K+ per study and taking 4–8 weeks including recruitment, facilitation, and analysis.',
        defensibility: { rating: 'MODERATE', text: 'Novel methodology — AI-driven real-time research sessions with actual participants — is genuinely differentiated from both Verba (which processes existing transcripts) and MagpAI (which simulates stakeholders). Value depends on proving insight quality parity with traditional qual. If quality holds, BloomLab has strong positioning. If quality is perceived as lower, it becomes a "quick and cheap" option without pricing power.' },
        valueMapping: 'External: 8–18 engagements × $25K–$45K = $200K–$810K.',
        leadingIndicators: [
          'Insight quality scores (rated by clients or validated against traditional methods running in parallel) meet or exceed traditional qual benchmarks',
          'Client repeat usage rate exceeds 40%, indicating BloomLab is trusted as a standalone methodology rather than a supplement',
        ],
        valueEstimate: 'Low: 8 engagements × $25K = $200K. High: 18 engagements × $45K = $810K. Novel methodology requires parallel validation before clients trust it standalone.',
        assumptions: [
          'The methodology demonstrably produces insight quality comparable to traditional qual research',
          'Clients are willing to pay a premium for speed even if the methodology is unfamiliar',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 18: SUPER PRODUCT VISION (Section 6 — moved after deep dives)
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
        problems: [
          'End-to-end content lifecycle for customers — one onboarding, one integration, one training cycle. "Brief to MLR-ready" instead of four modular tools.',
          'Faster cycle times through eliminated handoffs — content flows through all four stages without manual export/import. Target: reduce content-to-MLR from ~14 days to ~8 days.',
          'Subscription pricing power — unified platform commands annual licensing versus per-tool add-ons. Higher switching costs.',
          '30–40% engineering efficiency — eliminates duplicated infrastructure (document ingestion, LLM routing, brand context, auth) across four separate codebases.',
          'Unified brand knowledge base — brand rules, style guides, and past MLR decisions loaded once and available to all stages.',
          'Stronger competitive positioning — one AI-powered editorial backbone for pharma content is more compelling than a collection of helper tools.',
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
  // SLIDE 19: VALUE QUANTIFICATION (Section 16)
  // ================================================================
  {
    id: 'value-quantification',
    title: 'Value Quantification',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ValueQuantificationSlide',
      props: {
        sectionLabel: 'Value Quantification',
        heading: 'Value Quantification',
        subtitle: 'Internal productivity + External revenue upside',
        internalTable: {
          headers: ['Workflow Area', 'FTEs', 'Comp', 'Primary Value Driver', 'Low Uplift', 'Low Value', 'High Uplift', 'High Value'],
          rows: [
            { area: 'Medical Writers', ftes: '80', comp: '$120K', target: 'Cycle time: brief to first draft', lowUplift: '8%', lowValue: '$768K', highUplift: '15%', highValue: '$1,440K' },
            { area: 'Editorial / QA', ftes: '30', comp: '$110K', target: 'QA pre-check: errors before review', lowUplift: '15%', lowValue: '$495K', highUplift: '25%', highValue: '$825K' },
            { area: 'Regulatory / Compliance', ftes: '20', comp: '$140K', target: 'Risk prevention: MLR rejections', lowUplift: '5%', lowValue: '$140K', highUplift: '12%', highValue: '$336K' },
            { area: 'HCP Profiling / Data', ftes: '25', comp: '$105K', target: 'Research speed: HCP profiling time', lowUplift: '10%', lowValue: '$263K', highUplift: '20%', highValue: '$525K' },
            { area: 'Influence / Network', ftes: '15', comp: '$130K', target: 'Analysis depth: influence mapping', lowUplift: '5%', lowValue: '$98K', highUplift: '12%', highValue: '$234K' },
            { area: 'Research / Strategy', ftes: '40', comp: '$115K', target: 'Synthesis speed: research to deliverable', lowUplift: '8%', lowValue: '$368K', highUplift: '15%', highValue: '$690K' },
            { area: 'Other Knowledge Workers', ftes: '200', comp: '$95K', target: 'General productivity: knowledge work', lowUplift: '2%', lowValue: '$380K', highUplift: '5%', highValue: '$950K' },
          ],
          totalLow: '$2.5M',
          totalHigh: '$5.0M',
        },
        externalTable: {
          headers: ['Product', 'Low', 'High'],
          rows: [
            { product: 'Pantheon (subscription)', lowAssumptions: '8 × $80K', lowRevenue: '$640K', highAssumptions: '15 × $120K', highRevenue: '$1,800K' },
            { product: 'Plexus (AI premium)', lowAssumptions: '8 × $20K', lowRevenue: '$160K', highAssumptions: '18 × $40K', highRevenue: '$720K' },
            { product: 'PerspectivX (concept testing)', lowAssumptions: '8 × $15K', lowRevenue: '$120K', highAssumptions: '20 × $30K', highRevenue: '$600K' },
            { product: 'Verba (advisory premium)', lowAssumptions: '$0 (sweetener)', lowRevenue: '$0', highAssumptions: '15 × $12K', highRevenue: '$180K' },
            { product: 'MagpAI (simulation)', lowAssumptions: '$0 (sweetener)', lowRevenue: '$0', highAssumptions: '10 × $20K', highRevenue: '$200K' },
            { product: 'BloomLab (AI research)', lowAssumptions: '8 × $25K', lowRevenue: '$200K', highAssumptions: '18 × $45K', highRevenue: '$810K' },
            { product: 'Sentiment Tracker (lift)', lowAssumptions: '0.3% on $50M', lowRevenue: '$150K', highAssumptions: '0.8% on $50M', highRevenue: '$400K' },
          ],
          totalLow: '$1.3M',
          totalHigh: '$4.7M',
        },
        combinedSummary: [
          { category: 'Internal Productivity Value', low: '$2.5M', high: '$5.0M' },
          { category: 'External Revenue Upside', low: '$1.3M', high: '$4.7M' },
        ],
        totalOpportunity: { low: '$3.8M', high: '$9.7M', pctLow: '2.5%', pctHigh: '6.5%' },
      },
    },
  },

  // ================================================================
  // SLIDE 20: LEADING INDICATORS & MEASUREMENT (Section 17)
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
          { category: 'Adoption', indicator: 'Daily/weekly active users per tool', whyItMatters: 'If people aren\'t using the tools, nothing else matters' },
          { category: 'Adoption', indicator: '% of eligible projects using AI-assisted workflow', whyItMatters: 'Measures penetration into actual work, not just availability' },
          { category: 'Cycle Time', indicator: 'Days from brief to MLR submission', whyItMatters: 'Editorial pipeline\'s north star metric' },
          { category: 'Cycle Time', indicator: 'Rounds of revision before approval', whyItMatters: 'Directly tied to Route Reagent / Annotation value' },
          { category: 'Quality', indicator: 'First-pass MLR acceptance rate', whyItMatters: 'If AI pre-checks work, fewer submissions get bounced' },
          { category: 'Quality', indicator: 'Annotation error rate', whyItMatters: 'Sample-audit AI citations; measures output quality' },
          { category: 'Client', indicator: 'Proposal win rate on AI-featured pitches', whyItMatters: 'Measures whether AI tools help close deals' },
          { category: 'Client', indicator: 'Client NPS on AI-enhanced deliverables', whyItMatters: 'Post-engagement survey on AI-enhanced projects' },
          { category: 'Revenue', indicator: 'Subscription attach rate (Pantheon)', whyItMatters: 'Leading indicator of transaction → subscription shift' },
        ],
        laggingIndicators: [
          { category: 'Financial', indicator: 'Revenue from AI-enhanced engagements', timeline: '6–12 months' },
          { category: 'Financial', indicator: 'Gross margin improvement from productivity', timeline: '6–12 months' },
          { category: 'Financial', indicator: 'EBITDA uplift attributable to AI', timeline: '12+ months' },
          { category: 'Strategic', indicator: 'Revenue mix shift (transaction → subscription)', timeline: '12–24 months' },
        ],
        recommendation: 'Build an enterprise AI KPI dashboard tracking leading indicators weekly. Review in existing Monthly Senior Leadership meeting. Create venues at all levels for reflection — front-line teams need space to discuss what\'s working, what\'s frustrating, and what they\'d change. Expect people to need time to choose how work will change; AI adoption is a change management challenge, not a technology deployment.',
      },
    },
  },

  // ================================================================
  // SLIDE 21: GOVERNANCE & CHANGE MANAGEMENT (Section 18)
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
            { dimension: 'Leadership Alignment (8/10): CEO, CSO, CCDO actively engaged. Weekly AI committee, biweekly advocates, monthly senior review. Could reach 9/10 with a dedicated AI PM.', score: 8, color: 'green' },
            { dimension: 'AI Fluency (5/10): Strong pockets in 81qd, digital, and medical teams. Uneven across 13 sub-brands. Risk: tools built by enthusiasts, adopted by no one else.', score: 5, color: 'yellow' },
            { dimension: 'Product Focus (4/10): Too many branded products without a single strategy owner. Super product consolidation + AI PM hire would directly address this.', score: 4, color: 'red' },
            { dimension: 'KPI Discipline (2/10): Single biggest gap. No enterprise AI dashboard. No standardized leading indicators. Without measurement, prioritization is based on enthusiasm, not evidence.', score: 2, color: 'red' },
          ],
        },
        requiredActions: {
          title: 'Required Actions & Meeting Cadence',
          items: [
            { action: 'Hire Senior AI Product Manager', urgency: 'Immediate', description: 'Single point of accountability for requirements, roadmap prioritization, portfolio consolidation, and the enterprise KPI dashboard.' },
            { action: 'Weekly AI Product Standup', urgency: 'Month 1', description: 'Backlog prioritization, blockers, adoption metrics. Attendees: AI PM, engineering leads, medical SME representative.' },
            { action: 'Monthly Senior Leadership AI Review', urgency: 'Month 2', description: 'KPI dashboard review, investment decisions, portfolio prioritization. Attendees: CEO, CSO, CCDO, CFO, AI PM.' },
            { action: 'Enterprise AI KPI Dashboard', urgency: 'Month 3', description: 'Built on leading indicators. Updated weekly. Visible to senior leadership. 3–5 indicators tracked automatically.' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 22: ROADMAP & FINAL RECOMMENDATIONS (Section 19)
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
]

export default slides
