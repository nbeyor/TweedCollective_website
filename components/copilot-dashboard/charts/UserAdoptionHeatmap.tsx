'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { CopilotDashboardData, PerUserEntry } from '../types'

type Metric = 'adoption' | 'productivity'
type Granularity = 'month' | 'week'

const DARK = '#1c1917'

// Period key + display label for a week-ending date string (YYYY-MM-DD).
function periodKey(week: string, gran: Granularity): string {
  return gran === 'month' ? week.slice(0, 7) : week
}
function periodLabel(key: string, gran: Granularity): string {
  if (gran === 'month') {
    const d = new Date(key + '-01T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
  const d = new Date(key + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface Cell {
  weeksPresent: number
  copilotActiveWeeks: number
  tickets: number
  suggestions: number
  acceptances: number
  adoption: number // 0..1 share of present weeks Copilot-active
  productivity: number // avg tickets per present week
}

// Sequential green ramp for a 0..1 intensity. Low intensity reads cool/grey,
// high intensity reads strong green — mirrors the dashboard's existing palette.
function rampColor(intensity: number): { bg: string; fg: string } {
  if (intensity <= 0) return { bg: '#f5f5f4', fg: '#a8a29e' }
  if (intensity < 0.2) return { bg: '#dcfce7', fg: '#15803d' }
  if (intensity < 0.4) return { bg: '#86efac', fg: '#14532d' }
  if (intensity < 0.6) return { bg: '#4ade80', fg: '#14532d' }
  if (intensity < 0.8) return { bg: '#22c55e', fg: '#ffffff' }
  return { bg: '#15803d', fg: '#ffffff' }
}

const TIER_STYLE: Record<string, { label: string; color: string }> = {
  heavy: { label: 'Heavy', color: '#15803d' },
  medium: { label: 'Medium', color: '#d97706' },
  light: { label: 'Light', color: '#a8a29e' },
  none: { label: '—', color: '#d6d3d1' },
}

export function UserAdoptionHeatmap() {
  const [data, setData] = useState<CopilotDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metric, setMetric] = useState<Metric>('adoption')
  const [gran, setGran] = useState<Granularity>('month')

  useEffect(() => {
    fetch('/data/copilot-dashboard-data.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load data: ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const perUser = data?.perUser ?? []

  // Column axis: every period present across all developers, sorted.
  const periods = useMemo(() => {
    const set = new Set<string>()
    for (const u of perUser) for (const w of u.weekly) set.add(periodKey(w.week, gran))
    return Array.from(set).sort()
  }, [perUser, gran])

  // grid[alias][periodKey] -> Cell
  const grid = useMemo(() => {
    const out: Record<string, Record<string, Cell>> = {}
    for (const u of perUser) {
      const byPeriod: Record<string, Cell> = {}
      for (const w of u.weekly) {
        const k = periodKey(w.week, gran)
        const present = w.tickets > 0 || w.copilotActive > 0
        if (!present) continue
        const c =
          byPeriod[k] ??
          (byPeriod[k] = {
            weeksPresent: 0,
            copilotActiveWeeks: 0,
            tickets: 0,
            suggestions: 0,
            acceptances: 0,
            adoption: 0,
            productivity: 0,
          })
        c.weeksPresent += 1
        c.copilotActiveWeeks += w.copilotActive
        c.tickets += w.tickets
        c.suggestions += w.suggestions
        c.acceptances += w.acceptances
      }
      for (const c of Object.values(byPeriod)) {
        c.adoption = c.weeksPresent > 0 ? c.copilotActiveWeeks / c.weeksPresent : 0
        c.productivity = c.weeksPresent > 0 ? c.tickets / c.weeksPresent : 0
      }
      out[u.alias] = byPeriod
    }
    return out
  }, [perUser, gran])

  // Productivity normalizer: scale to the busiest cell so colors span the range.
  const maxProductivity = useMemo(() => {
    let m = 0
    for (const byPeriod of Object.values(grid))
      for (const c of Object.values(byPeriod)) m = Math.max(m, c.productivity)
    return m || 1
  }, [grid])

  // Rows sorted by the selected metric's summary value, descending.
  const rows = useMemo(() => {
    const copy = [...perUser]
    copy.sort((a, b) => {
      const va = metric === 'adoption' ? a.summary.adoptionPct : a.summary.matureProductivity
      const vb = metric === 'adoption' ? b.summary.adoptionPct : b.summary.matureProductivity
      return vb - va
    })
    return copy
  }, [perUser, metric])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center p-8 rounded-xl border border-red-200 bg-white max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-sm text-[#57534e]">{error}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2563eb]/30 border-t-[#2563eb] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#57534e]">Loading per-user metrics...</p>
        </div>
      </div>
    )
  }

  if (!perUser.length) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
          <Link
            href="/documents/ecs-sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-amber-800 font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Per-user data not yet generated
            </p>
            <p className="text-sm text-amber-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Re-run <code className="text-xs bg-white px-1 rounded">python pipeline/refresh_copilot.py</code> to populate the <code className="text-xs bg-white px-1 rounded">perUser</code> section of the dashboard JSON.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const metricLabel = metric === 'adoption' ? 'Copilot Adoption' : 'Productivity'

  const toggleBtn = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
      active ? 'bg-[#15803d] text-white' : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
    }`

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/documents/ecs-sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-[1.75rem] font-semibold text-[#1c1917] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Per-Developer Adoption & Productivity
          </h1>
          <p className="text-sm text-[#57534e] max-w-3xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            One row per developer, blinded to a stable alias (<code className="text-xs bg-[#f5f5f4] px-1 rounded">Dev-NN</code>).
            Each cell shows that developer&apos;s <strong>{metricLabel.toLowerCase()}</strong> for the period — greener is higher.
            Blank cells = no activity that period.
          </p>
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-3 inline-block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Identities are blinded on purpose. The alias→UUID map lives server-side only (not shipped to the browser) for drill-down if needed.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Metric</span>
            <button className={toggleBtn(metric === 'adoption')} onClick={() => setMetric('adoption')}>Adoption</button>
            <button className={toggleBtn(metric === 'productivity')} onClick={() => setMetric('productivity')}>Productivity</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Granularity</span>
            <button className={toggleBtn(gran === 'month')} onClick={() => setGran('month')}>Monthly</button>
            <button className={toggleBtn(gran === 'week')} onClick={() => setGran('week')}>Weekly</button>
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 shadow-sm mb-8 overflow-auto">
          <table className="border-collapse" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white text-left text-[10px] text-[#a8a29e] font-medium p-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Dev
                </th>
                <th className="text-[10px] text-[#a8a29e] font-medium p-1 text-left" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Tier
                </th>
                <th className="text-[10px] text-[#a8a29e] font-medium p-1 text-right pr-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {metric === 'adoption' ? 'Adopt%' : 'vs Base'}
                </th>
                {periods.map(p => (
                  <th key={p} className="text-[9px] text-[#a8a29e] font-medium p-1 text-center whitespace-nowrap">
                    {periodLabel(p, gran)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(u => {
                const tier = TIER_STYLE[u.summary.intensityTier] ?? TIER_STYLE.none
                const summaryVal =
                  metric === 'adoption' ? `${u.summary.adoptionPct.toFixed(0)}%` : u.summary.prodVsBaseline
                return (
                  <tr key={u.alias}>
                    <td className="sticky left-0 z-10 bg-white text-[11px] font-semibold text-[#1c1917] p-1 pr-3 whitespace-nowrap">
                      {u.alias}
                    </td>
                    <td className="text-[10px] p-1 whitespace-nowrap" style={{ color: tier.color }}>
                      {tier.label}
                    </td>
                    <td className="text-[10px] p-1 pr-2 text-right text-[#57534e] whitespace-nowrap">
                      {summaryVal}
                    </td>
                    {periods.map(p => {
                      const cell = grid[u.alias]?.[p]
                      if (!cell) {
                        return <td key={p} className="p-0.5"><div className="w-7 h-7 rounded" style={{ backgroundColor: '#fafaf9' }} /></td>
                      }
                      const intensity = metric === 'adoption' ? cell.adoption : cell.productivity / maxProductivity
                      const { bg, fg } = rampColor(intensity)
                      const display =
                        metric === 'adoption'
                          ? `${Math.round(cell.adoption * 100)}`
                          : cell.productivity.toFixed(1)
                      const acceptanceRate = cell.suggestions > 0 ? Math.round((cell.acceptances / cell.suggestions) * 100) : null
                      const title =
                        `${u.alias} · ${periodLabel(p, gran)}\n` +
                        `Tickets: ${cell.tickets} over ${cell.weeksPresent} wk (${cell.productivity.toFixed(2)}/wk)\n` +
                        `Copilot-active weeks: ${cell.copilotActiveWeeks}/${cell.weeksPresent} (${Math.round(cell.adoption * 100)}%)\n` +
                        `Suggestions: ${cell.suggestions} · Acceptances: ${cell.acceptances}` +
                        (acceptanceRate != null ? ` (${acceptanceRate}% accept)` : '')
                      return (
                        <td key={p} className="p-0.5">
                          <div
                            className="w-7 h-7 rounded flex items-center justify-center text-[9px] font-semibold"
                            style={{ backgroundColor: bg, color: fg }}
                            title={title}
                          >
                            {display}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend / how to read */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            How to read this
          </h2>
          <div className="space-y-2 text-sm text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <p><strong>Adoption</strong> = share of the developer&apos;s active weeks in the period where they used Copilot. <strong>Productivity</strong> = average tickets closed per active week (scaled to the busiest cell).</p>
            <p><strong>Tier</strong> reflects lifetime Copilot-active days (Heavy ≥30, Medium 10–29, Light &lt;10). <strong>{metric === 'adoption' ? 'Adopt%' : 'vs Base'}</strong> column is the mature-period summary used to rank rows.</p>
            <p className="text-[11px] italic pt-2 border-t border-[#f5f5f4] mt-3">
              Hover any cell for the underlying tickets, Copilot-active weeks, suggestions and acceptance rate. A ticket worked by multiple developers is credited to each contributor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
