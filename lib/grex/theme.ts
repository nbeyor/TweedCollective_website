/**
 * GREX theme tokens — the only file in the workspace that may contain hex
 * (same convention as components/protocol-strategist/wcgTheme.ts).
 *
 * One palette: calm blues and greens on a pale aqua ground, deliberately
 * distinct from the Tweed Collective site's dark void/cream/sage system.
 * Semantic verdict hues (green = supported, amber = insufficient, rust =
 * contradicted) are fixed; red is never ambient chrome, only a verdict.
 *
 * Components consume CSS custom properties set once at the workspace root
 * via themeVars().
 */

import type { CSSProperties } from 'react'

export interface GrexTheme {
  colors: {
    page: string
    surface: string
    surfaceRaised: string
    border: string
    ink: string
    body: string
    muted: string
    accent: string
    accentInk: string
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

export const GREX_THEME: GrexTheme = {
  colors: {
    page: '#EDF4F5',
    surface: '#FFFFFF',
    surfaceRaised: '#E0EBEC',
    border: '#CFDFE1',
    ink: '#0E2A33',
    body: '#33505B',
    muted: '#6D8791',
    accent: '#0E7C86',
    accentInk: '#FFFFFF',
    accentSoft: '#DCEEF0',
    bandStrong: '#178F5F',
    bandModerate: '#2E8FA3',
    bandMixed: '#B98A2F',
    bandWeak: '#C05B3F',
    bandNone: '#7C8F96',
    verdictSupported: '#178F5F',
    verdictContradicted: '#B4452F',
    verdictInsufficient: '#B98A2F',
  },
  fonts: {
    display: 'var(--grex-font-grotesk)',
    body: 'var(--font-inter)',
    mono: 'var(--font-jetbrains-mono)',
  },
  radii: { pill: '999px', card: '14px', chip: '8px' },
}

/** Map the theme to the CSS custom properties the components consume. */
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
