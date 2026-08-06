/**
 * Publish the three Protocol Strategist "starter" documents into the work Drive.
 *
 * This uses the SAME machinery the platform uses (lib/googleDocs.ts): a Google
 * service account with domain-wide delegation, impersonating a Workspace user,
 * creating Google Docs from HTML in a configured folder. It is a standalone
 * .mjs (not TypeScript) so it runs with plain `node` wherever the platform's
 * credentials are present — no build step, no tsx.
 *
 * The three documents are the top-left document-picker starting points:
 *   1. The drafted NSCLC Phase 2 (TCX-LUNG) design brief (the hero brief).
 *   2. Example protocol TCX-0056 (Familial Hypercholesterolemia, Phase 3).
 *   3. Example protocol TCX-0028 (Rheumatoid Arthritis, Phase 2).
 * Their HTML bodies live in scripts/starter-protocols/*.html (see manifest.json).
 *
 * Required environment (identical to the platform):
 *   GOOGLE_SERVICE_ACCOUNT_JSON_BASE64  base64 of the service account key file
 *   GOOGLE_DRIVE_FOLDER_ID              destination folder — the "IntelX demo" folder
 *   GOOGLE_IMPERSONATE_USER             e.g. nate.beyor@tweedcollective.ai
 *
 * Run:  node scripts/publish-starter-protocols.mjs
 * Add --dry-run to authenticate and check folder writability without creating.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { JWT } from 'google-auth-library'

const HERE = dirname(fileURLToPath(import.meta.url))
const DOCS_DIR = join(HERE, 'starter-protocols')

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
]
const DRIVE = 'https://www.googleapis.com/drive/v3'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3'

function loadKey() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 is not set.')
  let parsed
  try {
    parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 did not decode to valid JSON. Re-encode with `base64 -w0 key.json`.')
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Service account key is missing client_email or private_key.')
  }
  return parsed
}

let cached = null
async function accessToken() {
  if (!cached) {
    const key = loadKey()
    cached = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: SCOPES,
      subject: process.env.GOOGLE_IMPERSONATE_USER || undefined,
    })
  }
  await cached.authorize()
  const t = await cached.getAccessToken()
  if (!t.token) throw new Error('Failed to obtain a Google access token.')
  return t.token
}

async function driveFetch(url, init = {}) {
  const token = await accessToken()
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    if (res.status === 403 && body.includes('storageQuotaExceeded')) {
      throw new Error(
        'Drive refused to create the file: service accounts have no storage of their own and cannot own files in a My Drive folder. ' +
          'Set GOOGLE_IMPERSONATE_USER to the folder owner (with domain-wide delegation), or use a Shared Drive folder.'
      )
    }
    throw new Error(`Google Drive API ${res.status}: ${body.slice(0, 500)}`)
  }
  return res
}

async function checkFolder(folderId) {
  const res = await driveFetch(
    `${DRIVE}/files/${encodeURIComponent(folderId)}?supportsAllDrives=true` +
      `&fields=${encodeURIComponent('id,name,mimeType,driveId,capabilities(canAddChildren)')}`
  )
  const f = await res.json()
  if (f.mimeType !== 'application/vnd.google-apps.folder') {
    throw new Error(`GOOGLE_DRIVE_FOLDER_ID points at "${f.name}" (${f.mimeType}), not a folder.`)
  }
  if (!f.capabilities?.canAddChildren) {
    throw new Error(`Folder "${f.name}" is visible but read-only to the current identity. Share it as Editor / Content Manager.`)
  }
  return f
}

async function createDoc({ title, html, folderId }) {
  const boundary = `tweed-${Buffer.from(title).toString('hex').slice(0, 12)}`
  const metadata = {
    name: title,
    mimeType: 'application/vnd.google-apps.document',
    parents: [folderId],
  }
  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    `${html}\r\n` +
    `--${boundary}--`
  const res = await driveFetch(
    `${UPLOAD}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink`,
    { method: 'POST', headers: { 'content-type': `multipart/related; boundary=${boundary}` }, body }
  )
  return res.json()
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!folderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID is not set (the "IntelX demo" folder).')

  const identity = process.env.GOOGLE_IMPERSONATE_USER || '(service account, no impersonation)'
  const folder = await checkFolder(folderId)
  console.log(`Authenticated as ${identity}; target folder "${folder.name}" is writable.`)
  if (dryRun) {
    console.log('--dry-run: stopping before creating documents.')
    return
  }

  const manifest = JSON.parse(await readFile(join(DOCS_DIR, 'manifest.json'), 'utf-8'))
  for (const { title, file } of manifest) {
    const html = await readFile(join(DOCS_DIR, file), 'utf-8')
    const doc = await createDoc({ title, html, folderId })
    console.log(`Created: ${doc.name}\n  ${doc.webViewLink}`)
  }
  console.log(`\nDone — ${manifest.length} starter protocols published to "${folder.name}".`)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
