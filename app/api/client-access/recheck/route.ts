import { NextResponse } from 'next/server'
import { clientAccessError } from '@/lib/client-access'

export const dynamic = 'force-dynamic'

/**
 * Re-evaluates workspace access for the signed-in session, with fresh cookies.
 *
 * The access-denied page polls this because the server guard can evaluate a
 * stale auth state on the first request after sign-in (users reported being
 * denied, pressing Back, and getting straight in — same account, seconds
 * apart). By the time the denial page has rendered, clerk-js has settled the
 * active session, so a re-check from the browser sees the grant the original
 * request missed and the page can send the user into the workspace.
 */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('client')
  if (!slug) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const denied = await clientAccessError(slug)
  return NextResponse.json({ ok: denied === null })
}
