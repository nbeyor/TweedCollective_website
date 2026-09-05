export type Grade = 'Strong' | 'Conditional' | 'High-risk'
export type HarveyValue = 0 | 1 | 2 | 3 | 4

export const workDisclaimer =
  'Illustrative worked example. Figures are invented. This is not a client deliverable, not a representation of any engagement, and is not linked to any client workspace or gated insight.'

export const workProjects = [
  {
    slug: 'ridgeline',
    name: 'Project Ridgeline',
    sector: 'Clinical trial technology',
    tease: "Four-phase cover map, one Value page, and why the seller's productivity case is not an entry assumption.",
    excerpt: 'Diligence cover. Four grades. One phase written through.',
  },
  {
    slug: 'lantern',
    name: 'Project Lantern',
    sector: 'Specialty insurance',
    tease: 'Readiness extract: element scores, the fast path to a 3, and the sprint that would test it.',
    excerpt: 'Post-close readiness. Six dimensions. One sprint.',
  },
  {
    slug: 'kestrel',
    name: 'Project Kestrel',
    sector: 'Industrial software',
    tease: 'Weeks 1–20 and six workstreams. The tool pick is the smallest part of the program.',
    excerpt: 'Operating shape. Twenty weeks. Six workstreams.',
  },
] as const

export const ridgeline = {
  name: 'Project Ridgeline',
  sector: 'Clinical trial technology',
  dek: "Four-phase cover map, one Value page, and why the seller's productivity case is not an entry assumption.",
  cover: [
    {
      phase: 'Growth',
      grade: 'Conditional' as Grade,
      condition:
        'Holds if share is taken in site startup and monitoring, not if growth is only the installed base defending price.',
    },
    {
      phase: 'Disruption',
      grade: 'Strong' as Grade,
      condition: 'The category is being rewritten. This asset sits on the right side of the rewrite. The window is open.',
    },
    {
      phase: 'Assets',
      grade: 'Conditional' as Grade,
      condition:
        'Workflow data is real and inspectable. Model IP is thin. Labeled outcomes are not a durable asset at entry.',
    },
    {
      phase: 'Value',
      grade: 'High-risk' as Grade,
      condition:
        'The seller model prices a productivity gain the diligence cannot underwrite. Do not take it into the entry case.',
    },
  ],
  phaseDeepDive: {
    phase: 'Value',
    grade: 'High-risk' as Grade,
    answer:
      "The IC memo should not underwrite the seller's productivity case. The operating plan can still create value. Those are different sentences.",
    risks: [
      'Measurement is not in place. There is no baseline on the workflows the model claims to improve.',
      'The budget assumes adoption the organization has not demonstrated outside a pilot slide.',
      'Quality leakage is unpriced. Faster cycle time that raises query rates is not value.',
    ],
    actions: [
      'Re-cut the model to a scoped-workflow case. Two workflows. Named owners. A 6% hold, not 18%.',
      'Put measurement in the first 100 days. No second tranche without a validated baseline.',
      'Treat anything above the hold as upside. Price the company on the hold, not the pitch.',
    ],
  },
  assets: [
    { name: 'Workflow event data', value: 3 as HarveyValue, note: 'In production. Owned. Inspectable on a sample.' },
    { name: 'Customer workflow coverage', value: 3 as HarveyValue, note: 'Broad enough to matter. Not uniform.' },
    { name: 'Labeled outcomes', value: 1 as HarveyValue, note: 'Exists in pockets. Not a training asset.' },
    { name: 'Model IP', value: 1 as HarveyValue, note: 'Wrappers on third-party models. Not a moat.' },
    { name: 'Distribution / installed base', value: 4 as HarveyValue, note: 'Real. The growth question is whether it expands.' },
    { name: 'Talent to run the program', value: 2 as HarveyValue, note: 'A few strong people. Not a bench.' },
  ],
  harveyRule: [
    'Full ball: the company owns it, it is in production use, and it can be inspected.',
    'Three-quarter: owned and in use. Inspection is partial or coverage is uneven.',
    'Half: it exists, but is licensed, siloed, or unproven outside a pilot.',
    'Quarter: a slide, a vendor claim, or a roadmap item with a logo on it.',
    'Empty: not an asset.',
  ],
  valueScenarios: [
    {
      name: 'Seller budget',
      productivity: '18% throughput on development and services',
      underwritten: 'Not underwritten',
      note: 'Used to justify price. No baseline. No adoption evidence beyond a pilot narrative.',
    },
    {
      name: 'Diligence hold',
      productivity: '6% on two scoped workflows, after measurement exists',
      underwritten: 'Conditional',
      note: 'The condition is measurement in 100 days and a named operating owner. This is the entry case.',
    },
    {
      name: 'Diligence downside',
      productivity: '0% until a baseline holds',
      underwritten: 'Base if the condition fails',
      note: 'If measurement is not stood up, the AI value line is zero. The company still has a software business.',
    },
  ],
}

export const lantern = {
  name: 'Project Lantern',
  sector: 'Specialty insurance',
  dek: 'Readiness extract: element scores, the fast path to a 3, and the sprint that would test it.',
  dimensions: [
    {
      name: 'Sponsorship',
      elements: [
        { name: 'Named P&L owner', score: 4, note: 'Business line lead is on the work.' },
        { name: 'Decision rights', score: 3, note: 'Clear on paper. Untested on a stop decision.' },
        { name: 'Board / IC cadence', score: 2, note: 'Updates exist. They do not stage-gate funding.' },
      ],
    },
    {
      name: 'Workflow',
      elements: [
        { name: 'Target workflow mapped', score: 3, note: 'Submission-to-bind is written. Exceptions are not.' },
        { name: 'Handoffs and owners', score: 2, note: 'Known in the center. Thin in the field.' },
        { name: 'Exception path', score: 1, note: 'Escalation is tribal. Not a process.' },
      ],
    },
    {
      name: 'Data',
      elements: [
        { name: 'Submission data access', score: 3, note: 'Reachable. Quality varies by broker source.' },
        { name: 'Outcome labels', score: 2, note: 'Bind / no-bind is clean. Loss data is late and coarse.' },
        { name: 'Lineage and permissions', score: 2, note: 'Legal path exists. Engineering path is slow.' },
      ],
    },
    {
      name: 'Talent',
      elements: [
        { name: 'Underwriting time on the work', score: 3, note: 'Two seniors allocated. Not backfilled.' },
        { name: 'Ops owner', score: 2, note: 'Shared across three initiatives.' },
        { name: 'Change capacity', score: 2, note: 'The line can absorb one sprint. Not three.' },
      ],
    },
    {
      name: 'Tooling',
      elements: [
        { name: 'Workflow system fitness', score: 3, note: 'Core system can accept an assist. It cannot be replaced this year.' },
        { name: 'Model access', score: 3, note: 'Sufficient. Not the constraint.' },
        { name: 'Integration path', score: 2, note: 'Possible. Not scheduled.' },
      ],
    },
    {
      name: 'Measurement',
      elements: [
        { name: 'Baseline on cycle time', score: 2, note: 'Anecdotal. Not a weekly number the line trusts.' },
        { name: 'Quality definition', score: 1, note: '“Better underwriting” is not a metric.' },
        { name: 'Review cadence', score: 1, note: 'No stage-gate. Funding is annual.' },
      ],
    },
  ],
  fastPath: {
    element: 'Quality definition',
    from: 1,
    to: 3,
    shape:
      'A 15-day sprint. One product line. One definition of a good bind decision that an underwriter will sign. Three scored outcomes, not a model.',
    steps: [
      'Pick the line of business where cycle time already has a number, even a weak one.',
      'Write the quality definition with two underwriters. If they will not use it on a live file, it is not a 3.',
      'Score 25 historical binds against the definition. That is the baseline. No model required.',
      'Only then attach an assist. The assist is measured against the definition, not against “AI usage.”',
    ],
  },
  sprint: {
    length: '15 business days',
    owner: 'Line underwriting lead, with one ops partner',
    scope: 'One product line. One quality definition. One baseline.',
    out: 'A 3 on quality definition, a trusted baseline, and a go / no-go on funding an assist.',
  },
}

export const kestrel = {
  name: 'Project Kestrel',
  sector: 'Industrial software',
  dek: 'Weeks 1–20 and six workstreams. The tool pick is the smallest part of the program.',
  principle:
    'The tool pick is the smallest part of the program. Measurement, workflow, and adoption decide whether the thesis is real.',
  weeks: [
    {
      range: 'Weeks 1–4',
      title: 'Diagnose and score',
      body: 'Four-phase cover on the live facts. Initiative list scored on the four levers. Readiness on six dimensions. A stop list.',
    },
    {
      range: 'Weeks 5–8',
      title: 'Fund the 90-day win',
      body: 'One initiative. Named owner. Baseline. Definition of accepted output. Everything else waits.',
    },
    {
      range: 'Weeks 9–12',
      title: 'Measure',
      body: 'Weekly numbers the line trusts. Cost, speed, quality, revenue. Only the levers the win claims.',
    },
    {
      range: 'Weeks 13–16',
      title: 'Validate',
      body: 'Hold or kill. If the number does not move, the program does not expand. Generated output is not evidence.',
    },
    {
      range: 'Weeks 17–20',
      title: 'Stage',
      body: 'The next tranche is sequenced against the same scorecard. New tools are bought only if the last win cleared.',
    },
  ],
  workstreams: [
    {
      name: 'Thesis translation',
      body: 'Turn the IC memo into an operating scorecard the company can run. Conditions stay visible.',
    },
    {
      name: 'Initiative screen',
      body: 'Every AI project on the four levers. Fund, wait, or stop. No orphan proofs of concept.',
    },
    {
      name: 'Measurement design',
      body: 'Baselines, targets, and a review the operating team will actually hold.',
    },
    {
      name: 'Workflow redesign',
      body: 'The work changes, or the tool will not matter. Handoffs, exceptions, and who decides.',
    },
    {
      name: 'Tooling',
      body: 'The smallest workstream. Fit the stack to the workflow. Do not start here.',
    },
    {
      name: 'Adoption and stage-gate',
      body: 'Owners, capacity, and the stop decision. A program that cannot stop is not being managed.',
    },
  ],
}
