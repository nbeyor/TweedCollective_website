'use client'

import React, { useMemo, useState } from 'react'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData } from '../types'
import { chartTheme } from '@/lib/slideTemplates'
import { formatWeekLabel } from '../utils'

interface Props {
  data: CopilotDashboardData
}

type Mode = 'prs' | 'lines'

const TICKET_COLOR = chartTheme.dashboard.pilot
const BASELINE_COLOR = chartTheme.dashboard.baseline
const PR_COLOR = '#2563eb'
const RATIO_COLOR = '#7c3aed'
const TRANSITION_BG = 'rgba(148,163,184,0.08)'

// Rolling mean over the trailing `window` entries, skipping nulls; needs ≥2
// points to emit a value (same rule as the main productivity chart).
function rollingMean(values: (number | null)[], window: number): (number | null)[] {
  return values.map((_, i) => {
    const slice = values.slice(Math.max(0, i - window + 1), i + 1)
      .filter((v): v is number => v != null && Number.isFinite(v))
    if (slice.length < 2) return null
    return slice.reduce((s, v) => s + v, 0) / slice.length
  })
}

/**
 * Output Volume — reconciles ticket-based productivity with raw PR/commit
 * counts (e.g. Bitbucket/Qlik dashboards). Tickets/FTE-day can hold flat
 * while PR volume hits records if the same tickets are being delivered as
 * more, smaller PRs — this chart makes that visible via PRs-per-ticket.
 */
export function OutputVolumeChart({ data }: Props) {
  const [mode, setMode] = useState<Mode>('prs')
  const { weekly } = data

  const hasVolume = weekly.some(w => w.totalPRs != null)

  const transitionStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'transition')
    return idx >= 0 ? idx : 0
  }, [weekly])
  const matureStartIdx = useMemo(() => {
    const idx = weekly.findIndex(w => w.phase === 'mature')
    return idx >= 0 ? idx : weekly.length
  }, [weekly])

  // PRs per ticket, weekly + rolling
  const prsPerTicket = useMemo(
    () => weekly.map(w => (w.totalPRs != null && w.totalTickets > 0 ? w.totalPRs / w.totalTickets : null)),
    [weekly],
  )
  const prsPerTicketRolling = useMemo(
    () => rollingMean(weekly.map((w, i) => (w.lowConfidence ? null : prsPerTicket[i])), data.rollingWindow),
    [weekly, prsPerTicket, data.rollingWindow],
  )

  // Lines per FTE-day, weekly + rolling
  const linesPerFte = useMemo(
    () => weekly.map(w => (w.totalLines != null && w.teamAuthors > 0
      ? w.totalLines / (w.teamAuthors * data.config.workdaysPerWeek)
      : null)),
    [weekly, data.config.workdaysPerWeek],
  )
  const linesPerFteRolling = useMemo(
    () => rollingMean(weekly.map((w, i) => (w.lowConfidence ? null : linesPerFte[i])), data.rollingWindow),
    [weekly, linesPerFte, data.rollingWindow],
  )

  // Pre-AI baselines: mean of the weekly ratio over confident baseline weeks —
  // same mean-of-weekly convention as the headline productivity baseline.
  const baselineOf = (series: (number | null)[]) => {
    const vals = weekly
      .map((w, i) => (w.phase === 'baseline' && !w.lowConfidence ? series[i] : null))
      .filter((v): v is number => v != null)
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null
  }
  const ratioBaseline = useMemo(() => baselineOf(prsPerTicket), [weekly, prsPerTicket]) // eslint-disable-line react-hooks/exhaustive-deps
  const linesBaseline = useMemo(() => baselineOf(linesPerFte), [weekly, linesPerFte]) // eslint-disable-line react-hooks/exhaustive-deps

  const labels = weekly.map(e => formatWeekLabel(e.week))

  if (!hasVolume) return null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = []
  if (mode === 'prs') {
    datasets.push(
      {
        type: 'bar',
        label: 'PRs merged',
        data: weekly.map(e => e.totalPRs ?? null),
        backgroundColor: `${PR_COLOR}55`,
        borderColor: PR_COLOR,
        borderWidth: 0,
        yAxisID: 'y',
        order: 3,
      },
      {
        type: 'bar',
        label: 'Tickets closed',
        data: weekly.map(e => e.totalTickets),
        backgroundColor: `${TICKET_COLOR}88`,
        borderWidth: 0,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'PRs per ticket (rolling avg)',
        data: prsPerTicketRolling,
        borderColor: RATIO_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: true,
        yAxisID: 'y1',
        order: 1,
      },
    )
  } else {
    datasets.push(
      {
        type: 'line',
        label: 'Lines / FTE-day (weekly)',
        data: linesPerFte,
        borderColor: 'transparent',
        backgroundColor: weekly.map(e => (e.lowConfidence ? chartTheme.dashboard.muted : PR_COLOR)),
        pointRadius: weekly.map(e => (e.lowConfidence ? 2.5 : 4)),
        showLine: false,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Lines / FTE-day (rolling avg)',
        data: linesPerFteRolling,
        borderColor: PR_COLOR,
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: true,
        yAxisID: 'y',
        order: 1,
      },
    )
  }

  const baselineValue = mode === 'prs' ? ratioBaseline : linesBaseline
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotations: Record<string, any> = {
    transitionZone: {
      type: 'box' as const,
      xMin: transitionStartIdx - 0.5,
      xMax: matureStartIdx - 0.5,
      backgroundColor: TRANSITION_BG,
      borderWidth: 0,
    },
    rolloutStart: {
      type: 'line' as const,
      xMin: transitionStartIdx - 0.5,
      xMax: transitionStartIdx - 0.5,
      borderColor: BASELINE_COLOR,
      borderWidth: 1.5,
      borderDash: [4, 4],
    },
    matureStart: {
      type: 'line' as const,
      xMin: matureStartIdx - 0.5,
      xMax: matureStartIdx - 0.5,
      borderColor: PR_COLOR,
      borderWidth: 1.5,
      borderDash: [4, 4],
    },
  }
  if (baselineValue != null) {
    annotations.baselineAvg = {
      type: 'line' as const,
      yMin: baselineValue,
      yMax: baselineValue,
      // PRs-per-ticket baseline lives on the right axis with the rolling line.
      scaleID: mode === 'prs' ? 'y1' : 'y',
      borderColor: mode === 'prs' ? RATIO_COLOR : BASELINE_COLOR,
      borderWidth: 1.5,
      borderDash: [4, 4],
      label: {
        display: true,
        content: `Pre-AI baseline: ${mode === 'prs' ? baselineValue.toFixed(2) + ' PRs/ticket' : Math.round(baselineValue).toLocaleString() + ' lines/FTE-day'}`,
        position: 'start' as const,
        backgroundColor: 'rgba(255,255,255,0.85)',
        color: mode === 'prs' ? RATIO_COLOR : BASELINE_COLOR,
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        padding: 4,
      },
    }
  }

  const scales: Record<string, unknown> = {
    x: {
      stacked: false,
      ticks: {
        maxTicksLimit: 12,
        maxRotation: 0,
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: '#a8a29e',
      },
      grid: { display: false },
    },
    y: {
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: mode === 'prs' ? 'PRs / Tickets per week' : 'PR lines / FTE-day',
        font: { family: 'DM Sans, sans-serif', size: 11 },
        color: '#57534e',
      },
      ticks: {
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: '#a8a29e',
      },
      grid: { color: '#f5f5f4' },
    },
  }
  if (mode === 'prs') {
    scales.y1 = {
      position: 'right',
      beginAtZero: true,
      title: {
        display: true,
        text: 'PRs per ticket',
        font: { family: 'DM Sans, sans-serif', size: 11 },
        color: RATIO_COLOR,
      },
      ticks: {
        font: { family: 'JetBrains Mono, monospace', size: 10 },
        color: RATIO_COLOR,
        callback: (v: number | string) => (typeof v === 'number' ? v.toFixed(1) : v),
      },
      grid: { display: false },
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    scales,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyleWidth: 10,
          boxHeight: 6,
          font: { family: 'DM Sans, sans-serif', size: 11 },
          color: '#57534e',
        },
      },
      tooltip: {
        backgroundColor: '#1c1917',
        titleFont: { family: 'DM Sans, sans-serif', size: 12 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 11 },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const v = ctx.parsed.y
            if (v == null) return ''
            const label = ctx.dataset.label ?? ''
            if (label.includes('per ticket')) return `${label}: ${v.toFixed(2)}`
            if (label.includes('FTE-day')) return `${label}: ${Math.round(v).toLocaleString()}`
            return `${label}: ${Math.round(v)}`
          },
        },
      },
      annotation: { annotations },
    },
  }

  const toggleBtn = (active: boolean) =>
    `px-3 py-1 text-xs font-medium rounded-md transition-colors ${
      active ? 'bg-[#1c1917] text-white' : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
    }`

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-1">
        <h2 className="text-base font-semibold text-[#1c1917]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Output Volume — PRs & Code vs Tickets
        </h2>
        <div className="flex gap-1">
          <button className={toggleBtn(mode === 'prs')} onClick={() => setMode('prs')} style={{ fontFamily: 'DM Sans, sans-serif' }}>
            PR volume
          </button>
          <button className={toggleBtn(mode === 'lines')} onClick={() => setMode('lines')} style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Lines / FTE-day
          </button>
        </div>
      </div>
      <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {mode === 'prs'
          ? 'Raw PRs merged vs Jira tickets closed per week, with PRs-per-ticket (right axis). A rising ratio means the same ticket cadence is being delivered as more, smaller PRs — record PR counts with flat tickets/FTE-day is composition, not contradiction.'
          : 'Total PR lines per developer-day, weekly dots with a 4-week rolling average. Complements tickets/FTE-day: if tickets are flat but lines/FTE-day rose, each ticket carries more code.'}
      </p>
      <div style={{ height: 300 }}>
        <Chart type="bar" data={{ labels, datasets: datasets as never }} options={options as never} />
      </div>
    </div>
  )
}
