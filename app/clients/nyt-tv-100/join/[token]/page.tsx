import React from 'react'
import type { Metadata } from 'next'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { grantNytClientSlug } from '@/lib/nyt-tv/access'
import { bindInvite } from '@/lib/nyt-tv/pairing'
import { invitePath, normalizeEmail } from '@/lib/nyt-tv/pairs'
import { getVoteStore } from '@/lib/nyt-tv/store'

export const metadata: Metadata = {
  title: 'Join a NYT 100 pair',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function JoinPairPage({ params }: { params: { token: string } }) {
  const token = decodeURIComponent(params.token)
  const user = await currentUser()
  if (!user) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(invitePath(token))}`)
  }

  const email = normalizeEmail(user.primaryEmailAddress?.emailAddress)
  const verified = user.primaryEmailAddress?.verification?.status === 'verified' && email != null
  if (!verified || !email) {
    return (
      <Gate
        title="Verify your email"
        body={`You're signed in as ${email ?? 'this account'}. Verify that address, then open the invite link again.`}
      />
    )
  }

  const result = await bindInvite(getVoteStore(), { userId: user.id, email, verified: true }, token)
  if (result.kind === 'bind' || result.kind === 'already-member') {
    await grantNytClientSlug(user)
    redirect('/clients/nyt-tv-100')
  }
  if (result.kind === 'self') {
    redirect('/clients/nyt-tv-100')
  }
  if (result.kind === 'email-mismatch') {
    return (
      <Gate
        title="This invite is for someone else"
        body={`You're signed in as ${email}. The link was sent for ${result.pair?.inviteEmail ?? 'a different address'}. Sign in with that email, then open the link again.`}
      />
    )
  }
  if (result.kind === 'other-pair') {
    return (
      <Gate
        title="You're already paired"
        body="This account is already in a pair. Swipes stay with that couple."
      />
    )
  }
  return <Gate title="Invite link not found" body="That link doesn't match a pending invite. Ask your partner to send a new one." />
}

function Gate({ title, body }: { title: string; body: string }) {
  return (
    <div className="container mx-auto max-w-xl px-6 py-16">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-sage-light">Your pair</p>
      <h1 className="mb-4 text-3xl font-semibold text-cream">{title}</h1>
      <p className="text-stone">{body}</p>
    </div>
  )
}
