/**
 * GREX MMS V0 checks that do not call Twilio or Anthropic.
 *
 * Run with: npm run test:grex-mms
 */

import { mkdtemp, rm } from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'

import { sanitizeVerification } from '../lib/grex/verifyTool'
import { buildCollapseViz, canonicalUrl, collapseChip, quotedFragment } from '../lib/grex/collapse'
import { extractPublishedDate, isPublicHttpUrl } from '../lib/grex/mms/dateMeta'
import { buildFixtureReport } from '../lib/grex/mms/fixture'
import { decideIntake, keywordOf, shouldSendMidStatus, type TransportRow } from '../lib/grex/mms/limits'
import { mmsConfig } from '../lib/grex/mms/config'
import { MMS_COPY, resultSms } from '../lib/grex/mms/copy'
import { phoneHash, twilioSignature, twilioSignatureValid } from '../lib/grex/mms/phone'
import { parseTranscript } from '../lib/grex/mms/transport'
import { createFileStore } from '../lib/grex/mms/store'
import { handleTwilioWebhook, type WebhookDeps } from '../lib/grex/mms/webhookHandler'
import { processInboundJob, type InboundJob, type JobRuntime } from '../lib/grex/mms/worker'
import { countClaims, scoreFor, v0Score, type Claim } from '../lib/grex/types'

let failures = 0
let checks = 0

function check(label: string, ok: boolean, detail?: string) {
  checks++
  if (ok) {
    console.log(`  ok  ${label}`)
  } else {
    failures++
    console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ''}`)
  }
}

function row(partial: Partial<TransportRow> & Pick<TransportRow, 'messageSid' | 'status'>): TransportRow {
  return {
    phoneHash: 'abc',
    receivedAt: new Date().toISOString(),
    completedAt: null,
    imageDeletedAt: null,
    reportId: null,
    errorCode: null,
    midStatusSentAt: null,
    ackSentAt: null,
    terminalSmsAt: null,
    ...partial,
  }
}

async function main() {
  const secret = 'test-secret-value'
  const baseConfig = mmsConfig({
    ...process.env,
    NODE_ENV: 'test',
    GREX_MMS_PHONE_HMAC_SECRET: secret,
    GREX_MMS_SKIP_TWILIO_SIGNATURE: '1',
    TWILIO_FROM_NUMBER: '+18005550199',
    GREX_MMS_PUBLIC_BASE_URL: 'https://reports.example',
    GREX_MMS_DAILY_CEILING_USD: '25',
    GREX_MMS_COST_PER_CHECK_USD: '1',
  })

  const signatureUrl = 'https://example.com/myapp.php?foo=1&bar=2'
  const signatureParams = {
    CallSid: 'CA1234567890ABCDE',
    Caller: '+14158675310',
    Digits: '1234',
    From: '+14158675310',
    To: '+18005551212',
  }
  const expectedSig = twilioSignature('12345', signatureUrl, signatureParams)
  check('twilio signature matches the documented HMAC vector', expectedSig === 'L/OH5YylLD5NRKLltdqwSvS0BnU=', expectedSig)
  check('twilio signature rejects a tampered body', !twilioSignatureValid('12345', expectedSig, signatureUrl, { ...signatureParams, Digits: '9999' }))

  check(
    'canonical url strips tracking and www',
    canonicalUrl('https://WWW.Example.com/a/?utm_source=x&b=1') === 'https://example.com/a?b=1'
  )
  check(
    'canonical url unwraps google amp',
    canonicalUrl('https://www.google.com/amp/s/www.nature.com/articles/foo/amp') === 'https://nature.com/articles/foo'
  )

  const sameDomain = buildCollapseViz({
    claims: [verifiable('c1', 'A journal page and a later write-up are different.')],
    hitsByClaimId: {
      c1: [
        { url: 'https://nature.com/one', title: 'Kinase paper on sodium channels', snippet: 'alpha beta gamma delta epsilon zeta' },
        { url: 'https://nature.com/two', title: 'City council approves a park', snippet: 'one two three four five six' },
      ],
    },
  })
  check('same domain with different text stays two clusters', sameDomain.claims[0].clusterCount === 2, JSON.stringify(sameDomain.claims[0].clusters))

  const titled = buildCollapseViz({
    claims: [verifiable('c1', 'The FDA approved Zircomab in 2019.')],
    hitsByClaimId: {
      c1: [
        { url: 'https://reuters.com/a', title: 'FDA approves Zircomab for rare anemia - Reuters', pageAge: '2019-03-01' },
        { url: 'https://nature.com/b', title: 'FDA approves Zircomab for rare anemia - Nature', pageAge: '2019-01-02' },
      ],
    },
  })
  check('similar titles collapse and the earliest date is the root', titled.claims[0].clusterCount === 1 && titled.claims[0].clusters[0].rootRule === 'earliest-observed-date')
  const root = titled.claims[0].mentions.find((mention) => mention.id === titled.claims[0].clusters[0].rootMentionId)
  check('root date is the earliest observed date', root?.observedDate === '2019-01-02' && root.domain === 'nature.com', root?.observedDate || '')

  const undated = buildCollapseViz({
    claims: [verifiable('c1', 'A shared line shows up on two pages.')],
    hitsByClaimId: {
      c1: [
        { url: 'https://healthline.com/a', title: 'Morning note', snippet: 'patients reported fewer hospital stays overall today' },
        { url: 'https://webmd.com/b', title: 'Evening note', snippet: 'patients reported fewer hospital stays overall today' },
      ],
    },
  })
  check('shared phrase clusters and an undated cluster has no root', undated.claims[0].clusterCount === 1 && undated.claims[0].clusters[0].rootMentionId === null)

  const fewDates = buildCollapseViz({
    claims: [verifiable('c1', 'Only two dates were printed.')],
    hitsByClaimId: {
      c1: [
        { url: 'https://example.com/a', title: 'Alpha report on widgets', pageAge: '2020-01-01' },
        { url: 'https://example.org/b', title: 'Beta report on widgets', pageAge: '2020-02-01' },
      ],
    },
  })
  check('histogram is omitted below three dated mentions', fewDates.claims[0].dateHistogram === null)
  check('chip uses retrieved pages and clusters', collapseChip(8, 2) === '8 pages → 2 clusters')
  check('quoted fragment prefers the window with a number', quotedFragment('The FDA approved Zircomab in 2019 for adults.').includes('2019'))

  const html = `<html><head><meta property="article:published_time" content="2024-03-01T15:00:00Z"></head><body>The body says 1999-01-01 and should not win.</body></html>`
  check('date-meta reads article:published_time', extractPublishedDate(html) === '2024-03-01')
  const jsonld = `<script type="application/ld+json">{"@graph":[{"datePublished":"2021-05-09"}]}</script>`
  check('date-meta reads JSON-LD datePublished', extractPublishedDate(jsonld) === '2021-05-09')
  check('private addresses are not fetched', !isPublicHttpUrl('http://169.254.169.254/latest') && !isPublicHttpUrl('http://127.0.0.1/secret'))
  check('public https urls are fetchable', isPublicHttpUrl('https://www.nature.com/articles/foo'))

  const scored = resultSms({
    score: scoreFor(87.5),
    claims: [
      verifiable('a', 'one', 'SUPPORTED'),
      verifiable('b', 'two', 'SUPPORTED'),
      verifiable('c', 'three', 'SUPPORTED'),
      verifiable('d', 'four', 'INSUFFICIENT_EVIDENCE'),
    ],
    url: 'https://reports.example/r/abc',
    truncated: false,
    degraded: false,
  })
  check(
    'scored SMS matches the v0.1 example shape',
    scored === 'GREX evidence 88/100 (Strong evidence). 3 of 4 claims have public support; 1 doesn\'t have enough to judge. https://reports.example/r/abc',
    scored
  )
  const emptyScore = resultSms({
    score: scoreFor(v0Score(countClaims([opinion('o', 'Nice view.')]))),
    claims: [opinion('o', 'Nice view.')],
    url: 'https://reports.example/r/abc',
    truncated: false,
    degraded: false,
  })
  check('no-score SMS does not invent a number', emptyScore.startsWith('GREX found nothing factual to check') && !/\d\/100/.test(emptyScore), emptyScore)
  const banned = /\b(true|false|fake|real|lie|misinformation|valid)\b/i
  const copyBlob = JSON.stringify(MMS_COPY) + scored + emptyScore
  check('SMS and page copy stay on evidence strength', !banned.test(copyBlob))

  const sanitized = sanitizeVerification(
    {
      content_label: 'Screenshot',
      summary: 'Checked.',
      truncated: false,
      claims: Array.from({ length: 9 }, (_, i) => ({
        text: `Claim ${i}`,
        verifiability: 'OPINION',
        verdict: 'NOT_EVALUATED',
        confidence: 0,
        rationale: '',
        evidence: [],
      })),
    },
    { id: 't', surface: 'mms', submittedText: 'raw transcript', evidenceMode: 'web' }
  )
  check('sanitizer caps claims and sets truncated', sanitized.claims.length === 8 && sanitized.truncated === true)

  const parsed = parseTranscript('prefix {"legible": true, "transcript": "The FDA approved Zircomab in 2019 for adults."}')
  check('ocr parser accepts a JSON object', parsed?.legible === true && (parsed.transcript.length ?? 0) > 40)

  const config = baseConfig
  const now = new Date('2026-09-23T12:00:00.000Z')
  const accept = decideIntake({ rows: [], now: now.getTime(), spentUsd: 0, config })
  check('first check is accepted', accept.action === 'accept')
  const capped = decideIntake({
    rows: [1, 2, 3].map((n) => row({ messageSid: `SM${n}`, status: 'complete', completedAt: now.toISOString() })),
    now: now.getTime(),
    spentUsd: 0,
    config,
  })
  check('fourth successful check is paused', capped.action === 'refuse' && capped.action === 'refuse' && capped.sms === MMS_COPY.dailyCap)
  const busy = decideIntake({
    rows: [row({ messageSid: 'SMbusy', status: 'verifying', receivedAt: now.toISOString() })],
    now: now.getTime(),
    spentUsd: 0,
    config,
  })
  check('in-flight image is dropped', busy.action === 'refuse' && busy.sms === MMS_COPY.inFlight)
  const ceiling = decideIntake({ rows: [], now: now.getTime(), spentUsd: 25, config })
  check('global ceiling pauses new checks', ceiling.action === 'refuse' && ceiling.sms === MMS_COPY.ceiling)
  check('STOP HELP START are recognized', keywordOf(' stop ') === 'stop' && keywordOf('HELP') === 'help' && keywordOf('START') === 'start')
  check(
    'mid-status waits until transcription has finished',
    !shouldSendMidStatus({ status: 'transcribing', elapsedMs: 90_000, thresholdMs: 45_000, midAlreadySent: false, terminalAlreadySent: false }) &&
      shouldSendMidStatus({ status: 'verifying', elapsedMs: 45_000, thresholdMs: 45_000, midAlreadySent: false, terminalAlreadySent: false }) &&
      !shouldSendMidStatus({ status: 'verifying', elapsedMs: 10_000, thresholdMs: 45_000, midAlreadySent: false, terminalAlreadySent: false })
  )

  const fixture = buildFixtureReport('a'.repeat(32))
  const funnel = fixture.collapse.claims[0]
  check('fixture chip is 8 pages to 2 clusters', funnel.retrievedCount === 8 && funnel.clusterCount === 2, `${funnel.retrievedCount} ${funnel.clusterCount}`)
  check('fixture has an undated cluster', funnel.clusters.some((cluster) => cluster.rootMentionId === null))
  check('fixture single-page claim has one mention', fixture.collapse.claims[1].retrievedCount === 1)
  check('fixture empty search stays empty', fixture.collapse.claims[2].retrievedCount === 0)
  check('fixture omits submitted text', fixture.submittedText === '')
  check(
    'fixture score comes from v0.1',
    fixture.score.value === 67 && fixture.score.label === 'Moderate evidence',
    `${fixture.score.value} ${fixture.score.label}`
  )
  check('fixture has no phone number', !JSON.stringify(fixture).includes('+1'))
  const before = fixture.score.value
  check('collapse data does not carry a score', !('score' in fixture.collapse) && before === fixture.score.value)

  const dir = await mkdtemp(path.join(tmpdir(), 'grex-mms-'))
  try {
    const store = createFileStore(dir)
    const sms: string[] = []
    const jobs: InboundJob[] = []
    const deps = (extra?: Partial<WebhookDeps>): WebhookDeps => ({
      config,
      store,
      now: () => now,
      sendSms: async (_to, body) => {
        sms.push(body)
      },
      defer: (task) => {
        void task
      },
      startJob: async (job) => {
        jobs.push(job)
      },
      ...extra,
    })

    const textRes = await handleTwilioWebhook(formRequest({ From: '+15551212000', Body: 'hello', MessageSid: 'SMTEXT1', NumMedia: '0' }), deps())
    check('text-only webhook returns 200 without a job', textRes.status === 200 && jobs.length === 0 && sms.at(-1) === MMS_COPY.textOnly)

    const image = await handleTwilioWebhook(
      formRequest({
        From: '+15551212001',
        Body: 'caption',
        MessageSid: 'SMimage1',
        NumMedia: '1',
        MediaUrl0: 'https://api.twilio.com/media/1',
        MediaContentType0: 'image/jpeg',
      }),
      deps()
    )
    check('image webhook acks and enqueues once', image.status === 200 && sms.at(-1) === MMS_COPY.ack && jobs.length === 1)
    const again = await handleTwilioWebhook(
      formRequest({
        From: '+15551212001',
        Body: 'caption',
        MessageSid: 'SMimage1',
        NumMedia: '1',
        MediaUrl0: 'https://api.twilio.com/media/1',
        MediaContentType0: 'image/jpeg',
      }),
      deps()
    )
    check('retry of the same MessageSid does not enqueue again', again.status === 200 && jobs.length === 1)

    const phone = '+15551212002'
    const hash = phoneHash(phone, secret)
    await store.createTransport(row({ messageSid: 'SMflight', status: 'verifying', phoneHash: hash, receivedAt: now.toISOString() }))
    await handleTwilioWebhook(
      formRequest({
        From: phone,
        MessageSid: 'SMsecond',
        NumMedia: '1',
        MediaUrl0: 'https://api.twilio.com/media/2',
        MediaContentType0: 'image/png',
      }),
      deps()
    )
    check('second image while one is in flight is dropped', sms.at(-1) === MMS_COPY.inFlight && jobs.length === 1)

    await handleTwilioWebhook(formRequest({ From: '+15551212003', Body: 'STOP', MessageSid: 'SMSTOP1', NumMedia: '0' }), deps())
    const afterStop = sms.length
    await handleTwilioWebhook(
      formRequest({
        From: '+15551212003',
        MessageSid: 'SMSTOP2',
        NumMedia: '1',
        MediaUrl0: 'https://api.twilio.com/media/3',
        MediaContentType0: 'image/jpeg',
      }),
      deps()
    )
    check('STOP is durable and a later image gets no SMS', sms.length === afterStop && (await store.getOptOut(phoneHash('+15551212003', secret))))

    const signedConfig = { ...config, skipSignature: false, twilioAuthToken: '12345', twilioAccountSid: 'AC123' }
    const bad = await handleTwilioWebhook(
      formRequest({ From: '+15551212009', Body: 'hi', MessageSid: 'SMbad', NumMedia: '0' }),
      deps({ config: signedConfig })
    )
    check('missing Twilio signature is rejected', bad.status === 403)

    const runtime = await fakeRuntime(store, config, sms)
    await store.createTransport(row({ messageSid: 'SMillegible', status: 'queued', phoneHash: 'h', receivedAt: now.toISOString() }))
    let verified = false
    await processInboundJob(
      { messageSid: 'SMillegible', fromE164: '+15551219999', mediaUrl: 'https://example.com/a.jpg', mediaType: 'image/jpeg', caption: '' },
      {
        ...runtime,
        transcribe: async () => ({ legible: false, transcript: 'blur' }),
        verify: async () => {
          verified = true
          return null
        },
      }
    )
    check('illegible image does not call the verifier', !verified && sms.at(-1) === MMS_COPY.illegible)

    await store.createTransport(row({ messageSid: 'SMok', status: 'queued', phoneHash: 'h2', receivedAt: now.toISOString() }))
    const beforeScore = scoreFor(100)
    await processInboundJob(
      { messageSid: 'SMok', fromE164: '+15551218888', mediaUrl: 'https://example.com/b.jpg', mediaType: 'image/jpeg', caption: '' },
      {
        ...runtime,
        transcribe: async () => ({ legible: true, transcript: 'The FDA approved Zircomab in 2019 for adults with rare anemia.' }),
        verify: async (transcript, reportId) => ({
          id: reportId,
          surface: 'mms',
          mode: 'live',
          contentLabel: 'Screenshot',
          submittedText: transcript,
          summary: 'Public pages support the approval.',
          claims: [verifiable(`${reportId}-c0`, 'The FDA approved Zircomab in 2019.', 'SUPPORTED')],
          score: beforeScore,
          checkedAt: now.toISOString(),
          evidenceMode: 'web',
          truncated: false,
        }),
        collapse: async (result) => buildCollapseViz({ claims: result.claims }),
      }
    )
    const stored = await store.getReport(await reportIdOf(store, 'SMok'))
    check('worker stores a public report with an empty transcript', stored?.submittedText === '' && stored.score.value === 100)
    check('final SMS carries the evidence score and link', /GREX evidence 100\/100/.test(sms.at(-1) || '') && (sms.at(-1) || '').includes('/r/'))
    check('stored report does not contain the sender number', !JSON.stringify(stored).includes('15551218888'))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }

  console.log(`\n${checks - failures}/${checks} passed`)
  if (failures > 0) process.exit(1)
}

function verifiable(id: string, text: string, verdict: 'SUPPORTED' | 'INSUFFICIENT_EVIDENCE' | 'CONTRADICTED' = 'SUPPORTED'): Claim {
  return {
    id,
    text,
    verifiability: 'VERIFIABLE',
    evaluation: { verdict, confidence: 0.5, rationale: 'Public pages were checked.', evidence: [] },
  }
}

function opinion(id: string, text: string): Claim {
  return { id, text, verifiability: 'OPINION' }
}

function formRequest(fields: Record<string, string>): Request {
  return new Request('https://reports.example/api/grex/mms/webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields),
  })
}

async function fakeRuntime(store: Awaited<ReturnType<typeof createFileStore>>, config: ReturnType<typeof mmsConfig>, sms: string[]): Promise<JobRuntime> {
  return {
    config: { ...config, midStatusMs: 60_000, jobTimeoutMs: 60_000 },
    store,
    now: () => new Date('2026-09-23T12:00:00.000Z'),
    sendSms: async (_to, body) => {
      sms.push(body)
    },
    download: async () => Buffer.from('image'),
    transcribe: async () => ({ legible: true, transcript: 'x'.repeat(40) }),
    verify: async () => null,
    collapse: async (result) => buildCollapseViz({ claims: result.claims }),
  }
}

async function reportIdOf(store: Awaited<ReturnType<typeof createFileStore>>, messageSid: string): Promise<string> {
  const transport = await store.getTransport(messageSid)
  if (!transport?.reportId) throw new Error(`missing report for ${messageSid}`)
  return transport.reportId
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
