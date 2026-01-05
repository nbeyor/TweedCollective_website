import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'

// Import document registry
import { DOCUMENT_CONFIGS } from '@/content/documents'

// Import slide data for each document
import { slides as salmonSlides } from '@/content/documents/salmon-ai-genomics'
import { slides as healthTechSlides } from '@/content/documents/health-tech-market'
import { slides as vibeSlides } from '@/content/documents/vibe-coding'

// Client component for print button
import PrintButton from './PrintButton'

export default async function DocumentExportPage({
  params,
}: {
  params: Promise<{ documentId: string }>
}) {
  // Await params in Next.js 15+
  const { documentId } = await params

  // Verify admin session
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

  const user = await currentUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.privateMetadata?.isAdmin === true ||
                  user.publicMetadata?.role === 'admin'

  if (!isAdmin) {
    redirect('/login')
  }

  // Get document metadata
  const document = DOCUMENT_CONFIGS.find(doc => doc.id === documentId)

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document not found</h1>
          <p className="text-gray-600">The requested document could not be found.</p>
        </div>
      </div>
    )
  }

  // Get slides for this document
  let slides: any[] = []
  switch (documentId) {
    case 'salmon-ai-genomics':
      slides = salmonSlides
      break
    case 'health-tech-market':
    case 'health-tech-market-2024':
      slides = healthTechSlides
      break
    case 'vibe-coding':
    case 'vibe-coding-in-enterprise-for-pe':
      slides = vibeSlides
      break
    default:
      slides = []
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: landscape;
          margin: 0.5in;
        }

        @media print {
          .page-break {
            page-break-after: always;
            break-after: page;
          }

          .no-print {
            display: none;
          }

          body {
            margin: 0;
            padding: 0;
          }
        }

        body {
          background: white;
        }

        .export-slide {
          height: 7.5in;
          width: 10in;
          margin: 0 auto 2rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }

        @media print {
          .export-slide {
            margin: 0;
            border: none;
            height: 7.5in;
            width: 10in;
          }
        }

        .slide-header {
          border-bottom: 2px solid #6b7556;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .slide-title {
          font-size: 2rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 0.5rem;
        }

        .slide-page-indicator {
          font-size: 1.25rem;
          font-weight: 400;
          color: #6b7556;
        }

        .title-slide-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 6.5in;
        }

        .slide-subtitle {
          font-size: 1.125rem;
          color: #2d2d2d;
        }

        .slide-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #000;
        }

        .content-section {
          margin-bottom: 1.5rem;
        }

        .section-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 0.75rem;
          padding-left: 0.75rem;
          border-left: 4px solid #6b7556;
        }

        .card-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .card-grid.cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }

        .card-grid.cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }

        .card-grid.cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }

        .card {
          padding: 1rem;
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
          background: #fff;
        }

        .card-title {
          font-weight: 600;
          color: #535d43;
          margin-bottom: 0.5rem;
        }

        .card-description {
          color: #2d2d2d;
          font-size: 0.9rem;
        }

        .card-icon {
          color: #6b7556;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        th {
          background: #f3f4f6;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #6b7556;
        }

        td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:nth-child(even) td {
          background: #f6f7f4;
        }

        tr:last-child td {
          border-bottom: none;
        }

        ul, ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        li {
          margin: 0.25rem 0;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .comparison-column {
          padding: 1rem;
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
        }

        .comparison-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          color: #535d43;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #6b7556;
        }

        .insight-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f6f7f4;
          border-left: 4px solid #6b7556;
          border-radius: 0.25rem;
        }

        .insight-label {
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #8a7969;
          margin-bottom: 0.5rem;
        }

        .insight-text {
          color: #000;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .metric-card {
          text-align: center;
          padding: 1rem;
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #6b7556;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #535d43;
          margin-bottom: 0.25rem;
        }

        .metric-sublabel {
          font-size: 0.75rem;
          color: #555;
        }

        .timeline-item {
          margin-bottom: 2rem;
          padding: 1rem;
          border-left: 3px solid #6b7556;
          padding-left: 1.5rem;
        }

        .timeline-header {
          margin-bottom: 0.5rem;
        }

        .timeline-date {
          font-size: 0.875rem;
          font-weight: 600;
          color: #8a7969;
        }

        .timeline-title {
          font-size: 1.125rem;
          font-weight: bold;
          color: #535d43;
          margin: 0.25rem 0;
        }

        .timeline-description {
          color: #2d2d2d;
          margin: 0.5rem 0;
        }

        .timeline-metrics {
          margin: 0.5rem 0;
          font-size: 0.875rem;
          color: #000;
        }

        /* Framework Styles */
        .framework-levels {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .framework-level {
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
          padding: 1rem;
          background: #fff;
        }

        .framework-level-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .framework-level-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          background: #6b7556;
          color: white;
          font-weight: bold;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .framework-level-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .framework-level-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #000;
        }

        .framework-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #f6f7f4;
          border: 1px solid #6b7556;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7556;
        }

        .framework-description {
          color: #2d2d2d;
          margin-bottom: 0.75rem;
        }

        .framework-details {
          background: #f6f7f4;
          border-left: 3px solid #6b7556;
          padding: 0.75rem;
          border-radius: 0.25rem;
        }

        .framework-detail-item {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .framework-detail-item:last-child {
          margin-bottom: 0;
        }

        /* KPI/Metrics Styles */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .kpi-card {
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
          padding: 1rem;
          background: #fff;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .kpi-icon {
          font-size: 1.25rem;
        }

        .kpi-title {
          font-weight: 600;
          color: #000;
        }

        .kpi-metric {
          color: #2d2d2d;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .kpi-targets {
          margin-bottom: 0.75rem;
        }

        .kpi-targets ul {
          margin-top: 0.25rem;
          font-size: 0.85rem;
        }

        .kpi-anchor {
          font-size: 0.8rem;
          color: #555;
          font-style: italic;
          background: #f6f7f4;
          padding: 0.5rem;
          border-radius: 0.25rem;
        }

        /* Case Study Styles */
        .case-study-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .case-study-metric {
          text-align: center;
          padding: 1rem;
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
          background: #f6f7f4;
        }

        .case-study-value {
          font-size: 2rem;
          font-weight: bold;
          color: #6b7556;
        }

        .case-study-label {
          font-weight: 600;
          color: #000;
          margin: 0.25rem 0;
        }

        .case-study-sublabel {
          font-size: 0.8rem;
          color: #555;
        }

        .case-study-source {
          font-size: 0.7rem;
          color: #777;
          margin-top: 0.25rem;
        }

        .case-study-sections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .case-study-section {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .case-study-section-title {
          font-weight: 600;
          color: #000;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #6b7556;
        }

        .case-study-anecdote {
          background: #f6f7f4;
          border-left: 4px solid #6b7556;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 0.25rem;
        }

        /* Sources Styles */
        .sources-container {
          columns: 2;
          column-gap: 2rem;
        }

        .sources-section {
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }

        .sources-section-title {
          font-weight: 600;
          color: #000;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid #6b7556;
        }

        .sources-list {
          padding-left: 1.5rem;
          margin: 0;
        }

        .sources-item {
          margin-bottom: 0.5rem;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .sources-text {
          color: #000;
        }

        .sources-url {
          display: block;
          color: #555;
          font-size: 0.7rem;
          word-break: break-all;
        }

        /* Stances Styles (AdoptionStancesDetailedSlide) */
        .stances-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .stance-card {
          border: 2px solid #6b7556;
          border-radius: 0.5rem;
          padding: 1rem;
          background: #fff;
        }

        .stance-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .stance-level {
          background: #6b7556;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .stance-title {
          font-weight: 600;
          color: #000;
        }

        .stance-subtitle {
          font-size: 0.875rem;
          color: #555;
          font-style: italic;
        }

        .stance-section {
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        .stance-section ul {
          margin: 0.25rem 0 0 0;
          padding-left: 1.25rem;
        }

        .stance-messaging {
          font-style: italic;
          color: #6b7556;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .stance-case-study {
          font-size: 0.8rem;
          background: #f6f7f4;
          padding: 0.5rem;
          border-radius: 0.25rem;
          margin-top: 0.5rem;
        }
      `}} />

      {/* Print instruction header (hidden on print) */}
      <div className="no-print bg-gray-50 border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{document.title} - Export</h1>
            <p className="text-sm text-gray-600 mt-1">
              Each slide is formatted as one landscape page. Press <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl+P</kbd> or{' '}
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">⌘+P</kbd> to print
            </p>
          </div>
          <PrintButton />
        </div>
      </div>

      {/* Slides */}
      <div className="py-8">
        {slides.flatMap((slide, slideIndex) => {
          const pageCount = getSlidePageCount(slide)
          const pages = []
          
          for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
            const isLastPage = pageIdx === pageCount - 1
            const isLastSlide = slideIndex === slides.length - 1
            const showPageBreak = !(isLastSlide && isLastPage)
            
            // Hide header for title/cover slides
            const isTitleSlide = slide.content?.type === 'title'
            
            pages.push(
              <div 
                key={`${slide.id}-page-${pageIdx}`} 
                className={`export-slide ${showPageBreak ? 'page-break' : ''}`}
              >
                {!isTitleSlide && (
                  <div className="slide-header">
                    <div className="text-xs text-gray-500 mb-2">
                      Slide {slideIndex + 1} of {slides.length}
                    </div>
                    <h2 className="slide-title">
                      {slide.title}
                      {pageCount > 1 && <span className="slide-page-indicator"> ({pageIdx + 1} of {pageCount})</span>}
                    </h2>
                  </div>
                )}

                <div className={`slide-content ${isTitleSlide ? 'title-slide-content' : ''}`}>
                  {renderSlideWithPagination(slide, pageIdx, pageCount)}
                </div>
              </div>
            )
          }
          
          return pages
        })}
      </div>
    </>
  )
}

// Helper to determine if content needs page breaks
function needsPageBreak(slide: any): { needsBreak: boolean; splitAt?: number } {
  const content = slide.content
  
  // Timeline with more than 2 items needs splitting
  if (content.type === 'custom' && content.props?.items && content.props.items.length > 2) {
    return { needsBreak: true, splitAt: 2 }
  }
  
  // Framework with more than 2 levels needs splitting
  if (content.type === 'framework' && content.levels && content.levels.length > 2) {
    return { needsBreak: true, splitAt: 2 }
  }
  
  // KPIs/Metrics with more than 4 items needs splitting
  if (content.type === 'metrics' && content.kpis && content.kpis.length > 4) {
    return { needsBreak: true, splitAt: 4 }
  }
  
  // Sources with more than 3 sections needs splitting
  if (content.type === 'sources' && content.sections && content.sections.length > 3) {
    return { needsBreak: true, splitAt: 3 }
  }
  
  // Stances with more than 2 items needs splitting
  if (content.type === 'custom' && content.componentId === 'AdoptionStancesDetailedSlide' && 
      content.props?.stances && content.props.stances.length > 2) {
    return { needsBreak: true, splitAt: 2 }
  }
  
  return { needsBreak: false }
}

// Render content with optional pagination
function renderSlideWithPagination(slide: any, pageIndex: number, totalPages: number): React.ReactNode {
  const content = slide.content
  const { needsBreak, splitAt } = needsPageBreak(slide)
  
  if (!needsBreak || splitAt === undefined) {
    return renderSlideContent(slide, undefined, undefined)
  }
  
  // Calculate start and end indices for this page
  let items: any[] = []
  let itemKey = ''
  
  if (content.type === 'framework' && content.levels) {
    items = content.levels
    itemKey = 'levels'
  } else if (content.type === 'metrics' && content.kpis) {
    items = content.kpis
    itemKey = 'kpis'
  } else if (content.type === 'sources' && content.sections) {
    items = content.sections
    itemKey = 'sections'
  } else if (content.type === 'custom' && content.componentId === 'AdoptionStancesDetailedSlide' && content.props?.stances) {
    items = content.props.stances
    itemKey = 'stances'
  } else if (content.type === 'custom' && content.props?.items) {
    items = content.props.items
    itemKey = 'items'
  }
  
  const startIdx = pageIndex * splitAt
  const endIdx = Math.min(startIdx + splitAt, items.length)
  
  return renderSlideContent(slide, startIdx, endIdx)
}

// Calculate how many pages a slide needs
function getSlidePageCount(slide: any): number {
  const content = slide.content
  const { needsBreak, splitAt } = needsPageBreak(slide)
  
  if (!needsBreak || splitAt === undefined) return 1
  
  let itemCount = 0
  if (content.type === 'framework' && content.levels) {
    itemCount = content.levels.length
  } else if (content.type === 'metrics' && content.kpis) {
    itemCount = content.kpis.length
  } else if (content.type === 'sources' && content.sections) {
    itemCount = content.sections.length
  } else if (content.type === 'custom' && content.componentId === 'AdoptionStancesDetailedSlide' && content.props?.stances) {
    itemCount = content.props.stances.length
  } else if (content.type === 'custom' && content.props?.items) {
    itemCount = content.props.items.length
  }
  
  return Math.ceil(itemCount / splitAt)
}

function renderSlideContent(slide: any, startIdx?: number, endIdx?: number) {
  const content = slide.content

  switch (content.type) {
    case 'title':
      return (
        <div className="text-center py-8">
          {content.badge && (
            <div className="inline-block px-4 py-2 bg-sage-50 border-2 border-sage rounded-full text-sm font-medium mb-4" style={{background: '#f6f7f4', borderColor: '#6b7556', color: '#535d43'}}>
              {content.badge}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4" style={{color: '#535d43'}}>{content.headline}</h1>
          {content.subtitle && <p className="text-xl mb-6" style={{color: '#6b7556'}}>{content.subtitle}</p>}

          {content.metrics && content.metrics.length > 0 && (
            <div className="metrics-grid">
              {content.metrics.map((metric: any, i: number) => (
                <div key={i} className="metric-card">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                  {metric.sublabel && <div className="metric-sublabel">{metric.sublabel}</div>}
                </div>
              ))}
            </div>
          )}

          {content.insightBox && (
            <div className="insight-box mt-8">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </div>
      )

    case 'grid':
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {content.description && <p className="text-gray-600 mb-4">{content.description}</p>}

          {content.headerSection && (
            <div className="content-section">
              <h4 className="font-semibold mb-2">{content.headerSection.heading}</h4>
              <ul>
                {content.headerSection.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`card-grid cols-${content.columns || 3}`}>
            {content.items.map((item: any, i: number) => (
              <div key={i} className="card">
                {item.title && <div className="card-title">{item.title}</div>}
                {item.subtitle && <div className="text-sm text-gray-500 mb-2">{item.subtitle}</div>}
                {item.description && <div className="card-description">{item.description}</div>}
                {item.items && (
                  <ul className="mt-2">
                    {item.items.map((listItem: string, j: number) => (
                      <li key={j} className="text-sm">{listItem}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {content.insightBox && (
            <div className="insight-box">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </>
      )

    case 'comparison':
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {content.description && <p className="text-gray-600 mb-4">{content.description}</p>}

          <div className="comparison-grid">
            <div className="comparison-column">
              <div className="comparison-title">{content.left.title}</div>
              <ul>
                {content.left.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="comparison-column">
              <div className="comparison-title">{content.right.title}</div>
              <ul>
                {content.right.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {content.insightBox && (
            <div className="insight-box">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </>
      )

    case 'table':
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {content.description && <p className="text-gray-600 mb-4">{content.description}</p>}

          <table>
            <thead>
              <tr>
                {content.headers.map((header: string, i: number) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row: string[], i: number) => (
                <tr key={i}>
                  {row.map((cell: string, j: number) => (
                    <td key={j} className={content.highlightFirstColumn && j === 0 ? 'font-semibold' : ''}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {content.insightBox && (
            <div className="insight-box">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </>
      )

    case 'list':
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {content.description && <p className="text-gray-600 mb-4">{content.description}</p>}

          {content.groups.map((group: any, i: number) => (
            <div key={i} className="content-section">
              {group.title && <h4 className="font-semibold mb-2">{group.title}</h4>}
              <ul>
                {group.items.map((item: any, j: number) => (
                  <li key={j}>
                    {item.text}
                    {item.subtext && <div className="text-sm text-gray-600 mt-1">{item.subtext}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {content.insightBox && (
            <div className="insight-box">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </>
      )

    case 'framework':
      const frameworkLevels = content.levels || []
      const displayLevels = (startIdx !== undefined && endIdx !== undefined)
        ? frameworkLevels.slice(startIdx, endIdx)
        : frameworkLevels
      return (
        <>
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {startIdx !== undefined && startIdx > 0 && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}
          <div className="framework-levels">
            {displayLevels.map((level: any, i: number) => (
              <div key={i} className="framework-level">
                <div className="framework-level-header">
                  <span className="framework-level-number">{level.level}</span>
                  <div className="framework-level-title-group">
                    <span className="framework-level-title">{level.title}</span>
                    {level.badge && <span className="framework-badge">{level.badge}</span>}
                  </div>
                </div>
                <p className="framework-description">{level.description}</p>
                {level.details && (
                  <div className="framework-details">
                    {level.details.whenToUse && (
                      <div className="framework-detail-item">
                        <strong>When to Use:</strong> {level.details.whenToUse}
                      </div>
                    )}
                    {level.details.risk && (
                      <div className="framework-detail-item">
                        <strong>Risk:</strong> {level.details.risk}
                      </div>
                    )}
                    {level.details.outcome && (
                      <div className="framework-detail-item">
                        <strong>Outcome:</strong> {level.details.outcome}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )

    case 'metrics':
      const allKpis = content.kpis || []
      const displayKpis = (startIdx !== undefined && endIdx !== undefined)
        ? allKpis.slice(startIdx, endIdx)
        : allKpis
      return (
        <>
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {startIdx !== undefined && startIdx > 0 && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}
          <div className="kpi-grid">
            {displayKpis.map((kpi: any, i: number) => (
              <div key={i} className="kpi-card">
                <div className="kpi-header">
                  <span className="kpi-icon">📊</span>
                  <span className="kpi-title">{kpi.title}</span>
                </div>
                <div className="kpi-metric">{kpi.metric}</div>
                {kpi.target && kpi.target.length > 0 && (
                  <div className="kpi-targets">
                    <strong>Targets:</strong>
                    <ul>
                      {kpi.target.map((t: string, j: number) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {kpi.marketAnchor && (
                  <div className="kpi-anchor">{kpi.marketAnchor}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )

    case 'case-study':
      return (
        <>
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          
          {content.metrics && content.metrics.length > 0 && (
            <div className="case-study-metrics">
              {content.metrics.map((metric: any, i: number) => (
                <div key={i} className="case-study-metric">
                  <div className="case-study-value">{metric.value}</div>
                  <div className="case-study-label">{metric.label}</div>
                  {metric.sublabel && <div className="case-study-sublabel">{metric.sublabel}</div>}
                  {metric.source && <div className="case-study-source">{metric.source}</div>}
                </div>
              ))}
            </div>
          )}

          {content.sections && content.sections.length > 0 && (
            <div className="case-study-sections">
              {content.sections.map((section: any, i: number) => (
                <div key={i} className="case-study-section">
                  <h4 className="case-study-section-title">{section.title}</h4>
                  <ul>
                    {section.items.map((item: string, j: number) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {content.anecdote && (
            <div className="case-study-anecdote">
              <div className="insight-label">{content.anecdote.label}</div>
              <div className="insight-text">{content.anecdote.text}</div>
            </div>
          )}

          {content.insightBox && (
            <div className="insight-box">
              <div className="insight-label">{content.insightBox.label}</div>
              <div className="insight-text">{content.insightBox.text}</div>
            </div>
          )}
        </>
      )

    case 'sources':
      const allSections = content.sections || []
      const displaySections = (startIdx !== undefined && endIdx !== undefined)
        ? allSections.slice(startIdx, endIdx)
        : allSections
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {startIdx !== undefined && startIdx > 0 && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}
          
          <div className="sources-container">
            {displaySections.map((section: any, i: number) => (
              <div key={i} className="sources-section">
                <h4 className="sources-section-title">{section.title}</h4>
                <ol className="sources-list" start={section.startNumber || 1}>
                  {section.items.map((item: any, j: number) => (
                    <li key={j} className="sources-item">
                      <span className="sources-text">{item.text}</span>
                      {item.url && <span className="sources-url">[{item.url}]</span>}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </>
      )

    case 'custom':
      // Handle specific custom component types
      if (content.componentId === 'AdoptionStancesDetailedSlide' && content.props?.stances) {
        const allStances = content.props.stances
        const displayStances = (startIdx !== undefined && endIdx !== undefined)
          ? allStances.slice(startIdx, endIdx)
          : allStances
        return (
          <>
            {content.props.heading && <h3 className="section-heading">{content.props.heading}</h3>}
            {startIdx !== undefined && startIdx > 0 && (
              <div className="text-sm text-gray-500 mb-2">(continued)</div>
            )}
            <div className="stances-container">
              {displayStances.map((stance: any, i: number) => (
                <div key={i} className="stance-card">
                  <div className="stance-header">
                    <span className="stance-level">Level {stance.level}</span>
                    <span className="stance-title">{stance.title}</span>
                    {stance.subtitle && <span className="stance-subtitle">{stance.subtitle}</span>}
                  </div>
                  {stance.characteristics && (
                    <div className="stance-section">
                      <strong>Characteristics:</strong>
                      <ul>
                        {stance.characteristics.map((c: string, j: number) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stance.messaging && (
                    <div className="stance-messaging">{stance.messaging}</div>
                  )}
                  {stance.changeMgmt && (
                    <div className="stance-section"><strong>Change Management:</strong> {stance.changeMgmt}</div>
                  )}
                  {stance.risks && (
                    <div className="stance-section"><strong>Risks:</strong> {stance.risks}</div>
                  )}
                  {stance.implications && (
                    <div className="stance-section">
                      <strong>Implications:</strong>
                      <ul>
                        {stance.implications.map((imp: string, j: number) => (
                          <li key={j}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stance.caseStudy && (
                    <div className="stance-case-study">{stance.caseStudy}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )
      }

      // Handle timeline items (default custom behavior)
      const allItems = content.props?.items || []
      const displayItems = (startIdx !== undefined && endIdx !== undefined)
        ? allItems.slice(startIdx, endIdx)
        : allItems
      return (
        <>
          {content.props?.heading && (
            <h3 className="section-heading mb-4">{content.props.heading}</h3>
          )}
          {startIdx !== undefined && startIdx > 0 && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}

          {displayItems.length > 0 && (
            <div className="content-section">
              {displayItems.map((item: any, i: number) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-header">
                    <div className="timeline-date">{item.date} • {item.source}</div>
                    <h4 className="timeline-title">{item.title}</h4>
                  </div>
                  <p className="timeline-description">{item.description}</p>
                  {item.metrics && item.metrics.length > 0 && (
                    <div className="timeline-metrics">
                      <strong>Key Metrics:</strong>
                      <ul style={{marginTop: '0.25rem', paddingLeft: '1.5rem'}}>
                        {item.metrics.map((metric: string, j: number) => (
                          <li key={j}>{metric}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.anecdote && (
                    <p className="timeline-description" style={{fontStyle: 'italic', marginTop: '0.5rem'}}>
                      {item.anecdote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {content.props?.regions && (
            <div className="content-section">
              <ul>
                {content.props.regions.map((region: any, i: number) => (
                  <li key={i} className="mb-3">
                    <strong>{region.name}:</strong> {region.description}
                  </li>
                ))}
              </ul>
              {content.props.note && (
                <div className="insight-box mt-4">
                  <div className="insight-label">Note</div>
                  <div className="insight-text">{content.props.note}</div>
                </div>
              )}
            </div>
          )}
        </>
      )

    default:
      return (
        <div className="text-gray-500">
          [Content type "{content.type}" - render not yet implemented for export]
        </div>
      )
  }
}
