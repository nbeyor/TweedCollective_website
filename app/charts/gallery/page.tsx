'use client'

/**
 * The MCP counterpart of the workspace insight panel: every chart token in the
 * hash fragment (#t=<tok1>,<tok2>,…) rendered as a card, newest last. The
 * build_chart_gallery tool assembles these URLs from tokens the agent
 * collected across ask_strategist calls — no server storage involved.
 */

import React, { useEffect, useState } from 'react'

import { wcg } from '@/components/protocol-strategist/wcgTheme'
import { ChartCard } from '../ChartCard'
import { decodeTokenClient, tokensFromHash, type ChartPayload } from '../clientToken'

export default function ChartGalleryPage() {
  const [state, setState] = useState<'loading' | 'missing' | 'ready'>('loading')
  const [charts, setCharts] = useState<ChartPayload[]>([])
  const [dropped, setDropped] = useState(0)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const tokens = tokensFromHash()
      const decoded = await Promise.all(tokens.map(decodeTokenClient))
      if (cancelled) return
      const good = decoded.filter((p): p is ChartPayload => Boolean(p))
      setCharts(good)
      setDropped(decoded.length - good.length)
      setState(good.length ? 'ready' : 'missing')
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
        <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
          Protocol Strategist · chart gallery
        </p>
        {state === 'ready' && (
          <p className="text-[12px] mb-4" style={{ color: wcg.muted }}>
            {charts.length} chart{charts.length === 1 ? '' : 's'} from this session
            {dropped > 0 ? ` · ${dropped} link${dropped === 1 ? '' : 's'} could not be decoded` : ''}
          </p>
        )}
        {state === 'loading' && (
          <p className="text-sm" style={{ color: wcg.muted }}>
            Loading charts…
          </p>
        )}
        {state === 'missing' && (
          <p className="text-sm mt-3" style={{ color: wcg.muted }}>
            No readable charts in this link. Ask the strategist to rebuild the gallery.
          </p>
        )}
        <div className="space-y-4">
          {charts.map((payload, i) => (
            <ChartCard key={i} payload={payload} />
          ))}
        </div>
      </div>
    </div>
  )
}
