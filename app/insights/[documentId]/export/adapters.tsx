/**
 * Export Adapter Registry (Server-safe)
 *
 * Provides pagination metadata for custom slides that need multi-page export.
 * This file contains NO 'use client' imports — it only defines page counts
 * and section ranges. Actual rendering is handled by ExportCustomSlide (client).
 *
 * To add a new adapter:
 * 1. Expose section data from the component module (e.g., getExportSections())
 * 2. Register pagination metadata below
 * 3. Add rendering logic to ExportCustomSlide.tsx
 */

export interface AdapterPageInfo {
  /** Total pages for this slide */
  pageCount: number
  /** Section index ranges per page: [start, end) */
  pageRanges: Array<{ start: number; end: number }>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build page ranges from a total section count and a max-sections-per-page.
 * Returns null if the slide fits on one page.
 */
function buildPageRanges(
  sectionCount: number,
  sectionsPerPage: number
): AdapterPageInfo | null {
  if (sectionCount <= sectionsPerPage) return null

  const pageCount = Math.ceil(sectionCount / sectionsPerPage)
  const pageRanges: Array<{ start: number; end: number }> = []

  for (let i = 0; i < pageCount; i++) {
    const start = i * sectionsPerPage
    const end = Math.min(start + sectionsPerPage, sectionCount)
    pageRanges.push({ start, end })
  }

  return { pageCount, pageRanges }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up pagination info for a custom slide.
 * Returns null if the slide should render as a single page.
 */
export function getCustomSlidePageInfo(
  componentId: string,
  props: Record<string, unknown>
): AdapterPageInfo | null {
  const slideId = props.slideId as string | undefined

  if (componentId === 'MercuryDiligenceSlide' && slideId) {
    return getMercuryPageInfo(slideId)
  }

  return null
}

// ---------------------------------------------------------------------------
// Mercury slide pagination metadata
// ---------------------------------------------------------------------------

/**
 * Known dense Mercury slides: { sectionCount, sectionsPerPage }.
 * Section indices correspond to top-level children returned by
 * getMercuryExportSections() (either manually curated or auto-extracted
 * from the wrapper div's children).
 */
const MERCURY_DENSE_SLIDES: Record<string, { sections: number; perPage: number }> = {
  // Manually curated
  'data-flywheel':            { sections: 6, perPage: 3 },

  // Auto-extracted (top-level children of wrapper div)
  'ai-quantified-impact':     { sections: 5, perPage: 2 },
  'sensitivity':              { sections: 4, perPage: 2 },
  'ctms-synergy':             { sections: 5, perPage: 3 },
  'budget-deep-dive':         { sections: 5, perPage: 3 },
  'internal-transformation':  { sections: 5, perPage: 3 },
  'build-vs-buy':             { sections: 6, perPage: 3 },
  'synergy-waves':            { sections: 5, perPage: 3 },
}

function getMercuryPageInfo(slideId: string): AdapterPageInfo | null {
  const config = MERCURY_DENSE_SLIDES[slideId]
  if (!config) return null

  return buildPageRanges(config.sections, config.perPage)
}
