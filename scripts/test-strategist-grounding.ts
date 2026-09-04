/**
 * Acceptance tests for Protocol Strategist grounding across therapeutic areas.
 *
 * Run with:  npm run test:grounding   (npx tsx scripts/test-strategist-grounding.ts)
 *
 * Regression for the RA "no information" failure: an uploaded brief whose
 * wording shares nothing with corpus vocabulary must still resolve a comparator
 * cohort and return non-degenerate cost, timeline, criteria, and endpoint
 * figures — with the widened scope and assumptions disclosed — while the hero
 * NSCLC path keeps its exact, unwidened behavior.
 */

import assert from 'node:assert/strict'

import { normalizeExtractedBrief } from '../lib/strategistExtract'
import {
  baselineEnrollment,
  criteriaWaterfall,
  designBrief,
  deriveBriefFromProtocol,
  endpointSensitivity,
  resolveComparatorCohort,
  trialCostModel,
} from '../lib/trialCorpus'

let failures = 0
let checks = 0

function check(label: string, ok: boolean, detail?: string) {
  checks++
  if (!ok) {
    failures++
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
  } else {
    console.log(`  ok    ${label}`)
  }
}

// ------------------------------------------------ RA upload-shaped brief ----

console.log('RA upload grounds end to end')

const { brief: ra } = normalizeExtractedBrief(
  {
    title: 'TCX-0028 — RA Phase 2 (working notes)',
    therapeutic_area: '',
    indication: 'rheumatoid arthritis',
    phase: 'Phase 2',
    target_enrollment: 0,
    target_enrollment_range: { low: 180, high: 220 },
    planned_sites: 0,
    arms: [{ name: 'TCX-0028 + MTX' }, { name: 'Placebo + MTX' }],
    primary_endpoint: { text: 'ACR20 at Week 12', assessment: '' },
    secondary_endpoints: [
      { text: 'DAS28-CRP', assessment: '' },
      { text: 'HAQ-DI', assessment: '' },
    ],
    criteria: [
      { type: 'Inclusion', text: '≥ 6 swollen and ≥ 6 tender joints' },
      { type: 'Exclusion', text: 'Prior exposure to biologic therapy' },
    ],
    soa_sketch: [],
  },
  { fileName: 'ra-notes.docx', briefId: 'UPLOAD-ra-grounding' }
)

{
  const rc = resolveComparatorCohort(ra)
  check('comparator cohort is non-empty', rc.cohort.length > 0, `got ${rc.cohort.length}`)
  check('cohort widening is labelled', rc.widened && /widened/.test(rc.scope), rc.scope)
  check(
    'cohort stays in the right therapeutic area',
    rc.cohort.every((p) => p.therapeutic_area === 'Immunology & Inflammation'),
    rc.scope
  )
}

{
  const base = baselineEnrollment(ra)
  check('baseline enrollment months grounded', base.comparator_n > 0 && base.baseline_enrollment_months > 0)
  check('baseline reports cohort scope', typeof base.cohort_scope === 'string' && base.cohort_scope.length > 0)
}

{
  const cost = trialCostModel(ra)
  check('cost model finds comparators', cost.comparator_n > 0, `comparator_n ${cost.comparator_n}`)
  check(
    'cost totals are non-degenerate',
    cost.headline.per_patient_usd > 0 && cost.headline.total_study_cost_usd > 0,
    JSON.stringify(cost.headline)
  )
  check(
    'missing sites / site mix disclosed as assumptions',
    Array.isArray(cost.assumptions) && cost.assumptions.length >= 2,
    JSON.stringify(cost.assumptions)
  )
}

{
  const wf = criteriaWaterfall(ra)
  check(
    'waterfall reads the immunology attribution slice',
    wf.attribution_therapeutic_area === 'Immunology & Inflammation'
  )
  const matched = wf.criteria.filter((c) => c.matched)
  check('at least one criterion carries measured attribution', matched.length >= 1)
  check(
    'unmatched criteria flagged, not silently zero',
    wf.criteria.every((c) => typeof c.matched === 'boolean') &&
      (wf.criteria.some((c) => !c.matched) ? /UNKNOWN/i.test(wf.note) : true)
  )
}

{
  const eps = endpointSensitivity(ra, [
    ra.primary_endpoint.assessment,
    ...ra.secondary_endpoints.map((e) => e.assessment),
  ])
  check(
    'RA endpoints resolve in assessment operations',
    eps.per_endpoint.every((e) => e.resolved),
    JSON.stringify(eps.per_endpoint.map((e) => [e.assessment, e.resolved]))
  )
  check(
    'endpoint lock contributions are non-zero',
    eps.per_endpoint.every((e) => e.db_lock_contribution_days > 0)
  )
}

{
  const eps = endpointSensitivity(ra, ['Some endpoint the corpus has never heard of'])
  const withVocab = eps as { unresolved_assessments?: string[]; available_assessments?: string[] }
  check(
    'unknown assessment returns the available vocabulary',
    Array.isArray(withVocab.unresolved_assessments) &&
      withVocab.unresolved_assessments.length === 1 &&
      Array.isArray(withVocab.available_assessments) &&
      withVocab.available_assessments.length >= 58
  )
}

// -------------------------------------------------- hero NSCLC regression ---

console.log('hero NSCLC brief keeps exact, unwidened grounding')

{
  const hero = designBrief()
  const rc = resolveComparatorCohort(hero)
  check('hero cohort not widened', !rc.widened, rc.scope)
  check('hero cohort is the Oncology Phase 2/2-3 slice', rc.cohort.length >= 20, `got ${rc.cohort.length}`)

  const cost = trialCostModel(hero)
  check('hero cost has no substituted assumptions', !('assumptions' in cost) || !cost.assumptions?.length)
  check('hero cost totals unchanged in shape', cost.headline.total_study_cost_usd > 0)

  const wf = criteriaWaterfall(hero)
  check('hero criteria all matched', wf.criteria.every((c) => c.matched))
}

// ------------------------------------------- corpus picker-path regression ---

console.log('corpus protocol brief (picker path) endpoints now resolve')

{
  const brief = deriveBriefFromProtocol('TCX-0028')
  assert(brief, 'TCX-0028 exists in the corpus')
  const eps = endpointSensitivity(brief, [
    brief.primary_endpoint.assessment,
    ...brief.secondary_endpoints.map((e) => e.assessment),
  ].filter(Boolean))
  check(
    'TCX-0028 endpoints resolve against assessment operations',
    eps.per_endpoint.length > 0 && eps.per_endpoint.every((e) => e.resolved),
    JSON.stringify(eps.per_endpoint.map((e) => [e.assessment, e.resolved]))
  )
}

console.log(`\n${checks - failures}/${checks} checks passed`)
if (failures) process.exit(1)
