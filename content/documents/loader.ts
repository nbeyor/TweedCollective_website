/**
 * Document Content Loader
 *
 * Dynamic import map for document content files. Each entry maps a document ID
 * to a lazy loader that fetches the content only when needed.
 *
 * When adding a new document:
 * 1. Create the content file in content/documents/{document-id}.ts
 * 2. Add an entry to the contentLoaders map below
 * 3. Add the document config to content/documents/index.ts
 */

import type { SlideData } from '@/lib/types'

type ContentModule = { slides: SlideData[]; default: SlideData[] }

const contentLoaders: Record<string, () => Promise<ContentModule>> = {
  'vibe-coding-in-enterprise-for-pe': () => import('./vibe-coding') as Promise<ContentModule>,
  'health-tech-market-2024': () => import('./health-tech-market') as Promise<ContentModule>,
  'salmon-ai-genomics': () => import('./salmon-ai-genomics') as Promise<ContentModule>,
  'apollo-wcg-ai-diligence': () => import('./apollo-wcg-ai-diligence') as Promise<ContentModule>,
  'mercury-buyer-ai-diligence': () => import('./mercury-buyer-ai-diligence') as Promise<ContentModule>,
  'ai-opportunity-roadmap': () => import('./ai-opportunity-roadmap') as Promise<ContentModule>,
}

/**
 * Load document content by ID. Returns null if no content file exists.
 */
export async function loadDocumentContent(documentId: string): Promise<SlideData[] | null> {
  const loader = contentLoaders[documentId]
  if (!loader) return null
  const mod = await loader()
  return mod.slides || mod.default
}

/**
 * Check if a document has a content file registered
 */
export function hasContentFile(documentId: string): boolean {
  return documentId in contentLoaders
}

/**
 * Get all document IDs that have content files
 */
export function getContentDocumentIds(): string[] {
  return Object.keys(contentLoaders)
}
