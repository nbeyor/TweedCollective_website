import Anthropic from '@anthropic-ai/sdk'
import { randomBytes } from 'crypto'

import type { CollapseViz } from '../collapse'
import { runVerification } from '../runVerification'
import { SCORING_METHODOLOGY_VERSION, type VerificationResult } from '../types'
import { collapsePass } from './collapsePass'
import { mmsConfig, type MmsConfig } from './config'
import { MMS_COPY, resultSms } from './copy'
import { shouldSendMidStatus, type TransportStatus } from './limits'
import type { MmsStore, PublicReport } from './store'
import { downloadTwilioMedia, sendSms, transcribeImage, visionMediaType } from './transport'

const MIN_TRANSCRIPT = 40

export interface InboundJob {
  messageSid: string
  fromE164: string
  mediaUrl: string
  mediaType: string
  caption: string
}

export interface JobRuntime {
  config: MmsConfig
  store: MmsStore
  now: () => Date
  sendSms: (to: string, body: string) => Promise<void>
  download: (url: string) => Promise<Buffer>
  transcribe: (input: { bytes: Buffer; mediaType: string; caption: string }) => Promise<{ legible: boolean; transcript: string }>
  verify: (transcript: string, reportId: string) => Promise<VerificationResult | null>
  collapse: (result: VerificationResult) => Promise<CollapseViz>
}

export function isProviderError(err: unknown): boolean {
  if (err instanceof Anthropic.APIError) {
    const status = err.status
    return status === undefined || status === 408 || status === 409 || status === 429 || status >= 500
  }
  if (err instanceof Error && (err.name === 'APIConnectionError' || err.name === 'TwilioSmsError')) return true
  return err instanceof TypeError
}

async function withOneRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (!isProviderError(err)) throw err
    return await fn()
  }
}

export function liveJobRuntime(store: MmsStore, config: MmsConfig = mmsConfig()): JobRuntime {
  const client = new Anthropic()
  return {
    config,
    store,
    now: () => new Date(),
    sendSms: (to, body) => sendSms(to, body, config),
    download: (url) => downloadTwilioMedia(url, config),
    transcribe: async ({ bytes, mediaType, caption }) => {
      const visionType = visionMediaType(mediaType)
      if (!visionType) return { legible: false, transcript: '' }
      return transcribeImage({ client, model: config.ocrModel, bytes, mediaType: visionType, caption })
    },
    verify: async (transcript, reportId) => {
      const outcome = await runVerification({
        client,
        surface: 'mms',
        content: transcript,
        id: reportId,
        retainSubmittedText: false,
      })
      return outcome.ok ? outcome.result : null
    },
    collapse: (result) => collapsePass(result, config, client),
  }
}

export async function processInboundJob(job: InboundJob, runtime: JobRuntime): Promise<void> {
  const started = runtime.now().getTime()
  let aborted = false
  const stopMid = armMidStatus(job, runtime, started, () => aborted)

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      aborted = true
      reject(Object.assign(new Error('JOB_TIMEOUT'), { name: 'JobTimeout' }))
    }, runtime.config.jobTimeoutMs)
  })

  try {
    await Promise.race([runPipeline(job, runtime, () => aborted), timeout])
  } catch (err) {
    if (err instanceof Error && err.name === 'JobTimeout') {
      await fail(job, runtime, 'timeout')
      return
    }
    console.error('[grex/mms] job failed', job.messageSid, err instanceof Error ? err.name : 'error')
    await fail(job, runtime, 'provider')
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle)
    stopMid()
  }
}

function armMidStatus(job: InboundJob, runtime: JobRuntime, started: number, aborted: () => boolean): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  const tick = async () => {
    if (aborted()) return
    const row = await runtime.store.getTransport(job.messageSid)
    if (!row) return
    const elapsed = runtime.now().getTime() - started
    if (
      shouldSendMidStatus({
        status: row.status,
        elapsedMs: elapsed,
        thresholdMs: runtime.config.midStatusMs,
        midAlreadySent: Boolean(row.midStatusSentAt),
        terminalAlreadySent: Boolean(row.terminalSmsAt),
      })
    ) {
      const claimed = await runtime.store.claimFlag(job.messageSid, 'midStatusSentAt', runtime.now().toISOString())
      if (!claimed) return
      await runtime.sendSms(job.fromE164, MMS_COPY.mid).catch((err) => {
        console.error('[grex/mms] mid-status failed', err instanceof Error ? err.name : 'error')
      })
      return
    }
    if (row.terminalSmsAt || row.status === 'complete' || row.status === 'failed' || row.status === 'refused') return
    timer = setTimeout(tick, 5_000)
  }
  timer = setTimeout(tick, runtime.config.midStatusMs)
  return () => {
    if (timer) clearTimeout(timer)
  }
}

async function runPipeline(job: InboundJob, runtime: JobRuntime, aborted: () => boolean): Promise<void> {
  await setStatus(runtime, job.messageSid, 'transcribing')
  let bytes: Buffer | null = null
  let transcript = ''
  let legible = false
  try {
    bytes = await withOneRetry(() => runtime.download(job.mediaUrl))
    const read = await withOneRetry(() => runtime.transcribe({ bytes: bytes!, mediaType: job.mediaType, caption: job.caption }))
    transcript = read.transcript
    legible = read.legible
  } catch (err) {
    if (err instanceof Error && err.name === 'ImageTooLarge') {
      await refuse(job, runtime, 'too_large', MMS_COPY.tooLarge)
      return
    }
    throw err
  } finally {
    bytes = null
    await runtime.store.updateTransport(job.messageSid, { imageDeletedAt: runtime.now().toISOString() })
  }
  if (aborted()) return

  await runtime.store.putTranscript(
    job.messageSid,
    transcript,
    new Date(runtime.now().getTime() + runtime.config.transcriptTtlMs).toISOString()
  )

  if (!legible || transcript.trim().length < MIN_TRANSCRIPT) {
    await refuse(job, runtime, 'illegible', MMS_COPY.illegible)
    return
  }

  await setStatus(runtime, job.messageSid, 'verifying')
  const reportId = randomBytes(16).toString('hex')
  const verified = await withOneRetry(() => runtime.verify(transcript, reportId))
  if (aborted()) return
  if (!verified) {
    await fail(job, runtime, 'no_result')
    return
  }

  await setStatus(runtime, job.messageSid, 'collapsing')
  const scoreSnapshot = { ...verified.score }
  let collapse: CollapseViz
  try {
    collapse = await runtime.collapse(verified)
  } catch (err) {
    console.error('[grex/mms] collapse failed', err instanceof Error ? err.name : 'error')
    collapse = (await import('../collapse')).buildCollapseViz({ claims: verified.claims, hitsByClaimId: {} })
  }
  verified.score = scoreSnapshot
  if (aborted()) return

  const now = runtime.now()
  const report: PublicReport = {
    id: reportId,
    surface: 'mms',
    mode: 'live',
    submittedText: '',
    contentLabel: verified.contentLabel,
    summary: verified.summary,
    claims: verified.claims,
    score: scoreSnapshot,
    checkedAt: verified.checkedAt,
    evidenceMode: verified.evidenceMode,
    methodologyVersion: SCORING_METHODOLOGY_VERSION,
    truncated: verified.truncated === true,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + runtime.config.reportTtlMs).toISOString(),
    collapse,
  }
  await runtime.store.putReport(report)
  const url = reportUrl(runtime.config, reportId)
  const body = resultSms({
    score: report.score,
    claims: report.claims,
    url,
    truncated: report.truncated,
    degraded: report.evidenceMode === 'degraded',
  })
  await runtime.store.updateTransport(job.messageSid, {
    status: 'complete',
    reportId,
    completedAt: now.toISOString(),
  })
  await sendTerminal(job, runtime, body)
}

async function refuse(job: InboundJob, runtime: JobRuntime, code: string, sms: string) {
  await runtime.store.updateTransport(job.messageSid, {
    status: 'refused',
    errorCode: code,
    completedAt: runtime.now().toISOString(),
  })
  await sendTerminal(job, runtime, sms)
}

async function fail(job: InboundJob, runtime: JobRuntime, code: string) {
  const row = await runtime.store.getTransport(job.messageSid)
  if (row?.status === 'complete' || row?.terminalSmsAt) return
  await runtime.store.updateTransport(job.messageSid, {
    status: 'failed',
    errorCode: code,
    completedAt: runtime.now().toISOString(),
  })
  await sendTerminal(job, runtime, MMS_COPY.failure)
}

async function sendTerminal(job: InboundJob, runtime: JobRuntime, body: string) {
  const claimed = await runtime.store.claimFlag(job.messageSid, 'terminalSmsAt', runtime.now().toISOString())
  if (!claimed) return
  try {
    await withOneRetry(() => runtime.sendSms(job.fromE164, body))
  } catch (err) {
    console.error('[grex/mms] terminal SMS failed', err instanceof Error ? err.name : 'error')
  }
}

async function setStatus(runtime: JobRuntime, messageSid: string, status: TransportStatus) {
  await runtime.store.updateTransport(messageSid, { status })
}

export function reportUrl(config: Pick<MmsConfig, 'publicBaseUrl'>, id: string): string {
  const base = config.publicBaseUrl || ''
  return `${base}/r/${id}`
}
