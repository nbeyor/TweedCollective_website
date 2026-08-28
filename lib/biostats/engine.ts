/**
 * Fixed biostatistics analytics catalog (module PRD §7) — TypeScript engine.
 *
 * Ten registered analyses, each with a versioned parameter schema, validation
 * that rejects unknown analysis IDs, unexpected fields, out-of-range values,
 * and incomplete requests, and a deterministic closed-form (or deterministic
 * numerical) implementation. No LLM selects a method, generates code, or
 * changes assumptions: callers request an analysis_id with explicit inputs.
 *
 * Methods basis (documented with tolerances in docs/omop-biostats-module.md):
 *   continuous SS/power   normal-approximation with Guenther t correction
 *   binary SS/power       pooled-variance z-test formula (Lachin)
 *   survival SS/power     Schoenfeld events + expected event probability via
 *                         uniform accrual over exponential survival/dropout
 *   noninferiority        shifted-margin one-sided z formulas (Blackwelder)
 *   group-sequential      Lan-DeMets error spending, recursive integration
 *
 * Reference fixtures generated independently (pipeline/biostats_reference.py,
 * scipy distributions) gate the engine in scripts/test-biostats.ts.
 */

import { createHash } from 'crypto'

import { gsDesign, type SpendingFunction } from './groupSequential'
import { normCdf, normInv, simpson } from './stats'

export const ENGINE_NAME = 'tweed-biostats-ts'
export const ENGINE_VERSION = '1.0.0'

// -------------------------------------------------------------- schemas -----

export interface FieldSpec {
  type: 'number' | 'integer' | 'boolean' | 'string'
  required?: boolean
  default?: number | boolean | string
  min?: number
  max?: number
  /** Range is exclusive at min (e.g. rates strictly above 0). */
  exclusiveMin?: boolean
  enum?: string[]
  description: string
}

export interface AnalysisOutputs {
  summary: Record<string, unknown>
  table?: Array<Record<string, unknown>>
  interpretation: string
  calculation: Record<string, unknown>
  warnings: string[]
}

export interface AnalysisSpec {
  analysis_id: string
  version: string
  title: string
  design: string
  /** 1 = one-sided alpha, 2 = two-sided alpha. */
  alpha_sided: 1 | 2
  method: string
  reference_packages: string
  fields: Record<string, FieldSpec>
  /** Cross-field checks after per-field validation; return error strings. */
  crossValidate?: (inputs: Record<string, unknown>) => string[]
  run: (inputs: Record<string, unknown>) => AnalysisOutputs
}

const pct = (x: number) => `${(100 * x).toFixed(1)}%`
const r3 = (x: number) => Number(x.toFixed(3))
const r4 = (x: number) => Number(x.toFixed(4))

const COMMON = {
  power: {
    type: 'number',
    required: true,
    min: 0.5,
    max: 0.999,
    description: 'Target power (1 - beta), e.g. 0.8 or 0.9.',
  } as FieldSpec,
  allocation_ratio: {
    type: 'number',
    default: 1,
    min: 0.1,
    max: 10,
    description: 'Randomization ratio treatment:control (n_t / n_c). 1 = equal allocation.',
  } as FieldSpec,
  dropout: {
    type: 'number',
    default: 0,
    min: 0,
    max: 0.5,
    description: 'Expected dropout fraction; enrolled N is inflated by 1/(1-dropout).',
  } as FieldSpec,
}

const alphaField = (sided: 1 | 2): FieldSpec => ({
  type: 'number',
  default: sided === 2 ? 0.05 : 0.025,
  min: 0.001,
  max: 0.2,
  description: sided === 2 ? 'Two-sided significance level.' : 'One-sided significance level.',
})

// ------------------------------------------------------- shared formulas ----

function dropoutInflate(n: number, dropout: number): number {
  return Math.ceil(n / (1 - dropout))
}

function continuousSampleSize(delta: number, sd: number, alpha: number, power: number, r: number, sided: 1 | 2) {
  const za = normInv(1 - alpha / sided)
  const zb = normInv(power)
  const base = ((1 + 1 / r) * sd * sd * (za + zb) ** 2) / (delta * delta)
  const guenther = (za * za) / 4
  return { nControlExact: base + guenther, nTreatmentExact: r * base + guenther, za, zb }
}

function continuousPower(delta: number, sd: number, nC: number, nT: number, alpha: number, sided: 1 | 2): number {
  const za = normInv(1 - alpha / sided)
  const se = sd * Math.sqrt(1 / nC + 1 / nT)
  return normCdf(Math.abs(delta) / se - za)
}

function binarySampleSize(pC: number, pT: number, alpha: number, power: number, r: number, sided: 1 | 2) {
  const za = normInv(1 - alpha / sided)
  const zb = normInv(power)
  const delta = Math.abs(pC - pT)
  const pBar = (pC + r * pT) / (1 + r)
  const qBar = 1 - pBar
  const nC =
    (za * Math.sqrt((1 + 1 / r) * pBar * qBar) + zb * Math.sqrt(pC * (1 - pC) + (pT * (1 - pT)) / r)) ** 2 /
    (delta * delta)
  return { nControl: nC, nTreatment: r * nC, za, zb, pBar }
}

function binaryPower(pC: number, pT: number, nC: number, nT: number, alpha: number, sided: 1 | 2): number {
  const za = normInv(1 - alpha / sided)
  const delta = Math.abs(pC - pT)
  const pBar = (nC * pC + nT * pT) / (nC + nT)
  const se0 = Math.sqrt(pBar * (1 - pBar) * (1 / nC + 1 / nT))
  const se1 = Math.sqrt((pC * (1 - pC)) / nC + (pT * (1 - pT)) / nT)
  return normCdf((delta - za * se0) / se1)
}

function schoenfeldEvents(hr: number, alpha: number, power: number, r: number, sided: 1 | 2): number {
  const za = normInv(1 - alpha / sided)
  const zb = normInv(power)
  return ((1 + r) ** 2 / r) * ((za + zb) ** 2 / Math.log(hr) ** 2)
}

/**
 * Probability a subject has the event during the study: exponential survival
 * (hazard lambda /month), exponential dropout (eta /month), uniform accrual
 * over A months, minimum follow-up F months after accrual closes.
 */
function eventProbability(lambdaMonthly: number, etaMonthly: number, accrualMonths: number, followupMonths: number): number {
  const total = lambdaMonthly + etaMonthly
  const tau = accrualMonths + followupMonths
  const pAt = (fu: number) => (lambdaMonthly / total) * (1 - Math.exp(-total * fu))
  if (accrualMonths <= 0) return pAt(tau)
  return simpson((u) => pAt(tau - u), 0, accrualMonths, 200) / accrualMonths
}

function survivalDesign(inputs: Record<string, unknown>, alpha: number, power: number, sided: 1 | 2) {
  const hr = Number(inputs.hazard_ratio)
  const r = Number(inputs.allocation_ratio)
  const medianC = Number(inputs.control_median_survival_months)
  const A = Number(inputs.accrual_months)
  const F = Number(inputs.followup_months)
  const annualDropout = Number(inputs.annual_dropout)

  const events = schoenfeldEvents(hr, alpha, power, r, sided)
  const lambdaC = Math.LN2 / medianC
  const lambdaT = lambdaC * hr
  const eta = annualDropout > 0 ? -Math.log(1 - annualDropout) / 12 : 0
  const pC = eventProbability(lambdaC, eta, A, F)
  const pT = eventProbability(lambdaT, eta, A, F)
  const wC = 1 / (1 + r)
  const wT = r / (1 + r)
  const pAvg = wC * pC + wT * pT
  const nTotal = events / pAvg
  return { events, lambdaC, lambdaT, eta, pC, pT, pAvg, nTotal, r, hr, A, F }
}

// -------------------------------------------------------------- analyses ----

const specs: AnalysisSpec[] = [
  {
    analysis_id: 'ss_continuous_2arm',
    version: '1.0',
    title: 'Sample size — two-arm superiority, continuous endpoint',
    design: 'Two-arm parallel superiority; difference in means, two-sided test',
    alpha_sided: 2,
    method:
      'Normal-approximation sample size with Guenther correction for the two-sample t test: n_c = (1+1/r)·sd²·(z_{1-a/2}+z_{1-b})²/delta² + z²/4 per arm; enrolled N inflated by 1/(1-dropout).',
    reference_packages: 'R stats::power.t.test equivalent',
    fields: {
      effect_difference: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Clinically meaningful difference in means between arms (endpoint units).' },
      sd: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Common standard deviation of the endpoint.' },
      alpha: alphaField(2),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      dropout: COMMON.dropout,
    },
    run(inputs) {
      const delta = Number(inputs.effect_difference)
      const sd = Number(inputs.sd)
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const r = Number(inputs.allocation_ratio)
      const dropout = Number(inputs.dropout)
      const { nControlExact, nTreatmentExact, za, zb } = continuousSampleSize(delta, sd, alpha, power, r, 2)
      const nC = Math.ceil(nControlExact)
      const nT = Math.ceil(nTreatmentExact)
      const enrolledC = dropoutInflate(nC, dropout)
      const enrolledT = dropoutInflate(nT, dropout)
      const achieved = continuousPower(delta, sd, nC, nT, alpha, 2)
      const warnings: string[] = []
      if (delta / sd < 0.1) warnings.push('Standardized effect below 0.1 — the trial is very large; check the assumption.')
      return {
        summary: {
          n_control_evaluable: nC,
          n_treatment_evaluable: nT,
          n_total_evaluable: nC + nT,
          n_control_enrolled: enrolledC,
          n_treatment_enrolled: enrolledT,
          n_total_enrolled: enrolledC + enrolledT,
          achieved_power_at_evaluable_n: r3(achieved),
        },
        interpretation: `Detecting a ${delta} difference (SD ${sd}, standardized effect ${r3(delta / sd)}) at two-sided alpha ${alpha} with ${pct(power)} power needs ${nC + nT} evaluable participants (${nC} control, ${nT} treatment); ${pct(dropout)} dropout takes enrollment to ${enrolledC + enrolledT}.`,
        calculation: {
          formula: 'n_c = (1+1/r)·sd²·(z_{1-a/2}+z_{1-b})²/delta² + z²/4 (Guenther)',
          z_alpha: r4(za),
          z_beta: r4(zb),
          standardized_effect: r4(delta / sd),
          n_control_exact: nControlExact,
        },
        warnings,
      }
    },
  },
  {
    analysis_id: 'ss_binary_2arm',
    version: '1.0',
    title: 'Sample size — two-arm superiority, binary endpoint',
    design: 'Two-arm parallel superiority; difference in proportions, two-sided pooled z test',
    alpha_sided: 2,
    method:
      'Pooled-variance z-test sample size (Lachin 1981), no continuity correction: n_c = [z_{1-a/2}·sqrt((1+1/r)·p̄q̄) + z_{1-b}·sqrt(p_c·q_c + p_t·q_t/r)]² / (p_c - p_t)².',
    reference_packages: 'R stats::power.prop.test-class formula',
    fields: {
      control_rate: { type: 'number', required: true, min: 0.001, max: 0.999, description: 'Expected event proportion in the control arm.' },
      treatment_rate: { type: 'number', min: 0.001, max: 0.999, description: 'Expected event proportion in the treatment arm. Provide this or risk_difference.' },
      risk_difference: { type: 'number', min: -0.998, max: 0.998, description: 'Alternative to treatment_rate: treatment minus control absolute difference.' },
      alpha: alphaField(2),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      dropout: COMMON.dropout,
    },
    crossValidate(inputs) {
      const errs: string[] = []
      const hasT = inputs.treatment_rate !== undefined
      const hasD = inputs.risk_difference !== undefined
      if (hasT === hasD) errs.push('Provide exactly one of treatment_rate or risk_difference.')
      if (hasD) {
        const pT = Number(inputs.control_rate) + Number(inputs.risk_difference)
        if (pT <= 0 || pT >= 1) errs.push(`risk_difference implies a treatment rate of ${r3(pT)}, outside (0, 1).`)
      }
      if (hasT && Number(inputs.treatment_rate) === Number(inputs.control_rate)) {
        errs.push('treatment_rate equals control_rate — no effect to detect.')
      }
      return errs
    },
    run(inputs) {
      const pC = Number(inputs.control_rate)
      const pT = inputs.treatment_rate !== undefined ? Number(inputs.treatment_rate) : pC + Number(inputs.risk_difference)
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const r = Number(inputs.allocation_ratio)
      const dropout = Number(inputs.dropout)
      const { nControl, za, zb, pBar } = binarySampleSize(pC, pT, alpha, power, r, 2)
      const nC = Math.ceil(nControl)
      const nT = Math.ceil(r * nControl)
      const enrolledC = dropoutInflate(nC, dropout)
      const enrolledT = dropoutInflate(nT, dropout)
      const achieved = binaryPower(pC, pT, nC, nT, alpha, 2)
      return {
        summary: {
          n_control_evaluable: nC,
          n_treatment_evaluable: nT,
          n_total_evaluable: nC + nT,
          n_control_enrolled: enrolledC,
          n_treatment_enrolled: enrolledT,
          n_total_enrolled: enrolledC + enrolledT,
          achieved_power_at_evaluable_n: r3(achieved),
          expected_events_control: Math.round(nC * pC),
          expected_events_treatment: Math.round(nT * pT),
        },
        interpretation: `Detecting ${pct(pC)} vs ${pct(pT)} (absolute difference ${pct(Math.abs(pC - pT))}) at two-sided alpha ${alpha} with ${pct(power)} power needs ${nC + nT} evaluable participants; ${pct(dropout)} dropout takes enrollment to ${enrolledC + enrolledT}.`,
        calculation: {
          formula: 'pooled z (Lachin), no continuity correction',
          z_alpha: r4(za),
          z_beta: r4(zb),
          pooled_rate: r4(pBar),
          n_control_exact: nControl,
          treatment_rate_used: pT,
        },
        warnings: [],
      }
    },
  },
  {
    analysis_id: 'ss_survival_2arm',
    version: '1.0',
    title: 'Sample size — two-arm superiority, time-to-event endpoint',
    design: 'Two-arm time-to-event superiority; log-rank test, two-sided',
    alpha_sided: 2,
    method:
      'Schoenfeld events d = ((1+r)²/r)·(z_{1-a/2}+z_{1-b})²/ln(HR)²; N from per-arm event probability under exponential survival, exponential dropout, uniform accrual over accrual_months, and followup_months of minimum follow-up (Simpson integration over entry times).',
    reference_packages: 'R gsDesign::nSurv / rpact-class closed forms',
    fields: {
      hazard_ratio: { type: 'number', required: true, min: 0.05, max: 0.99, description: 'Treatment vs control hazard ratio under the alternative (superiority: < 1).' },
      control_median_survival_months: { type: 'number', required: true, min: 0.5, max: 240, description: 'Median event-free time in the control arm, months (exponential assumption).' },
      accrual_months: { type: 'number', required: true, min: 1, max: 120, description: 'Uniform accrual period, months.' },
      followup_months: { type: 'number', required: true, min: 0, max: 120, description: 'Minimum follow-up after accrual closes, months.' },
      alpha: alphaField(2),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      annual_dropout: { type: 'number', default: 0, min: 0, max: 0.5, description: 'Annual dropout probability, modeled as exponential censoring.' },
    },
    run(inputs) {
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const d = survivalDesign(inputs, alpha, power, 2)
      const events = Math.ceil(d.events)
      const nTotal = Math.ceil(d.nTotal)
      const nC = Math.ceil(d.nTotal / (1 + d.r))
      const nT = nTotal - nC
      const warnings: string[] = []
      if (d.pAvg < 0.2) {
        warnings.push(
          `Only ${pct(d.pAvg)} of enrolled patients are expected to have an event in-study — extend follow-up or accrual before believing this N.`
        )
      }
      return {
        summary: {
          events_required: events,
          n_total_enrolled: nTotal,
          n_control_enrolled: nC,
          n_treatment_enrolled: nT,
          expected_event_probability_control: r3(d.pC),
          expected_event_probability_treatment: r3(d.pT),
          study_duration_months: d.A + d.F,
        },
        interpretation: `A hazard ratio of ${d.hr} against a ${inputs.control_median_survival_months}-month control median at two-sided alpha ${alpha} and ${pct(power)} power needs ${events} events; with ${d.A} months accrual and ${d.F} months follow-up that is ~${nTotal} enrolled (${nC} control / ${nT} treatment).`,
        calculation: {
          formula: 'Schoenfeld events + exponential accrual/dropout event probability',
          events_exact: d.events,
          control_hazard_monthly: r4(d.lambdaC),
          treatment_hazard_monthly: r4(d.lambdaT),
          dropout_hazard_monthly: r4(d.eta),
          avg_event_probability: r4(d.pAvg),
        },
        warnings,
      }
    },
  },
  {
    analysis_id: 'ss_noninferiority_continuous',
    version: '1.0',
    title: 'Sample size — noninferiority, continuous endpoint',
    design: 'Two-arm noninferiority; continuous endpoint, one-sided shifted-margin z test',
    alpha_sided: 1,
    method:
      'One-sided shifted-margin formula: n_c = (1+1/r)·sd²·(z_{1-a}+z_{1-b})²/(margin + true_difference)²; enrolled N inflated by 1/(1-dropout).',
    reference_packages: 'Blackwelder-class formula',
    fields: {
      ni_margin: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Noninferiority margin M > 0 (treatment considered noninferior if it is worse by less than M).' },
      true_difference: { type: 'number', default: 0, min: -1e6, max: 1e6, description: 'True treatment-minus-control difference assumed under the alternative (0 = truly equal).' },
      sd: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Common standard deviation of the endpoint.' },
      alpha: alphaField(1),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      dropout: COMMON.dropout,
    },
    crossValidate(inputs) {
      const m = Number(inputs.ni_margin) + Number(inputs.true_difference ?? 0)
      return m <= 0 ? ['ni_margin + true_difference must be positive — otherwise noninferiority cannot be shown.'] : []
    },
    run(inputs) {
      const M = Number(inputs.ni_margin)
      const d0 = Number(inputs.true_difference)
      const sd = Number(inputs.sd)
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const r = Number(inputs.allocation_ratio)
      const dropout = Number(inputs.dropout)
      const za = normInv(1 - alpha)
      const zb = normInv(power)
      const eff = M + d0
      const nControl = ((1 + 1 / r) * sd * sd * (za + zb) ** 2) / (eff * eff)
      const nC = Math.ceil(nControl)
      const nT = Math.ceil(r * nControl)
      const enrolledC = dropoutInflate(nC, dropout)
      const enrolledT = dropoutInflate(nT, dropout)
      return {
        summary: {
          n_control_evaluable: nC,
          n_treatment_evaluable: nT,
          n_total_evaluable: nC + nT,
          n_control_enrolled: enrolledC,
          n_treatment_enrolled: enrolledT,
          n_total_enrolled: enrolledC + enrolledT,
        },
        interpretation: `Showing noninferiority within margin ${M} (true difference ${d0}, SD ${sd}) at one-sided alpha ${alpha} with ${pct(power)} power needs ${nC + nT} evaluable participants; ${pct(dropout)} dropout takes enrollment to ${enrolledC + enrolledT}.`,
        calculation: { formula: 'shifted-margin one-sided z', z_alpha: r4(za), z_beta: r4(zb), effective_margin: eff, n_control_exact: nControl },
        warnings: [],
      }
    },
  },
  {
    analysis_id: 'ss_noninferiority_binary',
    version: '1.0',
    title: 'Sample size — noninferiority, binary endpoint',
    design: 'Two-arm noninferiority; binary endpoint, one-sided shifted-margin z test (unpooled variance)',
    alpha_sided: 1,
    method:
      'Blackwelder: n_c = (z_{1-a}+z_{1-b})²·(p_c·q_c + p_t·q_t/r)/(p_t - p_c + margin)²; enrolled N inflated by 1/(1-dropout).',
    reference_packages: 'Blackwelder 1982 formula',
    fields: {
      control_rate: { type: 'number', required: true, min: 0.001, max: 0.999, description: 'Expected event proportion in the control arm.' },
      treatment_rate: { type: 'number', min: 0.001, max: 0.999, description: 'Expected event proportion in the treatment arm under the alternative. Defaults to control_rate.' },
      ni_margin: { type: 'number', required: true, min: 0.001, max: 0.5, description: 'Absolute noninferiority margin on the event proportion (M > 0).' },
      alpha: alphaField(1),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      dropout: COMMON.dropout,
    },
    crossValidate(inputs) {
      const pC = Number(inputs.control_rate)
      const pT = inputs.treatment_rate === undefined ? pC : Number(inputs.treatment_rate)
      // Events are harms here: treatment must not exceed control by more than M.
      const eff = Number(inputs.ni_margin) - (pT - pC)
      return eff <= 0
        ? ['ni_margin must exceed the assumed excess (treatment_rate - control_rate) for the design to have power.']
        : []
    },
    run(inputs) {
      const pC = Number(inputs.control_rate)
      const pT = inputs.treatment_rate === undefined ? pC : Number(inputs.treatment_rate)
      const M = Number(inputs.ni_margin)
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const r = Number(inputs.allocation_ratio)
      const dropout = Number(inputs.dropout)
      const za = normInv(1 - alpha)
      const zb = normInv(power)
      const eff = M - (pT - pC)
      const nControl = ((za + zb) ** 2 * (pC * (1 - pC) + (pT * (1 - pT)) / r)) / (eff * eff)
      const nC = Math.ceil(nControl)
      const nT = Math.ceil(r * nControl)
      const enrolledC = dropoutInflate(nC, dropout)
      const enrolledT = dropoutInflate(nT, dropout)
      return {
        summary: {
          n_control_evaluable: nC,
          n_treatment_evaluable: nT,
          n_total_evaluable: nC + nT,
          n_control_enrolled: enrolledC,
          n_treatment_enrolled: enrolledT,
          n_total_enrolled: enrolledC + enrolledT,
        },
        interpretation: `Showing noninferiority within an absolute margin of ${pct(M)} (control ${pct(pC)}, assumed treatment ${pct(pT)}) at one-sided alpha ${alpha} with ${pct(power)} power needs ${nC + nT} evaluable participants; ${pct(dropout)} dropout takes enrollment to ${enrolledC + enrolledT}.`,
        calculation: { formula: 'Blackwelder unpooled one-sided z', z_alpha: r4(za), z_beta: r4(zb), effective_margin: r4(eff), n_control_exact: nControl },
        warnings: [],
      }
    },
  },
  {
    analysis_id: 'power_continuous_2arm',
    version: '1.0',
    title: 'Power at fixed N — continuous endpoint',
    design: 'Two-arm superiority; continuous endpoint, two-sided z approximation',
    alpha_sided: 2,
    method: 'power = Phi(|delta| / (sd·sqrt(1/n_c + 1/n_t)) - z_{1-a/2}); normal approximation.',
    reference_packages: 'R stats::power.t.test-class (normal approximation)',
    fields: {
      n_control: { type: 'integer', required: true, min: 2, max: 1e6, description: 'Evaluable participants, control arm.' },
      n_treatment: { type: 'integer', required: true, min: 2, max: 1e6, description: 'Evaluable participants, treatment arm.' },
      effect_difference: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Difference in means between arms.' },
      sd: { type: 'number', required: true, min: 0, exclusiveMin: true, max: 1e6, description: 'Common standard deviation.' },
      alpha: alphaField(2),
    },
    run(inputs) {
      const nC = Number(inputs.n_control)
      const nT = Number(inputs.n_treatment)
      const delta = Number(inputs.effect_difference)
      const sd = Number(inputs.sd)
      const alpha = Number(inputs.alpha)
      const power = continuousPower(delta, sd, nC, nT, alpha, 2)
      return {
        summary: { power: r3(power), n_total: nC + nT },
        interpretation: `${nC + nT} evaluable participants (${nC}/${nT}) give ${pct(power)} power to detect a ${delta} difference (SD ${sd}) at two-sided alpha ${alpha}.`,
        calculation: { formula: 'normal-approximation power', standardized_effect: r4(delta / sd) },
        warnings: power < 0.7 ? ['Power below 70% — the design is likely underpowered for this effect.'] : [],
      }
    },
  },
  {
    analysis_id: 'power_binary_2arm',
    version: '1.0',
    title: 'Power at fixed N — binary endpoint',
    design: 'Two-arm superiority; binary endpoint, two-sided pooled z test',
    alpha_sided: 2,
    method: 'power = Phi((|p_c - p_t| - z_{1-a/2}·se0)/se1), pooled null variance, unpooled alternative.',
    reference_packages: 'Lachin 1981 formula',
    fields: {
      n_control: { type: 'integer', required: true, min: 2, max: 1e6, description: 'Evaluable participants, control arm.' },
      n_treatment: { type: 'integer', required: true, min: 2, max: 1e6, description: 'Evaluable participants, treatment arm.' },
      control_rate: { type: 'number', required: true, min: 0.001, max: 0.999, description: 'Expected control-arm event proportion.' },
      treatment_rate: { type: 'number', required: true, min: 0.001, max: 0.999, description: 'Expected treatment-arm event proportion.' },
      alpha: alphaField(2),
    },
    run(inputs) {
      const nC = Number(inputs.n_control)
      const nT = Number(inputs.n_treatment)
      const pC = Number(inputs.control_rate)
      const pT = Number(inputs.treatment_rate)
      const alpha = Number(inputs.alpha)
      const power = binaryPower(pC, pT, nC, nT, alpha, 2)
      return {
        summary: { power: r3(power), n_total: nC + nT, expected_events: Math.round(nC * pC + nT * pT) },
        interpretation: `${nC + nT} evaluable participants give ${pct(power)} power to detect ${pct(pC)} vs ${pct(pT)} at two-sided alpha ${alpha}.`,
        calculation: { formula: 'pooled z power (Lachin)' },
        warnings: power < 0.7 ? ['Power below 70% — the design is likely underpowered for this effect.'] : [],
      }
    },
  },
  {
    analysis_id: 'power_survival_2arm',
    version: '1.0',
    title: 'Power at fixed events — time-to-event endpoint',
    design: 'Two-arm superiority; log-rank test, two-sided, power from observed/planned event count',
    alpha_sided: 2,
    method: 'power = Phi(|ln HR|·sqrt(d·r/(1+r)²) - z_{1-a/2}) (Schoenfeld).',
    reference_packages: 'Schoenfeld 1983 formula',
    fields: {
      events: { type: 'integer', required: true, min: 5, max: 1e6, description: 'Total analyzable events (both arms).' },
      hazard_ratio: { type: 'number', required: true, min: 0.05, max: 0.99, description: 'Treatment vs control hazard ratio under the alternative.' },
      alpha: alphaField(2),
      allocation_ratio: COMMON.allocation_ratio,
    },
    run(inputs) {
      const d = Number(inputs.events)
      const hr = Number(inputs.hazard_ratio)
      const alpha = Number(inputs.alpha)
      const r = Number(inputs.allocation_ratio)
      const za = normInv(1 - alpha / 2)
      const power = normCdf(Math.abs(Math.log(hr)) * Math.sqrt((d * r) / (1 + r) ** 2) - za)
      return {
        summary: { power: r3(power), events: d },
        interpretation: `${d} events give ${pct(power)} power for a hazard ratio of ${hr} at two-sided alpha ${alpha}.`,
        calculation: { formula: 'Schoenfeld power', log_hr: r4(Math.log(hr)) },
        warnings: power < 0.7 ? ['Power below 70% — the design is likely underpowered for this hazard ratio.'] : [],
      }
    },
  },
  {
    analysis_id: 'gs_survival_2arm',
    version: '1.0',
    title: 'Group-sequential design — time-to-event endpoint',
    design: 'Two-arm time-to-event superiority with interim efficacy looks; Lan-DeMets error spending',
    alpha_sided: 1,
    method:
      'Lan-DeMets error-spending efficacy boundaries (O\'Brien-Fleming-like or Pocock-like), boundary-crossing probabilities by recursive numerical integration; fixed-design events from Schoenfeld inflated by the sequential design; N from exponential accrual/dropout event probabilities.',
    reference_packages: 'R gsDesign / rpact-class methods',
    fields: {
      hazard_ratio: { type: 'number', required: true, min: 0.05, max: 0.99, description: 'Treatment vs control hazard ratio under the alternative.' },
      control_median_survival_months: { type: 'number', required: true, min: 0.5, max: 240, description: 'Control-arm median event-free time, months.' },
      accrual_months: { type: 'number', required: true, min: 1, max: 120, description: 'Uniform accrual period, months.' },
      followup_months: { type: 'number', required: true, min: 0, max: 120, description: 'Minimum follow-up after accrual closes, months.' },
      looks: { type: 'integer', default: 3, min: 2, max: 6, description: 'Total analyses including the final one. Information fractions are equally spaced unless info_fractions is given.' },
      spending: { type: 'string', default: 'obrien_fleming', enum: ['obrien_fleming', 'pocock'], description: 'Lan-DeMets error-spending family.' },
      alpha: alphaField(1),
      power: COMMON.power,
      allocation_ratio: COMMON.allocation_ratio,
      annual_dropout: { type: 'number', default: 0, min: 0, max: 0.5, description: 'Annual dropout probability, modeled as exponential censoring.' },
    },
    run(inputs) {
      const alpha = Number(inputs.alpha)
      const power = Number(inputs.power)
      const K = Number(inputs.looks)
      const spending = String(inputs.spending) as SpendingFunction
      const infoFractions = Array.from({ length: K }, (_, i) => (i + 1) / K)
      const design = gsDesign(infoFractions, alpha, power, spending)
      const fixed = survivalDesign(inputs, alpha, power, 1)
      const maxEvents = Math.ceil(fixed.events * design.inflation_factor)
      const nTotal = Math.ceil(maxEvents / fixed.pAvg)
      const r = fixed.r
      const table = infoFractions.map((t, k) => {
        const dK = Math.ceil(t * maxEvents)
        const z = design.boundaries.z_boundaries[k]
        // Approximate HR at the efficacy boundary from the log-rank score scale.
        const hrAtBound = Math.exp((-z * (1 + r)) / Math.sqrt(dK * r))
        return {
          look: k + 1,
          information_fraction: r3(t),
          events: dK,
          efficacy_z: r3(z),
          nominal_one_sided_p: r4(design.boundaries.nominal_alpha[k]),
          cumulative_alpha_spent: r4(design.boundaries.cumulative_alpha[k]),
          approx_hr_at_boundary: r3(hrAtBound),
          stop_probability_under_h1: r3(design.stop_probabilities_h1[k]),
        }
      })
      return {
        summary: {
          max_events: maxEvents,
          fixed_design_events: Math.ceil(fixed.events),
          inflation_factor: r3(design.inflation_factor),
          n_total_enrolled: nTotal,
          expected_events_under_h1: Math.ceil(design.expected_info_fraction_h1 * maxEvents),
          looks: K,
          spending_function: spending,
        },
        table,
        interpretation: `A ${K}-look ${spending === 'obrien_fleming' ? "O'Brien-Fleming" : 'Pocock'}-spending design for HR ${fixed.hr} at one-sided alpha ${alpha} and ${pct(power)} power needs ${maxEvents} events at the final look (${r3(design.inflation_factor)}x the ${Math.ceil(fixed.events)}-event fixed design) — about ${nTotal} enrolled; under the alternative it stops early with probability ${pct(design.stop_probabilities_h1.slice(0, -1).reduce((a, b) => a + b, 0))}.`,
        calculation: {
          formula: 'Lan-DeMets spending + Schoenfeld events + exponential accrual model',
          drift: r4(design.drift),
          avg_event_probability: r4(fixed.pAvg),
          info_fractions: infoFractions,
        },
        warnings:
          fixed.pAvg < 0.2
            ? [`Only ${pct(fixed.pAvg)} of enrolled patients are expected to reach an event in-study — extend follow-up or accrual.`]
            : [],
      }
    },
  },
  {
    analysis_id: 'scenario_grid',
    version: '1.0',
    title: 'Scenario grid over a registered analysis',
    design: 'Repeats one registered analysis over explicit parameter values; no new methodology',
    alpha_sided: 2,
    method: 'Each grid cell is one fully validated run of the named analysis; results are collected into a table.',
    reference_packages: 'n/a (composition)',
    fields: {
      // Validated by the dedicated path in runAnalysis — the nested inputs and
      // grid follow the target analysis's own schema.
      analysis_id: { type: 'string', required: true, description: 'The registered analysis to sweep (any catalog id except scenario_grid).' },
      inputs: { type: 'string', required: true, description: 'Base inputs object for the target analysis (JSON object).' },
      grid: { type: 'string', required: true, description: 'Object mapping 1-2 parameter names to arrays of values, e.g. {"power": [0.8, 0.85, 0.9]}. Max 100 combinations.' },
    },
    run() {
      throw new Error('scenario_grid runs through its dedicated path')
    },
  },
]

export const ANALYSIS_SPECS = specs
export const analysisSpec = (id: string) => specs.find((s) => s.analysis_id === id) ?? null

// ------------------------------------------------------------ validation ----

export interface ValidationResult {
  inputs: Record<string, unknown>
  defaulted: string[]
  errors: string[]
}

export function validateInputs(spec: AnalysisSpec, raw: unknown): ValidationResult {
  const errors: string[] = []
  const defaulted: string[] = []
  const inputs: Record<string, unknown> = {}
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : null
  if (!obj) return { inputs, defaulted, errors: ['inputs must be a JSON object.'] }

  for (const key of Object.keys(obj)) {
    if (!spec.fields[key]) errors.push(`Unknown field "${key}" for ${spec.analysis_id}. Allowed: ${Object.keys(spec.fields).join(', ')}.`)
  }
  for (const [key, field] of Object.entries(spec.fields)) {
    const v = obj[key]
    if (v === undefined || v === null) {
      if (field.required) {
        errors.push(`Missing required field "${key}" — ${field.description}`)
      } else if (field.default !== undefined) {
        inputs[key] = field.default
        defaulted.push(key)
      }
      continue
    }
    if (field.type === 'boolean') {
      if (typeof v !== 'boolean') errors.push(`"${key}" must be a boolean.`)
      else inputs[key] = v
      continue
    }
    if (field.type === 'string') {
      if (typeof v !== 'string') errors.push(`"${key}" must be a string.`)
      else if (field.enum && !field.enum.includes(v)) errors.push(`"${key}" must be one of: ${field.enum.join(', ')}.`)
      else inputs[key] = v
      continue
    }
    const n = typeof v === 'number' ? v : NaN
    if (!Number.isFinite(n)) {
      errors.push(`"${key}" must be a number.`)
      continue
    }
    if (field.type === 'integer' && !Number.isInteger(n)) {
      errors.push(`"${key}" must be an integer.`)
      continue
    }
    if (field.min !== undefined && (field.exclusiveMin ? n <= field.min : n < field.min)) {
      errors.push(`"${key}" must be ${field.exclusiveMin ? '>' : '>='} ${field.min} (got ${n}).`)
      continue
    }
    if (field.max !== undefined && n > field.max) {
      errors.push(`"${key}" must be <= ${field.max} (got ${n}).`)
      continue
    }
    inputs[key] = n
  }
  if (!errors.length && spec.crossValidate) errors.push(...spec.crossValidate(inputs))
  return { inputs, defaulted, errors }
}

// ------------------------------------------------------------- run store ----

/** Provenance label for an input that was pre-populated from RWD (PRD §9). */
export interface DerivedFromLabel {
  field: string
  function_id: string
  cohort_id: string
  cohort_name?: string
  endpoint_id?: string
  window?: string
  estimate_date?: string
  estimate?: number
  uncertainty?: string
}

export interface AnalysisRun {
  run_id: string
  analysis_id: string
  analysis_version: string
  status: 'succeeded'
  inputs: Record<string, unknown>
  defaulted_fields: string[]
  derived_from: DerivedFromLabel[]
  outputs: AnalysisOutputs
  engine: {
    name: string
    version: string
    deterministic: true
    seed: null
    methods_basis: string
  }
  created_at: string
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1))
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`
  }
  return JSON.stringify(value)
}

export function runIdFor(analysisId: string, analysisVersion: string, inputs: Record<string, unknown>): string {
  const hash = createHash('sha256')
    .update(canonical({ analysis_id: analysisId, analysis_version: analysisVersion, engine: ENGINE_VERSION, inputs }))
    .digest('hex')
  return `run_${hash.slice(0, 24)}`
}

// Content-addressed, in-memory per instance. Identical normalized inputs and
// engine version always produce the same run_id AND byte-identical outputs, so
// a cold instance can rebuild any record by re-executing the run (the
// serverless stand-in for the PRD's immutable result store — documented).
const runStore = new Map<string, AnalysisRun>()

export function getRun(runId: string): AnalysisRun | null {
  return runStore.get(runId) ?? null
}

export interface RunRequest {
  analysis_id?: unknown
  analysis_version?: unknown
  inputs?: unknown
  derived_from?: unknown
}

export interface RunError {
  error: string
  details?: string[]
}

function sanitizeDerivedFrom(raw: unknown): DerivedFromLabel[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((d): d is Record<string, unknown> => Boolean(d) && typeof d === 'object')
    .slice(0, 20)
    .map((d) => ({
      field: String(d.field ?? '').slice(0, 100),
      function_id: String(d.function_id ?? '').slice(0, 100),
      cohort_id: String(d.cohort_id ?? '').slice(0, 100),
      cohort_name: d.cohort_name ? String(d.cohort_name).slice(0, 200) : undefined,
      endpoint_id: d.endpoint_id ? String(d.endpoint_id).slice(0, 100) : undefined,
      window: d.window ? String(d.window).slice(0, 200) : undefined,
      estimate_date: d.estimate_date ? String(d.estimate_date).slice(0, 40) : undefined,
      estimate: typeof d.estimate === 'number' ? d.estimate : undefined,
      uncertainty: d.uncertainty ? String(d.uncertainty).slice(0, 200) : undefined,
    }))
    .filter((d) => d.field)
}

const MAX_GRID_CELLS = 100

function runScenarioGrid(req: RunRequest): AnalysisRun | RunError {
  const body = (req.inputs ?? {}) as Record<string, unknown>
  const targetId = String(body.analysis_id ?? '')
  const target = analysisSpec(targetId)
  if (!target || targetId === 'scenario_grid') {
    return { error: `scenario_grid needs a registered target analysis_id (got "${targetId}").` }
  }
  const base = body.inputs
  const grid = body.grid
  if (!grid || typeof grid !== 'object' || Array.isArray(grid)) {
    return { error: 'grid must be an object mapping parameter names to arrays of values.' }
  }
  const params = Object.entries(grid as Record<string, unknown>)
  if (params.length < 1 || params.length > 2) return { error: 'grid must sweep 1 or 2 parameters.' }
  for (const [key, values] of params) {
    if (!target.fields[key]) return { error: `grid parameter "${key}" is not a field of ${targetId}.` }
    if (!Array.isArray(values) || !values.length) return { error: `grid.${key} must be a non-empty array.` }
  }
  const cells = params.reduce((a, [, v]) => a * (v as unknown[]).length, 1)
  if (cells > MAX_GRID_CELLS) return { error: `Grid has ${cells} cells; the maximum is ${MAX_GRID_CELLS}.` }

  const rows: Array<Record<string, unknown>> = []
  const warnings = new Set<string>()
  const combos: Array<Record<string, unknown>> = []
  const [p1, p2] = params
  for (const v1 of p1[1] as unknown[]) {
    if (p2) {
      for (const v2 of p2[1] as unknown[]) combos.push({ [p1[0]]: v1, [p2[0]]: v2 })
    } else {
      combos.push({ [p1[0]]: v1 })
    }
  }
  for (const combo of combos) {
    const cellInputs = { ...(base as Record<string, unknown>), ...combo }
    const v = validateInputs(target, cellInputs)
    if (v.errors.length) {
      return { error: `Grid cell ${JSON.stringify(combo)} failed validation.`, details: v.errors }
    }
    const out = target.run(v.inputs)
    out.warnings.forEach((w) => warnings.add(w))
    rows.push({ ...combo, ...out.summary })
  }

  const spec = analysisSpec('scenario_grid')!
  const normalized = { analysis_id: targetId, inputs: base as Record<string, unknown>, grid: grid as Record<string, unknown> }
  const runId = runIdFor('scenario_grid', spec.version, normalized)
  const run: AnalysisRun = {
    run_id: runId,
    analysis_id: 'scenario_grid',
    analysis_version: spec.version,
    status: 'succeeded',
    inputs: normalized,
    defaulted_fields: [],
    derived_from: sanitizeDerivedFrom(req.derived_from),
    outputs: {
      summary: { target_analysis: targetId, cells: rows.length, swept: params.map(([k]) => k) },
      table: rows,
      interpretation: `${rows.length} scenarios of ${targetId} across ${params.map(([k, v]) => `${k} (${(v as unknown[]).length} values)`).join(' x ')}.`,
      calculation: { method: 'composition of registered analysis runs' },
      warnings: Array.from(warnings),
    },
    engine: engineStamp(),
    created_at: new Date().toISOString(),
  }
  runStore.set(runId, run)
  return run
}

function engineStamp() {
  return {
    name: ENGINE_NAME,
    version: ENGINE_VERSION,
    deterministic: true as const,
    seed: null,
    methods_basis:
      'Closed-form design formulas (Guenther, Lachin, Schoenfeld, Blackwelder) and Lan-DeMets error-spending group-sequential boundaries by recursive numerical integration. TypeScript implementation validated against independently computed reference fixtures (see docs/omop-biostats-module.md).',
  }
}

/** Execute a registered analysis. Never throws for bad input — returns RunError. */
export function runAnalysis(req: RunRequest): AnalysisRun | RunError {
  const id = String(req.analysis_id ?? '')
  const spec = analysisSpec(id)
  if (!spec) {
    return {
      error: `Unknown analysis_id "${id}". Registered analyses: ${specs.map((s) => s.analysis_id).join(', ')}.`,
    }
  }
  if (req.analysis_version !== undefined && String(req.analysis_version) !== spec.version) {
    return { error: `${id} is at version ${spec.version}; requested ${String(req.analysis_version)}.` }
  }
  if (id === 'scenario_grid') return runScenarioGrid(req)

  const v = validateInputs(spec, req.inputs ?? {})
  if (v.errors.length) return { error: `Invalid inputs for ${id}.`, details: v.errors }

  const runId = runIdFor(id, spec.version, v.inputs)
  const cached = runStore.get(runId)
  if (cached) return cached

  let outputs: AnalysisOutputs
  try {
    outputs = spec.run(v.inputs)
  } catch (err) {
    return { error: `Analysis failed: ${err instanceof Error ? err.message : String(err)}` }
  }
  if (v.defaulted.length) {
    outputs.warnings = [
      ...outputs.warnings,
      `Defaults applied for: ${v.defaulted.map((k) => `${k}=${JSON.stringify(v.inputs[k])}`).join(', ')} — confirm they match the intended design.`,
    ]
  }
  const run: AnalysisRun = {
    run_id: runId,
    analysis_id: id,
    analysis_version: spec.version,
    status: 'succeeded',
    inputs: v.inputs,
    defaulted_fields: v.defaulted,
    derived_from: sanitizeDerivedFrom(req.derived_from),
    outputs,
    engine: engineStamp(),
    created_at: new Date().toISOString(),
  }
  runStore.set(runId, run)
  return run
}

/** The catalog as the API returns it: schemas without the run functions. */
export function catalog() {
  return specs.map((s) => ({
    analysis_id: s.analysis_id,
    version: s.version,
    title: s.title,
    design: s.design,
    alpha_sided: s.alpha_sided,
    method: s.method,
    reference_packages: s.reference_packages,
    fields: s.fields,
  }))
}
