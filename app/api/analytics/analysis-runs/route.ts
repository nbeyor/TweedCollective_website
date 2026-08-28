/**
 * POST /api/analytics/analysis-runs — execute one registered biostatistics
 * analysis (module PRD §8). The engine validates the analysis id, schema, and
 * ranges before anything runs; unknown analyses and fields are rejected with
 * a 400 and the reason. Runs are content-addressed and idempotent: identical
 * normalized inputs return the same run_id and identical outputs.
 */

import { NextRequest, NextResponse } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { runAnalysis, type RunRequest } from '@/lib/biostats/engine'

export const runtime = 'nodejs'

const WORKSPACE_SLUG = 'protocol-strategist'

export async function POST(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  let body: RunRequest
  try {
    body = (await req.json()) as RunRequest
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const result = runAnalysis(body)
  if ('error' in result) {
    return NextResponse.json(result, { status: 400 })
  }
  return NextResponse.json(result)
}
