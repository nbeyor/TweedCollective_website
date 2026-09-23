import type { MmsConfig } from './config'
import { MMS_COPY } from './copy'

export type TransportStatus =
  | 'queued'
  | 'transcribing'
  | 'verifying'
  | 'collapsing'
  | 'complete'
  | 'failed'
  | 'refused'
  | 'opted_out'

export interface TransportRow {
  messageSid: string
  phoneHash: string
  status: TransportStatus
  receivedAt: string
  completedAt: string | null
  imageDeletedAt: string | null
  reportId: string | null
  errorCode: string | null
  midStatusSentAt: string | null
  ackSentAt: string | null
  terminalSmsAt: string | null
}

const IN_FLIGHT = new Set<TransportStatus>(['queued', 'transcribing', 'verifying', 'collapsing'])

export type IntakeDecision =
  | { action: 'accept' }
  | { action: 'refuse'; reason: 'in_flight' | 'daily_cap' | 'ceiling'; sms: string }

export function isInFlight(row: TransportRow, now: number, jobTimeoutMs: number): boolean {
  if (!IN_FLIGHT.has(row.status)) return false
  return now - Date.parse(row.receivedAt) < jobTimeoutMs
}

export function decideIntake(input: {
  rows: TransportRow[]
  now: number
  spentUsd: number
  config: Pick<MmsConfig, 'dailyCeilingUsd' | 'costPerCheckUsd' | 'dailySuccessCap' | 'jobTimeoutMs'>
}): IntakeDecision {
  const { config } = input
  if (input.rows.some((row) => isInFlight(row, input.now, config.jobTimeoutMs))) {
    return { action: 'refuse', reason: 'in_flight', sms: MMS_COPY.inFlight }
  }
  const dayAgo = input.now - 24 * 60 * 60 * 1000
  const successes = input.rows.filter(
    (row) => row.status === 'complete' && row.completedAt !== null && Date.parse(row.completedAt) >= dayAgo
  ).length
  if (successes >= config.dailySuccessCap) {
    return { action: 'refuse', reason: 'daily_cap', sms: MMS_COPY.dailyCap }
  }
  if (input.spentUsd + config.costPerCheckUsd > config.dailyCeilingUsd) {
    return { action: 'refuse', reason: 'ceiling', sms: MMS_COPY.ceiling }
  }
  return { action: 'accept' }
}

/** Mid-status fires once transcription is done and the job is still open past the threshold. */
export function shouldSendMidStatus(input: {
  status: TransportStatus
  elapsedMs: number
  thresholdMs: number
  midAlreadySent: boolean
  terminalAlreadySent: boolean
}): boolean {
  if (input.midAlreadySent || input.terminalAlreadySent) return false
  if (input.elapsedMs < input.thresholdMs) return false
  return input.status === 'verifying' || input.status === 'collapsing'
}

const STOP_WORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'])
const HELP_WORDS = new Set(['HELP', 'INFO'])
const START_WORDS = new Set(['START', 'UNSTOP', 'YES'])

export function keywordOf(body: string): 'stop' | 'help' | 'start' | null {
  const word = body.trim().toUpperCase().replace(/[^A-Z]/g, '')
  if (!word) return null
  if (STOP_WORDS.has(word)) return 'stop'
  if (HELP_WORDS.has(word)) return 'help'
  if (START_WORDS.has(word)) return 'start'
  return null
}
