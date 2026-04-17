import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = 'ecs-sqa-plan'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — Agent-Only Delivery Model
  // ==========================================
  {
    id: 'agent-only-delivery-model',
    title: 'Agent-Only Delivery Model',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'EcsSqaDeliveryModelSlide',
      props: {
        slideId: 'agent-only-delivery-model',
        heading: 'Agent-only delivery model',
        description:
          'Idealized future state across Product, Development, and SQA, with tools under each function and a shared documentation layer supporting all agents.',
        columns: [
          {
            title: 'Product',
            iconKey: 'product',
            responsibilities: [
              'Owns PRD + acceptance tests',
              'Breaks work into small, low-risk slices',
              'Defines edge cases / release intent',
            ],
            agentActions: [
              'Draft PRDs',
              'Generate acceptance criteria',
              'Generate test scenarios',
              'Scope releasable slices',
            ],
            tools: ['Figma', 'Productboard', 'Jira'],
          },
          {
            title: 'Development',
            iconKey: 'development',
            responsibilities: [
              'Turns PRD + tests into code',
              'Keeps PRs small / modular / reviewable',
              'Updates unit + integration tests',
            ],
            agentActions: [
              'Implement features',
              'Refactor code',
              'Write tests',
              'Generate PRs',
            ],
            tools: ['Jira', 'GitHub Copilot / Cursor', 'GitHub'],
          },
          {
            title: 'SQA',
            iconKey: 'sqa',
            responsibilities: [
              'Reviews code, executes tests, runs InfoSec checks',
              'Determines pass / fail / escalate',
              'Produces defects, regressions, rollout guidance',
            ],
            agentActions: [
              'Run code review',
              'Execute browser / API / integration tests',
              'Run security and policy checks',
              'Recommend release path',
            ],
            tools: [
              'Jira agent',
              'GitHub checks / Actions',
              'Playwright',
              'Semgrep / Snyk',
              'LaunchDarkly',
            ],
          },
        ],
        foundation: {
          title: 'Markdown operating system for agents',
          items: [
            'Standards',
            'Architecture notes',
            'Test rules',
            'Security policies',
            'Escalation paths',
          ],
        },
        footerTakeaway:
          'The system works only if all three functions are driven by structured artifacts and agent-readable documentation.',
      },
    },
  },

  // ==========================================
  // Slide 2 — KPI System
  // ==========================================
  {
    id: 'kpi-system',
    title: 'KPI System',
    type: 'table',
    content: {
      type: 'table',
      heading: 'Metrics to manage the transition',
      description:
        'A tight KPI set that tracks speed, quality, and agent efficiency without overloading the team.',
      headers: ['KPI', 'What it tells you', 'Data needed'],
      rows: [
        [
          'PRD first-pass implementation',
          'Can Dev agent implement from PRD without rewrite?',
          'PRD revisions, Jira rework, handoff feedback',
        ],
        [
          'QA first-pass pass rate',
          'Does change clear QA / security gates on first run?',
          'CI logs, test results, scan results',
        ],
        [
          'End-to-end lead time',
          'PRD approved to production-ready',
          'Productboard timestamps, Jira timestamps, PR and deploy timestamps',
        ],
        [
          'Small-PR compliance',
          'Are teams actually shipping in small batches?',
          'PR size, files changed, risk labels',
        ],
        [
          'Change failure rate',
          'How often releases trigger rollback, hotfix, or bug',
          'Incident tags, rollback logs, hotfix tickets',
        ],
        [
          'Agent efficiency / cost per shipped change',
          'Tokens, runs, tool cost per PR / release',
          'Model logs, tool usage, CI runtime',
        ],
      ],
      highlightFirstColumn: true,
      columnWidths: ['28%', '36%', '36%'],
      insightBox: {
        label: 'Keep the metric set tight',
        text: '2 system metrics, 2 handoff metrics, 2 efficiency metrics. Measure the system flow, not just coding output.',
      },
    },
  },

  // ==========================================
  // Slide 3 — Dual-Track Roadmap
  // ==========================================
  {
    id: 'dual-track-roadmap',
    title: 'Dual-Track Roadmap',
    type: 'custom',
    content: {
      type: 'custom',
      componentId: 'EcsSqaRoadmapSlide',
      props: {
        slideId: 'dual-track-roadmap',
        heading: 'Dual-track roadmap',
        description:
          'Improve the current operating model while simultaneously building a narrow agent-only pilot to test the future state.',
        months: ['Month 1', 'Month 2', 'Month 3'],
        tracks: [
          {
            title: 'Track 1 — Incremental team evolution',
            variant: 'primary',
            phases: [
              [
                'Define Product / Dev / SQA workflow',
                'Standardize PRD + test template',
                'Set PR sizing + risk tiers',
                'Choose KPIs + data sources',
              ],
              [
                'Pilot workflow on live team',
                'Start QA / security agent checks',
                'Collect KPI baseline',
                'Build markdown guidance',
              ],
              [
                'Refine prompts, docs, gating',
                'Tune KPI targets',
                'Expand agent coverage',
                'Prepare broader rollout',
              ],
            ],
          },
          {
            title: 'Track 2 — Agent-only pilot',
            variant: 'accent',
            phases: [
              [
                'Pick low-risk scope',
                'Build narrow PRD → code → QA flow',
                'Stand up first Product / Dev / SQA agents',
              ],
              [
                'Run live pilot cycles',
                'Measure pass rate, speed, cost',
                'Tighten QA + security agents',
              ],
              [
                'Compare against baseline',
                'Codify lessons',
                'Identify what is ready to scale',
              ],
            ],
          },
        ],
        bottomMessages: [
          'Track 1 improves today\u2019s system',
          'Track 2 proves the future-state ceiling',
          'Pilot should move faster by staying narrow and low-risk',
        ],
        footerTakeaway:
          'Run both tracks in parallel: one to improve the present, one to prove the future.',
      },
    },
  },
]

export default slides
