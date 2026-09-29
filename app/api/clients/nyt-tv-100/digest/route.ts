import { cronRequestAuthorized } from '@/lib/nyt-tv/cronAuth'
import { runDigest } from '@/lib/nyt-tv/runDigest'
import type { DigestScope } from '@/lib/nyt-tv/digest'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Vercel Cron hits this with GET. Clerk does not cover the request — middleware
 * admits it only when Authorization is Bearer CRON_SECRET. This handler checks
 * the same secret again.
 */
async function handle(req: Request) {
  if (!cronRequestAuthorized(req.headers.get('authorization'))) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const url = new URL(req.url)
  const scope: DigestScope = url.searchParams.get('scope') === 'all' ? 'all' : 'since-last'

  try {
    const result = await runDigest({ scope })
    return Response.json({
      mode: result.mode,
      reason: result.reason,
      dayKey: result.digest.dayKey,
      activityCount: result.digest.activityCount,
      recipients: result.recipients,
      persistence: result.persistence,
      text: result.text,
    })
  } catch (error) {
    console.error('[nyt-tv-100] digest failed', error)
    return Response.json({ error: 'Digest failed. See server logs.' }, { status: 500 })
  }
}

export function GET(req: Request) {
  return handle(req)
}

export function POST(req: Request) {
  return handle(req)
}
