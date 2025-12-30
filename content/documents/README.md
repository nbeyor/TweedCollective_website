# Document Content Architecture

## Overview

This directory contains pure data representations of slide presentations. The architecture separates **content** (what to display) from **visual specifications** (how to display it), making it easy to maintain consistent styling across all documents while keeping content files clean and focused.

## Architecture Principles

### 1. Separation of Concerns

- **Content files** (`*.ts`) contain only the data and copy
- **Visual templates** (`/lib/slideTemplates.ts`) define all styling, colors, fonts, spacing
- **Rendering components** (in `/components`) combine content + templates to produce the final UI

### 2. Single Source of Truth

- All colors, fonts, spacing values are defined once in `/lib/slideTemplates.ts`
- Icons are referenced by semantic names that map to actual Lucide icons
- Slide types have centralized visual specifications

### 3. Easy Global Updates

- Want to change the primary color? Update it once in `slideTemplates.ts`
- Need to adjust font sizes? Change the typography scale in one place
- All documents automatically inherit the updates

## File Structure

```
content/documents/
├── README.md                        # This file - architecture documentation
├── index.ts                         # Document registry
├── health-tech-market.ts            # Example: Health-tech market analysis
├── salmon-ai-genomics.ts            # Example: Salmon AI genomics strategy
└── vibe-coding.ts                   # Example: VIBE coding analysis

lib/
└── slideTemplates.ts                # Central visual template configuration
```

## How to Create a New Document

### Step 1: Import the Template Utilities

```typescript
import { SlideData } from '@/lib/types'
import { getIcon } from '@/lib/slideTemplates'

export const DOCUMENT_ID = 'your-document-id'
```

### Step 2: Use Semantic Icon Names

Instead of hardcoding Lucide icon names:

```typescript
// ❌ Old way - hardcoded icon names
{
  icon: 'TrendingUp',
  title: 'Growth Strategy'
}

// ✅ New way - semantic icon names
{
  icon: getIcon('growth'),
  title: 'Growth Strategy'
}
```

**Available semantic icon names:**

- **Technology:** `'code'`, `'api'`, `'database'`, `'cloud'`, `'server'`, `'ai'`, `'automation'`
- **Business:** `'strategy'`, `'growth'`, `'decline'`, `'chart'`, `'metrics'`, `'money'`, `'briefcase'`
- **Science:** `'dna'`, `'health'`, `'medical'`, `'lab'`, `'shield'`
- **Users:** `'user'`, `'users'`, `'team'`, `'person'`
- **Status:** `'check'`, `'cross'`, `'warning'`, `'info'`
- **Time:** `'clock'`, `'timer'`, `'calendar'`, `'rocket'`, `'sprout'`

See `/lib/slideTemplates.ts` for the complete icon registry.

### Step 3: Don't Specify Colors or Visual Details

The templates handle all visual styling automatically:

```typescript
// ❌ Old way - inline color specifications
{
  title: 'Key Insight',
  icon: 'Zap',
  color: 'purple',  // Don't do this!
  items: [...]
}

// ✅ New way - let templates handle colors
{
  title: 'Key Insight',
  icon: getIcon('automation'),
  items: [...]
}
```

### Step 4: Focus on Content

Your content files should only contain:

- **Text:** Headlines, descriptions, body copy, bullet points
- **Data:** Numbers, metrics, labels
- **Structure:** Slide types, layout hints (columns: 2, 3, or 4)
- **Semantic hints:** Icon names, variant types ('positive', 'negative', 'neutral')

**Example:**

```typescript
export const slides: SlideData[] = [
  {
    id: 'title',
    title: 'Title',
    type: 'title',
    content: {
      type: 'title',
      badge: 'Market Research',
      headline: 'Your Document Title',
      subtitle: 'A compelling subtitle that explains the context',
      insightBox: {
        label: 'Key Insight',
        text: 'Why this matters to your audience',
      },
    },
  },
  {
    id: 'overview',
    title: 'Overview',
    type: 'grid',
    content: {
      type: 'grid',
      sectionLabel: 'Section 01',
      heading: 'Market Overview',
      columns: 3,
      items: [
        {
          title: 'Market Size',
          icon: getIcon('chart'),
          description: '$456B projected by 2030',
        },
        {
          title: 'Growth Rate',
          icon: getIcon('growth'),
          description: '17.3% CAGR 2024-2030',
        },
        {
          title: 'Active Players',
          icon: getIcon('users'),
          description: '1,200+ startups globally',
        },
      ],
    },
  },
]
```

## Visual Template System

All visual specifications are managed in `/lib/slideTemplates.ts`:

### Color System

Predefined color palettes with semantic mappings:

- **Sage:** Primary brand color
- **Taupe:** Secondary/neutral warm tones
- **Gold:** Accent/highlight color
- **Purple:** Feature/emphasis color
- **Green:** Success/positive states
- **Red:** Error/negative states

### Typography System

Consistent font sizing, weights, and line heights:

- **Font sizes:** From `xs` (12px) to `7xl` (72px)
- **Presets:** `slideTitle`, `slideHeading`, `cardTitle`, `body`, `badge`, etc.
- **Line heights:** `tight`, `normal`, `relaxed`

### Spacing System

Base 4px spacing unit with consistent values:

- **Layout spacing:** `slideInner`, `cardGap`, `sectionGap`
- **Element spacing:** `elementGap`, `tightGap`

### Slide Type Templates

Each slide type has a complete visual specification:

- `title` - Title slide with badge, headline, subtitle, insight box
- `grid` - Grid of cards with configurable columns (2, 3, or 4)
- `comparison` - Two-column comparison (before/after, pros/cons)
- `timeline` - Vertical timeline with dates and milestones
- `metrics` - KPI display with icons and targets
- `framework` - Framework/process display with numbered levels
- `case-study` - Case study with metrics and insights
- `sources` - Citations and references

## Updating Global Styles

To update visual styling across all documents:

1. **Open** `/lib/slideTemplates.ts`
2. **Find** the relevant section:
   - Colors: `colors` object
   - Typography: `typography` and `typographyPresets` objects
   - Spacing: `spacing` and `layoutSpacing` objects
   - Slide templates: `slideTypeTemplates` object
3. **Update** the values
4. **Save** - all documents automatically inherit the changes

### Example: Changing Primary Color

```typescript
// In lib/slideTemplates.ts
export const colors = {
  sage: {
    // Update these values to change the primary color
    500: '#6b7556',  // Main brand color
    600: '#535d43',  // Hover/active state
    // ...
  },
  // ...
}
```

### Example: Adjusting Typography

```typescript
// In lib/slideTemplates.ts
export const typographyPresets = {
  slideHeading: {
    fontSize: typography.sizes['4xl'],  // Change to '5xl' for larger headings
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  // ...
}
```

## Best Practices

### ✅ Do

- Use semantic icon names via `getIcon()`
- Add descriptive comments about the content purpose
- Keep data objects organized and well-named
- Use TypeScript types from `/lib/types.ts`
- Focus on clear, concise copy in your content

### ❌ Don't

- Hardcode Lucide icon names directly
- Add inline color specifications
- Specify font sizes, weights, or spacing
- Mix visual specifications with content
- Create one-off styling that can't be reused

## Migration Guide

To update an existing document to use the new template system:

1. **Add the import:**
   ```typescript
   import { getIcon } from '@/lib/slideTemplates'
   ```

2. **Replace icon names:**
   ```typescript
   // Before
   icon: 'TrendingUp'

   // After
   icon: getIcon('growth')
   ```

3. **Remove color specifications:**
   ```typescript
   // Before
   {
     title: 'Insight',
     icon: 'Zap',
     color: 'purple',  // Remove this
   }

   // After
   {
     title: 'Insight',
     icon: getIcon('automation'),
   }
   ```

4. **Add documentation comments:**
   ```typescript
   // NOTE: Visual specifications managed in lib/slideTemplates.ts
   // Icons use semantic names from the icon registry
   ```

## Troubleshooting

### Icon not displaying?

- Check that the semantic name exists in `iconRegistry` in `/lib/slideTemplates.ts`
- Verify you're using `getIcon('name')` not just `'name'`

### Colors look wrong?

- The rendering components apply colors based on slide type
- Check `slideTypeTemplates` for the slide type you're using
- Colors are intentionally NOT specified in content files

### Need a new icon?

Add it to the `iconRegistry` in `/lib/slideTemplates.ts`:

```typescript
export const iconRegistry = {
  // ...existing icons
  'your-semantic-name': 'LucideIconName',
}
```

### Need to customize spacing for one slide?

Avoid one-off customizations. Instead:

1. Consider if this should be a new slide type template
2. Add the pattern to `slideTypeTemplates` for reuse
3. Update rendering components to support the new pattern

## Related Files

- **Types:** `/lib/types.ts` - TypeScript interfaces for all slide content types
- **Templates:** `/lib/slideTemplates.ts` - Visual specifications and design system
- **Components:** `/components/slides/` - Rendering components that combine content + templates
- **Registry:** `/content/documents/index.ts` - Document metadata and configuration

## Questions?

For questions about the architecture or how to use the template system, refer to:

- This README
- Inline comments in `/lib/slideTemplates.ts`
- Example documents: `health-tech-market.ts`, `salmon-ai-genomics.ts`
