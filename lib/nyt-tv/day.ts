const PACIFIC = 'America/Los_Angeles'

/** Calendar date in America/Los_Angeles as YYYY-MM-DD. */
export function pacificDayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PACIFIC,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

/** "Sep 29" from a YYYY-MM-DD key. The key is a calendar date, not an instant. */
export function formatDayKey(dayKey: string): string {
  const [year, month, day] = dayKey.split('-').map(Number)
  if (!year || !month || !day) return dayKey
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
