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
          min-height: 7.5in;
          width: 10in;
          margin: 0 auto 2rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
        }

        @media print {
          .export-slide {
            margin: 0;
            border: none;
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
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .slide-subtitle {
          font-size: 1.125rem;
          color: #666;
        }

        .slide-content {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #333;
        }

        .content-section {
          margin-bottom: 1.5rem;
        }

        .section-heading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
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
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #f9fafb;
        }

        .card-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .card-description {
          color: #666;
          font-size: 0.9rem;
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
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .comparison-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .insight-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #f0f4f0;
          border-left: 4px solid #6b7556;
          border-radius: 0.25rem;
        }

        .insight-label {
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7556;
          margin-bottom: 0.5rem;
        }

        .insight-text {
          color: #333;
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
        {slides.map((slide, index) => (
          <div key={slide.id} className={`export-slide ${index < slides.length - 1 ? 'page-break' : ''}`}>
            <div className="slide-header">
              <div className="text-xs text-gray-500 mb-2">
                Slide {index + 1} of {slides.length}
              </div>
              <h2 className="slide-title">{slide.title}</h2>
            </div>

            <div className="slide-content">
              {renderSlideContent(slide)}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function renderSlideContent(slide: any) {
  const content = slide.content

  switch (content.type) {
    case 'title':
      return (
        <div className="text-center py-8">
          {content.badge && (
            <div className="inline-block px-4 py-1 bg-sage/10 text-sage rounded-full text-sm font-medium mb-4">
              {content.badge}
            </div>
          )}
          <h1 className="text-4xl font-light mb-4">{content.headline}</h1>
          {content.subtitle && <p className="text-xl text-gray-600">{content.subtitle}</p>}
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

    case 'custom':
      return (
        <>
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
