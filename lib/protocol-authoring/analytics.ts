/**
 * The Protocol Foundry's authoring analytics: the models behind the widget
 * classes the client's ProtocolForge demo carries (eligibility funnel, power
 * calculator, patient burden, country viability, regulatory requirements,
 * enrollment projection), rebuilt as deterministic functions so every figure
 * the model quotes traces to a computation over declared demo data.
 *
 * Everything here is synthetic demonstration content — the country pools,
 * rates, and regulatory items are illustrative, not empirical.
 */

import { SOA_MATRIX, SOA_PROCEDURES, SOA_VISITS } from './horizonSoA'

const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp

// ---------------------------------------------------------------- funnel ----

/**
 * US patient-pool funnel for the HORIZON eligibility criteria, adapted from
 * the client demo's funnel. Each step names the criterion that gates it so the
 * "most restrictive criterion" reads straight off the step-to-step retention.
 */
export const ELIGIBILITY_FUNNEL = [
  { step: 'US Stage IIIB/IV NSCLC incidence (annual)', criterion: null, remaining: 136900 },
  { step: 'Stage IV at diagnosis, treatment-eligible', criterion: 'cri-histology', remaining: 89000 },
  { step: 'PD-L1 TPS ≥ 50% (central 22C3)', criterion: 'cri-pdl1', remaining: 40050 },
  { step: 'No actionable EGFR/ALK alteration', criterion: null, remaining: 33640 },
  { step: 'Treatment-naïve for metastatic disease', criterion: 'cri-treatment-naive', remaining: 27500 },
  { step: 'ECOG 0–1', criterion: 'cri-ecog', remaining: 23830 },
  { step: 'Adequate organ function', criterion: 'cri-organ', remaining: 20970 },
  { step: 'Clears all exclusion criteria', criterion: null, remaining: 15728 },
  { step: 'Willing, consented, within site reach', criterion: null, remaining: 4718 },
] as const

export function eligibilityFunnel() {
  const steps = ELIGIBILITY_FUNNEL.map((s, i) => {
    const prev = i === 0 ? s.remaining : ELIGIBILITY_FUNNEL[i - 1].remaining
    return {
      step: s.step,
      criterion_id: s.criterion,
      remaining: s.remaining,
      retained_pct_of_previous: round((s.remaining / prev) * 100, 1),
      retained_pct_of_pool: round((s.remaining / ELIGIBILITY_FUNNEL[0].remaining) * 100, 1),
    }
  })
  // Most-restrictive is judged over criterion-gated steps only — the tail
  // (willingness, consent, site reach) is an access artifact, not a design
  // choice the team can trade against.
  const criterionSteps = steps.filter((s) => s.criterion_id)
  const worst = criterionSteps.reduce((a, b) =>
    b.retained_pct_of_previous < a.retained_pct_of_previous ? b : a
  )
  return {
    scope: 'United States, annual incident pool',
    steps,
    eligible_pool: ELIGIBILITY_FUNNEL[ELIGIBILITY_FUNNEL.length - 2].remaining,
    reachable_pool: ELIGIBILITY_FUNNEL[ELIGIBILITY_FUNNEL.length - 1].remaining,
    most_restrictive_step: worst.step,
    most_restrictive_loss_pct: round(100 - worst.retained_pct_of_previous, 1),
    note: 'Synthetic US funnel for the HORIZON eligibility set. The PD-L1 TPS ≥ 50% gate removes ~55% of the treatment-eligible pool — the single largest cut. Step-to-step retention is multiplicative; figures are illustrative.',
  }
}

// ----------------------------------------------------------------- power ----

/** Inverse-normal quantiles for the alpha/power values a design realistically uses. */
const Z: Record<string, number> = {
  '0.01': 2.3263,
  '0.02': 2.0537,
  '0.025': 1.96,
  '0.05': 1.6449,
  '0.1': 1.2816,
  '0.15': 1.0364,
  '0.2': 0.8416,
}

function zFor(p: number): number {
  const key = String(p)
  if (Z[key] != null) return Z[key]
  // Nearest declared quantile — inputs outside the table get the closest match
  // rather than a silent extrapolation.
  const entries = Object.entries(Z).map(([k, v]) => [Number(k), v] as const)
  entries.sort((a, b) => Math.abs(a[0] - p) - Math.abs(b[0] - p))
  return entries[0][1]
}

/**
 * Schoenfeld events formula for a 1:1 randomized time-to-event comparison:
 * d = 4 · (z_α + z_β)² / ln²(HR). The workhorse behind "how many PFS/OS
 * events does this design need, and what happens if the true effect is
 * smaller than hoped".
 */
export function requiredEvents(hr: number, alphaOneSided: number, power: number): number {
  const za = zFor(alphaOneSided)
  const zb = zFor(round(1 - power, 2))
  return Math.ceil((4 * (za + zb) ** 2) / Math.log(hr) ** 2)
}

/** Power achieved at a given event count for a true hazard ratio (1:1). */
export function powerAtEvents(hr: number, events: number, alphaOneSided: number): number {
  const za = zFor(alphaOneSided)
  const zb = Math.sqrt(events / 4) * Math.abs(Math.log(hr)) - za
  // Normal CDF via Abramowitz-Stegun approximation.
  const t = 1 / (1 + 0.2316419 * Math.abs(zb))
  const d = 0.3989423 * Math.exp((-zb * zb) / 2)
  let p = 1 - d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
  if (zb < 0) p = 1 - p
  return round(p * 100, 1)
}

export interface PowerInput {
  endpoint?: 'PFS' | 'OS'
  hazard_ratio?: number
  alpha_one_sided?: number
  power?: number
  dropout_rate?: number
}

/**
 * The design's planned operating characteristics, plus the sensitivity curve:
 * power across a hazard-ratio range at the planned event count, and the
 * randomized-N inflation dropout forces. Defaults are HORIZON's planned PFS
 * design (HR 0.70, 90% power, one-sided α 0.025 within the hierarchy).
 */
export function powerAnalysis(input: PowerInput = {}) {
  const endpoint = input.endpoint ?? 'PFS'
  const planned =
    endpoint === 'OS'
      ? { hr: 0.76, power: 0.85, eventFraction: 0.65 }
      : { hr: 0.7, power: 0.9, eventFraction: 0.78 }
  const hr = input.hazard_ratio ?? planned.hr
  const alpha = input.alpha_one_sided ?? 0.025
  const power = input.power ?? planned.power
  const dropout = input.dropout_rate ?? 0.15

  const events = requiredEvents(hr, alpha, power)
  // Participants needed so the required events accrue within the planned
  // follow-up, at the endpoint's expected event fraction, then dropout-inflated.
  const evaluableN = Math.ceil(events / planned.eventFraction)
  const randomizedN = Math.ceil(evaluableN / (1 - dropout))

  const hrGrid = [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9]
  const curve = hrGrid.map((h) => ({ hr: h, power_pct: powerAtEvents(h, events, alpha) }))

  return {
    endpoint,
    design: {
      target_hazard_ratio: hr,
      alpha_one_sided: alpha,
      power_pct: round(power * 100, 0),
      required_events: events,
      expected_event_fraction: planned.eventFraction,
      evaluable_n: evaluableN,
      dropout_rate_pct: round(dropout * 100, 0),
      randomized_n_required: randomizedN,
      planned_n: 600,
    },
    power_curve_at_planned_events: curve,
    note: `Schoenfeld approximation, 1:1 allocation, one-sided α=${alpha} (as allotted in the hierarchical testing scheme). Power curve holds events fixed at ${events} and varies the true hazard ratio — the fragility read: if the true ${endpoint} HR is ${round(hr + 0.05, 2)} instead of ${hr}, power falls to ${powerAtEvents(round(hr + 0.05, 2), events, alpha)}%.`,
  }
}

// --------------------------------------------------------------- burden -----

const CATEGORY_LABELS: Record<string, string> = {
  regulatory: 'Consent & regulatory',
  assessment: 'Clinical assessments',
  vital_signs: 'Vitals',
  cardiac: 'Cardiac',
  laboratory: 'Laboratory',
  biomarker: 'Biomarkers & tissue',
  imaging: 'Imaging',
  treatment: 'Treatment administration',
  pk: 'Pharmacokinetics',
  immunogenicity: 'Immunogenicity',
  pro: 'Patient-reported outcomes',
  safety: 'Safety monitoring',
  follow_up: 'Follow-up',
}

/**
 * Patient- and site-burden model computed over the SoA grid: per-visit burden
 * point totals (each procedure carries a 0–5 patient and site weight), the
 * heaviest visits called out, and the category composition of total burden.
 */
export function patientBurden() {
  const procById = new Map(SOA_PROCEDURES.map((p) => [p.id, p]))
  const visits = SOA_VISITS.map((v) => {
    let pt = 0
    let site = 0
    let count = 0
    const heavy: string[] = []
    for (const [pid, visitIds] of Object.entries(SOA_MATRIX)) {
      if (!visitIds.includes(v.id)) continue
      const proc = procById.get(pid)
      if (!proc) continue
      pt += proc.burdenPt
      site += proc.burdenSite
      count += 1
      if (proc.burdenPt >= 4) heavy.push(proc.name)
    }
    return {
      visit: v.name,
      code: v.code,
      week: v.week,
      window: v.window,
      procedures: count,
      patient_burden_points: pt,
      site_burden_points: site,
      heavy_procedures: heavy,
    }
  })

  const byCategory = new Map<string, number>()
  for (const [pid, visitIds] of Object.entries(SOA_MATRIX)) {
    const proc = procById.get(pid)
    if (!proc) continue
    byCategory.set(proc.category, (byCategory.get(proc.category) ?? 0) + proc.burdenPt * visitIds.length)
  }
  const totalPt = visits.reduce((a, v) => a + v.patient_burden_points, 0)
  const categories = Array.from(byCategory.entries())
    .map(([key, points]) => ({
      category: CATEGORY_LABELS[key] ?? key,
      burden_points: points,
      share_pct: round((points / totalPt) * 100, 1),
    }))
    .sort((a, b) => b.burden_points - a.burden_points)

  const worst = visits.reduce((a, b) => (b.patient_burden_points > a.patient_burden_points ? b : a))
  return {
    total_patient_burden_points: Math.round(totalPt),
    total_site_burden_points: Math.round(visits.reduce((a, v) => a + v.site_burden_points, 0)),
    // Demo reference band in the same units as the total (points over the
    // whole SoA): comparable Phase 3 oncology grids land ~320–350.
    phase3_oncology_benchmark_range: [320, 350],
    visits,
    categories,
    heaviest_visit: {
      visit: worst.visit,
      code: worst.code,
      patient_burden_points: worst.patient_burden_points,
      heavy_procedures: worst.heavy_procedures,
    },
    note: 'Burden points sum each procedure’s 0–5 weight over the visits it appears in (SoA grid). The benchmark range is the demo’s Phase 3 oncology reference band. A visit stacking imaging + tissue + serial PK is the classic split-across-two-visits candidate.',
  }
}

// ------------------------------------------------------------- countries ----

export interface CountryRow {
  code: string
  name: string
  sites: number
  enrollment_share: number
  viability_score: number
  eligible_pool: number
  enrollment_rate_pt_site_month: number
  reg_risk: 'low' | 'medium' | 'high'
  startup_months: number
}

/** Country footprint demo data, ported from the client's country viability widget. */
export const COUNTRY_VIABILITY: CountryRow[] = [
  { code: 'US', name: 'United States', sites: 45, enrollment_share: 180, viability_score: 92, eligible_pool: 42000, enrollment_rate_pt_site_month: 0.8, reg_risk: 'low', startup_months: 4.5 },
  { code: 'DE', name: 'Germany', sites: 25, enrollment_share: 90, viability_score: 87, eligible_pool: 18500, enrollment_rate_pt_site_month: 0.65, reg_risk: 'medium', startup_months: 5.5 },
  { code: 'JP', name: 'Japan', sites: 30, enrollment_share: 100, viability_score: 84, eligible_pool: 28000, enrollment_rate_pt_site_month: 0.55, reg_risk: 'medium', startup_months: 7 },
  { code: 'AU', name: 'Australia', sites: 12, enrollment_share: 45, viability_score: 80, eligible_pool: 5200, enrollment_rate_pt_site_month: 0.7, reg_risk: 'low', startup_months: 4 },
  { code: 'KR', name: 'South Korea', sites: 15, enrollment_share: 65, viability_score: 78, eligible_pool: 12800, enrollment_rate_pt_site_month: 0.6, reg_risk: 'low', startup_months: 5 },
  { code: 'PL', name: 'Poland', sites: 18, enrollment_share: 75, viability_score: 74, eligible_pool: 9600, enrollment_rate_pt_site_month: 0.75, reg_risk: 'medium', startup_months: 6 },
  { code: 'BR', name: 'Brazil', sites: 15, enrollment_share: 45, viability_score: 61, eligible_pool: 11200, enrollment_rate_pt_site_month: 0.5, reg_risk: 'high', startup_months: 9 },
]

export function countryViability() {
  const totalSites = COUNTRY_VIABILITY.reduce((a, c) => a + c.sites, 0)
  const totalEnrollment = COUNTRY_VIABILITY.reduce((a, c) => a + c.enrollment_share, 0)
  return {
    planned_countries: COUNTRY_VIABILITY.map((c) => ({
      ...c,
      enrollment_share_pct: round((c.enrollment_share / totalEnrollment) * 100, 1),
    })),
    total_sites: totalSites,
    total_planned_enrollment: totalEnrollment,
    note: 'Viability blends eligible pool, per-site enrollment rate, startup time, and regulatory risk (synthetic demo scores). Brazil scores lowest: slowest startup (~9 months, ANVISA import licensing) against a mid-size pool.',
  }
}

// ------------------------------------------------------------ regulatory ----

export interface RegItem {
  country: string
  type: string
  severity: 'blocker' | 'warning' | 'info'
  title: string
  impact: string
}

/** Country regulatory requirement flags, ported from the client demo. */
export const REGULATORY_ITEMS: RegItem[] = [
  { country: 'Brazil', type: 'Import/Export', severity: 'blocker', title: 'ANVISA import license required 90+ days before first shipment', impact: '+12 wk' },
  { country: 'Brazil', type: 'Ethics', severity: 'warning', title: 'CONEP review required for internationally sponsored immunotherapy trials', impact: '+8 wk' },
  { country: 'Brazil', type: 'Post-Study Access', severity: 'warning', title: 'Post-study access obligation for responding participants (RDC 9/2015)', impact: 'Budget' },
  { country: 'Germany', type: 'Data Privacy', severity: 'warning', title: 'GDPR: DPA approval needed for pseudonymized data transfer outside the EEA', impact: '+4 wk' },
  { country: 'Germany', type: 'Insurance', severity: 'info', title: 'Clinical trial insurance mandatory per AMG §40', impact: 'Budget' },
  { country: 'Japan', type: 'Labeling', severity: 'warning', title: 'Japanese-language labeling required for all study drug packaging', impact: '+3 wk' },
  { country: 'Japan', type: 'Ethics', severity: 'info', title: 'PMDA pre-consultation recommended for foreign-sponsored Phase 3', impact: '+6 wk' },
  { country: 'Japan', type: 'Data Privacy', severity: 'warning', title: 'APPI: separate consent for cross-border health data transfer', impact: '+2 wk' },
  { country: 'Poland', type: 'Ethics', severity: 'info', title: 'Bioethics Committee opinion and URPL approval both required', impact: '+4 wk' },
  { country: 'South Korea', type: 'Import/Export', severity: 'info', title: 'MFDS import notification per shipment of investigational product', impact: '+1 wk' },
  { country: 'United States', type: 'Safety Reporting', severity: 'info', title: 'IND safety reporting per 21 CFR 312.32; irAE SUSARs within 15 days', impact: 'Process' },
  { country: 'Australia', type: 'Ethics', severity: 'info', title: 'CTN scheme notification to TGA after HREC approval', impact: '+2 wk' },
  { country: 'Global', type: 'Format', severity: 'warning', title: 'ICH M11 CeSHarP structure expected for new protocol submissions from 2027 — current draft sections map but need template harmonization', impact: 'Authoring' },
]

export function regulatoryRequirements(country?: string) {
  const items = country
    ? REGULATORY_ITEMS.filter((i) => i.country.toLowerCase() === country.toLowerCase() || i.country === 'Global')
    : REGULATORY_ITEMS
  const counts = {
    blockers: items.filter((i) => i.severity === 'blocker').length,
    warnings: items.filter((i) => i.severity === 'warning').length,
    info: items.filter((i) => i.severity === 'info').length,
  }
  return {
    scope: country ?? 'all planned countries',
    ...counts,
    items,
    critical_path: items.find((i) => i.severity === 'blocker')?.title ?? 'No blockers in scope',
    note: 'Synthetic regulatory flags per planned country. Lead-time impacts are additive to that country’s site activation only, not the global timeline, unless the country anchors an enrollment floor.',
  }
}

// ------------------------------------------------------------ enrollment ----

export interface EnrollmentInput {
  scenario_rate_multiplier?: number
  screen_fail_rate?: number
  sites_override?: number
}

/**
 * Site-activation-ramped enrollment projection: countries activate sites
 * linearly over their startup window, each active site enrolls at its
 * country rate. Returns the month-by-month cumulative curve for slower /
 * planned / faster scenarios and the month target enrollment is reached.
 */
export function enrollmentProjection(input: EnrollmentInput = {}) {
  const target = 600
  const screenFail = input.screen_fail_rate ?? 0.42

  const simulate = (multiplier: number, sitesScale = 1) => {
    let month = 0
    let cumulative = 0
    const curve: Array<{ month: number; randomized: number }> = []
    while (cumulative < target && month < 48) {
      month += 1
      let monthly = 0
      for (const c of COUNTRY_VIABILITY) {
        const sites = c.sites * sitesScale
        // Linear activation ramp: all sites active by startup_months + 6.
        const rampEnd = c.startup_months + 6
        const active =
          month <= c.startup_months
            ? 0
            : Math.min(sites, sites * ((month - c.startup_months) / (rampEnd - c.startup_months)))
        monthly += active * c.enrollment_rate_pt_site_month * multiplier
      }
      cumulative = Math.min(target, cumulative + monthly)
      curve.push({ month, randomized: Math.round(cumulative) })
    }
    return { months_to_target: cumulative >= target ? month : null, curve }
  }

  const sitesScale = input.sites_override ? input.sites_override / 160 : 1
  const planned = simulate(input.scenario_rate_multiplier ?? 1, sitesScale)
  const slower = simulate((input.scenario_rate_multiplier ?? 1) * 0.75, sitesScale)
  const faster = simulate((input.scenario_rate_multiplier ?? 1) * 1.25, sitesScale)

  return {
    target_randomized: target,
    assumed_screen_fail_rate_pct: round(screenFail * 100, 0),
    screened_required: Math.round(target / (1 - screenFail)),
    scenarios: {
      planned: { months_to_target: planned.months_to_target, label: 'Planned rates' },
      slower: { months_to_target: slower.months_to_target, label: 'Rates −25%' },
      faster: { months_to_target: faster.months_to_target, label: 'Rates +25%' },
    },
    curves: {
      planned: planned.curve,
      slower: slower.curve,
      faster: faster.curve,
    },
    note: 'Deterministic ramp model over the planned country footprint: sites activate linearly after each country’s startup window and enroll at its per-site monthly rate. Synthetic planning scaffold, not a forecast.',
  }
}
