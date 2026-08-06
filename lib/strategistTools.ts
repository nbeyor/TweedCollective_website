/**
 * Tool surface for the Protocol Strategist.
 *
 * The model never receives the corpus wholesale — it queries through these
 * tools, so answers stay grounded in the data rather than in recall. Each
 * description states when to call the tool, not only what it does.
 */

import {
  benchmarkProtocol,
  countriesInCohort,
  criteriaFrequency,
  designOutcomeCorrelations,
  enrolledComposition,
  manifest,
  protocolDetail,
  selectCohort,
  summarize,
  vocabularies,
  type CohortFilter,
  type Protocol,
} from './trialCorpus'

const COHORT_FILTER_SCHEMA = {
  therapeutic_area: {
    type: 'string',
    description: 'e.g. Respiratory, Oncology, Immunology & Inflammation, Cardiometabolic, Neurology',
  },
  disease_area: { type: 'string', description: 'e.g. Asthma, Thoracic Oncology' },
  indication: { type: 'string', description: 'e.g. Severe Eosinophilic Asthma' },
  phase: {
    type: 'array',
    items: { type: 'string' },
    description: 'One or more of 1, 1/2, 2, 2/3, 3, 4',
  },
  min_participants: { type: 'integer' },
  max_participants: { type: 'integer' },
  protocol_ids: { type: 'array', items: { type: 'string' } },
} as const

export const TOOLS = [
  {
    name: 'describe_corpus',
    description:
      'Return the shape of the available trial data: counts, therapeutic areas, phases, controlled vocabularies, and which fields are Trial IntelX schema versus Tweed extensions. Call this first when you need to know what dimensions exist before filtering, or when the user asks what data you have.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'query_cohort',
    description:
      'Select a set of protocols by therapeutic area, indication, phase, or size, and return distribution statistics for their design indices and operational outcomes. Call this whenever a question is about a group of trials rather than one — benchmarking, "what is typical", "how does X compare to its peers".',
    input_schema: {
      type: 'object' as const,
      properties: {
        ...COHORT_FILTER_SCHEMA,
        include_protocol_list: {
          type: 'boolean',
          description: 'Include the matching protocol IDs and headline fields. Default false.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_protocol',
    description:
      'Return everything known about one protocol: summary fields, full eligibility criteria list, schedule-of-assessments rollups, objectives, endpoints, amendment history, and operational outcomes. Call this when the user names a specific protocol or when a cohort query surfaces one worth examining.',
    input_schema: {
      type: 'object' as const,
      properties: { protocol_id: { type: 'string', description: 'e.g. TCX-0042' } },
      required: ['protocol_id'],
    },
  },
  {
    name: 'benchmark_protocol',
    description:
      'Place one protocol at a percentile against a comparator cohort across design indices and operational outcomes. Call this to answer "is this unusual?", "how does this compare?", or to support a recommendation with a peer-relative number rather than an absolute one.',
    input_schema: {
      type: 'object' as const,
      properties: {
        protocol_id: { type: 'string' },
        comparator: {
          type: 'object',
          description: 'Cohort to benchmark against. Defaults to same indication and phase.',
          properties: COHORT_FILTER_SCHEMA,
        },
      },
      required: ['protocol_id'],
    },
  },
  {
    name: 'analyze_criteria',
    description:
      'Rank eligibility criteria across a cohort by how often they appear, alongside the mean screen-fail rate of protocols that use each criterion versus those that do not. Call this to identify which specific criteria are driving screening burden, or to check whether a criterion is standard practice or an outlier in its indication.',
    input_schema: {
      type: 'object' as const,
      properties: {
        ...COHORT_FILTER_SCHEMA,
        criterion_type: { type: 'string', enum: ['Inclusion', 'Exclusion'] },
        limit: { type: 'integer', description: 'Max criteria to return. Default 25.' },
      },
      required: [],
    },
  },
  {
    name: 'analyze_enrollment_diversity',
    description:
      'Return the enrolled-population composition for a cohort, by country. IMPORTANT: always scope to a single country when comparing protocols. Across the whole corpus, country mix swamps the criteria effect and the relationship all but disappears; within a country it is strong. An unstratified comparison will produce the wrong answer.',
    input_schema: {
      type: 'object' as const,
      properties: {
        ...COHORT_FILTER_SCHEMA,
        country: {
          type: 'string',
          description: 'Scope to one country, e.g. United States. Strongly recommended.',
        },
        split_by_drag: {
          type: 'boolean',
          description:
            'Split the cohort into low (<40) and high (>65) diversity_drag_index groups and report composition for each. Default true.',
        },
      },
      required: [],
    },
  },
  {
    name: 'design_outcome_relationships',
    description:
      'Return measured correlations between protocol design choices (restrictiveness, assessment burden) and operational outcomes (screen-fail rate, dropout, amendments, enrollment duration) for a cohort. Call this to support a causal claim with the relationship actually present in the data rather than asserting it.',
    input_schema: { type: 'object' as const, properties: COHORT_FILTER_SCHEMA, required: [] },
  },
] as const

// ------------------------------------------------------------- execution ---

function filterFrom(input: Record<string, unknown>): CohortFilter {
  return {
    therapeutic_area: input.therapeutic_area as string | undefined,
    disease_area: input.disease_area as string | undefined,
    indication: input.indication as string | undefined,
    phase: input.phase as string[] | undefined,
    min_participants: input.min_participants as number | undefined,
    max_participants: input.max_participants as number | undefined,
    protocol_ids: input.protocol_ids as string[] | undefined,
  }
}

const METRICS = [
  'restrictiveness_index',
  'burden_index',
  'diversity_drag_index',
  'eligibility_criteria_count',
  'inclusion_criteria_count',
  'exclusion_criteria_count',
  'number_of_participants',
  'total_visit_count',
  'procedure_count',
  'total_procedure_duration_min',
  'treatment_duration_weeks',
  'screen_fail_rate',
  'dropout_rate',
  'major_amendments',
  'total_deviations',
  'enrollment_duration_months',
  'sites_initiated',
]

function cohortStats(cohort: Protocol[]) {
  return Object.fromEntries(
    METRICS.map((m) => [m, summarize(cohort.map((p) => Number(p[m])))]).filter(([, v]) => v)
  )
}

export async function runTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'describe_corpus': {
      const m = manifest()
      const v = vocabularies() as Record<string, unknown>
      return {
        ...m,
        files: undefined,
        available_metrics: METRICS,
        vocabularies: v,
        caveat:
          'Entirely synthetic. Generated for demonstration; not fit for clinical, regulatory, or operational decisions.',
      }
    }

    case 'query_cohort': {
      const cohort = selectCohort(filterFrom(input))
      if (!cohort.length) return { matched: 0, note: 'No protocols matched. Loosen the filter.' }
      return {
        matched: cohort.length,
        statistics: cohortStats(cohort),
        countries: countriesInCohort(cohort),
        protocols: input.include_protocol_list
          ? cohort.map((p) => ({
              protocol_id: p.protocol_id,
              indication: p.indication,
              phase: p.phase,
              number_of_participants: p.number_of_participants,
              restrictiveness_index: p.restrictiveness_index,
              burden_index: p.burden_index,
              screen_fail_rate: p.screen_fail_rate,
              enrollment_duration_months: p.enrollment_duration_months,
            }))
          : undefined,
      }
    }

    case 'get_protocol': {
      const d = protocolDetail(String(input.protocol_id))
      return d ?? { error: `No protocol ${input.protocol_id}. Use query_cohort to list valid IDs.` }
    }

    case 'benchmark_protocol': {
      const id = String(input.protocol_id)
      const explicit = input.comparator as Record<string, unknown> | undefined
      let cohort: Protocol[]
      if (explicit && Object.keys(explicit).length) {
        cohort = selectCohort(filterFrom(explicit))
      } else {
        const p = selectCohort({ protocol_ids: [id] })[0]
        if (!p) return { error: `No protocol ${id}.` }
        cohort = selectCohort({ indication: String(p.indication), phase: String(p.phase) })
        if (cohort.length < 8) {
          cohort = selectCohort({ therapeutic_area: String(p.therapeutic_area), phase: String(p.phase) })
        }
        if (cohort.length < 8) {
          cohort = selectCohort({ therapeutic_area: String(p.therapeutic_area) })
        }
      }
      const b = benchmarkProtocol(id, cohort)
      return b ?? { error: `No protocol ${id}.` }
    }

    case 'analyze_criteria': {
      const cohort = selectCohort(filterFrom(input))
      if (!cohort.length) return { matched: 0, note: 'No protocols matched.' }
      const limit = Number(input.limit ?? 25)
      const all = criteriaFrequency(
        cohort,
        input.criterion_type as 'Inclusion' | 'Exclusion' | undefined
      )
      return {
        cohort_size: cohort.length,
        criteria_returned: Math.min(limit, all.length),
        criteria_total: all.length,
        criteria: all.slice(0, limit),
        note:
          'mean_screen_fail_with_pct vs mean_screen_fail_without_pct is an association across protocols, not an isolated causal effect for that criterion.',
      }
    }

    case 'analyze_enrollment_diversity': {
      const cohort = selectCohort(filterFrom(input))
      if (!cohort.length) return { matched: 0, note: 'No protocols matched.' }
      const country = input.country as string | undefined
      const split = input.split_by_drag !== false

      const result: Record<string, unknown> = {
        cohort_size: cohort.length,
        countries_available: countriesInCohort(cohort),
        overall: enrolledComposition(cohort, country),
      }
      if (!country) {
        result.warning =
          'No country scope given. Unstratified figures are confounded by country mix and should not be used to compare protocols — re-run with a country.'
      }
      if (split) {
        const low = cohort.filter((p) => Number(p.diversity_drag_index) < 40)
        const high = cohort.filter((p) => Number(p.diversity_drag_index) > 65)
        result.low_drag = { n: low.length, ...enrolledComposition(low, country) }
        result.high_drag = { n: high.length, ...enrolledComposition(high, country) }
      }
      return result
    }

    case 'design_outcome_relationships': {
      const cohort = selectCohort(filterFrom(input))
      if (cohort.length < 8) {
        return { matched: cohort.length, note: 'Too few protocols for a meaningful correlation.' }
      }
      return {
        cohort_size: cohort.length,
        correlations: designOutcomeCorrelations(cohort),
        note: 'Pearson r. Synthetic data with deliberately encoded structure — treat as illustrative of the mechanism, not as an empirical finding.',
      }
    }

    default:
      return { error: `Unknown tool: ${name}` }
  }
}
