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

## Slide Type Quick Reference

Use this table to map outline slides to the best-fit type. For full interface shapes, read `.claude/skills/document-generation/SLIDE_TYPE_REFERENCE.md` during generation.

| Type | Use When |
|------|----------|
| `title` | Opening slide with headline, subtitle, optional thesis/insight box |
| `text` | Text-heavy slide with heading and paragraphs |
| `grid` | 2-4 card layout showing categories, features, or capabilities |
| `comparison` | Side-by-side comparison (before/after, do/don't, pros/cons) |
| `timeline` | Chronological events with dates and milestones |
| `list` | Grouped bullet lists with optional icons and colors |
| `framework` | Numbered stages, levels, or maturity model |
| `metrics` | KPI display cards with targets |
| `case-study` | Case study with metrics and detail sections |
| `sources` | Citations and references |
| `table` | Data tables with headers and rows |
| `custom` | **Last resort** — only when no standard type fits the described visual |

---

## Workflow

### Sizing Rule: Single-Pass vs. Phased Generation

Before starting, count slides and custom components:

- **Single-pass** (8 or fewer slides AND 2 or fewer custom components): Generate everything in one pass using the standard workflow below.
- **Phased generation** (more than 8 slides OR more than 2 custom components): Use the Large Document Handling workflow further below.

---

### Standard Workflow (Small Documents)

#### Phase 1: Parse Outline & Check Reference Material

1. Read the user's detailed outline — it contains slide-by-slide copy and visual descriptions.
2. Check `content/documents/uploads/` for any source files the user references (Excel, PDF, etc.).
3. Read `.claude/skills/document-generation/SLIDE_TYPE_REFERENCE.md` for full type interfaces.
4. Map each described slide to the best-fit slide type.
5. Derive the document ID (kebab-case, URL-friendly), category, visibility, and read time estimate.

#### Phase 2: Generate the Content File

Create `content/documents/{document-id}.ts`:

```typescript
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

#### Phase 3: Register the Document

**3a. Add to `content/documents/index.ts`:**

Add a new entry to the `DOCUMENT_CONFIGS` array:

```typescript
{
  id: '{document-id}',
  title: '{Full Document Title}',
  shortTitle: '{Short Title}',
  description: '{Description for document listings}',
  category: '{Category}',
  icon: '{LucideIconName}',
  date: '{YYYY-MM}',
  readTime: '{N} min',
  visibility: '{visibility}',
},
```

If the icon isn't already in the `ICON_MAP` object in the same file, add the import and registry entry.

**3b. Add to `content/documents/loader.ts`:**

```typescript
'{document-id}': () => import('./{content-filename}') as Promise<ContentModule>,
```

#### Phase 4: Custom Components (if needed)

Only create custom components when the outline describes visuals that cannot be achieved with standard slide types.

**4a. Create `components/presentation/custom/{DocumentName}Components.tsx`:**

```typescript
'use client'
import React from 'react'

interface {ComponentName}Props {
  slideId: string
  // ... other props passed from content file
}

export function {ComponentName}({ slideId, ...props }: {ComponentName}Props) {
  // ALL content comes from props — no hardcoded text/data
}
```

**4b. Register in `components/presentation/custom/index.ts`:**

```typescript
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

#### Phase 5: Verify

1. Run `npm run build` to catch TypeScript errors.
2. Confirm the document is accessible at `/documents/{document-id}`.

---

### Large Document Handling (Phased Generation)

When the outline has **more than 8 slides** OR requires **more than 2 custom components**, generate in phases. **Write each file to disk before starting the next phase.** Do not attempt to generate all output in a single response.

#### Phase 1: Analyze & Plan

1. Read the user's outline and any referenced uploads.
2. Map each slide to a type (standard or custom).
3. Output a brief plan listing: document ID, total slide count, which slides use standard types vs. custom, and the custom component names needed.
4. This phase produces only analysis — no file writes.

#### Phase 2: Generate Content File (Standard Slides First)

1. Read `.claude/skills/document-generation/SLIDE_TYPE_REFERENCE.md` for interface shapes.
2. Create the content file (`content/documents/{document-id}.ts`) with:
   - All standard-type slides **fully populated** with content from the outline
   - For each custom slide, write a **placeholder entry**:
     ```typescript
     {
       id: '{slide-id}',
       title: '{Slide Title}',
       type: 'custom',
       content: {
         type: 'custom',
         componentId: '{ComponentName}',
         props: { slideId: '{slide-id}' },
       },
     },
     ```
3. Register the document in `content/documents/index.ts` and `content/documents/loader.ts`.
4. **Write all files to disk before proceeding.**

#### Phase 3: Generate Custom Components

1. Read one existing custom component file as a pattern reference (e.g., `components/presentation/custom/AiOpportunityComponents.tsx` — read only the first component, not the full file).
2. Create the custom component file: `components/presentation/custom/{DocumentName}Components.tsx`
3. Register all components in `components/presentation/custom/index.ts`
4. **If more than 3 custom components are needed, generate them in batches of 2-3.** Write each batch to disk before generating the next.

#### Phase 4: Backfill Custom Slide Props

1. Read the content file and the custom component file to understand the prop interfaces.
2. Edit the content file to replace each custom slide's placeholder `props` with the full data from the outline.
3. This phase uses targeted edits — not a full rewrite of the content file.

#### Phase 5: Verify

1. Run `npm run build` to catch TypeScript errors.
2. Fix any errors found.
3. Confirm the document is accessible at `/documents/{document-id}`.

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

## Visibility Levels

- **`public`** — Anyone can view, no authentication required
- **`listed`** — Shown on documents page, requires auth + document access grant
- **`unlisted`** — NOT listed publicly, only accessible via direct link with auth + access

Default to `unlisted` unless the outline specifies otherwise.

## Reference Material in Uploads

The `content/documents/uploads/` folder may contain source files (Excel, PDF, images) that support document creation. When the user references uploaded material:

1. Check the uploads folder for the referenced file
2. Read/parse the file to extract relevant data
3. Incorporate the data into the content file's slide data structures

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
