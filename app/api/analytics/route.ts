/**
 * OMOP biostatistics module — catalog endpoint (module PRD §8).
 *
 * GET /api/analytics returns the registered analysis catalog with parameter
 * schemas, the fixed RWD summary functions and endpoint registry, the
 * predefined cohorts, and the dataset manifest — the module's complete,
 * inspectable surface. Nothing outside this registry can execute.
 */

import { NextResponse } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { catalog, ENGINE_NAME, ENGINE_VERSION } from '@/lib/biostats/engine'
import { cohortDefinitions } from '@/lib/omop/cohorts'
import { omopManifest } from '@/lib/omop/dataset'
import { ENDPOINTS, RWD_SERVICE_VERSION, SOA_TEMPLATES } from '@/lib/omop/summaries'

export const runtime = 'nodejs'

const WORKSPACE_SLUG = 'protocol-strategist'

export async function GET() {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const m = omopManifest()
  return NextResponse.json({
    engine: { name: ENGINE_NAME, version: ENGINE_VERSION },
    analyses: catalog(),
    rwd_summaries: {
      version: RWD_SERVICE_VERSION,
      functions: [
        { function_id: 'cohort_characterization', params: 'cohort_definition_id' },
        { function_id: 'binary_endpoint_rate', params: 'cohort_definition_id, endpoint_id (binary), followup_months' },
        { function_id: 'continuous_endpoint_summary', params: 'cohort_definition_id, endpoint_id (continuous), baseline_window_days' },
        { function_id: 'time_to_event_summary', params: 'cohort_definition_id, endpoint_id (time_to_event)' },
        { function_id: 'accrual_summary', params: 'cohort_definition_id, target_n?, capture_rate?' },
        { function_id: 'retention_summary', params: 'cohort_definition_id' },
        { function_id: 'patient_journey', params: 'cohort_definition_id, soa_template_id, horizon_months' },
      ],
      endpoints: ENDPOINTS,
      soa_templates: Object.entries(SOA_TEMPLATES).map(([id, t]) => ({ soa_template_id: id, label: t.label })),
    },
    cohorts: cohortDefinitions(),
    dataset: {
      dataset_id: m.datasetId,
      dataset_version: m.datasetVersion,
      cdm: m.cdm,
      person_count: m.personCount,
      generated: m.generated,
      seed: m.seed,
      synthetic: m.synthetic,
      caveat: m.caveat,
    },
  })
}
