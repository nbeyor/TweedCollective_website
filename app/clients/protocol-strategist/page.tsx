import React from 'react'

import { StrategistChat } from '@/components/protocol-strategist/StrategistChat'
import { manifest } from '@/lib/trialCorpus'

export const metadata = {
  title: 'Clinical Trial Protocol Strategist — Tweed Collective',
  description: 'Strategize protocol design against a structured trial corpus.',
}

// Corpus stats are read at build time. Access is per user, not just per
// sign-in: the layout requires the 'protocol-strategist' workspace grant, and
// the API routes behind this page check the same grant.
export default function ProtocolStrategistPage() {
  const m = manifest() as Record<string, number | string>

  const suggestions = [
    'Which eligibility criteria are doing the most screening damage in Phase 3 asthma trials?',
    'Compare assessment burden across Phase 2 oncology protocols — who is asking too much of participants?',
    'What design choices actually predict a longer enrollment timeline in this corpus?',
    'Show me how criteria design affects who ends up enrolled at US sites.',
  ]

  return (
    <div className="min-h-screen bg-void flex flex-col">
      <header className="border-b border-slate bg-carbon px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sage-bright mb-1">
              Tweed Collective · Demonstration
            </p>
            <h1 className="text-xl text-cream font-light">Clinical Trial Protocol Strategist</h1>
          </div>
          <p className="text-xs text-stone">
            {m.protocolCount} protocols · {m.siteCount} sites · synthetic corpus v{m.corpusVersion}
          </p>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <StrategistChat suggestions={suggestions} />
      </main>

      <footer className="border-t border-slate bg-carbon px-6 py-3">
        <p className="max-w-3xl mx-auto text-[11px] leading-relaxed text-stone">
          All data shown is synthetic and generated for demonstration. No real sponsor, site,
          investigator, protocol, or participant is represented. Not fit for clinical, regulatory,
          or operational decisions.
        </p>
      </footer>
    </div>
  )
}
