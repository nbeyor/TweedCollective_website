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
          description: 'Default to a selection-only, AI-accelerated path globally (Path A) with a Northern Europe–first posture. Maintain a segregated gene-edited lane (Path B) only where rules and labeling allow—without risking broad market access or brand integrity.',
        },
        {
          title: 'AI capability investment appetite',
          icon: getIcon('database'),
          description: 'Build sequentially from C1 Data Foundation (AI-ready lake, clean IDs, APIs) to C2 Genomic Selection with AI Phenotyping (high-throughput labels, custom index, decision impact) to C3 Custom Multi-Modal Model (focused ML, not an LLM, served via APIs).',
        },
        {
          title: 'Trait prioritization',
          icon: getIcon('strategy'),
          description: 'Force-rank traits by business value, data readiness, and AI fit: FCR as the long-run moat; disease-specific resistance (IPN proven, ISA next) for high single-gene selection response; sea-lice for near-term wins; gill/robustness as additive lift.',
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
        text: 'Given our Northern Europe–first posture, Path A is the recommended default. Define how AI effort is allocated: the bulk to Path A selection acceleration, with Path B maintained as a live option activated only when a specific market-regulatory trigger justifies segregation costs.',
      },
    },
  },

  // Slide 3b: What You Have To Believe
  {
    id: 'path-deep-dive',
    title: 'Path A and Path B — What You Have To Believe',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Slide 03b',
      heading: 'Path A and Path B — What You Have To Believe',
      left: {
        title: 'Path A — Selection-only, AI-accelerated',
        variant: 'neutral',
        items: [
          'What you have to believe: AI-accelerated phenotyping (PIT+camera fusion) and genomic selection can deliver sufficient genetic gain without direct genome modification; compounding selection gains across cohorts will close any gap with edited competitors over 5–10 years.',
          'Northern Europe (EU/Norway) market access and brand integrity outweigh the speed advantage of gene editing. Triploid sterility (targeting 100% by 2027) addresses containment and ESG concerns without needing GE.',
          'Concrete actions: Build PIT+camera phenotyping pipeline for individual-level trait measurement. Deploy genomic selection indices across cohorts and compound gains each generation. Maintain full EU/Northern Europe regulatory compliance. No segregated supply chain costs — single product line globally.',
        ],
      },
      right: {
        title: 'Path B — Selection plus AI-informed gene editing',
        variant: 'neutral',
        items: [
          'What you have to believe: Permissive-market revenue (US, Japan, potentially UK) justifies the cost of a segregated edited product line; consumer acceptance of gene-edited salmon will grow faster than regulatory barriers fall.',
          'Specific single-gene targets (ISA sialic acid receptor, disease resistance, FCR-related candidates) will deliver step-change trait gains that selection alone cannot match within the same timeframe. Segregation costs and brand risk can be managed without contaminating Path A market access.',
          'Concrete actions: Identify and validate single-gene edit targets in silico. Build segregated supply chain with labeling and chain-of-custody for permissive markets. Maintain strict containment to protect Path A brand. Monitor regulatory shifts (UK precision breeding framework, EU review cycles).',
        ],
      },
      insightBox: {
        label: 'Recommendation',
        text: 'The team\'s enthusiasm for Path B is noted, but the Northern Europe–first posture and current regulatory landscape make Path A the recommended default. Path B should be maintained as a live option with in-silico preparatory work, activated only when a specific market-regulatory trigger justifies segregation costs.',
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
          description: 'Create scalable labels using PIT+camera fusion — PIT tags provide reliable individual identity (camera-only solutions such as Tidal and Aquaticode are not yet sufficiently accurate for single-fish ID) while cameras deliver non-invasive trait measurement at vaccination/handling (robustness/gill, sex/maturation) and continuous lice/biomass/feeding signals. Stand up a custom selection index and quantify decision impact on our population. Output: selection decisions improve this season; visible operational gains.',
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
            'Common gaps: requires hands-on data science, experimental design, clean joins to environment, and bioeconomic framing. Camera-only individual fish ID remains insufficient under field conditions (phenotypic instability during smoltification, inconsistent lighting).',
            'Work required: PIT+camera fusion pipeline (PIT as identity backbone, camera for non-invasive trait capture); label QA; genotyping strategy; benchmarking of prediction methods; governance for index refresh.',
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
          'Biggest COGS lever; widest global impact. Remote feeding centers already showing gains (industry bFCR records at 0.98).',
          'Longitudinal ops data supports robust proxies; compounds across cohorts. PIT+camera fusion enables individual-level feed-efficiency tracking.',
          'CV biomass, sensor fusion, time-series optimization for feeding; transformer-based appetite modeling demonstrating substantial feed savings.',
        ],
        [
          'Disease-specific resistance (IPN / ISA)',
          'Major mortality and cost driver in Northern Europe; single-gene targets offer high selection response per generation.',
          'IPN QTL (chr 26) already exploited — accounts for >80% of genetic variation in IPN resistance. ISA sialic acid receptor biology suggests a similar single-gene opportunity worth pursuing.',
          'In-silico target triage; genomic prediction from challenge-test data; marker-assisted selection at scale. AI accelerates candidate gene identification and validation.',
        ],
        [
          'Sea-lice burden/resistance',
          'High cost; strong near-term demo value. Laser treatment data and imaging provide existing operational baseline.',
          'Existing imaging/laser data provides rich labels; PIT-tagged fish enable individual lice-burden tracking across treatment events.',
          'Vision models for counts/severity; holographic detection trialed (Mowi + Aberdeen); modeling improves resistance selection.',
        ],
        [
          'Gill health/robustness',
          'Mortality and handling reduction; additive to FCR and lice gains.',
          'Existing datasets help; incremental to FCR and lice. PIT+camera phenotyping at vaccination/handling events captures gill scores.',
          'Behavioural CV and event-linked models feed the index; AI-driven non-invasive welfare monitoring advancing rapidly.',
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
          'Sterility and escapes',
          'Actively being addressed via triploid induction (currently 70–80% effective; targeting 100% by end of 2027). Not gene-editing dependent. Full sterility may shift regulatory dynamics for GE over time but is unlikely to change near-term decisions. Welfare trade-offs at larger body sizes are a known concern.',
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
          'Production-scale AI phenotyping at vaccination/handling; standardized robustness/gill/sex/maturation labels. Note: camera-only individual fish ID is not yet sufficiently accurate — PIT+camera fusion is needed for reliable individual-level phenotyping.',
          'Generate scalable phenotypes to feed selection and operations; integrate with PIT-tag identity backbone for individual-level trait linkage',
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
          'C2',
          'Tidal (Alphabet X spinout)',
          'AI-powered underwater cameras and sensors deployed in 230+ pens (Mowi); biomass estimation, feeding optimization, lice detection',
          'Complement PIT-tag phenotyping with continuous in-pen monitoring; feed optimization and welfare signals',
        ],
        [
          'Active',
          'IMR (sterility/escapes — active program)',
          'Deep sterility/escapes expertise and field context; supporting triploid induction program targeting 100% sterility by end of 2027',
          'Advisory and study design for triploid optimization; welfare monitoring at larger body sizes',
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
          title: 'Industry and Partners',
          items: [
            { text: 'Aquaticode signs agreements to sort more than 60 million fish with Australis and AquaChile.' },
            { text: 'Tidal (Alphabet X spinout) expands to 230+ pens with Mowi; deploys AI-powered underwater cameras for biomass, feeding, and welfare monitoring.' },
            { text: 'Tidal announces an AI lice-control approach using targeted energy.' },
            { text: 'Mowi rolls out "Mowi 4.0" across Norway; AI remote feeding centers achieve record biological FCR of 0.98 at Gorsten (Scotland).' },
            { text: 'Mowi + Aberdeen University + SAMS trial holographic AI for automated sea lice detection using trained image recognition.' },
            { text: 'Innovasea partners with Mila (Quebec AI Institute) to advance AI-powered fish tracking and production tools.' },
          ],
        },
        {
          title: 'AI and Technology',
          items: [
            { text: 'Camera-based individual fish ID confirmed still insufficient for field conditions (2026 Wageningen research: phenotypic instability during smoltification confounds algorithms). PIT tags remain the gold standard for individual identity.' },
            { text: 'Generative AI publications in aquaculture tripled from 130 (2021) to 451+ (2024); transformer architectures proving effective for feed conversion and appetite modeling.' },
            { text: 'EchoBERT transformer model demonstrates early pancreas disease detection in salmon more than one month before conventional methods.' },
            { text: 'CNN-based salmon disease detection reaches 99.71% classification accuracy across seven disease categories.' },
            { text: 'Industry investment in AI-related aquaculture initiatives exceeds $610 million globally.' },
          ],
        },
        {
          title: 'Regulatory and Genetics',
          items: [
            { text: 'Japan approves and commercializes CRISPR-edited red sea bream and tiger puffer.' },
            { text: 'EU Court of Justice confirms gene-edited organisms are regulated as GMOs.' },
            { text: 'UK advances a precision breeding framework; animal pathway pending secondary rules.' },
            { text: 'US permits genetically engineered salmon with bioengineered labeling and strict containment requirements.' },
            { text: 'Triploid sterility achieves near-100% rates with optimized hydrostatic pressure protocols, but welfare trade-offs at larger body sizes noted (2025 Scientific Reports).' },
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
          description: 'Default to selection-only, AI-accelerated globally with a Northern Europe–first posture (Path A). Maintain Path B as a live option with in-silico prep; activate only when a specific market-regulatory trigger justifies segregation costs.',
        },
        {
          title: 'AI capability investment appetite',
          icon: getIcon('database'),
          description: 'Fund C1 and C2 now (AI-ready data product; PIT+camera fusion phenotyping; custom index). Scope C3 in parallel with a tech-native builder and a Scandinavian academic partner. Invest in PIT+camera pipeline as the phenotyping backbone — camera-only is not yet sufficient.',
        },
        {
          title: 'Trait prioritization',
          icon: getIcon('strategy'),
          description: 'Anchor the long-run moat in FCR; pursue single-gene disease resistances (IPN proven, ISA next via sialic acid receptor targets); use sea-lice for near-term wins; add gill/robustness as incremental lift. Deliver full triploid sterility by 2027.',
        },
        {
          title: 'Partners',
          icon: getIcon('briefcase'),
          description: 'Confirm current relationships; formalize Aquaticode (with PIT+camera integration scope), deepen Nofima, engage SINTEF to operationalize the model, and leverage Tidal deployment data. IMR actively supporting triploid sterility program.',
        },
      ],
    },
  },
]

export default slides
