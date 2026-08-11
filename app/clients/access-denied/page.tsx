import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { SignOutButton } from '@clerk/nextjs'
import { getClientConfig } from '@/content/clients'
import { clientSlugsForUser } from '@/lib/client-access'
import { CONTACT_EMAIL } from '@/lib/site'
import { AccessRecheck } from '@/components/AccessRecheck'

export default async function AccessDeniedPage({
  searchParams,
}: {
  searchParams: { client?: string }
}) {
  const config = searchParams.client ? getClientConfig(searchParams.client) : undefined
  // An unregistered slug still gets named: "you don't have access to the
  // 'old-slug' workspace" tells the reader they followed a stale link, where
  // a generic message would read as a mysterious blanket denial.
  const workspaceName = config
    ? `the ${config.name} workspace`
    : searchParams.client
      ? `the “${searchParams.client}” workspace`
      : 'this client workspace'

  const user = await currentUser()
  const signedInEmail = user?.primaryEmailAddress?.emailAddress
  const grantedSlugs = user ? clientSlugsForUser(user) : []

  return (
    <div className="container mx-auto px-6 py-16">
      {/* The guard sometimes evaluates stale auth on the first request after
          sign-in; a browser-side recheck moments later sees the real grant
          and sends the visitor into the workspace they were denied. */}
      {config && <AccessRecheck slug={config.slug} />}
      <div className="max-w-xl">
        <div className="mb-6 inline-flex p-3 rounded-lg bg-sage/10">
          <Lock className="w-6 h-6 text-sage" />
        </div>
        <span className="mono-label mb-4 block">// Access Restricted</span>
        <h1 className="text-cream mb-4">You don&apos;t have access to {workspaceName}</h1>
        {signedInEmail && (
          <p className="text-stone mb-4">
            You&apos;re signed in as{' '}
            <span className="font-mono text-sm text-sage-light">{signedInEmail}</span>, and that
            account isn&apos;t linked to {workspaceName}.
          </p>
        )}
        <p className="text-stone mb-4">
          Workspace access is granted to a specific account. If your access was set up under a
          different email address, sign out below and sign back in with that address. If you
          expected access on this account, email us and we&apos;ll set it up.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-sm text-sage-light select-all block mb-8"
        >
          {CONTACT_EMAIL}
        </a>
        <div className="flex flex-wrap items-center gap-4">
          {grantedSlugs.length > 0 && (
            <Link href="/clients" className="btn-outline">
              Back to your workspaces
            </Link>
          )}
          <SignOutButton redirectUrl="/sign-in">
            <button type="button" className="btn-outline">
              Sign out &amp; switch account
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  )
}
