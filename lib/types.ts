/**
 * Shared TypeScript types for the Tweed Collective website
 */

import { LucideIcon } from 'lucide-react'

// ============================================
// Document Types
// ============================================

/**
 * Document visibility types:
 * - 'public': Anyone can view, no authentication required
 * - 'listed': Listed on documents page, requires auth + access
 * - 'unlisted': NOT listed on public documents page, only accessible via direct link with auth + access
 */
export type DocumentVisibility = 'public' | 'listed' | 'unlisted'

/**
 * Document metadata - the single source of truth for document configuration
 */
export interface DocumentConfig {
  id: string
  title: string
  shortTitle: string  // For admin/compact displays
  description: string
  category: string
  icon: string  // Icon name from lucide-react
  date: string  // YYYY-MM format
  readTime: string
  visibility: DocumentVisibility
}

/**
 * Document metadata with resolved icon component (for runtime use)
 */
export interface DocumentMeta extends Omit<DocumentConfig, 'icon'> {
  icon: LucideIcon
  href: string
}

// ============================================
// Slide/Presentation Types
// ============================================

/**
 * Slide content types for pure data representation
 */
export type SlideContentType =
  | 'title'           // Title slide with headline, subtitle, insight box
  | 'text'            // Text-heavy slide with heading and paragraphs
  | 'grid'            // Grid of cards/items
  | 'comparison'      // Two-column comparison (e.g., before/after, good/bad)
  | 'timeline'        // Interactive timeline
  | 'metrics'         // Metrics/stats display
  | 'list'            // Bulleted list with optional grouping
  | 'framework'       // Framework/process display
  | 'case-study'      // Case study with metrics and insights
  | 'sources'         // Sources/citations list
  | 'table'           // Table with headers and rows
  | 'funnel'          // Narrowing funnel/filter diagram with labeled stages
  | 'spectrum'        // Cards arranged on a gradient continuum (light→dark)
  | 'chart'           // Data visualization (dual-curve, staircase, line charts)
  | 'venn'            // Overlapping circles with labeled intersection
  | 'quotes'          // Speech bubble / conversation columns
  | 'custom'          // Custom component (fallback for complex slides)

/**
 * Base slide structure
 */
export interface SlideData {
  id: string
  title: string
  type: SlideContentType
  content: SlideContent
}

/**
 * Title slide content
 */
export interface TitleSlideContent {
  type: 'title'
  badge?: string
  headline: string
  subtitle: string
  insightBox?: {
    label: string
    text: string
  }
  metrics?: MetricCard[]
}

/**
 * Text slide content
 */
export interface TextSlideContent {
  type: 'text'
  sectionLabel?: string
  heading: string
  body: string | string[]
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Metric card for stats/KPIs
 */
export interface MetricCard {
  value: string
  label: string
  sublabel?: string
  source?: string
}

/**
 * Grid item for card grids
 */
export interface GridItem {
  title: string
  subtitle?: string
  description?: string
  icon?: string
  items?: string[]
  color?: 'sage' | 'taupe' | 'gold' | 'purple' | 'green' | 'red'
}

/**
 * Grid slide content
 */
export interface GridSlideContent {
  type: 'grid'
  sectionLabel?: string
  heading: string
  description?: string
  headerSection?: {
    heading: string
    items: string[]
  }
  columns?: 2 | 3 | 4
  layout?: 'standard' | 'horizontal-cards'  // Layout variant for cards
  items: GridItem[]
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Comparison slide content (two columns)
 */
export interface ComparisonSlideContent {
  type: 'comparison'
  sectionLabel?: string
  heading: string
  description?: string
  left: {
    title: string
    variant: 'positive' | 'negative' | 'neutral'
    items: string[]
    footer?: string
  }
  right: {
    title: string
    variant: 'positive' | 'negative' | 'neutral'
    items: string[]
    footer?: string
  }
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Timeline item
 */
export interface TimelineItem {
  id: number
  label: string
  date: string
  source?: string
  title: string
  description: string
  metrics: string[]
  anecdote?: string
}

/**
 * Timeline slide content
 */
export interface TimelineSlideContent {
  type: 'timeline'
  heading: string
  items: TimelineItem[]
}

/**
 * List group for organized lists
 */
export interface ListGroup {
  title: string
  icon?: string
  color?: 'sage' | 'taupe' | 'gold' | 'purple' | 'green'
  items: Array<{
    text: string
    subtext?: string
  }>
  footer?: string
}

/**
 * List slide content
 */
export interface ListSlideContent {
  type: 'list'
  sectionLabel?: string
  heading: string
  description?: string
  groups: ListGroup[]
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Framework step/level
 */
export interface FrameworkLevel {
  level: number
  title: string
  badge?: string
  description: string
  details?: {
    whenToUse?: string
    risk?: string
    outcome?: string
    characteristics?: string[]
    messaging?: string
    implications?: string[]
    caseStudy?: string
  }
}

/**
 * Framework slide content
 *
 * `layout` controls level orientation:
 * - `'vertical'` (default): stacked cards, top-to-bottom
 * - `'horizontal'`: left-to-right chevrons, one row, best for 3 short stages
 */
export interface FrameworkSlideContent {
  type: 'framework'
  sectionLabel?: string
  heading: string
  description?: string
  layout?: 'vertical' | 'horizontal'
  levels: FrameworkLevel[]
  insightBox?: { label: string; text: string }
}

/**
 * KPI item
 */
export interface KPIItem {
  icon?: string
  title: string
  metric: string
  target: string | string[]
  marketAnchor?: string
}

/**
 * Metrics slide content
 */
export interface MetricsSlideContent {
  type: 'metrics'
  sectionLabel?: string
  heading: string
  description?: string
  kpis: KPIItem[]
}

/**
 * Case study slide content
 */
export interface CaseStudySlideContent {
  type: 'case-study'
  sectionLabel?: string
  heading: string
  metrics: MetricCard[]
  sections: GridItem[]
  anecdote?: {
    label: string
    text: string
  }
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Source/citation
 */
export interface SourceItem {
  text: string
  url?: string
}

/**
 * Sources section
 */
export interface SourcesSection {
  title: string
  startNumber?: number
  items: SourceItem[]
}

/**
 * Sources slide content
 */
export interface SourcesSlideContent {
  type: 'sources'
  sectionLabel?: string
  heading: string
  sections: SourcesSection[]
}

/**
 * Table slide content
 */
export interface TableSlideContent {
  type: 'table'
  sectionLabel?: string
  heading: string
  description?: string
  headers: string[]
  rows: string[][]
  highlightFirstColumn?: boolean
  columnWidths?: string[]  // Optional CSS width values for each column
  insightBox?: {
    label: string
    text: string
  }
}

/**
 * Funnel stage for filter/narrowing diagrams
 */
export interface FunnelStage {
  title: string
  description: string
  icon?: string
}

/**
 * Funnel slide content — narrowing filter diagram with labeled stages
 */
export interface FunnelSlideContent {
  type: 'funnel'
  sectionLabel?: string
  heading: string
  description?: string
  inputLabel?: string   // Label at the wide top of the funnel
  outputLabel?: string  // Label at the narrow bottom
  stages: FunnelStage[]
  insightBox?: { label: string; text: string }
}

/**
 * Spectrum card for continuum/gradient displays
 */
export interface SpectrumCard {
  title: string
  description: string
  icon?: string
}

/**
 * Spectrum slide content — cards arranged on a gradient continuum
 */
export interface SpectrumSlideContent {
  type: 'spectrum'
  sectionLabel?: string
  heading: string
  description?: string
  leftLabel?: string    // Label for the left end of the spectrum
  rightLabel?: string   // Label for the right end of the spectrum
  cards: SpectrumCard[]
  insightBox?: { label: string; text: string }
}

/**
 * Chart line/series data
 */
export interface ChartLine {
  label: string
  style: 'exponential' | 'linear' | 'staircase' | 'flat'
  color?: 'sage' | 'taupe' | 'gold' | 'red' | 'green'
}

/**
 * Chart annotation zone along the x-axis
 */
export interface ChartZone {
  label: string
  sublabel?: string
  description?: string
}

/**
 * Chart slide content — data visualizations (dual-curve, staircase, etc.)
 */
export interface ChartSlideContent {
  type: 'chart'
  sectionLabel?: string
  heading: string
  description?: string
  xLabel?: string
  yLabel?: string
  lines: ChartLine[]
  zones?: ChartZone[]
  gapAnnotation?: string  // Annotation for the gap between lines
  insightBox?: { label: string; text: string }
}

/**
 * Venn circle/pool
 */
export interface VennCircle {
  label: string
  description: string
  icon?: string
  color?: 'sage' | 'taupe' | 'gold' | 'purple' | 'green'
}

/**
 * Venn slide content — overlapping circles with labeled intersection
 */
export interface VennSlideContent {
  type: 'venn'
  sectionLabel?: string
  heading: string
  description?: string
  circles: VennCircle[]
  centerLabel: string   // Label for the intersection center
  insightBox?: { label: string; text: string }
}

/**
 * Quotes column for speech bubble displays
 */
export interface QuotesColumn {
  title: string
  variant: 'positive' | 'negative' | 'neutral'
  quotes: string[]
  headerNote?: string  // e.g., "overheard in the hallway"
}

/**
 * Quotes slide content — speech bubble / conversation columns
 */
export interface QuotesSlideContent {
  type: 'quotes'
  sectionLabel?: string
  heading: string
  description?: string
  columns: QuotesColumn[]
  insightBox?: { label: string; text: string }
}

/**
 * Custom slide content (for complex interactive slides)
 */
export interface CustomSlideContent {
  type: 'custom'
  componentId: string  // Reference to a specific component to render
  props?: Record<string, unknown>
}

/**
 * Union type for all slide content types
 */
export type SlideContent =
  | TitleSlideContent
  | TextSlideContent
  | GridSlideContent
  | ComparisonSlideContent
  | TimelineSlideContent
  | ListSlideContent
  | FrameworkSlideContent
  | MetricsSlideContent
  | CaseStudySlideContent
  | SourcesSlideContent
  | TableSlideContent
  | FunnelSlideContent
  | SpectrumSlideContent
  | ChartSlideContent
  | VennSlideContent
  | QuotesSlideContent
  | CustomSlideContent

/**
 * Document content structure
 */
export interface DocumentContent {
  documentId: string
  slides: SlideData[]
}

// ============================================
// User & Access Types
// ============================================

/**
 * User with document access information
 */
export interface UserWithAccess {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  documentAccess: string[]
  createdAt: string
  grantInfo?: Record<string, { method: 'invitation' | 'manual', timestamp: string }>
}

/**
 * Invitation/magic link
 */
export interface Invitation {
  token: string
  documentId: string
  documentTitle?: string
  targetEmail: string
  createdAt: string
  expiresAt: string
  redeemedAt?: string
  redeemedBy?: string
  status: 'active' | 'expired' | 'redeemed'
}

/**
 * Audit entry for access grants
 */
export interface AuditEntry {
  userId: string
  email: string
  documentIds: string[]
  timestamp: string
  method: 'invitation' | 'manual'
}

