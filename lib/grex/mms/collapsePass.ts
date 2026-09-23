import Anthropic from '@anthropic-ai/sdk'

import {
  buildCollapseViz,
  provisionalDateTarget,
  quotedFragment,
  withObservedDate,
  type CollapseSearchHit,
  type CollapseViz,
} from '../collapse'
import type { VerificationResult } from '../types'
import type { MmsConfig } from './config'
import { fetchPublishedDate } from './dateMeta'

const SEARCH_MODEL = 'claude-opus-5'

/**
 * One quoted-fragment search per verifiable claim, capped at eight.
 * Hits are whatever the web_search tool returned (url, title, page_age).
 * The current tool result does not include a snippet; phrase clustering still
 * runs when a snippet is present on an evidence mention.
 */
export async function searchCollapseHits(
  client: Anthropic,
  result: VerificationResult
): Promise<Record<string, CollapseSearchHit[]>> {
  const verifiable = result.claims.filter((claim) => claim.verifiability === 'VERIFIABLE').slice(0, 8)
  const hitsByClaimId: Record<string, CollapseSearchHit[]> = {}
  for (const claim of verifiable) {
    const fragment = quotedFragment(claim.text)
    if (!fragment) {
      hitsByClaimId[claim.id] = []
      continue
    }
    try {
      hitsByClaimId[claim.id] = await searchOne(client, fragment)
    } catch (err) {
      console.error('[grex/mms] collapse search failed', claim.id, err instanceof Error ? err.name : 'error')
      hitsByClaimId[claim.id] = []
    }
  }
  return hitsByClaimId
}

async function searchOne(client: Anthropic, fragment: string): Promise<CollapseSearchHit[]> {
  const query = `"${fragment}"`
  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `Call the web_search tool once. Use this exact query string and do not rewrite it:\n${query}`,
    },
  ]
  const hits: CollapseSearchHit[] = []
  let executedQuery: string | null = null
  for (let round = 0; round < 3; round++) {
    const message = await client.messages.create({
      model: SEARCH_MODEL,
      max_tokens: 1500,
      system:
        'You only search. Call web_search one time with the exact query. Do not add claims, and do not answer from memory.',
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 1 }],
      messages,
    })
    for (const block of message.content) {
      if (block.type === 'server_tool_use' && block.name === 'web_search') {
        const input = block.input as { query?: unknown }
        if (typeof input?.query === 'string' && input.query.trim()) executedQuery = input.query.trim()
      }
      if (block.type === 'web_search_tool_result' && Array.isArray(block.content)) {
        for (const item of block.content) {
          if (item.type !== 'web_search_result') continue
          hits.push({
            url: item.url,
            title: item.title || '',
            snippet: '',
            pageAge: item.page_age,
            executedQuery,
          })
        }
      }
    }
    if (message.stop_reason !== 'pause_turn') break
    messages.push({ role: 'assistant', content: message.content })
  }
  return hits.slice(0, 8)
}

export async function collapsePass(
  result: VerificationResult,
  config: Pick<MmsConfig, 'dateMetaEnabled'>,
  client: Anthropic | null,
  hitsByClaimId?: Record<string, CollapseSearchHit[]>
): Promise<CollapseViz> {
  const hits = hitsByClaimId ?? (client ? await searchCollapseHits(client, result) : {})
  let viz = buildCollapseViz({ claims: result.claims, hitsByClaimId: hits })
  if (!config.dateMetaEnabled) return viz
  for (const claim of viz.claims) {
    for (const cluster of claim.clusters) {
      const target = provisionalDateTarget(cluster, claim.mentions)
      if (!target) continue
      const date = await fetchPublishedDate(target.url)
      if (!date) continue
      viz = withObservedDate(viz, target.id, date, 'page-meta')
    }
  }
  return viz
}
