import { access, rm } from 'fs/promises'
import path from 'path'

/** Every NYT 100 user-state blob lives under this prefix, including legacy nate/jen votes. */
export const NYT_TV_BLOB_PREFIX = 'nyt-tv-100/'

/**
 * Pathnames the app writes. A wipe deletes the whole prefix, so a key that is
 * only in this list still goes away. Shown here so a coordinator can see the layout.
 *
 * - nyt-tv-100/votes/${userId}/${showRank}.json  (legacy user ids: nate, jen)
 * - nyt-tv-100/pairs/${pairId}.json
 * - nyt-tv-100/user-pairs/${userId}.json
 * - nyt-tv-100/invite-index/${token}.json
 * - nyt-tv-100/incoming/${userId}.json
 * - nyt-tv-100/invite-emails/${emailKey}.json
 * - nyt-tv-100/directory/users/${userId}.json
 * - nyt-tv-100/directory/emails/${emailKey}.json
 * - nyt-tv-100/digest-sent.json
 */
export const NYT_TV_BLOB_LAYOUT = [
  'nyt-tv-100/votes/',
  'nyt-tv-100/pairs/',
  'nyt-tv-100/user-pairs/',
  'nyt-tv-100/invite-index/',
  'nyt-tv-100/incoming/',
  'nyt-tv-100/invite-emails/',
  'nyt-tv-100/directory/',
  'nyt-tv-100/digest-sent.json',
] as const

export interface BlobListItem {
  pathname: string
  url: string
}

export interface BlobListPage {
  blobs: BlobListItem[]
  hasMore: boolean
  cursor?: string
}

export interface BlobWiper {
  list(options: { prefix?: string; cursor?: string; token: string; limit?: number }): Promise<BlobListPage>
  del(urlOrPathname: string[], options: { token: string }): Promise<void>
}

export interface WipeFileDir {
  path: string
  existed: boolean
  removed: boolean
  skipped: string | null
}

export interface WipeReport {
  dryRun: boolean
  prefix: typeof NYT_TV_BLOB_PREFIX
  blobPathnames: string[]
  blobDeleted: number
  blobError: string | null
  fileDirs: WipeFileDir[]
}

type Env = Record<string, string | undefined>

/** Local fallbacks. A custom NYT_TV_DATA_DIR is included only when its folder is named nyt-tv-100. */
export function defaultFileStateDirs(cwd: string, env: Env = {}): string[] {
  const dirs = [path.join(cwd, '.data', 'nyt-tv-100'), path.join('/tmp', 'nyt-tv-100')]
  const configured = env.NYT_TV_DATA_DIR?.trim()
  if (configured) dirs.unshift(path.resolve(configured))
  return Array.from(new Set(dirs.map((dir) => path.resolve(dir))))
}

export function isWipeableDir(dir: string): boolean {
  const resolved = path.resolve(dir)
  if (resolved === path.parse(resolved).root) return false
  return path.basename(resolved) === 'nyt-tv-100'
}

async function exists(dir: string): Promise<boolean> {
  try {
    await access(dir)
    return true
  } catch {
    return false
  }
}

async function listBlobPathnames(token: string, blob: BlobWiper): Promise<BlobListItem[]> {
  const found: BlobListItem[] = []
  let cursor: string | undefined
  do {
    const page = await blob.list({ prefix: NYT_TV_BLOB_PREFIX, cursor, token, limit: 1000 })
    for (const item of page.blobs) {
      if (item.pathname.startsWith(NYT_TV_BLOB_PREFIX)) found.push(item)
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return found
}

/**
 * Deletes every blob under `nyt-tv-100/` and the local JSON fallback directories.
 * Dry-run lists them and deletes nothing. Show data in content/ is not touched.
 */
export async function wipeNytTvState(options: {
  dryRun?: boolean
  token?: string | null
  cwd?: string
  env?: Env
  fileDirs?: string[]
  blob?: BlobWiper | null
}): Promise<WipeReport> {
  const dryRun = options.dryRun !== false
  const token = options.token?.trim() || null
  const fileDirs = options.fileDirs ?? defaultFileStateDirs(options.cwd ?? process.cwd(), options.env ?? {})
  const report: WipeReport = {
    dryRun,
    prefix: NYT_TV_BLOB_PREFIX,
    blobPathnames: [],
    blobDeleted: 0,
    blobError: null,
    fileDirs: [],
  }

  if (token && options.blob) {
    try {
      const items = await listBlobPathnames(token, options.blob)
      report.blobPathnames = items.map((item) => item.pathname)
      if (!dryRun && items.length > 0) {
        for (let i = 0; i < items.length; i += 100) {
          const chunk = items.slice(i, i + 100).map((item) => item.url)
          await options.blob.del(chunk, { token })
        }
        report.blobDeleted = items.length
      }
    } catch (error) {
      report.blobError = error instanceof Error ? error.message : 'Blob wipe failed.'
    }
  }

  for (const dir of fileDirs) {
    const row: WipeFileDir = { path: path.resolve(dir), existed: false, removed: false, skipped: null }
    if (!isWipeableDir(row.path)) {
      row.skipped = 'Refusing to delete a directory that is not named nyt-tv-100.'
      report.fileDirs.push(row)
      continue
    }
    row.existed = await exists(row.path)
    if (row.existed && !dryRun) {
      await rm(row.path, { recursive: true, force: true })
      row.removed = true
    }
    report.fileDirs.push(row)
  }

  return report
}
