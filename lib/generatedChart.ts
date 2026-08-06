/**
 * Server-side builder for generated side-panel charts.
 *
 * For questions the fixed charts do not cover, the strategist emits a chart into
 * a side panel. The PRD's constraints: self-contained (no external requests, the
 * CSP forbids them), data injected from corpus retrievals rather than free-typed,
 * and a fallback if anything is malformed — never a broken page.
 *
 * We render inline SVG from a structured spec instead of shipping a charting
 * library into the iframe. The model supplies the data (from tool results); this
 * module supplies the safe markup. No script runs inside the sandbox at all, so
 * "malformed chart breaks the page" is designed out rather than guarded against.
 */

export type GeneratedChartType = 'bar' | 'grouped-bar' | 'line' | 'scatter'

export interface GeneratedChartSpec {
  title: string
  type: GeneratedChartType
  categories?: string[] // x labels for bar/grouped-bar/line
  series: Array<{ name: string; values?: number[]; points?: Array<{ x: number; y: number; label?: string }> }>
  unit?: string
  caption?: string
  x_label?: string
  y_label?: string
}

// WCG-derived palette. Kept in sync with components/protocol-strategist/wcgTheme.ts;
// duplicated here because the iframe is a standalone document with no imports.
const PALETTE = ['#1FB0A6', '#0A2540', '#5AC8FA', '#F5A623', '#C6168D', '#7B61FF']
const INK = '#0A2540'
const MUTED = '#5B6B7B'
const GRID = '#E3E8EF'

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function num(n: unknown, fallback = 0): number {
  const v = Number(n)
  return Number.isFinite(v) ? v : fallback
}

const W = 640
const H = 360
const PAD = { top: 28, right: 24, bottom: 64, left: 60 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

function niceMax(v: number): number {
  if (v <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / mag
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10
  return step * mag
}

function yAxis(maxVal: number): string {
  const max = niceMax(maxVal)
  const ticks = 4
  let out = ''
  for (let i = 0; i <= ticks; i++) {
    const val = (max / ticks) * i
    const y = PAD.top + PLOT_H - (val / max) * PLOT_H
    out += `<line x1="${PAD.left}" y1="${y}" x2="${PAD.left + PLOT_W}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`
    out += `<text x="${PAD.left - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${formatTick(val)}</text>`
  }
  return out
}

function formatTick(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(v % 1000000 ? 1 : 0)}M`
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k`
  return `${Math.round(v * 100) / 100}`
}

function barChart(spec: GeneratedChartSpec, grouped: boolean): string {
  const cats = spec.categories ?? []
  const series = spec.series
  const maxVal = Math.max(1, ...series.flatMap((s) => (s.values ?? []).map((v) => num(v))))
  const max = niceMax(maxVal)
  const groups = cats.length
  const groupW = PLOT_W / Math.max(1, groups)
  const nSeries = grouped ? series.length : 1
  const barW = (groupW * 0.7) / nSeries

  let bars = ''
  cats.forEach((cat, ci) => {
    const gx = PAD.left + groupW * ci + groupW * 0.15
    const list = grouped ? series : [series[0]]
    list.forEach((s, si) => {
      const v = num((s.values ?? [])[ci])
      const h = (v / max) * PLOT_H
      const x = gx + barW * si
      const y = PAD.top + PLOT_H - h
      const color = PALETTE[(grouped ? si : ci) % PALETTE.length]
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="2" fill="${color}"><title>${esc(cat)} · ${esc(s.name)}: ${esc(v)}</title></rect>`
      if (!grouped || nSeries <= 3) {
        bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="10" fill="${INK}">${esc(formatTick(v))}</text>`
      }
    })
    const labelLines = wrapLabel(cat)
    labelLines.forEach((ln, li) => {
      bars += `<text x="${(PAD.left + groupW * ci + groupW / 2).toFixed(1)}" y="${PAD.top + PLOT_H + 18 + li * 12}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(ln)}</text>`
    })
  })

  return yAxis(maxVal) + bars
}

function lineChart(spec: GeneratedChartSpec): string {
  const cats = spec.categories ?? []
  const series = spec.series
  const maxVal = Math.max(1, ...series.flatMap((s) => (s.values ?? []).map((v) => num(v))))
  const max = niceMax(maxVal)
  const stepX = PLOT_W / Math.max(1, cats.length - 1)
  let out = yAxis(maxVal)
  series.forEach((s, si) => {
    const color = PALETTE[si % PALETTE.length]
    const pts = (s.values ?? []).map((v, i) => {
      const x = PAD.left + stepX * i
      const y = PAD.top + PLOT_H - (num(v) / max) * PLOT_H
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    out += `<polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2.5"/>`
    ;(s.values ?? []).forEach((v, i) => {
      const x = PAD.left + stepX * i
      const y = PAD.top + PLOT_H - (num(v) / max) * PLOT_H
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="${color}"><title>${esc(cats[i])}: ${esc(v)}</title></circle>`
    })
  })
  cats.forEach((cat, i) => {
    out += `<text x="${(PAD.left + stepX * i).toFixed(1)}" y="${PAD.top + PLOT_H + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(cat)}</text>`
  })
  return out
}

function scatterChart(spec: GeneratedChartSpec): string {
  const series = spec.series
  const xs = series.flatMap((s) => (s.points ?? []).map((p) => num(p.x)))
  const ys = series.flatMap((s) => (s.points ?? []).map((p) => num(p.y)))
  const maxX = niceMax(Math.max(1, ...xs))
  const maxY = niceMax(Math.max(1, ...ys))
  let out = yAxis(Math.max(1, ...ys))
  // x ticks
  for (let i = 0; i <= 4; i++) {
    const val = (maxX / 4) * i
    const x = PAD.left + (val / maxX) * PLOT_W
    out += `<text x="${x.toFixed(1)}" y="${PAD.top + PLOT_H + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(formatTick(val))}</text>`
  }
  series.forEach((s, si) => {
    const color = PALETTE[si % PALETTE.length]
    ;(s.points ?? []).forEach((p) => {
      const x = PAD.left + (num(p.x) / maxX) * PLOT_W
      const y = PAD.top + PLOT_H - (num(p.y) / maxY) * PLOT_H
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" fill="${color}" fill-opacity="0.75"><title>${esc(p.label ?? '')} (${esc(p.x)}, ${esc(p.y)})</title></circle>`
    })
  })
  return out
}

function wrapLabel(s: string): string[] {
  const words = String(s).split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > 16) {
      if (cur) lines.push(cur)
      cur = w
    } else {
      cur = (cur + ' ' + w).trim()
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 2)
}

/**
 * HTML legend above the SVG. An in-SVG legend advances x by name length and
 * silently pushes later entries off the 640px canvas — with three or more
 * long series names the last series renders unlabeled. HTML flex-wrap makes
 * every series keep its label no matter how many or how long.
 */
function legendHtml(names: string[]): string {
  if (names.length <= 1) return ''
  const items = names
    .map(
      (n, i) =>
        `<span class="li"><span class="sw" style="background:${PALETTE[i % PALETTE.length]}"></span>${esc(n)}</span>`
    )
    .join('')
  return `<div class="legend">${items}</div>`
}

/** Build the sandboxed HTML document for one generated chart. */
export function buildChartHtml(spec: GeneratedChartSpec): string {
  let body: string
  try {
    if (!spec || !spec.type || !Array.isArray(spec.series) || !spec.series.length) {
      throw new Error('empty spec')
    }
    if (spec.type === 'line') body = lineChart(spec)
    else if (spec.type === 'scatter') body = scatterChart(spec)
    else body = barChart(spec, spec.type === 'grouped-bar')
  } catch {
    return fallbackHtml(spec?.title)
  }

  const yLabel = spec.y_label
    ? `<text x="16" y="${PAD.top + PLOT_H / 2}" text-anchor="middle" font-size="11" fill="${MUTED}" transform="rotate(-90 16 ${PAD.top + PLOT_H / 2})">${esc(spec.y_label)}</text>`
    : ''

  return `<!doctype html><html><head><meta charset="utf-8"><style>
    :root{color-scheme:light}
    html,body{margin:0;padding:0;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${INK}}
    .wrap{padding:14px 16px 12px}
    h3{font-size:14px;font-weight:600;margin:0 0 2px;color:${INK}}
    .cap{font-size:11.5px;color:${MUTED};margin:6px 2px 0;line-height:1.45}
    svg{width:100%;height:auto;display:block}
    .unit{font-size:11px;color:${MUTED};margin:0 0 6px}
    .legend{display:flex;flex-wrap:wrap;gap:3px 14px;margin:6px 0 4px;font-size:11px;color:${INK}}
    .li{display:inline-flex;align-items:center;white-space:nowrap}
    .sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px}
  </style></head><body><div class="wrap">
    <h3>${esc(spec.title)}</h3>
    ${spec.unit ? `<div class="unit">${esc(spec.unit)}</div>` : ''}
    ${legendHtml(spec.series.map((s) => s.name))}
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(spec.title)}">${body}${yLabel}</svg>
    ${spec.caption ? `<p class="cap">${esc(spec.caption)}</p>` : ''}
  </div></body></html>`
}

function fallbackHtml(title?: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;background:#fff;font-family:-apple-system,sans-serif;color:${MUTED}}
    .box{padding:24px;text-align:center;font-size:13px}
    .t{color:${INK};font-weight:600;margin-bottom:6px}
  </style></head><body><div class="box"><div class="t">${esc(title ?? 'Chart')}</div>
  This chart could not be rendered from the available data.</div></body></html>`
}
