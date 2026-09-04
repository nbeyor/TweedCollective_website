/**
 * Tool surface for the Protocol Strategist.
 *
 * The model never receives the corpus wholesale — it queries through these
 * tools, so answers stay grounded in the data rather than in recall. Each
 * description states when to call the tool, not only what it does.
 */

import {
  amendmentRiskSweep,
  benchmarkProtocol,
  comparatorLandscape,
  countriesInCohort,
  criteriaFrequency,
  criteriaWaterfall,
  designBrief,
  designOutcomeCorrelations,
  designStructure,
  endpointSensitivity,
  enrolledComposition,
  evaluateScenario,
  manifest,
  procedureOperations,
  procedureSensitivity,
  protocolDetail,
  selectCohort,
  siteFootprint,
  summarize,
  trialCostModel,
  vocabularies,
  type CohortFilter,
  type DesignBrief,
  type FootprintOptions,
  type Protocol,
  type SensitivityScenario,
} from './trialCorpus'
import {
  accrualSummary,
  binaryEndpointRate,
  cohortCharacterization,
  continuousEndpointSummary,
  patientJourney,
  retentionSummary,
  timeToEventSummary,
} from './omop/summaries'
/**
 * A decision recorded against a brief element. Registered in the workspace
 * decision log (client-side, persisted per document) — never written to Drive.
 * The published protocol picks decisions up when the user hits Publish.
 */
export interface ShipEntry {
  brief_id: string
  element_id: string
  element_label: string
  decision: string
  rationale: string
  alternatives_considered: Array<{ option: string; tradeoff: string }>
  evidence: string[]
}

/**
 * Shared input on every fixed-panel analysis tool. The panel chart renders
 * automatically when the tool runs, which is right when the tool IS the answer
 * — and noise when the model is only looking a number up in support of a
 * different question. This flag lets the model make that call.
 */
const CONTEXT_ONLY_SCHEMA = {
  context_only: {
    type: 'boolean',
    description:
      'Set true when calling this only to look up numbers in support of a different question — suppresses the side-panel chart so the panel stays focused on what the user actually asked. Default false renders the chart.',
  },
} as const

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
      'Return the shape of the available trial data: counts, therapeutic areas, phases, controlled vocabularies, and which fields are base schema versus extension fields. Call this first when you need to know what dimensions exist before filtering, or when the user asks what data you have.',
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

  // ---- v0.2 hero flow: the pre-drafted brief and its sensitivity analyses ----
  {
    name: 'get_design_brief',
    description:
      'Return the pre-drafted design brief the session opens on: indication, arms, endpoints, draft eligibility criteria (each with an element id), the schedule sketch, target enrollment, planned site mix, and the open questions the team flagged. Call this first, before pressure-testing anything, to know what is on the table and which element the user is asking about.',
    input_schema: { type: 'object' as const, properties: {}, required: [] },
  },
  {
    name: 'draft_criteria_burden',
    description:
      "Rank the brief's own eligibility criteria by screen-fail attribution — the share of the eligible population each one costs — drawn from comparator protocols that use the same criterion. Call this for first-order questions like 'which criteria will cost us the most patients?'. Renders the criteria-burden waterfall unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY_SCHEMA }, required: [] },
  },
  {
    name: 'procedure_sensitivity',
    description:
      "The core what-if for an added or changed screening/assessment procedure. Given a procedure, returns 2-4 scenarios (e.g. required at all sites; a lighter alternative accepted where available; accept a recent prior result), each quantified in enrollment slip (months), patients at risk, site coverage, and incremental cost, with the operational driver named. Use this for 'how does adding <procedure> hit my timeline?'. Never returns a single answer — always options with tradeoffs. Renders the sensitivity comparison.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY_SCHEMA,
        added_procedure: {
          type: 'string',
          description:
            'The procedure being added or changed. Must be a procedure in the operations table, e.g. "Upper gastrointestinal endoscopy (EGD)", "Tumor biopsy", "Positron emission tomography (PET) scan".',
        },
        alternatives: {
          type: 'array',
          description:
            'Optional lighter alternatives to compare against requiring the procedure everywhere. Each becomes an "accepted where available" scenario.',
          items: {
            type: 'object',
            properties: {
              procedure: { type: 'string', description: 'Alternative procedure name from the operations table.' },
              label: { type: 'string' },
              mode: { type: 'string', enum: ['accepted_where_available', 'accepted_prior'] },
            },
            required: ['procedure'],
          },
        },
      },
      required: ['added_procedure'],
    },
  },
  {
    name: 'endpoint_timeline_sensitivity',
    description:
      "Map proposed secondary endpoints to their assessment burden and the time-to-database-lock they add, then return options: add all, a timeline-protecting subset, or defer to exploratory. Use this for 'how would adding these endpoints hit data collection timelines?'. State honestly what each option gives up.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY_SCHEMA,
        assessments: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Assessment names from the operations table, e.g. "Patient-reported outcomes (EORTC QLQ-C30)", "Circulating tumor DNA (ctDNA) dynamics", "Pharmacokinetic exposure (Cmax, AUC)".',
        },
      },
      required: ['assessments'],
    },
  },
  {
    name: 'site_level_breakdown',
    description:
      "Second-order cut: for one procedure scenario, break the enrollment slip down by site type and emit a generated chart to the side panel. Use this to answer 'which sites drive the slip?' after a procedure_sensitivity call. Proves the long tail — no fixed chart covers this view.",
    input_schema: {
      type: 'object' as const,
      properties: {
        procedure: { type: 'string', description: 'Procedure name from the operations table.' },
        mode: {
          type: 'string',
          enum: ['required_all', 'accepted_where_available', 'accepted_prior'],
          description: 'Which scenario to decompose. Default required_all.',
        },
        alt_procedure: { type: 'string', description: 'Alternative procedure, for the accepted_where_available mode.' },
      },
      required: ['procedure'],
    },
  },
  {
    name: 'comparator_landscape',
    description:
      "Place the draft design against the comparator cohort on assessment burden versus enrollment velocity, draft highlighted. Call this to answer whether the draft is more or less burdensome than the trials that enrolled fastest. Renders the comparator scatter unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY_SCHEMA }, required: [] },
  },
  {
    name: 'trial_cost',
    description:
      "Build the study's cost: a per-patient cost linked to the schedule of assessments, split into direct (procedures + visit overhead) and indirect (data management, site activation and maintenance), rolled to a total. Returns three scenarios at the comparator cohort's p25 / median / p75 SoA intensity, so the answer is a grounded range — 'lean vs as-drafted vs rich' — not a single figure. Use this for 'what will this cost?', 'per-patient cost', 'direct vs indirect', 'total study cost', or any cost sensitivity. Every dollar traces to procedure_operations and assessment_operations. Renders the cost-breakdown chart unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY_SCHEMA }, required: [] },
  },
  {
    name: 'design_structure',
    description:
      "Comparator evidence on study-design STRUCTURE: which designs comparable trials used — randomized control vs single-arm, blinding (double/single/open-label), framework (parallel vs crossover vs dose-escalation), arm count, randomization scheme, and adaptive or basket structures — each subgroup joined to its realized outcomes (enrollment months, participants, screen-fail, dropout, major amendments). Call this for 'should this be single-arm or randomized?', '2 vs 3 arms?', 'open-label or blinded?', 'is there precedent for an adaptive or basket design?', or any question about the design type itself. Evidence, not recommendation: present the subgroup outcomes and their thin-evidence flags honestly. Also works with no brief loaded — pass therapeutic_area/phase to scope the cohort. Renders the design-structure chart unless context_only is set.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY_SCHEMA,
        therapeutic_area: {
          type: 'string',
          description:
            'Override the cohort therapeutic area (defaults to the brief’s comparator cohort). e.g. Oncology, Respiratory',
        },
        phase: {
          type: 'array',
          items: { type: 'string' },
          description: 'Override the cohort phase(s), e.g. ["2","2/3"].',
        },
      },
      required: [],
    },
  },
  {
    name: 'site_footprint',
    description:
      "Recommend a country and site-count footprint for the trial and price the site-count sensitivity. Allocates sites across the countries the corpus carries using each country's measured per-site enrollment rate and startup time, enforcing regulatory region floors as hard constraints on expected enrollment share (default ≥20% North America), then optimizing with the fastest enrollers. Returns a recommended per-country allocation with a floor_compliance field to cite in the answer, plus lean / planned / aggressive scenarios, each with recruit timeline and activation cost. Use this for 'where should I run this?', 'how many sites?', 'country footprint', 'hit my US enrollment target', or a sites-vs-timeline what-if. Renders the footprint chart unless context_only is set.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY_SCHEMA,
        region_floors: {
          type: 'object',
          description:
            'Minimum share of enrollment per region, e.g. {"North America": 0.2} for a 20% US target. Regions: North America, Europe, Asia-Pacific, Latin America. Defaults to 20% North America.',
          additionalProperties: { type: 'number' },
        },
        restrict_countries: {
          type: 'array',
          items: { type: 'string' },
          description: 'Restrict the footprint to these countries, for a domestic-only or region-limited scenario, e.g. ["United States"].',
        },
      },
      required: [],
    },
  },
  {
    name: 'amendment_risk_sweep',
    description:
      "Sweep the draft's element types against amendment histories in the comparator indication: which element types get amended, how often, when (months from first-patient-in), and at what cost (~$500K scale). Flags the elements most likely to force an amendment. Use this as the closing pressure test before the protocol goes to writing. Renders the amendment-risk view unless context_only is set.",
    input_schema: { type: 'object' as const, properties: { ...CONTEXT_ONLY_SCHEMA }, required: [] },
  },
  {
    name: 'rwd_summary',
    description:
      "Fixed descriptive summaries over the SEPARATE synthetic OMOP CDM v5.4 real-world-data store (10,800 patients — distinct from the trial-operations corpus). Call this to ground a design assumption in observed RWD: control event rates (binary_endpoint_rate: endpoints death_within_followup, hf_hospitalization, asthma_exacerbation, progression_or_death), endpoint variability (continuous_endpoint_summary: fev1_pct_predicted, blood_eosinophils, ntprobnp, lvef, hemoglobin), survival and censoring (time_to_event_summary: overall_survival, progression_free_survival, time_to_first_hf_hospitalization, time_to_first_exacerbation), eligible-patient flow (accrual_summary), follow-up retention (retention_summary), cohort demographics (cohort_characterization), or the patient journey laid against the SoA (patient_journey — renders the journey chart). Cohorts: 101 advanced NSCLC, 102 NSCLC on anti-PD-1, 103 NSCLC chemo-only without anti-PD-1, 201 heart failure, 301 severe asthma, 302 severe eosinophilic asthma. DESCRIPTIVE ONLY: sample-size, power, and boundary calculations are registered analyses that run in the user's Biostatistics panel — point the user there rather than computing any design statistic yourself.",
    input_schema: {
      type: 'object' as const,
      properties: {
        ...CONTEXT_ONLY_SCHEMA,
        function_id: {
          type: 'string',
          enum: [
            'cohort_characterization',
            'binary_endpoint_rate',
            'continuous_endpoint_summary',
            'time_to_event_summary',
            'accrual_summary',
            'retention_summary',
            'patient_journey',
          ],
          description: 'Which registered RWD summary function to run.',
        },
        cohort_definition_id: {
          type: 'integer',
          description: 'Predefined OMOP cohort: 101, 102, 103, 201, 301, or 302.',
        },
        endpoint_id: {
          type: 'string',
          description: 'Registered endpoint id — required for binary_endpoint_rate, continuous_endpoint_summary, and time_to_event_summary.',
        },
        followup_months: { type: 'number', description: 'Binary endpoints: follow-up window in months (1-60, default 12).' },
        baseline_window_days: { type: 'number', description: 'Continuous endpoints: baseline window ± days around index (7-365, default 90).' },
        horizon_months: { type: 'number', description: 'patient_journey: months charted past index (6-36, default 24).' },
        target_n: { type: 'number', description: 'accrual_summary: optional enrollment target to translate eligible flow into months-to-target scenarios.' },
        capture_rate: { type: 'number', description: 'accrual_summary: assumed share of eligible patients who enroll (default 0.05) — an explicit assumption, not an observation.' },
      },
      required: ['function_id', 'cohort_definition_id'],
    },
  },
  {
    name: 'render_chart',
    description:
      "Emit a generated chart to the side panel for a view no fixed chart covers. Supply data you retrieved from other tools — do not invent numbers. The chart renders in a sandboxed panel. Default to the chart that shows the sensitivity: use `line` for a low / medium / high band across a continuous knob (one series per scenario, e.g. lean/base/aggressive over a range); use `bar` or `grouped-bar` to compare discrete scenarios side by side; use `heatmap` to explore TWO parameters at once (x = `categories`, one series per y-row with `values` across x — e.g. site count × country, or eligibility strictness × endpoint load). Reach for the heatmap whenever the user is varying two knobs together or has selected multiple options to cross.",
    input_schema: {
      type: 'object' as const,
      properties: {
        title: { type: 'string' },
        type: { type: 'string', enum: ['bar', 'grouped-bar', 'line', 'scatter', 'heatmap'] },
        categories: { type: 'array', items: { type: 'string' }, description: 'x-axis labels for bar/line charts, or the x parameter for a heatmap.' },
        series: {
          type: 'array',
          description:
            'One or more data series. Use values[] for bar/line (for a line sensitivity band, one series per scenario: low, medium, high). Use points[] for scatter. For a heatmap, one series per y-row, name = row label, values[] aligned to categories (x).',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              values: { type: 'array', items: { type: 'number' } },
              points: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' } },
                  required: ['x', 'y'],
                },
              },
            },
            required: ['name'],
          },
        },
        unit: { type: 'string', description: 'What the values are measured in, e.g. "months" or "USD".' },
        caption: { type: 'string', description: 'One line stating the conclusion the reader should reach.' },
      },
      required: ['title', 'type', 'series'],
    },
  },
  {
    name: 'ship_decision',
    description:
      "Record a decision on a brief element: the revised element, the option chosen, the alternatives considered with their tradeoffs, and the corpus evidence. The entry registers in the workspace decision log (shown in the left panel and available to later turns) — it does not write any document; the user publishes the updated protocol separately. Call this only when the user settles on an option and says to ship it. The entry must be self-contained — a teammate not in the session should understand why the choice was made.",
    input_schema: {
      type: 'object' as const,
      properties: {
        element_id: { type: 'string', description: 'The brief element id being decided, e.g. "cri-gi".' },
        element_label: { type: 'string', description: 'Short human label for the element.' },
        decision: { type: 'string', description: 'The option chosen, stated as the revised element text.' },
        rationale: { type: 'string', description: 'Why this option, in one or two sentences.' },
        alternatives_considered: {
          type: 'array',
          description: 'The other options and the quantified tradeoff each carried.',
          items: {
            type: 'object',
            properties: { option: { type: 'string' }, tradeoff: { type: 'string' } },
            required: ['option', 'tradeoff'],
          },
        },
        evidence: {
          type: 'array',
          items: { type: 'string' },
          description: 'Corpus figures behind the decision, e.g. "endoscopy adds ~2.5mo enrollment slip at 12% refusal".',
        },
      },
      required: ['element_id', 'decision'],
    },
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

export interface ToolContext {
  /** The document under review; null when the session is in net-new mode. */
  brief: DesignBrief | null
  /**
   * Workspace regulatory floors (fraction of enrollment per region). The
   * default hard constraint for `site_footprint` when the model doesn't pass
   * `region_floors` explicitly — a chat-level ask still wins.
   */
  floors?: Record<string, number>
}

const NO_BRIEF = {
  error:
    'No design brief is active — the session is building a protocol from scratch. Use the cohort tools (query_cohort, analyze_criteria, benchmark_protocol, get_protocol) to ground the design, or ask the user to select a protocol from the picker.',
}

export async function runTool(
  name: string,
  input: Record<string, unknown>,
  ctx: ToolContext = { brief: designBrief() }
): Promise<unknown> {
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

    // ---- v0.2 hero flow ----------------------------------------------------
    case 'get_design_brief': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      return {
        ...brief,
        note: 'This is the pre-drafted document under review. Pressure-test its elements; do not rewrite it wholesale.',
      }
    }

    case 'draft_criteria_burden': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const data = criteriaWaterfall(brief)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'criteria_waterfall', data } }
    }

    case 'procedure_sensitivity': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const added = String(input.added_procedure)
      const known = new Set(procedureOperations().map((r) => String(r.procedure_name)))
      if (!known.has(added)) {
        return {
          error: `No operations data for "${added}". Available procedures: ${Array.from(known).join('; ')}`,
        }
      }
      const scenarios: SensitivityScenario[] = [
        {
          key: 'required_all',
          label: `${added} required at all sites`,
          procedure: added,
          mode: 'required_all',
          note: 'Every site must perform or refer out for the procedure.',
        },
      ]
      const alts = Array.isArray(input.alternatives) ? input.alternatives : COMPANIONS[added] ?? []
      for (const a of alts as Array<Record<string, unknown>>) {
        const proc = String(a.procedure)
        if (!known.has(proc)) continue
        scenarios.push({
          key: `alt_${scenarios.length}`,
          label: String(a.label ?? `${proc} accepted where available`),
          procedure: added,
          alt_procedure: proc,
          mode: (a.mode as SensitivityScenario['mode']) ?? 'accepted_where_available',
          note: String(a.note ?? ''),
        })
      }
      const data = procedureSensitivity(brief, scenarios)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'sensitivity_comparison', data } }
    }

    case 'endpoint_timeline_sensitivity': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      let assessments = (input.assessments as string[] | undefined) ?? []
      if (!assessments.length) {
        // Default to the brief's own proposed endpoints (candidates first).
        assessments = [
          ...brief.candidate_secondary_endpoints.map((e) => e.assessment),
          ...brief.secondary_endpoints.map((e) => e.assessment),
        ].filter(Boolean)
      }
      const data = endpointSensitivity(brief, assessments)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'endpoint_timeline', data } }
    }

    case 'site_level_breakdown': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const scn: SensitivityScenario = {
        key: 'drill',
        label: 'Site-level breakdown',
        procedure: String(input.procedure),
        mode: (input.mode as SensitivityScenario['mode']) ?? 'required_all',
        alt_procedure: input.alt_procedure ? String(input.alt_procedure) : undefined,
      }
      const known = new Set(procedureOperations().map((r) => String(r.procedure_name)))
      if (!known.has(scn.procedure)) return { error: `No operations data for "${scn.procedure}".` }
      const result = evaluateScenario(brief, scn)
      const bySite = result.by_site_type
      const chartSpec = {
        title: `Enrollment friction by site type — ${scn.procedure}`,
        type: 'grouped-bar' as const,
        categories: bySite.map((r) => String(r.site_type)),
        series: [
          { name: 'Scheduling lag (days)', values: bySite.map((r) => Number(r.scheduling_lag_days)) },
          { name: 'Screen refusal (%)', values: bySite.map((r) => Number(r.screen_refusal_pct)) },
        ],
        unit: 'days / percent',
        caption: result.primary_driver
          ? `Driver: ${result.primary_driver}.`
          : 'Community and lower-resource sites carry the longest lags.',
      }
      return { ...result, _generated_chart: chartSpec }
    }

    case 'comparator_landscape': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const data = comparatorLandscape(brief)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'comparator_scatter', data } }
    }

    case 'trial_cost': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const data = trialCostModel(brief)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'cost_breakdown', data } }
    }

    case 'design_structure': {
      const data = designStructure(ctx.brief, {
        therapeutic_area: input.therapeutic_area as string | undefined,
        phase: input.phase as string | string[] | undefined,
      })
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'design_structure', data } }
    }

    case 'site_footprint': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const opts: FootprintOptions = {
        region_floors: (input.region_floors as Record<string, number> | undefined) ?? ctx.floors,
        restrict_countries: input.restrict_countries as string[] | undefined,
      }
      const data = siteFootprint(brief, opts)
      if (input.context_only === true || 'error' in data) return data
      return { ...data, _panel: { chart: 'site_footprint', data } }
    }

    case 'amendment_risk_sweep': {
      const brief = ctx.brief
      if (!brief) return NO_BRIEF
      const data = amendmentRiskSweep(brief)
      if (input.context_only === true) return data
      return { ...data, _panel: { chart: 'amendment_risk', data } }
    }

    case 'rwd_summary': {
      const fn = String(input.function_id)
      const cohortId = Number(input.cohort_definition_id)
      const bound = (v: unknown, lo: number, hi: number, dflt: number) => {
        const n = Number(v)
        return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt
      }
      try {
        switch (fn) {
          case 'cohort_characterization':
            return cohortCharacterization(cohortId)
          case 'binary_endpoint_rate':
            return binaryEndpointRate(cohortId, String(input.endpoint_id ?? ''), bound(input.followup_months, 1, 60, 12))
          case 'continuous_endpoint_summary':
            return continuousEndpointSummary(cohortId, String(input.endpoint_id ?? ''), bound(input.baseline_window_days, 7, 365, 90))
          case 'time_to_event_summary': {
            const { km_curve, ...rest } = timeToEventSummary(cohortId, String(input.endpoint_id ?? ''))
            void km_curve // curve stays out of the model context; the numbers carry the answer
            return rest
          }
          case 'accrual_summary': {
            const data = accrualSummary(
              cohortId,
              input.target_n === undefined ? undefined : bound(input.target_n, 10, 100000, 100),
              input.capture_rate === undefined ? undefined : bound(input.capture_rate, 0.001, 1, 0.05)
            )
            const { by_month, ...rest } = data
            void by_month
            return rest
          }
          case 'retention_summary':
            return retentionSummary(cohortId)
          case 'patient_journey': {
            const data = patientJourney(cohortId, 'nsclc-2l-brief', bound(input.horizon_months, 6, 36, 24))
            if (input.context_only === true) return data
            return { ...data, _panel: { chart: 'patient_journey', data } }
          }
          default:
            return { error: `Unknown RWD summary function "${fn}".` }
        }
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) }
      }
    }

    case 'render_chart': {
      const spec = {
        title: String(input.title ?? 'Chart'),
        type: (input.type as 'bar' | 'grouped-bar' | 'line' | 'scatter') ?? 'bar',
        categories: input.categories as string[] | undefined,
        series: (input.series as GeneratedSeries[]) ?? [],
        unit: input.unit as string | undefined,
        caption: input.caption as string | undefined,
      }
      return { ok: true, rendered: spec.title, _generated_chart: spec }
    }

    case 'ship_decision': {
      const entry: ShipEntry = {
        brief_id: ctx.brief?.brief_id ?? 'NET-NEW',
        element_id: String(input.element_id),
        element_label: String(input.element_label ?? input.element_id),
        decision: String(input.decision),
        rationale: String(input.rationale ?? ''),
        alternatives_considered:
          (input.alternatives_considered as Array<{ option: string; tradeoff: string }>) ?? [],
        evidence: (input.evidence as string[]) ?? [],
      }
      return {
        ok: true,
        entry,
        registered: true,
        detail:
          'Decision registered in the workspace decision log. It will be applied to the protocol when the user publishes the updated protocol.',
        _ship: { entry },
      }
    }

    default:
      return { error: `Unknown tool: ${name}` }
  }
}

interface GeneratedSeries {
  name: string
  values?: number[]
  points?: Array<{ x: number; y: number; label?: string }>
}

// Default lighter alternatives when the user names a heavy procedure but does
// not spell out the softer options. Keeps the hero endoscopy what-if a single
// call while leaving the model free to override.
const COMPANIONS: Record<string, Array<{ procedure: string; label: string; mode: string }>> = {
  'Upper gastrointestinal endoscopy (EGD)': [
    {
      procedure: 'Central read of existing cross-sectional imaging',
      label: 'Central read of existing imaging accepted where available',
      mode: 'accepted_where_available',
    },
    {
      procedure: 'Records retrieval of prior endoscopy (within 6 months)',
      label: 'Prior endoscopy within 6 months accepted',
      mode: 'accepted_prior',
    },
  ],
}
