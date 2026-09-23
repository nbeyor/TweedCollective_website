/**
 * Deterministic claim-collapse (collapse-v0).
 *
 * Built from retrieved pages only. It does not choose a root with a model,
 * does not count the wider web, and does not feed hits back into v0Score.
 */

import type { Claim } from './types'

export type DomainKind =
  | 'journal-or-preprint'
  | 'government'
  | 'wire'
  | 'press-release'
  | 'encyclopedia'
  | 'social'
  | 'other'

export type DateSource = 'search-result' | 'title-or-snippet' | 'page-meta' | 'none'

export interface CollapseMention {
  id: string
  url: string
  canonicalUrl: string
  domain: string
  domainKind: DomainKind
  title: string
  snippet: string
  /** ISO date (YYYY-MM-DD). Null when unknown. */
  observedDate: string | null
  dateSource: DateSource
}

export interface CollapseCluster {
  id: string
  mentionIds: string[]
  /** Null when no member has a date. The UI must not invent a root. */
  rootMentionId: string | null
  rootRule: 'earliest-observed-date' | 'undated'
  linkReason: 'canonical-url' | 'similar-title' | 'shared-phrase'
}

export interface ClaimCollapse {
  claimId: string
  /** The quoted fragment actually sent to web search. Shown on the page. */
  query: string
  mentions: CollapseMention[]
  clusters: CollapseCluster[]
  retrievedCount: number
  clusterCount: number
  /**
   * Monthly buckets. Null unless at least three mentions have observedDate.
   * This is not a search-interest series.
   */
  dateHistogram: Array<{ bucket: string; count: number }> | null
}

export interface CollapseViz {
  version: 'collapse-v0'
  /** Stored so a later caption change does not rewrite old reports. */
  caption: string
  claims: ClaimCollapse[]
}

export const COLLAPSE_CAPTION =
  'The score above uses the sources in the claim cards. This diagram uses a wider public-web search for where the wording showed up. “Earliest” means the earliest date we could see on those results. It is not a citation trail, and it is not proof of who published first.'

export const DOMAIN_KIND_ORDER: DomainKind[] = [
  'journal-or-preprint',
  'government',
  'wire',
  'press-release',
  'encyclopedia',
  'social',
  'other',
]

export const DOMAIN_KIND_LABELS: Record<DomainKind, string> = {
  'journal-or-preprint': 'Journal or preprint',
  government: 'Government',
  wire: 'Wire',
  'press-release': 'Press release',
  encyclopedia: 'Encyclopedia',
  social: 'Social',
  other: 'Other',
}

/** CSS custom properties. Hex values live only in lib/grex/theme.ts. */
export const DOMAIN_KIND_VAR: Record<DomainKind, string> = {
  'journal-or-preprint': 'var(--grex-domain-journal)',
  government: 'var(--grex-domain-government)',
  wire: 'var(--grex-domain-wire)',
  'press-release': 'var(--grex-domain-press)',
  encyclopedia: 'var(--grex-domain-encyclopedia)',
  social: 'var(--grex-domain-social)',
  other: 'var(--grex-domain-other)',
}

const DOMAIN_KIND_BY_HOST: Record<string, DomainKind> = {
  'nature.com': 'journal-or-preprint',
  'science.org': 'journal-or-preprint',
  'sciencemag.org': 'journal-or-preprint',
  'cell.com': 'journal-or-preprint',
  'thelancet.com': 'journal-or-preprint',
  'nejm.org': 'journal-or-preprint',
  'jamanetwork.com': 'journal-or-preprint',
  'bmj.com': 'journal-or-preprint',
  'plos.org': 'journal-or-preprint',
  'frontiersin.org': 'journal-or-preprint',
  'mdpi.com': 'journal-or-preprint',
  'springer.com': 'journal-or-preprint',
  'springernature.com': 'journal-or-preprint',
  'wiley.com': 'journal-or-preprint',
  'sciencedirect.com': 'journal-or-preprint',
  'elsevier.com': 'journal-or-preprint',
  'oup.com': 'journal-or-preprint',
  'tandfonline.com': 'journal-or-preprint',
  'sagepub.com': 'journal-or-preprint',
  'acm.org': 'journal-or-preprint',
  'ieee.org': 'journal-or-preprint',
  'pnas.org': 'journal-or-preprint',
  'arxiv.org': 'journal-or-preprint',
  'biorxiv.org': 'journal-or-preprint',
  'medrxiv.org': 'journal-or-preprint',
  'ssrn.com': 'journal-or-preprint',
  'reuters.com': 'wire',
  'apnews.com': 'wire',
  'afp.com': 'wire',
  'bloomberg.com': 'wire',
  'prnewswire.com': 'press-release',
  'businesswire.com': 'press-release',
  'globenewswire.com': 'press-release',
  'wikipedia.org': 'encyclopedia',
  'britannica.com': 'encyclopedia',
  'twitter.com': 'social',
  'x.com': 'social',
  'facebook.com': 'social',
  'instagram.com': 'social',
  'tiktok.com': 'social',
  'reddit.com': 'social',
  'youtube.com': 'social',
  'linkedin.com': 'social',
  'threads.net': 'social',
  'bsky.app': 'social',
  'who.int': 'government',
  'europa.eu': 'government',
  'un.org': 'government',
}

const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'gclsrc',
  'dclid',
  'msclkid',
  'mc_cid',
  'mc_eid',
  'igshid',
  'igsh',
  'mkt_tok',
  '_hsenc',
  '_hsmi',
  'vero_id',
  'oly_enc_id',
  'soc_src',
  'soc_trk',
  'ref',
  'ref_src',
  'ref_url',
])

const MULTI_PART_SUFFIXES = new Set([
  'co.uk',
  'org.uk',
  'ac.uk',
  'gov.uk',
  'com.au',
  'net.au',
  'org.au',
  'co.nz',
  'com.br',
  'co.jp',
  'com.mx',
  'co.in',
])

const DATE_SOURCE_RANK: Record<DateSource, number> = {
  'search-result': 3,
  'title-or-snippet': 2,
  'page-meta': 1,
  none: 0,
}

const KIND_RANK: Record<DomainKind, number> = {
  'journal-or-preprint': 0,
  government: 1,
  wire: 2,
  'press-release': 3,
  encyclopedia: 4,
  social: 5,
  other: 6,
}

const LINK_RANK = { 'canonical-url': 3, 'similar-title': 2, 'shared-phrase': 1 } as const
type LinkReason = keyof typeof LINK_RANK

export interface CollapseSearchHit {
  url: string
  title: string
  snippet?: string
  /** Date field on the search hit, when the tool provides one. */
  pageAge?: string | null
  /** Actual query string sent to web search, when it can be read back. */
  executedQuery?: string | null
}

export function registrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, '').replace(/^www\./, '')
  const parts = host.split('.').filter(Boolean)
  if (parts.length < 2) return host
  const lastTwo = parts.slice(-2).join('.')
  if (MULTI_PART_SUFFIXES.has(lastTwo) && parts.length >= 3) return parts.slice(-3).join('.')
  return lastTwo
}

export function domainKindFor(domain: string): DomainKind {
  const d = domain.toLowerCase()
  if (d.endsWith('.gov') || d.endsWith('.mil') || d.endsWith('.gov.uk') || d === 'gov.uk') return 'government'
  return DOMAIN_KIND_BY_HOST[d] ?? 'other'
}

/** Scheme, host, tracking params, trailing slash, and obvious AMP wrappers. */
export function canonicalUrl(raw: string): string | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null

  const googleAmp = url.pathname.match(/^\/amp\/s\/([^/]+)(\/.*)?$/i)
  if (/(^|\.)google\.com$/i.test(url.hostname) && googleAmp) {
    return canonicalUrl(`https://${googleAmp[1]}${googleAmp[2] || '/'}`)
  }
  const cdnAmp = url.pathname.match(/^\/(?:c|v)\/s\/([^/]+)(\/.*)?$/i)
  if (url.hostname.endsWith('cdn.ampproject.org') && cdnAmp) {
    return canonicalUrl(`https://${cdnAmp[1]}${cdnAmp[2] || '/'}`)
  }

  let host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (host.startsWith('amp.') && host.split('.').length > 2) host = host.slice(4)

  let path = url.pathname || '/'
  path = path.replace(/\.amp\.html$/i, '')
  path = path.replace(/\/amp\/?$/i, '')
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  if (path === '/') path = ''

  const params = new URLSearchParams(url.search)
  for (const key of Array.from(params.keys())) {
    const lower = key.toLowerCase()
    if (lower.startsWith('utm_') || TRACKING_PARAMS.has(lower)) params.delete(key)
  }
  const entries = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]))
  const qs = new URLSearchParams(entries).toString()
  return `https://${host}${path}${qs ? `?${qs}` : ''}`
}

const MONTHS: Record<string, string> = {
  jan: '01',
  january: '01',
  feb: '02',
  february: '02',
  mar: '03',
  march: '03',
  apr: '04',
  april: '04',
  may: '05',
  jun: '06',
  june: '06',
  jul: '07',
  july: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  october: '10',
  nov: '11',
  november: '11',
  dec: '12',
  december: '12',
}

/** A full calendar date only. A bare year is not a publish date. */
export function parseObservedDate(raw: string | null | undefined): string | null {
  if (!raw) return null
  const text = raw.trim()
  const iso = text.match(/(\d{4})-(\d{2})-(\d{2})(?!\d)/)
  if (iso) return validYmd(iso[1], iso[2], iso[3])
  const slash = text.match(/\b(\d{4})\/(\d{2})\/(\d{2})\b/)
  if (slash) return validYmd(slash[1], slash[2], slash[3])
  const mdy = text.match(/\b([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\b/)
  if (mdy) {
    const month = MONTHS[mdy[1].toLowerCase()]
    if (month) return validYmd(mdy[3], month, mdy[2].padStart(2, '0'))
  }
  const dmy = text.match(/\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/)
  if (dmy) {
    const month = MONTHS[dmy[2].toLowerCase()]
    if (month) return validYmd(dmy[3], month, dmy[1].padStart(2, '0'))
  }
  return null
}

function validYmd(year: string, month: string, day: string): string | null {
  const y = Number(year)
  const m = Number(month)
  const d = Number(day)
  if (y < 1990 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null
  return `${year}-${month}-${day}`
}

/** Longest 6–12 token window that contains a numeral or a capitalized token. */
export function quotedFragment(claim: string): string {
  const tokens = claim.match(/[A-Za-z0-9][A-Za-z0-9'’$%.-]*/g) ?? []
  if (tokens.length === 0) return ''
  const max = Math.min(12, tokens.length)
  const min = Math.min(6, tokens.length)
  let best: { start: number; len: number; score: number } | null = null
  for (let len = max; len >= min; len--) {
    for (let i = 0; i + len <= tokens.length; i++) {
      const window = tokens.slice(i, i + len)
      const hasDigit = window.some((t) => /\d/.test(t))
      const hasCap = window.some((t) => /[A-Z]/.test(t))
      if (!hasDigit && !hasCap) continue
      const score = len * 100 + (hasDigit ? 10 : 0) + (hasCap ? 1 : 0)
      if (!best || score > best.score) best = { start: i, len, score }
    }
    if (best && best.len === len) break
  }
  const chosen = best ? tokens.slice(best.start, best.start + best.len) : tokens.slice(0, max)
  return chosen.join(' ')
}

export function collapseChip(retrievedCount: number, clusterCount: number, hidden = 0): string {
  const pages = retrievedCount === 1 ? '1 page' : `${retrievedCount} pages`
  const clusters = clusterCount === 1 ? '1 cluster' : `${clusterCount} clusters`
  const more = hidden > 0 ? ` +${hidden} more` : ''
  return `${pages} → ${clusters}${more}`
}

function titleStem(title: string): string {
  const parts = title.split(/\s+[|\-—–]\s+/)
  if (parts.length >= 2) {
    const last = parts[parts.length - 1].trim()
    if (last.split(/\s+/).length <= 4) return parts.slice(0, -1).join(' ').trim()
  }
  return title.trim()
}

function tokenSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 1)
  )
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  let inter = 0
  for (const token of Array.from(a)) if (b.has(token)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

function sixWordPhrases(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
  const out = new Set<string>()
  for (let i = 0; i + 6 <= words.length; i++) out.add(words.slice(i, i + 6).join(' '))
  return out
}

function phrasesOverlap(a: Set<string>, b: Set<string>): boolean {
  if (a.size === 0 || b.size === 0) return false
  const [small, large] = a.size < b.size ? [a, b] : [b, a]
  for (const phrase of Array.from(small)) if (large.has(phrase)) return true
  return false
}

function mentionFromParts(parts: {
  url: string
  title: string
  snippet: string
  pageAge?: string | null
  preferSearchDate: boolean
}): CollapseMention | null {
  const canonical = canonicalUrl(parts.url)
  if (!canonical) return null
  let domain = 'unknown'
  try {
    domain = registrableDomain(new URL(canonical).hostname)
  } catch {
    domain = 'unknown'
  }
  const searchDate = parts.preferSearchDate ? parseObservedDate(parts.pageAge) : null
  const textDate = parseObservedDate(`${parts.title}\n${parts.snippet}`)
  const observedDate = searchDate ?? textDate
  const dateSource: DateSource = searchDate ? 'search-result' : textDate ? 'title-or-snippet' : 'none'
  return {
    id: '',
    url: parts.url.slice(0, 500),
    canonicalUrl: canonical,
    domain,
    domainKind: domainKindFor(domain),
    title: parts.title.slice(0, 200),
    snippet: parts.snippet.slice(0, 400),
    observedDate,
    dateSource,
  }
}

function mergeMention(current: CollapseMention, incoming: CollapseMention): CollapseMention {
  const next = { ...current }
  if (DATE_SOURCE_RANK[incoming.dateSource] > DATE_SOURCE_RANK[current.dateSource] && incoming.observedDate) {
    next.observedDate = incoming.observedDate
    next.dateSource = incoming.dateSource
  }
  if (incoming.snippet.length > current.snippet.length) next.snippet = incoming.snippet
  if (incoming.title.length > current.title.length) next.title = incoming.title
  return next
}

function compareRoot(a: CollapseMention, b: CollapseMention): number {
  if (a.observedDate && b.observedDate && a.observedDate !== b.observedDate) {
    return a.observedDate < b.observedDate ? -1 : 1
  }
  if (a.observedDate && !b.observedDate) return -1
  if (!a.observedDate && b.observedDate) return 1
  const kind = KIND_RANK[a.domainKind] - KIND_RANK[b.domainKind]
  if (kind !== 0) return kind
  if (a.canonicalUrl.length !== b.canonicalUrl.length) return a.canonicalUrl.length - b.canonicalUrl.length
  return a.canonicalUrl < b.canonicalUrl ? -1 : 1
}

export function provisionalDateTarget(cluster: CollapseCluster, mentions: CollapseMention[]): CollapseMention | null {
  if (cluster.rootMentionId) return null
  const members = cluster.mentionIds
    .map((id) => mentions.find((m) => m.id === id))
    .filter((m): m is CollapseMention => Boolean(m))
  if (members.length === 0 || members.some((m) => m.observedDate)) return null
  return [...members].sort(compareRoot)[0] ?? null
}

function histogramFor(mentions: CollapseMention[]): ClaimCollapse['dateHistogram'] {
  const dated = mentions.filter((m) => m.observedDate)
  if (dated.length < 3) return null
  const counts = new Map<string, number>()
  for (const mention of dated) {
    const bucket = mention.observedDate!.slice(0, 7)
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([bucket, count]) => ({ bucket, count }))
}

function clusterMentions(mentions: CollapseMention[]): CollapseCluster[] {
  const n = mentions.length
  const parent = Array.from({ length: n }, (_, i) => i)
  const reason: Array<LinkReason | null> = Array(n).fill(null)
  const find = (i: number): number => {
    let cursor = i
    while (parent[cursor] !== cursor) {
      parent[cursor] = parent[parent[cursor]]
      cursor = parent[cursor]
    }
    return cursor
  }
  const unite = (a: number, b: number, why: LinkReason) => {
    const ra = find(a)
    const rb = find(b)
    const best = (left: LinkReason | null, right: LinkReason | null): LinkReason => {
      if (!left) return right ?? why
      if (!right) return left
      return LINK_RANK[left] >= LINK_RANK[right] ? left : right
    }
    if (ra === rb) {
      reason[ra] = best(reason[ra], why)
      return
    }
    parent[rb] = ra
    reason[ra] = best(best(reason[ra], reason[rb]), why)
  }

  const stems = mentions.map((m) => tokenSet(titleStem(m.title)))
  const phrases = mentions.map((m) => sixWordPhrases(m.snippet))
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (mentions[i].canonicalUrl === mentions[j].canonicalUrl) {
        unite(i, j, 'canonical-url')
        continue
      }
      if (jaccard(stems[i], stems[j]) >= 0.75) {
        unite(i, j, 'similar-title')
        continue
      }
      if (phrasesOverlap(phrases[i], phrases[j])) unite(i, j, 'shared-phrase')
    }
  }

  const groups = new Map<number, number[]>()
  for (let i = 0; i < n; i++) {
    const root = find(i)
    const list = groups.get(root) ?? []
    list.push(i)
    groups.set(root, list)
  }

  return Array.from(groups.entries())
    .sort((a, b) => a[1][0] - b[1][0])
    .map(([, indexes], clusterIndex) => {
      const members = indexes.map((i) => mentions[i])
      const dated = members.filter((m) => m.observedDate)
      const root = dated.length > 0 ? [...members].sort(compareRoot)[0] : null
      const link = reason[find(indexes[0])] ?? 'canonical-url'
      return {
        id: `k${clusterIndex}`,
        mentionIds: members.map((m) => m.id),
        rootMentionId: root?.id ?? null,
        rootRule: root ? 'earliest-observed-date' : 'undated',
        linkReason: link,
      } satisfies CollapseCluster
    })
}

function finalize(claim: Omit<ClaimCollapse, 'retrievedCount' | 'clusterCount' | 'dateHistogram' | 'clusters'> & {
  clusters: CollapseCluster[]
}): ClaimCollapse {
  const clusters = clusterMentions(claim.mentions).map((cluster, index) => ({ ...cluster, id: `k${index}` }))
  return {
    ...claim,
    clusters,
    retrievedCount: claim.mentions.length,
    clusterCount: clusters.length,
    dateHistogram: histogramFor(claim.mentions),
  }
}

export function recomputeClaim(claim: ClaimCollapse): ClaimCollapse {
  return finalize(claim)
}

export function withObservedDate(
  viz: CollapseViz,
  mentionId: string,
  observedDate: string,
  dateSource: DateSource
): CollapseViz {
  return {
    ...viz,
    claims: viz.claims.map((claim) => {
      if (!claim.mentions.some((m) => m.id === mentionId)) return claim
      return recomputeClaim({
        ...claim,
        mentions: claim.mentions.map((m) =>
          m.id === mentionId ? { ...m, observedDate, dateSource } : m
        ),
      })
    }),
  }
}

/**
 * Search hits plus the evidence URLs already on the claim, deduped by canonical URL.
 * At most eight search hits are kept. Evidence URLs are added after that cap.
 */
export function buildCollapseViz(args: {
  claims: Claim[]
  hitsByClaimId?: Record<string, CollapseSearchHit[]>
  caption?: string
}): CollapseViz {
  const hitsByClaimId = args.hitsByClaimId ?? {}
  const claims: ClaimCollapse[] = []
  for (const claim of args.claims) {
    if (claim.verifiability !== 'VERIFIABLE') continue
    const intended = quotedFragment(claim.text)
    const hits = (hitsByClaimId[claim.id] ?? []).slice(0, 8)
    const executed = hits.find((h) => h.executedQuery?.trim())?.executedQuery?.trim()
    const query = stripWrappingQuotes(executed || intended)
    const bag = new Map<string, CollapseMention>()
    const push = (mention: CollapseMention | null) => {
      if (!mention) return
      const prev = bag.get(mention.canonicalUrl)
      bag.set(mention.canonicalUrl, prev ? mergeMention(prev, mention) : mention)
    }
    for (const hit of hits) {
      push(
        mentionFromParts({
          url: hit.url,
          title: hit.title || '',
          snippet: hit.snippet || '',
          pageAge: hit.pageAge,
          preferSearchDate: true,
        })
      )
    }
    for (const evidence of claim.evaluation?.evidence ?? []) {
      push(
        mentionFromParts({
          url: evidence.url,
          title: evidence.title || evidence.sourceName || '',
          snippet: evidence.snippet || '',
          preferSearchDate: false,
        })
      )
    }
    const mentions = Array.from(bag.values()).map((mention, index) => ({ ...mention, id: `${claim.id}-m${index}` }))
    claims.push(
      finalize({
        claimId: claim.id,
        query,
        mentions,
        clusters: [],
      })
    )
  }
  return {
    version: 'collapse-v0',
    caption: args.caption ?? COLLAPSE_CAPTION,
    claims,
  }
}

function stripWrappingQuotes(query: string): string {
  const trimmed = query.trim()
  if (trimmed.length >= 2 && ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('“') && trimmed.endsWith('”')))) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}
