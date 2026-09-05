export const homepage = {
  hero: {
    eyebrow: 'AI diligence · Post-close operating work',
    headline: 'We underwrite AI in diligence, then help the operating team run it after close.',
    sub: 'Cost, speed, quality, revenue. Those are the only levers we price. Same bar before close and after.',
    primaryCta: 'Start a conversation',
    secondaryCta: 'Worked examples',
  },
  diligence: {
    eyebrow: '// Diligence',
    headline: 'Four phases. Each one gets a grade.',
    body: 'Every phase opens with a one-page answer and closes with a scorecard. If something is Conditional, we write the condition down.',
  },
  postClose: {
    eyebrow: '// Post-close',
    headline: 'After close: fund the small win, measure it, then stage the rest.',
    body: 'Same four levers. Same evidence bar.',
  },
  ladder: {
    eyebrow: '// How we show up',
    headline: 'Advise, Embed, and Build are how we staff the work. They are not the thesis.',
    body: 'Production at scale is assembled. We do not send a junior bench to learn on your deal.',
  },
  starts: {
    eyebrow: '// Start',
    headline: 'Three ways in',
    body: 'A live deal, a portfolio screen, or one company.',
  },
  work: {
    eyebrow: '// Work',
    headline: 'Illustrative worked examples',
    body: 'Three blinded projects. The method, not the client. Figures are invented.',
  },
  positioning:
    'Principals only. The people who write the scorecard can also run it after close. Project or retained work, not time and materials.',
  pricing: {
    eyebrow: '// How we engage',
    headline: 'What we take, and what we leave',
  },
  connect: {
    eyebrow: "// Let's Connect",
    headline: 'Live deal, portfolio, or one company.',
    body: 'Tell us which. We will say what the first page looks like.',
  },
} as const

export const phases = [
  {
    name: 'Growth',
    summary:
      'Where AI changes the growth case (volume, price, mix, win rate), and what is already in the model.',
    answer: 'One page: the growth thesis, the mechanism, and what must be true.',
  },
  {
    name: 'Disruption',
    summary: "What AI does to the category and to this company's right to win.",
    answer: 'One page: the threat, the defense, and the time horizon.',
  },
  {
    name: 'Assets',
    summary:
      'Data, workflow, talent, and model assets. Who owns them, and whether you can actually inspect them.',
    answer: 'One page: the asset map, the ownership, and what is a slide.',
  },
  {
    name: 'Value',
    summary: 'The P&L case on the four levers, and the conditions it needs.',
    answer: 'One page: the underwritable case, the upside, and what is not priced at entry.',
  },
] as const

export const grades = [
  {
    name: 'Strong',
    summary: 'Holds under scrutiny. Evidence is inspectable. The operating team can run it.',
  },
  {
    name: 'Conditional',
    summary:
      'Holds if a named condition is met. That condition sits on the scorecard, not in the footnotes.',
  },
  {
    name: 'High-risk',
    summary: 'Does not hold at entry, or the condition is not underwritable. Do not price it.',
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
    summary:
      'Measure on cost, speed, quality, or revenue. If you cannot measure it, it is not a program yet.',
  },
  {
    name: 'Validate',
    summary: 'Validate before the next tranche. Count accepted output, not generated output.',
  },
  {
    name: 'Stage',
    summary: 'Stage the rest of the list against the same scorecard. Stop what will not clear.',
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
    cadence: 'Advise · days',
    summary:
      'Scorecards and a go / no-go the IC can use. Phase answers with named conditions.',
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
    cadence: 'Embed · weeks',
    summary:
      'Two or three seniors inside the company who run the work after close, then hand it back working.',
    outputs: [
      'Initiative portfolio screen',
      'Readiness across six dimensions',
      'Fund / measure / validate / stage cadence',
      'Named owners on the 90-day win',
    ],
    color: 'taupe',
  },
  {
    number: '03',
    title: 'Build',
    cadence: 'Build · weeks',
    summary:
      'Software that makes the thesis testable: measurement, workflow, decision support. Not a body shop.',
    outputs: [
      'Measurement the operating team actually runs',
      'Internal tools that answer a live question',
      'Working software in weeks, not quarters',
      'A plan that still works if you turn the model off',
    ],
    color: 'gold',
  },
] as const

export const starts = [
  {
    id: 'deal',
    title: 'Live deal walk',
    summary: 'Working session on a live or imminent deal. Four phases on your facts.',
    youGet: 'Phase answers, grades, and named conditions. In one sitting.',
    subject: 'Live deal walk',
  },
  {
    id: 'portfolio',
    title: 'Portfolio initiative review',
    summary:
      'Screen the AI list against the four levers. What to fund, what to stop, what is not ready.',
    youGet: 'A ranked list, a readiness read, and the smallest 90-day wins worth funding.',
    subject: 'Portfolio initiative review',
  },
  {
    id: 'operating',
    title: 'One-company operating program',
    summary: 'Post-close spine for one company: thesis, 90-day win, stage-gates.',
    youGet: 'Owners, measures, and the cadence the operating team runs after close.',
    subject: 'One-company operating program',
  },
] as const

export const pricingPoints = [
  {
    title: 'Four levers',
    body: 'Work has to move cost, speed, quality, or revenue. If it does not touch the P&L, it is a conversation, not an engagement.',
  },
  {
    title: 'A draft is not done',
    body: 'The scorecard is done when the operating team can run it and the IC can underwrite it.',
  },
  {
    title: 'Turn the model off',
    body: 'The operating plan has to work if you turn the model off. AI is a lever, not the business.',
  },
  {
    title: 'Project or retained',
    body: 'Project or retained. Not time and materials. Fixed scope, incentives on the output.',
  },
] as const

export const offerings = {
  eyebrow: '// Offerings',
  headline: 'How we engage',
  body: 'Diligence first. Then the operating framework the team runs after close. Advise, Embed, and Build are how we staff it.',
  diligence: {
    label: 'A · Diligence',
    headline: 'Four phases. Each one gets a grade.',
    body: 'Every phase opens with a one-page answer and closes with a scorecard. If something is Conditional, we write the condition down.',
  },
  postClose: {
    label: 'B · Post-close',
    headline: 'After close: fund the small win, measure it, then stage the rest.',
    body: 'Same four levers. Same evidence bar. Initiative screen, then readiness across six dimensions, then fund / measure / validate / stage.',
  },
  leversNote:
    'If an initiative cannot be scored on one of these, it is not funded. The 90-day win is the smallest test that would change a belief on the scorecard.',
  ladder: {
    label: 'C · Capability ladder',
    headline: 'Advise, Embed, and Build are how we staff the work. They are not the thesis.',
    body: 'Production at scale is assembled. We do not send a junior bench to learn on your deal.',
  },
  pricing: {
    label: 'D · Pricing',
    headline: 'What we take, and what we leave',
  },
} as const
