'use client'

import { motion } from 'framer-motion'
import React from 'react'

import type { ProcessingState } from '@/lib/grex/types'

const STEPS: { state: ProcessingState; label: string }[] = [
  { state: 'EXTRACTING', label: 'Finding claims' },
  { state: 'SEARCHING', label: 'Searching evidence' },
  { state: 'EVALUATING', label: 'Weighing evidence' },
]

const ORDER: ProcessingState[] = ['PENDING', 'EXTRACTING', 'SEARCHING', 'EVALUATING', 'COMPLETE']

/** Animated pipeline stepper, driven entirely by the `state` prop. */
export function ProcessingIndicator({ state }: { state: ProcessingState }) {
  const idx = ORDER.indexOf(state)
  return (
    <div className="flex flex-col gap-2.5">
      {STEPS.map((step) => {
        const stepIdx = ORDER.indexOf(step.state)
        const done = idx > stepIdx
        const active = idx === stepIdx
        return (
          <div key={step.state} className="flex items-center gap-2.5">
            <span className="relative flex w-4 h-4 items-center justify-center">
              {active && (
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid var(--grex-accent)' }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.3, 0.9] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: done || active ? 'var(--grex-accent)' : 'var(--grex-border)',
                }}
              />
            </span>
            <span
              className="text-[13px]"
              style={{
                color: active
                  ? 'var(--grex-ink)'
                  : done
                    ? 'var(--grex-body)'
                    : 'var(--grex-muted)',
                fontWeight: active ? 600 : 400,
              }}
            >
              {step.label}
              {done && ' ✓'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** The floating-widget processing state: an animated ellipsis pill. */
export function ProcessingPill() {
  return (
    <span
      className="inline-flex items-center justify-center gap-1 select-none"
      style={{
        minWidth: 44,
        height: 44,
        padding: '0 12px',
        borderRadius: 'var(--grex-radius-pill)',
        background: 'var(--grex-surface)',
        border: '2px solid var(--grex-border)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.14)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--grex-muted)' }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  )
}
