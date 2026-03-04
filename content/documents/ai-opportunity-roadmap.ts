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
        { value: 'February 2026', label: 'Date' },
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
        summaryText: 'MKG has built a structured AI ecosystem under the ION platform, organized into KINETICS (internal efficiency), DIFFUSION (client-facing AI products), and the ION Data Lake (proprietary data backbone). Meaningful tooling exists across the portfolio, but tools are fragmented and lack closed-loop measurement. The critical next step is connecting these point solutions into cohesive business process workflows.',
        radarChart: {
          labels: ['Strategy', 'Data Assets', 'Workflow Integration', 'External Differentiation', 'Governance', 'Measurement'],
          values: [7, 9, 6, 6, 6, 4],
          height: 250,
        },
        strengths: [
          'Proprietary ION Data Lake (claims, engagement, advisory, publication data)',
          'Medical & compliance expertise deeply embedded in organization',
          'Disciplined build-vs-ROI governance process',
        ],
        risks: [
          'Portfolio sprawl across 20+ branded AI tools',
          'Limited closed-loop ROI measurement (especially 81qd)',
          'Risk of LLM wrapper commoditization in client-facing tools',
        ],
        immediateFocus: [
          'Make Route Reagent flagship 90-day measurable win',
          'Consolidate editorial AI stack',
          'Move Pantheon → predictive intelligence layer',
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
            { area: 'Editorial Workflow', impact: 'High', ebitda: 'High' },
            { area: 'Predictive Analytics', impact: 'High', ebitda: 'High' },
            { area: 'Market Research', impact: 'Moderate', ebitda: 'Moderate' },
            { area: 'Creative Automation', impact: 'Low', ebitda: 'Low' },
          ],
        },
      },
    },
  },

  // ================================================================
  // SLIDE 4: AI INITIATIVE INVENTORY — KINETICS (Internal)
  // ================================================================
  {
    id: 'kinetics',
    title: 'KINETICS — Internal AI Initiatives',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'AssessmentTableSlide',
      props: {
        sectionLabel: 'Section 03 — Internal',
        heading: 'KINETICS — Internal AI Initiatives',
        subtitle: 'Efficiency tools powering internal workflows',
        table: {
          headers: ['Initiative', 'Stage', 'KPI', 'Est. Annual Value', 'Measured?'],
          rows: [
            { name: 'Route Reagent', stage: 'Beta', stageColor: 'yellow', kpi: 'Routing rounds ↓', value: '$700K+', measured: 'Projected' },
            { name: 'Annotation Activation', stage: 'Pilot', stageColor: 'taupe', kpi: 'MLR prep time ↓', value: 'TBD', measured: 'No' },
            { name: 'ChatMKG', stage: 'Live', stageColor: 'green', kpi: 'Adoption rate', value: 'Indirect', measured: 'Yes (usage)' },
            { name: 'Compliance Core', stage: 'Early', stageColor: 'neutral', kpi: 'Red flag detection', value: 'TBD', measured: 'No' },
          ],
        },
        cards: [
          { name: 'Route Reagent', description: 'AI-driven editorial routing — reduces review rounds by 25%', icon: 'Rocket', highlight: true },
          { name: 'Annotation Activation', description: 'Automated MLR annotation and reference prep', icon: 'Layers', highlight: false },
          { name: 'ChatMKG', description: 'Internal knowledge assistant for organizational queries', icon: 'Brain', highlight: false },
          { name: 'Compliance Core', description: 'AI-powered regulatory red-flag detection', icon: 'AlertCircle', highlight: false },
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 5: AI INITIATIVE INVENTORY — DIFFUSION (External) + Portfolio
  // ================================================================
  {
    id: 'diffusion',
    title: 'DIFFUSION — Client-Facing AI + Portfolio',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DiffusionSlide',
      props: {
        sectionLabel: 'Section 03 — External',
        heading: 'DIFFUSION — Client-Facing AI Products',
        subtitle: 'Revenue-generating and differentiating AI offerings',
        table: {
          headers: ['Initiative', 'Positioning', 'Revenue', 'Diff. Risk'],
          rows: [
            { name: 'MagpAI', positioning: 'Research augmentation', revenue: 'Add-on', risk: 'Moderate' },
            { name: 'BloomLab', positioning: 'Qual/quant hybrid', revenue: 'Project', risk: 'Lower' },
            { name: 'PerspectivX', positioning: 'Concept scoring', revenue: 'Add-on', risk: 'Moderate' },
            { name: 'Verba', positioning: 'Ad board synthesis', revenue: 'Embedded', risk: 'Higher' },
            { name: 'Pantheon', positioning: 'HCP search', revenue: 'Project', risk: 'Mod→High' },
            { name: 'Plexus', positioning: 'Influence mapping', revenue: 'Core', risk: 'Strong' },
            { name: 'Orion', positioning: 'Patient ID', revenue: 'Analytics', risk: 'Strong' },
          ],
        },
        quadrantChart: {
          title: 'Portfolio Prioritization',
          icon: 'Zap',
          xLabel: 'Complexity →',
          yLabel: 'Strategic Value →',
          quadrants: ['Accelerate', 'Double Down', 'Reposition', 'Cut'],
          points: [
            { label: 'Pantheon', x: 0.75, y: 0.9 },
            { label: 'Plexus', x: 0.55, y: 0.85 },
            { label: 'Orion', x: 0.5, y: 0.78 },
            { label: 'BloomLab', x: 0.4, y: 0.7 },
            { label: 'PerspectivX', x: 0.3, y: 0.6 },
            { label: 'MagpAI', x: 0.2, y: 0.45 },
            { label: 'Verba', x: 0.45, y: 0.35 },
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
            { label: 'Workflow Control', value: 6 },
            { label: 'Model Sophistication', value: 5 },
            { label: 'Closed-Loop Attribution', value: 4 },
          ],
          suffix: '/10',
          maxValue: 10,
          height: 230,
        },
        dataFlow: {
          componentId: 'DataFlowDiagram',
          title: 'Data Flow — ION Platform',
          icon: 'Database',
          sources: ['Claims Data', 'Advisory Boards', 'Speaker Bureau', 'Engagement Data', 'Publications'],
          outputs: ['Pantheon', 'PerspectivX', 'Predictive Models'],
        },
        insightText: "The ION Data Lake is MKG's strongest moat — proprietary claims, engagement, advisory, and publication data that cannot be replicated by competitors or foundation models. The path to higher value is moving from search (Pantheon today) to prediction (where Pantheon must go).",
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
        ],
      },
    },
  },

  // ================================================================
  // SLIDE 8: INTERNAL VALUE STORY — ROUTE REAGENT
  // ================================================================
  {
    id: 'route-reagent',
    title: 'Internal Value — Route Reagent',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RouteReagentSlide',
      props: {
        sectionLabel: 'Section 06',
        heading: 'Internal Value Story — Route Reagent',
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
            { label: 'ROI Year 1', value: '~15×', highlight: true },
          ],
          roiHighlight: {
            value: '15×',
            label: 'Year 1 ROI',
            sublabel: '$50K build → $750K annual savings',
          },
        },
      },
    },
  },

  // ================================================================
  // SLIDE 9: CUSTOMER-FACING VALUE — PANTHEON
  // ================================================================
  {
    id: 'pantheon',
    title: 'External Value — Predictive Pantheon',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'PantheonSlide',
      props: {
        sectionLabel: 'Section 07',
        heading: 'Customer-Facing Value — Predictive Pantheon',
        subtitle: 'From search tool to predictive intelligence layer',
        metrics: [
          { metric: 'Project Revenue', current: '$500K', future: '$500K', delta: '—' },
          { metric: 'Subscription Add-on', current: '$0', future: '$150K', delta: '+$150K' },
          { metric: 'Retention', current: '75%', future: '85%', delta: '+10pts' },
          { metric: 'Upsell Rate', current: '20%', future: '35%', delta: '+15pts' },
        ],
        evolutionThesis: "Today, Pantheon is an HCP search tool — useful but commoditizable. By layering predictive models on top of the ION Data Lake (behavior change alerts, engagement scoring, prescriber trajectory), Pantheon transforms from a lookup tool into a strategic intelligence layer — defensible, subscription-ready, and impossible to replicate without MKG's proprietary longitudinal data.",
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
            items: ['Route Reagent', 'Editorial Platform Consolidation'],
          },
          {
            action: 'Accelerate',
            variant: 'sage',
            items: ['Pantheon Predictive', 'Behavior change alerts'],
          },
          {
            action: 'Reposition',
            variant: 'taupe',
            items: ['Verba (feature, not SKU)', 'MagpAI (augmentation layer)'],
          },
          {
            action: 'Pause / Evaluate',
            variant: 'red',
            items: ['Low-usage niche internal tools'],
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
          description: 'The current AI portfolio reads as fragmented — 20+ branded tools creating spot efficiencies but not connected to each other or to end-to-end business processes. The highest-leverage move is not building more tools, but connecting existing tools along core business process workflows.',
          workflows: [
            { workflow: 'Editorial → MLR → Delivery', tools: 'Route Reagent + Annotation Activation + Compliance Core', gap: 'Not yet connected end-to-end' },
            { workflow: 'HCP Intelligence → Engagement', tools: 'Pantheon + Plexus + engagement data', gap: 'Search-only; no predictive loop' },
            { workflow: 'Research → Insight → Action', tools: 'MagpAI + BloomLab + PerspectivX', gap: 'Three separate tools, one workflow' },
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
            { dimension: 'AI Fluency', score: 7, color: 'green' },
            { dimension: 'Product Focus', score: 5, color: 'yellow' },
            { dimension: 'KPI Discipline', score: 4, color: 'red' },
          ],
        },
        requiredActions: {
          title: 'Required Actions',
          icon: 'Target',
          items: [
            { action: 'Hire AI Product Strategy Lead', urgency: 'Immediate', description: 'Single owner for initiative portfolio, consolidation, and product-market fit' },
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
        subtitle: 'The financial case for focused AI execution',
        ebitdaModel: {
          title: 'EBITDA Impact Model',
          icon: 'TrendingUp',
          headers: ['Category', 'Year 1', 'Year 3'],
          rows: [
            { category: 'Editorial Efficiency', year1: '$1.0M', year3: '$2.5M' },
            { category: 'Subscription Shift', year1: '$0.5M', year3: '$3.0M' },
            { category: 'Retention Lift', year1: '$0.3M', year3: '$1.0M' },
          ],
          totals: { label: 'Total EBITDA Impact', year1: '$1.8M', year3: '$6.5M' },
        },
        enterpriseValue: {
          title: 'Enterprise Value Impact (Year 3)',
          icon: 'BarChart3',
          lineItems: [
            { label: 'Current EBITDA', value: '$20M' },
            { label: 'AI Impact (Year 3)', value: '+$6.5M', color: 'green' },
            { label: 'New EBITDA', value: '$26.5M', bold: true },
          ],
          multiples: [
            { label: 'At 10× multiple', value: '+$65M EV' },
            { label: 'At 12× multiple', value: '+$78M EV' },
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
            title: 'Unified AI Editorial Platform',
            subtitle: '90-day measurable win',
            description: 'Consolidate Route Reagent + Annotation Activation + editorial tooling into a single connected workflow. Measure: routing rounds, turnaround days, cost per job.',
            variant: 'green',
          },
          {
            num: '02',
            title: 'Predictive Intelligence Layer',
            subtitle: 'Pantheon evolution',
            description: 'Transform Pantheon from HCP lookup to predictive engine. Layer behavior change alerts, engagement scoring, prescriber trajectory on ION Data Lake.',
            variant: 'sage',
          },
          {
            num: '03',
            title: 'Closed-Loop ROI Pilot',
            subtitle: '1 therapeutic area',
            description: 'Pick one TA, instrument end-to-end attribution from AI-generated insight → HCP engagement → prescriber behavior. Prove the loop works before scaling.',
            variant: 'gold',
          },
          {
            num: '04',
            title: 'Connect the Workflow',
            subtitle: 'Integration over proliferation',
            description: 'Map AI tools against core business process workflows. Stop building point solutions; start connecting existing tools into end-to-end chains that compound value across the ION Data Lake.',
            variant: 'cyan',
          },
        ],
        operatingPrinciples: [
          'Connect before you build — map tools to workflows first',
          'Consolidate overlapping tools',
          'Measure relentlessly',
          'Encode medical expertise into guardrails',
        ],
        strategicShifts: [
          'From point solutions → integrated workflow AI',
          'Shift 81qd toward subscription model',
          'AI should change what MKG can charge — not just what it costs',
        ],
      },
    },
  },
]

export default slides
