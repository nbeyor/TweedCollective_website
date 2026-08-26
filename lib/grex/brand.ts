/**
 * GREX product identity. Same switch pattern as lib/protocol-authoring/brand.ts:
 * naming lives here so the demo can be re-skinned without touching components.
 */

export const GREX_BRAND = {
  name: 'GREX',
  tagline: 'Evidence confidence for everything you read',
  /** One-line product thesis used on the hub and architecture pages. */
  thesis:
    'A transparent measure of evidentiary confidence, placed next to factual information with almost no user effort.',
  showPoweredBy: true,
} as const
