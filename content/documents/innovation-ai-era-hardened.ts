/**
 * Innovation in the AI Era - Hardened Presentation
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'innovation-ai-era-hardened'

export const slides: SlideData[] = [
  {
    id: 'title-thesis',
    title: 'Title / Thesis',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Executive Briefing',
      headline: 'Innovation in the AI Era',
      subtitle: 'How large health and life sciences companies should govern, fund, build, buy, partner, and invest when technology markets move faster than internal planning cycles',
      insightBox: {
        label: 'Thesis',
        text: 'AI has changed more than the technology stack. It has changed the speed, economics, and structure of innovation itself. The winning model is disciplined, flexible, and tightly tied to business value.',
      },
      metrics: [
        {
          value: '88%',
          label: 'Enterprises have adopted AI',
          source: 'McKinsey Global Survey 2025',
        },
        {
          value: '4%',
          label: 'Consistently generate meaningful AI value',
          source: 'BCG AI Survey 2024',
        },
      ],
    },
  },
  {
    id: 'three-forces',
    title: 'Three Forces Broke the Old Model',
    type: 'list',
    content: {
      type: 'list',
      heading: 'Three Forces Broke the Old Innovation Model',
      groups: [
        {
          title: 'Capability explosion',
          icon: 'Zap',
          color: 'green',
          items: [
            {
              text: 'AI inference cost dropped 280x in 18 months; top-to-10th model performance gap compressed to 5.4%',
              subtext: 'Foundation models now cover language, code, search, reasoning, and multimodal tasks as a general layer',
            },
          ],
        },
        {
          title: 'Capital reallocation',
          icon: 'TrendingUp',
          color: 'gold',
          items: [
            {
              text: 'U.S. digital health funding rebounded to $14.2B in 2025 (+35% YoY), with AI startups capturing 54% share',
              subtext: 'Global private AI investment reached $252B, enabling parallel experimentation outside incumbents',
            },
          ],
        },
        {
          title: 'Enterprise implication',
          icon: 'Building2',
          color: 'purple',
          items: [
            {
              text: 'The challenge is no longer invention; it is capital and attention allocation in a market moving faster than the enterprise',
              subtext: '92% of Fortune 500 use ChatGPT, yet nearly two-thirds remain in pilot mode',
            },
          ],
        },
      ],
      insightBox: {
        label: 'Implication',
        text: 'Adoption is no longer the differentiator. Value extraction is.',
      },
    },
  },
  {
    id: 'historical-frame',
    title: 'How We Got Here',
    type: 'timeline',
    content: {
      type: 'timeline',
      heading: 'From Custom AI to Market-Driven Innovation',
      items: [
        {
          id: 1,
          label: 'Era 1',
          date: 'Pre-2020',
          title: 'Narrow AI and internal build',
          description: 'Analytics and automation were scoped to specific problems with heavy dependence on internal model development.',
          metrics: [
            'Drug discovery AI mainly QSAR and docking',
            'FDA had ~130 cumulative AI-enabled device authorizations by end of 2019',
          ],
        },
        {
          id: 2,
          label: 'Era 2',
          date: '2020-2023',
          title: 'Foundation model breakout',
          description: 'Breakthroughs in model capability and adoption compressed research-to-product cycles.',
          metrics: [
            'AlphaFold 2 solved protein folding challenge',
            'Med-PaLM to Med-PaLM 2: 67.6% to 86.5% USMLE in four months',
            'ChatGPT reached 100M users in two months',
          ],
        },
        {
          id: 3,
          label: 'Era 3',
          date: '2024-present',
          title: 'Enterprise adaptation',
          description: 'The strategic problem shifted to operationalization, governance, and portfolio design.',
          metrics: [
            'FDA AI/ML device authorizations exceeded 1,300 cumulative',
            'Innovation became portfolio and governance design, not only technical capability',
          ],
        },
      ],
    },
  },
  {
    id: 'foundation-model-categories',
    title: 'How Foundation Models Show Up',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'How Foundation Models Actually Show Up in Life Sciences and Health',
      columns: 3,
      items: [
        {
          title: 'Employee productivity',
          icon: 'Users',
          description: 'Research synthesis, drafting, summarization, coding support',
          items: ['J&J Rep Copilot', '10-15% of use cases generated ~80% of value'],
        },
        {
          title: 'Workflow automation',
          icon: 'Workflow',
          description: 'Copilots in process flows and exception handling',
          items: ['Cohere Health prior auth at scale', '61% lower provider data-entry time'],
        },
        {
          title: 'Knowledge systems',
          icon: 'Search',
          description: 'Enterprise retrieval and clinical decision support',
          items: ['Dragon Copilot ecosystem integrations', 'Kaiser rollout of ambient documentation'],
        },
        {
          title: 'Customer and patient experience',
          icon: 'HeartPulse',
          description: 'Service automation and personalization',
          items: ['IU Health AI self-scheduling', '35,000+ appointments booked'],
        },
        {
          title: 'Product enhancement',
          icon: 'Package',
          description: 'AI-native features and smarter workflows',
          items: ['1,300+ FDA authorized AI devices', '$13.7B to $255B+ market expansion'],
        },
        {
          title: 'New business creation',
          icon: 'Rocket',
          description: 'New offerings, channels, and service layers',
          items: ['Lilly + NVIDIA TuneLab', 'AI trial matching improved enrollment rates'],
        },
      ],
      insightBox: {
        label: 'Operating Reality',
        text: 'AI is not a side-lab capability. It touches operating model, product model, and capital allocation simultaneously.',
      },
    },
  },
  {
    id: 'operating-system-flywheel',
    title: 'The Innovation Operating System',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'Product-Led Continuous Improvement Flywheel',
      description: 'Sense -> Select -> Prove -> Scale -> Refresh (then repeat).',
      levels: [
        {
          level: 1,
          title: 'Sense',
          badge: 'External sensing',
          description: 'Track external technology shifts and emerging tooling categories.',
        },
        {
          level: 2,
          title: 'Select',
          badge: 'Portfolio focus',
          description: 'Choose a small number of high-value opportunities and align each to buy, partner, invest, or build.',
        },
        {
          level: 3,
          title: 'Prove',
          badge: '90-day evidence',
          description: 'Test in bounded settings with named business owners and measurable outcomes.',
        },
        {
          level: 4,
          title: 'Scale',
          badge: 'Reallocate quickly',
          description: 'Back initiatives with improving economics and redesign workflows around what works.',
        },
        {
          level: 5,
          title: 'Refresh',
          badge: 'Continuous renewal',
          description: 'Replace underperforming tools and reassess portfolio fit as external markets shift.',
        },
      ],
    },
  },
  {
    id: 'principle-1-value',
    title: 'Principle 1',
    type: 'comparison',
    content: {
      type: 'comparison',
      heading: 'Start With Value, but Let the Case Strengthen Through Evidence',
      description: 'Fund on progress and measurable operating movement, not static projections.',
      left: {
        title: 'What to do',
        variant: 'positive',
        items: [
          'Pick problems where progress is measurable in weeks, not years',
          'Name a business owner with operating accountability',
          'Use 90-day proof cycles and baseline before launch',
          'Scale only after KPI movement and adoption are visible',
        ],
      },
      right: {
        title: 'What to avoid',
        variant: 'negative',
        items: [
          'Do not demand a fully locked five-year case before evidence exists',
          'Do not overfund initiatives with no clear owner',
          'Do not confuse technical promise with business value',
          'Do not let upfront projections freeze learning',
        ],
      },
      insightBox: {
        label: 'Evidence Gap',
        text: 'Median AI ROI is modest while top performers dramatically outperform; the gap is operating discipline.',
      },
    },
  },
  {
    id: 'principle-2-innovation-stack',
    title: 'Principle 2',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Use the Full Innovation Stack: Buy, Partner, Invest, Build',
      description: 'In 2025, most enterprise AI is purchased rather than built; winners still use all four modes deliberately.',
      headers: ['Mode', 'Best use case', 'Primary strength', 'Key watch-out'],
      rows: [
        [
          'Buy',
          'Horizontal or fast-moving capabilities with low differentiation from internal ownership',
          'Fastest deployment with external product velocity',
          'Lock-in and migration cost if architecture is brittle',
        ],
        [
          'Partner',
          'Need speed and integration without immediate ownership',
          'Lower upfront commitment while preserving optionality',
          'Dependency and incentive misalignment',
        ],
        [
          'Invest',
          'Strategic adjacency and market visibility under uncertainty',
          'Option value plus future partnership or M&A paths',
          'Weak outcomes when strategic linkage is unclear',
        ],
        [
          'Build',
          'Proprietary workflows and defensible data/control points',
          'Maximum control and potential moat',
          'Slow delivery and hidden maintenance burden',
        ],
      ],
      highlightFirstColumn: true,
    },
  },
  {
    id: 'principle-3-focus-portfolio',
    title: 'Principle 3',
    type: 'list',
    content: {
      type: 'list',
      heading: 'Focus the Portfolio: Fewer Bets, Faster Evidence, More Compounding',
      groups: [
        {
          title: 'Horizon 1 - Near-term wins',
          color: 'green',
          items: [
            {
              text: 'Prioritize productivity and workflow automation where measurable movement is visible within 90 days',
            },
          ],
        },
        {
          title: 'Horizon 2 - Workflow redesign',
          color: 'gold',
          items: [
            {
              text: 'Back initiatives with real process ownership and realistic adoption pathways',
            },
          ],
        },
        {
          title: 'Horizon 3 - Strategic options',
          color: 'purple',
          items: [
            {
              text: 'Keep option bets small, milestone-driven, and tightly managed',
            },
          ],
        },
      ],
      insightBox: {
        label: 'Portfolio Rule',
        text: 'Kill weak projects early, reallocate quickly, and concentrate talent and capital on initiatives with compounding economics.',
      },
    },
  },
  {
    id: 'principle-4-governance',
    title: 'Principle 4',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'Govern for Learning, Renewal, and Controlled Adaptation',
      description: 'Use staged decisions with rising evidence thresholds and a recurring refresh loop.',
      levels: [
        {
          level: 1,
          title: 'Opportunity screen',
          description: 'Confirm business relevance, owner accountability, KPI target, and data feasibility.',
        },
        {
          level: 2,
          title: 'Bounded pilot',
          description: 'Define scope, baseline, and success criteria for a 90-day proof window.',
        },
        {
          level: 3,
          title: 'Operating proof',
          description: 'Verify KPI movement, user engagement, and risk profile before scaling.',
        },
        {
          level: 4,
          title: 'Scale decision',
          description: 'Expand only when workflow change and economics are both improving.',
        },
        {
          level: 5,
          title: 'Continuous refresh',
          description: 'Review model and vendor fit regularly; maintain upgrade and replacement paths.',
        },
      ],
    },
  },
  {
    id: 'cvc-posture',
    title: 'Corporate Venture Posture',
    type: 'list',
    content: {
      type: 'list',
      heading: 'Corporate Venture Works Only if the Strategic Posture Is Clear',
      description: 'Treat CVC as a strategic instrument tied to core advantage, disruption hedging, and option value.',
      groups: [
        {
          title: 'Financial return',
          items: [
            { text: 'Pure portfolio-return orientation; highest drift risk from core strategy' },
          ],
        },
        {
          title: 'Disruption hedge',
          items: [
            { text: 'Places options where the core could be displaced; requires long horizon tolerance' },
          ],
        },
        {
          title: 'Strategic adjacency',
          items: [
            { text: 'Strengthens or extends the core with explicit pathways back to operating business' },
          ],
        },
        {
          title: 'Access play',
          items: [
            { text: 'Uses investment to secure data, channel, product, or learning access' },
          ],
        },
        {
          title: 'Option to buy',
          items: [
            { text: 'Creates lower-cost acquisition optionality after de-risking market and team fit' },
          ],
        },
      ],
    },
  },
  {
    id: 'closing-principles',
    title: 'Operating Principles',
    type: 'text',
    content: {
      type: 'text',
      heading: 'Operating Principles for Innovation in the AI Era',
      body: [
        'Recognize AI as an external market force that changes the innovation model itself, not just a technology toolset.',
        'Treat foundation models as a broad enabling layer across operating model, product model, and capital allocation.',
        'Use the full innovation stack and default to external innovation unless there is a real reason to own.',
        'Run fewer initiatives with clearer ownership, faster proof cycles, and governance tuned for 12-18 month capability cycles.',
        'Tie corporate venture to strategic learning, disruption resilience, and option value with explicit links to the core.',
        'The strongest innovation organizations will be those that consistently convert external change into internal advantage.',
      ],
      insightBox: {
        label: 'Closing',
        text: 'The goal is not to run more pilots. The goal is to run a repeatable operating system that gets smarter over time.',
      },
    },
  },
]

export default slides
