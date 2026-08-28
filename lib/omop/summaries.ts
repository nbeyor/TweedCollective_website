/**
 * Fixed RWD summary functions over the OMOP demo dataset (module PRD §6).
 *
 * Deterministic, callable by ID; no free-form queries. Each function takes a
 * predefined cohort, a registered endpoint where applicable, and bounded
 * window parameters, and returns descriptive statistics with a provenance
 * block naming the source cohort, windows, estimate date, and uncertainty —
 * so an RWD-derived value can pre-populate (never silently determine) a
 * trial-design input downstream.
 */

import { DAYS_PER_MONTH, deathDays, observationPeriods, omopManifest, persons, rowsBy, conceptNames, colIdx, omopTable } from './dataset'
import { materializeCohort, type MaterializedCohort } from './cohorts'

export const RWD_SERVICE_VERSION = '1.0.0'

// Concept ids mirrored from pipeline/generate_omop_dataset.py (TWEED-DEMO vocabulary).
const CONCEPT = {
  male: 2001000001,
  female: 2001000002,
  nsclc_progression: 2001000102,
  hf_decompensation: 2001000112,
  asthma_exacerbation: 2001000123,
  ct_chest: 2001000301,
  ntprobnp: 2001000411,
  lvef: 2001000412,
  fev1_pct: 2001000421,
  eos_count: 2001000422,
  hemoglobin: 2001000401,
  creatinine: 2001000402,
  albumin: 2001000403,
} as const

// ------------------------------------------------------- endpoint registry ---

export type EndpointKind = 'binary' | 'continuous' | 'time_to_event'

export interface EndpointDef {
  endpoint_id: string
  kind: EndpointKind
  label: string
  /** How the endpoint resolves against OMOP rows — shown to the caller. */
  definition: string
  /** Condition concepts that count as events (binary / TTE). */
  event_concepts?: number[]
  /** Whether death counts as an event (composite / survival endpoints). */
  death_is_event?: boolean
  /** Measurement concept (continuous endpoints). */
  measurement_concept?: number
  unit?: string
  /** Cohort definition ids the endpoint is meaningful for (empty = any). */
  cohorts?: number[]
}

export const ENDPOINTS: EndpointDef[] = [
  {
    endpoint_id: 'overall_survival',
    kind: 'time_to_event',
    label: 'Overall survival',
    definition: 'Time from cohort index to DEATH; censored at observation period end.',
    death_is_event: true,
    event_concepts: [],
  },
  {
    endpoint_id: 'progression_free_survival',
    kind: 'time_to_event',
    label: 'Progression-free survival (RWD proxy)',
    definition:
      'Time from cohort index to first malignant-progression CONDITION_OCCURRENCE or death; censored at observation period end.',
    event_concepts: [CONCEPT.nsclc_progression],
    death_is_event: true,
    cohorts: [101, 102, 103],
  },
  {
    endpoint_id: 'time_to_first_hf_hospitalization',
    kind: 'time_to_event',
    label: 'Time to first HF hospitalization',
    definition:
      'Time from cohort index to first acute-decompensation CONDITION_OCCURRENCE on an inpatient visit; censored at death or observation end.',
    event_concepts: [CONCEPT.hf_decompensation],
    cohorts: [201],
  },
  {
    endpoint_id: 'time_to_first_exacerbation',
    kind: 'time_to_event',
    label: 'Time to first asthma exacerbation',
    definition: 'Time from cohort index to first exacerbation CONDITION_OCCURRENCE; censored at observation end.',
    event_concepts: [CONCEPT.asthma_exacerbation],
    cohorts: [301, 302],
  },
  {
    endpoint_id: 'death_within_followup',
    kind: 'binary',
    label: 'All-cause mortality within follow-up window',
    definition: 'DEATH within followup_months of index, among members with complete potential follow-up.',
    death_is_event: true,
    event_concepts: [],
  },
  {
    endpoint_id: 'hf_hospitalization',
    kind: 'binary',
    label: 'HF hospitalization within follow-up window',
    definition: 'First acute-decompensation CONDITION_OCCURRENCE within followup_months of index.',
    event_concepts: [CONCEPT.hf_decompensation],
    cohorts: [201],
  },
  {
    endpoint_id: 'asthma_exacerbation',
    kind: 'binary',
    label: 'Asthma exacerbation within follow-up window',
    definition: 'First exacerbation CONDITION_OCCURRENCE within followup_months of index.',
    event_concepts: [CONCEPT.asthma_exacerbation],
    cohorts: [301, 302],
  },
  {
    endpoint_id: 'progression_or_death',
    kind: 'binary',
    label: 'Progression or death within follow-up window',
    definition: 'Malignant progression or death within followup_months of index.',
    event_concepts: [CONCEPT.nsclc_progression],
    death_is_event: true,
    cohorts: [101, 102, 103],
  },
  {
    endpoint_id: 'fev1_pct_predicted',
    kind: 'continuous',
    label: 'FEV1 % predicted at baseline',
    definition: 'MEASUREMENT closest to index within the baseline window.',
    measurement_concept: CONCEPT.fev1_pct,
    unit: '% predicted',
    cohorts: [301, 302],
  },
  {
    endpoint_id: 'blood_eosinophils',
    kind: 'continuous',
    label: 'Blood eosinophil count at baseline',
    definition: 'MEASUREMENT closest to index within the baseline window.',
    measurement_concept: CONCEPT.eos_count,
    unit: 'cells/uL',
    cohorts: [301, 302],
  },
  {
    endpoint_id: 'ntprobnp',
    kind: 'continuous',
    label: 'NT-proBNP at baseline',
    definition: 'MEASUREMENT closest to index within the baseline window.',
    measurement_concept: CONCEPT.ntprobnp,
    unit: 'pg/mL',
    cohorts: [201],
  },
  {
    endpoint_id: 'lvef',
    kind: 'continuous',
    label: 'LV ejection fraction at baseline',
    definition: 'MEASUREMENT closest to index within the baseline window.',
    measurement_concept: CONCEPT.lvef,
    unit: '%',
    cohorts: [201],
  },
  {
    endpoint_id: 'hemoglobin',
    kind: 'continuous',
    label: 'Hemoglobin at baseline',
    definition: 'MEASUREMENT closest to index within the baseline window.',
    measurement_concept: CONCEPT.hemoglobin,
    unit: 'g/dL',
    cohorts: [101, 102, 103],
  },
]

export const endpointDef = (id: string) => ENDPOINTS.find((e) => e.endpoint_id === id) ?? null

// -------------------------------------------------------- shared helpers ----

export interface Provenance {
  source: string
  dataset_id: string
  dataset_version: string
  function_id: string
  function_version: string
  cohort_id: string
  cohort_name: string
  cohort_definition_id: number
  cohort_n: number
  index_rule: string
  windows: Record<string, string>
  estimate_date: string
  caveat: string
}

function provenance(fn: string, cohort: MaterializedCohort, windows: Record<string, string>): Provenance {
  const m = omopManifest()
  return {
    source: 'Synthetic RWD — OMOP CDM v5.4 demo subset',
    dataset_id: m.datasetId,
    dataset_version: m.datasetVersion,
    function_id: fn,
    function_version: RWD_SERVICE_VERSION,
    cohort_id: cohort.cohort_id,
    cohort_name: cohort.name,
    cohort_definition_id: cohort.cohort_definition_id,
    cohort_n: cohort.n,
    index_rule: cohort.logic,
    windows,
    estimate_date: m.dataEnd,
    caveat: m.caveat,
  }
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function sd(xs: number[]): number {
  if (xs.length < 2) return NaN
  const m = mean(xs)
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1))
}

function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN
  const pos = (sorted.length - 1) * q
  const lo = Math.floor(pos)
  const hi = Math.ceil(pos)
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo)
}

/** Wilson score interval for a binomial proportion. */
export function wilsonCi(events: number, n: number, z = 1.959963984540054): [number, number] {
  if (n === 0) return [NaN, NaN]
  const p = events / n
  const denom = 1 + (z * z) / n
  const center = (p + (z * z) / (2 * n)) / denom
  const half = (z / denom) * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))
  return [Math.max(0, center - half), Math.min(1, center + half)]
}

const round = (x: number, dp = 3) => (Number.isFinite(x) ? Number(x.toFixed(dp)) : null)

/** First event day (strictly after index) among the endpoint's concepts. */
function eventDaysByPerson(concepts: number[]): Map<number, number[]> {
  const byPerson = rowsBy('condition_occurrence', 'person_id')
  const t = omopTable('condition_occurrence')
  const cCol = colIdx(t, 'condition_concept_id')
  const dCol = colIdx(t, 'condition_start_day')
  const set = new Set(concepts)
  const out = new Map<number, number[]>()
  byPerson.forEach((rows, pid) => {
    const days = rows.filter((r) => set.has(Number(r[cCol]))).map((r) => Number(r[dCol]))
    if (days.length) out.set(pid, days.sort((a, b) => a - b))
  })
  return out
}

const eventCache = new Map<string, Map<number, number[]>>()
function cachedEventDays(concepts: number[]): Map<number, number[]> {
  const key = concepts.join(',')
  if (!eventCache.has(key)) eventCache.set(key, eventDaysByPerson(concepts))
  return eventCache.get(key)!
}

function requireCohort(cohortDefinitionId: number): MaterializedCohort {
  const c = materializeCohort(cohortDefinitionId)
  if (!c) throw new Error(`Unknown cohort definition id ${cohortDefinitionId}. Valid ids: 101, 102, 103, 201, 301, 302.`)
  return c
}

function requireEndpoint(endpointId: string, kind: EndpointKind, cohortDefinitionId: number): EndpointDef {
  const e = endpointDef(endpointId)
  if (!e) {
    throw new Error(
      `Unknown endpoint "${endpointId}". Registered: ${ENDPOINTS.map((x) => x.endpoint_id).join(', ')}.`
    )
  }
  if (e.kind !== kind) throw new Error(`Endpoint "${endpointId}" is ${e.kind}, not ${kind}.`)
  if (e.cohorts && !e.cohorts.includes(cohortDefinitionId)) {
    throw new Error(
      `Endpoint "${endpointId}" is not defined for cohort ${cohortDefinitionId} (valid cohorts: ${e.cohorts.join(', ')}).`
    )
  }
  return e
}

// --------------------------------------------------- 1. characterization ----

export function cohortCharacterization(cohortDefinitionId: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const p = persons()
  const names = conceptNames()
  const m = omopManifest()

  const ages: number[] = []
  let female = 0
  for (const mem of cohort.members) {
    const rec = p.get(mem.person_id)!
    const indexYear = new Date(`${m.epoch}T00:00:00Z`).getUTCFullYear() + Math.floor(mem.index_day / 365.25)
    ages.push(indexYear - rec.year_of_birth)
    if (rec.gender_concept_id === CONCEPT.female) female++
  }
  ages.sort((a, b) => a - b)

  // Baseline conditions: any occurrence in the 365 days up to and incl. index.
  const condByPerson = rowsBy('condition_occurrence', 'person_id')
  const condT = omopTable('condition_occurrence')
  const cCol = colIdx(condT, 'condition_concept_id')
  const dCol = colIdx(condT, 'condition_start_day')
  const condCounts = new Map<number, number>()
  for (const mem of cohort.members) {
    const seen = new Set<number>()
    for (const r of condByPerson.get(mem.person_id) ?? []) {
      const d = Number(r[dCol])
      if (d <= mem.index_day && mem.index_day - d <= 365) seen.add(Number(r[cCol]))
    }
    seen.forEach((c) => condCounts.set(c, (condCounts.get(c) ?? 0) + 1))
  }

  // Baseline treatments: exposures overlapping [index - 90, index + 90].
  const drugByPerson = rowsBy('drug_exposure', 'person_id')
  const drugT = omopTable('drug_exposure')
  const dcCol = colIdx(drugT, 'drug_concept_id')
  const dsCol = colIdx(drugT, 'drug_exposure_start_day')
  const deCol = colIdx(drugT, 'drug_exposure_end_day')
  const drugCounts = new Map<number, number>()
  for (const mem of cohort.members) {
    const seen = new Set<number>()
    for (const r of drugByPerson.get(mem.person_id) ?? []) {
      const s = Number(r[dsCol])
      const e = Number(r[deCol])
      if (s <= mem.index_day + 90 && e >= mem.index_day - 90) seen.add(Number(r[dcCol]))
    }
    seen.forEach((c) => drugCounts.set(c, (drugCounts.get(c) ?? 0) + 1))
  }

  const top = (counts: Map<number, number>, limit: number) =>
    Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([concept, n]) => ({
        concept_id: concept,
        name: names.get(concept) ?? String(concept),
        n,
        pct: round((100 * n) / cohort.n, 1),
      }))

  // Baseline measurements with reasonable availability.
  const measDefs = ENDPOINTS.filter(
    (e) => e.kind === 'continuous' && (!e.cohorts || e.cohorts.includes(cohortDefinitionId))
  )
  const measurements = measDefs.map((e) => {
    const s = continuousEndpointSummary(cohortDefinitionId, e.endpoint_id, 90)
    return {
      endpoint_id: e.endpoint_id,
      label: e.label,
      unit: e.unit,
      n: s.n,
      mean: s.mean,
      sd: s.sd,
      missing_pct: s.missing_pct,
    }
  })

  return {
    n: cohort.n,
    age: {
      mean: round(mean(ages), 1),
      sd: round(sd(ages), 1),
      median: round(quantile(ages, 0.5), 1),
      q25: round(quantile(ages, 0.25), 1),
      q75: round(quantile(ages, 0.75), 1),
    },
    sex: { female_pct: round((100 * female) / cohort.n, 1), male_pct: round((100 * (cohort.n - female)) / cohort.n, 1) },
    baseline_conditions: top(condCounts, 10),
    baseline_treatments: top(drugCounts, 10),
    baseline_measurements: measurements,
    provenance: provenance('cohort_characterization', cohort, {
      baseline_conditions: '365 days up to index',
      baseline_treatments: 'exposure overlapping index ± 90 days',
    }),
  }
}

// ---------------------------------------------- 2. binary endpoint rate -----

export function binaryEndpointRate(cohortDefinitionId: number, endpointId: string, followupMonths: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const ep = requireEndpoint(endpointId, 'binary', cohortDefinitionId)
  const fuDays = Math.round(followupMonths * DAYS_PER_MONTH)
  const deaths = deathDays()
  const events = ep.event_concepts?.length ? cachedEventDays(ep.event_concepts) : new Map<number, number[]>()

  let denom = 0
  let nEvents = 0
  let excludedCensoring = 0
  for (const mem of cohort.members) {
    let eventDay = Infinity
    for (const d of events.get(mem.person_id) ?? []) {
      if (d > mem.index_day) {
        eventDay = d
        break
      }
    }
    if (ep.death_is_event) {
      const dd = deaths.get(mem.person_id)
      if (dd !== undefined && dd > mem.index_day) eventDay = Math.min(eventDay, dd)
    }
    const hadEvent = eventDay - mem.index_day <= fuDays
    const completeFollowup = mem.end_day - mem.index_day >= fuDays
    if (hadEvent || completeFollowup) {
      denom++
      if (hadEvent) nEvents++
    } else {
      excludedCensoring++
    }
  }

  const risk = denom ? nEvents / denom : NaN
  const [lo, hi] = wilsonCi(nEvents, denom)
  const warnings: string[] = []
  if (denom < 100) warnings.push(`Small denominator (${denom}) — the interval is wide.`)
  if (excludedCensoring / cohort.n > 0.25) {
    warnings.push(
      `${round((100 * excludedCensoring) / cohort.n, 1)}% of the cohort was censored before ${followupMonths} months and excluded; the observed risk may be biased if censoring is informative.`
    )
  }

  return {
    endpoint_id: ep.endpoint_id,
    endpoint_label: ep.label,
    endpoint_definition: ep.definition,
    followup_months: followupMonths,
    events: nEvents,
    denominator: denom,
    excluded_for_censoring: excludedCensoring,
    risk: round(risk, 4),
    ci95: [round(lo, 4), round(hi, 4)],
    ci_method: 'Wilson score',
    warnings,
    provenance: provenance('binary_endpoint_rate', cohort, {
      followup: `${followupMonths} months from index; members censored earlier without an event excluded`,
    }),
  }
}

// ------------------------------------------ 3. continuous endpoint summary --

export function continuousEndpointSummary(cohortDefinitionId: number, endpointId: string, baselineWindowDays: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const ep = requireEndpoint(endpointId, 'continuous', cohortDefinitionId)
  const measByPerson = rowsBy('measurement', 'person_id')
  const t = omopTable('measurement')
  const cCol = colIdx(t, 'measurement_concept_id')
  const dCol = colIdx(t, 'measurement_day')
  const vCol = colIdx(t, 'value_as_number')

  const values: number[] = []
  for (const mem of cohort.members) {
    let best: number | null = null
    let bestDist = Infinity
    for (const r of measByPerson.get(mem.person_id) ?? []) {
      if (Number(r[cCol]) !== ep.measurement_concept) continue
      const dist = Math.abs(Number(r[dCol]) - mem.index_day)
      if (dist <= baselineWindowDays && dist < bestDist) {
        bestDist = dist
        best = Number(r[vCol])
      }
    }
    if (best !== null) values.push(best)
  }
  values.sort((a, b) => a - b)
  const n = values.length
  const missing = cohort.n - n
  const m = n ? mean(values) : NaN
  const s = sd(values)
  const sem = n ? s / Math.sqrt(n) : NaN

  return {
    endpoint_id: ep.endpoint_id,
    endpoint_label: ep.label,
    endpoint_definition: ep.definition,
    unit: ep.unit,
    baseline_window_days: baselineWindowDays,
    n,
    missing,
    missing_pct: round((100 * missing) / cohort.n, 1),
    mean: round(m, 2),
    sd: round(s, 2),
    mean_ci95: [round(m - 1.96 * sem, 2), round(m + 1.96 * sem, 2)],
    median: round(quantile(values, 0.5), 2),
    q25: round(quantile(values, 0.25), 2),
    q75: round(quantile(values, 0.75), 2),
    min: round(values[0] ?? NaN, 2),
    max: round(values[n - 1] ?? NaN, 2),
    warnings: missing / cohort.n > 0.4 ? [`${round((100 * missing) / cohort.n, 1)}% of members have no baseline value — availability bias is plausible.`] : [],
    provenance: provenance('continuous_endpoint_summary', cohort, {
      baseline: `closest measurement within ± ${baselineWindowDays} days of index`,
    }),
  }
}

// ------------------------------------------------ 4. time-to-event summary --

interface KmPoint {
  month: number
  survival: number
  at_risk: number
}

function kaplanMeier(times: { t: number; event: boolean }[]): {
  curve: KmPoint[]
  medianDays: number | null
  survivalAt: (days: number) => { s: number; se: number }
} {
  const sorted = [...times].sort((a, b) => a.t - b.t)
  let atRisk = sorted.length
  let s = 1
  let greenwood = 0
  const steps: { t: number; s: number; se: number; atRisk: number }[] = [{ t: 0, s: 1, se: 0, atRisk }]
  let i = 0
  while (i < sorted.length) {
    const t = sorted[i].t
    let d = 0
    let c = 0
    while (i < sorted.length && sorted[i].t === t) {
      if (sorted[i].event) d++
      else c++
      i++
    }
    if (d > 0) {
      s *= (atRisk - d) / atRisk
      greenwood += d / (atRisk * (atRisk - d))
      steps.push({ t, s, se: s * Math.sqrt(greenwood), atRisk: atRisk - d - c })
    }
    atRisk -= d + c
  }
  const medianStep = steps.find((st) => st.s <= 0.5)
  const maxMonth = Math.min(36, Math.ceil((sorted[sorted.length - 1]?.t ?? 0) / DAYS_PER_MONTH))
  const curve: KmPoint[] = []
  for (let month = 0; month <= maxMonth; month++) {
    const days = month * DAYS_PER_MONTH
    let sm = 1
    for (const st of steps) {
      if (st.t <= days) sm = st.s
      else break
    }
    const risk = sorted.filter((x) => x.t >= days).length
    curve.push({ month, survival: Number(sm.toFixed(4)), at_risk: risk })
  }
  return {
    curve,
    medianDays: medianStep ? medianStep.t : null,
    survivalAt: (days: number) => {
      let out = { s: 1, se: 0 }
      for (const st of steps) {
        if (st.t <= days) out = { s: st.s, se: st.se }
        else break
      }
      return out
    },
  }
}

export function timeToEventSummary(cohortDefinitionId: number, endpointId: string) {
  const cohort = requireCohort(cohortDefinitionId)
  const ep = requireEndpoint(endpointId, 'time_to_event', cohortDefinitionId)
  const deaths = deathDays()
  const events = ep.event_concepts?.length ? cachedEventDays(ep.event_concepts) : new Map<number, number[]>()

  const times: { t: number; event: boolean }[] = []
  let nEvents = 0
  let personDays = 0
  for (const mem of cohort.members) {
    let eventDay = Infinity
    for (const d of events.get(mem.person_id) ?? []) {
      if (d > mem.index_day) {
        eventDay = d
        break
      }
    }
    if (ep.death_is_event) {
      const dd = deaths.get(mem.person_id)
      if (dd !== undefined && dd > mem.index_day) eventDay = Math.min(eventDay, dd)
    }
    const censorDay = mem.end_day
    const event = eventDay <= censorDay
    const t = Math.max(1, (event ? eventDay : censorDay) - mem.index_day)
    times.push({ t, event })
    personDays += t
    if (event) nEvents++
  }

  const km = kaplanMeier(times)
  const personYears = personDays / 365.25
  const s12 = km.survivalAt(12 * DAYS_PER_MONTH)
  const s24 = km.survivalAt(24 * DAYS_PER_MONTH)
  const loglog = (s: number, se: number): [number, number] => {
    if (s <= 0 || s >= 1) return [s, s]
    const seLog = se / (s * Math.abs(Math.log(s)))
    return [Math.pow(s, Math.exp(1.96 * seLog)), Math.pow(s, Math.exp(-1.96 * seLog))]
  }

  return {
    endpoint_id: ep.endpoint_id,
    endpoint_label: ep.label,
    endpoint_definition: ep.definition,
    n: cohort.n,
    events: nEvents,
    censored: cohort.n - nEvents,
    censored_pct: round((100 * (cohort.n - nEvents)) / cohort.n, 1),
    person_years: round(personYears, 0),
    event_rate_per_100py: round((100 * nEvents) / personYears, 2),
    km_median_months: km.medianDays === null ? null : round(km.medianDays / DAYS_PER_MONTH, 1),
    survival_12mo: { estimate: round(s12.s, 3), ci95: loglog(s12.s, s12.se).map((x) => round(x, 3)) },
    survival_24mo: { estimate: round(s24.s, 3), ci95: loglog(s24.s, s24.se).map((x) => round(x, 3)) },
    km_curve: km.curve,
    warnings: nEvents < 50 ? [`Only ${nEvents} events — estimates are unstable.`] : [],
    provenance: provenance('time_to_event_summary', cohort, {
      followup: 'index to event or observation-period end (censoring)',
    }),
  }
}

// ------------------------------------------------------ 5. accrual summary --

export function accrualSummary(cohortDefinitionId: number, targetN?: number, captureRate?: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const m = omopManifest()
  const epoch = new Date(`${m.epoch}T00:00:00Z`)
  const p = persons()

  const byMonth = new Map<string, number>()
  const bySite = new Map<number, number>()
  for (const mem of cohort.members) {
    const d = new Date(epoch.getTime() + mem.index_day * 86400000)
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1)
    const site = p.get(mem.person_id)!.care_site_id
    bySite.set(site, (bySite.get(site) ?? 0) + 1)
  }
  const months = Array.from(byMonth.entries())
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([month, eligible]) => ({ month, eligible }))
  // Drop the ragged final months (accrual window ends mid-dataset for some cohorts).
  const counts = months.slice(0, -2).map((x) => x.eligible).sort((a, b) => a - b)
  const monthly = {
    p25: round(quantile(counts, 0.25), 1),
    median: round(quantile(counts, 0.5), 1),
    p75: round(quantile(counts, 0.75), 1),
  }
  const sites = Array.from(bySite.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([site, eligible]) => ({ site: `Site ${String(site).padStart(2, '0')}`, eligible }))

  const capture = captureRate ?? 0.05
  const scenarios =
    targetN && monthly.median
      ? (
          [
            ['conservative', monthly.p25],
            ['median', monthly.median],
            ['optimistic', monthly.p75],
          ] as const
        ).map(([label, rate]) => ({
          scenario: label,
          eligible_per_month: rate,
          assumed_capture_rate: capture,
          expected_enrolled_per_month: round((rate ?? 0) * capture, 2),
          months_to_target: rate ? round(targetN / (rate * capture), 1) : null,
        }))
      : undefined

  return {
    total_eligible: cohort.n,
    monthly_eligible: monthly,
    by_month: months,
    top_sites: sites.slice(0, 10),
    site_count: sites.length,
    site_distribution: {
      p25: quantile(sites.map((s) => s.eligible).sort((a, b) => a - b), 0.25),
      median: quantile(sites.map((s) => s.eligible).sort((a, b) => a - b), 0.5),
      p75: quantile(sites.map((s) => s.eligible).sort((a, b) => a - b), 0.75),
    },
    recruitment_scenarios: scenarios,
    warnings: scenarios
      ? [
          `Scenarios assume ${round(capture * 100, 1)}% of eligible patients enroll — an explicit assumption, not an RWD observation.`,
        ]
      : [],
    provenance: provenance('accrual_summary', cohort, {
      accrual: 'cohort index dates by calendar month and care site',
    }),
  }
}

// ---------------------------------------------------- 6. retention summary --

export function retentionSummary(cohortDefinitionId: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const m = omopManifest()
  const deaths = deathDays()
  const obs = observationPeriods()
  const dataEndDay = Math.round(
    (new Date(`${m.dataEnd}T00:00:00Z`).getTime() - new Date(`${m.epoch}T00:00:00Z`).getTime()) / 86400000
  )

  const followupMonths = cohort.members
    .map((mem) => (mem.end_day - mem.index_day) / DAYS_PER_MONTH)
    .sort((a, b) => a - b)

  const intervals = [
    [0, 6],
    [6, 12],
    [12, 18],
    [18, 24],
  ].map(([a, b]) => {
    const aDays = a * DAYS_PER_MONTH
    const bDays = b * DAYS_PER_MONTH
    let atStart = 0
    let died = 0
    let lost = 0
    let adminCensored = 0
    for (const mem of cohort.members) {
      const fu = mem.end_day - mem.index_day
      if (fu < aDays) continue
      atStart++
      if (fu < bDays) {
        const dd = deaths.get(mem.person_id)
        const [, obsEnd] = obs.get(mem.person_id)!
        if (dd !== undefined && dd <= mem.end_day) died++
        else if (obsEnd >= dataEndDay) adminCensored++
        else lost++
      }
    }
    return {
      interval: `${a}-${b} months`,
      at_start: atStart,
      died,
      lost_to_followup: lost,
      administratively_censored: adminCensored,
      ltfu_pct_of_at_start: atStart ? round((100 * lost) / atStart, 1) : null,
    }
  })

  const retained = (months: number) =>
    round(
      (100 * cohort.members.filter((mem) => mem.end_day - mem.index_day >= months * DAYS_PER_MONTH).length) /
        cohort.n,
      1
    )

  return {
    n: cohort.n,
    followup_months: {
      median: round(quantile(followupMonths, 0.5), 1),
      q25: round(quantile(followupMonths, 0.25), 1),
      q75: round(quantile(followupMonths, 0.75), 1),
    },
    still_observed_pct: { m6: retained(6), m12: retained(12), m18: retained(18), m24: retained(24) },
    intervals,
    note: 'Follow-up ends at death, disenrollment, or the dataset end; the interval table separates the three.',
    provenance: provenance('retention_summary', cohort, {
      followup: 'index to observation-period end',
    }),
  }
}

// ----------------------------------------------------- 7. patient journey ---

/**
 * Registered schedule-of-assessments templates the journey can be laid against.
 * The hero template mirrors the NSCLC design brief's SoA sketch (screening,
 * 21-day cycles, imaging q6w through week 48 then q9w, survival follow-up).
 */
export interface SoaEvent {
  month: number
  label: string
  kind: 'screening' | 'treatment' | 'imaging' | 'followup'
}

export const SOA_TEMPLATES: Record<string, { label: string; events: SoaEvent[] }> = {
  'nsclc-2l-brief': {
    label: 'NSCLC design brief SoA (screening; q3w cycles; imaging q6w→q9w; survival follow-up)',
    events: (() => {
      const ev: SoaEvent[] = [{ month: -0.5, label: 'Screening', kind: 'screening' }]
      for (let c = 0; c < 16; c++) ev.push({ month: (c * 21) / DAYS_PER_MONTH, label: `Cycle ${c + 1}`, kind: 'treatment' })
      for (let w = 6; w <= 48; w += 6) ev.push({ month: (w * 7) / DAYS_PER_MONTH, label: `Imaging W${w}`, kind: 'imaging' })
      for (let w = 57; w <= 104; w += 9) ev.push({ month: (w * 7) / DAYS_PER_MONTH, label: `Follow-up W${w}`, kind: 'followup' })
      return ev
    })(),
  },
}

export function patientJourney(cohortDefinitionId: number, soaTemplateId: string, horizonMonths: number) {
  const cohort = requireCohort(cohortDefinitionId)
  const soa = SOA_TEMPLATES[soaTemplateId]
  if (!soa) {
    throw new Error(`Unknown SoA template "${soaTemplateId}". Registered: ${Object.keys(SOA_TEMPLATES).join(', ')}.`)
  }
  const deaths = deathDays()
  const visitByPerson = rowsBy('visit_occurrence', 'person_id')
  const visitT = omopTable('visit_occurrence')
  const vDay = colIdx(visitT, 'visit_start_day')
  const procByPerson = rowsBy('procedure_occurrence', 'person_id')
  const procT = omopTable('procedure_occurrence')
  const pDay = colIdx(procT, 'procedure_day')
  const pConcept = colIdx(procT, 'procedure_concept_id')
  const drugByPerson = rowsBy('drug_exposure', 'person_id')
  const drugT = omopTable('drug_exposure')
  const dStart = colIdx(drugT, 'drug_exposure_start_day')
  const dEnd = colIdx(drugT, 'drug_exposure_end_day')
  const progression = cachedEventDays([CONCEPT.nsclc_progression])

  // Per-month observed care intensity among patients still under observation.
  const months: {
    month: number
    retained_pct: number
    visits_per_active_patient: number
    imaging_pct_of_active: number
  }[] = []
  for (let month = 0; month < horizonMonths; month++) {
    const a = month * DAYS_PER_MONTH
    const b = (month + 1) * DAYS_PER_MONTH
    let active = 0
    let visits = 0
    let withImaging = 0
    for (const mem of cohort.members) {
      if (mem.end_day - mem.index_day < a) continue
      active++
      let imaged = false
      for (const r of visitByPerson.get(mem.person_id) ?? []) {
        const t = Number(r[vDay]) - mem.index_day
        if (t >= a && t < b) visits++
      }
      for (const r of procByPerson.get(mem.person_id) ?? []) {
        if (Number(r[pConcept]) !== CONCEPT.ct_chest) continue
        const t = Number(r[pDay]) - mem.index_day
        if (t >= a && t < b) imaged = true
      }
      if (imaged) withImaging++
    }
    months.push({
      month,
      retained_pct: round((100 * active) / cohort.n, 1) as number,
      visits_per_active_patient: active ? (round(visits / active, 2) as number) : 0,
      imaging_pct_of_active: active ? (round((100 * withImaging) / active, 1) as number) : 0,
    })
  }

  // Milestones: medians of observed journey events, from index.
  const medianOf = (vals: number[]) => (vals.length ? round(quantile(vals.sort((x, y) => x - y), 0.5), 1) : null)
  const iqrOf = (vals: number[]): [number, number] | null =>
    vals.length
      ? [round(quantile(vals, 0.25), 1) as number, round(quantile(vals, 0.75), 1) as number]
      : null

  const firstTreatment: number[] = []
  const treatmentEnd: number[] = []
  const firstImaging: number[] = []
  const progressionM: number[] = []
  const deathM: number[] = []
  for (const mem of cohort.members) {
    const starts = (drugByPerson.get(mem.person_id) ?? [])
      .map((r) => ({ s: Number(r[dStart]), e: Number(r[dEnd]) }))
      .filter((x) => x.s >= mem.index_day && x.s - mem.index_day <= 90)
    if (starts.length) {
      firstTreatment.push((Math.min(...starts.map((x) => x.s)) - mem.index_day) / DAYS_PER_MONTH)
      treatmentEnd.push((Math.max(...starts.map((x) => x.e)) - mem.index_day) / DAYS_PER_MONTH)
    }
    const imaging = (procByPerson.get(mem.person_id) ?? [])
      .filter((r) => Number(r[pConcept]) === CONCEPT.ct_chest && Number(r[pDay]) > mem.index_day)
      .map((r) => Number(r[pDay]))
    if (imaging.length) firstImaging.push((Math.min(...imaging) - mem.index_day) / DAYS_PER_MONTH)
    const prog = (progression.get(mem.person_id) ?? []).find((d) => d > mem.index_day)
    if (prog !== undefined && prog <= mem.end_day) progressionM.push((prog - mem.index_day) / DAYS_PER_MONTH)
    const dd = deaths.get(mem.person_id)
    if (dd !== undefined && dd <= mem.end_day) deathM.push((dd - mem.index_day) / DAYS_PER_MONTH)
  }

  const milestones = [
    { label: 'First treatment exposure', median_months: medianOf(firstTreatment), iqr: iqrOf(firstTreatment), n: firstTreatment.length },
    { label: 'First follow-up imaging', median_months: medianOf(firstImaging), iqr: iqrOf(firstImaging), n: firstImaging.length },
    { label: 'End of first treatment era', median_months: medianOf(treatmentEnd), iqr: iqrOf(treatmentEnd), n: treatmentEnd.length },
    { label: 'Disease progression (observed)', median_months: medianOf(progressionM), iqr: iqrOf(progressionM), n: progressionM.length },
    { label: 'Death (observed)', median_months: medianOf(deathM), iqr: iqrOf(deathM), n: deathM.length },
  ].filter((x) => x.median_months !== null)

  // SoA adherence read: for each scheduled imaging event, the share of
  // then-active patients with a matching RWD procedure within ± 3 weeks.
  const soaAdherence = soa.events
    .filter((e) => e.kind === 'imaging')
    .map((e) => {
      const center = e.month * DAYS_PER_MONTH
      let active = 0
      let matched = 0
      for (const mem of cohort.members) {
        if (mem.end_day - mem.index_day < center) continue
        active++
        const hit = (procByPerson.get(mem.person_id) ?? []).some((r) => {
          if (Number(r[pConcept]) !== CONCEPT.ct_chest) return false
          const t = Number(r[pDay]) - mem.index_day
          return Math.abs(t - center) <= 21
        })
        if (hit) matched++
      }
      return {
        soa_event: e.label,
        month: round(e.month, 1),
        active_patients: active,
        rwd_match_pct: active ? round((100 * matched) / active, 1) : null,
      }
    })

  return {
    soa_template: soaTemplateId,
    soa_label: soa.label,
    soa_events: soa.events.filter((e) => e.month <= horizonMonths).map((e) => ({ ...e, month: round(e.month, 2) })),
    horizon_months: horizonMonths,
    months,
    milestones,
    soa_imaging_adherence: soaAdherence,
    note:
      'Real-world care intensity and attrition laid against the protocol schedule: where the observed journey diverges from the SoA (imaging cadence, retention at late follow-up), the design carries operational risk.',
    provenance: provenance('patient_journey', cohort, {
      journey: `index to ${horizonMonths} months; care events bucketed per 30.4-day month`,
    }),
  }
}
