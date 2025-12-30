/**
 * AI × Genomics × Aquaculture (Salmon)
 * Choices, Partners, and a Regulatory Lens
 *
 * Pure data representation of slide content.
 * Visual specifications are managed centrally in lib/slideTemplates.ts
 * Icons reference semantic names from the icon registry
 */

import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'salmon-ai-genomics'

// ============================================
// Slide Content Data
// ============================================

export const slides: SlideData[] = [
  // Slide 1: Title
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      headline: 'AI × Genomics × Aquaculture (Salmon)',
      subtitle: 'Choices, Partners, and a Regulatory Lens\nDecember 30, 2025',
    },
  },

  // Slide 2: Executive Summary
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 02',
      heading: 'Executive Summary',
      headerSection: {
        heading: 'Why now',
        items: [
          'Terrestrial agriculture has already demonstrated that dense phenotyping, modern genomics, and applied AI can unlock step-change gains. Aquaculture is positioned to do the same at commercial scale.',
          'Durable advantage comes from longitudinal genotype–phenotype–environment data we own and the ability to act on it quickly across cohorts and sites.',
        ],
      },
      columns: 4,
      layout: 'horizontal-cards',
      items: [
        {
          title: 'AI strategy vs regulatory reality',
          icon: getIcon('shield'),
          description: 'Decide where AI delivers the most profit by market: pursue a selection-only, AI-accelerated path globally, and consider a segregated gene-edited path only where rules and labeling allow—without risking broad market access.',
        },
        {
          title: 'AI capability investment appetite',
          icon: getIcon('database'),
          description: 'Build sequentially from C1 Data Foundation (AI-ready lake, clean IDs, APIs) to C2 Genomic Selection with AI Phenotyping (high-throughput labels, custom index, decision impact) to C3 Custom Multi-Modal Model (focused ML, not an LLM, served via APIs).',
        },
        {
          title: 'Trait prioritization',
          icon: getIcon('strategy'),
          description: 'Force-rank traits by business value, data readiness, and AI fit: FCR as the long-run moat; sea-lice for near-term wins leveraging existing imaging/laser data; gill/robustness as additive lift.',
        },
        {
          title: 'Partners',
          icon: getIcon('briefcase'),
          description: 'Keep a short, high-impact bench that preserves IP and speed; confirm existing relationships and fill gaps quickly.',
        },
      ],
    },
  },

  // Slide 3: AI Strategy Versus Regulatory Backdrop
  {
    id: 'ai-strategy-regulatory',
    title: 'AI Strategy Versus Regulatory Backdrop',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Slide 03',
      heading: 'AI Strategy Versus Regulatory Backdrop',
      left: {
        title: 'Path A — Selection-only, AI-accelerated',
        variant: 'neutral',
        items: [
          'Widest market access (EU-safe) and brand flexibility. AI enhances phenotyping and selection accuracy, compounding gains cohort by cohort.',
        ],
      },
      right: {
        title: 'Path B — Selection plus AI-informed gene editing',
        variant: 'neutral',
        items: [
          'Faster trait improvements where allowed, but limited to permissive markets and requiring labeling, segregation, and strict chain-of-custody. Apply carefully so Path A is never jeopardized.',
        ],
      },
      insightBox: {
        label: 'Decision focus',
        text: 'Define where each path operates, how supply chains remain segregated, and how AI effort is allocated across Path A and Path B.',
      },
    },
  },

  // Slide 4: Regulatory Segmentation Map (custom)
  {
    id: 'regulatory-map',
    title: 'Regulatory Segmentation Map',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'regulatory-map',
      props: {
        regions: [
          {
            name: 'European Union',
            description: 'Transgenic fish banned; gene-edited animals treated as GMOs → selection-only.',
          },
          {
            name: 'United Kingdom',
            description: 'Precision breeding framework advancing; plants moving first, animals expected to follow → selection-only now; edited potential later.',
          },
          {
            name: 'United States',
            description: 'Edited lines possible with labeling and strict containment → selection-only and edited, with segregation.',
          },
          {
            name: 'Japan',
            description: 'Prior approvals for CRISPR-edited fish → selection-only and edited, with segregation.',
          },
        ],
        note: 'This reflects current rules. Both regulations and available AI/phenotype data will evolve; revisit segmentation periodically.',
      },
    },
  },

  // Slide 5: Risk Posture And How It Could Evolve
  {
    id: 'risk-posture',
    title: 'Risk Posture And How It Could Evolve',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 05',
      heading: 'Risk Posture And How It Could Evolve',
      columns: 2,
      items: [
        {
          title: 'EU-first moat',
          icon: getIcon('lock'),
          description: 'If edited animals remain constrained, AI-accelerated selection gains are the core profit engine. Prioritize selection-only globally; keep edit work in silico for targeted markets.',
        },
        {
          title: 'Selective openings',
          icon: getIcon('check'),
          description: 'If more markets clarify edited-animal pathways, pilot small, segregated edited SKUs while maintaining selection-only as the mainline business.',
        },
        {
          title: 'Backlash or delay',
          icon: getIcon('alert'),
          description: 'If scrutiny increases on edited animals, double down on AI-driven selection and operations (feeding, treatment timing) to protect access and margin.',
        },
        {
          title: 'Technology step-change',
          icon: getIcon('automation'),
          description: 'If multimodal phenotyping and modeling materially improve outcomes, Path A becomes more attractive on EBITDA; edits remain optional accelerants where rules allow.',
        },
      ],
    },
  },

  // Slide 6: Investment Appetite In AI Capabilities
  {
    id: 'investment-appetite',
    title: 'Investment Appetite In AI Capabilities',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 06',
      heading: 'Investment Appetite In AI Capabilities',
      columns: 3,
      items: [
        {
          title: 'C1 — Data foundation',
          icon: getIcon('database'),
          description: 'Make the lake AI-ready: stable IDs, time-aligned events, partner-grade APIs, private-cloud training zone, plus gap-fill phenotypes (lice-laser time series, pen-level FCR proxy). Output: a governed, queryable data product that partners and models can use immediately.',
        },
        {
          title: 'C2 — Genomic selection with AI phenotyping',
          icon: getIcon('chart'),
          description: 'Create scalable labels at vaccination/handling (robustness/gill, sex/maturation) and continuous lice/biomass/feeding signals; stand up a custom selection index and quantify decision impact on our population. Output: selection decisions improve this season; visible operational gains.',
        },
        {
          title: 'C3 — Custom multi-modal model',
          icon: getIcon('cpu'),
          description: 'Train a focused ML model (not an LLM) on our genotypes, AI phenotypes, and environment; serve select-now scores and market-specific edit-or-select priorities via APIs. Output: a compounding model moat tied to our data and workflows.',
        },
      ],
    },
  },

  // Slide 7: Technical Considerations
  {
    id: 'technical-considerations',
    title: 'Technical Considerations',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 07',
      heading: 'Technical Considerations',
      columns: 3,
      items: [
        {
          title: 'C1 Data foundation',
          icon: getIcon('database'),
          items: [
            'Common gaps: lakes not modeled for joins/time windows; inconsistent ontologies; thin partner APIs.',
            'Work required: entity resolution, event schemas, RBAC APIs, change-data capture, lice time-series from laser logs, validated FCR proxies.',
          ],
        },
        {
          title: 'C2 Genomic selection with AI phenotyping',
          icon: getIcon('chart'),
          items: [
            'Common gaps: requires hands-on data science, experimental design, clean joins to environment, and bioeconomic framing.',
            'Work required: label QA, genotyping strategy, benchmarking of prediction methods, governance for index refresh.',
          ],
        },
        {
          title: 'C3 Custom multi-modal model',
          icon: getIcon('cpu'),
          items: [
            'Common gaps: not push-button; may need synthetic data to bridge sparsity; security and IP must be explicit.',
            'Work required: feature engineering across time-series CV + genotype + environment, uncertainty estimates, serving/MLOps, monitoring and drift controls.',
          ],
        },
      ],
    },
  },

  // Slide 8: Trait Prioritization (table)
  {
    id: 'trait-prioritization',
    title: 'Trait Prioritization',
    type: 'table',
    content: {
      type: 'table',
      sectionLabel: 'Slide 08',
      heading: 'Trait Prioritization',
      headers: ['Trait', 'Business value', 'Why enabled here', 'Why AI fits'],
      rows: [
        [
          'FCR (proxy)',
          'Biggest COGS lever; widest global impact',
          'Longitudinal ops data supports robust proxies; compounds across cohorts',
          'CV biomass, sensor fusion, time-series optimization for feeding',
        ],
        [
          'Sea-lice burden/resistance',
          'High cost; strong demo value',
          'Existing imaging/laser data provides rich labels',
          'Vision for counts/severity; modeling improves resistance selection',
        ],
        [
          'Gill health/robustness',
          'Mortality and handling reduction',
          'Existing datasets help; incremental to FCR and lice',
          'Behavioural CV and event-linked models feed the index',
        ],
      ],
      highlightFirstColumn: true,
    },
  },

  // Slide 9: Other Traits And Why They Are Deferred (table)
  {
    id: 'other-traits',
    title: 'Other Traits And Why They Are Deferred',
    type: 'table',
    content: {
      type: 'table',
      sectionLabel: 'Slide 09',
      heading: 'Other Traits And Why They Are Deferred',
      headers: ['Trait', 'Reason to defer now'],
      rows: [
        [
          'Growth rate',
          'Lower incremental EBITDA vs FCR at this stage; revisit if models surface outsized signal',
        ],
        [
          'Fillet yield and quality',
          'Harder to measure consistently at scale; add once phenotypes stabilize',
        ],
        [
          'Disease-specific resistances',
          'May require wet-lab validation and regulatory gating; keep in the in-silico queue',
        ],
        [
          'Sterility and escapes',
          'Strong ESG angle; better aligned to edited track and timing; scope with academic guidance',
        ],
      ],
    },
  },

  // Slide 10: Partners And Why (table)
  {
    id: 'partners',
    title: 'Partners And Why',
    type: 'table',
    content: {
      type: 'table',
      sectionLabel: 'Slide 10',
      heading: 'Partners And Why',
      headers: ['Layer', 'Partner', 'Why now', 'Where they plug in'],
      rows: [
        [
          'C2',
          'Aquaticode (SORTpro)',
          'Production-scale AI phenotyping at vaccination/handling; standardized robustness/gill/sex/maturation labels',
          'Generate scalable phenotypes to feed selection and operations',
        ],
        [
          'C3',
          'SINTEF Digital/Ocean',
          'Tech-native builder for production ML in aquaculture (vision, sensor fusion, behaviour/feeding control); secure deployment',
          'Build and operate the multi-modal model; APIs; reliability targets',
        ],
        [
          'C3 Academic',
          'Nofima (existing relationship to deepen)',
          'Scandinavian authority in salmon genetics and lice/gill biology; regulatory-aware; strong in in-silico CRISPR target triage',
          'Trait biology guidance; market-specific edit-or-select priorities',
        ],
        [
          'Option',
          'IMR (if sterility/escapes prioritized)',
          'Deep sterility/escapes expertise and field context',
          'Advisory and study design for sterility strategy',
        ],
      ],
      insightBox: {
        label: 'Note',
        text: 'Verify existing discussions; surprising there is no formal arrangement with Aquaticode. There is a clear opportunity to expand the Nofima collaboration. SINTEF can work alongside Nofima to accelerate model delivery.',
      },
    },
  },

  // Slide 11: Recent Announcements And Signals
  {
    id: 'recent-announcements',
    title: 'Recent Announcements And Signals',
    type: 'list',
    content: {
      type: 'list',
      sectionLabel: 'Slide 11',
      heading: 'Recent Announcements And Signals',
      groups: [
        {
          title: '',
          items: [
            { text: 'Aquaticode signs agreements to sort more than 60 million fish with Australis and AquaChile.' },
            { text: 'Tidal, a spinout from Alphabet\'s X, launches as an independent aquaculture AI company and expands deployments in Chile.' },
            { text: 'Tidal announces an AI lice-control approach using targeted energy.' },
            { text: 'Japan approves and commercializes CRISPR-edited red sea bream and tiger puffer.' },
            { text: 'EU Court of Justice confirms gene-edited organisms are regulated as GMOs.' },
            { text: 'UK advances a precision breeding framework; animal pathway pending secondary rules.' },
            { text: 'US permits genetically engineered salmon with bioengineered labeling and strict containment requirements.' },
          ],
        },
      ],
    },
  },

  // Slide 12: Recommendations
  {
    id: 'recommendations',
    title: 'Recommendations',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Slide 12',
      heading: 'Recommendations',
      columns: 4,
      layout: 'horizontal-cards',
      items: [
        {
          title: 'AI vs regulatory reality',
          icon: getIcon('shield'),
          description: 'Default to selection-only, AI-accelerated globally; keep a small, segregated edited lane only in permissive markets with clear labeling and chain-of-custody.',
        },
        {
          title: 'AI capability investment appetite',
          icon: getIcon('database'),
          description: 'Fund C1 and C2 now (AI-ready data product; high-throughput phenotyping; custom index). Scope C3 in parallel with a tech-native builder and a Scandinavian academic partner.',
        },
        {
          title: 'Trait prioritization',
          icon: getIcon('strategy'),
          description: 'Anchor the long-run moat in FCR; use sea-lice for near-term wins leveraging existing imaging/laser data; add gill/robustness as incremental lift.',
        },
        {
          title: 'Partners',
          icon: getIcon('briefcase'),
          description: 'Confirm current relationships; formalize Aquaticode, deepen Nofima, and engage SINTEF to operationalize the model; bring IMR in if sterility becomes a priority.',
        },
      ],
    },
  },
]

export default slides
