import React from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { getClientConfig } from '@/content/clients'
import { CONTACT_EMAIL } from '@/lib/site'

export default function AccessDeniedPage({
  searchParams,
}: {
  searchParams: { client?: string }
}) {
  const config = searchParams.client ? getClientConfig(searchParams.client) : undefined
  const workspaceName = config ? `the ${config.name} workspace` : 'this client workspace'

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-xl">
        <div className="mb-6 inline-flex p-3 rounded-lg bg-sage/10">
          <Lock className="w-6 h-6 text-sage" />
        </div>
        <span className="mono-label mb-4 block">// Access Restricted</span>
        <h1 className="text-cream mb-4">You don&apos;t have access to {workspaceName}</h1>
        <p className="text-stone mb-4">
          You&apos;re signed in, but your account isn&apos;t linked to {workspaceName} yet. If you
          expected access, email us and we&apos;ll set it up.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-sm text-sage-light select-all block mb-8"
        >
          {CONTACT_EMAIL}
        </a>
        <Link href="/clients" className="btn-outline">
          Back to your workspaces
        </Link>
      </div>
    </div>
  )
}
