import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getClientSlugs } from '@/lib/client-access'
import { getClientConfig } from '@/content/clients'
import { CONTACT_EMAIL } from '@/lib/site'

export default async function ClientsIndexPage() {
  const slugs = await getClientSlugs()

  if (slugs.length === 1) {
    redirect(`/clients/${slugs[0]}`)
  }

  const clients = slugs
    .map((slug) => getClientConfig(slug))
    .filter((client): client is NonNullable<typeof client> => Boolean(client))

  return (
    <div className="container mx-auto px-6 py-16">
      <span className="mono-label mb-4 block">// Client Workspace</span>
      <h1 className="text-cream mb-8">Your workspaces</h1>

      {clients.length === 0 ? (
        <div className="max-w-xl">
          <p className="text-stone mb-4">
            Your account is not linked to a client workspace yet. If you expected access, email us
            and we'll set it up.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-sm text-sage-light select-all">
            {CONTACT_EMAIL}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {clients.map((client) => (
            <Link
              key={client.slug}
              href={`/clients/${client.slug}`}
              className="card p-6 flex items-center justify-between group hover:border-sage/50 transition-colors"
            >
              <div>
                <h2 className="text-cream text-lg font-semibold mb-1">{client.name}</h2>
                <p className="text-sm text-stone">
                  {client.deliverables.length} deliverable{client.deliverables.length === 1 ? '' : 's'}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone group-hover:text-sage-light group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
