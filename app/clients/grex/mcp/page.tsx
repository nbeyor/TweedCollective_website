import React from 'react'

import { McpSim } from '@/components/grex/McpSim'
import { SurfaceHeader } from '@/components/grex/SimChrome'
import { GREX_BRAND } from '@/lib/grex/brand'

export const metadata = {
  title: `${GREX_BRAND.name} — Agent Verification`,
}

export default function GrexMcpPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <SurfaceHeader
        kicker="Surface C · AI-generated factual information"
        title="Agent verification (MCP)"
        description="The agent answers normally; verify_facts runs between drafting and presenting. The entire product is one quiet score line at the end of the response — and only when the response contains checkable facts."
      />
      <McpSim />
    </div>
  )
}
