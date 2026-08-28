'use client'

import React, { useState } from 'react'
import { ChevronDown, RotateCcw, ShieldCheck } from 'lucide-react'

import { wcg } from './wcgTheme'

/**
 * Workspace regulatory floors — the floor-editing affordance from the round-2
 * feedback (the user's real floors differ by indication and agency posture).
 * Values are percentages of expected enrollment per region; they ride along
 * with every chat request and become the default hard constraint in
 * `site_footprint`, so a footprint answer can never quietly land below them.
 */

export const FLOOR_REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const

/** Default matches the engine's own default: ≥20% North America. */
export const DEFAULT_FLOORS: Record<string, number> = { 'North America': 20 }

const MAX_FLOOR_PCT = 80

export function sameFloors(a: Record<string, number>, b: Record<string, number>): boolean {
  return FLOOR_REGIONS.every((r) => (a[r] ?? 0) === (b[r] ?? 0))
}

export function RegulatoryFloorsPanel({
  floors,
  onChange,
}: {
  floors: Record<string, number>
  onChange: (next: Record<string, number>) => void
}) {
  const [open, setOpen] = useState(false)

  const active = FLOOR_REGIONS.filter((r) => (floors[r] ?? 0) > 0)
  const total = active.reduce((a, r) => a + floors[r], 0)
  const summary = active.length
    ? active.map((r) => `${short(r)} ≥ ${floors[r]}%`).join(' · ')
    : 'None set'

  const setRegion = (region: string, raw: string) => {
    const n = Math.round(Number(raw))
    const next = { ...floors }
    if (!Number.isFinite(n) || n <= 0) delete next[region]
    else next[region] = Math.min(MAX_FLOOR_PCT, n)
    onChange(next)
  }

  return (
    <div className="px-4 pb-4">
      <div className="rounded-lg border" style={{ background: wcg.surface, borderColor: wcg.border }}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="w-full flex items-center gap-2 px-2.5 py-2 text-left"
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" strokeWidth={2} style={{ color: wcg.blue }} />
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-semibold leading-snug" style={{ color: wcg.ink }}>
              Regulatory floors
            </span>
            <span className="block text-[10.5px] leading-snug truncate" style={{ color: wcg.muted }}>
              {summary}
            </span>
          </span>
          <ChevronDown
            className="w-4 h-4 shrink-0 transition-transform"
            style={{ color: wcg.muted, transform: open ? 'rotate(180deg)' : undefined }}
          />
        </button>

        {open && (
          <div className="border-t px-2.5 pb-2.5 pt-2 space-y-2" style={{ borderColor: wcg.border }}>
            <p className="text-[11px] leading-snug" style={{ color: wcg.muted }}>
              Minimum share of enrollment per region. Floors are <strong>hard constraints</strong> —
              footprint recommendations satisfy them first, then optimize on enrollment rates.
            </p>
            {FLOOR_REGIONS.map((region) => (
              <label key={region} className="flex items-center justify-between gap-2">
                <span className="text-[12px]" style={{ color: wcg.body }}>
                  {region}
                </span>
                <span className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={MAX_FLOOR_PCT}
                    step={5}
                    value={floors[region] ?? ''}
                    placeholder="—"
                    onChange={(e) => setRegion(region, e.target.value)}
                    className="w-16 rounded-md border px-2 py-1 text-right text-[12px] tabular-nums focus:outline-none"
                    style={{ background: wcg.surfaceMuted, borderColor: wcg.borderStrong, color: wcg.ink }}
                    aria-label={`${region} enrollment floor, percent`}
                  />
                  <span className="text-[11px] w-4" style={{ color: wcg.muted }}>
                    %
                  </span>
                </span>
              </label>
            ))}
            {total > 90 && (
              <p className="text-[11px] leading-snug" style={{ color: wcg.bad }}>
                Floors sum to {total}% — leaving under 10% for everywhere else is unlikely to be
                feasible.
              </p>
            )}
            <div className="flex items-center justify-between pt-0.5">
              <p className="text-[10.5px] leading-snug" style={{ color: wcg.faint }}>
                Real floors differ by indication and agency posture.
              </p>
              {!sameFloors(floors, DEFAULT_FLOORS) && (
                <button
                  onClick={() => onChange({ ...DEFAULT_FLOORS })}
                  className="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium shrink-0"
                  style={{ background: wcg.surface, borderColor: wcg.border, color: wcg.blue }}
                >
                  <RotateCcw className="w-3 h-3" /> Default
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function short(region: string): string {
  switch (region) {
    case 'North America':
      return 'NA'
    case 'Europe':
      return 'EU'
    case 'Asia-Pacific':
      return 'APAC'
    case 'Latin America':
      return 'LatAm'
    default:
      return region
  }
}
