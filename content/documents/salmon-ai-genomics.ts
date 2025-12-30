/**
 * AI × Genomics × Aquaculture Partner Roadmap - Document Content
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

export const DOCUMENT_ID = 'salmon-ai-genomics'

// ============================================
// Shared Data Objects
// ============================================

export const platformArchetypes = [
  {
    number: 1,
    title: 'Archetype 1: Data Foundation',
    function: 'Data ingestion, cleaning, harmonization',
    value: 'Prerequisite for all AI',
  },
  {
    number: 2,
    title: 'Archetype 2: Purpose-Built GS',
    function: 'Standard genomic selection (GBLUP)',
    value: '10-25% immediate accuracy gain',
  },
  {
    number: 3,
    title: 'Archetype 3: Custom AI Models',
    function: 'Novel discovery, trait imputation',
    value: 'Competitive moat—proprietary IP',
  },
]

export const roadmapPhases = [
  {
    phase: 1,
    label: 'A1: AI-Ready Data',
    timeline: '0-6 months',
    bullets: [
      'Clean IDs, standardized ontologies',
      'API front-door for partners',
      'Backfill phenotypes from existing logs',
    ],
  },
  {
    phase: 2,
    label: 'A2: Scalable Phenotypes',
    timeline: '3-12 months',
    bullets: [
      'High-throughput AI phenotyping',
      'Index v1: growth, g-FCR, lice, robustness',
      'GBLUP vs ML validation',
    ],
  },
  {
    phase: 3,
    label: 'A3: Multi-Modal Model',
    timeline: '6-24 months',
    bullets: [
      'Production-grade model integrating all data streams',
      'Edit-or-Select dashboard by region',
      'Regulatory pathway preparation',
    ],
  },
]

export const useCases = [
  {
    title: 'AI-Imputed FCR (g-FCR)',
    problem: "Can't measure individual FCR in net-pens",
    solution: 'AI imputes individual scores from family/genomic data',
    impact: 'Only operator breeding for feed efficiency',
  },
  {
    title: 'Sea Lice Resistance',
    problem: 'Costs industry $1B+ annually',
    solution: 'AI-enhanced GWAS identifies resistance gene networks',
    impact: 'Accelerated selection for resistant broodstock',
  },
  {
    title: 'Robustness & Gill Health',
    problem: 'Difficult to quantify at scale',
    solution: 'AI image analysis → genomic linkage',
    impact: 'New GEBVs for previously unmeasurable traits',
  },
]

export const partnerEcosystem = [
  {
    name: 'Aquaticode',
    role: 'A2 Phenotyping',
    description: 'High-throughput fish sorting and phenotyping',
    bullets: [
      'SORTpro: 10,000 fish/hour at >97% accuracy',
      '60M+ fish sorted with major producers',
      'Grieg Seafood adoption Nov 2025',
    ],
  },
  {
    name: 'Xelect / Genus',
    role: 'A2 Genomics',
    description: 'Aquaculture-native genomic selection',
    bullets: [
      'Aquaculture-native GS at scale',
      'Optimate software for complex breeding',
      'Population-specific index design with IP protection',
    ],
  },
  {
    name: 'SINTEF Digital',
    role: 'A3 Model Builder',
    description: 'Hybrid AI expertise and deployment',
    bullets: [
      'Hybrid AI expertise (domain + ML)',
      'Production deployment capability',
      'Full-scale ACE research facility',
    ],
  },
  {
    name: 'Nofima',
    role: 'A3 Scientific Advisory',
    description: 'Leading salmon genetics research',
    bullets: [
      'Leading salmon genetics research',
      'CMSEdit, CrispResist projects',
      'Regulatory navigation expertise',
    ],
  },
]

export const regulatoryRegions = [
  {
    region: 'EU',
    status: 'Restrictive',
    description: 'GMO regulations apply to all gene editing',
  },
  {
    region: 'UK, Norway',
    status: 'Evolving',
    description: 'Precision breeding pathways emerging',
  },
  {
    region: 'US, Canada, Japan, Argentina',
    status: 'Permissive',
    description: 'Case-by-case or not regulated as GMO',
  },
]

export const recentDevelopments = [
  {
    date: 'Aug 2025',
    headline: 'Tidal (Google X) launches autonomous AI lice control at AquaNor 2025',
  },
  {
    date: 'Nov 2025',
    headline: 'Grieg Seafood adopts Aquaticode—first vaccination line integration',
  },
  {
    date: 'Apr 2025',
    headline: 'ISAV resistance breakthrough via triple gene CRISPR knockout',
  },
  {
    date: 'Nov 2025',
    headline: 'UK Precision Breeding Regulations enter force',
  },
  {
    date: 'Apr 2025',
    headline: 'SINTEF releases SOLAQUA dataset for aquaculture AI research',
  },
]

export const successMetrics = [
  {
    phase: 'Phase 1 (A1 Complete)',
    metrics: [
      'Queryable trait time series operational',
      'Reliable pen-level g-FCR proxy validated',
      '2-3 partner APIs integrated',
    ],
  },
  {
    phase: 'Phase 2 (A2 Complete)',
    metrics: [
      'Selection decisions incorporate AI-derived traits',
      '15-20% GEBV accuracy improvement on lice/robustness',
      'Visible feed efficiency improvements',
    ],
  },
  {
    phase: 'Phase 3 (A3 Complete)',
    metrics: [
      'Model v1 serving "Select-Now" predictions',
      'Edit-or-Select dashboard by trait/region',
      'Regulatory playbooks for EU vs permissive markets',
    ],
  },
]

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
      badge: 'Partner Roadmap',
      headline: 'AI × Genomics × Aquaculture',
      subtitle: 'Partner Roadmap for Salmon Genetic Improvement',
      insightBox: {
        label: 'Tagline',
        text: 'Transforming a 2.5-Generation Dataset into Competitive Advantage',
      },
    },
  },
  {
    id: 'opportunity',
    title: 'The Opportunity',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Slide 02',
      heading: 'The Opportunity',
      description: 'Transform raw breeding data into predictive, proprietary competitive advantage',
      left: {
        title: 'The Asset',
        variant: 'neutral',
        items: [
          '2.5-generation genomic and phenotypic dataset',
          'Longitudinal breeding records across multiple traits',
          'Operational data: feed, treatments, lice counts, mortality',
          'Your most valuable unrefined asset',
        ],
      },
      right: {
        title: 'The Unlock',
        variant: 'positive',
        items: [
          'AI transforms raw data into predictive, proprietary IP',
          'Genomic selection delivers 10-25% improvement over pedigree methods',
          'Custom models create capabilities competitors cannot replicate',
        ],
      },
    },
  },
  {
    id: 'archetypes',
    title: 'Three Platform Archetypes',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 03',
      heading: 'Three Platform Archetypes',
      description: 'Progressive capabilities that build upon each other',
      columns: 3,
      items: [
        {
          title: 'Archetype 1: Data Foundation',
          icon: getIcon('database'),
          subtitle: 'Data ingestion, cleaning, harmonization',
          description: 'Prerequisite for all AI',
        },
        {
          title: 'Archetype 2: Purpose-Built GS',
          icon: getIcon('dna'),
          subtitle: 'Standard genomic selection (GBLUP)',
          description: '10-25% immediate accuracy gain',
        },
        {
          title: 'Archetype 3: Custom AI Models',
          icon: getIcon('ai'),
          subtitle: 'Novel discovery, trait imputation',
          description: 'Competitive moat—proprietary IP',
        },
      ],
      insightBox: {
        label: 'Strategy',
        text: 'Buy Archetype 2 for efficiency → Build Archetype 3 for advantage',
      },
    },
  },
  {
    id: 'roadmap',
    title: 'The Staged Roadmap',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 04',
      heading: 'The Staged Roadmap',
      description: 'Three overlapping phases building toward production AI',
      columns: 3,
      items: [
        {
          title: 'A1: AI-Ready Data',
          subtitle: '0-6 months',
          icon: getIcon('database'),
          items: [
            'Clean IDs, standardized ontologies',
            'API front-door for partners',
            'Backfill phenotypes from existing logs',
          ],
        },
        {
          title: 'A2: Scalable Phenotypes',
          subtitle: '3-12 months',
          icon: getIcon('growth'),
          items: [
            'High-throughput AI phenotyping',
            'Index v1: growth, g-FCR, lice, robustness',
            'GBLUP vs ML validation',
          ],
        },
        {
          title: 'A3: Multi-Modal Model',
          subtitle: '6-24 months',
          icon: getIcon('ai'),
          items: [
            'Production-grade model integrating all data streams',
            'Edit-or-Select dashboard by region',
            'Regulatory pathway preparation',
          ],
        },
      ],
    },
  },
  {
    id: 'use-cases',
    title: 'High-Value AI Use Cases',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 05',
      heading: 'Creating Proprietary Phenotypes',
      description: 'AI enables breeding for traits that were previously unmeasurable',
      columns: 3,
      items: [
        {
          title: 'AI-Imputed FCR (g-FCR)',
          icon: getIcon('chart'),
          items: [
            "Problem: Can't measure individual FCR in net-pens",
            'Solution: AI imputes individual scores from family/genomic data',
            'Impact: Only operator breeding for feed efficiency',
          ],
        },
        {
          title: 'Sea Lice Resistance',
          icon: getIcon('shield'),
          items: [
            'Problem: Costs industry $1B+ annually',
            'Solution: AI-enhanced GWAS identifies resistance gene networks',
            'Impact: Accelerated selection for resistant broodstock',
          ],
        },
        {
          title: 'Robustness & Gill Health',
          icon: getIcon('health'),
          items: [
            'Problem: Difficult to quantify at scale',
            'Solution: AI image analysis → genomic linkage',
            'Impact: New GEBVs for previously unmeasurable traits',
          ],
        },
      ],
      insightBox: {
        label: 'Competitive Moat',
        text: 'These proprietary phenotypes cannot be replicated without equivalent longitudinal data',
      },
    },
  },
  {
    id: 'partners',
    title: 'Recommended Partner Ecosystem',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 06',
      heading: 'Recommended Partner Ecosystem',
      description: 'Four specialized partners to execute the staged roadmap',
      columns: 2,
      items: [
        {
          title: 'Aquaticode',
          subtitle: 'A2 Phenotyping',
          icon: getIcon('automation'),
          items: [
            'SORTpro: 10,000 fish/hour at >97% accuracy',
            '60M+ fish sorted with major producers',
            'Grieg Seafood adoption Nov 2025',
          ],
        },
        {
          title: 'Xelect / Genus',
          subtitle: 'A2 Genomics',
          icon: getIcon('dna'),
          items: [
            'Aquaculture-native GS at scale',
            'Optimate software for complex breeding',
            'Population-specific index design with IP protection',
          ],
        },
        {
          title: 'SINTEF Digital',
          subtitle: 'A3 Model Builder',
          icon: getIcon('ai'),
          items: [
            'Hybrid AI expertise (domain + ML)',
            'Production deployment capability',
            'Full-scale ACE research facility',
          ],
        },
        {
          title: 'Nofima',
          subtitle: 'A3 Scientific Advisory',
          icon: getIcon('lab'),
          items: [
            'Leading salmon genetics research',
            'CMSEdit, CrispResist projects',
            'Regulatory navigation expertise',
          ],
        },
      ],
      insightBox: {
        label: 'Central Asset',
        text: 'Your 2.5-generation dataset is the foundation—partners provide specialized capabilities',
      },
    },
  },
  {
    id: 'regulatory',
    title: 'Regulatory Landscape',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 07',
      heading: 'Regulatory Landscape',
      description: 'Global regulatory environment for gene editing in aquaculture',
      columns: 2,
      items: [
        {
          title: 'Regional Status',
          icon: getIcon('strategy'),
          items: [
            'EU: Restrictive — GMO regulations apply to all gene editing',
            'UK, Norway: Evolving — Precision breeding pathways emerging',
            'US, Canada, Japan, Argentina: Permissive — Case-by-case or not regulated as GMO',
          ],
        },
        {
          title: 'Recent Updates',
          icon: getIcon('info'),
          items: [
            'UK: Precision Breeding Regulations in force (Nov 2025)',
            'UK: Plants operational; animals pending',
            'UK: First gene-edited foods expected late 2026',
            'Norway: 7-4 committee recommendation favorable',
            'Norway: Industry awaiting legislative action',
          ],
        },
      ],
      insightBox: {
        label: 'Strategic Flexibility',
        text: 'AI enables parallel breeding programs—selection-only for restrictive markets, selection + editing for permissive markets',
      },
    },
  },
  {
    id: 'developments',
    title: 'Recent Market Developments',
    type: 'list',
    content: {
      type: 'list',
      sectionLabel: 'Slide 08',
      heading: 'Recent Market Developments',
      description: 'Last 60 Days',
      groups: [
        {
          title: 'Industry Momentum',
          icon: getIcon('rocket'),
          items: [
            {
              text: 'Aug 2025: Tidal (Google X) launches autonomous AI lice control at AquaNor 2025',
            },
            {
              text: 'Nov 2025: Grieg Seafood adopts Aquaticode—first vaccination line integration',
            },
            {
              text: 'Apr 2025: ISAV resistance breakthrough via triple gene CRISPR knockout',
            },
            {
              text: 'Nov 2025: UK Precision Breeding Regulations enter force',
            },
            {
              text: 'Apr 2025: SINTEF releases SOLAQUA dataset for aquaculture AI research',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'metrics',
    title: 'Success Metrics',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 09',
      heading: 'Investment & Success Metrics',
      description: 'Clear milestones for each phase',
      columns: 3,
      items: [
        {
          title: 'Phase 1 (A1 Complete)',
          icon: getIcon('check'),
          items: [
            '✓ Queryable trait time series operational',
            '✓ Reliable pen-level g-FCR proxy validated',
            '✓ 2-3 partner APIs integrated',
          ],
        },
        {
          title: 'Phase 2 (A2 Complete)',
          icon: getIcon('check'),
          items: [
            '✓ Selection decisions incorporate AI-derived traits',
            '✓ 15-20% GEBV accuracy improvement on lice/robustness',
            '✓ Visible feed efficiency improvements',
          ],
        },
        {
          title: 'Phase 3 (A3 Complete)',
          icon: getIcon('check'),
          items: [
            '✓ Model v1 serving "Select-Now" predictions',
            '✓ Edit-or-Select dashboard by trait/region',
            '✓ Regulatory playbooks for EU vs permissive markets',
          ],
        },
      ],
      insightBox: {
        label: 'Key Talent Investment',
        text: '2-3 computational biologists to own proprietary models and manage partner ecosystem',
      },
    },
  },
  {
    id: 'summary',
    title: 'Summary & Next Steps',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Slide 10',
      heading: 'Summary & Next Steps',
      left: {
        title: 'Key Takeaways',
        variant: 'positive',
        items: [
          'The Asset: Your 2.5-generation dataset is a formidable competitive moat—AI is the only tool to unlock its full value',
          'The Strategy: Buy Archetype 2 for immediate gains; Build Archetype 3 for defensible advantage',
          'The Opportunity: AI-managed parallel breeding programs enable serving global markets from single broodstock',
        ],
      },
      right: {
        title: 'Next Steps',
        variant: 'neutral',
        items: [
          '☐ Initiate A1 data architecture workstream',
          '☐ Engage Aquaticode for pilot phenotyping assessment',
          '☐ Open discussions with Xelect on index design',
          '☐ Schedule SINTEF/Nofima advisory scoping',
        ],
      },
    },
  },
]

export default slides
