# Google Slides API Export: Research & Implementation Plan

## Context

Tweed Collective documents are stored as pure TypeScript data structures (`SlideData[]`) with 11 standard slide types plus a `custom` type for complex React components. The only current export is print-to-PDF via browser. The goal is to add server-side export to Google Slides using the Slides API, producing shareable Google Slides decks from existing document data.

---

## Google Slides API: What Works and What Doesn't

### Capabilities (44 batch update request types)
- **Create elements**: Slides, Shapes (TEXT_BOX, RECTANGLE, ROUND_RECTANGLE, ELLIPSE, etc.), Tables, Images, Lines
- **Text**: InsertText, UpdateTextStyle (bold, italic, font family/size, foreground/background color), UpdateParagraphStyle (alignment, spacing, indent), CreateParagraphBullets (bulleted and numbered lists)
- **Shapes**: Fill color (solid only), border color/weight, corner radius on ROUND_RECTANGLE
- **Tables**: CreateTable with rows/cols, populate cells, style cell backgrounds, borders, merge cells
- **Images**: Insert from public URL (PNG/JPEG/GIF, max 50MB, max 25 megapixels)
- **Layout**: Precise positioning via transforms (EMU units: 1 inch = 914400 EMU), z-order control, grouping
- **Predefined layouts**: BLANK, TITLE, TITLE_AND_BODY, TITLE_AND_TWO_COLUMNS, TITLE_ONLY, SECTION_HEADER, BIG_NUMBER, MAIN_POINT, ONE_COLUMN_TEXT, CAPTION_ONLY
- **Template merging**: ReplaceAllText (find/replace tags), ReplaceAllShapesWithImage
- **Canvas size**: 10in x 7.5in (matches existing export CSS exactly)

### Limitations
| Limitation | Impact on Our Documents |
|---|---|
| **No SVG support** | Lucide icons can't be inserted as SVGs; need pre-rendered PNGs or omit |
| **No gradients** | Solid fills only; minor visual difference |
| **No animations/transitions** | Framer Motion effects lost; acceptable for static deck |
| **No interactive elements** | Timeline hover states, clickable items become static |
| **No chart creation** | Only linked Google Sheets charts; our Chart.js charts need screenshot fallback |
| **Images must be public URLs** | Screenshots of custom slides need temporary public hosting |
| **Font weight limited to bold/not-bold** | No 500/600 weight distinction; minor |
| **No master slide creation via API** | Must use existing predefined layouts or build from BLANK |
| **Rate limit: 300 writes/min** | Large docs (70+ slides) need batching strategy |

### What Translates Well
- **Inter font** is available on Google Fonts (direct mapping)
- **Color palette** (hex values in `slideTemplates.ts`) maps directly to RGB color objects
- **Tables** have full native support (headers, cell styling, borders, merge)
- **Bulleted/numbered lists** via CreateParagraphBullets
- **Text formatting** (bold, size, color, alignment) all supported
- **Precise positioning** via EMU transforms matches our fixed-dimension layout

---

## Recommended Approach: Fully Programmatic (from BLANK slides)

### Why not templates?
- Template-based requires maintaining 11+ Google Slides template files in sync with the TypeScript design system
- Every slide type change or design system update requires manual template updates in Google Slides UI
- Template merge (ReplaceAllText) works well for simple substitution but can't handle variable-length lists, dynamic grid layouts, or conditional elements

### Why programmatic?
- `SlideData` is already pure data (no JSX) -- maps directly to API batch requests
- All layout logic stays in code, versioned alongside the content types
- Adding a new slide type means adding one mapper function, not a template file
- The color system, typography, and spacing values are already in `slideTemplates.ts` -- we just convert units

---

## Architecture

### Server-side API route
```
POST /api/export-google-slides  { documentId: string }
  -> Returns { url: string } (Google Slides URL)
```

- **Why server-side**: Service account credentials must stay server-side; document loading already works server-side via `loadDocumentContent()`; admin-only (consistent with existing `/export/` pattern)
- **Auth**: Google Service Account (not OAuth2) -- this is admin-only, no need for user-facing Google consent flows. Service account creates the presentation, then shares it via Drive API.

### File structure
```
lib/google-slides/
  index.ts              -- Main orchestrator: loadDocument -> buildRequests -> createPresentation
  auth.ts               -- Service account JWT authentication (googleapis)
  colors.ts             -- hexToRgb() + design system color palette mapping
  layout.ts             -- EMU conversions, positioning grid helpers, typography scale
  builder.ts            -- Creates presentation, iterates slides, calls mappers
  shared.ts             -- Reusable builders: insightBox, badge, metricCard, sectionLabel
  mappers/
    title.ts
    text.ts
    grid.ts
    comparison.ts
    timeline.ts
    list.ts
    framework.ts
    metrics.ts
    case-study.ts
    sources.ts
    table.ts
    custom.ts           -- Routes to tier 1/2/3 strategy
app/api/export-google-slides/
  route.ts              -- API endpoint (admin auth check + orchestration)
```

### Key dependencies
- `googleapis` npm package (official Google APIs client)
- Google Cloud project with Slides API + Drive API enabled
- Service account credentials as env vars: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

---

## Slide Type Mapping

All slides start from `BLANK` layout. Shapes and text boxes are positioned absolutely using EMU coordinates.

| Slide Type | Google Slides Elements | Notes |
|---|---|---|
| **title** | TEXT_BOX (headline 48pt bold, subtitle 20pt), ROUND_RECTANGLE (badge with sage fill), row of metric card shapes, insightBox shape | Centered layout |
| **text** | TEXT_BOX (sectionLabel 14pt uppercase), TEXT_BOX (heading 36pt), TEXT_BOX (body paragraphs 16pt), insightBox | Straightforward text mapping |
| **grid** | Heading TEXT_BOX, calculated grid of ROUND_RECTANGLE cards positioned by column count (2/3/4). Each card: title, description, bullet items via CreateParagraphBullets | Most complex positioning math |
| **comparison** | Two side-by-side ROUND_RECTANGLE shapes. Fill color by variant (positive=green[50], negative=red[50], neutral=neutral[50]). Bulleted items inside each | Two-column layout |
| **timeline** | Vertical LINE as spine, positioned items: date TEXT_BOX, title TEXT_BOX (bold), description, metrics sub-list | Interactive hover states become static |
| **list** | Heading, then vertically stacked groups: group title (bold, colored left border LINE), bulleted items, footer text | Multi-group layout |
| **framework** | Stacked ROUND_RECTANGLE cards: ELLIPSE with level number, title, badge pill, description, details sub-box with sage fill | Numbered level cards |
| **metrics** | 2-column grid of KPI cards: ROUND_RECTANGLE with metric value (60pt bold), title, target, market anchor sub-box | Big number emphasis |
| **case-study** | Top metric cards row, 2-column sections grid, anecdote box (sage fill + left border), insightBox | Composite layout |
| **sources** | Two TEXT_BOX columns with numbered lists (NUMBERED bullets), URLs as plain text | Simple text layout |
| **table** | Native CreateTable + InsertText per cell + UpdateTableCellProperties (sage header fill, bold) + border styling | Full native support |
| **custom** | Three-tier fallback (see below) | Biggest challenge |

### Custom Slide Strategy (Three Tiers)

1. **Tier 1 - Data extraction**: For custom components with structured props (e.g., `TimelineSlide`, `StageSlide`), parse the props and generate Google Slides shapes programmatically. Priority for components with clean data-driven props.

2. **Tier 2 - Screenshot fallback**: For complex components (diligence charts, assessment grids, radar/waterfall charts), render server-side via headless browser (Puppeteer), upload image to temporary public URL (GCS signed URL or temporary auth-free route), insert via CreateImage. The existing export page CSS and `adapters.tsx` pagination logic can be reused.

3. **Tier 3 - Placeholder**: If neither works, insert a slide with the title and "[Complex interactive content -- see web version]" with a link.

### Design System Translation
- **Colors**: `hexToRgb()` converts slideTemplates.ts hex values to `{ red: 0-1, green: 0-1, blue: 0-1 }`
- **Typography**: Inter font, sizes mapped from rem to pt (1rem = 16pt). Bold for weight >= 600.
- **Icons**: Pre-render ~30 Lucide icons from the registry as PNG files, host as static assets, insert via CreateImage. Alternatively omit for v1 and add later.
- **Theme**: Export as light theme (dark text on white), matching existing print export behavior.

---

## Implementation Phases

### Phase 1: Foundation
- Google Cloud project setup, service account, env vars
- Install `googleapis` package
- Build `auth.ts`, `colors.ts`, `layout.ts`
- Build API route skeleton + `builder.ts` (create empty presentation with correct slide count)
- Test: create a blank presentation for any document

### Phase 2: Core Slide Mappers
- Build `shared.ts` (insightBox, badge, metricCard)
- Build mappers: `title`, `text`, `sources`, `table` (simplest types)
- Test with `innovation-ai-era-hardened` (22 slides, 0 custom) and `ai-adoption-by-function-health-tech` (26 slides, 0 custom)

### Phase 3: Complex Mappers
- Build mappers: `grid`, `comparison`, `list`, `framework`, `metrics`, `case-study`, `timeline`
- Test with `salmon-ai-genomics` (24 standard + 2 custom), `vibe-coding` (18 standard + 4 custom)

### Phase 4: Custom Slide Handling
- Puppeteer screenshot service for Tier 2
- Image hosting setup (GCS or temporary public route)
- Tier 1 data extractors for well-structured custom components
- Tier 3 placeholder fallback
- Test with heavily-custom documents (apollo, mercury, ai-opportunity)

### Phase 5: UI & Polish
- "Export to Google Slides" button (admin-only) on document pages
- Progress indicator (export may take 10-30s for large documents)
- Error handling and rate limit retry logic
- Branding: Tweed Collective logo on title slide, footer on each slide
- Fidelity notes slide at end of deck
- End-to-end test all 8 documents

---

## Key Risks
1. **Rate limits (300 writes/min)**: Mitigate by batching all requests for one slide into a single batchUpdate call
2. **Custom slide screenshot fidelity**: Reuse existing export page CSS (already solves dark-to-light theme conversion)
3. **Image hosting for screenshots**: GCS signed URLs (15-min TTL) or temporary auth-free Next.js route
4. **Large presentation file size**: Compress PNGs, use JPEG where appropriate

## Critical Files
- `lib/types.ts` -- Slide content type definitions (mappers must handle every field)
- `lib/slideTemplates.ts` -- Design system colors, typography, spacing (translate to Google Slides styles)
- `content/documents/loader.ts` -- Document loading (used by API route)
- `app/documents/[documentId]/export/page.tsx` -- Existing export rendering (reference for layout)
- `components/presentation/custom/index.ts` -- Custom component registry (tier routing)

## Verification
- Create a test document export for each phase and visually compare web version to Google Slides output
- Verify all 11 slide types render correctly with at least one real document
- Verify custom slides fall through tiers correctly
- Verify admin-only access control on the API route
- Check Google Slides API quota usage stays within limits for largest documents
