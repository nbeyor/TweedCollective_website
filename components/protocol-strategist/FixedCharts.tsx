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

function CriteriaWaterfall({ data, expanded }: ChartProps) {
  const criteria = (data.criteria as Array<Record<string, unknown>>) ?? []
  const labels = criteria.map((c) => shorten(String(c.corpus_criterion ?? c.criterion), expanded ? 56 : 32))
  const values = criteria.map((c) => Number(c.share_of_draft_burden_pct))
  const topShare = Number(data.top_two_share_pct ?? 0)
  const lead = String(data.lead_criterion ?? 'the top criterion')

  return (
    <ChartFrame
      title="Criteria-burden waterfall"
      conclusion={`Two criteria carry ${topShare.toFixed(0)}% of the draft's screening burden — ${shorten(lead, 40)} leads.`}
      height={Math.max(expanded ? 420 : 220, labels.length * (expanded ? 38 : 30))}
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

function SensitivityComparison({ data, expanded }: ChartProps) {
  const scenarios = (data.scenarios as Array<Record<string, unknown>>) ?? []
  const labels = scenarios.map((s) => shorten(String(s.label), expanded ? 48 : 26))
  const slips = scenarios.map((s) => Number(s.enrollment_slip_months))
  // Colour by rank: lowest slip = good, highest = bad.
  const max = Math.max(...slips, 0.001)
  const min = Math.min(...slips)
  const colors = slips.map((v) => (v >= max ? wcg.bad : v <= min ? wcg.good : wcg.warn))

  return (
    <ChartFrame
      title="Sensitivity comparison"
      conclusion="Each option is the same decision priced differently — months of enrollment slip, patients at risk, and incremental cost."
      height={expanded ? 400 : 210}
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

function ComparatorScatter({ data, expanded }: ChartProps) {
  const points = (data.points as Array<Record<string, unknown>>) ?? []
  const draft = (data.draft as Record<string, unknown>) ?? {}
  const estimated = draft.estimated !== false
  const draftB = Number(draft.burden_index)
  const draftV = Number(draft.enrollment_velocity)
  const medB = median(points.map((p) => Number(p.burden_index)))
  const medV = median(points.map((p) => Number(p.enrollment_velocity)))
  const conclusion =
    Number.isFinite(draftB) && Number.isFinite(medB)
      ? `The ${estimated ? 'draft (estimated)' : 'loaded protocol (measured)'} sits at burden ${draftB.toFixed(1)} vs a cohort median of ${medB.toFixed(1)}, enrolling ${draftV.toFixed(1)} pts/mo vs a median of ${medV.toFixed(1)}.`
      : 'The document under review (highlighted) placed against the comparator cohort.'

  return (
    <ChartFrame
      title="Comparator landscape"
      conclusion={conclusion}
      height={expanded ? 480 : 260}
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
              label: estimated ? 'This draft (estimated)' : 'This protocol (measured)',
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

function AmendmentRisk({ data, expanded }: ChartProps) {
  const risk = (data.brief_element_risk as Array<Record<string, unknown>>) ?? []
  const labels = risk.map((r) => String(r.element))
  const values = risk.map((r) => Number(r.pct_of_cohort_amended))

  return (
    <ChartFrame
      title="Amendment-risk view"
      conclusion="The elements least settled in the draft are the ones comparator trials most often had to amend mid-flight."
      height={Math.max(expanded ? 380 : 200, labels.length * (expanded ? 56 : 34))}
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

function EndpointTimeline({ data, expanded }: ChartProps) {
  const options = (data.options as Array<Record<string, unknown>>) ?? []
  const labels = options.map((o) => shorten(String(o.label), expanded ? 44 : 24))
  const values = options.map((o) => Number(o.added_db_lock_days))
  const max = Math.max(...values, 0.001)
  const colors = values.map((v) => (v >= max ? wcg.bad : v === 0 ? wcg.good : wcg.warn))

  return (
    <ChartFrame
      title="Endpoint timeline impact"
      conclusion="Every added secondary endpoint pushes database lock — the question is which are worth the days."
      height={expanded ? 380 : 200}
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

// ------------------------------------------------------------ cost breakdown -

function CostBreakdown({ data, expanded }: ChartProps) {
  const scenarios = (data.scenarios as Array<Record<string, unknown>>) ?? []
  const labels = scenarios.map((s) => shorten(String(s.label), expanded ? 40 : 22))
  const direct = scenarios.map((s) => Number(s.direct_per_patient_usd))
  const indirect = scenarios.map((s) => Number(s.indirect_per_patient_usd))
  const headline = (data.headline as Record<string, unknown>) ?? {}
  const perPt = Number(headline.per_patient_usd)
  const total = Number(headline.total_study_cost_usd)
  const directShare = Number(headline.direct_share_pct)

  return (
    <ChartFrame
      title="Cost buildup"
      conclusion={
        Number.isFinite(perPt)
          ? `As drafted, ~${money(perPt)}/patient — ${money(total)} all-in, ${directShare.toFixed(0)}% direct. The range is the SoA you choose.`
          : 'Per-patient cost, split into direct and indirect, across three SoA intensities.'
      }
      height={expanded ? 380 : 210}
    >
      <Bar
        data={{
          labels,
          datasets: [
            { label: 'Direct / patient', data: direct, backgroundColor: wcg.teal, borderRadius: 3, stack: 'c' },
            { label: 'Indirect / patient', data: indirect, backgroundColor: wcg.sky, borderRadius: 3, stack: 'c' },
          ],
        }}
        options={baseChartOptions({
          scales: {
            x: { ...axisScale(), stacked: true },
            y: { ...axisScale('$ per patient'), stacked: true },
          },
        })}
      />
      <div className="mt-3 space-y-1.5">
        {scenarios.map((s, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]" style={{ color: wcg.body }}>
            <span className="truncate" style={{ color: wcg.ink }}>
              {String(s.label)}
            </span>
            <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
              {money(Number(s.per_patient_usd))}/pt · {money(Number(s.total_study_cost_usd))} total
            </span>
          </div>
        ))}
      </div>
    </ChartFrame>
  )
}

// --------------------------------------------------------------- footprint ---

// Equirectangular world, drawn inline so the map is self-contained — no tile
// server, no external request, safe under the page CSP. Continent silhouettes
// are coarse (recognisable, not survey-grade); country bubbles sit at real
// lat/long and are sized by expected enrollment.
const MAP_W = 640
const MAP_H = 320
const projX = (lon: number) => ((lon + 170) / 360) * MAP_W
const projY = (lat: number) => ((78 - lat) / 148) * MAP_H

const CONTINENTS: number[][][] = [
  [[-168, 66], [-150, 71], [-95, 72], [-82, 63], [-64, 60], [-56, 50], [-66, 44], [-81, 25], [-97, 16], [-106, 23], [-125, 40], [-140, 59]],
  [[-81, 8], [-60, 10], [-50, 0], [-35, -6], [-48, -25], [-58, -52], [-71, -55], [-76, -45], [-81, -20]],
  [[-10, 58], [-5, 62], [12, 60], [30, 60], [40, 53], [28, 44], [10, 40], [-8, 43]],
  [[-16, 34], [10, 37], [32, 32], [44, 12], [51, 12], [42, -12], [25, -34], [15, -30], [9, -2], [-10, 6], [-17, 20]],
  [[26, 60], [60, 66], [100, 72], [140, 72], [160, 68], [145, 53], [135, 35], [122, 30], [105, 18], [92, 20], [78, 8], [68, 24], [45, 40], [33, 50]],
  [[113, -20], [130, -12], [143, -11], [153, -26], [147, -38], [130, -32], [116, -35], [113, -25]],
]

const COUNTRY_LATLON: Record<string, [number, number]> = {
  'United States': [-98, 39], Canada: [-106, 58], Germany: [10, 51], Poland: [19, 52],
  Spain: [-4, 40], 'United Kingdom': [-2, 54], Hungary: [19, 47], Czechia: [15, 50],
  'South Korea': [128, 36], Japan: [139, 37], Australia: [134, -25], Brazil: [-51, -10],
  China: [104, 35], France: [2, 47], Italy: [12, 42], India: [79, 22], Netherlands: [5, 52],
  Sweden: [15, 62], Belgium: [4, 51], Mexico: [-102, 23], Argentina: [-64, -38], 'South Africa': [25, -29],
}

const REGION_COLOR: Record<string, string> = {
  'North America': wcg.blue,
  Europe: wcg.teal,
  'Asia-Pacific': wcg.magenta,
  'Latin America': wcg.amber,
  Other: wcg.purple,
}

function iso(country: string): string {
  const map: Record<string, string> = {
    'United States': 'US', 'United Kingdom': 'UK', 'South Korea': 'KR', Germany: 'DE',
    Poland: 'PL', Spain: 'ES', Hungary: 'HU', Czechia: 'CZ', Japan: 'JP', Australia: 'AU',
    Canada: 'CA', Brazil: 'BR',
  }
  return map[country] ?? country.slice(0, 2).toUpperCase()
}

function FootprintMap({ alloc, svgHeight }: { alloc: Array<Record<string, unknown>>; svgHeight: number }) {
  const placed = alloc
    .map((a) => ({
      country: String(a.country),
      region: String(a.region ?? 'Other'),
      subjects: Number(a.expected_subjects),
      ll: COUNTRY_LATLON[String(a.country)],
    }))
    .filter((p) => p.ll)
  const maxSub = Math.max(1, ...placed.map((p) => p.subjects))
  const r = (s: number) => 5 + Math.sqrt(s / maxSub) * 24
  // Label the largest few to avoid a cluttered European pile-up.
  const labelSet = new Set(
    [...placed].sort((a, b) => b.subjects - a.subjects).slice(0, 6).map((p) => p.country)
  )
  const regions = Array.from(new Set(placed.map((p) => p.region)))

  return (
    <div>
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height={svgHeight}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Site and country footprint map"
        style={{ display: 'block' }}
      >
        <rect x={0} y={0} width={MAP_W} height={MAP_H} fill={wcg.surfaceMuted} rx={8} />
        {CONTINENTS.map((poly, i) => (
          <polygon
            key={i}
            points={poly.map(([lon, lat]) => `${projX(lon).toFixed(1)},${projY(lat).toFixed(1)}`).join(' ')}
            fill={wcg.border}
            stroke={wcg.borderStrong}
            strokeWidth={0.75}
          />
        ))}
        {placed.map((p) => {
          const [lon, lat] = p.ll!
          const cx = projX(lon)
          const cy = projY(lat)
          const color = REGION_COLOR[p.region] ?? wcg.purple
          return (
            <g key={p.country}>
              <circle cx={cx} cy={cy} r={r(p.subjects)} fill={color} fillOpacity={0.55} stroke={color} strokeWidth={1.25}>
                <title>{`${p.country} (${p.region}): ~${p.subjects} subjects`}</title>
              </circle>
              {labelSet.has(p.country) && (
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={wcg.ink}>
                  {iso(p.country)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {regions.map((rg) => (
          <span key={rg} className="inline-flex items-center gap-1.5 text-[10.5px]" style={{ color: wcg.muted }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: REGION_COLOR[rg] ?? wcg.purple }} />
            {rg}
          </span>
        ))}
        <span className="text-[10.5px]" style={{ color: wcg.faint }}>
          bubble size = expected subjects
        </span>
      </div>
    </div>
  )
}

function SiteFootprint({ data, expanded }: ChartProps) {
  const alloc = (data.recommended_allocation as Array<Record<string, unknown>>) ?? []
  const scenarios = (data.scenarios as Array<Record<string, unknown>>) ?? []
  const planned = scenarios.find((s) => String(s.key) === 'planned') ?? scenarios[1] ?? scenarios[0]
  const conclusion = planned
    ? `Recommended footprint: ${alloc.length} countries, ~${Number(planned.sites)} sites, enrolling in ~${Number(planned.enrollment_months)} months.`
    : 'Recommended per-country allocation across the corpus footprint.'

  // Rendered as a natural-height card (not ChartFrame's fixed-height canvas box)
  // so the map, legend, and scenario list flow; the panel scrolls.
  return (
    <div className={CARD} style={cardStyle}>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
        Site &amp; country footprint
      </p>
      <p className="text-[13px] leading-snug mb-3" style={{ color: wcg.ink }}>
        {conclusion}
      </p>
      <FootprintMap alloc={alloc} svgHeight={expanded ? 400 : 250} />
      <div className="mt-3 space-y-1.5">
        {scenarios.map((s, i) => (
          <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]" style={{ color: wcg.body }}>
            <span className="truncate" style={{ color: wcg.ink }}>
              {String(s.label)} · {Number(s.sites)} sites
            </span>
            <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
              ~{Number(s.enrollment_months)} mo · {money(Number(s.activation_cost_usd))} activation
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- dispatch ---

interface ChartProps {
  data: Record<string, unknown>
  /** Lightbox mode: taller frames and longer labels. */
  expanded?: boolean
}

export function FixedChart({ panel, expanded = false }: { panel: PanelDescriptor; expanded?: boolean }) {
  switch (panel.chart) {
    case 'criteria_waterfall':
      return <CriteriaWaterfall data={panel.data} expanded={expanded} />
    case 'sensitivity_comparison':
      return <SensitivityComparison data={panel.data} expanded={expanded} />
    case 'comparator_scatter':
      return <ComparatorScatter data={panel.data} expanded={expanded} />
    case 'amendment_risk':
      return <AmendmentRisk data={panel.data} expanded={expanded} />
    case 'endpoint_timeline':
      return <EndpointTimeline data={panel.data} expanded={expanded} />
    case 'cost_breakdown':
      return <CostBreakdown data={panel.data} expanded={expanded} />
    case 'site_footprint':
      return <SiteFootprint data={panel.data} expanded={expanded} />
    default:
      return null
  }
}

function shorten(s: string, n = 32): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

function median(values: number[]): number {
  const v = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (!v.length) return NaN
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

// Keep the palette import referenced for future series-coloured charts.
void wcgSeries
