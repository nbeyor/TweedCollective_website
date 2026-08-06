/**
 * WCG IntelX demo theme — the single place to swap in WCG's exact brand values.
 *
 * The sandbox network policy blocked wcgclinical.com and the brand aggregators,
 * so these are a faithful reconstruction of WCG's 2023 identity: a deep navy
 * primary with a teal / green signature accent, on a clean, light, clinical
 * surface. When the exact WCG hex values are available, replace the constants in
 * this file — every fixed chart, the generated-chart palette (mirrored in
 * lib/generatedChart.ts), and the page chrome read from here.
 *
 * Kept as raw hex (not Tailwind tokens) because Chart.js and the sandboxed SVG
 * iframe both need literal colors.
 */

export const wcg = {
  // Core brand
  navy: '#0A2540',
  navyDeep: '#06172B',
  teal: '#1FB0A6',
  tealBright: '#2CC9BD',
  // Supporting brights (solution-area accents in WCG's expanded palette)
  sky: '#5AC8FA',
  blue: '#2E6FB7',
  amber: '#F5A623',
  magenta: '#C6168D',
  purple: '#7B61FF',
  // Semantics for tradeoffs
  good: '#1FB0A6', // the option that protects the timeline
  warn: '#F5A623',
  bad: '#E06D4F', // the option that costs the most slip
  // Surfaces (light clinical aesthetic)
  page: '#F4F7FA',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F7',
  border: '#E3E8EF',
  borderStrong: '#CBD5E1',
  ink: '#0A2540',
  body: '#33424F',
  muted: '#5B6B7B',
  faint: '#8A97A5',
} as const

/** Categorical series palette. Mirrors PALETTE in lib/generatedChart.ts. */
export const wcgSeries = [
  wcg.teal,
  wcg.navy,
  wcg.sky,
  wcg.amber,
  wcg.magenta,
  wcg.purple,
]

/** Shared Chart.js option fragments so every fixed chart reads as one system. */
export const chartFont = {
  family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
}

// Returns `any` deliberately: Chart.js's deep option generics fight per-chart
// literal narrowing, and every consumer is our own code.
export function baseChartOptions(overrides: Record<string, unknown> = {}): any {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: wcg.body, font: { ...chartFont, size: 12 }, boxWidth: 12, boxHeight: 12 },
      },
      tooltip: {
        backgroundColor: wcg.navy,
        titleFont: chartFont,
        bodyFont: chartFont,
        padding: 10,
        cornerRadius: 6,
      },
    },
    ...overrides,
  }
}

export function axisScale(titleText?: string): any {
  return {
    grid: { color: wcg.border },
    ticks: { color: wcg.muted, font: { ...chartFont, size: 11 } },
    title: titleText
      ? { display: true, text: titleText, color: wcg.muted, font: { ...chartFont, size: 11 } }
      : { display: false },
  }
}
