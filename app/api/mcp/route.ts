/**
 * Remote MCP endpoint for the Protocol Strategist (Streamable HTTP).
 *
 * External agents — Gemini Enterprise / ADK agents, Gemini CLI, any MCP
 * client — connect here with `Authorization: Bearer $MCP_API_KEY`. The
 * surface is the grounded-answer architecture (see lib/mcp/registry.ts):
 * the reasoning loop stays server-side; clients relay finished answers.
 *
 * Clerk-exempt (see middleware.ts) — auth is the bearer key below.
 */

import { createMcpHandler, withMcpAuth } from 'mcp-handler'

import { verifyMcpKey } from '@/lib/mcp/auth'
import { registerStrategist, SERVER_INFO, SERVER_INSTRUCTIONS } from '@/lib/mcp/registry'

export const runtime = 'nodejs'
// ask_strategist runs a multi-round model loop — same budget as the chat route.
export const maxDuration = 300

const handler = withMcpAuth(
  createMcpHandler((server) => registerStrategist(server), {
    serverInfo: SERVER_INFO,
    instructions: SERVER_INSTRUCTIONS,
  }),
  (_req, bearerToken) => {
    if (!verifyMcpKey(bearerToken)) return undefined
    return { token: bearerToken as string, clientId: 'strategist-mcp', scopes: ['strategist'] }
  },
  { required: true }
)

export { handler as GET, handler as POST, handler as DELETE }
