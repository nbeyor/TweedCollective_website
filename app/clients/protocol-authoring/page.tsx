import React from 'react'

import { FoundryWorkspace } from '@/components/protocol-authoring/FoundryWorkspace'
import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { FOUNDRY_BRAND } from '@/lib/protocol-authoring/brand'
import { manifest } from '@/lib/trialCorpus'

export const metadata = {
  title: `${FOUNDRY_BRAND.name} — ${FOUNDRY_BRAND.tagline}`,
  description:
    'Author and pressure-test a Phase III protocol draft: section-level review, grounded analytics, and a multi-lens review board.',
}

// Access is per user, not just per sign-in: the layout requires the
// 'protocol-authoring' workspace grant, and the API route checks the same.
export default function ProtocolAuthoringPage() {
  const m = manifest() as Record<string, number | string>

  return (
    <div className="h-screen flex flex-col" style={{ background: wcg.page }}>
      <header className="border-b px-6 py-3.5 shrink-0" style={{ background: wcg.navy, borderColor: wcg.navyDeep }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <span className="text-[17px] font-semibold tracking-tight text-white">{FOUNDRY_BRAND.name}</span>
            <span className="text-[12px]" style={{ color: '#9DB2C6' }}>
              {FOUNDRY_BRAND.tagline}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[11px]" style={{ color: '#9DB2C6' }}>
              HORIZON-Lung-301 draft · {m.protocolCount} comparator protocols · {m.siteCount} sites
            </p>
            {FOUNDRY_BRAND.showPoweredBy && (
              <span className="text-[10.5px] flex items-center gap-1.5" style={{ color: '#7C93AA' }}>
                <span className="w-1 h-1 rounded-full" style={{ background: wcg.teal }} />
                powered by Tweed Collective
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        <FoundryWorkspace />
      </main>

      <footer className="border-t px-6 py-2 shrink-0" style={{ background: wcg.surface, borderColor: wcg.border }}>
        <p className="text-[10.5px] leading-relaxed" style={{ color: wcg.faint }}>
          All content shown is synthetic and generated for demonstration. HORIZON-Lung-301, MRD-1872, and
          Meridian Oncology are fictional; no real sponsor, site, investigator, molecule, protocol, or
          participant is represented. Not fit for clinical, regulatory, or operational decisions.
        </p>
      </footer>
    </div>
  )
}
