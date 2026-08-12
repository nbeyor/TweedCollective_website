/**
 * Tool surface for the Protocol Foundry (protocol authoring workspace).
 *
 * Three layers:
 *  1. Protocol tools — the HORIZON-Lung-301 draft itself (outline + section
 *     bodies), so the model reads the actual document before opining on it.
 *  2. Authoring analytics — the widget classes from the client's ProtocolForge
 *     demo (eligibility funnel, power, visit burden, country viability,
 *     regulatory sweep, enrollment projection), computed deterministically in
 *     analytics.ts.
 *  3. Corpus engines — reused verbatim from the strategist workspace, run
 *     against the HORIZON brief (horizonBrief.ts), so cost, footprint,
 *     procedure sensitivity, endpoint timeline, comparator, and amendment-risk
 *     questions stay grounded in the same operations corpus.
 *
 * Plus the review board: file_review_findings registers structured findings
 * that render as cards in the workspace and badge the outline.
 */

import { runTool as runStrategistTool, TOOLS as STRATEGIST_TOOLS } from '@/lib/strategistTools'

import {
  countryViability,
  eligibilityFunnel,
  enrollmentProjection,
  patientBurden,
  powerAnalysis,
  regulatoryRequirements,
  type EnrollmentInput,
  type PowerInput,
} from './analytics'
import { HORIZON_BRIEF } from './horizonBrief'
import { findSection, HORIZON_CHAPTERS, HORIZON_META } from './horizonProtocol'

// Strategist tools reused as-is; their brief-scoped engines run on the
// HORIZON brief supplied through the tool context.
const REUSED_TOOL_NAMES = new Set([
  'describe_corpus',
  'query_cohort',
  'get_protocol',
  'benchmark_protocol',
  'analyze_criteria',
  'design_outcome_relationships',
  'draft_criteria_burden',
  'procedure_sensitivity',
  'endpoint_timeline_sensitivity',
  'site_level_breakdown',
  'comparator_landscape',
  'trial_cost',
  'site_footprint',
  'amendment_risk_sweep',
  'render_chart',
  'ship_decision',
])

const CONTEXT_ONLY = {
  context_only: {
    type: 'boolean',
    description:
      'Set true when calling this only to look up numbers in support of a different question — suppresses the side-panel chart. Default false renders the chart.',
  },
} as const

export interface ReviewFinding {
  id: string
  section_id: string
  section_title: string
  lens: string
  severity: 'critical' | 'major' | 'minor'
  title: string
  quote: string
  recommendation: string
  regulatory_basis: string
  rewrite?: { before: string; after: string } | null
}

export interface ReviewRound {
  label: string
  summary: string
  findings: ReviewFinding[]
}

const AUTHORING_TOOLS = [
  {
    name: 'get_protocol_overview',
    description:
      'Return the HORIZON-Lung-301 study metadata (title, sponsor, phase, arms, enrollment target) and the full chapter/section outline with section ids. Call this first when you need to know what the draft contains or which section id to fetch.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'get_protocol_section',
    description:
      'Return the full markdown body of one or more sections of the HORIZON-Lung-301 draft, by section id (from get_protocol_overview or the outline in your instructions). ALWAYS read the relevant sections before reviewing, quoting, or proposing rewrites — findings must quote the actual draft text, not a paraphrase from memory.',
    input_schema: {
      type: 'object' as const,
      properties: {
        section_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Section ids, e.g. ["sample-size-and-power", "interim-analyses"]. Up to 6 per call.',
        },
      },
      required: ['section_ids'],
    },
  },
  {
    name: 'eligibility_funnel',
    description:
      "Walk the US patient-pool funnel for the draft's eligibility criteria: patients remaining after each gate, step-to-step retention, and the most restrictive criterion. Use this for 'who can we actually enroll?', 'how big is the pool?', or any question about a criterion's cost in patients at the population level. Renders the funnel chart unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY }, required: [] },
  },
  {
    name: 'power_analysis',
    description:
      "Verify or stress the statistical design: required events (Schoenfeld, 1:1) for a hazard ratio at a given alpha and power, the implied evaluable and dropout-inflated randomized N, and the power curve across true-effect sizes at the planned event count. Defaults to the draft's planned PFS design (HR 0.70, 90% power, one-sided α 0.025); pass endpoint 'OS' for the co-primary (HR 0.76, 85%). Use for sample-size verification, dropout sensitivity, and 'what if the true effect is weaker?'. Renders the power curve unless context_only is set.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY,
        endpoint: { type: 'string', enum: ['PFS', 'OS'] },
        hazard_ratio: { type: 'number', description: 'Target hazard ratio, e.g. 0.70.' },
        alpha_one_sided: { type: 'number', description: 'One-sided alpha, e.g. 0.025.' },
        power: { type: 'number', description: 'Target power as a fraction, e.g. 0.9.' },
        dropout_rate: { type: 'number', description: 'Dropout fraction for N inflation, e.g. 0.15.' },
      },
      required: [],
    },
  },
  {
    name: 'patient_burden',
    description:
      "Score patient and site burden over the draft's Schedule of Activities grid (14 visits × 38 procedures, each weighted 0–5): per-visit burden totals, the heaviest visit with its drivers, and the category composition against the Phase 3 oncology benchmark band. Use for 'what are we asking of patients?', visit-load questions, and split-visit what-ifs. Renders the burden-by-visit chart unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY }, required: [] },
  },
  {
    name: 'country_viability',
    description:
      'Rate the planned country footprint: sites, enrollment share, viability score, eligible pool, per-site enrollment rate, startup months, and regulatory risk per country. Use for "where should this run?", footprint weaknesses, or before recommending reallocations. Renders the viability board unless context_only is set.',
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY }, required: [] },
  },
  {
    name: 'regulatory_requirements',
    description:
      "Sweep country-specific regulatory requirements for the planned footprint — blockers, warnings, and info items, each with its lead-time or budget impact (ANVISA import licensing, GDPR transfers, PMDA consultation, ICH M11 formatting…). Optionally scope to one country. Use for regulatory-readiness questions and before finalizing the footprint. Renders the requirements panel unless context_only is set.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY,
        country: { type: 'string', description: 'Scope to one country, e.g. "Japan". Omit for all.' },
      },
      required: [],
    },
  },
  {
    name: 'enrollment_projection',
    description:
      "Project enrollment month by month over the planned country footprint: sites activate after each country's startup window and enroll at its per-site rate, giving cumulative curves for slower / planned / faster scenarios and the month 600 randomized is reached. Use for 'how fast do we get to N?', rate what-ifs, and site-count sensitivity. Renders the enrollment curve unless context_only is set.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY,
        scenario_rate_multiplier: {
          type: 'number',
          description: 'Scale all country enrollment rates, e.g. 0.8 for a conservative case. Default 1.',
        },
        screen_fail_rate: { type: 'number', description: 'Screen-fail fraction for the screened-required figure. Default 0.42.' },
        sites_override: { type: 'number', description: 'Total site count to scale the footprint to (planned 160).' },
      },
      required: [],
    },
  },
  {
    name: 'file_review_findings',
    description:
      'Register the findings of a review-board pass. Call this once per review round, after reading the relevant sections with get_protocol_section — every finding must quote the actual draft text. Findings render as cards in the workspace, badge the affected outline sections, and persist for the session. Severity: critical = would block approval or endanger participants; major = a reviewer would demand a change; minor = polish. Include a proposed rewrite (exact before/after text) for every critical and major finding.',
    input_schema: {
      type: 'object' as const,
      properties: {
        round_label: { type: 'string', description: 'e.g. "Full board — Round 1" or "Biostatistics review".' },
        summary: { type: 'string', description: 'One or two sentences: the round’s overall verdict.' },
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              section_id: { type: 'string', description: 'Outline section id the finding is against.' },
              section_title: { type: 'string' },
              lens: {
                type: 'string',
                enum: ['Biostatistics', 'Regulatory', 'Safety & Medical Monitoring', 'Clinical Operations', 'Ethics & Consent', 'Data Standards'],
              },
              severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
              title: { type: 'string', description: 'One-line statement of the defect.' },
              quote: { type: 'string', description: 'The exact draft text at issue (verbatim from get_protocol_section).' },
              recommendation: { type: 'string', description: 'What to change, specific enough to act on.' },
              regulatory_basis: {
                type: 'string',
                description: 'The guidance or regulation grounding the finding, e.g. "ICH E9(R1) §A.3 · 21 CFR 312.32".',
              },
              rewrite: {
                type: 'object',
                description: 'Proposed replacement text. Required for critical/major findings.',
                properties: { before: { type: 'string' }, after: { type: 'string' } },
                required: ['before', 'after'],
              },
            },
            required: ['section_id', 'lens', 'severity', 'title', 'quote', 'recommendation'],
          },
        },
      },
      required: ['round_label', 'summary', 'findings'],
    },
  },
] as const

export const TOOLS = [
  ...AUTHORING_TOOLS,
  ...STRATEGIST_TOOLS.filter((t) => REUSED_TOOL_NAMES.has(t.name)),
]

// ------------------------------------------------------------- execution ---

let findingSeq = 0

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_protocol_overview': {
      return {
        meta: HORIZON_META,
        design_summary: {
          target_enrollment: HORIZON_BRIEF.target_enrollment,
          planned_sites: HORIZON_BRIEF.planned_sites,
          randomization: HORIZON_BRIEF.randomization,
          primary_endpoint: HORIZON_BRIEF.primary_endpoint.text,
          secondary_endpoints: HORIZON_BRIEF.secondary_endpoints.map((e) => e.text),
          candidate_exploratory_endpoints: HORIZON_BRIEF.candidate_secondary_endpoints.map((e) => e.text),
        },
        outline: HORIZON_CHAPTERS.map((c) => ({
          chapter: c.num,
          title: c.title,
          sections: c.sections.map((s) => ({ id: s.id, title: s.title })),
        })),
      }
    }

    case 'get_protocol_section': {
      const ids = (input.section_ids as string[] | undefined) ?? []
      if (!ids.length) return { error: 'Pass section_ids — get ids from get_protocol_overview.' }
      const sections = ids.slice(0, 6).map((id) => {
        const hit = findSection(id)
        return hit
          ? {
              id,
              chapter: `${hit.chapter.num}. ${hit.chapter.title}`,
              title: hit.section.title,
              body: hit.section.body,
            }
          : { id, error: 'No such section id. Call get_protocol_overview for the valid outline.' }
      })
      return { sections }
    }

    case 'eligibility_funnel': {
      const data = eligibilityFunnel()
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'eligibility_funnel', data } }
    }

    case 'power_analysis': {
      const data = powerAnalysis(input as PowerInput)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'power_curve', data } }
    }

    case 'patient_burden': {
      const data = patientBurden()
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'burden_by_visit', data } }
    }

    case 'country_viability': {
      const data = countryViability()
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'country_viability', data } }
    }

    case 'regulatory_requirements': {
      const data = regulatoryRequirements(input.country as string | undefined)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'reg_requirements', data } }
    }

    case 'enrollment_projection': {
      const data = enrollmentProjection(input as EnrollmentInput)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'enrollment_projection', data } }
    }

    case 'file_review_findings': {
      const rawFindings = Array.isArray(input.findings) ? (input.findings as Array<Record<string, unknown>>) : []
      if (!rawFindings.length) return { error: 'No findings supplied. File at least one, or tell the user the pass came back clean.' }
      const findings: ReviewFinding[] = rawFindings.slice(0, 30).map((f) => {
        findingSeq += 1
        const sectionId = String(f.section_id ?? '')
        const hit = findSection(sectionId)
        const rewrite = f.rewrite as { before?: unknown; after?: unknown } | undefined
        return {
          id: `f${Date.now().toString(36)}-${findingSeq}`,
          section_id: sectionId,
          section_title: String(f.section_title ?? hit?.section.title ?? sectionId),
          lens: String(f.lens ?? 'Review'),
          severity: (['critical', 'major', 'minor'].includes(String(f.severity))
            ? String(f.severity)
            : 'minor') as ReviewFinding['severity'],
          title: String(f.title ?? 'Finding'),
          quote: String(f.quote ?? ''),
          recommendation: String(f.recommendation ?? ''),
          regulatory_basis: String(f.regulatory_basis ?? ''),
          rewrite:
            rewrite && rewrite.before != null && rewrite.after != null
              ? { before: String(rewrite.before), after: String(rewrite.after) }
              : null,
        }
      })
      const round: ReviewRound = {
        label: String(input.round_label ?? 'Review'),
        summary: String(input.summary ?? ''),
        findings,
      }
      const counts = {
        critical: findings.filter((f) => f.severity === 'critical').length,
        major: findings.filter((f) => f.severity === 'major').length,
        minor: findings.filter((f) => f.severity === 'minor').length,
      }
      return {
        ok: true,
        registered: findings.length,
        counts,
        finding_ids: findings.map((f) => ({ id: f.id, title: f.title })),
        detail:
          'Findings registered — they render as cards in the workspace and badge the affected sections. Walk the user through the critical and major ones; each can be adopted into the decision log.',
        _findings: { round },
      }
    }

    default: {
      if (REUSED_TOOL_NAMES.has(name)) {
        return runStrategistTool(name, input, { brief: HORIZON_BRIEF })
      }
      return { error: `Unknown tool: ${name}` }
    }
  }
}
