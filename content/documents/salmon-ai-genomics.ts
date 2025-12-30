/**
 * Strategic AI for Salmon Genetic Improvement - Document Content
 * 
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'salmon-ai-genomics'

// ============================================
// Shared Data Objects
// ============================================

export const strategicLevels = [
  {
    title: 'Now: Optimize Breeding',
    description: 'Immediate accuracy gains through genomic selection',
    actions: ['Implement GEBVs', 'Modernize breeding program', 'Baseline accuracy uplift'],
  },
  {
    title: 'Next: Proprietary Phenotypes',
    description: 'Create hard-to-measure traits (g-FCR, g-Gill)',
    actions: ['Train custom models', 'Link phenotypes to genome', 'New selectable traits'],
  },
  {
    title: 'Moat: Dual Regulatory Strategies',
    description: 'Run GM + non-GM lines from same broodstock',
    actions: ['AI-managed pedigrees', 'Compliance tracking', 'Market optimization'],
  },
]

export const archetypes = [
  {
    id: 1,
    name: 'Data Unification/Governance',
    description: 'Data lake + ETL + harmonization',
    what: 'Unified data platform',
    why: 'Foundation for all advanced work',
    buildVsBuy: 'Build core, partner for tools',
  },
  {
    id: 2,
    name: 'Off-the-Shelf GS Tools',
    description: 'Standard GEBVs for measurable traits',
    what: 'Genomic selection software',
    why: 'Quick wins, baseline modernization',
    buildVsBuy: 'Buy/license, customize',
  },
  {
    id: 3,
    name: 'Custom Proprietary Models',
    description: 'Models trained on your dataset',
    what: 'g-FCR, proprietary phenotypes',
    why: 'Competitive moat, defensible IP',
    buildVsBuy: 'Build internally, own IP',
  },
]

export const roadmapPhases = [
  {
    phase: 1,
    title: 'Data Platform + GS Quick Wins',
    months: '0-6',
    milestones: ['Data lake setup', 'ETL pipelines', 'GS implementation', 'Baseline accuracy gains'],
  },
  {
    phase: 2,
    title: 'Custom Models (g-FCR, Lice)',
    months: '6-18',
    milestones: ['Model training', 'g-FCR development', 'Lice resistance models', 'Validation'],
  },
  {
    phase: 3,
    title: 'In Silico CRISPR Validation',
    months: '18-30',
    milestones: ['Safety package', 'Off-target analysis', 'Efficacy prediction', 'Regulatory prep'],
  },
  {
    phase: 4,
    title: 'Go/No-Go and Deploy Dual Lines',
    months: '30-36+',
    milestones: ['Decision point', 'Line separation', 'Compliance tracking', 'Market deployment'],
  },
]

export const regulatoryRegions = [
  {
    id: 'eu',
    name: 'European Union',
    allowed: 'Restrictive',
    labeling: 'Mandatory GM labeling',
    strategy: 'Non-GM line only',
  },
  {
    id: 'us',
    name: 'United States',
    allowed: 'Permissive',
    labeling: 'Case-by-case',
    strategy: 'Bioengineered line viable',
  },
  {
    id: 'asia',
    name: 'Asia',
    allowed: 'Mixed',
    labeling: 'Varies by country',
    strategy: 'Dual-track approach',
  },
]

export const glossaryTerms = [
  { term: 'GEBV', definition: 'Genomic Estimated Breeding Value - prediction of breeding value using genomic data' },
  { term: 'GWAS', definition: 'Genome-Wide Association Study - identifies genetic variants associated with traits' },
  { term: 'GBLUP', definition: 'Genomic Best Linear Unbiased Prediction - statistical method for genomic selection' },
  { term: 'ssGBLUP', definition: 'Single-Step GBLUP - combines pedigree and genomic data in one analysis' },
  { term: 'CNN', definition: 'Convolutional Neural Network - deep learning model for image analysis' },
  { term: 'gRNA', definition: 'Guide RNA - RNA molecule that directs CRISPR to target DNA sequence' },
  { term: 'g-FCR', definition: 'Genomic Feed Conversion Ratio - individual feed efficiency score imputed from genomic data' },
  { term: 'g-Gill', definition: 'Genomic Gill Health Score - selectable trait derived from computer vision analysis' },
]

export const dashboardKPIs = [
  { name: 'Selection Accuracy Uplift', value: '42%', trend: '+5%' },
  { name: 'g-FCR Model Performance', value: 'R² = 0.78', trend: '+0.12' },
  { name: 'Feed Cost Impact', value: '-18%', trend: 'Improving' },
  { name: 'Lice Resistance Gain', value: '+35%', trend: '+8%' },
  { name: 'Off-Target Risk Score', value: '92/100', trend: 'Safe' },
  { name: 'Regulatory Readiness', value: '75%', trend: 'On track' },
]

export const breedingGenerations = [
  { gen: 0, freq: 20, desc: 'Baseline allele frequency' },
  { gen: 1, freq: 28, desc: 'Initial selection pressure' },
  { gen: 2, freq: 38, desc: 'Accelerated gain' },
  { gen: 3, freq: 50, desc: 'Mid-program progress' },
  { gen: 4, freq: 65, desc: 'Near target' },
  { gen: 5, freq: 80, desc: 'Target achieved' },
]

// ============================================
// Slide Content Data
// ============================================

export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Strategic AI Integration',
      headline: 'Strategic AI for Salmon Genetic Improvement',
      subtitle: 'Turn 2.5 generations of genomic+phenotypic data into a predictive asset; move from "records" → "moat."',
      insightBox: {
        label: 'Why Now',
        text: 'Proprietary longitudinal data becomes defensible when used to train custom models. Transform historical records into competitive advantage through AI-driven genomic selection.',
      },
    },
  },
  {
    id: 'core-asset',
    title: 'The Core Asset',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Card 02',
      heading: 'The 2.5-Generation Dataset is the Moat',
      description: "Proprietary longitudinal data becomes defensible when used to train custom models. Competitors can buy software; they can't replicate models trained on your dataset.",
      columns: 2,
      items: [
        {
          title: 'Data Layers',
          icon: 'Database',
          color: 'purple',
          items: [
            'Genomics: SNP arrays, whole-genome sequences',
            'Phenotype: Growth, disease resistance, feed efficiency',
            'Environment: Water quality, temperature, pen conditions',
            'Pedigree: Family relationships, breeding history',
          ],
        },
        {
          title: 'AI Transformation',
          icon: 'Brain',
          color: 'green',
          items: [
            'Historical records → Predictive models',
            'Data becomes proprietary IP',
            'Competitive moat through custom training',
          ],
        },
      ],
    },
  },
  {
    id: 'three-levels',
    title: 'Three Strategic Levels',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ThreeLevelsSlide',
      props: { levels: 'strategicLevels' },
    },
  },
  {
    id: 'landscape-map',
    title: 'AI Platform Landscape',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'LandscapeMapSlide',
      props: { archetypes: 'archetypes' },
    },
  },
  {
    id: 'archetype-1',
    title: 'Archetype 1: Data Foundation',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Card 05',
      heading: 'Data is the Prerequisite (Archetype 1)',
      description: 'Data lake + ETL + harmonization; without this, advanced modeling fails.',
      left: {
        title: '❌ Before: Messy Sources',
        variant: 'negative',
        items: [
          'Fragmented databases across systems',
          'Inconsistent formats and schemas',
          'Missing metadata and lineage',
          'No single source of truth',
        ],
      },
      right: {
        title: '✅ After: Single Source of Truth',
        variant: 'positive',
        items: [
          'Unified data lake architecture',
          'Standardized ETL pipelines',
          'Complete data harmonization',
          'Ready for advanced modeling',
        ],
      },
    },
  },
  {
    id: 'archetype-2',
    title: 'Archetype 2: Quick Wins',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'BreedingAccuracySlide',
      props: {},
    },
  },
  {
    id: 'archetype-3',
    title: 'Archetype 3: Custom Models',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'CustomModelsSlide',
      props: {},
    },
  },
  {
    id: 'sea-lice',
    title: 'Use Case: Sea Lice Resistance',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Card 08',
      heading: 'Dissect Complex Traits with AI',
      description: 'AI-driven GWAS identifies gene networks driving lice resistance; accelerates selection.',
      columns: 3,
      items: [
        { title: 'Immune Pathways', icon: 'Dna', color: 'purple', description: 'Innate immune response networks' },
        { title: 'Mucus Production', icon: 'Shield', color: 'green', description: 'Protective barrier mechanisms' },
        { title: 'Skin Integrity', icon: 'Target', color: 'purple', description: 'Structural defense systems' },
      ],
      insightBox: {
        label: 'Key Insight',
        text: 'Traditional GWAS finds individual genes. AI identifies interacting networks, revealing polygenic resistance mechanisms that accelerate breeding programs.',
      },
    },
  },
  {
    id: 'gill-health',
    title: 'Use Case: Gill Health',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Card 09',
      heading: 'Convert Images into a Selectable Trait',
      description: 'CNN/computer vision scores gill health from photos/histology; link scores back to genome → new breeding value.',
      columns: 2,
      items: [
        {
          title: 'Computer Vision Pipeline',
          icon: 'Eye',
          color: 'green',
          items: [
            'Capture gill images/photos',
            'CNN model scores health (0-100)',
            'Link scores to genomic data',
            'Create new breeding value (g-Gill)',
          ],
        },
        {
          title: 'Breeding Impact',
          icon: 'TrendingUp',
          color: 'purple',
          items: [
            'Previously unmeasurable trait',
            'Now selectable in breeding',
            'Accelerates genetic gain',
          ],
        },
      ],
    },
  },
  {
    id: 'g-fcr',
    title: 'Proprietary g-FCR',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'GFCRSlide',
      props: {},
    },
  },
  {
    id: 'strategic-fork',
    title: 'The Strategic Fork',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'StrategicForkSlide',
      props: {},
    },
  },
  {
    id: 'pathway-1',
    title: 'Pathway 1: AI-Accelerated Breeding',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'BreedingPathwaySlide',
      props: { generations: 'breedingGenerations' },
    },
  },
  {
    id: 'pathway-2',
    title: 'Pathway 2: AI-Informed Gene Editing',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Card 13',
      heading: 'Edit Once, Gain in One Generation',
      description: 'AI supports (a) efficacy prediction (which edit works best) and (b) off-target risk scanning (regulatory-critical).',
      columns: 2,
      items: [
        {
          title: 'Efficacy Prediction',
          icon: 'Target',
          color: 'purple',
          items: [
            'Which edit works best',
            'Expected phenotypic outcome',
            'Success probability scoring',
          ],
        },
        {
          title: 'Off-Target Risk Scanning',
          icon: 'Shield',
          color: 'green',
          items: [
            'Regulatory-critical safety',
            'Predicted off-target sites',
            'Safety score with explainable factors',
          ],
        },
      ],
      insightBox: {
        label: 'Safety Score Panel',
        text: 'Target Site: High confidence | Off-Targets: 2 predicted (low risk) | Overall Safety: 92/100',
      },
    },
  },
  {
    id: 'regulatory',
    title: 'Regulatory Reality',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RegulatoryMapSlide',
      props: { regions: 'regulatoryRegions' },
    },
  },
  {
    id: 'dual-track',
    title: 'Dual-Track Program',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DualTrackSlide',
      props: {},
    },
  },
  {
    id: 'roadmap',
    title: 'Implementation Roadmap',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RoadmapSlide',
      props: { phases: 'roadmapPhases' },
    },
  },
  {
    id: 'operating-model',
    title: 'Operating Model',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Card 17',
      heading: 'Small Core Team + Targeted Partners',
      description: 'Hire 2–3 computational bio / bioinformatics experts to own models + manage vendors; pair with GS vendor + boutique AI/genomics partner(s).',
      columns: 2,
      items: [
        {
          title: 'Build Internally',
          icon: 'Users',
          color: 'purple',
          items: [
            '2-3 computational biologists',
            'Model ownership & IP',
            'Vendor management',
          ],
        },
        {
          title: 'Partner Strategically',
          icon: 'Target',
          color: 'green',
          items: [
            'GS vendor (off-the-shelf tools)',
            'Boutique AI/genomics partners',
            'Specialized expertise on-demand',
          ],
        },
      ],
    },
  },
  {
    id: 'dashboard',
    title: 'Executive Dashboard',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'DashboardSlide',
      props: { kpis: 'dashboardKPIs' },
    },
  },
  {
    id: 'glossary',
    title: 'Glossary',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'GlossarySlide',
      props: { terms: 'glossaryTerms' },
    },
  },
]

export default slides

