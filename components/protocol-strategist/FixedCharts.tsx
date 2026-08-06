'use client'

import React from 'react'
import { Bar, Scatter } from 'react-chartjs-2'

import '@/components/charts/chartSetup'
import { axisScale, baseChartOptions, wcg, wcgSeries } from './wcgTheme'

// The fixed chart surface. Each analysis tool returns a `panel` descriptor
// { chart, data }; this dispatcher renders the matching pre-built chart, wired
// to the corpus data the tool retrieved. Conclusions are stated above each
// chart — the reader should not have to infer them from the axes.

export interface PanelDescriptor {
  chart: string
  data: Record<string, unknown>
}

const CARD = 'rounded-xl border p-4'
const cardStyle = { background: wcg.surface, borderColor: wcg.border }

function ChartFrame({
  title,
  conclusion,
  children,
  height = 260,
}: {
  title: string
  conclusion?: string
  children: React.ReactNode
  height?: number
}) {
  return (
    <div className={CARD} style={cardStyle}>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
        {title}
      </p>
      {conclusion && (
        <p className="text-[13px] leading-snug mb-3" style={{ color: wcg.ink }}>
          {conclusion}
        </p>
      )}
      <div style={{ height }}>{children}</div>
    </div>
  )
}

function money(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${Math.round(n / 1000)}k`
  return `$${n}`
}

// ------------------------------------------------------------ waterfall ------

function CriteriaWaterfall({ data }: { data: Record<string, unknown> }) {
  const criteria = (data.criteria as Array<Record<string, unknown>>) ?? []
  const labels = criteria.map((c) => shorten(String(c.corpus_criterion ?? c.criterion)))
  const values = criteria.map((c) => Number(c.share_of_draft_burden_pct))
  const topShare = Number(data.top_two_share_pct ?? 0)
  const lead = String(data.lead_criterion ?? 'the top criterion')

  return (
    <ChartFrame
      title="Criteria-burden waterfall"
      conclusion={`Two criteria carry ${topShare.toFixed(0)}% of the draft's screening burden — ${shorten(lead, 40)} leads.`}
      height={Math.max(220, labels.length * 30)}
    >
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: 'Share of draft screening burden (%)',
              data: values,
              backgroundColor: values.map((_, i) => (i < 2 ? wcg.bad : wcg.teal)),
              borderRadius: 3,
            },
          ],
        }}
        options={baseChartOptions({
          indexAxis: 'y' as const,
          plugins: { legend: { display: false } },
          scales: { x: axisScale('% of the draft’s criteria burden'), y: axisScale() },
        })}
      />
    </ChartFrame>
  )
}

// -------------------------------------------------- sensitivity comparison ---

function SensitivityComparison({ data }: { data: Record<string, unknown> }) {
  const scenarios = (data.scenarios as Array<Record<string, unknown>>) ?? []
  const labels = scenarios.map((s) => shorten(String(s.label), 26))
  const slips = scenarios.map((s) => Number(s.enrollment_slip_months))
  // Colour by rank: lowest slip = good, highest = bad.
  const max = Math.max(...slips, 0.001)
  const min = Math.min(...slips)
  const colors = slips.map((v) => (v >= max ? wcg.bad : v <= min ? wcg.good : wcg.warn))

  return (
    <ChartFrame
      title="Sensitivity comparison"
      conclusion="Each option is the same decision priced differently — months of enrollment slip, patients at risk, and incremental cost."
      height={210}
    >
      <Bar
        data={{
          labels,
          datasets: [
            { label: 'Enrollment slip (months)', data: slips, backgroundColor: colors, borderRadius: 3 },
          ],
        }}
        options={baseChartOptions({
          plugins: { legend: { display: false } },
          scales: { x: axisScale(), y: axisScale('months of slip') },
        })}
      />
      <div className="mt-3 space-y-1.5">
        {scenarios.map((s, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]" style={{ color: wcg.body }}>
            <span className="truncate" style={{ color: wcg.ink }}>
              {String(s.label)}
            </span>
            <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
              {Number(s.enrollment_slip_months).toFixed(1)} mo · {String(s.patients_at_risk)} pts ·{' '}
              {money(Number(s.incremental_cost_usd))}
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

// ---------------------------------------------------- comparator scatter -----

function ComparatorScatter({ data }: { data: Record<string, unknown> }) {
  const points = (data.points as Array<Record<string, unknown>>) ?? []
  const draft = (data.draft as Record<string, unknown>) ?? {}

  return (
    <ChartFrame
      title="Comparator landscape"
      conclusion="The draft (highlighted) sits among trials that carry more assessment burden than the fastest enrollers."
      height={260}
    >
      <Scatter
        data={{
          datasets: [
            {
              label: 'Comparator trials',
              data: points.map((p) => ({ x: Number(p.burden_index), y: Number(p.enrollment_velocity) })),
              backgroundColor: `${wcg.sky}bb`,
              pointRadius: 4,
            },
            {
              label: 'This draft (estimated)',
              data: [{ x: Number(draft.burden_index), y: Number(draft.enrollment_velocity) }],
              backgroundColor: wcg.bad,
              pointRadius: 8,
              pointStyle: 'rectRot',
            },
          ],
        }}
        options={baseChartOptions({
          scales: {
            x: axisScale('assessment burden index'),
            y: axisScale('enrollment velocity (pts/mo)'),
          },
        })}
      />
    </ChartFrame>
  )
}

// -------------------------------------------------------- amendment risk -----

function AmendmentRisk({ data }: { data: Record<string, unknown> }) {
  const risk = (data.brief_element_risk as Array<Record<string, unknown>>) ?? []
  const labels = risk.map((r) => String(r.element))
  const values = risk.map((r) => Number(r.pct_of_cohort_amended))

  return (
    <ChartFrame
      title="Amendment-risk view"
      conclusion="The elements least settled in the draft are the ones comparator trials most often had to amend mid-flight."
      height={Math.max(200, labels.length * 34)}
    >
      <Bar
        data={{
          labels,
          datasets: [
            { label: '% of comparator cohort amended', data: values, backgroundColor: wcg.magenta, borderRadius: 3 },
          ],
        }}
        options={baseChartOptions({
          indexAxis: 'y' as const,
          plugins: { legend: { display: false } },
          scales: { x: axisScale('% of cohort amended'), y: axisScale() },
        })}
      />
      <div className="mt-3 space-y-1">
        {risk
          .filter((r) => r.median_cost_usd)
          .map((r, i) => (
            <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]" style={{ color: wcg.body }}>
              <span style={{ color: wcg.ink }}>{String(r.element)}</span>
              <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
                {r.median_timing_months_from_fpi ? `~${r.median_timing_months_from_fpi} mo from FPI · ` : ''}
                {money(Number(r.median_cost_usd))}/amendment
              </span>
            </div>
          ))}
      </div>
    </ChartFrame>
  )
}

// ------------------------------------------------------- endpoint timeline ---

function EndpointTimeline({ data }: { data: Record<string, unknown> }) {
  const options = (data.options as Array<Record<string, unknown>>) ?? []
  const labels = options.map((o) => shorten(String(o.label), 24))
  const values = options.map((o) => Number(o.added_db_lock_days))
  const max = Math.max(...values, 0.001)
  const colors = values.map((v) => (v >= max ? wcg.bad : v === 0 ? wcg.good : wcg.warn))

  return (
    <ChartFrame
      title="Endpoint timeline impact"
      conclusion="Every added secondary endpoint pushes database lock — the question is which are worth the days."
      height={200}
    >
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Added days to database lock', data: values, backgroundColor: colors, borderRadius: 3 }],
        }}
        options={baseChartOptions({
          plugins: { legend: { display: false } },
          scales: { x: axisScale(), y: axisScale('days to DB lock') },
        })}
      />
      <div className="mt-3 space-y-1.5">
        {options.map((o, i) => (
          <div key={i} className="text-[12px]" style={{ color: wcg.body }}>
            <span style={{ color: wcg.ink }}>{String(o.label)}</span>
            <span className="ml-1" style={{ color: wcg.muted }}>
              — {String(o.tradeoff)}
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

// ---------------------------------------------------------------- dispatch ---

export function FixedChart({ panel }: { panel: PanelDescriptor }) {
  switch (panel.chart) {
    case 'criteria_waterfall':
      return <CriteriaWaterfall data={panel.data} />
    case 'sensitivity_comparison':
      return <SensitivityComparison data={panel.data} />
    case 'comparator_scatter':
      return <ComparatorScatter data={panel.data} />
    case 'amendment_risk':
      return <AmendmentRisk data={panel.data} />
    case 'endpoint_timeline':
      return <EndpointTimeline data={panel.data} />
    default:
      return null
  }
}

function shorten(s: string, n = 32): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

// Keep the palette import referenced for future series-coloured charts.
void wcgSeries
