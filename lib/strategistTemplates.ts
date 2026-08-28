/**
 * Output templates for the publish flow — the "flexible outputs" affordance.
 * The team picks the shape their organization needs (or pastes their own
 * outline) and Publish writes the same grounded content into that structure.
 * Server-side authoring is unchanged: the template only shapes the document,
 * it never adds numbers the session didn't ground.
 */

export interface OutputTemplate {
  key: string
  label: string
  description: string
  /** Structure instructions appended to the publish prompt. Empty = the default full protocol document. */
  outline: string
}

export const OUTPUT_TEMPLATES: OutputTemplate[] = [
  {
    key: 'protocol',
    label: 'Protocol design document',
    description: 'The full design — objectives, arms, criteria, enrollment and site plan, schedule.',
    outline: '',
  },
  {
    key: 'synopsis',
    label: 'Protocol synopsis',
    description: 'A tight ~2-page synopsis for circulation before the full protocol.',
    outline: `Produce a protocol SYNOPSIS, not the full document. Structure: h1 title; then h2 sections in this order — Rationale (one short paragraph); Objectives & endpoints (a table: objective, endpoint, timepoint); Design overview (phase, arms, randomization, blinding — one paragraph); Population & key eligibility (the five most consequential criteria only, as a list); Enrollment & footprint (target N, site count, country mix, regulatory floor compliance — one paragraph plus the allocation as a short table); Schedule summary (visit cadence and the assessments that drive burden — one paragraph). Hard cap: about 800 words. Decisions from the log appear applied in place, not narrated.`,
  },
  {
    key: 'governance',
    label: 'Governance review summary',
    description: 'Decision-focused summary for a governance or portfolio committee.',
    outline: `Produce a GOVERNANCE REVIEW SUMMARY, not the full protocol. Structure: h1 title; h2 "Design at a glance" (a table: indication, phase, arms, target N, sites/countries, primary endpoint); h2 "Decisions taken" (a table, one row per shipped decision: element, choice, alternatives considered, quantified impact in patients / months / dollars); h2 "Cost & timeline" (the ranges the session grounded — lean / as-drafted / rich cost, enrollment months by footprint scenario); h2 "Risks & open items" (amendment exposure, regulatory floor compliance, anything the team left open). Every figure must come from the session's grounded analyses; where a number was not established, say "not yet assessed" rather than estimating.`,
  },
  {
    key: 'feasibility',
    label: 'Feasibility memo',
    description: 'Operational feasibility: enrollment, footprint, screening risk, mitigations.',
    outline: `Produce an OPERATIONAL FEASIBILITY MEMO, not the full protocol. Structure: h1 title; h2 "Enrollment feasibility" (target N vs the comparator cohort's realized enrollment, expected months); h2 "Site & country footprint" (recommended allocation with regulatory floor compliance stated, site-count scenarios with timeline and activation cost); h2 "Screening & burden risks" (the criteria and procedures that cost the most patients, with rates); h2 "Mitigations" (the options the session surfaced, each with its quantified tradeoff). Lead every section with the number that matters, then at most three supporting sentences.`,
  },
  {
    key: 'custom',
    label: 'Custom template…',
    description: 'Paste your own outline or section list — the document follows it.',
    outline: '',
  },
]

export const DEFAULT_TEMPLATE_KEY = 'protocol'
export const CUSTOM_TEMPLATE_KEY = 'custom'
export const CUSTOM_OUTLINE_MAX = 4000

export function templateByKey(key: unknown): OutputTemplate {
  return (
    OUTPUT_TEMPLATES.find((t) => t.key === key) ??
    OUTPUT_TEMPLATES.find((t) => t.key === DEFAULT_TEMPLATE_KEY)!
  )
}

/**
 * Resolve what the publish prompt should receive from the client's template
 * selection. Custom outlines are treated as structure instructions only —
 * the grounding rules in the publish system prompt still govern content.
 */
export function resolveTemplate(
  key: unknown,
  customOutline?: unknown
): { label: string; outline: string } | null {
  const t = templateByKey(key)
  if (t.key === CUSTOM_TEMPLATE_KEY) {
    const outline = typeof customOutline === 'string' ? customOutline.trim().slice(0, CUSTOM_OUTLINE_MAX) : ''
    if (!outline) return null // custom selected but nothing pasted — fall back to default
    return { label: 'Custom template', outline: `Follow the team's own template. Map the session's grounded content into this structure as faithfully as the content allows; where the template asks for something the session did not establish, write "not yet assessed" rather than inventing it. Template:\n\n${outline}` }
  }
  return t.outline ? { label: t.label, outline: t.outline } : null
}
