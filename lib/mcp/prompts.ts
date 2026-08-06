/**
 * The guided on-ramps of the Protocol Strategist workspace, as shareable data.
 *
 * This is the left panel's blank-whiteboard fix — data categories, one-click
 * analytics, and per-mode starter suggestions — moved out of the React
 * components so the web UI (BriefPanel, StrategistWorkspace) and the MCP
 * server (prompts + the get_started/list_analyses tools) stay in lockstep.
 *
 * Pure data only: this module is imported by client components. No fs, no
 * server-only imports.
 */

export type StrategistMode = 'hero' | 'corpus' | 'blank'

/**
 * The corpus's data categories, as checkable boxes. Checking one or more tees
 * up the analytics that relate those categories, so a first-time user browses
 * by what data exists rather than by a flat list of tool names.
 */
export const DATA_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: 'eligibility', label: 'Eligibility & screening' },
  { key: 'procedures', label: 'Procedures & visits' },
  { key: 'enrollment', label: 'Enrollment & timelines' },
  { key: 'sites', label: 'Sites & geography' },
  { key: 'endpoints', label: 'Endpoints & data' },
  { key: 'amendments', label: 'Amendments & cost' },
]

export interface AnalysisEntry {
  /** Stable kebab-case id — doubles as the MCP prompt name. */
  id: string
  label: string
  chart: string
  categories: string[]
  prompt: string
}

/**
 * One-click analytics, each tagged with the data categories it relates. With
 * nothing checked, the single-category starters show; checking categories
 * surfaces the analytics that explore those relationships. Prompts are phrased
 * to steer the model at the matching tool (and its chart) without naming it.
 */
export const ANALYTICS: AnalysisEntry[] = [
  {
    id: 'screening-burden-by-criterion',
    label: 'Screening burden by criterion',
    chart: 'Criteria-burden waterfall',
    categories: ['eligibility'],
    prompt: 'Which criteria in this draft will cost us the most eligible patients?',
  },
  {
    id: 'added-procedure-what-if',
    label: 'Added-procedure what-if',
    chart: 'Sensitivity comparison',
    categories: ['procedures'],
    prompt:
      'If we added a confirmatory screening procedure for our most burdensome eligibility criterion, how would it hit the enrollment timeline? Give me options with tradeoffs.',
  },
  {
    id: 'amendment-risk',
    label: 'Amendment risk',
    chart: 'Amendment-risk view',
    categories: ['amendments'],
    prompt:
      'Before this goes to writing, which elements are most likely to force an amendment, and what would one cost us?',
  },
  {
    id: 'endpoint-timeline-impact',
    label: 'Endpoint timeline impact',
    chart: 'Endpoint timeline chart',
    categories: ['endpoints'],
    prompt:
      'How would adding the candidate secondary endpoints hit data collection and the database-lock timeline?',
  },
  {
    id: 'restrictiveness-vs-screen-failure',
    label: 'Restrictiveness vs screen failure',
    chart: 'Relationship chart',
    categories: ['eligibility', 'enrollment'],
    prompt:
      'How does eligibility restrictiveness relate to screen-fail rate and enrollment duration across comparable trials? Quantify the relationship and chart it.',
  },
  {
    id: 'criteria-vs-enrolled-diversity',
    label: 'Criteria vs enrolled diversity',
    chart: 'Generated chart',
    categories: ['eligibility', 'sites'],
    prompt:
      'How do restrictive eligibility criteria interact with site geography and the enrolled population’s composition in comparable trials? Scope the comparison to one country and chart it.',
  },
  {
    id: 'comparator-landscape',
    label: 'Comparator landscape',
    chart: 'Comparator scatter',
    categories: ['procedures', 'enrollment'],
    prompt:
      'Place this design against comparable trials — is it more burdensome than the trials that enrolled fastest?',
  },
  {
    id: 'slip-drivers-by-site-type',
    label: 'Slip drivers by site type',
    chart: 'Generated site-level chart',
    categories: ['procedures', 'sites'],
    prompt:
      'Which site types would drive enrollment slip if we required additional screening procedures at every site? Break the friction down by site type.',
  },
  {
    id: 'site-mix-vs-enrollment-velocity',
    label: 'Site mix vs enrollment velocity',
    chart: 'Generated chart',
    categories: ['sites', 'enrollment'],
    prompt:
      'Which site types enrolled fastest in comparable trials, and what does the planned site mix imply for our velocity? Chart the comparison.',
  },
  {
    id: 'amendment-cost-vs-timeline',
    label: 'Amendment cost vs timeline',
    chart: 'Generated chart',
    categories: ['amendments', 'enrollment'],
    prompt:
      'When comparable trials amended mid-flight, what did each amendment cost in months and dollars, and how did that hit enrollment timelines? Chart timing against cost.',
  },
  {
    id: 'endpoint-load-vs-database-lock',
    label: 'Endpoint load vs database lock',
    chart: 'Endpoint timeline chart',
    categories: ['endpoints', 'enrollment'],
    prompt:
      'Rank the candidate endpoints by the days they add to database lock, and show which subset protects the readout timeline.',
  },
]

/** Per-mode starter questions shown under the composer (and as MCP prompts). */
export const SUGGESTIONS: Record<StrategistMode, string[]> = {
  hero: [
    'Which criteria in this draft will cost us the most eligible patients?',
    'Medical wants an endoscopy screen to verify GI disease. How does that hit my recruitment timeline?',
    'Before this goes to writing, which elements are most likely to force an amendment?',
  ],
  corpus: [
    'Which criteria in this protocol cost the most eligible patients?',
    'How did this trial actually perform against its peers?',
    'Which elements of this protocol were amended mid-flight, and what did that cost?',
  ],
  blank: [
    'I want to design a Phase 2 trial — what should I decide first, and what does the corpus say about comparable studies?',
    'Which eligibility criteria are standard for trials like mine, and which drive screen failure?',
    'Help me set a realistic target enrollment, duration, and site mix for a new study.',
  ],
}

export const MODE_DESCRIPTIONS: Record<StrategistMode, string> = {
  hero: 'Pressure-test the pre-drafted design brief (Phase 2 NSCLC) — the default document under review.',
  corpus:
    'Load a completed trial from the corpus as the document under review; its actual operational outcomes are known, so predictions can be checked against what happened.',
  blank:
    'Start from a blank page and build a design grounded in what comparable trials in the corpus actually did.',
}

/**
 * The AnalyticsExplorer matching rule, shared with the MCP list_analyses tool.
 * Nothing checked → single-category starters. Checked categories surface exact
 * matches (cross-category first); if no analysis covers the exact combination,
 * anything touching a checked category shows instead of an empty list.
 */
export function matchAnalyses(checked: string[]): AnalysisEntry[] {
  const set = new Set(checked)
  if (set.size === 0) return ANALYTICS.filter((a) => a.categories.length === 1)
  const exact = ANALYTICS.filter((a) => a.categories.every((c) => set.has(c)))
  if (exact.length) return [...exact].sort((a, b) => b.categories.length - a.categories.length)
  return ANALYTICS.filter((a) => a.categories.some((c) => set.has(c)))
}
