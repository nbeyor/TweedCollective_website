import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'ai-native-delivery'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — Title Page
  // ==========================================
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Framework',
      headline: 'From AI-Assisted Coding to AI-Native Delivery',
      subtitle:
        'The next wave is not more point tools. It is one connected process linking upstream product definition to downstream testing, review, release, and feedback.',
      insightBox: {
        label: 'The Connected Delivery Loop',
        text: 'Product Definition  →  Code  →  Test / Review  →  Release  →  Feedback. Most companies already use AI for code generation and light review. The bigger opportunity now is to connect the full loop.',
      },
    },
  },

  // ==========================================
  // Slide 2 — Three Modes of Adoption
  // ==========================================
  {
    id: 'three-modes',
    title: 'Three Modes of Adoption',
    type: 'table',
    content: {
      type: 'table',
      sectionLabel: 'Section 01',
      heading: 'The next gains come from improving all three parts of the system.',
      description:
        'Point adoption creates local gains. Connected adoption reduces rework, shortens cycle time, and links product, engineering, and quality much more tightly.',
      headers: ['Mode', 'What it is', 'Value', 'Limitation on its own'],
      rows: [
        [
          'Review agents',
          'AI-assisted review of code quality and obvious defects',
          'Fast to adopt; improves review throughput',
          'Reactive if feature intent is vague',
        ],
        [
          'Product-defined tests',
          'Product and quality teams define functional goals and testable acceptance criteria before code is written',
          'Clearer intent; less rework',
          'Requires upstream process change',
        ],
        [
          'Automated testing and code execution',
          'Tools generate code, run tests, and iterate toward passing behavior',
          'Faster cycles; less manual QA',
          'Brittle without strong definitions',
        ],
      ],
      highlightFirstColumn: true,
      columnWidths: ['22%', '36%', '22%', '20%'],
      insightBox: {
        label: 'Emphasis',
        text: 'Most enterprises started with review agents. The bigger shift comes when product-defined tests and automated execution are added around them. Local gains alone — system gains when connected.',
      },
    },
  },

  // ==========================================
  // Slide 3 — The New Delivery Loop
  // ==========================================
  {
    id: 'delivery-loop',
    title: 'The New Delivery Loop',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Section 02',
      heading:
        'The future process is a tighter loop between product intent, code generation, testing, and revision.',
      description:
        'The loop: (1) Humans define the functional goal → (2) Humans define the testable behavior → (3) Machines generate or revise code → (4) Machines write and run tests → (5) Humans review exceptions and high-risk changes → (6) Results feed back into the PR until the change is complete.',
      left: {
        title: 'Machines Own',
        variant: 'positive',
        items: [
          'Code generation and revision',
          'Test writing and execution',
          'Basic code review',
          'Re-running checks after each change',
        ],
      },
      right: {
        title: 'Humans Own',
        variant: 'positive',
        items: [
          'Functional goals',
          'Acceptance criteria',
          'High-risk review and judgment',
          'Final decisions on ambiguous cases',
        ],
      },
      insightBox: {
        label: 'Emphasis',
        text: 'The shift is not that machines replace humans. It is that machines take over more of the iteration while humans stay focused on intent and judgment.',
      },
    },
  },

  // ==========================================
  // Slide 4 — Small PRs, Faster Releases
  // ==========================================
  {
    id: 'small-prs',
    title: 'Small PRs, Faster Releases',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Section 03',
      heading: 'AI-native delivery depends on smaller PRs and faster release cycles.',
      description:
        'The core discipline is simple: break work into smaller changes, validate each one quickly, and release more often. That is what makes AI-generated code usable at scale.',
      left: {
        title: 'Large PR / Slow Release / Late QA',
        variant: 'negative',
        items: [
          'Branches live for days',
          'PRs take hours to review',
          'Bundles many behaviors in one change',
          'End-of-cycle batch QA validation',
          'Problems are hard to isolate and fix',
        ],
      },
      right: {
        title: 'Small PR / Fast Release / Continuous QA',
        variant: 'positive',
        items: [
          'Branches live for hours, not days',
          'PRs small enough to review in minutes',
          'One behavior or one narrow change per PR',
          'Continuous QA inside the PR loop',
          'Release risk drops as each change shrinks',
        ],
      },
      insightBox: {
        label: 'Upstream / Downstream Implication',
        text: 'Product has to define work in smaller, testable slices. QA moves from end-of-cycle batch validation to continuous validation inside the PR loop.',
      },
    },
  },

  // ==========================================
  // Slide 5 — The Tool Stack Around Code
  // ==========================================
  {
    id: 'tool-stack',
    title: 'The Tool Stack Around Code',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 04',
      heading: 'Code sits at the center. The surrounding tools define, test, and govern it.',
      description: 'The goal is not more tools — it is tighter connection around the code workflow.',
      columns: 2,
      items: [
        {
          title: 'Upstream — Define the Feature',
          icon: getIcon('strategy'),
          color: 'sage',
          items: [
            'Notion AI / Coda AI — draft requirements and acceptance criteria',
            'Gherkin / Cucumber-style specs — express expected behavior',
          ],
        },
        {
          title: 'Center — Generate and Revise Code',
          icon: getIcon('code'),
          color: 'taupe',
          items: ['GitHub Copilot, Cursor, or Claude Code — generate and revise against feedback'],
        },
        {
          title: 'Downstream — Test and Validate',
          icon: getIcon('check'),
          color: 'gold',
          items: [
            'Playwright / Postman — run browser or API tests',
            'GitHub Actions / CI — run checks on every PR iteration',
          ],
        },
        {
          title: 'Around the Loop — Release and Learn',
          icon: getIcon('rocket'),
          color: 'purple',
          items: [
            'LaunchDarkly — ship safely behind flags',
            'Datadog / Sentry — catch failures and feed learning back',
          ],
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'Product definition sits upstream, code generation sits at the center, validation sits downstream, and a light control layer wraps the loop.',
      },
    },
  },

  // ==========================================
  // Slide 6 — A Practical Enterprise Rollout
  // ==========================================
  {
    id: 'enterprise-rollout',
    title: 'A Practical Enterprise Rollout',
    type: 'framework',
    content: {
      type: 'framework',
      sectionLabel: 'Section 05',
      heading: 'Build around the coding tools already in place.',
      description:
        'Not a rip-and-replace. Add upstream and downstream discipline around the AI coding layer you already have.',
      layout: 'horizontal',
      levels: [
        {
          level: 1,
          title: 'Product & Quality Tool Adoption',
          badge: 'Add Now',
          description:
            'Define features in smaller, testable slices. Write structured acceptance criteria in one shared format linking features to expected behavior.',
          details: {
            outcome: 'Code generation starts from clearer functional goals.',
          },
        },
        {
          level: 2,
          title: 'Automated TDD & Feedback Loops',
          badge: 'Add Next',
          description:
            'Generate implementation against defined behavior. Run tests on each PR iteration. Feed failed tests back into the PR until the behavior is complete.',
          details: {
            outcome: 'The PR becomes a live loop of generation, testing, feedback, and correction.',
          },
        },
        {
          level: 3,
          title: 'Release, Security & Policy Automation',
          badge: 'Layer In',
          description:
            'Add security and policy checks into the same PR loop. Use flags and staged rollout to ship safely. Route production failures back into the backlog and test suite.',
          details: {
            outcome: 'Small changes move from spec to release with tighter governance built in — faster without losing control.',
          },
        },
      ],
    },
  },

  // ==========================================
  // Slide 7 — Conclusion
  // ==========================================
  {
    id: 'conclusion',
    title: 'Conclusion',
    type: 'title',
    content: {
      type: 'title',
      badge: 'The Takeaway',
      headline: 'The future is not point AI adoption. It is one connected delivery process.',
      subtitle:
        'The winners will not just write code faster. They will define features more clearly, validate changes earlier, release in smaller increments, and learn faster from production.',
      insightBox: {
        label: 'Closing Takeaway',
        text: 'AI-native delivery happens when product definition, code generation, testing, and release operate as one system — Product Definition → Code → Test / Review → Release → Feedback — instead of separate handoffs.',
      },
    },
  },
]

export default slides
