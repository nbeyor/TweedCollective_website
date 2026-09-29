import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, lookupViewer, voteRecord, type NytViewer } from '@/lib/nyt-tv/access'
import { showByRank } from '@/lib/nyt-tv/shows'
import { getVoteStore } from '@/lib/nyt-tv/store'
import { isVoteChoice } from '@/lib/nyt-tv/types'
import type { PairRecord } from '@/lib/nyt-tv/pairs'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer

  const store = getVoteStore()
  const pair = await store.getPairForUser(viewer.userId)
  const votes = (await store.listVotes(viewer.userId)).filter((vote) => !pair || vote.pairId === pair.id)
  return Response.json({ userId: viewer.userId, pairId: pair?.id ?? null, persistence: store.kind, votes })
}

export async function PUT(req: Request) {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer
  const pair = await requirePair(viewer)
  if (pair instanceof Response) return pair

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

  const record = voteRecord(viewer.userId, pair.id, rank, vote)
  const store = getVoteStore()
  await store.putVote(record)
  return Response.json({ vote: record, persistence: store.kind })
}

export async function DELETE(req: Request) {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer

  const rank = rankFrom(new URL(req.url).searchParams.get('rank'))
  if (!rank) return Response.json({ error: 'Send a show rank.' }, { status: 400 })

  const store = getVoteStore()
  await store.deleteVote(viewer.userId, rank)
  return Response.json({ ok: true, persistence: store.kind })
}

async function grantedViewer(): Promise<NytViewer | Response> {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied
  const lookup = await lookupViewer()
  if (lookup.status !== 'ok') {
    return Response.json({ error: 'Verify your email, then refresh.' }, { status: 403 })
  }
  return lookup.viewer
}

async function requirePair(viewer: NytViewer): Promise<PairRecord | Response> {
  const pair = await getVoteStore().getPairForUser(viewer.userId)
  if (!pair) {
    return Response.json({ error: 'Create an invite before swiping.' }, { status: 409 })
  }
  return pair
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
