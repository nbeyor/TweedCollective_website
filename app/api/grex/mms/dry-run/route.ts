import { NextRequest } from 'next/server'

import { mmsConfig } from '@/lib/grex/mms/config'
import { buildFixtureReport } from '@/lib/grex/mms/fixture'
import { getStore } from '@/lib/grex/mms/store'
import { liveJobRuntime, reportUrl } from '@/lib/grex/mms/worker'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Local/dev path with no Twilio. Disabled unless GREX_MMS_DRY_RUN=1 and a
 * secret of at least 16 characters is set. Header: x-grex-dry-run-secret.
 *
 * { "mode": "fixture" } stores a seeded report.
 * { "mode": "transcript", "transcript": "..." } runs OCR-less verify + collapse.
 */
export async function POST(req: NextRequest) {
  const config = mmsConfig()
  if (!config.dryRun || config.dryRunSecret.length < 16) {
    return new Response('Not found', { status: 404 })
  }
  if (req.headers.get('x-grex-dry-run-secret') !== config.dryRunSecret) {
    return new Response('Not found', { status: 404 })
  }

  let body: { mode?: string; transcript?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const store = getStore()
  if (body.mode === 'fixture') {
    const report = buildFixtureReport()
    await store.putReport(report)
    return Response.json({ reportId: report.id, url: reportUrl(config, report.id) })
  }

  if (body.mode === 'transcript') {
    const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : ''
    if (transcript.length < 40) {
      return Response.json({ error: 'Transcript must be at least 40 characters.' }, { status: 400 })
    }
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 503 })
    }
    const { randomBytes } = await import('crypto')
    const reportId = randomBytes(16).toString('hex')
    const runtime = liveJobRuntime(store, config)
    const verified = await runtime.verify(transcript, reportId)
    if (!verified) {
      return Response.json({ error: 'The check did not produce a result.' }, { status: 502 })
    }
    const collapse = await runtime.collapse(verified)
    const now = new Date()
    await store.putReport({
      id: reportId,
      surface: 'mms',
      mode: 'live',
      submittedText: '',
      contentLabel: verified.contentLabel,
      summary: verified.summary,
      claims: verified.claims,
      score: verified.score,
      checkedAt: verified.checkedAt,
      evidenceMode: verified.evidenceMode,
      methodologyVersion: 'v0.1',
      truncated: verified.truncated === true,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + config.reportTtlMs).toISOString(),
      collapse,
    })
    return Response.json({ reportId, url: reportUrl(config, reportId) })
  }

  return Response.json({ error: 'mode must be fixture or transcript.' }, { status: 400 })
}
