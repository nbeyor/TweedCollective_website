'use client'

import { customComponentRegistry } from '@/components/presentation/custom'

interface ExportCustomSlideProps {
  componentId: string
  props: Record<string, unknown>
}

export default function ExportCustomSlide({ componentId, props }: ExportCustomSlideProps) {
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
