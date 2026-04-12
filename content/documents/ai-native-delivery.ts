import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'ai-native-delivery'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — The Productivity Plateau
  // ==========================================
  {
    id: 'productivity-plateau',
    title: 'The Productivity Plateau',
    type: 'text',
    content: {
      type: 'text',
      sectionLabel: 'Section 01',
      heading: 'Most developers now use AI. Most organizations still see only modest delivery gains.',
      body: [
        'AI coding adoption is already broad: across industry surveys, roughly 75% to 95% of developers report using AI tools in some form. But organizational results are much smaller — many teams report only about 10% improvement in end-to-end delivery metrics or business output.',
        'The gap is structural. Developers feel faster because AI reduces cognitive friction, but the constraint often shifts downstream into review, testing, and release.',
        'Coding is only part of delivery. If coding is roughly 25–35% of the lifecycle, even a dramatic improvement there only produces a limited system-wide gain unless the rest of the workflow changes too.',
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'You have likely captured the easy gains already. The next step is redesigning delivery around AI — not just adding AI to coding.',
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
      sectionLabel: 'Section 02',
      heading: 'Where you apply AI determines what you get.',
      description: 'Real gains come from combining all three modes. Most teams are in Guardrails today, with some experimentation in Execution. The step-change usually comes from Better Inputs.',
      headers: ['Mode', 'What it is', 'Value', 'Limitation'],
      rows: [
        [
          'Better Guardrails',
          'AI-assisted PR review, static analysis, security scanning, smarter CI',
          'Easy to add; low disruption',
          'Mostly reactive',
        ],
        [
          'Better Inputs',
          'Requirements written as testable behaviors before coding starts',
          'Better intent; less rework',
          'Requires Product + Eng process change',
        ],
        [
          'Better Execution',
          'Agents generating tests, automating browser/API validation, running checks continuously',
          'Less manual QA; faster cycles',
          'Brittle if inputs are vague',
        ],
      ],
      highlightFirstColumn: true,
      columnWidths: ['18%', '37%', '22%', '23%'],
      insightBox: {
        label: 'Emphasis',
        text: 'AI performs best inside a system with clear intent, tight feedback, and controlled release. Testing each small step creates faster feedback and less rework than validating a large batch at the end.',
      },
    },
  },

  // ==========================================
  // Slide 3 — The System Design
  // ==========================================
  {
    id: 'system-design',
    title: 'The System Design',
    type: 'comparison',
    content: {
      type: 'comparison',
      sectionLabel: 'Section 03',
      heading: 'Test-driven, small-batch delivery — not "more AI in QA."',
      description: 'The delivery loop: (1) Define requirements as testable behaviors → (2) Build the smallest slice that satisfies one behavior → (3) Run automated checks at the right depth → (4) Route only high-risk changes to heavier human review → (5) Ship small changes behind flags → (6) Turn production feedback into the next regression tests.',
      left: {
        title: 'Machines Own',
        variant: 'positive',
        items: [
          'Linting, typing, static checks',
          'Unit and contract test execution',
          'Regression runs',
          'Basic PR review',
          'Security scans',
          'Release gates on known metrics',
        ],
      },
      right: {
        title: 'Humans Own',
        variant: 'positive',
        items: [
          'Requirement quality',
          'Architecture and tradeoffs',
          'High-risk changes',
          'Ambiguous edge cases',
          'Sensitive production judgment',
        ],
      },
      insightBox: {
        label: 'Emphasis',
        text: 'The key shift is not automating everything. It is making each step small, testable, and recoverable.',
      },
    },
  },

  // ==========================================
  // Slide 4 — The Delivery Discipline
  // ==========================================
  {
    id: 'delivery-discipline',
    title: 'The Delivery Discipline',
    type: 'list',
    content: {
      type: 'list',
      sectionLabel: 'Section 04',
      heading: 'Smaller PRs, explicit risk tiers, and right-sized testing.',
      description: 'Smaller pull requests are reviewed faster and catch more issues. Match testing depth to change risk — not more testing everywhere.',
      groups: [
        {
          title: 'PR Rules of Thumb',
          icon: getIcon('check'),
          color: 'sage',
          items: [
            { text: 'One behavior per PR' },
            { text: 'Branch lifetime in hours, not days' },
            { text: 'Use flags to ship incomplete work safely' },
          ],
        },
        {
          title: 'Risk Tiers',
          icon: getIcon('shield'),
          color: 'gold',
          items: [
            { text: 'Low: copy, UI polish, isolated logic', subtext: 'Automated review, light testing' },
            { text: 'Medium: workflow, API, multi-file logic', subtext: 'Standard suite plus human review' },
            { text: 'High: auth, payments, migrations', subtext: 'Full suite, senior review, staged rollout' },
          ],
        },
        {
          title: 'Test Layers',
          icon: getIcon('automation'),
          color: 'purple',
          items: [
            { text: 'Unit — logic and edge cases' },
            { text: 'Contract — interfaces between services' },
            { text: 'Integration — critical multi-component flows' },
            { text: 'E2E — highest-value user journeys only' },
            { text: 'Release — smoke, canary, monitoring gates' },
          ],
        },
      ],
    },
  },

  // ==========================================
  // Slide 5 — Tool Map
  // ==========================================
  {
    id: 'tool-map',
    title: 'Tool Map',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 05',
      heading: 'The problem is not tool access. The problem is tool orchestration.',
      description: 'Tools should map directly to the delivery workflow: Author → Build → Validate → Release → Learn.',
      columns: 3,
      items: [
        {
          title: 'Author',
          icon: getIcon('strategy'),
          color: 'sage',
          items: ['Notion AI / Coda AI', 'Gherkin / Cucumber'],
        },
        {
          title: 'Build',
          icon: getIcon('code'),
          color: 'taupe',
          items: ['GitHub Copilot / Cursor', 'SonarQube', 'Snyk'],
        },
        {
          title: 'Validate',
          icon: getIcon('check'),
          color: 'gold',
          items: ['Jest / Vitest', 'Pact', 'Playwright', 'Postman / Bruno', 'Percy / Chromatic'],
        },
        {
          title: 'Release',
          icon: getIcon('rocket'),
          color: 'purple',
          items: ['LaunchDarkly', 'Argo Rollouts / Flagger', 'Datadog / Grafana', 'PagerDuty'],
        },
        {
          title: 'Learn',
          icon: getIcon('chart'),
          color: 'green',
          items: ['Sentry / Honeycomb', 'Linear / Jira', 'BuildPulse / Trunk', 'Sleuth / Jellyfish'],
        },
      ],
      insightBox: {
        label: 'Bottom Line',
        text: 'Point solutions are not the constraint. Connecting them into one operating model is. This is a workflow design problem, not a shopping problem.',
      },
    },
  },

  // ==========================================
  // Slide 6 — Three Waves to Get There
  // ==========================================
  {
    id: 'three-waves',
    title: 'Three Waves to Get There',
    type: 'framework',
    content: {
      type: 'framework',
      sectionLabel: 'Section 06',
      heading: 'Do not rip and replace. Move in three waves.',
      description: 'The roadmap is not "buy more QA tools." It is moving from AI-assisted coding to test-driven, small-batch, system-level delivery.',
      levels: [
        {
          level: 1,
          title: 'Tighten the current model',
          badge: 'Weeks 1–6',
          description: 'Set PR sizing rules, define risk tiers, match CI depth to risk, add clearer acceptance criteria, establish a flaky-test policy.',
          details: {
            outcome: 'Measured by: PR size, cycle time, flaky test rate.',
          },
        },
        {
          level: 2,
          title: 'Push quality upstream',
          badge: 'Months 2–4',
          description: 'Require testable acceptance criteria in PRDs. Pilot behavior-first stories on 1–2 teams. Align PMs and Eng on the smallest releasable slice.',
          details: {
            outcome: 'Measured by: escaped defects, rework rate, review churn.',
          },
        },
        {
          level: 3,
          title: 'Automate release safety',
          badge: 'Months 3–6',
          description: 'Add browser automation for critical journeys. Introduce feature-flagged delivery. Tie release gates to production thresholds.',
          details: {
            outcome: 'Measured by: deployment frequency, rollback rate, change failure rate.',
          },
        },
      ],
    },
  },

  // ==========================================
  // Slide 7 — One-Line Summary
  // ==========================================
  {
    id: 'summary',
    title: 'Summary',
    type: 'title',
    content: {
      type: 'title',
      badge: 'The Takeaway',
      headline: 'AI changes coding first.',
      subtitle: 'It only changes delivery when requirements, testing, and release are redesigned around it.',
      insightBox: {
        label: 'From AI-Assisted Coding',
        text: 'To AI-Native Delivery — test-driven, small-batch, system-level.',
      },
    },
  },
]

export default slides
