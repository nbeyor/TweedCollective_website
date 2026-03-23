import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'

// Import document registry
import { DOCUMENT_CONFIGS } from '@/content/documents'

// Dynamic document content loader (no hardcoded slide imports)
import { loadDocumentContent } from '@/content/documents/loader'

// Import design system
import { spacing, typography, colors } from '@/lib/slideTemplates'

// Client components
import PrintButton from './PrintButton'
import ExportCustomSlide from './ExportCustomSlide'


// Design system values for CSS (extracted for inline styles)
const exportStyles = {
  // Spacing
  pagePadding: spacing[6],           // 1.5rem
  cardPadding: spacing[3],           // 0.75rem
  cardGap: spacing[3],               // 0.75rem
  sectionMargin: spacing[5],         // 1.25rem
  elementGap: spacing[4],            // 1rem
  tightGap: spacing[2],              // 0.5rem
  
  // Typography
  bodySize: typography.sizes.sm,     // 0.875rem
  smallSize: '0.8125rem',            // slightly smaller
  xsSize: typography.sizes.xs,       // 0.75rem
  headingSize: typography.sizes.xl,  // 1.25rem
  titleSize: typography.sizes['2xl'], // 1.5rem
  lineHeight: typography.lineHeights.normal, // 1.5
  
  // Colors
  sage500: colors.sage[500],         // #6b7556
  sage600: colors.sage[600],         // #535d43
  sage50: colors.sage[50],           // #f6f7f4
  taupe600: colors.taupe[600],       // #8a7969
}

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

  // Dynamically load slides for this document (no hardcoded map)
  const slides = await loadDocumentContent(documentId) || []

  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No export content</h1>
          <p className="text-gray-600">This document has no exportable slide content.</p>
        </div>
      </div>
    )
  }

  return (
    <div data-export-view>
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide website header and footer on export page */
        header,
        nav[role="navigation"],
        footer,
        [data-testid="header"],
        [data-testid="footer"] {
          display: none !important;
        }

        /* Ensure layout wrapper doesn't interfere */
        body > div {
          min-height: auto !important;
          display: block !important;
        }

        /* Ensure main content takes full viewport */
        main {
          padding: 0 !important;
          margin: 0 !important;
          flex-grow: 0 !important;
        }

        body {
          background: white;
          padding: 0 !important;
          margin: 0 !important;
        }

        /* Override global dark theme for export context */
        [data-export-view] h1,
        [data-export-view] h2,
        [data-export-view] h3,
        [data-export-view] h4,
        [data-export-view] h5,
        [data-export-view] h6 {
          color: #000;
        }

        [data-export-view] p {
          color: #333;
        }

        @page {
          size: 11in 8.5in;
          margin: 0.5in;
        }

        @media print {
          /* Hide header and footer in print */
          header,
          nav[role="navigation"],
          footer,
          [data-testid="header"],
          [data-testid="footer"] {
            display: none !important;
          }

          /* Ensure layout wrapper doesn't interfere */
          body > div {
            min-height: auto !important;
            display: block !important;
          }

          .no-print {
            display: none;
          }

          body {
            margin: 0;
            padding: 0;
          }

          main {
            padding: 0 !important;
            margin: 0 !important;
            flex-grow: 0 !important;
          }
        }

        /* Container: zero padding in print to prevent blank page artifacts */
        .export-pages-container {
          padding: 2rem 0;
        }

        @media print {
          .export-pages-container {
            padding: 0 !important;
            margin: 0 !important;
          }

          /* Only apply page-break-after to non-last slides */
          .export-slide.page-break {
            page-break-after: always;
            break-after: page;
          }

          /* Ensure last slide never forces a trailing break */
          .export-slide:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
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
            max-height: 7.5in;
            width: 10in;
            overflow: hidden;
          }
        }

        .slide-header {
          border-bottom: 2px solid #6b7556;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
        }

        .slide-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 0.25rem;
        }

        .slide-page-indicator {
          font-size: 1rem;
          font-weight: 400;
          color: #6b7556;
        }

        .title-slide-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: calc(7.5in - 3rem);
          max-height: calc(7.5in - 3rem);
          overflow: hidden;
        }

        .slide-subtitle {
          font-size: 1rem;
          color: #2d2d2d;
        }

        .slide-content {
          font-size: 0.875rem;
          line-height: 1.5;
          color: #000;
        }

        .content-section {
          margin-bottom: 1rem;
        }

        .section-heading {
          font-size: 1.125rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
          border-left: 3px solid #6b7556;
        }

        .card-grid {
          display: grid;
          gap: 0.75rem;
          margin-top: 0.75rem;
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

        .export-card {
          padding: 0.75rem;
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
          background: #fff;
        }

        .export-card-title {
          font-weight: 600;
          font-size: 0.875rem;
          color: #535d43;
          margin-bottom: 0.375rem;
        }

        .export-card-description {
          color: #2d2d2d;
          font-size: 0.8125rem;
        }

        .export-card-icon {
          color: #6b7556;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.75rem;
        }

        th {
          background: #f3f4f6;
          padding: 0.5rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.8125rem;
          border-bottom: 2px solid #6b7556;
        }

        td {
          padding: 0.5rem;
          font-size: 0.8125rem;
          border-bottom: 1px solid #e5e7eb;
        }

        tr:nth-child(even) td {
          background: #f6f7f4;
        }

        tr:last-child td {
          border-bottom: none;
        }

        ul, ol {
          margin: 0.25rem 0;
          padding-left: 1.25rem;
        }

        li {
          margin: 0.125rem 0;
          font-size: 0.8125rem;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 0.75rem;
        }

        .comparison-column {
          padding: 0.75rem;
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
        }

        .comparison-title {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: #535d43;
          padding-bottom: 0.375rem;
          border-bottom: 2px solid #6b7556;
        }

        .insight-box {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f6f7f4;
          border-left: 3px solid #6b7556;
          border-radius: 0.25rem;
        }

        .insight-label {
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #8a7969;
          margin-bottom: 0.25rem;
        }

        .insight-text {
          color: #000;
          font-size: 0.8125rem;
          line-height: 1.4;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        .metric-card {
          text-align: center;
          padding: 0.75rem;
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #6b7556;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #535d43;
          margin-bottom: 0.125rem;
        }

        .metric-sublabel {
          font-size: 0.6875rem;
          color: #555;
        }

        .timeline-item {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-left: 2px solid #6b7556;
          padding-left: 1rem;
        }

        .timeline-header {
          margin-bottom: 0.25rem;
        }

        .timeline-date {
          font-size: 0.75rem;
          font-weight: 600;
          color: #8a7969;
        }

        .timeline-title {
          font-size: 0.9375rem;
          font-weight: bold;
          color: #535d43;
          margin: 0.125rem 0;
        }

        .timeline-description {
          color: #2d2d2d;
          margin: 0.25rem 0;
          font-size: 0.8125rem;
        }

        .timeline-metrics {
          margin: 0.25rem 0;
          font-size: 0.75rem;
          color: #000;
        }

        /* Framework Styles */
        .framework-levels {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .framework-level {
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
          padding: 0.625rem;
          background: #fff;
        }

        .framework-level-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.375rem;
        }

        .framework-level-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          background: #6b7556;
          color: white;
          font-weight: bold;
          font-size: 0.75rem;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .framework-level-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .framework-level-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #000;
        }

        .framework-badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          background: #f6f7f4;
          border: 1px solid #6b7556;
          border-radius: 1rem;
          font-size: 0.6875rem;
          font-weight: 600;
          color: #6b7556;
        }

        .framework-description {
          color: #2d2d2d;
          margin-bottom: 0.375rem;
          font-size: 0.8125rem;
        }

        .framework-details {
          background: #f6f7f4;
          border-left: 2px solid #6b7556;
          padding: 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }

        .framework-detail-item {
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
        }

        .framework-detail-item:last-child {
          margin-bottom: 0;
        }

        /* KPI/Metrics Styles */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.625rem;
          margin-top: 0.5rem;
        }

        .kpi-card {
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
          padding: 0.625rem;
          background: #fff;
        }

        .kpi-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.25rem;
        }

        .kpi-icon {
          font-size: 1rem;
        }

        .kpi-title {
          font-weight: 600;
          font-size: 0.8125rem;
          color: #000;
        }

        .kpi-metric {
          color: #2d2d2d;
          font-size: 0.75rem;
          margin-bottom: 0.375rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .kpi-targets {
          margin-bottom: 0.375rem;
          font-size: 0.75rem;
        }

        .kpi-targets ul {
          margin-top: 0.125rem;
          font-size: 0.75rem;
        }

        .kpi-anchor {
          font-size: 0.6875rem;
          color: #555;
          font-style: italic;
          background: #f6f7f4;
          padding: 0.375rem;
          border-radius: 0.25rem;
        }

        /* Case Study Styles */
        .case-study-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .case-study-metric {
          text-align: center;
          padding: 0.625rem;
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
          background: #f6f7f4;
        }

        .case-study-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #6b7556;
        }

        .case-study-label {
          font-weight: 600;
          font-size: 0.75rem;
          color: #000;
          margin: 0.125rem 0;
        }

        .case-study-sublabel {
          font-size: 0.6875rem;
          color: #555;
        }

        .case-study-source {
          font-size: 0.625rem;
          color: #777;
          margin-top: 0.125rem;
        }

        .case-study-sections {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .case-study-section {
          padding: 0.625rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }

        .case-study-section-title {
          font-weight: 600;
          font-size: 0.8125rem;
          color: #000;
          margin-bottom: 0.375rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid #6b7556;
        }

        .case-study-anecdote {
          background: #f6f7f4;
          border-left: 3px solid #6b7556;
          padding: 0.625rem;
          margin-bottom: 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.8125rem;
        }

        /* Sources Styles */
        .sources-container {
          columns: 2;
          column-gap: 1.5rem;
        }

        .sources-section {
          break-inside: avoid;
          margin-bottom: 0.75rem;
        }

        .sources-section-title {
          font-weight: 600;
          font-size: 0.8125rem;
          color: #000;
          margin-bottom: 0.25rem;
          padding-bottom: 0.125rem;
          border-bottom: 2px solid #6b7556;
        }

        .sources-list {
          padding-left: 1rem;
          margin: 0;
        }

        .sources-item {
          margin-bottom: 0.25rem;
          font-size: 0.6875rem;
          line-height: 1.35;
        }

        .sources-text {
          color: #000;
        }

        .sources-url {
          display: block;
          color: #555;
          font-size: 0.625rem;
          word-break: break-all;
        }

        /* Stances Styles (AdoptionStancesDetailedSlide) */
        .stances-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.625rem;
        }

        .stance-card {
          border: 1px solid #6b7556;
          border-radius: 0.375rem;
          padding: 0.625rem;
          background: #fff;
        }

        .stance-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.375rem;
          padding-bottom: 0.375rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .stance-level {
          background: #6b7556;
          color: white;
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
        }

        .stance-title {
          font-weight: 600;
          font-size: 0.8125rem;
          color: #000;
        }

        .stance-subtitle {
          font-size: 0.75rem;
          color: #555;
          font-style: italic;
        }

        .stance-section {
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
        }

        .stance-section ul {
          margin: 0.125rem 0 0 0;
          padding-left: 1rem;
        }

        .stance-messaging {
          font-style: italic;
          color: #6b7556;
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
        }

        .stance-case-study {
          font-size: 0.6875rem;
          background: #f6f7f4;
          padding: 0.375rem;
          border-radius: 0.25rem;
          margin-top: 0.5rem;
        }

        /* Hide SectionHeader (first child div containing h2) in export custom slides
           since the title is already shown in .slide-header above */
        .export-custom-slide > div > div:first-child:has(> h2) {
          display: none;
        }

        /* B&W overrides for custom slide components (diligence, etc.) */
        .export-custom-slide {
          color: #000;
          background: #fff;
          font-size: 0.8125rem;
          line-height: 1.4;
          max-height: 100%;
          overflow: hidden;
        }

        /* Print break hints — only on small atomic elements */
        .export-custom-slide li,
        .export-custom-slide tr,
        .export-custom-slide .export-card,
        .export-custom-slide .kpi-card,
        .export-custom-slide .stance-card,
        .export-custom-slide .framework-level,
        .export-custom-slide .metric-card {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* Override dark backgrounds to white/light */
        .export-custom-slide,
        .export-custom-slide div,
        .export-custom-slide section,
        .export-custom-slide article,
        .export-custom-slide aside,
        .export-custom-slide header,
        .export-custom-slide footer {
          background-color: #fff !important;
          background-image: none !important;
        }

        /* Light accent backgrounds for visual hierarchy */
        .export-custom-slide [class*="bg-emerald"],
        .export-custom-slide [class*="bg-green"],
        .export-custom-slide [class*="bg-teal"],
        .export-custom-slide [class*="bg-cyan"] {
          background-color: #f0f0f0 !important;
        }

        .export-custom-slide [class*="bg-red"],
        .export-custom-slide [class*="bg-rose"],
        .export-custom-slide [class*="bg-orange"],
        .export-custom-slide [class*="bg-amber"],
        .export-custom-slide [class*="bg-yellow"] {
          background-color: #f5f5f5 !important;
        }

        /* All text to dark/black */
        .export-custom-slide,
        .export-custom-slide * {
          color: #000 !important;
        }

        .export-custom-slide [class*="text-gray"],
        .export-custom-slide [class*="text-neutral"],
        .export-custom-slide [class*="text-slate"] {
          color: #333 !important;
        }

        /* Borders to visible gray */
        .export-custom-slide [class*="border"] {
          border-color: #999 !important;
        }

        .export-custom-slide [class*="divide"] > * + * {
          border-color: #ccc !important;
        }

        /* Ensure headings stand out */
        .export-custom-slide h1,
        .export-custom-slide h2,
        .export-custom-slide h3,
        .export-custom-slide h4 {
          color: #000 !important;
          font-weight: 600;
        }

        /* Scale down content for print density */
        .export-custom-slide p,
        .export-custom-slide li,
        .export-custom-slide td,
        .export-custom-slide th,
        .export-custom-slide span {
          font-size: 0.75rem !important;
          line-height: 1.35 !important;
        }

        .export-custom-slide h2 {
          font-size: 1.125rem !important;
        }

        .export-custom-slide h3 {
          font-size: 0.9375rem !important;
        }

        .export-custom-slide h4 {
          font-size: 0.8125rem !important;
        }

        /* Make badges/pills readable */
        .export-custom-slide [class*="rounded-full"],
        .export-custom-slide [class*="badge"],
        .export-custom-slide [class*="pill"],
        .export-custom-slide [class*="tag"] {
          background-color: #f0f0f0 !important;
          color: #000 !important;
          border: 1px solid #999 !important;
        }

        /* Charts: invert for readability on white */
        .export-custom-slide canvas {
          filter: invert(1) hue-rotate(180deg);
          max-height: 150px;
        }

        /* Tables */
        .export-custom-slide table {
          border-collapse: collapse;
          width: 100%;
        }

        .export-custom-slide th {
          background-color: #f0f0f0 !important;
          border-bottom: 2px solid #000 !important;
          font-size: 0.75rem !important;
          padding: 0.375rem !important;
        }

        .export-custom-slide td {
          border-bottom: 1px solid #ccc !important;
          padding: 0.375rem !important;
        }

        /* Force responsive grid layouts to apply in print
           (Tailwind md: breakpoint doesn't fire at print viewport width) */
        .export-custom-slide .grid {
          display: grid !important;
        }

        .export-custom-slide [class*="md\\:grid-cols-2"] {
          grid-template-columns: repeat(2, 1fr) !important;
        }

        .export-custom-slide [class*="md\\:grid-cols-3"] {
          grid-template-columns: repeat(3, 1fr) !important;
        }

        .export-custom-slide [class*="md\\:grid-cols-4"] {
          grid-template-columns: repeat(4, 1fr) !important;
        }

        /* Reduce spacing for print density */
        .export-custom-slide [class*="gap-"] {
          gap: 0.5rem !important;
        }

        .export-custom-slide [class*="p-4"],
        .export-custom-slide [class*="p-5"],
        .export-custom-slide [class*="p-6"],
        .export-custom-slide [class*="p-8"] {
          padding: 0.5rem !important;
        }

        .export-custom-slide [class*="mb-4"],
        .export-custom-slide [class*="mb-6"],
        .export-custom-slide [class*="mb-8"] {
          margin-bottom: 0.375rem !important;
        }

        .export-custom-slide [class*="mt-4"],
        .export-custom-slide [class*="mt-6"],
        .export-custom-slide [class*="mt-8"] {
          margin-top: 0.375rem !important;
        }

        /* SVG icons to black */
        .export-custom-slide svg {
          color: #000 !important;
          stroke: #000 !important;
        }

        /* Hide decorative shadows/glows */
        .export-custom-slide [class*="shadow"],
        .export-custom-slide [class*="glow"] {
          box-shadow: none !important;
        }

        .export-custom-slide [class*="ring"] {
          box-shadow: none !important;
        }

        /* Opacity overrides — ensure everything is fully visible */
        .export-custom-slide [class*="opacity-"] {
          opacity: 1 !important;
        }

        /* Backdrop/blur overrides */
        .export-custom-slide [class*="backdrop"] {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          background-color: #f5f5f5 !important;
        }

        /* === Print-safe visibility overrides === */
        /* Disable all animations and transitions in export/print */
        [data-export-view] *,
        [data-export-view] *::before,
        [data-export-view] *::after {
          animation: none !important;
          transition: none !important;
        }

        /* Force full opacity on everything */
        [data-export-view] [class*="opacity-"],
        [data-export-view] .animate-fade-up,
        [data-export-view] .animate-fade-in {
          opacity: 1 !important;
        }

        /* Neutralize transforms that can hide content */
        [data-export-view] .animate-fade-up,
        [data-export-view] .animate-fade-in {
          transform: none !important;
        }

        /* Webkit text fill color safeguard */
        [data-export-view] * {
          -webkit-text-fill-color: currentColor !important;
        }

        /* Neutralize filters that hide content (except chart inversions) */
        [data-export-view] [class*="blur"],
        [data-export-view] [class*="backdrop"] {
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        @media print {
          /* Double-down: force visibility in print context */
          * {
            animation: none !important;
            transition: none !important;
          }

          [class*="opacity-"],
          .animate-fade-up,
          .animate-fade-in {
            opacity: 1 !important;
          }

          .animate-fade-up,
          .animate-fade-in {
            transform: none !important;
          }
        }

        /* Dev-time overflow warning: screen-only indicator for slides that exceed page height */
        @media screen {
          .export-slide[data-overflow="true"] {
            outline: 3px solid #dc2626;
          }
          .export-slide[data-overflow="true"]::after {
            content: 'Content exceeds page — split this slide';
            position: absolute;
            bottom: 0;
            right: 0;
            background: #dc2626;
            color: white;
            padding: 2px 8px;
            font-size: 12px;
            z-index: 10;
          }
        }
      `}} />

      {/* Client-side overflow detection script (screen preview only) */}
      <script dangerouslySetInnerHTML={{__html: `
        if (typeof window !== 'undefined' && !window.matchMedia('print').matches) {
          requestAnimationFrame(function checkOverflow() {
            document.querySelectorAll('.export-slide').forEach(function(slide) {
              slide.setAttribute('data-overflow',
                slide.scrollHeight > slide.clientHeight ? 'true' : 'false'
              );
            });
          });
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

      {/* Slides — rendered from normalized ExportPage model */}
      <div className="export-pages-container">
        {buildExportPages(slides).map((page, idx, allPages) => {
          const isLast = idx === allPages.length - 1

          return (
            <div
              key={page.key}
              className={`export-slide${!isLast ? ' page-break' : ''}`}
            >
              {!page.isTitleSlide && (
                <div className="slide-header">
                  <div className="text-xs text-gray-500 mb-2">
                    Slide {page.slideNumber} of {page.totalSlides}
                  </div>
                  <h2 className="slide-title">
                    {page.slideTitle}
                    {page.pageCount > 1 && (
                      <span className="slide-page-indicator"> ({page.pageIndex + 1} of {page.pageCount})</span>
                    )}
                  </h2>
                </div>
              )}

              <div className={`slide-content${page.isTitleSlide ? ' title-slide-content' : ''}`}>
                {page.render()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// ExportPage Model — normalized page representation for deterministic rendering
// =============================================================================

interface ExportPage {
  key: string
  slideId: string
  slideTitle: string
  slideNumber: number
  totalSlides: number
  pageIndex: number
  pageCount: number
  isTitleSlide: boolean
  render: () => React.ReactNode
}

/**
 * Build a flat array of ExportPages from slide data.
 * Each entry maps to exactly one printed page. No empty pages are produced.
 */
function buildExportPages(slides: any[]): ExportPage[] {
  const pages: ExportPage[] = []

  for (let si = 0; si < slides.length; si++) {
    const slide = slides[si]
    const content = slide.content
    const isTitleSlide = content?.type === 'title'
    const slideNumber = si + 1

    // --- Standard type chunking ---
    const chunking = getStandardChunking(slide)

    if (chunking) {
      const { items, splitAt, type } = chunking
      const pageCount = Math.ceil(items.length / splitAt)

      for (let pi = 0; pi < pageCount; pi++) {
        const startIdx = pi * splitAt
        const endIdx = Math.min(startIdx + splitAt, items.length)
        const capturedStart = startIdx
        const capturedEnd = endIdx

        pages.push({
          key: `${slide.id}-chunk-${pi}`,
          slideId: slide.id,
          slideTitle: content?.props?.heading || slide.title,
          slideNumber,
          totalSlides: slides.length,
          pageIndex: pi,
          pageCount,
          isTitleSlide: false,
          render: () => renderSlideContent(slide, capturedStart, capturedEnd),
        })
      }
      continue
    }

    // --- Table pagination ---
    if (content?.type === 'table' && content.rows && content.rows.length > MAX_TABLE_ROWS) {
      const pageCount = Math.ceil(content.rows.length / MAX_TABLE_ROWS)

      for (let pi = 0; pi < pageCount; pi++) {
        const capturedPi = pi
        pages.push({
          key: `${slide.id}-table-${pi}`,
          slideId: slide.id,
          slideTitle: slide.title,
          slideNumber,
          totalSlides: slides.length,
          pageIndex: pi,
          pageCount,
          isTitleSlide: false,
          render: () => renderTablePage(slide, capturedPi),
        })
      }
      continue
    }

    // --- Custom slide fallback (single page, no adapter) ---
    if (content?.type === 'custom' && content.componentId &&
        !content.props?.items && !content.props?.regions &&
        content.componentId !== 'AdoptionStancesDetailedSlide') {
      pages.push({
        key: `${slide.id}-custom`,
        slideId: slide.id,
        slideTitle: content.props?.heading || slide.title,
        slideNumber,
        totalSlides: slides.length,
        pageIndex: 0,
        pageCount: 1,
        isTitleSlide: false,
        render: () => (
          <ExportCustomSlide
            componentId={content.componentId}
            props={content.props || {}}
          />
        ),
      })
      continue
    }

    // --- Single page (title slides, simple content, etc.) ---
    pages.push({
      key: `${slide.id}-single`,
      slideId: slide.id,
      slideTitle: slide.title,
      slideNumber,
      totalSlides: slides.length,
      pageIndex: 0,
      pageCount: 1,
      isTitleSlide,
      render: () => renderSlideContent(slide, undefined, undefined),
    })
  }

  // Filter out any pages with zero-content chunks (safety net)
  return pages.filter((page) => page.render !== null)
}

// =============================================================================
// Standard chunking rules (grid, timeline, framework, metrics, sources, stances)
// =============================================================================

function getStandardChunking(slide: any): { items: any[]; splitAt: number; type: string } | null {
  const content = slide.content

  // Grid slides - 2 rows per page
  if (content.type === 'grid' && content.items) {
    const columns = content.columns || 3
    const maxItemsPerPage = columns * 2
    if (content.items.length > maxItemsPerPage) {
      return { items: content.items, splitAt: maxItemsPerPage, type: 'grid' }
    }
  }

  // Timeline items
  if (content.type === 'custom' && content.props?.items && content.props.items.length > 2) {
    return { items: content.props.items, splitAt: 2, type: 'timeline' }
  }

  // Framework levels
  if (content.type === 'framework' && content.levels && content.levels.length > 2) {
    return { items: content.levels, splitAt: 2, type: 'framework' }
  }

  // KPI metrics
  if (content.type === 'metrics' && content.kpis && content.kpis.length > 3) {
    return { items: content.kpis, splitAt: 3, type: 'metrics' }
  }

  // Sources sections
  if (content.type === 'sources' && content.sections && content.sections.length > 3) {
    return { items: content.sections, splitAt: 3, type: 'sources' }
  }

  // List groups — split at 3 groups per page when dense
  if (content.type === 'list' && content.groups && content.groups.length > 3) {
    return { items: content.groups, splitAt: 3, type: 'list' }
  }

  // Stances
  if (content.type === 'custom' && content.componentId === 'AdoptionStancesDetailedSlide' &&
      content.props?.stances && content.props.stances.length > 2) {
    return { items: content.props.stances, splitAt: 2, type: 'stances' }
  }

  return null
}

// =============================================================================
// Table pagination with header repetition
// =============================================================================

const MAX_TABLE_ROWS = 10

function renderTablePage(slide: any, pageIndex: number): React.ReactNode {
  const content = slide.content
  const allRows = content.rows || []
  const startIdx = pageIndex * MAX_TABLE_ROWS
  const endIdx = Math.min(startIdx + MAX_TABLE_ROWS, allRows.length)
  const pageRows = allRows.slice(startIdx, endIdx)
  const isFirstPage = pageIndex === 0

  return (
    <>
      {isFirstPage && content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
      {isFirstPage && content.heading && <h3 className="section-heading">{content.heading}</h3>}
      {isFirstPage && content.description && <p className="text-gray-600 mb-4">{content.description}</p>}
      {!isFirstPage && <div className="text-sm text-gray-500 mb-2">(continued)</div>}

      <table>
        <thead>
          <tr>
            {content.headers.map((header: string, i: number) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row: string[], i: number) => (
            <tr key={startIdx + i}>
              {row.map((cell: string, j: number) => (
                <td key={j} className={content.highlightFirstColumn && j === 0 ? 'font-semibold' : ''}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pageIndex === Math.ceil(allRows.length / MAX_TABLE_ROWS) - 1 && content.insightBox && (
        <div className="insight-box">
          <div className="insight-label">{content.insightBox.label}</div>
          <div className="insight-text">{content.insightBox.text}</div>
        </div>
      )}
    </>
  )
}

function renderSlideContent(slide: any, startIdx?: number, endIdx?: number) {
  const content = slide.content

  switch (content.type) {
    case 'title':
      return (
        <div className="text-center">
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
      const allGridItems = content.items || []
      const displayGridItems = (startIdx !== undefined && endIdx !== undefined)
        ? allGridItems.slice(startIdx, endIdx)
        : allGridItems
      const isFirstGridPage = startIdx === undefined || startIdx === 0
      const isLastGridPage = endIdx === undefined || endIdx >= allGridItems.length
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {isFirstGridPage && content.description && <p className="text-gray-600 mb-4" style={{fontSize: '0.8125rem'}}>{content.description}</p>}
          {!isFirstGridPage && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}

          {isFirstGridPage && content.headerSection && (
            <div className="content-section">
              <h4 className="font-semibold mb-2" style={{fontSize: '0.875rem', color: '#000'}}>{content.headerSection.heading}</h4>
              <ul>
                {content.headerSection.items.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`card-grid cols-${content.columns || 3}`}>
            {displayGridItems.map((item: any, i: number) => (
              <div key={i} className="export-card">
                {item.title && <div className="export-card-title">{item.title}</div>}
                {item.subtitle && <div className="text-sm text-gray-500 mb-2" style={{fontSize: '0.75rem'}}>{item.subtitle}</div>}
                {item.description && <div className="export-card-description">{item.description}</div>}
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

          {isLastGridPage && content.insightBox && (
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
      const allGroups = content.groups || []
      const displayGroups = (startIdx !== undefined && endIdx !== undefined)
        ? allGroups.slice(startIdx, endIdx)
        : allGroups
      const isFirstListPage = startIdx === undefined || startIdx === 0
      const isLastListPage = endIdx === undefined || endIdx >= allGroups.length
      return (
        <>
          {content.sectionLabel && <div className="text-xs text-gray-500 mb-2">{content.sectionLabel}</div>}
          {content.heading && <h3 className="section-heading">{content.heading}</h3>}
          {isFirstListPage && content.description && <p className="text-gray-600 mb-4">{content.description}</p>}
          {!isFirstListPage && (
            <div className="text-sm text-gray-500 mb-2">(continued)</div>
          )}

          {displayGroups.map((group: any, i: number) => (
            <div key={i} className="content-section">
              {group.title && <h4 className="font-semibold mb-2" style={{color: '#000'}}>{group.title}</h4>}
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

          {isLastListPage && content.insightBox && (
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

      // Fallback: render registered custom components via client wrapper
      if (content.componentId && !content.props?.items && !content.props?.regions) {
        return (
          <ExportCustomSlide
            componentId={content.componentId}
            props={content.props || {}}
          />
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
