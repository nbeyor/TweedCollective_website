import { mkdir, readdir, readFile, rename, rm, writeFile } from 'fs/promises'
import path from 'path'

import type { CollapseViz } from '../collapse'
import { SCORING_METHODOLOGY_VERSION, type Claim, type Score } from '../types'
import type { TransportRow } from './limits'

export interface PublicReport {
  id: string
  surface: 'mms'
  mode: 'live'
  submittedText: ''
  contentLabel: string
  summary: string
  claims: Claim[]
  score: Score
  checkedAt: string
  evidenceMode: 'web' | 'degraded'
  methodologyVersion: typeof SCORING_METHODOLOGY_VERSION
  truncated: boolean
  createdAt: string
  expiresAt: string
  collapse: CollapseViz
}

export interface MmsStore {
  createTransport(row: TransportRow): Promise<boolean>
  getTransport(messageSid: string): Promise<TransportRow | null>
  updateTransport(messageSid: string, patch: Partial<TransportRow>): Promise<void>
  listTransportsForPhone(phoneHash: string): Promise<TransportRow[]>
  /** Compare-and-set a timestamp field. False when it was already set, or a terminal SMS already went out. */
  claimFlag(messageSid: string, field: 'midStatusSentAt' | 'terminalSmsAt' | 'ackSentAt', at: string): Promise<boolean>
  putTranscript(messageSid: string, transcript: string, expiresAt: string): Promise<void>
  getOptOut(phoneHash: string): Promise<boolean>
  setOptOut(phoneHash: string, optedOut: boolean): Promise<void>
  getSpend(day: string): Promise<number>
  addSpend(day: string, usd: number): Promise<number>
  putReport(report: PublicReport): Promise<void>
  getReport(id: string, now?: Date): Promise<PublicReport | null>
  sweep(now: Date): Promise<void>
}

const tails = new Map<string, Promise<unknown>>()

export function serial<T>(key: string, fn: () => Promise<T>): Promise<T> {
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

function safeKey(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9_-]/g, '')
  if (!cleaned || cleaned !== value) throw new Error('Unsafe store key')
  return cleaned
}

export function createFileStore(dir: string): MmsStore {
  const root = dir
  const file = (...parts: string[]) => path.join(root, ...parts)

  async function ensure(sub: string) {
    await mkdir(file(sub), { recursive: true })
  }

  async function readJson<T>(rel: string): Promise<T | null> {
    try {
      const raw = await readFile(file(rel), 'utf8')
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  async function writeJson(rel: string, value: unknown, exclusive: boolean): Promise<boolean> {
    const abs = file(rel)
    await mkdir(path.dirname(abs), { recursive: true })
    const tmp = `${abs}.${process.pid}.tmp`
    await writeFile(tmp, JSON.stringify(value), 'utf8')
    if (exclusive) {
      try {
        await rename(tmp, abs)
        return true
      } catch (err) {
        await rm(tmp, { force: true }).catch(() => undefined)
        if ((err as NodeJS.ErrnoException).code === 'EEXIST') return false
        // rename over an existing file replaces on POSIX. Exclusive create uses write flag below.
        throw err
      }
    }
    await rename(tmp, abs)
    return true
  }

  async function writeNew(rel: string, value: unknown): Promise<boolean> {
    const abs = file(rel)
    await mkdir(path.dirname(abs), { recursive: true })
    try {
      const handle = await (await import('fs/promises')).open(abs, 'wx')
      await handle.writeFile(JSON.stringify(value), 'utf8')
      await handle.close()
      return true
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'EEXIST') return false
      throw err
    }
  }

  return {
    async createTransport(row) {
      const sid = safeKey(row.messageSid)
      const hash = safeKey(row.phoneHash)
      const created = await writeNew(`transport/${sid}.json`, row)
      if (!created) return false
      await writeJson(`by-phone/${hash}/${sid}.json`, { messageSid: sid }, false)
      return true
    },
    getTransport(messageSid) {
      return readJson<TransportRow>(`transport/${safeKey(messageSid)}.json`)
    },
    updateTransport(messageSid, patch) {
      const sid = safeKey(messageSid)
      return serial(`transport:${sid}`, async () => {
        const current = await readJson<TransportRow>(`transport/${sid}.json`)
        if (!current) return
        await writeJson(`transport/${sid}.json`, { ...current, ...patch, messageSid: current.messageSid }, false)
      })
    },
    async listTransportsForPhone(phoneHash) {
      const hash = safeKey(phoneHash)
      let names: string[] = []
      try {
        names = await readdir(file('by-phone', hash))
      } catch {
        return []
      }
      const rows: TransportRow[] = []
      for (const name of names) {
        const sid = name.replace(/\.json$/, '')
        const row = await readJson<TransportRow>(`transport/${sid}.json`)
        if (row) rows.push(row)
      }
      return rows
    },
    claimFlag(messageSid, field, at) {
      const sid = safeKey(messageSid)
      return serial(`transport:${sid}`, async () => {
        const current = await readJson<TransportRow>(`transport/${sid}.json`)
        if (!current) return false
        if (current[field]) return false
        if (field === 'midStatusSentAt' && current.terminalSmsAt) return false
        current[field] = at
        await writeJson(`transport/${sid}.json`, current, false)
        return true
      })
    },
    async putTranscript(messageSid, transcript, expiresAt) {
      await ensure('transcripts')
      await writeJson(`transcripts/${safeKey(messageSid)}.json`, { transcript, expiresAt }, false)
    },
    async getOptOut(phoneHash) {
      const row = await readJson<{ optedOut: boolean }>(`optout/${safeKey(phoneHash)}.json`)
      return row?.optedOut === true
    },
    async setOptOut(phoneHash, optedOut) {
      await writeJson(`optout/${safeKey(phoneHash)}.json`, { optedOut, updatedAt: new Date().toISOString() }, false)
    },
    async getSpend(day) {
      const row = await readJson<{ usd: number }>(`spend/${safeKey(day)}.json`)
      return row?.usd ?? 0
    },
    addSpend(day, usd) {
      const key = safeKey(day)
      return serial(`spend:${key}`, async () => {
        const current = (await readJson<{ usd: number }>(`spend/${key}.json`))?.usd ?? 0
        const next = Math.max(0, Math.round((current + usd) * 1000) / 1000)
        await writeJson(`spend/${key}.json`, { usd: next }, false)
        return next
      })
    },
    async putReport(report) {
      await writeJson(`reports/${safeKey(report.id)}.json`, report, false)
    },
    async getReport(id, now = new Date()) {
      const report = await readJson<PublicReport>(`reports/${safeKey(id)}.json`)
      if (!report) return null
      if (Date.parse(report.expiresAt) <= now.getTime()) return null
      report.submittedText = ''
      return report
    },
    async sweep(now) {
      await sweepDir(file('transcripts'), now, async (abs) => {
        const row = JSON.parse(await readFile(abs, 'utf8')) as { expiresAt?: string }
        if (row.expiresAt && Date.parse(row.expiresAt) <= now.getTime()) await rm(abs, { force: true })
      })
      await sweepDir(file('reports'), now, async (abs) => {
        const row = JSON.parse(await readFile(abs, 'utf8')) as { expiresAt?: string }
        if (row.expiresAt && Date.parse(row.expiresAt) <= now.getTime()) await rm(abs, { force: true })
      })
    },
  }
}

async function sweepDir(dir: string, _now: Date, visit: (abs: string) => Promise<void>) {
  let names: string[] = []
  try {
    names = await readdir(dir)
  } catch {
    return
  }
  for (const name of names) {
    if (!name.endsWith('.json')) continue
    try {
      await visit(path.join(dir, name))
    } catch {
      /* one bad file does not stop the sweep */
    }
  }
}

let singleton: MmsStore | null = null

export function getStore(): MmsStore {
  if (singleton) return singleton
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (token) {
    singleton = createBlobStore(token)
    return singleton
  }
  const dir = process.env.GREX_MMS_DATA_DIR?.trim() || path.join(process.cwd(), '.data', 'grex-mms')
  singleton = createFileStore(dir)
  return singleton
}

/** Test hook. Production code uses getStore(). */
export function resetStoreForTests() {
  singleton = null
}

function createBlobStore(token: string): MmsStore {
  const prefix = 'grex-mms'
  const keyPath = (rel: string) => `${prefix}/${rel}`

  async function blob() {
    return import('@vercel/blob')
  }

  async function readJson<T>(rel: string): Promise<T | null> {
    const { get } = await blob()
    const got = await get(keyPath(rel), { access: 'private', token, useCache: false })
    if (!got || got.statusCode !== 200 || !got.stream) return null
    try {
      return JSON.parse(await new Response(got.stream).text()) as T
    } catch {
      return null
    }
  }

  async function writeJson(rel: string, value: unknown, overwrite: boolean) {
    const { put } = await blob()
    await put(keyPath(rel), JSON.stringify(value), {
      access: 'private',
      token,
      addRandomSuffix: false,
      allowOverwrite: overwrite,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    })
  }

  return {
    async createTransport(row) {
      const sid = safeKey(row.messageSid)
      const hash = safeKey(row.phoneHash)
      try {
        await writeJson(`transport/${sid}.json`, row, false)
      } catch {
        const existing = await readJson(`transport/${sid}.json`)
        if (existing) return false
        throw new Error('Transport row was not stored')
      }
      await writeJson(`by-phone/${hash}/${sid}.json`, { messageSid: sid }, true)
      return true
    },
    getTransport(messageSid) {
      return readJson<TransportRow>(`transport/${safeKey(messageSid)}.json`)
    },
    updateTransport(messageSid, patch) {
      const sid = safeKey(messageSid)
      return serial(`blob-transport:${sid}`, async () => {
        const current = await readJson<TransportRow>(`transport/${sid}.json`)
        if (!current) return
        await writeJson(`transport/${sid}.json`, { ...current, ...patch, messageSid: current.messageSid }, true)
      })
    },
    async listTransportsForPhone(phoneHash) {
      const hash = safeKey(phoneHash)
      const { list } = await blob()
      const found = await list({ prefix: keyPath(`by-phone/${hash}/`), token, limit: 100 })
      const rows: TransportRow[] = []
      for (const item of found.blobs) {
        const sid = item.pathname.split('/').pop()?.replace(/\.json$/, '')
        if (!sid) continue
        const row = await readJson<TransportRow>(`transport/${sid}.json`)
        if (row) rows.push(row)
      }
      return rows
    },
    claimFlag(messageSid, field, at) {
      const sid = safeKey(messageSid)
      return serial(`blob-transport:${sid}`, async () => {
        const current = await readJson<TransportRow>(`transport/${sid}.json`)
        if (!current || current[field]) return false
        if (field === 'midStatusSentAt' && current.terminalSmsAt) return false
        current[field] = at
        await writeJson(`transport/${sid}.json`, current, true)
        return true
      })
    },
    putTranscript(messageSid, transcript, expiresAt) {
      return writeJson(`transcripts/${safeKey(messageSid)}.json`, { transcript, expiresAt }, true).then(() => undefined)
    },
    async getOptOut(phoneHash) {
      const row = await readJson<{ optedOut: boolean }>(`optout/${safeKey(phoneHash)}.json`)
      return row?.optedOut === true
    },
    setOptOut(phoneHash, optedOut) {
      return writeJson(`optout/${safeKey(phoneHash)}.json`, { optedOut, updatedAt: new Date().toISOString() }, true).then(
        () => undefined
      )
    },
    async getSpend(day) {
      const row = await readJson<{ usd: number }>(`spend/${safeKey(day)}.json`)
      return row?.usd ?? 0
    },
    addSpend(day, usd) {
      const key = safeKey(day)
      return serial(`blob-spend:${key}`, async () => {
        const current = (await readJson<{ usd: number }>(`spend/${key}.json`))?.usd ?? 0
        const next = Math.max(0, Math.round((current + usd) * 1000) / 1000)
        await writeJson(`spend/${key}.json`, { usd: next }, true)
        return next
      })
    },
    putReport(report) {
      return writeJson(`reports/${safeKey(report.id)}.json`, report, true).then(() => undefined)
    },
    async getReport(id, now = new Date()) {
      const report = await readJson<PublicReport>(`reports/${safeKey(id)}.json`)
      if (!report || Date.parse(report.expiresAt) <= now.getTime()) return null
      report.submittedText = ''
      return report
    },
    async sweep(now) {
      const { list, del } = await blob()
      for (const folder of ['transcripts', 'reports']) {
        const found = await list({ prefix: keyPath(`${folder}/`), token, limit: 500 })
        for (const item of found.blobs) {
          const rel = item.pathname.startsWith(`${prefix}/`) ? item.pathname.slice(prefix.length + 1) : item.pathname
          const row = await readJson<{ expiresAt?: string }>(rel)
          if (row?.expiresAt && Date.parse(row.expiresAt) <= now.getTime()) {
            await del(item.url, { token }).catch(() => undefined)
          }
        }
      }
    },
  }
}
