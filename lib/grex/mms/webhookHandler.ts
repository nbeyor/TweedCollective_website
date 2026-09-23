import { mmsConfig, type MmsConfig } from './config'
import { MMS_COPY } from './copy'
import { decideIntake, keywordOf, type TransportRow } from './limits'
import { normalizeE164, phoneHash, twilioSignatureValid, twilioWebhookUrl } from './phone'
import type { MmsStore } from './store'
import { visionMediaType } from './transport'
import type { InboundJob } from './worker'

export interface WebhookDeps {
  config: MmsConfig
  store: MmsStore
  now: () => Date
  sendSms: (to: string, body: string) => Promise<void>
  defer: (task: Promise<unknown>) => void
  startJob: (job: InboundJob) => Promise<void>
}

const locks = new Map<string, Promise<unknown>>()

function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve()
  const run = prev.then(fn, fn)
  locks.set(
    key,
    run.then(
      () => undefined,
      () => undefined
    )
  )
  return run
}

export function emptyTwiml(): Response {
  return new Response('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
    status: 200,
    headers: { 'content-type': 'text/xml; charset=utf-8' },
  })
}

export async function handleTwilioWebhook(request: Request, deps: WebhookDeps): Promise<Response> {
  const { config, store } = deps
  if (!config.phoneHmacSecret) {
    return new Response('GREX MMS phone hash secret is not configured', { status: 503 })
  }
  if (!config.skipSignature && (!config.twilioAuthToken || !config.twilioAccountSid || !config.twilioFromNumber)) {
    return new Response('Twilio is not configured', { status: 503 })
  }
  if (config.skipSignature && !config.twilioFromNumber) {
    return new Response('TWILIO_FROM_NUMBER is not configured', { status: 503 })
  }

  const form = await request.formData()
  const params: Record<string, string> = {}
  for (const [key, value] of Array.from(form.entries())) {
    if (typeof value === 'string') params[key] = value
  }

  if (!config.skipSignature) {
    const valid = twilioSignatureValid(
      config.twilioAuthToken,
      request.headers.get('x-twilio-signature'),
      twilioWebhookUrl(request, config.webhookUrlOverride),
      params
    )
    if (!valid) return new Response('Invalid signature', { status: 403 })
  }

  const from = normalizeE164(params.From || '')
  const messageSid = params.MessageSid || ''
  if (!from || !/^(SM|MM)[A-Za-z0-9]+$/.test(messageSid)) {
    console.error('[grex/mms] inbound missing From or MessageSid')
    return emptyTwiml()
  }

  const hash = phoneHash(from, config.phoneHmacSecret)
  await store.sweep(deps.now()).catch(() => undefined)

  return withLock(hash, async () => {
    const existing = await store.getTransport(messageSid)
    if (existing) {
      if (existing.status === 'queued' && !existing.ackSentAt) {
        await sendAndMark(deps, from, messageSid, MMS_COPY.ack, 'ackSentAt')
      }
      return emptyTwiml()
    }

    const keyword = keywordOf(params.Body || '')
    if (keyword === 'stop') {
      await store.setOptOut(hash, true)
      await recordAndSend(deps, baseRow(messageSid, hash, 'opted_out', deps.now()), from, MMS_COPY.stop)
      return emptyTwiml()
    }
    if (keyword === 'help') {
      await recordAndSend(deps, baseRow(messageSid, hash, 'refused', deps.now(), 'help'), from, MMS_COPY.help)
      return emptyTwiml()
    }
    if (keyword === 'start') {
      await store.setOptOut(hash, false)
      await recordAndSend(deps, baseRow(messageSid, hash, 'refused', deps.now(), 'start'), from, MMS_COPY.start)
      return emptyTwiml()
    }
    if (await store.getOptOut(hash)) {
      await store.createTransport(baseRow(messageSid, hash, 'opted_out', deps.now()))
      return emptyTwiml()
    }

    const numMedia = Number(params.NumMedia || '0')
    const mediaType = params.MediaContentType0 || ''
    if (numMedia !== 1 || !visionMediaType(mediaType)) {
      const sms = numMedia === 0 ? MMS_COPY.textOnly : MMS_COPY.singleImage
      await recordAndSend(deps, baseRow(messageSid, hash, 'refused', deps.now(), numMedia === 0 ? 'text_only' : 'bad_media'), from, sms)
      return emptyTwiml()
    }

    const rows = await store.listTransportsForPhone(hash)
    const day = deps.now().toISOString().slice(0, 10)
    const spent = await store.getSpend(day)
    const decision = decideIntake({ rows, now: deps.now().getTime(), spentUsd: spent, config })
    if (decision.action === 'refuse') {
      await recordAndSend(deps, baseRow(messageSid, hash, 'refused', deps.now(), decision.reason), from, decision.sms)
      return emptyTwiml()
    }

    await store.addSpend(day, config.costPerCheckUsd)
    const queued = baseRow(messageSid, hash, 'queued', deps.now())
    const created = await store.createTransport(queued)
    if (!created) {
      await store.addSpend(day, -config.costPerCheckUsd)
      return emptyTwiml()
    }
    deps.defer(deps.startJob(jobFrom(params, from, messageSid)))
    await sendAndMark(deps, from, messageSid, MMS_COPY.ack, 'ackSentAt')
    return emptyTwiml()
  })
}

function jobFrom(params: Record<string, string>, from: string, messageSid: string): InboundJob {
  return {
    messageSid,
    fromE164: from,
    mediaUrl: params.MediaUrl0,
    mediaType: params.MediaContentType0 || '',
    caption: params.Body || '',
  }
}

function baseRow(
  messageSid: string,
  phoneHashValue: string,
  status: TransportRow['status'],
  now: Date,
  errorCode: string | null = null
): TransportRow {
  return {
    messageSid,
    phoneHash: phoneHashValue,
    status,
    receivedAt: now.toISOString(),
    completedAt: status === 'queued' ? null : now.toISOString(),
    imageDeletedAt: null,
    reportId: null,
    errorCode,
    midStatusSentAt: null,
    ackSentAt: null,
    terminalSmsAt: null,
  }
}

async function recordAndSend(deps: WebhookDeps, row: TransportRow, to: string, body: string) {
  const created = await deps.store.createTransport(row)
  if (!created) return
  await sendAndMark(deps, to, row.messageSid, body, 'terminalSmsAt')
}

async function sendAndMark(
  deps: WebhookDeps,
  to: string,
  messageSid: string,
  body: string,
  flag: 'ackSentAt' | 'terminalSmsAt'
) {
  try {
    await deps.sendSms(to, body)
    await deps.store.claimFlag(messageSid, flag, deps.now().toISOString())
  } catch (err) {
    console.error('[grex/mms] SMS failed', flag, err instanceof Error ? err.name : 'error')
  }
}

export function defaultWebhookDeps(args: Omit<WebhookDeps, 'config' | 'now'> & { config?: MmsConfig; now?: () => Date }): WebhookDeps {
  return {
    config: args.config ?? mmsConfig(),
    now: args.now ?? (() => new Date()),
    store: args.store,
    sendSms: args.sendSms,
    defer: args.defer,
    startJob: args.startJob,
  }
}
