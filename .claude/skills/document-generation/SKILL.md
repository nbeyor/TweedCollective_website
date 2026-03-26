---
name: document-generation
description: >
  Generate new slide deck documents for the Tweed Collective website from a detailed outline.
  Use this skill whenever the user provides a document outline, asks to create a new document,
  presentation, slide deck, briefing, or due diligence report. Also trigger when the user says
  "create a document", "new presentation", "build a deck", "new slide deck", or references the
  SLIDE_DECK_TEMPLATE.md format. The user will provide a crisp, detailed outline with
  slide-by-slide descriptions of visual architecture and copy — that outline is the input.
  Do NOT ask the user for requirements; proceed directly from their outline.
---

# Document Generation Skill

## Overview

This skill generates complete, working documents (slide deck presentations) for the Tweed Collective website. The system uses a three-layer architecture that strictly separates content data from visual templates from rendering components.

**Input:** A detailed document outline with slide-by-slide descriptions (visual architecture + copy).

**Output:** All files needed for a working document:
1. Content data file (`content/documents/{document-id}.ts`)
2. Document registry entry (`content/documents/index.ts`)
3. Content loader entry (`content/documents/loader.ts`)
4. Custom components if needed (`components/presentation/custom/`)

---

## Architecture Rules (MUST follow)

1. **Content files are pure data** — NO React, NO JSX, NO styling. Only TypeScript data structures.
2. **Use `getIcon('semantic-name')`** for all icons — never hardcode Lucide icon names like `'TrendingUp'`.
3. **No inline colors, fonts, or spacing** in content files — the template layer handles all visual styling.
4. **All metadata in `content/documents/index.ts`** — never duplicate document config elsewhere.
5. **Never create static page files** in `app/documents/` — the dynamic route `[documentId]/page.tsx` handles all documents.
6. **Use standard slide types first** — only use `type: 'custom'` when no standard type fits the described visual.
7. **Custom components receive ALL data via props** — no hardcoded content inside rendering components.

---

## Workflow

### Phase 1: Parse Outline & Check Reference Material

1. Read the user's detailed outline carefully — it contains slide-by-slide copy and visual descriptions.
2. Check `content/documents/uploads/` for any source files the user references (Excel, PDF, etc.).
3. Map each described slide to the best-fit slide type from the available 12 types (see Type Reference below).
4. Derive the document ID (kebab-case, URL-friendly), category, visibility, and read time estimate from context.
5. If the outline references data from an uploaded file, read and incorporate that data into the content.

### Phase 2: Generate the Content File

Create `content/documents/{document-id}.ts`:

```typescript
/**
 * {Document Title} - Document Content
 *
 * Pure data representation of slide content.
 * This file contains NO React components or JSX.
 *
 * Visual specifications are managed centrally in lib/slideTemplates.ts
 * Icons reference semantic names from the icon registry
 */

import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = '{document-id}'

export const slides: SlideData[] = [
  // ==========================================
  // Slide 1 — {Slide Title}
  // ==========================================
  {
    id: '{slide-id}',
    title: '{Slide Title}',
    type: '{slide-type}',
    content: {
      type: '{slide-type}',
      // ... content matching the type interface
    },
  },
  // ... more slides
]

export default slides
```

**Content file conventions:**
- Use section comment dividers (`// ====`) between slides for readability
- Slide IDs should be kebab-case and descriptive (e.g., `'market-overview'`, `'key-findings'`)
- The `title` field on SlideData is the navigation label shown in the slide picker
- Always include `export default slides` at the end
- Export a `DOCUMENT_ID` constant matching the document's registry ID

### Phase 3: Register the Document

**3a. Add to `content/documents/index.ts`:**

Add a new entry to the `DOCUMENT_CONFIGS` array:

```typescript
{
  id: '{document-id}',
  title: '{Full Document Title}',
  shortTitle: '{Short Title}',
  description: '{Description for document listings}',
  category: '{Category}',         // e.g., 'Executive Briefing', 'Due Diligence', 'Market Research', 'Strategic Assessment', 'Framework'
  icon: '{LucideIconName}',       // Must exist in ICON_MAP or add it
  date: '{YYYY-MM}',              // Publication date
  readTime: '{N} min',            // Estimated read time
  visibility: '{visibility}',     // 'public' | 'listed' | 'unlisted'
},
```

If the icon isn't already in the `ICON_MAP` object in the same file, add the import and registry entry:

```typescript
// Add to imports
import { ..., NewIcon } from 'lucide-react'

// Add to ICON_MAP
const ICON_MAP: Record<string, LucideIcon> = {
  // ...existing entries
  NewIcon,
}
```

**3b. Add to `content/documents/loader.ts`:**

Add the dynamic import entry to `contentLoaders`:

```typescript
'{document-id}': () => import('./{content-filename}') as Promise<ContentModule>,
```

Note: The content filename may differ from the document ID (e.g., document ID `'health-tech-market-2024'` maps to file `'./health-tech-market'`).

### Phase 4: Custom Components (if needed)

Only create custom components when the outline describes visuals that cannot be achieved with standard slide types (e.g., complex charts, multi-section interactive layouts, specialized data visualizations).

**4a. Create `components/presentation/custom/{DocumentName}Components.tsx`:**

```typescript
'use client'

import React from 'react'

interface {ComponentName}Props {
  slideId: string
  // ... other props passed from content file
}

export function {ComponentName}({ slideId, ...props }: {ComponentName}Props) {
  // Render based on slideId
  // ALL content comes from props — no hardcoded text/data
}
```

**4b. Register in `components/presentation/custom/index.ts`:**

```typescript
import { {ComponentName} } from './{DocumentName}Components'

// Add to customComponentRegistry:
'{ComponentName}': {ComponentName} as React.ComponentType<Record<string, unknown>>,
```

**4c. Reference in content file:**

```typescript
{
  id: '{slide-id}',
  title: '{Slide Title}',
  type: 'custom',
  content: {
    type: 'custom',
    componentId: '{ComponentName}',
    props: { slideId: '{slide-id}', /* data */ },
  },
}
```

### Phase 5: Verify

1. Run `npm run build` to catch TypeScript errors.
2. Confirm the document is accessible at `/documents/{document-id}`.
3. Check all slides render correctly (standard types should work automatically).

---

## Slide Type Quick Reference

### `title` — Opening/title slide
```typescript
{
  type: 'title',
  badge?: string,                    // Category pill (e.g., 'Market Research')
  headline: string,                  // Main title
  subtitle: string,                  // Subtitle/description
  insightBox?: { label, text },      // Callout box (e.g., 'Thesis', 'Key Insight')
  metrics?: MetricCard[],            // Optional stat cards: { value, label, sublabel?, source? }
}
```

### `text` — Text-heavy slide
```typescript
{
  type: 'text',
  sectionLabel?: string,             // Section number (e.g., 'Section 01')
  heading: string,
  body: string | string[],           // Paragraph(s)
  insightBox?: { label, text },
}
```

### `grid` — Card grid (2-4 columns)
```typescript
{
  type: 'grid',
  sectionLabel?: string,
  heading: string,
  description?: string,
  columns?: 2 | 3 | 4,              // Default behavior if omitted
  layout?: 'standard' | 'horizontal-cards',
  items: GridItem[],                 // { title, subtitle?, description?, icon?, items?: string[], color?: 'sage'|'taupe'|'gold'|'purple'|'green'|'red' }
  insightBox?: { label, text },
}
```

### `comparison` — Two-column comparison
```typescript
{
  type: 'comparison',
  sectionLabel?: string,
  heading: string,
  description?: string,
  left: {
    title: string,
    variant: 'positive' | 'negative' | 'neutral',
    items: string[],
    footer?: string,
  },
  right: {
    title: string,
    variant: 'positive' | 'negative' | 'neutral',
    items: string[],
    footer?: string,
  },
  insightBox?: { label, text },
}
```

### `timeline` — Chronological events
```typescript
{
  type: 'timeline',
  heading: string,
  items: TimelineItem[],             // { id: number, label, date, source?, title, description, metrics: string[], anecdote? }
}
```

### `list` — Grouped bullet lists
```typescript
{
  type: 'list',
  sectionLabel?: string,
  heading: string,
  description?: string,
  groups: ListGroup[],               // { title, icon?, color?, items: Array<{ text, subtext? }>, footer? }
  insightBox?: { label, text },
}
```

### `framework` — Numbered levels/stages
```typescript
{
  type: 'framework',
  sectionLabel?: string,
  heading: string,
  description?: string,
  levels: FrameworkLevel[],          // { level: number, title, badge?, description, details?: { whenToUse?, risk?, outcome?, characteristics?: string[], messaging?, implications?: string[], caseStudy? } }
}
```

### `metrics` — KPI display cards
```typescript
{
  type: 'metrics',
  sectionLabel?: string,
  heading: string,
  description?: string,
  kpis: KPIItem[],                   // { icon?, title, metric, target: string | string[], marketAnchor? }
}
```

### `case-study` — Case study with metrics
```typescript
{
  type: 'case-study',
  sectionLabel?: string,
  heading: string,
  metrics: MetricCard[],             // { value, label, sublabel?, source? }
  sections: GridItem[],              // Reuses GridItem type
  anecdote?: { label, text },
  insightBox?: { label, text },
}
```

### `sources` — Citations/references
```typescript
{
  type: 'sources',
  sectionLabel?: string,
  heading: string,
  sections: SourcesSection[],        // { title, startNumber?, items: Array<{ text, url? }> }
}
```

### `table` — Data tables
```typescript
{
  type: 'table',
  sectionLabel?: string,
  heading: string,
  description?: string,
  headers: string[],
  rows: string[][],
  highlightFirstColumn?: boolean,
  columnWidths?: string[],           // CSS width values (e.g., ['20%', '40%', '40%'])
  insightBox?: { label, text },
}
```

### `custom` — Custom component (last resort)
```typescript
{
  type: 'custom',
  componentId: string,               // Must be registered in custom/index.ts
  props?: Record<string, unknown>,   // All data passed here
}
```

---

## Semantic Icon Registry

Use `getIcon('name')` with these semantic names. Check `lib/slideTemplates.ts` for the full list.

| Category | Available Names |
|----------|----------------|
| **Technology** | `code`, `api`, `database`, `cloud`, `server`, `ai`, `automation` |
| **Business** | `strategy`, `growth`, `decline`, `chart`, `metrics`, `money`, `briefcase` |
| **Science** | `dna`, `health`, `medical`, `lab`, `shield` |
| **Users** | `user`, `users`, `team`, `person` |
| **Status** | `check`, `cross`, `warning`, `alert`, `info` |
| **Time** | `clock`, `timer`, `calendar`, `rocket`, `sprout` |
| **Navigation** | `arrow-right`, `arrow-up`, `external`, `download`, `upload` |

If a needed icon isn't in the registry, add it to `iconRegistry` in `lib/slideTemplates.ts`:
```typescript
'your-semantic-name': 'LucideIconName',
```

---

## Document Categories (existing)

Use an existing category when appropriate:
- `Executive Briefing` — High-level strategic analysis for senior leadership
- `Due Diligence` — AI-focused acquisition/investment due diligence
- `Market Research` — Market landscape analysis
- `Strategic Assessment` — Company-specific strategic evaluation
- `Strategic Brief` — Focused strategic analysis for specific topic
- `Framework` — Methodological frameworks and approaches
- `Dashboard` — Data dashboards (separate pattern, see AGENTS.md)

---

## Visibility Levels

- **`public`** — Anyone can view, no authentication required
- **`listed`** — Shown on documents page, requires auth + document access grant
- **`unlisted`** — NOT listed publicly, only accessible via direct link with auth + access

Default to `unlisted` unless the outline specifies otherwise.

---

## Reference Material in Uploads

The `content/documents/uploads/` folder may contain source files (Excel, PDF, images) that support document creation. When the user references uploaded material:

1. Check the uploads folder for the referenced file
2. Read/parse the file to extract relevant data
3. Incorporate the data into the content file's slide data structures
4. For Excel files, use Python or appropriate tooling to extract data

Uploads may also be added later to support document updates or revisions.

---

## Export System Notes

Documents automatically get a print/export view at `/documents/{document-id}/export`. For documents with complex custom slides that span multiple pages when exported:

1. Add pagination metadata to `app/documents/[documentId]/export/adapters.tsx`
2. Add rendering logic to `app/documents/[documentId]/export/ExportCustomSlide.tsx`

Most standard slide types export correctly without additional work.

---

## Verification Checklist

After generating all files, verify:

- [ ] Content file exports `slides: SlideData[]` and `DOCUMENT_ID`
- [ ] Content file imports `SlideData` from `@/lib/types`
- [ ] Content file imports `getIcon` from `@/lib/slideTemplates` (if icons are used)
- [ ] All icons use `getIcon('semantic-name')`, not hardcoded Lucide names
- [ ] No color/font/spacing specifications in content file
- [ ] No JSX or React imports in content file (unless custom components needed separately)
- [ ] Document added to `DOCUMENT_CONFIGS[]` in `content/documents/index.ts`
- [ ] Icon import and ICON_MAP entry added if new icon needed
- [ ] Dynamic import added to `contentLoaders` in `content/documents/loader.ts`
- [ ] Custom components (if any) registered in `components/presentation/custom/index.ts`
- [ ] `npm run build` passes without TypeScript errors
- [ ] Content file ends with `export default slides`

---

## Example: Complete Minimal Document

```typescript
// content/documents/example-briefing.ts
import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'example-briefing'

export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Executive Briefing',
      headline: 'AI Strategy for Growth',
      subtitle: 'How to position the portfolio for AI-driven value creation',
      insightBox: {
        label: 'Key Thesis',
        text: 'Companies that embed AI into core workflows will compound advantages over those that treat it as a bolt-on.',
      },
    },
  },
  {
    id: 'landscape',
    title: 'Market Landscape',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 01',
      heading: 'Current Market Landscape',
      columns: 3,
      items: [
        {
          title: 'Market Size',
          icon: getIcon('chart'),
          description: '$184B in enterprise AI spending (2025)',
        },
        {
          title: 'Adoption Rate',
          icon: getIcon('growth'),
          description: '67% of enterprises have deployed at least one AI use case',
        },
        {
          title: 'Talent Gap',
          icon: getIcon('users'),
          description: '3.5M unfilled AI/ML positions globally',
        },
      ],
      insightBox: {
        label: 'Trend',
        text: 'The market is shifting from experimentation to operationalization. Winners are scaling proven use cases, not launching new pilots.',
      },
    },
  },
  {
    id: 'sources',
    title: 'Sources',
    type: 'sources',
    content: {
      type: 'sources',
      heading: 'Sources & References',
      sections: [
        {
          title: 'Market Data',
          items: [
            { text: 'IDC Worldwide AI Spending Guide, 2025' },
            { text: 'McKinsey Global AI Survey, 2025', url: 'https://mckinsey.com/ai-survey' },
          ],
        },
      ],
    },
  },
]

export default slides
```

**Corresponding registry entry (`content/documents/index.ts`):**
```typescript
{
  id: 'example-briefing',
  title: 'AI Strategy for Growth',
  shortTitle: 'AI Growth Strategy',
  description: 'How to position the portfolio for AI-driven value creation.',
  category: 'Executive Briefing',
  icon: 'Lightbulb',
  date: '2026-03',
  readTime: '10 min',
  visibility: 'unlisted',
},
```

**Corresponding loader entry (`content/documents/loader.ts`):**
```typescript
'example-briefing': () => import('./example-briefing') as Promise<ContentModule>,
```
