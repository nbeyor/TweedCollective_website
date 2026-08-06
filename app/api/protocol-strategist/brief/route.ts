/**
 * Derived design brief for one corpus protocol.
 *
 * GET /api/protocol-strategist/brief?protocol_id=TCX-0056
 *
 * The picker fetches this when the user selects a corpus protocol, so the left
 * panel can render the protocol's eligibility, endpoints, and arms in the same
 * shape as the drafted hero brief. The hero brief itself stays server-rendered
 * into the page.
 */

import { NextRequest } from 'next/server'

import { clientAccessError } from '@/lib/client-access'
import { deriveBriefFromProtocol } from '@/lib/trialCorpus'

export const runtime = 'nodejs'

/** Workspace this endpoint belongs to — callers need it granted in Clerk. */
const WORKSPACE_SLUG = 'protocol-strategist'

export async function GET(req: NextRequest) {
  const denied = await clientAccessError(WORKSPACE_SLUG)
  if (denied) return denied

  const protocolId = req.nextUrl.searchParams.get('protocol_id')
  if (!protocolId) {
    return Response.json({ error: 'protocol_id is required.' }, { status: 400 })
  }

  const brief = deriveBriefFromProtocol(protocolId)
  if (!brief) {
    return Response.json({ error: `Unknown protocol "${protocolId}".` }, { status: 404 })
  }
  return Response.json(brief, { headers: { 'cache-control': 'private, max-age=3600' } })
}
