'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { GrexScenario } from '@/lib/grex/scenarios'
import type { GrexSurface, ProcessingState, VerificationResult } from '@/lib/grex/types'
import { LIVE_RESULT_STORAGE_PREFIX } from './ExplanationView'

export interface VerificationRun {
  state: ProcessingState
  running: boolean
  /** Streams in during answer_verify mode before verification starts. */
  answerText: string
  answerDone: boolean
  result: VerificationResult | null
  error: string | null
  reportHref: string | null
}

const IDLE: VerificationRun = {
  state: 'PENDING',
  running: false,
  answerText: '',
  answerDone: false,
  result: null,
  error: null,
  reportHref: null,
}

/**
 * One hook for every surface. Canned scenarios play back their timeline
 * client-side; live runs stream SSE frames from /api/grex/verify and drive
 * the same processing states. answer_verify mode additionally streams a
 * generated answer before verifying it.
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
              ...IDLE,
              state: 'COMPLETE',
              result: scenario.result,
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

  const streamRequest = useCallback(
    async (body: { surface: GrexSurface; content: string; mode?: 'verify' | 'answer_verify' }) => {
      clear()
      const controller = new AbortController()
      abort.current = controller
      setRun({ ...IDLE, running: true, state: 'EXTRACTING' })

      try {
        const res = await fetch('/api/grex/verify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
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
              text?: string
              result?: VerificationResult
              error?: string
            }
            try {
              payload = JSON.parse(line.slice(6))
            } catch {
              continue
            }
            if (payload.type === 'answer_delta' && typeof payload.text === 'string') {
              const text = payload.text
              setRun((prev) => ({ ...prev, answerText: prev.answerText + text }))
            } else if (payload.type === 'answer') {
              setRun((prev) => ({
                ...prev,
                answerText: typeof payload.text === 'string' ? payload.text : prev.answerText,
                answerDone: true,
              }))
            } else if (payload.type === 'state' && payload.state) {
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
              setRun((prev) => ({
                ...prev,
                state: 'COMPLETE',
                running: false,
                result,
                error: null,
                reportHref: `/clients/grex/report/${result.id}`,
              }))
            } else if (payload.type === 'error') {
              setRun((prev) => ({
                ...IDLE,
                answerText: prev.answerText,
                answerDone: prev.answerDone,
                error: payload.error ?? 'Verification failed.',
              }))
              return
            }
          }
        }
        if (!sawResult) {
          setRun((prev) =>
            prev.result
              ? prev
              : { ...prev, running: false, error: 'The check ended without a result. Try again.' }
          )
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setRun({ ...IDLE, error: 'Could not reach the verification service.' })
      }
    },
    [clear]
  )

  const runLive = useCallback(
    (surface: GrexSurface, content: string) => streamRequest({ surface, content }),
    [streamRequest]
  )

  /** Generate an answer to `question`, then verify the answer (mcp surface). */
  const runAnswerVerify = useCallback(
    (question: string) => streamRequest({ surface: 'mcp', content: question, mode: 'answer_verify' }),
    [streamRequest]
  )

  return { run, runCanned, runLive, runAnswerVerify, reset }
}
