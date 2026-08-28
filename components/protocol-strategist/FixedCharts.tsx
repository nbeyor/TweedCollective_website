'use client'

import React from 'react'
import { Bar, Line, Scatter } from 'react-chartjs-2'

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
  const compliance = (data.floor_compliance as Array<Record<string, unknown>>) ?? []
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
      {compliance.length > 0 && (
        <div className="mb-3 space-y-1">
          {compliance.map((c, i) => {
            const met = Boolean(c.met)
            return (
              <p
                key={i}
                className="text-[11.5px] leading-snug font-medium"
                style={{ color: met ? wcg.good : wcg.bad }}
              >
                {met ? '✓' : '✕'} {String(c.region)} at {Number(c.expected_share_pct)}% —{' '}
                {met ? 'above' : 'below'} the {Number(c.floor_pct)}% regulatory floor
                {c.note ? ` · ${String(c.note)}` : ''}
              </p>
            )
          })}
        </div>
      )}
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

// --------------------------------------------------------- design structure ---

function DesignStructure({ data, expanded }: ChartProps) {
  const frameworks = (data.by_framework as Array<Record<string, unknown>>) ?? []
  const blinding = (data.by_blinding as Array<Record<string, unknown>>) ?? []
  const control = (data.by_control as Array<Record<string, unknown>>) ?? []
  const special = (data.special_structures as Record<string, Record<string, unknown>>) ?? {}
  const cohortN = Number(data.comparator_n ?? 0)

  const modal = frameworks[0]
  const conclusion = modal
    ? `${String(modal.level)}, ${String(blinding[0]?.level ?? '').toLowerCase()} is the modal structure (${Number(modal.n)} of ${cohortN} trials). Bars: how fast each framework actually enrolled.`
    : 'Design structures used across the comparator cohort.'

  const rows = frameworks.filter((r) => Number(r.n) > 0 && Number.isFinite(Number(r.median_enrollment_months)))
  const labels = rows.map((r) => `${shorten(String(r.level), expanded ? 40 : 24)} (n=${Number(r.n)})`)
  const values = rows.map((r) => Number(r.median_enrollment_months))
  const colors = rows.map((r) => (Number(r.n) < 5 ? wcg.borderStrong : wcg.teal))

  const line = (r: Record<string, unknown>) =>
    `n=${Number(r.n)} · ~${Number(r.median_enrollment_months)} mo · N=${Number(r.median_participants)}${r.evidence ? ' · thin' : ''}`

  // Natural-height card (like the footprint) so the bars and the blinding /
  // control / special-structure breakdown flow together.
  return (
    <div className={CARD} style={cardStyle}>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.teal }}>
        Design structures in the cohort
      </p>
      <p className="text-[13px] leading-snug mb-3" style={{ color: wcg.ink }}>
        {conclusion}
      </p>
      <div style={{ height: Math.max(120, rows.length * (expanded ? 48 : 40)) }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Median enrollment (months)',
                data: values,
                backgroundColor: colors,
                borderRadius: 3,
              },
            ],
          }}
          options={baseChartOptions({
            indexAxis: 'y' as const,
            plugins: { legend: { display: false } },
            scales: { x: axisScale('median enrollment, months'), y: axisScale() },
          })}
        />
      </div>
      <div className="mt-3 space-y-1" style={{ color: wcg.body }}>
        {[
          ...blinding.map((r) => ({ label: String(r.level), r })),
          ...control.map((r) => ({ label: String(r.level), r })),
          { label: 'Adaptive elements', r: special.adaptive ?? {} },
          { label: 'Basket / master protocol', r: special.basket ?? {} },
        ]
          .filter(({ r }) => Number(r.n) > 0)
          .map(({ label, r }, i) => (
            <div key={i} className="flex items-baseline justify-between gap-2 text-[12px]">
              <span className="truncate" style={{ color: wcg.ink }}>
                {label}
              </span>
              <span className="shrink-0 tabular-nums" style={{ color: wcg.muted }}>
                {line(r)}
              </span>
            </div>
          ))}
      </div>
      <p className="text-[10.5px] mt-2 leading-snug" style={{ color: wcg.faint }}>
        Comparator evidence, not recommendation — thin subgroups (n&lt;5) shown muted.
      </p>
    </div>
  )
}

// --------------------------------------------------------- biostats result ---

/**
 * Result card for a registered biostatistics analysis run (OMOP biostats
 * module). The shape adapts to the analysis family: group-sequential designs
 * plot their efficacy boundaries; sample-size runs compare per-arm N; power
 * runs show the achieved power against the conventional 80/90% marks.
 */
function BiostatsResult({ data, expanded }: ChartProps) {
  const analysisId = String(data.analysis_id ?? '')
  const outputs = (data.outputs as Record<string, unknown>) ?? {}
  const summary = (outputs.summary as Record<string, number>) ?? {}
  const table = (outputs.table as Array<Record<string, number>>) ?? []
  const interpretation = String(outputs.interpretation ?? '')
  const warnings = (outputs.warnings as string[]) ?? []
  const derived = (data.derived_from as Array<Record<string, unknown>>) ?? []

  let body: React.ReactNode = null
  if (analysisId === 'gs_survival_2arm' && table.length) {
    body = (
      <div style={{ height: expanded ? 340 : 220 }}>
        <Line
          data={{
            labels: table.map((r) => `Look ${r.look} (${Math.round(Number(r.information_fraction) * 100)}%)`),
            datasets: [
              {
                label: 'Efficacy boundary (z)',
                data: table.map((r) => Number(r.efficacy_z)),
                borderColor: wcg.teal,
                backgroundColor: wcg.teal,
                pointRadius: 4,
                tension: 0.2,
              },
              {
                label: 'Fixed-design z (1.96 ≈ two-sided 5%)',
                data: table.map(() => 1.96),
                borderColor: wcg.borderStrong,
                borderDash: [6, 4],
                pointRadius: 0,
              },
            ],
          }}
          options={baseChartOptions({
            scales: { x: axisScale(), y: axisScale('z at boundary') },
          })}
        />
      </div>
    )
  } else if (analysisId.startsWith('power_')) {
    const power = Number(summary.power)
    body = (
      <div style={{ height: expanded ? 200 : 130 }}>
        <Bar
          data={{
            labels: ['Achieved power'],
            datasets: [
              {
                label: 'Power',
                data: [power],
                backgroundColor: power >= 0.8 ? wcg.good : power >= 0.7 ? wcg.warn : wcg.bad,
                borderRadius: 3,
              },
            ],
          }}
          options={baseChartOptions({
            indexAxis: 'y' as const,
            plugins: {
              legend: { display: false },
              annotation: {
                annotations: {
                  p80: { type: 'line', xMin: 0.8, xMax: 0.8, borderColor: wcg.navy, borderDash: [4, 4], borderWidth: 1 },
                  p90: { type: 'line', xMin: 0.9, xMax: 0.9, borderColor: wcg.muted, borderDash: [4, 4], borderWidth: 1 },
                },
              },
            },
            scales: { x: { ...axisScale('power (dashed: 0.80 / 0.90)'), min: 0, max: 1 }, y: axisScale() },
          })}
        />
      </div>
    )
  } else {
    const perArm = [
      { arm: 'Control', evaluable: summary.n_control_evaluable, enrolled: summary.n_control_enrolled },
      { arm: 'Treatment', evaluable: summary.n_treatment_evaluable, enrolled: summary.n_treatment_enrolled },
    ].filter((r) => Number.isFinite(r.evaluable) || Number.isFinite(r.enrolled))
    body = perArm.length ? (
      <div style={{ height: expanded ? 260 : 170 }}>
        <Bar
          data={{
            labels: perArm.map((r) => r.arm),
            datasets: [
              { label: 'Evaluable', data: perArm.map((r) => Number(r.evaluable)), backgroundColor: wcg.teal, borderRadius: 3 },
              { label: 'Enrolled (with dropout)', data: perArm.map((r) => Number(r.enrolled ?? r.evaluable)), backgroundColor: wcg.sky, borderRadius: 3 },
            ],
          }}
          options={baseChartOptions({ scales: { x: axisScale(), y: axisScale('participants') } })}
        />
      </div>
    ) : null
  }

  const stats: Array<[string, unknown]> = Object.entries(summary).slice(0, 8)
  return (
    <div className={CARD} style={cardStyle}>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.purple }}>
        Biostatistics · {analysisId}
      </p>
      <p className="text-[13px] leading-snug mb-3" style={{ color: wcg.ink }}>
        {interpretation}
      </p>
      {body}
      <div className="mt-3 space-y-1">
        {stats.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-2 text-[12px]">
            <span style={{ color: wcg.muted }}>{k.replace(/_/g, ' ')}</span>
            <span className="tabular-nums font-medium" style={{ color: wcg.ink }}>
              {String(v)}
            </span>
          </div>
        ))}
      </div>
      {derived.length > 0 && (
        <p className="text-[10.5px] mt-2 leading-snug" style={{ color: wcg.teal }}>
          RWD-derived inputs: {derived.map((d) => `${String(d.field)} = ${String(d.estimate)} (${String(d.cohort_name)}, est. ${String(d.estimate_date)})`).join('; ')}
        </p>
      )}
      {warnings.map((w, i) => (
        <p key={i} className="text-[10.5px] mt-1 leading-snug" style={{ color: '#8A6414' }}>
          ⚠ {w}
        </p>
      ))}
      <p className="text-[10.5px] mt-2 leading-snug" style={{ color: wcg.faint }}>
        Deterministic registered analysis · run {String(data.run_id ?? '')} · synthetic RWD inputs where labeled.
      </p>
    </div>
  )
}

// ---------------------------------------------------------- patient journey --

const PJ_W = 640
const PJ_H = 300
const PJ_TOP = 46 // SoA marker band
const PJ_BOTTOM = 34

const SOA_KIND_COLOR: Record<string, string> = {
  screening: wcg.purple,
  treatment: wcg.teal,
  imaging: wcg.blue,
  followup: wcg.amber,
}

/**
 * Trial events over the patient-journey timeline: the protocol's scheduled
 * assessments (diamonds, top band) laid over what the RWD cohort actually did
 * month by month — retention (line), care touchpoints (bars) — with observed
 * milestone medians as vertical markers. Where the observed journey thins out
 * before the schedule does, the design is asking for visits the real-world
 * population stops making.
 */
function PatientJourney({ data, expanded }: ChartProps) {
  const months = (data.months as Array<Record<string, number>>) ?? []
  const soaEvents = (data.soa_events as Array<{ month: number; label: string; kind: string }>) ?? []
  const milestones = (data.milestones as Array<{ label: string; median_months: number; n: number }>) ?? []
  const adherence = (data.soa_imaging_adherence as Array<Record<string, unknown>>) ?? []
  const horizon = Number(data.horizon_months ?? 24)

  const x = (month: number) => 24 + ((month + 1) / (horizon + 1.5)) * (PJ_W - 40)
  const plotTop = PJ_TOP + 8
  const plotH = PJ_H - plotTop - PJ_BOTTOM
  const yRet = (pct: number) => plotTop + (1 - pct / 100) * plotH
  const maxVisits = Math.max(1.5, ...months.map((m) => Number(m.visits_per_active_patient)))
  const yVisits = (v: number) => plotTop + (1 - v / (maxVisits * 1.15)) * plotH

  const retPath = months.map((m, i) => `${i ? 'L' : 'M'}${x(m.month + 0.5).toFixed(1)},${yRet(Number(m.retained_pct)).toFixed(1)}`).join(' ')
  const ret12 = months.find((m) => m.month === 12)
  const kinds = Array.from(new Set(soaEvents.map((e) => e.kind)))

  const svgHeight = expanded ? 400 : 270
  return (
    <div className={CARD} style={cardStyle}>
      <p className="text-[11px] uppercase tracking-[0.14em] mb-1" style={{ color: wcg.purple }}>
        Patient journey vs schedule of assessments
      </p>
      <p className="text-[13px] leading-snug mb-3" style={{ color: wcg.ink }}>
        {ret12
          ? `Scheduled trial events (top) against the real-world journey: ${Number(ret12.retained_pct).toFixed(0)}% of the cohort is still observable at month 12 — every scheduled visit after the journey thins is an operational risk.`
          : 'Scheduled trial events laid over the observed real-world journey.'}
      </p>
      <svg viewBox={`0 0 ${PJ_W} ${PJ_H}`} width="100%" height={svgHeight} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Patient journey timeline">
        <rect x={0} y={0} width={PJ_W} height={PJ_H} fill={wcg.surfaceMuted} rx={8} />
        {/* SoA band */}
        <text x={24} y={16} fontSize={10} fill={wcg.muted}>
          Protocol SoA (scheduled)
        </text>
        <line x1={20} y1={PJ_TOP - 14} x2={PJ_W - 16} y2={PJ_TOP - 14} stroke={wcg.borderStrong} strokeWidth={1} />
        {soaEvents.map((e, i) => {
          const cx = x(e.month)
          const cy = PJ_TOP - 14
          const c = SOA_KIND_COLOR[e.kind] ?? wcg.muted
          return (
            <g key={i}>
              <path d={`M${cx},${cy - 5} L${cx + 4.5},${cy} L${cx},${cy + 5} L${cx - 4.5},${cy} Z`} fill={c} fillOpacity={0.9}>
                <title>{`${e.label} — month ${e.month}`}</title>
              </path>
            </g>
          )
        })}
        {/* observed care bars */}
        {months.map((m) => {
          const bx = x(m.month + 0.08)
          const bw = Math.max(2, x(m.month + 0.92) - bx)
          const v = Number(m.visits_per_active_patient)
          return (
            <rect key={m.month} x={bx} y={yVisits(v)} width={bw} height={plotTop + plotH - yVisits(v)} fill={wcg.sky} fillOpacity={0.45} rx={1.5}>
              <title>{`Month ${m.month}: ${v} visits per active patient`}</title>
            </rect>
          )
        })}
        {/* retention line */}
        <path d={retPath} fill="none" stroke={wcg.navy} strokeWidth={2.25} />
        {/* milestones */}
        {milestones.map((ms, i) => {
          const mx = x(ms.median_months)
          if (ms.median_months > horizon) return null
          return (
            <g key={i}>
              <line x1={mx} y1={plotTop} x2={mx} y2={plotTop + plotH} stroke={wcg.magenta} strokeWidth={1} strokeDasharray="4 3" />
              <text
                x={mx + 3}
                y={plotTop + 12 + i * 12}
                fontSize={9.5}
                fill={wcg.magenta}
              >{`${ms.label} ~${ms.median_months}mo`}</text>
            </g>
          )
        })}
        {/* axes */}
        {[0, 6, 12, 18, 24, 30, 36]
          .filter((m) => m <= horizon)
          .map((m) => (
            <g key={m}>
              <line x1={x(m)} y1={plotTop + plotH} x2={x(m)} y2={plotTop + plotH + 4} stroke={wcg.borderStrong} />
              <text x={x(m)} y={PJ_H - 20} fontSize={10} textAnchor="middle" fill={wcg.muted}>
                {m}mo
              </text>
            </g>
          ))}
        <text x={24} y={PJ_H - 6} fontSize={9.5} fill={wcg.muted}>
          line = % of cohort still observable · bars = care visits per active patient per month
        </text>
        {[100, 50, 0].map((pct) => (
          <text key={pct} x={PJ_W - 14} y={yRet(pct) + 3} fontSize={9} textAnchor="end" fill={wcg.faint}>
            {pct}%
          </text>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {kinds.map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5 text-[10.5px]" style={{ color: wcg.muted }}>
            <span className="w-2 h-2 rotate-45" style={{ background: SOA_KIND_COLOR[k] ?? wcg.muted }} />
            {k}
          </span>
        ))}
      </div>
      {adherence.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-[0.1em] mb-1" style={{ color: wcg.muted }}>
            Scheduled imaging vs observed RWD imaging (±3 weeks)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {adherence.map((a, i) => {
              const p = a.rwd_match_pct === null ? null : Number(a.rwd_match_pct)
              return (
                <span
                  key={i}
                  className="rounded-md border px-1.5 py-0.5 text-[10.5px] tabular-nums"
                  style={{
                    borderColor: wcg.border,
                    background: wcg.surface,
                    color: p === null ? wcg.faint : p >= 50 ? wcg.good : p >= 25 ? '#8A6414' : wcg.bad,
                  }}
                  title={`${String(a.soa_event)}: ${p ?? '—'}% of still-active patients had a matching scan in RWD`}
                >
                  {String(a.soa_event)} {p === null ? '—' : `${p}%`}
                </span>
              )
            })}
          </div>
        </div>
      )}
      <p className="text-[10.5px] mt-2 leading-snug" style={{ color: wcg.faint }}>
        Synthetic OMOP RWD — real-world care cadence, not trial-protocol adherence; use as a stress test of the schedule, not a compliance forecast.
      </p>
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
    case 'design_structure':
      return <DesignStructure data={panel.data} expanded={expanded} />
    case 'biostats_result':
      return <BiostatsResult data={panel.data} expanded={expanded} />
    case 'patient_journey':
      return <PatientJourney data={panel.data} expanded={expanded} />
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
