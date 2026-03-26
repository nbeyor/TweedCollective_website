/**
 * Innovation in the AI Era - Document Content
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 */

import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'ai-innovation-strategy'

// ============================================
// Slide Content Data
// ============================================

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — Title / Thesis
  // ==========================================
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Enterprise Innovation Framework',
      headline: 'Innovation in the AI Era',
      subtitle: 'How large companies should govern, fund, build, buy, partner, and invest when technology markets move faster than internal planning cycles',
      insightBox: {
        label: 'Thesis',
        text: 'AI has changed more than the technology stack. It has changed the speed, economics, and structure of innovation. The winning model is disciplined, flexible, and tightly tied to business value.',
      },
    },
  },

  // ==========================================
  // Slide 2 — The Backdrop: Why the Model Changed
  // ==========================================
  {
    id: 'why-model-changed',
    title: 'Why the Innovation Model Has Changed',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'Why the Innovation Model Has Changed',
      columns: 3,
      items: [
        {
          title: 'Technology Shift',
          subtitle: 'Foundation models became a general-purpose layer',
          icon: 'Cpu',
          color: 'sage',
          items: [
            'Language, code, search, reasoning, and multimodal tools are now broadly usable',
            'New capabilities can be embedded across workflows, products, and channels',
            'Model progress has reduced the need for bespoke AI development in many areas',
          ],
        },
        {
          title: 'Capital Market Shift',
          subtitle: 'External capital is funding the experimentation',
          icon: 'TrendingUp',
          color: 'gold',
          items: [
            'Startups are testing thousands of use cases in parallel',
            'Tooling categories are forming and changing at high speed',
            'Large companies can capture outside innovation instead of inventing everything themselves',
          ],
        },
        {
          title: 'Enterprise Implication',
          subtitle: 'Innovation now requires a different operating model',
          icon: 'Building2',
          color: 'taupe',
          items: [
            'Faster sensing and selection',
            'More dynamic build / buy / partner / invest choices',
            'Governance that supports continuous tool and system renewal',
          ],
        },
      ],
      insightBox: {
        label: 'Takeaway',
        text: 'The challenge is no longer just inventing. It is allocating capital and attention effectively in a market moving faster than the enterprise.',
      },
    },
  },

  // ==========================================
  // Slide 3 — Timeline: How We Got Here
  // ==========================================
  {
    id: 'timeline',
    title: 'From Custom AI to Market-Driven Innovation',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'From Custom AI to Market-Driven Innovation',
      description: 'From custom AI programs to market-driven capability acquisition',
      columns: 3,
      items: [
        {
          title: 'Pre-Foundation Model Era',
          icon: 'Database',
          color: 'taupe',
          items: [
            'Narrower analytics and automation',
            'Longer development cycles',
            'Heavy dependence on internal data science teams',
            'More custom build logic',
          ],
        },
        {
          title: 'Foundation Model Breakout',
          icon: 'Zap',
          color: 'sage',
          items: [
            'Reusable model platforms emerged',
            'Startups flooded the stack across infrastructure, copilots, and vertical tools',
            'Time from technical progress to commercial product compressed sharply',
          ],
        },
        {
          title: 'Enterprise Adaptation Era',
          icon: 'Settings',
          color: 'gold',
          items: [
            'The question shifted from "Can the model do it?" to "How do we operationalize it?"',
            'Workflow redesign became more important than model novelty',
            'Innovation became a portfolio and governance problem, not just a technical one',
          ],
        },
      ],
      insightBox: {
        label: 'Context',
        text: 'AI is no longer a niche capability. It is an external market force reshaping how the enterprise should innovate.',
      },
    },
  },

  // ==========================================
  // Slide 4 — How Foundation Models Show Up
  // ==========================================
  {
    id: 'foundation-models-enterprise',
    title: 'How Foundation Models Actually Show Up in the Enterprise',
    type: 'grid',
    content: {
      type: 'grid',
      heading: 'How Foundation Models Actually Show Up in the Enterprise',
      columns: 3,
      items: [
        {
          title: 'Employee Productivity',
          icon: 'Users',
          color: 'sage',
          items: [
            'Research and synthesis',
            'Drafting and summarization',
            'Coding support',
          ],
        },
        {
          title: 'Workflow Automation',
          icon: 'RefreshCw',
          color: 'taupe',
          items: [
            'Copilots in process flows',
            'Exception handling',
            'Next-step recommendations',
          ],
        },
        {
          title: 'Knowledge Systems',
          icon: 'BookOpen',
          color: 'gold',
          items: [
            'Enterprise search',
            'Knowledge retrieval',
            'Decision support',
          ],
        },
        {
          title: 'Customer Experience',
          icon: 'MessageSquare',
          color: 'purple',
          items: [
            'Service automation',
            'Personalization',
            'Self-service interactions',
          ],
        },
        {
          title: 'Product Enhancement',
          icon: 'Layers',
          color: 'green',
          items: [
            'AI-native product features',
            'Embedded assistants',
            'Smarter user workflows',
          ],
        },
        {
          title: 'New Business Creation',
          icon: 'Rocket',
          color: 'sage',
          items: [
            'New offerings',
            'New channels',
            'New data and service layers',
          ],
        },
      ],
      insightBox: {
        label: 'Key Implication',
        text: 'This is why AI cannot sit in a side lab. It touches the operating model, product model, and capital allocation model at the same time.',
      },
    },
  },

  // ==========================================
  // Slide 5 — The Core Framework
  // ==========================================
  {
    id: 'core-framework',
    title: 'Core Framework for Innovation in the AI Era',
    type: 'framework',
    content: {
      type: 'framework',
      sectionLabel: 'Operating Framework',
      heading: 'Core Framework for Innovation in the AI Era',
      description: 'A repeatable system with a feedback loop from Refresh back to Sense. Enabling conditions: Governance (staged decisions, not one-time approvals), Capital (flexible funding with room to reinvest), Talent (cross-functional teams that can move), Data / Systems (architecture built for ongoing tool adoption).',
      levels: [
        {
          level: 1,
          title: 'Sense',
          badge: 'Continuous',
          description: 'Track external technology shifts, watch tooling categories, and identify disruption and opportunity early.',
          details: {
            characteristics: [
              'Track external technology shifts',
              'Watch tooling categories',
              'Identify disruption and opportunity early',
            ],
          },
        },
        {
          level: 2,
          title: 'Select',
          badge: 'Disciplined',
          description: 'Choose a small number of high-value opportunities. Match each one to build, buy, partner, or invest. Tie choices to the core business.',
          details: {
            characteristics: [
              'Choose a small number of high-value opportunities',
              'Match each one to build, buy, partner, or invest',
              'Tie choices to the core business',
            ],
          },
        },
        {
          level: 3,
          title: 'Prove',
          badge: '90 Days',
          description: 'Test in bounded settings. Show value in 90 days. Measure adoption and economics early.',
          details: {
            characteristics: [
              'Test in bounded settings',
              'Show value in 90 days',
              'Measure adoption and economics early',
            ],
          },
        },
        {
          level: 4,
          title: 'Scale',
          badge: 'Evidence-Based',
          description: 'Back the initiatives that are improving. Redesign workflows around what works. Reallocate capital and talent quickly.',
          details: {
            characteristics: [
              'Back the initiatives that are improving',
              'Redesign workflows around what works',
              'Reallocate capital and talent quickly',
            ],
          },
        },
        {
          level: 5,
          title: 'Refresh',
          badge: 'Ongoing',
          description: 'Replace weak tools. Upgrade systems continuously. Reassess portfolio as markets change.',
          details: {
            characteristics: [
              'Replace weak tools',
              'Upgrade systems continuously',
              'Reassess portfolio as markets change',
            ],
          },
        },
      ],
    },
  },

  // ==========================================
  // Slide 6 — Principle 1: Start With Value
  // ==========================================
  {
    id: 'principle-value',
    title: '1. Start With Value, but Let the Case Strengthen Over Time',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Principle 1',
      heading: '1. Start With Value, but Let the Case Strengthen Over Time',
      left: {
        title: 'What to Do',
        variant: 'positive',
        items: [
          'Start with revenue, margin, productivity, cycle time, quality, or risk reduction',
          'Pick problems where progress can be measured quickly',
          'Fund based on evidence of improvement, not just initial enthusiasm',
          'Expect the economics to get better as adoption and workflow redesign improve',
        ],
        footer: 'Anchor innovation to real business value',
      },
      right: {
        title: 'What to Avoid',
        variant: 'negative',
        items: [
          'Do not demand a fully locked five-year case upfront',
          'Do not overfund programs with no measurable operating owner',
          'Do not confuse technical promise with business value',
          'Do not let the business case freeze learning',
        ],
        footer: 'Avoid false precision too early',
      },
      insightBox: {
        label: '90-Day Proof Points',
        text: 'Baseline established. Workflow live in production or pilot. Measurable KPI movement. Clear go / revise / stop decision. The standard is not perfect certainty. The standard is visible progress with improving economics.',
      },
    },
  },

  // ==========================================
  // Slide 7 — Principle 2: Full Innovation Stack
  // ==========================================
  {
    id: 'principle-innovation-stack',
    title: '2. Use the Full Innovation Stack: Buy, Partner, Invest, Build',
    type: 'table',
    content: {
      type: 'table',
      sectionLabel: 'Principle 2',
      heading: '2. Use the Full Innovation Stack: Buy, Partner, Invest, Build',
      headers: ['', 'Buy', 'Partner', 'Invest', 'Build'],
      columnWidths: ['15%', '21.25%', '21.25%', '21.25%', '21.25%'],
      rows: [
        [
          'Best Use Case',
          'Horizontal tooling; fast-moving categories; capabilities with weak differentiation value',
          'Need speed without ownership; workflow integration more than code control; strategic capabilities still taking shape',
          'Strategic adjacency; need market visibility or access; want option value without full acquisition',
          'Proprietary workflows; unique data advantage; core control points; capabilities tightly linked to competitive edge',
        ],
        [
          'Why It Works',
          'Fastest path to deployment; external market funds product improvement; avoids unnecessary internal build cost',
          'Faster learning; lower upfront cost; flexible commercial structure',
          'Early access to capabilities and teams; supports future partnership or M&A paths; useful where uncertainty is high',
          'Highest control; better fit to internal operations; strongest long-term defensibility when truly differentiated',
        ],
        [
          'Watch-Outs',
          'Vendor lock-in; weak integration; poor fit to internal workflows',
          'Dependency risk; unclear incentives; limited control over roadmap',
          'Weak strategic linkage; passive minority positions with no real advantage; blurred financial vs strategic intent',
          'Slow delivery; hidden maintenance burden; reinventing capabilities the market already provides',
        ],
      ],
      highlightFirstColumn: true,
      insightBox: {
        label: 'Default Posture',
        text: 'In the AI era, default to external innovation unless there is a real reason to own the capability.',
      },
    },
  },

  // ==========================================
  // Slide 8 — Principle 3: Focus the Portfolio
  // ==========================================
  {
    id: 'principle-portfolio',
    title: '3. Focus the Portfolio: Fewer Bets, Faster Evidence, More Compounding',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Principle 3',
      heading: '3. Focus the Portfolio: Fewer Bets, Faster Evidence, More Compounding',
      columns: 4,
      items: [
        {
          title: 'Horizon 1: Near-Term Wins',
          icon: 'Target',
          color: 'sage',
          items: [
            'Productivity use cases',
            'Process automation',
            'Customer service improvements',
          ],
          description: 'Must show measurable movement quickly. Fund for proof, then scale selectively.',
        },
        {
          title: 'Horizon 2: Workflow Redesign',
          icon: 'RefreshCw',
          color: 'taupe',
          items: [
            'End-to-end process changes',
            'Embedded copilots in core work',
            'Cross-functional operating improvements',
          ],
          description: 'Require real process ownership. Back only where adoption is realistic.',
        },
        {
          title: 'Horizon 3: Strategic Options',
          icon: 'Compass',
          color: 'gold',
          items: [
            'New product models',
            'New channel plays',
            'Emerging capability positions',
          ],
          description: 'Keep the number small. Treat as options, not broad promises.',
        },
        {
          title: 'Portfolio Rules',
          icon: 'ClipboardList',
          color: 'purple',
          items: [
            'Run fewer initiatives',
            'Kill weak projects early',
            'Reallocate talent and capital fast',
            'Scale what is improving',
            'Avoid pilot clutter',
          ],
        },
      ],
      insightBox: {
        label: 'Risk Reframe',
        text: 'The risk is rarely too little experimentation. It is too much low-conviction activity with no compounding effect.',
      },
    },
  },

  // ==========================================
  // Slide 9 — Principle 4: Govern for Learning
  // ==========================================
  {
    id: 'principle-governance',
    title: '4. Govern for Learning, Renewal, and Controlled Adaptation',
    type: 'framework',
    content: {
      type: 'framework',
      sectionLabel: 'Principle 4',
      heading: '4. Govern for Learning, Renewal, and Controlled Adaptation',
      description: 'Governance should not lock the stack. It should create disciplined room for learning, reinvestment, and system renewal.',
      levels: [
        {
          level: 1,
          title: 'Opportunity Screen',
          badge: 'Gate 1',
          description: 'Core business relevance, named business owner, clear target KPI.',
          details: {
            outcome: 'Start or decline',
          },
        },
        {
          level: 2,
          title: 'Bounded Pilot',
          badge: 'Gate 2',
          description: 'Limited scope, known workflow, measurable baseline.',
          details: {
            outcome: 'Fund proof of value',
          },
        },
        {
          level: 3,
          title: 'Operating Proof',
          badge: 'Gate 3',
          description: 'KPI movement visible, users engaged, risks understood.',
          details: {
            outcome: 'Scale, revise, or stop',
          },
        },
        {
          level: 4,
          title: 'Scale Decision',
          badge: 'Gate 4',
          description: 'Workflow change is real, economics improving, platform implications understood.',
          details: {
            outcome: 'Expand with committed funding',
          },
        },
        {
          level: 5,
          title: 'Continuous Refresh',
          badge: 'Gate 5',
          description: 'Vendor and model review, tool replacement path, ongoing reinvestment logic.',
          details: {
            outcome: 'Maintain, upgrade, replace, or retire',
          },
        },
      ],
    },
  },

  // ==========================================
  // Slide 10 — Corporate Venture Postures
  // ==========================================
  {
    id: 'corporate-venture',
    title: 'Corporate Venture Works Only if the Strategic Posture Is Clear',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Corporate Venture Capital',
      heading: 'Corporate Venture Works Only if the Strategic Posture Is Clear',
      columns: 3,
      items: [
        {
          title: 'Financial Return',
          icon: 'DollarSign',
          color: 'gold',
          items: [
            'Objective: venture-like returns',
            'Works when managed like an investment portfolio',
            'Risk: can drift away from the core',
          ],
        },
        {
          title: 'Strategic Adjacency',
          icon: 'GitBranch',
          color: 'sage',
          items: [
            'Objective: strengthen or extend the core',
            'Useful for product adjacency, ecosystem leverage, and market learning',
            'Best when there is a clear path back to the business',
          ],
        },
        {
          title: 'Access Play',
          icon: 'Key',
          color: 'taupe',
          items: [
            'Objective: gain data, channel, product access, or privileged learning',
            'Investment serves a commercial purpose beyond ownership',
            'Value can be strategic even without control',
          ],
        },
        {
          title: 'Option to Buy',
          icon: 'ShoppingCart',
          color: 'purple',
          items: [
            'Objective: create a lower-cost path to future acquisition',
            'Useful when the market is promising but still uncertain',
            'Lets the company learn before paying a control premium',
          ],
        },
        {
          title: 'Disruption Hedge',
          icon: 'Shield',
          color: 'red',
          items: [
            'Objective: invest where the core could be displaced',
            'Enables experimentation outside the incumbent structure',
            'Preserves visibility and flexibility if the market shifts',
          ],
        },
        {
          title: 'Recommended Posture',
          icon: 'Target',
          color: 'green',
          items: [
            'Treat corporate venture as a strategic instrument, not a side fund',
            'Prioritize investments tied directly to the core business',
            'Back areas that could displace the core and may justify external experimentation',
            'Use selected investments as cheap options to buy later',
          ],
        },
      ],
      insightBox: {
        label: 'Litmus Test',
        text: 'If the investment cannot help the core business, teach the company something important, or create a path to ownership, the rationale is probably weak.',
      },
    },
  },

  // ==========================================
  // Slide 11 — Closing: Operating Principles
  // ==========================================
  {
    id: 'operating-principles',
    title: 'Operating Principles for Innovation in the AI Era',
    type: 'list',
    content: {
      type: 'list',
      sectionLabel: 'Summary',
      heading: 'Operating Principles for Innovation in the AI Era',
      groups: [
        {
          title: 'Seven Principles',
          icon: 'CheckCircle',
          color: 'sage',
          items: [
            { text: 'Recognize that AI has changed the innovation model itself' },
            { text: 'Treat foundation models as a broad enabling layer, not a side program' },
            { text: 'Start with business value and let the case strengthen through evidence' },
            { text: 'Use the full innovation stack: buy, partner, invest, and build selectively' },
            { text: 'Run fewer initiatives with faster proof and clearer ownership' },
            { text: 'Govern for learning, renewal, and continuous system improvement' },
            { text: 'Use corporate venture as a strategic tool tied to the core, disruption, and option value' },
          ],
        },
      ],
      insightBox: {
        label: 'Final Word',
        text: 'The strongest innovation groups will not be the ones that launch the most pilots. They will be the ones that most consistently turn external change into internal advantage.',
      },
    },
  },
]

export default slides
