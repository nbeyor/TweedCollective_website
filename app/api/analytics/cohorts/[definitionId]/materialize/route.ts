/**
 * POST /api/analytics/cohorts/{definitionId}/materialize — cohort service
 * (module PRD §8). Materializes a predefined cohort definition and returns the
 * versioned cohort record (definition, logic, version, size). Membership rows
 * stay server-side; summaries are read through the RWD summary functions.
 */

import { NextRequest, NextResponse } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { materializeCohort } from '@/lib/omop/cohorts'

export const runtime = 'nodejs'

const WORKSPACE_SLUG = 'protocol-strategist'

export async function POST(_req: NextRequest, { params }: { params: { definitionId: string } }) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const id = Number(params.definitionId)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'definitionId must be an integer cohort definition id.' }, { status: 400 })
  }
  const cohort = materializeCohort(id)
  if (!cohort) {
    return NextResponse.json({ error: `Unknown cohort definition ${id}.` }, { status: 404 })
  }
  const { members, ...record } = cohort
  void members
  return NextResponse.json(record)
}
