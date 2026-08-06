/**
 * Stateless chart permalinks for the MCP surface.
 *
 * The web workspace streams charts into the InsightPanel over SSE; an MCP
 * client gets a URL instead. Vercel functions are stateless, so instead of
 * storing charts we encode the whole chart payload into the URL itself:
 * JSON → deflate → base64url, plus a truncated HMAC so /charts/* cannot be
 * used to render arbitrary attacker-authored content on this domain.
 *
 * Two payload kinds mirror the two InsightPanel card kinds:
 *   generated — a GeneratedChartSpec rendered server-side by buildChartHtml
 *   fixed     — a PanelDescriptor rendered client-side by FixedCharts
 */

import { createHmac, timingSafeEqual } from 'crypto'
import { deflateRawSync, inflateRawSync } from 'zlib'

import type { GeneratedChartSpec } from '../generatedChart'

export type ChartPayload =
  | { kind: 'generated'; spec: GeneratedChartSpec }
  | { kind: 'fixed'; panel: { chart: string; data: Record<string, unknown> } }

/** Signature length in base64url chars (16 bytes → 22 chars, ample for spoofing resistance). */
const SIG_CHARS = 22

function signingSecret(): string {
  if (process.env.CHART_SIGNING_SECRET) return process.env.CHART_SIGNING_SECRET
  // Derive from the MCP key so one secret is enough to configure. The derived
  // value never leaves the server.
  if (process.env.MCP_API_KEY) return `chart:${process.env.MCP_API_KEY}`
  // Dev fallback — fine locally, and production sets MCP_API_KEY anyway
  // (without it the MCP endpoint refuses every request, so no tokens exist).
  return 'chart:dev-insecure'
}

function sign(body: string): string {
  return createHmac('sha256', signingSecret()).update(body).digest('base64url').slice(0, SIG_CHARS)
}

export function encodeChartToken(payload: ChartPayload): string {
  const body = deflateRawSync(Buffer.from(JSON.stringify(payload), 'utf-8')).toString('base64url')
  return `${body}.${sign(body)}`
}

/** Public base for chart links returned to MCP clients. */
export function publicBaseUrl(): string {
  if (process.env.MCP_PUBLIC_BASE_URL) return process.env.MCP_PUBLIC_BASE_URL.replace(/\/+$/, '')
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  return 'http://localhost:3000'
}

/** A path token beyond this rides in a URL hash fragment instead (fragments never hit the server, so no request-line limit). */
const MAX_PATH_TOKEN = 6_000
/** Beyond this even a fragment URL is unreasonable; return the token without a link. */
const MAX_FRAGMENT_TOKEN = 50_000

/**
 * Token + shareable URL for a chart payload. Generated charts get the
 * server-rendered permalink; fixed panels (and oversized generated specs) get
 * the client-rendered viewer with the token in the hash fragment.
 */
export function chartLink(payload: ChartPayload): {
  chart_token: string
  chart_url: string | null
} {
  const token = encodeChartToken(payload)
  const base = publicBaseUrl()
  if (payload.kind === 'generated' && token.length <= MAX_PATH_TOKEN) {
    return { chart_token: token, chart_url: `${base}/charts/c/${token}` }
  }
  if (token.length <= MAX_FRAGMENT_TOKEN) {
    return { chart_token: token, chart_url: `${base}/charts/view#t=${token}` }
  }
  return { chart_token: token, chart_url: null }
}

/** Decode and verify a token. Returns null for malformed, tampered, or oversized input. */
export function decodeChartToken(token: string): ChartPayload | null {
  if (typeof token !== 'string' || token.length > 120_000) return null
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const body = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = sign(body)
  if (sig.length !== expected.length) return null
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
  try {
    const json = inflateRawSync(Buffer.from(body, 'base64url')).toString('utf-8')
    const payload = JSON.parse(json) as ChartPayload
    if (payload?.kind !== 'generated' && payload?.kind !== 'fixed') return null
    return payload
  } catch {
    return null
  }
}
