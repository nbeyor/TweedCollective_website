'use client'

import { customComponentRegistry } from '@/components/presentation/custom'
import { useRef, useEffect, useState } from 'react'

interface ExportCustomSlideProps {
  componentId: string
  props: Record<string, unknown>
}

export default function ExportCustomSlide({ componentId, props }: ExportCustomSlideProps) {
  const Component = customComponentRegistry[componentId]
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    const parent = el.closest('.export-slide') as HTMLElement
    if (!parent) return

    // Available height = parent height - header - padding
    const parentStyle = getComputedStyle(parent)
    const parentHeight = parent.clientHeight
      - parseFloat(parentStyle.paddingTop)
      - parseFloat(parentStyle.paddingBottom)

    // Account for slide header
    const header = parent.querySelector('.slide-header') as HTMLElement
    const headerHeight = header ? header.offsetHeight + parseFloat(getComputedStyle(header).marginBottom) : 0

    const availableHeight = parentHeight - headerHeight
    const contentHeight = el.scrollHeight

    if (contentHeight > availableHeight && availableHeight > 0) {
      const newScale = availableHeight / contentHeight
      setScale(Math.max(newScale, 0.5)) // Don't scale below 50%
    }
  }, [])

  if (!Component) {
    return (
      <div style={{ color: '#999', fontStyle: 'italic' }}>
        [Custom component &quot;{componentId}&quot; not found]
      </div>
    )
  }

  return (
    <div
      className="export-custom-slide"
      ref={contentRef}
      style={{
        transform: scale < 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        width: scale < 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <Component {...props} />
    </div>
  )
}
