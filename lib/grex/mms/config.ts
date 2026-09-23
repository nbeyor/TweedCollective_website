/**
 * GREX MMS environment. Names and purposes live here so the operator page
 * and the setup notes stay in one place. Values are never written to disk
 * by this module and must not be committed.
 */

export interface MmsEnvDoc {
  name: string
  requirement: 'required' | 'optional' | 'unset'
  purpose: string
}

export const MMS_ENV_DOCS: MmsEnvDoc[] = [
  {
    name: 'TWILIO_ACCOUNT_SID',
    requirement: 'required',
    purpose: 'Twilio account SID. Used to download MMS media and send SMS.',
  },
  {
    name: 'TWILIO_AUTH_TOKEN',
    requirement: 'required',
    purpose: 'Twilio auth token. Validates X-Twilio-Signature and authenticates the REST API.',
  },
  {
    name: 'TWILIO_FROM_NUMBER',
    requirement: 'required',
    purpose: 'E.164 sender for outbound SMS. The US toll-free number once carrier registration is done.',
  },
  {
    name: 'GREX_MMS_PHONE_HMAC_SECRET',
    requirement: 'required',
    purpose: 'Server-side secret for HMAC-SHA256 of the sender phone. The raw number is not stored.',
  },
  {
    name: 'GREX_MMS_PUBLIC_BASE_URL',
    requirement: 'required',
    purpose: 'Public origin for report links, no trailing slash. Example: https://tweedcollective.ai',
  },
  {
    name: 'ANTHROPIC_API_KEY',
    requirement: 'required',
    purpose: 'Existing key. OCR, the verifier, and the collapse search all use it.',
  },
  {
    name: 'BLOB_READ_WRITE_TOKEN',
    requirement: 'optional',
    purpose: 'Vercel Blob token. When set, reports and the transport table persist there. Without it, the file store under GREX_MMS_DATA_DIR is used (local disk only).',
  },
  {
    name: 'GREX_MMS_DATA_DIR',
    requirement: 'optional',
    purpose: 'File-store directory. Defaults to .data/grex-mms. Gitignored. Not durable on Vercel.',
  },
  {
    name: 'GREX_MMS_WEBHOOK_URL',
    requirement: 'optional',
    purpose: 'Exact public webhook URL Twilio signs, if proxy reconstruction does not match. Example: https://<host>/api/grex/mms/webhook',
  },
  {
    name: 'GREX_MMS_DISPLAY_NUMBER',
    requirement: 'optional',
    purpose: 'Number shown on the unlisted help page. Falls back to TWILIO_FROM_NUMBER.',
  },
  {
    name: 'GREX_MMS_OCR_MODEL',
    requirement: 'optional',
    purpose: 'Vision model for transcription. Defaults to claude-opus-5 so it matches the verifier account. Set a smaller vision model once the id is confirmed.',
  },
  {
    name: 'GREX_EFFORT',
    requirement: 'optional',
    purpose: 'Existing verifier effort. Default medium. OCR uses low regardless.',
  },
  {
    name: 'GREX_MMS_DAILY_CEILING_USD',
    requirement: 'optional',
    purpose: 'Placeholder global daily ceiling. Default 25. This is not a Twilio or Anthropic invoice.',
  },
  {
    name: 'GREX_MMS_COST_PER_CHECK_USD',
    requirement: 'optional',
    purpose: 'Placeholder dollars counted against the ceiling when a check starts. Default 1.',
  },
  {
    name: 'GREX_MMS_MID_STATUS_MS',
    requirement: 'optional',
    purpose: 'Send the one mid-status SMS only after this many milliseconds, and only once transcription has finished and the job is still running. Default 45000.',
  },
  {
    name: 'GREX_MMS_JOB_TIMEOUT_MS',
    requirement: 'optional',
    purpose: 'Stuck-job guard. Default 300000 (5 minutes). Sends the failure SMS once. Do not lower this in production.',
  },
  {
    name: 'GREX_MMS_DATE_META',
    requirement: 'optional',
    purpose: 'Publish-date GET, one per undated cluster. On unless set to 0.',
  },
  {
    name: 'GREX_MMS_DRY_RUN',
    requirement: 'optional',
    purpose: 'Set to 1 to enable POST /api/grex/mms/dry-run. Requires GREX_MMS_DRY_RUN_SECRET of at least 16 characters.',
  },
  {
    name: 'GREX_MMS_DRY_RUN_SECRET',
    requirement: 'optional',
    purpose: 'Header x-grex-dry-run-secret. Required when dry-run is on. Not a Twilio secret.',
  },
  {
    name: 'GREX_MMS_SKIP_TWILIO_SIGNATURE',
    requirement: 'unset',
    purpose: 'Local webhook curls only. Ignored when NODE_ENV is production. Leave unset on every deployed environment.',
  },
]

export interface MmsConfig {
  twilioAccountSid: string
  twilioAuthToken: string
  twilioFromNumber: string
  phoneHmacSecret: string
  publicBaseUrl: string
  webhookUrlOverride: string
  skipSignature: boolean
  dailyCeilingUsd: number
  costPerCheckUsd: number
  midStatusMs: number
  jobTimeoutMs: number
  dateMetaEnabled: boolean
  ocrModel: string
  displayNumber: string
  dataDir: string
  dryRun: boolean
  dryRunSecret: string
  reportTtlMs: number
  transcriptTtlMs: number
  dailySuccessCap: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function num(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

export function mmsConfig(env: NodeJS.ProcessEnv = process.env): MmsConfig {
  const base =
    env.GREX_MMS_PUBLIC_BASE_URL?.replace(/\/+$/, '') ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (env.NEXT_PUBLIC_BASE_URL ? env.NEXT_PUBLIC_BASE_URL.replace(/\/+$/, '') : '')
  const from = env.TWILIO_FROM_NUMBER?.trim() || ''
  return {
    twilioAccountSid: env.TWILIO_ACCOUNT_SID?.trim() || '',
    twilioAuthToken: env.TWILIO_AUTH_TOKEN?.trim() || '',
    twilioFromNumber: from,
    phoneHmacSecret: env.GREX_MMS_PHONE_HMAC_SECRET?.trim() || '',
    publicBaseUrl: base,
    webhookUrlOverride: env.GREX_MMS_WEBHOOK_URL?.trim() || '',
    skipSignature: env.GREX_MMS_SKIP_TWILIO_SIGNATURE === '1' && env.NODE_ENV !== 'production',
    dailyCeilingUsd: num(env.GREX_MMS_DAILY_CEILING_USD, 25),
    costPerCheckUsd: num(env.GREX_MMS_COST_PER_CHECK_USD, 1),
    midStatusMs: num(env.GREX_MMS_MID_STATUS_MS, 45_000),
    jobTimeoutMs: num(env.GREX_MMS_JOB_TIMEOUT_MS, 5 * 60 * 1000),
    dateMetaEnabled: env.GREX_MMS_DATE_META !== '0',
    ocrModel: env.GREX_MMS_OCR_MODEL?.trim() || 'claude-opus-5',
    displayNumber: env.GREX_MMS_DISPLAY_NUMBER?.trim() || from,
    dataDir: env.GREX_MMS_DATA_DIR?.trim() || '',
    dryRun: env.GREX_MMS_DRY_RUN === '1',
    dryRunSecret: env.GREX_MMS_DRY_RUN_SECRET?.trim() || '',
    reportTtlMs: 30 * DAY_MS,
    transcriptTtlMs: DAY_MS,
    dailySuccessCap: 3,
  }
}

export function mmsEnvStatus(env: NodeJS.ProcessEnv = process.env): Array<MmsEnvDoc & { configured: boolean; alarm: boolean }> {
  return MMS_ENV_DOCS.map((doc) => {
    const configured = Boolean(env[doc.name]?.trim())
    return {
      ...doc,
      configured,
      alarm: doc.requirement === 'unset' ? configured : doc.requirement === 'required' ? !configured : false,
    }
  })
}
