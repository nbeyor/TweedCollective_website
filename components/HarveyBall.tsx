import React from 'react'
import type { HarveyValue } from '@/data/work'

/**
 * Typographic Harvey ball — a filled circle, not a product control.
 * 0 empty · 1 quarter · 2 half · 3 three-quarter · 4 full
 */
export default function HarveyBall({
  value,
  label,
  size = 18,
}: {
  value: HarveyValue
  label?: string
  size?: number
}) {
  const fill = (value / 4) * 360
  const title =
    label ??
    (['Empty', 'Quarter', 'Half', 'Three-quarter', 'Full'][value] ?? 'Score')

  return (
    <span className="inline-flex items-center gap-2" title={title}>
      <span
        aria-hidden="true"
        className="inline-block rounded-full border border-stone/70 shrink-0"
        style={{
          width: size,
          height: size,
          background:
            value === 0
              ? 'transparent'
              : `conic-gradient(#D4AF37 0deg ${fill}deg, transparent ${fill}deg 360deg)`,
        }}
      />
      <span className="sr-only">{title}</span>
    </span>
  )
}

export function HarveyLegend() {
  const items: { value: HarveyValue; label: string }[] = [
    { value: 4, label: 'Full' },
    { value: 3, label: 'Three-quarter' },
    { value: 2, label: 'Half' },
    { value: 1, label: 'Quarter' },
    { value: 0, label: 'Empty' },
  ]

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone">
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-2">
          <HarveyBall value={item.value} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
