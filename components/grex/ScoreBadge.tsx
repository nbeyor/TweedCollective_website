import React from 'react'

import type { Score } from '@/lib/grex/types'
import { bandVar } from '@/lib/grex/theme'

/**
 * The score artifact — GREX's ambient primitive. Three sizes:
 *  - 'pill': the floating browser-widget chip (number only)
 *  - 'panel': compact summary header (ring + label)
 *  - 'hero': explanation-page lead (large ring + band label)
 * NO_VERIFIABLE_CLAIMS renders an em dash, never a fake number.
 */
export function ScoreBadge({
  score,
  size = 'panel',
}: {
  score: Score
  size?: 'pill' | 'panel' | 'hero'
}) {
  const color = bandVar(score.band)
  const none = score.special === 'NO_VERIFIABLE_CLAIMS'
  const display = none ? '—' : String(score.value)

  if (size === 'pill') {
    return (
      <span
        className="inline-flex items-center justify-center font-semibold tabular-nums select-none"
        style={{
          minWidth: 44,
          height: 44,
          padding: '0 10px',
          borderRadius: 'var(--grex-radius-pill)',
          background: 'var(--grex-surface)',
          border: `2px solid ${color}`,
          color: none ? 'var(--grex-muted)' : 'var(--grex-ink)',
          fontFamily: 'var(--grex-font-display)',
          fontSize: 17,
          boxShadow: '0 2px 12px rgba(0,0,0,0.14)',
        }}
      >
        {display}
      </span>
    )
  }

  const dim = size === 'hero' ? 148 : 76
  const stroke = size === 'hero' ? 9 : 6
  const r = (dim - stroke) / 2
  const circumference = 2 * Math.PI * r
  const fraction = none || score.value === null ? 0 : score.value / 100

  return (
    <div className="inline-flex items-center gap-4">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="var(--grex-border)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
            style={{ transition: 'stroke-dashoffset 700ms ease' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-semibold tabular-nums"
          style={{
            color: none ? 'var(--grex-muted)' : 'var(--grex-ink)',
            fontFamily: 'var(--grex-font-display)',
            fontSize: size === 'hero' ? 44 : 24,
          }}
        >
          {display}
        </span>
      </div>
      <div>
        <p
          className="font-semibold leading-tight"
          style={{
            color: none ? 'var(--grex-muted)' : color,
            fontFamily: 'var(--grex-font-display)',
            fontSize: size === 'hero' ? 22 : 15,
          }}
        >
          {none ? 'Nothing to check' : score.label}
        </p>
        {none && (
          <p className="text-[12.5px] mt-1" style={{ color: 'var(--grex-muted)' }}>
            No factual claims found in this content.
          </p>
        )}
      </div>
    </div>
  )
}
