/**
 * Document intake for the Protocol Strategist.
 *
 * Browser drops a .docx → this module validates, parses in memory (mammoth),
 * runs the Haiku extract, and creates a NEW Google Doc as the working copy.
 * The original bytes are never written to disk and are dropped when this
 * function returns. Existing starter Doc IDs are never reused or overwritten.
 */

import mammoth from 'mammoth'

import { extractDesignBrief, type BriefCoverage, type ExtractResult } from './strategistExtract'
import { createDoc, shareDoc, type DocRef } from './googleDocs'
import type { DesignBrief } from './trialCorpus'

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export class IntakeError extends Error {
  constructor(
    message: string,
    readonly status: number = 400
  ) {
    super(message)
  }
}

export interface ValidatedUpload {
  fileName: string
  bytes: Buffer
}

const OLE_MAGIC = [0xd0, 0xcf, 0x11, 0xe0]
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46] // %PDF
const ZIP_MAGIC = [0x50, 0x4b] // PK

function startsWith(bytes: Uint8Array, magic: number[]): boolean {
  if (bytes.length < magic.length) return false
  return magic.every((b, i) => bytes[i] === b)
}

/**
 * Reject anything that is not a .docx under the size cap. Extension, ZIP
 * magic, and a few common mis-types (PDF, old .doc) are all checked so a
 * renamed file does not slip through.
 */
export function validateDocxUpload(file: {
  name: string
  size?: number
  type?: string
  bytes: Uint8Array
}): ValidatedUpload {
  const fileName = (file.name || '').trim() || 'upload.docx'
  const size = file.size ?? file.bytes.byteLength

  if (size <= 0 || file.bytes.byteLength <= 0) {
    throw new IntakeError('The file is empty. Drop a .docx design brief.')
  }
  if (size > MAX_UPLOAD_BYTES || file.bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new IntakeError(
      `That file is too large (${Math.ceil(size / (1024 * 1024))} MB). Uploads are capped at 4 MB.`,
      413
    )
  }
  if (!fileName.toLowerCase().endsWith('.docx')) {
    throw new IntakeError('Only .docx files are accepted. Export or save the brief as Word (.docx).')
  }
  if (startsWith(file.bytes, PDF_MAGIC)) {
    throw new IntakeError('That looks like a PDF. Save or export the brief as a .docx and try again.')
  }
  if (startsWith(file.bytes, OLE_MAGIC)) {
    throw new IntakeError('That looks like a legacy .doc. Re-save it as .docx and try again.')
  }
  if (!startsWith(file.bytes, ZIP_MAGIC)) {
    throw new IntakeError('That file is not a valid .docx (missing the Word/ZIP header).')
  }

  return { fileName, bytes: Buffer.from(file.bytes) }
}

export async function parseDocx(bytes: Buffer): Promise<{ html: string; text: string }> {
  const [htmlRes, textRes] = await Promise.all([
    mammoth.convertToHtml({ buffer: bytes }),
    mammoth.extractRawText({ buffer: bytes }),
  ])
  const html = (htmlRes.value ?? '').trim()
  const text = (textRes.value ?? '').replace(/\u0000/g, '').trim()
  if (!html && !text) {
    throw new IntakeError('Could not read any text from that .docx. Is it empty or image-only?')
  }
  return { html: html || `<p>${escapeHtml(text)}</p>`, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export interface IntakeDeps {
  parseDocx?: (bytes: Buffer) => Promise<{ html: string; text: string }>
  extractBrief: (text: string, opts?: { fileName?: string }) => Promise<ExtractResult>
  createDoc: (opts: { title: string; html: string }) => Promise<DocRef>
  shareDoc: (fileId: string, email: string, role: 'writer') => Promise<void>
}

const defaultDeps = (): IntakeDeps => ({
  parseDocx,
  extractBrief: extractDesignBrief,
  createDoc,
  shareDoc: (id, email) => shareDoc(id, email, 'writer'),
})

export interface IntakeResult {
  brief: DesignBrief
  coverage: BriefCoverage
  sourceText: string | null
  thin: boolean
  doc: DocRef
  shared: boolean
  shareError?: string
  fileName: string
}

/**
 * End-to-end intake from an already-validated .docx buffer. Creates a NEW
 * Google Doc (never an existing starter id) and shares it with the uploader.
 * `bytes` is not persisted after return.
 */
export async function intakeUploadedDocument(opts: {
  bytes: Buffer
  fileName: string
  shareWith?: string | null
  deps?: Partial<IntakeDeps>
}): Promise<IntakeResult> {
  const deps: IntakeDeps = { ...defaultDeps(), ...opts.deps }
  const parsed = await (deps.parseDocx ?? parseDocx)(opts.bytes)
  const { html, text } = parsed
  const extracted = await deps.extractBrief(text, { fileName: opts.fileName })

  const stem = opts.fileName.replace(/\.docx$/i, '').trim() || extracted.brief.title || 'Design brief'
  const title = `${stem} — working copy`

  // Always create a new Doc from the parsed HTML. No fileId, no starter reuse.
  const doc = await deps.createDoc({ title, html })

  let shared = false
  let shareError: string | undefined
  const email = opts.shareWith?.trim()
  if (email && email.includes('@')) {
    try {
      await deps.shareDoc(doc.id, email, 'writer')
      shared = true
    } catch (err) {
      shareError = err instanceof Error ? err.message : String(err)
    }
  }

  return {
    brief: extracted.brief,
    coverage: extracted.coverage,
    sourceText: extracted.sourceText,
    thin: extracted.thin,
    doc,
    shared,
    shareError,
    fileName: opts.fileName,
  }
}

export interface UploadRouteDeps {
  checkGrant: () => Promise<Response | null>
  getUserEmail: () => Promise<string | null>
  formData: () => Promise<FormData>
  intake: typeof intakeUploadedDocument
}

/**
 * Grant-gated upload handler. Extracted so tests can drive grant / size /
 * createDoc without standing up Next or Clerk.
 */
export async function runUploadRoute(deps: UploadRouteDeps): Promise<Response> {
  const denied = await deps.checkGrant()
  if (denied) return denied

  let form: FormData
  try {
    form = await deps.formData()
  } catch {
    return Response.json({ error: 'Could not read the upload. Try again as a .docx under 4 MB.' }, { status: 400 })
  }

  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return Response.json({ error: 'Attach a .docx as the "file" field.' }, { status: 400 })
  }

  const blob = file as File
  const bytes = new Uint8Array(await blob.arrayBuffer())

  let validated: ValidatedUpload
  try {
    validated = validateDocxUpload({
      name: blob.name || 'upload.docx',
      size: blob.size,
      type: blob.type,
      bytes,
    })
  } catch (err) {
    if (err instanceof IntakeError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 400 })
  }

  const shareWith = await deps.getUserEmail()

  try {
    const result = await deps.intake({
      bytes: validated.bytes,
      fileName: validated.fileName,
      shareWith,
    })
    return Response.json({
      brief: result.brief,
      coverage: result.coverage,
      sourceText: result.sourceText,
      thin: result.thin,
      doc: result.doc,
      shared: result.shared,
      shareError: result.shareError,
      fileName: result.fileName,
    })
  } catch (err) {
    if (err instanceof IntakeError) {
      return Response.json({ error: err.message }, { status: err.status })
    }
    const msg = err instanceof Error ? err.message : String(err)
    return Response.json({ error: msg }, { status: 500 })
  }
}
