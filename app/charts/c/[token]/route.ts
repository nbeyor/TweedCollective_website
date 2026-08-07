/**
 * Stateless permalink for a generated chart.
 *
 * The whole chart spec rides inside the signed token (lib/mcp/chartToken.ts),
 * so this route is pure: decode, verify, render with the same buildChartHtml
 * the web workspace uses. Deterministic output → cache forever. Tampered or
 * malformed tokens get a 404-shaped 400, never a broken page.
 */

import { buildChartHtml } from '@/lib/generatedChart'
import { decodeChartToken } from '@/lib/mcp/chartToken'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const payload = decodeChartToken(decodeURIComponent(params.token ?? ''))
  if (!payload || payload.kind !== 'generated') {
    return new Response('Invalid or expired chart link.', {
      status: 400,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  }
  return new Response(buildChartHtml(payload.spec), {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
    },
  })
}
