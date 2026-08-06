/**
 * Server-side access to the synthetic trial corpus.
 *
 * The corpus ships as JSON under public/data/trial-corpus/. Large tables are
 * columnar ({columns, rows}) to keep them small on the wire; this module
 * expands them lazily and caches per lambda instance.
 *
 * See docs/trial-corpus.md for schema, provenance, and the encoded signal.
 */

import fs from 'fs'
import path from 'path'

import { debrand } from './strategistBrand'

const CORPUS_DIR = path.join(process.cwd(), 'public', 'data', 'trial-corpus')

type Columnar = { columns: string[]; rows: unknown[][]; rowCount: number }

export type Protocol = Record<string, string | number | boolean>
export type Row = Record<string, unknown>

const cache = new Map<string, unknown>()

function readJson<T>(file: string): T {
  const key = `raw:${file}`
  if (!cache.has(key)) {
    // debrand() runs on the raw text so every corpus string a tool result could
    // echo to the model is sanitized at one choke point; files stay untouched.
    cache.set(key, JSON.parse(debrand(fs.readFileSync(path.join(CORPUS_DIR, file), 'utf-8'))))
  }
  return cache.get(key) as T
}

function readTable(file: string): Row[] {
  const key = `table:${file}`
  if (!cache.has(key)) {
    const raw = readJson<Columnar>(file)
    const rows = raw.rows.map((r) => {
      const o: Row = {}
      raw.columns.forEach((c, i) => {
        o[c] = r[i]
      })
      return o
    })
    cache.set(key, rows)
  }
  return cache.get(key) as Row[]
}

export const manifest = () => readJson<Row>('manifest.json')
export const vocabularies = () => readJson<Row>('vocabularies.json')
export const protocols = () => readJson<Protocol[]>('protocols.json')
export const soaGrids = () => readJson<Row[]>('soa_grid.json')
export const eligibility = () => readTable('eligibility.json')
export const sites = () => readTable('sites.json')
export const endpoints = () => readTable('endpoints.json')
export const objectives = () => readTable('objectives.json')
export const amendments = () => readTable('description_of_change.json')
export const prohibitedMeds = () => readTable('prohibited_medications.json')
export const soaEvents = () => readTable('soa_events.json')

// v0.2 sensitivity layer.
export const procedureOperations = () => readTable('procedure_operations.json')
export const assessmentOperations = () => readTable('assessment_operations.json')
export const criterionAttribution = () => readTable('criterion_attribution.json')

export interface DesignBrief {
  brief_id: string
  title: string
  status: string
  /** Set when the brief is a corpus protocol loaded as the document under
   *  review — its measured outcomes are known and should be used over
   *  estimates wherever a chart or analysis places "the draft". */
  source_protocol_id?: string
  therapeutic_area: string
  disease_area: string
  indication: string
  line_of_treatment: string
  phase: string
  comparator_cohort: { therapeutic_area?: string; disease_area?: string; phase?: string[] }
  target_enrollment: number
  planned_sites: number
  site_mix: Record<string, number>
  arms: Array<{ id: string; name: string }>
  randomization: string
  primary_endpoint: { id: string; text: string; assessment: string }
  secondary_endpoints: Array<{ id: string; text: string; assessment: string; status: string }>
  candidate_secondary_endpoints: Array<{ id: string; text: string; assessment: string }>
  criteria: Array<{
    id: string
    type: string
    category: string
    text: string
    corpus_criterion: string
    hero_hook?: boolean
    open_question?: string
  }>
  soa_sketch: string[]
  disclaimer: string
}

export const designBrief = () => readJson<DesignBrief>('design_brief.json')

// ------------------------------------------------- corpus-derived briefs ---

export interface ProtocolIndexEntry {
  protocol_id: string
  indication: string
  therapeutic_area: string
  disease_area: string
  phase: string
  number_of_participants: number
  sites_initiated: number
}

/** Light listing of every corpus protocol, for the picker UI. */
export function protocolIndex(): ProtocolIndexEntry[] {
  const key = 'derived:index'
  if (!cache.has(key)) {
    cache.set(
      key,
      protocols().map((p) => ({
        protocol_id: String(p.protocol_id),
        indication: String(p.indication),
        therapeutic_area: String(p.therapeutic_area),
        disease_area: String(p.disease_area),
        phase: String(p.phase),
        number_of_participants: Number(p.number_of_participants),
        sites_initiated: Number(p.sites_initiated),
      }))
    )
  }
  return cache.get(key) as ProtocolIndexEntry[]
}

const MAX_DERIVED_CRITERIA = 20

/**
 * Build a DesignBrief view of one corpus protocol so the whole sensitivity
 * engine — waterfall, procedure sensitivity, amendment sweep, comparator
 * landscape — runs against it unmodified. The protocol's own eligibility rows
 * join criterion_attribution on std_eligibility_criteria = criterion, and its
 * site rows supply a real site mix (hero mix as fallback when a protocol has
 * no site rows).
 */
export function deriveBriefFromProtocol(protocolId: string): DesignBrief | null {
  const key = `derived:brief:${protocolId}`
  if (cache.has(key)) return cache.get(key) as DesignBrief | null

  const p = protocols().find((x) => String(x.protocol_id) === protocolId)
  if (!p) {
    cache.set(key, null)
    return null
  }
  const match = (r: Row) => String(r.protocol_id) === protocolId
  const ta = String(p.therapeutic_area)

  // Criteria: dedupe by standard name, rank by screen-fail attribution in this
  // TA so the waterfall leads with the criteria that actually cost patients.
  const attribution = new Map(
    criterionAttribution()
      .filter((r) => r.therapeutic_area === ta)
      .map((r) => [String(r.criterion), Number(r.mean_screen_fail_attribution_pct)])
  )
  const seen = new Map<string, Row>()
  for (const r of eligibility().filter(match)) {
    const name = String(r.std_eligibility_criteria)
    if (!seen.has(name)) seen.set(name, r)
  }
  const criteria = Array.from(seen.entries())
    .sort(([a], [b]) => (attribution.get(b) ?? 0) - (attribution.get(a) ?? 0))
    .slice(0, MAX_DERIVED_CRITERIA)
    .map(([name, r], i) => ({
      id: `cri-${protocolId.toLowerCase()}-${i}`,
      type: String(r.criterion_type),
      category: String(r.eligibility_categorization),
      text: name,
      corpus_criterion: name,
    }))

  // Endpoints by tier. Primary first as drafted; a few tertiary rows stand in
  // as "candidates" so endpoint-timeline questions have material to work with.
  const eps = endpoints().filter(match)
  const timeframe = (r: Row) =>
    r.time_value ? `${r.std_endpoint} at ${r.time_value} ${r.time_unit ?? ''}`.trim() : String(r.std_endpoint)
  const primary = eps.find((r) => r.tier === 'Primary')
  const secondary = eps.filter((r) => r.tier === 'Secondary').slice(0, 4)
  const tertiary = eps.filter((r) => r.tier === 'Tertiary').slice(0, 3)

  // Site mix measured from this protocol's own site rows.
  const siteRows = sites().filter(match)
  let siteMix: Record<string, number>
  if (siteRows.length) {
    const counts = new Map<string, number>()
    for (const s of siteRows) {
      const t = String(s.sponsor_site_type)
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
    siteMix = Object.fromEntries(
      Array.from(counts.entries()).map(([t, n]) => [t, round(n / siteRows.length, 3)])
    )
  } else {
    siteMix = designBrief().site_mix
  }

  const arms = String(p.study_arms ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .map((name, i) => ({ id: `arm-${i}`, name }))

  const brief: DesignBrief = {
    brief_id: `${protocolId}-BRIEF`,
    title: `${p.indication} — ${protocolId} (Phase ${p.phase})`,
    status: 'Completed corpus trial, loaded as the document under review',
    source_protocol_id: protocolId,
    therapeutic_area: ta,
    disease_area: String(p.disease_area),
    indication: String(p.indication),
    line_of_treatment: String(p.line_of_treatment ?? 'Not Specified'),
    phase: String(p.phase),
    comparator_cohort: { therapeutic_area: ta, phase: [String(p.phase)] },
    target_enrollment: Number(p.number_of_participants),
    planned_sites: Number(p.sites_initiated),
    site_mix: siteMix,
    arms: arms.length ? arms : [{ id: 'arm-0', name: 'Single arm' }],
    randomization: String(p.randomization_scheme ?? 'Not specified'),
    primary_endpoint: {
      id: `ep-${protocolId.toLowerCase()}-primary`,
      text: primary ? timeframe(primary) : 'Primary endpoint not recorded',
      assessment: primary ? String(primary.std_endpoint) : '',
    },
    secondary_endpoints: secondary.map((r, i) => ({
      id: `ep-${protocolId.toLowerCase()}-sec-${i}`,
      text: timeframe(r),
      assessment: String(r.std_endpoint),
      status: 'included',
    })),
    candidate_secondary_endpoints: tertiary.map((r, i) => ({
      id: `ep-${protocolId.toLowerCase()}-cand-${i}`,
      text: timeframe(r),
      assessment: String(r.std_endpoint),
    })),
    criteria,
    soa_sketch: [
      `${p.total_visit_count} visits · ${p.procedure_count} procedures · treatment ${p.treatment_duration_weeks} weeks`,
      `Screened ${p.subjects_screened} · randomized ${p.subjects_randomized} · screen-fail ${round(Number(p.screen_fail_rate) * 100, 1)}%`,
    ],
    disclaimer:
      'Synthetic corpus protocol rendered as a design brief for demonstration. No real molecule, sponsor, site, or participant.',
  }
  cache.set(key, brief)
  return brief
}

// --------------------------------------------------------------- filtering ---

export interface CohortFilter {
  therapeutic_area?: string
  disease_area?: string
  indication?: string
  phase?: string | string[]
  min_participants?: number
  max_participants?: number
  protocol_ids?: string[]
}

export function selectCohort(f: CohortFilter = {}): Protocol[] {
  const phases = f.phase ? (Array.isArray(f.phase) ? f.phase : [f.phase]) : null
  return protocols().filter((p) => {
    if (f.protocol_ids?.length && !f.protocol_ids.includes(String(p.protocol_id))) return false
    if (f.therapeutic_area && p.therapeutic_area !== f.therapeutic_area) return false
    if (f.disease_area && p.disease_area !== f.disease_area) return false
    if (f.indication && p.indication !== f.indication) return false
    if (phases && !phases.includes(String(p.phase))) return false
    const n = Number(p.number_of_participants)
    if (f.min_participants != null && n < f.min_participants) return false
    if (f.max_participants != null && n > f.max_participants) return false
    return true
  })
}

// -------------------------------------------------------------- statistics ---

export function quantile(values: number[], q: number): number {
  if (!values.length) return NaN
  const s = [...values].sort((a, b) => a - b)
  const pos = (s.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (pos - lo)
}

export function summarize(values: number[]) {
  const v = values.filter((x) => Number.isFinite(x))
  if (!v.length) return null
  return {
    n: v.length,
    min: round(Math.min(...v)),
    p25: round(quantile(v, 0.25)),
    median: round(quantile(v, 0.5)),
    p75: round(quantile(v, 0.75)),
    max: round(Math.max(...v)),
    mean: round(v.reduce((a, b) => a + b, 0) / v.length),
  }
}

/** Where `value` sits within `values`, 0-100. */
export function percentileOf(values: number[], value: number): number {
  const v = values.filter((x) => Number.isFinite(x))
  if (!v.length) return NaN
  return round((v.filter((x) => x < value).length / v.length) * 100)
}

export function round(n: number, dp = 2): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

export function pearson(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length)
  if (n < 3) return NaN
  const ma = a.reduce((x, y) => x + y, 0) / n
  const mb = b.reduce((x, y) => x + y, 0) / n
  let num = 0
  let da = 0
  let db = 0
  for (let i = 0; i < n; i++) {
    num += (a[i] - ma) * (b[i] - mb)
    da += (a[i] - ma) ** 2
    db += (b[i] - mb) ** 2
  }
  const den = Math.sqrt(da * db)
  return den ? round(num / den, 3) : NaN
}

// ------------------------------------------------------- criteria analysis ---

/** Criterion frequency across a cohort, with the outcome spread it tracks. */
export function criteriaFrequency(cohort: Protocol[], criterionType?: 'Inclusion' | 'Exclusion') {
  const ids = new Set(cohort.map((p) => String(p.protocol_id)))
  const byId = new Map(cohort.map((p) => [String(p.protocol_id), p]))
  const rows = eligibility().filter(
    (r) => ids.has(String(r.protocol_id)) && (!criterionType || r.criterion_type === criterionType)
  )

  const groups = new Map<string, { type: string; category: string; protocols: Set<string> }>()
  for (const r of rows) {
    const label = String(r.std_eligibility_criteria)
    if (!groups.has(label)) {
      groups.set(label, {
        type: String(r.criterion_type),
        category: String(r.eligibility_categorization),
        protocols: new Set(),
      })
    }
    groups.get(label)!.protocols.add(String(r.protocol_id))
  }

  return Array.from(groups.entries())
    .map(([criterion, g]) => {
      const carrying = Array.from(g.protocols)
        .map((id) => byId.get(id))
        .filter(Boolean) as Protocol[]
      const without = cohort.filter((p) => !g.protocols.has(String(p.protocol_id)))
      const sf = (ps: Protocol[]) =>
        ps.length ? round((ps.reduce((a, p) => a + Number(p.screen_fail_rate), 0) / ps.length) * 100, 1) : null
      return {
        criterion,
        criterion_type: g.type,
        category: g.category,
        protocols_using: g.protocols.size,
        prevalence_pct: round((g.protocols.size / cohort.length) * 100, 1),
        mean_screen_fail_with_pct: sf(carrying),
        mean_screen_fail_without_pct: sf(without),
      }
    })
    .sort((a, b) => b.protocols_using - a.protocols_using)
}

// ----------------------------------------------------- enrolled population ---

const RACE_COLS = [
  'subjects_race_asian',
  'subjects_race_black',
  'subjects_race_indigenous',
  'subjects_race_white',
  'subjects_race_other',
  'subjects_race_unknown',
]

/**
 * Enrolled-population composition for a cohort, optionally scoped to one
 * country.
 *
 * Scoping matters: across the whole corpus, country mix swamps the criteria
 * effect and the relationship between diversity drag and enrolled composition
 * nearly vanishes. Within a country it is strong. Any analysis that does not
 * stratify by geography will reach the wrong conclusion — see
 * docs/trial-corpus.md.
 */
export function enrolledComposition(cohort: Protocol[], country?: string) {
  const ids = new Set(cohort.map((p) => String(p.protocol_id)))
  const rows = sites().filter(
    (s) => ids.has(String(s.protocol_id)) && (!country || s.country === country)
  )

  const totals: Record<string, number> = {}
  let all = 0
  for (const s of rows) {
    for (const c of RACE_COLS) {
      const v = Number(s[c]) || 0
      totals[c] = (totals[c] || 0) + v
      all += v
    }
  }
  const nonWhite = all - (totals['subjects_race_white'] || 0)

  return {
    country: country ?? 'all countries',
    sites: rows.length,
    participants: all,
    non_white_pct: all ? round((nonWhite / all) * 100, 1) : null,
    breakdown: Object.fromEntries(
      RACE_COLS.map((c) => [
        c.replace('subjects_race_', ''),
        all ? round(((totals[c] || 0) / all) * 100, 1) : 0,
      ])
    ),
  }
}

export function countriesInCohort(cohort: Protocol[]): string[] {
  const ids = new Set(cohort.map((p) => String(p.protocol_id)))
  const set = new Set<string>()
  for (const s of sites()) if (ids.has(String(s.protocol_id))) set.add(String(s.country))
  return Array.from(set).sort()
}

// -------------------------------------------------------- protocol detail ---

export function protocolDetail(protocolId: string) {
  const p = protocols().find((x) => String(x.protocol_id) === protocolId)
  if (!p) return null
  const match = (r: Row) => String(r.protocol_id) === protocolId

  return {
    summary: p,
    schedule: soaGrids().find((g) => String(g.protocol_id) === protocolId) ?? null,
    eligibility: eligibility().filter(match),
    endpoints: endpoints().filter(match),
    objectives: objectives().filter(match),
    amendments: amendments().filter(match),
    prohibited_medications: prohibitedMeds()
      .filter(match)
      .map((r) => r.prohibited_concomitant_meds),
    site_count: sites().filter(match).length,
  }
}

/** Percentile position of one protocol against a comparator cohort. */
export function benchmarkProtocol(protocolId: string, cohort: Protocol[]) {
  const p = protocols().find((x) => String(x.protocol_id) === protocolId)
  if (!p) return null
  const metrics = [
    'restrictiveness_index',
    'burden_index',
    'diversity_drag_index',
    'eligibility_criteria_count',
    'exclusion_criteria_count',
    'procedure_count',
    'total_visit_count',
    'total_procedure_duration_min',
    'screen_fail_rate',
    'dropout_rate',
    'major_amendments',
    'enrollment_duration_months',
  ]
  const peers = cohort.filter((x) => String(x.protocol_id) !== protocolId)

  return {
    protocol_id: protocolId,
    indication: p.indication,
    phase: p.phase,
    comparator_n: peers.length,
    metrics: Object.fromEntries(
      metrics.map((m) => {
        const vals = peers.map((x) => Number(x[m])).filter(Number.isFinite)
        return [
          m,
          {
            value: Number(p[m]),
            percentile: percentileOf(vals, Number(p[m])),
            cohort: summarize(vals),
          },
        ]
      })
    ),
  }
}

/** Corpus-level relationships between design choices and outcomes. */
export function designOutcomeCorrelations(cohort: Protocol[]) {
  const pairs: Array<[string, string]> = [
    ['restrictiveness_index', 'screen_fail_rate'],
    ['restrictiveness_index', 'enrollment_duration_months'],
    ['restrictiveness_index', 'major_amendments'],
    ['burden_index', 'dropout_rate'],
    ['burden_index', 'total_deviations'],
    ['screen_fail_rate', 'enrollment_duration_months'],
  ]
  return pairs.map(([a, b]) => ({
    design_choice: a,
    outcome: b,
    r: pearson(
      cohort.map((p) => Number(p[a])),
      cohort.map((p) => Number(p[b]))
    ),
    n: cohort.length,
  }))
}

// ============================================================ sensitivity ===
//
// The sensitivity engine. Every figure a what-if answer returns has to trace to
// a corpus parameter, not to a number the model invented — that is the line
// between a defensible analysis and a plausible hallucination. So the arithmetic
// lives here, reading procedure_operations, assessment_operations, amendment
// economics, and the comparator cohort. The model's job is to pick scenarios and
// narrate them; it does not do the math.
//
// The coefficients below are the model of how operational friction converts into
// months and patients. They are deliberately simple and named, so a reader can
// see exactly how a slip was built. Synthetic throughout.

const SLIP = {
  screeningLagToMonths: 0.55, // share of the added screening window that shows up as calendar slip
  refusalToDuration: 0.9, // how hard lost screens stretch enrollment duration
  unavailabilityDrag: 0.15, // capacity friction per unit of sites that must refer out
  referralLagPenalty: 0.8, // extra scheduling lag multiplier at sites lacking the procedure in-house
}

function pct(n: number, dp = 1) {
  return round(n * 100, dp)
}

/** Normalised site-mix weights for the brief. */
function mixWeights(brief: DesignBrief): Array<[string, number]> {
  const entries = Object.entries(brief.site_mix)
  const total = entries.reduce((a, [, w]) => a + w, 0) || 1
  return entries.map(([st, w]) => [st, w / total])
}

/** procedure_operations indexed as procedure -> site_type -> row. */
function procedureOpsIndex(): Map<string, Map<string, Row>> {
  const idx = new Map<string, Map<string, Row>>()
  for (const r of procedureOperations()) {
    const name = String(r.procedure_name)
    if (!idx.has(name)) idx.set(name, new Map())
    idx.get(name)!.set(String(r.site_type), r)
  }
  return idx
}

/**
 * Baseline enrollment for the brief, taken from the comparator cohort rather
 * than assumed: the median enrollment duration of like trials, and the implied
 * monthly rate needed to hit the brief's target N.
 */
export function baselineEnrollment(brief: DesignBrief) {
  const cohort = selectCohort({
    therapeutic_area: brief.comparator_cohort.therapeutic_area,
    disease_area: brief.comparator_cohort.disease_area,
    phase: brief.comparator_cohort.phase,
  })
  const durations = cohort.map((p) => Number(p.enrollment_duration_months)).filter(Number.isFinite)
  const screenFails = cohort.map((p) => Number(p.screen_fail_rate)).filter(Number.isFinite)
  const months = durations.length ? quantile(durations, 0.5) : 14
  const screenFail = screenFails.length ? quantile(screenFails, 0.5) : 0.35
  return {
    comparator_n: cohort.length,
    baseline_enrollment_months: round(months, 1),
    cohort_median_screen_fail_pct: pct(screenFail),
    monthly_enrollment_rate: round(brief.target_enrollment / Math.max(1, months), 1),
    screened_estimate: Math.round(brief.target_enrollment / Math.max(0.2, 1 - screenFail)),
  }
}

/**
 * Criteria-burden waterfall (UC1). Each of the brief's criteria carries the mean
 * screen-fail attribution measured across comparator protocols that use it — an
 * additive share of the eligible population lost. Ordered largest first, with a
 * running cumulative, so "our pool shrinks X% before we screen anyone, and two
 * criteria do most of the damage" reads straight off the data.
 */
export function criteriaWaterfall(brief: DesignBrief) {
  const ta = brief.comparator_cohort.therapeutic_area ?? brief.therapeutic_area
  const attr = criterionAttribution().filter((r) => r.therapeutic_area === ta)
  const byName = new Map(attr.map((r) => [String(r.criterion), r]))

  const items = brief.criteria.map((c) => {
    const row = byName.get(c.corpus_criterion)
    const attribution = row ? Number(row.mean_screen_fail_attribution_pct) : 0
    return {
      element_id: c.id,
      criterion: c.text,
      corpus_criterion: c.corpus_criterion,
      criterion_type: c.type,
      category: c.category,
      screen_fail_attribution_pct: round(attribution, 2),
      protocols_evidencing: row ? Number(row.protocols_using) : 0,
      hero_hook: Boolean(c.hero_hook),
    }
  })
  items.sort((a, b) => b.screen_fail_attribution_pct - a.screen_fail_attribution_pct)

  const total = items.reduce((a, it) => a + it.screen_fail_attribution_pct, 0)
  let cumulative = 0
  const withShare = items.map((it) => {
    cumulative += it.screen_fail_attribution_pct
    return {
      ...it,
      // Each criterion's share of the burden carried by the draft's own criteria,
      // so the waterfall reads as "which of our criteria dominate".
      share_of_draft_burden_pct: total ? round((it.screen_fail_attribution_pct / total) * 100, 1) : 0,
      cumulative_pct: round(cumulative, 2),
    }
  })
  const topTwo = withShare.slice(0, 2).reduce((a, it) => a + it.screen_fail_attribution_pct, 0)

  return {
    brief_id: brief.brief_id,
    total_attributable_screen_fail_pct: round(total, 2),
    top_two_share_pct: total ? pct(topTwo / total) : 0,
    lead_criterion: withShare[0]?.corpus_criterion ?? null,
    criteria: withShare,
    note: 'Each criterion carries the mean screen-fail attribution measured across comparator protocols that use it; share_of_draft_burden_pct is its slice of the burden across the draft\'s own criteria. Association across protocols, not an isolated causal effect.',
  }
}

export type SensitivityMode = 'required_all' | 'accepted_where_available' | 'accepted_prior'

export interface SensitivityScenario {
  key: string
  label: string
  procedure: string
  mode: SensitivityMode
  alt_procedure?: string
  note?: string
}

/** Per-site-type operational effect of one scenario, before weighting. */
function scenarioPerSite(
  scn: SensitivityScenario,
  idx: Map<string, Map<string, Row>>,
  siteType: string
) {
  const prim = idx.get(scn.procedure)?.get(siteType)
  if (!prim) return null
  const lagP = Number(prim.scheduling_lag_days)
  const refP = Number(prim.patient_refusal_rate)
  const availP = Number(prim.in_house_availability_pct)
  const costP = Number(prim.unit_cost_usd)

  if (scn.mode === 'required_all') {
    // Required everywhere; sites without it in-house refer out, paying a lag and
    // cost penalty proportional to how far availability falls short.
    const shortfall = 1 - availP
    return {
      coverage: 1,
      lag: lagP * (1 + shortfall * SLIP.referralLagPenalty),
      refusal: refP,
      cost: costP * (1 + shortfall * 0.15),
      in_house_availability_pct: pct(availP),
    }
  }

  // accepted_where_available / accepted_prior: an alternative applies where it is
  // available; elsewhere the primary (heavier) procedure is the fallback.
  const altName = scn.alt_procedure ?? scn.procedure
  const alt = idx.get(altName)?.get(siteType) ?? prim
  const cov = Number(alt.in_house_availability_pct)
  const lagA = Number(alt.scheduling_lag_days)
  const refA = Number(alt.patient_refusal_rate)
  const costA = Number(alt.unit_cost_usd)
  return {
    coverage: cov,
    lag: cov * lagA + (1 - cov) * lagP,
    refusal: cov * refA + (1 - cov) * refP,
    cost: cov * costA + (1 - cov) * costP,
    in_house_availability_pct: pct(cov),
  }
}

/**
 * Turn one scenario into an operational verdict for the brief: weighted
 * scheduling lag, screen-refusal, site coverage, incremental cost, and the
 * enrollment slip it implies — in months and patients.
 */
export function evaluateScenario(brief: DesignBrief, scn: SensitivityScenario) {
  const idx = procedureOpsIndex()
  const base = baselineEnrollment(brief)
  const weights = mixWeights(brief)

  let wLag = 0
  let wRef = 0
  let wCost = 0
  let wCov = 0
  const bySite: Array<Record<string, unknown>> = []
  for (const [st, w] of weights) {
    const eff = scenarioPerSite(scn, idx, st)
    if (!eff) continue
    wLag += w * eff.lag
    wRef += w * eff.refusal
    wCost += w * eff.cost
    wCov += w * eff.coverage
    bySite.push({
      site_type: st,
      mix_pct: pct(w),
      scheduling_lag_days: round(eff.lag, 1),
      screen_refusal_pct: pct(eff.refusal),
      site_coverage_pct: eff.in_house_availability_pct,
    })
  }

  const unavailDrag = (1 - wCov) * SLIP.unavailabilityDrag
  const effectiveLoss = wRef + unavailDrag
  const slipMonths =
    (wLag / 30.4) * SLIP.screeningLagToMonths +
    base.baseline_enrollment_months * effectiveLoss * SLIP.refusalToDuration
  const patientsAtRisk = Math.round(brief.target_enrollment * effectiveLoss)
  const incrementalCost = Math.round((wCost * base.screened_estimate) / 1000) * 1000

  // Name the driver: which site type contributes the most slip.
  const worst = [...bySite].sort(
    (a, b) => Number(b.scheduling_lag_days) - Number(a.scheduling_lag_days)
  )[0]

  return {
    key: scn.key,
    label: scn.label,
    procedure: scn.procedure,
    alt_procedure: scn.alt_procedure ?? null,
    weighted_scheduling_lag_days: round(wLag, 1),
    screen_refusal_pct: pct(wRef),
    site_coverage_pct: pct(wCov),
    enrollment_slip_months: round(slipMonths, 1),
    patients_at_risk: patientsAtRisk,
    incremental_cost_usd: incrementalCost,
    per_patient_cost_usd: Math.round(wCost),
    by_site_type: bySite,
    primary_driver: worst
      ? `${worst.site_type}: ${worst.scheduling_lag_days} day scheduling lag, ${worst.site_coverage_pct}% in-house coverage`
      : null,
    note: scn.note ?? null,
  }
}

export function procedureSensitivity(brief: DesignBrief, scenarios: SensitivityScenario[]) {
  const base = baselineEnrollment(brief)
  return {
    brief_id: brief.brief_id,
    baseline: base,
    scenarios: scenarios.map((s) => evaluateScenario(brief, s)),
    note: 'Slip and patient figures compose from procedure_operations against the brief site mix and the comparator baseline. Synthetic; illustrative of mechanism.',
  }
}

/**
 * Endpoint timeline sensitivity (UC3). Maps candidate secondary endpoints to
 * their assessment burden and the time-to-database-lock they add, then returns
 * options: add all, a timeline-protecting subset, or defer to exploratory.
 */
export function endpointSensitivity(brief: DesignBrief, assessmentNames: string[]) {
  const ops = new Map(assessmentOperations().map((r) => [String(r.assessment_name), r]))
  const items = assessmentNames.map((name) => {
    const r = ops.get(name)
    return {
      assessment: name,
      endpoint_domain: r ? String(r.endpoint_domain) : 'Unknown',
      crf_data_points: r ? Number(r.crf_data_points) : 0,
      site_entry_minutes: r ? Number(r.site_entry_minutes) : 0,
      query_resolution_lag_days: r ? Number(r.query_resolution_lag_days) : 0,
      db_lock_contribution_days: r ? Number(r.db_lock_contribution_days) : 0,
      operational_requirement: r ? String(r.operational_requirement) : '',
      resolved: Boolean(r),
    }
  })

  const totalLock = items.reduce((a, it) => a + it.db_lock_contribution_days, 0)
  const ranked = [...items].sort((a, b) => a.db_lock_contribution_days - b.db_lock_contribution_days)
  // Timeline-protecting subset: keep endpoints until the added lock crosses a
  // three-week budget, defer the rest.
  const budgetDays = 21
  const subset: typeof items = []
  let acc = 0
  for (const it of ranked) {
    if (acc + it.db_lock_contribution_days <= budgetDays) {
      subset.push(it)
      acc += it.db_lock_contribution_days
    }
  }
  const deferred = items.filter((it) => !subset.includes(it))

  return {
    brief_id: brief.brief_id,
    per_endpoint: items,
    options: [
      {
        key: 'all',
        label: 'Add all proposed secondary endpoints',
        endpoints: items.map((i) => i.assessment),
        added_db_lock_days: round(totalLock, 0),
        tradeoff: 'Maximum evidence; largest hit to database-lock timeline and site data-entry load.',
      },
      {
        key: 'subset',
        label: 'Prioritised subset that protects the lock timeline',
        endpoints: subset.map((i) => i.assessment),
        added_db_lock_days: round(acc, 0),
        tradeoff: `Keeps the added lock under a ${budgetDays}-day budget; defers the heaviest endpoints.`,
      },
      {
        key: 'defer',
        label: 'Defer to exploratory / optional collection',
        endpoints: deferred.map((i) => i.assessment),
        added_db_lock_days: round(totalLock - acc, 0),
        tradeoff: 'Protects the primary timeline fully; loses powered secondary evidence.',
      },
    ],
    note: 'db_lock_contribution_days from assessment_operations, additive at the margin. Synthetic.',
  }
}

/**
 * Amendment-risk sweep (UC6). Which protocol element types get amended in the
 * comparator indication, how often, when (months from FPI), and at what cost —
 * then flags the brief's element categories against that history.
 */
export function amendmentRiskSweep(brief: DesignBrief) {
  const cohort = selectCohort({
    therapeutic_area: brief.comparator_cohort.therapeutic_area,
    phase: brief.comparator_cohort.phase,
  })
  const ids = new Set(cohort.map((p) => String(p.protocol_id)))
  const rows = amendments().filter((r) => ids.has(String(r.protocol_id)))

  const groups = new Map<
    string,
    { protocols: Set<string>; count: number; months: number[]; costs: number[] }
  >()
  for (const r of rows) {
    const type = String(r['description_of_change[].amendment_type'])
    if (!groups.has(type)) groups.set(type, { protocols: new Set(), count: 0, months: [], costs: [] })
    const g = groups.get(type)!
    g.protocols.add(String(r.protocol_id))
    g.count += 1
    g.months.push(Number(r.timing_months_from_fpi))
    g.costs.push(Number(r.cost_estimate_usd))
  }

  const cohortN = cohort.length || 1
  const byType = Array.from(groups.entries())
    .map(([type, g]) => ({
      amendment_type: type,
      protocols_affected: g.protocols.size,
      pct_of_cohort: pct(g.protocols.size / cohortN),
      amendment_count: g.count,
      median_timing_months_from_fpi: round(quantile(g.months.filter(Number.isFinite), 0.5), 1),
      median_cost_usd: Math.round(quantile(g.costs.filter(Number.isFinite), 0.5)),
    }))
    .sort((a, b) => b.protocols_affected - a.protocols_affected)

  // Map brief element categories to the amendment types that touch them.
  const elementFlags = [
    { element: 'Eligibility criteria', types: ['Eligibility Criteria Change'] },
    { element: 'Schedule of assessments', types: ['Schedule of Assessments Change'] },
    { element: 'Endpoints', types: ['Endpoint Change'] },
    { element: 'Dosing regimen', types: ['Dosing Regimen Change'] },
    { element: 'Statistical analysis', types: ['Statistical Analysis Change', 'Statistical Analysis Plan Change'] },
  ].map((e) => {
    const matched = byType.filter((t) => e.types.includes(t.amendment_type))
    const affected = matched.reduce((a, t) => a + t.protocols_affected, 0)
    return {
      element: e.element,
      pct_of_cohort_amended: matched.length ? pct(affected / cohortN) : 0,
      median_timing_months_from_fpi: matched.length ? matched[0].median_timing_months_from_fpi : null,
      median_cost_usd: matched.length ? matched[0].median_cost_usd : null,
    }
  }).sort((a, b) => b.pct_of_cohort_amended - a.pct_of_cohort_amended)

  return {
    brief_id: brief.brief_id,
    comparator_n: cohort.length,
    amendment_types: byType,
    brief_element_risk: elementFlags,
    note: 'Amendment history for comparator protocols. Timing is months from first-patient-in; cost is a synthetic ~$500K-scale estimate.',
  }
}

/**
 * Comparator landscape (fixed chart 3). Assessment burden vs enrollment velocity
 * across the comparator cohort, with the document under review highlighted.
 *
 * When the document is a corpus protocol that actually ran, its position is its
 * measured burden and velocity — the same figures benchmark_protocol reports —
 * and it is excluded from the comparator dots so it is not plotted twice. Only
 * an unbuilt draft (the hero brief) gets the estimated position.
 */
export function comparatorLandscape(brief: DesignBrief) {
  const cohort = selectCohort({
    therapeutic_area: brief.comparator_cohort.therapeutic_area,
    phase: brief.comparator_cohort.phase,
  })
  const source = brief.source_protocol_id
    ? protocols().find((p) => String(p.protocol_id) === brief.source_protocol_id)
    : undefined
  const points = cohort
    .filter((p) => String(p.protocol_id) !== brief.source_protocol_id)
    .map((p) => {
      const months = Number(p.enrollment_duration_months)
      const n = Number(p.number_of_participants)
      const burden = Number(p.burden_index)
      if (!Number.isFinite(months) || !Number.isFinite(burden) || months <= 0) return null
      return {
        protocol_id: String(p.protocol_id),
        burden_index: round(burden, 1),
        enrollment_velocity: round(n / months, 1), // participants / month
        indication: String(p.indication),
      }
    })
    .filter(Boolean) as Array<Record<string, unknown>>

  const srcBurden = source ? Number(source.burden_index) : NaN
  const srcMonths = source ? Number(source.enrollment_duration_months) : NaN
  const measured = Number.isFinite(srcBurden) && Number.isFinite(srcMonths) && srcMonths > 0

  let draft: { burden_index: number; enrollment_velocity: number; estimated: boolean }
  if (measured) {
    draft = {
      burden_index: round(srcBurden, 1),
      enrollment_velocity: round(Number(source!.number_of_participants) / srcMonths, 1),
      estimated: false,
    }
  } else {
    const burdens = cohort.map((p) => Number(p.burden_index)).filter(Number.isFinite)
    const base = baselineEnrollment(brief)
    draft = {
      burden_index: round(quantile(burdens, 0.7), 1), // estimated — the draft is not yet built
      enrollment_velocity: round(brief.target_enrollment / base.baseline_enrollment_months, 1),
      estimated: true,
    }
  }

  return {
    brief_id: brief.brief_id,
    comparator_n: points.length,
    points,
    draft,
    note: measured
      ? 'The highlighted position is the loaded protocol\'s measured burden index and enrollment velocity (participants / enrollment month); it is excluded from the comparator dots.'
      : 'The draft position is estimated (70th-percentile burden of the comparator cohort at the brief\'s implied velocity), not measured — the design is not yet built.',
  }
}

// ==================================================================== cost ===
//
// Trial cost buildup (UC — "what will this study cost?"). The most-asked
// question in the interviews and the one the tools did not answer: a per-patient
// cost linked to the schedule of assessments, split into direct and indirect,
// rolled to a total — and run as a sensitivity so the team sees a range, not a
// single number that governance will later blow through.
//
// Every dollar traces to a corpus parameter: per-procedure unit costs from
// procedure_operations (weighted by the brief's site mix), per-assessment
// data-management minutes from assessment_operations, and the comparator
// cohort's own SoA intensity (procedures and visits per patient). The
// coefficients below convert operational effort into dollars and are named so a
// reader can see exactly how a figure was built. Synthetic throughout.

const COST = {
  craHourlyUsd: 145, // loaded cost of monitoring / data-management labour
  perVisitOverheadUsd: 380, // site coordinator + facility time per patient visit
  siteActivationUsd: 42000, // one-time startup per activated site (regulatory, contracting, IMV)
  siteMaintenanceUsdPerMonth: 5200, // ongoing site management per active site per month
}

/** Site-mix-weighted mean unit cost of one procedure, from procedure_operations. */
function blendedProcedureCost(brief: DesignBrief): number {
  const weights = mixWeights(brief)
  // Mean unit cost across all procedures, per site type.
  const sumBySite = new Map<string, number>()
  const countBySite = new Map<string, number>()
  for (const r of procedureOperations()) {
    const st = String(r.site_type)
    sumBySite.set(st, (sumBySite.get(st) ?? 0) + Number(r.unit_cost_usd))
    countBySite.set(st, (countBySite.get(st) ?? 0) + 1)
  }
  let blended = 0
  let wsum = 0
  for (const [st, w] of weights) {
    const sum = sumBySite.get(st)
    const count = countBySite.get(st)
    if (sum == null || !count) continue
    blended += w * (sum / count)
    wsum += w
  }
  return wsum ? blended / wsum : 0
}

/** Per-patient data-management cost from the assessment operations table. */
function dataManagementPerPatient(): number {
  const rows = assessmentOperations()
  if (!rows.length) return 0
  const minutes = rows.reduce(
    (a, r) => a + Number(r.site_entry_minutes) + Number(r.monitoring_minutes),
    0
  )
  return (minutes / 60) * COST.craHourlyUsd
}

/**
 * Cost buildup for the brief at three SoA intensities, drawn from the
 * comparator cohort's own distribution of procedures and visits per patient.
 * "As drafted" is the cohort median; "lean" and "rich" are the p25 and p75, so
 * the range is grounded in what comparable trials actually ran rather than
 * assumed. Direct = per-patient procedures + visit overhead; indirect = data
 * management, site activation, and site maintenance over the enrollment window.
 */
export function trialCostModel(brief: DesignBrief) {
  const cohort = selectCohort({
    therapeutic_area: brief.comparator_cohort.therapeutic_area,
    phase: brief.comparator_cohort.phase,
  })
  const procCounts = cohort.map((p) => Number(p.procedure_count)).filter(Number.isFinite)
  const visitCounts = cohort.map((p) => Number(p.total_visit_count)).filter(Number.isFinite)
  const perProcedure = blendedProcedureCost(brief)
  const dataMgmt = dataManagementPerPatient()
  const base = baselineEnrollment(brief)
  const n = brief.target_enrollment
  const sites = brief.planned_sites || 1
  const months = base.baseline_enrollment_months

  // Indirect that does not scale with SoA intensity: activation once per site,
  // maintenance per site across the enrollment window. Spread over N per-patient.
  const activation = sites * COST.siteActivationUsd
  const maintenance = sites * COST.siteMaintenanceUsdPerMonth * months
  const sitePerPatient = n ? (activation + maintenance) / n : 0

  const intensity: Array<{ key: string; label: string; q: number; note: string }> = [
    { key: 'lean', label: 'Lean SoA (p25 procedures)', q: 0.25, note: 'Trimmed schedule — fewer procedures per visit than the typical comparator.' },
    { key: 'drafted', label: 'As drafted (cohort median)', q: 0.5, note: 'Procedure and visit load at the comparator-cohort median.' },
    { key: 'rich', label: 'Rich SoA (p75 procedures)', q: 0.75, note: 'Heavier schedule — more confirmatory and exploratory assessments.' },
  ]

  const scenarios = intensity.map((it) => {
    const procs = procCounts.length ? Math.round(quantile(procCounts, it.q)) : 0
    const visits = visitCounts.length ? Math.round(quantile(visitCounts, it.q)) : 0
    const procedureCost = procs * perProcedure
    const visitOverhead = visits * COST.perVisitOverheadUsd
    const directPerPatient = procedureCost + visitOverhead
    const indirectPerPatient = dataMgmt + sitePerPatient
    const perPatient = directPerPatient + indirectPerPatient
    return {
      key: it.key,
      label: it.label,
      procedures_per_patient: procs,
      visits_per_patient: visits,
      direct_per_patient_usd: Math.round(directPerPatient),
      indirect_per_patient_usd: Math.round(indirectPerPatient),
      per_patient_usd: Math.round(perPatient),
      direct_total_usd: Math.round(directPerPatient * n),
      indirect_total_usd: Math.round(indirectPerPatient * n),
      total_study_cost_usd: Math.round(perPatient * n),
      note: it.note,
    }
  })

  const drafted = scenarios.find((s) => s.key === 'drafted') ?? scenarios[0]
  return {
    brief_id: brief.brief_id,
    target_enrollment: n,
    planned_sites: sites,
    enrollment_window_months: months,
    comparator_n: cohort.length,
    cost_drivers: {
      blended_procedure_cost_usd: Math.round(perProcedure),
      data_management_per_patient_usd: Math.round(dataMgmt),
      site_activation_usd_each: COST.siteActivationUsd,
      site_maintenance_usd_per_month: COST.siteMaintenanceUsdPerMonth,
      per_visit_overhead_usd: COST.perVisitOverheadUsd,
    },
    headline: {
      per_patient_usd: drafted.per_patient_usd,
      total_study_cost_usd: drafted.total_study_cost_usd,
      direct_share_pct: drafted.total_study_cost_usd
        ? pct(drafted.direct_total_usd / drafted.total_study_cost_usd)
        : 0,
    },
    scenarios,
    note: 'Per-patient direct cost from procedure_operations unit costs (site-mix weighted) × the comparator SoA intensity, plus per-visit overhead; indirect from assessment data-management minutes and per-site activation/maintenance over the enrollment window. Synthetic ~fair-market scaffolding — illustrative of the buildup, not a quote.',
  }
}

// ================================================================ footprint ===
//
// Site-and-country footprint (UC — "where should I run this, and how many
// sites?"). The other headline question the tools did not answer. Given a target
// N, a site count, and regulatory region floors (e.g. ≥20% US enrollment), it
// allocates sites across the countries the corpus actually carries, using each
// country's measured per-site enrollment rate and startup time, and estimates
// months-to-target. Run as a site-count sensitivity so the team sees how the
// recruit timeline and activation cost move as they add or cut sites.

/** Region grouping for the countries present in the corpus. */
const COUNTRY_REGION: Record<string, string> = {
  'United States': 'North America',
  Canada: 'North America',
  Germany: 'Europe',
  Poland: 'Europe',
  Spain: 'Europe',
  'United Kingdom': 'Europe',
  Hungary: 'Europe',
  Czechia: 'Europe',
  'South Korea': 'Asia-Pacific',
  Japan: 'Asia-Pacific',
  Australia: 'Asia-Pacific',
  Brazil: 'Latin America',
}

interface CountryOps {
  country: string
  region: string
  sites_observed: number
  subjects_per_site: number
  mean_startup_days: number
}

/** Per-country enrollment rate and startup, measured across the cohort's sites. */
function countryOperations(cohort: Protocol[]): CountryOps[] {
  const ids = new Set(cohort.map((p) => String(p.protocol_id)))
  let rows = sites().filter((s) => ids.has(String(s.protocol_id)))
  // Fall back to the whole corpus when the cohort is too thin to be stable.
  if (rows.length < 200) rows = sites()

  const agg = new Map<string, { sites: number; subjects: number; startup: number[] }>()
  for (const s of rows) {
    const c = String(s.country || 'Unknown')
    if (!agg.has(c)) agg.set(c, { sites: 0, subjects: 0, startup: [] })
    const g = agg.get(c)!
    g.sites += 1
    g.subjects += Number(s.subjects_randomized_treated) || 0
    const st = Number(s.startup_days)
    if (Number.isFinite(st)) g.startup.push(st)
  }
  return Array.from(agg.entries())
    .filter(([c]) => c !== 'Unknown')
    .map(([country, g]) => ({
      country,
      region: COUNTRY_REGION[country] ?? 'Other',
      sites_observed: g.sites,
      subjects_per_site: round(g.subjects / Math.max(1, g.sites), 1),
      mean_startup_days: Math.round(g.startup.length ? quantile(g.startup, 0.5) : 90),
    }))
    .sort((a, b) => b.subjects_per_site - a.subjects_per_site)
}

/** Months to reach N with `siteCount` sites enrolling in parallel. */
function monthsToTarget(
  n: number,
  siteCount: number,
  subjectsPerSitePerMonth: number,
  meanStartupDays: number
): number {
  const rate = Math.max(0.1, siteCount * subjectsPerSitePerMonth)
  return round(meanStartupDays / 30.4 + n / rate, 1)
}

export interface FootprintOptions {
  /** Region enrollment floors, e.g. { "North America": 0.2 }. */
  region_floors?: Record<string, number>
  /** Countries to restrict to (domestic-only scenarios). */
  restrict_countries?: string[]
}

/**
 * Recommend a country/site allocation for the brief and price the site-count
 * sensitivity. The recommendation satisfies the region floors first (so a US
 * regulatory target is met), then fills remaining capacity with the
 * fastest-enrolling countries. Scenarios sweep site count — lean, planned,
 * aggressive — reporting recruit timeline and activation cost for each.
 */
export function siteFootprint(brief: DesignBrief, opts: FootprintOptions = {}) {
  const cohort = selectCohort({
    therapeutic_area: brief.comparator_cohort.therapeutic_area,
    phase: brief.comparator_cohort.phase,
  })
  let ops = countryOperations(cohort)
  if (opts.restrict_countries?.length) {
    const keep = new Set(opts.restrict_countries)
    ops = ops.filter((o) => keep.has(o.country))
  }
  if (!ops.length) {
    return { brief_id: brief.brief_id, error: 'No site operations data for the requested countries.' }
  }

  const n = brief.target_enrollment
  const planned = brief.planned_sites || Math.max(ops.length, 12)
  // Corpus enrollment window sets a per-site monthly rate for each country.
  const base = baselineEnrollment(brief)
  const windowMonths = Math.max(1, base.baseline_enrollment_months)
  const perSitePerMonth = (o: CountryOps) => o.subjects_per_site / windowMonths

  const floors = opts.region_floors ?? { 'North America': 0.2 }

  // --- Recommended allocation at the planned site count ---------------------
  const allocate = (siteCount: number) => {
    const alloc = new Map<string, number>() // country -> sites
    let remaining = siteCount

    // Meet region floors first: enough subjects from the region to clear the
    // floor, converted to sites via that region's best per-site rate.
    for (const [region, floor] of Object.entries(floors)) {
      const inRegion = ops.filter((o) => o.region === region)
      if (!inRegion.length) continue
      const subjectsNeeded = n * floor
      const best = inRegion[0] // highest subjects_per_site
      const sitesNeeded = Math.min(
        remaining,
        Math.max(1, Math.ceil(subjectsNeeded / Math.max(1, best.subjects_per_site)))
      )
      alloc.set(best.country, (alloc.get(best.country) ?? 0) + sitesNeeded)
      remaining -= sitesNeeded
    }
    // Fill the rest with the fastest enrollers overall.
    let i = 0
    while (remaining > 0 && ops.length) {
      const o = ops[i % ops.length]
      alloc.set(o.country, (alloc.get(o.country) ?? 0) + 1)
      remaining -= 1
      i += 1
    }
    return alloc
  }

  const allocationTable = (siteCount: number) => {
    const alloc = allocate(siteCount)
    const opByCountry = new Map(ops.map((o) => [o.country, o]))
    const rows = Array.from(alloc.entries())
      .map(([country, s]) => {
        const o = opByCountry.get(country)!
        const subjects = Math.round(s * o.subjects_per_site)
        return {
          country,
          region: o.region,
          sites: s,
          expected_subjects: subjects,
          mean_startup_days: o.mean_startup_days,
        }
      })
      .sort((a, b) => b.expected_subjects - a.expected_subjects)
    const totalSubjects = rows.reduce((a, r) => a + r.expected_subjects, 0) || 1
    return rows.map((r) => ({ ...r, share_of_enrollment_pct: pct(r.expected_subjects / totalSubjects) }))
  }

  // Blended per-site monthly rate and startup across the recommended mix, for
  // the timeline estimate.
  const blendedRate =
    ops.reduce((a, o) => a + perSitePerMonth(o), 0) / ops.length
  const blendedStartup = Math.round(
    ops.reduce((a, o) => a + o.mean_startup_days, 0) / ops.length
  )

  const scenarioCounts = [
    { key: 'lean', label: 'Lean footprint', sites: Math.max(4, Math.round(planned * 0.6)) },
    { key: 'planned', label: 'Planned footprint', sites: planned },
    { key: 'aggressive', label: 'Aggressive footprint', sites: Math.round(planned * 1.6) },
  ]
  const scenarios = scenarioCounts.map((sc) => ({
    key: sc.key,
    label: sc.label,
    sites: sc.sites,
    enrollment_months: monthsToTarget(n, sc.sites, blendedRate, blendedStartup),
    activation_cost_usd: sc.sites * COST.siteActivationUsd,
    countries: allocationTable(sc.sites).length,
  }))

  return {
    brief_id: brief.brief_id,
    target_enrollment: n,
    comparator_n: cohort.length,
    region_floors: floors,
    countries_available: ops.map((o) => o.country),
    country_operations: ops,
    recommended_allocation: allocationTable(planned),
    scenarios,
    note: 'Per-site enrollment rate and startup measured from the cohort site table; allocation meets region floors first, then fills with the fastest-enrolling countries. The corpus carries 12 countries — China is not among them, so a China floor cannot be grounded here. Synthetic; illustrative of the mechanism.',
  }
}
