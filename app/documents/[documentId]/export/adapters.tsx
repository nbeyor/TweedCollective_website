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

/**
 * Mercury slide pagination metadata.
 * Section indices correspond to arrays returned by getMercuryExportSections().
 */
function getMercuryPageInfo(slideId: string): AdapterPageInfo | null {
  switch (slideId) {
    case 'data-flywheel':
      // 6 sections split across 2 pages:
      // Page 1: Header+Thesis (0), First Turn (1), Standalone vs WCG (2)
      // Page 2: Flywheel Mechanics (3), Before/After table (4), Inferences (5)
      return {
        pageCount: 2,
        pageRanges: [
          { start: 0, end: 3 },
          { start: 3, end: 6 },
        ],
      }
    default:
      return null
  }
}
