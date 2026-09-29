import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import path from 'path'

import type { ProfileId, VoteRecord } from './types'
import { isProfileId, isVoteChoice } from './types'

export interface DigestSentMarker {
  sentAt: string
  dayKey: string
  recipients: string[]
}

export interface VoteStore {
  kind: 'blob' | 'file'
  listVotes(profileId?: ProfileId): Promise<VoteRecord[]>
  putVote(vote: VoteRecord): Promise<void>
  deleteVote(profileId: ProfileId, showRank: number): Promise<void>
  getDigestSent(): Promise<DigestSentMarker | null>
  markDigestSent(marker: DigestSentMarker): Promise<void>
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
  if (!isProfileId(row.profileId)) return null
  if (typeof row.showRank !== 'number' || !Number.isInteger(row.showRank)) return null
  if (!isVoteChoice(row.vote)) return null
  if (typeof row.updatedAt !== 'string' || typeof row.dayKey !== 'string') return null
  return {
    profileId: row.profileId,
    showRank: row.showRank,
    vote: row.vote,
    updatedAt: row.updatedAt,
    dayKey: row.dayKey,
  }
}

export function createFileVoteStore(dir: string): VoteStore {
  const votePath = (profileId: ProfileId, showRank: number) =>
    path.join(dir, 'votes', profileId, `${showRank}.json`)
  const markerPath = path.join(dir, 'digest-sent.json')

  async function readVote(profileId: ProfileId, showRank: number): Promise<VoteRecord | null> {
    try {
      return parseVote(JSON.parse(await readFile(votePath(profileId, showRank), 'utf8')))
    } catch {
      return null
    }
  }

  return {
    kind: 'file',
    async listVotes(profileId) {
      const profiles: ProfileId[] = profileId ? [profileId] : ['nate', 'jen']
      const votes: VoteRecord[] = []
      for (const id of profiles) {
        let names: string[] = []
        try {
          names = await readdir(path.join(dir, 'votes', id))
        } catch {
          continue
        }
        for (const name of names) {
          if (!name.endsWith('.json')) continue
          const rank = Number(name.replace(/\.json$/, ''))
          if (!Number.isInteger(rank)) continue
          const vote = await readVote(id, rank)
          if (vote) votes.push(vote)
        }
      }
      return votes
    },
    putVote(vote) {
      const key = `${vote.profileId}:${vote.showRank}`
      return serial(key, async () => {
        const abs = votePath(vote.profileId, vote.showRank)
        await mkdir(path.dirname(abs), { recursive: true })
        await writeFile(abs, JSON.stringify(vote), 'utf8')
      })
    },
    async deleteVote(profileId, showRank) {
      await rm(votePath(profileId, showRank), { force: true })
    },
    async getDigestSent() {
      try {
        const parsed = JSON.parse(await readFile(markerPath, 'utf8')) as Partial<DigestSentMarker>
        if (typeof parsed.sentAt !== 'string' || typeof parsed.dayKey !== 'string') return null
        return {
          sentAt: parsed.sentAt,
          dayKey: parsed.dayKey,
          recipients: Array.isArray(parsed.recipients) ? parsed.recipients.filter((item) => typeof item === 'string') : [],
        }
      } catch {
        return null
      }
    },
    async markDigestSent(marker) {
      await mkdir(dir, { recursive: true })
      await writeFile(markerPath, JSON.stringify(marker), 'utf8')
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

function voteKey(profileId: ProfileId, showRank: number): string {
  return `nyt-tv-100/votes/${profileId}/${showRank}.json`
}

const DIGEST_SENT_KEY = 'nyt-tv-100/digest-sent.json'

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

  async function listProfile(profileId: ProfileId): Promise<VoteRecord[]> {
    const { list } = await blob()
    const prefix = `nyt-tv-100/votes/${profileId}/`
    const votes: VoteRecord[] = []
    let cursor: string | undefined
    do {
      const page = await list({ prefix, token, limit: 200, cursor })
      for (const item of page.blobs) {
        const vote = parseVote(await readJson<unknown>(item.pathname))
        if (vote && vote.profileId === profileId) votes.push(vote)
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    return votes
  }

  return {
    kind: 'blob',
    async listVotes(profileId) {
      const profiles: ProfileId[] = profileId ? [profileId] : ['nate', 'jen']
      const groups = await Promise.all(profiles.map((id) => listProfile(id)))
      return groups.flat()
    },
    putVote(vote) {
      const key = `${vote.profileId}:${vote.showRank}`
      return serial(key, async () => {
        await writeJson(voteKey(vote.profileId, vote.showRank), vote)
      })
    },
    async deleteVote(profileId, showRank) {
      const { del } = await blob()
      await del(voteKey(profileId, showRank), { token }).catch(() => undefined)
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
  }
}

