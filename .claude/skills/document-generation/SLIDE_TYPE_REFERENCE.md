# Slide Type Interface Reference

Full TypeScript interface shapes for each slide type. Read this file during content generation to ensure correct data structures.

---

## `title` — Opening/title slide
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

## `text` — Text-heavy slide
```typescript
{
  type: 'text',
  sectionLabel?: string,             // Section number (e.g., 'Section 01')
  heading: string,
  body: string | string[],           // Paragraph(s)
  insightBox?: { label, text },
}
```

## `grid` — Card grid (2-4 columns)
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

## `comparison` — Two-column comparison
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

## `timeline` — Chronological events
```typescript
{
  type: 'timeline',
  heading: string,
  items: TimelineItem[],             // { id: number, label, date, source?, title, description, metrics: string[], anecdote? }
}
```

## `list` — Grouped bullet lists
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

## `framework` — Numbered levels/stages
```typescript
{
  type: 'framework',
  sectionLabel?: string,
  heading: string,
  description?: string,
  layout?: 'vertical' | 'horizontal',  // Default: 'vertical' (stacked). 'horizontal' = left-to-right chevrons (best for 3 short stages)
  levels: FrameworkLevel[],          // { level: number, title, badge?, description, details?: { whenToUse?, risk?, outcome?, characteristics?: string[], messaging?, implications?: string[], caseStudy? } }
  insightBox?: { label, text },
}
```

**Horizontal chevron layout** (`layout: 'horizontal'`):
- Renders stages as left-to-right arrow-shaped chevrons in a single row
- Best for 3 stages (up to 4 if very short); more stages will be cramped
- Keep each level's `title` short (≤ 5 words), `description` tight (~25 words)
- Only the `details.outcome` field renders in horizontal mode — `whenToUse` / `risk` are hidden to conserve space
- Does **not** split across pages in PDF export — the whole row must fit on one page

## `metrics` — KPI display cards
```typescript
{
  type: 'metrics',
  sectionLabel?: string,
  heading: string,
  description?: string,
  kpis: KPIItem[],                   // { icon?, title, metric, target: string | string[], marketAnchor? }
}
```

## `case-study` — Case study with metrics
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

## `sources` — Citations/references
```typescript
{
  type: 'sources',
  sectionLabel?: string,
  heading: string,
  sections: SourcesSection[],        // { title, startNumber?, items: Array<{ text, url? }> }
}
```

## `table` — Data tables
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

## `custom` — Custom component (last resort)
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
