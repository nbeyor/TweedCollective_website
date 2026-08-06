import React from 'react'

import { StrategistWorkspace } from '@/components/protocol-strategist/StrategistWorkspace'
import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { designBrief, manifest } from '@/lib/trialCorpus'

export const metadata = {
  title: 'WCG IntelX — Clinical Trial Strategist',
  description: 'Pressure-test a drafted trial design against operational history, before the protocol is written.',
}

// The brief and corpus stats are read at build time. Access is per user, not
// just per sign-in: the layout requires the 'protocol-strategist' workspace
// grant, and the API routes behind this page check the same grant.
export default function ProtocolStrategistPage() {
  const brief = designBrief()
  const m = manifest() as Record<string, number | string>
  const briefDocLink = process.env.STRATEGIST_BRIEF_DOC_ID
    ? `https://docs.google.com/document/d/${process.env.STRATEGIST_BRIEF_DOC_ID}/edit`
    : null

  return (
    <div className="h-screen flex flex-col" style={{ background: wcg.page }}>
      <header className="border-b px-6 py-3.5 shrink-0" style={{ background: wcg.navy, borderColor: wcg.navyDeep }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="text-[17px] font-semibold tracking-tight text-white">WCG IntelX</span>
            <span className="text-[12px]" style={{ color: '#9DB2C6' }}>
              Clinical Trial Strategist
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[11px]" style={{ color: '#9DB2C6' }}>
              {m.protocolCount} protocols · {m.siteCount} sites · synthetic corpus v{m.corpusVersion}
            </p>
            <span className="text-[10.5px] flex items-center gap-1.5" style={{ color: '#7C93AA' }}>
              <span className="w-1 h-1 rounded-full" style={{ background: wcg.teal }} />
              powered by Tweed Collective
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <StrategistWorkspace brief={brief} briefDocLink={briefDocLink} />
      </main>

      <footer className="border-t px-6 py-2 shrink-0" style={{ background: wcg.surface, borderColor: wcg.border }}>
        <p className="text-[10.5px] leading-relaxed" style={{ color: wcg.faint }}>
          All data shown is synthetic and generated for demonstration. No real sponsor, site, investigator,
          molecule, protocol, or participant is represented. Not fit for clinical, regulatory, or operational
          decisions.
        </p>
      </footer>
    </div>
  )
}
