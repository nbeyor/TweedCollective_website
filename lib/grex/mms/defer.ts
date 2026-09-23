import { waitUntil } from '@vercel/functions'

/** Keep the MMS worker alive after the webhook response on Vercel. Local Node runs the promise either way. */
export function deferAfterResponse(task: Promise<unknown>): void {
  const run = task.catch((err) => {
    console.error('[grex/mms] background task failed', err instanceof Error ? err.name : 'error')
  })
  try {
    waitUntil(run)
  } catch (err) {
    console.error('[grex/mms] waitUntil unavailable', err instanceof Error ? err.message : 'error')
  }
}
