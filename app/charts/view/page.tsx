'use client'

/**
 * Standalone viewer for one chart token — the MCP counterpart of an
 * InsightPanel card. Fixed panels render through the same FixedCharts
 * components the workspace uses; generated specs render the same sandboxed
 * HTML document. The token rides in the hash fragment (#t=…) so large panel
 * payloads never touch the server.
 */

import React, { useEffect, useState } from 'react'

import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { ChartCard } from '../ChartCard'
import { decodeTokenClient, tokensFromHash, type ChartPayload } from '../clientToken'

export default function ChartViewPage() {
  const [state, setState] = useState<'loading' | 'missing' | 'ready'>('loading')
  const [payload, setPayload] = useState<ChartPayload | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [token] = tokensFromHash()
      const decoded = token ? await decodeTokenClient(token) : null
      if (cancelled) return
      setPayload(decoded)
      setState(decoded ? 'ready' : 'missing')
    }
    load()
    window.addEventListener('hashchange', load)
    return () => {
      cancelled = true
      window.removeEventListener('hashchange', load)
    }
  }, [])

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: wcg.surfaceMuted }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.14em] mb-3" style={{ color: wcg.teal }}>
          Protocol Strategist · chart
        </p>
        {state === 'loading' && (
          <p className="text-sm" style={{ color: wcg.muted }}>
            Loading chart…
          </p>
        )}
        {state === 'missing' && (
          <p className="text-sm" style={{ color: wcg.muted }}>
            This chart link is missing or malformed. Ask the strategist to re-run the analysis for a
            fresh link.
          </p>
        )}
        {state === 'ready' && payload && <ChartCard payload={payload} />}
      </div>
    </div>
  )
}
