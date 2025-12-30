/**
 * Slide Visual Templates & Design System
 *
 * Central configuration for all visual specifications, styling, and design tokens
 * used across slide presentations. This ensures consistency and makes global
 * visual updates manageable from a single location.
 */

// ============================================
// Color System
// ============================================

export const colors = {
  // Primary palette
  sage: {
    50: '#f6f7f4',
    100: '#e3e6dd',
    200: '#c7ccba',
    300: '#a5ad90',
    400: '#86906d',
    500: '#6b7556',
    600: '#535d43',
    700: '#424936',
    800: '#363d2e',
    900: '#2e3428',
  },

  taupe: {
    50: '#f9f8f7',
    100: '#f0edea',
    200: '#e3ddd6',
    300: '#cfc4b9',
    400: '#b8a899',
    500: '#a08e7e',
    600: '#8a7969',
    700: '#726357',
    800: '#5f534a',
    900: '#51473f',
  },

  gold: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
  },

  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Neutral palette
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const

// Color mappings for semantic use
export const semanticColors = {
  background: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    card: 'white',
    accent: colors.sage[50],
  },

  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[700],
    muted: colors.neutral[500],
    inverse: 'white',
  },

  border: {
    default: colors.neutral[200],
    muted: colors.neutral[100],
    accent: colors.sage[300],
  },

  status: {
    positive: colors.green[600],
    negative: colors.red[600],
    neutral: colors.neutral[600],
  },
} as const

// ============================================
// Typography System
// ============================================

export const typography = {
  // Font families
  fonts: {
    heading: 'var(--font-inter)',
    body: 'var(--font-inter)',
    mono: 'var(--font-mono)',
  },

  // Font sizes (in rem)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// Typography presets for common use cases
export const typographyPresets = {
  slideTitle: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },

  slideHeading: {
    fontSize: typography.sizes['4xl'],
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },

  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },

  cardTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },

  body: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
  },

  badge: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
  },

  metric: {
    fontSize: typography.sizes['6xl'],
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.tight,
  },

  metricLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.normal,
  },
} as const

// ============================================
// Spacing System
// ============================================

export const spacing = {
  // Base spacing unit: 4px
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const

// Layout spacing presets
export const layoutSpacing = {
  slideInner: spacing[12],       // Padding inside slides
  cardGap: spacing[6],          // Gap between cards in grids
  sectionGap: spacing[8],       // Gap between sections
  elementGap: spacing[4],       // Gap between related elements
  tightGap: spacing[2],         // Gap for tightly related items
} as const

// ============================================
// Icon System
// ============================================

/**
 * Icon registry mapping semantic names to Lucide icon names
 * This provides a layer of abstraction between content and implementation
 */
export const iconRegistry = {
  // Technology & Development
  'code': 'Code2',
  'api': 'Webhook',
  'database': 'Database',
  'cloud': 'Cloud',
  'server': 'Server',
  'ai': 'Brain',
  'automation': 'Zap',

  // Business & Strategy
  'strategy': 'Target',
  'growth': 'TrendingUp',
  'decline': 'TrendingDown',
  'chart': 'BarChart3',
  'metrics': 'LineChart',
  'money': 'DollarSign',
  'briefcase': 'Briefcase',

  // Science & Health
  'dna': 'Dna',
  'health': 'Heart',
  'medical': 'Stethoscope',
  'lab': 'FlaskConical',
  'shield': 'Shield',

  // Users & Teams
  'user': 'User',
  'users': 'Users',
  'team': 'Users',
  'person': 'UserCog',

  // Actions & Status
  'check': 'Check',
  'cross': 'X',
  'warning': 'AlertTriangle',
  'alert': 'AlertTriangle',
  'info': 'Info',
  'settings': 'Settings',
  'edit': 'Edit',
  'delete': 'Trash2',
  'cpu': 'Cpu',
  'map': 'Map',
  'lock': 'Lock',

  // Navigation & UI
  'arrow-right': 'ArrowRight',
  'arrow-up': 'ArrowUp',
  'external': 'ExternalLink',
  'download': 'Download',
  'upload': 'Upload',

  // Time & Progress
  'clock': 'Clock',
  'timer': 'Timer',
  'calendar': 'Calendar',
  'rocket': 'Rocket',
  'sprout': 'Sprout',

  // Communication
  'mail': 'Mail',
  'message': 'MessageSquare',
  'bell': 'Bell',

  // Commerce
  'cart': 'ShoppingCart',
  'package': 'Package',

  // Other
  'eye': 'Eye',
  'lock': 'Lock',
  'unlock': 'Unlock',
  'workflow': 'Workflow',
  'graduation': 'GraduationCap',
} as const

// ============================================
// Slide Type Templates
// ============================================

/**
 * Visual specifications for each slide type
 * These define the default appearance and behavior
 */
export const slideTypeTemplates = {
  title: {
    layout: 'centered',
    background: colors.neutral[50],
    badge: {
      background: colors.sage[100],
      text: colors.sage[700],
      borderRadius: '0.5rem',
      padding: `${spacing[2]} ${spacing[4]}`,
    },
    headline: {
      ...typographyPresets.slideTitle,
      color: colors.neutral[900],
      marginTop: spacing[4],
    },
    subtitle: {
      ...typographyPresets.body,
      color: colors.neutral[600],
      marginTop: spacing[4],
    },
    insightBox: {
      background: colors.sage[50],
      border: `1px solid ${colors.sage[200]}`,
      borderRadius: '0.75rem',
      padding: spacing[6],
      marginTop: spacing[8],
    },
    metrics: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: spacing[6],
      marginTop: spacing[8],
    },
  },

  grid: {
    layout: 'standard',
    sectionLabel: {
      ...typographyPresets.sectionLabel,
      color: colors.sage[700],
    },
    heading: {
      ...typographyPresets.slideHeading,
      color: colors.neutral[900],
      marginTop: spacing[2],
    },
    description: {
      ...typographyPresets.body,
      color: colors.neutral[600],
      marginTop: spacing[3],
    },
    grid: {
      display: 'grid',
      gap: layoutSpacing.cardGap,
      marginTop: spacing[8],
    },
    card: {
      background: 'white',
      border: `1px solid ${colors.neutral[200]}`,
      borderRadius: '0.75rem',
      padding: spacing[6],
      transition: 'all 0.2s ease',
      hover: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transform: 'translateY(-2px)',
      },
    },
    cardIcon: {
      width: '2rem',
      height: '2rem',
      marginBottom: spacing[3],
    },
    cardTitle: {
      ...typographyPresets.cardTitle,
      color: colors.neutral[900],
    },
    cardDescription: {
      ...typographyPresets.body,
      color: colors.neutral[600],
      marginTop: spacing[2],
    },
  },

  comparison: {
    layout: 'two-column',
    columns: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: spacing[8],
      marginTop: spacing[8],
    },
    column: {
      background: 'white',
      border: `2px solid`,
      borderRadius: '0.75rem',
      padding: spacing[6],
    },
    columnVariants: {
      positive: {
        borderColor: colors.green[300],
        background: colors.green[50],
      },
      negative: {
        borderColor: colors.red[300],
        background: colors.red[50],
      },
      neutral: {
        borderColor: colors.neutral[300],
        background: colors.neutral[50],
      },
    },
  },

  timeline: {
    layout: 'vertical',
    item: {
      borderLeft: `3px solid ${colors.sage[300]}`,
      paddingLeft: spacing[6],
      marginBottom: spacing[8],
    },
    itemActive: {
      borderColor: colors.sage[600],
    },
    date: {
      ...typographyPresets.badge,
      color: colors.sage[700],
    },
    title: {
      ...typographyPresets.cardTitle,
      color: colors.neutral[900],
      marginTop: spacing[2],
    },
  },

  metrics: {
    layout: 'standard',
    kpiCard: {
      background: 'white',
      border: `1px solid ${colors.neutral[200]}`,
      borderRadius: '0.75rem',
      padding: spacing[6],
      marginBottom: spacing[6],
    },
    kpiIcon: {
      width: '2.5rem',
      height: '2.5rem',
      color: colors.sage[600],
    },
    kpiTitle: {
      ...typographyPresets.cardTitle,
      color: colors.neutral[900],
      marginTop: spacing[3],
    },
  },

  framework: {
    layout: 'vertical',
    level: {
      background: 'white',
      border: `1px solid ${colors.neutral[200]}`,
      borderRadius: '0.75rem',
      padding: spacing[6],
      marginBottom: spacing[4],
    },
    levelNumber: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      background: colors.sage[100],
      color: colors.sage[700],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: typography.weights.bold,
    },
    badge: {
      ...typographyPresets.badge,
      background: colors.sage[100],
      color: colors.sage[700],
      padding: `${spacing[1]} ${spacing[3]}`,
      borderRadius: '0.5rem',
    },
  },

  caseStudy: {
    layout: 'standard',
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: spacing[6],
      marginBottom: spacing[8],
    },
    metricCard: {
      background: colors.sage[50],
      border: `1px solid ${colors.sage[200]}`,
      borderRadius: '0.75rem',
      padding: spacing[6],
      textAlign: 'center' as const,
    },
    metricValue: {
      ...typographyPresets.metric,
      color: colors.sage[700],
    },
    metricLabel: {
      ...typographyPresets.metricLabel,
      color: colors.neutral[700],
      marginTop: spacing[2],
    },
  },

  sources: {
    layout: 'standard',
    section: {
      marginBottom: spacing[8],
    },
    sectionTitle: {
      ...typographyPresets.cardTitle,
      color: colors.neutral[900],
      marginBottom: spacing[4],
    },
    list: {
      listStyle: 'decimal',
      paddingLeft: spacing[6],
    },
    listItem: {
      ...typographyPresets.body,
      color: colors.neutral[700],
      marginBottom: spacing[3],
    },
    link: {
      color: colors.sage[700],
      textDecoration: 'underline',
      hover: {
        color: colors.sage[800],
      },
    },
  },

  table: {
    layout: 'standard',
    sectionLabel: {
      ...typographyPresets.sectionLabel,
      color: colors.sage[700],
    },
    heading: {
      ...typographyPresets.slideHeading,
      color: colors.neutral[900],
      marginTop: spacing[2],
    },
    description: {
      ...typographyPresets.body,
      color: colors.neutral[600],
      marginTop: spacing[3],
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginTop: spacing[8],
    },
    thead: {
      borderBottom: `2px solid ${colors.sage[400]}`,
    },
    th: {
      textAlign: 'left' as const,
      padding: spacing[3],
      ...typographyPresets.cardTitle,
      fontSize: typography.sizes.base,
      color: colors.neutral[900],
      fontWeight: typography.weights.semibold,
    },
    tbody: {
      color: colors.neutral[700],
    },
    tr: {
      borderBottom: `1px solid ${colors.neutral[200]}`,
    },
    td: {
      padding: spacing[3],
      ...typographyPresets.body,
      fontSize: typography.sizes.sm,
      color: colors.neutral[700],
    },
    tdHighlight: {
      fontWeight: typography.weights.medium,
      color: colors.neutral[900],
    },
  },
} as const

// ============================================
// Component Presets
// ============================================

/**
 * Reusable component styles
 */
export const componentPresets = {
  insightBox: {
    background: colors.sage[50],
    border: `1px solid ${colors.sage[200]}`,
    borderRadius: '0.75rem',
    padding: spacing[6],
    label: {
      ...typographyPresets.badge,
      color: colors.sage[700],
      fontWeight: typography.weights.semibold,
    },
    text: {
      ...typographyPresets.body,
      color: colors.neutral[700],
      marginTop: spacing[2],
    },
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${spacing[1]} ${spacing[3]}`,
    borderRadius: '0.5rem',
    ...typographyPresets.badge,
  },

  card: {
    background: 'white',
    border: `1px solid ${colors.neutral[200]}`,
    borderRadius: '0.75rem',
    padding: spacing[6],
    transition: 'all 0.2s ease',
  },

  button: {
    primary: {
      background: colors.sage[600],
      color: 'white',
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: '0.5rem',
      fontWeight: typography.weights.medium,
      hover: {
        background: colors.sage[700],
      },
    },
    secondary: {
      background: 'white',
      color: colors.sage[700],
      border: `1px solid ${colors.sage[300]}`,
      padding: `${spacing[3]} ${spacing[6]}`,
      borderRadius: '0.5rem',
      fontWeight: typography.weights.medium,
      hover: {
        background: colors.sage[50],
      },
    },
  },
} as const

// ============================================
// Animation Presets
// ============================================

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },

  stagger: {
    staggerChildren: 0.1,
  },
} as const

// ============================================
// Utility Functions
// ============================================

/**
 * Get color value by color name and shade
 */
export function getColor(colorName: keyof typeof colors, shade: number = 500): string {
  const colorFamily = colors[colorName]
  if (!colorFamily) return colors.neutral[500]
  // @ts-expect-error - Dynamic shade access
  return colorFamily[shade] || colorFamily[500]
}

/**
 * Get icon name from semantic name
 */
export function getIcon(semanticName: keyof typeof iconRegistry): string {
  return iconRegistry[semanticName] || semanticName
}

/**
 * Get grid columns CSS based on column count
 */
export function getGridColumns(columns: 2 | 3 | 4 = 3): string {
  return `repeat(${columns}, 1fr)`
}

// ============================================
// Type Exports
// ============================================

export type ColorName = keyof typeof colors
export type IconName = keyof typeof iconRegistry
export type SlideTypeName = keyof typeof slideTypeTemplates
