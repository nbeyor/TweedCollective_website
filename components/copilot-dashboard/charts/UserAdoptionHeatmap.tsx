'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { CopilotDashboardData, PerUserEntry } from '../types'
import { trimIncompleteWeeks } from '../utils'

type Granularity = 'month' | 'week'
type Scope = 'week' | 'month' | 'overall'

const SCOPE_LABEL: Record<Scope, string> = {
  week: 'last week',
  month: 'last month',
  overall: 'overall',
}

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
  productivity: number // avg tickets per present week
}

const NEUTRAL_CELL = { bg: '#f5f5f4', fg: '#a8a29e' }

// Diverging ramp for a productivity ratio centered on 1.0 (= the pre-AI team
// baseline pace, a fixed historical bar). Below baseline reads amber, at
// baseline reads neutral grey, above reads green. Kept inside the dashboard's
// existing amber+green palette.
function divergingColor(ratio: number): { bg: string; fg: string } {
  if (ratio < 0.5) return { bg: '#b45309', fg: '#ffffff' }
  if (ratio < 0.85) return { bg: '#fcd34d', fg: '#78350f' }
  if (ratio < 1.15) return { bg: '#f5f5f4', fg: '#57534e' }
  if (ratio < 1.5) return { bg: '#86efac', fg: '#14532d' }
  if (ratio < 2.0) return { bg: '#22c55e', fg: '#ffffff' }
  return { bg: '#15803d', fg: '#ffffff' }
}

const TIER_STYLE: Record<string, { label: string; color: string }> = {
  heavy: { label: 'Heavy', color: '#15803d' },
  medium: { label: 'Medium', color: '#d97706' },
  light: { label: 'Light', color: '#a8a29e' },
  none: { label: '—', color: '#d6d3d1' },
}

// Per-developer aggregate over a set of weeks (a scope window), plus team totals for
// the same window.
interface WindowRow {
  active: boolean
  present: number
  tickets: number // ticketed-PR count in the window; 0 = telemetry-only presence
  prodTickets: number // tickets in post-rollout weeks — the productivity numerator
  prodWeeks: number // post-rollout present weeks — the productivity denominator
  rawProd: number // tickets per present week (post-rollout weeks only)
}
interface WindowResult {
  rows: Record<string, WindowRow>
  teamProd: number
}

// The score shown in the chip for a developer: tickets/active-week as a % of the
// pre-AI TEAM baseline rate (100 = the average developer's pace before AI). A
// fixed historical bar, deliberately not a vs-current-teammates ratio: it
// doesn't shift with the window or roster, and it isn't a leaderboard. Null
// when there are no ticketed PRs in the window to score.
function scoreFor(row: WindowRow, baseRate: number | null): number | null {
  if (!row.active) return null
  if (row.prodTickets === 0) return null
  if (baseRate == null || baseRate <= 0) return null
  return (row.rawProd / baseRate) * 100
}

// A signed delta rendered as an arrow + magnitude, colored green up / amber down.
function DeltaBadge({ value, unit, label }: { value: number | null; unit: string; label: string }) {
  if (value == null) {
    return (
      <span className="inline-flex items-center gap-1 text-[9px] text-[#d6d3d1]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        <span className="text-[#a8a29e]">{label}</span> —
      </span>
    )
  }
  const rounded = Math.round(value)
  const up = rounded > 0
  const flat = rounded === 0
  const color = flat ? '#a8a29e' : up ? '#15803d' : '#b45309'
  const arrow = flat ? '→' : up ? '▲' : '▼'
  const sign = up ? '+' : ''
  return (
    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold whitespace-nowrap" style={{ color, fontFamily: 'DM Sans, sans-serif' }}>
      <span className="text-[#a8a29e] font-medium">{label}</span>
      {arrow} {sign}{rounded}{unit}
    </span>
  )
}

// Dependency-free sparkline: the developer's per-period value (solid) against the team
// reference (dashed). `dev`/`team` are aligned arrays; null = no data that period.
function Sparkline({ dev, team, yMax, color }: { dev: (number | null)[]; team: (number | null)[]; yMax: number; color: string }) {
  const n = dev.length
  const W = Math.max(140, n * 16)
  const H = 44
  const pad = 5
  const x = (i: number) => (n <= 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (n - 1))
  const y = (v: number) => H - pad - (Math.min(v, yMax) / yMax) * (H - 2 * pad)
  const toPoints = (arr: (number | null)[]) =>
    arr.map((v, i) => (v == null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`)).filter(Boolean).join(' ')
  const devPts = toPoints(dev)
  const teamPts = toPoints(team)
  return (
    <svg width={W} height={H} className="block">
      {teamPts && <polyline points={teamPts} fill="none" stroke="#d6d3d1" strokeWidth={1} strokeDasharray="3 2" />}
      {devPts && <polyline points={devPts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />}
      {dev.map((v, i) => (v == null ? null : <circle key={i} cx={x(i)} cy={y(v)} r={1.6} fill={color} />))}
    </svg>
  )
}

// Row label: the user's email local part (e.g. "pnagpal"), falling back to the
// stable Dev-NN alias for users the export has no email for.
function displayName(u: PerUserEntry): string {
  return u.email || u.alias
}

export function UserAdoptionHeatmap() {
  const [data, setData] = useState<CopilotDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gran, setGran] = useState<Granularity>('month')
  const [scope, setScope] = useState<Scope>('month')
  const [dept, setDept] = useState<string>('all')
  const [hover, setHover] = useState<{ alias: string; x: number; y: number } | null>(null)

  useEffect(() => {
    fetch('/data/copilot-dashboard-data.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load data: ${r.status}`)
        return r.json()
      })
      .then(d => setData(trimIncompleteWeeks(d)))
      .catch(e => setError(e.message))
  }, [])

  const allUsers = useMemo(() => data?.perUser ?? [], [data])

  // Distinct departments present in the data (from the PR export's Department
  // column, falling back to AI telemetry for telemetry-only users).
  const departments = useMemo(() => {
    const s = new Set<string>()
    for (const u of allUsers) s.add(u.department ?? 'Unknown')
    return Array.from(s).sort()
  }, [allUsers])

  // All derived metrics — grid, team references, window scores — recompute
  // against the filtered cohort, so "vs team" reads as "vs this department".
  const perUser = useMemo(
    () => (dept === 'all' ? allUsers : allUsers.filter(u => (u.department ?? 'Unknown') === dept)),
    [allUsers, dept],
  )

  // Fixed productivity yardstick: the pre-AI TEAM baseline, converted from
  // tickets/FTE-day to tickets per active week (× 5 workdays). One denominator
  // for everyone and for every window — new hires are scoreable from their
  // first week, the bar doesn't move when the roster or the measurement window
  // changes, and 100% reads as "the average developer's pre-AI pace" rather
  // than a ranking against current teammates.
  const teamBaseRate = useMemo(() => {
    if (!data) return null
    const rate = data.baseline.productivity * data.config.workdaysPerWeek
    return rate > 0 ? rate : null
  }, [data])

  // Most recent week-ending date across all developers. The scope windows anchor to
  // the data, not `Date.now()`, since the dataset can end days before "today".
  const latestWeek = useMemo(() => {
    let m = ''
    for (const u of perUser) for (const w of u.weekly) if (w.week > m) m = w.week
    return m
  }, [perUser])

  // The set of week-ending dates included in the selected scope window.
  // week → just the latest week; month → all weeks in the latest month; overall → all.
  const windowWeeks = useMemo(() => {
    if (scope === 'overall' || !latestWeek) return null // null = no restriction
    const set = new Set<string>()
    const month = latestWeek.slice(0, 7)
    for (const u of perUser)
      for (const w of u.weekly) {
        if (scope === 'week' && w.week === latestWeek) set.add(w.week)
        if (scope === 'month' && w.week.slice(0, 7) === month) set.add(w.week)
      }
    return set
  }, [perUser, scope, latestWeek])

  // The prior equivalent window, for the "vs self" momentum trend. week → the week
  // immediately before the latest; month → the calendar month before the latest month;
  // overall → no prior (momentum is undefined and the badge is hidden).
  const priorWindowWeeks = useMemo(() => {
    if (scope === 'overall' || !latestWeek) return null
    if (scope === 'week') {
      let prev = ''
      for (const u of perUser)
        for (const w of u.weekly) if (w.week < latestWeek && w.week > prev) prev = w.week
      if (!prev) return null
      return new Set<string>([prev])
    }
    // month: find the latest month strictly before the current one, then take its weeks.
    const curMonth = latestWeek.slice(0, 7)
    let prevMonth = ''
    for (const u of perUser)
      for (const w of u.weekly) {
        const m = w.week.slice(0, 7)
        if (m < curMonth && m > prevMonth) prevMonth = m
      }
    if (!prevMonth) return null
    const set = new Set<string>()
    for (const u of perUser)
      for (const w of u.weekly) if (w.week.slice(0, 7) === prevMonth) set.add(w.week)
    return set
  }, [perUser, scope, latestWeek])

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
            productivity: 0,
          })
        c.weeksPresent += 1
        c.copilotActiveWeeks += w.copilotActive
        c.tickets += w.tickets
        c.suggestions += w.suggestions
        c.acceptances += w.acceptances
      }
      for (const c of Object.values(byPeriod)) {
        c.productivity = c.weeksPresent > 0 ? c.tickets / c.weeksPresent : 0
      }
      out[u.alias] = byPeriod
    }
    return out
  }, [perUser, gran])

  // Aggregate every developer (and the team) over an arbitrary set of weeks. Both the
  // selected window and the prior window reuse this so the two stay perfectly in sync.
  const computeWindow = useMemo(() => {
    return (weeksSet: Set<string> | null): WindowResult => {
      let teamProdTickets = 0
      let teamProdWeeks = 0
      const rows: Record<string, WindowRow> = {}
      for (const u of perUser) {
        let tickets = 0
        let present = 0
        // Productivity accumulators skip baseline-phase weeks so the "Overall"
        // scope reads as "since the AI rollout vs pre-AI baseline" instead of
        // partially comparing the baseline against itself. For week/month
        // scopes (post-rollout by construction) these equal tickets/present.
        let prodTickets = 0
        let prodWeeks = 0
        for (const w of u.weekly) {
          if (weeksSet && !weeksSet.has(w.week)) continue
          if (w.tickets > 0 || w.copilotActive > 0) {
            present += 1
            tickets += w.tickets
            if (w.phase !== 'baseline') {
              prodWeeks += 1
              prodTickets += w.tickets
            }
          }
        }
        teamProdTickets += prodTickets
        teamProdWeeks += prodWeeks
        rows[u.alias] = {
          active: present > 0,
          present,
          tickets,
          prodTickets,
          prodWeeks,
          rawProd: prodWeeks > 0 ? prodTickets / prodWeeks : 0,
        }
      }
      return {
        rows,
        teamProd: teamProdWeeks > 0 ? teamProdTickets / teamProdWeeks : 0,
      }
    }
  }, [perUser])

  const currentWindow = useMemo(() => computeWindow(windowWeeks), [computeWindow, windowWeeks])
  const priorWindow = useMemo(
    () => (priorWindowWeeks ? computeWindow(priorWindowWeeks) : null),
    [computeWindow, priorWindowWeeks],
  )

  // The elevated score per developer (null when inactive or telemetry-only).
  const scoreMap = useMemo(() => {
    const out: Record<string, number | null> = {}
    for (const u of perUser) out[u.alias] = scoreFor(currentWindow.rows[u.alias], teamBaseRate)
    return out
  }, [perUser, currentWindow, teamBaseRate])

  // Rows sorted so developers active in the selected window float to the top,
  // ranked by their in-window score (unscoreable-but-active rows sort by ticket
  // count after the scored ones); window-inactive developers sink to the bottom.
  const rows = useMemo(() => {
    const copy = [...perUser]
    copy.sort((a, b) => {
      const ra = currentWindow.rows[a.alias]
      const rb = currentWindow.rows[b.alias]
      if (ra.active !== rb.active) return ra.active ? -1 : 1
      const sa = scoreMap[a.alias]
      const sb = scoreMap[b.alias]
      if ((sa == null) !== (sb == null)) return sa == null ? 1 : -1
      if (sa != null && sb != null && sa !== sb) return sb - sa
      return rb.prodTickets - ra.prodTickets
    })
    return copy
  }, [perUser, currentWindow, scoreMap])

  const activeCount = useMemo(
    () => Object.values(currentWindow.rows).filter(r => r.active).length,
    [currentWindow],
  )

  // Average ticket count per developer who shipped at least one ticketed PR in
  // the window — the headline number the score chips' "N tix" compares against.
  const avgTickets = useMemo(() => {
    const scored = Object.values(currentWindow.rows).filter(r => r.prodTickets > 0)
    if (!scored.length) return null
    return {
      avg: scored.reduce((s, r) => s + r.prodTickets, 0) / scored.length,
      n: scored.length,
    }
  }, [currentWindow])

  // Index of the first window-inactive developer in the sorted rows — the point
  // where the dotted divider is drawn to separate active from inactive.
  const firstInactiveIndex = useMemo(
    () => rows.findIndex(u => !currentWindow.rows[u.alias].active),
    [rows, currentWindow],
  )

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

  if (!allUsers.length) {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
          <Link
            href="/clients/ecs/sdlc-dashboard"
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
            href="/clients/ecs/sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-[1.75rem] font-semibold text-[#1c1917] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Per-Developer Productivity
          </h1>
          <p className="text-sm text-[#57534e] max-w-3xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            One row per developer, labeled by their <strong>email username</strong> (e.g.{' '}
            <code className="text-xs bg-[#f5f5f4] px-1 rounded">pnagpal</code>). The bold chip shows the developer&apos;s{' '}
            <strong>tickets and active weeks</strong> for the window, and their resulting <strong>pace</strong>{' '}
            (tickets ÷ active weeks) as a % of the <strong>pre-AI team baseline</strong> — a fixed historical bar
            (100% = the average developer&apos;s pace before AI), not a comparison against current teammates. The <strong>self</strong> badge compares the window vs the
            developer&apos;s own prior window. Each heatmap cell shows the ticket count per period, colored on the same
            vs-baseline scale — blank cells = no activity that period.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Scope</span>
            <button className={toggleBtn(scope === 'week')} onClick={() => setScope('week')}>Last week</button>
            <button className={toggleBtn(scope === 'month')} onClick={() => setScope('month')}>Last month</button>
            <button className={toggleBtn(scope === 'overall')} onClick={() => setScope('overall')}>Overall</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Granularity</span>
            <button className={toggleBtn(gran === 'month')} onClick={() => setGran('month')}>Monthly</button>
            <button className={toggleBtn(gran === 'week')} onClick={() => setGran('week')}>Weekly</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>Department</span>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#f5f5f4] cursor-pointer"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <option value="all">All ({allUsers.length})</option>
              {departments.map(d => (
                <option key={d} value={d}>
                  {d} ({allUsers.filter(u => (u.department ?? 'Unknown') === d).length})
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Window summary — elevates the overall score for the selected window */}
        <div className="flex flex-wrap items-stretch gap-3 mb-5">
          <div className="rounded-xl border border-[#e7e5e4] bg-white px-5 py-3 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Avg tickets / dev · {SCOPE_LABEL[scope]}
            </div>
            <div className="text-3xl font-bold text-[#1c1917] leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {avgTickets ? avgTickets.avg.toFixed(1) : '—'}
            </div>
            <div className="text-[9px] text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              across {avgTickets?.n ?? 0} devs with ticketed PRs
            </div>
          </div>
          <div className="rounded-xl border border-[#e7e5e4] bg-white px-5 py-3 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-[#a8a29e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Active {SCOPE_LABEL[scope]}
            </div>
            <div className="text-3xl font-bold text-[#1c1917] leading-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {activeCount}<span className="text-lg text-[#a8a29e] font-medium">/{perUser.length}</span>
            </div>
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
                  Dept
                </th>
                <th className="text-[10px] text-[#a8a29e] font-medium p-1 text-left" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Tier
                </th>
                <th className="text-[10px] text-[#a8a29e] font-medium p-1 text-center px-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Score
                </th>
                <th className="text-[10px] text-[#a8a29e] font-medium p-1 text-left pr-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Trend
                </th>
                {periods.map(p => (
                  <th key={p} className="text-[9px] text-[#a8a29e] font-medium p-1 text-center whitespace-nowrap">
                    {periodLabel(p, gran)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((u, i) => {
                const showDivider = i === firstInactiveIndex && firstInactiveIndex > 0
                const tier = TIER_STYLE[u.summary.intensityTier] ?? TIER_STYLE.none
                const cur = currentWindow.rows[u.alias]
                const active = cur.active
                const score = scoreMap[u.alias]
                // Active via Copilot telemetry but zero ticketed PRs in the window —
                // flagged explicitly rather than scored 0% (may be a non-developer,
                // or work that never lands in a Jira-linked PR).
                const noPrs = active && cur.prodTickets === 0
                // Shipping, but the dataset has no pre-AI baseline to score against.
                const noBase = active && cur.prodTickets > 0 && score == null
                const scoreDisplay = noPrs ? 'No PRs' : score == null ? '—' : `${Math.round(score)}%`
                const chip =
                  !active || score == null ? NEUTRAL_CELL : divergingColor(score / 100)
                // vs self: this window vs the developer's own prior window. There is
                // deliberately no vs-team badge — productivity is scored against the
                // fixed pre-AI bar, not ranked against current teammates.
                const priorRow = priorWindow?.rows[u.alias]
                let vsSelf: number | null = null
                if (active && priorRow && priorRow.active && !noPrs) {
                  vsSelf =
                    priorRow.rawProd > 0
                      ? ((cur.rawProd - priorRow.rawProd) / priorRow.rawProd) * 100
                      : null
                }
                return (
                  <React.Fragment key={u.alias}>
                  {showDivider && (
                    <tr aria-hidden>
                      <td colSpan={5 + periods.length} className="p-0">
                        <div
                          className="text-[9px] text-[#a8a29e] uppercase tracking-wider py-1"
                          style={{ borderTop: '2px dotted #d6d3d1', fontFamily: 'DM Sans, sans-serif' }}
                        >
                          No activity {SCOPE_LABEL[scope]} ({perUser.length - activeCount})
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr
                    onMouseEnter={e => {
                      const r = e.currentTarget.getBoundingClientRect()
                      setHover({ alias: u.alias, x: r.left, y: r.bottom })
                    }}
                    onMouseLeave={() => setHover(null)}
                    className="hover:bg-[#fafaf9]"
                  >
                    <td className="sticky left-0 z-10 bg-white p-1 pr-3 whitespace-nowrap align-top">
                      <div className="text-[11px] font-semibold leading-tight" style={{ color: active ? '#1c1917' : '#a8a29e' }}>
                        {displayName(u)}
                      </div>
                    </td>
                    <td
                      className="text-[10px] p-1 pr-2 whitespace-nowrap align-top"
                      style={{ color: active ? '#57534e' : '#a8a29e', fontFamily: 'DM Sans, sans-serif' }}
                    >
                      {u.department ?? '—'}
                    </td>
                    <td className="text-[10px] p-1 whitespace-nowrap align-top" style={{ color: tier.color }}>
                      {tier.label}
                    </td>
                    <td className="p-1 px-3 text-center align-middle">
                      <span
                        className={`inline-block min-w-[2.75rem] whitespace-nowrap rounded-md px-2 py-1 font-bold ${noPrs ? 'text-xs' : 'text-sm'}`}
                        style={{ backgroundColor: chip.bg, color: chip.fg, fontFamily: 'DM Sans, sans-serif' }}
                      >
                        {active && !noPrs ? (
                          <>
                            {cur.prodTickets} tix / {cur.prodWeeks} wk
                            <span className="block text-[9px] font-semibold leading-tight opacity-80">
                              {noBase ? 'no baseline' : `${cur.rawProd.toFixed(1)}/wk = ${Math.round(score ?? 0)}% of pre-AI base`}
                            </span>
                          </>
                        ) : (
                          scoreDisplay
                        )}
                      </span>
                    </td>
                    <td className="p-1 pr-3 align-middle">
                      <div className="flex flex-col gap-0.5">
                        {scope !== 'overall' && <DeltaBadge value={vsSelf} unit="%" label="self" />}
                      </div>
                    </td>
                    {periods.map(p => {
                      const cell = grid[u.alias]?.[p]
                      if (!cell) {
                        return <td key={p} className="p-0.5"><div className="w-7 h-7 rounded" style={{ backgroundColor: '#fafaf9' }} /></td>
                      }
                      // Copilot activity but no ticketed PRs this period — neutral, not 0% amber.
                      const cellNoPrs = cell.tickets === 0
                      // Cells show the ABSOLUTE ticket count; color encodes pace vs the
                      // pre-AI team baseline (grey = no baseline in dataset).
                      const ratio =
                        !cellNoPrs && teamBaseRate != null && teamBaseRate > 0
                          ? cell.productivity / teamBaseRate
                          : null
                      const { bg, fg } = cellNoPrs
                        ? NEUTRAL_CELL
                        : ratio == null
                        ? { bg: '#f5f5f4', fg: '#57534e' }
                        : divergingColor(ratio)
                      const display = cellNoPrs ? '—' : `${cell.tickets}`
                      const acceptanceRate = cell.suggestions > 0 ? Math.round((cell.acceptances / cell.suggestions) * 100) : null
                      const title =
                        `${displayName(u)} · ${periodLabel(p, gran)}\n` +
                        (cellNoPrs
                          ? 'No ticketed PRs this period (Copilot activity only)\n'
                          : `Tickets: ${cell.tickets} over ${cell.weeksPresent} wk (${cell.productivity.toFixed(2)}/wk)\n`) +
                        (ratio != null
                          ? `Pre-AI team baseline: ${(teamBaseRate ?? 0).toFixed(2)} tix/wk → ${Math.round(ratio * 100)}% of it\n`
                          : !cellNoPrs
                          ? 'No pre-AI baseline in dataset\n'
                          : '') +
                        `Copilot-active weeks: ${cell.copilotActiveWeeks}/${cell.weeksPresent}\n` +
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
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Hover sparkline: the developer's per-period trend vs the team reference */}
        {hover && (() => {
          const u = perUser.find(x => x.alias === hover.alias)
          if (!u) return null
          const devSeries = periods.map(p => {
            const cell = grid[u.alias]?.[p]
            if (!cell) return null
            if (cell.tickets === 0) return null // Copilot-only period, no productivity signal
            return cell.productivity
          })
          // Reference = the fixed pre-AI team baseline pace.
          const teamSeries = periods.map(() => teamBaseRate)
          const allVals = [...devSeries, ...teamSeries].filter((v): v is number => v != null)
          const dataMax = allVals.length ? Math.max(...allVals) : 1
          const yMax = Math.max(1, dataMax * 1.1)
          const color = '#2563eb'
          const left = Math.min(hover.x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 240)
          return (
            <div
              className="fixed z-50 pointer-events-none rounded-lg border border-[#e7e5e4] bg-white shadow-lg p-3"
              style={{ left, top: hover.y + 6 }}
            >
              <div className="text-[10px] font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {displayName(u)} · Tickets / active wk over time
              </div>
              <Sparkline dev={devSeries} team={teamSeries} yMax={yMax} color={color} />
              <div className="text-[8px] text-[#a8a29e] mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                <span style={{ color }}>■</span> developer &nbsp; <span className="text-[#d6d3d1]">┄ pre-AI team baseline</span>
              </div>
            </div>
          )
        })()}

        {/* Legend / how to read */}
        <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-base font-semibold text-[#1c1917] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            How to read this
          </h2>
          <div className="space-y-2 text-sm text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <p><strong>Productivity</strong> = the developer&apos;s tickets per active week as a % of the <em>pre-AI team baseline</em> — the team&apos;s average tickets per active developer-week from before the AI rollout (Jul–Sep 2025). The bar is fixed: it doesn&apos;t shift when the window moves or when people join, so scores are comparable across time and new hires are scoreable from their first week. 100% = the average developer&apos;s pre-AI pace, green = above that bar, amber = below. Cells show the raw ticket count, with color carrying the vs-baseline signal.</p>
            <p><strong>The score is a pace, not a raw count</strong> — everyone is scored against the same baseline denominator ({teamBaseRate ? teamBaseRate.toFixed(2) : '—'} tix/wk), but the numerator is tickets <em>per active week</em>, so a developer with 6 tickets in 1 active week (6.0/wk) outscores one with 7 tickets across 2 weeks (3.5/wk). The chip shows the tickets, the active weeks, and the resulting per-week rate so the math is visible. The <strong>Avg tickets / dev</strong> card at the top is the raw-count yardstick: how many tickets the typical developer with PRs shipped in this window.</p>
            <p><strong>Counts are small integers</strong> — in a one-week window one ticket moves the score by ~{teamBaseRate ? Math.round(100 / teamBaseRate) : 50}pp, so developers with the same ticket count tie exactly, and tickets are not size-normalized (a config tweak counts the same as a feature). Prefer the Month or Overall scope for judgments; treat Last week as a pulse check.</p>
            <p><strong>No PRs</strong> = the developer shows Copilot activity in the window but authored no Jira-linked PRs, so there is no productivity signal to score. This is common for non-developer roles with a Copilot license, and for work that never lands in a ticketed PR (untracked repos, PRs without a Jira reference) — it is not a 0% performance reading. Cells with Copilot activity but no ticketed PRs show <strong>—</strong> in neutral grey for the same reason.</p>
            <p>The bold <strong>Score</strong> chip is the developer&apos;s ticket count and % of the pre-AI team baseline for the selected window, colored on the same scale as the cells. Rows are labeled by the developer&apos;s <strong>email username</strong> (the part before the @). There is deliberately no vs-team ranking — the bar is historical, not current teammates.</p>
            <p><strong>Trend</strong> badge: <strong>self</strong> = this window vs the developer&apos;s own prior equivalent window (last month vs the month before, or last week vs the week before) — hidden on &ldquo;Overall&rdquo; since there is no prior window. It recomputes with the <strong>Scope</strong> selector. Hover a row for a <strong>sparkline</strong> of the developer&apos;s pace over time against the pre-AI baseline bar. On &ldquo;Overall&rdquo;, productivity counts only post-rollout weeks, so the score reads &ldquo;since AI vs before AI.&rdquo;</p>
            <p><strong>Tier</strong> reflects lifetime Copilot-active days (Heavy ≥30, Medium 10–29, Light &lt;10). The <strong>Scope</strong> buttons float developers active in the window to the top; developers with no activity are dimmed and sorted below the dotted line (nothing is hidden).</p>
            <p><strong>Department</strong> comes from the PR export (falling back to AI telemetry for users with no PRs). Filtering changes which developers are shown (and the avg tickets/dev card); the pre-AI baseline bar is fixed and does not change with the filter. Note that most non-Development seats show AI activity but no ticketed PRs, so their productivity reads as <strong>No PRs</strong> by design.</p>
            <p className="text-[11px] italic pt-2 border-t border-[#f5f5f4] mt-3">
              Hover any cell for the underlying tickets, Copilot-active weeks, suggestions and acceptance rate. A ticket worked by multiple developers is credited to each contributor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
