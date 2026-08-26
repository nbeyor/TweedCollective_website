/**
 * GREX brand direction tokens.
 *
 * The only file in the workspace that may contain hex (same convention as
 * components/protocol-strategist/wcgTheme.ts). Components consume CSS custom
 * properties set once at the workspace root via themeVars(); the brand page
 * renders all three directions side-by-side by scoping themeVars() locally.
 *
 * Switching the active direction is the one-line GREX_THEME export below.
 *
 * Semantic verdict/band hues (green = supported, amber = insufficient,
 * rust = contradicted) stay constant across directions — only luminance is
 * adapted for light vs dark chrome. Red is never ambient, only a verdict.
 */

import type { CSSProperties } from 'react'

export type GrexThemeId = 'signal' | 'ledger' | 'meter'

export interface GrexTheme {
  id: GrexThemeId
  name: string
  /** Short positioning line shown on the brand page. */
  positioning: string
  /** Why this direction conveys consumer trust. */
  rationale: string
  colors: {
    page: string
    surface: string
    surfaceRaised: string
    border: string
    ink: string
    body: string
    muted: string
    accent: string
    accentInk: string // text/icon color on accent fills
    accentSoft: string
    bandStrong: string
    bandModerate: string
    bandMixed: string
    bandWeak: string
    bandNone: string
    verdictSupported: string
    verdictContradicted: string
    verdictInsufficient: string
  }
  fonts: {
    display: string
    body: string
    mono: string
  }
  radii: {
    pill: string
    card: string
    chip: string
  }
}

export const DIRECTIONS: Record<GrexThemeId, GrexTheme> = {
  signal: {
    id: 'signal',
    name: 'Signal',
    positioning: 'Institutional trust — the vocabulary of banks, journals, and verification marks.',
    rationale:
      'Deep ink-blue chrome on warm off-white. Blue is the most durable trust hue in consumer research — it reads as institutional without feeling governmental, and the warm paper tone keeps it human rather than clinical. One confident verification green carries "supported"; red appears only as a verdict, never as chrome, so the product never feels alarmist.',
    colors: {
      page: '#FAF8F4',
      surface: '#FFFFFF',
      surfaceRaised: '#F3F1EA',
      border: '#E5E1D6',
      ink: '#16233F',
      body: '#3C4558',
      muted: '#7B8296',
      accent: '#1B2A4A',
      accentInk: '#FFFFFF',
      accentSoft: '#E9EDF6',
      bandStrong: '#1E9E6A',
      bandModerate: '#2C8C99',
      bandMixed: '#C08A2D',
      bandWeak: '#C05B3F',
      bandNone: '#8B8FA0',
      verdictSupported: '#1E9E6A',
      verdictContradicted: '#B4452F',
      verdictInsufficient: '#C08A2D',
    },
    fonts: {
      display: 'var(--font-inter)',
      body: 'var(--font-inter)',
      mono: 'var(--font-jetbrains-mono)',
    },
    radii: { pill: '999px', card: '16px', chip: '8px' },
  },
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    positioning: 'Newsroom credibility — paper, serifs, and a wire-service temperament.',
    rationale:
      'Paper white, near-black text, a serif display face, and a single deep teal accent. This is the aesthetic of record — Reuters and AP energy — which borrows a century of editorial credibility. It positions GREX as journalism-grade rather than tech-grade, at the cost of feeling less like a product and more like a publication.',
    colors: {
      page: '#FCFBF7',
      surface: '#FFFFFF',
      surfaceRaised: '#F5F3EC',
      border: '#E7E3DA',
      ink: '#191817',
      body: '#403E3A',
      muted: '#8A867E',
      accent: '#0F6B66',
      accentInk: '#FFFFFF',
      accentSoft: '#E5EFEE',
      bandStrong: '#1D8A60',
      bandModerate: '#25808C',
      bandMixed: '#B08328',
      bandWeak: '#B35538',
      bandNone: '#8F8B83',
      verdictSupported: '#1D8A60',
      verdictContradicted: '#A8402C',
      verdictInsufficient: '#B08328',
    },
    fonts: {
      display: 'var(--grex-font-serif)',
      body: 'var(--font-inter)',
      mono: 'var(--font-jetbrains-mono)',
    },
    radii: { pill: '999px', card: '4px', chip: '3px' },
  },
  meter: {
    id: 'meter',
    name: 'Meter',
    positioning: 'Precision instrument — a measurement device, not a media brand.',
    rationale:
      'Near-black surfaces, hairline borders, grotesk and mono type, one electric verification accent. Trust here comes from the aesthetics of instrumentation: the score reads like a reading off a calibrated meter. Most distinctive and most "tech" of the three; least warm, and dark UI is a bolder choice for a mainstream consumer product.',
    colors: {
      page: '#0C0E12',
      surface: '#12151C',
      surfaceRaised: '#181C25',
      border: '#252B38',
      ink: '#F2F5F9',
      body: '#B8C0CE',
      muted: '#6D7688',
      accent: '#3DF2A6',
      accentInk: '#07130D',
      accentSoft: '#11291F',
      bandStrong: '#37D98F',
      bandModerate: '#53B9CB',
      bandMixed: '#E0A83E',
      bandWeak: '#E06A4A',
      bandNone: '#778092',
      verdictSupported: '#37D98F',
      verdictContradicted: '#E06A4A',
      verdictInsufficient: '#E0A83E',
    },
    fonts: {
      display: 'var(--grex-font-grotesk)',
      body: 'var(--grex-font-grotesk)',
      mono: 'var(--font-jetbrains-mono)',
    },
    radii: { pill: '999px', card: '10px', chip: '6px' },
  },
}

/** Active brand direction. Swapping the direction is this one line. */
export const GREX_THEME: GrexTheme = DIRECTIONS.signal

/** Map a theme to the CSS custom properties the components consume. */
export function themeVars(t: GrexTheme): CSSProperties {
  return {
    '--grex-page': t.colors.page,
    '--grex-surface': t.colors.surface,
    '--grex-surface-raised': t.colors.surfaceRaised,
    '--grex-border': t.colors.border,
    '--grex-ink': t.colors.ink,
    '--grex-body': t.colors.body,
    '--grex-muted': t.colors.muted,
    '--grex-accent': t.colors.accent,
    '--grex-accent-ink': t.colors.accentInk,
    '--grex-accent-soft': t.colors.accentSoft,
    '--grex-band-strong': t.colors.bandStrong,
    '--grex-band-moderate': t.colors.bandModerate,
    '--grex-band-mixed': t.colors.bandMixed,
    '--grex-band-weak': t.colors.bandWeak,
    '--grex-band-none': t.colors.bandNone,
    '--grex-supported': t.colors.verdictSupported,
    '--grex-contradicted': t.colors.verdictContradicted,
    '--grex-insufficient': t.colors.verdictInsufficient,
    '--grex-font-display': t.fonts.display,
    '--grex-font-body': t.fonts.body,
    '--grex-font-mono': t.fonts.mono,
    '--grex-radius-pill': t.radii.pill,
    '--grex-radius-card': t.radii.card,
    '--grex-radius-chip': t.radii.chip,
  } as CSSProperties
}

/** Band color CSS var for a score band (null band = NO_VERIFIABLE_CLAIMS). */
export function bandVar(band: 'strong' | 'moderate' | 'mixed' | 'weak' | null): string {
  return band ? `var(--grex-band-${band})` : 'var(--grex-band-none)'
}
