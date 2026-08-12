'use client'

import React from 'react'
import { Bar, Line } from 'react-chartjs-2'

import '@/components/charts/chartSetup'
import { FixedChart } from '@/components/protocol-strategist/FixedCharts'
import type { PanelDescriptor } from '@/components/protocol-strategist/FixedCharts'
import { axisScale, baseChartOptions, wcg } from '@/components/protocol-strategist/wcgTheme'

// The Foundry's fixed-chart surface: the six authoring analytics panels
// (funnel, power, burden, viability, regulatory, enrollment), with every
// panel name the strategist corpus engines emit delegated to the shared
// strategist chart set — one dispatcher covers both tool families.

export type { PanelDescriptor }

const CARD = 'rounded-xl border p-4'
const cardStyle = { background: wcg.surface, borderColor: wcg.border }

interface ChartProps {
  data: Record<string, unknown>
  expanded?: boolean
}

function ChartFrame({
  title,
  conclusion,
  children,
  height,
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
      {height ? <div style={{ height }}>{children}</div> : children}
    </div>
  )
}

function shorten(s: string, n = 32): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s
}

// -------------------------------------------------------- eligibility funnel -

function EligibilityFunnel({ data, expanded }: ChartProps) {
  const steps = (data.steps as Array<Record<string, unknown>>) ?? []
  const labels = steps.map((s) => shorten(String(s.step), expanded ? 52 : 30))
  const values = steps.map((s) => Number(s.remaining))
  const worstStep = String(data.most_restrictive_step ?? '')
  const worstLoss = Number(data.most_restrictive_loss_pct ?? 0)
  const colors = steps.map((s) => (String(s.step) === worstStep ? wcg.bad : wcg.blue))

  return (
    <ChartFrame
      title="Eligibility funnel"
      conclusion={`${Number(data.eligible_pool ?? 0).toLocaleString()} eligible, ${Number(
        data.reachable_pool ?? 0
      ).toLocaleString()} realistically reachable — the sharpest cut is ${shorten(worstStep, 44)} (−${worstLoss.toFixed(0)}%).`}
      height={Math.max(expanded ? 420 : 240, labels.length * (expanded ? 40 : 27))}
    >
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Patients remaining', data: values, backgroundColor: colors, borderRadius: 3 }],
        }}
        options={baseChartOptions({
          indexAxis: 'y' as const,
          plugins: { legend: { display: false } },
          scales: { x: axisScale('patients remaining (US, annual)'), y: axisScale() },
        })}
      />
    </ChartFrame>
  )
}

// --------------------------------------------------------------- power curve -

function PowerCurve({ data, expanded }: ChartProps) {
  const design = (data.design as Record<string, unknown>) ?? {}
  const curve = (data.power_curve_at_planned_events as Array<Record<string, unknown>>) ?? []
  const labels = curve.map((p) => Number(p.hr).toFixed(2))
  const values = curve.map((p) => Number(p.power_pct))

  return (
    <ChartFrame
      title={`Power — ${String(data.endpoint ?? 'PFS')}`}
      conclusion={`HR ${design.target_hazard_ratio} at ${design.power_pct}% power needs ${design.required_events} events → ${design.randomized_n_required} randomized at ${design.dropout_rate_pct}% dropout (planned N=${design.planned_n}).`}
      height={expanded ? 380 : 220}
    >
      <Line
        data={{
          labels,
          datasets: [
            {
              label: `Power at ${design.required_events} events (%)`,
              data: values,
              borderColor: wcg.teal,
              backgroundColor: `${wcg.teal}33`,
              pointBackgroundColor: wcg.teal,
              pointRadius: 4,
              fill: true,
              tension: 0.3,
            },
          ],
        }}
        options={baseChartOptions({
          plugins: { legend: { display: false } },
          scales: {
            x: axisScale('true hazard ratio'),
            y: { ...axisScale('power (%)'), min: 0, max: 100 },
          },
        })}
      />
    </ChartFrame>
  )
}

// ----------------------------------------------------------- burden by visit -

function BurdenByVisit({ data, expanded }: ChartProps) {
  const visits = (data.visits as Array<Record<string, unknown>>) ?? []
  const labels = visits.map((v) => String(v.code))
  const values = visits.map((v) => Number(v.patient_burden_points))
  const heaviest = (data.heaviest_visit as Record<string, unknown>) ?? {}
  const colors = visits.map((v) => (v.code === heaviest.code ? wcg.bad : wcg.teal))
  const bench = (data.phase3_oncology_benchmark_range as number[]) ?? []

  return (
    <ChartFrame
      title="Patient burden by visit"
      conclusion={`Total ${data.total_patient_burden_points} burden points (benchmark band ${bench.join('–')}). Heaviest: ${heaviest.visit} at ${heaviest.patient_burden_points} points.`}
      height={expanded ? 360 : 210}
    >
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Patient burden points', data: values, backgroundColor: colors, borderRadius: 3 }],
        }}
        options={baseChartOptions({
          plugins: { legend: { display: false } },
          scales: { x: axisScale('visit'), y: axisScale('burden points') },
        })}
      />
      {Array.isArray(heaviest.heavy_procedures) && heaviest.heavy_procedures.length > 0 && (
        <p className="mt-3 text-[12px] leading-snug" style={{ color: wcg.body }}>
          <span style={{ color: wcg.bad }}>▲ {String(heaviest.code)}</span> stacks:{' '}
          {(heaviest.heavy_procedures as string[]).join(' · ')}
        </p>
      )}
    </ChartFrame>
  )
}

// --------------------------------------------------------- country viability -

const RISK_COLOR: Record<string, string> = { low: wcg.teal, medium: wcg.amber, high: wcg.bad }

function CountryViability({ data, expanded }: ChartProps) {
  const rows = (data.planned_countries as Array<Record<string, unknown>>) ?? []
  const labels = rows.map((r) => String(r.name))
  const values = rows.map((r) => Number(r.viability_score))
  const colors = rows.map((r) => RISK_COLOR[String(r.reg_risk)] ?? wcg.blue)

  return (
    <ChartFrame
      title="Country viability"
      conclusion={`${data.total_sites} sites across ${rows.length} countries for ${data.total_planned_enrollment} planned enrollment — bar colour is regulatory risk.`}
      height={Math.max(expanded ? 340 : 200, labels.length * (expanded ? 40 : 28))}
    >
      <Bar
        data={{
          labels,
          datasets: [{ label: 'Viability score', data: values, backgroundColor: colors, borderRadius: 3 }],
        }}
        options={baseChartOptions({
          indexAxis: 'y' as const,
          plugins: { legend: { display: false } },
          scales: { x: { ...axisScale('viability score'), min: 0, max: 100 }, y: axisScale() },
        })}
      />
      <div className="mt-3 space-y-1">
        {rows.map((r, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]" style={{ color: wcg.body }}>
            <span style={{ color: wcg.ink }}>{String(r.name)}</span>
            <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
              {String(r.sites)} sites · {Number(r.enrollment_rate_pt_site_month).toFixed(2)} pt/site/mo ·{' '}
              {String(r.startup_months)} mo startup
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

// ------------------------------------------------------------- reg sweep -----

const SEV_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  blocker: { color: '#8A3520', bg: '#FDECE7', label: 'BLOCKER' },
  warning: { color: '#7A5410', bg: '#FFF7EC', label: 'WARNING' },
  info: { color: wcg.muted, bg: wcg.surfaceMuted, label: 'INFO' },
}

function RegRequirements({ data }: ChartProps) {
  const items = (data.items as Array<Record<string, unknown>>) ?? []
  const ordered = [...items].sort((a, b) => {
    const rank: Record<string, number> = { blocker: 0, warning: 1, info: 2 }
    return (rank[String(a.severity)] ?? 3) - (rank[String(b.severity)] ?? 3)
  })

  return (
    <ChartFrame
      title="Regulatory requirements"
      conclusion={`${data.blockers} blocker(s), ${data.warnings} warning(s), ${data.info} informational — scope: ${data.scope}. Critical path: ${shorten(String(data.critical_path ?? ''), 70)}.`}
    >
      <div className="space-y-1.5">
        {ordered.map((it, i) => {
          const sev = SEV_STYLE[String(it.severity)] ?? SEV_STYLE.info
          return (
            <div
              key={i}
              className="rounded-md border px-2.5 py-1.5"
              style={{ background: sev.bg, borderColor: wcg.border }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold tracking-wider shrink-0" style={{ color: sev.color }}>
                  {sev.label}
                </span>
                <span className="text-[11px] shrink-0" style={{ color: wcg.muted }}>
                  {String(it.country)} · {String(it.type)}
                </span>
                <span className="ml-auto text-[11px] tabular-nums shrink-0" style={{ color: sev.color }}>
                  {String(it.impact)}
                </span>
              </div>
              <p className="text-[12px] leading-snug mt-0.5" style={{ color: wcg.ink }}>
                {String(it.title)}
              </p>
            </div>
          )
        })}
      </div>
    </ChartFrame>
  )
}

// ---------------------------------------------------- enrollment projection --

function EnrollmentProjection({ data, expanded }: ChartProps) {
  const curves = (data.curves as Record<string, Array<Record<string, unknown>>>) ?? {}
  const scenarios = (data.scenarios as Record<string, Record<string, unknown>>) ?? {}
  const target = Number(data.target_randomized ?? 600)

  const maxMonth = Math.max(
    ...Object.values(curves).map((c) => (c.length ? Number(c[c.length - 1].month) : 0)),
    1
  )
  const labels = Array.from({ length: maxMonth }, (_, i) => String(i + 1))
  const align = (c: Array<Record<string, unknown>>) => {
    const byMonth = new Map(c.map((p) => [Number(p.month), Number(p.randomized)]))
    let last = 0
    return labels.map((m) => {
      const v = byMonth.get(Number(m))
      if (v != null) last = v
      return last
    })
  }

  const series = [
    { key: 'faster', color: wcg.teal },
    { key: 'planned', color: wcg.navy },
    { key: 'slower', color: wcg.amber },
  ].filter((s) => curves[s.key])

  return (
    <ChartFrame
      title="Enrollment projection"
      conclusion={`Planned rates reach ${target} randomized in ${scenarios.planned?.months_to_target ?? '—'} months (faster: ${scenarios.faster?.months_to_target ?? '—'}, slower: ${scenarios.slower?.months_to_target ?? '—'}).`}
      height={expanded ? 380 : 230}
    >
      <Line
        data={{
          labels,
          datasets: [
            ...series.map((s) => ({
              label: `${String(scenarios[s.key]?.label ?? s.key)}`,
              data: align(curves[s.key]),
              borderColor: s.color,
              backgroundColor: 'transparent',
              pointRadius: 0,
              borderWidth: 2,
              tension: 0.25,
            })),
            {
              label: `Target (${target})`,
              data: labels.map(() => target),
              borderColor: wcg.bad,
              backgroundColor: 'transparent',
              borderDash: [6, 4],
              pointRadius: 0,
              borderWidth: 1.5,
            },
          ],
        }}
        options={baseChartOptions({
          scales: { x: axisScale('month'), y: axisScale('cumulative randomized') },
        })}
      />
    </ChartFrame>
  )
}

// -------------------------------------------------------------- dispatcher ---

export function AuthoringFixedChart({
  panel,
  expanded = false,
}: {
  panel: PanelDescriptor
  expanded?: boolean
}) {
  switch (panel.chart) {
    case 'eligibility_funnel':
      return <EligibilityFunnel data={panel.data} expanded={expanded} />
    case 'power_curve':
      return <PowerCurve data={panel.data} expanded={expanded} />
    case 'burden_by_visit':
      return <BurdenByVisit data={panel.data} expanded={expanded} />
    case 'country_viability':
      return <CountryViability data={panel.data} expanded={expanded} />
    case 'reg_requirements':
      return <RegRequirements data={panel.data} expanded={expanded} />
    case 'enrollment_projection':
      return <EnrollmentProjection data={panel.data} expanded={expanded} />
    default:
      // Corpus-engine panels (criteria waterfall, sensitivity, cost, footprint,
      // comparator, amendment risk, endpoint timeline) render via the shared
      // strategist chart set.
      return <FixedChart panel={panel} expanded={expanded} />
  }
}
