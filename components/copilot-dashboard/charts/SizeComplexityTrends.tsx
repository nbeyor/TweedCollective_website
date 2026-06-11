'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { Chart } from 'react-chartjs-2'
import type { CopilotDashboardData, SizeComplexityWeeklyEntry, SizeComplexityEntry } from '../types'
import { getBuckets } from './buckets'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin,
)

type Metric = 'productivity' | 'qaChurn' | 'tickets'
type MetricMode = 'productivity' | 'qaChurn' | 'both' | 'volume'
type Smoothing = 'rolling' | 'raw'

// Stacked-share colors run small/cheap (green) → large/expensive (red), so a
// rising red band literally reads as "the team shifted toward bigger work."
const MIX_COLORS = ['#86efac', '#fcd34d', '#fb923c', '#ef4444']

const GREEN = '#15803d'
const RED = '#dc2626'
const GREY = '#a8a29e'
const DARK = '#1c1917'
const PHASE_COLORS: Record<'baseline' | 'transition' | 'mature', string> = {
  baseline: 'rgba(148, 163, 184, 0.12)',
  transition: 'rgba(245, 158, 11, 0.10)',
  mature: 'rgba(21, 128, 61, 0.10)',
}

function rollingMean(values: (number | null)[], window: number): (number | null)[] {
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1)
    let sum = 0
    let n = 0
    for (let j = start; j <= i; j++) {
      const v = values[j]
      if (v != null && Number.isFinite(v)) {
        sum += v
        n++
      }
    }
    out.push(n === 0 ? null : sum / n)
  }
  return out
}

function formatShortDate(weekStr: string): string {
  const d = new Date(weekStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function findPhaseBoundaries(weeks: string[], baselineEnd: string, matureStart: string) {
  let baselineLastIdx = -1
  let matureFirstIdx = weeks.length
  for (let i = 0; i < weeks.length; i++) {
    if (weeks[i] < baselineEnd) baselineLastIdx = i
    if (weeks[i] >= matureStart && i < matureFirstIdx) matureFirstIdx = i
  }
  return { baselineLastIdx, matureFirstIdx }
}

function baselineFor(
  entries: SizeComplexityEntry[],
  size: string,
  complexity: string,
  metric: Metric,
): number | null {
  if (metric === 'tickets') return null
  const e = entries.find(x => x.size === size && x.complexity === complexity)
  if (!e) return null
  if (metric === 'productivity') {
    return e.baseline_productivity > 0 ? e.baseline_productivity : null
  }
  return e.baseline_qa_churn ?? null
}

interface CellChartProps {
  size: string
  complexity: string
  metric: Metric
  weekly: SizeComplexityWeeklyEntry[]
  baseline: number | null
  weeks: string[]
  phaseBoundaries: { baselineLastIdx: number; matureFirstIdx: number }
  smoothing: Smoothing
  yMax?: number
}

function CellChart({
  size,
  complexity,
  metric,
  weekly,
  baseline,
  weeks,
  phaseBoundaries,
  smoothing,
  yMax,
}: CellChartProps) {
  const bucket = useMemo(() => {
    const byWeek = new Map<string, SizeComplexityWeeklyEntry>()
    for (const row of weekly) {
      if (row.size === size && row.complexity === complexity) {
        byWeek.set(row.week, row)
      }
    }
    return weeks.map(w => byWeek.get(w) ?? null)
  }, [weekly, size, complexity, weeks])

  const rawValues = useMemo<(number | null)[]>(() => {
    return bucket.map(b => {
      if (!b) return null
      if (metric === 'productivity') {
        return b.tickets > 0 ? b.productivity : null
      }
      if (metric === 'tickets') {
        return b.tickets
      }
      return b.qaChurn
    })
  }, [bucket, metric])

  const displayValues = useMemo(() => {
    return smoothing === 'rolling' ? rollingMean(rawValues, 4) : rawValues
  }, [rawValues, smoothing])

  const lineColor = metric === 'productivity' ? GREEN : metric === 'tickets' ? '#2563eb' : RED
  const baselineLabel = baseline != null
    ? (metric === 'productivity' ? baseline.toFixed(4) : `${(baseline * 100).toFixed(1)}%`)
    : '—'

  const { baselineLastIdx, matureFirstIdx } = phaseBoundaries

  const pointBackground = bucket.map(b => b?.lowConfidence ? '#ffffff' : lineColor)
  const pointBorder = bucket.map(() => lineColor)
  const pointRadius = bucket.map(b => (b && b.tickets > 0) ? 2.5 : 0)

  const labels = weeks.map(formatShortDate)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const datasets: any[] = [
    {
      type: 'line',
      label: metric === 'productivity' ? 'Productivity' : 'QA churn rate',
      data: displayValues,
      borderColor: lineColor,
      backgroundColor: `${lineColor}22`,
      pointBackgroundColor: pointBackground,
      pointBorderColor: pointBorder,
      pointBorderWidth: 1.5,
      pointRadius,
      pointHoverRadius: 5,
      borderWidth: 2,
      tension: 0.25,
      spanGaps: true,
      fill: smoothing === 'rolling',
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotations: Record<string, any> = {}

  if (baselineLastIdx >= 0) {
    annotations.baselineBand = {
      type: 'box',
      xMin: -0.5,
      xMax: baselineLastIdx + 0.5,
      backgroundColor: PHASE_COLORS.baseline,
      borderWidth: 0,
      drawTime: 'beforeDatasetsDraw',
    }
  }
  if (matureFirstIdx < weeks.length) {
    annotations.matureBand = {
      type: 'box',
      xMin: matureFirstIdx - 0.5,
      xMax: weeks.length - 0.5,
      backgroundColor: PHASE_COLORS.mature,
      borderWidth: 0,
      drawTime: 'beforeDatasetsDraw',
    }
  }
  const transitionStart = baselineLastIdx + 0.5
  const transitionEnd = matureFirstIdx - 0.5
  if (transitionEnd > transitionStart) {
    annotations.transitionBand = {
      type: 'box',
      xMin: transitionStart,
      xMax: transitionEnd,
      backgroundColor: PHASE_COLORS.transition,
      borderWidth: 0,
      drawTime: 'beforeDatasetsDraw',
    }
  }

  if (baseline != null) {
    annotations.baselineLine = {
      type: 'line',
      yMin: baseline,
      yMax: baseline,
      borderColor: GREY,
      borderWidth: 1.25,
      borderDash: [4, 4],
      label: {
        display: true,
        content: `baseline ${baselineLabel}`,
        position: 'start',
        backgroundColor: 'rgba(255,255,255,0.85)',
        color: '#57534e',
        font: { family: 'JetBrains Mono, monospace', size: 9 },
        padding: 2,
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
          maxTicksLimit: 6,
          autoSkip: true,
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        // Shared across all four buckets in the grid so the cells are
        // visually comparable (a tall line means more, not just a tighter axis).
        max: yMax,
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
          callback: (v: number | string) => {
            if (typeof v !== 'number') return v
            if (metric === 'qaChurn') return `${(v * 100).toFixed(0)}%`
            if (metric === 'tickets') return Number.isInteger(v) ? v.toString() : ''
            return v.toFixed(3)
          },
        },
        grid: { color: 'rgba(231, 229, 228, 0.6)' },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: DARK,
        titleFont: { family: 'DM Sans, sans-serif', size: 11 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 10 },
        callbacks: {
          title: (items: { dataIndex: number }[]) => {
            const idx = items[0]?.dataIndex
            if (idx == null) return ''
            return weeks[idx]
          },
          label: (ctx: { dataIndex: number; parsed: { y: number | null } }) => {
            const idx = ctx.dataIndex
            const v = ctx.parsed.y
            const entry = bucket[idx]
            const lines: string[] = []
            if (v == null) {
              lines.push('No data')
            } else if (metric === 'tickets') {
              lines.push(`Tickets closed: ${v.toFixed(smoothing === 'rolling' ? 1 : 0)}`)
            } else if (metric === 'productivity') {
              lines.push(`Productivity: ${v.toFixed(4)}`)
              if (baseline && baseline > 0) {
                const diff = (v - baseline) / baseline * 100
                lines.push(`vs baseline: ${diff >= 0 ? '+' : ''}${diff.toFixed(0)}%`)
              }
            } else {
              lines.push(`QA churn: ${(v * 100).toFixed(1)}%`)
              if (baseline && baseline > 0) {
                const diff = (v - baseline) / baseline * 100
                lines.push(`vs baseline: ${diff >= 0 ? '+' : ''}${diff.toFixed(0)}%`)
              }
            }
            if (entry) {
              lines.push(`Tickets: ${entry.tickets} (${entry.authors} authors)`)
              if (entry.lowConfidence) lines.push('⚠ low-confidence week')
            }
            return lines
          },
        },
      },
      annotation: { annotations },
    },
  }

  return (
    <div className="rounded-lg border border-[#e7e5e4] bg-white p-3">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[11px] font-medium text-[#1c1917]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {size} lines · {complexity} files
        </p>
        {metric !== 'tickets' && (
          <p className="text-[10px] text-[#a8a29e]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            baseline {baselineLabel}
          </p>
        )}
      </div>
      <div style={{ height: 160 }}>
        <Chart
          type="line"
          data={{ labels, datasets: datasets as never }}
          options={options as never}
        />
      </div>
    </div>
  )
}

interface MetricGridProps {
  title: string
  subtitle: string
  metric: Metric
  data: CopilotDashboardData
  weeks: string[]
  phaseBoundaries: { baselineLastIdx: number; matureFirstIdx: number }
  smoothing: Smoothing
  sizes: string[]
  complexities: string[]
}

function MetricGrid({ title, subtitle, metric, data, weeks, phaseBoundaries, smoothing, sizes, complexities }: MetricGridProps) {
  // One shared y-axis ceiling for all four buckets so they're visually
  // comparable. Computed from raw weekly values (a rolling mean never exceeds
  // the raw max, so this caps both smoothing modes safely) plus each bucket's
  // baseline line, then padded 5% so the peak isn't flush to the top edge.
  const yMax = useMemo(() => {
    const weekSet = new Set(weeks)
    let max = 0
    for (const size of sizes) {
      for (const complexity of complexities) {
        const b = baselineFor(data.sizeComplexity, size, complexity, metric)
        if (b != null && Number.isFinite(b) && b > max) max = b
      }
    }
    for (const row of data.sizeComplexityWeekly) {
      if (!weekSet.has(row.week)) continue
      let v: number | null = null
      if (metric === 'productivity') v = row.tickets > 0 ? row.productivity : null
      else if (metric === 'tickets') v = row.tickets
      else v = row.qaChurn
      if (v != null && Number.isFinite(v) && v > max) max = v
    }
    if (max <= 0) return undefined
    const padded = max * 1.05
    return metric === 'qaChurn' ? Math.min(1, padded) : padded
  }, [data.sizeComplexityWeekly, data.sizeComplexity, metric, weeks, sizes, complexities])

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
      <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {title}
      </h2>
      <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {subtitle}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map(size =>
          complexities.map(complexity => (
            <CellChart
              key={`${size}|${complexity}`}
              size={size}
              complexity={complexity}
              metric={metric}
              weekly={data.sizeComplexityWeekly}
              baseline={baselineFor(data.sizeComplexity, size, complexity, metric)}
              weeks={weeks}
              phaseBoundaries={phaseBoundaries}
              smoothing={smoothing}
              yMax={yMax}
            />
          )),
        )}
      </div>
    </div>
  )
}

interface MixShareChartProps {
  data: CopilotDashboardData
  weeks: string[]
  sizes: string[]
  complexities: string[]
  phaseBoundaries: { baselineLastIdx: number; matureFirstIdx: number }
  smoothing: Smoothing
}

/**
 * 100%-stacked area of ticket share by bucket over time. This is the chart that
 * explains headline productivity moves: tickets/author-day mechanically falls
 * when the mix shifts toward larger work, so a rising "big" band (red/orange)
 * under a dipping productivity line means bigger work, not slower work.
 */
function MixShareChart({ data, weeks, sizes, complexities, phaseBoundaries, smoothing }: MixShareChartProps) {
  const { datasets, totals } = useMemo(() => {
    const counts = new Map<string, number[]>() // bucketKey -> per-week ticket count
    const buckets: { key: string; label: string }[] = []
    for (const size of sizes) {
      for (const complexity of complexities) {
        const key = `${size}|${complexity}`
        buckets.push({ key, label: `${size} lines · ${complexity} files` })
        counts.set(key, weeks.map(() => 0))
      }
    }
    const weekIdx = new Map(weeks.map((w, i) => [w, i]))
    for (const row of data.sizeComplexityWeekly) {
      const i = weekIdx.get(row.week)
      const arr = counts.get(`${row.size}|${row.complexity}`)
      if (i != null && arr) arr[i] = row.tickets
    }
    const totals = weeks.map((_, i) =>
      buckets.reduce((sum, b) => sum + (counts.get(b.key)![i] ?? 0), 0),
    )
    // Smooth the underlying counts before converting to shares so a single-week
    // spike doesn't whipsaw the bands; shares still sum to ~100 each week.
    const smoothedTotals = smoothing === 'rolling'
      ? rollingMean(totals.map(t => t), 4).map(v => v ?? 0)
      : totals
    const datasets = buckets.map((b, bi) => {
      const raw = counts.get(b.key)!
      const smoothed = smoothing === 'rolling'
        ? rollingMean(raw.map(v => v), 4).map(v => v ?? 0)
        : raw
      const color = MIX_COLORS[bi % MIX_COLORS.length]
      return {
        type: 'line' as const,
        label: b.label,
        data: smoothed.map((v, i) => (smoothedTotals[i] > 0 ? (v / smoothedTotals[i]) * 100 : 0)),
        borderColor: color,
        backgroundColor: `${color}cc`,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 1,
        tension: 0.25,
      }
    })
    return { datasets, totals }
  }, [data.sizeComplexityWeekly, weeks, sizes, complexities, smoothing])

  const { baselineLastIdx, matureFirstIdx } = phaseBoundaries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotations: Record<string, any> = {}
  if (matureFirstIdx < weeks.length) {
    annotations.matureLine = {
      type: 'line',
      xMin: matureFirstIdx - 0.5,
      xMax: matureFirstIdx - 0.5,
      borderColor: GREEN,
      borderWidth: 1,
      borderDash: [4, 4],
      label: {
        display: true,
        content: 'mature',
        position: 'start',
        backgroundColor: 'rgba(255,255,255,0.85)',
        color: '#15803d',
        font: { family: 'JetBrains Mono, monospace', size: 9 },
        padding: 2,
      },
    }
  }
  if (baselineLastIdx >= 0) {
    annotations.baselineLine = {
      type: 'line',
      xMin: baselineLastIdx + 0.5,
      xMax: baselineLastIdx + 0.5,
      borderColor: GREY,
      borderWidth: 1,
      borderDash: [4, 4],
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        ticks: { font: { family: 'JetBrains Mono, monospace', size: 9 }, color: '#a8a29e', maxTicksLimit: 10, autoSkip: true },
        grid: { display: false },
      },
      y: {
        stacked: true,
        min: 0,
        max: 100,
        ticks: {
          font: { family: 'JetBrains Mono, monospace', size: 9 },
          color: '#a8a29e',
          callback: (v: number | string) => (typeof v === 'number' ? `${v}%` : v),
        },
        grid: { color: 'rgba(231, 229, 228, 0.6)' },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { font: { family: 'DM Sans, sans-serif', size: 10 }, boxWidth: 10, boxHeight: 10, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: DARK,
        titleFont: { family: 'DM Sans, sans-serif', size: 11 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 10 },
        callbacks: {
          title: (items: { dataIndex: number }[]) => {
            const idx = items[0]?.dataIndex
            if (idx == null) return ''
            return `${weeks[idx]} · ${totals[idx]} tickets`
          },
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            `${ctx.dataset.label}: ${(ctx.parsed.y ?? 0).toFixed(0)}%`,
        },
      },
      annotation: { annotations },
    },
  }

  const labels = weeks.map(formatShortDate)

  return (
    <div className="rounded-xl border border-[#e7e5e4] bg-white p-6 mb-8 shadow-sm">
      <h2 className="text-base font-semibold text-[#1c1917] mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Where the work went — ticket mix over time
      </h2>
      <p className="text-[11px] text-[#a8a29e] mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Share of each week&apos;s closed tickets by size × complexity bucket. When the red/orange (large)
        bands swell, the team took on bigger chunks of work — which lowers tickets-per-day even at steady effort.
      </p>
      <div style={{ height: 280 }}>
        <Chart type="line" data={{ labels, datasets: datasets as never }} options={options as never} />
      </div>
    </div>
  )
}

function PhaseLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: PHASE_COLORS.baseline }} />
        Baseline (pre-AI)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: PHASE_COLORS.transition }} />
        Transition (rollout)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: PHASE_COLORS.mature }} />
        Mature (80%+ adoption)
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block w-4 border-t border-dashed" style={{ borderColor: GREY }} />
        Per-bucket pre-AI baseline
      </span>
    </div>
  )
}

export function SizeComplexityTrends() {
  const [data, setData] = useState<CopilotDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [metricMode, setMetricMode] = useState<MetricMode>('both')
  const [smoothing, setSmoothing] = useState<Smoothing>('rolling')

  useEffect(() => {
    fetch('/data/copilot-dashboard-data.json')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load data: ${r.status}`)
        return r.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const weeks = useMemo(() => {
    if (!data?.sizeComplexityWeekly) return []
    const dataRangeEnd = data.dataRange.split(' to ')[1] ?? ''
    const unique = new Set<string>()
    for (const row of data.sizeComplexityWeekly) {
      if (!dataRangeEnd || row.week <= dataRangeEnd) unique.add(row.week)
    }
    return Array.from(unique).sort()
  }, [data])

  const phaseBoundaries = useMemo(() => {
    if (!data) return { baselineLastIdx: -1, matureFirstIdx: 0 }
    return findPhaseBoundaries(weeks, data.baselineEnd, data.matureStart)
  }, [data, weeks])

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
          <p className="text-sm text-[#57534e]">Loading trends...</p>
        </div>
      </div>
    )
  }

  if (!data.sizeComplexityWeekly || data.sizeComplexityWeekly.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="text-center p-8 rounded-xl border border-amber-200 bg-white max-w-md">
          <p className="text-amber-700 font-semibold mb-2">No weekly data</p>
          <p className="text-sm text-[#57534e]">
            This dashboard was generated before weekly size × complexity tracking
            was added. Re-run <code className="font-mono text-xs">pipeline/refresh_copilot.py</code> to
            regenerate the data file.
          </p>
        </div>
      </div>
    )
  }

  const { sizes, complexities } = getBuckets(data)
  const showProductivity = metricMode === 'productivity' || metricMode === 'both'
  const showQaChurn = metricMode === 'qaChurn' || metricMode === 'both'
  const showVolume = metricMode === 'volume'

  const toggleClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
      active
        ? 'bg-[#1c1917] text-white'
        : 'bg-white text-[#57534e] border border-[#e7e5e4] hover:bg-[#f5f5f4]'
    }`

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
        <div className="mb-8">
          <Link
            href="/documents/ecs-sdlc-dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#57534e] hover:text-[#1c1917] mb-4 transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-[1.75rem] font-semibold text-[#1c1917] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Size × Complexity — Week-over-Week Trends
          </h1>
          <p className="text-sm text-[#57534e] max-w-3xl" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            How each bucket of the size × complexity heatmap evolved week by week. The dashboard's
            heatmaps show a single aggregate delta per bucket — this view lets you see trajectory:
            which buckets led, which lagged, and when.
          </p>
        </div>

        <div className="rounded-xl border border-[#e7e5e4] bg-white p-4 mb-6 shadow-sm flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#a8a29e] uppercase tracking-wider" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Metric
            </span>
            <div className="flex gap-1">
              <button
                className={toggleClass(metricMode === 'both')}
                onClick={() => setMetricMode('both')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Both
              </button>
              <button
                className={toggleClass(metricMode === 'productivity')}
                onClick={() => setMetricMode('productivity')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Productivity
              </button>
              <button
                className={toggleClass(metricMode === 'qaChurn')}
                onClick={() => setMetricMode('qaChurn')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                QA churn
              </button>
              <button
                className={toggleClass(metricMode === 'volume')}
                onClick={() => setMetricMode('volume')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Volume
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#a8a29e] uppercase tracking-wider" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Smoothing
            </span>
            <div className="flex gap-1">
              <button
                className={toggleClass(smoothing === 'rolling')}
                onClick={() => setSmoothing('rolling')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                4-wk rolling
              </button>
              <button
                className={toggleClass(smoothing === 'raw')}
                onClick={() => setSmoothing('raw')}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Raw weekly
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-[240px] flex justify-end">
            <PhaseLegend />
          </div>
        </div>

        <MixShareChart
          data={data}
          weeks={weeks}
          sizes={sizes}
          complexities={complexities}
          phaseBoundaries={phaseBoundaries}
          smoothing={smoothing}
        />

        {showVolume && (
          <MetricGrid
            title="Ticket volume over time"
            subtitle="Raw tickets closed inside each bucket, week by week. Read alongside the mix chart above: when small-bucket volume falls and large-bucket volume rises, headline productivity dips on mix alone."
            metric="tickets"
            data={data}
            weeks={weeks}
            phaseBoundaries={phaseBoundaries}
            smoothing={smoothing}
            sizes={sizes}
            complexities={complexities}
          />
        )}

        {showProductivity && (
          <MetricGrid
            title="Productivity over time"
            subtitle="Tickets per FTE-day inside each bucket, week by week. Dashed line = bucket's pre-AI baseline."
            metric="productivity"
            data={data}
            weeks={weeks}
            phaseBoundaries={phaseBoundaries}
            smoothing={smoothing}
            sizes={sizes}
            complexities={complexities}
          />
        )}

        {showQaChurn && (
          <MetricGrid
            title="QA churn over time"
            subtitle="Share of tickets that churned QA inside each bucket, week by week. Lower is better; dashed line = bucket's pre-AI baseline."
            metric="qaChurn"
            data={data}
            weeks={weeks}
            phaseBoundaries={phaseBoundaries}
            smoothing={smoothing}
            sizes={sizes}
            complexities={complexities}
          />
        )}

        <div className="rounded-xl border border-[#e7e5e4] bg-white p-5 text-[11px] text-[#57534e]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <p className="mb-1">
            <strong className="text-[#1c1917]">How to read it.</strong> The mix chart up top shows what share of
            each week&apos;s work fell into each size × complexity bucket. Below, each small cell is one bucket —
            small PRs ({sizes[0]} lines) on top, large PRs ({sizes[sizes.length - 1]}) on bottom; simple PRs
            ({complexities[0]} files) on the left, complex PRs ({complexities[complexities.length - 1]}) on the right.
          </p>
          <p className="mb-1">
            <strong className="text-[#1c1917]">Explaining a productivity dip.</strong> Headline productivity is
            tickets per author-day, so it falls whenever the mix tilts toward larger work — even at constant effort.
            If the productivity line sags while the large (red/orange) bands in the mix chart swell, the team took on
            bigger chunks of work; that&apos;s composition, not a slowdown. The <em>Volume</em> tab shows the raw
            ticket counts behind the mix.
          </p>
          <p>
            For productivity and QA, the dashed grey line is the bucket&apos;s pre-AI baseline. Hollow points mark
            low-confidence weeks (fewer than {data.minTicketsThreshold} tickets in that bucket that week); treat them
            skeptically. 4-week rolling smoothing is on by default because weekly bucket-level counts are often thin.
          </p>
        </div>
      </div>
    </div>
  )
}
