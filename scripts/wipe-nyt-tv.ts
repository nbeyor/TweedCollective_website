/**
 * Wipe ALL NYT 100 user state so the next sign-in is a first run.
 *
 * Deletes every private blob under `nyt-tv-100/` (votes, including legacy
 * nate/ and jen/ keys, pairs, pending invites, directory, digest marker)
 * and the local fallbacks `.data/nyt-tv-100`, `/tmp/nyt-tv-100`, and
 * `NYT_TV_DATA_DIR` when that folder is named nyt-tv-100.
 *
 * Does not change Clerk access, show copy, or env vars.
 *
 *   npx tsx scripts/wipe-nyt-tv.ts            # dry-run
 *   BLOB_READ_WRITE_TOKEN=... npx tsx scripts/wipe-nyt-tv.ts --yes
 *
 * Exit 1 when --yes is set and the blob token is missing or the blob delete fails.
 */

import { del, list } from '@vercel/blob'

import { NYT_TV_BLOB_LAYOUT, NYT_TV_BLOB_PREFIX, wipeNytTvState, type BlobWiper } from '../lib/nyt-tv/wipe'

async function main() {
  const yes = process.argv.includes('--yes')
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() || null
  const blob: BlobWiper | null = token
    ? {
        list: (options) => list({ prefix: options.prefix, cursor: options.cursor, token: options.token, limit: options.limit }),
        del: (urls, options) => del(urls, { token: options.token }),
      }
    : null

  const report = await wipeNytTvState({
    dryRun: !yes,
    token,
    env: process.env,
    blob,
  })

  console.log(`NYT 100 user-state wipe (${report.dryRun ? 'dry-run' : 'delete'})`)
  console.log(`Blob prefix: ${NYT_TV_BLOB_PREFIX}`)
  console.log('Layout:')
  for (const key of NYT_TV_BLOB_LAYOUT) console.log(`  ${key}`)
  if (!token) {
    console.log('BLOB_READ_WRITE_TOKEN is unset. Blob was not listed or deleted.')
  } else if (report.blobError) {
    console.log(`Blob error: ${report.blobError}`)
  } else if (report.blobPathnames.length === 0) {
    console.log('Blob prefix is already empty.')
  } else {
    console.log(`${report.dryRun ? 'Would delete' : 'Deleted'} ${report.blobPathnames.length} blob(s):`)
    for (const pathname of report.blobPathnames) console.log(`  ${pathname}`)
  }

  console.log('File fallbacks:')
  for (const dir of report.fileDirs) {
    if (dir.skipped) {
      console.log(`  skip ${dir.path} — ${dir.skipped}`)
    } else if (!dir.existed) {
      console.log(`  absent ${dir.path}`)
    } else if (dir.removed) {
      console.log(`  removed ${dir.path}`)
    } else {
      console.log(`  would remove ${dir.path}`)
    }
  }

  if (!yes) {
    console.log('Nothing was deleted. Re-run with --yes to wipe.')
  }

  if (yes && !token) {
    console.error('Refusing a clean exit: blob state was not wiped because BLOB_READ_WRITE_TOKEN is unset.')
    process.exit(1)
  }
  if (report.blobError) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
