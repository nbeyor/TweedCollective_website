import { clientAccessError } from '@/lib/client-access'
import { NYT_TV_CLIENT_SLUG, lookupAccountByEmail, lookupViewer } from '@/lib/nyt-tv/access'
import { loadPairView, removePair, requestPair } from '@/lib/nyt-tv/pairing'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer
  const view = await loadPairView(getVoteStore(), viewer.userId)
  return Response.json(publicPair(view))
}

export async function POST(req: Request) {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer

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

  const store = getVoteStore()
  const result = await requestPair(store, viewer, email, { partner: await lookupAccountByEmail(email) })
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status })
  const view = await loadPairView(store, viewer.userId)
  return Response.json(publicPair(view))
}

export async function DELETE() {
  const viewer = await grantedViewer()
  if (viewer instanceof Response) return viewer
  const result = await removePair(getVoteStore(), viewer.userId, viewer.email)
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status })
  return Response.json({ ok: true, status: 'solo' })
}

async function grantedViewer() {
  const denied = await clientAccessError(NYT_TV_CLIENT_SLUG)
  if (denied) return denied
  const lookup = await lookupViewer()
  if (lookup.status !== 'ok') {
    return Response.json({ error: 'Verify your email before pairing.' }, { status: 403 })
  }
  return lookup.viewer
}

function publicPair(view: Awaited<ReturnType<typeof loadPairView>>) {
  return {
    status: view.status,
    partnerEmail: view.partnerEmail,
    invitePath: view.invitePath,
    confirmed: view.confirmed,
  }
}
