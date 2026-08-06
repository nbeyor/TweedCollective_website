/**
 * Browser-side decoding of chart tokens (see lib/mcp/chartToken.ts for the
 * encoder). Tokens arrive in the URL hash fragment so they never hit the
 * server; the browser inflates them with DecompressionStream.
 *
 * No signature check here — the signing secret is server-only, and these
 * pages render token data through React chart components (never as raw
 * HTML), so a hand-crafted token can at worst draw a chart of made-up
 * numbers, same as any client-side charting page.
 */

import type { ChartPayload } from '@/lib/mcp/chartToken'

export type { ChartPayload }

export async function decodeTokenClient(token: string): Promise<ChartPayload | null> {
  try {
    const dot = token.lastIndexOf('.')
    const body = dot > 0 ? token.slice(0, dot) : token
    const b64 = body.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
    const payload = JSON.parse(await new Response(stream).text()) as ChartPayload
    if (payload?.kind !== 'generated' && payload?.kind !== 'fixed') return null
    return payload
  } catch {
    return null
  }
}

/** Tokens from the current location hash: #t=<tok> or #t=<tok1>,<tok2>,… */
export function tokensFromHash(): string[] {
  if (typeof window === 'undefined') return []
  const hash = window.location.hash.replace(/^#/, '')
  const t = new URLSearchParams(hash).get('t')
  return t ? t.split(',').filter(Boolean) : []
}
