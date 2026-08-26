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
        description="AI systems call verify_facts to have their own factual output independently checked before presenting it — the same engine, the same score, delivered as structured data an agent can act on."
      />
      <McpSim />
    </div>
  )
}
