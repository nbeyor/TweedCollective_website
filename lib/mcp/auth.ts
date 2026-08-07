/**
 * Bearer-key auth for the MCP endpoint.
 *
 * The endpoint is exempt from Clerk (external agents have no session cookie),
 * so it carries its own credential: a single static API key in MCP_API_KEY,
 * sent as `Authorization: Bearer <key>` by the MCP client (ADK connection
 * params, Gemini CLI headers). Single-owner deployment; OAuth 2.1 resource-
 * server auth is the upgrade path and slots into the same verifier seam.
 */

import { timingSafeEqual } from 'crypto'

export function verifyMcpKey(token: string | undefined): boolean {
  const expected = process.env.MCP_API_KEY
  if (!expected || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
