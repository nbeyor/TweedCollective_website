/**
 * Document Registry - Single Source of Truth
 * 
 * All document metadata is defined here. Other parts of the codebase
 * (admin page, documents list, API routes) should import from this file.
 * 
 * When adding a new document:
 * 1. Add the document config to DOCUMENT_CONFIGS below
 * 2. Create the content file in content/documents/{document-id}.ts
 * 3. Create the page in app/documents/{document-id}/page.tsx
 */

import { DocumentConfig, DocumentMeta, DocumentVisibility } from '@/lib/types'
import { BarChart3, Code2, Dna, FileText, Settings, LucideIcon } from 'lucide-react'

// ============================================
// Document Configurations
// ============================================

/**
 * All document configurations as pure data
 * Icon is stored as a string key, resolved to component at runtime
 */
export const DOCUMENT_CONFIGS: DocumentConfig[] = [
  {
    id: 'vibe-coding-in-enterprise-for-pe',
    title: 'The Evolution of VIBE Coding in Enterprise - for PE Investors',
    shortTitle: 'VIBE Coding in Enterprise',
    description: 'How next-gen coding agents reshape product velocity, talent, and value creation in PE-backed companies.',
    category: 'Executive Briefing',
    icon: 'Code2',
    date: '2024-12',
    readTime: '25 min',
    visibility: 'listed',
  },
  {
    id: 'health-tech-market-2024',
    title: 'Health-Tech Market Landscape: Entering 2026',
    shortTitle: 'Health-Tech Market Landscape',
    description: 'Investment themes across stages (seed/venture/growth/buyout) and segments (pharmatech/provider-payor/consumer).',
    category: 'Market Research',
    icon: 'BarChart3',
    date: '2025-12',
    readTime: '20 min',
    visibility: 'listed',  // Changed from 'public' to 'listed' for email capture
  },
  {
    id: 'salmon-ai-genomics',
    title: 'Strategic AI for Salmon Genetic Improvement',
    shortTitle: 'Strategic AI for Salmon Genomics',
    description: 'Turn 2.5 generations of genomic+phenotypic data into a predictive asset; move from "records" → "moat."',
    category: 'Strategic Brief',
    icon: 'Dna',
    date: '2024-11',
    readTime: '30 min',
    visibility: 'unlisted',  // Private, only via direct link/invitation
  },
  {
    id: 'dashboard',
    title: 'Portfolio Dashboard',
    shortTitle: 'Dashboard',
    description: 'Interactive data dashboard with charts and analytics, refreshed from the latest data export.',
    category: 'Dashboard',
    icon: 'BarChart3',
    date: '2025-02',
    readTime: '5 min',
    visibility: 'listed',
  },
  {
    id: 'ai-integration-framework',
    title: 'AI Integration Framework',
    shortTitle: 'AI Integration Framework',
    description: 'A structured approach to integrating AI capabilities into enterprise workflows.',
    category: 'Framework',
    icon: 'Settings',
    date: '2024-10',
    readTime: '15 min',
    visibility: 'unlisted',  // Placeholder for future content
  },
  {
    id: 'internal-access',
    title: 'Internal Tools Access',
    shortTitle: 'Internal Tools Access',
    description: 'Permission to access internal tools and admin functionality.',
    category: 'Access',
    icon: 'Settings',
    date: '2024-01',
    readTime: '0 min',
    visibility: 'unlisted',  // Not a real document, just an access permission
  },
]

// ============================================
// Icon Mapping
// ============================================

/**
 * Map icon string names to actual Lucide components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Code2,
  Dna,
  FileText,
  Settings,
}

/**
 * Get icon component from string name
 */
export function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || FileText
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get all documents with resolved icon components
 */
export function getAllDocuments(): DocumentMeta[] {
  return DOCUMENT_CONFIGS.map(config => ({
    ...config,
    icon: getIconComponent(config.icon),
    href: `/documents/${config.id}`,
  }))
}

/**
 * Get documents filtered by visibility
 */
export function getDocumentsByVisibility(visibility: DocumentVisibility | DocumentVisibility[]): DocumentMeta[] {
  const visibilities = Array.isArray(visibility) ? visibility : [visibility]
  return getAllDocuments().filter(doc => visibilities.includes(doc.visibility))
}

/**
 * Get public and listed documents (for public documents page)
 */
export function getPublicDocuments(): DocumentMeta[] {
  return getDocumentsByVisibility(['public', 'listed'])
}

/**
 * Get a single document by ID
 */
export function getDocumentById(id: string): DocumentMeta | undefined {
  return getAllDocuments().find(doc => doc.id === id)
}

/**
 * Get document config by ID (without icon resolution)
 */
export function getDocumentConfigById(id: string): DocumentConfig | undefined {
  return DOCUMENT_CONFIGS.find(doc => doc.id === id)
}

/**
 * Get document title by ID (for email templates, etc.)
 */
export function getDocumentTitle(id: string): string {
  const doc = DOCUMENT_CONFIGS.find(d => d.id === id)
  return doc?.shortTitle || doc?.title || id
}

/**
 * Get all document IDs
 */
export function getAllDocumentIds(): string[] {
  return DOCUMENT_CONFIGS.map(doc => doc.id)
}

/**
 * Get documents for admin panel (all except internal-access placeholder)
 */
export function getAdminDocuments(): Array<{ id: string; title: string }> {
  return DOCUMENT_CONFIGS
    .filter(doc => doc.id !== 'internal-access')
    .map(doc => ({
      id: doc.id,
      title: doc.shortTitle,
    }))
}

/**
 * Get all grantable permissions (including internal-access)
 */
export function getGrantablePermissions(): Array<{ id: string; title: string }> {
  return DOCUMENT_CONFIGS.map(doc => ({
    id: doc.id,
    title: doc.shortTitle,
  }))
}

