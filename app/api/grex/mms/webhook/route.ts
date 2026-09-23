import { NextRequest } from 'next/server'

import { deferAfterResponse } from '@/lib/grex/mms/defer'
import { mmsConfig } from '@/lib/grex/mms/config'
import { getStore } from '@/lib/grex/mms/store'
import { sendSms } from '@/lib/grex/mms/transport'
import { handleTwilioWebhook } from '@/lib/grex/mms/webhookHandler'
import { liveJobRuntime, processInboundJob } from '@/lib/grex/mms/worker'

export const runtime = 'nodejs'
export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Public Twilio MMS webhook. Signature-checked, returns empty TwiML immediately,
 * and continues the check after the response. Not behind Clerk.
 */
export async function POST(req: NextRequest) {
  const config = mmsConfig()
  const store = getStore()
  return handleTwilioWebhook(req, {
    config,
    store,
    now: () => new Date(),
    sendSms: (to, body) => sendSms(to, body, config),
    defer: deferAfterResponse,
    startJob: (job) => processInboundJob(job, liveJobRuntime(store, config)),
  })
}
