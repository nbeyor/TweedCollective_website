/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when that env var is set.
 * The digest path is not public: middleware only skips Clerk when this matches.
 */
export function cronRequestAuthorized(authorizationHeader: string | null): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret) return false
  return timingSafeEqualStr(authorizationHeader ?? '', `Bearer ${secret}`)
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length)
  let out = a.length === b.length ? 0 : 1
  for (let i = 0; i < len; i++) {
    out |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return out === 0
}
