# Agent Instructions — Document System Architecture

This file defines the rules and structure for the Tweed Collective website's document system.
**All AI agents and developers must follow these rules** when creating or modifying documents,
dashboards, or presentation content.

## Core Principles

1. **No hardcoded content in frontend components** — All text, data, numbers, and labels
   belong in content files (`content/documents/*.ts`), never inline in React components.

2. **Separation of concerns** — Three layers must remain distinct:
   - **Content** (data): `content/documents/*.ts`
   - **Templates** (visual system): `lib/slideTemplates.ts`
   - **Components** (rendering): `components/presentation/`, `components/charts/`

3. **Single source of truth** — Document metadata lives in `content/documents/index.ts`.
   Colors live in `lib/slideTemplates.ts`. Never duplicate these values elsewhere.

---

## File Structure

```
content/documents/
  index.ts                          # Document registry (metadata, permissions, visibility)
  loader.ts                         # Dynamic import map for content files
  {document-id}.ts                  # Content data files (pure data, no JSX)

lib/
  types.ts                          # TypeScript types for SlideData, DocumentConfig, etc.
  slideTemplates.ts                 # Design system: colors, typography, spacing, chartTheme

components/presentation/
  PresentationLayout.tsx            # Slide deck chrome (navigation, fullscreen, progress)
  SlideComponents.tsx               # Basic slide components (TitleSlide, BulletSlide, etc.)
  SlideRenderer.tsx                 # Converts SlideData[] to Slide[] for PresentationLayout
  shared/
    DiligenceComponents.tsx         # Shared components: RatingBadge, GapCallout, StatusDot, etc.
  custom/
    index.ts                        # Custom component registry (maps componentId to component)
    VibeCodingComponents.tsx         # Custom components for vibe-coding document
    HealthTechComponents.tsx         # Custom components for health-tech document
    SalmonComponents.tsx            # Custom components for salmon-genomics document
    {DocumentName}Components.tsx    # Custom components for other documents

components/charts/
  PieChart.tsx                      # Reusable Chart.js pie/donut chart
  HorizontalBarChart.tsx            # Reusable Chart.js horizontal bar chart
  QuadrantChart.tsx                 # Reusable Chart.js quadrant/scatter chart
  RadarChart.tsx                    # Reusable Chart.js radar chart
  chartSetup.ts                     # Chart.js registration and setup

components/dashboard/
  KpiDashboard.tsx                  # Dashboard orchestrator (loads data, renders charts)
  charts/                           # Dashboard-specific chart components
  types.ts                          # Dashboard data types

app/documents/
  page.tsx                          # Documents listing page
  [documentId]/
    page.tsx                        # Dynamic document renderer (loads content, renders slides)
    export/page.tsx                 # PDF/print export route
  ecs-sdlc-dashboard/
    page.tsx                        # eCS SDLC Dashboard (special case: not a slide deck)
```

---

## Adding a New Document

Follow these steps exactly:

### 1. Create the content file

Create `content/documents/{document-id}.ts`:

```typescript
import { SlideData } from '@/lib/types'

export const DOCUMENT_ID = '{document-id}'

export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    content: {
      type: 'title',
      badge: 'Category',
      headline: 'Document Title',
      subtitle: 'Subtitle here',
    },
  },
  // ... more slides using standard types or custom components
]

export default slides
```

### 2. Register in the document index

Add the document metadata to `content/documents/index.ts` in `DOCUMENT_CONFIGS`:

```typescript
{
  id: '{document-id}',
  title: 'Full Document Title',
  shortTitle: 'Short Title',
  description: 'Description for listings.',
  category: 'Category',
  icon: 'IconName',       // Must exist in ICON_MAP
  date: 'YYYY-MM',
  readTime: 'X min',
  visibility: 'unlisted', // or 'listed' or 'public'
},
```

### 3. Register in the content loader

Add the dynamic import to `content/documents/loader.ts`:

```typescript
'{document-id}': () => import('./{document-id}') as Promise<ContentModule>,
```

### 4. That's it

The dynamic route at `app/documents/[documentId]/page.tsx` handles the rest.
**Do NOT create a static page file** like `app/documents/{document-id}/page.tsx`.

---

## Slide Types

Use these standard types for slide content. Only use `custom` when no standard type fits.

| Type | Use For |
|------|---------|
| `title` | Opening slide with headline, subtitle, optional metrics |
| `text` | Text-heavy slides with heading and body paragraphs |
| `grid` | Card grids (2-4 columns) with icons, titles, descriptions |
| `comparison` | Side-by-side comparison (positive/negative/neutral variants) |
| `timeline` | Chronological events with dates, labels, descriptions |
| `list` | Grouped bullet lists with optional subtexts |
| `framework` | Numbered levels/stages with badges and detail panels |
| `metrics` | KPI cards with icons, values, targets |
| `case-study` | Case studies with metrics, sections, anecdotes |
| `sources` | Citation/reference lists organized by section |
| `table` | Data tables with headers, rows, optional highlighting |
| `custom` | Anything that doesn't fit above — requires a custom component |

### Custom Slides

For `type: 'custom'` slides:

1. Create the rendering component in `components/presentation/custom/{DocumentName}Components.tsx`
2. Register it in `components/presentation/custom/index.ts`
3. Reference it by `componentId` in the content file
4. Pass ALL data through `props` — the component must not contain any hardcoded content

```typescript
// In content file:
{
  id: 'my-chart',
  title: 'Revenue Analysis',
  content: {
    type: 'custom',
    componentId: 'RevenueChart',
    props: { data: [...], title: 'Revenue by Quarter' },
  },
}

// In custom component:
export function RevenueChart({ data, title }: { data: number[]; title: string }) {
  // Rendering only — no hardcoded content
}
```

---

## Adding a New Dashboard

Dashboards follow a different pattern from slide decks:

1. **Data pipeline**: Raw data (Excel/CSV) → Python pipeline → `public/data/{dashboard-name}-data.json`
2. **Dashboard component**: `components/dashboard/{DashboardName}.tsx` loads and renders the JSON
3. **Page route**: `app/documents/{dashboard-id}/page.tsx` wraps with `DocumentAccessWrapper`
4. **Register**: Add to `content/documents/index.ts` with `category: 'Dashboard'`

### Dashboard rules:
- Data lives in `public/data/` (loaded at runtime via `fetch`)
- Calculations that derive display values from raw data belong in the component
- Template/visual concerns use `chartTheme` from `lib/slideTemplates.ts`
- **Never hardcode hex colors** — import from `chartTheme.dashboard.*` or `colors.*`

---

## Color System

All colors must come from `lib/slideTemplates.ts`:

```typescript
import { colors, chartTheme } from '@/lib/slideTemplates'

// For presentation charts:
chartTheme.primary       // Default chart color (#6B8E6F)
chartTheme.palette       // Multi-series color array
chartTheme.text          // Chart label color

// For dashboard charts:
chartTheme.dashboard.pilot     // Pilot group color (green)
chartTheme.dashboard.nonPilot  // Non-pilot group color (amber)
chartTheme.dashboard.baseline  // Baseline reference color

// For general use:
colors.sage[500]         // Sage green palette
colors.green[700]        // Standard green
colors.neutral[200]      // Borders
```

**Never hardcode color hex values.** If a new color is needed, add it to `slideTemplates.ts` first.

---

## What NOT To Do

- Do NOT create static page files in `app/documents/{id}/page.tsx` for slide-deck documents
- Do NOT put slide content (text, data, labels) inline in React components
- Do NOT duplicate colors — always import from `slideTemplates.ts`
- Do NOT duplicate shared components — use `components/presentation/shared/`
- Do NOT mix template logic with content data in content files
- Do NOT create new chart color constants in individual component files
- Do NOT store document metadata anywhere except `content/documents/index.ts`
- Do NOT hardcode document permissions in components — they are managed via the admin panel
  and stored in the database, referenced by document ID from the registry
