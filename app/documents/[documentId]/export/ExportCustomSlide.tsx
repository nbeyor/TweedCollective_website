'use client'

import { customComponentRegistry } from '@/components/presentation/custom'
import { getMercuryExportSections } from '@/components/presentation/custom/MercuryDiligenceSlides'

interface ExportCustomSlideProps {
  componentId: string
  props: Record<string, unknown>
  /** For paginated custom slides: which page section range to render */
  sectionRange?: { start: number; end: number }
}

/**
 * Get export sections for a custom component (client-side).
 * Returns null if the component doesn't support sectioned export.
 */
function getExportSections(componentId: string, props: Record<string, unknown>): React.ReactNode[] | null {
  if (componentId === 'MercuryDiligenceSlide') {
    const slideId = props.slideId as string | undefined
    if (slideId) {
      return getMercuryExportSections(slideId)
    }
  }
  return null
}

export default function ExportCustomSlide({ componentId, props, sectionRange }: ExportCustomSlideProps) {
  // Paginated rendering: render specific sections
  if (sectionRange) {
    const sections = getExportSections(componentId, props)
    if (sections) {
      const pageSections = sections.slice(sectionRange.start, sectionRange.end)
      return (
        <div className="export-custom-slide">
          <div className="space-y-5 px-4">
            {pageSections}
          </div>
        </div>
      )
    }
  }

  // Default: render full component
  const Component = customComponentRegistry[componentId]

  if (!Component) {
    return (
      <div style={{ color: '#999', fontStyle: 'italic' }}>
        [Custom component &quot;{componentId}&quot; not found]
      </div>
    )
  }

  return (
    <div className="export-custom-slide">
      <Component {...props} />
    </div>
  )
}
