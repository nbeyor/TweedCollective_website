/**
 * MKG: AI Opportunity & Roadmap Assessment - Document Content (v4)
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'ai-opportunity-roadmap'

// ============================================
// Slide Content Data
// ============================================

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
      subtitle: 'Outside-In Strategic Evaluation — v3',
      metrics: [
        { value: 'MKG Leadership', label: 'Prepared for' },
        { value: 'Tweed Collective', label: 'Prepared by' },
        { value: 'March 2026', label: 'Date' },
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
        summaryText: 'MKG has done more AI work than most companies its size. Across the ION platform, the organization has stood up 15+ internal tools under KINETICS and 7+ client-facing products under DIFFUSION, all connected to a proprietary data backbone. The problem isn\'t ideas. It\'s prioritization, measurement, and speed to value. Fifteen branded AI initiatives across $150M of revenue is too much surface area. AI maturity level: Upper-Mid / Structured & Scaling. Total estimated Year 1 AI opportunity: $5.0M–$13.6M (3.3–9.1% of revenue).',
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
  // SLIDE 3: BUSINESS CONTEXT & COMPETITIVE LANDSCAPE (Section 2)
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
  // SLIDE 4: AI INITIATIVE INVENTORY -- KINETICS (Section 3 Internal)
  // ================================================================
  {
    id: 'kinetics',
    title: 'AI Initiatives -- Internal (KINETICS)',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AssessmentTableSlide',
      props: {
        sectionLabel: 'Section 03 — Internal',
        heading: 'AI Initiative Inventory — KINETICS',
        subtitle: 'Internal tools organized by tier',
        callout: 'The four Tier 1 tools touch the same content creation and review pipeline. Section 6 presents the case for unifying them into a single integrated platform.',
        sections: [
          {
            title: 'Tier 1: Future-State AI Editorial Pipeline (Core Value Drivers)',
            rows: [
              { name: 'DynAImic Content', description: 'Generates draft marketing content across channels. Combination of tools and workflows designed to enhance team productivity.', valueSource: 'Speed + Productivity', valuePotential: 'High' },
              { name: 'Annotation Activation', description: 'Auto-links claims to supporting literature. Automates annotation prior to editorial fact-checking and MLR submissions.', valueSource: 'Productivity + Speed', valuePotential: 'High' },
              { name: 'Compliance Core', description: 'Flags regulatory and FDA compliance risks. Scans for off-label language, fair balance issues, and guideline adherence.', valueSource: 'Cost + Risk Reduction', valuePotential: 'High' },
              { name: 'Route Reagent', description: 'Validates content against style and brand rules. Performs preliminary quality checks during editorial review.', valueSource: 'Cost + Speed', valuePotential: 'High' },
            ],
          },
          {
            title: 'Tier 2: Supporting Insight & Knowledge Tools',
            rows: [
              { name: 'Practice Master', description: 'Harmonizes data sources to map HCP institutional relationships and distinguish primary from honorary affiliations.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
              { name: 'Sentiment Tracker', description: 'NLP-based tracking of HCP sentiment shifts using MKG\'s own engagement data.', valueSource: 'Strategic Insight', valuePotential: 'Moderate' },
              { name: 'Undermind', description: 'Deep scientific literature searches as a research surrogate.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
              { name: 'Brand Bonds', description: 'Brand-trained AI assistant synthesizing cross-functional team information.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Conversation Centrifuge', description: 'Summarizes expert interviews and advisory board discussions into structured insights.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
            ],
          },
          {
            title: 'Tier 3: General Productivity & Workflow Tools',
            rows: [
              { name: 'ION Portal', description: 'Central hub and interface for MKG AI tools and data.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'ChatMKG', description: 'Custom multimodal AI workspace with secure model access.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Case Catalyst', description: 'Searchable knowledge base for past case studies.', valueSource: 'Productivity', valuePotential: 'Low–Moderate' },
              { name: 'Meeting Nucleus', description: 'AI-driven meeting transcription with structured outputs.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Brief', description: 'Reviews and strengthens project briefs.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Synthesis', description: 'Converts ideas into structured project plans.', valueSource: 'Productivity', valuePotential: 'Low' },
            ],
          },
        ],
        cards: [
          { name: 'DynAImic Content', description: 'AI-assisted draft generation across channels', icon: 'Rocket', highlight: true },
          { name: 'Annotation Activation', description: 'Auto-citation and reference linking', icon: 'Layers', highlight: true },
          { name: 'Compliance Core', description: 'Regulatory flag detection + MLR readiness', icon: 'AlertCircle', highlight: true },
          { name: 'Route Reagent', description: 'Brand/style validation + QA pre-check', icon: 'Brain', highlight: true },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 5: AI INITIATIVE INVENTORY -- DIFFUSION (Section 3 External)
  // ================================================================
  {
    id: 'diffusion',
    title: 'AI Initiatives -- Client-Facing (DIFFUSION)',
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
            { name: 'Pantheon', positioning: 'HCP search / profiling (syndicated)', revenue: 'Subscription + Project', risk: 'Lower' },
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
  // SLIDE 6: DIFFERENTIATING ASSETS & MOAT (Section 4)
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
        subtitle: 'Proprietary vs. commercially available data — where the real moat is',
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
          title: 'Data Flow — ION Platform',
          icon: 'Database',
          sources: ['Advisory Boards', 'Speaker Bureau', 'MSL Interactions', 'HCP Sentiment', 'Engagement Data'],
          outputs: ['Pantheon', 'Plexus', 'PerspectivX'],
        },
        insightText: "HCP engagement data is MKG's most defensible asset — longitudinal data across thousands of HCP interactions cannot be purchased or replicated. Claims data is commercially available and should NOT be positioned as a moat. Every AI product should be evaluated: 'Does this use data a competitor cannot buy?'",
      },
    },
  },

  // ================================================================
  // SLIDE 7: AI VALUE FRAMEWORK (Section 5)
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
          { bucket: 'Cost', definition: 'Reduce labor cost per deliverable. AI eliminates rework, catches errors earlier, and reduces hours per output.', kpis: 'Hours per project; cost per deliverable; vendor spend reduction' },
          { bucket: 'Speed', definition: 'Reduce cycle time from draft to delivery. AI compresses the timeline by automating sequential steps.', kpis: 'Days from brief to final; rounds of revision; time to first response' },
          { bucket: 'Productivity', definition: 'Enable more output per FTE. Existing staff handle higher volume without proportional headcount growth.', kpis: 'Deliverables per employee per month; concurrent projects per team' },
        ],
        externalBuckets: [
          { bucket: 'Pricing Power', definition: 'Command premium pricing via AI-differentiated capabilities. When AI makes the offering faster, more accurate, or analytically richer, MKG can charge more.', kpis: 'Price per engagement vs. prior year; gross margin on AI-enhanced offerings' },
          { bucket: 'Speed-to-Close', definition: 'Reduce time from prospect interest to signed engagement. AI-powered tools that deliver faster results shorten the sales cycle.', kpis: 'Proposal-to-signed-deal days; trial start-up time' },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 8: SUPER PRODUCT VISION (Section 6)
  // ================================================================
  {
    id: 'super-product',
    title: 'AI Editorial Platform Vision',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SuperProductSlide',
      props: {
        sectionLabel: 'Section 06',
        heading: 'Super Product Vision: The AI Editorial Platform',
        problems: [
          'Redundant infrastructure — each tool independently manages doc ingestion, LLM routing, brand context, and auth',
          'Fragmented UX — no shared state between tools; manual handoffs introduce delay and error',
          'Competing roadmaps — four product backlogs pulling from the same pool of engineering and medical SME time',
          'Weaker positioning — selling four modular tools is harder than one platform that handles the full content lifecycle',
        ],
        stages: [
          { name: 'Stage 1: Create', component: 'DynAImic Content', description: 'AI-assisted draft generation across channels from brief' },
          { name: 'Stage 2: Annotate', component: 'Annotation Activation', description: 'Auto-citation + reference linking to literature' },
          { name: 'Stage 3: Check', component: 'Compliance Core', description: 'Regulatory flag detection + MLR readiness scoring' },
          { name: 'Stage 4: Validate', component: 'Route Reagent', description: 'Brand/style validation + QA pre-check' },
        ],
        features: [
          { feature: 'AI content drafting', source: 'DynAImic', description: 'MLR-ready content from briefs across channels' },
          { feature: 'Citation linking', source: 'Annotation', description: 'Auto-links claims to supporting references' },
          { feature: 'Regulatory flags', source: 'Compliance', description: 'FDA compliance, off-label, fair balance' },
          { feature: 'Style validation', source: 'Route Reagent', description: 'AMA, brand guidelines, routing comments' },
          { feature: 'Customer guardrails', source: 'Combined', description: 'Client MLR standards as configurable rulesets' },
        ],
        efficiencies: [
          { title: 'Single LLM orchestration', description: 'One routing system managing model selection, context, and prompts' },
          { title: 'Shared document model', description: 'Content, annotations, flags, and QA results in one data structure' },
          { title: 'Unified brand knowledge', description: 'Brand rules loaded once, available to all stages' },
          { title: 'One integration surface', description: 'One API, one UI — reduces onboarding and support burden' },
        ],
        valueTable: [
          { area: 'Medical Writers', ftes: '80', lowValue: '$960K', highValue: '$1,920K', target: 'DynAImic Content' },
          { area: 'Editorial / QA', ftes: '30', lowValue: '$495K', highValue: '$990K', target: 'Route Reagent + Annotation' },
          { area: 'Regulatory / Compliance', ftes: '20', lowValue: '$280K', highValue: '$560K', target: 'Compliance Core' },
        ],
        totalLow: '$1,735K',
        totalHigh: '$3,470K',
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
        sectionLabel: 'Section 07',
        heading: 'Pantheon — HCP Search & Profiling',
        description: 'Conversational AI interface for querying HCP datasets in natural language. Provides instant synthesis across publication, clinical trial, and payment data to surface relevant experts in seconds, with integrated visualization and export.',
        users: 'Commercial and medical affairs teams at pharma companies — brand leaders, TLL team leadership, MSL teams, insights/analytics groups.',
        replaces: 'Manual HCP profiling (4–6 weeks, $50K–$75K per project). Also competes with IQVIA, H1 Insights, Definitive Healthcare, and Veeva Compass.',
        defensibility: { rating: 'MODERATE-HIGH', text: 'Integration of proprietary engagement data (advisory board participation, speaker bureau history, sentiment signals) with commercially available data creates richer HCP profiles than standalone vendors. Natural language query is table-stakes; data depth is not.' },
        valueMapping: 'Pricing Power (subscription revenue shifts 81qd from transaction to recurring) + Speed-to-Close (faster HCP identification)',
        leadingIndicators: [
          'Subscription attach rate on eligible customers',
          'Queries per user per month',
          'Renewal rate at 12 months',
          'Competitive win rate on proposals featuring Pantheon',
        ],
        valueEstimate: 'Low: 8 customers × $75K = $600K. High: 18 customers × $125K = $2.25M. Low end requires converting fewer than 10% of eligible 81qd clients to subscription.',
        assumptions: [
          'Proprietary engagement data layer is meaningfully richer than IQVIA or H1 alone',
          'Subscription price point ($75K–$150K) validated with at least 5 pilot customers',
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
        sectionLabel: 'Section 08',
        heading: 'Plexus — Influence Mapping & Network Analytics',
        description: 'Maps clinical influence networks — identifying not just who the key opinion leaders are, but how they\'re connected, who influences whom, and where the leverage points are. Combines clinical, academic, digital, and institutional data to model influence flow across therapeutic areas.',
        users: '81qd analysts, engagement planning teams, commercial strategy leads at pharma companies.',
        replaces: 'Manual network analysis relying on subjective assessments, conference attendance lists, and publication counts.',
        defensibility: { rating: 'HIGH', text: 'Influence network modeling on proprietary engagement data is the most defensible analytics asset MKG has. The models incorporate who actually attended advisory boards, who spoke at which events, who influenced prescribing behavior — data generated by MKG\'s own operations that cannot be purchased externally.' },
        valueMapping: 'Pricing Power (premium analytics commanding higher project values) + Productivity (replaces weeks of manual analysis)',
        leadingIndicators: [
          'Projects delivered using Plexus data',
          'Client-reported time savings on engagement planning',
          'Competitive win rate on proposals featuring influence mapping',
        ],
        valueEstimate: 'Internal: 15 influence analysts at $130K with 8–15% uplift = $156K–$293K. External: 10–20 bundled projects with $25K–$50K AI-enhanced premium = $250K–$1.0M incremental revenue.',
        assumptions: [
          'AI-enhanced Plexus delivers measurably faster or deeper results than current workflow',
          'Clients perceive AI enhancement as valuable enough for 10–15% price premium',
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
        sectionLabel: 'Section 09',
        heading: 'Practice Master — HCP Affiliation Intelligence',
        description: 'An AI-enabled tool that harmonizes multiple data sources to map HCP institutional relationships — distinguishing primary from honorary affiliations, resolving conflicting records, and providing clean affiliation data for profiling and engagement planning.',
        users: '81qd analysts and MedComm teams. Used as an input step for HCP profiling projects and engagement planning.',
        replaces: 'Manual verification of HCP affiliations across NPI registries, institutional websites, and proprietary databases — a tedious process currently consuming several hours per profiling project.',
        defensibility: { rating: 'MODERATE', text: 'The underlying data (NPI, institutional records) is commercially available. The value is in the harmonization and disambiguation layer — resolving conflicting affiliations across sources is genuinely useful but not unique. Competitors like Definitive Healthcare and Veeva offer similar affiliation intelligence.' },
        valueMapping: 'Speed + Productivity (reduces manual research time for affiliation verification)',
        leadingIndicators: [
          'Hours saved per profiling project',
          'Data accuracy improvement rate (measured by downstream corrections needed)',
          'Number of projects using Practice Master vs. manual process',
        ],
        valueEstimate: 'Practice Master\'s value is captured in the internal productivity model under "HCP Profiling / Data Analysts" (25 FTEs, $105K comp, 10–25% uplift). The tool contributes to the $263K–$656K productivity value for that role group alongside Pantheon.',
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
        sectionLabel: 'Section 10',
        heading: 'Sentiment Tracker — HCP Sentiment Analysis',
        description: 'NLP-based tracking of HCP belief and sentiment shifts over time. Monitors evolution of HCP perceptions across therapeutic areas, treatment protocols, and brand messaging — drawing from MKG\'s own engagement activities (advisory boards, speaker bureaus, MSL interactions).',
        users: '81qd analysts, brand strategy teams, market research leads. Used to monitor therapeutic area sentiment, identify emerging resistance or receptivity to messaging, and inform campaign design.',
        replaces: 'Periodic qualitative research (typically quarterly or semi-annual) that provides point-in-time snapshots. Sentiment Tracker aims for continuous monitoring.',
        defensibility: { rating: 'MODERATE', text: 'NLP-based sentiment analysis is increasingly commoditized — off-the-shelf tools can process text for sentiment at scale. MKG\'s advantage is the data source: longitudinal sentiment data from their own advisory boards, speaker bureaus, and MSL interactions is proprietary and cannot be purchased. The tool\'s defensibility is entirely dependent on this proprietary data stream.' },
        valueMapping: 'Speed (faster detection of sentiment shifts enables faster campaign adjustments) + Pricing Power (better-targeted engagement strategies improve conversion on existing client relationships)',
        leadingIndicators: [
          'Sentiment shift detection lag vs. periodic research',
          'Correlation between sentiment signals and downstream campaign adjustments',
          'Usage frequency by brand strategy teams',
          'Client upsell/renewal rate on accounts where sentiment data informed the strategy',
        ],
        valueEstimate: 'Approximately $50M of MKG\'s revenue comes from clients where HCP sentiment data is directly relevant. A 0.5–1.5% lift in expansion/renewal on that base yields $250K–$750K in incremental annual revenue.',
        assumptions: [
          'The tool is fed by MKG\'s proprietary engagement data, not just public sources',
          'Brand strategy teams actively incorporate sentiment outputs into campaign planning and client proposals',
          'The resulting campaigns demonstrably outperform campaigns designed without sentiment input, creating a visible link between the tool and client outcomes',
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
        sectionLabel: 'Section 11',
        heading: 'ChatMKG — Secure LLM Access',
        description: 'Custom multimodal AI workspace with SSO, audio transcription, web search, model switching, conversation history, and keyword search for past work. Designed as MKG\'s internal AI portal for general-purpose tasks.',
        users: 'All MKG employees. Intended as the default AI interface for day-to-day work.',
        replaces: 'Consumer AI tools (ChatGPT, Claude, Copilot) that employees are already using on personal devices.',
        defensibility: { rating: 'LOW', text: 'Every feature in ChatMKG — SSO, transcription, web search, model switching, conversation history — is available in off-the-shelf enterprise AI products (ChatGPT Enterprise, Claude for Work, Microsoft Copilot). The only defensible angle is if ChatMKG provides access to MKG-proprietary data: the ION Data Lake, brand knowledge bases, and internal tools that general-purpose AI cannot see. Without that data connection, there is no compelling reason for an employee to use ChatMKG over the AI tools they already have. This is infrastructure that enables other products to create value, not a value-creating product itself.' },
        valueMapping: 'Productivity (generalist efficiency gains across the org — but only if adoption is high and the tool is genuinely more useful than alternatives)',
        leadingIndicators: [
          'Daily active users as a percentage of total employees',
          'Tasks completed per session',
          'User-reported preference over external tools',
          'Percentage of usage that involves proprietary data access (the critical metric)',
        ],
        valueEstimate: '200 FTEs at $95K with 3–8% productivity uplift = $570K–$1.52M. The wide range reflects a genuine strategic question: the low end assumes ChatMKG is just another AI chat tool with modest adoption. The high end assumes it becomes the primary interface to MKG\'s proprietary data.',
        assumptions: [
          'ChatMKG connects to the ION Data Lake and brand knowledge bases, making it meaningfully more useful than external alternatives',
          'Adoption is mandated or incentivized, not optional',
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
        sectionLabel: 'Section 12',
        heading: 'Verba — Advisory Board Synthesis',
        description: 'Transforms transcripts from advisory boards, investigator meetings, and expert discussions into structured intelligence. Extracts key themes, unmet needs, objections, treatment patterns, and sentiment shifts. Provides thematic tagging, comparative analysis across boards over time, and executive summaries.',
        users: 'Client-facing — brand teams, medical affairs teams, market access leaders, commercial strategy teams. Offered through MKG\'s MedComm business units.',
        replaces: 'Manual synthesis of advisory board transcripts — currently a labor-intensive process requiring analysts to review hours of discussion and produce structured reports over days or weeks.',
        defensibility: { rating: 'LOW-MODERATE', text: 'At its core, Verba is a transcription-to-structured-output pipeline. Current foundation models can process transcripts and produce structured summaries with high quality. The path to defensibility: cross-referencing what was said against known clinical evidence, comparing sentiment across multiple boards over time using MKG\'s longitudinal data, connecting advisory board insights to prescribing behavior data from the ION Data Lake. Without these proprietary data layers, it\'s an LLM wrapper with a brand name.' },
        valueMapping: 'Speed (faster insight-to-action cycle) + Productivity (replaces weeks of manual synthesis)',
        leadingIndicators: [
          'Time from advisory board to client deliverable',
          'Client satisfaction scores on Verba-produced outputs',
          'Number of boards processed per quarter',
          'Whether clients request Verba specifically vs. receiving it as part of standard engagement',
        ],
        valueEstimate: 'Internal: productivity impact captured under "Research Analysts / Strategists" (40 FTEs, $115K comp, 10–20% uplift). External: 15–35 advisory boards with $10K–$20K premium add-on = $150K–$700K in incremental revenue.',
        assumptions: [
          'Verba connects to proprietary MKG data to deliver analysis that a standalone LLM cannot replicate',
          'Output quality is high enough that medical reviewers don\'t spend as much time correcting the AI as they saved',
          'Clients perceive enough value to pay a premium, rather than viewing this as table-stakes service delivery',
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
        sectionLabel: 'Section 13',
        heading: 'PerspectivX — Concept Scoring',
        description: 'Simulates real-world feedback from HCPs by analyzing campaign concepts through the lens of each treater\'s unique attitudes, beliefs, and cognitive filters. Uses data-based personas modeled from qualitative and behavioral data sourced from the ION Data Lake. Outputs concept strength scores, strategic fit analysis, and optimization guidance.',
        users: 'Brand teams, creative agencies, commercial strategy teams at pharma companies. Used during campaign development to test concepts before committing to production.',
        replaces: 'Traditional qualitative concept testing — typically involving recruitment of HCP panels, facilitated interviews or focus groups, and manual analysis. This process costs $75K–$150K and takes 6–8 weeks. PerspectivX aims to deliver directional feedback in days.',
        defensibility: { rating: 'MODERATE', text: 'The persona models are the differentiator. If they\'re built on MKG\'s proprietary research data — real qualitative research from SOUND, behavioral data from 81qd, engagement data from advisory boards — then PerspectivX is providing something a generic LLM cannot. The risk: as LLMs improve, anyone can create "simulated HCP" personas by prompting a model with a therapeutic area description. The defense is data specificity and validated accuracy.' },
        valueMapping: 'Speed-to-Close (faster concept validation compresses campaign timelines) + Pricing Power (premium methodology that adds incremental revenue per engagement)',
        leadingIndicators: [
          'Concept test turnaround time vs. traditional qual',
          'Correlation between PerspectivX scores and actual market performance',
          'Client adoption rate and repeat usage',
        ],
        valueEstimate: 'Low: 10 concept tests × $20K = $200K. High: 25 tests × $35K = $875K. These prices represent a fraction of traditional qual research cost ($75K–$150K per study), making adoption easier to justify.',
        assumptions: [
          'Personas are grounded in MKG\'s proprietary data, not generic LLM approximations',
          'Concept scores show validated correlation to real market outcomes (even directional correlation is meaningful)',
          'Clients view this as a complement to — not a replacement for — traditional qual, making it an incremental spend',
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
        sectionLabel: 'Section 14',
        heading: 'MagpAI — Stakeholder Simulation',
        description: 'An intelligence-driven platform that replicates authentic communication styles of HCPs, patients, and payers through AI simulation. Supports observational research to uncover unmet needs and alignment gaps, and provides interactive training avatars for sales reps and MSLs to practice messaging before field execution.',
        users: 'Brand teams, commercial strategy teams, training departments. Used for stakeholder research, message testing, and sales force preparation.',
        replaces: 'Traditional stakeholder research interviews ($50K–$100K per study, 4–6 weeks) and in-person sales training role-plays.',
        defensibility: { rating: 'LOW-MODERATE', text: 'Stakeholder simulation via LLM is increasingly easy to replicate. Any team with access to a foundation model and a well-crafted system prompt can create simulated HCP or payer conversations. The differentiator is whether the personas are grounded in MKG\'s proprietary data or are generic LLM approximations. MagpAI and PerspectivX share significant overlap: both create AI-simulated HCP/stakeholder interactions grounded in persona data. There may be a consolidation opportunity.' },
        valueMapping: 'Productivity (faster stakeholder research) + Speed (pre-field testing shortens preparation cycles)',
        leadingIndicators: [
          'Simulations run per quarter',
          'User-reported realism scores',
          'Training completion rates',
          'Whether research teams use MagpAI outputs to inform actual strategy decisions',
        ],
        valueEstimate: 'Low: 8 engagements × $15K = $120K. High: 18 engagements × $30K = $540K. The lower volume and price versus PerspectivX reflects the earlier stage of this product and the need to validate user experience before scaling.',
        assumptions: [
          'Personas are data-grounded, not generic',
          'Users (researchers, trainers, reps) find the simulations realistic enough to be useful',
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
        sectionLabel: 'Section 15',
        heading: 'BloomLab — Real-Time Market Research',
        description: 'An AI-driven, real-time chat session that merges qualitative depth with quantitative rigor. Facilitates adaptive, consensus-building research sessions that overcome common limitations of traditional market research — respondent fatigue, social desirability bias, and rigid discussion guides.',
        users: 'Market research teams, brand strategy leads, insights groups. Used as a research methodology for concept exploration, message testing, and consumer insight generation.',
        replaces: 'Traditional qualitative focus groups and online bulletin boards — typically costing $100K+ per study and taking 4–8 weeks including recruitment, facilitation, and analysis.',
        defensibility: { rating: 'MODERATE', text: 'The real-time adaptive methodology is novel. Unlike Verba (which processes existing transcripts) or MagpAI (which simulates stakeholders), BloomLab facilitates actual research sessions with real participants using AI to adapt the discussion in real time. This is a differentiated methodology, not just an AI layer on an existing process. The question is whether the methodology produces equivalent-quality insights at a fraction of the cost and time.' },
        valueMapping: 'Speed (compressed research timelines) + Pricing Power (premium methodology that commands higher-than-traditional pricing for comparable insight quality in less time)',
        leadingIndicators: [
          'Research cycle time vs. traditional qual',
          'Insight quality scores (rated by clients or validated against traditional methods)',
          'Client repeat usage rate',
        ],
        valueEstimate: 'Low: 8 engagements × $25K = $200K. High: 15 engagements × $45K = $675K. BloomLab\'s novel methodology requires a validation period — early engagements may need to run alongside traditional research to prove equivalence.',
        assumptions: [
          'The methodology demonstrably produces insight quality comparable to traditional qual research',
          'Clients are willing to pay a premium for speed even if the methodology is unfamiliar',
          'BloomLab is positioned as complementary to traditional research (used for early-stage exploration), not a full replacement',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 18: VALUE QUANTIFICATION (Section 16)
  // ================================================================
  {
    id: 'value-quantification',
    title: 'Value Quantification',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ValueQuantificationSlide',
      props: {
        sectionLabel: 'Section 16',
        heading: 'Value Quantification',
        subtitle: 'Internal productivity + External revenue upside',
        internalTable: {
          headers: ['Workflow Area', 'FTEs', 'Comp', 'Low Value', 'High Value'],
          rows: [
            { area: 'Medical Writers', ftes: '80', comp: '$120K', target: 'DynAImic Content', lowUplift: '10%', lowValue: '$960K', highUplift: '20%', highValue: '$1,920K' },
            { area: 'Editorial / QA', ftes: '30', comp: '$110K', target: 'Route Reagent + Annotation', lowUplift: '15%', lowValue: '$495K', highUplift: '30%', highValue: '$990K' },
            { area: 'Regulatory / Compliance', ftes: '20', comp: '$140K', target: 'Compliance Core', lowUplift: '10%', lowValue: '$280K', highUplift: '20%', highValue: '$560K' },
            { area: 'HCP Profiling / Data', ftes: '25', comp: '$105K', target: 'Pantheon + Practice Master', lowUplift: '10%', lowValue: '$263K', highUplift: '25%', highValue: '$656K' },
            { area: 'Influence / Network', ftes: '15', comp: '$130K', target: 'Plexus', lowUplift: '8%', lowValue: '$156K', highUplift: '15%', highValue: '$293K' },
            { area: 'Research / Strategy', ftes: '40', comp: '$115K', target: 'Verba + BloomLab + PerspectivX', lowUplift: '10%', lowValue: '$460K', highUplift: '20%', highValue: '$920K' },
            { area: 'Other Knowledge Workers', ftes: '200', comp: '$95K', target: 'ChatMKG + ION', lowUplift: '3%', lowValue: '$570K', highUplift: '8%', highValue: '$1,520K' },
          ],
          totalLow: '$3.2M',
          totalHigh: '$6.9M',
        },
        externalTable: {
          headers: ['Product', 'Low', 'High'],
          rows: [
            { product: 'Pantheon (subscription)', lowAssumptions: '8 × $75K', lowRevenue: '$600K', highAssumptions: '18 × $125K', highRevenue: '$2,250K' },
            { product: 'PerspectivX (concept testing)', lowAssumptions: '10 × $20K', lowRevenue: '$200K', highAssumptions: '25 × $35K', highRevenue: '$875K' },
            { product: 'Verba (advisory premium)', lowAssumptions: '15 × $10K', lowRevenue: '$150K', highAssumptions: '35 × $20K', highRevenue: '$700K' },
            { product: 'MagpAI (simulation)', lowAssumptions: '8 × $15K', lowRevenue: '$120K', highAssumptions: '18 × $30K', highRevenue: '$540K' },
            { product: 'BloomLab (AI research)', lowAssumptions: '8 × $25K', lowRevenue: '$200K', highAssumptions: '15 × $45K', highRevenue: '$675K' },
            { product: 'Sentiment Tracker (lift)', lowAssumptions: '0.5% on $50M', lowRevenue: '$250K', highAssumptions: '1.5% on $50M', highRevenue: '$750K' },
            { product: 'Plexus (AI premium)', lowAssumptions: '10 × $25K', lowRevenue: '$250K', highAssumptions: '20 × $50K', highRevenue: '$1,000K' },
          ],
          totalLow: '$1.8M',
          totalHigh: '$6.8M',
        },
        combinedSummary: [
          { category: 'Internal Productivity Value', low: '$3.2M', high: '$6.9M' },
          { category: 'External Revenue Upside', low: '$1.8M', high: '$6.8M' },
        ],
        totalOpportunity: { low: '$5.0M', high: '$13.6M', pctLow: '3.3%', pctHigh: '9.1%' },
      },
    },
  },

  // ================================================================
  // SLIDE 19: LEADING VS LAGGING INDICATORS (Section 17)
  // ================================================================
  {
    id: 'leading-indicators',
    title: 'Leading vs. Lagging Indicators',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'LeadingIndicatorsSlide',
      props: {
        sectionLabel: 'Section 17',
        heading: 'Leading vs. Lagging Indicators',
        coreArgument: 'MKG\'s current measurement is almost entirely lagging — revenue, margin, EBITDA. For early-stage AI initiatives, these will show nothing for 6–12 months, creating a dangerous vacuum. AI initiatives need leading indicators that show whether adoption is working before it shows up in financials.',
        leadingIndicators: [
          { category: 'Adoption', indicator: 'Daily/weekly active users per tool', whyItMatters: 'If people aren\'t using the tools, nothing else matters' },
          { category: 'Adoption', indicator: '% of eligible projects using AI-assisted workflow', whyItMatters: 'Measures penetration into actual work, not just availability' },
          { category: 'Cycle Time', indicator: 'Days from brief to MLR submission', whyItMatters: 'Editorial pipeline\'s north star metric' },
          { category: 'Cycle Time', indicator: 'Rounds of revision before approval', whyItMatters: 'Directly tied to Route Reagent / Compliance Core value' },
          { category: 'Quality', indicator: 'First-pass acceptance rate at MLR', whyItMatters: 'If AI pre-checks work, fewer submissions get bounced' },
          { category: 'Client', indicator: 'Proposal win rate on AI-featuring pitches', whyItMatters: 'Measures whether AI tools help close deals' },
          { category: 'Revenue', indicator: 'Subscription attach rate (Pantheon)', whyItMatters: 'Leading indicator of transaction → subscription shift' },
        ],
        laggingIndicators: [
          { category: 'Financial', indicator: 'Revenue from AI-enhanced engagements', timeline: '6–12 months' },
          { category: 'Financial', indicator: 'Gross margin improvement from productivity', timeline: '6–12 months' },
          { category: 'Financial', indicator: 'EBITDA uplift attributable to AI', timeline: '12+ months' },
          { category: 'Strategic', indicator: 'Revenue mix shift (transaction → subscription)', timeline: '12–24 months' },
        ],
        recommendation: 'Build an enterprise AI KPI dashboard tracking leading indicators weekly. Review in existing Monthly Senior Leadership meeting. Use 90-day milestone approach: one leading indicator per initiative, 90-day target. If not moving, re-evaluate before investing further.',
      },
    },
  },

  // ================================================================
  // SLIDE 20: GOVERNANCE & CHANGE MANAGEMENT (Section 18)
  // ================================================================
  {
    id: 'governance',
    title: 'Governance & Change Management',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ChangeManagementSlide',
      props: {
        sectionLabel: 'Section 18',
        heading: 'Governance & Change Management',
        readiness: {
          title: 'Organizational Readiness',
          items: [
            { dimension: 'Leadership Alignment', score: 8, color: 'green' },
            { dimension: 'AI Fluency', score: 5, color: 'yellow' },
            { dimension: 'Product Focus', score: 4, color: 'red' },
            { dimension: 'KPI Discipline', score: 2, color: 'red' },
          ],
        },
        requiredActions: {
          title: 'Required Actions',
          icon: 'Target',
          items: [
            { action: 'Hire Senior AI Product Manager', urgency: 'Immediate', description: 'Single point of accountability for requirements, roadmap prioritization, portfolio consolidation, and the enterprise KPI dashboard. Reports to CSO or CEO.' },
            { action: 'Closed-loop analytics FTE', urgency: 'Q2 2026', description: 'Dedicated resource to instrument ROI measurement. Builds attribution models connecting product usage to business outcomes.' },
            { action: 'Enterprise AI KPI dashboard', urgency: 'Q2 2026', description: 'Built on leading indicators from Section 17. Updated weekly. Visible to senior leadership.' },
            { action: '90-day milestone cadence', urgency: 'Ongoing', description: 'Every funded initiative gets a 90-day measurable target. If not met, pause and reallocate. Start with the most tractable initiative, not the most valuable.' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 21: ROADMAP & FINAL RECOMMENDATIONS (Section 19)
  // ================================================================
  {
    id: 'roadmap',
    title: 'Roadmap & Final Recommendations',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RoadmapPhasedSlide',
      props: {
        sectionLabel: 'Section 19',
        heading: 'Roadmap & Final Recommendations',
        phases: [
          {
            phase: 'Phase 1',
            title: '0–90 Days — Focus & Instrument',
            variant: 'green',
            items: [
              'Consolidate editorial pipeline — single product owner, unified backlog, shared architectural vision',
              'Launch AI KPI dashboard with 3–5 leading indicators',
              'Hire or designate Senior AI Product Manager',
              'Set 90-day adoption targets for Route Reagent and Annotation Activation (30%+ of eligible projects)',
            ],
          },
          {
            phase: 'Phase 2',
            title: '90–180 Days — Prove & Price',
            variant: 'sage',
            items: [
              'Demonstrate 20%+ editorial cycle time reduction on pilot projects',
              'Run 5–10 Pantheon subscription pilots, validate $75K–$150K pricing',
              'Validate PerspectivX persona accuracy against real market research outcomes',
              'Begin building unified editorial platform UX (shared document model)',
            ],
          },
          {
            phase: 'Phase 3',
            title: '6–12 Months — Scale & Differentiate',
            variant: 'gold',
            items: [
              'Roll out unified editorial platform across MedComm (60%+ of eligible projects)',
              'Scale Pantheon subscriptions to 15–25 customers',
              'Introduce predictive layer for Plexus (alerts, HCP behavior triggers)',
              'Sunset tools with <20% adoption after two quarters',
              'Publish first "AI Impact Report" for Novo board',
            ],
          },
        ],
        fourCards: [
          { num: '01', title: 'Rationalize the Portfolio', description: 'Consolidate adjacent products. Stop building net-new until overlap is addressed. One strong platform beats nine mediocre tools.', variant: 'green' },
          { num: '02', title: 'Differentiate Through Data + Expertise', description: 'The moat is proprietary engagement data, two decades of medical judgment, and integrated commercialization services — not AI capability.', variant: 'sage' },
          { num: '03', title: 'Instrument ROI', description: 'Leading indicators first. Close the loop between product usage → outcomes → willingness to pay. Even partial measurement transforms the conversation.', variant: 'gold' },
          { num: '04', title: 'Operationalize Delivery', description: 'Product-led prioritization with clear ownership, a single intake process, and 90-day milestones. Pick the most tractable win, not the most valuable one.', variant: 'cyan' },
        ],
      },
    },
  },
]

export default slides
