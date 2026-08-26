import React from 'react'

import { ScreenshotSim } from '@/components/grex/ScreenshotSim'
import { SurfaceHeader } from '@/components/grex/SimChrome'
import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — Screenshot Checker`,
}

export default function GrexScreenshotPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SurfaceHeader
        kicker="Surface B · User-triggered uncertainty"
        title="Screenshot checker"
        description="Something feels off — a text, a post, a product claim. Screenshot it, share it to GREX from the share sheet, and get a score without ever touching the original content."
      />
      <ScreenshotSim />
    </div>
  )
}
