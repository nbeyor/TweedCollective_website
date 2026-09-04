/**
 * One-shot Haiku extract: uploaded design-brief text → existing DesignBrief
 * schema. This is ETL, not a second intelligence product — copy what is
 * stated, leave gaps empty, list present vs missing. The Opus tool loop is
 * the strategist; this step only fills the left-panel brief.
 */

import Anthropic from '@anthropic-ai/sdk'

import {
  assessmentVocabulary,
  criterionVocabulary,
  indicationVocabulary,
  normalizeBrief,
  phaseVocabulary,
  therapeuticAreas,
} from './strategistNormalize'
import type { DesignBrief } from './trialCorpus'

/** Repo Haiku id for cheap structured extract. Same ANTHROPIC_API_KEY as Opus. */
export const EXTRACT_MODEL = 'claude-haiku-4-5-20251001'

export const SOURCE_TEXT_CAP = 60_000

export interface BriefCoverage {
  present: string[]
  missing: string[]
}

export interface ExtractResult {
  brief: DesignBrief
  coverage: BriefCoverage
  /** Remaining source text, attached only when the extract is thin. */
  sourceText: string | null
  thin: boolean
  model: string
}

const COVERAGE_FIELDS = [
  'indication',
  'phase',
  'arms',
  'primary_endpoint',
  'eligibility',
  'soa',
  'enrollment',
  'sites',
] as const

function buildExtractSystem(): string {
  return `You extract a clinical-trial design brief from a document. This is ETL, not analysis.

Rules:
- Copy only what the document states. Do not invent arms, endpoints, criteria, numbers, or a schedule.
- If a field is absent or ambiguous, leave it empty ("" / [] / 0) and list it under coverage.missing.
- coverage.present / coverage.missing use these keys only: ${COVERAGE_FIELDS.join(', ')}.
- Prefer short verbatim phrases over paraphrase — EXCEPT the classification fields below, which map onto controlled vocabularies so downstream lookups resolve.
- eligibility: each criterion is inclusion or exclusion as labeled in the source; if unlabeled, use the source wording and type "Unspecified".
- Do not recommend, score, or pressure-test anything. Do not fill gaps from general knowledge.

Classification fields (choose from the vocabulary; this is categorization of what the document states, not invention):
- therapeutic_area: the corpus area the trial's indication belongs to. One of: ${therapeuticAreas().join(' | ')}. A rheumatoid-arthritis trial is "Immunology & Inflammation" even if the document says "Rheumatology"; leave "" only when the indication is genuinely unclassifiable.
- phase: one of ${phaseVocabulary().join(' | ')} (map "Phase II" → "2", "2b" → "2", and so on).
- target_enrollment_range: when the document states a range ("180–220"), put low and high here and leave target_enrollment 0. When it states one number, use target_enrollment.
- criteria[].corpus_criterion: the closest name from the criterion vocabulary below, or "" when nothing is close. The criterion's own "text" stays verbatim from the document.
- endpoints' "assessment": the closest name from the assessment vocabulary below, or "" when nothing is close. The endpoint's "text" stays verbatim.

Known indications in the comparator corpus (for context only; "indication" itself stays verbatim from the document):
${indicationVocabulary().join('; ')}

Criterion vocabulary:
${criterionVocabulary().join('\n')}

Assessment vocabulary:
${assessmentVocabulary().join('\n')}`
}

function buildExtractTool(): Anthropic.Tool {
  return {
  name: 'emit_design_brief',
  description:
    'Emit the extracted design brief and a present/missing coverage list. ETL only — no invented content.',
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: [
      'title',
      'indication',
      'phase',
      'target_enrollment',
      'planned_sites',
      'arms',
      'primary_endpoint',
      'criteria',
      'soa_sketch',
      'coverage',
    ],
    properties: {
      title: { type: 'string' },
      therapeutic_area: {
        type: 'string',
        enum: [...therapeuticAreas(), ''],
        description: 'Corpus therapeutic area the indication belongs to; "" only if unclassifiable.',
      },
      disease_area: { type: 'string' },
      indication: { type: 'string' },
      line_of_treatment: { type: 'string' },
      phase: {
        type: 'string',
        enum: [...phaseVocabulary(), ''],
        description: 'Normalized phase ("Phase II" → "2"); "" if not stated.',
      },
      target_enrollment: { type: 'number' },
      target_enrollment_range: {
        type: 'object',
        description: 'Only when the document states a range (e.g. "180–220"); leave target_enrollment 0 then.',
        properties: { low: { type: 'number' }, high: { type: 'number' } },
      },
      planned_sites: { type: 'number' },
      randomization: { type: 'string' },
      site_mix: {
        type: 'object',
        additionalProperties: { type: 'number' },
      },
      arms: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name'],
          properties: { id: { type: 'string' }, name: { type: 'string' } },
        },
      },
      primary_endpoint: {
        type: 'object',
        required: ['text'],
        properties: {
          id: { type: 'string' },
          text: { type: 'string' },
          assessment: { type: 'string' },
        },
      },
      secondary_endpoints: {
        type: 'array',
        items: {
          type: 'object',
          required: ['text'],
          properties: {
            id: { type: 'string' },
            text: { type: 'string' },
            assessment: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
      candidate_secondary_endpoints: {
        type: 'array',
        items: {
          type: 'object',
          required: ['text'],
          properties: {
            id: { type: 'string' },
            text: { type: 'string' },
            assessment: { type: 'string' },
          },
        },
      },
      criteria: {
        type: 'array',
        items: {
          type: 'object',
          required: ['type', 'text'],
          properties: {
            id: { type: 'string' },
            type: { type: 'string' },
            category: { type: 'string' },
            text: { type: 'string' },
            corpus_criterion: {
              type: 'string',
              description:
                'Closest name from the criterion vocabulary in the system prompt; "" when nothing is close.',
            },
          },
        },
      },
      soa_sketch: { type: 'array', items: { type: 'string' } },
      coverage: {
        type: 'object',
        required: ['present', 'missing'],
        properties: {
          present: { type: 'array', items: { type: 'string' } },
          missing: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  },
  }
}

function clip(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.replace(/\s+/g, ' ').trim().slice(0, max)
}

function clipList(raw: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((x) => clip(x, maxLen))
    .filter(Boolean)
    .slice(0, maxItems)
}

function num(raw: unknown): number {
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(Math.round(n), 1_000_000)
}

function slugId(prefix: string, i: number, given?: unknown): string {
  const g = clip(given, 64)
  if (g && /^[a-zA-Z0-9._:-]+$/.test(g)) return g
  return `${prefix}-${i}`
}

function deriveCoverage(brief: DesignBrief, raw?: unknown): BriefCoverage {
  const fromModel =
    raw && typeof raw === 'object'
      ? {
          present: clipList((raw as { present?: unknown }).present, 12, 40),
          missing: clipList((raw as { missing?: unknown }).missing, 12, 40),
        }
      : { present: [] as string[], missing: [] as string[] }

  const inferred: Record<(typeof COVERAGE_FIELDS)[number], boolean> = {
    indication: Boolean(brief.indication),
    phase: Boolean(brief.phase),
    arms: brief.arms.length > 0,
    primary_endpoint: Boolean(brief.primary_endpoint.text),
    eligibility: brief.criteria.length > 0,
    soa: brief.soa_sketch.length > 0,
    enrollment: brief.target_enrollment > 0,
    sites: brief.planned_sites > 0,
  }

  const present = COVERAGE_FIELDS.filter((k) => inferred[k] || fromModel.present.includes(k))
  const missing = COVERAGE_FIELDS.filter((k) => !inferred[k])
  return { present: [...present], missing: [...missing] }
}

export function isThinExtract(brief: DesignBrief, coverage: BriefCoverage): boolean {
  const gaps = [
    !brief.indication,
    !brief.phase,
    brief.arms.length === 0,
    !brief.primary_endpoint.text,
    brief.criteria.length === 0,
    brief.soa_sketch.length === 0,
    brief.target_enrollment <= 0,
  ]
  return gaps.filter(Boolean).length >= 3 || coverage.missing.length >= 4
}

/**
 * Map a raw model (or fixture) payload onto DesignBrief. Used by the live
 * Haiku call and by tests — this is the contract the left panel and tools
 * consume.
 */
export function normalizeExtractedBrief(
  raw: unknown,
  opts?: { fileName?: string; briefId?: string }
): { brief: DesignBrief; coverage: BriefCoverage } {
  const rec = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const fileStem = (opts?.fileName ?? 'uploaded-brief').replace(/\.docx$/i, '').slice(0, 80)
  const briefId = opts?.briefId ?? `UPLOAD-${Date.now().toString(36)}`

  const armsRaw = Array.isArray(rec.arms) ? rec.arms : []
  const arms = armsRaw
    .filter((a): a is Record<string, unknown> => Boolean(a) && typeof a === 'object')
    .slice(0, 10)
    .map((a, i) => ({
      id: slugId('arm', i, a.id),
      name: clip(a.name, 300),
    }))
    .filter((a) => a.name)

  const pe = rec.primary_endpoint && typeof rec.primary_endpoint === 'object'
    ? (rec.primary_endpoint as Record<string, unknown>)
    : {}

  const secondary = (Array.isArray(rec.secondary_endpoints) ? rec.secondary_endpoints : [])
    .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
    .slice(0, 10)
    .map((e, i) => ({
      id: slugId('ep-sec', i, e.id),
      text: clip(e.text, 500),
      assessment: clip(e.assessment, 300),
      status: clip(e.status, 40) || 'included',
    }))
    .filter((e) => e.text)

  const candidates = (Array.isArray(rec.candidate_secondary_endpoints)
    ? rec.candidate_secondary_endpoints
    : []
  )
    .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === 'object')
    .slice(0, 10)
    .map((e, i) => ({
      id: slugId('ep-cand', i, e.id),
      text: clip(e.text, 500),
      assessment: clip(e.assessment, 300),
    }))
    .filter((e) => e.text)

  const criteria = (Array.isArray(rec.criteria) ? rec.criteria : [])
    .filter((c): c is Record<string, unknown> => Boolean(c) && typeof c === 'object')
    .slice(0, 40)
    .map((c, i) => ({
      id: slugId('cri', i, c.id),
      type: clip(c.type, 40) || 'Unspecified',
      category: clip(c.category, 80),
      text: clip(c.text, 800),
      corpus_criterion: clip(c.corpus_criterion, 300) || clip(c.text, 300),
    }))
    .filter((c) => c.text)

  const siteMix: Record<string, number> = {}
  if (rec.site_mix && typeof rec.site_mix === 'object' && !Array.isArray(rec.site_mix)) {
    for (const [k, v] of Object.entries(rec.site_mix as Record<string, unknown>)) {
      const n = Number(v)
      if (k && Number.isFinite(n) && n > 0) siteMix[clip(k, 80)] = n
    }
  }

  const indication = clip(rec.indication, 200)
  const title = clip(rec.title, 240) || (indication ? `${indication} — design brief` : fileStem)

  // Enrollment stated as a range collapses to its midpoint, disclosed as an
  // assumption — "maybe 180–220" must not size the study at N=0.
  const notes: string[] = []
  let targetEnrollment = num(rec.target_enrollment)
  if (!targetEnrollment && rec.target_enrollment_range && typeof rec.target_enrollment_range === 'object') {
    const r = rec.target_enrollment_range as Record<string, unknown>
    const low = num(r.low)
    const high = num(r.high)
    if (low > 0 && high >= low) {
      targetEnrollment = Math.round((low + high) / 2)
      notes.push(
        `Target enrollment stated as a range (${low}–${high}); midpoint ${targetEnrollment} assumed for sizing.`
      )
    }
  }

  const brief: DesignBrief = {
    brief_id: briefId,
    title,
    status: 'Uploaded draft — extracted for pressure-testing',
    therapeutic_area: clip(rec.therapeutic_area, 80),
    disease_area: clip(rec.disease_area, 80),
    indication,
    line_of_treatment: clip(rec.line_of_treatment, 80),
    phase: clip(rec.phase, 20),
    comparator_cohort: {
      therapeutic_area: clip(rec.therapeutic_area, 80) || undefined,
      phase: clip(rec.phase, 20) ? [clip(rec.phase, 20)] : undefined,
    },
    target_enrollment: targetEnrollment,
    planned_sites: num(rec.planned_sites),
    site_mix: siteMix,
    arms,
    randomization: clip(rec.randomization, 240),
    primary_endpoint: {
      id: slugId('ep-primary', 0, pe.id),
      text: clip(pe.text, 500),
      assessment: clip(pe.assessment, 300),
    },
    secondary_endpoints: secondary,
    candidate_secondary_endpoints: candidates,
    criteria,
    soa_sketch: clipList(rec.soa_sketch, 20, 400),
    disclaimer:
      'Extracted from an uploaded .docx. Gaps are listed as missing — they were not inferred. Supporting operational figures come from a synthetic demonstration corpus.',
  }

  // Deterministic vocabulary normalization under the model's own mapping, so
  // the comparator cohort and criterion/assessment joins resolve even when the
  // extract left them verbatim or blank.
  const normalized = normalizeBrief(brief)
  const allNotes = [...notes, ...normalized.notes]
  const finalBrief: DesignBrief = {
    ...normalized.brief,
    ...(allNotes.length ? { extraction_notes: allNotes } : {}),
  }

  return { brief: finalBrief, coverage: deriveCoverage(finalBrief, rec.coverage) }
}

export function sanitizeClientBrief(raw: unknown): DesignBrief | null {
  if (!raw || typeof raw !== 'object') return null
  const { brief } = normalizeExtractedBrief(raw, {
    briefId: clip((raw as { brief_id?: unknown }).brief_id, 80) || `UPLOAD-client`,
  })
  // A client-echoed brief with no identifying content is treated as absent.
  if (!brief.indication && !brief.title && !brief.arms.length && !brief.criteria.length) {
    return null
  }
  return brief
}

export function sanitizeSourceText(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const t = raw.trim()
  if (!t) return null
  return t.slice(0, SOURCE_TEXT_CAP)
}

export function sanitizeCoverage(raw: unknown): BriefCoverage | null {
  if (!raw || typeof raw !== 'object') return null
  const present = clipList((raw as { present?: unknown }).present, 12, 40)
  const missing = clipList((raw as { missing?: unknown }).missing, 12, 40)
  if (!present.length && !missing.length) return null
  return { present, missing }
}

/**
 * Call Haiku once and map the tool payload into DesignBrief. Throws if the
 * key is missing or the model returns nothing usable.
 */
export async function extractDesignBrief(
  text: string,
  opts?: { fileName?: string }
): Promise<ExtractResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured.')
  }

  const clipped = text.trim().slice(0, SOURCE_TEXT_CAP)
  if (!clipped) {
    const empty = normalizeExtractedBrief({}, { fileName: opts?.fileName })
    return {
      ...empty,
      sourceText: null,
      thin: true,
      model: EXTRACT_MODEL,
    }
  }

  const client = new Anthropic()
  const res = await client.messages.create({
    model: EXTRACT_MODEL,
    max_tokens: 4096,
    system: buildExtractSystem(),
    tools: [buildExtractTool()],
    tool_choice: { type: 'tool', name: 'emit_design_brief' },
    messages: [
      {
        role: 'user',
        content: `Extract the design brief from this document. File name: ${opts?.fileName ?? 'upload.docx'}\n\n${clipped}`,
      },
    ],
  })

  const tool = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
  const mapped = normalizeExtractedBrief(tool?.input ?? {}, {
    fileName: opts?.fileName,
    briefId: `UPLOAD-${Date.now().toString(36)}`,
  })
  const thin = isThinExtract(mapped.brief, mapped.coverage)

  return {
    ...mapped,
    sourceText: thin ? clipped : null,
    thin,
    model: res.model ?? EXTRACT_MODEL,
  }
}
