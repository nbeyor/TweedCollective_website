/**
 * Google Docs bridge for the Protocol Strategist.
 *
 * Codify → the strategist writes a working document (Doc A).
 * Review  → it reads that document back *with the human's comment threads*
 *           and produces a revised document (Doc B) whose change log is keyed
 *           to those comments.
 *
 * Doc B is a separate file rather than tracked changes because the Drive API
 * exposes neither Google Docs suggestion mode nor edit-in-place. That is a
 * constraint of the platform, not a shortcut.
 *
 * Credentials: a Google service account. The account is its own identity — it
 * can only see files and folders explicitly shared with it, so the drive scope
 * below has a blast radius of exactly what you share.
 *
 *   GOOGLE_SERVICE_ACCOUNT_JSON_BASE64  base64 of the service account key file
 *   GOOGLE_DRIVE_FOLDER_ID              destination folder (or Shared Drive folder)
 */

import { JWT } from 'google-auth-library'

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
]
const DRIVE = 'https://www.googleapis.com/drive/v3'
const UPLOAD = 'https://www.googleapis.com/upload/drive/v3'
const DOCS = 'https://docs.googleapis.com/v1/documents'

export interface DocRef {
  id: string
  name: string
  webViewLink: string
}

export interface DocComment {
  id: string
  author: string
  content: string
  quotedText: string | null
  createdTime: string
  resolved: boolean
  replies: Array<{ author: string; content: string; createdTime: string }>
}

// ------------------------------------------------------------ credentials ---

interface ServiceAccountKey {
  client_email: string
  private_key: string
  project_id?: string
}

function loadKey(): ServiceAccountKey {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 is not set.')
  let parsed: ServiceAccountKey
  try {
    parsed = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
  } catch {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 did not decode to valid JSON. Re-encode the key file with `base64 -w0 key.json`.'
    )
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Service account key is missing client_email or private_key.')
  }
  return parsed
}

/** Non-throwing credential check, for the health endpoint. */
export function googleCredentialStatus(): { ok: boolean; detail: string } {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return { ok: false, detail: 'GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 is not set. Docs output disabled.' }
  }
  if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
    return { ok: false, detail: 'GOOGLE_DRIVE_FOLDER_ID is not set. Docs output disabled.' }
  }
  try {
    const key = loadKey()
    return {
      ok: true,
      detail: `service account ${key.client_email} (project ${key.project_id ?? 'unknown'}); folder ${process.env.GOOGLE_DRIVE_FOLDER_ID}`,
    }
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

/**
 * Live end-to-end check: authenticate, then confirm the destination folder is
 * reachable AND writable by the service account.
 *
 * Credential parsing alone proves nothing useful — the common failures are a
 * mistyped folder ID, a share that never applied, or a domain policy blocking
 * external sharing. All of those parse fine and fail at write time.
 */
export async function checkDriveAccess(): Promise<{ ok: boolean; detail: string }> {
  const creds = googleCredentialStatus()
  if (!creds.ok) return creds

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID as string
  const key = loadKey()

  try {
    const res = await driveFetch(
      `${DRIVE}/files/${encodeURIComponent(folderId)}?supportsAllDrives=true` +
        `&fields=${encodeURIComponent('id,name,mimeType,capabilities(canAddChildren)')}`
    )
    const f = (await res.json()) as {
      name: string
      mimeType: string
      capabilities?: { canAddChildren?: boolean }
    }

    if (f.mimeType !== 'application/vnd.google-apps.folder') {
      return {
        ok: false,
        detail: `GOOGLE_DRIVE_FOLDER_ID points at "${f.name}", which is a ${f.mimeType}, not a folder. Use the ID from a folder URL.`,
      }
    }
    if (!f.capabilities?.canAddChildren) {
      return {
        ok: false,
        detail: `Folder "${f.name}" is visible but read-only to ${key.client_email}. Re-share it as Editor (Content Manager on a Shared Drive).`,
      }
    }
    return { ok: true, detail: `authenticated as ${key.client_email}; can write to folder "${f.name}"` }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    // Drive returns 404 for "does not exist" and "you cannot see it" alike, so
    // the useful message covers both.
    if (msg.includes('404')) {
      return {
        ok: false,
        detail: `Folder ${folderId} not found, or not shared with ${key.client_email}. Check the ID and confirm the share went through.`,
      }
    }
    if (msg.includes('403')) {
      return {
        ok: false,
        detail: `Drive API refused the request. Usually the Drive API is not enabled on the project, or a domain policy is blocking it. (${msg.slice(0, 160)})`,
      }
    }
    if (msg.includes('invalid_grant') || msg.includes('401')) {
      return {
        ok: false,
        detail: `Service account key rejected. Re-check GOOGLE_SERVICE_ACCOUNT_JSON_BASE64 decodes to the key file. (${msg.slice(0, 160)})`,
      }
    }
    return { ok: false, detail: msg.slice(0, 300) }
  }
}

let cachedClient: JWT | null = null

async function auth(): Promise<JWT> {
  if (!cachedClient) {
    const key = loadKey()
    cachedClient = new JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: SCOPES,
    })
  }
  await cachedClient.authorize()
  return cachedClient
}

async function accessToken(): Promise<string> {
  const client = await auth()
  const token = await client.getAccessToken()
  if (!token.token) throw new Error('Failed to obtain a Google access token.')
  return token.token
}

async function driveFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken()
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Drive API ${res.status}: ${body.slice(0, 500)}`)
  }
  return res
}

// ---------------------------------------------------------------- writing ---

/**
 * Create a Google Doc from HTML.
 *
 * HTML rather than plain text: Drive converts it on upload, so headings,
 * tables, and emphasis survive. A plain-text upload produces an unformatted
 * wall that reads as a draft nobody edited.
 */
export async function createDoc(opts: {
  title: string
  html: string
  folderId?: string
}): Promise<DocRef> {
  const folderId = opts.folderId ?? process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!folderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID is not set.')

  const boundary = `tweed-${Math.random().toString(36).slice(2)}`
  const metadata = {
    name: opts.title,
    mimeType: 'application/vnd.google-apps.document',
    parents: [folderId],
  }

  const body =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    'Content-Type: text/html; charset=UTF-8\r\n\r\n' +
    `${opts.html}\r\n` +
    `--${boundary}--`

  const res = await driveFetch(
    `${UPLOAD}/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink`,
    {
      method: 'POST',
      headers: { 'content-type': `multipart/related; boundary=${boundary}` },
      body,
    }
  )
  return (await res.json()) as DocRef
}

// ---------------------------------------------------------------- reading ---

/** Export a Doc's text. `format` 'html' preserves structure; 'text' is cheaper. */
export async function readDoc(fileId: string, format: 'html' | 'text' = 'text'): Promise<string> {
  const mime = format === 'html' ? 'text/html' : 'text/plain'
  const res = await driveFetch(
    `${DRIVE}/files/${encodeURIComponent(fileId)}/export?mimeType=${encodeURIComponent(mime)}&supportsAllDrives=true`
  )
  return await res.text()
}

/**
 * Read the human's comment threads, with the text each is anchored to.
 *
 * This is the load-bearing half of the review loop. Keying revisions to
 * comments is the difference between "the AI rewrote my document" and "the AI
 * answered my margin notes".
 */
export async function readComments(fileId: string): Promise<DocComment[]> {
  const fields =
    'comments(id,content,resolved,createdTime,author(displayName),quotedFileContent(value),replies(content,createdTime,author(displayName)))'
  const res = await driveFetch(
    `${DRIVE}/files/${encodeURIComponent(fileId)}/comments?pageSize=100&fields=${encodeURIComponent(fields)}`
  )
  const data = (await res.json()) as {
    comments?: Array<{
      id: string
      content: string
      resolved?: boolean
      createdTime: string
      author?: { displayName?: string }
      quotedFileContent?: { value?: string }
      replies?: Array<{ content: string; createdTime: string; author?: { displayName?: string } }>
    }>
  }

  return (data.comments ?? []).map((c) => ({
    id: c.id,
    author: c.author?.displayName ?? 'Unknown',
    content: c.content,
    quotedText: c.quotedFileContent?.value ?? null,
    createdTime: c.createdTime,
    resolved: Boolean(c.resolved),
    replies: (c.replies ?? []).map((r) => ({
      author: r.author?.displayName ?? 'Unknown',
      content: r.content,
      createdTime: r.createdTime,
    })),
  }))
}

export async function getDocMeta(fileId: string): Promise<DocRef> {
  const res = await driveFetch(
    `${DRIVE}/files/${encodeURIComponent(fileId)}?supportsAllDrives=true&fields=id,name,webViewLink`
  )
  return (await res.json()) as DocRef
}

// ------------------------------------------------------------- ship-it ------

export interface ShipEntry {
  brief_id: string
  element_id: string
  element_label: string
  decision: string
  rationale: string
  alternatives_considered: Array<{ option: string; tradeoff: string }>
  evidence: string[]
}

export interface ShipOutcome {
  written: boolean
  doc?: DocRef
  detail?: string
}

/**
 * Append a decision to the design brief's decision log, in place.
 *
 * The service account can edit the brief document through the Docs API (unlike
 * the session connector, which is read/create only), so a shipped decision lands
 * in the same document the demo opened on — the doc accumulates a decision log,
 * and by the end reads as a design brief where every choice shows its work.
 *
 * Degrades cleanly: with no brief document id or credentials configured, it
 * returns { written: false } and the page keeps the decision in its on-page log,
 * so the flow still demos without Google set up.
 */
export async function shipDecisionToBrief(entry: ShipEntry): Promise<ShipOutcome> {
  const docId = process.env.STRATEGIST_BRIEF_DOC_ID
  if (!docId) {
    return { written: false, detail: 'STRATEGIST_BRIEF_DOC_ID is not set; decision logged on-page only.' }
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return { written: false, detail: 'Google credentials not configured; decision logged on-page only.' }
  }

  try {
    const stamp = new Date().toISOString().slice(0, 10)
    const lines: string[] = []
    lines.push(`Decision — ${entry.element_label} (${stamp})`)
    lines.push(`Chosen: ${entry.decision}`)
    if (entry.rationale) lines.push(`Why: ${entry.rationale}`)
    if (entry.alternatives_considered.length) {
      lines.push('Alternatives considered:')
      for (const a of entry.alternatives_considered) lines.push(`  • ${a.option} — ${a.tradeoff}`)
    }
    if (entry.evidence.length) {
      lines.push('Evidence:')
      for (const e of entry.evidence) lines.push(`  • ${e}`)
    }
    const block = '\n' + lines.join('\n') + '\n'

    // Find the document end index, then insert the block there. A HEADING_3 on
    // the title line keeps the log scannable.
    const docRes = await docsFetch(`${DOCS}/${encodeURIComponent(docId)}?fields=body(content(endIndex))`)
    const doc = (await docRes.json()) as { body?: { content?: Array<{ endIndex?: number }> } }
    const content = doc.body?.content ?? []
    const endIndex = content.reduce((m, c) => Math.max(m, c.endIndex ?? 1), 1)
    const insertAt = Math.max(1, endIndex - 1)

    const titleStart = insertAt + 1 // after the leading newline
    const titleEnd = titleStart + lines[0].length

    await docsFetch(`${DOCS}/${encodeURIComponent(docId)}:batchUpdate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        requests: [
          { insertText: { location: { index: insertAt }, text: block } },
          {
            updateParagraphStyle: {
              range: { startIndex: titleStart, endIndex: titleEnd },
              paragraphStyle: { namedStyleType: 'HEADING_3' },
              fields: 'namedStyleType',
            },
          },
        ],
      }),
    })

    return {
      written: true,
      doc: {
        id: docId,
        name: 'Design brief',
        webViewLink: `https://docs.google.com/document/d/${docId}/edit`,
      },
    }
  } catch (err) {
    return { written: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

async function docsFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await accessToken()
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google Docs API ${res.status}: ${body.slice(0, 400)}`)
  }
  return res
}

/** Share a file with a person by email. Used to hand Doc A/B to the reviewer. */
export async function shareDoc(
  fileId: string,
  email: string,
  role: 'reader' | 'commenter' | 'writer' = 'writer'
): Promise<void> {
  await driveFetch(
    `${DRIVE}/files/${encodeURIComponent(fileId)}/permissions?supportsAllDrives=true&sendNotificationEmail=false`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'user', role, emailAddress: email }),
    }
  )
}
