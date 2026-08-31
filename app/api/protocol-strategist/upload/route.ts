/**
 * Document intake — drop a .docx, extract a design brief, create a working copy.
 *
 * POST multipart/form-data  field "file" = .docx (≤ 4 MB)
 *
 * The Clerk workspace grant is checked before any parse or model call. The
 * browser never talks to Anthropic or Google (CSP is connect-src 'self').
 * Uploaded bytes stay in memory for this request only.
 */

import { NextRequest } from 'next/server'

import { clientAccessError, currentUserEmail } from '@/lib/client-access'
import { intakeUploadedDocument, runUploadRoute } from '@/lib/strategistUpload'

export const runtime = 'nodejs'
export const maxDuration = 60

const WORKSPACE_SLUG = 'protocol-strategist'

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  // Multipart overhead is small; reject obviously oversized bodies before parse.
  if (contentLength > 4.5 * 1024 * 1024) {
    return Response.json(
      { error: 'That file is too large. Uploads are capped at 4 MB.' },
      { status: 413 }
    )
  }

  return runUploadRoute({
    checkGrant: () => clientAccessError(WORKSPACE_SLUG),
    getUserEmail: currentUserEmail,
    formData: () => req.formData(),
    intake: intakeUploadedDocument,
  })
}
