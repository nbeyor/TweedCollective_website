/**
 * GET /api/analytics/analysis-runs/{runId} — retrieve a run record (module
 * PRD §8). Runs are content-addressed (run_id = hash of analysis id, version,
 * engine version, and normalized inputs) and cached per server instance. A
 * cold instance may not hold the record: the caller then re-POSTs the same
 * inputs, which reproduces the identical run_id and outputs — the documented
 * serverless stand-in for a durable result store.
 */

import { NextRequest, NextResponse } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { getRun } from '@/lib/biostats/engine'

export const runtime = 'nodejs'

const WORKSPACE_SLUG = 'protocol-strategist'

export async function GET(_req: NextRequest, { params }: { params: { runId: string } }) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const run = getRun(params.runId)
  if (!run) {
    return NextResponse.json(
      {
        error: `No run "${params.runId}" on this instance. Runs are content-addressed: re-POST the same analysis_id and inputs to /api/analytics/analysis-runs to reproduce the identical record.`,
      },
      { status: 404 }
    )
  }
  return NextResponse.json(run)
}
