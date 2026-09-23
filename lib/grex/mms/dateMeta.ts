import { isIP } from 'net'

import { parseObservedDate } from '../collapse'

const MAX_HTML_BYTES = 512 * 1024

/** Block link-local, loopback, and private addresses. Hostnames are fetched as given. */
export function isPublicHttpUrl(raw: string): boolean {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
  if (url.username || url.password) return false
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host || host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return false
  if (isIP(host) && isPrivateIp(host)) return false
  return true
}

function isPrivateIp(host: string): boolean {
  if (host.includes(':')) {
    const lower = host.toLowerCase()
    return lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')
  }
  const parts = host.split('.').map((part) => Number(part))
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true
  const [a, b] = parts
  if (a === 10 || a === 127 || a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  return false
}

export function extractPublishedDate(html: string): string | null {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? []
  for (const tag of tags) {
    const key = /(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase()
    if (key !== 'article:published_time') continue
    const content = /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1]
    const parsed = parseObservedDate(content)
    if (parsed) return parsed
  }

  const scripts = html.match(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? []
  for (const script of scripts) {
    const body = script.replace(/^<script\b[^>]*>/i, '').replace(/<\/script>$/i, '')
    try {
      const found = findDatePublished(JSON.parse(body) as unknown)
      if (found) return found
    } catch {
      /* ignore malformed JSON-LD */
    }
  }
  return null
}

function findDatePublished(value: unknown, depth = 0): string | null {
  if (depth > 8 || value == null) return null
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findDatePublished(item, depth + 1)
      if (found) return found
    }
    return null
  }
  if (typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  if (typeof record.datePublished === 'string') {
    const parsed = parseObservedDate(record.datePublished)
    if (parsed) return parsed
  }
  if (record['@graph']) {
    const found = findDatePublished(record['@graph'], depth + 1)
    if (found) return found
  }
  return null
}

export async function fetchPublishedDate(url: string, timeoutMs = 3000): Promise<string | null> {
  if (!isPublicHttpUrl(url)) return null
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent': 'GREX-date-meta/0.1 (publish-date only)',
      },
    })
    if (!response.ok || !response.body) return null
    const type = response.headers.get('content-type') ?? ''
    if (type && !/html|xml|text\/plain/i.test(type)) return null
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    while (total < MAX_HTML_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      if (!value) continue
      chunks.push(value)
      total += value.byteLength
    }
    await reader.cancel().catch(() => undefined)
    const html = new TextDecoder().decode(concatBytes(chunks))
    return extractPublishedDate(html)
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const size = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
  const out = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    out.set(chunk, offset)
    offset += chunk.byteLength
  }
  return out
}
