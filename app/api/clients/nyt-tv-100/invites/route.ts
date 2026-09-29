import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, lookupViewer } from '@/lib/nyt-tv/access'
import { createOrUpdateInvite } from '@/lib/nyt-tv/pairing'
import { invitePath } from '@/lib/nyt-tv/pairs'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied

  const lookup = await lookupViewer()
  if (lookup.status !== 'ok') {
    return Response.json({ error: 'Verify your email before inviting a partner.' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Expected JSON.' }, { status: 400 })
  }
  const email = body && typeof body === 'object' ? (body as { email?: unknown }).email : undefined
  if (typeof email !== 'string') {
    return Response.json({ error: 'Send an email address.' }, { status: 400 })
  }

  const result = await createOrUpdateInvite(getVoteStore(), lookup.viewer, email)
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status })

  return Response.json({
    status: result.pair.status,
    partnerEmail: result.pair.inviteEmail,
    invitePath: invitePath(result.pair.inviteToken),
  })
}
