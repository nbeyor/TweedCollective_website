/**
 * Deterministic normalization of an extracted design brief onto the corpus's
 * controlled vocabularies.
 *
 * Every corpus lookup is exact string equality (selectCohort, the criterion
 * attribution join, the assessment-operations join). The Haiku intake extract
 * copies verbatim document strings, so without this step an uploaded brief
 * only grounds when its wording happens to coincide with corpus vocabulary —
 * which in practice was only the corpus-generated NSCLC hero brief. The
 * extract prompt now asks the model to map onto these vocabularies itself;
 * this module is the deterministic server-side net under it, so a blank or
 * off-vocabulary value still resolves when the document supports it.
 *
 * Matching is intentionally conservative: exact (case-insensitive), then
 * containment, then a distinctive-token vote that must be unambiguous. A miss
 * returns '' — the honest "no mapping" the tools then surface — never a guess.
 */

import {
  assessmentOperations,
  criterionAttribution,
  protocols,
  vocabularies,
  type DesignBrief,
} from './trialCorpus'

// ------------------------------------------------------------ vocabularies ---

function vocabList(key: string): string[] {
  const raw = (vocabularies() as Record<string, unknown>)[key]
  return Array.isArray(raw) ? raw.map(String) : []
}

export const therapeuticAreas = (): string[] => vocabList('therapeutic_area')
export const phaseVocabulary = (): string[] => vocabList('phase')
export const siteTypeVocabulary = (): string[] => vocabList('site_type')

export function indicationVocabulary(): string[] {
  return Array.from(new Set(protocols().map((p) => String(p.indication)))).sort()
}

export function criterionVocabulary(): string[] {
  return Array.from(new Set(criterionAttribution().map((r) => String(r.criterion)))).sort()
}

export function assessmentVocabulary(): string[] {
  return Array.from(new Set(assessmentOperations().map((r) => String(r.assessment_name)))).sort()
}

// ------------------------------------------------------------------ helpers ---

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

/** Words too generic to identify an endpoint or criterion on their own. */
const STOP_TOKENS = new Set([
  'change', 'changes', 'from', 'baseline', 'proportion', 'participants', 'patients',
  'achieving', 'response', 'incidence', 'count', 'rate', 'score', 'total', 'time',
  'first', 'week', 'weeks', 'month', 'months', 'year', 'years', 'percent', 'with',
  'prior', 'severe', 'moderate', 'active', 'clinical', 'clinically', 'significant',
  'disease', 'history', 'within', 'least', 'adequate', 'documented', 'confirmed',
  'occurrence', 'annualized', 'observed', 'over', 'under', 'per', 'the', 'and',
  'serum', 'plasma', 'blood', 'test', 'status', 'assessment', 'questionnaire',
  'index', 'scale',
])

function distinctiveTokens(s: string): string[] {
  return norm(s)
    .split(/[^a-z0-9<>=%.-]+/)
    .filter((t) => t.length >= 3 && !STOP_TOKENS.has(t))
}

/**
 * Match free text to a controlled-vocabulary term. Exact → containment →
 * unambiguous distinctive-token vote. Returns '' on any ambiguity or miss.
 */
export function matchVocabulary(text: string, candidates: string[]): string {
  const t = norm(text)
  if (!t) return ''

  for (const c of candidates) if (norm(c) === t) return c
  const contained = candidates.filter((c) => {
    const n = norm(c)
    return n.includes(t) || t.includes(n)
  })
  if (contained.length === 1) return contained[0]
  if (contained.length > 1) {
    // Multiple candidates contain the text ("Asthma" → three asthma
    // indications): only a candidate the text itself contains — the text being
    // the more specific of the two — disambiguates. Otherwise stay unmatched.
    const specific = contained.filter((c) => t.includes(norm(c)))
    if (specific.length === 1) return specific[0]
    return ''
  }

  const tokens = distinctiveTokens(text)
  if (!tokens.length) return ''
  let best = ''
  let bestScore = 0
  let tie = false
  for (const c of candidates) {
    const ctokens = new Set(distinctiveTokens(c))
    const score = tokens.filter((tok) => ctokens.has(tok)).length
    if (score > bestScore) {
      best = c
      bestScore = score
      tie = false
    } else if (score === bestScore && score > 0 && c !== best) {
      tie = true
    }
  }
  return bestScore >= 1 && !tie ? best : ''
}

// -------------------------------------------------------- field normalizers ---

const TA_KEYWORDS: Array<[RegExp, string]> = [
  [
    /rheumat|arthrit|lupus|psoria|crohn|colitis|inflammat|immunolog|atopic|dermatit|eczema|\bibd\b|\bra\b/i,
    'Immunology & Inflammation',
  ],
  [
    /oncolog|cancer|carcinom|tumou?r|nsclc|sclc|myeloma|leuk[ae]mi|lymphoma|melanoma|metastat|neoplas/i,
    'Oncology',
  ],
  [
    /respirat|asthma|copd|pulmonar|fibrosis|cystic|bronch|eosinophil/i,
    'Respiratory',
  ],
  [
    /cardio|lipid|cholesterol|heart|diabet|obes|metabol|hypercholesterol|hefh|vascular|glyc[ae]mi/i,
    'Cardiometabolic',
  ],
  [
    /neurolog|alzheimer|parkinson|sclerosis|seizure|epilep|dementia|amyotrophic|migraine|cognitive/i,
    'Neurology',
  ],
]

/**
 * Resolve a corpus therapeutic area from whatever the document offers —
 * checked in the order given, so pass the most specific field first
 * (therapeutic_area, then disease_area, indication, title).
 */
export function normalizeTherapeuticArea(...texts: Array<string | undefined>): string {
  const areas = therapeuticAreas()
  const joined = texts.filter(Boolean).map(String)
  for (const t of joined) {
    const exact = matchVocabulary(t, areas)
    if (exact) return exact
    const n = norm(t)
    const contains = areas.find((a) => n.includes(norm(a)))
    if (contains) return contains
  }
  for (const t of joined) {
    for (const [re, area] of TA_KEYWORDS) if (re.test(t)) return area
  }
  return ''
}

const ROMAN: Array<[RegExp, string]> = [
  [/\biv\b/g, '4'],
  [/\biii\b/g, '3'],
  [/\bii\b/g, '2'],
  [/\bi\b/g, '1'],
]

/** "Phase 2", "Phase II", "2b", "Ph 2/3" → corpus phase value, or ''. */
export function normalizePhase(raw: string | undefined): string {
  if (!raw) return ''
  let t = norm(raw).replace(/phase|ph\b|\./g, ' ')
  for (const [re, digit] of ROMAN) t = t.replace(re, digit)
  t = t.replace(/([1-4])\s*[abc]\b/g, '$1')
  const vocab = phaseVocabulary()
  const split = t.match(/([1-4])\s*[/–—-]\s*([1-4])/)
  if (split) {
    const combined = `${split[1]}/${split[2]}`
    if (vocab.includes(combined)) return combined
  }
  const single = t.match(/[1-4]/)
  if (single && vocab.includes(single[0])) return single[0]
  return ''
}

export function normalizeIndication(raw: string | undefined): string {
  if (!raw) return ''
  return matchVocabulary(raw, indicationVocabulary())
}

const SITE_TYPE_KEYWORDS: Array<[RegExp, string]> = [
  [/academic|university|teaching/i, 'Academic Medical Center'],
  [/community/i, 'Community Hospital'],
  [/research|dedicated/i, 'Dedicated Research Site'],
  [/private|practice/i, 'Private Practice'],
  [/safety|public/i, 'Safety-Net / Public Hospital'],
]

/** Map free-text site-mix keys onto corpus site types; drop what can't map. */
export function normalizeSiteMix(raw: Record<string, number>): Record<string, number> {
  const canonical = siteTypeVocabulary()
  const out: Record<string, number> = {}
  for (const [key, weight] of Object.entries(raw)) {
    if (!Number.isFinite(weight) || weight <= 0) continue
    let mapped = matchVocabulary(key, canonical)
    if (!mapped) {
      for (const [re, st] of SITE_TYPE_KEYWORDS) {
        if (re.test(key)) {
          mapped = st
          break
        }
      }
    }
    if (mapped) out[mapped] = (out[mapped] ?? 0) + weight
  }
  return out
}

export function normalizeCriterion(text: string | undefined): string {
  if (!text) return ''
  return matchVocabulary(text, criterionVocabulary())
}

export function normalizeAssessment(text: string | undefined): string {
  if (!text) return ''
  return matchVocabulary(text, assessmentVocabulary())
}

// ------------------------------------------------------------- whole brief ---

/**
 * Normalize an extracted brief's lookup keys in place of guesswork: comparator
 * cohort (therapeutic area + phase), indication, criteria → corpus criterion
 * names, endpoint assessments → assessment-operations names, site-mix keys →
 * corpus site types. Verbatim display fields stay verbatim unless a mapping
 * resolves. Returns the notes describing what was mapped, for the model to
 * disclose. Idempotent — safe to run on every chat turn's client-echoed brief.
 */
export function normalizeBrief(brief: DesignBrief): { brief: DesignBrief; notes: string[] } {
  const notes: string[] = []

  const ta = normalizeTherapeuticArea(
    brief.therapeutic_area,
    brief.disease_area,
    brief.indication,
    brief.title
  )
  if (ta && ta !== brief.therapeutic_area) {
    notes.push(
      `Therapeutic area mapped to corpus area "${ta}"${brief.therapeutic_area ? ` (document says "${brief.therapeutic_area}")` : ''}.`
    )
  }

  const phase = normalizePhase(brief.phase)
  const indication = normalizeIndication(brief.indication)
  if (indication && indication !== brief.indication) {
    notes.push(`Indication matched to corpus indication "${indication}" (document says "${brief.indication}").`)
  }

  const siteMix = normalizeSiteMix(brief.site_mix)

  const criteria = brief.criteria.map((c) => {
    const mapped = normalizeCriterion(c.corpus_criterion) || normalizeCriterion(c.text)
    return mapped ? { ...c, corpus_criterion: mapped } : c
  })
  const mappedCriteria = criteria.filter((c, i) => c.corpus_criterion !== brief.criteria[i].corpus_criterion).length
  if (mappedCriteria) notes.push(`${mappedCriteria} eligibility criteria mapped to corpus criterion names.`)

  const mapEndpoint = <T extends { text: string; assessment: string }>(e: T): T => {
    const mapped = normalizeAssessment(e.assessment) || normalizeAssessment(e.text)
    return mapped ? { ...e, assessment: mapped } : e
  }

  const next: DesignBrief = {
    ...brief,
    therapeutic_area: ta || brief.therapeutic_area,
    indication: brief.indication,
    phase: phase || brief.phase,
    comparator_cohort: {
      therapeutic_area: ta || brief.comparator_cohort.therapeutic_area,
      disease_area: brief.comparator_cohort.disease_area,
      phase: phase ? [phase] : brief.comparator_cohort.phase,
      ...(indication ? { indication } : {}),
    },
    site_mix: Object.keys(siteMix).length ? siteMix : brief.site_mix,
    criteria,
    primary_endpoint: mapEndpoint(brief.primary_endpoint),
    secondary_endpoints: brief.secondary_endpoints.map(mapEndpoint),
    candidate_secondary_endpoints: brief.candidate_secondary_endpoints.map(mapEndpoint),
  }
  return { brief: next, notes }
}
