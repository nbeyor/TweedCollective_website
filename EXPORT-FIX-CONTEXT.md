# Export Page Print Pagination Fix — Context for New Chat

## Branch

`claude/fix-export-function-hVMwu`

## Problem Summary

The export page at `/documents/{slug}/export` renders slides as landscape pages (10in × 7.5in) for PDF export via browser print (Ctrl+P). It works perfectly for standard slide types (grid, framework, metrics, etc.) — each gets exactly one 7.5in page.

**But for custom diligence slides** (Mercury/Apollo), print produces **68 pages instead of ~34**, with many blank/half-empty pages. The content doesn't align to page boundaries.

## What Was Done (This Session)

### 1. Initial Fix: Made custom slides render at all
Custom slides (`MercuryDiligenceSlide`, `ApolloDiligenceSlide`) were rendering blank because the `case 'custom'` handler in `renderSlideContent()` didn't know about them. Created `ExportCustomSlide.tsx` — a `'use client'` wrapper that looks up components from `customComponentRegistry` and renders them with B&W CSS overrides. This works great.

### 2. Content Clipping Fix (partially worked)
Content-heavy slides were clipped because `.export-slide` has `height: 7.5in; overflow: hidden`. Added `export-slide-auto` CSS class with `height: auto; min-height: 7.5in; overflow: visible`. This showed all content on screen but **completely broke print pagination** — auto-height slides don't align to fixed page boundaries, creating blank gaps everywhere.

### 3. Auto-Scaling Attempt (didn't work)
Added `useEffect` + `useRef` to `ExportCustomSlide.tsx` to measure content height and apply `transform: scale()` to shrink oversized content to fit. Reverted print CSS to `height: 7.5in`. **This didn't fix it — still 68 pages with blanks.** The scaling approach has issues:
- The `useEffect` may not fire before print
- `scrollHeight` measurement with `overflow: visible` on a client component inside a fixed-height parent is unreliable
- The scale transform may not be applied in time for the print layout

## Core Architecture

### Export Page (`app/documents/[documentId]/export/page.tsx`)
- **Server component** (RSC) — ~1600 lines
- Renders slides in a loop, each in a `<div class="export-slide">` (fixed 7.5in × 10in)
- Has a `<style>` block with all export CSS (lines 102-956)
- `renderSlideContent()` switch statement handles each slide type
- `needsPageBreak()` / `getSlidePageCount()` / `renderSlideWithPagination()` handle splitting data-driven slides across pages (e.g., grids with too many items)
- **For custom component slides**: delegates to `<ExportCustomSlide>` (line 1546-1553)

### ExportCustomSlide (`app/documents/[documentId]/export/ExportCustomSlide.tsx`)
- **Client component** (`'use client'`)
- Imports `customComponentRegistry` from `@/components/presentation/custom`
- Renders the component from the registry with provided props
- Currently has auto-scaling logic (useEffect/useRef) that isn't working properly

### Custom Component Registry (`components/presentation/custom/index.ts`)
- Maps `componentId` strings to React components
- `MercuryDiligenceSlide` and `ApolloDiligenceSlide` are the main ones used in export

### MercuryDiligenceSlide (`components/presentation/custom/MercuryDiligenceSlides.tsx`)
- ~1800 line client component
- Has a `slideContentMap` that maps `slideId` strings to JSX
- Uses dark theme (Tailwind classes: `text-cream`, `bg-white/5`, `border-cream/10`, etc.)
- Contains charts (Chart.js canvas), tables, grids, card layouts
- Each slideId renders a self-contained slide with variable content height
- **Some slides fit in 7.5in, others are significantly taller**

### Key Slide Data (`content/documents/mercury-buyer-ai-diligence.ts`)
- 34 slides total: 1 title + 33 custom (`componentId: 'MercuryDiligenceSlide'`)
- Each custom slide: `{ type: 'custom', componentId: 'MercuryDiligenceSlide', props: { slideId: 'xxx' } }`
- The slideId (e.g., 'executive-summary', 'who-could-disrupt', 'relationship-asset') determines what content renders

## Current CSS State

### `.export-slide` (the page container)
```css
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

/* Screen-only override for custom slides */
.export-slide.export-slide-auto {
  height: auto;
  min-height: 7.5in;
  overflow: visible;
}

@media print {
  .export-slide {
    margin: 0;
    border: none;
    height: 7.5in;
    width: 10in;
  }

  .export-slide.export-slide-auto {
    height: 7.5in;
    overflow: hidden;  /* This clips content in print — the original problem */
  }
}
```

### `.page-break` (between slides)
```css
@media print {
  .page-break {
    page-break-after: always;
    break-after: page;
  }
}
```

### `.export-custom-slide` (B&W overrides wrapper)
- Sets all backgrounds to white, all text to black
- Overrides Tailwind dark-theme classes
- Reduces font sizes and spacing for print density
- Inverts canvas charts
- Has `overflow: visible` (needed for scrollHeight measurement)

### Page setup
```css
@page {
  size: landscape;
  margin: 0.5in;
}
```

## The Fundamental Challenge

The diligence slide components are **opaque client components** with **variable content heights**. Unlike data-driven slides (grids, timelines) where the server can count items and split them across pages, custom components render internally-structured JSX that can't be sliced.

**Approaches tried and their outcomes:**
1. **Fixed height + overflow hidden** → Content clipped (original bug)
2. **Auto height** → Print pagination completely broken (68 pages, blanks)
3. **Client-side scale transform** → Didn't work (measurement/timing issues)

## What Needs to Happen

The export needs to produce **exactly one print page per slide** where each custom slide's content **fits without clipping**. Possible approaches to explore:

### A. Fix the client-side scaling approach
The `useEffect` in `ExportCustomSlide` may need to:
- Wait for all child components to fully render (fonts, images, charts)
- Use `requestAnimationFrame` or `ResizeObserver` instead of immediate measurement
- Measure against a known pixel height (7.5in - padding - header ≈ 480px at 96dpi)
- Debug: log the actual `scrollHeight` vs `availableHeight` to see if measurement works

### B. Remove `export-slide-auto` entirely
Go back to fixed `height: 7.5in; overflow: hidden` for ALL contexts (screen + print). Accept that content is clipped on screen too, but use CSS `transform: scale()` as a **static/CSS-only** approach — though this requires knowing the content height.

### C. Server-side rendering approach
Instead of rendering the opaque client component, extract the content data from `MercuryDiligenceSlide`'s `slideContentMap` and render it server-side with export-specific JSX (like the existing `AdoptionStancesDetailedSlide` handler). This is the most work but most reliable. Would need to replicate ~1800 lines of slide content as server-rendered HTML.

### D. Two-pass rendering
Render the page first with auto-height to measure, then re-render with calculated scale factors. Could use a hidden "measurement" div.

### E. CSS-only approach with `@media print` scaling
Use `@media print` CSS to set a smaller font size / tighter spacing specifically for `.export-custom-slide` to make content fit. This is imprecise but might work if the CSS overrides are aggressive enough.

## Key Files

| File | Path | Role |
|------|------|------|
| Export page | `app/documents/[documentId]/export/page.tsx` | Main server component with all CSS + rendering logic |
| ExportCustomSlide | `app/documents/[documentId]/export/ExportCustomSlide.tsx` | Client wrapper for custom components |
| PrintButton | `app/documents/[documentId]/export/PrintButton.tsx` | Simple print trigger button |
| Custom registry | `components/presentation/custom/index.ts` | Maps componentId → React component |
| Mercury slides | `components/presentation/custom/MercuryDiligenceSlides.tsx` | ~1800 line component with all slide content |
| Apollo slides | `components/presentation/custom/ApolloDiligenceSlides.tsx` | Similar structure for Apollo |
| Shared components | `components/presentation/shared/DiligenceComponents.tsx` | Rating badges, status dots, etc. |
| Mercury data | `content/documents/mercury-buyer-ai-diligence.ts` | 34 slides definition |
| Apollo data | `content/documents/apollo-wcg-ai-diligence.ts` | Apollo slides definition |

## Rendering Pipeline

```
page.tsx (server) → slides.flatMap() → for each slide:
  → getSlidePageCount(slide) → needsPageBreak(slide)
  → <div class="export-slide [export-slide-auto] [page-break]">
      → <div class="slide-header"> (title, slide number)
      → <div class="slide-content">
          → renderSlideWithPagination(slide, pageIdx, pageCount)
              → renderSlideContent(slide, startIdx, endIdx)
                  → case 'custom': if MercuryDiligence/Apollo:
                      → <ExportCustomSlide componentId="MercuryDiligenceSlide" props={{ slideId: "xxx" }} />
                          → (client) customComponentRegistry["MercuryDiligenceSlide"]
                              → MercuryDiligenceSlide({ slideId: "xxx" })
                                  → slideContentMap["xxx"] → JSX (dark theme, charts, tables, etc.)
```

## Test URLs

- Mercury: `https://tweedcollective.ai/documents/mercury-buyer-ai-diligence/export`
- Apollo: `https://tweedcollective.ai/documents/apollo-wcg-ai-diligence/export`
- Other docs (should still work): vibe-coding, salmon, health-tech, ai-opportunity

## Success Criteria

1. Print preview shows ~34 pages (one per slide) for Mercury document
2. No blank or half-empty pages
3. All content visible (not clipped) — scaled down if needed
4. B&W styling maintained (no dark backgrounds, all text readable)
5. Other documents (non-custom slides) unaffected
