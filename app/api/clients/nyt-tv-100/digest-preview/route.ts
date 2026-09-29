import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, digestRecipients } from '@/lib/nyt-tv/access'
import type { DigestScope } from '@/lib/nyt-tv/digest'
import { composeDigest, digestSendEnabled } from '@/lib/nyt-tv/runDigest'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Signed-in workspace preview. Never sends mail. */
export async function GET(req: Request) {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied

  const scope: DigestScope = new URL(req.url).searchParams.get('scope') === 'all' ? 'all' : 'since-last'
  const composed = await composeDigest(scope)

  return Response.json({
    scope,
    sendEnabled: digestSendEnabled(),
    recipients: digestRecipients(),
    persistence: composed.persistence,
    lastSentAt: composed.lastSentAt,
    digest: composed.digest,
    text: composed.text,
  })
}
