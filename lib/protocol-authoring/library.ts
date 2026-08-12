/**
 * The Protocol Foundry's guided on-ramps, as client-safe data (no fs, no
 * server imports — this module ships to the browser).
 *
 * Three surfaces read from here:
 *  - the protocol outline (left panel, Protocol tab): every section of
 *    HORIZON-Lung-301 with a section-scoped starter question, so clicking a
 *    section drops a grounded pressure-test into the chat;
 *  - the analyses library (left panel, Analyses tab): the decision-organized
 *    question groups, augmented beyond the strategist baseline with the
 *    authoring analytics the client's ProtocolForge demo covers (eligibility
 *    funnel, power, burden, country viability, regulatory sweep, enrollment
 *    projection);
 *  - the review board launcher: the reviewer lenses a Foundry review runs.
 */

import type React from 'react'

// ---------------------------------------------------------------- outline ---

export interface OutlineSection {
  id: string
  title: string
  /** Starter question teed into the composer when the section is clicked. */
  question: string
}

export interface OutlineChapter {
  num: number
  title: string
  sections: OutlineSection[]
}

/**
 * Mirrors HORIZON_CHAPTERS in horizonProtocol.ts (ids must match — the model
 * fetches bodies by these ids), but carries only titles and questions so the
 * 30KB of section prose stays out of the page bundle.
 */
export const PROTOCOL_OUTLINE: OutlineChapter[] = [
  {
    num: 1,
    title: 'Protocol Summary',
    sections: [
      {
        id: 'protocol-synopsis',
        title: 'Protocol Synopsis',
        question:
          'Read the protocol synopsis and give me your top three concerns as a protocol authority — where is this design most exposed?',
      },
      {
        id: 'trial-schema',
        title: 'Trial Schema',
        question: 'Walk me through the trial schema — arms, allocation, treatment duration — and sanity-check it against the synopsis.',
      },
      {
        id: 'schedule-of-activities-soa',
        title: 'Schedule of Activities (SoA)',
        question:
          'Score the patient burden of the schedule of activities visit by visit — which visit is heaviest, and what would you move?',
      },
    ],
  },
  {
    num: 2,
    title: 'Introduction',
    sections: [
      {
        id: 'disease-background',
        title: 'Disease Background',
        question: 'Review the disease background — is the unmet-need argument for adding MRD-1872 to pembrolizumab well supported?',
      },
      {
        id: 'scientific-rationale-for-mrd-1872',
        title: 'Scientific Rationale for MRD-1872',
        question: 'Pressure-test the scientific rationale for MRD-1872 — what would a skeptical reviewer push back on?',
      },
      {
        id: 'benefit-risk-assessment',
        title: 'Benefit / Risk Assessment',
        question:
          'Review the benefit/risk section — does it quantify the incremental immune-related adverse event risk over pembrolizumab alone?',
      },
    ],
  },
  {
    num: 3,
    title: 'Objectives and Estimands',
    sections: [
      {
        id: 'primary-objectives-and-estimands',
        title: 'Primary Objectives and Estimands',
        question:
          'Review the primary estimands against ICH E9(R1) — are the intercurrent-event strategies for the dual PFS/OS primaries fully specified?',
      },
      {
        id: 'secondary-objectives',
        title: 'Secondary Objectives',
        question: 'Review the secondary objectives — is each one matched to an endpoint and an analysis, or is anything decorative?',
      },
      {
        id: 'exploratory-objectives',
        title: 'Exploratory Objectives',
        question: 'Which exploratory objectives earn their data-collection cost, and which could be cut without losing the science?',
      },
    ],
  },
  {
    num: 4,
    title: 'Trial Design',
    sections: [
      {
        id: 'overall-design',
        title: 'Overall Design · 1:1 Randomization',
        question: 'Review the overall design — randomization, stratification, blinding. Any structural weaknesses?',
      },
      {
        id: 'rationale-for-design-choices',
        title: 'Rationale for Design Choices',
        question: 'Pressure-test the design-choice rationale — are the choices defended with evidence or asserted?',
      },
    ],
  },
  {
    num: 5,
    title: 'Study Population and Eligibility',
    sections: [
      {
        id: 'inclusion-criteria',
        title: 'Inclusion Criteria',
        question:
          'Which inclusion criteria will cost us the most eligible patients? Walk the eligibility funnel and rank the screening burden.',
      },
      {
        id: 'exclusion-criteria',
        title: 'Exclusion Criteria',
        question:
          'Review the exclusion criteria — which are safety-essential, and which are habit? Quantify what each costs in eligible patients.',
      },
    ],
  },
  {
    num: 6,
    title: 'Study Intervention — MRD-1872',
    sections: [
      {
        id: 'dosing-rationale-and-pk-pd',
        title: 'Dosing Rationale and PK/PD',
        question: 'Review the dosing rationale — does the PK/PD story support the 700 mg Q3W flat dose in this population?',
      },
      {
        id: 'preparation-administration-and-storage',
        title: 'Preparation, Administration, and Storage',
        question: 'Review the preparation and administration section for site-workflow friction — what will pharmacies push back on?',
      },
    ],
  },
  {
    num: 7,
    title: 'Discontinuation Criteria · irAEs',
    sections: [
      {
        id: 'discontinuation-criteria',
        title: 'Discontinuation Criteria',
        question:
          'Review the discontinuation criteria against current irAE management guidance — is permanent discontinuation for Grade 3+ pneumonitis fully specified?',
      },
    ],
  },
  {
    num: 8,
    title: 'Statistical Considerations',
    sections: [
      {
        id: 'sample-size-and-power',
        title: 'Sample Size and Power',
        question:
          'Verify the sample size: how many PFS and OS events does the design need, and what happens to power if the true effect is weaker than planned?',
      },
      {
        id: 'hierarchical-testing',
        title: 'Hierarchical Testing · PFS then OS',
        question: 'Review the hierarchical testing scheme — is the alpha recycling between the dual primaries and key secondaries airtight?',
      },
      {
        id: 'interim-analyses',
        title: 'Interim Analyses',
        question:
          'Review the interim analysis plan — are the information fractions, boundaries, and DSMB actions consistent with the required event counts?',
      },
    ],
  },
  {
    num: 9,
    title: 'Safety Monitoring and DSMB',
    sections: [
      {
        id: 'safety-monitoring-and-dsmb',
        title: 'Safety Monitoring and DSMB',
        question:
          'Review the DSMB section — are the stopping rules for an immune-mediated mortality imbalance quantified, or left to judgment?',
      },
    ],
  },
  {
    num: 10,
    title: 'Exploratory Biomarkers · ctDNA / TMB',
    sections: [
      {
        id: 'exploratory-biomarkers',
        title: 'Exploratory Biomarkers',
        question:
          'Review the biomarker section — do the specimen-retention and consent terms cover everything the ctDNA and TMB program collects?',
      },
    ],
  },
  {
    num: 11,
    title: 'Informed Consent and Ethics',
    sections: [
      {
        id: 'informed-consent-and-ethics',
        title: 'Informed Consent and Ethical Considerations',
        question:
          'Review the consent section — readability level, tissue-use disclosure, and equity of access across the planned regions.',
      },
    ],
  },
]

// ---------------------------------------------------------- review board ----

export interface ReviewLens {
  key: string
  label: string
  focus: string
}

/**
 * The Foundry review board: the reviewer lenses a protocol review runs,
 * condensed from the client demo's twelve authoring agents and nine-member
 * virtual IRB into six disciplines a finding can be attributed to.
 */
export const REVIEW_LENSES: ReviewLens[] = [
  {
    key: 'biostatistics',
    label: 'Biostatistics',
    focus: 'Estimands (ICH E9(R1)), power and event counts, multiplicity, interim analyses, missing-data strategy',
  },
  {
    key: 'regulatory',
    label: 'Regulatory',
    focus: 'ICH M11 structure, FDA/EMA/PMDA expectations, safety-reporting obligations, country-specific requirements',
  },
  {
    key: 'safety',
    label: 'Safety & Medical Monitoring',
    focus: 'DSMB charter and stopping rules, irAE management and discontinuation criteria, AE reporting timelines',
  },
  {
    key: 'operations',
    label: 'Clinical Operations',
    focus: 'Site and patient burden, screening feasibility, enrollment realism, visit-window operability',
  },
  {
    key: 'ethics',
    label: 'Ethics & Consent',
    focus: 'Consent readability and completeness, tissue-use disclosure, participant equity, vulnerable populations',
  },
  {
    key: 'data-standards',
    label: 'Data Standards',
    focus: 'Endpoint definitions vs CDISC/USDM semantics, SoA-to-endpoint consistency, assessment-schedule coherence',
  },
]

export const FULL_BOARD_PROMPT =
  'Convene the full review board on the current draft: review every chapter through each reviewer lens, and file the findings — severity, section, quote, recommendation, regulatory basis, and a proposed rewrite for anything critical or major.'

export function lensReviewPrompt(lens: ReviewLens): string {
  return `Convene the ${lens.label} reviewer on the draft: sweep the sections that matter for ${lens.focus.toLowerCase()}, and file findings with severity, the exact quote at issue, a recommendation, the regulatory basis, and a proposed rewrite where warranted.`
}

// ---------------------------------------------------------------- library ---

export interface AuthoringAnalysis {
  label: string
  chart: string
  prompt: string
}

export interface AuthoringQuestionGroup {
  key: string
  label: string
  question: string
  /** Icon slot filled by the component layer (lucide node). */
  icon?: React.ReactNode
  analyses: AuthoringAnalysis[]
}

export const AUTHORING_GROUPS: AuthoringQuestionGroup[] = [
  {
    key: 'population',
    label: 'Population & eligibility',
    question: 'Who can we actually enroll?',
    analyses: [
      {
        label: 'Eligibility funnel',
        chart: 'Funnel',
        prompt:
          'Walk the eligibility funnel — how many patients survive each gate of our criteria, and which criterion is the most restrictive?',
      },
      {
        label: 'Screening burden by criterion',
        chart: 'Criteria waterfall',
        prompt: 'Which criteria in this draft will cost us the most eligible patients? Rank the screening burden.',
      },
      {
        label: 'PD-L1 threshold what-if',
        chart: 'Funnel + cohort',
        prompt:
          'What would moving the PD-L1 threshold from TPS ≥ 50% to ≥ 1% do to the eligible pool, and how do comparable trials split on this choice?',
      },
    ],
  },
  {
    key: 'statistics',
    label: 'Statistics & power',
    question: 'Is the design powered for what we claim?',
    analyses: [
      {
        label: 'Power & required events',
        chart: 'Power curve',
        prompt:
          'Verify the sample size: how many PFS and OS events does the design need, and what happens to power if the true hazard ratio is weaker than planned?',
      },
      {
        label: 'Dropout sensitivity',
        chart: 'Scenario bars',
        prompt: 'How does the randomized-N requirement move at 10%, 15%, and 20% dropout? Show the sensitivity.',
      },
      {
        label: 'Interim analyses check',
        chart: 'Power curve',
        prompt:
          'Review the interim analysis plan against the required event counts — are the information fractions and boundaries consistent?',
      },
    ],
  },
  {
    key: 'burden',
    label: 'Patient & site burden',
    question: 'What are we asking of patients and sites?',
    analyses: [
      {
        label: 'Visit burden profile',
        chart: 'Burden by visit',
        prompt:
          'Score the patient burden of the schedule of activities visit by visit — which visit is heaviest, what drives it, and what would you move?',
      },
      {
        label: 'Split-the-heaviest-visit what-if',
        chart: 'Burden by visit',
        prompt:
          'If we split the heaviest visit into two, what does that trade in patient trips and site workload? Give me options with tradeoffs.',
      },
      {
        label: 'Burden vs comparators',
        chart: 'Comparator scatter',
        prompt: 'Place this design against comparable trials — is it more burdensome than the trials that enrolled fastest?',
      },
    ],
  },
  {
    key: 'cost',
    label: 'Cost',
    question: 'What will this study cost?',
    analyses: [
      {
        label: 'Per-patient & total cost',
        chart: 'Cost buildup',
        prompt:
          'What will this study cost per patient and all-in? Break out direct vs indirect and show the range across SoA intensity.',
      },
      {
        label: 'How the SoA drives cost',
        chart: 'Cost buildup',
        prompt: 'How much of the per-patient cost is the schedule of assessments? Show lean vs as-drafted vs rich.',
      },
      {
        label: 'What an amendment costs',
        chart: 'Amendment-risk view',
        prompt:
          'If we have to amend after first-patient-in, what does that typically cost in dollars and months, and which elements are most likely to force one?',
      },
    ],
  },
  {
    key: 'geography',
    label: 'Sites & countries',
    question: 'Where should this run?',
    analyses: [
      {
        label: 'Country viability',
        chart: 'Viability board',
        prompt:
          'Rate the planned countries by viability — eligible pool, per-site rate, startup time, regulatory risk — and flag the weakest link in the footprint.',
      },
      {
        label: 'Regulatory requirements sweep',
        chart: 'Requirements list',
        prompt:
          'Sweep the per-country regulatory requirements for the planned footprint — blockers first, then warnings, each with its lead-time impact.',
      },
      {
        label: 'Recommended footprint',
        chart: 'Site & country map',
        prompt:
          'Build me a country and site footprint that hits 600 randomized with a 30% US enrollment floor. Show the allocation and recruit timeline.',
      },
    ],
  },
  {
    key: 'timelines',
    label: 'Enrollment & timelines',
    question: 'How fast do we get to 600?',
    analyses: [
      {
        label: 'Enrollment projection',
        chart: 'Enrollment curve',
        prompt:
          'Project the enrollment curve over the planned footprint — when do we hit 600 randomized under slower, planned, and faster rates?',
      },
      {
        label: 'Fresh-biopsy what-if',
        chart: 'Sensitivity comparison',
        prompt:
          'Central PD-L1 confirmation forces a fresh tumor biopsy wherever archival tissue is older than 24 months. How does mandatory biopsy at screening hit the enrollment timeline? Give me options with tradeoffs.',
      },
      {
        label: 'Enrollment vs comparators',
        chart: 'Comparator scatter',
        prompt: 'How fast did comparable Phase 3 trials enroll, and is our planned timeline realistic against them?',
      },
    ],
  },
  {
    key: 'endpoints',
    label: 'Endpoints & data',
    question: 'Which endpoints earn their timeline cost?',
    analyses: [
      {
        label: 'Endpoint timeline impact',
        chart: 'Endpoint timeline',
        prompt:
          'How would adding the candidate exploratory endpoints (ctDNA dynamics, PK exposure, immunogenicity, healthcare resource use) hit data collection and the database-lock timeline?',
      },
      {
        label: 'Endpoint load vs database lock',
        chart: 'Endpoint timeline',
        prompt: 'Rank the candidate endpoints by the days they add to database lock, and show which subset protects the readout timeline.',
      },
    ],
  },
  {
    key: 'risk',
    label: 'Risk & review',
    question: 'What will reviewers flag?',
    analyses: [
      {
        label: 'Amendment risk sweep',
        chart: 'Amendment-risk view',
        prompt:
          'Before this draft advances, which elements are most likely to force a mid-flight amendment, and what would one cost us?',
      },
      {
        label: 'Safety & DSMB review',
        chart: 'Findings',
        prompt:
          'Convene the Safety & Medical Monitoring reviewer on the DSMB, discontinuation, and safety sections — file findings with severity and proposed rewrites.',
      },
      {
        label: 'Full board review',
        chart: 'Findings',
        prompt: FULL_BOARD_PROMPT,
      },
    ],
  },
]

// ------------------------------------------------------------ suggestions ---

/** Starter questions shown over the empty chat. */
export const AUTHORING_SUGGESTIONS: string[] = [
  'Read the synopsis and give me your top three concerns with this draft.',
  'Verify the sample size — events needed for the dual PFS/OS primaries, and the power if the true effect is weaker.',
  'Which eligibility criteria will cost us the most patients? Walk the funnel.',
  'Convene the full review board and file the findings.',
]
