import React from 'react'

import { BrowserSim } from '@/components/grex/BrowserSim'
import { SurfaceHeader } from '@/components/grex/SimChrome'
import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — Browser Extension`,
}

export default function GrexBrowserPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SurfaceHeader
        kicker="Surface A · Ambient information consumption"
        title="Browser extension"
        description="You browse normally; GREX checks the page passively. A small floating score is the entire interface — it never obstructs the page, and it never speaks unless asked."
      />
      <BrowserSim />
    </div>
  )
}
