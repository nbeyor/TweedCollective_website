import { createHmac, timingSafeEqual } from 'crypto'

/** Twilio sends E.164. Keep a leading + and the digits. */
export function normalizeE164(raw: string): string | null {
  const compact = raw.trim().replace(/[^\d+]/g, '')
  const withPlus = compact.startsWith('+') ? compact : `+${compact}`
  if (!/^\+[1-9]\d{6,14}$/.test(withPlus)) return null
  return withPlus
}

export function phoneHash(e164: string, secret: string): string {
  return createHmac('sha256', secret).update(e164).digest('hex')
}

export function twilioSignature(authToken: string, url: string, params: Record<string, string>): string {
  const keys = Object.keys(params).sort()
  let data = url
  for (const key of keys) data += key + params[key]
  return createHmac('sha1', authToken).update(data, 'utf8').digest('base64')
}

export function twilioSignatureValid(
  authToken: string,
  header: string | null,
  url: string,
  params: Record<string, string>
): boolean {
  if (!authToken || !header) return false
  const expected = twilioSignature(authToken, url, params)
  const a = Buffer.from(expected)
  const b = Buffer.from(header)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export function twilioWebhookUrl(request: Request, override?: string): string {
  if (override) return override
  const reqUrl = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
  const host = forwardedHost || request.headers.get('host') || reqUrl.host
  const proto = forwardedProto || reqUrl.protocol.replace(':', '')
  return `${proto}://${host}${reqUrl.pathname}${reqUrl.search}`
}
