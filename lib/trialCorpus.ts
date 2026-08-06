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

const CORPUS_DIR = path.join(process.cwd(), 'public', 'data', 'trial-corpus')

type Columnar = { columns: string[]; rows: unknown[][]; rowCount: number }

export type Protocol = Record<string, string | number | boolean>
export type Row = Record<string, unknown>

const cache = new Map<string, unknown>()

function readJson<T>(file: string): T {
  const key = `raw:${file}`
  if (!cache.has(key)) {
    cache.set(key, JSON.parse(fs.readFileSync(path.join(CORPUS_DIR, file), 'utf-8')))
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
