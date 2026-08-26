'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { GrexScenario } from '@/lib/grex/scenarios'
import type { GrexSurface, ProcessingState, VerificationResult } from '@/lib/grex/types'
import { LIVE_RESULT_STORAGE_PREFIX } from './ExplanationView'

export interface VerificationRun {
  state: ProcessingState
  running: boolean
  result: VerificationResult | null
  error: string | null
  reportHref: string | null
}

const IDLE: VerificationRun = {
  state: 'PENDING',
  running: false,
  result: null,
  error: null,
  reportHref: null,
}

/**
 * One hook for all three surfaces. Canned scenarios play back their timeline
 * client-side; live runs stream SSE frames from /api/grex/verify and drive
 * the same processing states, so the UI cannot tell the difference.
 */
export function useVerification() {
  const [run, setRun] = useState<VerificationRun>(IDLE)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const abort = useRef<AbortController | null>(null)

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    abort.current?.abort()
    abort.current = null
  }, [])

  useEffect(() => clear, [clear])

  const reset = useCallback(() => {
    clear()
    setRun(IDLE)
  }, [clear])

  const runCanned = useCallback(
    (scenario: GrexScenario) => {
      clear()
      setRun({ ...IDLE, running: true, state: 'PENDING' })
      let elapsed = 250
      for (const step of scenario.timeline) {
        const t = setTimeout(() => {
          if (step.state === 'COMPLETE') {
            setRun({
              state: 'COMPLETE',
              running: false,
              result: scenario.result,
              error: null,
              reportHref: `/clients/grex/report/${scenario.id}`,
            })
          } else {
            setRun((prev) => ({ ...prev, state: step.state, running: true }))
          }
        }, elapsed)
        timers.current.push(t)
        elapsed += step.ms
      }
    },
    [clear]
  )

  const runLive = useCallback(
    async (surface: GrexSurface, content: string) => {
      clear()
      const controller = new AbortController()
      abort.current = controller
      setRun({ ...IDLE, running: true, state: 'EXTRACTING' })

      try {
        const res = await fetch('/api/grex/verify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ surface, content }),
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          let message = `Verification failed (${res.status}).`
          try {
            const data = await res.json()
            if (data?.error) message = data.error
          } catch {
            /* non-JSON error body */
          }
          setRun({ ...IDLE, error: message })
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let sawResult = false

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const frames = buffer.split('\n\n')
          buffer = frames.pop() ?? ''
          for (const frame of frames) {
            const line = frame.split('\n').find((l) => l.startsWith('data: '))
            if (!line) continue
            let payload: {
              type: string
              state?: ProcessingState
              result?: VerificationResult
              error?: string
            }
            try {
              payload = JSON.parse(line.slice(6))
            } catch {
              continue
            }
            if (payload.type === 'state' && payload.state) {
              setRun((prev) => ({ ...prev, state: payload.state!, running: true }))
            } else if (payload.type === 'result' && payload.result) {
              sawResult = true
              const result = payload.result
              try {
                sessionStorage.setItem(
                  `${LIVE_RESULT_STORAGE_PREFIX}${result.id}`,
                  JSON.stringify(result)
                )
              } catch {
                /* storage unavailable — the inline result still renders */
              }
              setRun({
                state: 'COMPLETE',
                running: false,
                result,
                error: null,
                reportHref: `/clients/grex/report/${result.id}`,
              })
            } else if (payload.type === 'error') {
              setRun({ ...IDLE, error: payload.error ?? 'Verification failed.' })
              return
            }
          }
        }
        if (!sawResult) {
          setRun((prev) =>
            prev.result ? prev : { ...IDLE, error: 'The check ended without a result. Try again.' }
          )
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setRun({ ...IDLE, error: 'Could not reach the verification service.' })
      }
    },
    [clear]
  )

  return { run, runCanned, runLive, reset }
}
