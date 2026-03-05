/**
 * MKG: AI Opportunity & Roadmap Assessment - Document Content
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
      subtitle: 'Outside-In Strategic Evaluation',
      metrics: [
        { value: 'MKG Leadership', label: 'Prepared for' },
        { value: 'Tweed Collective', label: 'Prepared by' },
        { value: 'March 2026', label: 'Date' },
      ],
      insightBox: {
        label: 'Confidential',
        text: 'This document is confidential and intended solely for MKG Leadership.',
      },
    },
  },

  // ================================================================
  // SLIDE 2: EXECUTIVE SUMMARY
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
        summaryText: 'MKG has built a structured AI ecosystem under the ION platform, organized into KINETICS (internal efficiency tools), DIFFUSION (client-facing AI products), and the ION Data Lake (proprietary data backbone). AI maturity level: Upper-Mid / Structured & Scaling. Strong governance and meaningful tooling, but a fragmented portfolio and limited closed-loop measurement.',
        radarChart: {
          labels: ['Strategy', 'Data Assets', 'Workflow Integration', 'External Differentiation', 'Governance', 'Measurement'],
          values: [6, 8, 6, 6, 8, 4],
          height: 250,
        },
        strengths: [
          'Proprietary ION Data Lake (claims, engagement, advisory, publication data)',
          'Deep medical & compliance expertise embedded across teams',
        ],
        risks: [
          'Portfolio sprawl across 20+ branded AI tools',
          'Limited closed-loop ROI measurement (especially 81qd)',
          'Risk of commoditization in client-facing tools (LLM wrapper displacement)',
        ],
        immediateFocus: [
          'Rationalize AI products and combine adjacent offerings',
          'Focus data assets to create true differentiation',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 3: BUSINESS DRIVERS & STRATEGIC CONTEXT
  // ================================================================
  {
    id: 'business-drivers',
    title: 'Business Drivers & Strategic Context',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'BusinessDriversSlide',
      props: {
        sectionLabel: 'Section 02',
        heading: 'Business Drivers & Strategic Context',
        revenueMix: {
          chartType: 'HorizontalBarChart',
          title: 'Revenue Mix',
          icon: 'TrendingUp',
          items: [
            { label: 'Medical Communications', value: 35 },
            { label: 'HCP Promotion', value: 20 },
            { label: 'Analytics (81qd)', value: 15 },
            { label: 'Market Research', value: 15 },
            { label: 'Market Access', value: 10 },
            { label: 'Other', value: 5 },
          ],
          suffix: '%',
          maxValue: 40,
          height: 250,
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
          headers: ['Area', 'AI Impact Potential', 'EBITDA Sensitivity'],
          rows: [
            { area: 'Editorial Workflow', impact: 'High', ebitda: 'Moderate' },
            { area: 'Predictive Analytics', impact: 'High', ebitda: 'High' },
            { area: 'Market Research', impact: 'High', ebitda: 'Moderate' },
            { area: 'Creative Automation', impact: 'Moderate', ebitda: 'Low' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 4: AI INITIATIVE INVENTORY -- KINETICS (Internal)
  // ================================================================
  {
    id: 'kinetics',
    title: 'KINETICS -- Internal AI Initiatives',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AssessmentTableSlide',
      props: {
        sectionLabel: 'Section 03 -- Internal',
        heading: 'KINETICS -- Internal AI Initiatives',
        subtitle: 'Enterprise + productivity tooling under the ION platform',
        callout: 'Together these form an AI-driven content production pipeline that can reduce revision cycles, accelerate MLR readiness, and increase revenue-per-employee.',
        sections: [
          {
            title: 'Future-State AI Editorial Pipeline (Core Value Drivers)',
            rows: [
              { name: 'DynAImic Content', description: 'Generates draft marketing content across channels.', valueSource: 'Speed + Productivity', valuePotential: 'High' },
              { name: 'Annotation Activation', description: 'Auto-links claims to supporting literature.', valueSource: 'Productivity + Speed', valuePotential: 'High' },
              { name: 'Compliance Core', description: 'Flags regulatory and FDA compliance risks.', valueSource: 'Cost + Risk Reduction', valuePotential: 'High' },
              { name: 'Route Reagent', description: 'Validates content vs style and brand rules.', valueSource: 'Cost + Speed', valuePotential: 'High' },
            ],
          },
          {
            title: 'Supporting Insight and Knowledge Tools',
            rows: [
              { name: 'Practice Master', description: 'Maps HCP affiliations and networks.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
              { name: 'Sentiment Tracker', description: 'Tracks shifts in HCP sentiment signals.', valueSource: 'Strategic Insight', valuePotential: 'Moderate' },
              { name: 'Undermind', description: 'Performs deep scientific literature searches.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
              { name: 'Brand Bonds', description: 'Brand-trained AI assistant for team knowledge.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Conversation Centrifuge', description: 'Summarizes expert interviews into insights.', valueSource: 'Speed + Productivity', valuePotential: 'Moderate' },
            ],
          },
          {
            title: 'General Productivity and Workflow Tools',
            rows: [
              { name: 'ION (Internal AI Portal)', description: 'Central hub for MKG AI tools and data.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'ChatMKG / Secure LLM Access', description: 'Secure internal LLM workspace.', valueSource: 'Productivity', valuePotential: 'Moderate' },
              { name: 'Case Catalyst', description: 'Retrieves and repurposes past case studies.', valueSource: 'Productivity', valuePotential: 'Low–Moderate' },
              { name: 'Meeting Nucleus', description: 'Transcribes meetings and creates summaries.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Brief', description: 'Guides teams in building project briefs.', valueSource: 'Productivity', valuePotential: 'Low' },
              { name: 'Strategic Synthesis', description: 'Converts ideas into structured project plans.', valueSource: 'Productivity', valuePotential: 'Low' },
            ],
          },
        ],
        cards: [
          { name: 'DynAImic Content', description: 'Generates draft marketing content across channels', icon: 'Rocket', highlight: true },
          { name: 'Annotation Activation', description: 'Auto-links claims to supporting literature', icon: 'Layers', highlight: true },
          { name: 'Compliance Core', description: 'Flags regulatory and FDA compliance risks', icon: 'AlertCircle', highlight: true },
          { name: 'Route Reagent', description: 'Validates content vs style and brand rules', icon: 'Brain', highlight: true },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 5: AI INITIATIVE INVENTORY -- DIFFUSION (External) + Portfolio
  // ================================================================
  {
    id: 'diffusion',
    title: 'DIFFUSION -- Client-Facing AI + Portfolio',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DiffusionSlide',
      props: {
        sectionLabel: 'Section 03 -- External',
        heading: 'DIFFUSION -- Client-Facing AI Products',
        subtitle: 'Revenue-generating and differentiating AI offerings',
        table: {
          headers: ['Initiative', 'Positioning', 'Revenue', 'Diff. Risk'],
          rows: [
            { name: 'MagpAI', positioning: 'Research augmentation / simulation', revenue: 'Add-on', risk: 'Moderate' },
            { name: 'BloomLab', positioning: 'Real-time qual/quant hybrid', revenue: 'Project-based', risk: 'Lower' },
            { name: 'PerspectivX', positioning: 'Concept scoring', revenue: 'Add-on', risk: 'Moderate' },
            { name: 'Verba', positioning: 'Ad board synthesis', revenue: 'Embedded', risk: 'Higher' },
            { name: 'Pantheon', positioning: 'HCP search / profiling', revenue: 'Project / subscription', risk: 'Lower' },
            { name: 'Plexus', positioning: 'Influence mapping', revenue: 'Core analytics', risk: 'Lower' },
            { name: 'Orion', positioning: 'Patient identification', revenue: 'Analytics', risk: 'Moderate' },
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
  // SLIDE 6: DIFFERENTIATING ASSETS
  // ================================================================
  {
    id: 'differentiating-assets',
    title: 'Differentiating Assets',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DifferentiatingAssetsSlide',
      props: {
        sectionLabel: 'Section 04',
        heading: 'Differentiating Assets',
        subtitle: 'Durable AI moats vs. LLM commoditization risk',
        moatChart: {
          chartType: 'HorizontalBarChart',
          title: 'Moat Strength Assessment',
          icon: 'Brain',
          items: [
            { label: 'ION Data Lake', value: 9 },
            { label: 'Medical Expertise', value: 8 },
            { label: 'Workflow Control', value: 5 },
            { label: 'Model Sophistication', value: 2 },
          ],
          suffix: '/10',
          maxValue: 10,
          height: 230,
        },
        dataFlow: {
          componentId: 'DataFlowDiagram',
          title: 'Data Flow -- ION Platform',
          icon: 'Database',
          sources: ['Claims Data', 'Advisory Boards', 'Speaker Bureau', 'Engagement Data', 'Publications'],
          outputs: ['Pantheon', 'PerspectivX', 'Predictive Models'],
        },
        insightText: "The ION Data Lake is MKG's strongest moat -- proprietary claims, engagement, advisory, and publication data that cannot be replicated by competitors or foundation models. The path to higher value is moving from search (Pantheon today) to prediction (where Pantheon must go).",
      },
    },
  },

  // ================================================================
  // SLIDE 7: TEAM & GOVERNANCE
  // ================================================================
  {
    id: 'team-governance',
    title: 'Team & Governance',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'GovernanceSlide',
      props: {
        sectionLabel: 'Section 05',
        heading: 'Team & Governance',
        governanceStructure: {
          title: 'Governance Structure',
          icon: 'Users',
          items: [
            { frequency: 'Weekly', body: 'AI Committee', description: 'Technical direction and initiative prioritization' },
            { frequency: 'Biweekly', body: 'AI Advocates', description: 'Cross-functional alignment and adoption tracking' },
            { frequency: 'Monthly', body: 'Senior Leadership Review', description: 'Strategic oversight and investment decisions' },
            { frequency: 'Gate', body: 'CFO Cost-to-Build ROI', description: 'Financial gating for new AI investments' },
          ],
        },
        scorecard: {
          title: 'Governance Scorecard',
          items: [
            { item: 'Executive sponsor & AI committee', status: true },
            { item: 'Regular cadence (weekly+)', status: true },
            { item: 'CFO-gated ROI process', status: true },
            { item: 'Cross-functional AI advocates', status: true },
            { item: 'Dedicated AI product strategy owner', status: false },
            { item: 'Enterprise AI KPI dashboard', status: false },
            { item: 'Attribution analytics FTE', status: false },
          ],
        },
        observedGaps: [
          'No enterprise AI KPI dashboard',
          'No clear AI product strategy owner',
          'Limited attribution analytics FTE',
          'AI activation appears organically grown vs. prioritized top-down',
          'Multiple build teams distributed across the business, suggesting a decentralized investment model vs. a centrally allocated roadmap',
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 8: INTERNAL VALUE STORY -- ROUTE REAGENT
  // ================================================================
  {
    id: 'route-reagent',
    title: 'Internal Value -- Route Reagent',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RouteReagentSlide',
      props: {
        sectionLabel: 'Section 06',
        heading: 'Internal Value Story -- Route Reagent',
        subtitle: 'Flagship 90-day measurable win',
        metrics: [
          { metric: 'Avg Routing Rounds', before: '6', target: '4.5', delta: '-25%' },
          { metric: 'Editorial Hours / Job', before: '12', target: '9', delta: '-25%' },
          { metric: 'Turnaround Days', before: '14', target: '10', delta: '-29%' },
        ],
        financialImpact: {
          title: 'Financial Impact',
          icon: 'DollarSign',
          lineItems: [
            { label: 'Jobs / year', value: '3,000' },
            { label: 'Savings per job', value: '$250' },
            { label: 'Total Annual Savings', value: '~$750,000', highlight: true },
            { label: 'Build Cost', value: '~$50,000' },
            { label: 'ROI Year 1', value: '~15x', highlight: true },
          ],
          roiHighlight: {
            value: '15x',
            label: 'Year 1 ROI',
            sublabel: '$50K build -> $750K annual savings',
          },
        },
      },
    },
  },

  // ================================================================
  // SLIDE 9: CUSTOMER-FACING VALUE -- PANTHEON
  // ================================================================
  {
    id: 'pantheon',
    title: 'External Value -- Predictive Pantheon',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'PantheonSlide',
      props: {
        sectionLabel: 'Section 07',
        heading: 'Customer-Facing Value -- Predictive Pantheon',
        subtitle: 'From search tool to predictive intelligence layer',
        metrics: [
          { metric: 'Project Revenue', current: '$500K', future: '$500K', delta: '--' },
          { metric: 'Subscription Add-on', current: '$0', future: '$150K', delta: '+$150K' },
          { metric: 'Retention', current: '75%', future: '85%', delta: '+10pts' },
          { metric: 'Upsell Rate', current: '20%', future: '35%', delta: '+15pts' },
        ],
        evolutionThesis: "Today, Pantheon is an HCP search tool -- useful but commoditizable. By layering predictive models on top of the ION Data Lake (behavior change alerts, engagement scoring, prescriber trajectory), Pantheon transforms from a lookup tool into a strategic intelligence layer -- defensible, subscription-ready, and impossible to replicate without MKG's proprietary longitudinal data. Key assumptions: predictive layer priced at $150K/customer/year, retention improves from 75% to 85% due to measurable performance lift, and upsell rate improves from 20% to 35% because Predictive + Mapping increases cross-sell pull-through.",
      },
    },
  },

  // ================================================================
  // SLIDE 10: ROADMAP & PRIORITIZATION
  // ================================================================
  {
    id: 'roadmap',
    title: 'Roadmap & Prioritization',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RoadmapSlide',
      props: {
        sectionLabel: 'Section 08',
        heading: 'Roadmap & Prioritization',
        categories: [
          {
            action: 'Double Down',
            variant: 'green',
            items: [
              'Rationalize the AI product portfolio and combine adjacent products along core workflow lines: Editorial QA (Route Reagent + Annotation Activation + Compliance Core), HCP Intelligence (Pantheon + Plexus + Sentiment Tracker), and Research-to-Insight (MagpAI + BloomLab + PerspectivX)',
              'Focus data assets to create true differentiation (tighten around the Data Lake + medical expertise + ION platform)',
            ],
          },
        ],
        foundation: {
          action: 'Double Down',
          title: 'Foundation: ION Data Lake',
          icon: 'Database',
          description: "The ION Data Lake is the connective tissue that makes every initiative above more valuable. Investing in connecting data assets across claims, engagement, advisory, and publication sources is the prerequisite for Pantheon's predictive layer, Plexus's influence mapping, and Orion's patient identification. Without a strong, unified data foundation, individual tools remain isolated point solutions.",
        },
        workflowIntegration: {
          title: 'Critical Enabler: Workflow Integration',
          icon: 'Layers',
          description: 'The current AI portfolio reads as fragmented -- 20+ branded tools creating spot efficiencies but not connected to each other or to end-to-end business processes. The highest-leverage move is not building more tools, but connecting existing tools along core business process workflows.',
          workflows: [
            { workflow: 'Editorial -> MLR -> Delivery', tools: 'Route Reagent + Annotation Activation + Compliance Core', gap: 'Not yet connected end-to-end' },
            { workflow: 'HCP Intelligence -> Engagement', tools: 'Pantheon + Plexus + engagement data', gap: 'Search-only; no predictive loop' },
            { workflow: 'Research -> Insight -> Action', tools: 'MagpAI + BloomLab + PerspectivX', gap: 'Three separate tools, one workflow' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 11: CHANGE MANAGEMENT
  // ================================================================
  {
    id: 'change-management',
    title: 'Change Management',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ChangeManagementSlide',
      props: {
        sectionLabel: 'Section 09',
        heading: 'Change Management Requirements',
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
            { action: 'Hire Senior Product Manager (AI Product Leader)', urgency: 'Immediate', description: 'Single owner for requirements, prioritization, and portfolio consolidation' },
            { action: 'Closed-loop analytics FTE', urgency: 'Q2 2026', description: 'Dedicated role to build attribution from AI interventions to client outcomes' },
            { action: 'Enterprise AI KPI dashboard', urgency: 'Q2 2026', description: 'Unified view of usage, adoption, ROI, and initiative health across KINETICS + DIFFUSION' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 12: QUANTIFYING "GETTING IT RIGHT"
  // ================================================================
  {
    id: 'quantifying-upside',
    title: 'Quantifying "Getting It Right"',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'QuantifyingUpsideSlide',
      props: {
        sectionLabel: 'Section 10',
        heading: 'Quantifying "Getting It Right"',
        subtitle: 'Internal (cost/productivity) vs External (revenue uplift)',
        ebitdaModel: {
          title: 'Internal Value (Cost / Productivity Uplift)',
          icon: 'TrendingUp',
          headers: ['Category', 'Year 1', 'Year 3'],
          rows: [
            { category: 'Editorial Efficiency / Cycle Time', year1: '$1.0M', year3: '$2.5M' },
            { category: 'QA / Compliance Automation', year1: '$0.3M', year3: '$0.8M' },
            { category: 'Other Internal Productivity', year1: '$0.2M', year3: '$0.7M' },
          ],
          totals: { label: 'Total Internal Impact', year1: '$1.5M', year3: '$4.0M' },
        },
        enterpriseValue: {
          title: 'External Value (Revenue Uplift)',
          icon: 'BarChart3',
          lineItems: [
            { label: 'Predictive Pantheon Add-on Revenue', value: '$0.5M / $3.0M', color: 'green' },
            { label: 'Retention / Expansion Lift', value: '$0.3M / $2.0M', color: 'green' },
            { label: 'Other Differentiated Products', value: '$0.2M / $0.5M' },
            { label: 'Total External Impact', value: '$1.0M / $5.5M', bold: true },
          ],
          multiples: [
            { label: 'EBITDA uplift formula', value: '(External rev x GM) + Internal savings - Incremental opex' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 13: FINAL RECOMMENDATION
  // ================================================================
  {
    id: 'final-recommendation',
    title: 'Final Recommendation',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'FinalRecommendationSlide',
      props: {
        sectionLabel: 'Section 11',
        heading: 'Final Recommendation',
        recommendations: [
          {
            num: '01',
            title: 'Rationalize the AI Portfolio',
            subtitle: 'Consolidate adjacent SKUs',
            description: 'Stop building net-new products until overlap is addressed. Combine adjacent offerings (e.g., Route Reagent + Annotation Activation) into unified workflow solutions.',
            variant: 'green',
          },
          {
            num: '02',
            title: 'Differentiate Through Data + Expertise',
            subtitle: 'Defensible moat',
            description: 'Focus on the ION Data Lake and medical expertise as the defensible moat. These are the assets competitors and foundation models cannot replicate.',
            variant: 'sage',
          },
          {
            num: '03',
            title: 'Instrument ROI',
            subtitle: 'Closed-loop measurement',
            description: 'Build closed-loop measurement that connects product usage to outcomes to willingness to pay. Without attribution, AI investment decisions remain faith-based.',
            variant: 'gold',
          },
          {
            num: '04',
            title: 'Operationalize Delivery',
            subtitle: 'Product-led prioritization',
            description: 'Product-led prioritization with clear ownership (Senior PM / AI Product Leader) and a single intake/prioritization process across the organization.',
            variant: 'cyan',
          },
        ],
        operatingPrinciples: [
          'Consolidate overlapping tools before building new ones',
          'Differentiate through data and medical expertise',
          'Measure relentlessly -- closed-loop attribution',
          'Single owner for AI product strategy',
        ],
        strategicShifts: [
          'From point solutions -> integrated workflow AI',
          'From portfolio sprawl -> focused, defensible products',
          'AI should change what MKG can charge -- not just what it costs',
        ],
      },
    },
  },
]

export default slides
