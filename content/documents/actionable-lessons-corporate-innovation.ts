import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'actionable-lessons-corporate-innovation'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — Title
  // ==========================================
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Framework',
      headline: 'Actionable Lessons in Corporate Innovation',
      subtitle: 'Hard learned principles through booms of capital and technology in health tech.',
    },
  },

  // ==========================================
  // Slide 2 — Two Booms That Shape These Lessons
  // ==========================================
  {
    id: 'two-booms',
    title: 'Two Booms That Shape These Lessons',
    type: 'comparison',
    content: {
      type: 'comparison',
      heading: 'Two Booms That Shape These Lessons',
      left: {
        title: 'The Health Tech Boom',
        variant: 'neutral',
        items: [
          'Massive capital. Strong talent. Good products built.',
          'Valuations inflated beyond what business models could support',
          'Digital therapeutics: no reimbursement pathway',
          'Value-based care: only addressed cost',
          'AI biotech: didn\u2019t accelerate clinical timelines',
          'The boom burst because the commercial models hadn\u2019t been worked out \u2014 not because the technology failed',
        ],
      },
      right: {
        title: 'The AI Boom',
        variant: 'neutral',
        items: [
          'Technology advancing faster than companies can adopt',
          'Entire categories opening up, then getting consumed by foundation models',
          'Companies that engage: accelerating',
          'Companies on the periphery: compounding uncertainty',
          'The defining feature isn\u2019t the technology \u2014 it\u2019s the pace',
        ],
      },
      insightBox: {
        label: 'Bottom Line',
        text: 'Both booms rewarded companies that connected innovation to commercial reality early. Both punished companies that confused technical progress with business value.',
      },
    },
  },

  // ==========================================
  // Slide 3 — The Exponential Trajectory of AI
  // ==========================================
  {
    id: 'exponential-trajectory',
    title: 'The Exponential Trajectory of AI',
    type: 'chart',
    content: {
      type: 'chart',
      heading: 'The Exponential Trajectory of AI',
      yLabel: 'Capability / Impact',
      xLabel: 'Time',
      lines: [
        { label: 'AI capability trajectory', style: 'exponential', color: 'sage' },
        { label: 'Enterprise ability to absorb', style: 'flat', color: 'taupe' },
      ],
      gapAnnotation: 'The core strategic problem',
      zones: [
        { label: 'Pre-2017', sublabel: 'Custom builds', description: 'Bespoke development for every application. Long timelines, limited reusability.' },
        { label: '2017\u20132020', sublabel: 'Reusable models', description: 'Deep learning tools accessible. Research-to-tool cycle compressing.' },
        { label: '2021\u20132024', sublabel: 'Foundation models', description: 'General-purpose models handle broad enterprise tasks. Cost dropped by orders of magnitude.' },
        { label: '2025+', sublabel: 'Agents & automation', description: 'AI systems that take actions autonomously. Can we absorb the change?' },
      ],
      insightBox: {
        label: 'Key Insight',
        text: 'The external market is innovating faster than any internal team can. This gap is the core strategic problem.',
      },
    },
  },

  // ==========================================
  // Slide 4 — What Worked and What Didn't
  // ==========================================
  {
    id: 'what-worked-what-didnt',
    title: 'What Worked and What Didn\u2019t',
    type: 'comparison',
    content: {
      type: 'comparison',
      heading: 'What Worked and What Didn\u2019t',
      left: {
        title: 'What Worked',
        variant: 'positive',
        items: [
          'Direct-to-patient marketing platforms \u2014 fueled the core business, adapted consumer digital to medical context, generated value the org already knew how to measure.',
          'B2B customer-facing platform in pharma services \u2014 fed core revenue, leadership tracked success in familiar terms. Innovation tied to the commercial engine gets oxygen.',
          'Properly structured external investments \u2014 equity where outside investors participate, value on market terms, independent governance, room to prove themselves.',
        ],
      },
      right: {
        title: 'What Didn\u2019t',
        variant: 'negative',
        items: [
          'Digital therapeutics \u2014 full clinical development, no reimbursement pathway on the other side. Approval \u2260 revenue.',
          'Purpose-built health AI platforms \u2014 overtaken by foundation models improving through scale. Narrow moats get eaten.',
          'Products without measurement infrastructure \u2014 couldn\u2019t prove value, couldn\u2019t justify funding. Didn\u2019t fail \u2014 couldn\u2019t prove it succeeded.',
          'Venture studios with misaligned incentives \u2014 equity treated as discounted consulting, economics favored fees. Structure shapes behavior \u2014 always.',
        ],
      },
      insightBox: {
        label: 'Bottom Line',
        text: 'Innovation survives when it connects to the core commercial engine. External investments need external structures.',
      },
    },
  },

  // ==========================================
  // Slide 5 — The Lessons
  // ==========================================
  {
    id: 'the-lessons',
    title: 'The Lessons',
    type: 'framework',
    content: {
      type: 'framework',
      heading: 'The Lessons',
      description: 'This is an operations problem with amazing technology at your fingertips and change that needs to happen nonlinearly in order to win.',
      levels: [
        {
          level: 1,
          title: 'Start with business value and let the case strengthen through evidence',
          description: '',
        },
        {
          level: 2,
          title: 'Look outside first \u2014 partner, rent, or build, but know that the best technology is often already in the market',
          description: '',
        },
        {
          level: 3,
          title: 'Move fast \u2014 close the deal, do the work, sort out complex terms while making progress',
          description: '',
        },
        {
          level: 4,
          title: 'Set up simple KPIs to measure and realize success early \u2014 this may cost money, but without evidence you can\u2019t justify continued investment',
          description: '',
        },
        {
          level: 5,
          title: 'Run fewer initiatives with faster proof and clearer ownership',
          description: '',
        },
        {
          level: 6,
          title: 'Treat external investments with external structures \u2014 clear strategic posture, equity where outside investors can participate, independent governance',
          description: '',
        },
        {
          level: 7,
          title: 'Don\u2019t put P&L leaders on top of innovation that takes years to realize value',
          description: '',
        },
        {
          level: 8,
          title: 'Build cross-functional teams with outside talent and shared processes and vocabulary',
          description: '',
        },
        {
          level: 9,
          title: 'Treat innovation like a lean transformation \u2014 continuous improvement, not a one-time win',
          description: '',
        },
      ],
    },
  },

  // ==========================================
  // Slide 6 — Start With Business Value
  // ==========================================
  {
    id: 'start-with-business-value',
    title: 'Start With Business Value',
    type: 'funnel',
    content: {
      type: 'funnel',
      sectionLabel: 'Lesson 1',
      heading: 'Start With Business Value',
      inputLabel: 'All possible initiatives',
      outputLabel: 'Initiatives worth funding',
      stages: [
        {
          title: 'What moves the business?',
          description: 'Revenue. Margin. Cycle time. Quality. Risk reduction. If it takes a paragraph to explain why it matters, it probably doesn\u2019t yet.',
          icon: getIcon('metrics'),
        },
        {
          title: 'Where can technology realize impact fastest?',
          description: 'Start where the workflow exists and the pain is measurable. The most successful early initiatives are unglamorous \u2014 automating a manual step, accelerating a review, improving data access.',
          icon: getIcon('rocket'),
        },
        {
          title: 'Can you measure progress in 90 days?',
          description: 'Establish a baseline. Show movement. If you can\u2019t, you won\u2019t hold organizational attention. Measuring may require infrastructure investment \u2014 that\u2019s part of the cost.',
          icon: getIcon('timer'),
        },
        {
          title: 'Does the case need to be perfect or improve?',
          description: 'Most initial business cases are wrong. Fund based on evidence of improvement, not precision of prediction. A locked five-year case either kills good ideas early or funds bad ones too long.',
          icon: getIcon('growth'),
        },
      ],
    },
  },

  // ==========================================
  // Slide 7 — Look Outside First: Partner, Rent, or Build
  // ==========================================
  {
    id: 'partner-first-move-fast',
    title: 'Partner, Rent, or Build',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'ThreeLaneSortSlide',
      props: {
        slideId: 'partner-first-move-fast',
        sectionLabel: 'Lessons 2 & 3',
        heading: 'Look Outside First: Partner, Rent, or Build',
        description: 'The capital booms funded enormous amounts of good technology. It already exists. For complex, domain-specific capabilities requiring sustained R&D, the external market is better and faster.',
        lanes: [
          {
            title: 'The default: Partner',
            description: 'Rent access. Don\u2019t rebuild what the ecosystem already offers.',
            variant: 'default',
            width: 'wide',
            items: [
              { text: 'Speed matters more than terms. 9\u201312 months evaluating = 9\u201312 months of lost progress.' },
              { text: 'Startups don\u2019t operate on a balance sheet. They\u2019re running out of time while you deliberate.' },
              { text: 'Pay them like a dev shop. Start learning. Walk away if it doesn\u2019t work. Rounding error downside.' },
              { text: 'Stop agonizing about IP \u2014 it\u2019s not a molecule. Sort out complex rights while doing work together, not before.' },
            ],
          },
          {
            title: 'The new option: Build simple things yourself',
            description: 'AI has changed the build calculus. Teams can now prototype in days what used to take months.',
            variant: 'build',
            width: 'medium',
            items: [
              { text: 'Internal tools, workflow automation, simple integrations \u2014 just build them' },
              { text: 'LLM wrapper + high-performing general model can now replace entire product categories' },
              { text: 'If it\u2019s simple and internal, the fastest path is often doing it yourself' },
            ],
          },
          {
            title: 'The danger zone: Prototype \u2260 product',
            description: 'Easy to demo. Hard to make enterprise-grade.',
            variant: 'danger',
            width: 'narrow',
            items: [
              { text: 'Security, compliance, reliability, integration, maintenance' },
              { text: 'Companies build a prototype in a week and spend 18 months trying to productionize it' },
              { text: 'The trap is the middle ground \u2014 looks easy to build, hard to maintain at scale' },
            ],
          },
        ],
        bottomBar: 'Look outside first for quality and speed. Build when it\u2019s simple. Partner when it\u2019s complex. Recognize the danger zone in between.',
      },
    },
  },

  // ==========================================
  // Slide 8 — Set Up Simple KPIs
  // ==========================================
  {
    id: 'simple-kpis',
    title: 'Set Up Simple KPIs',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'SplitDashboardSlide',
      props: {
        slideId: 'simple-kpis',
        sectionLabel: 'Lesson 4',
        heading: 'Set Up Simple KPIs and Invest in Measuring Them',
        panels: [
          {
            title: 'Invested in measurement',
            variant: 'live',
            lastUpdated: 'Updated: today',
            metrics: [
              { label: 'Time savings per submission', value: '34%', status: 'green', trend: 'up' },
              { label: 'Documents processed', value: '1,247', status: 'green', trend: 'up' },
              { label: 'Error rate', value: '2.1%', status: 'amber', trend: 'down' },
              { label: 'Team adoption', value: '89%', status: 'green', trend: 'flat' },
            ],
          },
          {
            title: 'Neglected measurement',
            variant: 'neglected',
            lastUpdated: 'Last updated: 6 months ago',
            metrics: [
              { label: 'Time savings per submission', status: 'none' },
              { label: 'Documents processed', value: '???', status: 'none' },
              { label: 'Error rate', status: 'none' },
              { label: 'Team adoption', value: '72% logins', status: 'none' },
            ],
          },
        ],
        contentGroups: [
          {
            title: 'Why this matters',
            items: [
              'The obvious miss: funding something that isn\u2019t working',
              'The bigger miss: something IS working and nobody sees it \u2014 so you fail to double down at the moment it matters most',
            ],
          },
          {
            title: 'Keep the list short',
            items: [
              'Companies routinely define 20+. That\u2019s a wish list, not a measurement plan. Three to five metrics. Commit.',
              'A KPI only works if the person looking at it can affect it. Adoption \u2260 value.',
            ],
          },
        ],
      },
    },
  },

  // ==========================================
  // Slide 9 — Fewer Initiatives, Faster Proof
  // ==========================================
  {
    id: 'fewer-initiatives',
    title: 'Fewer Initiatives, Faster Proof',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'PortfolioScatterSlide',
      props: {
        slideId: 'fewer-initiatives',
        sectionLabel: 'Lesson 5',
        heading: 'Fewer Initiatives, Faster Proof, Clearer Ownership',
        beforeLabel: 'Before: Fragmented portfolio',
        afterLabel: 'After: Rationalized portfolio',
        beforeDots: [
          { x: 30, y: 20 }, { x: 85, y: 45 }, { x: 150, y: 15 }, { x: 210, y: 65 },
          { x: 45, y: 80 }, { x: 120, y: 90 }, { x: 200, y: 30 }, { x: 260, y: 75 },
          { x: 70, y: 55 }, { x: 170, y: 100 }, { x: 240, y: 45 }, { x: 100, y: 25 },
          { x: 55, y: 105, cut: true }, { x: 190, y: 85, cut: true }, { x: 135, y: 60, cut: true },
          { x: 270, y: 20, cut: true }, { x: 25, y: 50, cut: true },
        ],
        afterDots: [
          { label: 'A', x: 75, y: 40 },
          { label: 'B', x: 150, y: 35 },
          { label: 'C', x: 225, y: 45 },
        ],
        outcomes: ['Pipeline', 'Margin', 'Capability'],
        contentGroups: [
          {
            title: 'Every company has an AI roadmap. Most have too much on it.',
            items: [
              'Table stakes to have AI in the executive deck. But the roadmap is usually a collection of accumulated initiatives \u2014 not all tied to business value.',
              'Similar efforts in parallel across groups. Nobody looking across the portfolio for overlap or gaps.',
            ],
          },
          {
            title: 'Stop running pilots. Start committing to change.',
            items: [
              '\u201CPilot\u201D = dipping a toe in. Instead: \u201CWe are working in AI now. This is our first step. We will iterate and build.\u201D',
              'KPIs tell you whether to stay the course, double down, shift, or cut. The portfolio sharpens through response to evidence.',
            ],
          },
        ],
      },
    },
  },

  // ==========================================
  // Slide 10 — External Structures for External Investments
  // ==========================================
  {
    id: 'external-structures',
    title: 'External Structures',
    type: 'spectrum',
    content: {
      type: 'spectrum',
      sectionLabel: 'Lesson 6',
      heading: 'External Structures for External Investments',
      description: 'The language around corporate investment gets muddied. These are different postures. Pick one and build accordingly.',
      leftLabel: 'Most independent',
      rightLabel: 'Most integrated',
      cards: [
        {
          title: 'Invest like a VC',
          description: 'Equity value creation. Financial return. Requires venture-grade governance, independent decisions, investor-style incentives.',
          icon: getIcon('growth'),
        },
        {
          title: 'Invest like a strategic partner',
          description: 'Act as a customer with preferred rights and access. Value = what the partnership delivers to the core business.',
          icon: getIcon('briefcase'),
        },
        {
          title: 'Invest like a strategic acquirer',
          description: 'Option to buy with a front-line view. Paying for proximity, information, and optionality.',
          icon: getIcon('eye'),
        },
        {
          title: 'Externalize but own',
          description: 'Separate governance, team, and P&L. Operates on its own cycles. Revenue should look like something new.',
          icon: getIcon('unlock'),
        },
        {
          title: 'Innovate inside',
          description: 'Must feed the core P&L or it will die. Don\u2019t lie to yourself about value creation.',
          icon: getIcon('settings'),
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'The failure is almost never picking the wrong posture. It\u2019s not picking one clearly.',
      },
    },
  },

  // ==========================================
  // Slide 11 — Leadership and Resourcing
  // ==========================================
  {
    id: 'leadership-resourcing',
    title: 'Leadership and Resourcing',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'RoleAnatomySlide',
      props: {
        slideId: 'leadership-resourcing',
        sectionLabel: 'Lesson 7',
        heading: 'Leadership and Resourcing',
        centerLabel: 'Innovation Leader',
        rings: [
          {
            label: 'Appetite for risk',
            description: 'Comfort with uncertainty, speed over precision, willingness to make bets the core business would never approve.',
            status: 'complete',
          },
          {
            label: 'Real budget and team',
            description: 'Not a title with two reports and no meaningful budget. If the org is serious, it comes with resources.',
            status: 'partial',
          },
          {
            label: 'Defined lane vs IT',
            description: 'Adjacent to IT without clear boundaries = constant friction. Define what the role owns vs influences.',
            status: 'partial',
          },
          {
            label: 'Top-down commitment',
            description: 'Enterprise AI license + login count \u2260 transformation. Leadership drives direction, resources, obstacles, and accountability.',
            status: 'missing',
          },
        ],
        contentGroups: [
          {
            title: 'Right leader, wrong setup = failure',
            items: [
              'Senior execs take innovation roles when their path upward is blocked. They default to familiar politics and value structures.',
              'Title without resources = designed to fail. The health tech boom: dozens of VP Digital Health roles, two reports, no budget. Now repeating with Chief AI Officer titles.',
            ],
          },
        ],
      },
    },
  },

  // ==========================================
  // Slide 12 — Team Composition
  // ==========================================
  {
    id: 'team-composition',
    title: 'Team Composition',
    type: 'venn',
    content: {
      type: 'venn',
      sectionLabel: 'Lesson 8',
      heading: 'Team Composition',
      description: 'Innovation that touches technology, operations, commercial strategy, and customer experience cannot be run by a single function.',
      circles: [
        {
          label: 'Internal operators',
          description: 'Org knowledge, credibility, navigation',
          icon: getIcon('user'),
          color: 'sage',
        },
        {
          label: 'External builders',
          description: 'Startup instincts, speed, comfort with ambiguity',
          icon: getIcon('code'),
          color: 'taupe',
        },
        {
          label: 'Technical specialists',
          description: 'AI/ML depth, expensive \u2014 plan for it',
          icon: getIcon('ai'),
          color: 'gold',
        },
        {
          label: 'Cross-functional connectors',
          description: 'Shared vocabulary, process, decision-making',
          icon: getIcon('message'),
          color: 'purple',
        },
      ],
      centerLabel: 'Innovation team that works',
      insightBox: {
        label: 'Bottom Line',
        text: 'Technical talent is expensive. That\u2019s the market. Underpaying gets you either no talent or wrong-tier talent. Both slow everything down.',
      },
    },
  },

  // ==========================================
  // Slide 13 — Lean Transformation, Not a One-Time Win
  // ==========================================
  {
    id: 'lean-transformation',
    title: 'Lean Transformation',
    type: 'chart',
    content: {
      type: 'chart',
      sectionLabel: 'Lesson 9',
      heading: 'Lean Transformation, Not a One-Time Win',
      description: 'Treat innovation with the same rigor you would bring to a lean transformation \u2014 continuous improvement, understanding the work, changing how it gets done.',
      yLabel: 'Capability / Value',
      xLabel: 'Time (quarters)',
      lines: [
        { label: 'Continuous reinvestment', style: 'staircase', color: 'sage' },
        { label: 'One-time deployment', style: 'flat', color: 'red' },
      ],
      gapAnnotation: 'Value left on the table',
      zones: [
        { label: 'Commit to a new way of working', description: 'A pilot has an end date. A transformation does not. Iterate, measure, reinvest.' },
        { label: 'Focus on jobs to be done', description: 'The unit of analysis is the work itself. Reframes AI from cost reduction to capability transformation.' },
        { label: 'The improvement is nonlinear', description: 'Not 10\u201320%. Hundreds or thousands of percent \u2014 but only through sustained reinvestment.' },
        { label: 'Same answer for all', description: 'Whether operator or investor: the value evolves over time when done right. Not a slug to model.' },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'One-time deployment = one-time improvement. Continuous commitment = transformation.',
      },
    },
  },

  // ==========================================
  // Slide 14a — Signs of Success
  // ==========================================
  {
    id: 'signs-success',
    title: 'Signs of Success',
    type: 'quotes',
    content: {
      type: 'quotes',
      heading: 'Signs of Success and Signs of Risk',
      columns: [
        {
          title: 'If you hear things like this, it\u2019s going well',
          variant: 'positive',
          headerNote: 'overheard in the hallway',
          quotes: [
            '\u201CWe cut the roadmap from 15 initiatives to four \u2014 here\u2019s why these four connect to pipeline acceleration and margin improvement.\u201D',
            '\u201CWe signed a paid pilot with that computational biology startup six weeks after the first call \u2014 legal is sorting out the long-term IP terms while we\u2019re already generating data together.\u201D',
            '\u201CWe hired a former startup CTO to run the innovation team alongside our clinical ops lead and commercial strategist \u2014 they run weekly stand-ups and make decisions in the room.\u201D',
            '\u201CPart of our investment strategy was contingent on being the first paying customer \u2014 it gave us preferred access to the roadmap and helped them close their next round with outside investors.\u201D',
            '\u201COur medical writing tool is in its third iteration \u2014 each version handles more document types and we track time savings per submission against the baseline we set on day one.\u201D',
            '\u201CThe team had been pushing hard on two initiatives with disciplined KPI tracking. The data made it clear the fit wasn\u2019t there. We celebrated the learning, moved the talent and budget to initiatives with better traction.\u201D',
          ],
        },
        {
          title: 'If you hear things like this, something\u2019s wrong',
          variant: 'negative',
          headerNote: 'overheard in the hallway',
          quotes: [
            '\u201CWe have a fully documented AI strategy with a roadmap of 20 initiatives and an Excel tracker with owners, timelines, and dependencies for each one.\u201D',
            '\u201C72% of our employees are using ChatGPT on a weekly basis \u2014 we\u2019re really seeing strong adoption across the organization.\u201D',
            '\u201CWe\u2019re still making progress on the partnership with that clinical trial company \u2014 just waiting on MLR review for the last six weeks.\u201D',
            '\u201CWe just hired a VP of AI Innovation \u2014 still sorting out what their reporting structure will be.\u201D',
            '\u201CWe\u2019ve got the dashboard but it hasn\u2019t been updated \u2014 the person in charge of that rotated out.\u201D',
            '\u201CThree teams are piloting document summarization tools \u2014 great to see the enthusiasm.\u201D',
          ],
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'These patterns are visible in almost every large company running an innovation program. The specifics vary. The structural issues don\u2019t.',
      },
    },
  },

  // ==========================================
  // Slide 14b — More Signs (continued)
  // ==========================================
  {
    id: 'signs-continued',
    title: 'Signs (continued)',
    type: 'quotes',
    content: {
      type: 'quotes',
      heading: 'Signs of Success and Signs of Risk (continued)',
      columns: [
        {
          title: 'More signs it\u2019s going well',
          variant: 'positive',
          headerNote: 'overheard in the hallway',
          quotes: [
            '\u201COur startup partner shipped a new feature last week that we asked for \u2014 they\u2019re moving faster than our internal teams ever could.\u201D',
            '\u201COur investment has already doubled in equity value \u2014 outside investors came in at a higher mark. We\u2019re not holding it to a P&L standard.\u201D',
            '\u201CWe\u2019re spending real money on the data infrastructure to measure this \u2014 it wasn\u2019t cheap but now we actually know what\u2019s working.\u201D',
            '\u201CWe stopped calling them pilots \u2014 these are committed operating changes with dedicated teams and quarterly reviews.\u201D',
            '\u201COur innovation budget has its own governance \u2014 it doesn\u2019t compete with the core P&L for annual approval.\u201D',
          ],
        },
        {
          title: 'More signs something\u2019s wrong',
          variant: 'negative',
          headerNote: 'overheard in the hallway',
          quotes: [
            '\u201CWe invested in that digital therapeutics company but the terms are complicated \u2014 they\u2019re having trouble raising their next round.\u201D',
            '\u201CWe set up a venture arm last year \u2014 we\u2019ve made eight investments but I couldn\u2019t tell you which ones are strategic and which ones are financial.\u201D',
            '\u201CWe tried an AI tool for clinical document review but it wasn\u2019t perfect so we went back to the manual process.\u201D',
            '\u201COur board wants to see the five-year ROI case before we commit any more funding.\u201D',
            '\u201CEveryone\u2019s excited about AI \u2014 we\u2019re letting teams experiment and see what bubbles up.\u201D',
          ],
        },
      ],
    },
  },

]

export default slides
