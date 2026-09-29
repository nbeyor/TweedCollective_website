import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, lookupViewer } from '@/lib/nyt-tv/access'
import { confirmedPair, wantOverlap } from '@/lib/nyt-tv/pairs'
import { allShows } from '@/lib/nyt-tv/shows'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Overlap of want votes for the signed-in user's active pair only. */
export async function GET() {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied
  const lookup = await lookupViewer()
  if (lookup.status !== 'ok') {
    return Response.json({ error: 'Verify your email, then refresh.' }, { status: 403 })
  }

  const store = getVoteStore()
  const pair = await store.getPairForUser(lookup.viewer.userId)
  const confirmed = confirmedPair(pair)
  if (!pair || !confirmed) {
    return Response.json({
      paired: false,
      partnerEmail: null,
      shows: [],
    })
  }

  const [votesA, votesB] = await Promise.all([store.listVotes(confirmed.aUserId), store.listVotes(confirmed.bUserId)])
  const partnerEmail = lookup.viewer.userId === confirmed.aUserId ? confirmed.bEmail : confirmed.aEmail
  return Response.json({
    paired: true,
    partnerEmail,
    shows: wantOverlap(votesA, votesB, allShows()),
  })
}
