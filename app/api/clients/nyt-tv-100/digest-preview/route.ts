import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, lookupViewer } from '@/lib/nyt-tv/access'
import type { DigestScope } from '@/lib/nyt-tv/digest'
import { composeDigestForPair, digestSendEnabled } from '@/lib/nyt-tv/runDigest'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Signed-in preview of this viewer's pair only. Never sends mail. */
export async function GET(req: Request) {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied

  const lookup = await lookupViewer()
  if (lookup.status !== 'ok') {
    return Response.json({ error: 'Verify your email, then refresh.' }, { status: 403 })
  }

  const scope: DigestScope = new URL(req.url).searchParams.get('scope') === 'all' ? 'all' : 'since-last'
  const pair = await getVoteStore().getPairForUser(lookup.viewer.userId)
  const composed = await composeDigestForPair(pair, scope)

  return Response.json({
    scope,
    sendEnabled: digestSendEnabled(),
    recipients: composed.recipients,
    persistence: composed.persistence,
    lastSentAt: composed.lastSentAt,
    digest: composed.digest,
    text: composed.text,
  })
}
