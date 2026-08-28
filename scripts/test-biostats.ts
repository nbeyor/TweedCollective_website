/**
 * Acceptance tests for the OMOP biostatistics module (module PRD §10).
 *
 * Run with:  npm run test:biostats   (npx tsx scripts/test-biostats.ts)
 *
 * Gates:
 *  1. Every registered analysis matches the independently computed reference
 *     fixtures (pipeline/biostats_reference.py, scipy) within documented
 *     tolerances.
 *  2. Requests cannot execute an unregistered method, unknown field, or
 *     out-of-range value.
 *  3. Runs are idempotent: identical normalized inputs produce the same
 *     content-addressed run_id and identical outputs.
 *  4. RWD summaries reproduce the dataset's encoded signal.
 *  5. End-to-end: a control event rate derived from OMOP feeds a registered
 *     design analysis as an explicitly labeled input, reproducibly.
 */

import fs from 'fs'
import path from 'path'

import { ANALYSIS_SPECS, getRun, runAnalysis, type AnalysisRun } from '../lib/biostats/engine'
import { gsBoundaries } from '../lib/biostats/groupSequential'
import { normCdf, normInv } from '../lib/biostats/stats'
import { cohortDefinitions, materializeCohort } from '../lib/omop/cohorts'
import {
  accrualSummary,
  binaryEndpointRate,
  cohortCharacterization,
  continuousEndpointSummary,
  patientJourney,
  retentionSummary,
  timeToEventSummary,
} from '../lib/omop/summaries'

let failures = 0
let checks = 0

function check(label: string, ok: boolean, detail?: string) {
  checks++
  if (!ok) {
    failures++
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

function close(label: string, actual: number, expected: number, tol: number) {
  check(label, Math.abs(actual - expected) <= tol, `expected ${expected} ± ${tol}, got ${actual}`)
}

function isRun(x: unknown): x is AnalysisRun {
  return Boolean(x && typeof x === 'object' && 'run_id' in (x as object))
}

// ------------------------------------------------------ 0. math primitives --

console.log('math primitives')
// Documented accuracy: ~1e-7 (erfc-limited refinement) — ample for design formulas.
close('normInv(0.975)', normInv(0.975), 1.959963984540054, 1e-6)
close('normInv(0.9)', normInv(0.9), 1.2815515655446004, 1e-6)
close('normCdf(1.96)', normCdf(1.96), 0.9750021048517795, 1e-6)

// --------------------------------------------------- 1. reference fixtures --

console.log('reference fixtures')
const ref = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'lib', 'biostats', 'fixtures', 'reference.json'), 'utf-8')
) as {
  fixtures: Record<
    string,
    Array<{
      inputs: Record<string, unknown>
      expect?: Record<string, number>
      expect_approx?: Record<string, number>
      expect_gs?: { z_boundaries: number[]; inflation_factor: number; cumulative_alpha: number[] }
    }>
  >
}

for (const analysisId of Object.keys(ref.fixtures)) {
  const cases = ref.fixtures[analysisId]
  for (let i = 0; i < cases.length; i++) {
    const fixture = cases[i]
    const result = runAnalysis({ analysis_id: analysisId, inputs: fixture.inputs })
    if (!isRun(result)) {
      check(`${analysisId}[${i}] runs`, false, JSON.stringify(result))
      continue
    }
    const summary = result.outputs.summary as Record<string, number>
    for (const key of Object.keys(fixture.expect ?? {})) {
      const tol = key === 'power' ? 0.001 : 0 // sample sizes: exact integer match
      close(`${analysisId}[${i}].${key}`, summary[key], (fixture.expect ?? {})[key], tol)
    }
    for (const key of Object.keys(fixture.expect_approx ?? {})) {
      close(`${analysisId}[${i}].${key}`, summary[key], (fixture.expect_approx ?? {})[key], 0.005)
    }
    if (fixture.expect_gs) {
      const table = result.outputs.table as Array<Record<string, number>>
      fixture.expect_gs.z_boundaries.forEach((zb: number, k: number) => {
        close(`${analysisId}[${i}].boundary[${k}]`, table[k].efficacy_z, zb, 0.005)
      })
      close(`${analysisId}[${i}].inflation`, summary.inflation_factor, fixture.expect_gs.inflation_factor, 0.01)
    }
  }
}

// Direct spending-boundary self-checks (first boundary is analytic).
const b = gsBoundaries([0.5, 1], 0.025, 'obrien_fleming')
close('LD-OBF K=2 first boundary (analytic)', b.z_boundaries[0], 2.9626, 0.005)
close('LD-OBF K=2 total alpha', b.cumulative_alpha[1], 0.025, 1e-6)

// -------------------------------------------------------- 2. rejections -----

console.log('validation rejections')
const rejected = (r: unknown) => Boolean(r && typeof r === 'object' && 'error' in (r as object))
check('unknown analysis id', rejected(runAnalysis({ analysis_id: 'ss_bayesian_adaptive', inputs: {} })))
check(
  'unknown field',
  rejected(runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: { control_rate: 0.3, treatment_rate: 0.22, power: 0.8, r_code: 'system("ls")' } }))
)
check('out-of-range alpha', rejected(runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: { control_rate: 0.3, treatment_rate: 0.22, power: 0.8, alpha: 0.7 } })))
check('missing required', rejected(runAnalysis({ analysis_id: 'ss_continuous_2arm', inputs: { sd: 10, power: 0.8 } })))
check('both rate and difference', rejected(runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: { control_rate: 0.3, treatment_rate: 0.22, risk_difference: -0.08, power: 0.8 } })))
check('bad spending function', rejected(runAnalysis({ analysis_id: 'gs_survival_2arm', inputs: { hazard_ratio: 0.75, control_median_survival_months: 14, accrual_months: 24, followup_months: 12, power: 0.9, spending: 'haybittle' } })))
check(
  'scenario grid over unregistered analysis',
  rejected(runAnalysis({ analysis_id: 'scenario_grid', inputs: { analysis_id: 'scenario_grid', inputs: {}, grid: { power: [0.8] } } }))
)
check(
  'scenario grid too large',
  rejected(
    runAnalysis({
      analysis_id: 'scenario_grid',
      inputs: {
        analysis_id: 'ss_binary_2arm',
        inputs: { control_rate: 0.3, treatment_rate: 0.22, power: 0.8 },
        grid: { power: Array.from({ length: 11 }, (_, i) => 0.5 + i * 0.04), alpha: Array.from({ length: 11 }, (_, i) => 0.01 + i * 0.001 ) },
      },
    })
  )
)
check('wrong analysis_version', rejected(runAnalysis({ analysis_id: 'ss_binary_2arm', analysis_version: '9.9', inputs: { control_rate: 0.3, treatment_rate: 0.22, power: 0.8 } })))

// ------------------------------------------------------- 3. idempotency -----

console.log('idempotency and run store')
const runA = runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: { control_rate: 0.3, treatment_rate: 0.22, alpha: 0.05, power: 0.8, allocation_ratio: 1, dropout: 0.1 } })
const runB = runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: { dropout: 0.1, power: 0.8, treatment_rate: 0.22, alpha: 0.05, allocation_ratio: 1, control_rate: 0.3 } })
if (isRun(runA) && isRun(runB)) {
  check('same run_id for identical normalized inputs', runA.run_id === runB.run_id)
  check('identical outputs', JSON.stringify(runA.outputs) === JSON.stringify(runB.outputs))
  check('run retrievable by id', getRun(runA.run_id)?.run_id === runA.run_id)
  check('PRD §8 example: 471/arm evaluable', (runA.outputs.summary as Record<string, number>).n_control_evaluable === 471)
} else {
  check('PRD example run succeeds', false, JSON.stringify(runA))
}
check('catalog covers the ten PRD analyses', ANALYSIS_SPECS.length === 10)

// ------------------------------------------------------- 4. RWD summaries ---

console.log('RWD summaries against encoded signal')
check('six cohort definitions', cohortDefinitions().length === 6)
const nsclc = materializeCohort(101)!
check('NSCLC cohort n', nsclc.n === 2600, String(nsclc.n))
check('unknown cohort returns null', materializeCohort(999) === null)

const characterization = cohortCharacterization(101)
check('characterization has provenance', characterization.provenance.cohort_definition_id === 101)
check('characterization age plausible', (characterization.age.mean ?? 0) > 55 && (characterization.age.mean ?? 0) < 75)

// Independent Python recomputation with the same denominator rule (event
// counted even when censoring followed it; else complete follow-up required):
// 812 events / 2707 = 0.3000.
const hfHosp = binaryEndpointRate(201, 'hf_hospitalization', 12)
close('HF 12-mo hospitalization risk', hfHosp.risk ?? 0, 0.3, 0.005)
check('HF events/denominator', hfHosp.events === 812 && hfHosp.denominator === 2707, `${hfHosp.events}/${hfHosp.denominator}`)
check('binary CI brackets estimate', (hfHosp.ci95[0] ?? 1) < (hfHosp.risk ?? 0) && (hfHosp.ci95[1] ?? 0) > (hfHosp.risk ?? 0))

const fev1 = continuousEndpointSummary(302, 'fev1_pct_predicted', 90)
close('severe-eos asthma FEV1 mean', fev1.mean ?? 0, 60.6, 0.5)
close('severe-eos asthma FEV1 sd', fev1.sd ?? 0, 13.9, 0.5)
check('FEV1 missingness reported', (fev1.missing ?? 0) > 0)

const osChemo = timeToEventSummary(103, 'overall_survival')
const osIo = timeToEventSummary(102, 'overall_survival')
close('chemo-only median OS (encoded ~14.9mo)', osChemo.km_median_months ?? 0, 14.9, 0.5)
check('IO cohort survives longer (encoded HR 0.72)', (osIo.km_median_months ?? 0) > (osChemo.km_median_months ?? 0) + 3)
check('KM curve monotone', osChemo.km_curve.every((p, i, arr) => i === 0 || p.survival <= arr[i - 1].survival))

const accrual = accrualSummary(101, 180, 0.05)
check('accrual has monthly counts', accrual.by_month.length > 40)
check('accrual scenarios present', (accrual.recruitment_scenarios ?? []).length === 3)
check('accrual sites', accrual.site_count === 40)

const retention = retentionSummary(101)
check('retention intervals', retention.intervals.length === 4)
check('retention declines', (retention.still_observed_pct.m6 ?? 0) > (retention.still_observed_pct.m24 ?? 0))

const journey = patientJourney(101, 'nsclc-2l-brief', 24)
check('journey months', journey.months.length === 24)
check('journey has SoA events', journey.soa_events.length > 10)
check('journey milestones include progression', journey.milestones.some((m) => m.label.includes('progression')))
check('journey imaging adherence computed', journey.soa_imaging_adherence.length > 0 && journey.soa_imaging_adherence.every((a) => a.rwd_match_pct === null || (a.rwd_match_pct >= 0 && a.rwd_match_pct <= 100)))

// Bad summary inputs rejected.
const throws = (fn: () => unknown) => {
  try {
    fn()
    return false
  } catch {
    return true
  }
}
check('unknown endpoint rejected', throws(() => binaryEndpointRate(201, 'made_up_endpoint', 12)))
check('endpoint/cohort mismatch rejected', throws(() => binaryEndpointRate(101, 'hf_hospitalization', 12)))
check('unknown SoA template rejected', throws(() => patientJourney(101, 'nope', 24)))

// ------------------------------------------------- 5. end-to-end demo -------

console.log('end-to-end: RWD-derived rate into a registered design')
const derivedRate = binaryEndpointRate(201, 'hf_hospitalization', 12)
const e2e = runAnalysis({
  analysis_id: 'ss_binary_2arm',
  inputs: {
    control_rate: derivedRate.risk,
    treatment_rate: Number(((derivedRate.risk ?? 0) * 0.75).toFixed(3)),
    alpha: 0.05,
    power: 0.9,
    allocation_ratio: 1,
    dropout: 0.1,
  },
  derived_from: [
    {
      field: 'control_rate',
      function_id: 'binary_endpoint_rate',
      cohort_id: derivedRate.provenance.cohort_id,
      cohort_name: derivedRate.provenance.cohort_name,
      endpoint_id: 'hf_hospitalization',
      window: '12 months from index',
      estimate_date: derivedRate.provenance.estimate_date,
      estimate: derivedRate.risk ?? undefined,
      uncertainty: `95% CI ${derivedRate.ci95[0]}-${derivedRate.ci95[1]} (Wilson)`,
    },
  ],
})
if (isRun(e2e)) {
  check('e2e run succeeded', true)
  check('derived_from labeled on run record', e2e.derived_from[0]?.field === 'control_rate' && e2e.derived_from[0]?.cohort_id.includes('201'))
  const again = runAnalysis({ analysis_id: 'ss_binary_2arm', inputs: e2e.inputs })
  check('e2e reproducible (same run_id)', isRun(again) && again.run_id === e2e.run_id)
} else {
  check('e2e run succeeded', false, JSON.stringify(e2e))
}

// ----------------------------------------------------------------- report ---

console.log(`\n${checks - failures}/${checks} checks passed`)
if (failures) {
  console.error(`${failures} FAILURES`)
  process.exit(1)
}
console.log('OK')
