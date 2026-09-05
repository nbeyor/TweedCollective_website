export const phases = [
  {
    name: 'Growth',
    summary: 'Where AI changes the growth case — volume, price, mix, or win rate — and what is already in the model.',
    answer: 'One page: the growth thesis, the mechanism, and what must be true.',
  },
  {
    name: 'Disruption',
    summary: 'What AI does to the category, to switching costs, and to this company’s right to win.',
    answer: 'One page: the threat, the defense, and the time horizon.',
  },
  {
    name: 'Assets',
    summary: 'What data, workflow, talent, and model assets exist, who owns them, and whether they can be inspected.',
    answer: 'One page: the asset map, the ownership, and what is a slide.',
  },
  {
    name: 'Value',
    summary: 'The P&L case on four levers — cost, speed, quality, revenue — and the conditions it requires.',
    answer: 'One page: the underwritable case, the upside, and what is not priced at entry.',
  },
] as const

export const grades = [
  {
    name: 'Strong',
    summary: 'The thesis holds under scrutiny. The evidence is inspectable. The operating team can run it.',
  },
  {
    name: 'Conditional',
    summary: 'The thesis holds if a named condition is met. The condition is written on the scorecard. It is not implied.',
  },
  {
    name: 'High-risk',
    summary: 'The thesis does not hold at entry, or the condition is not underwritable. Do not price it.',
  },
] as const

export const valueLevers = ['Cost', 'Speed', 'Quality', 'Revenue'] as const

export const postCloseSteps = [
  {
    name: 'Fund',
    summary: 'Fund the smallest 90-day win that tests the thesis. Not the full roadmap.',
  },
  {
    name: 'Measure',
    summary: 'Measure on the four levers. If it cannot be measured, it is not a program.',
  },
  {
    name: 'Validate',
    summary: 'Validate before the next tranche. Accepted output, not generated output.',
  },
  {
    name: 'Stage',
    summary: 'Stage the rest of the initiative list against the same scorecard. Stop what will not clear.',
  },
] as const

export const readinessDimensions = [
  {
    name: 'Sponsorship',
    summary: 'A named owner with P&L authority, not a steering committee.',
  },
  {
    name: 'Workflow',
    summary: 'The work is mapped. The handoffs are known. The exception path is written.',
  },
  {
    name: 'Data',
    summary: 'The inputs exist, can be accessed, and are trusted enough to act on.',
  },
  {
    name: 'Talent',
    summary: 'The people who will run it are on the work, not adjacent to it.',
  },
  {
    name: 'Tooling',
    summary: 'The stack can support the workflow. The tool decision is not the program.',
  },
  {
    name: 'Measurement',
    summary: 'A baseline exists. A target exists. A review cadence exists.',
  },
] as const

export const ladder = [
  {
    number: '01',
    title: 'Advise',
    cadence: 'Decision tools · days',
    summary:
      'Scorecards, memos, and a go / no-go the investment committee can use. We write the phase answers and name the conditions.',
    outputs: [
      'Four-phase diligence scorecard',
      'Named conditions on every Conditional grade',
      'Value case on the four levers',
      '100-day measurement plan',
    ],
    color: 'sage',
  },
  {
    number: '02',
    title: 'Embed',
    cadence: 'Operating tools · weeks',
    summary:
      'Operators inside the company who run the spine after close. Two or three seniors per workstream. The work is handed back working.',
    outputs: [
      'Initiative portfolio screen',
      'Readiness score across six dimensions',
      'Fund / measure / validate / stage cadence',
      'Operating owners on the 90-day win',
    ],
    color: 'taupe',
  },
  {
    number: '03',
    title: 'Build',
    cadence: 'Working systems · weeks',
    summary:
      'Software that makes the thesis testable. Measurement, workflow tools, and decision support. Production at scale is assembled. We are not a body shop.',
    outputs: [
      'Measurement systems the operating team runs',
      'Internal tools that answer a live question',
      'Working software in weeks, not quarters',
      'A plan that still works if the model is turned off',
    ],
    color: 'gold',
  },
] as const

export const starts = [
  {
    id: 'deal',
    title: 'Live deal walk',
    summary: 'A working session on a live or imminent deal. We run the four phases on your facts.',
    youGet: 'Phase answers, grades, and the conditions we would write — in one sitting.',
    subject: 'Live deal walk',
  },
  {
    id: 'portfolio',
    title: 'Portfolio initiative review',
    summary: 'A screen of the AI initiative list against the four levers. What to fund, what to stop, what is not ready.',
    youGet: 'A ranked list, a readiness read, and the smallest 90-day wins worth funding.',
    subject: 'Portfolio initiative review',
  },
  {
    id: 'operating',
    title: 'One-company operating program',
    summary: 'The post-close spine for a single company. Thesis to 90-day win to stage-gate.',
    youGet: 'Owners, measures, and the cadence the operating team runs after close.',
    subject: 'One-company operating program',
  },
] as const

export const pricingPoints = [
  {
    title: 'Four levers, or it is not in scope',
    body: 'We only take work that changes cost, speed, quality, or revenue. If it does not move the P&L, it is a conversation, not an engagement.',
  },
  {
    title: 'Accepted output, not generated output',
    body: 'A draft is not a deliverable. The scorecard is done when the operating team can run it, and the IC can underwrite it.',
  },
  {
    title: 'The plan must work without AI',
    body: 'If the operating plan fails when the model is turned off, the plan is wrong. AI is a lever, not the business.',
  },
  {
    title: 'Project or retained. Not time and materials.',
    body: 'Fixed scope. Defined outcomes. Incentives on the quality of the output, not hours logged.',
  },
] as const
