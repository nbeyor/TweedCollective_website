/**
 * POST /api/analytics/rwd-summaries/{functionId} — fixed RWD summary functions
 * (module PRD §6, §8). Deterministic descriptive statistics over the OMOP demo
 * dataset, callable only by registered function id with bounded parameters.
 */

import { NextRequest, NextResponse } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import {
  accrualSummary,
  binaryEndpointRate,
  cohortCharacterization,
  continuousEndpointSummary,
  patientJourney,
  retentionSummary,
  timeToEventSummary,
} from '@/lib/omop/summaries'

export const runtime = 'nodejs'

const WORKSPACE_SLUG = 'protocol-strategist'

const FUNCTIONS = new Set([
  'cohort_characterization',
  'binary_endpoint_rate',
  'continuous_endpoint_summary',
  'time_to_event_summary',
  'accrual_summary',
  'retention_summary',
  'patient_journey',
])

function bounded(n: unknown, lo: number, hi: number, fallback: number): number {
  const x = Number(n)
  if (!Number.isFinite(x)) return fallback
  return Math.min(hi, Math.max(lo, x))
}

export async function POST(req: NextRequest, { params }: { params: { functionId: string } }) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const fn = params.functionId
  if (!FUNCTIONS.has(fn)) {
    return NextResponse.json(
      { error: `Unknown RWD summary function "${fn}". Registered: ${Array.from(FUNCTIONS).join(', ')}.` },
      { status: 404 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const cohortId = Number(body.cohort_definition_id)
  if (!Number.isInteger(cohortId)) {
    return NextResponse.json({ error: 'cohort_definition_id (integer) is required.' }, { status: 400 })
  }

  try {
    switch (fn) {
      case 'cohort_characterization':
        return NextResponse.json(cohortCharacterization(cohortId))
      case 'binary_endpoint_rate':
        return NextResponse.json(
          binaryEndpointRate(cohortId, String(body.endpoint_id ?? ''), bounded(body.followup_months, 1, 60, 12))
        )
      case 'continuous_endpoint_summary':
        return NextResponse.json(
          continuousEndpointSummary(cohortId, String(body.endpoint_id ?? ''), bounded(body.baseline_window_days, 7, 365, 90))
        )
      case 'time_to_event_summary':
        return NextResponse.json(timeToEventSummary(cohortId, String(body.endpoint_id ?? '')))
      case 'accrual_summary':
        return NextResponse.json(
          accrualSummary(
            cohortId,
            body.target_n === undefined ? undefined : bounded(body.target_n, 10, 100000, 100),
            body.capture_rate === undefined ? undefined : bounded(body.capture_rate, 0.001, 1, 0.05)
          )
        )
      case 'retention_summary':
        return NextResponse.json(retentionSummary(cohortId))
      case 'patient_journey':
        return NextResponse.json(
          patientJourney(cohortId, String(body.soa_template_id ?? 'nsclc-2l-brief'), bounded(body.horizon_months, 6, 36, 24))
        )
    }
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 })
  }
  return NextResponse.json({ error: 'Unreachable.' }, { status: 500 })
}
