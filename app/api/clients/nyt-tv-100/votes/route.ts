import { showByRank } from '@/lib/nyt-tv/shows'
import { nytTvSession, nytTvSessionError, voteRecord } from '@/lib/nyt-tv/access'
import { getVoteStore } from '@/lib/nyt-tv/store'
import { isVoteChoice } from '@/lib/nyt-tv/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await nytTvSession()
  if (session.status !== 'ok') {
    return nytTvSessionError(session) ?? Response.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const store = getVoteStore()
  const votes = await store.listVotes(session.profileId)
  return Response.json({ profileId: session.profileId, persistence: store.kind, votes })
}

export async function PUT(req: Request) {
  const session = await nytTvSession()
  if (session.status !== 'ok') {
    return nytTvSessionError(session) ?? Response.json({ error: 'Sign in required.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Expected JSON.' }, { status: 400 })
  }

  const rank = rankFrom(body)
  const vote = body && typeof body === 'object' ? (body as { vote?: unknown }).vote : undefined
  if (!rank || !isVoteChoice(vote)) {
    return Response.json({ error: 'Send showRank and vote "want" or "skip".' }, { status: 400 })
  }

  const record = voteRecord(session.profileId, rank, vote)
  const store = getVoteStore()
  await store.putVote(record)
  return Response.json({ vote: record, persistence: store.kind })
}

export async function DELETE(req: Request) {
  const session = await nytTvSession()
  if (session.status !== 'ok') {
    return nytTvSessionError(session) ?? Response.json({ error: 'Sign in required.' }, { status: 401 })
  }

  const rank = rankFrom(new URL(req.url).searchParams.get('rank'))
  if (!rank) return Response.json({ error: 'Send a show rank.' }, { status: 400 })

  const store = getVoteStore()
  await store.deleteVote(session.profileId, rank)
  return Response.json({ ok: true, persistence: store.kind })
}

function rankFrom(bodyOrRank: unknown): number | null {
  const raw =
    typeof bodyOrRank === 'string' || typeof bodyOrRank === 'number'
      ? bodyOrRank
      : bodyOrRank && typeof bodyOrRank === 'object'
        ? (bodyOrRank as { showRank?: unknown }).showRank
        : undefined
  const rank = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isInteger(rank) || !showByRank(rank)) return null
  return rank
}
