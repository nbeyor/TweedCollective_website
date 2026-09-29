import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import path from 'path'

import type { PairRecord } from './pairs'
import type { VoteRecord } from './types'
import { isVoteChoice } from './types'

export interface DigestSentMarker {
  sentAt: string
  dayKey: string
  recipients: string[]
}

export interface VoteStore {
  kind: 'blob' | 'file'
  listVotes(userId?: string): Promise<VoteRecord[]>
  putVote(vote: VoteRecord): Promise<void>
  deleteVote(userId: string, showRank: number): Promise<void>
  getDigestSent(): Promise<DigestSentMarker | null>
  markDigestSent(marker: DigestSentMarker): Promise<void>
  getPair(pairId: string): Promise<PairRecord | null>
  getPairForUser(userId: string): Promise<PairRecord | null>
  getPairByInvite(token: string): Promise<PairRecord | null>
  listPairs(): Promise<PairRecord[]>
  /**
   * Writes the pair, each member's user index, and the invite-token index.
   * `previousToken` drops the old index when an invite is rotated.
   */
  savePair(pair: PairRecord, previousToken?: string | null): Promise<void>
}

const tails = new Map<string, Promise<unknown>>()

function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = tails.get(key) ?? Promise.resolve()
  const run = prev.then(fn, fn)
  tails.set(
    key,
    run.then(
      () => undefined,
      () => undefined
    )
  )
  return run
}

export function parseVote(value: unknown): VoteRecord | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Partial<VoteRecord>
  if (typeof row.userId !== 'string' || !row.userId) return null
  if (typeof row.pairId !== 'string' || !row.pairId) return null
  if (typeof row.showRank !== 'number' || !Number.isInteger(row.showRank)) return null
  if (!isVoteChoice(row.vote)) return null
  if (typeof row.updatedAt !== 'string' || typeof row.dayKey !== 'string') return null
  return {
    userId: row.userId,
    pairId: row.pairId,
    showRank: row.showRank,
    vote: row.vote,
    updatedAt: row.updatedAt,
    dayKey: row.dayKey,
  }
}

export function parsePair(value: unknown): PairRecord | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Partial<PairRecord>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.createdAt !== 'string') return null
  if (row.status !== 'pending' && row.status !== 'active') return null
  if (typeof row.inviteEmail !== 'string' || typeof row.inviteToken !== 'string') return null
  if (!Array.isArray(row.members) || row.members.length === 0) return null
  const members = []
  for (const member of row.members) {
    if (!member || typeof member !== 'object') return null
    const item = member as Partial<PairRecord['members'][number]>
    if (typeof item.userId !== 'string' || typeof item.email !== 'string' || typeof item.joinedAt !== 'string') return null
    members.push({ userId: item.userId, email: item.email, joinedAt: item.joinedAt })
  }
  return {
    id: row.id,
    createdAt: row.createdAt,
    status: row.status,
    inviteEmail: row.inviteEmail,
    inviteToken: row.inviteToken,
    members,
  }
}

export function createFileVoteStore(dir: string): VoteStore {
  const votePath = (userId: string, showRank: number) => path.join(dir, 'votes', userId, `${showRank}.json`)
  const markerPath = path.join(dir, 'digest-sent.json')
  const pairPath = (pairId: string) => path.join(dir, 'pairs', `${pairId}.json`)
  const userIndexPath = (userId: string) => path.join(dir, 'user-pairs', `${userId}.json`)
  const inviteIndexPath = (token: string) => path.join(dir, 'invite-index', `${token}.json`)

  async function readJson<T>(abs: string): Promise<T | null> {
    try {
      return JSON.parse(await readFile(abs, 'utf8')) as T
    } catch {
      return null
    }
  }

  async function writeJson(abs: string, value: unknown) {
    await mkdir(path.dirname(abs), { recursive: true })
    await writeFile(abs, JSON.stringify(value), 'utf8')
  }

  async function readVote(userId: string, showRank: number): Promise<VoteRecord | null> {
    return parseVote(await readJson(votePath(userId, showRank)))
  }

  async function listUserVotes(userId: string): Promise<VoteRecord[]> {
    let names: string[] = []
    try {
      names = await readdir(path.join(dir, 'votes', userId))
    } catch {
      return []
    }
    const votes: VoteRecord[] = []
    for (const name of names) {
      if (!name.endsWith('.json')) continue
      const rank = Number(name.replace(/\.json$/, ''))
      if (!Number.isInteger(rank)) continue
      const vote = await readVote(userId, rank)
      if (vote) votes.push(vote)
    }
    return votes
  }

  return {
    kind: 'file',
    async listVotes(userId) {
      if (userId) return listUserVotes(userId)
      let ids: string[] = []
      try {
        ids = await readdir(path.join(dir, 'votes'))
      } catch {
        return []
      }
      const groups = await Promise.all(ids.map((id) => listUserVotes(id)))
      return groups.flat()
    },
    putVote(vote) {
      const key = `${vote.userId}:${vote.showRank}`
      return serial(key, async () => {
        await writeJson(votePath(vote.userId, vote.showRank), vote)
      })
    },
    async deleteVote(userId, showRank) {
      await rm(votePath(userId, showRank), { force: true })
    },
    async getDigestSent() {
      const parsed = await readJson<Partial<DigestSentMarker>>(markerPath)
      if (!parsed || typeof parsed.sentAt !== 'string' || typeof parsed.dayKey !== 'string') return null
      return {
        sentAt: parsed.sentAt,
        dayKey: parsed.dayKey,
        recipients: Array.isArray(parsed.recipients) ? parsed.recipients.filter((item) => typeof item === 'string') : [],
      }
    },
    async markDigestSent(marker) {
      await writeJson(markerPath, marker)
    },
    async getPair(pairId) {
      return parsePair(await readJson(pairPath(pairId)))
    },
    async getPairForUser(userId) {
      const index = await readJson<{ pairId?: string }>(userIndexPath(userId))
      if (!index?.pairId) return null
      return parsePair(await readJson(pairPath(index.pairId)))
    },
    async getPairByInvite(token) {
      const index = await readJson<{ pairId?: string }>(inviteIndexPath(token))
      if (!index?.pairId) return null
      const pair = parsePair(await readJson(pairPath(index.pairId)))
      if (!pair || pair.inviteToken !== token) return null
      return pair
    },
    async listPairs() {
      let names: string[] = []
      try {
        names = await readdir(path.join(dir, 'pairs'))
      } catch {
        return []
      }
      const pairs: PairRecord[] = []
      for (const name of names) {
        if (!name.endsWith('.json')) continue
        const pair = parsePair(await readJson(pairPath(name.replace(/\.json$/, ''))))
        if (pair) pairs.push(pair)
      }
      return pairs
    },
    savePair(pair, previousToken) {
      return serial(`pair:${pair.id}`, async () => {
        await writeJson(pairPath(pair.id), pair)
        for (const member of pair.members) {
          await writeJson(userIndexPath(member.userId), { pairId: pair.id })
        }
        await writeJson(inviteIndexPath(pair.inviteToken), { pairId: pair.id })
        if (previousToken && previousToken !== pair.inviteToken) {
          await rm(inviteIndexPath(previousToken), { force: true })
        }
      })
    },
  }
}

function fileDir(): string {
  const configured = process.env.NYT_TV_DATA_DIR?.trim()
  if (configured) return configured
  if (process.env.VERCEL) return path.join('/tmp', 'nyt-tv-100')
  return path.join(process.cwd(), '.data', 'nyt-tv-100')
}

let singleton: VoteStore | null = null

export function getVoteStore(): VoteStore {
  if (singleton) return singleton
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  singleton = token ? createBlobVoteStore(token) : createFileVoteStore(fileDir())
  return singleton
}

/** Test hook. Production code uses getVoteStore(). */
export function resetVoteStoreForTests() {
  singleton = null
}

function voteKey(userId: string, showRank: number): string {
  return `nyt-tv-100/votes/${userId}/${showRank}.json`
}

const DIGEST_SENT_KEY = 'nyt-tv-100/digest-sent.json'

function pairKey(pairId: string): string {
  return `nyt-tv-100/pairs/${pairId}.json`
}

function userIndexKey(userId: string): string {
  return `nyt-tv-100/user-pairs/${userId}.json`
}

function inviteIndexKey(token: string): string {
  return `nyt-tv-100/invite-index/${token}.json`
}

function createBlobVoteStore(token: string): VoteStore {
  async function blob() {
    return import('@vercel/blob')
  }

  async function readJson<T>(key: string): Promise<T | null> {
    const { get } = await blob()
    const got = await get(key, { access: 'private', token, useCache: false })
    if (!got || got.statusCode !== 200 || !got.stream) return null
    try {
      return JSON.parse(await new Response(got.stream).text()) as T
    } catch {
      return null
    }
  }

  async function writeJson(key: string, value: unknown) {
    const { put } = await blob()
    await put(key, JSON.stringify(value), {
      access: 'private',
      token,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
  }

  async function listPrefix(prefix: string): Promise<string[]> {
    const { list } = await blob()
    const keys: string[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix, token, limit: 200, cursor })
      for (const item of page.blobs) keys.push(item.pathname)
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return keys
  }

  async function listUserVotes(userId: string): Promise<VoteRecord[]> {
    const keys = await listPrefix(`nyt-tv-100/votes/${userId}/`)
    const votes: VoteRecord[] = []
    for (const key of keys) {
      const vote = parseVote(await readJson<unknown>(key))
      if (vote && vote.userId === userId) votes.push(vote)
    }
    return votes
  }

  return {
    kind: 'blob',
    async listVotes(userId) {
      if (userId) return listUserVotes(userId)
      const keys = await listPrefix('nyt-tv-100/votes/')
      const votes: VoteRecord[] = []
      for (const key of keys) {
        const vote = parseVote(await readJson<unknown>(key))
        if (vote) votes.push(vote)
      }
      return votes
    },
    putVote(vote) {
      const key = `${vote.userId}:${vote.showRank}`
      return serial(key, async () => {
        await writeJson(voteKey(vote.userId, vote.showRank), vote)
      })
    },
    async deleteVote(userId, showRank) {
      const { del } = await blob()
      await del(voteKey(userId, showRank), { token }).catch(() => undefined)
    },
    async getDigestSent() {
      const parsed = await readJson<Partial<DigestSentMarker>>(DIGEST_SENT_KEY)
      if (!parsed || typeof parsed.sentAt !== 'string' || typeof parsed.dayKey !== 'string') return null
      return {
        sentAt: parsed.sentAt,
        dayKey: parsed.dayKey,
        recipients: Array.isArray(parsed.recipients) ? parsed.recipients.filter((item) => typeof item === 'string') : [],
      }
    },
    markDigestSent(marker) {
      return writeJson(DIGEST_SENT_KEY, marker)
    },
    async getPair(pairId) {
      return parsePair(await readJson(pairKey(pairId)))
    },
    async getPairForUser(userId) {
      const index = await readJson<{ pairId?: string }>(userIndexKey(userId))
      if (!index?.pairId) return null
      return parsePair(await readJson(pairKey(index.pairId)))
    },
    async getPairByInvite(token) {
      const index = await readJson<{ pairId?: string }>(inviteIndexKey(token))
      if (!index?.pairId) return null
      const pair = parsePair(await readJson(pairKey(index.pairId)))
      if (!pair || pair.inviteToken !== token) return null
      return pair
    },
    async listPairs() {
      const keys = await listPrefix('nyt-tv-100/pairs/')
      const pairs: PairRecord[] = []
      for (const key of keys) {
        const pair = parsePair(await readJson(key))
        if (pair) pairs.push(pair)
      }
      return pairs
    },
    savePair(pair, previousToken) {
      return serial(`pair:${pair.id}`, async () => {
        await writeJson(pairKey(pair.id), pair)
        for (const member of pair.members) {
          await writeJson(userIndexKey(member.userId), { pairId: pair.id })
        }
        await writeJson(inviteIndexKey(pair.inviteToken), { pairId: pair.id })
        if (previousToken && previousToken !== pair.inviteToken) {
          const { del } = await blob()
          await del(inviteIndexKey(previousToken), { token }).catch(() => undefined)
        }
      })
    },
  }
}
