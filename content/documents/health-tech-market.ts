/**
 * Health-Tech Market Landscape - Document Content
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 *
 * Visual specifications are managed centrally in lib/slideTemplates.ts
 * Icons reference semantic names from the icon registry
 * Colors and styling are applied automatically based on slide type
 */

import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'health-tech-market-2024'

// ============================================
// Stage Data
// ============================================

export const stageData = {
  seed: {
    icon: getIcon('sprout'), // Visual template: see lib/slideTemplates.ts
    title: 'Seed Stage',
    description: 'Product-market fit, early validation',
    themes: [
      {
        title: 'Proof of Concept',
        items: ['MVP development', 'Early customer validation', 'Clinical feasibility studies'],
      },
      {
        title: 'Regulatory Strategy',
        items: ['FDA pathway identification', 'Regulatory consulting', 'Compliance planning'],
      },
      {
        title: 'Team Building',
        items: ['Founder-market fit', 'Advisory board formation', 'Early hires'],
      },
    ],
  },
  venture: {
    icon: getIcon('rocket'), // Visual template: see lib/slideTemplates.ts
    title: 'Venture Stage',
    description: 'Scaling, growth metrics',
    themes: [
      {
        title: 'Revenue Growth',
        items: ['Pilot to production', 'Sales team scaling', 'Customer acquisition'],
      },
      {
        title: 'Product Development',
        items: ['Feature expansion', 'Platform development', 'Integration capabilities'],
      },
      {
        title: 'Market Expansion',
        items: ['Geographic expansion', 'Segment diversification', 'Partnership development'],
      },
    ],
  },
  growth: {
    icon: getIcon('arrow-up'), // Visual template: see lib/slideTemplates.ts
    title: 'Growth Stage',
    description: 'Market expansion, profitability',
    themes: [
      {
        title: 'Unit Economics',
        items: ['CAC/LTV optimization', 'Gross margin improvement', 'Operational efficiency'],
      },
      {
        title: 'Market Leadership',
        items: ['Category creation', 'Brand building', 'Thought leadership'],
      },
      {
        title: 'Strategic Positioning',
        items: ['M&A opportunities', 'Platform strategy', 'Ecosystem development'],
      },
    ],
  },
  buyout: {
    icon: getIcon('briefcase'), // Visual template: see lib/slideTemplates.ts
    title: 'Buyout Stage',
    description: 'Operational optimization, exits',
    themes: [
      {
        title: 'Operational Excellence',
        items: ['Process optimization', 'Cost structure improvement', 'Margin expansion'],
      },
      {
        title: 'Strategic Options',
        items: ['Exit preparation', 'Strategic partnerships', 'Portfolio optimization'],
      },
      {
        title: 'Value Creation',
        items: ['EBITDA improvement', 'Market positioning', 'Exit multiples'],
      },
    ],
  },
}

// ============================================
// Segment Data
// ============================================

export const segmentData = {
  pharmatech: {
    icon: getIcon('lab'), // Visual template: see lib/slideTemplates.ts
    title: 'Pharmatech',
    description: 'Drug discovery, clinical trials, biotech innovation',
    themes: [
      {
        title: 'AI-Powered Drug Discovery',
        items: ['Molecule identification', 'Target validation', 'Lead optimization'],
      },
      {
        title: 'Clinical Trial Technology',
        items: ['Trial design optimization', 'Patient recruitment', 'Data management'],
      },
      {
        title: 'Biomarker Development',
        items: ['Diagnostic tools', 'Companion diagnostics', 'Precision medicine'],
      },
    ],
  },
  'provider-payor': {
    icon: getIcon('medical'), // Visual template: see lib/slideTemplates.ts
    title: 'Provider/Payor Tech',
    description: 'Health systems, insurers, care delivery',
    themes: [
      {
        title: 'Clinical Workflow',
        items: ['EHR optimization', 'Clinical decision support', 'Care coordination'],
      },
      {
        title: 'Revenue Cycle',
        items: ['Billing automation', 'Prior authorization', 'Claims processing'],
      },
      {
        title: 'Population Health',
        items: ['Risk stratification', 'Care management', 'Quality metrics'],
      },
    ],
  },
  consumer: {
    icon: getIcon('cart'), // Visual template: see lib/slideTemplates.ts
    title: 'Consumer Facing',
    description: 'Direct-to-consumer health, wellness, digital therapeutics',
    themes: [
      {
        title: 'Digital Therapeutics',
        items: ['Prescription digital therapeutics', 'Behavioral health apps', 'Chronic disease management'],
      },
      {
        title: 'Telehealth & Virtual Care',
        items: ['Virtual consultations', 'Remote monitoring', 'Asynchronous care'],
      },
      {
        title: 'Consumer Wellness',
        items: ['Fitness & nutrition', 'Mental wellness', 'Preventive care'],
      },
    ],
  },
}

// ============================================
// Slide Content Data
// ============================================
//
// NOTE: Visual specifications (colors, fonts, spacing) are managed in lib/slideTemplates.ts
// Icons use semantic names that are resolved through the icon registry
// Slide rendering components automatically apply the appropriate templates

export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Market Research',
      headline: 'Health-Tech Market Landscape',
      subtitle: 'Entering 2026: Investment themes across stages and segments',
      insightBox: {
        label: 'Market Context',
        text: 'Health-tech investment has normalized post-pandemic but remains elevated. Investors are increasingly stage- and segment-specific in their strategies. This analysis structures opportunities by investment stage and market segment.',
      },
    },
  },
  {
    id: 'overview',
    title: 'Market Overview',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 01',
      heading: 'Market at a Glance',
      columns: 4,
      items: [
        { title: '$456B', description: 'Projected Market Size', subtitle: 'By 2030' },
        { title: '17.3%', description: 'CAGR', subtitle: '2024-2030' },
        { title: '$29.1B', description: '2025 Funding', subtitle: 'Total invested' },
        { title: '1,200+', description: 'Active Startups', subtitle: 'Globally' },
      ],
      insightBox: {
        label: 'Key Trend',
        text: 'After normalization from 2021-2022 peaks, investors are becoming more selective, focusing on companies with clear paths to profitability and strong unit economics.',
      },
    },
  },
  {
    id: 'structure',
    title: 'Analysis Structure',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 02',
      heading: 'Two-Dimensional Framework',
      description: 'Health-tech opportunities differ meaningfully by investment stage and market segment. This analysis structures themes across both dimensions.',
      columns: 2,
      items: [
        {
          title: 'By Investment Stage',
          icon: getIcon('growth'),
          // Color scheme applied automatically by template
          items: [
            'Seed: Product-market fit, early validation',
            'Venture: Scaling, growth metrics',
            'Growth: Market expansion, profitability',
            'Buyout: Operational optimization, exits',
          ],
        },
        {
          title: 'By Market Segment',
          icon: getIcon('strategy'),
          // Color scheme applied automatically by template
          items: [
            'Pharmatech: Drug discovery, clinical trials',
            'Provider/Payor Tech: Health systems, insurers',
            'Consumer Facing: Direct-to-consumer health',
          ],
        },
      ],
    },
  },
  {
    id: 'stage-seed',
    title: 'Seed Stage Themes',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'StageSlide',
      props: { stage: 'seed' },
    },
  },
  {
    id: 'stage-venture',
    title: 'Venture Stage Themes',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'StageSlide',
      props: { stage: 'venture' },
    },
  },
  {
    id: 'stage-growth',
    title: 'Growth Stage Themes',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'StageSlide',
      props: { stage: 'growth' },
    },
  },
  {
    id: 'stage-buyout',
    title: 'Buyout Stage Themes',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'StageSlide',
      props: { stage: 'buyout' },
    },
  },
  {
    id: 'segment-pharmatech',
    title: 'Pharmatech Segment',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SegmentSlide',
      props: { segment: 'pharmatech' },
    },
  },
  {
    id: 'segment-provider-payor',
    title: 'Provider/Payor Tech Segment',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SegmentSlide',
      props: { segment: 'provider-payor' },
    },
  },
  {
    id: 'segment-consumer',
    title: 'Consumer Facing Segment',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SegmentSlide',
      props: { segment: 'consumer' },
    },
  },
  {
    id: 'cross-cutting',
    title: 'Cross-Cutting Themes',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 03',
      heading: 'Themes Across All Stages & Segments',
      columns: 2,
      items: [
        {
          title: 'AI & Machine Learning',
          icon: getIcon('automation'),
          items: ['Clinical decision support', 'Drug discovery acceleration', 'Administrative automation'],
        },
        {
          title: 'Value-Based Care',
          icon: getIcon('strategy'),
          items: ['Outcomes-focused models', 'Population health management', 'Risk-based contracting'],
        },
        {
          title: 'Interoperability',
          icon: getIcon('users'),
          items: ['FHIR adoption', 'Data exchange standards', 'Platform integration'],
        },
        {
          title: 'Evidence Generation',
          icon: getIcon('chart'),
          items: ['Real-world evidence', 'Clinical validation', 'ROI demonstration'],
        },
      ],
    },
  },
  {
    id: 'recommendations',
    title: 'Strategic Recommendations',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Section 04',
      heading: 'Path Forward',
      left: {
        title: '❌ Avoid These Pitfalls',
        variant: 'negative',
        items: [
          'Building without clinical validation',
          'Ignoring regulatory pathways',
          'Underestimating sales cycles',
          'Over-relying on pilot programs',
          'Neglecting interoperability',
        ],
      },
      right: {
        title: '✅ Embrace These Strategies',
        variant: 'positive',
        items: [
          'Partner early with health systems',
          'Build evidence from day one',
          'Focus on clear ROI metrics',
          'Design for existing workflows',
          'Plan for enterprise scale',
        ],
      },
    },
  },
]

export default slides

